export default function Logo({ size = 34 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      role="img"
      aria-label="FORME"
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth="17"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M30 88V42Q30 24 48 22L84 14" />
        <path d="M33 55L76 48" />
      </g>
    </svg>
  );
}