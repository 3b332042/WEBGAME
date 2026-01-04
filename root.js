// root.js
// ===== 靈根 & 五行相關邏輯（不直接碰 DOM） =====

// 靈根說明（滑鼠移到靈根欄位用）
const RootExplain = {
    1: "天靈根：悟性極高、修煉速度最快。",
    2: "雙靈根：天賦優秀，修煉效率高。",
    3: "三靈根：普通體質，需要努力修煉。",
    4: "四靈根：天賦較差，修煉艱難。",
    5: "五靈根：最差體質，幾乎無法修仙。"
};

// 🔹 五行池（金木水火土）
const RootElementPool = ["金", "木", "水", "火", "土"];

// 🔹 五行互剋（金克木、木克土、土克水、水克火、火克金）
const ElementKeMap = {
    "金": "木",
    "木": "土",
    "土": "水",
    "水": "火",
    "火": "金"
};

// 反向表：被誰克
const ElementBeiKeMap = {};
for (const [atkElem, defElem] of Object.entries(ElementKeMap)) {
    ElementBeiKeMap[defElem] = atkElem;
}

// 根據攻擊屬性與目標屬性回傳倍率（之後打怪用）
// 克制：1.2，被克：0.8，其餘：1
function getElementRestraintMultiplier(attackerElem, defenderElem) {
    if (!attackerElem || !defenderElem) return 1.0;
    if (ElementKeMap[attackerElem] === defenderElem) return 1.2;    // 我克對方
    if (ElementBeiKeMap[attackerElem] === defenderElem) return 0.8; // 我被對方克
    return 1.0;
}

// ===== 靈根倍率 / 名稱 / 顏色 =====

// 靈根倍率（只用於內部計算）：天靈根 > 二靈根 > 三靈根 > 四靈根 > 五靈根（由快到慢）
function getRootMultiplier() {
    switch (state.rootCount) {
        case 1: return 6.0; // 天靈根
        case 2: return 4.5; // 二靈根
        case 3: return 3.0; // 三靈根
        case 4: return 1.5; // 四靈根
        default: return 0.8; // 五靈根
    }
}

// 顯示用名稱
function getRootName(rootCount) {
    switch (rootCount) {
        case 1: return "天靈根";
        case 2: return "二靈根";
        case 3: return "三靈根";
        case 4: return "四靈根";
        default: return "五靈根";
    }
}

// 依據靈根數量從五行抽出對應屬性，並設定主屬性攻擊
function assignRootElementsByRootCount(rootCount) {
    // 1 ~ 5 之間
    let count = parseInt(rootCount, 10);
    if (isNaN(count)) count = 1;
    count = Math.max(1, Math.min(count, RootElementPool.length));

    // 五靈根直接全拿（幾靈根就幾屬，5 就是五屬）
    if (count === RootElementPool.length) {
        state.rootElements = [...RootElementPool];
    } else {
        // 其餘情況：從五行中隨機抽 count 個，不重複
        const poolCopy = [...RootElementPool];

        // 洗牌
        for (let i = poolCopy.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [poolCopy[i], poolCopy[j]] = [poolCopy[j], poolCopy[i]];
        }

        state.rootElements = poolCopy.slice(0, count);
    }

    // 🔹 預設主屬性攻擊 = 第一個靈根
    state.elementAttack = state.rootElements[0] || null;
}

// 顯示用：把 rootElements 變成「金、木、火」這種字串
function getRootElementsText() {
    if (!Array.isArray(state.rootElements) || state.rootElements.length === 0) {
        return "尚未測出五行靈根。";
    }
    return `五行靈根屬性：${state.rootElements.join("、")}`;
}

// 靈根顏色：五靈根白、四靈根綠、三靈根藍、二靈根紫、天靈根橙
function getRootColorClass(rootCount) {
    switch (rootCount) {
        case 1: return "root-orange"; // 天靈根，最強
        case 2: return "root-purple";
        case 3: return "root-blue";
        case 4: return "root-green";
        default: return "root-white"; // 五靈根或其他
    }
}

// 屬性攻擊顯示：與當前靈根屬性一致，不顯示克屬
function getElementAttackDesc() {
    if (!Array.isArray(state.rootElements) || state.rootElements.length === 0) {
        return "無";
    }
    // 直接顯示「金、木」、「金、木、水」這種
    return state.rootElements.join("、");
}

// ===== 掛到全域，讓 main.js / 其他檔都穩定存取 =====
window.RootExplain = RootExplain;
window.RootElementPool = RootElementPool;
window.ElementKeMap = ElementKeMap;
window.ElementBeiKeMap = ElementBeiKeMap;

window.getElementRestraintMultiplier = getElementRestraintMultiplier;
window.getRootMultiplier = getRootMultiplier;
window.getRootName = getRootName;
window.assignRootElementsByRootCount = assignRootElementsByRootCount;
window.getRootElementsText = getRootElementsText;
window.getRootColorClass = getRootColorClass;
window.getElementAttackDesc = getElementAttackDesc;
