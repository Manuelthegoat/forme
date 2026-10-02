import useReveal from "../hooks/useReveal";
import "./Reveal.css";

export default function Reveal({
  children,
  delay = 0,
  className = "",
  style,
  ...rest
}) {
  const [ref, visible] = useReveal();

  return (
    <div
      ref={ref}
      className={`reveal ${visible ? "reveal--in" : ""} ${className}`.trim()}
      style={{ ...style, transitionDelay: `${delay}ms` }}
      {...rest}
    >
      {children}
    </div>
  );
}