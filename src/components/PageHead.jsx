import "./PageHead.css";

export default function PageHead({ title, note }) {
  return (
    <header className="wrap page-head">
      <h1 className="display page-head__title">{title}</h1>
      {note && <p className="hand page-head__note">{note}</p>}
    </header>
  );
}