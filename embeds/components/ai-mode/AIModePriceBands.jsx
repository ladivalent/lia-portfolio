// AIModePriceBands — Budget / Typical / Premium band headers (range, sold count, LineChart sparkline of sold prices) over a 3-up product-card row.
// Usage: <AIModePriceBands bands={[{key,label,range,count,note,spark:number[]}]} renderRow={(band) => <cards/>} mobile />. Composes LineChart; row is a 3-col grid on desktop, AIModeCarousel on mobile.
(function () {
  const { LineChart, AIModeCarousel } = window.EBayEvoDesignSystem_61746e;
  function AIModePriceBands({ bands = [], renderRow, mobile = false, highlight = "typical", style }) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 20, fontFamily: "var(--font-brand)", ...style }}>
        {bands.map((b) => (
          <section key={b.key} aria-label={b.label + " band"} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <header style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", padding: "10px 14px", borderRadius: 12, background: "#fff", border: b.key === highlight ? "1.5px solid var(--foreground-primary,#191919)" : "1px solid var(--border-primary,#e5e5e5)" }}>
              <span style={{ fontSize: 16, lineHeight: "20px", fontWeight: 700, color: "var(--foreground-primary,#191919)", minWidth: 72 }}>{b.label}</span>
              <span style={{ fontSize: 16, lineHeight: "20px", fontWeight: 700 }}>{b.range}</span>
              <span style={{ fontSize: 12, lineHeight: "16px", color: "var(--foreground-secondary,#707070)" }}>{b.count} sold</span>
              <span style={{ flex: 1, fontSize: 12, lineHeight: "16px", color: "var(--foreground-secondary,#707070)", minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{b.note}</span>
              <span aria-label={"Sold prices trend for " + b.label} style={{ display: "inline-flex", flex: "none" }}><LineChart data={b.spark} width={96} height={24} strokeWidth={1.5} showDot={false} /></span>
            </header>
            {mobile ? <AIModeCarousel gap={12}>{renderRow(b)}</AIModeCarousel> : <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0,1fr))", gap: 8 }}>{renderRow(b)}</div>}
          </section>
        ))}
      </div>
    );
  }
  Object.assign(window, { AIModePriceBands });
})();
