// 把題目匯出成「看不到正解」的作答卷，給獨立作答的子代理使用（規格書 5.8 第 2 點）
// 用法：node tools/export-blind.js science english > blind.txt
// 同時寫出 tools/.blind-key.json（只給比對腳本用）
const fs = require("fs");
const path = require("path");
const vm = require("vm");
const root = path.join(__dirname, "..");
const ctx = {}; ctx.window = ctx; vm.createContext(ctx);
for (const f of ["data/units.js", "data/bank.js", "data/q-science.js", "data/q-english.js", "data/q-social.js"]) {
  const p = path.join(root, f);
  if (fs.existsSync(p)) vm.runInContext(fs.readFileSync(p, "utf8"), ctx);
}
const subjects = process.argv.slice(2);
let seed = 12345;
const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
const L = "ABCD";
const key = {};
const out = [];
for (const q of ctx.FC_BANK.qs) {
  if (!subjects.includes(q.subject)) continue;
  if (q.type === "choice") {
    const order = [0, 1, 2, 3].sort(() => rnd() - 0.5);
    key[q.id] = L[order.indexOf(q.answer)];
    out.push(`### ${q.id}\n${q.stem}\n` + order.map((k, i) => `(${L[i]}) ${q.options[k]}`).join("\n"));
  } else if (q.type === "spell") {
    key[q.id] = q.answer;
    out.push(`### ${q.id}\n[拼字題：把 _ 補成正確字母，寫出完整單字，大小寫要正確]\n${q.stem} ${q.spellMask}`);
  }
}
fs.writeFileSync(path.join(__dirname, ".blind-key.json"), JSON.stringify(key, null, 1));
console.log(out.join("\n\n"));
