// Reusable SVG logo component — used in navbar, sidebars, login, register
export default function Logo({ size = 32, white = false }) {
  const c1 = white ? '#fff' : '#667eea';
  const c2 = white ? 'rgba(255,255,255,0.7)' : '#764ba2';
  const gradId = `lg${size}${white ? 'w' : 'c'}`;
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={c1} />
          <stop offset="100%" stopColor={c2} />
        </linearGradient>
      </defs>
      {!white && <rect width="100" height="100" rx="22" fill={`url(#${gradId})`} />}
      {/* Cross / plus symbol */}
      <rect x="44" y={white ? 10 : 18} width="12" height={white ? 80 : 64} rx="6" fill="#fff" />
      <rect x={white ? 10 : 18} y="44" width={white ? 80 : 64} height="12" rx="6" fill="#fff" />
    </svg>
  );
}