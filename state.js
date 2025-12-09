// state.js
// ===== 遊戲狀態 (State Object 版) =====
// 應使用者要求，將所有狀態集中在 window.state 物件中

console.log("Initializing state.js...");

// ===== 1. 定義 State 物件 (預設值) =====
const defaultState = {
    name: "無名散修",
    age: 16,
    lifespan: 80,
    realmLevel: 1,
    qi: 0,
    qiCap: 0, // 之後初始化
    comprehension: 8,
    luck: 5,
    mindset: 5,
    breakBonus: 0,
    deathSubstitutes: 0,
    spiritStones: 100,
    log: [],
    techniqueTier: 0,
    ascended: false,

    // 靈根相關
    rootCount: 3,
    rootElements: [],
    elementAttack: null,
    learnedSkills: {}, // { skillId: proficiency }

    // 戰鬥相關
    attack: 10,
    defense: 5,
    critRate: 0.05,
    critDamage: 0.5,
    maxHp: 100,
    hp: 100,

    // 靈氣系統
    mana: 100,
    maxMana: 100,

    // 系統記錄
    lastSaveTime: 0,

    // 勢力相關
    faction: "none",
    factionRep: 0,
    factionRank: 0,
    factionContrib: 0,

    // 背包
    inventory: [],

    // 境界歷程記錄（用於結算畫面）
    realmHistory: [],

    // 死亡原因
    deathReason: null,

    // 四藝系統 { alchemy, weapon, formation, talisman }
    // 每個裡面存 { level: 0, exp: 0 }
    arts: {
        alchemy: { level: 0, exp: 0 },
        weapon: { level: 0, exp: 0 },
        formation: { level: 0, exp: 0 },
        talisman: { level: 0, exp: 0 }
    },

    // 裝備欄
    equipment: {
        head: null,      // 頭部
        body: null,      // 衣服
        legs: null,      // 褲子
        feet: null,      // 鞋子
        weapon: null,    // 法器
        formation: null  // 陣法
    }
};

// 將 state 掛載到 window
window.state = JSON.parse(JSON.stringify(defaultState)); // Deep copy for init

// ⭐ 後向兼容：讓 gameState 指向同一個物件，避免舊代碼卡住
window.gameState = window.state;

// ===== 2. 初始化依賴數值 =====
// (如果有 realm.js 提供的函式)
if (typeof getQiCapForLevel === "function") {
    window.state.qiCap = getQiCapForLevel(window.state.realmLevel);
}

// ===== 3. GameStateManager (負責存檔/讀檔/重置) =====
const GameStateManager = {
    // 收集當前狀態 (直接回傳 state 物件即可，因它是 Single Source of Truth)
    gatherState() {
        return window.state;
    },

    // 應用狀態 (讀檔時覆蓋 window.state)
    applyState(savedData) {
        if (!savedData) return;

        // 逐欄位更新，確保參照不變 (保留 window.state 物件本身)
        // 或者直接 Object.assign
        Object.assign(window.state, savedData);

        // 確保某些必要的陣列或物件不是 undefined
        if (!window.state.log) window.state.log = [];
        if (!window.state.learnedSkills) window.state.learnedSkills = {};
        if (!window.state.rootElements) window.state.rootElements = [];
        if (!window.state.inventory) window.state.inventory = [];
        if (!window.state.learnedSkills) window.state.learnedSkills = {};
        if (!window.state.rootElements) window.state.rootElements = [];
        if (!window.state.inventory) window.state.inventory = [];

        // 確保四藝存在
        if (!window.state.arts) {
            window.state.arts = {
                alchemy: { level: 0, exp: 0 },
                weapon: { level: 0, exp: 0 },
                formation: { level: 0, exp: 0 },
                talisman: { level: 0, exp: 0 }
            };
        }
    },

    save() {
        try {
            const currentSave = localStorage.getItem("xiuxian-save");
            let savedState = null;
            if (currentSave) {
                try { savedState = JSON.parse(currentSave); } catch (e) { }
            }

            const currentState = this.gatherState();

            // 防護：避免舊蓋新
            if (savedState && savedState.lastSaveTime) {
                const memTime = currentState.lastSaveTime || 0;
                const diskTime = savedState.lastSaveTime;
                if (memTime < diskTime) {
                    console.error("阻止存檔：記憶體時間較舊");
                    this.load();
                    return false;
                }
            }

            currentState.lastSaveTime = Date.now();
            window.state.lastSaveTime = currentState.lastSaveTime;

            localStorage.setItem("xiuxian-save", JSON.stringify(currentState));
            console.log(`✅ 存檔成功 (State Object) Time: ${window.state.lastSaveTime}`);
            return true;
        } catch (e) {
            console.error("Save failed:", e);
            return false;
        }
    },

    load() {
        const data = localStorage.getItem("xiuxian-save");
        if (!data) return false;
        try {
            const savedState = JSON.parse(data);
            this.applyState(savedState);
            console.log("✅ 讀檔成功 (State Object)");
            return true;
        } catch (e) {
            console.error("Load failed:", e);
            return false;
        }
    },

    reset() {
        // 硬重置：回復預設值
        console.log("Resetting state to default...");

        // 1. 清空當前所有屬性 (避免舊 Ghost keys 殘留)
        for (const key of Object.keys(window.state)) {
            delete window.state[key];
        }

        // 2. 重新寫入預設值
        const newDefault = JSON.parse(JSON.stringify(defaultState));
        Object.assign(window.state, newDefault);

        // 3. 清空存檔
        try {
            localStorage.removeItem("xiuxian-save");
            localStorage.removeItem("battle-boss");
        } catch (e) { console.error("Clear storage failed", e); }

        if (typeof getQiCapForLevel === "function") {
            window.state.qiCap = getQiCapForLevel(window.state.realmLevel);
        }

        console.log("⚠️ 遊戲狀態已重置 (State Object)");
        return true;
    },

    isDead() {
        return window.state.age >= window.state.lifespan || window.state.hp <= 0;
    },

    randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    randomChance(prob) {
        return Math.random() < prob;
    }
};

window.GameStateManager = GameStateManager;

// 為了方便除錯，保留一些工具函式
window.isDead = GameStateManager.isDead;
window.randomInt = GameStateManager.randomInt;
window.randomChance = GameStateManager.randomChance;

// 功法表 (維持不變)
const TechniqueTable = [
    { tier: 0, name: "凡人吐納術", multiplier: 1.0 },
    { tier: 1, name: "黃階心法", multiplier: 2 },
    { tier: 2, name: "玄階心法", multiplier: 5 },
    { tier: 3, name: "地階心法", multiplier: 10 },
    { tier: 4, name: "天階心法", multiplier: 15 }
];

function getCurrentTechnique() {
    const t = TechniqueTable.find(t => t.tier === window.state.techniqueTier);
    return t || TechniqueTable[0];
}

function getTechniqueMultiplier() {
    return getCurrentTechnique().multiplier;
}

window.TechniqueTable = TechniqueTable;
window.getCurrentTechnique = getCurrentTechnique;
window.getTechniqueMultiplier = getTechniqueMultiplier;
