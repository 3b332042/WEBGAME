// =============================
//   items.js （乾淨資料庫版）
//   只負責：物品效果 + 背包 + grantItem
//   商店扣錢完全不在這裡
// =============================



// 物品稀有度外觀
const RARITY_ORDER = {
    white: 1,
    green: 2,
    blue: 3,
    purple: 4,
    orange: 5
};

function getRarityClass(rarity) {
    switch (rarity) {
        case "green": return "rarity-green";
        case "blue": return "rarity-blue";
        case "purple": return "rarity-purple";
        case "orange": return "rarity-orange";
        default: return "rarity-white";
    }
}
window.getRarityClass = getRarityClass;

// 日誌
function maybeLog(t, type = "event") {
    if (typeof window.addLog === "function") addLog(t, type);
}

// 提示框
function toast(t, level = "info") {
    if (typeof window.showShopToast === "function") showShopToast(t, level);
}

// =============================
//   物品資料庫
// =============================

const ItemDB = {
    // === 真氣丹（固定量，適合前期） ===
    qi_pill_fixed_tiny: {
        id: "qi_pill_fixed_tiny",
        name: "凝氣丹",
        type: "pill",
        rarity: "white",
        desc: "回復 50 點真氣。",
        lore: "最基礎的補氣丹藥，適合練氣初期使用。",
        autoConsume: true,
        autoUseOnGain: false,
        shop: {
            isShopItem: true,
            price: 15,
            maxBuy: 30,
            sort: 5,
            category: "真氣恢復"
        },
        canUse(state) {
            return { ok: true };
        },
        use(state) {
            const gain = 50;
            state.qi += gain;
            maybeLog(`你服用凝氣丹，真氣恢復了 ${gain} 點。`, "event");
            toast(`真氣恢復了 ${gain} 點。`, "success");
        }
    },

    qi_pill_fixed_small: {
        id: "qi_pill_fixed_small",
        name: "補氣丹",
        type: "pill",
        rarity: "white",
        desc: "回復 150 點真氣。",
        lore: "坊市常見的補氣丹藥，價格實惠。",
        autoConsume: true,
        autoUseOnGain: false,
        shop: {
            isShopItem: true,
            price: 25,
            maxBuy: 30,
            sort: 6,
            category: "真氣恢復"
        },
        canUse(state) {
            return { ok: true };
        },
        use(state) {
            const gain = 150;
            state.qi += gain;
            maybeLog(`你服用補氣丹，真氣恢復了 ${gain} 點。`, "event");
            toast(`真氣恢復了 ${gain} 點。`, "success");
        }
    },

    qi_pill_fixed_mid: {
        id: "qi_pill_fixed_mid",
        name: "聚氣丹",
        type: "pill",
        rarity: "green",
        desc: "回復 300 點真氣。",
        lore: "以靈草煉製，能快速補充真氣。",
        autoConsume: true,
        autoUseOnGain: false,
        shop: {
            isShopItem: true,
            price: 35,
            maxBuy: 30,
            sort: 7,
            category: "真氣恢復"
        },
        canUse(state) {
            return { ok: true };
        },
        use(state) {
            const gain = 300;
            state.qi += gain;
            maybeLog(`你服用聚氣丹，真氣恢復了 ${gain} 點。`, "event");
            toast(`真氣恢復了 ${gain} 點。`, "success");
        }
    },

    qi_pill_fixed_large: {
        id: "qi_pill_fixed_large",
        name: "培元丹",
        type: "pill",
        rarity: "green",
        desc: "回復 500 點真氣。",
        lore: "藥力充沛，能大幅補充真氣。",
        autoConsume: true,
        autoUseOnGain: false,
        shop: {
            isShopItem: true,
            price: 50,
            maxBuy: 30,
            sort: 8,
            category: "真氣恢復"
        },
        canUse(state) {
            return { ok: true };
        },
        use(state) {
            const gain = 500;
            state.qi += gain;
            maybeLog(`你服用培元丹，真氣恢復了 ${gain} 點。`, "event");
            toast(`真氣恢復了 ${gain} 點。`, "success");
        }
    },

    // === 真氣丹（百分比，適合後期） ===
    qi_pill_small: {
        id: "qi_pill_small",
        name: "回氣丹（小）",
        type: "pill",
        rarity: "white",
        desc: "回復當前真氣上限 30%。",
        lore: "以凡階草藥煉製，最基礎的補氣丹藥。",
        autoConsume: true,
        autoUseOnGain: false,
        shop: {
            isShopItem: true,
            price: 120,
            maxBuy: 10,
            sort: 10,
            category: "真氣恢復"
        },
        canUse(state) {
            return { ok: true };
        },
        use(state) {
            if (typeof getQiCapForLevel !== "function") return;
            const cap = getQiCapForLevel(state.realmLevel);
            const gain = Math.floor(cap * 0.3);
            state.qi += gain;
            maybeLog(`你服用回氣丹（小），真氣恢復了 ${gain} 點。`, "event");
            toast(`真氣恢復了 ${gain} 點。`, "success");
        }
    },

    qi_pill_mid: {
        id: "qi_pill_mid",
        name: "回氣丹（中）",
        type: "pill",
        rarity: "green",
        desc: "回復當前真氣上限 50%。",
        lore: "坊市常見的補氣丹，修士外出常備之物。",
        autoConsume: true,
        autoUseOnGain: false,
        shop: {
            isShopItem: true,
            price: 150,
            maxBuy: 5,
            sort: 11,
            category: "真氣恢復"
        },
        canUse(state) {
            return { ok: true };
        },
        use(state) {
            if (typeof getQiCapForLevel !== "function") return;
            const cap = getQiCapForLevel(state.realmLevel);
            const gain = Math.floor(cap * 0.5);
            state.qi += gain;
            maybeLog(`你服用回氣丹（中），真氣迅速回升 ${gain} 點。`, "event");
            toast(`真氣回升 ${gain} 點。`, "success");
        }
    },

    qi_pill_large: {
        id: "qi_pill_large",
        name: "回氣丹（大）",
        type: "pill",
        rarity: "blue",
        desc: "回復當前真氣上限 80%。",
        lore: "由正宗藥坊煉製，最穩定可靠的回氣丹藥。",
        autoConsume: true,
        autoUseOnGain: false,
        shop: {
            isShopItem: true,
            price: 250,
            maxBuy: 5,
            sort: 12,
            category: "真氣恢復"
        },
        canUse(state) {
            return { ok: true };
        },
        use(state) {
            if (typeof getQiCapForLevel !== "function") return;
            const cap = getQiCapForLevel(state.realmLevel);
            const gain = Math.floor(cap * 0.8);
            state.qi += gain;
            maybeLog(`你服用回氣丹（大），真氣大幅恢復了 ${gain} 點。`, "event");
            toast(`真氣恢復了 ${gain} 點。`, "success");
        }
    },
    // === 大道陣盤 (Dao Array Plates 1-9) ===
    // 順序：九品(入門) -> 一品(至高)
    // 修正：用戶要求 "九宮" 為入門(對應1品)，"大道" 為最高(對應9品)

    dao_array_1: {
        id: "dao_array_1",
        name: "九宮陣盤",
        type: "formation",
        rarity: "white",
        desc: "裝備後生效：暴擊率 +1%，暴擊傷害 +5%。",
        lore: "九宮飛星，陣法入門。基礎的靈氣導引陣法。",
        autoConsume: false,
        autoUseOnGain: false,
        equip: true,
        slot: "formation",
        stats: { critRate: 0.01, critDmg: 0.05 },
        shop: { isShopItem: false, price: 100, maxBuy: 1, sort: 50, category: "陣法道具" },
        canUse() { return { ok: true }; }
    },
    dao_array_2: {
        id: "dao_array_2",
        name: "八卦陣盤",
        type: "formation",
        rarity: "white",
        desc: "裝備後生效：暴擊率 +2%，暴擊傷害 +10%。",
        lore: "乾坤八卦，初窺門徑。能引動微弱的天地之力。",
        autoConsume: false,
        autoUseOnGain: false,
        equip: true,
        slot: "formation",
        stats: { critRate: 0.02, critDmg: 0.10 },
        shop: { isShopItem: false, price: 200, maxBuy: 1, sort: 51, category: "陣法道具" },
        canUse() { return { ok: true }; }
    },
    dao_array_3: {
        id: "dao_array_3",
        name: "七星陣盤",
        type: "formation",
        rarity: "green",
        desc: "裝備後生效：暴擊率 +3%，暴擊傷害 +15%。",
        lore: "七星拱月，微光引路。殺伐之氣初現。",
        autoConsume: false,
        autoUseOnGain: false,
        equip: true,
        slot: "formation",
        stats: { critRate: 0.03, critDmg: 0.15 },
        shop: { isShopItem: false, price: 300, maxBuy: 1, sort: 52, category: "陣法道具" },
        canUse() { return { ok: true }; }
    },
    dao_array_4: {
        id: "dao_array_4",
        name: "六道陣盤",
        type: "formation",
        rarity: "green",
        desc: "裝備後生效：暴擊率 +5%，暴擊傷害 +25%。",
        lore: "六道輪迴，生生不息。困敵於無形之中。",
        autoConsume: false,
        autoUseOnGain: false,
        equip: true,
        slot: "formation",
        stats: { critRate: 0.05, critDmg: 0.25 },
        shop: { isShopItem: false, price: 500, maxBuy: 1, sort: 53, category: "陣法道具" },
        canUse() { return { ok: true }; }
    },
    dao_array_5: {
        id: "dao_array_5",
        name: "五行陣盤",
        type: "formation",
        rarity: "blue",
        desc: "裝備後生效：暴擊率 +6%，暴擊傷害 +30%。",
        lore: "五行生剋，循環往復。靈氣暴動，威力倍增。",
        autoConsume: false,
        autoUseOnGain: false,
        equip: true,
        slot: "formation",
        stats: { critRate: 0.06, critDmg: 0.30 },
        shop: { isShopItem: false, price: 800, maxBuy: 1, sort: 54, category: "陣法道具" },
        canUse() { return { ok: true }; }
    },
    dao_array_6: {
        id: "dao_array_6",
        name: "四象陣盤",
        type: "formation",
        rarity: "blue",
        desc: "裝備後生效：暴擊率 +8%，暴擊傷害 +40%。",
        lore: "四象鎮守，攻勢凌厲。已有宗師氣象。",
        autoConsume: false,
        autoUseOnGain: false,
        equip: true,
        slot: "formation",
        stats: { critRate: 0.08, critDmg: 0.40 },
        shop: { isShopItem: false, price: 1200, maxBuy: 1, sort: 55, category: "陣法道具" },
        canUse() { return { ok: true }; }
    },
    dao_array_7: {
        id: "dao_array_7",
        name: "三才陣盤",
        type: "formation",
        rarity: "purple",
        desc: "裝備後生效：暴擊率 +10%，暴擊傷害 +50%。",
        lore: "天地人，三才合一。陣法之威已臻化境。",
        autoConsume: false,
        autoUseOnGain: false,
        equip: true,
        slot: "formation",
        stats: { critRate: 0.10, critDmg: 0.50 },
        shop: { isShopItem: false, price: 1800, maxBuy: 1, sort: 56, category: "陣法道具" },
        canUse() { return { ok: true }; }
    },
    dao_array_8: {
        id: "dao_array_8",
        name: "兩儀陣盤",
        type: "formation",
        rarity: "purple",
        desc: "裝備後生效：暴擊率 +12%，暴擊傷害 +60%。",
        lore: "陰陽始判，清濁二氣。此陣已近乎天道。",
        autoConsume: false,
        autoUseOnGain: false,
        equip: true,
        slot: "formation",
        stats: { critRate: 0.12, critDmg: 0.60 },
        shop: { isShopItem: false, price: 3000, maxBuy: 1, sort: 57, category: "陣法道具" },
        canUse() { return { ok: true }; }
    },
    dao_array_9: {
        id: "dao_array_9",
        name: "大道陣盤",
        type: "formation",
        rarity: "orange",
        desc: "裝備後生效：暴擊率 +20%，暴擊傷害 +100%。",
        lore: "大道至簡，衍化萬物。傳說中的無上陣圖。",
        autoConsume: false,
        autoUseOnGain: false,
        equip: true,
        slot: "formation",
        stats: { critRate: 0.20, critDmg: 1.00 },
        shop: { isShopItem: false, price: 5000, maxBuy: 1, sort: 58, category: "陣法道具" },
        canUse() { return { ok: true }; }
    },

    // ===== 煉器裝備 (Craftable Equipment) =====
    // === 法器 (Weapons) ===
    iron_sword: {
        id: "iron_sword",
        name: "粗鐵劍",
        type: "weapon",
        rarity: "white",
        slot: "weapon",
        equip: true,
        stats: { attack: 5 },
        desc: "裝備後生效：攻擊 +5",
        lore: "最基礎的鐵劍，粗糙但堪用。",
        shop: { isShopItem: false },
        canUse() { return { ok: true }; }
    },
    steel_sword: {
        id: "steel_sword",
        name: "精鋼劍",
        type: "weapon",
        rarity: "white",
        slot: "weapon",
        equip: true,
        stats: { attack: 10 },
        desc: "裝備後生效：攻擊 +10",
        lore: "經過反覆鍛打的鋼劍，鋒利耐用。",
        shop: { isShopItem: false },
        canUse() { return { ok: true }; }
    },
    bronze_sword: {
        id: "bronze_sword",
        name: "青銅劍",
        type: "weapon",
        rarity: "green",
        slot: "weapon",
        equip: true,
        stats: { attack: 15, critRate: 0.01 },
        desc: "裝備後生效：攻擊 +15，暴擊率 +1%",
        lore: "青銅鑄就，劍身泛著幽光。",
        shop: { isShopItem: false },
        canUse() { return { ok: true }; }
    },
    cold_iron_sword: {
        id: "cold_iron_sword",
        name: "寒鐵劍",
        type: "weapon",
        rarity: "green",
        slot: "weapon",
        equip: true,
        stats: { attack: 25, critRate: 0.02 },
        desc: "裝備後生效：攻擊 +25，暴擊率 +2%",
        lore: "以寒鐵煉製，劍身冰寒刺骨。",
        shop: { isShopItem: false },
        canUse() { return { ok: true }; }
    },
    mystic_sword: {
        id: "mystic_sword",
        name: "玄鐵劍",
        type: "weapon",
        rarity: "blue",
        slot: "weapon",
        equip: true,
        stats: { attack: 40, critRate: 0.03, speed: 2 },
        desc: "裝備後生效：攻擊 +40，暴擊率 +3%，速度 +2",
        lore: "百煉玄鐵，削鐵如泥。",
        shop: { isShopItem: false },
        canUse() { return { ok: true }; }
    },
    spirit_sword: {
        id: "spirit_sword",
        name: "靈鋼劍",
        type: "weapon",
        rarity: "blue",
        slot: "weapon",
        equip: true,
        stats: { attack: 60, critRate: 0.05, speed: 3 },
        desc: "裝備後生效：攻擊 +60，暴擊率 +5%，速度 +3",
        lore: "靈氣灌注的鋼劍，劍鋒吞吐寒光。",
        shop: { isShopItem: false },
        canUse() { return { ok: true }; }
    },
    flame_sword: {
        id: "flame_sword",
        name: "赤炎劍",
        type: "weapon",
        rarity: "purple",
        slot: "weapon",
        equip: true,
        stats: { attack: 90, critRate: 0.08, speed: 5 },
        desc: "裝備後生效：攻擊 +90，暴擊率 +8%，速度 +5",
        lore: "劍身赤紅如火，揮舞時火焰纏繞。",
        shop: { isShopItem: false },
        canUse() { return { ok: true }; }
    },
    void_sword: {
        id: "void_sword",
        name: "虛空劍",
        type: "weapon",
        rarity: "purple",
        slot: "weapon",
        equip: true,
        stats: { attack: 130, critRate: 0.12, speed: 8 },
        desc: "裝備後生效：攻擊 +130，暴擊率 +12%，速度 +8",
        lore: "虛空之力凝聚而成，劍身若隱若現。",
        shop: { isShopItem: false },
        canUse() { return { ok: true }; }
    },
    heaven_sword: {
        id: "heaven_sword",
        name: "天罡劍",
        type: "weapon",
        rarity: "orange",
        slot: "weapon",
        equip: true,
        stats: { attack: 200, critRate: 0.20, speed: 10 },
        desc: "裝備後生效：攻擊 +200，暴擊率 +20%，速度 +10",
        lore: "天罡星力鑄成的神劍，威震八方。",
        shop: { isShopItem: false },
        canUse() { return { ok: true }; }
    },

    // === 頭部 (Head Armor) ===
    cloth_hat: {
        id: "cloth_hat",
        name: "布帽",
        type: "head",
        rarity: "white",
        slot: "head",
        equip: true,
        stats: { defense: 2, hp: 10 },
        desc: "裝備後生效：防禦 +2，生命 +10",
        lore: "普通的布帽，聊勝於無。",
        shop: { isShopItem: false },
        canUse() { return { ok: true }; }
    },
    iron_helm: {
        id: "iron_helm",
        name: "鐵盔",
        type: "head",
        rarity: "white",
        slot: "head",
        equip: true,
        stats: { defense: 5, hp: 20 },
        desc: "裝備後生效：防禦 +5，生命 +20",
        lore: "粗糙的鐵盔，能擋住一些攻擊。",
        shop: { isShopItem: false },
        canUse() { return { ok: true }; }
    },
    bronze_helm: {
        id: "bronze_helm",
        name: "青銅盔",
        type: "head",
        rarity: "green",
        slot: "head",
        equip: true,
        stats: { defense: 8, hp: 35 },
        desc: "裝備後生效：防禦 +8，生命 +35",
        lore: "青銅打造的頭盔，堅固耐用。",
        shop: { isShopItem: false },
        canUse() { return { ok: true }; }
    },
    steel_helm: {
        id: "steel_helm",
        name: "精鋼盔",
        type: "head",
        rarity: "green",
        slot: "head",
        equip: true,
        stats: { defense: 12, hp: 50 },
        desc: "裝備後生效：防禦 +12，生命 +50",
        lore: "精鋼鍛造，防護力大幅提升。",
        shop: { isShopItem: false },
        canUse() { return { ok: true }; }
    },
    mystic_helm: {
        id: "mystic_helm",
        name: "玄鐵盔",
        type: "head",
        rarity: "blue",
        slot: "head",
        equip: true,
        stats: { defense: 18, hp: 80 },
        desc: "裝備後生效：防禦 +18，生命 +80",
        lore: "玄鐵頭盔，堅不可摧。",
        shop: { isShopItem: false },
        canUse() { return { ok: true }; }
    },
    spirit_helm: {
        id: "spirit_helm",
        name: "靈鋼盔",
        type: "head",
        rarity: "blue",
        slot: "head",
        equip: true,
        stats: { defense: 25, hp: 120 },
        desc: "裝備後生效：防禦 +25，生命 +120",
        lore: "靈氣加持的頭盔，光華流轉。",
        shop: { isShopItem: false },
        canUse() { return { ok: true }; }
    },
    dragon_helm: {
        id: "dragon_helm",
        name: "龍鱗盔",
        type: "head",
        rarity: "purple",
        slot: "head",
        equip: true,
        stats: { defense: 35, hp: 180 },
        desc: "裝備後生效：防禦 +35，生命 +180",
        lore: "以龍鱗鑄成，龍威凜然。",
        shop: { isShopItem: false },
        canUse() { return { ok: true }; }
    },
    phoenix_helm: {
        id: "phoenix_helm",
        name: "鳳羽冠",
        type: "head",
        rarity: "purple",
        slot: "head",
        equip: true,
        stats: { defense: 50, hp: 250 },
        desc: "裝備後生效：防禦 +50，生命 +250",
        lore: "鳳凰羽毛編織而成，華貴非凡。",
        shop: { isShopItem: false },
        canUse() { return { ok: true }; }
    },
    heaven_helm: {
        id: "heaven_helm",
        name: "天罡盔",
        type: "head",
        rarity: "orange",
        slot: "head",
        equip: true,
        stats: { defense: 80, hp: 400 },
        desc: "裝備後生效：防禦 +80，生命 +400",
        lore: "天罡星力凝聚的神盔，萬法不侵。",
        shop: { isShopItem: false },
        canUse() { return { ok: true }; }
    },

    // === 衣服 (Body Armor) ===
    cloth_robe: {
        id: "cloth_robe",
        name: "布袍",
        type: "body",
        rarity: "white",
        slot: "body",
        equip: true,
        stats: { defense: 3, hp: 15 },
        desc: "裝備後生效：防禦 +3，生命 +15",
        lore: "簡單的布袍，略有防護。",
        shop: { isShopItem: false },
        canUse() { return { ok: true }; }
    },
    leather_armor: {
        id: "leather_armor",
        name: "皮甲",
        type: "body",
        rarity: "white",
        slot: "body",
        equip: true,
        stats: { defense: 7, hp: 30 },
        desc: "裝備後生效：防禦 +7，生命 +30",
        lore: "獸皮製成的護甲，輕便靈活。",
        shop: { isShopItem: false },
        canUse() { return { ok: true }; }
    },
    bronze_armor: {
        id: "bronze_armor",
        name: "青銅甲",
        type: "body",
        rarity: "green",
        slot: "body",
        equip: true,
        stats: { defense: 12, hp: 50 },
        desc: "裝備後生效：防禦 +12，生命 +50",
        lore: "青銅鎧甲，防護力不俗。",
        shop: { isShopItem: false },
        canUse() { return { ok: true }; }
    },
    steel_armor: {
        id: "steel_armor",
        name: "精鋼甲",
        type: "body",
        rarity: "green",
        slot: "body",
        equip: true,
        stats: { defense: 18, hp: 75 },
        desc: "裝備後生效：防禦 +18，生命 +75",
        lore: "精鋼打造的重甲，堅固可靠。",
        shop: { isShopItem: false },
        canUse() { return { ok: true }; }
    },
    mystic_armor: {
        id: "mystic_armor",
        name: "玄鐵甲",
        type: "body",
        rarity: "blue",
        slot: "body",
        equip: true,
        stats: { defense: 27, hp: 120 },
        desc: "裝備後生效：防禦 +27，生命 +120",
        lore: "玄鐵鎧甲，刀槍不入。",
        shop: { isShopItem: false },
        canUse() { return { ok: true }; }
    },
    spirit_armor: {
        id: "spirit_armor",
        name: "靈鋼甲",
        type: "body",
        rarity: "blue",
        slot: "body",
        equip: true,
        stats: { defense: 38, hp: 180 },
        desc: "裝備後生效：防禦 +38，生命 +180",
        lore: "靈氣環繞的鎧甲，堅不可摧。",
        shop: { isShopItem: false },
        canUse() { return { ok: true }; }
    },
    dragon_armor: {
        id: "dragon_armor",
        name: "龍鱗甲",
        type: "body",
        rarity: "purple",
        slot: "body",
        equip: true,
        stats: { defense: 53, hp: 270 },
        desc: "裝備後生效：防禦 +53，生命 +270",
        lore: "真龍鱗片編織而成，龍威護體。",
        shop: { isShopItem: false },
        canUse() { return { ok: true }; }
    },
    phoenix_armor: {
        id: "phoenix_armor",
        name: "鳳羽衣",
        type: "body",
        rarity: "purple",
        slot: "body",
        equip: true,
        stats: { defense: 75, hp: 375 },
        desc: "裝備後生效：防禦 +75，生命 +375",
        lore: "鳳凰羽毛編織的神衣，輕盈如無物。",
        shop: { isShopItem: false },
        canUse() { return { ok: true }; }
    },
    heaven_armor: {
        id: "heaven_armor",
        name: "天罡甲",
        type: "body",
        rarity: "orange",
        slot: "body",
        equip: true,
        stats: { defense: 120, hp: 600 },
        desc: "裝備後生效：防禦 +120，生命 +600",
        lore: "天罡星力凝聚的神甲，萬劫不壞。",
        shop: { isShopItem: false },
        canUse() { return { ok: true }; }
    },

    // === 褲子 (Leg Armor) ===
    cloth_pants: {
        id: "cloth_pants",
        name: "布褲",
        type: "legs",
        rarity: "white",
        slot: "legs",
        equip: true,
        stats: { defense: 2, hp: 10 },
        desc: "裝備後生效：防禦 +2，生命 +10",
        lore: "普通的布褲，略有防護。",
        shop: { isShopItem: false },
        canUse() { return { ok: true }; }
    },
    leather_pants: {
        id: "leather_pants",
        name: "皮褲",
        type: "legs",
        rarity: "white",
        slot: "legs",
        equip: true,
        stats: { defense: 5, hp: 20 },
        desc: "裝備後生效：防禦 +5，生命 +20",
        lore: "獸皮製成的護腿，靈活耐用。",
        shop: { isShopItem: false },
        canUse() { return { ok: true }; }
    },
    bronze_pants: {
        id: "bronze_pants",
        name: "青銅護腿",
        type: "legs",
        rarity: "green",
        slot: "legs",
        equip: true,
        stats: { defense: 8, hp: 35 },
        desc: "裝備後生效：防禦 +8，生命 +35",
        lore: "青銅護腿，保護下盤。",
        shop: { isShopItem: false },
        canUse() { return { ok: true }; }
    },
    steel_pants: {
        id: "steel_pants",
        name: "精鋼護腿",
        type: "legs",
        rarity: "green",
        slot: "legs",
        equip: true,
        stats: { defense: 12, hp: 50 },
        desc: "裝備後生效：防禦 +12，生命 +50",
        lore: "精鋼打造的護腿，堅固可靠。",
        shop: { isShopItem: false },
        canUse() { return { ok: true }; }
    },
    mystic_pants: {
        id: "mystic_pants",
        name: "玄鐵護腿",
        type: "legs",
        rarity: "blue",
        slot: "legs",
        equip: true,
        stats: { defense: 18, hp: 80 },
        desc: "裝備後生效：防禦 +18，生命 +80",
        lore: "玄鐵護腿，防護周全。",
        shop: { isShopItem: false },
        canUse() { return { ok: true }; }
    },
    spirit_pants: {
        id: "spirit_pants",
        name: "靈鋼護腿",
        type: "legs",
        rarity: "blue",
        slot: "legs",
        equip: true,
        stats: { defense: 25, hp: 120 },
        desc: "裝備後生效：防禦 +25，生命 +120",
        lore: "靈氣加持的護腿，輕盈靈動。",
        shop: { isShopItem: false },
        canUse() { return { ok: true }; }
    },
    dragon_pants: {
        id: "dragon_pants",
        name: "龍鱗護腿",
        type: "legs",
        rarity: "purple",
        slot: "legs",
        equip: true,
        stats: { defense: 35, hp: 180 },
        desc: "裝備後生效：防禦 +35，生命 +180",
        lore: "龍鱗編織的護腿，龍威護體。",
        shop: { isShopItem: false },
        canUse() { return { ok: true }; }
    },
    phoenix_pants: {
        id: "phoenix_pants",
        name: "鳳羽裙",
        type: "legs",
        rarity: "purple",
        slot: "legs",
        equip: true,
        stats: { defense: 50, hp: 250 },
        desc: "裝備後生效：防禦 +50，生命 +250",
        lore: "鳳凰羽毛編織的護腿，華貴非凡。",
        shop: { isShopItem: false },
        canUse() { return { ok: true }; }
    },
    heaven_pants: {
        id: "heaven_pants",
        name: "天罡護腿",
        type: "legs",
        rarity: "orange",
        slot: "legs",
        equip: true,
        stats: { defense: 80, hp: 400 },
        desc: "裝備後生效：防禦 +80，生命 +400",
        lore: "天罡星力凝聚的神腿，步履生風。",
        shop: { isShopItem: false },
        canUse() { return { ok: true }; }
    },

    // === 鞋子 (Feet Armor) ===
    cloth_shoes: {
        id: "cloth_shoes",
        name: "布鞋",
        type: "feet",
        rarity: "white",
        slot: "feet",
        equip: true,
        stats: { defense: 1, speed: 1 },
        desc: "裝備後生效：防禦 +1，速度 +1",
        lore: "簡單的布鞋，輕便舒適。",
        shop: { isShopItem: false },
        canUse() { return { ok: true }; }
    },
    leather_boots: {
        id: "leather_boots",
        name: "皮靴",
        type: "feet",
        rarity: "white",
        slot: "feet",
        equip: true,
        stats: { defense: 3, speed: 2 },
        desc: "裝備後生效：防禦 +3，速度 +2",
        lore: "獸皮製成的靴子，耐磨耐用。",
        shop: { isShopItem: false },
        canUse() { return { ok: true }; }
    },
    bronze_boots: {
        id: "bronze_boots",
        name: "青銅靴",
        type: "feet",
        rarity: "green",
        slot: "feet",
        equip: true,
        stats: { defense: 5, speed: 3 },
        desc: "裝備後生效：防禦 +5，速度 +3",
        lore: "青銅打造的戰靴，穩重有力。",
        shop: { isShopItem: false },
        canUse() { return { ok: true }; }
    },
    steel_boots: {
        id: "steel_boots",
        name: "精鋼靴",
        type: "feet",
        rarity: "green",
        slot: "feet",
        equip: true,
        stats: { defense: 8, speed: 4 },
        desc: "裝備後生效：防禦 +8，速度 +4",
        lore: "精鋼戰靴，行動迅捷。",
        shop: { isShopItem: false },
        canUse() { return { ok: true }; }
    },
    mystic_boots: {
        id: "mystic_boots",
        name: "玄鐵靴",
        type: "feet",
        rarity: "blue",
        slot: "feet",
        equip: true,
        stats: { defense: 12, speed: 6 },
        desc: "裝備後生效：防禦 +12，速度 +6",
        lore: "玄鐵戰靴，步履如飛。",
        shop: { isShopItem: false },
        canUse() { return { ok: true }; }
    },
    spirit_boots: {
        id: "spirit_boots",
        name: "靈鋼靴",
        type: "feet",
        rarity: "blue",
        slot: "feet",
        equip: true,
        stats: { defense: 17, speed: 8 },
        desc: "裝備後生效：防禦 +17，速度 +8",
        lore: "靈氣加持的戰靴，身輕如燕。",
        shop: { isShopItem: false },
        canUse() { return { ok: true }; }
    },
    dragon_boots: {
        id: "dragon_boots",
        name: "龍鱗靴",
        type: "feet",
        rarity: "purple",
        slot: "feet",
        equip: true,
        stats: { defense: 23, speed: 11 },
        desc: "裝備後生效：防禦 +23，速度 +11",
        lore: "龍鱗編織的戰靴，踏雲而行。",
        shop: { isShopItem: false },
        canUse() { return { ok: true }; }
    },
    phoenix_boots: {
        id: "phoenix_boots",
        name: "鳳羽靴",
        type: "feet",
        rarity: "purple",
        slot: "feet",
        equip: true,
        stats: { defense: 33, speed: 15 },
        desc: "裝備後生效：防禦 +33，速度 +15",
        lore: "鳳凰羽毛編織的神靴，如履平地。",
        shop: { isShopItem: false },
        canUse() { return { ok: true }; }
    },
    heaven_boots: {
        id: "heaven_boots",
        name: "天罡靴",
        type: "feet",
        rarity: "orange",
        slot: "feet",
        equip: true,
        stats: { defense: 53, speed: 20 },
        desc: "裝備後生效：防禦 +53，速度 +20",
        lore: "天罡星力凝聚的神靴，縮地成寸。",
        shop: { isShopItem: false },
        canUse() { return { ok: true }; }
    },

    mind_pill: {
        id: "mind_pill",
        name: "靜心丹",
        type: "pill",
        rarity: "green",
        desc: "心境 +1，突破時更穩定。",
        lore: "以安神草入藥，能平復躁念，使心境如鏡。",
        autoConsume: true,
        autoUseOnGain: false,
        shop: {
            isShopItem: true,
            price: 40,
            maxBuy: 30,
            sort: 20,
            category: "屬性提升"
        },
        canUse() {
            return { ok: true };
        },
        use(state) {
            state.mindset = (state.mindset || 0) + 1;
            maybeLog("你服用靜心丹，心境提升（+1）。", "event");
            toast("心境 +1。", "success");
        }
    },

    mind_pill_big: {
        id: "mind_pill_big",
        name: "定心珠",
        type: "pill",
        rarity: "blue",
        desc: "心境 +2，面對瓶頸更加沉穩。",
        lore: "以溫潤靈玉拋光七日煉成，能壓制心魔。",
        autoConsume: true,
        autoUseOnGain: false,
        shop: {
            isShopItem: true,
            price: 100,
            maxBuy: 15,
            sort: 21,
            category: "屬性提升"
        },
        canUse() {
            return { ok: true };
        },
        use(state) {
            state.mindset = (state.mindset || 0) + 2;
            maybeLog("你溫養定心珠，心境大幅提升（+2）。", "event");
            toast("心境 +2。", "success");
        }
    },

    comp_tea: {
        id: "comp_tea",
        name: "悟道靈茶",
        type: "pill",
        rarity: "green",
        desc: "悟性 +1，修煉速度與突破率略有提升。",
        lore: "以高山靈霧孕育之茶葉煮泡，入口清甜心神透亮。",
        autoConsume: true,
        autoUseOnGain: false,
        shop: {
            isShopItem: true,
            price: 50,
            maxBuy: 30,
            sort: 22,
            category: "屬性提升"
        },
        canUse() {
            return { ok: true };
        },
        use(state) {
            state.comprehension = (state.comprehension || 0) + 1;
            maybeLog("你細品悟道靈茶，悟性提升（+1）。", "event");
            toast("悟性 +1。", "success");
        }
    },

    comp_pill_big: {
        id: "comp_pill_big",
        name: "悟道丹",
        type: "pill",
        rarity: "purple",
        desc: "悟性 +2，大幅提升參悟速度。",
        lore: "稀有丹藥，據說能讓人夢中見大道流光。",
        autoConsume: true,
        autoUseOnGain: false,
        shop: {
            isShopItem: true,
            price: 150,
            maxBuy: 10,
            sort: 23,
            category: "屬性提升"
        },
        canUse() {
            return { ok: true };
        },
        use(state) {
            state.comprehension = (state.comprehension || 0) + 2;
            maybeLog("你服用悟道丹，心中大道之理清晰數分（悟性 +2）。", "event");
            toast("悟性 +2。", "success");
        }
    },

    luck_charm: {
        id: "luck_charm",
        name: "轉運符",
        type: "special",
        rarity: "blue",
        desc: "氣運 +1，獲得機緣的機率略微提升。",
        lore: "符師引天象畫成，能短暫調動命格之勢。",
        autoConsume: true,
        autoUseOnGain: false,
        shop: {
            isShopItem: true,
            price: 80,
            maxBuy: 15,
            sort: 24,
            category: "屬性提升"
        },
        canUse() {
            return { ok: true };
        },
        use(state) {
            state.luck = (state.luck || 0) + 1;
            maybeLog("你祭出轉運符，一縷玄妙氣運加身（氣運 +1）。", "event");
            toast("氣運 +1。", "success");
        }
    },

    luck_incense: {
        id: "luck_incense",
        name: "七星吉運香",
        type: "special",
        rarity: "purple",
        desc: "氣運 +2，自此機緣更常臨身。",
        lore: "此香七星相連，能讓命星微動、福運相隨。",
        autoConsume: true,
        autoUseOnGain: false,
        shop: {
            isShopItem: true,
            price: 180,
            maxBuy: 5,
            sort: 25,
            category: "屬性提升"
        },
        canUse() {
            return { ok: true };
        },
        use(state) {
            state.luck = (state.luck || 0) + 2;
            maybeLog("你焚起七星吉運香，氣運大增（+2）。", "great-event");
            toast("氣運 +2。", "success");
        }
    },


    // === 戰鬥強化 ===
    attack_pill_small: {
        id: "attack_pill_small",
        name: "煉體丹",
        type: "combat",
        rarity: "green",
        desc: "攻擊力 +2，強化肉身力量。",
        lore: "以妖獸精血煉製，能增強體魄與力道。",
        autoConsume: true,
        autoUseOnGain: false,
        shop: {
            isShopItem: true,
            price: 70,
            maxBuy: 15,
            sort: 26,
            category: "戰鬥強化"
        },
        canUse() {
            return { ok: true };
        },
        use(state) {
            state.baseAttack = (state.baseAttack || 0) + 2;
            maybeLog("你服用煉體丹，攻擊力提升（+2）。", "event");
            toast("攻擊力 +2。", "success");
        }
    },

    attack_pill_large: {
        id: "attack_pill_large",
        name: "霸體丹",
        type: "combat",
        rarity: "blue",
        desc: "攻擊力 +5，大幅提升戰力。",
        lore: "以靈獸內丹為引，能讓修士力大無窮。",
        autoConsume: true,
        autoUseOnGain: false,
        shop: {
            isShopItem: true,
            price: 150,
            maxBuy: 10,
            sort: 27,
            category: "戰鬥強化"
        },
        canUse() {
            return { ok: true };
        },
        use(state) {
            state.baseAttack = (state.baseAttack || 0) + 5;
            maybeLog("你服用霸體丹，攻擊力大幅提升（+5）。", "event");
            toast("攻擊力 +5。", "success");
        }
    },

    defense_pill_small: {
        id: "defense_pill_small",
        name: "金剛丹",
        type: "combat",
        rarity: "green",
        desc: "防禦力 +2，強化護體真氣。",
        lore: "服後皮膚泛起金光，防禦力大增。",
        autoConsume: true,
        autoUseOnGain: false,
        shop: {
            isShopItem: true,
            price: 70,
            maxBuy: 15,
            sort: 28,
            category: "戰鬥強化"
        },
        canUse() {
            return { ok: true };
        },
        use(state) {
            state.baseDefense = (state.baseDefense || 0) + 2;
            maybeLog("你服用金剛丹，防禦力提升（+2）。", "event");
            toast("防禦力 +2。", "success");
        }
    },

    defense_pill_large: {
        id: "defense_pill_large",
        name: "不壞金身丹",
        type: "combat",
        rarity: "blue",
        desc: "防禦力 +5，護體如鐵壁。",
        lore: "傳說中的防禦丹藥，能讓肉身堅若磐石。",
        autoConsume: true,
        autoUseOnGain: false,
        shop: {
            isShopItem: true,
            price: 150,
            maxBuy: 10,
            sort: 29,
            category: "戰鬥強化"
        },
        canUse() {
            return { ok: true };
        },
        use(state) {
            state.baseDefense = (state.baseDefense || 0) + 5;
            maybeLog("你服用不壞金身丹，防禦力大幅提升（+5）。", "event");
            toast("防禦力 +5。", "success");
        }
    },

    crit_rate_charm: {
        id: "crit_rate_charm",
        name: "破綻符",
        type: "combat",
        rarity: "blue",
        desc: "暴擊率 +2%，更易看破敵人破綻。",
        lore: "以天眼術繪製，能洞察敵人弱點。",
        autoConsume: true,
        autoUseOnGain: false,
        shop: {
            isShopItem: true,
            price: 50,
            maxBuy: 20,
            sort: 30,
            category: "戰鬥強化"
        },
        canUse() {
            return { ok: true };
        },
        use(state) {
            state.baseCritRate = (state.baseCritRate || 0) + 0.02;
            maybeLog("你使用破綻符，暴擊率提升（+2%）。", "event");
            toast("暴擊率 +2%。", "success");
        }
    },

    crit_dmg_pill: {
        id: "crit_dmg_pill",
        name: "爆發丹",
        type: "combat",
        rarity: "purple",
        desc: "暴擊傷害 +5%，致命一擊更加凌厲。",
        lore: "服後真氣運轉更加狂暴，爆發力驚人。",
        autoConsume: true,
        autoUseOnGain: false,
        shop: {
            isShopItem: true,
            price: 200,
            maxBuy: 5,
            sort: 31,
            category: "戰鬥強化"
        },
        canUse() {
            return { ok: true };
        },
        use(state) {
            state.baseCritDmg = (state.baseCritDmg || 0) + 0.05;
            maybeLog("你服用爆發丹，暴擊傷害提升（+5%）。", "event");
            toast("暴擊傷害 +5%。", "success");
        }
    },

    // 錢幣
    spirit_stone_small: {
        id: "spirit_stone_small",
        name: "下品靈石",
        type: "currency",
        rarity: "white",
        desc: "修仙界的通用貨幣，也可用於修煉。",
        lore: "蘊含少量靈氣的礦石。",
        autoConsume: false,
        autoUseOnGain: false,
        shop: { isShopItem: true, price: 10, maxBuy: 9999, category: "煉丹素材" },
        use(state, count) {
            // 使用效果：獲得靈氣
            const gain = 10 * count;
            state.qi += gain;
            maybeLog(`你吸收了 ${count} 顆下品靈石，真氣增加了 ${gain} 點。`, "event");
        }
    },

    // 丹典
    alchemy_manual: {
        id: "alchemy_manual",
        name: "青囊丹經",
        type: "manual",
        rarity: "purple",
        desc: "記錄了基礎煉丹術的典籍。",
        lore: "雖只是殘卷，卻記載了丹道真解。",
        autoConsume: false,
        autoUseOnGain: false,
        canUse(state) {
            if (state.arts && state.arts.alchemy && state.arts.alchemy.level > 0) {
                return { ok: false, reason: "你已習得煉丹術，無需重複研讀。" };
            }
            return { ok: true };
        },
        use(state) {
            if (!state.arts) state.arts = {};
            if (!state.arts.alchemy) state.arts.alchemy = { level: 0, exp: 0 };
            state.arts.alchemy.level = 1;
            maybeLog("你仔細研讀《青囊丹經》，頓悟丹道，開啟【煉丹】功能！", "great-event");
            toast("習得煉丹術！", "success");
            if (window.renderUI) window.renderUI();
        }
    },

    // 器譜
    weapon_manual: {
        id: "weapon_manual",
        name: "歐冶器譜",
        type: "manual",
        rarity: "purple",
        desc: "記錄了基礎煉器術的典籍。",
        lore: "相傳為鑄劍大師歐冶子所留殘卷。",
        autoConsume: false,
        autoUseOnGain: false,
        canUse(state) {
            if (state.arts && state.arts.weapon && state.arts.weapon.level > 0) {
                return { ok: false, reason: "你已習得煉器術，無需重複研讀。" };
            }
            return { ok: true };
        },
        use(state) {
            if (!state.arts) state.arts = {};
            if (!state.arts.weapon) state.arts.weapon = { level: 0, exp: 0 };
            state.arts.weapon.level = 1;
            maybeLog("你仔細研讀《歐冶器譜》，掌握了煉器要義，開啟【煉器】功能！", "great-event");
            toast("習得煉器術！", "success");
            if (window.renderUI) window.renderUI();
        }
    },

    // 陣圖
    formation_manual: {
        id: "formation_manual",
        name: "璇璣陣圖",
        type: "manual",
        rarity: "purple",
        desc: "記錄了基礎陣法之道的典籍。",
        lore: "雖有些許殘缺，卻蘊含天地至理。",
        autoConsume: false,
        autoUseOnGain: false,
        canUse(state) {
            if (state.arts && state.arts.formation && state.arts.formation.level > 0) {
                return { ok: false, reason: "你已習得陣法術，無需重複研讀。" };
            }
            return { ok: true };
        },
        use(state) {
            if (!state.arts) state.arts = {};
            if (!state.arts.formation) state.arts.formation = { level: 0, exp: 0 };
            state.arts.formation.level = 1;
            maybeLog("你仔細研讀《璇璣陣圖》，洞悉陣法變化，開啟【陣法】功能！", "great-event");
            toast("習得陣法術！", "success");
            if (window.renderUI) window.renderUI();
        }
    },

    // 符錄
    talisman_manual: {
        id: "talisman_manual",
        name: "天師符錄",
        type: "manual",
        rarity: "purple",
        desc: "記錄了基礎符籙之道的典籍。",
        lore: "傳聞為上古天師所傳，能驅鬼降妖。",
        autoConsume: false,
        autoUseOnGain: false,
        canUse(state) {
            if (state.arts && state.arts.talisman && state.arts.talisman.level > 0) {
                return { ok: false, reason: "你已習得符籙術，無需重複研讀。" };
            }
            return { ok: true };
        },
        use(state) {
            if (!state.arts) state.arts = {};
            if (!state.arts.talisman) state.arts.talisman = { level: 0, exp: 0 };
            state.arts.talisman.level = 1;
            maybeLog("你仔細研讀《天師符錄》，學會了畫符之道，開啟【符籙】功能！", "great-event");
            toast("習得符籙術！", "success");
            if (window.renderUI) window.renderUI();
        }
    },

    hp_pill_small: {
        id: "hp_pill_small",
        name: "固元丹",
        type: "combat",
        rarity: "green",
        desc: "血量上限 +20，增強生命力。",
        lore: "固本培元，增強生機。",
        autoConsume: true,
        autoUseOnGain: false,
        shop: {
            isShopItem: true,
            price: 80,
            maxBuy: 15,
            sort: 32,
            category: "戰鬥強化"
        },
        canUse() {
            return { ok: true };
        },
        use(state) {
            state.baseHP = (state.baseHP || 0) + 20;
            maybeLog("你服用固元丹，血量上限提升（+20）。", "event");
            toast("血量上限 +20。", "success");
        }
    },

    hp_pill_large: {
        id: "hp_pill_large",
        name: "生生造化丹",
        type: "combat",
        rarity: "purple",
        desc: "血量上限 +50，大幅增強生命力。",
        lore: "以千年靈藥煉製，蘊含無盡生機。",
        autoConsume: true,
        autoUseOnGain: false,
        shop: {
            isShopItem: true,
            price: 250,
            maxBuy: 5,
            sort: 33,
            category: "戰鬥強化"
        },
        canUse() {
            return { ok: true };
        },
        use(state) {
            state.baseHP = (state.baseHP || 0) + 50;
            maybeLog("你服用生生造化丹，血量上限大幅提升（+50）。", "event");
            toast("血量上限 +50。", "success");
        }
    },

    // === 壽命 / 體質 ===
    life_herb: {
        id: "life_herb",
        name: "千年靈芝",
        type: "special",
        rarity: "blue",
        desc: "壽元 +3 年。",
        lore: "千年不腐，吸天地日月精華而成。",
        autoConsume: true,
        autoUseOnGain: false,
        shop: {
            isShopItem: true,
            price: 100,
            maxBuy: 10,
            sort: 30,
            category: "壽命體質"
        },
        canUse() {
            return { ok: true };
        },
        use(state) {
            state.lifespan = (state.lifespan || 0) + 3;
            maybeLog("你服用千年靈芝，壽元延長了 3 年。", "event");
            toast("壽元 +3 年。", "success");
        }
    },

    life_elixir: {
        id: "life_elixir",
        name: "延壽丹",
        type: "special",
        rarity: "purple",
        desc: "壽元 +10 年。",
        lore: "古方延壽丹，珍稀材料煉製，價格不菲。",
        autoConsume: true,
        autoUseOnGain: false,
        shop: {
            isShopItem: true,
            price: 220,
            maxBuy: 3,
            sort: 31,
            category: "壽命體質"
        },
        canUse() {
            return { ok: true };
        },
        use(state) {
            state.lifespan = (state.lifespan || 0) + 10;
            maybeLog("你服用延壽丹，壽元大幅增長 10 年。", "event");
            toast("壽元 +10 年。", "success");
        }
    },

    body_refine_pill: {
        id: "body_refine_pill",
        name: "洗髓丹",
        type: "special",
        rarity: "purple",
        desc: "洗髓易骨，壽元 +5 年，悟性 +1。",
        lore: "服後全身發熱，雜質排出，重塑凡胎。",
        autoConsume: true,
        autoUseOnGain: false,
        shop: {
            isShopItem: true,
            price: 300,
            maxBuy: 3,
            sort: 32,
            category: "壽命體質"
        },
        canUse() {
            return { ok: true };
        },
        use(state) {
            state.lifespan = (state.lifespan || 0) + 5;
            state.comprehension = (state.comprehension || 0) + 1;
            maybeLog("洗髓丹淨化你的軀體，使悟性與壽元皆有所增長。", "great-event");
            toast("壽元 +5 年，悟性 +1。", "success");
        }
    },

    immortal_pill_half: {
        id: "immortal_pill_half",
        name: "半仙化劫丹",
        type: "special",
        rarity: "orange",
        desc: "壽元 +30 年，但似乎牽扯未知因果。",
        lore: "傳說服下此丹者，皆會在未來遭遇一次莫名的天機反噬。",
        autoConsume: true,
        autoUseOnGain: false,
        shop: {
            isShopItem: true,
            price: 2000,
            maxBuy: 1,
            sort: 33,
            category: "壽命體質"
        },
        canUse() {
            return { ok: true };
        },
        use(state) {
            state.lifespan = (state.lifespan || 0) + 30;
            maybeLog("你服用半仙化劫丹，壽元暴增 30 年。", "great-event");
            toast("壽元 +30 年。", "success");
        }
    },

    // === 靈根淬鍊道具：購買時先進背包，使用時才判斷條件 ===
    root_talisman_5to4: {
        id: "root_talisman_5to4",
        name: "洗根符·凡靈",
        type: "root_item",
        rarity: "green",
        desc: "可將五靈根淬洗為四靈根。",
        lore: "只對五靈根凡胎有效，能稍微改善靈根結構。",
        autoConsume: true,
        autoUseOnGain: false,
        shop: {
            isShopItem: true,
            price: 200,
            maxBuy: 1,
            sort: 40,
            category: "靈根改造"
        },
        canUse(state) {
            if (state.rootCount !== 5) {
                const msg = "洗根符·凡靈只對五靈根凡胎有效。";
                maybeLog(msg, "event");
                return { ok: false, reason: msg };
            }
            return { ok: true };
        },
        use(state) {
            state.rootCount = 4;
            maybeLog("你燃起洗根符·凡靈，體內靈根略有調整，成為四靈根。", "great-event");
            toast("靈根提升為四靈根。", "success");
        }
    },

    root_talisman_4to3: {
        id: "root_talisman_4to3",
        name: "洗根符·上靈",
        type: "root_item",
        rarity: "blue",
        desc: "可將四靈根淬洗為三靈根。",
        lore: "符紙隱約有靈紋遊走，可令體內靈根重新分佈。",
        autoConsume: true,
        autoUseOnGain: false,
        shop: {
            isShopItem: true,
            price: 400,
            maxBuy: 1,
            sort: 41,
            category: "靈根改造"
        },
        canUse(state) {
            if (state.rootCount !== 4) {
                const msg = "洗根符·上靈只對四靈根修士有效。";
                maybeLog(msg, "event");
                return { ok: false, reason: msg };
            }
            return { ok: true };
        },
        use(state) {
            state.rootCount = 3;
            maybeLog("洗根符·上靈燃起後，你的靈根收斂為三靈根。", "great-event");
            toast("靈根提升為三靈根。", "success");
        }
    },

    root_elixir_3to2: {
        id: "root_elixir_3to2",
        name: "淬靈丹·雙根",
        type: "root_item",
        rarity: "purple",
        desc: "可將三靈根淬鍊為雙靈根。",
        lore: "丹香濃郁，據說服用時會感到靈根被火焚再重鑄。",
        autoConsume: true,
        autoUseOnGain: false,
        shop: {
            isShopItem: true,
            price: 800,
            maxBuy: 1,
            sort: 42,
            category: "靈根改造"
        },
        canUse(state) {
            if (state.rootCount !== 3) {
                const msg = "淬靈丹·雙根只對三靈根修士有效。";
                maybeLog(msg, "event");
                return { ok: false, reason: msg };
            }
            return { ok: true };
        },
        use(state) {
            state.rootCount = 2;
            maybeLog("你服下淬靈丹·雙根，體內兩道靈根光芒尤為耀眼。", "great-event");
            toast("靈根提升為雙靈根。", "success");
        }
    },

    root_elixir_2to1: {
        id: "root_elixir_2to1",
        name: "天根神液",
        type: "root_item",
        rarity: "orange",
        desc: "可將雙靈根淬鍊為天靈根。（無法再提升）",
        lore: "以萬年靈材熬煉而成，一滴價值連城。",
        autoConsume: true,
        autoUseOnGain: false,
        shop: {
            isShopItem: true,
            price: 1600,
            maxBuy: 1,
            sort: 43,
            category: "靈根改造"
        },
        canUse(state) {
            if (state.rootCount === 1) {
                const msg = "你的體質已是天靈根，神液難再提升半分。";
                maybeLog(msg, "event");
                return { ok: false, reason: msg };
            }
            if (state.rootCount !== 2) {
                const msg = "天根神液只對雙靈根修士有效。";
                maybeLog(msg, "event");
                return { ok: false, reason: msg };
            }
            return { ok: true };
        },
        use(state) {
            state.rootCount = 1;
            maybeLog("你吞下天根神液，體內所有靈根歸一，成就天靈根！", "great-event");
            toast("成就天靈根！", "success");
        }
    },

    // === 突破相關 ===
    break_pill_low: {
        id: "break_pill_low",
        name: "築基丹",
        type: "special",
        rarity: "purple",
        desc: "僅對練氣期有效，可直接提升一小境界。",
        lore: "築基之時必備，若無此丹十人九敗。",
        autoConsume: true,
        autoUseOnGain: false,
        shop: {
            isShopItem: true,
            price: 500,
            maxBuy: 3,
            sort: 50,
            category: "突破輔助"
        },
        canUse(state) {
            if (state.realmLevel >= 15) {
                const msg = "築基丹只對練氣境修士有效。";
                maybeLog(msg, "event");
                return { ok: false, reason: msg };
            }
            return { ok: true };
        },
        use(state) {
            if (typeof getQiCapForLevel !== "function" || typeof realmName !== "function") return;
            state.realmLevel += 1;
            state.qi = 0;
            state.qiCap = getQiCapForLevel(state.realmLevel);
            state.mindset = (state.mindset || 0) + 1;
            state.lifespan = (state.lifespan || 0) + 2;
            maybeLog(`你服用築基丹，突破至「${realmName(state.realmLevel)}」。`, "great-event");
            toast(`突破至「${realmName(state.realmLevel)}」。`, "success");
        }
    },

    break_talisman_small: {
        id: "break_talisman_small",
        name: "破境護符",
        type: "special",
        rarity: "blue",
        desc: "永久提升突破成功率 3%（可疊加，總成功率上限 30% 額外加成）。",
        lore: "以靈獸血為引，刻入鎮壓心魔的符文。",
        autoConsume: true,
        autoUseOnGain: false,
        shop: {
            isShopItem: true,
            price: 150,
            maxBuy: 10,
            sort: 51,
            category: "突破輔助"
        },
        canUse(state) {
            if (typeof state.breakBonus !== "number") {
                state.breakBonus = 0;
            }
            const maxBonus = 0.30;
            if (state.breakBonus >= maxBonus) {
                const msg = "破境護符加成已達上限。";
                maybeLog("你身上的破境護符之力已達極限，更多的符文不再起效。", "event");
                return { ok: false, reason: msg };
            }
            return { ok: true };
        },
        use(state) {
            const add = 0.03;
            const maxBonus = 0.30;
            if (typeof state.breakBonus !== "number") state.breakBonus = 0;

            const oldBonus = state.breakBonus;
            state.breakBonus = Math.min(maxBonus, state.breakBonus + add);

            const before = (oldBonus * 100).toFixed(1);
            const after = (state.breakBonus * 100).toFixed(1);

            maybeLog(
                `你貼上破境護符，隱約間感到心魔遠遁。突破額外加成由 ${before}% 提升至 ${after}%。`,
                "event"
            );
            toast(`突破額外加成由 ${before}% → ${after}%。`, "success");
        }
    },

    break_talisman_big: {
        id: "break_talisman_big",
        name: "上品破境符篆",
        type: "special",
        rarity: "purple",
        desc: "永久提升突破成功率 7%（可疊加，總成功率上限 30% 額外加成）。",
        lore: "由金丹尊者親手繪製的符篆，可高幅度穩固道心。",
        autoConsume: true,
        autoUseOnGain: false,
        shop: {
            isShopItem: true,
            price: 380,
            maxBuy: 5,
            sort: 52,
            category: "突破輔助"
        },
        canUse(state) {
            if (typeof state.breakBonus !== "number") {
                state.breakBonus = 0;
            }
            const maxBonus = 0.30;
            if (state.breakBonus >= maxBonus) {
                const msg = "破境加成已達上限。";
                maybeLog("你身上的符篆之力已達極限，再多的符文也無法提升破境概率。", "event");
                return { ok: false, reason: msg };
            }
            return { ok: true };
        },
        use(state) {
            const add = 0.07;
            const maxBonus = 0.30;
            if (typeof state.breakBonus !== "number") state.breakBonus = 0;

            const oldBonus = state.breakBonus;
            state.breakBonus = Math.min(maxBonus, state.breakBonus + add);

            const before = (oldBonus * 100).toFixed(1);
            const after = (state.breakBonus * 100).toFixed(1);

            maybeLog(
                `你祭起上品破境符篆，一股安定之力籠罩周身。突破額外加成由 ${before}% 提升至 ${after}%。`,
                "great-event"
            );
            toast(`突破額外加成由 ${before}% → ${after}%。`, "success");
        }
    },

    // === 功法卷軸（全部當「卷軸」處理） ===
    tech_yellow: {
        id: "tech_yellow",
        name: "黃階心法卷軸",
        type: "technique_scroll",
        rarity: "green",
        desc: "可學習黃階心法（需要悟性 ≥ 5）。",
        lore: "修士入門常見的黃階心法，以卷軸形式流通。",
        autoConsume: true,
        autoUseOnGain: false,
        shop: {
            isShopItem: true,
            price: 200,
            maxBuy: 1,
            sort: 60,
            category: "功法卷軸"
        },
        canUse(state) {
            const req = 5;
            if ((state.comprehension || 0) < req) {
                const msg = "你的悟性仍不足以參悟黃階心法（需要悟性 ≥ 5）。";
                maybeLog(msg, "event");
                return { ok: false, reason: msg };
            }
            const tier = state.techniqueTier || 0;
            if (tier >= 1) {
                const msg = "你當前修煉的功法已不遜於黃階心法。";
                maybeLog(msg, "event");
                return { ok: false, reason: msg };
            }
            return { ok: true };
        },
        use(state) {
            state.techniqueTier = 1;
            maybeLog("你參悟黃階心法卷軸，成功修成新功法！", "great-event");
            toast("成功修習黃階心法。", "success");
        }
    },

    tech_xuan: {
        id: "tech_xuan",
        name: "玄階心法卷軸",
        type: "technique_scroll",
        rarity: "blue",
        desc: "可學習玄階心法（需要悟性 ≥ 10）。",
        lore: "氣旋如水，周天運轉自成迴圈。",
        autoConsume: true,
        autoUseOnGain: false,
        shop: {
            isShopItem: true,
            price: 380,
            maxBuy: 1,
            sort: 61,
            category: "功法卷軸"
        },
        canUse(state) {
            const req = 10;
            if ((state.comprehension || 0) < req) {
                const msg = "你的悟性仍不足以參悟玄階心法（需要悟性 ≥ 10）。";
                maybeLog(msg, "event");
                return { ok: false, reason: msg };
            }
            const tier = state.techniqueTier || 0;
            if (tier >= 2) {
                const msg = "你當前修煉的功法已不遜於玄階心法。";
                maybeLog(msg, "event");
                return { ok: false, reason: msg };
            }
            return { ok: true };
        },
        use(state) {
            state.techniqueTier = 2;
            maybeLog("你參悟玄階心法卷軸，成功修成新功法！", "great-event");
            toast("成功修習玄階心法。", "success");
        }
    },

    tech_di: {
        id: "tech_di",
        name: "地階心法卷軸",
        type: "technique_scroll",
        rarity: "purple",
        desc: "可學習地階心法（需要悟性 ≥ 15）。",
        lore: "地脈靈氣為引，真氣如奔雷而動。",
        autoConsume: true,
        autoUseOnGain: false,
        shop: {
            isShopItem: true,
            price: 650,
            maxBuy: 1,
            sort: 62,
            category: "功法卷軸"
        },
        canUse(state) {
            const req = 15;
            if ((state.comprehension || 0) < req) {
                const msg = "你的悟性仍不足以參悟地階心法（需要悟性 ≥ 15）。";
                maybeLog(msg, "event");
                return { ok: false, reason: msg };
            }
            const tier = state.techniqueTier || 0;
            if (tier >= 3) {
                const msg = "你當前修煉的功法已不遜於地階心法。";
                maybeLog(msg, "event");
                return { ok: false, reason: msg };
            }
            return { ok: true };
        },
        use(state) {
            state.techniqueTier = 3;
            maybeLog("你參悟地階心法卷軸，成功修成新功法！", "great-event");
            toast("成功修習地階心法。", "success");
        }
    },

    tech_tian: {
        id: "tech_tian",
        name: "天階心法卷軸",
        type: "technique_scroll",
        rarity: "orange",
        desc: "可學習天階心法（需要悟性 ≥ 20）。",
        lore: "據說是上古仙人所遺，能令真氣如海潮奔騰。",
        autoConsume: true,
        autoUseOnGain: false,
        shop: {
            isShopItem: true,
            price: 1200,
            maxBuy: 1,
            sort: 63,
            category: "功法卷軸"
        },
        canUse(state) {
            const req = 20;
            if ((state.comprehension || 0) < req) {
                const msg = "你的悟性仍不足以參悟天階心法（需要悟性 ≥ 20）。";
                maybeLog(msg, "event");
                return { ok: false, reason: msg };
            }
            const tier = state.techniqueTier || 0;
            if (tier >= 4) {
                const msg = "你當前修煉的功法已不遜於天階心法。";
                maybeLog(msg, "event");
                return { ok: false, reason: msg };
            }
            return { ok: true };
        },
        use(state) {
            state.techniqueTier = 4;
            maybeLog("你參悟天階心法卷軸，成功修成新功法！", "great-event");
            toast("成功修習天階心法。", "success");
        }
    },

    // === 保命：替死符（不經過背包使用，死亡邏輯另外處理） ===
    death_substitute: {
        id: "death_substitute",
        name: "替死符",
        type: "special",
        rarity: "purple",
        desc: "可抵擋一次致命劫難（包含猝死事件）。自動觸發。",
        lore: "以千年陰木刻成，內封一縷生機。危急時刻可代主受死。",
        autoConsume: false,
        autoUseOnGain: false,
        shop: {
            isShopItem: true,
            price: 2500,
            maxBuy: 3,
            sort: 70,
            category: "保命道具"
        },
        canUse() {
            return {
                ok: false,
                reason: "替死符會在遭遇致命劫難時自動觸發，無需手動使用。"
            };
        },
        use() {
            // 死亡檢查邏輯中處理，不在這裡主動呼叫
        }
    },

    // ===== 煉器材料 =====
    iron_ore: {
        id: "iron_ore",
        name: "玄鐵礦",
        type: "material_weapon",
        rarity: "white",
        desc: "煉器基礎材料，可用於鍛造法器。",
        lore: "普通的玄鐵礦石，蘊含微弱靈氣。",
        autoConsume: false,
        autoUseOnGain: false,
        canUse() { return { ok: false, reason: "這是煉器材料，需要在煉器台使用。" }; },
        use() { }
    },

    mithril_ore: {
        id: "mithril_ore",
        name: "秘銀礦",
        type: "material_weapon",
        rarity: "green",
        desc: "上等煉器材料，可鍛造優質法器。",
        lore: "稀有的秘銀礦石，質地堅韌，靈氣充沛。",
        autoConsume: false,
        autoUseOnGain: false,
        canUse() { return { ok: false, reason: "這是煉器材料，需要在煉器台使用。" }; },
        use() { }
    },

    star_iron: {
        id: "star_iron",
        name: "星辰鐵",
        type: "material_weapon",
        rarity: "blue",
        desc: "珍稀煉器材料，可鍛造靈器。",
        lore: "從天外隕石中提煉的星辰鐵，蘊含星辰之力。",
        autoConsume: false,
        autoUseOnGain: false,
        canUse() { return { ok: false, reason: "這是煉器材料，需要在煉器台使用。" }; },
        use() { }
    },

    dragon_scale: {
        id: "dragon_scale",
        name: "龍鱗",
        type: "material_weapon",
        rarity: "purple",
        desc: "頂級煉器材料，可鍛造法寶。",
        lore: "真龍遺留的鱗片，堅不可摧，蘊含龍威。",
        autoConsume: false,
        autoUseOnGain: false,
        canUse() { return { ok: false, reason: "這是煉器材料，需要在煉器台使用。" }; },
        use() { }
    },

    // === 速度類 ===
    speed_pill_small: {
        id: "speed_pill_small",
        name: "神行丹",
        type: "consumable",
        rarity: "white",
        desc: "服用後身輕如燕，雖不能飛行，但奔跑如飛。(速度+1)",
        lore: "以風靈草煉製的低階丹藥，江湖俠客的最愛。",
        autoConsume: true,
        autoUseOnGain: false,
        canUse(state) { return { ok: true }; },
        use(state) {
            state.speed = (state.speed || 10) + 1;
            maybeLog("你服用了神行丹，感覺身體輕盈了許多！(速度+1)", "event");
            toast("身輕如燕，速度+1", "success");
        }
    },
    speed_pill_mid: {
        id: "speed_pill_mid",
        name: "御風丹",
        type: "consumable",
        rarity: "green",
        desc: "服用後可御風而行，速度大增。(速度+3)",
        lore: "雖未達築基御劍之境，但已能憑虛御風片刻。",
        autoConsume: true,
        autoUseOnGain: false,
        canUse(state) { return { ok: true }; },
        use(state) {
            state.speed = (state.speed || 10) + 3;
            maybeLog("你服用了御風丹，彷彿融入了風中！(速度+3)", "event");
            toast("乘風而行，速度+3", "success");
        }
    },
    speed_pill_large: {
        id: "speed_pill_large",
        name: "縮地成寸丹",
        type: "consumable",
        rarity: "blue",
        desc: "蘊含空間之力的寶丹，一步跨出便是百丈。(速度+8)",
        lore: "傳聞中元嬰老怪趕路所用的丹藥。",
        autoConsume: true,
        autoUseOnGain: false,
        canUse(state) { return { ok: true }; },
        use(state) {
            state.speed = (state.speed || 10) + 8;
            maybeLog("你服用了縮地成寸丹，身形鬼魅難測！(速度+8)", "great-event");
            toast("縮地成寸，速度+8", "success");
        }
    },

    // === 氣運類 ===
    luck_pill_small: {
        id: "luck_pill_small",
        name: "小幸運丹",
        type: "consumable",
        rarity: "white",
        desc: "服用後感覺今天運氣不錯。(氣運+1)",
        lore: "江湖術士煉製的丹藥，據說能轉運。",
        autoConsume: true,
        autoUseOnGain: false,
        canUse(state) { return { ok: true }; },
        use(state) {
            state.luck = (state.luck || 0) + 1;
            maybeLog("你服用了小幸運丹，感覺鴻運當頭。(氣運+1)", "event");
            toast("氣運+1", "success");
        }
    },
    luck_pill_mid: {
        id: "luck_pill_mid",
        name: "天官賜福丹",
        type: "consumable",
        rarity: "green",
        desc: "服用後如有神助，機緣滾滾。(氣運+3)",
        lore: "藥力引動一絲天道眷顧。",
        autoConsume: true,
        autoUseOnGain: false,
        canUse(state) { return { ok: true }; },
        use(state) {
            state.luck = (state.luck || 0) + 3;
            maybeLog("你服用了天官賜福丹，吉星高照！(氣運+3)", "event");
            toast("氣運+3", "success");
        }
    },
    luck_pill_large: {
        id: "luck_pill_large",
        name: "九世善人丹",
        type: "consumable",
        rarity: "blue",
        desc: "服用後氣運滔天，出門必撿寶。(氣運+5)",
        lore: "凝聚九世功德煉製而成的奇丹。",
        autoConsume: true,
        autoUseOnGain: false,
        canUse(state) { return { ok: true }; },
        use(state) {
            state.luck = (state.luck || 0) + 5;
            maybeLog("你服用了九世善人丹，氣運紫氣東來！(氣運+5)", "great-event");
            toast("氣運+5", "success");
        }
    },

    // === 壽元類 ===
    longevity_pill_small: {
        id: "longevity_pill_small",
        name: "延壽丹",
        type: "consumable",
        rarity: "green",
        desc: "服用後可延壽十年。(壽元+10年)",
        lore: "凡人夢寐以求的仙丹，吃一顆長命百歲。",
        autoConsume: true,
        autoUseOnGain: false,
        canUse(state) { return { ok: true }; },
        use(state) {
            state.lifespan = (state.lifespan || 100) + 10;
            maybeLog("你服用了延壽丹，感覺生機勃勃！(壽元+10年)", "event");
            toast("延壽+10年", "success");
        }
    },
    longevity_pill_mid: {
        id: "longevity_pill_mid",
        name: "長生丹",
        type: "consumable",
        rarity: "blue",
        desc: "服用後可延壽五十年。(壽元+50年)",
        lore: "取千年龜血煉製，藥力綿長。",
        autoConsume: true,
        autoUseOnGain: false,
        canUse(state) { return { ok: true }; },
        use(state) {
            state.lifespan = (state.lifespan || 100) + 50;
            maybeLog("你服用了長生丹，白髮轉黑！(壽元+50年)", "event");
            toast("延壽+50年", "success");
        }
    },
    longevity_pill_large: {
        id: "longevity_pill_large",
        name: "壽與天齊丹",
        type: "consumable",
        rarity: "purple",
        desc: "服用後可延壽百年。(壽元+100年)",
        lore: "逆天奪命之丹，非大機緣者不可得。",
        autoConsume: true,
        autoUseOnGain: false,
        canUse(state) { return { ok: true }; },
        use(state) {
            state.lifespan = (state.lifespan || 100) + 100;
            maybeLog("你服用了壽與天齊丹，感覺壽元綿長無盡！(壽元+100年)", "great-event");
            toast("延壽+100年", "success");
        }
    },

    // === 突破輔助類 ===
    break_pill_small: {
        id: "break_pill_small",
        name: "破境丹",
        type: "consumable",
        rarity: "green",
        desc: "服用後增加下一次突破成功率 5%。(突破率+5%)",
        lore: "能稍減心魔，助人破境。",
        autoConsume: true,
        autoUseOnGain: false,
        canUse(state) {
            if (state.qi < state.qiCap) return { ok: true };
            return { ok: true };
        },
        use(state) {
            state.breakBonus = (state.breakBonus || 0) + 0.05;
            maybeLog("你服用了破境丹，對突破更有把握了。(突破率+5%)", "event");
            toast("突破率+5%", "success");
        }
    },
    break_pill_mid: {
        id: "break_pill_mid",
        name: "護脈丹",
        type: "consumable",
        rarity: "blue",
        desc: "服用後增加下一次突破成功率 10%，並減少失敗損失。(突破率+10%)",
        lore: "護住心脈，防止走火入魔。",
        autoConsume: true,
        autoUseOnGain: false,
        canUse(state) { return { ok: true }; },
        use(state) {
            state.breakBonus = (state.breakBonus || 0) + 0.10;
            maybeLog("你服用了護脈丹，經脈穩固。(突破率+10%)", "event");
            toast("突破率+10%", "success");
        }
    },
    break_pill_large: {
        id: "break_pill_large",
        name: "天心丹",
        type: "consumable",
        rarity: "purple",
        desc: "服用後增加下一次突破成功率 20%。(突破率+20%)",
        lore: "以此丹溝通天心，渡劫如履平地。",
        autoConsume: true,
        autoUseOnGain: false,
        canUse(state) { return { ok: true }; },
        use(state) {
            state.breakBonus = (state.breakBonus || 0) + 0.20;
            maybeLog("你服用了天心丹，心如止水。(突破率+20%)", "great-event");
            toast("突破率+20%", "success");
        }
    },

    // === 8品 (頂級紫階) ===
    qi_pill_mega: {
        id: "qi_pill_mega",
        name: "太清丹",
        type: "consumable",
        rarity: "purple",
        desc: "傳說中的八品靈丹，蘊含太清仙氣。(真氣+5000, 上限+500)",
        lore: "服之可得太清之氣護體，修為大進。",
        autoConsume: true,
        autoUseOnGain: false,
        canUse(state) { return { ok: true }; },
        use(state) {
            state.qi = (state.qi || 0) + 5000;
            state.qiCap = (state.qiCap || 100) + 500;
            maybeLog("你服用了太清丹，體內真氣浩蕩如江海！(真氣+5000, 上限+500)", "great-event");
            toast("真氣暴漲！", "success");
        }
    },
    soul_pill: {
        id: "soul_pill",
        name: "養魂丹",
        type: "consumable",
        rarity: "purple",
        desc: "滋養神魂的奇丹，可提升悟性。 (悟性+2)",
        lore: "神魂壯大，方能窺探大道。",
        autoConsume: true,
        autoUseOnGain: false,
        canUse(state) { return { ok: true }; },
        use(state) {
            state.comprehension = (state.comprehension || 10) + 2;
            maybeLog("你服用了養魂丹，感覺靈台清明。(悟性+2)", "great-event");
            toast("悟性+2", "success");
        }
    },

    // === 8品 器/陣/符 (效果設計) ===
    void_sword: {
        id: "void_sword",
        name: "虛空劍",
        type: "weapon",
        rarity: "purple",
        desc: "以虛空石煉製的法寶，劍影無形，殺人於無形。",
        lore: "雖未達仙器之列，卻已觸摸到空間法則的邊緣。(攻擊+500, 爆擊+15%)",
        equip: true,
        slot: "weapon",
        stats: { attack: 500, crit: 0.15 },
        canUse() { return { ok: false, reason: "這是裝備，請在背包中裝備。" }; },
        use() { }
    },

    heaven_array: {
        id: "heaven_array",
        name: "周天星斗陣",
        type: "formation",
        rarity: "purple",
        desc: "引動周天星力，修練速度提升 300%。",
        lore: "上古奇陣的簡化版，依然擁有奪天地造化之功。",
        autoConsume: true,
        autoUseOnGain: false,
        canUse(state) {
            // 假設有個 currentFormation 狀態
            return { ok: true };
        },
        use(state) {
            // 簡單處理：加個永久 buff 或直接提升效率
            state.cultivationMult = (state.cultivationMult || 1) + 3.0;
            maybeLog("你布下了周天星斗陣，周圍靈氣濃郁如霧！(修練效率+300%)", "great-event");
            toast("修練效率大幅提升！", "success");
        }
    },

    thunder_charm: {
        id: "thunder_charm",
        name: "九霄神雷符",
        type: "consumable", // 或 combat_item
        rarity: "purple",
        desc: "封印了一道九霄神雷，可對敵人造成毀滅性打擊。",
        lore: "威力堪比金丹修士全力一擊。",
        autoConsume: false,
        autoUseOnGain: false,
        canUse(state) { return { ok: true }; },
        use(state) {
            // 假設這是戰鬥道具，或直接給予傷害
            // 暫時做成獲得大量經驗或修為的“渡劫”效果? 
            // 或者是"戰鬥力暫時暴增"
            state.tempAttackBonus = (state.tempAttackBonus || 0) + 1000;
            maybeLog("你祭出九霄神雷符，雷光漫天！(獲得暫時攻擊加成)", "event");
            toast("雷法降世！", "success");
        }
    },

    // ===== 煉丹材料 =====
    spirit_grass: {
        id: "spirit_grass",
        name: "靈草",
        type: "material_pill",
        rarity: "white",
        desc: "煉丹基礎材料，可煉製低階丹藥。",
        lore: "常見的靈草，藥性溫和。",
        autoConsume: false,
        autoUseOnGain: false,
        canUse() { return { ok: false, reason: "這是煉丹材料，需要在丹爐中使用。" }; },
        use() { }
    },

    blood_lotus: {
        id: "blood_lotus",
        name: "血蓮",
        type: "material_pill",
        rarity: "green",
        desc: "上等煉丹材料，可煉製中階丹藥。",
        lore: "生長於血池的奇異蓮花，藥性霸道。",
        autoConsume: false,
        autoUseOnGain: false,
        canUse() { return { ok: false, reason: "這是煉丹材料，需要在丹爐中使用。" }; },
        use() { }
    },

    phoenix_feather: {
        id: "phoenix_feather",
        name: "鳳凰羽",
        type: "material_pill",
        rarity: "blue",
        desc: "珍稀煉丹材料，可煉製高階丹藥。",
        lore: "鳳凰脫落的羽毛，蘊含涅槃之力。",
        autoConsume: false,
        autoUseOnGain: false,
        canUse() { return { ok: false, reason: "這是煉丹材料，需要在丹爐中使用。" }; },
        use() { }
    },

    immortal_fruit: {
        id: "immortal_fruit",
        name: "仙靈果",
        type: "material_pill",
        rarity: "purple",
        desc: "頂級煉丹材料，可煉製仙丹。",
        lore: "萬年一熟的仙果，服之可延壽千年。",
        autoConsume: false,
        autoUseOnGain: false,
        canUse() { return { ok: false, reason: "這是煉丹材料，需要在丹爐中使用。" }; },
        use() { }
    },

    // ===== 畫符材料 =====
    talisman_paper: {
        id: "talisman_paper",
        name: "符紙",
        type: "material_talisman",
        rarity: "white",
        desc: "畫符基礎材料，可繪製低階符籙。",
        lore: "以靈木製成的符紙，可承載靈力。",
        autoConsume: false,
        autoUseOnGain: false,
        canUse() { return { ok: false, reason: "這是畫符材料，需要在符案上使用。" }; },
        use() { }
    },

    cinnabar: {
        id: "cinnabar",
        name: "朱砂",
        type: "material_talisman",
        rarity: "green",
        desc: "上等畫符材料，可繪製中階符籙。",
        lore: "千年朱砂，辟邪驅魔，是畫符必備之物。",
        autoConsume: false,
        autoUseOnGain: false,
        canUse() { return { ok: false, reason: "這是畫符材料，需要在符案上使用。" }; },
        use() { }
    },

    spirit_ink: {
        id: "spirit_ink",
        name: "靈墨",
        type: "material_talisman",
        rarity: "blue",
        desc: "珍稀畫符材料，可繪製高階符籙。",
        lore: "以妖獸精血煉製的靈墨，靈力充沛。",
        autoConsume: false,
        autoUseOnGain: false,
        canUse() { return { ok: false, reason: "這是畫符材料，需要在符案上使用。" }; },
        use() { }
    },

    jade_slip: {
        id: "jade_slip",
        name: "玉簡",
        type: "material_talisman",
        rarity: "purple",
        desc: "頂級畫符材料，可繪製仙符。",
        lore: "以萬年寒玉雕琢而成，可承載仙家符文。",
        autoConsume: false,
        autoUseOnGain: false,
        canUse() { return { ok: false, reason: "這是畫符材料，需要在符案上使用。" }; },
        use() { }
    },

    // ===== 陣法材料 =====
    spirit_stone_small: {
        id: "spirit_stone_small",
        name: "下品靈石",
        type: "material_formation",
        rarity: "white",
        desc: "陣法基礎材料，可布置低階陣法。",
        lore: "蘊含靈氣的礦石，是陣法的能量來源。",
        autoConsume: false,
        autoUseOnGain: false,
        canUse() { return { ok: false, reason: "這是陣法材料，需要在陣盤上使用。" }; },
        use() { }
    },

    formation_flag: {
        id: "formation_flag",
        name: "陣旗",
        type: "material_formation",
        rarity: "green",
        desc: "上等陣法材料，可布置中階陣法。",
        lore: "刻有符文的陣旗，是陣法的節點。",
        autoConsume: false,
        autoUseOnGain: false,
        canUse() { return { ok: false, reason: "這是陣法材料，需要在陣盤上使用。" }; },
        use() { }
    },

    array_disk: {
        id: "array_disk",
        name: "陣盤",
        type: "material_formation",
        rarity: "blue",
        desc: "珍稀陣法材料，可布置高階陣法。",
        lore: "以玄鐵鑄造的陣盤，可承載複雜陣紋。",
        autoConsume: false,
        autoUseOnGain: false,
        canUse() { return { ok: false, reason: "這是陣法材料，需要在陣盤上使用。" }; },
        use() { }
    },

    heaven_earth_stone: {
        id: "heaven_earth_stone",
        name: "天地靈石",
        type: "material_formation",
        rarity: "purple",
        desc: "頂級陣法材料，可布置仙陣。",
        lore: "天地孕育的靈石，蘊含無窮靈力。",
        autoConsume: false,
        autoUseOnGain: false,
        canUse() { return { ok: false, reason: "這是陣法材料，需要在陣盤上使用。" }; },
        use() { }
    },

    // ===== 煉器材料 =====
    // 白色階（基礎）
    iron_ore: {
        id: "iron_ore",
        name: "玄鐵礦",
        type: "material_weapon",
        rarity: "white",
        desc: "煉器基礎材料，可用於鍛造法器。",
        lore: "普通的玄鐵礦石，蘊含微弱靈氣。",
        autoConsume: false,
        autoUseOnGain: false,
        canUse() { return { ok: false, reason: "這是煉器材料，需要在煉器台使用。" }; },
        use() { }
    },

    copper_ore: {
        id: "copper_ore",
        name: "赤銅礦",
        type: "material_weapon",
        rarity: "white",
        desc: "煉器基礎材料，質地柔軟易塑形。",
        lore: "常見的赤銅礦石，適合初學者練習。",
        autoConsume: false,
        autoUseOnGain: false,
        canUse() { return { ok: false, reason: "這是煉器材料，需要在煉器台使用。" }; },
        use() { }
    },

    stone_core: {
        id: "stone_core",
        name: "靈石核心",
        type: "material_weapon",
        rarity: "white",
        desc: "煉器基礎材料，可作為法器核心。",
        lore: "靈石的核心部分，蘊含純淨靈氣。",
        autoConsume: false,
        autoUseOnGain: false,
        canUse() { return { ok: false, reason: "這是煉器材料，需要在煉器台使用。" }; },
        use() { }
    },

    beast_bone: {
        id: "beast_bone",
        name: "妖獸骨",
        type: "material_weapon",
        rarity: "white",
        desc: "煉器基礎材料，堅韌耐用。",
        lore: "低階妖獸的骨骼，可用於煉製骨器。",
        autoConsume: false,
        autoUseOnGain: false,
        canUse() { return { ok: false, reason: "這是煉器材料，需要在煉器台使用。" }; },
        use() { }
    },

    // 綠色階（上等）
    mithril_ore: {
        id: "mithril_ore",
        name: "秘銀礦",
        type: "material_weapon",
        rarity: "green",
        desc: "上等煉器材料，可鍛造優質法器。",
        lore: "稀有的秘銀礦石，質地堅韌，靈氣充沛。",
        autoConsume: false,
        autoUseOnGain: false,
        canUse() { return { ok: false, reason: "這是煉器材料，需要在煉器台使用。" }; },
        use() { }
    },

    cold_iron: {
        id: "cold_iron",
        name: "寒鐵",
        type: "material_weapon",
        rarity: "green",
        desc: "上等煉器材料，蘊含寒冰之力。",
        lore: "千年寒潭底的玄鐵，觸之冰寒刺骨。",
        autoConsume: false,
        autoUseOnGain: false,
        canUse() { return { ok: false, reason: "這是煉器材料，需要在煉器台使用。" }; },
        use() { }
    },

    flame_crystal: {
        id: "flame_crystal",
        name: "烈焰晶",
        type: "material_weapon",
        rarity: "green",
        desc: "上等煉器材料，蘊含火焰之力。",
        lore: "火山岩漿中孕育的晶石，灼熱無比。",
        autoConsume: false,
        autoUseOnGain: false,
        canUse() { return { ok: false, reason: "這是煉器材料，需要在煉器台使用。" }; },
        use() { }
    },

    thunder_wood: {
        id: "thunder_wood",
        name: "雷擊木",
        type: "material_weapon",
        rarity: "green",
        desc: "上等煉器材料，蘊含雷電之力。",
        lore: "被天雷擊中的古木，內含雷霆之力。",
        autoConsume: false,
        autoUseOnGain: false,
        canUse() { return { ok: false, reason: "這是煉器材料，需要在煉器台使用。" }; },
        use() { }
    },

    // 藍色階（珍稀）
    star_iron: {
        id: "star_iron",
        name: "星辰鐵",
        type: "material_weapon",
        rarity: "blue",
        desc: "珍稀煉器材料，可鍛造靈器。",
        lore: "從天外隕石中提煉的星辰鐵，蘊含星辰之力。",
        autoConsume: false,
        autoUseOnGain: false,
        canUse() { return { ok: false, reason: "這是煉器材料，需要在煉器台使用。" }; },
        use() { }
    },

    deep_sea_gold: {
        id: "deep_sea_gold",
        name: "深海金",
        type: "material_weapon",
        rarity: "blue",
        desc: "珍稀煉器材料，萬年海底沉金。",
        lore: "深海萬米之下的神金，重逾千鈞。",
        autoConsume: false,
        autoUseOnGain: false,
        canUse() { return { ok: false, reason: "這是煉器材料，需要在煉器台使用。" }; },
        use() { }
    },

    void_stone: {
        id: "void_stone",
        name: "虛空石",
        type: "material_weapon",
        rarity: "blue",
        desc: "珍稀煉器材料，蘊含空間之力。",
        lore: "虛空裂縫中的奇石，可煉製空間法器。",
        autoConsume: false,
        autoUseOnGain: false,
        canUse() { return { ok: false, reason: "這是煉器材料，需要在煉器台使用。" }; },
        use() { }
    },

    spirit_jade: {
        id: "spirit_jade",
        name: "靈玉",
        type: "material_weapon",
        rarity: "blue",
        desc: "珍稀煉器材料，溫潤如玉。",
        lore: "萬年靈脈孕育的寶玉，靈氣盎然。",
        autoConsume: false,
        autoUseOnGain: false,
        canUse() { return { ok: false, reason: "這是煉器材料，需要在煉器台使用。" }; },
        use() { }
    },

    // 紫色階（頂級）
    dragon_scale: {
        id: "dragon_scale",
        name: "龍鱗",
        type: "material_weapon",
        rarity: "purple",
        desc: "頂級煉器材料，可鍛造法寶。",
        lore: "真龍遺留的鱗片，堅不可摧，蘊含龍威。",
        autoConsume: false,
        autoUseOnGain: false,
        canUse() { return { ok: false, reason: "這是煉器材料，需要在煉器台使用。" }; },
        use() { }
    },

    phoenix_bone: {
        id: "phoenix_bone",
        name: "鳳凰骨",
        type: "material_weapon",
        rarity: "purple",
        desc: "頂級煉器材料，蘊含涅槃之力。",
        lore: "鳳凰涅槃後遺留的骨骼，永不熄滅。",
        autoConsume: false,
        autoUseOnGain: false,
        canUse() { return { ok: false, reason: "這是煉器材料，需要在煉器台使用。" }; },
        use() { }
    },

    chaos_crystal: {
        id: "chaos_crystal",
        name: "混沌晶",
        type: "material_weapon",
        rarity: "purple",
        desc: "頂級煉器材料，天地初開之物。",
        lore: "混沌初開時的結晶，蘊含造化之力。",
        autoConsume: false,
        autoUseOnGain: false,
        canUse() { return { ok: false, reason: "這是煉器材料，需要在煉器台使用。" }; },
        use() { }
    },

    immortal_gold: {
        id: "immortal_gold",
        name: "仙金",
        type: "material_weapon",
        rarity: "purple",
        desc: "頂級煉器材料，仙界至寶。",
        lore: "仙界流傳的神金，萬劫不壞。",
        autoConsume: false,
        autoUseOnGain: false,
        canUse() { return { ok: false, reason: "這是煉器材料，需要在煉器台使用。" }; },
        use() { }
    },

    // ===== 煉丹材料 =====
    // 白色階（基礎）
    spirit_grass: {
        id: "spirit_grass",
        name: "靈草",
        type: "material_pill",
        rarity: "white",
        desc: "煉丹基礎材料，可煉製低階丹藥。",
        lore: "常見的靈草，藥性溫和。",
        autoConsume: false,
        autoUseOnGain: false,
        canUse() { return { ok: false, reason: "這是煉丹材料，需要在丹爐中使用。" }; },
        use() { }
    },

    moon_flower: {
        id: "moon_flower",
        name: "月華花",
        type: "material_pill",
        rarity: "white",
        desc: "煉丹基礎材料，吸收月華精華。",
        lore: "月光下綻放的靈花，清香怡人。",
        autoConsume: false,
        autoUseOnGain: false,
        canUse() { return { ok: false, reason: "這是煉丹材料，需要在丹爐中使用。" }; },
        use() { }
    },

    spirit_mushroom: {
        id: "spirit_mushroom",
        name: "靈芝",
        type: "material_pill",
        rarity: "white",
        desc: "煉丹基礎材料，延年益壽。",
        lore: "百年靈芝，藥效溫和持久。",
        autoConsume: false,
        autoUseOnGain: false,
        canUse() { return { ok: false, reason: "這是煉丹材料，需要在丹爐中使用。" }; },
        use() { }
    },

    dew_drop: {
        id: "dew_drop",
        name: "晨露",
        type: "material_pill",
        rarity: "white",
        desc: "煉丹基礎材料，清晨靈氣凝結。",
        lore: "清晨靈草上的露珠，蘊含天地靈氣。",
        autoConsume: false,
        autoUseOnGain: false,
        canUse() { return { ok: false, reason: "這是煉丹材料，需要在丹爐中使用。" }; },
        use() { }
    },

    // 綠色階（上等）
    blood_lotus: {
        id: "blood_lotus",
        name: "血蓮",
        type: "material_pill",
        rarity: "green",
        desc: "上等煉丹材料，可煉製中階丹藥。",
        lore: "生長於血池的奇異蓮花，藥性霸道。",
        autoConsume: false,
        autoUseOnGain: false,
        canUse() { return { ok: false, reason: "這是煉丹材料，需要在丹爐中使用。" }; },
        use() { }
    },

    ice_heart_grass: {
        id: "ice_heart_grass",
        name: "冰心草",
        type: "material_pill",
        rarity: "green",
        desc: "上等煉丹材料，清心凝神。",
        lore: "生長於極寒之地的靈草，可清心火。",
        autoConsume: false,
        autoUseOnGain: false,
        canUse() { return { ok: false, reason: "這是煉丹材料，需要在丹爐中使用。" }; },
        use() { }
    },

    flame_fruit: {
        id: "flame_fruit",
        name: "烈焰果",
        type: "material_pill",
        rarity: "green",
        desc: "上等煉丹材料，蘊含火焰精華。",
        lore: "火山口生長的靈果，服之如飲烈焰。",
        autoConsume: false,
        autoUseOnGain: false,
        canUse() { return { ok: false, reason: "這是煉丹材料，需要在丹爐中使用。" }; },
        use() { }
    },

    thunder_bamboo: {
        id: "thunder_bamboo",
        name: "雷竹",
        type: "material_pill",
        rarity: "green",
        desc: "上等煉丹材料，蘊含雷霆之力。",
        lore: "雷雨中生長的靈竹，竹節含雷。",
        autoConsume: false,
        autoUseOnGain: false,
        canUse() { return { ok: false, reason: "這是煉丹材料，需要在丹爐中使用。" }; },
        use() { }
    },

    // 藍色階（珍稀）
    phoenix_feather: {
        id: "phoenix_feather",
        name: "鳳凰羽",
        type: "material_pill",
        rarity: "blue",
        desc: "珍稀煉丹材料，可煉製高階丹藥。",
        lore: "鳳凰脫落的羽毛，蘊含涅槃之力。",
        autoConsume: false,
        autoUseOnGain: false,
        canUse() { return { ok: false, reason: "這是煉丹材料，需要在丹爐中使用。" }; },
        use() { }
    },

    dragon_blood_grass: {
        id: "dragon_blood_grass",
        name: "龍血草",
        type: "material_pill",
        rarity: "blue",
        desc: "珍稀煉丹材料，吸收龍血精華。",
        lore: "生長於龍血浸潤之地的靈草，藥力驚人。",
        autoConsume: false,
        autoUseOnGain: false,
        canUse() { return { ok: false, reason: "這是煉丹材料，需要在丹爐中使用。" }; },
        use() { }
    },

    nine_leaf_lotus: {
        id: "nine_leaf_lotus",
        name: "九葉蓮",
        type: "material_pill",
        rarity: "blue",
        desc: "珍稀煉丹材料，千年一開。",
        lore: "千年靈蓮，九葉齊開時藥效最佳。",
        autoConsume: false,
        autoUseOnGain: false,
        canUse() { return { ok: false, reason: "這是煉丹材料，需要在丹爐中使用。" }; },
        use() { }
    },

    star_dew: {
        id: "star_dew",
        name: "星露",
        type: "material_pill",
        rarity: "blue",
        desc: "珍稀煉丹材料，星辰精華凝結。",
        lore: "星辰之力凝結的露珠，可淬煉肉身。",
        autoConsume: false,
        autoUseOnGain: false,
        canUse() { return { ok: false, reason: "這是煉丹材料，需要在丹爐中使用。" }; },
        use() { }
    },

    // 紫色階（頂級）
    immortal_fruit: {
        id: "immortal_fruit",
        name: "仙靈果",
        type: "material_pill",
        rarity: "purple",
        desc: "頂級煉丹材料，可煉製仙丹。",
        lore: "萬年一熟的仙果，服之可延壽千年。",
        autoConsume: false,
        autoUseOnGain: false,
        canUse() { return { ok: false, reason: "這是煉丹材料，需要在丹爐中使用。" }; },
        use() { }
    },

    chaos_lotus: {
        id: "chaos_lotus",
        name: "混沌青蓮",
        type: "material_pill",
        rarity: "purple",
        desc: "頂級煉丹材料，天地至寶。",
        lore: "混沌中孕育的青蓮，可奪天地造化。",
        autoConsume: false,
        autoUseOnGain: false,
        canUse() { return { ok: false, reason: "這是煉丹材料，需要在丹爐中使用。" }; },
        use() { }
    },

    unicorn_horn: {
        id: "unicorn_horn",
        name: "麒麟角",
        type: "material_pill",
        rarity: "purple",
        desc: "頂級煉丹材料，祥瑞之物。",
        lore: "麒麟的獨角，蘊含無上祥瑞之氣。",
        autoConsume: false,
        autoUseOnGain: false,
        canUse() { return { ok: false, reason: "這是煉丹材料，需要在丹爐中使用。" }; },
        use() { }
    },

    heaven_dew: {
        id: "heaven_dew",
        name: "天露",
        type: "material_pill",
        rarity: "purple",
        desc: "頂級煉丹材料，天界甘露。",
        lore: "天界降下的甘露，可生死人肉白骨。",
        autoConsume: false,
        autoUseOnGain: false,
        canUse() { return { ok: false, reason: "這是煉丹材料，需要在丹爐中使用。" }; },
        use() { }
    },

    // ===== 畫符材料 =====
    // 白色階（基礎）
    talisman_paper: {
        id: "talisman_paper",
        name: "符紙",
        type: "material_talisman",
        rarity: "white",
        desc: "畫符基礎材料，可繪製低階符籙。",
        lore: "以靈木製成的符紙，可承載靈力。",
        autoConsume: false,
        autoUseOnGain: false,
        canUse() { return { ok: false, reason: "這是畫符材料，需要在符案上使用。" }; },
        use() { }
    },

    black_ink: {
        id: "black_ink",
        name: "墨汁",
        type: "material_talisman",
        rarity: "white",
        desc: "畫符基礎材料，普通墨汁。",
        lore: "以松煙製成的墨汁，書寫流暢。",
        autoConsume: false,
        autoUseOnGain: false,
        canUse() { return { ok: false, reason: "這是畫符材料，需要在符案上使用。" }; },
        use() { }
    },

    spirit_brush: {
        id: "spirit_brush",
        name: "靈筆",
        type: "material_talisman",
        rarity: "white",
        desc: "畫符基礎材料，可書寫符文。",
        lore: "以靈獸毛髮製成的毛筆，筆鋒銳利。",
        autoConsume: false,
        autoUseOnGain: false,
        canUse() { return { ok: false, reason: "這是畫符材料，需要在符案上使用。" }; },
        use() { }
    },

    yellow_paper: {
        id: "yellow_paper",
        name: "黃紙",
        type: "material_talisman",
        rarity: "white",
        desc: "畫符基礎材料，傳統符紙。",
        lore: "以桃木漿製成的黃紙，辟邪驅鬼。",
        autoConsume: false,
        autoUseOnGain: false,
        canUse() { return { ok: false, reason: "這是畫符材料，需要在符案上使用。" }; },
        use() { }
    },

    // 綠色階（上等）
    cinnabar: {
        id: "cinnabar",
        name: "朱砂",
        type: "material_talisman",
        rarity: "green",
        desc: "上等畫符材料，可繪製中階符籙。",
        lore: "千年朱砂，辟邪驅魔，是畫符必備之物。",
        autoConsume: false,
        autoUseOnGain: false,
        canUse() { return { ok: false, reason: "這是畫符材料，需要在符案上使用。" }; },
        use() { }
    },

    peach_wood: {
        id: "peach_wood",
        name: "桃木",
        type: "material_talisman",
        rarity: "green",
        desc: "上等畫符材料，天然辟邪。",
        lore: "千年桃木，天生克制邪祟。",
        autoConsume: false,
        autoUseOnGain: false,
        canUse() { return { ok: false, reason: "這是畫符材料，需要在符案上使用。" }; },
        use() { }
    },

    silver_powder: {
        id: "silver_powder",
        name: "銀粉",
        type: "material_talisman",
        rarity: "green",
        desc: "上等畫符材料，增強符力。",
        lore: "以秘銀研磨的粉末，可增強符籙威力。",
        autoConsume: false,
        autoUseOnGain: false,
        canUse() { return { ok: false, reason: "這是畫符材料，需要在符案上使用。" }; },
        use() { }
    },

    beast_blood: {
        id: "beast_blood",
        name: "獸血",
        type: "material_talisman",
        rarity: "green",
        desc: "上等畫符材料，妖獸精血。",
        lore: "妖獸的精血，蘊含妖力。",
        autoConsume: false,
        autoUseOnGain: false,
        canUse() { return { ok: false, reason: "這是畫符材料，需要在符案上使用。" }; },
        use() { }
    },

    // 藍色階（珍稀）
    spirit_ink: {
        id: "spirit_ink",
        name: "靈墨",
        type: "material_talisman",
        rarity: "blue",
        desc: "珍稀畫符材料，可繪製高階符籙。",
        lore: "以妖獸精血煉製的靈墨，靈力充沛。",
        autoConsume: false,
        autoUseOnGain: false,
        canUse() { return { ok: false, reason: "這是畫符材料，需要在符案上使用。" }; },
        use() { }
    },

    dragon_blood: {
        id: "dragon_blood",
        name: "龍血",
        type: "material_talisman",
        rarity: "blue",
        desc: "珍稀畫符材料，真龍精血。",
        lore: "真龍的精血，蘊含龍威。",
        autoConsume: false,
        autoUseOnGain: false,
        canUse() { return { ok: false, reason: "這是畫符材料，需要在符案上使用。" }; },
        use() { }
    },

    gold_foil: {
        id: "gold_foil",
        name: "金箔",
        type: "material_talisman",
        rarity: "blue",
        desc: "珍稀畫符材料，純金箔紙。",
        lore: "以純金打造的箔紙，可繪製金符。",
        autoConsume: false,
        autoUseOnGain: false,
        canUse() { return { ok: false, reason: "這是畫符材料，需要在符案上使用。" }; },
        use() { }
    },

    phoenix_blood: {
        id: "phoenix_blood",
        name: "鳳血",
        type: "material_talisman",
        rarity: "blue",
        desc: "珍稀畫符材料，鳳凰精血。",
        lore: "鳳凰的精血，蘊含涅槃之力。",
        autoConsume: false,
        autoUseOnGain: false,
        canUse() { return { ok: false, reason: "這是畫符材料，需要在符案上使用。" }; },
        use() { }
    },

    // 紫色階（頂級）
    jade_slip: {
        id: "jade_slip",
        name: "玉簡",
        type: "material_talisman",
        rarity: "purple",
        desc: "頂級畫符材料，可繪製仙符。",
        lore: "以萬年寒玉雕琢而成，可承載仙家符文。",
        autoConsume: false,
        autoUseOnGain: false,
        canUse() { return { ok: false, reason: "這是畫符材料，需要在符案上使用。" }; },
        use() { }
    },

    immortal_ink: {
        id: "immortal_ink",
        name: "仙墨",
        type: "material_talisman",
        rarity: "purple",
        desc: "頂級畫符材料，仙界至寶。",
        lore: "仙界流傳的神墨，永不褪色。",
        autoConsume: false,
        autoUseOnGain: false,
        canUse() { return { ok: false, reason: "這是畫符材料，需要在符案上使用。" }; },
        use() { }
    },

    heaven_silk: {
        id: "heaven_silk",
        name: "天蠶絲",
        type: "material_talisman",
        rarity: "purple",
        desc: "頂級畫符材料，天蠶吐絲。",
        lore: "天蠶吐出的絲線，可織成符布。",
        autoConsume: false,
        autoUseOnGain: false,
        canUse() { return { ok: false, reason: "這是畫符材料，需要在符案上使用。" }; },
        use() { }
    },

    chaos_blood: {
        id: "chaos_blood",
        name: "混沌血",
        type: "material_talisman",
        rarity: "purple",
        desc: "頂級畫符材料，混沌生靈精血。",
        lore: "混沌生靈的精血，蘊含造化之力。",
        autoConsume: false,
        autoUseOnGain: false,
        canUse() { return { ok: false, reason: "這是畫符材料，需要在符案上使用。" }; },
        use() { }
    },

    // ===== 陣法材料 =====
    // 白色階（基礎）
    spirit_stone_small: {
        id: "spirit_stone_small",
        name: "下品靈石",
        type: "material_formation",
        rarity: "white",
        desc: "陣法基礎材料，可布置低階陣法。",
        lore: "蘊含靈氣的礦石，是陣法的能量來源。",
        autoConsume: false,
        autoUseOnGain: false,
        canUse() { return { ok: false, reason: "這是陣法材料，需要在陣盤上使用。" }; },
        use() { }
    },



    stone_pillar: {
        id: "stone_pillar",
        name: "石柱",
        type: "material_formation",
        rarity: "white",
        desc: "陣法基礎材料，穩固陣基。",
        lore: "以靈石雕琢的石柱，可穩固陣法。",
        autoConsume: false,
        autoUseOnGain: false,
        canUse() { return { ok: false, reason: "這是陣法材料，需要在陣盤上使用。" }; },
        use() { }
    },

    copper_wire: {
        id: "copper_wire",
        name: "銅線",
        type: "material_formation",
        rarity: "white",
        desc: "陣法基礎材料，連接陣紋。",
        lore: "以赤銅拉成的細線，可連接陣紋。",
        autoConsume: false,
        autoUseOnGain: false,
        canUse() { return { ok: false, reason: "這是陣法材料，需要在陣盤上使用。" }; },
        use() { }
    },

    // 綠色階（上等）
    formation_flag: {
        id: "formation_flag",
        name: "陣旗",
        type: "material_formation",
        rarity: "green",
        desc: "上等陣法材料，可布置中階陣法。",
        lore: "刻有符文的陣旗，是陣法的節點。",
        autoConsume: false,
        autoUseOnGain: false,
        canUse() { return { ok: false, reason: "這是陣法材料，需要在陣盤上使用。" }; },
        use() { }
    },

    spirit_stone_mid: {
        id: "spirit_stone_mid",
        name: "中品靈石",
        type: "material_formation",
        rarity: "green",
        desc: "上等陣法材料，靈氣充沛。",
        lore: "蘊含豐富靈氣的靈石，可支撐更強陣法。",
        autoConsume: false,
        autoUseOnGain: false,
        canUse() { return { ok: false, reason: "這是陣法材料，需要在陣盤上使用。" }; },
        use() { }
    },

    jade_pillar: {
        id: "jade_pillar",
        name: "玉柱",
        type: "material_formation",
        rarity: "green",
        desc: "上等陣法材料，溫潤如玉。",
        lore: "以靈玉雕琢的玉柱，可增強陣法威力。",
        autoConsume: false,
        autoUseOnGain: false,
        canUse() { return { ok: false, reason: "這是陣法材料，需要在陣盤上使用。" }; },
        use() { }
    },

    silver_wire: {
        id: "silver_wire",
        name: "銀線",
        type: "material_formation",
        rarity: "green",
        desc: "上等陣法材料，傳導靈力。",
        lore: "以秘銀拉成的細線，可傳導靈力。",
        autoConsume: false,
        autoUseOnGain: false,
        canUse() { return { ok: false, reason: "這是陣法材料，需要在陣盤上使用。" }; },
        use() { }
    },

    // 藍色階（珍稀）
    array_disk: {
        id: "array_disk",
        name: "陣盤",
        type: "material_formation",
        rarity: "blue",
        desc: "珍稀陣法材料，可布置高階陣法。",
        lore: "以玄鐵鑄造的陣盤，可承載複雜陣紋。",
        autoConsume: false,
        autoUseOnGain: false,
        canUse() { return { ok: false, reason: "這是陣法材料，需要在陣盤上使用。" }; },
        use() { }
    },

    spirit_stone_high: {
        id: "spirit_stone_high",
        name: "上品靈石",
        type: "material_formation",
        rarity: "blue",
        desc: "珍稀陣法材料，靈氣濃郁。",
        lore: "蘊含濃郁靈氣的靈石，極為稀有。",
        autoConsume: false,
        autoUseOnGain: false,
        canUse() { return { ok: false, reason: "這是陣法材料，需要在陣盤上使用。" }; },
        use() { }
    },

    crystal_pillar: {
        id: "crystal_pillar",
        name: "晶柱",
        type: "material_formation",
        rarity: "blue",
        desc: "珍稀陣法材料，晶瑩剔透。",
        lore: "以靈晶雕琢的晶柱，可聚集靈氣。",
        autoConsume: false,
        autoUseOnGain: false,
        canUse() { return { ok: false, reason: "這是陣法材料，需要在陣盤上使用。" }; },
        use() { }
    },

    gold_wire: {
        id: "gold_wire",
        name: "金線",
        type: "material_formation",
        rarity: "blue",
        desc: "珍稀陣法材料，純金細線。",
        lore: "以純金拉成的細線，可繪製金陣。",
        autoConsume: false,
        autoUseOnGain: false,
        canUse() { return { ok: false, reason: "這是陣法材料，需要在陣盤上使用。" }; },
        use() { }
    },

    // 紫色階（頂級）
    heaven_earth_stone: {
        id: "heaven_earth_stone",
        name: "天地靈石",
        type: "material_formation",
        rarity: "purple",
        desc: "頂級陣法材料，可布置仙陣。",
        lore: "天地孕育的靈石，蘊含無窮靈力。",
        autoConsume: false,
        autoUseOnGain: false,
        canUse() { return { ok: false, reason: "這是陣法材料，需要在陣盤上使用。" }; },
        use() { }
    },

    immortal_array: {
        id: "immortal_array",
        name: "仙陣盤",
        type: "material_formation",
        rarity: "purple",
        desc: "頂級陣法材料，仙界至寶。",
        lore: "仙界流傳的陣盤，可布置仙陣。",
        autoConsume: false,
        autoUseOnGain: false,
        canUse() { return { ok: false, reason: "這是陣法材料，需要在陣盤上使用。" }; },
        use() { }
    },

    chaos_stone: {
        id: "chaos_stone",
        name: "混沌石",
        type: "material_formation",
        rarity: "purple",
        desc: "頂級陣法材料，混沌至寶。",
        lore: "混沌中孕育的靈石，可布置混沌大陣。",
        autoConsume: false,
        autoUseOnGain: false,
        canUse() { return { ok: false, reason: "這是陣法材料，需要在陣盤上使用。" }; },
        use() { }
    },

    star_core: {
        id: "star_core",
        name: "星核",
        type: "material_formation",
        rarity: "purple",
        desc: "頂級陣法材料，星辰核心。",
        lore: "星辰的核心，蘊含無盡星辰之力。",
        autoConsume: false,
        autoUseOnGain: false,
        canUse() { return { ok: false, reason: "這是陣法材料，需要在陣盤上使用。" }; },
        use() { }
    },

    // === 煉丹/煉器素材 (商店販售) ===
    herb_low: {
        id: "herb_low",
        name: "下品靈草",
        type: "material",
        rarity: "white",
        desc: "最常見的入門靈草，常用於低階回氣、止血丹藥。",
        shop: { isShopItem: true, price: 5, maxBuy: 999, category: "煉丹素材" }
    },
    herb_mid: {
        id: "herb_mid",
        name: "中品靈草",
        type: "material",
        rarity: "green",
        desc: "靈氣較為充足的靈草，藥效比下品好上許多。",
        shop: { isShopItem: true, price: 20, maxBuy: 100, category: "煉丹素材" }
    },
    herb_ancient: {
        id: "herb_ancient",
        name: "千年靈草",
        type: "material",
        rarity: "purple",
        desc: "生長千年的靈草，藥力澎湃，極為珍貴。",
        shop: { isShopItem: true, price: 200, maxBuy: 5, category: "煉丹素材" }
    },
    ore_iron: {
        id: "ore_iron",
        name: "玄鐵礦",
        type: "material",
        rarity: "white",
        desc: "常見礦石，比凡鐵堅硬，煉器基礎材料。",
        shop: { isShopItem: true, price: 10, maxBuy: 999, category: "煉丹素材" }
    },
    ore_spirit: {
        id: "ore_spirit",
        name: "靈礦石",
        type: "material",
        rarity: "green",
        desc: "內含靈力的礦石，適合煉製入階法器。",
        shop: { isShopItem: true, price: 40, maxBuy: 50, category: "煉丹素材" }
    },
    beast_fang: {
        id: "beast_fang",
        name: "妖獸獠牙",
        type: "material",
        rarity: "white",
        desc: "妖獸的利齒，研磨後可入藥或煉器。",
        shop: { isShopItem: true, price: 15, maxBuy: 999, category: "煉丹素材" }
    },
    beast_pelt: {
        id: "beast_pelt",
        name: "靈獸皮",
        type: "material",
        rarity: "green",
        desc: "帶有靈氣的獸皮，防禦丹藥的常用輔材。",
        shop: { isShopItem: true, price: 30, maxBuy: 50, category: "煉丹素材" }
    },
    demon_core: {
        id: "demon_core",
        name: "妖丹碎片",
        type: "material",
        rarity: "blue",
        desc: "妖獸內丹的碎片，蘊含強大能量。",
        shop: { isShopItem: true, price: 300, maxBuy: 10, category: "煉丹素材" }
    },
    talisman_paper: {
        id: "talisman_paper",
        name: "靈符紙",
        type: "material",
        rarity: "white",
        desc: "特製符紙，繪製符籙的基礎材料。",
        shop: { isShopItem: true, price: 5, maxBuy: 999, category: "煉丹素材" }
    },
    cold_essence: {
        id: "cold_essence",
        name: "寒潭精華",
        type: "material",
        rarity: "blue",
        desc: "寒氣逼人，可用於煉製特殊定心丹藥。",
        shop: { isShopItem: true, price: 150, maxBuy: 10, category: "煉丹素材" }
    },

    // === 一至九品真元丹（固定數值回復） ===
    pill_rank_1: {
        id: "pill_rank_1",
        name: "一品真元丹",
        type: "pill",
        rarity: "white",
        desc: "回復 500 點真氣。",
        lore: "入門修士常用的補氣丹藥，色澤灰白。",
        autoConsume: true,
        autoUseOnGain: false,
        use(state) {
            const gain = 500;
            state.qi += gain;
            maybeLog(`你服用一品真元丹，真氣恢復了 ${gain} 點。`, "event");
            toast(`真氣 +${gain}`, "success");
        }
    },
    pill_rank_2: {
        id: "pill_rank_2",
        name: "二品真元丹",
        type: "pill",
        rarity: "white",
        desc: "回復 1,500 點真氣。",
        lore: "比一品丹藥藥力更純，適合練氣中期修士。",
        autoConsume: true,
        autoUseOnGain: false,
        use(state) {
            const gain = 1500;
            state.qi += gain;
            maybeLog(`你服用二品真元丹，真氣恢復了 ${gain} 點。`, "event");
            toast(`真氣 +${gain}`, "success");
        }
    },
    pill_rank_3: {
        id: "pill_rank_3",
        name: "三品真元丹",
        type: "pill",
        rarity: "green",
        desc: "回復 5,000 點真氣。",
        lore: "泛著淡淡綠光，藥力充沛。",
        autoConsume: true,
        autoUseOnGain: false,
        use(state) {
            const gain = 5000;
            state.qi += gain;
            maybeLog(`你服用三品真元丹，真氣恢復了 ${gain} 點。`, "event");
            toast(`真氣 +${gain}`, "success");
        }
    },
    pill_rank_4: {
        id: "pill_rank_4",
        name: "四品真元丹",
        type: "pill",
        rarity: "green",
        desc: "回復 15,000 點真氣。",
        lore: "築基期修士亦視為珍寶的丹藥。",
        autoConsume: true,
        autoUseOnGain: false,
        use(state) {
            const gain = 15000;
            state.qi += gain;
            maybeLog(`你服用四品真元丹，真氣恢復了 ${gain} 點。`, "event");
            toast(`真氣 +${gain}`, "success");
        }
    },
    pill_rank_5: {
        id: "pill_rank_5",
        name: "五品真元丹",
        type: "pill",
        rarity: "blue",
        desc: "回復 50,000 點真氣。",
        lore: "色澤湛藍，蘊含驚人靈氣。",
        autoConsume: true,
        autoUseOnGain: false,
        use(state) {
            const gain = 50000;
            state.qi += gain;
            maybeLog(`你服用五品真元丹，真氣恢復了 ${gain} 點。`, "event");
            toast(`真氣 +${gain}`, "success");
        }
    },
    pill_rank_6: {
        id: "pill_rank_6",
        name: "六品真元丹",
        type: "pill",
        rarity: "blue",
        desc: "回復 150,000 點真氣。",
        lore: "金丹真人服之亦能瞬間回滿真元。",
        autoConsume: true,
        autoUseOnGain: false,
        use(state) {
            const gain = 150000;
            state.qi += gain;
            maybeLog(`你服用六品真元丹，真氣恢復了 ${gain} 點。`, "event");
            toast(`真氣 +${gain}`, "success");
        }
    },
    pill_rank_7: {
        id: "pill_rank_7",
        name: "七品真元丹",
        type: "pill",
        rarity: "purple",
        desc: "回復 500,000 點真氣。",
        lore: "紫氣東來，丹成異象，此乃地階靈丹。",
        autoConsume: true,
        autoUseOnGain: false,
        use(state) {
            const gain = 500000;
            state.qi += gain;
            maybeLog(`你服用七品真元丹，真氣恢復了 ${gain} 點。`, "event");
            toast(`真氣 +${gain}`, "success");
        }
    },
    pill_rank_8: {
        id: "pill_rank_8",
        name: "八品真元丹",
        type: "pill",
        rarity: "purple",
        desc: "回復 1,500,000 點真氣。",
        lore: "藥力磅礴如海，非元嬰以上不可輕服。",
        autoConsume: true,
        autoUseOnGain: false,
        use(state) {
            const gain = 1500000;
            state.qi += gain;
            maybeLog(`你服用八品真元丹，真氣恢復了 ${gain} 點。`, "event");
            toast(`真氣 +${gain}`, "success");
        }
    },
    pill_rank_9: {
        id: "pill_rank_9",
        name: "九品帝丹",
        type: "pill",
        rarity: "orange",
        desc: "回復 5,000,000 點真氣。",
        lore: "天階極品，丹成引來九天雷劫，服之可通仙籍。",
        autoConsume: true,
        autoUseOnGain: false,
        use(state) {
            const gain = 5000000;
            state.qi += gain;
            maybeLog(`你服用九品帝丹，體內真元如星河倒灌！（+${gain}）`, "great-event");
            toast(`真氣 +${gain}`, "success");
        }
    }

};


window.ItemDB = ItemDB;

// =============================
//   工具：取得物品定義
// =============================
function getItemDef(id) {
    let def = ItemDB[id];
    if (!def && typeof window.getMaterialDef === "function") {
        def = window.getMaterialDef(id);
    }
    return def || null;
}
window.getItemDef = getItemDef;
window.ItemDB = ItemDB;
// =============================
//   背包系統（統一用 gameState）
// =============================
// grantItem logic fix
function ensureInventory() {
    // inventory is in state
    if (!window.state) return; // Safety check
    if (!Array.isArray(window.state.inventory)) {
        window.state.inventory = [];
    }
}

function grantItem(id, count = 1, ctx = {}) {
    const def = getItemDef(id);
    if (!def) return;

    ensureInventory();

    // 🔹 自動使用
    if (def.autoUseOnGain) {
        for (let i = 0; i < count; i++) {
            if (typeof def.use === "function") {
                // Pass window.state as state
                def.use(window.state, ctx);
            }
        }
        return;
    }

    // 🔹 平常情況 → 進背包
    const inv = window.state.inventory;
    let item = inv.find(i => i.id === id);
    if (!item) {
        inv.push({ id, count });
    } else {
        item.count += count;
    }

    // 提示
    toast(`獲得 ${def.name} x${count}`, "success");
}

window.grantItem = grantItem;
window.addItem = grantItem;

function useItemFromInventory(id) {
    ensureInventory();
    const inv = state.inventory;
    const item = inv.find(i => i.id === id);
    if (!item) return;

    const def = getItemDef(id);
    if (!def || typeof def.use !== "function") return;

    // 使用物品 → 操作 gameState (now window.state)
    def.use(window.state);

    // 數量 -1，沒了就刪
    item.count -= 1;
    if (item.count <= 0) {
        inv.splice(inv.indexOf(item), 1);
    }

    // 重新畫 UI / 背包
    if (window.renderInventory) renderInventory();
    if (window.renderUI) renderUI();
}

window.useItemFromInventory = useItemFromInventory;

// =============================
//   裝備系統 (Equipment System)
// =============================

/**
 * 穿戴裝備
 * @param {string} itemId 物品ID
 */
function equipItem(itemId) {
    ensureInventory();
    const state = window.state;
    const inv = state.inventory;

    // 1. 檢查背包有無此物
    const itemEntry = inv.find(i => i.id === itemId);
    if (!itemEntry) return;

    const def = getItemDef(itemId);
    if (!def) return;

    // 2. 獲取 Slot
    // 支持 def.slot 或 def.type 作為 slot 名稱
    let slot = def.slot;
    if (!slot) {
        // Fallback mapping
        const typeSlotMap = {
            "weapon": "weapon",
            "head": "head",
            "body": "body",
            "legs": "legs",
            "feet": "feet",
            "formation": "formation"
        };
        slot = typeSlotMap[def.type];
    }

    if (!slot) {
        toast("此物品無法裝備。", "warn");
        return;
    }

    // 確保 equipment 物件存在
    if (!state.equipment) state.equipment = {};

    // 3. 卸下舊裝備 (如果已裝備)
    const currentEquipId = state.equipment[slot];
    if (currentEquipId) {
        unequipItem(slot);
    }

    // 4. 裝備新物品
    state.equipment[slot] = itemId;

    // 5. 從背包移除 1 個
    itemEntry.count -= 1;
    if (itemEntry.count <= 0) {
        inv.splice(inv.indexOf(itemEntry), 1);
    }

    // 6. 重新計算數值
    recalcStats();

    // 7. UI 更新
    if (window.toast) toast(`已裝備：${def.name}`, "success");
    if (window.renderInventory) renderInventory();
    if (window.renderUI) renderUI();
}

/**
 * 卸下裝備
 * @param {string} slot 部位名稱 (head, body, etc.)
 */
function unequipItem(slot) {
    const state = window.state;
    if (!state.equipment) return;

    const itemId = state.equipment[slot];
    if (!itemId) return;

    // 1. 放回背包
    ensureInventory();
    const inv = state.inventory;
    const existing = inv.find(i => i.id === itemId);
    if (existing) {
        existing.count = (existing.count || 0) + 1;
    } else {
        inv.push({ id: itemId, count: 1 });
    }

    // 2. 清空欄位
    state.equipment[slot] = null;

    // 3. 重新計算
    recalcStats();

    // 4. UI 更新
    // if (window.toast) toast("已卸下裝備", "info");
    if (window.renderInventory) renderInventory();
    if (window.renderUI) renderUI();
}

/**
 * 重新計算裝備給予的屬性加成
 */
function recalcStats() {
    const state = window.state;

    // 確保 base 屬性存在 (初始化)
    if (typeof state.baseAttack === 'undefined') state.baseAttack = state.attack || 10;
    if (typeof state.baseDefense === 'undefined') state.baseDefense = state.defense || 5;
    if (typeof state.baseCritRate === 'undefined') state.baseCritRate = 0.05;
    if (typeof state.baseCritDmg === 'undefined') state.baseCritDmg = 0.5;
    if (typeof state.baseSpeed === 'undefined') state.baseSpeed = state.speed || 10;
    if (typeof state.baseMaxHp === 'undefined') state.baseMaxHp = state.maxHp || 100;

    // 裝備加成總和
    let bonusAttack = 0;
    let bonusDefense = 0;
    let bonusCritRate = 0;
    let bonusCritDmg = 0;
    let bonusSpeed = 0;
    let bonusHp = 0;

    if (state.equipment) {
        for (const slot in state.equipment) {
            const itemId = state.equipment[slot];
            if (!itemId) continue;

            const def = getItemDef(itemId);
            if (!def || !def.stats) continue;

            if (def.stats.attack) bonusAttack += def.stats.attack;
            if (def.stats.defense) bonusDefense += def.stats.defense;
            if (def.stats.critRate) bonusCritRate += def.stats.critRate;
            if (def.stats.critDmg) bonusCritDmg += def.stats.critDmg;
            if (def.stats.speed) bonusSpeed += def.stats.speed;
            if (def.stats.hp) bonusHp += def.stats.hp;
        }
    }

    // 應用數值
    state.attack = state.baseAttack + bonusAttack;
    state.defense = state.baseDefense + bonusDefense;
    state.critRate = state.baseCritRate + bonusCritRate;
    state.critDamage = state.baseCritDmg + bonusCritDmg;
    state.speed = state.baseSpeed + bonusSpeed;
    state.maxHp = state.baseMaxHp + bonusHp;

    console.log("Stats Recalculated:", {
        atk: state.attack,
        def: state.defense,
        crit: state.critRate,
        cdmg: state.critDamage,
        maxHp: state.maxHp
    });
}

window.equipItem = equipItem;
window.unequipItem = unequipItem;
window.recalcStats = recalcStats;
