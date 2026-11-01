// 所長的機密檔案庫 — 期中考複習遊戲（604）
// 純前端 vanilla JS；進度只存在這台 iPad 的 localStorage。
(function () {
  "use strict";

  var SUBJ = window.FC_SUBJECTS, BANK = window.FC_BANK, CHARS = window.FC_CHARS;
  var SUBJ_KEYS = ["math", "science", "social", "english"];
  var app = document.getElementById("app");
  var overlay = document.getElementById("overlay");

  // ================= 小工具 =================
  function rnd(n) { return Math.floor(Math.random() * n); }
  function pick(a) { return a[rnd(a.length)]; }
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = rnd(i + 1); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function today() { var d = new Date(); return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate(); }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  // 題目文字：先跳脫，再把分數 a/b、帶分數 w又a/b 排成直式（分子在上、分母在下）
  function fracHtml(n, d) { return '<span class="frac"><span class="fn">' + n + '</span><span class="fd">' + d + "</span></span>"; }
  function rich(s) {
    return esc(s)
      .replace(/(\d+)又(\d+)\/(\d+)/g, function (_, w, n, d) { return '<span class="mixed">' + w + fracHtml(n, d) + "</span>"; })
      .replace(/(\d+)\/(\d+)/g, function (_, n, d) { return fracHtml(n, d); });
  }
  function h(html) { var d = document.createElement("div"); d.innerHTML = html.trim(); return d.firstChild; }
  function on(root, sel, fn) { root.querySelectorAll(sel).forEach(function (b) { b.addEventListener("click", fn); }); }
  function charOf(seat) { for (var i = 0; i < CHARS.length; i++) if (CHARS[i].seat === seat) return CHARS[i]; return CHARS[0]; }
  function img(seat) { return "assets/chars/" + seat + ".webp"; }
  function toast(msg) {
    var t = h('<div class="toast">' + msg + "</div>");
    document.getElementById("toasts").appendChild(t);
    setTimeout(function () { t.remove(); }, 2600);
  }
  function show(html) {
    app.innerHTML = html; window.scrollTo(0, 0);
    app.classList.remove("enter"); void app.offsetWidth; app.classList.add("enter");
  }
  function openSheet(html) { overlay.innerHTML = '<div class="sheet">' + html + "</div>"; overlay.classList.remove("hidden"); overlay.scrollTop = 0; return overlay.firstChild; }
  function closeSheet() { overlay.classList.add("hidden"); overlay.innerHTML = ""; }

  // ================= 存檔（失敗也能玩） =================
  var SAVE_KEY = "fogcase-v1";
  function defaultSave() {
    return { seat: null, cases: {}, medals: 0, medalLog: {}, closedRuns: { math: 0, science: 0, social: 0, english: 0 },
      sound: false, round: 0, introSeen: false, clearedMsg: {} };
  }
  var save = (function () {
    var s = defaultSave();
    try {
      var raw = window.localStorage.getItem(SAVE_KEY);
      if (raw) { var o = JSON.parse(raw); for (var k in o) s[k] = o[k]; }
    } catch (e) { /* 存檔讀取失敗：用新的進度 */ }
    if (!s.closedRuns) s.closedRuns = defaultSave().closedRuns;
    return s;
  })();
  function persist() { try { window.localStorage.setItem(SAVE_KEY, JSON.stringify(save)); } catch (e) { /* 存不了也繼續玩 */ } }

  // ================= 音效（預設關閉） =================
  var actx = null;
  function beep(kind) {
    if (!save.sound) return;
    try {
      actx = actx || new (window.AudioContext || window.webkitAudioContext)();
      var notes = { ok: [660, 880], bad: [220, 160], win: [523, 659, 784, 1046], tap: [500] }[kind] || [440];
      notes.forEach(function (f, i) {
        var o = actx.createOscillator(), g = actx.createGain();
        o.type = kind === "bad" ? "sawtooth" : "triangle"; o.frequency.value = f;
        g.gain.setValueAtTime(0.0001, actx.currentTime + i * 0.09);
        g.gain.exponentialRampToValueAtTime(0.15, actx.currentTime + i * 0.09 + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, actx.currentTime + i * 0.09 + 0.16);
        o.connect(g); g.connect(actx.destination); o.start(actx.currentTime + i * 0.09); o.stop(actx.currentTime + i * 0.09 + 0.2);
      });
    } catch (e) { }
  }

  // ================= 全螢幕與視窗尺寸 =================
  // iPad 旋轉後，用實際的視窗大小重新設定版面（避免橫放時沿用直放的尺寸而被裁切）
  function syncViewport() {
    var de = document.documentElement;
    de.style.setProperty("--vw", window.innerWidth + "px");
    de.style.setProperty("--vh", window.innerHeight + "px");
  }
  syncViewport();
  window.addEventListener("resize", syncViewport);
  window.addEventListener("orientationchange", function () { syncViewport(); setTimeout(syncViewport, 300); setTimeout(syncViewport, 800); });
  function isStandalone() { return window.navigator.standalone === true || (window.matchMedia && window.matchMedia("(display-mode: standalone)").matches); }
  function fsElement() { return document.fullscreenElement || document.webkitFullscreenElement; }
  function fsSupported() { return !!(document.fullscreenEnabled || document.webkitFullscreenEnabled); }
  function fsButton() { return isStandalone() ? "" : '<button class="btn ghost small" data-k="fs">' + (fsElement() ? "🗗 離開全螢幕" : "⛶ 全螢幕") + "</button>"; }
  function toggleFullscreen() {
    var de = document.documentElement;
    try {
      if (fsElement()) { (document.exitFullscreen || document.webkitExitFullscreen).call(document); return; }
      if (fsSupported()) { var r = (de.requestFullscreen || de.webkitRequestFullscreen).call(de); if (r && r.catch) r.catch(fsHelp); return; }
    } catch (e) { }
    fsHelp();
  }
  function fsHelp() {
    var s = openSheet("<h2>⛶ 怎麼全螢幕玩？</h2><p>這個瀏覽器不讓網頁切換成全螢幕。最穩定的方法是把遊戲<b>加到 iPad 主畫面</b>：</p>" +
      "<ol><li>用 <b>Safari</b> 打開這個遊戲網址。</li><li>按網址列旁的「分享」按鈕 <b>⬆︎</b>。</li><li>選「<b>加入主畫面</b>」。</li><li>之後從主畫面的圖示打開，就會是全螢幕，沒有網址列。</li></ol>" +
      '<p class="sub" style="color:#6c5a44">進度一樣只存在這台 iPad；從主畫面圖示開啟時，進度和 Safari 裡的是分開的。</p><div class="actions"><button class="btn primary" data-k="ok">知道了</button></div>');
    on(s, "[data-k=ok]", closeSheet);
  }
  // 所有畫面的全螢幕按鈕都由這裡處理
  document.addEventListener("click", function (e) {
    var b = e.target.closest && e.target.closest("[data-k=fs]");
    if (b) { toggleFullscreen(); setTimeout(function () { document.querySelectorAll("[data-k=fs]").forEach(function (x) { x.textContent = fsElement() ? "🗗 離開全螢幕" : "⛶ 全螢幕"; }); }, 400); }
  });

  // ================= 所長剪影 =================
  var BOSS_SVG = '<svg viewBox="0 0 120 140" aria-label="所長剪影"><g fill="#0b0b10">' +
    '<path d="M8 140 C12 110 32 99 60 99 C88 99 108 110 112 140 Z"/>' +
    '<rect x="50" y="82" width="20" height="22"/>' +
    '<ellipse cx="60" cy="64" rx="23" ry="27"/>' +
    '<path d="M34 62 C29 50 30 36 38 29 C42 20 52 16 60 18 C67 14 78 18 83 26 C91 31 93 44 88 58 C86 52 84 49 81 49 C80 45 77 43 73 44 C70 40 65 40 62 43 C58 39 52 40 50 44 C46 42 41 45 40 50 C37 51 35 56 34 62 Z"/>' +
    '<path d="M36 34 C40 28 44 30 46 26 C50 30 54 24 58 27 C62 22 66 27 70 24 C73 29 78 26 81 31 C84 30 87 34 86 38 C80 33 40 33 36 34 Z"/>' +
    '<path d="M50 99 L60 113 L70 99 L65 97 L60 105 L55 97 Z" fill="#1c1c26"/></g>' +
    '<g fill="none" stroke="#f3dfa0" stroke-width="1.8" opacity=".9"><circle cx="51" cy="66" r="6.5"/><circle cx="69" cy="66" r="6.5"/><path d="M57.5 66 h5"/></g>' +
    '<path d="M47 63 l4 -2.5 M65 63 l4 -2.5" stroke="#fff" stroke-width="1.6" stroke-linecap="round"/></svg>';
  function bossTalk(text) { return '<div class="boss-talk">' + BOSS_SVG + '<div class="bubble">' + text + "</div></div>"; }

  // ================= 題庫存取 =================
  function unitInfo(subject, unit) { return window.FC_unitInfo(subject, unit); }
  function sourceLine(q) {
    var u = unitInfo(q.subject, q.unit);
    return "📍 " + esc(u.label) + " " + esc(u.name) + (u.comic ? "　｜　📖 漫畫《" + esc(u.comic) + "》" : "");
  }
  function hasQuestions(subject) { return BANK.qs.some(function (q) { return q.subject === subject; }); }
  function qById(id) { for (var i = 0; i < BANK.qs.length; i++) if (BANK.qs[i].id === id) return BANK.qs[i]; return null; }
  function conceptQs(concept) { return BANK.qs.filter(function (q) { return q.concept === concept; }); }

  // 把題目變成「這一次出題」的樣子：選項重新洗牌、數學模板重新產生數字
  function instantiate(q) {
    var o = q;
    if (q.isTemplate) { o = q.gen(); }
    var L = { q: q, type: q.type, stem: o.stem, explain: o.explain || q.explain, level: q.level };
    if (q.type === "choice") {
      var perm = shuffle([0, 1, 2, 3]);
      L.options = perm.map(function (i) { return o.options[i]; });
      L.traps = perm.map(function (i) { return o.traps[i]; });
      L.answerIdx = perm.indexOf(o.answer);
      L.answerText = o.options[o.answer];
    } else if (q.type === "number") {
      L.answer = o.answer; L.answerText = String(o.answer); L.traps = o.traps; L.trapValues = o.trapValues || []; L.unitText = o.unit || "";
    } else if (q.type === "spell") {
      L.answer = o.answer; L.answerText = o.answer; L.mask = o.spellMask; L.traps = o.traps;
    }
    return L;
  }

  // 依條件挑一題（避開這一輪用過的題目與剛出過的考點）
  function chooseQuestion(opts) {
    var pool = BANK.qs.filter(function (q) {
      if (q.subject !== opts.subject) return false;
      if (opts.units && opts.units.indexOf(q.unit) < 0) return false;
      if (opts.types && opts.types.indexOf(q.type) < 0) return false;
      return true;
    });
    if (!pool.length) return null;
    var used = opts.used || {};
    var fresh = pool.filter(function (q) { return q.isTemplate ? (used[q.id] || 0) < 2 : !used[q.id]; });
    if (!fresh.length) { for (var k in used) delete used[k]; fresh = pool; }
    var noRepeat = fresh.filter(function (q) { return q.concept !== opts.lastConcept; });
    if (noRepeat.length) fresh = noRepeat;
    var wantLv = Math.random() < (opts.p2 || 0.3) ? 2 : 1;
    var byLv = fresh.filter(function (q) { return q.level === wantLv; });
    return pick(byLv.length ? byLv : fresh);
  }

  // 同一考點的「變式題」：優先挑學生還沒看過的
  function variantFor(concept, seen, avoidId, types) {
    var list = conceptQs(concept).filter(function (q) { return !types || types.indexOf(q.type) >= 0; });
    if (!list.length) list = conceptQs(concept);
    if (!list.length) return null;
    if (list[0].isTemplate) return list[0];
    var unseen = list.filter(function (q) { return seen.indexOf(q.id) < 0; });
    if (unseen.length) return pick(unseen);
    var notLast = list.filter(function (q) { return q.id !== avoidId; });
    return pick(notLast.length ? notLast : list);
  }

  // 提示：只點出考點與一個常見迷思，絕不給答案
  function hintFor(L) {
    var traps = (L.traps || []).filter(function (t) { return t; });
    var t = traps.length ? pick(traps) : "";
    return "考點：" + esc(L.q.conceptName) + (t ? "<br>小心這個迷思：「" + rich(t) + "」" : "");
  }

  // ================= 懸案卷宗 =================
  function recordCase(L, givenText, givenIdx) {
    var q = L.q, c = save.cases[q.concept];
    if (!c) {
      c = save.cases[q.concept] = { concept: q.concept, subject: q.subject, unit: q.unit, conceptName: q.conceptName,
        wrong: 0, status: "open", createdRound: save.round, createdDay: today(), seen: [] };
    }
    if (c.status === "closed") { c.status = "open"; c.createdRound = save.round; }
    c.wrong++;
    if (!q.isTemplate && c.seen.indexOf(q.id) < 0) c.seen.push(q.id);
    c.snap = { id: q.id, stem: L.stem, options: L.options || null, answer: L.answerText, given: givenText,
      explain: L.explain, trap: (givenIdx != null && L.traps) ? L.traps[givenIdx] : null, traps: (L.traps || []).filter(function (t) { return t; }) };
    persist();
    return c;
  }
  function markSeen(concept, id) { var c = save.cases[concept]; if (c && c.seen.indexOf(id) < 0) { c.seen.push(id); persist(); } }

  // 結案：發破案勳章（同一考點一天最多 1 次；陳年懸案 +1）
  function closeCase(concept) {
    var c = save.cases[concept];
    if (!c || c.status === "closed") return null;
    c.status = "closed"; c.closedDay = today();
    var res = { medals: 0, old: false, cleared: null };
    if (save.medalLog[concept] !== today()) {
      res.medals = 1;
      if (c.createdRound < save.round) { res.medals += 1; res.old = true; }
      save.medalLog[concept] = today();
      save.medals += res.medals;
    }
    var anyOpen = false, any = false;
    for (var k in save.cases) { var x = save.cases[k]; if (x.subject === c.subject) { any = true; if (x.status === "open") anyOpen = true; } }
    if (any && !anyOpen) res.cleared = c.subject;
    persist();
    if (res.medals) toast("🏅 破案勳章 +" + res.medals + (res.old ? "（陳年懸案加碼！）" : ""));
    else toast("📁 結案！（這個考點今天已經拿過勳章了）");
    return res;
  }
  function openCount(subject) { var n = 0; for (var k in save.cases) { var c = save.cases[k]; if (c.status === "open" && (!subject || c.subject === subject)) n++; } return n; }

  var CLEAR_MSG = {
    math: "數學檔案區的懸案全部結案！數字迷宮再也困不住你了。這份功勞，我記在事務所的帳本上。",
    science: "自然檔案區的霧散了！熱怎麼跑、天氣怎麼變，你都看得清清楚楚。了不起的調查員。",
    social: "社會檔案區清空了！夜市帳本和時光相簿都回到正確的位置。謝謝你。",
    english: "英文檔案區的信都送到了！世界各地的筆友會收到你的回信。Good job!"
  };
  function maybeClearedMsg(res, then) {
    if (res && res.cleared) {
      var s = openSheet("<h2>📜 所長的嘉獎令</h2>" + bossTalk("<b>" + SUBJ[res.cleared].name + "懸案清零！</b><br>" + CLEAR_MSG[res.cleared]) +
        '<div class="actions"><button class="btn primary" data-k="ok">收下嘉獎</button></div>');
      beep("win");
      on(s, "[data-k=ok]", function () { closeSheet(); then(); });
    } else then();
  }

  // ================= 勳章解鎖 =================
  var TITLES = [[0, "見習調查員"], [3, "線索蒐集者"], [8, "懸案追查員"], [15, "霧散偵探"], [25, "檔案庫守護者"], [40, "傳說級調查員"]];
  var FRAMES = [[0, ""], [5, "frame-silver"], [12, "frame-gold"], [20, "frame-crystal"]];
  function unlocked(list) { var r = list[0][1]; list.forEach(function (x) { if (save.medals >= x[0]) r = x[1]; }); return r; }
  var START_RELIC_AT = 3;

  // ================= 遺物與道具 =================
  // 原則：只減輕懲罰或給提示，絕不直接給答案或跳過題目
  var RELICS = {
    lens:   { icon: "🔍", name: "放大鏡", d: function (lv) { return "每場戰鬥可以刪去 1 個錯誤選項" + (lv > 1 ? "（可用 2 次）" : "一次"); } },
    watch:  { icon: "⏱️", name: "所長的懷錶", d: function (lv) { return "每場戰鬥前 " + lv + " 次答錯不扣血"; } },
    combo:  { icon: "🎖️", name: "連擊徽章", d: function (lv) { return "連續答對 " + (lv > 1 ? 2 : 3) + " 題以上，傷害加倍"; } },
    notes:  { icon: "📒", name: "調查筆記", d: function (lv) { return lv > 1 ? "每一題都附上考點提示" : "懸案怨靈出現時附上提示"; } },
    magnet: { icon: "🧲", name: "線索磁鐵", d: function (lv) { return "答對獲得的線索幣 +" + (lv * 50) + "%"; } },
    folder: { icon: "📚", name: "厚卷宗", d: function (lv) { return "最大血量 +" + (lv * 10); } },
    lamp:   { icon: "🪔", name: "檯燈", d: function (lv) { return "每場戰鬥勝利回復 " + (lv * 3) + " 血"; } },
    seal:   { icon: "🔴", name: "紅色印章", d: function (lv) { return "對 Boss 的傷害 +" + (lv * 5); } },
    kraft:  { icon: "🛡️", name: "牛皮紙盾", d: function (lv) { return "每場戰鬥開始時有 " + (lv * 5) + " 點護盾"; } },
    hat:    { icon: "🎩", name: "偵探帽", d: function (lv) { return "強敵戰勝利多得 " + (lv * 15) + " 線索幣"; } },
    fogl:   { icon: "🔦", name: "霧燈", d: function (lv) { return "敵人的攻擊 -" + lv; } },
    clip:   { icon: "📎", name: "迴紋針", d: function (lv) { return "錯因診斷答對，線索幣獎勵 ×" + (lv + 1); } },
    memo:   { icon: "🗒️", name: "備忘便條", d: function (lv) { return "答錯後的下一題答對，傷害 +" + (lv * 5); } },
    pig:    { icon: "🐷", name: "存錢筒", d: function (lv) { return "每走到一個新地點，線索幣 +" + (lv * 3); } }
  };
  var ITEMS = {
    potion: { icon: "🧪", name: "回復藥", d: "回復 12 血", price: 15 },
    hintc:  { icon: "💡", name: "提示卡", d: "顯示一句考點提示（不會給答案）", price: 12 },
    shield: { icon: "🔰", name: "護盾", d: "擋下一次傷害", price: 15 }
  };

  // ================= 一輪闖關 =================
  var run = null;
  var BASE_HP = 40, ROWS = 8;
  var NODE = {
    battle: { icon: "🌫️", name: "調查戰" }, elite: { icon: "👁️", name: "強敵戰" }, event: { icon: "❓", name: "證人事件" },
    shop: { icon: "🏪", name: "所長補給站" }, rest: { icon: "☕", name: "休息點" }, chest: { icon: "🗃️", name: "機密寶箱" }, boss: { icon: "💀", name: "幕後黑手" }
  };
  // 闖關進度存進存檔：重新整理或關掉頁面後可以接續（戰鬥中也會記下敵人血量）
  function saveRun() { if (run) { save.run = run; persist(); } }
  function clearRun() { save.run = null; persist(); }
  function resumeRun() {
    run = save.run;
    if (run.battle) startBattle(run.battle.kind, null, run.battle);
    else if (run.at) enterNode(run.at);
    else renderMap();
  }
  function pauseMenu() {
    var s = openSheet('<h2>⏸ 暫停調查</h2><p>進度會自動保存。回事務所後，可以隨時從主畫面「繼續調查」接著玩。</p>' +
      '<div class="choice-cards"><button class="choice-card" data-k="resume"><b>▶️ 繼續調查</b></button>' +
      '<button class="choice-card" data-k="office"><b>🏠 回事務所（保留進度）</b><br>先去懸案調查室或做別的事，等一下再回來。</button>' +
      '<button class="choice-card" data-k="giveup"><b>🏳️ 放棄這一輪</b><br>已經建檔的懸案會留在懸案卷宗裡。</button></div>');
    on(s, "[data-k=resume]", closeSheet);
    on(s, "[data-k=office]", function () { saveRun(); closeSheet(); run = null; hub(); });
    on(s, "[data-k=giveup]", function () {
      var s2 = openSheet('<h2>確定要放棄這一輪嗎？</h2><div class="actions"><button class="btn" data-k="no">不要，繼續調查</button><button class="btn red" data-k="yes">放棄</button></div>');
      on(s2, "[data-k=no]", closeSheet);
      on(s2, "[data-k=yes]", function () { closeSheet(); endRun(false); });
    });
  }
  function relicLv(id) { if (!run) return 0; for (var i = 0; i < run.relics.length; i++) if (run.relics[i].id === id) return run.relics[i].lv; return 0; }
  function maxHp() { return BASE_HP + relicLv("folder") * 10 + (run && run.bonusHp ? run.bonusHp : 0); }

  function genMap() {
    var rows = [];
    for (var r = 0; r < ROWS - 1; r++) {
      var n = 2 + rnd(2), types;
      if (r === 0) types = ["battle", "battle", "battle"];
      else if (r <= 2) types = shuffle(["battle", "battle", "event", "chest", "shop"]);
      else if (r === ROWS - 2) types = shuffle(["rest", "shop", "rest"]);
      else types = shuffle(["battle", "elite", "event", "rest", "shop", "battle", "elite"]);
      var row = [], seen = {};
      for (var i = 0; i < types.length && row.length < n; i++) {
        if (seen[types[i]] && types[i] !== "battle") continue;
        seen[types[i]] = 1; row.push({ type: types[i] });
      }
      // 中間每一排至少要有一場戰鬥，維持答題量
      if (r >= 1 && r <= ROWS - 3 && !row.some(function (n) { return n.type === "battle" || n.type === "elite"; })) row[0] = { type: "battle" };
      rows.push(row);
    }
    rows.push([{ type: "boss" }]);
    return rows;
  }

  function startRun(subject, units) {
    save.round++; persist();
    run = { subject: subject, units: units, hp: BASE_HP, coins: 10, relics: [], items: ["potion"], map: genMap(), row: -1, col: -1,
      used: {}, lastConcept: null, ghosts: [], answered: 0, correct: 0, ghostsResolved: 0, diagRight: 0, diagTotal: 0, combo: 0,
      startMedals: save.medals, round: save.round, battle: null, at: null };
    saveRun();
    var brief = {
      math: "數學檔案區的數字被殘霧攪亂了。從大露營到果汁店，五個案件的重點等你重新整理。",
      science: "自然檔案區的霧最濃。天燈為什麼會飛？颱風前夜的天氣圖藏著什麼？去查清楚。",
      social: "社會檔案區的夜市帳本和時光相簿又被弄亂了。把每一條線索放回正確的位置。",
      english: "英文檔案區的筆友信被殘霧捲走了。讀懂每一封信，把回信送回世界各地。"
    }[subject];
    show('<div class="lamp-glow"></div><div class="folder" data-tab="委託書 ' + esc(SUBJ[subject].area) + '">' + bossTalk(brief + "<br>答錯不要緊——錯的題目會變成懸案，弄懂它就能破案。") +
      '<div class="actions row" style="margin-top:14px;justify-content:flex-end"><button class="btn primary" data-k="go">接下委託 ➜</button></div></div>');
    on(app, "[data-k=go]", function () {
      if (save.medals >= START_RELIC_AT) chooseRelic("🏅 破案勳章特權：選一個起始遺物", 3, renderMap);
      else renderMap();
    });
  }

  function statbarHtml() {
    var rel = run.relics.map(function (r) { var R = RELICS[r.id]; return '<button class="relic-chip" data-relic="' + r.id + '">' + R.icon + (r.lv > 1 ? "<sup>+</sup>" : "") + "</button>"; }).join("");
    var hp = Math.max(0, run.hp), mh = maxHp();
    return '<div class="statbar"><span class="pill">' + SUBJ[run.subject].icon + " " + SUBJ[run.subject].name + '</span>' +
      '<div class="hpbar"><i style="width:' + (hp / mh * 100) + '%"></i><span>❤️ ' + hp + " / " + mh + "</span></div>" +
      '<span class="pill">🪙 ' + run.coins + '</span><span class="pill">👻 懸案怨靈 ' + run.ghosts.length + "</span></div>" +
      '<div class="row" style="margin-top:6px"><div class="relic-row">' + rel + "</div></div>";
  }
  function bindRelicInfo(root) {
    on(root, "[data-relic]", function () {
      var id = this.getAttribute("data-relic"), R = RELICS[id], lv = relicLv(id);
      toast(R.icon + " " + R.name + (lv > 1 ? "（強化）" : "") + "：" + R.d(lv));
    });
  }

  function renderMap() {
    closeSheet();
    var nextRow = run.row + 1;
    run.battle = null; run.at = null; saveRun();
    var html = '<div class="split maplay"><div class="b-side"><div class="topbar"><button class="btn ghost small" data-k="pause">⏸ 暫停</button><div class="spacer"></div>' + fsButton() + "</div>" + statbarHtml() +
      '<h2 style="margin-top:12px">🗺️ 調查路線</h2><p class="sub">選一個亮起來的地點前進。最上面是幕後黑手。</p>' + itemBarHtml(false) +
      '<p class="legend">🌫️調查戰 3 題｜👁️強敵戰 5 題（贏了選遺物）｜❓證人事件｜🏪補給站｜☕休息點｜🗃️寶箱｜💀Boss</p></div><div class="b-main"><div class="map">';
    run.map.forEach(function (row, r) {
      html += '<div class="map-row"><span class="rn">' + (r + 1) + "</span>";
      row.forEach(function (n, c) {
        var cls = "node" + (n.type === "boss" ? " boss" : "");
        if (r === nextRow) cls += " avail";
        else if (r === run.row && c === run.col) cls += " cur";
        else if (r <= run.row) cls += " done";
        html += '<button class="' + cls + '" data-r="' + r + '" data-c="' + c + '"' + (r === nextRow ? "" : " disabled") + ">" + NODE[n.type].icon + "<small>" + NODE[n.type].name + "</small></button>";
      });
      html += "</div>";
    });
    html += "</div></div></div>";
    show(html);
    drawStrings();
    bindRelicInfo(app); bindItems(app, null);
    on(app, "[data-k=pause]", pauseMenu);
    on(app, ".node.avail", function () {
      run.row = +this.getAttribute("data-r"); run.col = +this.getAttribute("data-c");
      if (relicLv("pig")) run.coins += relicLv("pig") * 3;
      enterNode(run.map[run.row][run.col].type);
    });
  }

  // 像偵探牆一樣，用紅線把目前位置連到下一排可去的地點
  function drawStrings() {
    var map = app.querySelector(".map"); if (!map) return;
    var mr = map.getBoundingClientRect(), from = map.querySelector(".node.cur"), fx, fy;
    if (from) { var fr = from.getBoundingClientRect(); fx = fr.left + fr.width / 2 - mr.left; fy = fr.top - mr.top + 4; }
    else { fx = mr.width / 2; fy = mr.height + 6; }
    var paths = "";
    map.querySelectorAll(".node.avail").forEach(function (n) {
      var r = n.getBoundingClientRect(), x = r.left + r.width / 2 - mr.left, y = r.bottom - mr.top - 4;
      paths += '<path d="M' + fx + " " + fy + " Q" + (fx + x) / 2 + " " + ((fy + y) / 2 + 14) + " " + x + " " + y + '"/>';
    });
    map.appendChild(h('<svg class="strings" width="' + mr.width + '" height="' + (mr.height + 10) + '">' + paths + "</svg>"));
  }
  function enterNode(type) {
    run.at = (type === "shop" || type === "rest" || type === "event") ? type : null; saveRun();
    if (type === "battle") startBattle("normal");
    else if (type === "elite") startBattle("elite");
    else if (type === "boss") startBattle("boss");
    else if (type === "shop") shopNode();
    else if (type === "rest") restNode();
    else if (type === "chest") chestNode();
    else if (type === "event") eventNode();
  }

  function itemBarHtml(inBattle) {
    if (!run.items.length) return '<p class="sub">道具：（沒有）</p>';
    return '<div class="row" style="margin-top:8px"><span class="sub">道具（最多 3 個）：</span>' + run.items.map(function (id, i) {
      var I = ITEMS[id]; var usable = id === "potion" || (inBattle && id !== "shield");
      return '<button class="item-btn" data-item="' + i + '"' + (usable ? "" : ' data-info="1"') + ">" + I.icon + " " + I.name + "</button>";
    }).join("") + "</div>";
  }
  function bindItems(root, battleCtx) {
    on(root, "[data-item]", function () {
      var i = +this.getAttribute("data-item"), id = run.items[i];
      if (id === "potion") {
        if (run.hp >= maxHp()) { toast("血量是滿的"); return; }
        run.hp = Math.min(maxHp(), run.hp + 12); run.items.splice(i, 1); toast("🧪 回復 12 血");
        battleCtx ? battleCtx.refresh() : renderMap();
      } else if (id === "hintc" && battleCtx) {
        if (!battleCtx.useHint()) return;
        run.items.splice(i, 1);
      } else if (id === "shield") toast("🔰 護盾會在下一次受到傷害時自動使用");
      else toast(ITEMS[id].icon + " " + ITEMS[id].name + "：" + ITEMS[id].d);
    });
  }
  function addItem(id) {
    if (run.items.length >= 3) { toast("道具已經帶滿 3 個了"); return false; }
    run.items.push(id); toast(ITEMS[id].icon + " 獲得 " + ITEMS[id].name); return true;
  }
  function addRelic(id) {
    var lv = relicLv(id);
    if (lv) { upgradeRelic(id); return; }
    run.relics.push({ id: id, lv: 1 });
    if (id === "folder") run.hp += 10;
    toast(RELICS[id].icon + " 獲得遺物：" + RELICS[id].name);
  }
  function upgradeRelic(id) {
    run.relics.forEach(function (r) { if (r.id === id && r.lv < 2) { r.lv = 2; if (id === "folder") run.hp += 10; } });
    toast(RELICS[id].icon + " " + RELICS[id].name + " 強化完成！");
  }
  function chooseRelic(title, n, then) {
    var owned = run.relics.map(function (r) { return r.id; });
    var cand = shuffle(Object.keys(RELICS).filter(function (k) { return owned.indexOf(k) < 0; })).slice(0, n);
    if (!cand.length) { run.coins += 20; toast("遺物都收集齊了！改拿 20 線索幣"); then(); return; }
    var s = openSheet("<h2>" + title + '</h2><div class="choice-cards">' + cand.map(function (id) {
      var R = RELICS[id]; return '<button class="choice-card" data-id="' + id + '"><b>' + R.icon + " " + R.name + "</b><br>" + R.d(1) + "</button>";
    }).join("") + "</div>");
    on(s, "[data-id]", function () { addRelic(this.getAttribute("data-id")); closeSheet(); then(); });
  }

  // ---------- 商店 ----------
  function shopNode() {
    var owned = run.relics.map(function (r) { return r.id; });
    var relicsForSale = shuffle(Object.keys(RELICS).filter(function (k) { return owned.indexOf(k) < 0; })).slice(0, 2);
    var stock = [{ k: "item", id: "potion" }, { k: "item", id: "hintc" }, { k: "item", id: "shield" }, { k: "heal", price: 18 }]
      .concat(relicsForSale.map(function (id) { return { k: "relic", id: id, price: 40 + rnd(3) * 5 }; }));
    function draw() {
      var html = '<div class="lamp-glow"></div>' + statbarHtml() + '<div class="folder" data-tab="所長補給站">' +
        bossTalk("需要什麼就拿吧，用你辛苦找到的<b>線索幣</b>換。") + '<div class="choice-cards" style="margin-top:12px">';
      stock.forEach(function (s, i) {
        if (s.sold) return;
        var label, price;
        if (s.k === "item") { var I = ITEMS[s.id]; label = I.icon + " " + I.name + "｜" + I.d; price = I.price; }
        else if (s.k === "heal") { label = "🩹 修補卷宗｜回復 15 血"; price = s.price; }
        else { var R = RELICS[s.id]; label = R.icon + " 遺物：" + R.name + "｜" + R.d(1); price = s.price; }
        html += '<button class="choice-card" data-i="' + i + '"' + (run.coins < price ? " disabled style=\"opacity:.5\"" : "") + "><b>🪙 " + price + "</b>　" + label + "</button>";
      });
      html += '</div><div class="row" style="justify-content:flex-end;margin-top:12px"><button class="btn primary" data-k="leave">離開補給站 ➜</button></div></div>';
      show(html); bindRelicInfo(app);
      on(app, "[data-i]", function () {
        var s = stock[+this.getAttribute("data-i")];
        var price = s.k === "item" ? ITEMS[s.id].price : s.price;
        if (run.coins < price) return;
        if (s.k === "item") { if (!addItem(s.id)) return; }
        else if (s.k === "heal") { if (run.hp >= maxHp()) { toast("血量是滿的"); return; } run.hp = Math.min(maxHp(), run.hp + 15); toast("🩹 回復 15 血"); }
        else addRelic(s.id);
        run.coins -= price; if (s.k !== "item") s.sold = true; beep("tap"); draw();
      });
      on(app, "[data-k=leave]", renderMap);
    }
    draw();
  }

  // ---------- 休息點 ----------
  function restNode() {
    var heal = Math.round(maxHp() * 0.35);
    var up = run.relics.filter(function (r) { return r.lv < 2; });
    show('<div class="lamp-glow"></div>' + statbarHtml() + '<div class="folder" data-tab="休息點">' +
      "<h2>☕ 檯燈下的休息時間</h2><p>二選一：</p>" +
      '<div class="choice-cards"><button class="choice-card" data-k="heal"><b>😴 好好休息</b><br>回復 ' + heal + " 血</button>" +
      '<button class="choice-card" data-k="up"' + (up.length ? "" : ' disabled style="opacity:.5"') + "><b>🔧 整理裝備</b><br>強化一個遺物" + (up.length ? "" : "（目前沒有可以強化的遺物）") + "</button></div></div>");
    bindRelicInfo(app);
    on(app, "[data-k=heal]", function () { run.hp = Math.min(maxHp(), run.hp + heal); toast("回復 " + heal + " 血"); renderMap(); });
    on(app, "[data-k=up]", function () {
      var s = openSheet('<h2>強化哪一個遺物？</h2><div class="choice-cards">' + up.map(function (r) {
        var R = RELICS[r.id]; return '<button class="choice-card" data-id="' + r.id + '"><b>' + R.icon + " " + R.name + "</b><br>強化後：" + R.d(2) + "</button>";
      }).join("") + "</div>");
      on(s, "[data-id]", function () { upgradeRelic(this.getAttribute("data-id")); closeSheet(); renderMap(); });
    });
  }

  // ---------- 寶箱 ----------
  function chestNode() {
    var r = Math.random(), msg;
    if (r < 0.55) { var c = 15 + rnd(4) * 5; run.coins += c; msg = "🪙 找到 " + c + " 線索幣！"; }
    else { var id = pick(Object.keys(ITEMS)); msg = run.items.length < 3 ? ITEMS[id].icon + " 找到道具：" + ITEMS[id].name : "🪙 道具帶滿了，改拿 15 線索幣"; if (run.items.length < 3) run.items.push(id); else run.coins += 15; }
    run.at = null; saveRun();
    show('<div class="lamp-glow"></div>' + statbarHtml() + '<div class="folder center" data-tab="機密寶箱"><div style="font-size:70px">🗃️</div><h2>' + msg + '</h2><button class="btn primary" data-k="ok">收下 ➜</button></div>');
    beep("ok"); on(app, "[data-k=ok]", renderMap);
  }

  // ---------- 證人事件 ----------
  var EVENTS = [
    { who: "🕵️ 神秘證人", say: "「我知道一條重要線索……不過，你得先答對我出的難題。」",
      risk: "回答一題進階題：答對得到一個遺物；答錯扣 6 血", safe: "不冒險，拿 8 線索幣就好",
      win: function () { chooseRelic("神秘證人給你一個遺物", 3, renderMap); return true; }, lose: function () { hurt(6); }, safeDo: function () { run.coins += 8; } },
    { who: "📮 迷路的郵差", say: "「我的郵包被霧弄亂了，你能幫我分類嗎？謝禮少不了你的！」",
      risk: "回答一題進階題：答對得到 30 線索幣；答錯失去 10 線索幣", safe: "幫他指路就好：回復 6 血",
      win: function () { run.coins += 30; toast("🪙 +30"); }, lose: function () { run.coins = Math.max(0, run.coins - 10); toast("🪙 -10"); },
      safeDo: function () { run.hp = Math.min(maxHp(), run.hp + 6); toast("回復 6 血"); } },
    { who: "🪧 霧中的告示牌", say: "告示牌上的字被霧遮住了一半，好像寫著某個重點……",
      risk: "回答一題進階題：答對最大血量 +6；答錯扣 5 血", safe: "繞過去：拿一張提示卡",
      win: function () { run.bonusHp = (run.bonusHp || 0) + 6; run.hp += 6; toast("❤️ 最大血量 +6"); }, lose: function () { hurt(5); },
      safeDo: function () { addItem("hintc"); } }
  ];
  function hurt(n) { run.hp -= n; toast("💥 -" + n + " 血"); }
  function eventNode() {
    var ev = pick(EVENTS);
    show('<div class="lamp-glow"></div>' + statbarHtml() + '<div class="folder" data-tab="證人事件"><h2>' + ev.who + "</h2><p>" + ev.say + '</p><div class="choice-cards">' +
      '<button class="choice-card" data-k="risk"><b>⚡ 冒險</b><br>' + ev.risk + '</button><button class="choice-card" data-k="safe"><b>🛟 保守</b><br>' + ev.safe + "</button></div></div>");
    on(app, "[data-k=safe]", function () { ev.safeDo(); renderMap(); });
    on(app, "[data-k=risk]", function () {
      var q = chooseQuestion({ subject: run.subject, units: run.units, used: run.used, p2: 1, lastConcept: run.lastConcept, types: ["choice", "number"] });
      startBattle("event", { q: q, onEnd: function (ok) {
        if (ok) { var waitsForSheet = ev.win(); if (!waitsForSheet) renderMap(); }
        else { ev.lose(); if (run.hp <= 0) endRun(false); else renderMap(); }
      } });
    });
  }

  // ================= 戰鬥 =================
  var FOES = {
    normal: [{ n: "殘霧", hp: 30, atk: 4 }, { n: "迷途霧影", hp: 30, atk: 4 }, { n: "糊塗霧團", hp: 30, atk: 4 }],
    elite: [{ n: "濃霧守衛", hp: 50, atk: 6 }, { n: "雙眼霧怪", hp: 50, atk: 6 }],
    boss: [{ n: "霧核", hp: 60, atk: 7 }]
  };

  function startBattle(kind, eventCfg, resume) {
    var isEvent = kind === "event";
    var f = isEvent ? null : pick(FOES[kind]);
    var B = { kind: kind, foe: f ? { name: f.n, hp: f.hp, max: f.hp, atk: f.atk } : null, lensLeft: relicLv("lens") ? relicLv("lens") : 0,
      watchLeft: relicLv("watch"), block: relicLv("kraft") * 5, phase: 1, shield: false, shieldStreak: 0, afterWrong: false, cur: null, busy: false };
    var KEEP = ["foe", "lensLeft", "watchLeft", "block", "phase", "shield", "shieldStreak", "afterWrong"];
    function snap() {
      if (isEvent) return;
      var o = { kind: kind }; KEEP.forEach(function (k) { o[k] = B[k]; });
      run.battle = o; saveRun();
    }
    if (resume) KEEP.forEach(function (k) { if (resume[k] !== undefined) B[k] = resume[k]; });
    else if (kind === "boss") {
      var g = run.ghosts.length;
      B.foe.name = SUBJ[run.subject].name + "檔案的霧核";
      B.foe.hp = B.foe.max = 60 + g * 10; B.foe.atk = 7 + g;
      if (g) toast("👻 還沒解除的懸案怨靈 " + g + " 隻，讓霧核變強了！");
    }
    snap();
    var self = {
      refresh: function () { draw(); },
      useHint: function () {
        if (!B.cur || B.answered) { toast("題目出現後才能用"); return false; }
        if (B.hintShown) { toast("這題已經有提示了"); return false; }
        B.hintShown = true; draw(); return true;
      }
    };

    function nextQuestion() {
      B.answered = false; B.hintShown = false; B.removed = [];
      var L, ghost = null;
      if (isEvent) { L = instantiate(eventCfg.q); }
      else {
        for (var i = 0; i < run.ghosts.length; i++) if (run.ghosts[i].readyAt <= run.answered) { ghost = run.ghosts[i]; break; }
        if (ghost) {
          var c = save.cases[ghost.concept];
          var seen = (c ? c.seen : []).concat(Object.keys(run.used));
          var vq = variantFor(ghost.concept, seen, ghost.lastId, ["choice", "number", "spell"]);
          L = instantiate(vq);
          if (vq.isTemplate && c && c.snap && L.stem === c.snap.stem) L = instantiate(vq);
          L.ghost = ghost;
        } else {
          var p2 = kind === "boss" ? 0.6 : Math.min(0.75, 0.15 + run.row * 0.09);
          var q = chooseQuestion({ subject: run.subject, units: run.units, used: run.used, p2: p2, lastConcept: run.lastConcept });
          L = instantiate(q);
        }
      }
      if (L.q.isTemplate) run.used[L.q.id] = (run.used[L.q.id] || 0) + 1; else run.used[L.q.id] = 1;
      run.lastConcept = L.q.concept;
      B.cur = L; B.spell = []; B.tiles = null; B.num = "";
      window.FC_cur = L;
      if (L.ghost && relicLv("notes")) B.hintShown = true;
      if (relicLv("notes") > 1) B.hintShown = true;
      draw();
    }

    function foeHtml() {
      if (!B.foe) return '<div class="foe"><div style="font-size:64px">' + (isEvent ? "❓" : "") + "</div></div>";
      var cls = "fog " + (B.kind === "boss" ? "boss" : B.kind === "elite" ? "elite" : "") + (B.cur && B.cur.ghost ? " ghost" : "");
      var name = B.cur && B.cur.ghost ? "👻 懸案怨靈（" + esc(B.cur.q.conceptName) + "）" : esc(B.foe.name);
      return '<div class="foe"><div class="fname">' + name + (B.shield ? "　🛡️護盾 " + B.shieldStreak + "/2" : "") + '</div><div class="' + cls + '" id="foe">' +
        '<div class="puff p2"></div><div class="puff p3"></div><div class="puff p1"></div><div class="puff p4"></div><div class="eyes"><div class="eye"></div><div class="eye"></div></div>' +
        (B.cur && B.cur.ghost ? '<div class="tag">懸</div>' : "") + (B.shield ? '<div class="shield-ring"></div>' : "") + "</div>" +
        '<div class="hpbar enemy"><i style="width:' + (Math.max(0, B.foe.hp) / B.foe.max * 100) + '%"></i><span>' + Math.max(0, B.foe.hp) + " / " + B.foe.max + "</span></div></div>";
    }

    function questionHtml() {
      var L = B.cur, u = unitInfo(L.q.subject, L.q.unit);
      var head = '<div class="qhead"><span>' + esc(u.label) + "</span>" + (L.level === 2 ? '<span class="lv2">進階</span>' : "") + (L.ghost ? '<span class="gtag">懸案怨靈：同考點的新題目</span>' : "") + "</div>";
      var hint = B.hintShown ? '<div class="hint">💡 ' + hintFor(L) + "</div>" : "";
      var body = "";
      if (L.type === "choice") {
        var long = L.options.some(function (o) { return o.length > 14; });
        body = '<div class="opts' + (long ? "" : " two") + '">' + L.options.map(function (o, i) {
          var cls = "opt" + (B.removed.indexOf(i) >= 0 ? " gone" : "");
          return '<button class="' + cls + '" data-o="' + i + '"><span class="k">' + "ABCD"[i] + "</span><span>" + rich(o) + "</span></button>";
        }).join("") + "</div>";
      } else if (L.type === "number") {
        body = '<div class="numdisp">' + (esc(B.num) || "&nbsp;") + (L.unitText ? ' <small style="font-size:18px">' + esc(L.unitText) + "</small>" : "") + '</div><div class="numpad">' +
          ["7", "8", "9", "4", "5", "6", "1", "2", "3", ".", "0", "⌫"].map(function (k) { return '<button data-n="' + k + '">' + k + "</button>"; }).join("") +
          '<button class="ok" data-n="ok">確定</button></div>';
      } else if (L.type === "spell") {
        body = spellHtml(L, B);
      }
      var tools = "";
      if (L.type === "choice" && B.lensLeft > 0 && !B.answered) tools += '<button class="btn small ghost" style="color:#333;border-color:#bba" data-k="lens">🔍 放大鏡：刪去一個錯誤選項（剩 ' + B.lensLeft + "）</button>";
      return '<div class="qcard' + (L.ghost ? " ghost-q" : "") + '">' + head + hint + '<div class="stem">' + rich(L.stem) + "</div>" + body + (tools ? '<div class="qtools">' + tools + "</div>" : "") + "</div>";
    }

    function draw() {
      var html = '<div class="split"><div class="b-side">' + (isEvent ? "" : '<div class="topbar"><button class="btn ghost small" data-k="pause">⏸ 暫停</button><div class="spacer"></div>' + fsButton() + "</div>") + statbarHtml() +
        '<div class="arena"><div class="hero" id="hero"><img class="polaroid" src="' + img(save.seat) + '" alt=""><div class="sub">' + esc(charOf(save.seat).name) + "</div>" +
        (B.block > 0 ? '<div class="pill">🛡️ ' + B.block + "</div>" : "") + (run.combo >= 2 ? '<div class="pill">🔥 連擊 ' + run.combo + "</div>" : "") + "</div>" + foeHtml() + "</div>" +
        itemBarHtml(true) + '</div><div class="b-main">' + (B.cur ? questionHtml() : "") + "</div></div>";
      show(html);
      bindRelicInfo(app); bindItems(app, self);
      on(app, "[data-k=pause]", pauseMenu);
      on(app, "[data-o]", function () { if (!B.answered) judge(+this.getAttribute("data-o")); });
      on(app, "[data-n]", function () {
        if (B.answered) return;
        var k = this.getAttribute("data-n");
        if (k === "ok") { if (B.num !== "" && B.num !== ".") judge(B.num); return; }
        if (k === "⌫") B.num = B.num.slice(0, -1);
        else if (k === "." && B.num.indexOf(".") >= 0) return;
        else if (B.num.length < 9) B.num += k;
        app.querySelector(".numdisp").innerHTML = (esc(B.num) || "&nbsp;") + (B.cur.unitText ? ' <small style="font-size:18px">' + esc(B.cur.unitText) + "</small>" : "");
      });
      bindSpell(app, B, function () { draw(); }, function (word) { judge(word); });
      on(app, "[data-k=lens]", function () {
        var L = B.cur, wrongs = [];
        for (var i = 0; i < 4; i++) if (i !== L.answerIdx && B.removed.indexOf(i) < 0) wrongs.push(i);
        if (wrongs.length <= 1) return;
        B.removed.push(pick(wrongs)); B.lensLeft--; draw();
      });
    }

    function judge(given) {
      if (B.answered) return;
      B.answered = true;
      var L = B.cur, ok, givenText, givenIdx = null;
      if (L.type === "choice") { ok = given === L.answerIdx; givenIdx = given; givenText = L.options[given]; }
      else if (L.type === "number") { ok = Math.abs(parseFloat(given) - L.answer) < 1e-9; givenText = given; }
      else { ok = given === L.answer; givenText = given; }
      run.answered++;
      if (L.type === "choice") {
        var btns = app.querySelectorAll("[data-o]");
        btns.forEach(function (b, i) { b.disabled = true; if (i === L.answerIdx) b.classList.add("right"); if (i === given && !ok) b.classList.add("wrong"); });
      }
      if (ok) onRight(L); else onWrong(L, givenText, givenIdx);
    }

    function onRight(L) {
      beep("ok"); run.correct++; run.combo++;
      var gain = Math.round(2 * (1 + relicLv("magnet") * 0.5));
      run.coins += gain;
      if (L.ghost) {
        run.ghosts.splice(run.ghosts.indexOf(L.ghost), 1); run.ghostsResolved++; run.coins += 10;
        toast("👻 懸案怨靈解除！線索幣 +10");
        markSeen(L.q.concept, L.q.id);
        var res = closeCase(L.q.concept);
        if (res && res.cleared) B.pendingClear = res;
      }
      if (isEvent) { setTimeout(function () { toast("答對了！"); eventCfg.onEnd(true); }, 700); return; }
      var dmg = 10 + Math.min(run.combo - 1, 3) * 2;
      if (relicLv("combo") && run.combo >= (relicLv("combo") > 1 ? 2 : 3)) dmg *= 2;
      if (B.afterWrong && relicLv("memo")) dmg += relicLv("memo") * 5;
      if (B.kind === "boss") dmg += relicLv("seal") * 5;
      B.afterWrong = false;
      if (B.shield) {
        B.shieldStreak++;
        if (B.shieldStreak >= 2) { B.shield = false; toast("🛡️💥 連續答對 2 題，護盾破了！"); }
        else toast("護盾擋住了攻擊！再連續答對 1 題就能打破");
        dmg = 0;
      }
      B.foe.hp -= dmg;
      var fe = document.getElementById("foe");
      if (fe && dmg) { fe.classList.add("hit"); floatDmg(fe, "-" + dmg); juice("hit"); }
      if (B.kind === "boss" && B.phase === 1 && B.foe.hp > 0 && B.foe.hp <= B.foe.max / 2) {
        B.phase = 2; B.shield = true; B.shieldStreak = 0;
        setTimeout(function () { toast("⚠️ 霧核進入第二階段：張開護盾！連續答對 2 題才能打破"); }, 400);
      }
      if (B.foe.hp > 0) snap(); else { run.battle = null; saveRun(); }
      setTimeout(function () {
        maybeClearedMsg(B.pendingClear, function () {
          B.pendingClear = null;
          if (B.foe.hp <= 0) win(); else nextQuestion();
        });
      }, 750);
    }

    function onWrong(L, givenText, givenIdx) {
      beep("bad"); run.combo = 0; B.afterWrong = true;
      var c = recordCase(L, givenText, givenIdx);
      if (L.ghost) { L.ghost.readyAt = run.answered + 3; L.ghost.lastId = L.q.id; }
      else {
        var exists = run.ghosts.some(function (g) { return g.concept === L.q.concept; });
        if (!exists) run.ghosts.push({ concept: L.q.concept, readyAt: run.answered + 3, lastId: L.q.id });
      }
      // 受到攻擊
      var atk = isEvent ? 0 : Math.max(1, B.foe.atk - relicLv("fogl"));
      if (!isEvent) {
        if (B.watchLeft > 0) { B.watchLeft--; atk = 0; toast("⏱️ 所長的懷錶：這次不扣血"); }
        else {
          var si = run.items.indexOf("shield");
          if (si >= 0) { run.items.splice(si, 1); atk = 0; toast("🔰 護盾擋下了攻擊"); }
          else if (B.block > 0) { var b = Math.min(B.block, atk); B.block -= b; atk -= b; if (b) toast("🛡️ 牛皮紙盾擋下 " + b + " 點"); }
        }
        if (B.shield) B.shieldStreak = 0;
        run.hp -= atk;
        var he = document.getElementById("hero");
        if (he && atk) { he.classList.add("hit"); floatDmg(he, "-" + atk); juice("hurt"); }
        snap();
      }
      setTimeout(function () {
        explainAndDiagnose(L, givenText, givenIdx, { coins: true }, function () {
          if (isEvent) { eventCfg.onEnd(false); return; }
          if (run.hp <= 0) endRun(false); else nextQuestion();
        });
      }, 650);
    }

    function win() {
      var fe = document.getElementById("foe"); if (fe) { burst(fe); fe.classList.add("dead"); }
      beep("win");
      setTimeout(function () {
        if (B.kind === "boss") { endRun(true); return; }
        var coins = B.kind === "elite" ? 20 + relicLv("hat") * 15 : 10;
        run.coins += coins;
        if (relicLv("lamp")) run.hp = Math.min(maxHp(), run.hp + relicLv("lamp") * 3);
        if (B.kind === "elite") { toast("🪙 +" + coins); chooseRelic("👁️ 強敵倒下！三選一拿遺物", 3, renderMap); }
        else {
          var s = openSheet('<h2 class="center">🌫️ 殘霧散去了！</h2><p class="center">線索幣 +' + coins + (relicLv("lamp") ? "，檯燈回復 " + relicLv("lamp") * 3 + " 血" : "") + '</p><div class="actions"><button class="btn primary" data-k="ok">回到路線圖 ➜</button></div>');
          on(s, "[data-k=ok]", function () { closeSheet(); renderMap(); });
        }
      }, 650);
    }

    nextQuestion();
  }

  // 打擊感：畫面震動＋閃光（答對亮光、受傷紅光），打倒敵人時霧氣碎片四散
  function juice(kind) {
    var b = document.body; b.classList.remove("fx-hit", "fx-hurt"); void b.offsetWidth;
    b.classList.add(kind === "hurt" ? "fx-hurt" : "fx-hit");
    setTimeout(function () { b.classList.remove("fx-hit", "fx-hurt"); }, 450);
  }
  function burst(el) {
    if (!el) return;
    var r = el.getBoundingClientRect();
    for (var i = 0; i < 18; i++) {
      var p = document.createElement("i"), a = Math.random() * Math.PI * 2, d = 60 + Math.random() * 110;
      p.className = "spark"; p.style.left = (r.left + r.width / 2) + "px"; p.style.top = (r.top + r.height / 2) + "px";
      p.style.setProperty("--dx", Math.cos(a) * d + "px"); p.style.setProperty("--dy", Math.sin(a) * d + "px");
      document.body.appendChild(p);
      setTimeout(function (n) { return function () { n.remove(); }; }(p), 900);
    }
  }
  function floatDmg(el, text) {
    var r = el.getBoundingClientRect();
    var d = h('<div class="dmg">' + text + "</div>");
    d.style.left = (r.left + r.width / 2 - 20 + window.scrollX) + "px"; d.style.top = (r.top + window.scrollY + 10) + "px";
    document.body.appendChild(d); setTimeout(function () { d.remove(); }, 800);
  }

  // ---------- 字母磚 ----------
  function spellHtml(L, B) {
    if (!B.tiles) {
      var need = [];
      for (var i = 0; i < L.mask.length; i++) if (L.mask[i] === "_") need.push(L.answer[i]);
      var extra = [];
      need.forEach(function (ch) { var sw = ch === ch.toUpperCase() ? ch.toLowerCase() : ch.toUpperCase(); if (sw !== ch && extra.indexOf(sw) < 0) extra.push(sw); });
      var pool = "aeiouroa".split("").concat(["r", "o", "u", "i"]);
      while (extra.length + need.length < Math.max(6, need.length + 3)) { var p = pick(pool); if (need.indexOf(p) < 0 && extra.indexOf(p) < 0) extra.push(p); else if (extra.length > 8) break; }
      B.tiles = shuffle(need.concat(extra)).map(function (ch) { return { ch: ch, used: false }; });
      B.spell = [];
    }
    var k = 0, slots = "";
    for (var j = 0; j < L.mask.length; j++) {
      if (L.mask[j] !== "_") slots += '<div class="slot fixed">' + esc(L.mask[j]) + "</div>";
      else { var t = B.spell[k]; slots += t != null ? '<button class="slot filled" data-slot="' + k + '">' + esc(B.tiles[t].ch) + "</button>" : '<div class="slot blank"></div>'; k++; }
    }
    var tiles = B.tiles.map(function (t, i) { return '<button class="tile' + (t.used ? " used" : "") + '" data-tile="' + i + '">' + esc(t.ch) + "</button>"; }).join("");
    var blanks = L.mask.split("_").length - 1;
    return '<div class="slots">' + slots + '</div><div class="tiles">' + tiles + '</div><div class="row" style="justify-content:center;margin-top:12px"><button class="btn small ghost" style="color:#333;border-color:#bba" data-sp="clear">清除</button><button class="btn small primary" data-sp="ok"' + (B.spell.length === blanks ? "" : " disabled") + ">確定</button></div>" +
      '<p class="sub center" style="color:#7a6650">大小寫也要拼對喔！</p>';
  }
  function bindSpell(root, B, redraw, submit) {
    on(root, "[data-tile]", function () {
      if (B.answered) return;
      var i = +this.getAttribute("data-tile"), L = B.cur, blanks = L.mask.split("_").length - 1;
      if (B.tiles[i].used || B.spell.length >= blanks) return;
      B.tiles[i].used = true; B.spell.push(i); redraw();
    });
    on(root, "[data-slot]", function () {
      if (B.answered) return;
      var k = +this.getAttribute("data-slot"), removed = B.spell.splice(k);
      removed.forEach(function (t) { B.tiles[t].used = false; }); redraw();
    });
    on(root, "[data-sp=clear]", function () { if (B.answered) return; B.spell.forEach(function (t) { B.tiles[t].used = false; }); B.spell = []; redraw(); });
    on(root, "[data-sp=ok]", function () {
      if (B.answered) return;
      var L = B.cur, k = 0, word = "";
      for (var j = 0; j < L.mask.length; j++) word += L.mask[j] === "_" ? B.tiles[B.spell[k++]].ch : L.mask[j];
      submit(word);
    });
  }

  // ================= 解析＋錯因診斷 =================
  function diagnosisFor(L, givenText, givenIdx) {
    var correct = null, others = [];
    function addOther(t) { if (t && t !== correct && others.indexOf(t) < 0) others.push(t); }
    if (L.type === "choice" && givenIdx != null) {
      correct = L.traps[givenIdx];
      L.traps.forEach(addOther);
      if (L.q.isTemplate) { for (var n = 0; n < 6 && others.length < 4; n++) { var o = L.q.gen(); o.traps.forEach(addOther); } }
      else conceptQs(L.q.concept).forEach(function (q) { if (q.id !== L.q.id) (q.traps || []).forEach(addOther); });
    } else if (L.type === "number") {
      (L.trapValues || []).forEach(function (tv) { if (Math.abs(tv.v - parseFloat(givenText)) < 1e-9) correct = tv.t; });
      (L.traps || []).forEach(addOther);
      if (L.q.isTemplate) for (var m = 0; m < 4 && others.length < 3; m++) { var g = L.q.gen(); (g.traps || []).forEach(addOther); }
    } else {
      (L.traps || []).forEach(addOther);
    }
    if (correct) return { graded: true, correct: correct, options: shuffle([correct].concat(shuffle(others).slice(0, 2))) };
    return { graded: false, options: shuffle(others).slice(0, 3) };
  }

  // 規格書 3.4：先看解析與出處，再回答「你剛剛錯在哪裡？」
  function explainAndDiagnose(L, givenText, givenIdx, opt, done) {
    var s = openSheet('<h2>🔎 這題的真相</h2>' +
      '<div class="ans">✅ 正確答案：' + rich(L.answerText) + (L.unitText ? " " + esc(L.unitText) : "") + "</div>" +
      '<div class="mine">❌ 你的答案：' + rich(givenText) + "</div>" +
      '<div class="exp">' + rich(L.explain) + "</div>" +
      '<div class="srcline">' + sourceLine(L.q) + "</div>" +
      '<div class="actions"><button class="btn primary" data-k="next">看懂了，找出錯因 ➜</button></div>');
    on(s, "[data-k=next]", function () { diagnose(L, givenText, givenIdx, opt, done); });
  }

  function diagnose(L, givenText, givenIdx, opt, done) {
    var D = diagnosisFor(L, givenText, givenIdx);
    if (D.options.length < 2) { closeSheet(); done(); return; }
    var title = D.graded ? "🧠 你剛剛錯在哪裡？" : "🧠 這題常見的迷思有這些，你覺得自己比較像哪一種？";
    var s = openSheet("<h2>" + title + '</h2><p class="sub" style="color:#6c5a44">你選的是「' + rich(givenText) + "」</p>" +
      D.options.map(function (t, i) { return '<button class="diag-opt" data-d="' + i + '">' + rich(t) + "</button>"; }).join("") +
      '<div id="dres"></div><div class="actions hidden" id="dact"><button class="btn primary" data-k="ok">我懂了 ➜</button></div>');
    var answered = false;
    on(s, "[data-d]", function () {
      if (answered) return; answered = true;
      var i = +this.getAttribute("data-d"), res = s.querySelector("#dres");
      s.querySelectorAll("[data-d]").forEach(function (b) { b.disabled = true; });
      if (D.graded) {
        if (run) run.diagTotal++;
        var ci = D.options.indexOf(D.correct);
        s.querySelectorAll("[data-d]")[ci].classList.add("right");
        if (i === ci) {
          var bonus = opt.coins && run ? 5 * (1 + relicLv("clip")) : 0;
          if (run) { run.diagRight++; run.coins += bonus; }
          res.innerHTML = '<p class="ans">🎯 抓到了！' + (bonus ? "線索幣 +" + bonus : "") + "</p>";
          beep("ok");
        } else {
          this.classList.add("wrong");
          res.innerHTML = '<p class="mine">差一點！你選「' + rich(givenText) + "」，最可能的迷思是：<b>" + rich(D.correct) + "</b></p>";
        }
      } else {
        this.classList.add("right");
        if (opt.coins && run) run.coins += 2;
        res.innerHTML = '<p class="ans">📝 記下來了！下次看到這種題目，先想想這幾個陷阱。' + (opt.coins && run ? "（線索幣 +2）" : "") + "</p>";
      }
      s.querySelector("#dact").classList.remove("hidden");
    });
    on(s, "[data-k=ok]", function () { closeSheet(); done(); });
  }

  // ================= 結算 =================
  function endRun(won) {
    closeSheet(); clearRun();
    var r = run;
    if (won) { save.closedRuns[r.subject] = (save.closedRuns[r.subject] || 0) + 1; persist(); }
    var acc = r.answered ? Math.round(r.correct / r.answered * 100) : 0;
    show('<div class="lamp-glow"></div><div class="folder center" data-tab="結案報告｜' + esc(SUBJ[r.subject].area) + '">' +
      (won ? '<div style="margin:16px 0 8px"><span class="stamp big">結案</span></div><h2>幕後黑手被驅散了！</h2>' : '<h2 style="margin-top:12px">😵 這一輪調查失敗了</h2><p>別灰心，錯的題目都進了懸案卷宗，去懸案調查室把它們弄懂吧！</p>') +
      '<div class="result-grid"><div><b>' + r.answered + "</b>答題數</div><div><b>" + acc + "%</b>正確率</div><div><b>" + r.ghostsResolved + "</b>解除的懸案</div><div><b>" + r.diagRight + " / " + r.diagTotal + "</b>錯因診斷答對</div><div><b>" + (save.closedRuns[r.subject] || 0) + "</b>" + SUBJ[r.subject].name + "結案次數</div><div><b>" + (save.medals - r.startMedals) + "</b>這輪拿到的勳章</div></div>" +
      (r.ghosts.length ? "<p>還有 " + r.ghosts.length + " 個懸案沒解除，已經放進懸案卷宗。</p>" : "") +
      '<div class="row" style="justify-content:center"><button class="btn" data-k="room">🗂️ 懸案調查室</button><button class="btn primary" data-k="hub">回事務所</button></div></div>');
    run = null;
    on(app, "[data-k=hub]", hub);
    on(app, "[data-k=room]", caseRoom);
  }

  // ================= 懸案調查室 =================
  var roomTab = "all";
  function caseRoom() {
    closeSheet();
    var list = [];
    for (var k in save.cases) list.push(save.cases[k]);
    var tabs = [["all", "全部"]].concat(SUBJ_KEYS.map(function (s) { return [s, SUBJ[s].name]; }));
    var shown = list.filter(function (c) { return roomTab === "all" || c.subject === roomTab; })
      .sort(function (a, b) { return (a.status === b.status ? 0 : a.status === "open" ? -1 : 1) || a.concept.localeCompare(b.concept); });
    var open = shown.filter(function (c) { return c.status === "open"; }).length;
    var html = '<div class="lamp-glow"></div><div class="topbar"><button class="btn ghost small" data-k="hub">← 回事務所</button><div class="spacer"></div><span class="pill">🏅 破案勳章 ' + save.medals + "</span></div>" +
      "<h1>🗂️ 懸案調查室</h1><p class=\"sub\">答錯的考點都釘在這面牆上。點卷宗可以複習當初的題目；按「開始調查」用<b>新的變式題</b>破案。</p>" +
      '<div class="tabs">' + tabs.map(function (t) { var n = openCount(t[0] === "all" ? null : t[0]); return '<button class="tab' + (roomTab === t[0] ? " on" : "") + '" data-tab="' + t[0] + '">' + t[1] + (n ? "（" + n + "）" : "") + "</button>"; }).join("") + "</div>" +
      '<div class="row" style="margin:8px 0 14px"><button class="btn primary" data-k="go"' + (open ? "" : " disabled") + ">🔦 開始調查（" + Math.min(5, open) + " 題）</button>" +
      '<span class="sub">每結案一件得 1 枚勳章；之前輪次留下的陳年懸案再 +1</span></div><div class="wall">';
    if (!shown.length) html += '<div class="wall-empty">這裡還沒有懸案。去檔案區闖關吧！答錯的題目會自動建檔。</div>';
    shown.forEach(function (c, i) {
      var u = unitInfo(c.subject, c.unit);
      html += '<button class="case' + (c.status === "closed" ? " closed" : "") + '" style="--c:' + SUBJ[c.subject].color + '" data-case="' + esc(c.concept) + '"><span class="u">' + esc(u.label) + '</span><div class="cn">' + esc(c.conceptName) + '</div><div class="w">' + (u.comic ? "📖《" + esc(u.comic) + "》<br>" : "") + "答錯 " + c.wrong + " 次</div>" +
        (c.status === "closed" ? '<span class="stamp">結案</span>' : "") + "</button>";
    });
    html += "</div>";
    show(html);
    on(app, "[data-k=hub]", hub);
    on(app, "[data-tab]", function () { roomTab = this.getAttribute("data-tab"); caseRoom(); });
    on(app, "[data-case]", function () { showCase(save.cases[this.getAttribute("data-case")]); });
    on(app, "[data-k=go]", function () { investigate(roomTab === "all" ? null : roomTab); });
  }

  function showCase(c) {
    var u = unitInfo(c.subject, c.unit), sn = c.snap || {};
    var q = { subject: c.subject, unit: c.unit };
    var s = openSheet("<h2>📁 " + esc(c.conceptName) + "</h2>" +
      '<p class="sub" style="color:#6c5a44">' + esc(u.label) + "｜答錯 " + c.wrong + " 次｜" + (c.status === "closed" ? '<b style="color:#b3261e">已結案</b>' : "<b>未偵破</b>") + "</p>" +
      '<div class="paper" style="box-shadow:none;border:1px solid #d6c7a8"><div class="stem" style="font-size:18px">' + rich(sn.stem) + "</div>" +
      (sn.options ? "<ul>" + sn.options.map(function (o) { return "<li>" + rich(o) + "</li>"; }).join("") + "</ul>" : "") + "</div>" +
      '<div class="ans">✅ 正確答案：' + rich(sn.answer) + "</div>" + (sn.given ? '<div class="mine">❌ 當時的答案：' + rich(sn.given) + "</div>" : "") +
      '<div class="exp">' + rich(sn.explain) + "</div>" +
      (sn.traps && sn.traps.length ? "<p><b>這個考點常見的迷思：</b></p><ul>" + sn.traps.map(function (t) { return "<li>" + rich(t) + "</li>"; }).join("") + "</ul>" : "") +
      '<div class="srcline">' + sourceLine(q) + '</div><div class="actions"><button class="btn primary" data-k="ok">關閉</button></div>');
    on(s, "[data-k=ok]", closeSheet);
  }

  function investigate(subject) {
    var open = [];
    for (var k in save.cases) { var c = save.cases[k]; if (c.status === "open" && (!subject || c.subject === subject) && conceptQs(c.concept).length) open.push(c); }
    open = shuffle(open).slice(0, 5);
    if (!open.length) return;
    save.round++; persist();
    var R = { list: open, i: 0, solved: 0, medals0: save.medals };
    var B = {};
    function next() {
      closeSheet();
      if (R.i >= R.list.length) return summary();
      var c = R.list[R.i];
      var vq = variantFor(c.concept, c.seen, c.snap ? c.snap.id : null, null);
      var L = instantiate(vq);
      if (vq.isTemplate && c.snap && L.stem === c.snap.stem) L = instantiate(vq);
      B = { cur: L, answered: false, num: "", spell: [], tiles: null, c: c };
      draw();
    }
    function draw() {
      var L = B.cur, u = unitInfo(L.q.subject, L.q.unit), body = "";
      if (L.type === "choice") body = '<div class="opts">' + L.options.map(function (o, i) { return '<button class="opt" data-o="' + i + '"><span class="k">' + "ABCD"[i] + "</span><span>" + rich(o) + "</span></button>"; }).join("") + "</div>";
      else if (L.type === "number") body = '<div class="numdisp">' + (esc(B.num) || "&nbsp;") + (L.unitText ? " <small>" + esc(L.unitText) + "</small>" : "") + '</div><div class="numpad">' + ["7", "8", "9", "4", "5", "6", "1", "2", "3", ".", "0", "⌫"].map(function (k) { return '<button data-n="' + k + '">' + k + "</button>"; }).join("") + '<button class="ok" data-n="ok">確定</button></div>';
      else body = spellHtml(L, B);
      show('<div class="lamp-glow"></div><div class="topbar"><button class="btn ghost small" data-k="back">← 懸案牆</button><div class="spacer"></div><span class="pill">第 ' + (R.i + 1) + " / " + R.list.length + ' 件</span><span class="pill">🏅 ' + save.medals + "</span></div>" +
        '<div class="folder" data-tab="懸案調查中"><p style="margin:0 0 8px"><b>📁 ' + esc(B.c.conceptName) + "</b>（" + esc(u.label) + "）— 這是同一個考點的<b>新題目</b>，答對就結案！</p>" +
        '<div class="qcard"><div class="qhead"><span>' + esc(u.label) + "</span>" + (L.level === 2 ? '<span class="lv2">進階</span>' : "") + '</div><div class="stem">' + rich(L.stem) + "</div>" + body + "</div></div>");
      on(app, "[data-k=back]", caseRoom);
      on(app, "[data-o]", function () { judge(+this.getAttribute("data-o")); });
      on(app, "[data-n]", function () {
        if (B.answered) return;
        var k = this.getAttribute("data-n");
        if (k === "ok") { if (B.num !== "" && B.num !== ".") judge(B.num); return; }
        if (k === "⌫") B.num = B.num.slice(0, -1); else if (k === "." && B.num.indexOf(".") >= 0) return; else if (B.num.length < 9) B.num += k;
        app.querySelector(".numdisp").innerHTML = (esc(B.num) || "&nbsp;") + (L.unitText ? " <small>" + esc(L.unitText) + "</small>" : "");
      });
      bindSpell(app, B, draw, function (w) { judge(w); });
    }
    function judge(given) {
      if (B.answered) return; B.answered = true;
      var L = B.cur, ok, gt, gi = null;
      if (L.type === "choice") { ok = given === L.answerIdx; gi = given; gt = L.options[given]; app.querySelectorAll("[data-o]").forEach(function (b, i) { b.disabled = true; if (i === L.answerIdx) b.classList.add("right"); if (i === given && !ok) b.classList.add("wrong"); }); }
      else if (L.type === "number") { ok = Math.abs(parseFloat(given) - L.answer) < 1e-9; gt = given; }
      else { ok = given === L.answer; gt = given; }
      if (!L.q.isTemplate) markSeen(B.c.concept, L.q.id);
      R.i++;
      if (ok) {
        beep("ok"); R.solved++;
        var res = closeCase(B.c.concept);
        setTimeout(function () {
          var s = openSheet('<div class="center"><span class="stamp big">結案</span><h2 style="margin-top:18px">' + esc(B.c.conceptName) + '</h2><p>答對了！這件懸案偵破了。</p></div><div class="srcline">' + sourceLine(L.q) + '</div><div class="actions"><button class="btn primary" data-k="ok">下一件 ➜</button></div>');
          on(s, "[data-k=ok]", function () { closeSheet(); maybeClearedMsg(res, next); });
        }, 500);
      } else {
        beep("bad");
        recordCase(L, gt, gi);
        setTimeout(function () { explainAndDiagnose(L, gt, gi, { coins: false }, next); }, 500);
      }
    }
    function summary() {
      show('<div class="lamp-glow"></div><div class="folder center" data-tab="調查報告"><h2>🔦 這次調查結束</h2><div class="result-grid"><div><b>' + R.list.length + "</b>調查件數</div><div><b>" + R.solved + "</b>結案</div><div><b>" + (save.medals - R.medals0) + "</b>拿到的勳章</div><div><b>" + openCount(null) + "</b>還沒偵破</div></div>" +
        '<div class="row" style="justify-content:center"><button class="btn" data-k="room">回懸案牆</button><button class="btn primary" data-k="hub">回事務所</button></div></div>');
      on(app, "[data-k=room]", caseRoom); on(app, "[data-k=hub]", hub);
    }
    next();
  }

  // ================= 雙人決鬥（回合制） =================
  // 每回合兩人各答一題（同難度、不同題目），回合結束才判定勝負，所以先手不佔便宜；每回合輪流先答。
  var DUEL_HP = 5;
  function duelSetup() {
    closeSheet();
    var P = [{ seat: null }, { seat: null }], subject = null;
    function grid(side) {
      return '<div class="char-grid">' + CHARS.map(function (c) {
        var sel = P[side].seat === c.seat, taken = P[1 - side].seat === c.seat;
        return '<button class="char-cell' + (sel ? " sel" : "") + (taken ? " taken" : "") + '" data-side="' + side + '" data-seat="' + c.seat + '"' + (taken ? " disabled" : "") + '><img src="' + img(c.seat) + '" alt="" loading="lazy"><div class="seat">' + c.seat + ' 號</div><div class="nm">' + esc(c.name) + "</div></button>";
      }).join("") + "</div>";
    }
    function draw() {
      var ready = P[0].seat && P[1].seat && subject;
      show('<div class="topbar"><button class="btn ghost small" data-k="hub">← 回事務所</button><div class="spacer"></div></div>' +
        '<div class="brand"><span class="kicker">DUEL · 回合制對決</span><h1>⚔️ 雙人決鬥</h1></div>' +
        '<p class="sub">兩人共用一台 iPad，請<b>橫放</b>，左右各坐一位。<b>輪流作答</b>：答對就攻擊對手，答錯就攻擊撲空。每回合兩人各答一題，<b>後答的人答完才判定勝負</b>，所以後答的人永遠有機會扳平。同一回合兩人一起倒下，就進入<b>驟死戰</b>：誰先答錯就落敗。</p>' +
        '<div class="duel-pick"><div><h3>⬅️ 左邊玩家' + (P[0].seat ? "：" + esc(charOf(P[0].seat).name) : "") + "</h3>" + grid(0) + "</div><div><h3>右邊玩家 ➡️" + (P[1].seat ? "：" + esc(charOf(P[1].seat).name) : "") + "</h3>" + grid(1) + "</div></div>" +
        '<h3>選一個科目</h3><div class="tabs">' + SUBJ_KEYS.map(function (s) { var ok = BANK.qs.some(function (q) { return q.subject === s && q.type === "choice"; }); return '<button class="tab' + (subject === s ? " on" : "") + '" data-subj="' + s + '"' + (ok ? "" : " disabled") + ">" + SUBJ[s].icon + " " + SUBJ[s].name + (ok ? "" : "（整理中）") + "</button>"; }).join("") + "</div>" +
        '<div class="row" style="justify-content:flex-end;margin-top:10px"><button class="btn primary" data-k="go"' + (ready ? "" : " disabled") + ">開始決鬥 ➜</button></div>");
      on(app, "[data-k=hub]", hub);
      on(app, "[data-seat]", function () { P[+this.getAttribute("data-side")].seat = +this.getAttribute("data-seat"); draw(); });
      on(app, "[data-subj]", function () { subject = this.getAttribute("data-subj"); draw(); });
      on(app, "[data-k=go]", function () { duel(P[0].seat, P[1].seat, subject); });
    }
    draw();
  }

  function duel(seatL, seatR, subject) {
    window.scrollTo(0, 0); syncViewport(); document.documentElement.classList.add("in-duel");
    var S = [{ seat: seatL, hp: DUEL_HP }, { seat: seatR, hp: DUEL_HP }];
    var used = {}, round = 0, starter = rnd(2), turn = 0, L = null, roundLv = 1, last = null, answered = false, sudden = false, roundOk = [null, null];
    var rotate = document.getElementById("rotate-hint");
    function checkOrient() { syncViewport(); rotate.classList.toggle("hidden", window.innerWidth >= window.innerHeight); }
    window.addEventListener("resize", checkOrient);
    function cleanup() { window.removeEventListener("resize", checkOrient); rotate.classList.add("hidden"); document.documentElement.classList.remove("in-duel"); }
    function who() { return turn === 0 ? starter : 1 - starter; }
    function nm(i) { return charOf(S[i].seat).name; }
    function hearts(i) { if (sudden) return "⚡ 驟死戰"; var s = ""; for (var k = 0; k < DUEL_HP; k++) s += k < S[i].hp ? "❤️" : "🤍"; return s; }

    function side(i) {
      var act = i === who(), c = charOf(S[i].seat);
      return '<div class="dside' + (act ? " active" : " waiting") + '" id="ds' + i + '"><div class="who"><img src="' + img(S[i].seat) + '" alt=""><div><b>' + esc(c.name) + '</b><div class="hearts">' + hearts(i) + "</div></div></div>" +
        '<div class="turnflag">' + (act ? "👉 輪到你作答" : "⏳ 等對手作答") + '</div><div class="opts">' +
        L.options.map(function (o, k) { return '<button class="opt" data-p="' + i + '" data-o="' + k + '"' + (act ? "" : " disabled") + '><span class="k">' + "ABCD"[k] + "</span><span>" + rich(o) + "</span></button>"; }).join("") +
        '</div><div class="wait-cover">' + (act ? "" : "對手作答中<br>請先不要碰") + "</div></div>";
    }
    function newRound() {
      round++; turn = 0; roundOk = [null, null]; roundLv = Math.random() < 0.35 ? 2 : 1;
      nextTurn();
    }
    function nextTurn() {
      var q = chooseQuestion({ subject: subject, used: used, types: ["choice"], lastConcept: last, p2: roundLv === 2 ? 1 : 0 });
      L = instantiate(q); used[q.id] = (used[q.id] || 0) + 1; last = q.concept; answered = false;
      var w = who();
      app.innerHTML = '<div class="duel">' + side(0) + '<div class="dcenter"><div class="row"><button class="btn ghost small" data-k="quit">✕ 結束</button>' + fsButton() + '<div class="spacer"></div><span class="pill">' + SUBJ[subject].icon + " " + SUBJ[subject].name + "</span></div>" +
        '<div class="roundbar">' + (sudden ? "⚡ 驟死戰 · " : "") + "第 " + round + " 回合 · 輪到 " + (w === 0 ? "⬅️ " : "") + esc(nm(w)) + (w === 1 ? " ➡️" : "") + "</div>" +
        '<div class="qcard"><div class="qhead"><span>' + esc(unitInfo(q.subject, q.unit).label) + "</span>" + (L.level === 2 ? '<span class="lv2">進階</span>' : "") + '</div><div class="stem">' + rich(L.stem) + '</div><div id="dexp"></div></div></div>' + side(1) + "</div>";
      checkOrient();
      on(app, "[data-o]", function () { pickAns(+this.getAttribute("data-p"), +this.getAttribute("data-o"), this); });
      on(app, "[data-k=quit]", function () { cleanup(); hub(); });
    }
    function pickAns(pi, k, btn) {
      if (answered || pi !== who()) return;
      answered = true;
      var ok = k === L.answerIdx, foe = 1 - pi;
      roundOk[pi] = ok;
      app.querySelectorAll("#ds" + pi + " [data-o]").forEach(function (b, j) { b.disabled = true; if (j === L.answerIdx) b.classList.add("right"); });
      var msg;
      if (ok && sudden) { beep("ok"); msg = "✅ " + nm(pi) + " 答對了！"; }
      else if (ok) {
        S[foe].hp--; beep("ok"); juice("hit");
        var fs = document.getElementById("ds" + foe); if (fs) { fs.classList.add("hit"); fs.querySelector(".hearts").innerHTML = hearts(foe); }
        msg = "⚔️ " + nm(pi) + " 答對了！攻擊成功";
      } else {
        btn.classList.add("wrong"); beep("bad");
        msg = "💨 " + nm(pi) + " 答錯了……攻擊撲空";
      }
      var nextLabel = turn === 0 ? "換 " + esc(nm(foe)) + " 作答 ➜" : "回合結算 ➜";
      if (sudden && turn === 0 && !ok) msg += "。不過 " + nm(foe) + " 還有一次機會，答錯就平手繼續！";
      var ex = document.getElementById("dexp");
      ex.innerHTML = '<p class="' + (ok ? "ans" : "mine") + '">' + esc(msg) + '</p><p class="ans">✅ 正確答案：' + rich(L.answerText) + '</p><p class="exp">' + rich(L.explain) + '</p><div class="srcline">' + sourceLine(L.q) + '</div><div class="row" style="justify-content:center;margin-top:10px"><button class="btn primary" data-k="nx">' + nextLabel + "</button></div>";
      on(ex, "[data-k=nx]", function () { if (turn === 0) { turn = 1; nextTurn(); } else endRound(); });
    }
    // 每回合兩人都答完才判定：後答的人永遠有機會扳平
    function endRound() {
      if (sudden) {
        if (roundOk[0] !== roundOk[1]) { finish(roundOk[0] ? 0 : 1); return; }
        toast(roundOk[0] ? "兩人都答對了，驟死戰繼續！" : "兩人都答錯了，驟死戰繼續！");
        newRound(); return;
      }
      var d0 = S[0].hp <= 0, d1 = S[1].hp <= 0;
      if (d0 && d1) {
        sudden = true;
        var s = openSheet('<h2 class="center">⚡ 同一回合雙方都倒下了！</h2><p class="center">進入<b>驟死戰</b>：繼續輪流作答，<b>誰先答錯就落敗</b>。<br>同一回合裡，先答的人答錯時，後答的人還要作答：後答的人答對就獲勝；也答錯的話就平手，繼續下一回合。</p><div class="actions"><button class="btn primary" data-k="ok">開始驟死戰 ➜</button></div>');
        on(s, "[data-k=ok]", function () { closeSheet(); newRound(); });
      } else if (d0 || d1) finish(d0 ? 1 : 0);
      else newRound();
    }
    function finish(w) {
      cleanup(); beep("win");
      var c = charOf(S[w].seat);
      show('<div class="folder center" data-tab="決鬥結果"><img class="polaroid big" src="' + img(S[w].seat) + '" alt=""><h1>🏆 ' + esc(c.name) + " 獲勝！</h1><p>" + (w === 0 ? "左邊" : "右邊") + "玩家" + (sudden ? "在驟死戰中勝出" : "在第 " + round + " 回合把對手的心打光了") + '。兩位都辛苦了！</p><div class="row" style="justify-content:center"><button class="btn" data-k="again">再來一場</button><button class="btn primary" data-k="hub">回事務所</button></div></div>');
      on(app, "[data-k=again]", function () { duel(seatL, seatR, subject); });
      on(app, "[data-k=hub]", hub);
    }
    toast("🪙 擲硬幣：由" + (starter === 0 ? "左邊的 " : "右邊的 ") + esc(nm(starter)) + " 先答，之後兩人輪流");
    newRound();
  }

  // ================= 選角色 =================
  function pickChar() {
    closeSheet();
    var sel = save.seat;
    function draw() {
      show('<div class="lamp-glow"></div><h1>🕵️ 選擇你的調查員</h1><p class="sub">用你的<b>座號</b>找到自己的角色。所有角色的能力都一樣，只是外觀不同。</p>' +
        '<div class="char-grid">' + CHARS.map(function (c) {
          return '<button class="char-cell' + (sel === c.seat ? " sel" : "") + '" data-seat="' + c.seat + '"><img src="' + img(c.seat) + '" alt="" loading="lazy"><div class="seat">' + c.seat + ' 號</div><div class="nm">' + esc(c.name) + "</div></button>";
        }).join("") + '</div><div class="row" style="justify-content:flex-end;margin-top:14px;position:sticky;bottom:12px"><button class="btn primary" data-k="ok"' + (sel ? "" : " disabled") + ">" + (sel ? "就是我：" + esc(charOf(sel).name) + " ➜" : "請先選角色") + "</button></div>");
      on(app, "[data-seat]", function () { sel = +this.getAttribute("data-seat"); draw(); });
      on(app, "[data-k=ok]", function () { save.seat = sel; persist(); hub(); });
    }
    draw();
  }

  // ================= 主畫面（事務所） =================
  function hub() {
    closeSheet(); run = null;
    document.getElementById("rotate-hint").classList.add("hidden"); document.documentElement.classList.remove("in-duel");
    if (!save.seat) { pickChar(); return; }
    var c = charOf(save.seat);
    var html = '<div class="topbar"><div class="brand"><span class="kicker">604 CASE FILES · TOP SECRET</span><h1>所長的機密檔案庫</h1></div><div class="spacer"></div>' +
      fsButton() + '<button class="btn ghost small" data-k="sound">' + (save.sound ? "🔊 音效開" : "🔇 音效關") + '</button><a class="btn ghost small" href="help.html">❔ 說明</a></div>' +
      '<div class="folder" data-tab="調查員證"><div class="idcard"><div class="portrait ' + unlocked(FRAMES) + '"><img src="' + img(save.seat) + '" alt=""></div><div><div class="sub" style="color:#6c5a44">604 委託事務所｜' + save.seat + ' 號</div><h2 style="margin:2px 0">' + esc(c.name) + '</h2><span class="title">' + unlocked(TITLES) + '</span><div style="margin-top:8px">🏅 破案勳章 <b>' + save.medals + "</b> 枚　📁 未偵破懸案 <b>" + openCount(null) + '</b> 件</div><button class="btn small ghost" style="color:#333;border-color:#a98;margin-top:8px" data-k="char">換角色</button></div></div></div>';
    if (!save.introSeen) {
      html += '<div class="folder" data-tab="所長的委託">' + bossTalk("事務所的檔案庫裡，還飄著當年迷霧留下的<b>「殘霧」</b>。它們躲進每一份案件卷宗，把重點弄得模模糊糊。<br>潛入四個檔案區，把殘霧驅散吧！") +
        '<div class="row" style="justify-content:flex-end;margin-top:10px"><button class="btn small" data-k="intro">收到！</button></div></div>';
    }
    var R0 = save.run && save.run.map && SUBJ[save.run.subject] ? save.run : null;
    if (R0) html += '<div class="folder" data-tab="未完成的調查"><div class="row"><div style="flex:1"><b style="font-size:20px">' + SUBJ[R0.subject].icon + " " + esc(SUBJ[R0.subject].area) + "</b><br>" +
      "走到第 " + Math.max(1, R0.row + 1) + " / " + R0.map.length + " 排　❤️ " + Math.max(0, R0.hp) + "　🪙 " + R0.coins + (R0.battle ? "　（戰鬥中）" : "") +
      '</div><button class="btn primary" data-k="resume">▶️ 繼續調查</button></div></div>';
    html += '<div class="areas">' + SUBJ_KEYS.map(function (s, i) {
      var ok = hasQuestions(s), n = openCount(s);
      return '<button class="area' + (ok ? "" : " off") + '" style="--c:' + SUBJ[s].color + '" data-area="' + s + '"' + (ok ? "" : " disabled") + '><span class="file-no">FILE 0' + (i + 1) + '</span><span class="secret">機密</span><div class="ic">' + SUBJ[s].icon + '</div><div class="nm">' + SUBJ[s].area + '</div><div class="meta">' +
        (ok ? "結案 " + (save.closedRuns[s] || 0) + " 次" : "檔案整理中…") + "</div>" + (n ? '<span class="badge">懸案 ' + n + "</span>" : "") + "</button>";
    }).join("") + "</div>" +
      '<div class="hub-actions"><button class="btn primary" data-k="room"><span>🗂️</span>懸案調查室' + (openCount(null) ? "（" + openCount(null) + "）" : "") + '</button><button class="btn" data-k="duel"><span>⚔️</span>雙人決鬥</button><a class="btn" href="help.html"><span>📖</span>使用說明</a></div>' +
      '<p class="sub center" style="margin-top:18px">考試：11/5（四）英文、自然｜11/6（五）數學、社會。進度只存在這台 iPad。</p>';
    show(html);
    on(app, "[data-k=resume]", resumeRun);
    on(app, "[data-area]", function () {
      var s = this.getAttribute("data-area");
      var units = window.FC_UNITS[s].filter(function (u) { return BANK.qs.some(function (q) { return q.subject === s && q.unit === u.unit; }); }).map(function (u) { return u.unit; });
      if (!R0) { startRun(s, units); return; }
      var sh = openSheet('<h2>還有一輪調查沒完成</h2><p>' + esc(SUBJ[R0.subject].area) + "的調查還在進行中。要繼續那一輪，還是放棄它、開始新的" + esc(SUBJ[s].area) + '調查？</p><div class="actions"><button class="btn" data-k="old">繼續原本的調查</button><button class="btn red" data-k="new">放棄並開始新的</button></div>');
      on(sh, "[data-k=old]", function () { closeSheet(); resumeRun(); });
      on(sh, "[data-k=new]", function () { closeSheet(); clearRun(); startRun(s, units); });
    });
    on(app, "[data-k=room]", caseRoom);
    on(app, "[data-k=duel]", duelSetup);
    on(app, "[data-k=char]", pickChar);
    on(app, "[data-k=intro]", function () { save.introSeen = true; persist(); hub(); });
    on(app, "[data-k=sound]", function () { save.sound = !save.sound; persist(); beep("tap"); hub(); });
  }

  // 防止 iOS 縮放（雙擊縮放已由 CSS touch-action: manipulation 關閉）
  document.addEventListener("gesturestart", function (e) { e.preventDefault(); });

  // 給測試用
  window.FC_debug = { save: function () { return save; }, run: function () { return run; } };
  hub();
})();
