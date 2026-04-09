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

    if (!messages || messages.length === 0) {
      return res.status(400).json({ message: 'Messages are required' });
    }

    // Build system prompt with user context for personalized responses
    const systemPrompt = `You are VitalMind AI, a helpful and empathetic healthcare assistant for VitalMind.ai platform.
Patient details: Name: ${userContext?.name || 'User'}, Blood Group: ${userContext?.bloodGroup || 'Unknown'}.
Provide helpful, accurate health information. Always remind users to consult their doctor for actual medical decisions.
Keep responses concise and easy to understand.`;

    console.log('📩 Chat request received:', { userId: req.user?.id, messagesCount: messages.length });

    const response = await client.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1024,
      system: systemPrompt,
      messages: messages.map(m => ({ role: m.role, content: m.content })),
    });

    console.log('✅ Chat response generated successfully');
    res.json({ message: response.content[0].text });
  } catch (err) {
    console.error('❌ Chat error:', err.message, err);
    res.status(500).json({ message: 'Chat failed: ' + err.message });
  }
});

module.exports = router;