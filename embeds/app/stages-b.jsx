(function(){
// Stages 07–13 + component index. Same canonical picks as stages-a.jsx.
const DS2 = window.EBayEvoDesignSystem_61746e;
const D2 = window.AIMODE_DATA;
const { AIModeAssistantTurn: Turn, AIModeUserBubble: Bubble, TurnGroup, RichResponseBlock, ToolCallCard, CitationChip, RecommendationCard, MatchConfidence, ComparisonTable, TradeoffCard, AIModeFeedback, AIDisclosure, GracefulFallback, SourceAttribution, Panel, BottomSheet, DryRunPreview, ConfirmationGate, UndoReceipt, AgentUndoBar, AgentStatusChip: StatusChip, AgentToolTrace: Trace, MemoryPanel, PrivacyIndicator, AutomationRules, NavigationPanel, AlertNotice, Button: Btn, Icon: Ic, Input: Inp, Textarea, AILabel: AIL, Avatar, LinkButton: Link, Badge: Bdg, AIModeDetailRail, AIModeCheckoutPanel, Card: Crd, ItemTile, Chip: Chp } = DS2;

const fmt = D2.fmt;
function Verdict() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <h2 style={{ margin: 0, fontSize: 20, lineHeight: "24px", fontWeight: 700 }}>Fair price right now is $640–$720 for a body under 50k shutter count.</h2>
      <AIModeFreshnessLine basis="214 sold listings" window="last 90 days" updated="12 min ago" />
    </div>
  );
}
function ViewDetails({ onClick, label = "View details" }) {
  return <span role="link" tabIndex={0} onClick={(e) => { e.stopPropagation(); onClick(); }} onKeyDown={(e) => { if (e.key === "Enter") { e.stopPropagation(); onClick(); } }} style={{ cursor: "pointer", fontSize: 13, color: "var(--blue-500,#0968f6)", textDecoration: "underline" }}>{label}</span>;
}
function WhyExpander({ seller }) {
  const [open, setOpen] = React.useState(false);
  const sObj = D2.bySeller(seller);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
        <MatchConfidence level={sObj.match[0] >= 5 ? "high" : "medium"} reason={`${sObj.match[0]} of ${sObj.match[1]} criteria`} />
        <Link size="small" onClick={() => setOpen(!open)}>{open ? "Hide" : "Why?"}</Link>
      </div>
      {open && (
        <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 4 }}>
          {sObj.criteria.map(([c, ok, ev]) => <li key={c} style={{ display: "flex", gap: 8, fontSize: 13, lineHeight: "18px" }}><Ic name={ok ? "Tick16" : "Close16"} size={14} color={ok ? "var(--green-600,#288034)" : "var(--red-600,#d50b0b)"} style={{ marginTop: 2, flex: "none" }} /><span><strong>{c}</strong> <span style={{ color: "var(--foreground-secondary,#707070)" }}>· {ev}</span></span></li>)}
        </ul>
      )}
      <div style={{ display: "flex", gap: 6 }}>{D2.listings.filter((l) => l.seller === seller).slice(0, 3).map((l) => <Thumb key={l.id} size={40} />)}{D2.listings.filter((l) => l.seller === seller).length < 3 && <Thumb size={40} />}</div>
    </div>
  );
}
function SellerRec({ seller, badge, tradeoff, reasons }) {
  const sObj = D2.bySeller(seller);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10, background: "#fff", border: "1px solid var(--border-primary,#e5e5e5)", borderRadius: 16, padding: 14, minWidth: 0, boxShadow: "none" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <Avatar initials={sObj.initials} color={sObj.color} size="medium" />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}><span style={{ fontWeight: 700, fontSize: 16, lineHeight: "20px" }}>{sObj.name}</span></div>
          <div style={{ fontSize: 12, lineHeight: "16px", color: "var(--foreground-secondary,#707070)" }}>{sObj.feedback.toLocaleString()} feedback · {sObj.positive}% positive · member since {sObj.since} · {sObj.location}</div>
        </div>
      </div>
      <RecommendationCard badge={badge} title={`${sObj.returns} · ships in ${sObj.ships}`} meta={sObj.trp ? "Top Rated Plus" : "Standard seller"} reasons={reasons} tradeoff={tradeoff} addLabel="Ask seller" onAdd={() => {}} onCompare={() => {}} style={{ maxWidth: "none", border: "none", padding: 0, boxShadow: "none" }} />
      <WhyExpander seller={seller} />
    </div>
  );
}
function AlertBox({ mobile, onDone }) {
  const [v, setV] = React.useState("$650");
  const body = (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <Inp label="Notify me when a matching body is listed under" value={v} onChange={(e) => setV(e.target.value)} helperText="Body only, under 50k shutter, returns accepted, ships to 10001" />
      <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}><Btn level="secondary" size="small" onClick={() => onDone(false)}>Cancel</Btn><Btn size="small" onClick={() => onDone(true)}>Notify me</Btn></div>
    </div>
  );
  if (mobile) return <BottomSheet open title="Set a price alert" onClose={() => onDone(false)}>{body}</BottomSheet>;
  return <Crd elevated padding={16} radius={16} style={{ background: "#fff", maxWidth: 420 }}>{body}</Crd>;
}
function AnswerPanel({ mobile }) {
  const { s, set } = useApp();
  const p = s.panel; if (!p) return null;
  const close = () => set({ panel: null });
  const l = p.id ? D2.listings.find((x) => x.id === p.id) : D2.listings[0];
  const sold = p.kind === "results" && p.tool === "sold";
  if (p.kind === "checkout") return mobile ? <BottomSheet open title="Checkout" onClose={close}><AIModeCheckoutPanel product={{ title: l.title, price: l.price, condition: l.cond, gradient: "#F7F7F7" }} shippingCost={l.ship} onClose={close} width="100%" /></BottomSheet> : <div style={{ width: 400, maxWidth: 400, flex: "none", borderLeft: "1px solid var(--border-primary,#e5e5e5)", boxShadow: "var(--shadow-200,0 4px 12px rgba(0,0,0,.12))", overflowY: "auto", overflowX: "hidden", minHeight: 0 }}><AIModeCheckoutPanel product={{ title: l.title, price: l.price, condition: l.cond, gradient: "#F7F7F7" }} shippingCost={l.ship} onClose={close} width={399} /></div>;
  if (p.kind === "detail") {
    const idx = D2.listings.indexOf(l);
    const rail = <AIModeDetailRail product={{ id: l.id, title: l.title, price: l.price, condition: l.cond, freeShipping: l.ship === 0, gradient: "#F7F7F7", gradients: ["#F7F7F7", "#EFEFEF", "#F7F7F7"], specs: { condition: l.cond + (l.shutter ? ", " + l.shutter.toLocaleString() + " shutter" : ""), year: 2014 } }} width={mobile ? 326 : 367} onClose={close} onPrev={() => set({ panel: { kind: "detail", id: D2.listings[(idx + 8) % 9].id } })} onNext={() => set({ panel: { kind: "detail", id: D2.listings[(idx + 1) % 9].id } })} onAddToCart={() => set({ snackbar: "Added to cart" })} onBuyNow={() => set({ panel: { kind: "checkout", id: l.id } })} onDiscussMore={() => set({ snackbar: "Listing attached to your next message" })} />;
    return <AIModeResultsPanel open onClose={close} title="Listing details" subtitle={`${l.seller} · ${D2.bySeller(l.seller).returns}`} showTools={false} mobile={mobile}>{rail}</AIModeResultsPanel>;
  }
  const items = sold ? D2.sources.filter((x) => x.status !== "active") : D2.listings;
  return (
    <AIModeResultsPanel open onClose={close} title={sold ? "214 sold listings" : "9 active listings"} subtitle={sold ? "Sold-price check · nikon d750 body · last 90 days" : "Seller check · 6 sellers"} filters={sold ? ["Under 50k shutter", "Body only", "Last 30 days"] : ["Under $700", "Returns accepted", "Free shipping", "Shutter < 50k"]} selectedFilters={s.filters} onToggleFilter={(k) => set((q) => ({ filters: q.filters.includes(k) ? q.filters.filter((x) => x !== k) : [...q.filters, k] }))} view={s.view} onViewChange={(v) => set({ view: v })} mobile={mobile}>
      {sold ? (
        <div style={{ display: "flex", flexDirection: "column" }}>{items.map((x) => <div key={x.id} style={{ display: "flex", gap: 12, alignItems: "center", padding: "10px 0", borderBottom: "1px solid var(--border-primary,#e5e5e5)" }}><Thumb size={48} /><div style={{ flex: 1, minWidth: 0 }}><div style={{ fontSize: 14, lineHeight: "20px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{x.title}</div><div style={{ fontSize: 12, color: "var(--foreground-secondary,#707070)" }}>{x.status} · {x.seller}</div></div><span style={{ fontWeight: 700 }}>{fmt(x.price)}</span></div>)}<AIModeFreshnessLine basis="214 sold listings" window="last 90 days" updated="12 min ago" style={{ marginTop: 10 }} /></div>
      ) : (
        <div style={{ display: s.view === "grid" ? "grid" : "flex", gridTemplateColumns: "repeat(2, minmax(0,1fr))", flexDirection: "column", gap: 12 }}>{items.map((x) => <ListingCard key={x.id} l={x} onOpen={(ll) => set({ panel: { kind: "detail", id: ll.id } })} onOffer={() => go("09")} />)}</div>
      )}
    </AIModeResultsPanel>
  );
}
function CompareTray({ onCompare }) {
  const { s, set } = useApp();
  if (!s.compare.length) return null;
  return (
    <div style={{ position: "sticky", bottom: 8, zIndex: 20, display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", background: "#fff", border: "1px solid var(--border-primary,#e5e5e5)", borderRadius: 16, boxShadow: "var(--shadow-300,0 8px 24px rgba(0,0,0,.16))" }}>
      <div style={{ display: "flex", gap: 6 }}>{s.compare.map((id) => <Thumb key={id} size={32} />)}</div>
      <span style={{ flex: 1, fontSize: 14 }}>{s.compare.length} of 3 selected</span>
      <Btn level="borderless" size="small" onClick={() => set({ compare: [] })}>Clear</Btn>
      <Btn size="small" disabled={s.compare.length < 3} onClick={onCompare}>Compare {s.compare.length}</Btn>
    </div>
  );
}
function Compare({ ids }) {
  const ls = ids.map((id) => D2.listings.find((l) => l.id === id));
  const rows = [
    { label: "Price", values: ls.map((l) => fmt(l.price)) },
    { label: "Condition", values: ls.map((l) => l.cond) },
    { label: "Shutter count", values: ls.map((l) => (l.shutter ? l.shutter.toLocaleString() : "Not stated")) },
    { label: "Shipping", values: ls.map((l) => (l.ship ? "$" + l.ship.toFixed(2) : "Free") + " · " + l.delivery) },
    { label: "Returns", values: ls.map((l) => D2.bySeller(l.seller).returns !== "No returns") },
    { label: "Seller rating", values: ls.map((l) => D2.bySeller(l.seller).positive + "% (" + D2.bySeller(l.seller).feedback.toLocaleString() + ")") },
  ];
  const pick = Math.max(0, ls.findIndex((l) => l.pick));
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <ComparisonTable products={ls.map((l) => ({ title: l.title.split(",")[0], price: fmt(l.price) }))} rows={rows} pickIndex={pick} pickLabel="Agent pick" pickReason="Lowest shutter count under $700 with free 30-day returns and delivery by Fri, Sep 19." style={{ maxWidth: "none" }} />
      <TradeoffCard options={[{ title: ls[0].title.split(",")[0] + " · " + D2.bySeller(ls[0].seller).name, price: fmt(ls[0].price), points: [{ text: (ls[0].shutter || 0).toLocaleString() + " shutter", good: true }, { text: D2.bySeller(ls[0].seller).returns, good: true }, { text: "Original box not listed", good: false }] }, { title: ls[1].title.split(",")[0] + " · " + D2.bySeller(ls[1].seller).name, price: fmt(ls[1].price), points: [{ text: "2 batteries included", good: true }, { text: (ls[1].shutter || 0).toLocaleString() + " shutter", good: false }, { text: "$34 more", good: false }] }]} lean="I'd take the first unless you want the spare battery." style={{ maxWidth: "none" }} />
    </div>
  );
}
const SUGGEST = ["Show only free returns", "Include kits with a lens", "Alert me under $640"];

// 07 — Answer (+ empty variant)
function Stage07({ mobile, empty }) {
  const { s, set } = useApp();
  const [alert, setAlert] = React.useState(false);
  const [showCompare, setShowCompare] = React.useState(false);
  const saved = s.saved.includes("answer");
  const toggleCompare = (l) => set((p) => ({ compare: p.compare.includes(l.id) ? p.compare.filter((x) => x !== l.id) : p.compare.length < 3 ? [...p.compare, l.id] : p.compare }));
  const row = (band) => D2.listings.filter((l) => l.band === band.key).map((l) => <ListingCard key={l.id} l={l} mobile={mobile} onOpen={(ll) => set({ panel: { kind: "detail", id: ll.id } })} onOffer={() => go("09")} onCompare={toggleCompare} compared={s.compare.includes(l.id)} />);
  const cite = (i) => <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}><CitationChip label="eBay sold · Sep 2" freshness="read 12 min ago" onOpen={() => go("08")} /><CitationChip label={"Item " + D2.listings[i].itemNo.slice(0, 4) + "…"} freshness="active" onOpen={() => set({ panel: { kind: "detail", id: D2.listings[i].id } })} /></div>;
  const compareIds = s.compare.length === 3 && showCompare ? s.compare : ["l1", "l2", "l3"];
  const finish = <AIModeFinishBar saved={saved} onSave={() => set((p) => ({ saved: saved ? p.saved.filter((x) => x !== "answer") : [...p.saved, "answer"], snackbar: saved ? "Removed from your list" : "Saved to your list" }))} onAlert={() => setAlert(true)} onFollowUp={() => set({ snackbar: "Type your follow-up in the composer below" })} />;
  return (
    <Shell mobile={mobile} stage="07" stateToggle={empty ? "07-empty" : "07"} panel={!mobile && <AnswerPanel mobile={false} />} sheet={mobile && <AnswerPanel mobile />} composer={<FollowUpComposer />}>
      <UserQuery />
      <Bubble><span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}><Ic name="Tick16" size={14} />Start the task — skip refurbished units</span></Bubble>
      <TurnGroup summary="Agent — planned 4 phases, ran 3 checks, read 38 sources" defaultOpen={false}>
        <Trace summary="How I found these" entries={D2.trace.map((t) => ({ icon: "Tick16", label: t.phase, meta: t.sources ? t.sources + " sources" : undefined }))} sourcesLabel="View all 38 sources" onSources={() => go("08")} style={{ maxWidth: "none", marginTop: 8 }} />
      </TurnGroup>
      {empty ? (
        <Turn intro="I searched every active Nikon D750 body listing. Nothing matches all of your criteria right now.">
          <GracefulFallback understood="I've got the what — a used D750 body under $700, under 50k shutter, returns accepted, to 10001 by Fri, Sep 19." question="Which one would you relax? The first relaxation adds the most matches." options={["Allow $750", "Include refurbished", "Ship the following week"]} onOption={() => go("07")} onSubmit={() => go("07")} placeholder="Or tell me what to change" />
          <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}><Btn level="secondary" size="small" onClick={() => setAlert(true)} leadingIcon={<Ic name="Notification16" size={16} />}>Set an alert</Btn><AIModeFreshnessLine basis="9 active listings checked" updated="just now" /></div>
          {alert && <AlertBox mobile={mobile} onDone={(ok) => { setAlert(false); if (ok) set({ alertSet: true, snackbar: "Alert set" }); }} />}
        </Turn>
      ) : (
        <Turn intro="Here's what I found." suggestions={SUGGEST} onSuggestion={() => go("03")} whySignals={["Ranking: shutter count, then price, then seller return policy", "Excluded: 3 refurbished units, 2 kits with lenses", "Memory used: ships to 10001, budget ≤ $700"]}>
          <Verdict />
          <RichResponseBlock type="key-value" title="What I searched for" pairs={[{ key: "Item", value: "Nikon D750, body only, used" }, { key: "Budget", value: "≤ $700 incl. shipping" }, { key: "Shutter count", value: "under 50,000" }, { key: "Seller", value: "accepts returns" }, { key: "Delivery", value: "to 10001 by Fri, Sep 19" }]} source="From your request and memory" style={{ maxWidth: "none" }} />
          <ToolCallCard icon="Graph16" tool="Sold-price check" summary={<span>nikon d750 body · <ViewDetails onClick={() => set({ panel: { kind: "results", tool: "sold" } })} /></span>} inputs={[{ key: "Query", value: "nikon d750 body" }, { key: "Window", value: "Last 90 days" }, { key: "Filter", value: "Body only, used, shutter stated" }]} result="214 sold · median $676 · 25th–75th percentile $640–$720" timestamp="12 min ago" style={{ maxWidth: "none" }} />
          <AIModePriceBands bands={D2.bands} renderRow={row} mobile={mobile} />
          {cite(0)}
          <ToolCallCard icon="ProfileCheck16" tool="Seller check" summary={<span>6 sellers · <ViewDetails onClick={() => set({ panel: { kind: "results", tool: "sellers" } })} /></span>} inputs={[{ key: "Checked", value: "Return policy, feedback %, handling time, delivery to 10001" }, { key: "Sellers", value: "6" }]} result="4 of 6 accept returns · 3 are Top Rated Plus · 1 can't deliver by Fri, Sep 19" timestamp="11 min ago" style={{ maxWidth: "none" }} />
          <p style={{ margin: 0, fontSize: 14, lineHeight: "20px" }}>Two sellers meet nearly every criterion. Both accept free 30-day returns and can deliver to 10001 by Friday.</p>
          <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "repeat(2, minmax(0,1fr))", gap: 12 }}>
            <SellerRec seller="camera_corner_nyc" badge="Best match" reasons={["Lowest shutter count under $700 (18,420)", "Free 30-day returns", "Ships next business day from New York"]} tradeoff="Original box not listed" />
            <SellerRec seller="lensloft_photo" badge="Runner-up" reasons={["99.8% positive over 5,842 ratings", "Two batteries included", "Same-day handling"]} tradeoff="$34 more and 31k shutter" />
          </div>
          {cite(1)}
          <Compare ids={compareIds} />
          <CompareTray onCompare={() => setShowCompare(true)} />
          {finish}
          {alert && <AlertBox mobile={mobile} onDone={(ok) => { setAlert(false); if (ok) set({ alertSet: true, snackbar: "Alert set" }); }} />}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <AIModeFeedback onSubmit={() => set({ snackbar: "Thanks for the feedback" })} />
            <AIDisclosure dataUsed={["eBay sold listings, last 90 days", "Active listings and seller feedback profiles", "Your memory: ships to 10001, budget ≤ $700"]} limitations="Shutter counts come from seller descriptions and photos. I can't verify them until the camera arrives." />
          </div>
        </Turn>
      )}
    </Shell>
  );
}

// 08 — Sources panel over Stage 7
function Stage08({ mobile }) {
  const list = (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <SourceAttribution sources={[{ label: "Sold prices", source: "eBay sold listings, 90 days" }, { label: "Seller data", source: "eBay feedback profiles" }, { label: "Delivery", source: "eBay shipping estimates to 10001" }]} updated="Updated 12 min ago" />
      <div>{D2.sources.map((x) => <div key={x.id} style={{ display: "flex", gap: 12, alignItems: "center", padding: "10px 0", borderBottom: "1px solid var(--border-primary,#e5e5e5)" }}><Thumb size={40} /><div style={{ flex: 1, minWidth: 0 }}><div style={{ fontSize: 14, lineHeight: "20px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{x.title}</div><div style={{ fontSize: 12, lineHeight: "16px", color: "var(--foreground-secondary,#707070)" }}>{x.status} · {x.seller}</div></div><span style={{ fontWeight: 700, fontSize: 14 }}>{fmt(x.price)}</span></div>)}</div>
    </div>
  );
  React.useEffect(() => { const k = (e) => e.key === "Escape" && go("07"); window.addEventListener("keydown", k); return () => window.removeEventListener("keydown", k); }, []);
  if (mobile) return <MobileShell stage="08" sheet={<BottomSheet open title="38 sources" onClose={() => go("07")}><div style={{ maxHeight: 520, overflowY: "auto" }}>{list}</div></BottomSheet>}><UserQuery /><Verdict /></MobileShell>;
  return (
    <div style={{ position: "relative", width: 1440, height: 1000 }}>
      <Stage07 mobile={false} />
      <Panel open title="38 sources" onClose={() => go("07")} width={420}>{list}</Panel>
    </div>
  );
}

// 09 — Draft offer
function Stage09({ mobile }) {
  const l = D2.listings[0]; const sObj = D2.bySeller(l.seller);
  const [amt, setAmt] = React.useState("$655");
  const [note, setNote] = React.useState("Hi — I'm looking for a D750 body under 20k shutter and yours is exactly that. Would you take $655 with shipping to 10001? I can pay today.");
  const [edit, setEdit] = React.useState(false);
  return (
    <Shell mobile={mobile} stage="09" composer={<FollowUpComposer />}>
      <UserQuery />
      <Bubble>Make an offer on the $655 body from camera_corner_nyc</Bubble>
      <Turn intro="Here's a draft Best Offer. Nothing is sent until you click Send offer.">
        <div style={{ display: "flex", gap: 12, alignItems: "center", padding: 12, background: "#fff", border: "1px solid var(--border-primary,#e5e5e5)", borderRadius: 12 }}><Thumb size={56} /><div style={{ flex: 1, minWidth: 0 }}><div style={{ fontSize: 14, lineHeight: "20px" }}>{l.title}</div><div style={{ fontSize: 12, color: "var(--foreground-secondary,#707070)" }}>Buy It Now {fmt(l.price)} · {sObj.name} ({sObj.feedback.toLocaleString()}) · {sObj.positive}% positive</div></div></div>
        <div className="aim-dry"><DryRunPreview title={"Best Offer to " + sObj.name} severity="external" impact={[{ label: amt + " offer" }, { label: "Binding if accepted", danger: true }, { label: "Expires in 48h" }]}
          diff={[
            { label: <span style={{ display: "inline-flex", gap: 8, alignItems: "center" }}>Offer amount <AIL size="small">AI-drafted</AIL></span>, detail: <div style={{ display: "block", maxWidth: "100%", width: mobile ? 200 : 340, whiteSpace: "normal" }}>{edit ? <Inp value={amt} onChange={(e) => setAmt(e.target.value)} helperText="Typical sold $680" aria-label="Offer amount" /> : <span><strong>{amt}</strong> <span style={{ color: "var(--foreground-secondary,#707070)" }}>· typical sold $680</span></span>}</div>, kind: "add" },
            { label: <span style={{ display: "inline-flex", gap: 8, alignItems: "center" }}>Note to seller <AIL size="small">AI-drafted</AIL></span>, detail: <div style={{ display: "block", maxWidth: "100%", width: mobile ? 200 : 340, whiteSpace: "normal", overflowWrap: "anywhere" }}>{edit ? <Textarea value={note} onChange={(e) => setNote(e.target.value)} rows={4} aria-label="Note to seller" style={{ width: "100%" }} /> : <span style={{ fontSize: 14, lineHeight: "20px" }}>{note}</span>}</div>, kind: "add" },
          ]}
          gate={<ConfirmationGate consequence={`Send ${amt} to ${sObj.name}? If they accept, you're committed to buy.`} friction="single-tap" approveLabel="Send offer" onApprove={() => go("10")} rejectLabel="Discard" onReject={() => go("07")} onWhy={() => {}} />}
          onEdit={() => setEdit(!edit)} style={{ maxWidth: "none", minWidth: 0 }} /></div>
        <div style={{ display: "flex", gap: 8 }}><Btn level="secondary" size="small" onClick={() => setEdit(!edit)} leadingIcon={<Ic name="Pencil16" size={16} />}>{edit ? "Done editing" : "Edit"}</Btn></div>
      </Turn>
    </Shell>
  );
}

// 10 — Offer sent
function Stage10({ mobile }) {
  const { s, set } = useApp();
  const [phase, setPhase] = React.useState("sent");
  const l = D2.listings[0];
  React.useEffect(() => { const t = setTimeout(() => setPhase("receipt"), 2000); return () => clearTimeout(t); }, []);
  const history = s.history.map((h, i) => (i === 0 ? { ...h, status: "needsApproval", label: "Offer pending", time: "Just now" } : h));
  return (
    <Shell mobile={mobile} stage="10" composer={<FollowUpComposer />}>
      <UserQuery />
      <Bubble>Make an offer on the $655 body from camera_corner_nyc</Bubble>
      <Turn intro={phase === "sent" ? "Sending your offer…" : "Your offer is with the seller. Most respond within a few hours."}>
        {phase === "sent" ? <Btn disabled leadingIcon={<Ic name="Tick16" size={16} />}>Offer sent</Btn> : <UndoReceipt action="Offer sent: $655 to camera_corner_nyc" authority="you approved" reversibility="undoable" window="30 seconds" seconds={29} undoLabel="Undo" onUndo={() => go("09")} />}
        <div style={{ display: "flex", flexDirection: "column", gap: 8, maxWidth: mobile ? "none" : 300 }}>
          <StatusChip status="needsApproval">Offer pending · expires in 47h</StatusChip>
          <ListingCard l={l} mobile={false} onOpen={() => set({ panel: { kind: "detail", id: l.id } })} />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, lineHeight: "16px", color: "var(--foreground-secondary,#707070)" }}><Ic name="MoneyBackGuarantee16" size={16} color="var(--green-600,#288034)" />If it's accepted, you're covered by the eBay Money Back Guarantee.</div>
        <div style={{ background: "#fff", border: "1px solid var(--border-primary,#e5e5e5)", borderRadius: 12, padding: 8 }}><div style={{ fontSize: 12, fontWeight: 700, color: "var(--foreground-secondary,#707070)", padding: "4px 12px" }}>Your tasks</div><AIModeHistoryList items={history} activeId="h1" onSelect={() => go("12")} /></div>
      </Turn>
      {phase === "receipt" && <div style={{ position: "sticky", bottom: 8, zIndex: 20 }}><AgentUndoBar message="Offer sent: $655 to camera_corner_nyc" seconds={29} undoLabel="Undo" onUndo={() => go("09")} /></div>}
    </Shell>
  );
}

// 11 — Classic search escape (marketplace_web template)
function Stage11({ mobile }) {
  const notice = <AlertNotice type="information" title="You came from AI Mode" action={<Btn level="tertiary" size="small" onClick={() => go("07")} leadingIcon={<Ic name="ArrowLeft16" size={16} />}>Back to conversation</Btn>}>Your conversation and plan are saved. The listings below are the classic results for “nikon d750 body used”.</AlertNotice>;
  if (mobile) {
    return (
      <MobileShell stage="11" title="Search">
        {notice}
        <div style={{ fontSize: 14 }}><strong>2,438 results</strong> for “nikon d750 body used”</div>
        <div style={{ display: "flex", gap: 8, overflowX: "auto" }}>{["All", "Buy It Now", "Best Offer", "Free shipping"].map((c, i) => <Chp key={c} selected={i === 0}>{c}</Chp>)}</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>{D2.listings.map((l) => <ItemTile key={l.id} image={D2.TILE} title={l.title} price={fmt(l.price)} condition={l.cond} shipping={l.ship ? "+ $" + l.ship.toFixed(2) + " shipping" : "Free shipping"} onClick={() => go("07")} />)}</div>
      </MobileShell>
    );
  }
  return (
    <div style={{ width: 1440, minHeight: 1000, background: "var(--neutral-100,#f7f7f7)", fontFamily: "var(--font-brand)" }}>
      <SiteHeader query="nikon d750 body used" cartCount={0} onSearch={() => {}} onLogo={() => go("00")} />
      <div style={{ maxWidth: 1280, margin: "16px auto 0", padding: "0 16px" }}>{notice}</div>
      <SearchScreen query="nikon d750 body used" onOpen={() => go("07")} />
    </div>
  );
}

// 12 — History (rail expanded)
function Stage12({ mobile }) {
  const { s } = useApp();
  const items = s.history.map((h, i) => (i === 0 ? { ...h, status: "needsApproval", label: "Offer pending", time: "Just now" } : h));
  const list = <AIModeHistoryList items={items} activeId="h1" onSelect={(h) => go(h.id === "h1" ? "10" : "07")} />;
  if (mobile) return <MobileShell stage="12" title="History"><div style={{ fontSize: 20, fontWeight: 700, lineHeight: "24px" }}>Your tasks</div>{list}<Btn level="secondary" fullWidth onClick={() => go("01")} leadingIcon={<Ic name="Add16" size={16} />}>New task</Btn></MobileShell>;
  const rail = <NavigationPanel width={300} header={<div style={{ padding: "8px 8px 0" }}><div style={{ display: "flex", alignItems: "center", gap: 8, padding: "4px 8px 12px" }}><span style={{ flex: 1, fontSize: 16, fontWeight: 700 }}>History</span><Btn level="secondary" size="small" onClick={() => go("01")} leadingIcon={<Ic name="Add16" size={14} />}>New</Btn><Btn level="borderless" size="small" aria-label="Collapse rail" onClick={() => go("07")}><Ic name="PanelClose24" size={20} /></Btn></div>{list}</div>} sections={[{ title: "Lists", items: [{ label: "Saved (" + s.saved.length + ")", icon: "Heart24", onClick: () => {} }, { label: "Alerts" + (s.alertSet ? " (1)" : ""), icon: "Notification24", onClick: () => {} }] }, { items: [{ label: "Memory and automation", icon: "Profile24", onClick: () => go("13") }] }]} style={{ flex: "none", borderRight: "1px solid var(--border-primary,#e5e5e5)", height: "100%", overflowY: "auto" }} />;
  return (
    <DesktopShell stage="12" rail={rail} composer={<FollowUpComposer />}>
      <UserQuery />
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}><StatusChip status="needsApproval">Offer pending · expires in 47h</StatusChip><span style={{ fontSize: 12, color: "var(--foreground-secondary,#707070)" }}>Price check · Nikon D750 · started 14 min ago</span></div>
      <Turn intro="Your $655 offer to camera_corner_nyc is pending. I'll let you know the moment they respond." suggestions={["Show the full answer", "Offer $640 to lensloft_photo too"]} onSuggestion={(x) => go(x.startsWith("Show") ? "07" : "09")}>
        <ListingCard l={D2.listings[0]} mobile={false} style={{ maxWidth: 300 }} />
      </Turn>
    </DesktopShell>
  );
}

// 13 — Memory hub
function Stage13({ mobile }) {
  const { s, set } = useApp();
  const [items, setItems] = React.useState(D2.memory);
  const [rules, setRules] = React.useState({ offers: false, bids: false, buys: false });
  const mem = <MemoryPanel title="What I remember" items={items} onForget={(id) => { setItems((p) => p.filter((m) => m.id !== id)); set({ snackbar: "Forgot it. Undo from the conversation if you change your mind." }); }} onReset={() => setItems([])} resetLabel="Forget everything" privacyNote="Memory is used only in AI Mode and never shared with sellers." onManage={() => {}} manageLabel="Privacy settings" style={{ maxWidth: "none" }} />;
  const priv = <PrivacyIndicator signals={[{ label: "Memory", on: items.length > 0 }, { label: "Location (10001)", on: true }, { label: "Purchase history", on: false }]} onManage={() => {}} manageLabel="Manage" />;
  const auto = <AutomationRules rules={[{ id: "offers", icon: "Dollar16", title: "Send Best Offers", description: "Ask every time. I draft, you click Send offer.", enabled: rules.offers, limit: "Up to $700 without asking" }, { id: "bids", icon: "Bids16", title: "Place bids", description: "Ask every time before any bid.", enabled: rules.bids, limit: "Up to $150 per auction" }, { id: "buys", icon: "Cart16", title: "Buy It Now", description: "Never without your click.", enabled: rules.buys, limit: "Up to $50 for reorders" }]} onToggle={(id, on) => setRules((p) => ({ ...p, [id]: on }))} style={{ maxWidth: "none" }} />;
  const body = <><div><h1 style={{ margin: 0, fontSize: 24, lineHeight: "28px", fontWeight: 700 }}>Memory and automation</h1><p style={{ margin: "6px 0 0", fontSize: 14, lineHeight: "20px", color: "var(--foreground-secondary,#707070)" }}>Everything the agent knows about you, where it came from, and what it may do on its own.</p></div>{priv}</>;
  if (mobile) return <MobileShell stage="13" title="Memory">{body}{mem}{auto}</MobileShell>;
  return (
    <DesktopShell stage="13" wide>
      {body}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0,1fr))", gap: 20, alignItems: "start" }}>{mem}{auto}</div>
    </DesktopShell>
  );
}

// 00-component-index — hand-back sheet
const CONSUMED = [
  ["Core & forms", "Button, IconButton, LinkButton, Input, Textarea, Checkbox, Chip, Badge, Tabs, SegmentedButton, FilterBar, Card, Avatar, Skeleton, Spinner, Snackbar, AlertNotice, Panel, BottomSheet, LineChart, ItemTile, TopNavBar, BottomTabNav, NavigationPanel, Icon, AILabel"],
  ["agentic/", "AgentTaskPlan, AgentToolTrace, AgentStatusChip, MatchConfidence, AutonomyControl, AgentMemoryChips, AgentUndoBar"],
  ["ai-mode/", "AIModeAssistantTurn, AIModeUserBubble, AIModeCarousel, AIModeCheckoutPanel, AIModeDetailRail, AIModeFeedback, AIModeProductCard (variant: item-anatomy footer + action strip = ListingCard), AIModeStatus"],
  ["conversational-ai/", "ThreadContainer/TurnGroup, RichResponseBlock, WorkingIndicator, ToolCallCard, CitationChip, ClarificationChips, GracefulFallback, DryRunPreview, ConfirmationGate, UndoReceipt, LearningAck, PartialFailureSummary, InterruptionControl"],
  ["agentic-composer/", "AgenticComposer, ModeToggle, PromptStarters, ComposerValidation"],
  ["agentic-commerce/", "AgentThoughtSummary, RecommendationCard, ComparisonTable, TradeoffCard, SourceAttribution, AIDisclosure, PrivacyIndicator, MemoryPanel, AutomationRules"],
  ["agentic-intro/", "AgentIntroScreen (Stage 0, unchanged)"],
  ["ui_kits/marketplace_web", "SiteHeader, SearchScreen (Stage 11 classic escape)"],
];
const NEW_FAMILIES = [
  ["AIModeResultsPanel", "Right-side results surface (desktop inline Panel column / mobile BottomSheet) hosting FilterBar + list/grid SegmentedButton for whatever ToolCallCard was opened. Esc closes.", "Stages 3, 6, 7"],
  ["AIModePriceBands", "Budget / Typical / Premium band header (range, sold count, LineChart sparkline) over a 3-up product-card row; AIModeCarousel on mobile.", "Stage 7"],
  ["AIModeFreshnessLine", "One-line evidence strip under any number: “Based on 214 sold listings · last 90 days · updated 12 min ago” (Caption 12/16, #707070).", "Stages 7, 8"],
  ["AIModeSlotToken", "Inline editable [slot] pill inside the composer for template prompts; empty = blue dashed, filled = near-black. Tab moves between slots.", "Stage 2"],
  ["AIModeFinishBar", "End-of-turn action row: Save this · Set a price alert · Ask a follow-up (secondary small pills).", "Stage 7"],
  ["AIModeHistoryList", "Rail list of past tasks: intent title + AgentStatusChip + relative time; 44px rows.", "Stages 10, 12"],
];
function ComponentIndex() {
  const cell = { padding: "10px 12px", borderBottom: "1px solid var(--border-primary,#e5e5e5)", fontSize: 14, lineHeight: "20px", verticalAlign: "top", textAlign: "left" };
  return (
    <div style={{ width: 1440, minHeight: 1000, background: "#fff", padding: 48, fontFamily: "var(--font-brand)", color: "var(--foreground-primary,#191919)", boxSizing: "border-box" }}>
      <h1 style={{ margin: 0, fontSize: 32, lineHeight: "40px", fontWeight: 700, letterSpacing: "-0.01em" }}>AI Mode — component index</h1>
      <p style={{ margin: "8px 0 32px", fontSize: 16, lineHeight: "24px", color: "var(--foreground-secondary,#707070)" }}>Hand-back sheet: every Evo system component consumed, and the six net-new families in this design's components/ai-mode/ folder for contribution.</p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40 }}>
        <section>
          <h2 style={{ fontSize: 20, lineHeight: "24px", margin: "0 0 12px" }}>Consumed from the system</h2>
          <table style={{ borderCollapse: "collapse", width: "100%" }}><tbody>{CONSUMED.map(([g, c]) => <tr key={g}><th style={{ ...cell, width: 180, fontWeight: 700 }}>{g}</th><td style={cell}>{c}</td></tr>)}</tbody></table>
          <h2 style={{ fontSize: 20, lineHeight: "24px", margin: "32px 0 12px" }}>Canonical picks where libraries overlap</h2>
          <table style={{ borderCollapse: "collapse", width: "100%" }}><tbody>{[["Composer", "AgenticComposer (not AIModeComposer / AgentComposer)"], ["Plan", "AgentTaskPlan (not PlanPreview)"], ["Trace", "AgentToolTrace + ToolCallCard"], ["Thread", "TurnGroup + AIModeAssistantTurn + AIModeUserBubble"], ["Product", "AIModeProductCard (item-anatomy variant)"], ["Approval", "DryRunPreview + ConfirmationGate"], ["Undo", "AgentUndoBar + UndoReceipt"], ["Memory", "AgentMemoryChips (+ MemoryPanel for the hub)"]].map(([a, b]) => <tr key={a}><th style={{ ...cell, width: 180, fontWeight: 700 }}>{a}</th><td style={cell}>{b}</td></tr>)}</tbody></table>
        </section>
        <section>
          <h2 style={{ fontSize: 20, lineHeight: "24px", margin: "0 0 12px" }}>Net-new families (components/ai-mode/)</h2>
          <table style={{ borderCollapse: "collapse", width: "100%" }}><tbody>{NEW_FAMILIES.map(([n, u, w]) => <tr key={n}><th style={{ ...cell, width: 190, fontWeight: 700 }}>{n}</th><td style={cell}>{u}<div style={{ fontSize: 12, lineHeight: "16px", color: "var(--foreground-secondary,#707070)", marginTop: 4 }}>Used on {w}</div></td></tr>)}</tbody></table>
          <div style={{ marginTop: 32, display: "flex", flexDirection: "column", gap: 16 }}>
            <AIModeFreshnessLine basis="214 sold listings" window="last 90 days" updated="12 min ago" />
            <AIModeFinishBar />
            <div style={{ fontSize: 15 }}>Find me a used <AIModeSlotToken label="item" value="Nikon D750 body" /> under <AIModeSlotToken label="$max" value="$700" /> shipped by <AIModeSlotToken label="date" value="" /></div>
            <div style={{ maxWidth: 360 }}><AIModeHistoryList items={D2.history.slice(0, 2)} activeId="h1" /></div>
          </div>
        </section>
      </div>
    </div>
  );
}

Object.assign(window, { Stage07, Stage08, Stage09, Stage10, Stage11, Stage12, Stage13, ComponentIndex });

})();
