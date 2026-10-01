// AIModeResultsPanel — right-side results surface (desktop: inline Panel-style column; mobile: BottomSheet) hosting the classic list/grid + FilterBar for whatever ToolCallCard was opened.
// Usage: <AIModeResultsPanel open title="9 active listings" subtitle="Sold-price check" filters={[...]} view onViewChange onClose mobile>{children}</AIModeResultsPanel> — Esc closes; children render below the FilterBar. Elevation shadow-200 (floating surface).
(function () {
  const { BottomSheet, FilterBar, SegmentedButton, IconButton, Icon } = window.EBayEvoDesignSystem_61746e;
  function AIModeResultsPanel({ open, onClose, title, subtitle, filters = [], selectedFilters = [], onToggleFilter, view = "list", onViewChange, showTools = true, mobile = false, width = 400, children, style }) {
    React.useEffect(() => {
      if (!open) return;
      const k = (e) => { if (e.key === "Escape" && onClose) onClose(); };
      window.addEventListener("keydown", k);
      return () => window.removeEventListener("keydown", k);
    }, [open, onClose]);
    const tools = showTools && (
      <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: 0 }}><FilterBar filters={filters} selected={selectedFilters} onToggle={onToggleFilter} size="small" /></div>
        <SegmentedButton size="small" value={view} onChange={onViewChange} items={[{ value: "list", label: <Icon name="ListView16" size={16} /> }, { value: "grid", label: <Icon name="GridView16" size={16} /> }]} />
      </div>
    );
    if (mobile) {
      return (
        <BottomSheet open={open} onClose={onClose} title={title}>
          <div style={{ display: "flex", flexDirection: "column", gap: 12, fontFamily: "var(--font-brand)", maxHeight: 520, overflowY: "auto" }}>
            {subtitle && <div style={{ fontSize: 12, lineHeight: "16px", color: "var(--foreground-secondary,#707070)" }}>{subtitle}</div>}
            {tools}
            {children}
          </div>
        </BottomSheet>
      );
    }
    if (!open) return null;
    return (
      <aside role="complementary" aria-label={typeof title === "string" ? title : "Results"} style={{ width: "100%", minWidth: 0, flex: "1 1 auto", background: "#fff", borderLeft: "1px solid var(--border-primary,#e5e5e5)", boxShadow: "var(--shadow-200,0 4px 12px rgba(0,0,0,.12))", display: "flex", flexDirection: "column", minHeight: 0, boxSizing: "border-box", fontFamily: "var(--font-brand)", animation: "aimPanelIn 240ms cubic-bezier(0.2,0,0,1) both", ...style }}>
        <style>{"@keyframes aimPanelIn{from{transform:translateX(24px);opacity:0}to{transform:translateX(0);opacity:1}}@media(prefers-reduced-motion:reduce){aside[role=complementary]{animation:none!important;transform:none!important}}"}</style>
        <header style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "16px 16px 12px", borderBottom: "1px solid var(--border-primary,#e5e5e5)" }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 16, lineHeight: "20px", fontWeight: 700, color: "var(--foreground-primary,#191919)" }}>{title}</div>
            {subtitle && <div style={{ fontSize: 12, lineHeight: "16px", color: "var(--foreground-secondary,#707070)", marginTop: 2 }}>{subtitle}</div>}
          </div>
          <IconButton aria-label="Close results" icon={<Icon name="Close24" size={20} />} size="small" onClick={onClose} />
        </header>
        <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 12, overflowY: "auto", flex: 1, minHeight: 0 }}>
          {tools}
          {children}
        </div>
      </aside>
    );
  }
  Object.assign(window, { AIModeResultsPanel });
})();
