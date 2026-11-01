// 數學參數化模板：6上 第1～5單元
// 數字每次隨機產生；錯誤選項依「重點整理與迷思澄清」的迷思規則計算。
// 依據：教材/數學/重點（教冊、各節重點整理與迷思澄清），題型參考單元學後檢測卷，全部重新命題。
(function () {
  function R(a, b) { return a + Math.floor(Math.random() * (b - a + 1)); }
  function P(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
  function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { var t = a % b; a = b; b = t; } return a; }
  function lcm(a, b) { return a / gcd(a, b) * b; }
  function spf(n) { for (var p = 2; p <= n; p++) if (n % p === 0) return p; return n; }
  // 分數（自動約分）："3/4"、"2又1/4"、整數
  function fs(n, d) {
    var g = gcd(n, d); n /= g; d /= g;
    if (d === 1) return String(n);
    if (n > d) return Math.floor(n / d) + "又" + (n % d) + "/" + d;
    return n + "/" + d;
  }
  function raw(n, d) { return n + "/" + d; } // 不約分，用來呈現「還沒約完」的錯誤選項
  // 整數 v 除以 10^k 的小數字串（避免浮點誤差）
  function D(v, k) {
    var neg = v < 0; v = Math.abs(v);
    var s = String(v); while (s.length <= k) s = "0" + s;
    var out = k ? s.slice(0, s.length - k) + "." + s.slice(s.length - k) : s;
    if (k) out = out.replace(/0+$/, "").replace(/\.$/, "");
    return (neg ? "-" : "") + out;
  }
  function num(x) { return Math.round(x * 1000) / 1000; }
  // 組選擇題：right 是正解文字；wrongs 是 [文字, 迷思]；有重複就回傳 null 讓模板重抽
  function choice(stem, right, wrongs, explain, values) {
    var opts = [right].concat(wrongs.map(function (w) { return w[0]; }));
    for (var i = 0; i < opts.length; i++) for (var j = i + 1; j < opts.length; j++) if (opts[i] === opts[j]) return null;
    if (values) for (var a = 1; a < values.length; a++) if (Math.abs(values[a] - values[0]) < 1e-9) return null;
    return { stem: stem, options: opts, answer: 0, traps: [null].concat(wrongs.map(function (w) { return w[1]; })), explain: explain, values: values };
  }
  // 數字填答題；trapValues 是「算錯會得到的數」與它對應的迷思
  function number(stem, answer, unit, traps, trapValues, explain) {
    answer = num(answer);
    return { stem: stem, answer: answer, unit: unit, traps: traps,
      trapValues: (trapValues || []).filter(function (t) { return isFinite(t.v) && Math.abs(t.v - answer) > 1e-9; }).map(function (t) { return { v: num(t.v), t: t.t }; }),
      explain: explain };
  }
  function T(build) { return function () { for (var i = 0; i < 300; i++) { var o = build(); if (o) return o; } throw new Error("模板產生失敗"); }; }
  function tpl(unit, num_, name, lv, type, source, build) {
    FC_add("math", unit, num_, name, source, [{ lv: lv, type: type, gen: T(build) }]);
  }
  var S1 = "數學6上 第1單元 重點整理與迷思澄清", S2 = "數學6上 第2單元 重點整理與迷思澄清", S3 = "數學6上 第3單元 重點整理與迷思澄清",
    S4 = "數學6上 第4單元 重點整理與迷思澄清", S5 = "數學6上 第5單元 重點整理與迷思澄清";
  var NAMES = ["阿哲", "小芸", "阿德", "小安", "宥宥", "小寬", "佳佳", "阿伸"];

  // ================= L1 最大公因數與最小公倍數 =================
  tpl("L1", 1, "質數的判斷", 1, "choice", S1 + " 1-1", function () {
    var p = P([23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97]);
    var c3 = P([21, 27, 33, 39, 51, 57, 69, 81, 87, 93]), c7 = P([49, 77, 91]);
    return choice("下列哪一個數是質數？", String(p),
      [["1", "1 只有 1 個因數，不是質數也不是合數"], [String(c3), "以為奇數都是質數，其實 " + c3 + "＝3×" + c3 / 3], [String(c7), "沒有檢查 7 的倍數，其實 " + c7 + "＝7×" + c7 / 7]],
      p + " 只有 1 和 " + p + " 兩個因數，是質數。" + c3 + "＝3×" + c3 / 3 + "、" + c7 + "＝7×" + c7 / 7 + " 都是合數。", [p, 1, c3, c7]);
  });

  tpl("L1", 2, "質因數分解", 1, "choice", S1 + " 1-2", function () {
    var pool = [2, 2, 2, 3, 3, 5, 7, 11], k = R(3, 4), f = [];
    for (var i = 0; i < k; i++) f.push(P(pool));
    f.sort(function (a, b) { return a - b; });
    var n = f.reduce(function (a, b) { return a * b; }, 1);
    if (n > 250 || n < 24) return null;
    var merged = [f[0] * f[1]].concat(f.slice(2)).sort(function (a, b) { return a - b; });
    var dropped = f.slice(1);
    return choice(n + " 的質因數分解是哪一個？", f.join("×"),
      [[merged.join("×"), f[0] * f[1] + " 還是合數，要繼續分解到全部都是質數"],
       [dropped.join("×"), "少寫了一個質因數，乘回去不等於 " + n],
       ["1×" + f.join("×"), "1 不是質數，質因數分解不寫 1"]],
      "質因數分解要把 " + n + " 寫成「全部都是質數」相乘：" + n + "＝" + f.join("×") + "。");
  });

  function pairGM() {
    var m = R(2, 9), n = R(2, 9);
    if (m === n || gcd(m, n) !== 1) return null;
    return [m, n];
  }
  tpl("L1", 3, "求最大公因數", 1, "number", S1 + " 1-3", function () {
    var mn = pairGM(); if (!mn) return null;
    var g = R(2, 12), a = g * mn[0], b = g * mn[1];
    if (a > 120 || b > 120) return null;
    var tv = [{ v: g * mn[0] * mn[1], t: "把最大公因數和最小公倍數弄混了" }];
    if (spf(g) < g) tv.push({ v: g / spf(g), t: "找到的是公因數，但不是最大的；短除法要除到兩數互質" });
    return number(a + " 和 " + b + " 的最大公因數是多少？", g, "",
      ["把最大公因數和最小公倍數弄混了", "質因數分解時漏掉了共同的質因數", "以為最大公因數一定是比較小的那個數"], tv,
      "用短除法：" + a + "＝" + g + "×" + mn[0] + "，" + b + "＝" + g + "×" + mn[1] + "，" + mn[0] + " 和 " + mn[1] + " 互質，所以最大公因數是 " + g + "。");
  });

  tpl("L1", 4, "求最小公倍數", 1, "number", S1 + " 1-4", function () {
    var mn = pairGM(); if (!mn) return null;
    var g = R(2, 8), a = g * mn[0], b = g * mn[1], L = g * mn[0] * mn[1];
    if (a > 80 || b > 80) return null;
    return number(a + " 和 " + b + " 的最小公倍數是多少？", L, "",
      ["兩數不互質時，直接相乘會算得太大", "把最小公倍數和最大公因數弄混了", "短除法求最小公倍數，左邊和最下面的數都要乘起來"],
      [{ v: a * b, t: "兩數不互質時，直接相乘會算得太大" }, { v: g, t: "把最小公倍數和最大公因數弄混了" }, { v: Math.max(a, b), t: "以為較大的數就是最小公倍數（只有倍數關係時才成立）" }],
      "短除法：左邊 " + g + "，下面 " + mn[0] + "、" + mn[1] + "，全部乘起來 " + g + "×" + mn[0] + "×" + mn[1] + "＝" + L + "。");
  });

  tpl("L1", 5, "最大公因數的應用（最多分成幾份）", 2, "choice", S1 + " 1-3 應用", function () {
    var mn = pairGM(); if (!mn) return null;
    var g = P([4, 6, 8, 9, 10, 12]), a = g * mn[0], b = g * mn[1];
    if (a > 108 || b > 108) return null;
    return choice("大露營時，有 " + a + " 包餅乾和 " + b + " 瓶水，要平均分給每一組，每組分到的餅乾一樣多、水也一樣多，而且剛好分完。最多可以分成幾組？",
      g + " 組", [[lcm(a, b) + " 組", "「最多分成幾組」是找最大公因數，不是最小公倍數"],
        [g / spf(g) + " 組", "找到的是公因數，但不是最大的"],
        [mn[0] + " 組", "算出的是每組分到幾包餅乾，不是組數"]],
      "組數要同時是 " + a + " 和 " + b + " 的因數，而且要最多，所以找最大公因數 " + g + "。", [g, lcm(a, b), g / spf(g), mn[0]]);
  });

  tpl("L1", 6, "最小公倍數的應用（下一次同時）", 2, "choice", S1 + " 1-4 應用", function () {
    var x = R(1, 5), y = R(2, 6), g = R(2, 4);
    if (x === y || gcd(x, y) !== 1) return null;
    var m = g * x, n = g * y; if (m < 3 || n > 20) return null;
    var who = P([["阿哲", "小芸"], ["小安", "佳佳"], ["宥宥", "阿德"]]);
    var L = lcm(m, n);
    return choice(who[0] + "每 " + m + " 天去一次圖書館，" + who[1] + "每 " + n + " 天去一次。今天兩人同時去了，下一次同時去圖書館是幾天後？",
      L + " 天後", [[m * n + " 天後", m + " 和 " + n + " 不互質，直接相乘不是「最小」公倍數"],
        [gcd(m, n) + " 天後", "「下一次同時」要找公倍數，不是公因數"],
        [(m + n) + " 天後", "把兩個天數相加了，應該找共同的倍數"]],
      "下一次同時去的天數，要同時是 " + m + " 和 " + n + " 的倍數，而且最小：最小公倍數是 " + L + "。", [L, m * n, gcd(m, n), m + n]);
  });

  tpl("L1", 7, "互質的判斷", 1, "choice", S1 + " 1-3 互質", function () {
    var good = P([[8, 15], [9, 14], [4, 25], [10, 21], [16, 27], [14, 25], [12, 35], [9, 20], [8, 21]]);
    var k = R(3, 6), ev = [2 * R(3, 9), 2 * R(10, 16)];
    var mul = P([[7, 28], [6, 30], [9, 36], [8, 40], [5, 35]]);
    var odd = P([[21, 33], [15, 27], [9, 39], [25, 35], [21, 49]]);
    return choice("下面哪一組數「互質」？", good.join("和"),
      [[ev.join("和"), "兩個都是偶數，至少有公因數 2，不會互質"],
       [mul.join("和"), "有倍數關係的兩數，公因數不只有 1"],
       [odd.join("和"), "以為兩個奇數就一定互質，其實它們有公因數 " + gcd(odd[0], odd[1])]],
      "互質是指兩數的公因數只有 1（最大公因數是 1）。" + good.join("和") + " 雖然都是合數，但沒有共同的因數，所以互質。");
  });

  // ================= L2 分數除法 =================
  tpl("L2", 1, "約成最簡分數", 1, "choice", S2 + " 2-1", function () {
    var b = R(3, 12), a = R(1, b - 1);
    if (gcd(a, b) !== 1) return null;
    var k = P([4, 6, 8, 9, 10, 12]), p = spf(k);
    return choice("把 " + raw(a * k, b * k) + " 化成最簡分數，是哪一個？", raw(a, b),
      [[raw(a * p, b * p), "還可以再約分，沒有約到最簡（分子分母要互質）"],
       [raw(a, b * k), "只把分子約分，分母沒有一起除以同一個數"],
       [raw(b, a), "把分子和分母寫顛倒了"]],
      "分子和分母同時除以最大公因數 " + k + "：" + raw(a * k, b * k) + "＝" + raw(a, b) + "，" + a + " 和 " + b + " 互質。");
  });

  tpl("L2", 2, "同分母分數的除法", 1, "choice", S2 + " 2-2", function () {
    var d = R(5, 15), a = R(2, 2 * d), b = R(2, d);
    if (a === b || a % d === 0 || b % d === 0) return null;
    return choice(raw(a, d) + " ÷ " + raw(b, d) + " ＝ ？", fs(a, b),
      [[fs(b, a), "把被除數和除數的位置弄反了"],
       [fs(a, b * d), "同分母相除就是分子相除，答案不用再除以分母"],
       [fs(a * b, d * d), "把除法算成乘法了"]],
      "分母相同，就是比較有幾個 1/" + d + "：" + a + "÷" + b + "＝" + fs(a, b) + "。");
  });

  tpl("L2", 3, "整數除以分數（應用）", 1, "choice", S2 + " 2-3、2-4", function () {
    var b = R(3, 12), a = R(2, b - 1);
    if (gcd(a, b) !== 1) return null;
    var t = R(2, 8), N = a * t;
    var thing = P([["紅豆", "公斤", "袋"], ["果汁", "公升", "瓶"], ["緞帶", "公尺", "段"]]);
    return choice("有 " + N + " " + thing[1] + "的" + thing[0] + "，每 " + raw(a, b) + " " + thing[1] + "裝成一" + thing[2] + "，一共可以分成幾" + thing[2] + "？",
      String(t * b), [[fs(N * a, b), "忘了把除數顛倒，直接乘了 " + raw(a, b)], [fs(a, b * N), "把被除數和除數的位置弄反了"], [String(N * b), "只乘了分母 " + b + "，忘了再除以分子 " + a]],
      N + "÷" + raw(a, b) + "＝" + N + "×" + raw(b, a) + "＝" + t * b + "（被除數不變，除數顛倒相乘）。", [t * b, N * a / b, a / (b * N), N * b]);
  });

  tpl("L2", 4, "異分母分數的除法", 2, "choice", S2 + " 2-3", function () {
    var b = R(2, 9), a = R(1, 2 * b), d = R(2, 9), c = R(1, d - 1);
    if (gcd(a, b) !== 1 || gcd(c, d) !== 1 || b === d || c === 0) return null;
    var right = fs(a * d, b * c);
    return choice(raw(a, b) + " ÷ " + raw(c, d) + " ＝ ？", right,
      [[fs(b * c, a * d), "把被除數也顛倒了；只有除數要顛倒"],
       [fs(a * c, b * d), "忘了把除數顛倒，直接相乘"],
       [fs(a * d, b), "除數顛倒後只乘了分子，忘了乘分母"]],
      "被除數不變，除數顛倒相乘：" + raw(a, b) + "×" + raw(d, c) + "＝" + right + "。", [a * d / (b * c), b * c / (a * d), a * c / (b * d), a * d / b]);
  });

  tpl("L2", 5, "帶分數的分數除法", 2, "choice", S2 + " 2-3", function () {
    var w = R(1, 4), d = R(2, 7), n = R(1, d - 1), e = R(2, 9), c = R(1, e - 1);
    if (gcd(n, d) !== 1 || gcd(c, e) !== 1) return null;
    var imp = w * d + n, right = fs(imp * e, d * c);
    var partOnly = w * d * c + n * e; // w ＋ (n/d ÷ c/e) 的分子（分母 d*c）
    return choice(w + "又" + n + "/" + d + " ÷ " + raw(c, e) + " ＝ ？", right,
      [[fs(partOnly, d * c), "帶分數要先化成假分數；不能只拿分數部分去除，整數部分不動"],
       [fs(d * c, imp * e), "把被除數和除數的位置弄反了"],
       [fs(imp * c, d * e), "化成假分數後，忘了把除數顛倒，直接相乘"]],
      "先化成假分數：" + w + "又" + n + "/" + d + "＝" + raw(imp, d) + "，再乘以除數的倒數：" + raw(imp, d) + "×" + raw(e, c) + "＝" + right + "。",
      [imp * e / (d * c), partOnly / (d * c), d * c / (imp * e), imp * c / (d * e)]);
  });

  function compareQ(dividend, divisorText, less) {
    var right = less ? "＞" : "＜";
    var wrongs = less
      ? [["＜", "以為除法的答案一定比被除數小；除數小於 1 時，商反而比較大"], ["＝", "除數不是 1，商不會等於被除數"], ["不算算看無法判斷", "不知道只要看除數和 1 的關係就能判斷"]]
      : [["＞", "把除數大於 1 的情況記反了；除數大於 1，商比被除數小"], ["＝", "除數不是 1，商不會等於被除數"], ["不算算看無法判斷", "不知道只要看除數和 1 的關係就能判斷"]];
    return choice("不用計算，判斷大小：\n" + dividend + " ÷ " + divisorText + " □ " + dividend + "\n□ 裡應該填什麼？", right, wrongs,
      "除數" + (less ? "小於 1，商會比被除數大" : "大於 1，商會比被除數小") + "，所以填「" + right + "」。");
  }
  tpl("L2", 6, "不計算判斷商的大小（分數）", 1, "choice", S2 + " 2-2 答案不一定是整數", function () {
    var w = R(1, 4), d = R(3, 11), n = R(1, d - 1); if (gcd(n, d) !== 1) return null;
    var q = R(2, 9), p = R(1, 2 * q); if (p === q || gcd(p, q) !== 1) return null;
    return compareQ(w + "又" + n + "/" + d, raw(p, q), p < q);
  });

  tpl("L2", 7, "A 是 B 的幾倍（分數）", 2, "choice", S2 + " 2-2 「A是B的幾倍」", function () {
    var A = R(3, 12), w = R(1, 3), d = R(2, 7), n = R(1, d - 1);
    if (gcd(n, d) !== 1) return null;
    var Bn = w * d + n; if (A * d <= Bn) return null;
    return choice("一包白米重 " + A + " 公斤，一包糙米重 " + w + "又" + n + "/" + d + " 公斤。一包白米的重量是一包糙米的幾倍？",
      fs(A * d, Bn), [[fs(Bn, A * d), "「A 是 B 的幾倍」要用 A÷B，順序弄反了"], [fs(A * Bn, d), "把「幾倍」算成乘法了"], [fs(A * d - Bn, d), "把「幾倍」算成相差多少"]],
      "白米是糙米的幾倍 → 白米÷糙米：" + A + "÷" + raw(Bn, d) + "＝" + A + "×" + raw(d, Bn) + "＝" + fs(A * d, Bn) + "。",
      [A * d / Bn, Bn / (A * d), A * Bn / d, (A * d - Bn) / d]);
  });

  tpl("L2", 8, "部分量÷分率＝全體量", 2, "choice", S2 + " 2-4", function () {
    var q = R(3, 9), p = R(2, q - 1); if (gcd(p, q) !== 1) return null;
    var t = R(5, 30), X = p * t;
    return choice(P(NAMES) + "看了一本書的 " + raw(p, q) + "，一共看了 " + X + " 頁。這本書全部有幾頁？",
      String(q * t), [[fs(X * p, q), "看到「幾分之幾」就用乘法；已知部分量求全體，要用除法"],
        [String(t), "只除以分子，算出的是一份有幾頁"], [String(X * q), "只乘了分母，忘了再除以分子"]],
      "部分量÷分率＝全體量：" + X + "÷" + raw(p, q) + "＝" + X + "×" + raw(q, p) + "＝" + q * t + "（頁）。", [q * t, X * p / q, t, X * q]);
  });

  // ================= L3 數量關係 =================
  var SHAPES = ["🔺", "🔵", "⬛", "⭐", "🌙", "❤️", "🍀"];
  tpl("L3", 1, "重複排列的規律", 1, "choice", S3 + " 3-1", function () {
    var k = R(4, 5), pat = SHAPES.slice().sort(function () { return Math.random() - 0.5; }).slice(0, k);
    var N = R(20, 80), q = Math.floor(N / k), r = N % k;
    var right = pat[(N - 1) % k];
    var seq = []; for (var i = 0; i < k * 2 + 2; i++) seq.push(pat[i % k]);
    var w = r === 0
      ? [[pat[0], "餘數是 0 時以為是下一組的第一個；餘數 0 表示剛好排完整組，是一組的最後一個"], [pat[1 % k], "位置數錯了"], [pat[q % k], "把商當成位置；商只表示排完了幾組"]]
      : [[pat[r % k], "多數了一個位置；餘數 " + r + " 表示是一組中的第 " + r + " 個"], [pat[0], "以為不管餘數多少都是一組的第一個"], [pat[q % k], "把商當成位置；商只表示排完了幾組"]];
    return choice("圖形照規律排列：\n" + seq.join(" ") + " ……\n第 " + N + " 個是哪一個圖形？", right, w,
      "每 " + k + " 個一組。" + N + "÷" + k + "＝" + q + "…" + r + (r === 0 ? "，剛好排完 " + q + " 組，是一組的最後一個。" : "，排完 " + q + " 組後的第 " + r + " 個。"));
  });

  tpl("L3", 2, "圖形的數形規律", 2, "number", S3 + " 3-1", function () {
    var s = P([["三角形", 3, 2], ["正方形", 4, 3], ["五邊形", 5, 4]]), N = R(6, 15);
    var ans = s[1] + s[2] * (N - 1);
    return number("用木棒排出一排相連的" + s[0] + "：\n圖 1 有 1 個" + s[0] + "，用 " + s[1] + " 根；圖 2 有 2 個，用 " + (s[1] + s[2]) + " 根；圖 3 有 3 個，用 " + (s[1] + 2 * s[2]) + " 根……\n排出圖 " + N + "，要用幾根木棒？", ans, "根",
      ["沒有先找出「每多 1 個，增加多少」", "只數了前幾個圖，沒有推到要求的圖", "把圖的編號和木棒數弄混了"],
      [{ v: s[1] + s[2] * N, t: "從圖 1 到圖 " + N + " 只增加 " + (N - 1) + " 次，多加了一次" }, { v: s[1] * N, t: "相連的圖形會共用木棒，不能每個都用 " + s[1] + " 根" }],
      "圖 1 用 " + s[1] + " 根，之後每多 1 個多 " + s[2] + " 根：" + s[1] + "＋" + s[2] + "×(" + N + "－1)＝" + ans + "。");
  });

  tpl("L3", 3, "和不變的關係", 1, "number", S3 + " 3-2", function () {
    var S = R(20, 60), xs = []; while (xs.length < 4) { var v = R(2, S - 2); if (xs.indexOf(v) < 0) xs.push(v); }
    var pairs = xs.slice(0, 3).map(function (x) { return "放進 " + x + " → 得到 " + (S - x); }).join("\n");
    var x = xs[3];
    return number("觀察數字機器的規律：\n" + pairs + "\n放進 " + x + "，會得到多少？", S - x, "",
      ["只看一組數字就下結論", "沒有找出固定不變的關係", "把和不變想成積不變"],
      [{ v: x + ((S - xs[0]) - xs[0]), t: "以為是「差不變」，其實是放進的數和得到的數加起來不變" }],
      "放進的數＋得到的數＝" + S + "（和不變），所以 " + S + "－" + x + "＝" + (S - x) + "。");
  });

  tpl("L3", 4, "差不變（年齡問題）", 1, "number", S3 + " 3-2", function () {
    var a = R(8, 13), k = R(3, 4), n = R(5, 15), who = P(NAMES);
    return number(who + "今年 " + a + " 歲，媽媽今年的年齡是" + who + "的 " + k + " 倍。" + n + " 年後，媽媽和" + who + "相差幾歲？", a * (k - 1), "歲",
      ["把媽媽的年齡當成答案了", "沒有先算出媽媽今年幾歲", "題目問的是相差幾歲，不是幾倍"],
      [{ v: a * (k - 1) + n, t: "以為過了 " + n + " 年，年齡差也會增加；兩人一起長大，年齡差不變" }, { v: (a + n) * (k - 1), t: "以為 " + n + " 年後媽媽還是" + who + "的 " + k + " 倍" }],
      "媽媽今年 " + a * k + " 歲，相差 " + a * k + "－" + a + "＝" + a * (k - 1) + " 歲。兩人每年都一起增加 1 歲，年齡差不變。");
  });

  tpl("L3", 5, "積不變的關係", 2, "number", S3 + " 3-2", function () {
    var x = R(2, 6), y = R(6, 30), T0 = x * y, x2 = R(2, 12);
    if (x2 === x || T0 % x2 !== 0) return null;
    var tv = [{ v: y * x2 / x, t: "以為每袋越重，袋數也會越多；總重量固定時，每袋越重、袋數越少" }];
    return number("一批米要分裝。每袋裝 " + x + " 公斤，可以裝成 " + y + " 袋。如果改成每袋裝 " + x2 + " 公斤，可以裝成幾袋？", T0 / x2, "袋",
      ["沒有先找出「每袋重量×袋數＝總重量」", "把積不變想成和不變", "把總重量當成答案了"],
      tv, "每袋重量×袋數＝總重量 " + x + "×" + y + "＝" + T0 + "（積不變），" + T0 + "÷" + x2 + "＝" + T0 / x2 + "。");
  });

  tpl("L3", 6, "間隔問題（直線型）", 2, "number", S3 + " 3-3", function () {
    var g = P([5, 8, 10, 12, 15, 20, 25]), n = R(10, 40), L = g * n, c = R(0, 2);
    var cases = [["頭尾兩端都要設", n + 1], ["一端設、一端不設", n], ["頭尾兩端都不設", n - 1]];
    var tv = [];
    cases.forEach(function (cs, i) { if (i !== c) tv.push({ v: cs[1], t: i === 0 ? "這題不是頭尾都有；頭尾都有才是間隔數＋1" : i === 1 ? "這題不是只有一端有；一端有才是間隔數＝路燈數" : "這題不是頭尾都沒有；頭尾都沒有才是間隔數－1" }); });
    return number("一條長 " + L + " 公尺的步道，在路的一側每隔 " + g + " 公尺設一盞路燈，「" + cases[c][0] + "」。一共要設幾盞路燈？", cases[c][1], "盞",
      ["沒有先算出有幾個間隔", "把步道長度當成路燈數", "除法算錯了間隔數"], tv,
      L + "÷" + g + "＝" + n + "（個間隔）。" + cases[c][0] + "，所以是 " + cases[c][1] + " 盞。");
  });

  tpl("L3", 7, "間隔問題（封閉型）", 1, "number", S3 + " 3-3", function () {
    var g = P([2, 3, 4, 5, 6, 8]), n = R(20, 160), P0 = g * n;
    return number("一個圓形水池的周長是 " + P0 + " 公尺，沿著水池周圍每隔 " + g + " 公尺種一棵樹。一共要種幾棵樹？", n, "棵",
      ["沒有先算出有幾個間隔", "把周長當成樹的數量", "除法算錯了間隔數"],
      [{ v: n + 1, t: "把圓形當成頭尾都有的直線；圍一圈時樹的數量＝間隔數" }, { v: n - 1, t: "把圓形當成頭尾都沒有的直線；圍一圈時樹的數量＝間隔數" }],
      P0 + "÷" + g + "＝" + n + "（個間隔）。圍成一圈，樹的數量＝間隔數＝" + n + " 棵。");
  });

  tpl("L3", 8, "間隔數與距離", 1, "number", S3 + " 3-3 已知號碼", function () {
    var a = R(3, 30), b = a + R(5, 40), g = P([4, 5, 6, 8, 10, 12]);
    return number("步道旁每隔 " + g + " 公尺有一盞路燈，路燈依序編號。從第 " + a + " 盞走到第 " + b + " 盞，一共走了幾公尺？", (b - a) * g, "公尺",
      ["沒有把間隔數乘上每段的長度", "把最後一盞的編號當成間隔數", "只算了其中一段的距離"],
      [{ v: (b - a + 1) * g, t: "間隔數是 " + b + "－" + a + "＝" + (b - a) + "，不用再＋1" }],
      "間隔數＝" + b + "－" + a + "＝" + (b - a) + "，距離＝" + (b - a) + "×" + g + "＝" + (b - a) * g + " 公尺。");
  });

  // ================= L4 小數除法 =================
  tpl("L4", 1, "整數除以小數", 1, "number", S4 + " 4-1", function () {
    var dk = P([2, 4, 5, 6, 8, 12, 15, 16, 24, 25, 35, 45, 75]), q = R(2, 60);
    if ((q * dk) % 10 !== 0) return null;
    var A = q * dk / 10;
    return number(A + " ÷ " + D(dk, 1) + " ＝ ？", q, "",
      ["以為除法的答案一定比被除數小", "直式計算時商的位置寫錯了", "把被除數和除數的位置弄反了"],
      [{ v: A / dk, t: "只把除數乘 10 變成整數，被除數沒有一起乘 10" }],
      "被除數和除數同時乘 10：" + A + "÷" + D(dk, 1) + "＝" + A * 10 + "÷" + dk + "＝" + q + "。");
  });

  tpl("L4", 2, "小數除以小數", 1, "number", S4 + " 4-2", function () {
    var dk = R(11, 129), qk = R(11, 99);
    if (dk % 10 === 0 || qk % 10 === 0) return null;
    var Ak = qk * dk; // A 有兩位小數
    return number(D(Ak, 2) + " ÷ " + D(dk, 1) + " ＝ ？", qk / 10, "",
      ["直式計算時漏掉了某一位", "把被除數和除數的位置弄反了", "以為除法的答案一定比被除數小"],
      [{ v: qk, t: "商的小數點沒有對齊新的被除數" }, { v: qk / 100, t: "只移動了除數的小數點，被除數沒有跟著移" }],
      "兩數同時乘 10：" + D(Ak, 1) + "÷" + dk + "＝" + D(qk, 1) + "。");
  });

  tpl("L4", 3, "商的四捨五入", 2, "choice", S4 + " 4-3 求商的概數", function () {
    var A = R(20, 200), dk = R(12, 95); if (dk % 10 === 0) return null;
    var q = A * 10 / dk, tr = Math.floor(q), ro = Math.round(q);
    if (tr === ro || Math.abs(q * 10 - Math.round(q * 10)) < 1e-9) return null;
    var one = Math.round(q * 10) / 10;
    var shiftOnlyDivisor = Math.round(A / dk);
    return choice(A + " ÷ " + D(dk, 1) + "，用四捨五入法求商到「個位」，大約是多少？", String(ro),
      [[String(tr), "沒有看下一位就直接捨去；四捨五入要看十分位"],
       [String(one), "取錯位數了，題目要求的是到個位"],
       [String(shiftOnlyDivisor), "只把除數變成整數，被除數沒有一起乘 10"]],
      A + "÷" + D(dk, 1) + "＝" + A * 10 + "÷" + dk + "＝" + (Math.floor(q * 100) / 100) + "……，十分位是 " + Math.floor(q * 10) % 10 + "，要進位，所以約是 " + ro + "。",
      [ro, tr, one, shiftOnlyDivisor]);
  });

  tpl("L4", 4, "求 1 單位的量", 1, "number", S4 + " 4-3 求1單位的量", function () {
    var wk = R(12, 95), p = R(20, 200); if (wk % 10 === 0) return null;
    var Tk = p * wk; // 一位小數
    var item = P(["牛肉", "茶葉", "咖啡豆", "起司"]);
    return number(item + " " + D(wk, 1) + " 公斤賣 " + D(Tk, 1) + " 元。1 公斤賣多少元？", p, "元",
      ["求 1 單位的量要用「總量÷單位數」", "把總價和重量的位置弄反了", "看到小數就亂用乘法"],
      [], "總價÷重量＝1 公斤的價錢：" + D(Tk, 1) + "÷" + D(wk, 1) + "＝" + p + "（元）。");
  });

  tpl("L4", 5, "比率與百分率（進球率）", 2, "choice", S4 + " 4-3 小數換百分率", function () {
    var n = R(15, 40), m = R(5, n - 3);
    var r = Math.round(m / n * 100); // 百分率（四捨五入到小數第二位後換算）
    var rr = Math.round(n / m * 100), miss = Math.round((n - m) / n * 100);
    if (rr === r || miss === r) return null;
    return choice(P(NAMES) + "練習投籃，投出 " + n + " 球，投進 " + m + " 球。進球率大約是多少？（先四捨五入到小數第二位，再化成百分率）",
      r + "%", [[rr + "%", "把投進球數和投出球數弄反了，進球率要用投進÷投出"],
        [(r / 100) + "%", "化成百分率要乘 100 再加上 %"],
        [miss + "%", "算成沒投進的比率了"]],
      m + "÷" + n + "≈" + (r / 100) + "，乘 100 就是 " + r + "%。");
  });

  tpl("L4", 6, "不計算判斷商的大小（小數）", 1, "choice", S4 + " 4-4", function () {
    var A = D(R(110, 999), R(1, 2)), dk = R(2, 39); if (dk === 10 || dk % 10 === 0) return null;
    return compareQ(A, D(dk, 1), dk < 10);
  });

  tpl("L4", 7, "A 是 B 的幾倍（小數）", 2, "number", S4 + " 4-3 幾倍問題", function () {
    var bk = R(4, 30), rk = R(21, 80) * 5; // b 一位小數；倍數兩位小數
    if (bk % 10 === 0 || rk % 100 === 0) return null;
    var ak = bk * rk; // a 有三位小數
    var A = D(ak, 3), B = D(bk, 1);
    if (A.split(".")[1] && A.split(".")[1].length > 2) return null;
    return number("一條紅繩長 " + A + " 公尺，一條黃繩長 " + B + " 公尺。紅繩的長度是黃繩的幾倍？", rk / 100, "倍",
      ["把「幾倍」算成相差多少", "商的小數點沒有對齊", "把「幾倍」算成乘法"],
      [{ v: 100 / rk, t: "「A 是 B 的幾倍」要用 A÷B，順序弄反了" }],
      "紅繩是黃繩的幾倍 → 紅繩÷黃繩：" + A + "÷" + B + "＝" + D(rk, 2) + "（倍）。");
  });

  // ================= L5 比與比值 =================
  tpl("L5", 1, "比值的意義", 1, "choice", S5 + " 5-1", function () {
    var a = R(2, 15), b = R(2, 15); if (a === b) return null;
    return choice(a + "：" + b + " 的比值是多少？", fs(a, b),
      [[fs(b, a), "比值是前項÷後項，順序弄反了"], [a + "：" + b, "比和比值不一樣；比值是前項÷後項算出來的一個數"], [fs(a, a + b), "算成前項和全部的比值了"]],
      "比值＝前項÷後項：" + a + "÷" + b + "＝" + fs(a, b) + "。", null);
  });

  tpl("L5", 2, "相等的比", 1, "number", S5 + " 5-2", function () {
    var a = R(2, 9), b = R(2, 9), k = R(2, 9); if (a === b) return null;
    return number(a + "：" + b + " ＝ □：" + b * k + "，□ 是多少？", a * k, "",
      ["沒有先看後項乘了幾倍", "把前項和後項的位置弄反了", "只看前項，沒有對照後項"],
      [{ v: a + b * k - b, t: "前項後項要同乘一個數，不能同加" }],
      "後項 " + b + "×" + k + "＝" + b * k + "，前項也要 ×" + k + "：" + a + "×" + k + "＝" + a * k + "。");
  });

  tpl("L5", 3, "化成最簡整數比（整數）", 1, "choice", S5 + " 5-2 最簡整數比", function () {
    var a = R(1, 9), b = R(2, 9); if (a === b || gcd(a, b) !== 1) return null;
    var k = P([4, 6, 8, 9, 12]), p = spf(k);
    return choice("把 " + a * k + "：" + b * k + " 化成最簡整數比。", a + "：" + b,
      [[a * p + "：" + b * p, "還可以再約，前項和後項要互質"], [b + "：" + a, "前項和後項的順序不能交換"], [raw(a, b), "最簡整數比要寫成「前項：後項」，不是比值"]],
      "前後項同時除以最大公因數 " + k + "：" + a * k + "：" + b * k + "＝" + a + "：" + b + "。");
  });

  tpl("L5", 4, "小數比化成最簡整數比", 1, "choice", S5 + " 5-2 怎麼化成最簡整數比", function () {
    var a = R(1, 9), b = R(1, 9); if (a === b || gcd(a, b) !== 1) return null;
    var k = R(2, 6), A = a * k, B = b * k; // 一位小數 A/10 : B/10
    if (A % 10 === 0 || B % 10 === 0) return null;
    return choice("把 " + D(A, 1) + "：" + D(B, 1) + " 化成最簡整數比。", a + "：" + b,
      [[A + "：" + B, "前後項同乘 10 變成整數後，還要再約到互質"], [b + "：" + a, "前項和後項的順序不能交換"], [raw(a, b), "最簡整數比要寫成「前項：後項」，不是比值"]],
      "先同乘 10：" + A + "：" + B + "，再同除以 " + k + "：" + a + "：" + b + "。");
  });

  tpl("L5", 5, "分數比化成最簡整數比", 2, "choice", S5 + " 5-2 怎麼化成最簡整數比", function () {
    var b = R(2, 9), a = R(1, b - 1), d = R(2, 9), c = R(1, d - 1);
    if (gcd(a, b) !== 1 || gcd(c, d) !== 1 || b === d) return null;
    var x = a * d, y = c * b, g = gcd(x, y); x /= g; y /= g;
    if (x === y || (x === a && y === c)) return null;
    return choice("把 " + raw(a, b) + "：" + raw(c, d) + " 化成最簡整數比。", x + "：" + y,
      [[a + "：" + c, "分數比不能只看分子，要先通分或同乘分母的公倍數"], [y + "：" + x, "前項和後項的順序不能交換"], [b + "：" + d, "把分母當成比的前後項了"]],
      "前後項同乘 " + b * d + "：" + a * d + "：" + c * b + "，再約分得 " + x + "：" + y + "。");
  });

  tpl("L5", 6, "已知比，求未知數", 1, "number", S5 + " 5-3", function () {
    var a = R(2, 9), b = R(2, 9); if (a === b || gcd(a, b) !== 1) return null;
    var u = P([25, 30, 40, 50, 60, 80, 100, 120]), X = a * u;
    return number("調果汁時，西瓜汁和牛奶的比是 " + a + "：" + b + "。用了 " + X + " 毫升的西瓜汁，要加入多少毫升的牛奶？", b * u, "毫升",
      ["把西瓜汁和牛奶的對應弄反了", "把西瓜汁的量當成答案了", "以為比的後項就是答案"],
      [{ v: X * b, t: "忘了先除以前項 " + a + " 求出一份的量" }, { v: u, t: "只算出一份的量，忘了再乘後項 " + b }, { v: X + (b - a), t: "前後項要同乘，不能同加" }],
      a + "：" + b + "＝" + X + "：□，" + X + "÷" + a + "＝" + u + "，□＝" + b + "×" + u + "＝" + b * u + "。");
  });

  tpl("L5", 7, "按比例分配", 2, "number", S5 + " 5-3 已知總量", function () {
    var a = R(2, 9), b = R(2, 9); if (a === b || gcd(a, b) !== 1) return null;
    var u = R(10, 60), T0 = (a + b) * u, who = P([["哥哥", "弟弟"], ["男生", "女生"], ["甲班", "乙班"]]);
    return number("把 " + T0 + " 張貼紙按照 " + who[0] + "：" + who[1] + "＝" + a + "：" + b + " 分配。" + who[0] + "可以分到幾張？", a * u, "張",
      ["把前項和後項的人弄反了", "把總量當成答案了", "總份數算錯了（應該是前項＋後項）"],
      [{ v: T0 * a / b, t: "把總量當成後項了，應該先算總份數 " + a + "＋" + b }, { v: u, t: "只算出一份的量，忘了乘 " + a + " 份" }, { v: b * u, t: "算成" + who[1] + "的張數了" }],
      "全部有 " + a + "＋" + b + "＝" + (a + b) + " 份，一份是 " + T0 + "÷" + (a + b) + "＝" + u + "，" + who[0] + "分到 " + a + "×" + u + "＝" + a * u + " 張。");
  });

  tpl("L5", 8, "已知比值，求數量", 2, "number", S5 + " 5-3 已知比值", function () {
    var p = R(2, 17), q = R(2, 17); if (p === q || gcd(p, q) !== 1) return null;
    var t = R(2, 8), Rn = q * t;
    return number("桌上草莓糖和檸檬糖數量的比值是 " + raw(p, q) + "。檸檬糖有 " + Rn + " 顆，草莓糖有幾顆？", p * t, "顆",
      ["沒有把比值還原成比", "把檸檬糖的數量當成答案", "把比值的分子分母直接當成數量"],
      [{ v: Rn * q / p, t: "比值是前項÷後項，把它倒過來用了" }, { v: Rn * p, t: "忘了先除以 " + q + " 找出放大的倍數" }],
      "比值 " + raw(p, q) + " → 草莓：檸檬＝" + p + "：" + q + "＝□：" + Rn + "，" + Rn + "÷" + q + "＝" + t + "，□＝" + p + "×" + t + "＝" + p * t + "。");
  });
})();
