// 題庫格式檢查（規格書 5.8 第 5 點）與數學模板驗算（5.8 第 1 點）
// 用法：node tools/check.js [science english social math]
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.join(__dirname, "..");
const ctx = { window: {}, console, Math };
ctx.window = ctx;
vm.createContext(ctx);
for (const f of ["data/units.js", "data/bank.js", "data/q-science.js", "data/q-english.js", "data/q-social.js", "data/q-math.js"]) {
  const p = path.join(root, f);
  if (fs.existsSync(p)) vm.runInContext(fs.readFileSync(p, "utf8"), ctx, { filename: f });
}
const bank = ctx.FC_BANK;
const want = process.argv.slice(2);
const subjects = want.length ? want : ["science", "english", "social", "math"];
const MIN = { science: 75, english: 85, social: 75, math: 35 };
let errors = 0;
const err = (q, m) => { errors++; console.log("  ✗", q.id, m); };

function checkChoice(q, o) {
  if (!o.stem || typeof o.stem !== "string") err(q, "缺題幹");
  if (!Array.isArray(o.options) || o.options.length !== 4) err(q, "選項不是 4 個");
  else {
    const set = new Set(o.options.map(String));
    if (set.size !== 4) err(q, "選項重複: " + o.options.join(" | "));
    o.options.forEach((x) => { if (x === "" || x == null) err(q, "空選項"); });
  }
  if (!(Number.isInteger(o.answer) && o.answer >= 0 && o.answer < 4)) err(q, "answer 索引超出範圍");
  if (!Array.isArray(o.traps) || o.traps.length !== 4) err(q, "traps 長度和選項不一致");
  else o.traps.forEach((t, i) => {
    if (i === o.answer && t !== null) err(q, "正解那格 traps 應為 null");
    if (i !== o.answer && !(typeof t === "string" && t.length > 3)) err(q, "錯誤選項 " + i + " 沒有迷思說明");
  });
  if (!o.explain) err(q, "缺解析");
}

for (const subj of subjects) {
  const qs = bank.qs.filter((q) => q.subject === subj);
  if (!qs.length) { console.log(`\n[${subj}] 尚無題目`); continue; }
  console.log(`\n[${subj}]`);
  const ids = new Set();
  const byConcept = {};
  let lv1 = 0, lv2 = 0;
  for (const q of qs) {
    for (const k of ["id", "subject", "unit", "concept", "conceptName", "type", "level", "source"]) if (q[k] == null || q[k] === "") err(q, "缺欄位 " + k);
    if (ids.has(q.id)) err(q, "id 重複"); ids.add(q.id);
    if (!ctx.FC_unitInfo(q.subject, q.unit).name) err(q, "單元不在 units.js");
    (byConcept[q.concept] = byConcept[q.concept] || []).push(q);
    q.level === 1 ? lv1++ : lv2++;
    if (q.isTemplate) {
      // 數學模板：各產生 50 題驗算
      for (let k = 0; k < 50; k++) {
        let o;
        try { o = q.gen(); } catch (e) { err(q, "gen 例外 " + e.message); break; }
        if (o.check && o.check() !== true) err(q, "驗算失敗: " + o.stem);
        if (q.type === "choice") {
          checkChoice(q, o);
          if (o.values) {
            const ans = o.values[o.answer];
            o.values.forEach((v, i) => { if (i !== o.answer && Math.abs(v - ans) < 1e-9) err(q, "錯誤選項的值和正解相同: " + o.stem + " → " + o.options.join(" | ")); });
          }
        } else if (q.type === "number") {
          if (!(typeof o.answer === "number" && isFinite(o.answer))) err(q, "number 題答案不是數字");
          if (o.answer < 0) err(q, "答案是負數");
          if (Math.round(o.answer * 1000) / 1000 !== o.answer) err(q, "答案小數位數太多: " + o.answer);
          if (!Array.isArray(o.traps) || o.traps.length < 2) err(q, "number 題 traps 少於 2 個");
          (o.trapValues || []).forEach((tv) => { if (Math.abs(tv.v - o.answer) < 1e-9) err(q, "迷思答案等於正解: " + o.stem); });
        }
        if (k === 0 && process.env.SHOW) console.log("    例:", o.stem.replace(/\n/g, " "), "→", q.type === "choice" ? o.options[o.answer] : o.answer);
      }
    } else if (q.type === "choice") {
      checkChoice(q, q);
    } else if (q.type === "spell") {
      if (!q.answer || !q.spellMask) err(q, "spell 缺 answer / spellMask");
      else {
        if (q.spellMask.length !== q.answer.length) err(q, "遮罩長度和答案不同");
        for (let i = 0; i < q.answer.length; i++) if (q.spellMask[i] !== "_" && q.spellMask[i] !== q.answer[i]) err(q, "遮罩和答案不一致");
        if (q.spellMask.indexOf("_") < 0) err(q, "遮罩沒有空格");
      }
      if (!Array.isArray(q.traps) || q.traps.length < 2) err(q, "spell traps 少於 2 個");
      if (!q.explain) err(q, "缺解析");
    } else err(q, "未知題型 " + q.type);
  }
  // 同考點變式：至少 3 題（數學模板本身可無限變式），題幹不能幾乎一樣
  for (const c in byConcept) {
    const list = byConcept[c];
    if (!list[0].isTemplate && list.length < 3) console.log("  ✗", c, "變式少於 3 題"), errors++;
    for (let i = 0; i < list.length; i++) for (let j = i + 1; j < list.length; j++) {
      const a = list[i].stem, b = list[j].stem;
      if (a && b && similarity(a, b) > 0.85) console.log("  ⚠", list[i].id, list[j].id, "題幹太像（" + similarity(a, b).toFixed(2) + "）");
    }
  }
  const total = qs.length;
  const nc = Object.keys(byConcept).length;
  console.log(`  題數 ${total}（最低 ${MIN[subj]}）、考點 ${nc}、基礎 ${lv1}（${Math.round(lv1 / total * 100)}%）、進階 ${lv2}（${Math.round(lv2 / total * 100)}%）`);
  if (total < MIN[subj]) console.log("  ✗ 題數不足"), errors++;
  const units = {};
  qs.forEach((q) => units[q.unit] = (units[q.unit] || 0) + 1);
  console.log("  各單元:", JSON.stringify(units));
}
console.log(errors ? `\n共 ${errors} 個問題` : "\n✓ 全部通過");

function similarity(a, b) {
  const grams = (s) => { const g = new Set(); for (let i = 0; i < s.length - 1; i++) g.add(s.slice(i, i + 2)); return g; };
  const A = grams(a), B = grams(b);
  let inter = 0; A.forEach((x) => { if (B.has(x)) inter++; });
  return inter / Math.max(1, Math.min(A.size, B.size));
}
