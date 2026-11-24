// Quick Notes logo: timber notebook (spine, written lines, wood bookmark ribbon) + "QUICK NOTES" wordmark.
// Inline SVG instead of an <img src="logo.svg">, because only inline SVG can use the page's Cinzel web font.
// The same notebook mark is in public/favicon.svg for the browser tab.
function Logo({height = 40}: {height?: number}) {
  return (
    <svg viewBox="0 0 232 48" height={height} role="img" aria-label="Quick Notes" className="logo">
      <title>Quick Notes</title>
      {/* notebook */}
      <rect x="3" y="4" width="30" height="40" rx="4" fill="#7a4e2d" />
      <path d="M7 4h4v40H7a4 4 0 0 1-4-4V8a4 4 0 0 1 4-4z" fill="#5c3a20" />
      <path d="M16 18h11M16 25h11M16 32h7" stroke="#f8f3eb" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M24 4v9.5l2.75-2.2 2.75 2.2V4z" fill="#c49a6c" />
      {/* wordmark; textLength keeps it inside the box even if the font is still loading */}
      <text x="46" y="32.5" textLength="182" lengthAdjust="spacingAndGlyphs"
        fontFamily="Cinzel, Georgia, serif" fontWeight="700" fontSize="21" fill="#7a4e2d">
        QUICK NOTES
      </text>
    </svg>
  );
}
export default Logo;
