// AIModeFreshnessLine — one-line evidence strip under any numeric claim.
// Usage: <AIModeFreshnessLine basis="214 sold listings" window="last 90 days" updated="12 min ago" />  → "Based on 214 sold listings · last 90 days · updated 12 min ago" (Caption 12/16, #707070). Tokens only.
(function () {
  const { Icon } = window.EBayEvoDesignSystem_61746e;
  function AIModeFreshnessLine({ basis, window: win, updated, style }) {
    const parts = [basis && "Based on " + basis, win, updated && "updated " + updated].filter(Boolean);
    return (
      <div style={{ display: "inline-flex", alignItems: "center", gap: 6, fontFamily: "var(--font-brand)", fontSize: 12, lineHeight: "16px", color: "var(--foreground-secondary,#707070)", ...style }}>
        <Icon name="Clock12" size={12} color="var(--foreground-secondary,#707070)" />
        <span>{parts.join(" · ")}</span>
      </div>
    );
  }
  Object.assign(window, { AIModeFreshnessLine });
})();
