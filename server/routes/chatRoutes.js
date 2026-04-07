const router = require('express').Router();
const Anthropic = require('@anthropic-ai/sdk');
const { protect } = require('../middleware/auth');

// Initialize Anthropic client with API key from .env
const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

/**
 * @swagger
 * tags:
 *   name: Chat
 *   description: AI health assistant powered by Anthropic Claude
 */

/**
 * @swagger
 * /api/chat:
 *   post:
 *     summary: Send a message to VitalMind AI (Claude)
 *     tags: [Chat]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [messages]
 *             properties:
 *               messages:
 *                 type: array
 *                 description: Conversation history
 *                 items:
 *                   type: object
 *                   properties:
 *                     role: { type: string, enum: [user, assistant] }
 *                     content: { type: string }
 *               userContext:
 *                 type: object
 *                 properties:
 *                   name: { type: string }
 *                   bloodGroup: { type: string }
 *     responses:
 *       200:
 *         description: AI response message
 *       500:
 *         description: API error
 */
router.post('/', protect, async (req, res) => {
  try {
    const { messages, userContext } = req.body;

    // Build system prompt with user context for personalized responses
    const systemPrompt = `You are VitalMind AI, a helpful and empathetic healthcare assistant for VitalMind.ai platform.
Patient details: Name: ${userContext?.name || 'User'}, Blood Group: ${userContext?.bloodGroup || 'Unknown'}.
Provide helpful, accurate health information. Always remind users to consult their doctor for actual medical decisions.
Keep responses concise and easy to understand.`;

    const response = await client.messages.create({
      model: 'claude-opus-4-6',
      max_tokens: 1024,
      system: systemPrompt,
      messages: messages.map(m => ({ role: m.role, content: m.content })),
    });

    res.json({ message: response.content[0].text });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;