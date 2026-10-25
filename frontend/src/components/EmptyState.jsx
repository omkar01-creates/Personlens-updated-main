import { Inbox } from "lucide-react";

function EmptyState({ icon: Icon = Inbox, title, text, action }) {
  return (
    <div className="empty" data-testid="empty-state">
      <div className="empty-icon">
        <Icon size={28} />
      </div>
      <h3 style={{ marginBottom: 6 }}>{title}</h3>
      {text && <p>{text}</p>}
      {action && <div className="mt-10">{action}</div>}
    </div>
  );
}

export default EmptyState;
