export default function Placeholder({ bg, fg }) {
  return (
    <div className="placeholder" style={{ background: bg, color: fg }}>
      <svg
        viewBox="0 0 300 400"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <path
          d="M120 -10C122 40 112 70 98 105C84 150 104 175 108 215C112 260 70 310 62 410H238C230 310 188 260 192 215C196 175 216 150 202 105C188 70 178 40 180 -10Z"
          fill="currentColor"
        />
      </svg>
    </div>
  );
}