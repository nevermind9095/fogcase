// 瀏覽器內自動試玩（測試用）：在 console 貼上後執行 FC_bot(正確率, 步數)
window.FC_bot = async function (acc, steps) {
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const q = (s) => document.querySelector(s);
  const log = [];
  for (let i = 0; i < steps; i++) {
    await sleep(60);
    if (i % 1 === 0 && document.querySelector("#overlay:not(.hidden)")) window.__stuck = 0;
    const ov = !q("#overlay").classList.contains("hidden");
    try {
      if (ov) {
        const b = q("#overlay [data-k=next]") || q("#overlay [data-d]:not([disabled])") || q("#overlay [data-id]") || q("#overlay [data-k=ok]") || q("#overlay [data-k=no]");
        if (b) { b.click(); continue; }
      }
      if (q("[data-k=room]") && q(".result-grid")) { log.push("RESULT: " + q(".folder h2").textContent); return log; }
      if (q(".node.avail")) { const n = document.querySelectorAll(".node.avail"); n[Math.floor(Math.random() * n.length)].click(); continue; }
      const L = window.FC_cur;
      if (q("[data-o]:not([disabled])") && L) {
        const ok = Math.random() < acc; const opts = [...document.querySelectorAll("[data-o]")];
        let k = L.answerIdx; if (!ok) k = (k + 1 + Math.floor(Math.random() * 3)) % 4; opts[k].click(); await sleep(900); continue;
      }
      if (q("[data-n]") && L) {
        const v = Math.random() < acc ? String(L.answer) : String(L.answer + 1);
        for (const ch of v) q('[data-n="' + ch + '"]').click(); q('[data-n=ok]').click(); await sleep(900); continue;
      }
      if (q("[data-tile]") && L) {
        q("[data-sp=clear]").click();
        const ok = Math.random() < acc; const need = []; for (let j = 0; j < L.mask.length; j++) if (L.mask[j] === "_") need.push(L.answer[j]);
        for (let j = 0; j < need.length; j++) {
          const tiles = [...document.querySelectorAll("[data-tile]")].filter((t) => !t.classList.contains("used"));
          const t = (ok ? tiles.find((t) => t.textContent === need[j]) : null) || tiles[0]; t.click();
        }
        q("[data-sp=ok]").click(); await sleep(900); continue;
      }
      const b2 = q("[data-k=leave]") || q("[data-k=heal]") || q("[data-k=safe]") || q("[data-k=ok]") || q("[data-k=go]");
      if (b2) { b2.click(); continue; }
      const html = document.getElementById("app").innerHTML;
      if (window.__snap !== html) { window.__snap = html; window.__stuck = 0; }
      if ((window.__stuck = (window.__stuck || 0) + 1) < 15) { await sleep(200); continue; }
      log.push("STUCK at step " + i + ": " + document.body.innerText.slice(0, 200)); return log;
    } catch (e) { log.push("ERR " + e.message); return log; }
  }
  log.push("steps exhausted"); return log;
};
