(function(){
// eBay marketplace web — shared chrome (top bar, search header, category nav, footer).
// Composes the design-system components from window.EBayEvoDesignSystem_61746e.
const DS = window.EBayEvoDesignSystem_61746e;
const { EBayLogo, Icon, Badge, IconButton } = DS;

function TopUtilityBar({ cartCount }) {
  const left = ["Daily Deals", "Brand Outlet", "Gift Cards", "Help & Contact"];
  const right = ["Sell", "Watchlist", "My eBay"];
  return (
    <div style={{ background: "var(--neutral-0)", borderBottom: "1px solid var(--border-primary)", fontSize: 11 }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "6px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", gap: 14, color: "var(--foreground-secondary)" }}>
          <span style={{ color: "var(--foreground-primary)", whiteSpace: "nowrap" }}>Hi <strong style={{ color: "var(--blue-500)" }}>Jordan!</strong></span>
          {left.map((l) => <a key={l} href="#" style={{ color: "var(--foreground-secondary)", textDecoration: "none" }}>{l}</a>)}
        </div>
        <div style={{ display: "flex", gap: 14, alignItems: "center", color: "var(--foreground-secondary)" }}>
          {right.map((l) => <a key={l} href="#" style={{ color: "var(--foreground-secondary)", textDecoration: "none" }}>{l}</a>)}
          <a href="#" style={{ display: "inline-flex", color: "var(--foreground-primary)" }}><Icon name="Notification24" size={18} /></a>
          <a href="#" style={{ position: "relative", display: "inline-flex", color: "var(--foreground-primary)" }}>
            <Icon name="Cart24" size={18} />
            {cartCount > 0 && <span style={{ position: "absolute", top: -6, right: -8 }}><Badge count={cartCount} /></span>}
          </a>
        </div>
      </div>
    </div>
  );
}

function SearchHeader({ query, onSearch, onLogo }) {
  const [val, setVal] = React.useState(query || "");
  React.useEffect(() => setVal(query || ""), [query]);
  const submit = () => onSearch && onSearch(val);
  return (
    <div style={{ background: "var(--neutral-0)" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "16px", display: "flex", alignItems: "center", gap: 16 }}>
        <button onClick={onLogo} style={{ border: "none", background: "none", cursor: "pointer", padding: 0 }}><EBayLogo style={{ width: 110 }} /></button>
        <button style={{ display: "inline-flex", alignItems: "center", gap: 4, border: "none", background: "none", cursor: "pointer", fontFamily: "var(--font-brand)", fontSize: 13, color: "var(--foreground-primary)", whiteSpace: "nowrap" }}>
          Shop by category <Icon name="ChevronDown16" size={14} />
        </button>
        <div style={{ flex: 1, display: "flex", alignItems: "center", height: 44, border: "2px solid var(--neutral-800)", borderRadius: "var(--radius-full)", overflow: "hidden", background: "#fff" }}>
          <span style={{ paddingLeft: 16, color: "var(--foreground-secondary)", display: "inline-flex" }}><Icon name="Search24" size={20} /></span>
          <input value={val} onChange={(e) => setVal(e.target.value)} onKeyDown={(e) => e.key === "Enter" && submit()}
            placeholder="Search for anything"
            style={{ flex: 1, border: "none", outline: "none", fontFamily: "var(--font-brand)", fontSize: 15, padding: "0 12px", background: "transparent" }} />
          <div style={{ width: 1, height: 24, background: "var(--border-primary)" }} />
          <select style={{ border: "none", outline: "none", fontFamily: "var(--font-brand)", fontSize: 13, color: "var(--foreground-secondary)", padding: "0 8px", background: "transparent", cursor: "pointer" }}>
            <option>All Categories</option><option>Electronics</option><option>Fashion</option>
          </select>
        </div>
        <button onClick={submit} style={{ height: 44, padding: "0 32px", border: "none", borderRadius: "var(--radius-full)", background: "var(--blue-500)", color: "#fff", fontFamily: "var(--font-brand)", fontSize: 16, fontWeight: 700, cursor: "pointer" }}>Search</button>
        <a href="#" style={{ fontSize: 12, color: "var(--blue-500)", textDecoration: "none", whiteSpace: "nowrap" }}>Advanced</a>
      </div>
    </div>
  );
}

function CategoryNav() {
  const cats = window.EBAY_DATA.categories;
  return (
    <div style={{ background: "var(--neutral-0)", borderBottom: "1px solid var(--border-primary)" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 16px", display: "flex", gap: 22, alignItems: "center", height: 40, overflowX: "auto", fontSize: 13 }}>
        {cats.map((c, i) => (
          <a key={c} href="#" style={{ display: "inline-flex", alignItems: "center", gap: 4, color: i === 0 ? "var(--foreground-primary)" : "var(--foreground-secondary)", textDecoration: "none", whiteSpace: "nowrap", fontWeight: i === 0 ? 700 : 400 }}>
            {i === 0 && <Icon name="Heart24" size={14} />}{c}
          </a>
        ))}
      </div>
    </div>
  );
}

function SiteHeader({ query, cartCount, onSearch, onLogo }) {
  return (
    <header style={{ position: "sticky", top: 0, zIndex: 20 }}>
      <TopUtilityBar cartCount={cartCount} />
      <SearchHeader query={query} onSearch={onSearch} onLogo={onLogo} />
      <CategoryNav />
    </header>
  );
}

function SiteFooter() {
  const cols = {
    "Buy": ["Registration", "eBay Money Back Guarantee", "Bidding & buying help", "Stores"],
    "Sell": ["Start selling", "Learn to sell", "Affiliates", "Seller Center"],
    "About eBay": ["Company info", "News", "Careers", "Investors"],
    "Help & Contact": ["Seller Center", "Contact us", "eBay Returns", "Security center"],
  };
  return (
    <footer style={{ background: "var(--neutral-0)", borderTop: "1px solid var(--border-primary)", marginTop: 48 }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 16px", display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 24, fontFamily: "var(--font-brand)" }}>
        {Object.entries(cols).map(([h, items]) => (
          <div key={h}>
            <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 12 }}>{h}</div>
            {items.map((it) => <div key={it} style={{ fontSize: 12, color: "var(--foreground-secondary)", marginBottom: 8 }}>{it}</div>)}
          </div>
        ))}
      </div>
      <div style={{ borderTop: "1px solid var(--border-primary)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "16px", display: "flex", alignItems: "center", gap: 16 }}>
          <EBayLogo style={{ width: 70 }} />
          <span style={{ fontSize: 11, color: "var(--foreground-tertiary)" }}>© 1995–2026 eBay Inc. · Accessibility · User Agreement · Privacy · Cookies</span>
        </div>
      </div>
    </footer>
  );
}

Object.assign(window, { SiteHeader, SiteFooter });

})();
