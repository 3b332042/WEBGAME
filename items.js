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

// 裝備品階映射表 (1-9品)
const EQUIPMENT_TIER_MAP = {
    // 武器
    iron_sword: 1, steel_sword: 2, bronze_sword: 3, cold_iron_sword: 4,
    mystic_sword: 5, spirit_sword: 6, flame_sword: 7, void_sword: 8, heaven_sword: 9,
    // 頭盔
    cloth_hat: 1, iron_helm: 2, bronze_helm: 3, steel_helm: 4,
    mystic_helm: 5, spirit_helm: 6, dragon_helm: 7, phoenix_helm: 8, heaven_helm: 9,
    // 胸甲
    cloth_robe: 1, leather_armor: 2, bronze_armor: 3, steel_armor: 4,
    mystic_armor: 5, spirit_armor: 6, dragon_armor: 7, phoenix_armor: 8, heaven_armor: 9,
    // 腿甲
    cloth_pants: 1, leather_pants: 2, bronze_pants: 3, steel_pants: 4,
    mystic_pants: 5, spirit_pants: 6, dragon_pants: 7, phoenix_pants: 8, heaven_pants: 9,
    // 鞋子
    cloth_shoes: 1, leather_boots: 2, bronze_boots: 3, steel_boots: 4,
    mystic_boots: 5, spirit_boots: 6, dragon_boots: 7, phoenix_boots: 8, heaven_boots: 9
};

// 獲取裝備品階
function getEquipmentTier(itemId) {
    return EQUIPMENT_TIER_MAP[itemId] || 0;
}
window.getEquipmentTier = getEquipmentTier;


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

    qi_pill_mega: {
        id: "qi_pill_mega",
        name: "太清丹",
        type: "pill",
        rarity: "purple",
        desc: "回復當前真氣上限 100%。",
        lore: "仙家秘傳丹方，藥力驚人。",
        autoConsume: true,
        autoUseOnGain: false,
        canUse(state) {
            return { ok: true };
        },
        use(state) {
            if (typeof getQiCapForLevel !== "function") return;
            const cap = getQiCapForLevel(state.realmLevel);
            state.qi = cap;
            maybeLog(`你服用太清丹，真氣完全恢復！`, "great-event");
            toast(`真氣完全恢復！`, "success");
        }
    },

    // === 突破輔助類丹藥 ===
    break_pill_small: {
        id: "break_pill_small",
        name: "破境丹",
        type: "pill",
        rarity: "white",
        desc: "使用後提升突破成功率 +5%（永久）。",
        lore: "輔助突破的基礎丹藥，可提升成功率。",
        autoConsume: true,
        autoUseOnGain: false,
        canUse(state) {
            return { ok: true };
        },
        use(state) {
            if (!state.breakBonus) state.breakBonus = 0;
            state.breakBonus += 0.05;
            maybeLog(`你服用破境丹，突破成功率永久 +5%！`, "great-event");
            toast(`突破成功率 +5%！`, "success");
        }
    },

    break_pill_mid: {
        id: "break_pill_mid",
        name: "護脈丹",
        type: "pill",
        rarity: "green",
        desc: "使用後提升突破成功率 +10%（永久）。",
        lore: "保護經脈，大幅提升突破成功率。",
        autoConsume: true,
        autoUseOnGain: false,
        canUse(state) {
            return { ok: true };
        },
        use(state) {
            if (!state.breakBonus) state.breakBonus = 0;
            state.breakBonus += 0.10;
            maybeLog(`你服用護脈丹，突破成功率永久 +10%！`, "great-event");
            toast(`突破成功率 +10%！`, "success");
        }
    },

    break_pill_large: {
        id: "break_pill_large",
        name: "天心丹",
        type: "pill",
        rarity: "purple",
        desc: "使用後提升突破成功率 +20%（永久）。",
        lore: "天心無垢，道心堅定，突破如履平地。",
        autoConsume: true,
        autoUseOnGain: false,
        canUse(state) {
            return { ok: true };
        },
        use(state) {
            if (!state.breakBonus) state.breakBonus = 0;
            state.breakBonus += 0.20;
            maybeLog(`你服用天心丹，突破成功率永久 +20%！`, "great-event");
            toast(`突破成功率 +20%！`, "success");
        }
    },

    // === 悟性/心境類丹藥 ===
    mind_pill: {
        id: "mind_pill",
        name: "靜心丹",
        type: "pill",
        rarity: "green",
        desc: "使用後心境 +10（永久）。",
        lore: "凝神靜氣，心如止水。",
        autoConsume: true,
        autoUseOnGain: false,
        canUse(state) {
            return { ok: true };
        },
        use(state) {
            state.mindset += 10;
            maybeLog(`你服用靜心丹，心境提升了 10 點！`, "great-event");
            toast(`心境 +10！`, "success");
        }
    },

    comp_tea: {
        id: "comp_tea",
        name: "悟道靈茶",
        type: "pill",
        rarity: "green",
        desc: "使用後悟性 +5（永久）。",
        lore: "以靈草煮茶，飲後悟性大增。",
        autoConsume: true,
        autoUseOnGain: false,
        canUse(state) {
            return { ok: true };
        },
        use(state) {
            state.comprehension += 5;
            maybeLog(`你飲用悟道靈茶，悟性提升了 5 點！`, "great-event");
            toast(`悟性 +5！`, "success");
        }
    },

    soul_pill: {
        id: "soul_pill",
        name: "養魂丹",
        type: "pill",
        rarity: "purple",
        desc: "使用後悟性 +10（永久）。",
        lore: "滋養神魂，開啟靈智。",
        autoConsume: true,
        autoUseOnGain: false,
        canUse(state) {
            return { ok: true };
        },
        use(state) {
            state.comprehension += 10;
            maybeLog(`你服用養魂丹，悟性大幅提升了 10 點！`, "great-event");
            toast(`悟性 +10！`, "success");
        }
    },

    // === 壽元類丹藥 ===
    longevity_pill_small: {
        id: "longevity_pill_small",
        name: "延壽丹",
        type: "pill",
        rarity: "green",
        desc: "使用後壽元 +50年。",
        lore: "延年益壽，增加陽壽。",
        autoConsume: true,
        autoUseOnGain: false,
        canUse(state) {
            return { ok: true };
        },
        use(state) {
            state.lifespan += 50;
            maybeLog(`你服用延壽丹，壽元增加了 50 年！`, "great-event");
            toast(`壽元 +50年！`, "success");
        }
    },

    longevity_pill_mid: {
        id: "longevity_pill_mid",
        name: "長生丹",
        type: "pill",
        rarity: "blue",
        desc: "使用後壽元 +100年。",
        lore: "長生久視，壽比南山。",
        autoConsume: true,
        autoUseOnGain: false,
        canUse(state) {
            return { ok: true };
        },
        use(state) {
            state.lifespan += 100;
            maybeLog(`你服用長生丹，壽元增加了 100 年！`, "great-event");
            toast(`壽元 +100年！`, "success");
        }
    },

    longevity_pill_large: {
        id: "longevity_pill_large",
        name: "壽與天齊丹",
        type: "pill",
        rarity: "purple",
        desc: "使用後壽元 +200年。",
        lore: "與天同壽，與地同庚。",
        autoConsume: true,
        autoUseOnGain: false,
        canUse(state) {
            return { ok: true };
        },
        use(state) {
            state.lifespan += 200;
            maybeLog(`你服用壽與天齊丹，壽元大幅增加了 200 年！`, "great-event");
            toast(`壽元 +200年！`, "success");
        }
    },

    // =============================
    // === 符籙系統（永久增加戰鬥屬性）===
    // =============================

    // === 攻擊類符籙 ===
    attack_talisman_1: {
        id: "attack_talisman_1",
        name: "煉體符",
        type: "talisman",
        rarity: "white",
        desc: "使用後永久攻擊 +5。",
        lore: "基礎的煉體符籙，可強化肉身。",
        autoConsume: true,
        autoUseOnGain: false,
        canUse(state) {
            return { ok: true };
        },
        use(state) {
            state.attack = (state.attack || 0) + 5;
            maybeLog(`你使用煉體符，攻擊力永久提升 5 點！`, "great-event");
            toast(`攻擊 +5！`, "success");
        }
    },

    attack_talisman_2: {
        id: "attack_talisman_2",
        name: "霸體符",
        type: "talisman",
        rarity: "white",
        desc: "使用後永久攻擊 +10。",
        lore: "霸體之力，力拔山兮。",
        autoConsume: true,
        autoUseOnGain: false,
        canUse(state) {
            return { ok: true };
        },
        use(state) {
            state.attack = (state.attack || 0) + 10;
            maybeLog(`你使用霸體符，攻擊力永久提升 10 點！`, "great-event");
            toast(`攻擊 +10！`, "success");
        }
    },

    attack_talisman_3: {
        id: "attack_talisman_3",
        name: "破甲符",
        type: "talisman",
        rarity: "green",
        desc: "使用後永久攻擊 +20。",
        lore: "破甲之力，無堅不摧。",
        autoConsume: true,
        autoUseOnGain: false,
        canUse(state) {
            return { ok: true };
        },
        use(state) {
            if (!state.baseStats) state.baseStats = {};
            if (!state.baseStats.attack) state.baseStats.attack = 0;
            state.baseStats.attack += 20;
            maybeLog(`你使用破甲符，攻擊力永久提升 20 點！`, "great-event");
            toast(`攻擊 +20！`, "success");
        }
    },

    attack_talisman_5: {
        id: "attack_talisman_5",
        name: "神力符",
        type: "talisman",
        rarity: "blue",
        desc: "使用後永久攻擊 +40。",
        lore: "神力加持，力大無窮。",
        autoConsume: true,
        autoUseOnGain: false,
        canUse(state) {
            return { ok: true };
        },
        use(state) {
            if (!state.baseStats) state.baseStats = {};
            if (!state.baseStats.attack) state.baseStats.attack = 0;
            state.baseStats.attack += 40;
            maybeLog(`你使用神力符，攻擊力永久提升 40 點！`, "great-event");
            toast(`攻擊 +40！`, "success");
        }
    },

    attack_talisman_7: {
        id: "attack_talisman_7",
        name: "天罡符",
        type: "talisman",
        rarity: "purple",
        desc: "使用後永久攻擊 +80。",
        lore: "天罡星力，威震八方。",
        autoConsume: true,
        autoUseOnGain: false,
        canUse(state) {
            return { ok: true };
        },
        use(state) {
            if (!state.baseStats) state.baseStats = {};
            if (!state.baseStats.attack) state.baseStats.attack = 0;
            state.baseStats.attack += 80;
            maybeLog(`你使用天罡符，攻擊力永久大幅提升 80 點！`, "great-event");
            toast(`攻擊 +80！`, "success");
        }
    },

    // === 防禦類符籙 ===
    defense_talisman_1: {
        id: "defense_talisman_1",
        name: "金剛符",
        type: "talisman",
        rarity: "white",
        desc: "使用後永久防禦 +5。",
        lore: "金剛護體，刀槍不入。",
        autoConsume: true,
        autoUseOnGain: false,
        canUse(state) {
            return { ok: true };
        },
        use(state) {
            state.defense = (state.defense || 0) + 5;
            maybeLog(`你使用金剛符，防禦力永久提升 5 點！`, "great-event");
            toast(`防禦 +5！`, "success");
        }
    },

    defense_talisman_2: {
        id: "defense_talisman_2",
        name: "不壞符",
        type: "talisman",
        rarity: "white",
        desc: "使用後永久防禦 +10。",
        lore: "不壞金身，萬法不侵。",
        autoConsume: true,
        autoUseOnGain: false,
        canUse(state) {
            return { ok: true };
        },
        use(state) {
            if (!state.baseStats) state.baseStats = {};
            if (!state.baseStats.defense) state.baseStats.defense = 0;
            state.baseStats.defense += 10;
            maybeLog(`你使用不壞符，防禦力永久提升 10 點！`, "great-event");
            toast(`防禦 +10！`, "success");
        }
    },

    defense_talisman_3: {
        id: "defense_talisman_3",
        name: "護體符",
        type: "talisman",
        rarity: "green",
        desc: "使用後永久防禦 +20。",
        lore: "護體神光，堅不可摧。",
        autoConsume: true,
        autoUseOnGain: false,
        canUse(state) {
            return { ok: true };
        },
        use(state) {
            if (!state.baseStats) state.baseStats = {};
            if (!state.baseStats.defense) state.baseStats.defense = 0;
            state.baseStats.defense += 20;
            maybeLog(`你使用護體符，防禦力永久提升 20 點！`, "great-event");
            toast(`防禦 +20！`, "success");
        }
    },

    defense_talisman_5: {
        id: "defense_talisman_5",
        name: "玄武符",
        type: "talisman",
        rarity: "blue",
        desc: "使用後永久防禦 +40。",
        lore: "玄武護佑，固若金湯。",
        autoConsume: true,
        autoUseOnGain: false,
        canUse(state) {
            return { ok: true };
        },
        use(state) {
            if (!state.baseStats) state.baseStats = {};
            if (!state.baseStats.defense) state.baseStats.defense = 0;
            state.baseStats.defense += 40;
            maybeLog(`你使用玄武符，防禦力永久提升 40 點！`, "great-event");
            toast(`防禦 +40！`, "success");
        }
    },

    defense_talisman_7: {
        id: "defense_talisman_7",
        name: "無敵符",
        type: "talisman",
        rarity: "purple",
        desc: "使用後永久防禦 +80。",
        lore: "無敵之身，天下無雙。",
        autoConsume: true,
        autoUseOnGain: false,
        canUse(state) {
            return { ok: true };
        },
        use(state) {
            if (!state.baseStats) state.baseStats = {};
            if (!state.baseStats.defense) state.baseStats.defense = 0;
            state.baseStats.defense += 80;
            maybeLog(`你使用無敵符，防禦力永久大幅提升 80 點！`, "great-event");
            toast(`防禦 +80！`, "success");
        }
    },

    // === 速度類符籙 ===
    speed_talisman_1: {
        id: "speed_talisman_1",
        name: "神行符",
        type: "talisman",
        rarity: "white",
        desc: "使用後永久速度 +2。",
        lore: "神行千里，日行八百。",
        autoConsume: true,
        autoUseOnGain: false,
        canUse(state) {
            return { ok: true };
        },
        use(state) {
            state.speed = (state.speed || 0) + 2;
            maybeLog(`你使用神行符，速度永久提升 2 點！`, "great-event");
            toast(`速度 +2！`, "success");
        }
    },

    speed_talisman_3: {
        id: "speed_talisman_3",
        name: "御風符",
        type: "talisman",
        rarity: "green",
        desc: "使用後永久速度 +5。",
        lore: "御風而行，身輕如燕。",
        autoConsume: true,
        autoUseOnGain: false,
        canUse(state) {
            return { ok: true };
        },
        use(state) {
            if (!state.baseStats) state.baseStats = {};
            if (!state.baseStats.speed) state.baseStats.speed = 0;
            state.baseStats.speed += 5;
            maybeLog(`你使用御風符，速度永久提升 5 點！`, "great-event");
            toast(`速度 +5！`, "success");
        }
    },

    speed_talisman_5: {
        id: "speed_talisman_5",
        name: "縮地符",
        type: "talisman",
        rarity: "blue",
        desc: "使用後永久速度 +10。",
        lore: "縮地成寸，瞬息千里。",
        autoConsume: true,
        autoUseOnGain: false,
        canUse(state) {
            return { ok: true };
        },
        use(state) {
            if (!state.baseStats) state.baseStats = {};
            if (!state.baseStats.speed) state.baseStats.speed = 0;
            state.baseStats.speed += 10;
            maybeLog(`你使用縮地符，速度永久提升 10 點！`, "great-event");
            toast(`速度 +10！`, "success");
        }
    },

    speed_talisman_7: {
        id: "speed_talisman_7",
        name: "瞬移符",
        type: "talisman",
        rarity: "purple",
        desc: "使用後永久速度 +20。",
        lore: "瞬息移形，來去無蹤。",
        autoConsume: true,
        autoUseOnGain: false,
        canUse(state) {
            return { ok: true };
        },
        use(state) {
            if (!state.baseStats) state.baseStats = {};
            if (!state.baseStats.speed) state.baseStats.speed = 0;
            state.baseStats.speed += 20;
            maybeLog(`你使用瞬移符，速度永久大幅提升 20 點！`, "great-event");
            toast(`速度 +20！`, "success");
        }
    },

    // === 暴擊類符籙 ===
    crit_talisman_2: {
        id: "crit_talisman_2",
        name: "破綻符",
        type: "talisman",
        rarity: "white",
        desc: "使用後永久暴擊率 +5%。",
        lore: "洞察破綻，一擊必殺。",
        autoConsume: true,
        autoUseOnGain: false,
        canUse(state) {
            return { ok: true };
        },
        use(state) {
            state.critRate = (state.critRate || 0) + 0.05;
            maybeLog(`你使用破綻符，暴擊率永久提升 5%！`, "great-event");
            toast(`暴擊率 +5%！`, "success");
        }
    },

    crit_talisman_4: {
        id: "crit_talisman_4",
        name: "致命符",
        type: "talisman",
        rarity: "green",
        desc: "使用後永久暴擊率 +10%。",
        lore: "致命一擊，無人能擋。",
        autoConsume: true,
        autoUseOnGain: false,
        canUse(state) {
            return { ok: true };
        },
        use(state) {
            if (!state.baseStats) state.baseStats = {};
            if (!state.baseStats.critRate) state.baseStats.critRate = 0;
            state.baseStats.critRate += 0.10;
            maybeLog(`你使用致命符，暴擊率永久提升 10%！`, "great-event");
            toast(`暴擊率 +10%！`, "success");
        }
    },

    crit_dmg_talisman: {
        id: "crit_dmg_talisman",
        name: "爆發符",
        type: "talisman",
        rarity: "blue",
        desc: "使用後永久暴擊傷害 +30%。",
        lore: "爆發之力，摧枯拉朽。",
        autoConsume: true,
        autoUseOnGain: false,
        canUse(state) {
            return { ok: true };
        },
        use(state) {
            if (!state.baseStats) state.baseStats = {};
            if (!state.baseStats.critDamage) state.baseStats.critDamage = 0;
            state.baseStats.critDamage += 0.30;
            maybeLog(`你使用爆發符，暴擊傷害永久提升 30%！`, "great-event");
            toast(`暴擊傷害 +30%！`, "success");
        }
    },

    crit_talisman_8: {
        id: "crit_talisman_8",
        name: "必殺符",
        type: "talisman",
        rarity: "purple",
        desc: "使用後永久暴擊率 +20%，暴擊傷害 +50%。",
        lore: "必殺之術，一擊斃命。",
        autoConsume: true,
        autoUseOnGain: false,
        canUse(state) {
            return { ok: true };
        },
        use(state) {
            state.critRate = (state.critRate || 0.05) + 0.20;
            state.critDamage = (state.critDamage || 0.50) + 0.50;
            maybeLog(`你使用必殺符，暴擊率永久提升 20%，暴擊傷害永久提升 50%！`, "great-event");
            toast(`暴擊率 +20%，暴擊傷害 +50%！`, "success");
        }
    },

    // === 生命類符籙 ===
    hp_talisman_1: {
        id: "hp_talisman_1",
        name: "固元符",
        type: "talisman",
        rarity: "white",
        desc: "使用後永久最大生命 +50。",
        lore: "固本培元，延年益壽。",
        autoConsume: true,
        autoUseOnGain: false,
        canUse(state) {
            return { ok: true };
        },
        use(state) {
            state.maxHp = (state.maxHp || 100) + 50;
            state.hp = (state.hp || 100) + 50;
            maybeLog(`你使用固元符，最大生命永久提升 50 點！`, "great-event");
            toast(`最大生命 +50！`, "success");
        }
    },

    hp_talisman_3: {
        id: "hp_talisman_3",
        name: "生生符",
        type: "talisman",
        rarity: "green",
        desc: "使用後永久最大生命 +150。",
        lore: "生生不息，源源不絕。",
        autoConsume: true,
        autoUseOnGain: false,
        canUse(state) {
            return { ok: true };
        },
        use(state) {
            if (!state.baseStats) state.baseStats = {};
            if (!state.baseStats.maxHp) state.baseStats.maxHp = 0;
            state.baseStats.maxHp += 150;
            maybeLog(`你使用生生符，最大生命永久提升 150 點！`, "great-event");
            toast(`最大生命 +150！`, "success");
        }
    },

    hp_talisman_5: {
        id: "hp_talisman_5",
        name: "造化符",
        type: "talisman",
        rarity: "blue",
        desc: "使用後永久最大生命 +300。",
        lore: "造化之力，生機無限。",
        autoConsume: true,
        autoUseOnGain: false,
        canUse(state) {
            return { ok: true };
        },
        use(state) {
            if (!state.baseStats) state.baseStats = {};
            if (!state.baseStats.maxHp) state.baseStats.maxHp = 0;
            state.baseStats.maxHp += 300;
            maybeLog(`你使用造化符，最大生命永久提升 300 點！`, "great-event");
            toast(`最大生命 +300！`, "success");
        }
    },

    hp_talisman_7: {
        id: "hp_talisman_7",
        name: "不死符",
        type: "talisman",
        rarity: "purple",
        desc: "使用後永久最大生命 +600。",
        lore: "不死不滅，長生久視。",
        autoConsume: true,
        autoUseOnGain: false,
        canUse(state) {
            return { ok: true };
        },
        use(state) {
            if (!state.baseStats) state.baseStats = {};
            if (!state.baseStats.maxHp) state.baseStats.maxHp = 0;
            state.baseStats.maxHp += 600;
            maybeLog(`你使用不死符，最大生命永久大幅提升 600 點！`, "great-event");
            toast(`最大生命 +600！`, "success");
        }
    },

    // === 特殊符籙 ===
    luck_charm: {
        id: "luck_charm",
        name: "轉運符",
        type: "talisman",
        rarity: "white",
        desc: "使用後永久氣運 +10。",
        lore: "時來運轉，否極泰來。",
        autoConsume: true,
        autoUseOnGain: false,
        canUse(state) {
            return { ok: true };
        },
        use(state) {
            state.luck += 10;
            maybeLog(`你使用轉運符，氣運永久提升 10 點！`, "great-event");
            toast(`氣運 +10！`, "success");
        }
    },

    thunder_charm: {
        id: "thunder_charm",
        name: "九霄神雷符",
        type: "talisman",
        rarity: "orange",
        desc: "使用後永久全屬性 +50。",
        lore: "九霄神雷,威震天地。攻擊、防禦、速度、生命全面提升。",
        autoConsume: true,
        autoUseOnGain: false,
        canUse(state) {
            return { ok: true };
        },
        use(state) {
            if (!state.baseStats) state.baseStats = {};
            if (!state.baseStats.attack) state.baseStats.attack = 0;
            if (!state.baseStats.defense) state.baseStats.defense = 0;
            if (!state.baseStats.speed) state.baseStats.speed = 0;
            if (!state.baseStats.maxHp) state.baseStats.maxHp = 0;
            state.baseStats.attack += 50;
            state.baseStats.defense += 50;
            state.baseStats.speed += 10;
            state.baseStats.maxHp += 300;
            maybeLog(`你使用九霄神雷符,全屬性大幅提升!攻擊 +50,防禦 +50,速度 +10,生命 +300!`, "great-event");
            toast(`全屬性大幅提升!`, "success");
        }
    },

    // =============================
    // === 新增：9品符籙（2種）===
    // =============================

    yin_yang_talisman: {
        id: "yin_yang_talisman",
        name: "陰陽調和符",
        type: "talisman",
        rarity: "orange",
        desc: "使用後永久提升:攻擊 +100,防禦 +100。",
        lore: "陰陽調和,攻守兼備。以陰陽之道淬煉而成的至高符籙。",
        autoConsume: true,
        autoUseOnGain: false,
        canUse(state) {
            return { ok: true };
        },
        use(state) {
            if (!state.baseStats) state.baseStats = {};
            if (!state.baseStats.attack) state.baseStats.attack = 0;
            if (!state.baseStats.defense) state.baseStats.defense = 0;
            state.baseStats.attack += 100;
            state.baseStats.defense += 100;
            maybeLog(`你使用陰陽調和符,攻守兼備!攻擊 +100,防禦 +100!`, "great-event");
            toast(`攻守兼備!攻擊 +100,防禦 +100!`, "success");
        }
    },

    five_elements_talisman: {
        id: "five_elements_talisman",
        name: "五行精通符",
        type: "talisman",
        rarity: "orange",
        desc: "使用後永久提升:速度 +30,暴擊率 +15%,暴擊傷害 +50%。",
        lore: "五行相生相剋,精通五行之道,速度與暴擊大幅提升。",
        autoConsume: true,
        autoUseOnGain: false,
        canUse(state) {
            return { ok: true };
        },
        use(state) {
            if (!state.baseStats) state.baseStats = {};
            if (!state.baseStats.speed) state.baseStats.speed = 0;
            if (!state.baseStats.critRate) state.baseStats.critRate = 0;
            if (!state.baseStats.critDamage) state.baseStats.critDamage = 0;
            state.baseStats.speed += 30;
            state.baseStats.critRate += 0.15;
            state.baseStats.critDamage += 0.5;
            maybeLog(`你使用五行精通符,速度與暴擊大幅提升!速度 +30,暴擊率 +15%,暴擊傷害 +50%!`, "great-event");
            toast(`速度與暴擊大幅提升!`, "success");
        }
    },

    // =============================
    // === 新增：9品丹藥（2種）===
    // =============================

    immortal_essence_pill: {
        id: "immortal_essence_pill",
        name: "仙元丹",
        type: "pill",
        rarity: "orange",
        desc: "使用後真氣完全恢復，並永久提升真氣上限 10%。",
        lore: "仙家至寶，蘊含仙靈之氣。不僅恢復真氣，更能擴展丹田容量。",
        autoConsume: true,
        autoUseOnGain: false,
        canUse(state) {
            return { ok: true };
        },
        use(state) {
            if (typeof getQiCapForLevel !== "function") return;
            const cap = getQiCapForLevel(state.realmLevel);
            state.qi = cap; // 完全恢復

            // 永久提升真氣上限 10%
            if (!state.qiCapBonus) state.qiCapBonus = 0;
            state.qiCapBonus += 0.1;

            maybeLog(`你服用仙元丹，真氣完全恢復，真氣上限永久提升 10%！`, "great-event");
            toast(`真氣完全恢復，真氣上限 +10%！`, "success");
        }
    },

    nirvana_pill: {
        id: "nirvana_pill",
        name: "涅槃重生丹",
        type: "pill",
        rarity: "orange",
        desc: "使用後永久提升：突破成功率 +30%，壽元 +300年，悟性 +20。",
        lore: "鳳凰涅槃，浴火重生。服用此丹，如獲新生，資質大幅提升。",
        autoConsume: true,
        autoUseOnGain: false,
        canUse(state) {
            return { ok: true };
        },
        use(state) {
            if (!state.breakBonus) state.breakBonus = 0;
            state.breakBonus += 0.3;
            state.lifespan += 300;
            state.comprehension += 20;
            maybeLog(`你服用涅槃重生丹，如獲新生！突破成功率 +30%，壽元 +300年，悟性 +20！`, "great-event");
            toast(`涅槃重生！資質大幅提升！`, "success");
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
        image: "image/equipment/iron_sword.png",
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
        image: "image/equipment/steel_sword.png",
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
        image: "image/equipment/bronze_sword.png",
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
        image: "image/equipment/cold_iron_sword.png",
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
        image: "image/equipment/mystic_sword.png",
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
        image: "image/equipment/spirit_sword.png",
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
        image: "image/equipment/flame_sword.png",
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
        image: "image/equipment/void_sword.png",
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
        image: "image/equipment/heaven_sword.png",
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
        image: "image/equipment/cloth_hat.png",
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
        image: "image/equipment/iron_helm.png",
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
        image: "image/equipment/bronze_helm.png",
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
        image: "image/equipment/steel_helm.png",
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
        image: "image/equipment/mystic_helm.png",
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
        image: "image/equipment/spirit_helm.png",
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
        image: "image/equipment/dragon_helm.png",
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
        image: "image/equipment/phoenix_helm.png",
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
        image: "image/equipment/heaven_helm.png",
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
        image: "image/equipment/cloth_robe.png",
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
        image: "image/equipment/leather_armor.png",
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
        image: "image/equipment/bronze_armor.png",
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
        image: "image/equipment/steel_armor.png",
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
        image: "image/equipment/mystic_armor.png",
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
        image: "image/equipment/spirit_armor.png",
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
        image: "image/equipment/dragon_armor.png",
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
        image: "image/equipment/phoenix_armor.png",
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
        image: "image/equipment/heaven_armor.png",
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
        image: "image/equipment/cloth_pants.png",
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
        image: "image/equipment/leather_pants.png",
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
        image: "image/equipment/bronze_pants.png",
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
        image: "image/equipment/steel_pants.png",
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
        image: "image/equipment/mystic_pants.png",
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
        image: "image/equipment/spirit_pants.png",
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
        image: "image/equipment/dragon_pants.png",
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
        image: "image/equipment/phoenix_pants.png",
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
        image: "image/equipment/heaven_pants.png",
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
        image: "image/equipment/cloth_shoes.png",
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
        image: "image/equipment/leather_boots.png",
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
        image: "image/equipment/bronze_boots.png",
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
        image: "image/equipment/steel_boots.png",
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
        image: "image/equipment/mystic_boots.png",
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
        image: "image/equipment/spirit_boots.png",
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
        image: "image/equipment/dragon_boots.png",
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
        image: "image/equipment/phoenix_boots.png",
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
        image: "image/equipment/heaven_boots.png",
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
        shop: {
            isShopItem: true,
            price: 2000,
            maxBuy: 1,
            sort: 70,
            category: "四藝典籍"
        },
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
        shop: {
            isShopItem: true,
            price: 2000,
            maxBuy: 1,
            sort: 71,
            category: "四藝典籍"
        },
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
        shop: {
            isShopItem: true,
            price: 2000,
            maxBuy: 1,
            sort: 72,
            category: "四藝典籍"
        },
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
        shop: {
            isShopItem: true,
            price: 2000,
            maxBuy: 1,
            sort: 73,
            category: "四藝典籍"
        },
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
        image: "image/tech_green_bg.png",
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
            if (typeof renderUI === "function") renderUI();
        }
    },

    tech_xuan: {
        id: "tech_xuan",
        name: "玄階心法卷軸",
        type: "technique_scroll",
        rarity: "blue",
        image: "image/tech_blue_bg.png",
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
            if (typeof renderUI === "function") renderUI();
        }
    },

    tech_di: {
        id: "tech_di",
        name: "地階心法卷軸",
        type: "technique_scroll",
        rarity: "purple",
        image: "image/tech_purple_bg.png",
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
            if (typeof renderUI === "function") renderUI();
        }
    },

    tech_tian: {
        id: "tech_tian",
        name: "天階心法卷軸",
        type: "technique_scroll",
        rarity: "orange",
        image: "image/tech_orange_bg.png",
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
            if (typeof renderUI === "function") renderUI();
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
        // Store complete item information
        inv.push({
            id,
            name: def.name,
            type: def.type,
            rarity: def.rarity,
            desc: def.desc,
            tags: def.tags || [],
            count
        });
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

    // 7. 播放音效
    if (typeof SoundManager !== 'undefined') {
        // 頭盔使用專屬音效，其他裝備使用通用音效
        if (slot === 'head') {
            SoundManager.play('equipHelmet');
        } else {
            SoundManager.play('equipItem');
        }
    }

    // 8. UI 更新
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
