// 題庫登錄工具：各科的 q-*.js 用 FC_add() 登錄題目，展開成規格書 5.5 的格式。
// 撰寫時 choice 題的 o[0] 一律是正解，出題時會重新洗牌，所以學生看不到固定位置。
window.FC_BANK = { qs: [], concepts: {} };

(function () {
  var PRE = { math: "math", science: "sci", social: "soc", english: "en" };

  // variants 的每一筆：
  //   choice：{ lv, s: 題幹, o: [正解, 錯1, 錯2, 錯3], t: [錯1迷思, 錯2迷思, 錯3迷思], x: 解析 }
  //   spell ：{ lv, s: 題幹, a: 正確拼字, m: 遮罩(用 _ 表示要拼的字母), t: [迷思...], x }
  //   數學模板：{ lv, gen: function(R){ return {...} }, x 可省略 }
  window.FC_add = function (subject, unit, num, conceptName, source, variants) {
    var concept = PRE[subject] + "-" + unit + "-c" + (num < 10 ? "0" : "") + num;
    var bank = window.FC_BANK;
    bank.concepts[concept] = { concept: concept, subject: subject, unit: unit, conceptName: conceptName, ids: [] };
    variants.forEach(function (v, i) {
      var q = {
        id: concept + "-v" + (i + 1),
        subject: subject, unit: unit, concept: concept, conceptName: conceptName,
        level: v.lv, source: source
      };
      if (v.gen) {
        q.type = v.type || "choice";
        q.gen = v.gen;
        q.isTemplate = true;
      } else if (v.m) {
        q.type = "spell";
        q.stem = v.s;
        q.answer = v.a;
        q.spellMask = v.m;
        q.traps = v.t.slice();
        q.explain = v.x;
      } else {
        q.type = "choice";
        q.stem = v.s;
        q.options = v.o.slice();
        q.answer = 0;
        q.traps = [null].concat(v.t);
        q.explain = v.x;
      }
      bank.qs.push(q);
      bank.concepts[concept].ids.push(q.id);
    });
  };
})();
