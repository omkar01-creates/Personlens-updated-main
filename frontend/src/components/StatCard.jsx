function StatCard({ icon: Icon, value, label, note, small, testId }) {
  return (
    <div className="stat-card fade-in" data-testid={testId}>
      <div className="stat-top">
        <div className="stat-icon">
          <Icon size={22} />
        </div>
      </div>
      <div className={"stat-value" + (small ? " small" : "")}>{value}</div>
      <div className="stat-label">{label}</div>
      {note && <div className="stat-note">{note}</div>}
    </div>
  );
}

export default StatCard;
