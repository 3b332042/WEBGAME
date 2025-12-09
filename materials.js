// materials.js
// ==========================
// 材料系統（煉丹 / 煉器通用）
// ==========================
//
// 功能：
//   - 定義所有「材料」資料（id / 名稱 / 稀有度 / 說明 / 用途）
//   - 提供 getMaterialDef(id) 查詢材料
//   - 提供 createMaterialItem(id, count) 生成背包用物件
//   - 提供 addMaterial(id, count) 直接加進背包 & 寫日誌
//   - 提供 getRandomMaterialByRarity(rarity) 讓歷練或戰鬥隨機掉落
//
// 依賴：
//   - gameState（state.js）
//   - addInventoryItem（inventory.js）
//   - addLog（main.js，可選）

// ===== 1. 稀有度常數 =====
// 你 CSS 已經有 rarity-white / green / blue / purple / orange
// 這裡的 key 主要是方便程式用
const MATERIAL_RARITY = {
    COMMON: "white",   // 普通
    UNCOMMON: "green", // 優質
    RARE: "blue",      // 稀有
    EPIC: "purple",    // 史詩
    LEGENDARY: "orange"// 傳說
};

// ===== 2. 材料資料庫 =====
//
// 之後要加新材料就直接在這裡多塞一個物件就好。
// type 一律先用 "material"，以後你可以再細分 "herb" / "ore" / "beast-part" 等。
const MATERIAL_DB = {
    // —— 妖獸相關材料 ——
    beast_fang: {
        id: "beast_fang",
        name: "妖獸獠牙",
        type: "material",
        rarity: MATERIAL_RARITY.COMMON,
        desc: "從低階妖獸身上拆下的獠牙，可作為煉器時的輔料，亦可研磨入藥。",
        tags: ["beast", "sharp"]
    },
    beast_pelt: {
        id: "beast_pelt",
        name: "靈獸皮",
        type: "material",
        rarity: MATERIAL_RARITY.UNCOMMON,
        desc: "略帶靈性氣息的獸皮，適合作為法袍、護具的材料。",
        tags: ["beast", "armor"]
    },
    demon_core: {
        id: "demon_core",
        name: "妖丹碎片",
        type: "material",
        rarity: MATERIAL_RARITY.RARE,
        desc: "強大妖獸死後遺留的內丹碎片，蘊藏濃郁妖力，是高階煉丹、煉器的關鍵材料。",
        tags: ["core", "power"]
    },

    // —— 試劍山 / 劍修相關 ——
    sword_shard: {
        id: "sword_shard",
        name: "殘缺劍鋒",
        type: "material",
        rarity: MATERIAL_RARITY.RARE,
        desc: "試劍山遺留的劍鋒殘片，依然留存著一絲鋒銳劍意，可用於強化武器。",
        tags: ["metal", "sword", "sharp"]
    },

    // —— 寒潭 / 冰屬性相關 ——
    cold_essence: {
        id: "cold_essence",
        name: "寒潭精華",
        type: "material",
        rarity: MATERIAL_RARITY.RARE,
        desc: "寒潭深處凝聚的冰寒之力，是煉製冰屬性丹藥或防禦法器的上好主材。",
        tags: ["cold", "water"]
    },

    // —— 草藥類（煉丹用） ——
    herb_low: {
        id: "herb_low",
        name: "下品靈草",
        type: "material",
        rarity: MATERIAL_RARITY.COMMON,
        desc: "最常見的入門靈草，常用於低階回氣、止血丹藥。",
        tags: ["herb"]
    },
    herb_mid: {
        id: "herb_mid",
        name: "中品靈草",
        type: "material",
        rarity: MATERIAL_RARITY.UNCOMMON,
        desc: "靈氣較為充足的靈草，可用於提升修煉效率的丹藥。",
        tags: ["herb"]
    },

    // —— 礦石類（煉器用） ——
    ore_iron: {
        id: "ore_iron",
        name: "玄鐵礦",
        type: "material",
        rarity: MATERIAL_RARITY.COMMON,
        desc: "常見礦石，比凡鐵堅硬，可作為低階兵器與護具的基礎材料。",
        tags: ["ore", "metal"]
    },
    ore_spirit: {
        id: "ore_spirit",
        name: "靈礦石",
        type: "material",
        rarity: MATERIAL_RARITY.UNCOMMON,
        desc: "內含靈力的礦石，鍛造成器時更容易承載陣紋與靈性。",
        tags: ["ore", "metal", "spirit"]
    },

    // —— 符紙類（之後可搭配符籙系統） ——
    talisman_paper: {
        id: "talisman_paper",
        name: "靈符紙",
        type: "material",
        rarity: MATERIAL_RARITY.COMMON,
        desc: "特製符紙，可承載靈力，適合畫出入門符籙。",
        tags: ["paper", "talisman"]
    },

    // —— 地階 (紫色) ——
    herb_ancient: {
        id: "herb_ancient",
        name: "千年靈草",
        type: "material",
        rarity: MATERIAL_RARITY.EPIC,
        desc: "生長千年的靈草，藥力澎湃，是煉製高階丹藥的必備主材。",
        tags: ["herb", "ancient"]
    },
    ore_divine: {
        id: "ore_divine",
        name: "玄鐵精",
        type: "material",
        rarity: MATERIAL_RARITY.EPIC,
        desc: "百斤玄鐵礦方能提煉出一斤的精華，堅硬無比。",
        tags: ["ore", "metal", "rare"]
    },

    // —— 天階 (橙色) ——
    herb_immortal: {
        id: "herb_immortal",
        name: "萬年仙草",
        type: "material",
        rarity: MATERIAL_RARITY.LEGENDARY,
        desc: "傳說中沾染了仙氣的靈草，有起死回生之效。",
        tags: ["herb", "immortal"]
    },
    ore_meteoric: {
        id: "ore_meteoric",
        name: "天外隕鐵",
        type: "material",
        rarity: MATERIAL_RARITY.LEGENDARY,
        desc: "來自天外的奇異金屬，蘊含著星辰之力。",
        tags: ["ore", "star", "legendary"]
    }
};

// ===== 3. 查詢材料定義 =====
function getMaterialDef(materialId) {
    return MATERIAL_DB[materialId] || null;
}

// ===== 4. 生成「背包用」材料物件 =====
//
// 回傳格式會長這樣：
// {
//   id, name, type: "material",
//   rarity, desc,
//   count
// }
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
        count
    };
}

// ===== 5. 直接加材料進背包 =====
//
// options.log: 是否寫入日誌（預設 true）
// options.source: 來源描述，例如 "妖獸林歷練"（可選）
function addMaterial(materialId, count = 1, options = {}) {
    const def = getMaterialDef(materialId);
    if (!def) return;

    const item = createMaterialItem(materialId, count);
    if (!item) return;

    if (typeof addInventoryItem === "function") {
        addInventoryItem(item);
    } else if (Array.isArray(state.inventory)) {
        // 保底：inventory.js 若未載入，直接塞進 inventory
        const inv = state.inventory;
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

// ===== 6. 依稀有度隨機抽一個材料 =====
//
// 例：getRandomMaterialByRarity("blue") → 從所有藍色材料裡抽一個
function getRandomMaterialByRarity(rarity) {
    const list = Object.values(MATERIAL_DB).filter(m => m.rarity === rarity);
    if (!list.length) return null;
    const idx = Math.floor(Math.random() * list.length);
    return list[idx];
}

// ===== 7. 從自訂權重池隨機抽一個材料 =====
//
// pool: [
//   { id: "beast_fang", weight: 60 },
//   { id: "beast_pelt", weight: 30 },
//   { id: "demon_core", weight: 10 }
// ]
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
