// AIModeFinishBar — end-of-turn action row: Save this · Set a price alert · Ask a follow-up.
// Usage: <AIModeFinishBar saved onSave onAlert onFollowUp /> — three secondary small pill Buttons; "Save this" flips its heart when saved. Buttons name the action.
(function () {
  const { Button, Icon } = window.EBayEvoDesignSystem_61746e;
  function AIModeFinishBar({ saved = false, onSave, onAlert, onFollowUp, style }) {
    return (
      <div role="group" aria-label="What next" style={{ display: "flex", gap: 8, flexWrap: "wrap", fontFamily: "var(--font-brand)", ...style }}>
        <Button level="secondary" size="small" onClick={onSave} leadingIcon={<Icon name={saved ? "HeartFilled16" : "Heart16"} size={16} />}>{saved ? "Saved" : "Save this"}</Button>
        <Button level="secondary" size="small" onClick={onAlert} leadingIcon={<Icon name="Notification16" size={16} />}>Set a price alert</Button>
        <Button level="secondary" size="small" onClick={onFollowUp} leadingIcon={<Icon name="Chat16" size={16} />}>Ask a follow-up</Button>
      </div>
    );
  }
  Object.assign(window, { AIModeFinishBar });
})();
