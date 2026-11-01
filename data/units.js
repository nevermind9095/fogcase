// 科目、單元標示、單元名稱、對應的複習漫畫篇名
// comic 為 null 表示該單元沒有對應的漫畫，出處只顯示單元。
window.FC_SUBJECTS = {
  math:    { name: "數學", area: "數學檔案區", color: "#3b82c4", icon: "🔢" },
  science: { name: "自然", area: "自然檔案區", color: "#2f9e6b", icon: "🔥" },
  social:  { name: "社會", area: "社會檔案區", color: "#c47a2c", icon: "🏮" },
  english: { name: "英文", area: "英文檔案區", color: "#b0458c", icon: "✉️" }
};

window.FC_UNITS = {
  math: [
    { unit: "L1", label: "數學 L1", name: "最大公因數與最小公倍數", comic: "大露營的數字迷宮" },
    { unit: "L2", label: "數學 L2", name: "分數除法", comic: "茶飲攤的分裝大賽" },
    { unit: "L3", label: "數學 L3", name: "數量關係", comic: "步道上的路燈之謎" },
    { unit: "L4", label: "數學 L4", name: "小數除法", comic: "球場的小數點" },
    { unit: "L5", label: "數學 L5", name: "比與比值", comic: "果汁店的比例怪事" }
  ],
  science: [
    { unit: "L1", label: "自然 L1", name: "熱的影響與傳播", comic: "天燈節的怪事" },
    { unit: "L2", label: "自然 L2", name: "多變的天氣", comic: "颱風前夜的天氣圖" }
  ],
  social: [
    { unit: "L1", label: "社會 L1", name: "消費選擇與理財規劃", comic: "夜市的可疑攤位" },
    { unit: "L2", label: "社會 L2", name: "戰後經濟轉型與生活轉變", comic: "被打亂的時光相簿" }
  ],
  english: [
    { unit: "T1", label: "英文 Topic 1", name: "Where Are You From? / What Do You Like to Do?", comic: "來自世界的筆友信" },
    { unit: "PH", label: "英文 Phonics", name: "字母拼讀 ar / or / ir / ur", comic: null },
    { unit: "R1", label: "英文 Review 1", name: "筆友來信（綜合複習）", comic: "來自世界的筆友信" }
  ]
};

window.FC_unitInfo = function (subject, unit) {
  var list = window.FC_UNITS[subject] || [];
  for (var i = 0; i < list.length; i++) if (list[i].unit === unit) return list[i];
  return { unit: unit, label: subject + " " + unit, name: "", comic: null };
};
