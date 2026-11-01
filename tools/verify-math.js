// 數學模板獨立驗算（規格書 5.8 第 1 點）
// 不使用模板內部的算式：從「題目文字」重新抓出數字，用暴力法或另一種算法重算，和模板給的正解比對。
// 用法：node tools/verify-math.js [每個模板的題數，預設 50]
const fs = require("fs"), path = require("path"), vm = require("vm");
const root = path.join(__dirname, "..");
const ctx = {}; ctx.window = ctx; vm.createContext(ctx);
for (const f of ["data/units.js", "data/bank.js", "data/q-math.js"]) vm.runInContext(fs.readFileSync(path.join(root, f), "utf8"), ctx);

// 把 "2又3/7"、"3/7"、"4.25"、"12" 轉成數值
function val(s) {
  s = String(s).trim().replace(/[組天袋段頁張顆根盞公尺毫升元倍%]+$/g, "");
  let m = s.match(/^(\d+)又(\d+)\/(\d+)$/); if (m) return +m[1] + m[2] / m[3];
  m = s.match(/^(\d+)\/(\d+)$/); if (m) return m[1] / m[2];
  return parseFloat(s);
}
const NUM = /\d+又\d+\/\d+|\d+\/\d+|\d+(?:\.\d+)?/g;
const nums = (s) => (s.match(NUM) || []).map(val);
const near = (a, b) => Math.abs(a - b) < 1e-6;
const isPrime = (n) => { if (n < 2) return false; for (let i = 2; i < n; i++) if (n % i === 0) return false; return true; };
const bruteGcd = (a, b) => { let g = 1; for (let i = 1; i <= Math.min(a, b); i++) if (a % i === 0 && b % i === 0) g = i; return g; };
const bruteLcm = (a, b) => { for (let i = Math.max(a, b); ; i++) if (i % a === 0 && i % b === 0) return i; };
const ratio = (s) => { const m = s.match(/^(\d+)：(\d+)$/); return m ? [+m[1], +m[2]] : null; };

const V = {
  "math-L1-c01": (o, a) => isPrime(+a) && o.options.filter((x) => isPrime(+x)).length === 1,
  "math-L1-c02": (o, a) => { const n = nums(o.stem)[0]; const f = a.split("×").map(Number); return f.every(isPrime) && f.reduce((x, y) => x * y, 1) === n; },
  "math-L1-c03": (o, a) => { const [x, y] = nums(o.stem); return bruteGcd(x, y) === a; },
  "math-L1-c04": (o, a) => { const [x, y] = nums(o.stem); return bruteLcm(x, y) === a; },
  "math-L1-c05": (o, a) => { const [x, y] = nums(o.stem); return bruteGcd(x, y) === val(a); },
  "math-L1-c06": (o, a) => { const [x, y] = nums(o.stem); return bruteLcm(x, y) === val(a); },
  "math-L1-c07": (o, a) => o.options.filter((s) => { const [x, y] = s.split("和").map(Number); return bruteGcd(x, y) === 1; }).length === 1 && bruteGcd(...a.split("和").map(Number)) === 1,
  "math-L2-c01": (o, a) => { const [x] = nums(o.stem); const [n, d] = a.split("/").map(Number); return near(x, n / d) && bruteGcd(n, d) === 1; },
  "math-L2-c02": (o, a) => { const [x, y] = nums(o.stem); return near(x / y, val(a)); },
  "math-L2-c03": (o, a) => { const [N, f] = nums(o.stem); return near(N / f, val(a)); },
  "math-L2-c04": (o, a) => { const [x, y] = nums(o.stem); return near(x / y, val(a)); },
  "math-L2-c05": (o, a) => { const [x, y] = nums(o.stem); return near(x / y, val(a)); },
  "math-L2-c06": (o, a) => { const [x, y] = nums(o.stem); return a === (x / y > x ? "＞" : "＜"); },
  "math-L2-c07": (o, a) => { const [A, B] = nums(o.stem); return near(A / B, val(a)); },
  "math-L2-c08": (o, a) => { const [f, X] = nums(o.stem); return near(X / f, val(a)); },
  "math-L3-c01": (o, a) => { const lines = o.stem.split("\n"); const seq = lines[1].replace("……", "").trim().split(" "); const N = nums(lines[2])[0];
    let k = 1; while (seq[k] !== seq[0]) k++; return seq[(N - 1) % k] === a; },
  "math-L3-c02": (o, a) => { const n = nums(o.stem); const first = n[2], second = n[5], N = n[n.length - 1];
    let s = first; for (let i = 2; i <= N; i++) s += second - first; return s === a; },
  "math-L3-c03": (o, a) => { const n = nums(o.stem); const S = n[0] + n[1]; return n[2] + n[3] === S && n[4] + n[5] === S && n[6] + a === S; },
  "math-L3-c04": (o, a) => { const [age, k, yrs] = nums(o.stem); return (age * k + yrs) - (age + yrs) === a; },
  "math-L3-c05": (o, a) => { const [x, y, x2] = nums(o.stem); return a * x2 === x * y; },
  "math-L3-c06": (o, a) => { const [L, g] = nums(o.stem); let pos = []; for (let d = 0; d <= L; d += g) pos.push(d);
    if (o.stem.includes("頭尾兩端都不設")) pos = pos.slice(1, -1); else if (o.stem.includes("一端設")) pos = pos.slice(1); return pos.length === a; },
  "math-L3-c07": (o, a) => { const [P, g] = nums(o.stem); let c = 0; for (let d = 0; d < P; d += g) c++; return c === a; },
  "math-L3-c08": (o, a) => { const [g, from, to] = nums(o.stem); let d = 0; for (let i = from; i < to; i++) d += g; return d === a; },
  "math-L4-c01": (o, a) => { const [x, y] = nums(o.stem); return near(x / y, a); },
  "math-L4-c02": (o, a) => { const [x, y] = nums(o.stem); return near(x / y, a); },
  "math-L4-c03": (o, a) => { const [x, y] = nums(o.stem); return Math.round(x / y) === +a; },
  "math-L4-c04": (o, a) => { const [w, T] = nums(o.stem); return near(T / w, a); },
  "math-L4-c05": (o, a) => { const [n, m] = nums(o.stem); return Math.round(m / n * 100) === val(a); },
  "math-L4-c06": (o, a) => { const [x, y] = nums(o.stem); return a === (x / y > x ? "＞" : "＜"); },
  "math-L4-c07": (o, a) => { const [A, B] = nums(o.stem); return near(A / B, a); },
  "math-L5-c01": (o, a) => { const [x, y] = nums(o.stem); return near(x / y, val(a)); },
  "math-L5-c02": (o, a) => { const [x, y, z] = nums(o.stem); return near(x / y, a / z); },
  "math-L5-c03": (o, a) => { const [x, y] = nums(o.stem); const r = ratio(a); return r && near(x / y, r[0] / r[1]) && bruteGcd(r[0], r[1]) === 1; },
  "math-L5-c04": (o, a) => { const [x, y] = nums(o.stem); const r = ratio(a); return r && near(x / y, r[0] / r[1]) && bruteGcd(r[0], r[1]) === 1; },
  "math-L5-c05": (o, a) => { const [x, y] = nums(o.stem); const r = ratio(a); return r && near(x / y, r[0] / r[1]) && bruteGcd(r[0], r[1]) === 1; },
  "math-L5-c06": (o, a) => { const [p, q, X] = nums(o.stem); return near(X / p, a / q); },
  "math-L5-c07": (o, a) => { const n = nums(o.stem); const T = n[0], p = n[1], q = n[2]; return near(a, T * p / (p + q)); },
  "math-L5-c08": (o, a) => { const [r, R] = nums(o.stem); return near(a / R, r); }
};

const per = +process.argv[2] || 50;
let bad = 0, total = 0;
for (const q of ctx.FC_BANK.qs.filter((x) => x.isTemplate)) {
  const f = V[q.concept];
  if (!f) { console.log("✗ 沒有驗算規則：", q.concept); bad++; continue; }
  let fail = 0;
  for (let i = 0; i < per; i++) {
    const o = q.gen(); total++;
    const ans = q.type === "choice" ? o.options[o.answer] : o.answer;
    let ok = false; try { ok = f(o, ans); } catch (e) { ok = false; }
    // 選擇題：錯誤選項不可以也通過驗算（不能也是正確答案）
    if (ok && q.type === "choice") for (let j = 0; j < 4; j++) if (j !== o.answer) { let alsoOk = false; try { alsoOk = f(o, o.options[j]); } catch (e) {} if (alsoOk) { ok = false; console.log("  ✗ 錯誤選項也成立：", o.stem.replace(/\n/g, " "), "→", o.options[j]); } }
    if (!ok) { fail++; if (fail <= 3) console.log("  ✗", q.concept, o.stem.replace(/\n/g, " "), "→", ans); }
  }
  if (fail) bad++;
  console.log((fail ? "✗ " : "✓ ") + q.concept + " " + q.conceptName + (fail ? `（${fail}/${per} 失敗）` : ""));
}
console.log(`\n共驗算 ${total} 題，${bad ? bad + " 個模板有問題" : "全部正確"}`);
