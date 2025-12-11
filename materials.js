// materials.js
// ==========================
// 材料系統（四藝通用）
// ==========================
// 結構：4藝 × (凡黃玄地各5種 + 天階1種) = 84種

const MATERIAL_RARITY = {
    COMMON: "white",
    UNCOMMON: "green",
    RARE: "blue",
    EPIC: "purple",
    LEGENDARY: "orange"
};

const MATERIAL_DB = {
    // ==========================================
    // 1. 煉丹 (Alchemy) - 藥草、靈果
    // ==========================================
    // --- 凡階 (White) ---
    pill_white_1: { id: "pill_white_1", name: "凝血草", type: "material", rarity: "white", desc: "常見的止血草藥，隨處可見。", tags: ["herb", "pill"], shop: { isShopItem: true, price: 100, category: "煉丹素材", sort: 1 } },
    pill_white_2: { id: "pill_white_2", name: "活氣果", type: "material", rarity: "white", desc: "含有微量靈氣的野果。", tags: ["fruit", "pill"], shop: { isShopItem: true, price: 100, category: "煉丹素材", sort: 2 } },
    pill_white_3: { id: "pill_white_3", name: "清晨露", type: "material", rarity: "white", desc: "清晨採集的露水，潔淨無暇。", tags: ["liquid", "pill"], shop: { isShopItem: true, price: 100, category: "煉丹素材", sort: 3 } },
    pill_white_4: { id: "pill_white_4", name: "伴妖草", type: "material", rarity: "white", desc: "常生長在低階妖獸巢穴旁的草。", tags: ["herb", "pill"], shop: { isShopItem: true, price: 100, category: "煉丹素材", sort: 4 } },
    pill_white_5: { id: "pill_white_5", name: "乾枯樹根", type: "material", rarity: "white", desc: "普通的樹根，有些許藥用價值。", tags: ["wood", "pill"], shop: { isShopItem: true, price: 100, category: "煉丹素材", sort: 5 } },

    // --- 黃階 (Green) ---
    pill_green_1: { id: "pill_green_1", name: "靈芝", type: "material", rarity: "green", desc: "百年生長的靈芝，固本培元。", tags: ["herb", "pill"] },
    pill_green_2: { id: "pill_green_2", name: "血蓮", type: "material", rarity: "green", desc: "色紅如血的蓮花，藥性剛猛。", tags: ["flower", "pill"] },
    pill_green_3: { id: "pill_green_3", name: "寒冰草", type: "material", rarity: "green", desc: "生長在寒冷地帶，葉片結霜。", tags: ["herb", "pill", "cold"] },
    pill_green_4: { id: "pill_green_4", name: "烈焰果", type: "material", rarity: "green", desc: "火紅色的果實，入口灼熱。", tags: ["fruit", "pill", "fire"] },
    pill_green_5: { id: "pill_green_5", name: "清風藤", type: "material", rarity: "green", desc: "輕盈如風的藤蔓，有助氣血運行。", tags: ["wood", "pill"] },

    // --- 玄階 (Blue) ---
    pill_blue_1: { id: "pill_blue_1", name: "龍血草", type: "material", rarity: "blue", desc: "傳聞沾染稀薄龍血而生，強身健體。", tags: ["herb", "pill", "dragon"] },
    pill_blue_2: { id: "pill_blue_2", name: "星光露", type: "material", rarity: "blue", desc: "吸收夜晚星光凝聚的露珠。", tags: ["liquid", "pill", "star"] },
    pill_blue_3: { id: "pill_blue_3", name: "紫猴花", type: "material", rarity: "blue", desc: "長相奇特如猴臉的靈花，藥力強勁。", tags: ["flower", "pill"] },
    pill_blue_4: { id: "pill_blue_4", name: "天靈果", type: "material", rarity: "blue", desc: "結在懸崖峭壁上的靈果。", tags: ["fruit", "pill"] },
    pill_blue_5: { id: "pill_blue_5", name: "金銀花", type: "material", rarity: "blue", desc: "金銀雙色，調和陰陽。", tags: ["flower", "pill"] },

    // --- 地階 (Purple) ---
    pill_purple_1: { id: "pill_purple_1", name: "千年人參", type: "material", rarity: "purple", desc: "已具人形的千年老參，生死人肉白骨。", tags: ["herb", "pill", "ancient"] },
    pill_purple_2: { id: "pill_purple_2", name: "九曲靈芝", type: "material", rarity: "purple", desc: "九曲十八彎，每一曲都蘊含歲月之力。", tags: ["herb", "pill"] },
    pill_purple_3: { id: "pill_purple_3", name: "涅槃果", type: "material", rarity: "purple", desc: "浴火重生的果實，極難尋覓。", tags: ["fruit", "pill", "fire"] },
    pill_purple_4: { id: "pill_purple_4", name: "天山雪蓮", type: "material", rarity: "purple", desc: "山巔萬年積雪中綻放，純淨無垢。", tags: ["flower", "pill", "cold"] },
    pill_purple_5: { id: "pill_purple_5", name: "五行靈根", type: "material", rarity: "purple", desc: "匯聚五行之氣的極品靈根。", tags: ["root", "pill", "5elements"] },

    // --- 天階 (Orange) ---
    herb_immortal: { id: "herb_immortal", name: "萬年仙草", type: "material", rarity: "orange", desc: "傳說中沾染了仙氣的靈草，有起死回生之效。", tags: ["herb", "pill", "legendary"] },


    // ==========================================
    // 2. 煉器 (Weapon) - 礦石、獸骨
    // ==========================================
    // --- 凡階 (White) ---
    weapon_white_1: { id: "weapon_white_1", name: "鐵礦石", type: "material", rarity: "white", desc: "普通的鐵礦，含雜質較多。", tags: ["ore", "weapon"], shop: { isShopItem: true, price: 100, category: "煉器素材", sort: 6 } },
    weapon_white_2: { id: "weapon_white_2", name: "銅塊", type: "material", rarity: "white", desc: "普通的黃銅。", tags: ["metal", "weapon"], shop: { isShopItem: true, price: 100, category: "煉器素材", sort: 7 } },
    weapon_white_3: { id: "weapon_white_3", name: "獸骨", type: "material", rarity: "white", desc: "小獸的骨頭，質地尚可。", tags: ["bone", "weapon"], shop: { isShopItem: true, price: 100, category: "煉器素材", sort: 8 } },
    weapon_white_4: { id: "weapon_white_4", name: "細沙", type: "material", rarity: "white", desc: "經過篩選的細沙，用於打磨。", tags: ["stone", "weapon"], shop: { isShopItem: true, price: 100, category: "煉器素材", sort: 9 } },
    weapon_white_5: { id: "weapon_white_5", name: "杉木", type: "material", rarity: "white", desc: "普通的木材，可做劍柄。", tags: ["wood", "weapon"], shop: { isShopItem: true, price: 100, category: "煉器素材", sort: 10 } },

    // --- 黃階 (Green) ---
    weapon_green_1: { id: "weapon_green_1", name: "玄鐵", type: "material", rarity: "green", desc: "百煉成鋼，比凡鐵堅硬數倍。", tags: ["metal", "weapon"] },
    weapon_green_2: { id: "weapon_green_2", name: "赤銅", type: "material", rarity: "green", desc: "色澤赤紅的銅礦，導熱性佳。", tags: ["metal", "weapon", "fire"] },
    weapon_green_3: { id: "weapon_green_3", name: "妖狼牙", type: "material", rarity: "green", desc: "妖狼的獠牙，鋒利無比。", tags: ["bone", "weapon"] },
    weapon_green_4: { id: "weapon_green_4", name: "黑曜石", type: "material", rarity: "green", desc: "漆黑如墨的石頭，質地堅硬。", tags: ["stone", "weapon"] },
    weapon_green_5: { id: "weapon_green_5", name: "鐵木", type: "material", rarity: "green", desc: "堅硬如鐵的木材。", tags: ["wood", "weapon"] },

    // --- 玄階 (Blue) ---
    weapon_blue_1: { id: "weapon_blue_1", name: "寒鐵礦", type: "material", rarity: "blue", desc: "開採自極寒之地，自帶寒氣。", tags: ["metal", "weapon", "cold"] },
    weapon_blue_2: { id: "weapon_blue_2", name: "秘銀", type: "material", rarity: "blue", desc: "流動著銀光的金屬，延展性極佳。", tags: ["metal", "weapon"] },
    weapon_blue_3: { id: "weapon_blue_3", name: "金剛石", type: "material", rarity: "blue", desc: "世間最堅硬的石頭之一。", tags: ["stone", "weapon"] },
    weapon_blue_4: { id: "weapon_blue_4", name: "紫檀木", type: "material", rarity: "blue", desc: "千年紫檀，不腐不朽。", tags: ["wood", "weapon"] },
    weapon_blue_5: { id: "weapon_blue_5", name: "巨獸骨", type: "material", rarity: "blue", desc: "龐大妖獸的骨架精華。", tags: ["bone", "weapon"] },

    // --- 地階 (Purple) ---
    weapon_purple_1: { id: "weapon_purple_1", name: "庚金菁英", type: "material", rarity: "purple", desc: "五行之金的精華，無堅不摧。", tags: ["metal", "weapon"] },
    weapon_purple_2: { id: "weapon_purple_2", name: "萬年玄冰", type: "material", rarity: "purple", desc: "萬年不化的寒冰，可凍結神魂。", tags: ["ice", "weapon", "cold"] },
    weapon_purple_3: { id: "weapon_purple_3", name: "鳳凰骨", type: "material", rarity: "purple", desc: "疑似鳳凰遺骨，溫熱逼人。", tags: ["bone", "weapon", "fire"] },
    weapon_purple_4: { id: "weapon_purple_4", name: "星辰砂", type: "material", rarity: "purple", desc: "來自天外的星辰碎屑。", tags: ["stone", "weapon", "star"] },
    weapon_purple_5: { id: "weapon_purple_5", name: "雷擊神木", type: "material", rarity: "purple", desc: "經歷過九天雷劫的神木，蕴含天雷。", tags: ["wood", "weapon", "thunder"] },

    // --- 天階 (Orange) ---
    ore_meteoric: { id: "ore_meteoric", name: "天外隕鐵", type: "material", rarity: "orange", desc: "來自天外的奇異金屬，蘊含著星辰之力。", tags: ["ore", "weapon", "legendary"] },


    // ==========================================
    // 3. 符籙 (Talisman) - 紙、墨、媒材
    // ==========================================
    // --- 凡階 (White) ---
    talisman_white_1: { id: "talisman_white_1", name: "黃紙", type: "material", rarity: "white", desc: "最普通的道家黃紙。", tags: ["paper", "talisman"], shop: { isShopItem: true, price: 100, category: "符籙素材", sort: 11 } },
    talisman_white_2: { id: "talisman_white_2", name: "墨汁", type: "material", rarity: "white", desc: "普通的松煙墨。", tags: ["ink", "talisman"], shop: { isShopItem: true, price: 100, category: "符籙素材", sort: 12 } },
    talisman_white_3: { id: "talisman_white_3", name: "硃砂粉", type: "material", rarity: "white", desc: "少量的硃砂，可避小邪。", tags: ["dust", "talisman"], shop: { isShopItem: true, price: 100, category: "符籙素材", sort: 13 } },
    talisman_white_4: { id: "talisman_white_4", name: "狼毫筆", type: "material", rarity: "white", desc: "黃鼠狼毛製成的筆。", tags: ["brush", "talisman"], shop: { isShopItem: true, price: 100, category: "符籙素材", sort: 14 } },
    talisman_white_5: { id: "talisman_white_5", name: "清水", type: "material", rarity: "white", desc: "乾淨的河水，用於研墨。", tags: ["liquid", "talisman"], shop: { isShopItem: true, price: 100, category: "符籙素材", sort: 15 } },

    // --- 黃階 (Green) ---
    talisman_green_1: { id: "talisman_green_1", name: "靈符紙", type: "material", rarity: "green", desc: "在此紙上畫符，靈力不易消散。", tags: ["paper", "talisman"] },
    talisman_green_2: { id: "talisman_green_2", name: "靈墨", type: "material", rarity: "green", desc: "摻入了靈氣的墨汁。", tags: ["ink", "talisman"] },
    talisman_green_3: { id: "talisman_green_3", name: "精純硃砂", type: "material", rarity: "green", desc: "色澤鮮紅，陽氣十足。", tags: ["dust", "talisman"] },
    talisman_green_4: { id: "talisman_green_4", name: "桃木塊", type: "material", rarity: "green", desc: "百年桃木，天生辟邪。", tags: ["wood", "talisman"] },
    talisman_green_5: { id: "talisman_green_5", name: "獸血", type: "material", rarity: "green", desc: "低階妖獸的心頭血。", tags: ["liquid", "talisman"] },

    // --- 玄階 (Blue) ---
    talisman_blue_1: { id: "talisman_blue_1", name: "金粉", type: "material", rarity: "blue", desc: "黃金研磨成的細粉，貴重增靈。", tags: ["dust", "talisman"] },
    talisman_blue_2: { id: "talisman_blue_2", name: "妖狐血", type: "material", rarity: "blue", desc: "靈狐之血，擅長變幻類符籙。", tags: ["liquid", "talisman"] },
    talisman_blue_3: { id: "talisman_blue_3", name: "雷擊木心", type: "material", rarity: "blue", desc: "雷擊木最中心的一塊，焦黑帶電。", tags: ["wood", "talisman", "thunder"] },
    talisman_blue_4: { id: "talisman_blue_4", name: "玉符胚", type: "material", rarity: "blue", desc: "未雕琢的玉牌，可存儲更多靈力。", tags: ["jade", "talisman"] },
    talisman_blue_5: { id: "talisman_blue_5", name: "星光墨", type: "material", rarity: "blue", desc: "研磨時加入了星屑的墨汁。", tags: ["ink", "talisman"] },

    // --- 地階 (Purple) ---
    talisman_purple_1: { id: "talisman_purple_1", name: "金篆玉冊", type: "material", rarity: "purple", desc: "古代大能記載功德的玉冊碎片。", tags: ["jade", "talisman", "ancient"] },
    talisman_purple_2: { id: "talisman_purple_2", name: "蛟龍血", type: "material", rarity: "purple", desc: "蛟龍之血，蘊含風雨雷電之力。", tags: ["liquid", "talisman"] },
    talisman_purple_3: { id: "talisman_purple_3", name: "天蠶絲帛", type: "material", rarity: "purple", desc: "刀槍不入水火不侵的頂級符紙。", tags: ["cloth", "talisman"] },
    talisman_purple_4: { id: "talisman_purple_4", name: "虛空墨", type: "material", rarity: "purple", desc: "取自虛空獸的墨汁，無色無味。", tags: ["ink", "talisman"] },
    talisman_purple_5: { id: "talisman_purple_5", name: "聖人筆毫", type: "material", rarity: "purple", desc: "沾染過聖人氣息的筆毛。", tags: ["brush", "talisman"] },

    // --- 天階 (Orange) ---
    god_blood: { id: "god_blood", name: "真靈之血", type: "material", rarity: "orange", desc: "傳說中真靈（神獸）的心頭之血，蘊含法則之力，畫出的符籙威力無窮。", tags: ["blood", "talisman", "legendary"] },


    // ==========================================
    // 4. 陣法 (Formation) - 旗、盤、石
    // ==========================================
    // --- 凡階 (White) ---
    formation_white_1: { id: "formation_white_1", name: "石子", type: "material", rarity: "white", desc: "普通的石頭，可作陣眼。", tags: ["stone", "formation"], shop: { isShopItem: true, price: 100, category: "陣法素材", sort: 16 } },
    formation_white_2: { id: "formation_white_2", name: "木樁", type: "material", rarity: "white", desc: "普通的木檁，可作陣旗。", tags: ["wood", "formation"], shop: { isShopItem: true, price: 100, category: "陣法素材", sort: 17 } },
    formation_white_3: { id: "formation_white_3", name: "麻繩", type: "material", rarity: "white", desc: "粗糙的麻繩，可繫陣旗。", tags: ["cloth", "formation"], shop: { isShopItem: true, price: 100, category: "陣法素材", sort: 18 } },
    formation_white_4: { id: "formation_white_4", name: "砂土", type: "material", rarity: "white", desc: "普通的土壤，可劃陣紋。", tags: ["earth", "formation"], shop: { isShopItem: true, price: 100, category: "陣法素材", sort: 19 } },
    formation_white_5: { id: "formation_white_5", name: "木炭", type: "material", rarity: "white", desc: "普通的木炭，可作陣筆。", tags: ["wood", "formation"], shop: { isShopItem: true, price: 100, category: "陣法素材", sort: 20 } },

    // --- 黃階 (Green) ---
    formation_green_1: { id: "formation_green_1", name: "靈陣盤", type: "material", rarity: "green", desc: "刻有基礎陣紋的圓盤。", tags: ["disk", "formation"] },
    formation_green_2: { id: "formation_green_2", name: "聚靈石", type: "material", rarity: "green", desc: "能緩慢聚集周圍靈氣的石頭。", tags: ["stone", "formation"] },
    formation_green_3: { id: "formation_green_3", name: "絲綢陣旗", type: "material", rarity: "green", desc: "絲綢製成，靈氣流暢。", tags: ["flag", "formation"] },
    formation_green_4: { id: "formation_green_4", name: "銀線", type: "material", rarity: "green", desc: "秘銀拉成的線，傳導性佳。", tags: ["metal", "formation"] },
    formation_green_5: { id: "formation_green_5", name: "玉樁", type: "material", rarity: "green", desc: "玉石打磨的陣樁。", tags: ["jade", "formation"] },

    // --- 玄階 (Blue) ---
    formation_blue_1: { id: "formation_blue_1", name: "星辰石", type: "material", rarity: "blue", desc: "吸收了星光精華的奇石，呼應星象。", tags: ["stone", "formation", "star"] },
    formation_blue_2: { id: "formation_blue_2", name: "五行旗", type: "material", rarity: "blue", desc: "五面一組，對應五行方位。", tags: ["flag", "formation"] },
    formation_blue_3: { id: "formation_blue_3", name: "陣盤核心", type: "material", rarity: "blue", desc: "陣盤最中間的驅動核心。", tags: ["core", "formation"] },
    formation_blue_4: { id: "formation_blue_4", name: "空靈晶", type: "material", rarity: "blue", desc: "略帶空間屬性的晶體。", tags: ["crystal", "formation"] },
    formation_blue_5: { id: "formation_blue_5", name: "地脈引", type: "material", rarity: "blue", desc: "可引動地底靈脈的特殊法器。", tags: ["artifact", "formation"] },

    // --- 地階 (Purple) ---
    formation_purple_1: { id: "formation_purple_1", name: "界石", type: "material", rarity: "purple", desc: "蘊含空間之力的奇石，穩定陣法空間。", tags: ["stone", "formation", "space"] },
    formation_purple_2: { id: "formation_purple_2", name: "混沌石", type: "material", rarity: "purple", desc: "一片混沌，不分五行。", tags: ["stone", "formation"] },
    formation_purple_3: { id: "formation_purple_3", name: "仙陣盤", type: "material", rarity: "purple", desc: "足以承載仙階陣法的陣盤。", tags: ["disk", "formation"] },
    formation_purple_4: { id: "formation_purple_4", name: "星核", type: "material", rarity: "purple", desc: "恆星熄滅後留下的核心，重若千鈞。", tags: ["core", "formation", "star"] },
    formation_purple_5: { id: "formation_purple_5", name: "鎮龍樁", type: "material", rarity: "purple", desc: "傳說可鎮壓龍脈的神樁。", tags: ["artifact", "formation"] },

    // --- 天階 (Orange) ---
    void_jade: { id: "void_jade", name: "太虛神玉", type: "material", rarity: "orange", desc: "產自虛空深處的神玉，天生銘刻大道道紋，是佈置絕世大陣的核心。", tags: ["jade", "formation", "legendary"] }
};

// ==========================================
// 共用邏輯 (保持不變)
// ==========================================
function getMaterialDef(materialId) {
    return MATERIAL_DB[materialId] || null;
}

function createMaterialItem(materialId, count = 1) {
    const def = getMaterialDef(materialId);
    if (!def) return null;
    if (count <= 0) count = 1;
    return {
        id: def.id,
        name: def.name,
        type: def.type,
        rarity: def.rarity,
        desc: def.desc,
        tags: def.tags || [],  // ← 添加 tags 屬性！
        count
    };
}

function addMaterial(materialId, count = 1, options = {}) {
    const def = getMaterialDef(materialId);
    if (!def) return;
    const item = createMaterialItem(materialId, count);
    if (!item) return;

    if (typeof addInventoryItem === "function") {
        addInventoryItem(item);
    } else if (window.state && Array.isArray(window.state.inventory)) {
        const inv = window.state.inventory;
        const existed = inv.find(i => i.id === item.id);
        if (existed) {
            existed.count = (existed.count || 1) + (item.count || 1);
        } else {
            inv.push(item);
        }
    }

    const doLog = options.log !== false;
    if (doLog && typeof addLog === "function") {
        const from = options.source ? `（來源：${options.source}）` : "";
        addLog(`獲得材料「${def.name}」×${count}${from}。`, "event");
    }
}

function getRandomMaterialByRarity(rarity) {
    const list = Object.values(MATERIAL_DB).filter(m => m.rarity === rarity);
    if (!list.length) return null;
    const idx = Math.floor(Math.random() * list.length);
    return list[idx];
}

function getRandomMaterialFromPool(pool) {
    if (!Array.isArray(pool) || pool.length === 0) return null;
    let totalWeight = 0;
    pool.forEach(p => {
        const w = typeof p.weight === "number" && p.weight > 0 ? p.weight : 0;
        totalWeight += w;
    });
    if (totalWeight <= 0) return null;
    let r = Math.random() * totalWeight;
    for (const p of pool) {
        const w = typeof p.weight === "number" && p.weight > 0 ? p.weight : 0;
        if (w <= 0) continue;
        if (r < w) {
            return getMaterialDef(p.id);
        }
        r -= w;
    }
    return null;
}

window.MATERIAL_DB = MATERIAL_DB;
window.getMaterialDef = getMaterialDef;
window.createMaterialItem = createMaterialItem;
window.addMaterial = addMaterial;
window.getRandomMaterialByRarity = getRandomMaterialByRarity;
window.getRandomMaterialFromPool = getRandomMaterialFromPool;
