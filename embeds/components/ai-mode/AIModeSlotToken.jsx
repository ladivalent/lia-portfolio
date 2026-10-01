// AIModeSlotToken — inline editable [slot] pill for template prompts inside the composer.
// Usage: <AIModeSlotToken label="date" value="" onChange={fn} /> — filled tokens fill near-black (selected-chip style); empty tokens show a blue dashed outline and are the "highlighted part". Tab moves between tokens.
(function () {
  function AIModeSlotToken({ label, value = "", onChange, autoFocus, style }) {
    const [editing, setEditing] = React.useState(!!autoFocus);
    const ref = React.useRef(null);
    React.useEffect(() => { if (editing && ref.current) ref.current.focus(); }, [editing]);
    const filled = value.trim().length > 0;
    const base = { display: "inline-flex", alignItems: "center", height: 28, padding: "0 10px", borderRadius: 999, fontFamily: "var(--font-brand)", fontSize: 14, lineHeight: "20px", fontWeight: 700, cursor: "text", verticalAlign: "middle", margin: "0 2px", boxSizing: "border-box" };
    const look = filled ? { background: "var(--foreground-primary,#191919)", color: "#fff", border: "1px solid var(--foreground-primary,#191919)" } : { background: "var(--blue-100,#eaf2ff)", color: "var(--blue-500,#0968f6)", border: "1.5px dashed var(--blue-500,#0968f6)" };
    if (editing) {
      return <input ref={ref} value={value} placeholder={label} aria-label={"Slot: " + label} onChange={(e) => onChange && onChange(e.target.value)} onBlur={() => setEditing(false)} onKeyDown={(e) => { if (e.key === "Enter" || e.key === "Escape") { e.preventDefault(); setEditing(false); } }}
        style={{ ...base, ...look, width: Math.max(72, (value.length || label.length) * 9 + 24), outline: "none", ...style }} />;
    }
    return (
      <button type="button" onClick={() => setEditing(true)} onFocus={() => setEditing(true)} aria-label={(filled ? label + ": " + value : "Fill in " + label)} style={{ ...base, ...look, ...style }}>
        {filled ? value : "[" + label + "]"}
      </button>
    );
  }
  Object.assign(window, { AIModeSlotToken });
})();
