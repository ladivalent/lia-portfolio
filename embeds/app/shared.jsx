(function(){
// Shared: hash router, app state, desktop/mobile shells, ListingCard (AIModeProductCard variant with eBay item anatomy footer + action strip), dev state toggle.
const DS = window.EBayEvoDesignSystem_61746e;
const D = window.AIMODE_DATA;
const { TopNavBar, Tabs, Icon, IconButton, Badge, Button, BottomTabNav, Snackbar, AIModeProductCard, AgenticComposer, SegmentedButton, AgentStatusChip } = DS;

// ---- router: #/<stage>/<platform>
function parseHash() {
  const m = (location.hash || "").replace(/^#\/?/, "").split("/");
  return { stage: m[0] || "00", platform: m[1] === "mobile" ? "mobile" : "desktop" };
}
function useRoute() {
  const [r, setR] = React.useState(parseHash);
  React.useEffect(() => { const f = () => setR(parseHash()); window.addEventListener("hashchange", f); return () => window.removeEventListener("hashchange", f); }, []);
  return r;
}
function go(stage, platform) { const r = parseHash(); location.hash = "/" + stage + "/" + (platform || r.platform); }

// ---- app state (held across stages within a session)
const AppCtx = React.createContext(null);
const initialState = { mode: "deal-hunter", memoryChips: D.memory.slice(0, 2), forgotten: null, saved: [], alertSet: false, compare: [], panel: null, snackbar: null, offerStatus: "none", history: D.history, view: "list", filters: [] };
function AppProvider({ children }) {
  const [s, setS] = React.useState(initialState);
  const set = React.useCallback((patch) => setS((p) => ({ ...p, ...(typeof patch === "function" ? patch(p) : patch) })), []);
  React.useEffect(() => { if (!s.snackbar) return; const t = setTimeout(() => set({ snackbar: null }), 2600); return () => clearTimeout(t); }, [s.snackbar]);
  return <AppCtx.Provider value={{ s, set }}>{children}</AppCtx.Provider>;
}
const useApp = () => React.useContext(AppCtx);

// ---- small bits
function Thumb({ size = 16, style }) {
  return <span aria-hidden="true" style={{ width: size, height: size, borderRadius: size > 24 ? 8 : 3, background: "var(--neutral-100,#f7f7f7)", border: "1px solid var(--border-primary,#e5e5e5)", display: "inline-flex", alignItems: "center", justifyContent: "center", color: "var(--neutral-400,#8f8f8f)", flex: "none", boxSizing: "border-box", ...style }}>{size >= 24 && <Icon name={size >= 48 ? "Camera24" : "Camera16"} size={Math.round(size * 0.45)} />}</span>;
}
function ThumbStack({ count }) {
  const n = Math.min(count, 4);
  return (
    <span style={{ display: "inline-flex", alignItems: "center" }}>
      {Array.from({ length: n }).map((_, i) => <Thumb key={i} style={{ marginLeft: i ? -6 : 0, background: "#fff" }} />)}
      <span style={{ marginLeft: 6, fontSize: 12, lineHeight: "16px", color: "var(--foreground-secondary,#707070)" }}>{count} sources</span>
    </span>
  );
}
function SellerLine({ seller, style }) {
  const s = D.bySeller(seller);
  return <span style={{ fontSize: 12, lineHeight: "16px", color: "var(--foreground-secondary,#707070)", ...style }}>{s.name} ({s.feedback.toLocaleString()}) · {s.positive}% positive</span>;
}
function TrustBadges({ seller, small }) {
  const s = D.bySeller(seller);
  if (!s.trp) return null;
  return <span style={{ display: "inline-flex", gap: 6, flexWrap: "wrap" }}><Badge tone="neutral" leadingIcon={<Icon name="TopRatedPlus16" size={14} />}>Top Rated Plus</Badge></span>;
}

// ---- ListingCard: AIModeProductCard (canonical product) + eBay item-anatomy footer + hover action strip (documented variant)
function ListingCard({ l, mobile, onOpen, onOffer, onCompare, compared, style }) {
  const { s, set } = useApp();
  const [hover, setHover] = React.useState(false);
  const watched = s.saved.includes(l.id);
  const toggleWatch = () => set((p) => ({ saved: p.saved.includes(l.id) ? p.saved.filter((x) => x !== l.id) : [...p.saved, l.id], snackbar: p.saved.includes(l.id) ? "Removed from your list" : "Saved to your list" }));
  const showStrip = mobile || hover;
  const sellerObj = D.bySeller(l.seller);
  return (
    <div onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} onFocus={() => setHover(true)} onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) setHover(false); }}
      style={{ position: "relative", background: "#fff", border: compared ? "1.5px solid var(--blue-500,#0968f6)" : "1px solid var(--border-primary,#e5e5e5)", borderRadius: 16, overflow: "hidden", transform: hover && !mobile ? "translateY(-2px)" : "none", boxShadow: hover && !mobile ? "var(--shadow-100,0 1px 4px rgba(0,0,0,.1))" : "none", transition: "transform 160ms cubic-bezier(0.2,0,0,1), box-shadow 160ms", display: "flex", flexDirection: "column", minWidth: 0, width: mobile ? 240 : "auto", flex: "none", ...style }}>
      <div style={{ position: "relative", flex: "none" }}>
        <AIModeProductCard product={{ id: l.id, title: l.title, condition: l.cond + (l.shutter ? " · " + l.shutter.toLocaleString() + " shutter" : " · shutter not stated"), price: l.price, gradient: "#F7F7F7" }} width="100%" onOpen={() => onOpen && onOpen(l)} onWatch={toggleWatch} watched={watched} style={{ border: "none", borderRadius: 0, boxShadow: "none", transform: "none" }} className="aim-pc" />
        <div style={{ position: "absolute", top: 0, left: 0, width: "100%", aspectRatio: "1 / 1", display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none", color: "var(--neutral-400,#8f8f8f)" }}><Icon name="Camera64" size={56} /></div>
        {l.pick && <span style={{ position: "absolute", top: 8, left: 8 }}><Badge tone="accent" solid leadingIcon={<Icon name="AI16" size={12} />}>Agent pick</Badge></span>}
      </div>
      <span style={{ padding: "0 14px 12px", display: "flex", flexDirection: "column", gap: 4, fontFamily: "var(--font-brand)", fontSize: 12, lineHeight: "16px", minHeight: 76 }}>
        <span style={{ fontSize: 12, lineHeight: "16px", color: l.ship === 0 ? "var(--green-600,#288034)" : "var(--foreground-primary,#191919)" }}>{l.ship === 0 ? "Free shipping" : "+ $" + l.ship.toFixed(2) + " shipping"} · Est. delivery {l.delivery}</span>
        <SellerLine seller={l.seller} />
        <span style={{ fontSize: 12, lineHeight: "16px", color: sellerObj.returns === "No returns" ? "var(--red-600,#d50b0b)" : "var(--foreground-secondary,#707070)" }}>{sellerObj.returns}</span>
        <TrustBadges seller={l.seller} />
      </span>
      <div aria-label="Listing actions" className="aim-strip" style={{ display: "flex", flexDirection: "column", gap: 8, borderTop: showStrip ? "1px solid var(--border-primary,#e5e5e5)" : "none", background: "#fff", maxHeight: showStrip ? 120 : 0, opacity: showStrip ? 1 : 0, overflow: "hidden", transition: "max-height 160ms cubic-bezier(0.2,0,0,1), opacity 160ms", padding: showStrip ? "10px 12px 12px" : "0 12px" }}>
        <Button level="secondary" size="small" fullWidth onClick={() => onOffer && onOffer(l)}>Make an offer</Button>
        <div style={{ display: "grid", gridTemplateColumns: onCompare ? "repeat(3, minmax(0,1fr))" : "repeat(2, minmax(0,1fr))", gap: 4 }}>
          <IconButton aria-label="Add to cart" title="Add to cart" size="small" icon={<Icon name="CartAdd16" size={16} />} onClick={() => set({ snackbar: "Added to cart" })} style={{ margin: "0 auto" }} />
          <IconButton aria-label="Ask seller" title="Ask seller" size="small" icon={<Icon name="Chat16" size={16} />} onClick={() => set({ snackbar: "Message drafted — review it before sending" })} style={{ margin: "0 auto" }} />
          {onCompare && <IconButton aria-label={compared ? "Remove from compare" : "Compare"} title={compared ? "Comparing" : "Compare"} size="small" variant={compared ? "filled" : "standard"} icon={<Icon name={compared ? "Tick16" : "Swap16"} size={16} />} onClick={() => onCompare(l)} style={{ margin: "0 auto" }} />}
        </div>
      </div>
    </div>
  );
}

// ---- dev state toggle (sandbox only)
function StateToggle({ current, inline, compact }) {
  const items = [{ value: "03", label: compact ? "Load" : "Loading" }, { value: "07", label: compact ? "OK" : "Success" }, { value: "07-empty", label: "Empty" }, { value: "06-error", label: "Error" }, { value: "06-paused", label: "Paused" }];
  return (
    <div style={{ position: inline ? "static" : "absolute", top: 112, right: 24, zIndex: 30, display: "flex", alignItems: "center", gap: 8, padding: inline ? 4 : 6, maxWidth: "100%", overflowX: "auto", scrollbarWidth: "none", border: "1px dashed var(--neutral-400,#8f8f8f)", borderRadius: 999, background: "rgba(255,255,255,.96)", fontFamily: "ui-monospace, monospace", fontSize: 11, color: "var(--foreground-secondary,#707070)" }}>
      {!inline && <span style={{ paddingLeft: 6 }}>STATE</span>}
      <SegmentedButton size="small" value={current} onChange={(v) => go(v)} items={items} />
    </div>
  );
}

// ---- desktop shell: TopNavBar + AI Mode tab, icon rail, conversation column, results panel
function Rail({ expanded, stage }) {
  const { s } = useApp();
  const items = [
    { icon: expanded ? "PanelClose24" : "PanelOpen24", label: expanded ? "Collapse" : "Expand", act: () => go(expanded ? "07" : "12") },
    { icon: "Add24", label: "New", act: () => go("01") },
    { icon: "History24", label: "History", act: () => go("12"), on: stage === "12" },
    { icon: "Heart24", label: "Saved", act: () => go("12"), badge: s.saved.length },
    { icon: "Notification24", label: "Alerts", act: () => go("12"), badge: s.alertSet ? 1 : 0 },
  ];
  const btn = (it) => (
    <span key={it.label} style={{ position: "relative", display: "inline-flex", width: 40, height: 40, marginLeft: -1 }}>
      <IconButton aria-label={it.label} title={it.label} icon={<Icon name={it.icon} size={22} />} variant={it.on ? "filled" : "standard"} onClick={it.act} />
      {it.badge > 0 && <span style={{ position: "absolute", top: 2, right: 2 }}><Badge count={it.badge} /></span>}
    </span>
  );
  return (
    <nav aria-label="AI Mode" style={{ width: 56, flex: "none", borderRight: "1px solid var(--border-primary,#e5e5e5)", display: "flex", flexDirection: "column", alignItems: "center", gap: 8, padding: "12px 0", boxSizing: "border-box" }}>
      {items.map(btn)}
      <span style={{ flex: 1 }} />
      {btn({ icon: "Profile24", label: "Account", act: () => go("13"), on: stage === "13" })}
    </nav>
  );
}
function DesktopShell({ stage, children, panel, rail, composer, stateToggle, wide }) {
  const { s, set } = useApp();
  return (
    <div style={{ width: 1440, height: 1000, background: "#fff", display: "flex", flexDirection: "column", fontFamily: "var(--font-brand)", color: "var(--foreground-primary,#191919)", position: "relative", overflow: "hidden" }}>
      <TopNavBar rightLinks={["Ship to 10001", "Sell", "Watchlist", "My eBay"]} cartCount={0} onSearch={(q) => go("11")} onLogo={() => go("00")} />
      <div style={{ padding: "0 24px", borderBottom: "1px solid var(--border-primary,#e5e5e5)" }}>
        <Tabs value="ai" onChange={(v) => v === "shop" && go("11")} items={[{ value: "shop", label: "Shop" }, { value: "ai", label: "AI Mode", icon: <Icon name="AI16" size={16} /> }]} />
      </div>
      {stateToggle && <StateToggle current={stateToggle} />}
      <div style={{ flex: 1, display: "flex", minHeight: 0 }}>
        {rail || <Rail stage={stage} />}
        <main style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", minHeight: 0 }}>
          <div style={{ flex: 1, overflowY: "auto", minHeight: 0 }}>
            <div style={{ maxWidth: wide ? 1100 : 768, margin: 0, padding: "24px 24px 32px", display: "flex", flexDirection: "column", gap: 20, boxSizing: "border-box" }}>{children}</div>
          </div>
          {composer && <div style={{ padding: "8px 24px 16px", borderTop: "1px solid var(--border-primary,#e5e5e5)" }}><div style={{ maxWidth: 720, margin: 0, boxSizing: "border-box" }}>{composer}</div></div>}
        </main>
        {panel && <div style={{ flex: "none", width: 400, maxWidth: 400, display: "flex", minHeight: 0 }}>{panel}</div>}
      </div>
      {s.snackbar && <div style={{ position: "absolute", left: "50%", bottom: 24, transform: "translateX(-50%)", zIndex: 60 }}><Snackbar message={s.snackbar} onDismiss={() => set({ snackbar: null })} /></div>}
    </div>
  );
}

// ---- mobile shell: 390×844 phone frame, header, BottomTabNav
function MobileShell({ stage, children, sheet, composer, title = "AI Mode", stateToggle }) {
  const { s, set } = useApp();
  const tabs = [{ key: "home", label: "Home", icon: "Home24" }, { key: "ai", label: "AI Mode", icon: "AI24" }, { key: "saved", label: "Saved", icon: "Heart24" }, { key: "alerts", label: "Alerts", icon: "Notification24" }, { key: "me", label: "Me", icon: "Profile24" }];
  return (
    <div style={{ width: 390, height: 844, background: "#fff", borderRadius: 44, border: "10px solid #191919", boxSizing: "content-box", overflow: "hidden", position: "relative", display: "flex", flexDirection: "column", fontFamily: "var(--font-brand)", color: "var(--foreground-primary,#191919)" }}>
      <div style={{ height: 44, display: "flex", alignItems: "flex-end", justifyContent: "center", paddingBottom: 6, fontSize: 12, fontWeight: 700 }}>9:41</div>
      <header style={{ display: "flex", alignItems: "center", gap: 8, padding: "4px 8px 8px 12px", borderBottom: "1px solid var(--border-primary,#e5e5e5)" }}>
        <IconButton aria-label="History" icon={<Icon name="History24" size={22} />} onClick={() => go("12")} />
        <span style={{ flex: 1, display: "inline-flex", alignItems: "center", gap: 6, fontSize: 16, fontWeight: 700 }}><Icon name="AI24" size={20} color="var(--blue-500,#0968f6)" />{title}</span>
        <IconButton aria-label="New task" icon={<Icon name="Add24" size={22} />} onClick={() => go("01")} />
        <IconButton aria-label="Memory and settings" icon={<Icon name="Profile24" size={22} />} onClick={() => go("13")} />
      </header>
      {stateToggle && <div style={{ display: "flex", justifyContent: "center", padding: "8px 16px 0" }}><StateToggle current={stateToggle} inline compact /></div>}
      <div className="aim-scroll" style={{ flex: 1, overflowY: "auto", overflowX: "hidden", minHeight: 0, scrollbarWidth: "none" }}>
        <div style={{ padding: "16px 16px 24px", display: "flex", flexDirection: "column", gap: 16, minWidth: 0 }}>{children}</div>
      </div>
      {composer && <div style={{ padding: "8px 12px", borderTop: "1px solid var(--border-primary,#e5e5e5)" }}>{composer}</div>}
      <BottomTabNav tabs={tabs} active="ai" onChange={(k) => { if (k === "home") go("11"); if (k === "saved" || k === "alerts") go("12"); if (k === "me") go("13"); }} />
      {sheet}
      {s.snackbar && <div style={{ position: "absolute", left: 16, right: 16, bottom: 100, zIndex: 60 }}><Snackbar message={s.snackbar} onDismiss={() => set({ snackbar: null })} /></div>}
    </div>
  );
}

// follow-up composer used at the foot of conversation stages
function FollowUpComposer({ mobile }) {
  const [v, setV] = React.useState("");
  return <AgenticComposer value={v} onChange={setV} placeholder="Ask a follow-up or change the plan" onSubmit={() => { setV(""); go("03"); }} leftControls={<AgentStatusChip status="done">Deal Hunter</AgentStatusChip>} />;
}

Object.assign(window, { useRoute, go, AppProvider, useApp, Thumb, ThumbStack, SellerLine, TrustBadges, ListingCard, StateToggle, DesktopShell, MobileShell, Rail, FollowUpComposer });

})();
