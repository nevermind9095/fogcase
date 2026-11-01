// 英文題庫：Super Fun Book 7 — Topic 1、Phonics 1～2、Review 1
// 依據：課本 Topic 1 / Phonics / Review 1、Lesson 1、2 文法 PPT；題型參考 SF7 期中考卷，全部重新命題。
(function () {
  var T = "SF7 Topic 1 課本與 Lesson 1 文法 PPT";
  var T2 = "SF7 Topic 1 課本與 Lesson 2 文法 PPT";
  var P = "SF7 Phonics 1～2";
  var R = "SF7 Review 1";

  // ===== Topic 1 =====
  FC_add("english", "T1", 1, "國家單字", T + "（Theme Words）", [
    { lv: 1, s: "「日本」的英文是哪一個？", o: ["Japan", "Korea", "France", "Vietnam"],
      t: ["把日本和韓國（Korea）的英文弄混了", "把法國（France）當成日本", "把越南（Vietnam）當成日本"],
      x: "Japan＝日本，Korea＝韓國，France＝法國，Vietnam＝越南。" },
    { lv: 1, s: "Australia 是哪一個國家？", o: ["澳洲", "英國", "美國", "法國"],
      t: ["把 Australia 和 the UK（英國）弄混了", "把 Australia 和 the USA（美國）弄混了", "把 Australia 和 France（法國）弄混了"],
      x: "Australia＝澳洲；the UK＝英國；the USA＝美國；France＝法國。" },
    { lv: 1, s: "「越南」的英文是哪一個？", o: ["Vietnam", "Taiwan", "Korea", "Japan"],
      t: ["把越南和臺灣（Taiwan）的英文弄混了", "把越南和韓國（Korea）的英文弄混了", "把越南和日本（Japan）的英文弄混了"],
      x: "Vietnam＝越南。課本裡 Wendy 的媽媽就是從 Vietnam 來的。" },
    { lv: 1, s: "「英國」的英文是哪一個？", o: ["the UK", "the USA", "France", "Australia"],
      t: ["把英國（the UK）和美國（the USA）弄混了", "把英國和法國（France）弄混了", "把英國和澳洲（Australia）弄混了"],
      x: "the UK＝英國（the United Kingdom），the USA＝美國。" }
  ]);

  FC_add("english", "T1", 2, "國家名稱的大寫與 the", T + "（小叮嚀：國家第一個字母要大寫）", [
    { lv: 1, s: "下列哪一個國家名稱的寫法正確？", o: ["Japan", "japan", "the Japan", "Japans"],
      t: ["國家名稱的第一個字母要大寫", "Japan 前面不需要加 the", "國家名稱後面不加 s"],
      x: "國家名稱第一個字母要大寫：Japan。只有 the USA、the UK 前面要加 the。" },
    { lv: 2, s: "選出寫法正確的句子：", o: ["He's from the USA.", "He's from USA.", "He's from the usa.", "He's from the Usa."],
      t: ["the USA 前面要加 the", "USA 是縮寫，三個字母都要大寫", "以為只有第一個字母大寫，USA 三個字母都要大寫"],
      x: "美國要寫成 the USA：前面加 the，USA 三個字母都大寫。" },
    { lv: 2, s: "選出寫法正確的句子：", o: ["Emma is from the UK.", "Emma is from UK.", "Emma is from the uk.", "Emma is from a UK."],
      t: ["the UK 前面要加 the", "UK 是縮寫，兩個字母都要大寫", "國家前面不能用 a"],
      x: "英國要寫成 the UK：前面加 the，UK 兩個字母都大寫。" }
  ]);

  FC_add("english", "T1", 3, "國家單字拼字", T + "（Theme Words）", [
    { lv: 1, s: "拼出「日本」：", a: "Japan", m: "_ap_n",
      t: ["國家名稱的第一個字母要大寫", "把 a 和 o 的拼法弄混了", "Japan 兩個母音都是 a"], x: "Japan：J 要大寫，兩個母音都是 a。" },
    { lv: 1, s: "拼出「韓國」：", a: "Korea", m: "K_r_a",
      t: ["Korea 中間是 o、後面是 e", "把 e 和 a 的位置弄反了", "國家名稱的第一個字母要大寫"], x: "Korea：K-o-r-e-a。" },
    { lv: 2, s: "拼出「越南」：", a: "Vietnam", m: "_ietn_m",
      t: ["國家名稱的第一個字母要大寫", "Vietnam 最後是 -nam，不是 -nem", "把 V 和 W 弄混了"], x: "Vietnam：V 要大寫，最後是 nam。" },
    { lv: 2, s: "拼出「澳洲」：", a: "Australia", m: "Austr_l_a",
      t: ["Australia 中間是 a、後面是 i", "把 i 和 e 弄混了", "漏掉中間的 a"], x: "Australia：A-u-s-t-r-a-l-i-a。" },
    { lv: 1, s: "拼出「臺灣」：", a: "Taiwan", m: "T_iw_n",
      t: ["Taiwan 的兩個空格都是 a", "把 a 和 e 弄混了", "國家名稱的第一個字母要大寫"], x: "Taiwan：T-a-i-w-a-n。" },
    { lv: 1, s: "拼出「法國」：", a: "France", m: "Fr_nc_",
      t: ["France 結尾有一個不發音的 e", "把 a 和 e 的位置弄反了", "國家名稱的第一個字母要大寫"], x: "France：F-r-a-n-c-e，結尾的 e 不要漏掉。" }
  ]);

  FC_add("english", "T1", 4, "Where are you from? 問答", T + "（Pattern A）", [
    { lv: 1, s: "A: Where are you from?\nB: ______", o: ["I'm from Korea.", "I'm Korea.", "Yes, I am.", "I like Korea."],
      t: ["少了 from，「來自」要說 I'm from…", "Where 問句要回答地方，不能用 Yes / No 回答", "把「來自」和「喜歡」弄混了"],
      x: "Where are you from? 要回答 I'm from＋國家。" },
    { lv: 1, s: "A: ______\nB: I'm from Australia.", o: ["Where are you from?", "What are you from?", "Where do you from?", "Who are you from?"],
      t: ["問「哪裡」要用 Where，不是 What", "be 動詞的句子不能用 do 代替 are", "問「哪裡」要用 Where，不是 Who"],
      x: "回答是「來自澳洲」，所以問句是 Where are you from?" },
    { lv: 2, s: "下列哪一句是正確的？", o: ["Where are you from?", "Where are you come from?", "Where you are from?", "Where do you are from?"],
      t: ["come 是動詞，不能和 be 動詞 are 放在同一句", "問句要把 are 放到 you 的前面", "do 和 are 不能同時用"],
      x: "正確說法是 Where are you from?（come 不能和 are 一起用）。" }
  ]);

  FC_add("english", "T1", 5, "Where is he / she from? 問答", T + "（Pattern A、B）", [
    { lv: 1, s: "A: Where is Ken from?\nB: ______", o: ["He's from Japan.", "She's from Japan.", "I'm from Japan.", "He's Japan."],
      t: ["Ken 是男生，要用 He", "問的是 Ken，不是問自己", "少了 from，「來自」要說 He's from…"],
      x: "問 Ken（男生）來自哪裡，要回答 He's from…" },
    { lv: 1, s: "A: Where ___ Wendy from?\nB: She's from Taiwan.", o: ["is", "are", "am", "do"],
      t: ["Wendy 是一個人（she），be 動詞要用 is，不是 are", "am 只能搭配 I", "be 動詞的問句不能用 do"],
      x: "Wendy＝she，be 動詞用 is：Where is Wendy from?" },
    { lv: 2, s: "A: Where is your mom from?\nB: ______ from Vietnam.", o: ["She's", "He's", "I'm", "They're"],
      t: ["mom 是女生，要用 She", "問的是媽媽，不是自己", "mom 是一個人，不能用 They"],
      x: "your mom＝she，所以回答 She's from Vietnam." }
  ]);

  FC_add("english", "T1", 6, "be 動詞 am / is / are", T + "（Pattern 表格）", [
    { lv: 1, s: "They ___ from the UK.", o: ["are", "is", "am", "be"],
      t: ["They 是複數，要用 are，不是 is", "am 只能搭配 I", "句子裡要用 are，不能用原形 be"], x: "They 搭配 are：They are from the UK." },
    { lv: 1, s: "I ___ from Taiwan.", o: ["am", "is", "are", "do"],
      t: ["I 要搭配 am，不是 is", "I 要搭配 am，不是 are", "這句要用 be 動詞，不能用 do"], x: "I 搭配 am：I am from Taiwan." },
    { lv: 2, s: "Ken and Mike ___ from Japan.", o: ["are", "is", "am", "does"],
      t: ["兩個人是複數，要用 are", "am 只能搭配 I", "這句要用 be 動詞，不能用 does"], x: "Ken and Mike＝they，要用 are。" },
    { lv: 2, s: "My brother and I ___ from Taiwan.", o: ["are", "am", "is", "do"],
      t: ["看到 I 就用 am，沒注意前面還有 my brother", "兩個人是複數，不能用 is", "這句要用 be 動詞，不能用 do"],
      x: "My brother and I＝we（我們），要用 are。" }
  ]);

  FC_add("english", "T1", 7, "Is he / she from…? 的回答", T + "（Pattern B）", [
    { lv: 1, s: "A: Is she from France?\nB: Yes, ______.", o: ["she is", "she isn't", "he is", "she does"],
      t: ["Yes 後面要用肯定的 she is", "問的是 she，回答也要用 she", "Is 問句要用 is 回答，不能用 does"],
      x: "Is she…? 肯定回答：Yes, she is." },
    { lv: 1, s: "A: Is Andy from the USA?\nB: No, he isn't. ______", o: ["He's from the UK.", "He's from the USA.", "She's from the UK.", "I'm from the UK."],
      t: ["他不是來自美國，就不能再說 from the USA", "Andy 是男生，要用 He", "問的是 Andy，不是自己"],
      x: "No, he isn't. 後面接他真正來自的國家：He's from the UK." },
    { lv: 2, s: "A: ______\nB: No, she isn't. She's from Korea.", o: ["Is she from Japan?", "Is she from Korea?", "Are you from Japan?", "Where is she from?"],
      t: ["她就是來自韓國，問 from Korea 的話應該回答 Yes", "回答用 she，問句就不會問 you", "Where 問句不能用 Yes / No 回答"],
      x: "回答 No, she isn't，表示問的國家不對；她來自韓國，所以問句是 Is she from Japan?" },
    { lv: 2, s: "A: ______ Emma and Mike from the USA?\nB: Yes, they are.", o: ["Are", "Is", "Do", "Does"],
      t: ["Emma and Mike 是兩個人，要用 Are", "be 動詞的問句不能用 Do", "be 動詞的問句不能用 Does"],
      x: "Emma and Mike＝they，問句用 Are：Are Emma and Mike from the USA?" }
  ]);

  FC_add("english", "T1", 8, "Are you from…? 的回答", T + "（Pattern B）", [
    { lv: 1, s: "A: Are you from Taiwan?\nB: Yes, ______.", o: ["I am", "I'm", "you are", "I do"],
      t: ["肯定簡答不能縮寫成 I'm", "問 you，要用 I 回答自己", "be 動詞問句要用 am 回答，不能用 do"],
      x: "Are you…? 肯定回答：Yes, I am.（不能說 Yes, I'm.）" },
    { lv: 1, s: "A: Are you from Korea?\nB: No, ______. I'm from Japan.", o: ["I'm not", "I am", "I don't", "you aren't"],
      t: ["No 後面要用否定的 I'm not", "be 動詞問句不能用 don't 回答", "回答自己的事要用 I"],
      x: "Are you…? 否定回答：No, I'm not." },
    { lv: 2, s: "A: Are you from Australia?\n下列哪一個回答是正確的？", o: ["No, I'm not. I'm from France.", "Yes, I is.", "No, I don't. I'm from France.", "Yes, you are."],
      t: ["I 要搭配 am，不是 is", "be 動詞問句要用 be 動詞回答，不能用 don't", "回答自己的事要用 I am"],
      x: "Are you…? 用 Yes, I am. 或 No, I'm not. 回答。" }
  ]);

  FC_add("english", "T1", 9, "讀懂自我介紹（國家）", T + "（Pattern B、Reading）", [
    { lv: 1, s: "Hi! I'm Tom. I'm from Korea. This is my friend Sam. He's from Australia.\nQ: Where is Sam from?",
      o: ["He's from Australia.", "He's from Korea.", "She's from Australia.", "I'm from Australia."],
      t: ["把 Tom 的國家當成 Sam 的國家", "Sam 是男生（文中用 He），要用 He", "問的是 Sam，不是自己"],
      x: "文中說 He's from Australia，Sam 來自澳洲。" },
    { lv: 1, s: "Hello, I'm Amy. I'm not from the USA. I'm from the UK.\nQ: Is Amy from the USA?",
      o: ["No, she isn't.", "Yes, she is.", "No, he isn't.", "Yes, I am."],
      t: ["沒讀到 I'm not from the USA", "Amy 是女生，要用 she", "問的是 Amy，不是自己"],
      x: "Amy 說 I'm not from the USA，所以回答 No, she isn't." },
    { lv: 2, s: "Mia: I'm from Taiwan. I like to go camping.\nLeo: I'm from the USA. I like to ride a bike.\nQ: Who is from the USA?",
      o: ["Leo", "Mia", "Mia and Leo", "Mia's brother"],
      t: ["把 Mia 和 Leo 的國家弄混了", "沒注意兩個人來自不同國家", "文中沒有提到 Mia 的哥哥"],
      x: "Leo 說 I'm from the USA。" }
  ]);

  FC_add("english", "T1", 10, "休閒活動單字", T2 + "（Theme Words）", [
    { lv: 1, s: "「去購物」的英文是？", o: ["go shopping", "go camping", "play shopping", "watch shopping"],
      t: ["把 shopping（購物）和 camping（露營）弄混了", "購物要用 go，不是 play", "watch 是「看」，不能搭配 shopping"],
      x: "去購物＝go shopping。" },
    { lv: 1, s: "ride a bike 的意思是？", o: ["騎腳踏車", "看電視", "拜訪朋友", "去露營"],
      t: ["把 ride a bike 和 watch TV 弄混了", "把 ride a bike 和 visit my friend 弄混了", "把 ride a bike 和 go camping 弄混了"],
      x: "ride a bike＝騎腳踏車。" },
    { lv: 1, s: "「拜訪我的朋友」的英文是？", o: ["visit my friend", "watch my friend", "play my friend", "go my friend"],
      t: ["watch 是「看」，拜訪要用 visit", "play 是玩，拜訪要用 visit", "go 後面不能直接接 my friend"],
      x: "拜訪我的朋友＝visit my friend。" },
    { lv: 1, s: "「打電玩」的英文是？", o: ["play video games", "watch video games", "go video games", "ride video games"],
      t: ["watch 是「看」，打電玩要用 play", "go 不能搭配 video games", "ride 是騎，不能搭配 video games"],
      x: "打電玩＝play video games。" }
  ]);

  FC_add("english", "T1", 11, "休閒活動拼字", T2 + "（Theme Words）", [
    { lv: 1, s: "拼出「籃球」：", a: "basketball", m: "bask_tb_ll",
      t: ["basket 的 e 容易漏掉", "ball 的母音是 a", "把 a 和 e 弄混了"], x: "basketball＝basket＋ball。" },
    { lv: 1, s: "拼出「露營」：", a: "camping", m: "c_mp_ng",
      t: ["camp 的母音是 a", "-ing 的 i 不要漏掉", "把 a 和 e 弄混了"], x: "camping＝camp＋ing。" },
    { lv: 2, s: "拼出「購物」：", a: "shopping", m: "sho__ing",
      t: ["shop 加 ing 要重複字尾 p", "只寫了一個 p", "把 p 寫成 b"], x: "shop＋p＋ing＝shopping（重複字尾 p）。" },
    { lv: 1, s: "拼出「電玩」：", a: "video", m: "v_d_o",
      t: ["video 的兩個空格是 i 和 e", "把 i 和 e 的位置弄反了", "把 e 寫成 a"], x: "video：v-i-d-e-o。" },
    { lv: 1, s: "拼出「拜訪」：", a: "visit", m: "v_s_t",
      t: ["visit 的兩個母音都是 i", "把 i 寫成 e", "把 i 寫成 a"], x: "visit：v-i-s-i-t。" }
  ]);

  FC_add("english", "T1", 12, "play 和 go 的搭配", T2 + "（單字文法 play / go）", [
    { lv: 1, s: "I like to ___ basketball.", o: ["play", "go", "ride", "visit"],
      t: ["basketball 是球類運動，要用 play，不是 go", "ride 用在騎腳踏車", "visit 用在拜訪"], x: "球類運動用 play：play basketball。" },
    { lv: 1, s: "They like to ___ camping.", o: ["go", "play", "ride", "watch"],
      t: ["camping 是要到某個地方的活動，要用 go", "ride 用在騎腳踏車", "watch 是看，不能搭配 camping"], x: "go＋動詞ing：go camping。" },
    { lv: 2, s: "下列哪一個搭配是正確的？", o: ["go shopping", "play shopping", "go basketball", "play camping"],
      t: ["shopping 要搭配 go", "球類運動 basketball 要搭配 play", "camping 要搭配 go"],
      x: "go＋動詞ing（go shopping、go camping）；play＋球類或遊戲（play basketball）。" }
  ]);

  FC_add("english", "T1", 13, "What do you like to do? 問答", T2 + "（Pattern C）", [
    { lv: 1, s: "A: What do you like to do in your free time?\nB: ______", o: ["I like to watch TV.", "I like watch TV.", "I likes to watch TV.", "I'm from Taiwan."],
      t: ["like 後面要先加 to 再接動作", "I 後面的 like 不加 s", "問的是喜歡做什麼，不是來自哪裡"],
      x: "回答喜歡做的事：I like to＋動作。" },
    { lv: 1, s: "A: ______\nB: I like to go camping.", o: ["What do you like to do?", "Where are you from?", "Is he from Japan?", "What does he like to do?"],
      t: ["I like to… 是說喜歡做什麼，不是說來自哪裡", "Is 問句要用 Yes / No 回答", "回答用 I，問句應該問 you，不是 he"],
      x: "問「你喜歡做什麼」：What do you like to do?" },
    { lv: 2, s: "What do you like to do in your free time? 這句話的意思是？", o: ["你空閒時喜歡做什麼？", "你來自哪裡？", "你什麼時候有空？", "你喜歡你的家人嗎？"],
      t: ["把 What 問句和 Where 問句弄混了", "把 free time 當成問句的重點", "沒看懂 like to do 的意思"],
      x: "free time＝空閒時間，like to do＝喜歡做。" }
  ]);

  FC_add("english", "T1", 14, "What does he / she like to do? 問答", T2 + "（Pattern D）", [
    { lv: 1, s: "A: What does she like to do?\nB: She ___ to ride a bike.", o: ["likes", "like", "liking", "is like"],
      t: ["she 後面的 like 要加 s", "like 後面接 to，不用 -ing", "不能同時用 is 和 like"],
      x: "He / She / 人名 後面的 like 要加 s：She likes to…" },
    { lv: 1, s: "A: What does your dad like to do in his free time?\nB: ______", o: ["He likes to play basketball.", "She likes to play basketball.", "I like to play basketball.", "He like to play basketball."],
      t: ["dad 是男生，要用 He", "問的是爸爸，不是自己", "He 後面的 like 要加 s"],
      x: "dad＝he：He likes to…" },
    { lv: 2, s: "A: What does Lily like to do in her free time?\nB: ______", o: ["She likes to dance.", "She like to dance.", "Her likes to dance.", "She likes dance to."],
      t: ["She 後面的 like 要加 s", "主詞要用 She，her 是「她的」", "to 要放在動作的前面"],
      x: "She likes to＋動作：She likes to dance." }
  ]);

  FC_add("english", "T1", 15, "do 和 does 的搭配", T2 + "（Do / Does 搭配不同人稱）", [
    { lv: 1, s: "What ___ they like to do?", o: ["do", "does", "is", "are"],
      t: ["they 是複數，要用 do，不是 does", "這個問句要用 do，不能用 is", "這個問句要用 do，不能用 are"],
      x: "I / you / we / they 搭配 do。" },
    { lv: 1, s: "What ___ he like to do?", o: ["does", "do", "is", "are"],
      t: ["he 是第三人稱單數，要用 does", "這個問句要用 does，不能用 is", "這個問句要用 does，不能用 are"],
      x: "he / she / it / 人名 搭配 does。" },
    { lv: 2, s: "What ___ Wendy and Emma like to do?", o: ["do", "does", "is", "doing"],
      t: ["Wendy and Emma 是兩個人＝they，要用 do", "這個問句要用 do，不能用 is", "問句開頭要用 do，不是 doing"],
      x: "兩個人＝they，搭配 do。" },
    { lv: 2, s: "What ___ your cat like to do?", o: ["does", "do", "are", "am"],
      t: ["your cat 是一隻貓（it），要用 does", "這個問句要用 does，不能用 are", "am 只能搭配 I"],
      x: "your cat＝it，搭配 does。" }
  ]);

  FC_add("english", "T1", 16, "所有格 my / your / his / her / their", T2 + "（所有格）", [
    { lv: 1, s: "What does he like to do in ___ free time?", o: ["his", "her", "he", "their"],
      t: ["her 是「她的」，he 要用 his", "he 是主格，「他的」要用 his", "their 是「他們的」"],
      x: "he 的所有格是 his。" },
    { lv: 1, s: "What do you like to do in ___ free time?", o: ["your", "you", "my", "his"],
      t: ["you 是主格，「你的」要用 your", "問句問 you，要用 your，不是 my", "his 是「他的」"],
      x: "you 的所有格是 your。" },
    { lv: 2, s: "What do they like to do in ___ free time?", o: ["their", "they", "its", "her"],
      t: ["they 是主格，「他們的」要用 their", "its 是「牠的／它的」", "her 是「她的」"],
      x: "they 的所有格是 their。" },
    { lv: 2, s: "What does Emma like to do in ___ free time?", o: ["her", "his", "she", "its"],
      t: ["Emma 是女生，要用 her", "she 是主格，「她的」要用 her", "its 是「牠的／它的」"],
      x: "Emma＝she，所有格是 her。" }
  ]);

  FC_add("english", "T1", 17, "找出正確的句子（like / likes）", T2 + "（文法總練習）", [
    { lv: 2, s: "下列哪一句是正確的？", o: ["He likes to play video games.", "He like to play video games.", "He likes to go video games.", "He likes play video games."],
      t: ["He 後面的 like 要加 s", "video games 要搭配 play", "likes 後面要先接 to"],
      x: "He likes to play video games." },
    { lv: 2, s: "下列哪一句是「錯誤」的？", o: ["They likes to go shopping.", "I like to ride a bike.", "She likes to watch TV.", "We like to go camping."],
      t: ["不知道 I 後面的 like 不加 s", "不知道 she 後面的 like 要加 s", "不知道 we 後面的 like 不加 s"],
      x: "They 後面的 like 不加 s，要說 They like to go shopping." },
    { lv: 2, s: "下列哪一句是正確的？", o: ["My mom likes to go shopping.", "My mom like to go shopping.", "My mom likes to play shopping.", "My mom likes to go shop."],
      t: ["my mom＝she，like 要加 s", "shopping 要搭配 go", "go 後面要接 shopping（-ing 形式）"],
      x: "My mom likes to go shopping." }
  ]);

  FC_add("english", "T1", 18, "go＋動詞ing 的拼法", T2 + "（單字文法 go＋動詞ing）", [
    { lv: 2, s: "「去購物」正確的拼法是？", o: ["go shopping", "go shoping", "go shopeing", "go shops"],
      t: ["shop 要重複字尾 p 再加 ing", "shop 後面不用加 e", "go 後面要接 -ing 形式"],
      x: "shop 是子音＋母音＋子音，要重複字尾：shopping。" },
    { lv: 2, s: "「去跳舞」正確的拼法是？", o: ["go dancing", "go danceing", "go dancinng", "go dance"],
      t: ["字尾是 e 的動詞，要去 e 再加 ing", "dance 不用重複字尾", "go 後面要接 -ing 形式"],
      x: "dance 去 e 加 ing：dancing。" },
    { lv: 2, s: "「去游泳」正確的拼法是？", o: ["go swimming", "go swiming", "go swimeing", "go swim"],
      t: ["swim 要重複字尾 m 再加 ing", "swim 後面不用加 e", "go 後面要接 -ing 形式"],
      x: "swim 是子音＋母音＋子音，要重複字尾：swimming。" },
    { lv: 2, s: "「去露營」正確的拼法是？", o: ["go camping", "go campping", "go campeing", "go camp"],
      t: ["camp 結尾有兩個子音，直接加 ing，不用重複", "camp 後面不用加 e", "go 後面要接 -ing 形式"],
      x: "camp 直接加 ing：camping。" }
  ]);

  // ===== Phonics 1～2 =====
  FC_add("english", "PH", 1, "ar 的發音", P + "（Phonics Fun 1）", [
    { lv: 1, s: "哪一個字裡有和 car 一樣的 ar 音？", o: ["farm", "corn", "bird", "nurse"],
      t: ["把 or 的音和 ar 弄混了", "把 ir 的音和 ar 弄混了", "把 ur 的音和 ar 弄混了"], x: "car、farm 都有 ar 的音。" },
    { lv: 1, s: "下列哪一個字有 ar 的音？", o: ["park", "fork", "girl", "turn"],
      t: ["把 or（fork）和 ar 弄混了", "把 ir（girl）和 ar 弄混了", "把 ur（turn）和 ar 弄混了"], x: "park 有 ar 的音，和 car、arm 一樣。" },
    { lv: 2, s: "哪一組字「都」有 ar 的音？", o: ["arm、party", "arm、horse", "car、turn", "farm、firm"],
      t: ["horse 是 or 的音", "turn 是 ur 的音", "firm 是 ir 的音"], x: "arm、party 都是 ar。" }
  ]);

  FC_add("english", "PH", 2, "or 的發音", P + "（Phonics Fun 1）", [
    { lv: 1, s: "下列哪一個字有和 corn 一樣的 or 音？", o: ["horse", "car", "shirt", "purple"],
      t: ["把 ar（car）和 or 弄混了", "把 ir（shirt）和 or 弄混了", "把 ur（purple）和 or 弄混了"], x: "corn、horse 都有 or 的音。" },
    { lv: 1, s: "哪一個字有 or 的音？", o: ["forty", "party", "dirty", "turtle"],
      t: ["把 ar（party）和 or 弄混了", "把 ir（dirty）和 or 弄混了", "把 ur（turtle）和 or 弄混了"], x: "forty 有 or 的音。" },
    { lv: 2, s: "哪一組字「都」有 or 的音？", o: ["fork、born", "fork、farm", "horse、nurse", "corn、card"],
      t: ["farm 是 ar 的音", "nurse 是 ur 的音", "card 是 ar 的音"], x: "fork、born 都是 or。" }
  ]);

  FC_add("english", "PH", 3, "ir 的發音與拼字", P + "（Phonics Fun 2）", [
    { lv: 1, s: "哪一個字有和 bird 一樣的 ir 音？", o: ["shirt", "card", "fork", "farm"],
      t: ["把 ar（card）和 ir 弄混了", "把 or（fork）和 ir 弄混了", "把 ar（farm）和 ir 弄混了"], x: "bird、shirt 都有 ir 的音。" },
    { lv: 1, s: "下列哪一個字的「拼字」裡有 ir？", o: ["dirty", "turtle", "party", "corn"],
      t: ["turtle 的音和 ir 一樣，但拼字是 ur", "party 的拼字是 ar", "corn 的拼字是 or"], x: "dirty 拼字裡有 ir。" },
    { lv: 2, s: "girl 裡的 ir 音，在下列哪一個字裡也聽得到？", o: ["nurse", "horse", "car", "arm"],
      t: ["or 的音和 ir 不同", "ar 的音和 ir 不同", "arm 的 ar 和 ir 不同"], x: "ir 和 ur 的發音相同，所以 girl 和 nurse 的音一樣。" }
  ]);

  FC_add("english", "PH", 4, "ur 的發音與拼字", P + "（Phonics Fun 2）", [
    { lv: 1, s: "下列哪一個字有和 turn 一樣的 ur 音？", o: ["purple", "park", "pork", "corn"],
      t: ["把 ar（park）和 ur 弄混了", "把 or（pork）和 ur 弄混了", "把 or（corn）和 ur 弄混了"], x: "turn、purple 都有 ur 的音。" },
    { lv: 1, s: "下列哪一個字的「拼字」裡有 ur？", o: ["surf", "shirt", "farm", "fork"],
      t: ["shirt 的音和 ur 一樣，但拼字是 ir", "farm 的拼字是 ar", "fork 的拼字是 or"], x: "surf 拼字裡有 ur。" },
    { lv: 2, s: "nurse 和下列哪一個字的母音發音相同？", o: ["girl", "fork", "card", "born"],
      t: ["or 的音和 ur 不同", "ar 的音和 ur 不同", "born 的 or 和 ur 不同"], x: "ur 和 ir 發音相同：nurse、girl。" }
  ]);

  FC_add("english", "PH", 5, "找出發音不同的字", P + "（Phonics Fun 1、2）", [
    { lv: 2, s: "哪一個字的發音和其他三個不同？", o: ["corn", "car", "farm", "party"],
      t: ["car 和 farm、party 一樣都是 ar 的音", "farm 和 car、party 一樣都是 ar 的音", "party 和 car、farm 一樣都是 ar 的音"],
      x: "car、farm、party 都是 ar；corn 是 or。" },
    { lv: 2, s: "哪一個字的發音和其他三個不同？", o: ["park", "bird", "nurse", "girl"],
      t: ["不知道 bird 的 ir 和 nurse 的 ur 發音一樣", "不知道 nurse 的 ur 和 ir 發音一樣", "不知道 girl 的 ir 和 ur 發音一樣"],
      x: "ir 和 ur 發音相同（bird、nurse、girl）；park 是 ar。" },
    { lv: 2, s: "哪一個字的發音和其他三個不同？", o: ["turtle", "fork", "horse", "born"],
      t: ["fork 和 horse、born 一樣都是 or 的音", "horse 和 fork、born 一樣都是 or 的音", "born 和 fork、horse 一樣都是 or 的音"],
      x: "fork、horse、born 都是 or；turtle 是 ur。" }
  ]);

  FC_add("english", "PH", 6, "補上字母組合（ar / or / ir / ur）", P, [
    { lv: 1, s: "農場：", a: "farm", m: "f__m", t: ["把 ar 和 or 弄混了", "把 ar 和 ur 弄混了", "沒有對照發音來拼字"], x: "farm 是 ar。" },
    { lv: 1, s: "玉米：", a: "corn", m: "c__n", t: ["把 or 和 ar 弄混了", "把 or 和 ur 弄混了", "沒有對照發音來拼字"], x: "corn 是 or。" },
    { lv: 1, s: "鳥：", a: "bird", m: "b__d", t: ["ir 和 ur 發音一樣，要記住 bird 是 ir", "把 ir 和 ar 弄混了", "沒有對照發音來拼字"], x: "bird 是 ir。" },
    { lv: 2, s: "護士：", a: "nurse", m: "n__se", t: ["ur 和 ir 發音一樣，要記住 nurse 是 ur", "把 ur 和 or 弄混了", "沒有對照發音來拼字"], x: "nurse 是 ur。" },
    { lv: 2, s: "襯衫：", a: "shirt", m: "sh__t", t: ["ir 和 ur 發音一樣，要記住 shirt 是 ir", "把 ir 和 ar 弄混了", "沒有對照發音來拼字"], x: "shirt 是 ir。" },
    { lv: 2, s: "烏龜：", a: "turtle", m: "t__tle", t: ["ur 和 ir 發音一樣，要記住 turtle 是 ur", "把 ur 和 or 弄混了", "沒有對照發音來拼字"], x: "turtle 是 ur。" }
  ]);

  // ===== Review 1 =====
  var L1 = "Dear Ben,\nI'm Sofia. I'm from France. I'm twelve years old. In my free time, I like to ride a bike with my sister. My dad likes to cook, but he can't ride a bike. How about you?\nSofia";
  var L2 = "Hi Amy,\nMy name is Leo. I'm from Australia. I have free time every Sunday. I like to go camping with my family. My brother can't swim, but he likes to play basketball.\nLeo";
  var L3 = "Dear Kevin,\nI'm Nina from Vietnam. I'm ten years old. My mom and I like to go shopping. My grandpa likes to watch TV. What do you like to do?\nNina";

  FC_add("english", "R1", 1, "讀筆友信：找出細節", R + "（Reading）", [
    { lv: 1, s: L1 + "\n\nQ: Where is Sofia from?", o: ["France", "Taiwan", "the UK", "Japan"],
      t: ["以為筆友都是來自臺灣", "沒有讀到 I'm from France", "把 Review 1 裡 Yoshi 的國家記混了"], x: "信中說 I'm from France。" },
    { lv: 1, s: L2 + "\n\nQ: What does Leo like to do with his family?", o: ["He likes to go camping.", "He likes to play basketball.", "He likes to swim.", "She likes to go camping."],
      t: ["把哥哥喜歡的事當成 Leo 喜歡的事", "沒讀到 My brother can't swim", "Leo 是男生，要用 He"], x: "信中說 I like to go camping with my family。" },
    { lv: 1, s: L3 + "\n\nQ: How old is Nina?", o: ["She's ten years old.", "She's eleven years old.", "She's from Vietnam.", "She's twelve years old."],
      t: ["沒讀到 I'm ten years old", "問的是幾歲，不是來自哪裡", "把 ten 和 twelve 弄混了"], x: "信中說 I'm ten years old。" }
  ]);

  FC_add("english", "R1", 2, "讀筆友信：判斷對錯", R + "（Reading）", [
    { lv: 2, s: L1 + "\n\nQ: Which is TRUE?", o: ["Sofia likes to ride a bike with her sister.", "Sofia's dad likes to ride a bike.", "Sofia is from Japan.", "Sofia is eleven years old."],
      t: ["沒讀到 he can't ride a bike", "沒讀到 I'm from France", "沒讀到 I'm twelve years old"], x: "信中說 I like to ride a bike with my sister。" },
    { lv: 2, s: L2 + "\n\nQ: Which is TRUE?", o: ["Leo has free time every Sunday.", "Leo is from the UK.", "Leo's brother can swim.", "Leo likes to play video games."],
      t: ["沒讀到 I'm from Australia", "沒讀到 My brother can't swim", "信中沒有提到 Leo 喜歡打電玩"], x: "信中說 I have free time every Sunday。" },
    { lv: 2, s: L3 + "\n\nQ: Which is TRUE?", o: ["Nina's grandpa likes to watch TV.", "Nina's mom likes to watch TV.", "Nina is from Korea.", "Nina likes to go camping."],
      t: ["把爺爺和媽媽喜歡的事弄混了", "沒讀到 I'm Nina from Vietnam", "信中說的是 go shopping，不是 go camping"], x: "信中說 My grandpa likes to watch TV。" }
  ]);

  FC_add("english", "R1", 3, "對話的合適回應", R + "（Read and Write、Listen and Check）", [
    { lv: 1, s: "A: Where's your pen pal from?\nB: ______", o: ["He's from Japan.", "He likes to go camping.", "Yes, he is.", "I'm eleven years old."],
      t: ["問的是來自哪裡，不是喜歡做什麼", "Where 問句不能用 Yes / No 回答", "問的是筆友來自哪裡，不是自己幾歲"], x: "Where's…from? 要回答國家：He's from Japan." },
    { lv: 1, s: "A: What does your mom like to do in her free time?\nB: ______", o: ["She likes to ride a bike.", "She's from Taiwan.", "Yes, she does.", "He likes to ride a bike."],
      t: ["問的是喜歡做什麼，不是來自哪裡", "What 問句不能用 Yes / No 回答", "mom 是女生，要用 She"], x: "What does your mom like to do? → She likes to…" },
    { lv: 2, s: "A: I like to play basketball. How about you?\nB: ______", o: ["I like to go shopping.", "I'm from Korea.", "Yes, he is.", "She likes to dance."],
      t: ["How about you 是在問你喜歡做什麼，不是來自哪裡", "這裡不是 Yes / No 問句", "How about you 是問你自己，要用 I 回答"], x: "How about you? 是問「那你呢？」，回答自己喜歡做的事。" }
  ]);

  FC_add("english", "R1", 4, "連接詞 but / because 與 can't", R + "（Reading、Practice）", [
    { lv: 1, s: "My mom can't play basketball, ___ she likes to ride a bike.", o: ["but", "because", "where", "what"],
      t: ["前後意思相反時要用 but；because 是說明原因", "where 是問地點的疑問詞", "what 是問什麼的疑問詞"], x: "前後意思相反（不會打籃球／喜歡騎車），用 but（但是）。" },
    { lv: 1, s: "Tim can't ride a bike. 這句話的意思是？", o: ["Tim 不會騎腳踏車。", "Tim 會騎腳踏車。", "Tim 喜歡騎腳踏車。", "Tim 有一台腳踏車。"],
      t: ["can't 是「不會、不能」，不是 can", "把 can't 和 like 弄混了", "沒看懂 can't ride 的意思"], x: "can't＝不會／不能。" },
    { lv: 2, s: "I like to go camping ___ I can see many stars at night.", o: ["because", "but", "where", "what"],
      t: ["後面是在說原因，要用 because；but 是表示相反", "where 是問地點的疑問詞", "what 是問什麼的疑問詞"], x: "後面說明「為什麼喜歡露營」，用 because（因為）。" }
  ]);
})();
