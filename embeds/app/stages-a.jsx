(function(){
// Stages 00–06. Canonical picks: composer → AgenticComposer; plan → AgentTaskPlan; trace → AgentToolTrace + ToolCallCard;
// thread → AIModeAssistantTurn + AIModeUserBubble; approval → ConfirmationGate; undo → AgentUndoBar + UndoReceipt; memory → AgentMemoryChips.
const DS1 = window.EBayEvoDesignSystem_61746e;
const D1 = window.AIMODE_DATA;
const { AgentIntroScreen, AgenticComposer, ModeToggle, PromptStarters, ComposerValidation, AgentMemoryChips, LearningAck, LinkButton, Button, Icon, AIModeUserBubble, AIModeAssistantTurn, WorkingIndicator, AIModeStatus, ClarificationChips, Skeleton, AgentTaskPlan, AutonomyControl, Checkbox, Input, AgentToolTrace, AgentThoughtSummary, Chip, Spinner, AgentStatusChip, PartialFailureSummary, InterruptionControl, AILabel, Badge } = DS1;

function Shell({ mobile, ...p }) { return mobile ? <MobileShell {...p} /> : <DesktopShell {...p} />; }
function UserQuery() { return <AIModeUserBubble>{D1.QUERY}</AIModeUserBubble>; }
function Headline({ mobile }) {
  return (
    <div style={{ textAlign: "center", padding: mobile ? "24px 0 4px" : "48px 0 8px" }}>
      <h1 style={{ margin: 0, fontSize: mobile ? 24 : 32, lineHeight: mobile ? "30px" : "40px", fontWeight: 700, letterSpacing: "-0.01em" }}>Ask once. Your agent takes it from there.</h1>
      <p style={{ margin: "8px 0 0", fontSize: 14, lineHeight: "20px", color: "var(--foreground-secondary,#707070)" }}>Search, compare, track, and buy across eBay with one request.</p>
    </div>
  );
}
function ModeRow({ mobile }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12 }}>
      <ModeToggle icon="LightningBolt16" label="Deal Hunter" active onToggle={() => go("00")} />
      <LinkButton level="secondary" size="small" onClick={() => go("00")}>Change</LinkButton>
    </div>
  );
}
function MemoryRow() {
  const { s, set } = useApp();
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <AgentMemoryChips title="What I'll use for this task" items={s.memoryChips.map((m) => ({ id: m.id, label: m.label }))} onRemove={(it) => set((p) => ({ memoryChips: p.memoryChips.filter((m) => m.id !== it.id), forgotten: p.memoryChips.find((m) => m.id === it.id) }))} onManage={() => go("13")} manageLabel="Manage memory" />
      {s.forgotten && <LearningAck type="preference-learned" consequence={"Forgot: " + s.forgotten.label + ". I won't apply it to this task."} vetoLabel="Undo" onVeto={() => set((p) => ({ memoryChips: [...p.memoryChips, p.forgotten], forgotten: null }))} onView={() => go("13")} viewLabel="View memory" />}
    </div>
  );
}
const DEAL_PROMPTS = ["Watch Air Jordan 4 Bred, size 10.5. Alert me under $180", "Track my watchlist and flag the best price drop", "Is $655 fair for a used Nikon D750 body under 20k shutter?"];
function ExamplePrompts({ onPick }) {
  return (
    <div>
      {DEAL_PROMPTS.map((t, i) => (
        <div key={t} role="button" tabIndex={0} onClick={() => onPick(t)} onKeyDown={(e) => e.key === "Enter" && onPick(t)} style={{ display: "flex", alignItems: "center", gap: 12, padding: "13px 10px", borderTop: i ? "1px solid var(--border-primary,#e5e5e5)" : "none", cursor: "pointer", borderRadius: 8, minHeight: 44 }}>
          <span style={{ width: 30, height: 30, borderRadius: 999, background: "var(--neutral-100,#f7f7f7)", display: "inline-flex", alignItems: "center", justifyContent: "center", color: "var(--foreground-secondary,#707070)", flex: "none" }}><Icon name="LightningBolt16" size={14} /></span>
          <span style={{ flex: 1, fontSize: 14, lineHeight: "20px" }}>{t}</span>
          <Icon name="ArrowRight16" size={14} color="var(--neutral-400,#8f8f8f)" />
        </div>
      ))}
    </div>
  );
}

// 00 — Intro (system AgentIntroScreen, unchanged)
function Stage00({ mobile }) {
  const { s, set } = useApp();
  const [mode, setMode] = React.useState("auto");
  return (
    <Shell mobile={mobile} stage="00" wide>
      <AgentIntroScreen mode={mode} onModeChange={(id) => { if (id === "deal-hunter") { set({ mode: id }); go("01"); } else setMode(id); }} onSubmit={() => go("03")} onPrompt={(t, m) => { if (m === "deal-hunter") go("02"); }} style={mobile ? { padding: "16px 0 8px" } : undefined} />
    </Shell>
  );
}

// 01 — Entry, Deal Hunter active
function Stage01({ mobile }) {
  const [v, setV] = React.useState("");
  const composer = (
    <AgenticComposer value={v} onChange={setV} placeholder="Describe the deal you're after: item, budget, deadline" onSubmit={() => go("03")} onAdd={() => {}} leftControls={<ModeToggle icon="LightningBolt16" label="Deal Hunter" active onToggle={() => go("00")} />}
      footer={<PromptStarters starters={D1.starters.map((st) => ({ label: st.label, icon: "LightningBolt16" }))} onPick={() => go("02")} hidden={v.length > 0} />} />
  );
  return (
    <Shell mobile={mobile} stage="01">
      <Headline mobile={mobile} />
      <ModeRow />
      <MemoryRow />
      {composer}
      <ExamplePrompts onPick={(t) => setV(t)} />
    </Shell>
  );
}

// 02 — Composing a template prompt with AIModeSlotToken pills
function Stage02({ mobile }) {
  const [slots, setSlots] = React.useState({ item: "Nikon D750 body", "$max": "$700", date: "" });
  const allFilled = Object.values(slots).every((x) => x.trim());
  const text = allFilled ? `Find me a used ${slots.item} under ${slots["$max"]} shipped by ${slots.date}` : "";
  const tpl = ["Find me a used ", "item", " under ", "$max", " shipped by ", "date"];
  const overlay = !allFilled && (
    <div aria-label="Template prompt" style={{ position: "absolute", top: 10, left: 18, right: 18, display: "flex", alignItems: "center", flexWrap: "wrap", gap: "4px 2px", fontSize: 15, lineHeight: "28px", pointerEvents: "auto" }}>
      {tpl.map((t, i) => i % 2 ? <AIModeSlotToken key={t} label={t} value={slots[t]} onChange={(val) => setSlots((p) => ({ ...p, [t]: val }))} /> : <span key={i}>{t}</span>)}
    </div>
  );
  return (
    <Shell mobile={mobile} stage="02">
      <Headline mobile={mobile} />
      <ModeRow />
      <MemoryRow />
      <div style={{ position: "relative" }}>
        <AgenticComposer value={allFilled ? text : "\n"} onChange={() => {}} placeholder=" " maxLines={4} onSubmit={() => { window.__aimAuto = true; go("03"); }} onAdd={() => {}} leftControls={<ModeToggle icon="LightningBolt16" label="Deal Hunter" active onToggle={() => go("00")} />}
          footer={allFilled ? <ComposerValidation tone="info" message="Ready to send. Enter sends, Shift+Enter adds a line." preserved="Your template is saved." /> : <ComposerValidation tone="warning" message="Fill in the highlighted part to continue." preserved="Your template is saved." actionLabel="Use next Friday" onAction={() => setSlots((p) => ({ ...p, date: "next Friday" }))} />} />
        {overlay}
      </div>
      <p style={{ margin: 0, fontSize: 12, lineHeight: "16px", color: "var(--foreground-secondary,#707070)", textAlign: "center" }}>Tab moves between the highlighted parts. Send stays off until every part has a value.</p>
    </Shell>
  );
}

// 03 — Thinking
const THINK = ["Checking 214 sold listings…", "Comparing 9 active listings…", "Reviewing 6 sellers…"];
function Stage03({ mobile }) {
  const { s, set } = useApp();
  const [n, setN] = React.useState(1);
  const [clar, setClar] = React.useState(null);
  React.useEffect(() => { const t = setInterval(() => setN((x) => Math.min(THINK.length, x + 1)), 700); return () => clearInterval(t); }, []);
  React.useEffect(() => { if (!window.__aimAuto) return; window.__aimAuto = false; const t = setTimeout(() => go("04"), 1800); return () => clearTimeout(t); }, []);
  const skeletons = <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>{[0, 1, 2, 3].map((i) => <div key={i} style={{ display: "flex", gap: 12 }}><Skeleton width={72} height={72} radius={8} /><div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}><Skeleton height={14} /><Skeleton width="60%" height={14} /><Skeleton width={80} height={18} /></div></div>)}</div>;
  const panel = <AIModeResultsPanel open title="Searching active listings" subtitle="Results appear as each check finishes" showTools={false} mobile={mobile} onClose={() => {}}>{skeletons}</AIModeResultsPanel>;
  return (
    <Shell mobile={mobile} stage="03" stateToggle="03" panel={!mobile && panel} composer={<FollowUpComposer />}>
      <UserQuery />
      <WorkingIndicator lines={THINK.slice(0, n)} />
      <AIModeStatus steps={THINK} interval={700} skeletons={0} />
      <ClarificationChips interpretation="Assuming body only. Not right?" chips={[{ label: "Body only", hint: "9 matches" }, { label: "With a kit lens", hint: "14 matches" }, { label: "Either", hint: "23 matches" }]} onPick={(c) => setClar(c)} applied={clar && clar.label} appliedDelta={clar && (clar.label === "Body only" ? "23 → 9 results" : "23 → " + (clar.hint || "").split(" ")[0] + " results")} onRemove={() => setClar(null)} />
      {mobile && skeletons}
    </Shell>
  );
}

// 04 — Plan proposed (rich)
function PhaseLabel({ ph, i }) {
  return <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}><span style={{ fontSize: 12, color: "var(--foreground-secondary,#707070)" }}>Phase {i + 1}</span><span style={{ fontSize: 16, lineHeight: "20px", fontWeight: 700 }}>{ph.label}</span>{ph.locked && <Icon name="Lock16" size={14} color="var(--foreground-secondary,#707070)" title="Needs your approval" />}</span>;
}
function PlanBody({ mobile, editing }) {
  const [checked, setChecked] = React.useState(() => ({ "p3-3": false }));
  const [draft, setDraft] = React.useState("Treat “low shutter count” as under 40,000");
  const steps = D1.plan.phases.map((ph, i) => ({
    status: "pending",
    label: <PhaseLabel ph={ph} i={i} />,
    detail: (
      <div style={{ display: "flex", flexDirection: "column", gap: editing ? 6 : 4, marginTop: 6, color: "var(--foreground-primary,#191919)", fontSize: 14, lineHeight: "20px" }}>
        {ph.steps.concat(i === 2 && editing ? ["Skip refurbished units"] : []).map((st, j) => {
          const key = ph.id + "-" + j; const on = checked[key] !== false;
          if (editing && i === 0 && j === 3) return <div key={key} style={{ display: "flex", alignItems: "center", gap: 8 }}><Checkbox checked readOnly aria-label="Step enabled" /><div style={{ flex: 1 }}><Input value={draft} onChange={(e) => setDraft(e.target.value)} aria-label="Edit step" autoFocus /></div></div>;
          if (editing) return <div key={key} style={{ display: "flex", alignItems: "center", gap: 8 }}><Checkbox checked={on} onChange={() => setChecked((p) => ({ ...p, [key]: !on }))} label={<span style={{ textDecoration: on ? "none" : "line-through", color: on ? "inherit" : "var(--foreground-secondary,#707070)" }}>{st}</span>} />{j >= ph.steps.length && <Badge tone="accent">Added</Badge>}</div>;
          return <span key={key} style={{ display: "flex", gap: 8 }}><span style={{ color: "var(--neutral-400,#8f8f8f)" }}>·</span>{st}</span>;
        })}
        {editing && <LinkButton size="small" onClick={() => {}}>+ Add step</LinkButton>}
        {i === 3 && <div style={{ marginTop: 8 }}><AutonomyControl value="ask" limit="$700" footnote="Applies to offers in this task. Change anytime." /></div>}
      </div>
    ),
  }));
  return <AgentTaskPlan title={D1.plan.title} steps={steps} footnote={<span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><Icon name="Clock12" size={12} />{D1.plan.eta} · Nothing is bought or sent without your click.</span>} style={{ maxWidth: "none" }} />;
}
function Stage04({ mobile }) {
  return (
    <Shell mobile={mobile} stage="04" composer={<FollowUpComposer />}>
      <UserQuery />
      <AIModeAssistantTurn intro="Here's how I'd go about it. Edit any step before I start — phase 4 always waits for you." whySignals={["Parsed intent: buy used camera body, budget $700, deadline Fri, Sep 19", "Memory used: ships to 10001, budget ≤ $700", "Mode: Deal Hunter"]}>
        <PlanBody mobile={mobile} />
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", flexWrap: "wrap" }}>
          <Button level="secondary" onClick={() => go("05")} leadingIcon={<Icon name="Pencil16" size={16} />}>Edit</Button>
          <Button onClick={() => go("06")}>Start now</Button>
        </div>
      </AIModeAssistantTurn>
    </Shell>
  );
}
// 05 — Plan editing
function Stage05({ mobile }) {
  return (
    <Shell mobile={mobile} stage="05" composer={<FollowUpComposer />}>
      <UserQuery />
      <AIModeAssistantTurn intro="Editing the plan. Untick a step to skip it, or change the wording.">
        <PlanBody mobile={mobile} editing />
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", flexWrap: "wrap" }}>
          <Button level="secondary" onClick={() => go("04")}>Cancel</Button>
          <Button onClick={() => go("06")}>Save &amp; start</Button>
        </div>
      </AIModeAssistantTurn>
    </Shell>
  );
}

// 06 — Running (+ error, paused variants)
function TraceEntries({ variant }) {
  return D1.trace.map((t, i) => {
    let status = t.status; if (variant === "error" && i === 2) status = "failed"; if (variant === "paused" && i === 2) status = "paused";
    const glyph = status === "active" ? <Spinner size={14} /> : null;
    return {
      icon: status === "done" ? "Tick16" : status === "failed" ? "AttentionFilled16" : status === "active" ? "ClockFast16" : status === "paused" ? "Pause16" : t.locked ? "Lock16" : "Clock16",
      label: (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 8, fontWeight: 700, lineHeight: "20px" }}>{t.phase}{glyph}</span>
          <AgentThoughtSummary state={status === "done" ? "done" : status === "failed" ? "error" : status === "active" ? "comparing" : "thinking"} summary={t.thought} />
          {t.sources > 0 && <button type="button" onClick={() => go("08")} style={{ background: "none", border: "none", padding: 0, cursor: "pointer", textAlign: "left", fontFamily: "inherit" }}><ThumbStack count={t.sources} /></button>}
          {t.queries.length > 0 && <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>{t.queries.map((q) => <Chip key={q} leading={<Icon name="Search16" size={14} />} onClick={() => go("11")} title="Open in classic search">{q}</Chip>)}</div>}
        </div>
      ),
    };
  });
}
function Stage06({ mobile, variant }) {
  const { s, set } = useApp();
  const [sheet, setSheet] = React.useState(false);
  const shown = D1.listings.slice(0, 5);
  const panelBody = (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {shown.map((l) => <ListingCard key={l.id} l={l} mobile={false} onOpen={() => go("07")} onOffer={() => go("09")} />)}
      {[0, 1].map((i) => <div key={i} style={{ display: "flex", gap: 12 }}><Skeleton width={72} height={72} radius={8} /><div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}><Skeleton height={14} /><Skeleton width="60%" height={14} /></div></div>)}
    </div>
  );
  const panel = <AIModeResultsPanel open={mobile ? sheet : true} onClose={() => setSheet(false)} title="9 active listings" subtitle="Streaming in · 7 of 9 checked" filters={["Under $700", "Returns accepted", "Free shipping", "Shutter < 50k"]} selectedFilters={s.filters} onToggleFilter={(k) => set((p) => ({ filters: p.filters.includes(k) ? p.filters.filter((x) => x !== k) : [...p.filters, k] }))} view={s.view} onViewChange={(v) => set({ view: v })} mobile={mobile}>{panelBody}</AIModeResultsPanel>;
  const stateKey = variant === "error" ? "06-error" : variant === "paused" ? "06-paused" : "06";
  return (
    <Shell mobile={mobile} stage="06" stateToggle={stateKey} panel={!mobile && panel} sheet={mobile && panel} composer={<FollowUpComposer />}>
      <UserQuery />
      <AIModeUserBubble><span style={{ display: "inline-flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}><Icon name="Tick16" size={14} />Start the task — skip refurbished units</span></AIModeUserBubble>
      <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
        <AgentStatusChip status={variant === "paused" ? "paused" : "working"}>{variant === "paused" ? "Paused" : variant === "error" ? "Working · 1 check failed" : "Working · 2 of 4 phases done"}</AgentStatusChip>
        {variant !== "paused" && <><Button level="borderless" size="small" onClick={() => go("06-paused")} leadingIcon={<Icon name="Pause16" size={14} />}>Pause</Button><Button level="borderless" size="small" onClick={() => go("06-paused")} leadingIcon={<Icon name="Close16" size={14} />}>Stop</Button></>}
        {mobile && <Button level="secondary" size="small" onClick={() => setSheet(true)}>See 9 listings</Button>}
      </div>
      <AgentToolTrace summary="Working on it" entries={TraceEntries({ variant })} defaultOpen sourcesLabel="View all 38 sources" onSources={() => go("08")} style={{ maxWidth: "none" }} />
      {variant === "error" && <PartialFailureSummary headline="Couldn't load seller history — retry or continue without it" done={[{ label: "Sold-price check", receipt: "214 listings" }, { label: "Active listing search", receipt: "9 listings" }]} failed={[{ label: "Seller check", cause: "Feedback service timed out after 8s" }]} retryLabel="Retry" onRetryFailed={() => go("06")} skipLabel="Continue without it" onSkip={() => go("07")} />}
      {variant === "paused" && <InterruptionControl state="resolving" midStep="Mid-way through comparing listings — finish this phase first, or stop right now?" onFinishStep={() => go("06")} onStopNow={() => go("07")} onResume={() => go("06")} done={["Sold-price check · 214 listings", "Active listing search · 9 listings"]} notDone={["Seller check", "Draft Best Offers"]} />}
    </Shell>
  );
}

Object.assign(window, { Shell, UserQuery, Stage00, Stage01, Stage02, Stage03, Stage04, Stage05, Stage06 });

})();
