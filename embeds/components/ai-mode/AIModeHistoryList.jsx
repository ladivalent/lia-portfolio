// AIModeHistoryList — rail list of past tasks: intent title + AgentStatusChip + relative time.
// Usage: <AIModeHistoryList items={[{id,title,status,label,time}]} activeId onSelect /> — rows are 44px+ hit targets; active row gets the #F7F7F7 fill.
(function () {
  const { AgentStatusChip } = window.EBayEvoDesignSystem_61746e;
  function AIModeHistoryList({ items = [], activeId, onSelect, style }) {
    return (
      <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 2, fontFamily: "var(--font-brand)", ...style }}>
        {items.map((h) => (
          <li key={h.id}>
            <button type="button" onClick={() => onSelect && onSelect(h)} aria-current={h.id === activeId ? "true" : undefined}
              style={{ width: "100%", textAlign: "left", border: "none", cursor: "pointer", background: h.id === activeId ? "var(--neutral-100,#f7f7f7)" : "transparent", borderRadius: 12, padding: "10px 12px", display: "flex", flexDirection: "column", gap: 6, fontFamily: "inherit", minHeight: 44 }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "var(--neutral-100,#f7f7f7)")} onMouseLeave={(e) => (e.currentTarget.style.background = h.id === activeId ? "var(--neutral-100,#f7f7f7)" : "transparent")}>
              <span style={{ fontSize: 14, lineHeight: "20px", color: "var(--foreground-primary,#191919)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{h.title}</span>
              <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <AgentStatusChip status={h.status}>{h.label}</AgentStatusChip>
                <span style={{ fontSize: 12, lineHeight: "16px", color: "var(--foreground-secondary,#707070)" }}>{h.time}</span>
              </span>
            </button>
          </li>
        ))}
      </ul>
    );
  }
  Object.assign(window, { AIModeHistoryList });
})();
