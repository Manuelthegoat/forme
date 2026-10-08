import logo from "../assets/logo-transparent.png";

export default function Logo({ size = 34, className = "" }) {
  return (
    <img
      className={`logo-image ${className}`.trim()}
      src={logo}
      width={size}
      height={Math.round(size * 477 / 565)}
      alt="FORME"
      draggable="false"
    />
  );
}
