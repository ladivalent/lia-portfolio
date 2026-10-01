(function(){
// Router: #/<stage>/<platform>
const STAGES = {
  "00": (m) => <Stage00 mobile={m} />, "01": (m) => <Stage01 mobile={m} />, "02": (m) => <Stage02 mobile={m} />, "03": (m) => <Stage03 mobile={m} />,
  "04": (m) => <Stage04 mobile={m} />, "05": (m) => <Stage05 mobile={m} />, "06": (m) => <Stage06 mobile={m} />, "06-error": (m) => <Stage06 mobile={m} variant="error" />, "06-paused": (m) => <Stage06 mobile={m} variant="paused" />,
  "07": (m) => <Stage07 mobile={m} />, "07-empty": (m) => <Stage07 mobile={m} empty />, "08": (m) => <Stage08 mobile={m} />, "09": (m) => <Stage09 mobile={m} />, "10": (m) => <Stage10 mobile={m} />,
  "11": (m) => <Stage11 mobile={m} />, "12": (m) => <Stage12 mobile={m} />, "13": (m) => <Stage13 mobile={m} />, "index": () => <ComponentIndex />,
};
const STAGE_LABELS = { "00": "00-intro", "01": "01-entry", "02": "02-composing", "03": "03-thinking", "04": "04-plan-proposed", "05": "05-plan-editing", "06": "06-running", "06-error": "06-running-error", "06-paused": "06-running-paused", "07": "07-answer", "07-empty": "07-answer-empty", "08": "08-sources", "09": "09-draft-offer", "10": "10-offer-sent", "11": "11-classic-search", "12": "12-history", "13": "13-memory-hub", "index": "00-component-index" };
function App() {
  const r = useRoute();
  const mobile = r.platform === "mobile";
  const render = STAGES[r.stage] || STAGES["00"];
  React.useEffect(() => { document.body.dataset.platform = r.platform; document.title = "AI Mode · " + (STAGE_LABELS[r.stage] || r.stage) + (mobile ? " (mobile)" : ""); }, [r.stage, r.platform]);
  return <AppProvider><div data-screen-label={(STAGE_LABELS[r.stage] || r.stage) + (mobile ? "-mobile" : "")} style={{ display: "inline-block" }}>{render(mobile)}</div></AppProvider>;
}
window.AIMODE_STAGE_LABELS = STAGE_LABELS;
ReactDOM.createRoot(document.getElementById("root")).render(<App />);

})();
