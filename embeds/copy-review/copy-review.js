/* Copy Review engine, v1.
   Renders a copy deck from the JSON in <script type="application/json" id="review-data">.
   Schema: see HOW-TO-USE.md. Reviewer state lives in this browser (localStorage) until they
   download a CSV or copy the review. Optional runtime capabilities: comments (composer only), downloads. */
(function () {
  "use strict";
  const ENGINE = "copy-review@1";
  const DATA = JSON.parse(document.getElementById("review-data").textContent);
  const OWNER = DATA.owner || "the requester";
  const KEY = "copy-review:" + (DATA.id || "default");
  const QUESTIONS = DATA.questions || [];
  const VOICE = DATA.voice || [];
  const SHARED = (DATA.shared && DATA.shared.rows) || [];
  const SCREENS = DATA.screens || [];

  let S = { reviewer: "", rows: {}, qs: {} };
  try { const raw = localStorage.getItem(KEY); if (raw) S = Object.assign(S, JSON.parse(raw)); } catch (e) {}
  const persist = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} updateKpis(); };
  let filter = "all", showData = false, query = "", comments = null;

  const $ = (s, el = document) => el.querySelector(s);
  const esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const len = s => [...String(s || "")].length;
  const allRows = () => SHARED.concat(...SCREENS.map(s => s.rows || []));
  const reviewable = () => allRows().filter(r => !r.data);
  const hasData = () => allRows().some(r => r.data);
  const ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12Z"/></svg>';

  /* ---------- shell ---------- */
  function shell() {
    const app = document.getElementById("app");
    const n = DATA.notice;
    app.innerHTML = `
      <header class="wrap top">
        <div>
          ${DATA.eyebrow ? `<p class="eyebrow">${esc(DATA.eyebrow)}</p>` : ""}
          <h1>${esc(DATA.title || "Copy review")}</h1>
          ${DATA.lede ? `<p class="lede">${esc(DATA.lede)}</p>` : ""}
          ${n ? `<p class="notice"><span aria-hidden="true">●</span><span>${n.bold ? `<b>${esc(n.bold)}</b> ` : ""}${esc(n.text || "")}</span></p>` : ""}
        </div>
        <aside class="panel" aria-label="How to review">
          <h2>How this works</h2>
          <ol class="steps">
            <li>Add your name so your notes are credited.</li>
            <li>${QUESTIONS.length ? "Answer the open questions, then work screen by screen." : "Work screen by screen. Mark each string Keep, Edit or Discuss."}</li>
            <li>When you're done, download the CSV or copy your review and send it to ${esc(OWNER)}.</li>
          </ol>
          <label class="fld" for="reviewer">Your name<input class="txt" id="reviewer" autocomplete="name" placeholder="First and last name"></label>
          <div class="kpis"><span>Strings reviewed <b id="k-str">0</b></span>${QUESTIONS.length ? `<span>Questions answered <b id="k-q">0</b></span>` : ""}</div>
          <div class="meter" role="progressbar" aria-label="Review progress" aria-valuemin="0" aria-valuemax="100"><i id="k-bar" style="width:0%"></i></div>
          <p style="font-size:12.5px;color:var(--muted)">Your notes save in this browser as you type. Nothing reaches ${esc(OWNER)} until you download or copy them.</p>
        </aside>
      </header>
      <div class="bar"><div class="wrap">
        <div class="seg" role="group" aria-label="Filter strings">
          <button type="button" data-f="all" aria-pressed="true">All</button>
          <button type="button" data-f="todo" aria-pressed="false">Not reviewed</button>
          <button type="button" data-f="edit" aria-pressed="false">Edit</button>
          <button type="button" data-f="discuss" aria-pressed="false">Discuss</button>
        </div>
        ${hasData() ? `<label class="chk" for="showdata"><input type="checkbox" id="showdata"> Show ${esc((DATA.sampleDataLabel || "sample data").toLowerCase())}</label>` : ""}
        <input class="txt search" id="q" type="search" placeholder="Find a string or ID" aria-label="Find a string or ID">
        <span class="spacer"></span>
        <span class="toast" id="toast" role="status"></span>
        <button class="btn" type="button" id="copy">Copy review</button>
        <button class="btn pri" type="button" id="dl">Download CSV</button>
      </div></div>
      <main class="wrap" id="main"></main>
      <div class="lb" id="lb" hidden><button class="btn x" type="button" id="lbx">Close</button><img id="lbimg" alt=""></div>`;
    $("#reviewer").value = S.reviewer || "";
  }

  /* ---------- rows ---------- */
  function rowHTML(r) {
    const v = S.rows[r.id] || {}, st = v.status || "", open = st === "edit" || st === "discuss";
    return `<div class="r${r.data ? " data" : ""}${st ? " st-" + st : ""}" id="r-${esc(r.id)}" data-id="${esc(r.id)}">
      <span class="id">${esc(r.id)}</span>
      <p class="copy">${esc(r.text)}</p>
      <div class="ctl">
        <div class="st" role="group" aria-label="Status for ${esc(r.id)}">
          <button type="button" data-v="keep" aria-pressed="${st === "keep"}">Keep</button>
          <button type="button" data-v="edit" aria-pressed="${st === "edit"}">Edit</button>
          <button type="button" data-v="discuss" aria-pressed="${st === "discuss"}">Discuss</button>
        </div>
        <button type="button" class="cmt" aria-label="Comment on ${esc(r.id)}" title="Comment on this string"${comments ? "" : " hidden"}>${ICON}</button>
      </div>
      <p class="meta">${r.kind ? `<span>${esc(r.kind)}</span>` : ""}${r.where ? `<span>· ${esc(r.where)}</span>` : ""}<span>· ${len(r.text)} characters</span>${r.data ? `<span>· ${esc(DATA.sampleDataLabel || "Sample data")}</span>` : ""}</p>
      <div class="ed"${open ? "" : " hidden"}>
        <textarea class="txt" id="s-${esc(r.id)}" rows="2" maxlength="600" placeholder="Suggested copy" aria-label="Suggested copy for ${esc(r.id)}">${esc(v.suggestion || "")}</textarea>
        <textarea class="txt" id="n-${esc(r.id)}" rows="2" maxlength="1000" placeholder="Why, or a question for ${esc(OWNER)}" aria-label="Note for ${esc(r.id)}">${esc(v.note || "")}</textarea>
        <span class="cnt" id="c-${esc(r.id)}">${v.suggestion ? len(v.suggestion) + " characters, was " + len(r.text) : ""}</span>
      </div>
    </div>`;
  }
  function visible(r) {
    if (r.data && !showData) return false;
    const st = (S.rows[r.id] || {}).status || "";
    if (filter === "todo" && st) return false;
    if (filter === "edit" && st !== "edit") return false;
    if (filter === "discuss" && st !== "discuss") return false;
    if (query && !(String(r.text).toLowerCase().includes(query) || String(r.id).toLowerCase().includes(query))) return false;
    return true;
  }

  /* ---------- page body ---------- */
  function render() {
    const parts = [];
    if (DATA.template) parts.push(guideHTML());
    if (QUESTIONS.length) parts.push(`<section aria-labelledby="h-q"><div class="sh"><h2 id="h-q">Open questions</h2><span class="sub">${QUESTIONS.length} ${QUESTIONS.length === 1 ? "question" : "questions"}. Start here.</span></div><div class="qs">${QUESTIONS.map(q => `
      <article class="q" id="${esc(q.id)}">
        <div class="qh"><span class="qid">${esc(q.id)}</span><h3>${esc(q.q)}</h3></div>
        ${q.ctx ? `<p class="ctx">${esc(q.ctx)}</p>` : ""}
        ${(q.refs || []).length ? `<div class="refs">${q.refs.map(x => `<a href="#r-${esc(x)}" data-jump="${esc(x)}">${esc(x)}</a>`).join("")}</div>` : ""}
        <textarea class="txt" id="qa-${esc(q.id)}" rows="3" maxlength="2000" placeholder="Your answer" aria-label="Answer to ${esc(q.id)}">${esc(S.qs[q.id] || "")}</textarea>
        <div class="row"><span style="font-size:12px;color:var(--faint)">${(S.qs[q.id] || "").trim() ? "Answered" : "Not answered yet"}</span><button type="button" class="cmt" data-q="${esc(q.id)}" aria-label="Comment on ${esc(q.id)}" title="Start a comment thread"${comments ? "" : " hidden"}>${ICON}</button></div>
      </article>`).join("")}</div></section>`);
    if (VOICE.length) parts.push(`<details class="voice"><summary>${esc(DATA.voiceTitle || "Voice and style rules these screens follow")}</summary><ul>${VOICE.map(v => `<li><b>${esc(v[0])}</b> ${esc(v[1] || "")}</li>`).join("")}</ul></details>`);
    if (SHARED.length) {
      const rows = SHARED.filter(visible);
      parts.push(`<section aria-labelledby="h-sh"><div class="sh"><span class="tag">S</span><h2 id="h-sh">${esc((DATA.shared && DATA.shared.title) || "Shared across screens")}</h2><span class="sub">${esc((DATA.shared && DATA.shared.sub) || "Review once. These repeat on many screens.")}</span></div>
        <div class="rows">${rows.length ? rows.map(rowHTML).join("") : `<p class="empty">No shared strings match this filter.</p>`}</div></section>`);
    }
    SCREENS.forEach(s => {
      const rows = (s.rows || []).filter(visible);
      const tall = s.img && s.w && s.h && s.h / s.w > 1.2;
      parts.push(`<section class="screen${!s.img ? " noimg" : tall ? " tall" : ""}" id="${esc(s.code)}" aria-labelledby="h-${esc(s.code)}">
        ${s.img ? `<div class="shot">
          <button type="button" class="thumb" data-img="${esc(s.img)}" aria-label="Open the ${esc(s.title || s.code)} screen full size"><img src="${esc(s.img)}" alt="${esc([s.group, s.platform, s.title].filter(Boolean).join(", "))}" loading="lazy"${s.w ? ` width="${s.w}" height="${s.h}"` : ""}></button>
          <p class="hint" style="font-size:12px;color:var(--faint)">Click to open full size</p></div>` : ""}
        <div style="min-width:0">
          <div class="sh">${s.platform ? `<span class="tag plat">${esc(s.platform)}</span>` : ""}<span class="tag">${esc(s.code)}</span><h2 id="h-${esc(s.code)}">${esc(s.group || s.title || s.code)}</h2>${s.group && s.title ? `<span class="sub">${esc(s.title)}</span>` : ""}</div>
          <div class="rows">${rows.length ? rows.map(rowHTML).join("") : `<p class="empty">No strings match this filter on this screen.</p>`}</div>
        </div></section>`);
    });
    $("#main").innerHTML = parts.join("");
    updateKpis();
  }

  function guideHTML() {
    const g = DATA.template;
    return `<section class="guide" aria-labelledby="h-guide">
      <h2 id="h-guide">${esc(g.title || "This is the Copy Review template")}</h2>
      <div><p style="margin-bottom:8px">${esc(g.intro || "")}</p>
        <ol>${(g.steps || []).map(s => `<li>${esc(s)}</li>`).join("")}</ol></div>
      <div><p style="margin-bottom:8px"><b>Ask Claude, in any chat:</b></p>
        <ol>${(g.prompts || []).map(s => `<li><code>${esc(s)}</code></li>`).join("")}</ol>
        ${g.note ? `<p style="margin-top:8px;color:var(--muted)">${esc(g.note)}</p>` : ""}</div>
    </section>`;
  }

  function updateKpis() {
    const rv = reviewable(), done = rv.filter(r => (S.rows[r.id] || {}).status).length;
    const qd = QUESTIONS.filter(q => (S.qs[q.id] || "").trim()).length;
    const ks = $("#k-str"), kq = $("#k-q");
    if (ks) ks.textContent = done + " of " + rv.length;
    if (kq) kq.textContent = qd + " of " + QUESTIONS.length;
    const pct = Math.round(QUESTIONS.length ? ((done / Math.max(rv.length, 1)) * .8 + (qd / QUESTIONS.length) * .2) * 100 : (done / Math.max(rv.length, 1)) * 100);
    const bar = $("#k-bar"); if (bar) { bar.style.width = pct + "%"; $(".meter").setAttribute("aria-valuenow", pct); }
  }
  function toast(t) { const el = $("#toast"); el.textContent = t; clearTimeout(toast.t); toast.t = setTimeout(() => el.textContent = "", 4000); }

  /* ---------- export ---------- */
  const STATUS = { keep: "Keep", edit: "Edit", discuss: "Discuss", "": "" };
  function screenOf(id) {
    if (SHARED.some(r => r.id === id)) return "Shared";
    const s = SCREENS.find(x => (x.rows || []).some(r => r.id === id));
    return s ? [s.code, s.group, s.platform && "(" + s.platform + ")"].filter(Boolean).join(" ") : "";
  }
  function reviewedRows() { return allRows().filter(r => { const v = S.rows[r.id]; return v && (v.status || (v.suggestion || "").trim() || (v.note || "").trim()); }); }
  function copyReview() {
    const who = (S.reviewer || "").trim() || "Reviewer";
    const L = [DATA.title || "Copy review", "Reviewer: " + who, "Date: " + new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })];
    if (QUESTIONS.length) { L.push("", "OPEN QUESTIONS"); QUESTIONS.forEach(q => { L.push(q.id + ". " + q.q); L.push("   Answer: " + ((S.qs[q.id] || "").trim() || "(no answer)")); }); }
    L.push("", "STRINGS");
    const rr = reviewedRows();
    if (!rr.length) L.push("(none marked yet)");
    rr.forEach(r => { const v = S.rows[r.id];
      L.push(r.id + " [" + (STATUS[v.status || ""] || "Note") + "] " + screenOf(r.id));
      L.push("   Current: " + r.text);
      if ((v.suggestion || "").trim()) L.push("   Suggested: " + v.suggestion.trim());
      if ((v.note || "").trim()) L.push("   Note: " + v.note.trim()); });
    const text = L.join("\n");
    const fallback = () => { const ta = document.createElement("textarea"); ta.value = text; ta.className = "txt"; ta.rows = 12; ta.setAttribute("aria-label", "Your review as text"); $("#main").prepend(ta); ta.select(); toast("Couldn't copy automatically. Your review is selected at the top of the page."); };
    try { navigator.clipboard.writeText(text).then(() => toast("Review copied. Paste it into an email or Slack to " + OWNER + "."), fallback); } catch (e) { fallback(); }
  }
  async function downloadCsv() {
    const q = v => '"' + String(v == null ? "" : v).replace(/"/g, '""') + '"';
    const who = (S.reviewer || "").trim();
    const out = [["ID", "Screen", "Element", "Where", "Current copy", "Status", "Suggested copy", "Note", "Reviewer"].map(q).join(",")];
    QUESTIONS.forEach(x => out.push([x.id, "Open question", "Question", "", x.q, (S.qs[x.id] || "").trim() ? "Answered" : "", (S.qs[x.id] || "").trim(), "", who].map(q).join(",")));
    allRows().forEach(r => { const v = S.rows[r.id] || {}; out.push([r.id, screenOf(r.id), r.kind || "", r.where || "", r.text, STATUS[v.status || ""], v.suggestion || "", v.note || "", (v.status || v.suggestion || v.note) ? who : ""].map(q).join(",")); });
    let dl = null; try { dl = await window.claude?.use?.("downloads"); } catch (e) {}
    if (!dl) { toast("Download isn't available here. Use Copy review instead."); return; }
    try { await dl.save({ filename: (DATA.id || "copy-review") + (who ? "-" + who.replace(/[^\w-]+/g, "-") : "") + ".csv", data: "﻿" + out.join("\r\n") }); toast("CSV saved. Send it to " + OWNER + "."); }
    catch (err) { const c = err && err.code; toast(c === "declined" ? "Download cancelled." : c === "rate_limited" ? "A download is already open. Try again in a moment." : "Download isn't available here. Use Copy review instead."); }
  }

  /* ---------- events ---------- */
  function wire() {
    document.addEventListener("click", async e => {
      const sb = e.target.closest(".st button");
      if (sb) {
        const row = sb.closest(".r"), id = row.dataset.id, v = sb.dataset.v, cur = (S.rows[id] || {}).status;
        S.rows[id] = Object.assign(S.rows[id] || {}, { status: cur === v ? "" : v }); persist();
        const st = S.rows[id].status;
        row.className = row.className.replace(/ st-\w+/g, "") + (st ? " st-" + st : "");
        row.querySelectorAll(".st button").forEach(b => b.setAttribute("aria-pressed", String(b.dataset.v === st)));
        const ed = row.querySelector(".ed"); ed.hidden = !(st === "edit" || st === "discuss");
        if (st === "edit") ed.querySelector("textarea").focus();
        return;
      }
      const cb = e.target.closest(".cmt");
      if (cb && comments) {
        const target = cb.dataset.q ? document.getElementById(cb.dataset.q) : cb.closest(".r");
        try { const res = await comments.openComposer({ element: target }); if (res && !res.opened) toast("Close the open comment first, then try again."); }
        catch (err) { document.querySelectorAll(".cmt").forEach(b => b.hidden = true); toast("Commenting isn't available in this view. Use the note fields instead."); }
        return;
      }
      const th = e.target.closest(".thumb");
      if (th) { $("#lbimg").src = th.dataset.img; $("#lbimg").alt = th.querySelector("img").alt; $("#lb").hidden = false; $("#lbx").focus(); return; }
      if (e.target.id === "lbx" || e.target.id === "lb") { $("#lb").hidden = true; return; }
      const fb = e.target.closest(".seg button");
      if (fb) { filter = fb.dataset.f; document.querySelectorAll(".seg button").forEach(b => b.setAttribute("aria-pressed", String(b === fb))); render(); return; }
      const jp = e.target.closest("[data-jump]");
      if (jp) {
        e.preventDefault();
        const id = jp.dataset.jump, r = allRows().find(x => x.id === id);
        if (r && r.data && !showData) { showData = true; const sd = $("#showdata"); if (sd) sd.checked = true; }
        if (filter !== "all") { filter = "all"; document.querySelectorAll(".seg button").forEach(b => b.setAttribute("aria-pressed", String(b.dataset.f === "all"))); }
        if (query) { query = ""; $("#q").value = ""; }
        render();
        const el = document.getElementById("r-" + id);
        if (el) { el.scrollIntoView({ block: "center" }); el.style.outline = "2px solid var(--accent)"; setTimeout(() => el.style.outline = "", 1600); }
        return;
      }
      if (e.target.id === "copy") copyReview();
      if (e.target.id === "dl") downloadCsv();
    });
    document.addEventListener("keydown", e => { if (e.key === "Escape" && !$("#lb").hidden) $("#lb").hidden = true; });
    document.addEventListener("input", e => {
      const t = e.target;
      if (t.id === "reviewer") { S.reviewer = t.value; persist(); return; }
      if (t.id === "q") { query = t.value.trim().toLowerCase(); render(); return; }
      if (t.id.startsWith("qa-")) { S.qs[t.id.slice(3)] = t.value; persist(); return; }
      if (t.id.startsWith("s-") || t.id.startsWith("n-")) {
        const id = t.id.slice(2); S.rows[id] = S.rows[id] || {};
        if (t.id.startsWith("s-")) { S.rows[id].suggestion = t.value; const r = allRows().find(x => x.id === id); $("#c-" + CSS.escape(id)).textContent = t.value ? len(t.value) + " characters, was " + len(r.text) : ""; }
        else S.rows[id].note = t.value;
        persist();
      }
    });
    document.addEventListener("change", e => { if (e.target.id === "showdata") { showData = e.target.checked; render(); } });
  }

  shell(); wire(); render();
  (async () => { try { comments = await window.claude?.use?.("comments"); } catch (e) { comments = null; } document.querySelectorAll(".cmt").forEach(b => b.hidden = !comments); })();
  window.COPY_REVIEW_ENGINE = ENGINE;
})();
