import Button from "./Button";
import "./SectionHead.css";

export default function SectionHead({ title, note, action }) {
  return (
    <div className="section-head">
      <div>
        <h2 className="display section-head__title">{title}</h2>
        {note && <p className="hand section-head__note">{note}</p>}
      </div>

      {action && (
        <Button to={action.to} variant="outline">
          {action.label}
        </Button>
      )}
    </div>
  );
}