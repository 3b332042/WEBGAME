// booklist.js
// 只負責定義資料，不碰 DOM

// 势力功法清單
// faction: 對應 state.js 的 faction，例如 "nqingyun"
// id: 這本功法 / 秘卷的 ID（之後要存進度可以用）
// label: 左側列表顯示用
// 其他欄位對應中間卡片 & 右側說明
window.BookList = [
    {
        id: "nq_basic_heart",
        faction: "qingyun",
        label: "《清雲心法·入門》",

        cardName: "青雲弟子",
        cardTag: "入門心法",
        progress: "0 / 12 章",
        rarity: "藍品",
        button: "開始研讀",

        rightTitle: "功法說明",
        rightContent: "以溫和真氣打通十二正經，適合初入青雲門的弟子修習。",
        rightTip: "修滿後可解鎖中級心法，並小幅提升悟性。"
    },
    {
        id: "nq_sword_intro",
        faction: "qingyun",
        label: "《清雲劍訣·基礎》",

        cardName: "外門劍修",
        cardTag: "劍道入門",
        progress: "3 / 20 招",
        rarity: "藍品",
        button: "開始演練",

        rightTitle: "功法說明",
        rightContent: "包含三式基礎劍招，用於打牢劍道根基。",
        rightTip: "劍訣練熟可略微提升攻擊與會心。"
    },
    {
        id: "nq_sword_advance",
        faction: "qingyun",
        label: "《追風十三劍》",

        cardName: "追風劍修",
        cardTag: "進階劍訣",
        progress: "0 / 13 式",
        rarity: "紫品",
        button: "開始研讀",

        rightTitle: "功法說明",
        rightContent: "速度見長的進階劍法，需先熟悉基礎劍訣。",
        rightTip: "完成後可大幅提升攻擊與出手速度。"
    },

    // ==== 其他勢力範例 ====
    {
        id: "dm_shield_heart",
        faction: "n_demonsect",
        label: "《鎧魔護身訣》",

        cardName: "魔宗外門",
        cardTag: "防禦心法",
        progress: "2 / 9 篇",
        rarity: "紫品",
        button: "開始修煉",

        rightTitle: "功法說明",
        rightContent: "以魔氣淬鍊肉身，提升防禦與生命上限。",
        rightTip: "副作用是心境容易偏向煩躁。"
    }
    // ... 之後你可以自己繼續加其他勢力的書
];
