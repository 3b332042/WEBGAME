// =====================================
//     realms.js（表格式版本）
//  每一層 = 一筆資料（可完全自訂）
// =====================================

// 全部境界資料（每一層一行）
// ==========================================
//        RealmTable（完整表格式）
//  每層資料：level / name / qiCap / gain / breakRate / lifeGain
// ==========================================

const RealmTable = [
    // ===== 練氣期 1~9 ===== (新手村，難度大幅降低，確保能活到築基)
    { level: 1, name: "練氣 1層", qiCap: 20, gain: 6, breakRate: 0.95, lifeGain: 0 },
    { level: 2, name: "練氣 2層", qiCap: 40, gain: 7, breakRate: 0.93, lifeGain: 0 },
    { level: 3, name: "練氣 3層", qiCap: 60, gain: 8, breakRate: 0.91, lifeGain: 0 },
    { level: 4, name: "練氣 4層", qiCap: 90, gain: 9, breakRate: 0.89, lifeGain: 0 },
    { level: 5, name: "練氣 5層", qiCap: 130, gain: 10, breakRate: 0.87, lifeGain: 0 },
    { level: 6, name: "練氣 6層", qiCap: 180, gain: 11, breakRate: 0.85, lifeGain: 0 },
    { level: 7, name: "練氣 7層", qiCap: 240, gain: 12, breakRate: 0.83, lifeGain: 0 },
    { level: 8, name: "練氣 8層", qiCap: 320, gain: 13, breakRate: 0.81, lifeGain: 0 },
    { level: 9, name: "練氣 9層", qiCap: 420, gain: 14, breakRate: 0.79, lifeGain: 0 },

    // ===== 築基期 10~14 ===== (築基成功，壽元大增至 200+)
    // 總壽元目標：約 200~250 歲
    { level: 10, name: "築基 初期", qiCap: 1000, gain: 20, breakRate: 0.70, lifeGain: 100 }, // +100歲
    { level: 11, name: "築基 中期", qiCap: 2000, gain: 22, breakRate: 0.65, lifeGain: 10 },
    { level: 12, name: "築基 後期", qiCap: 3500, gain: 24, breakRate: 0.60, lifeGain: 10 },
    { level: 13, name: "築基 大成", qiCap: 5500, gain: 26, breakRate: 0.55, lifeGain: 10 },
    { level: 14, name: "築基 圓滿", qiCap: 8000, gain: 28, breakRate: 0.50, lifeGain: 10 },

    // ===== 金丹期 15~19 ===== (金丹大道，壽元至 500+)
    // 總壽元目標：約 500~600 歲
    { level: 15, name: "金丹 初凝", qiCap: 20000, gain: 400, breakRate: 0.40, lifeGain: 250 }, // +250歲
    { level: 16, name: "金丹 中期", qiCap: 35000, gain: 450, breakRate: 0.35, lifeGain: 20 },
    { level: 17, name: "金丹 後期", qiCap: 55000, gain: 500, breakRate: 0.30, lifeGain: 20 },
    { level: 18, name: "金丹 大圓滿", qiCap: 80000, gain: 550, breakRate: 0.25, lifeGain: 20 },
    { level: 19, name: "金丹 巔峰", qiCap: 110000, gain: 600, breakRate: 0.20, lifeGain: 20 },

    // ===== 元嬰期 20~24 ===== (元嬰老怪，壽元至 1000+)
    // 總壽元目標：約 1000~1200 歲
    { level: 20, name: "元嬰 初凝", qiCap: 300000, gain: 1000, breakRate: 0.18, lifeGain: 400 }, // +400歲
    { level: 21, name: "元嬰 中期", qiCap: 500000, gain: 1100, breakRate: 0.16, lifeGain: 50 },
    { level: 22, name: "元嬰 後期", qiCap: 800000, gain: 1200, breakRate: 0.14, lifeGain: 50 },
    { level: 23, name: "元嬰 大成", qiCap: 1200000, gain: 1300, breakRate: 0.12, lifeGain: 50 },
    { level: 24, name: "元嬰 圓滿", qiCap: 1800000, gain: 1400, breakRate: 0.10, lifeGain: 50 },

    // ===== 化神期 25~29 ===== (化神大能，壽元至 2000+)
    // 總壽元目標：約 2000~2500 歲
    { level: 25, name: "化神 初境", qiCap: 4000000, gain: 2500, breakRate: 0.09, lifeGain: 800 }, // +800歲
    { level: 26, name: "化神 中境", qiCap: 7000000, gain: 2800, breakRate: 0.08, lifeGain: 100 },
    { level: 27, name: "化神 後境", qiCap: 11000000, gain: 3100, breakRate: 0.07, lifeGain: 100 },
    { level: 28, name: "化神 大成", qiCap: 16000000, gain: 3400, breakRate: 0.06, lifeGain: 100 },
    { level: 29, name: "化神 圓滿", qiCap: 22000000, gain: 3700, breakRate: 0.05, lifeGain: 100 },

    // ===== 煉虛期 30~34 ===== (壽元至 5000+)
    { level: 30, name: "煉虛 初境", qiCap: 50000000, gain: 8000, breakRate: 0.04, lifeGain: 2000 }, // +2000歲
    { level: 31, name: "煉虛 中境", qiCap: 80000000, gain: 9000, breakRate: 0.035, lifeGain: 200 },
    { level: 32, name: "煉虛 後境", qiCap: 120000000, gain: 10000, breakRate: 0.03, lifeGain: 200 },
    { level: 33, name: "煉虛 大成", qiCap: 170000000, gain: 11000, breakRate: 0.025, lifeGain: 200 },
    { level: 34, name: "煉虛 圓滿", qiCap: 240000000, gain: 12000, breakRate: 0.02, lifeGain: 200 },

    // ===== 合體期 35~39 ===== (壽元至 10000+)
    { level: 35, name: "合體 初境", qiCap: 400000000, gain: 25000, breakRate: 0.018, lifeGain: 4000 }, // +4000歲
    { level: 36, name: "合體 中境", qiCap: 650000000, gain: 28000, breakRate: 0.016, lifeGain: 500 },
    { level: 37, name: "合體 後境", qiCap: 950000000, gain: 31000, breakRate: 0.014, lifeGain: 500 },
    { level: 38, name: "合體 大成", qiCap: 1300000000, gain: 34000, breakRate: 0.012, lifeGain: 500 },
    { level: 39, name: "合體 圓滿", qiCap: 1800000000, gain: 37000, breakRate: 0.010, lifeGain: 500 },

    // ===== 大乘期 40~44 ===== (壽元至 20000+)
    { level: 40, name: "大乘 初境", qiCap: 3000000000, gain: 80000, breakRate: 0.009, lifeGain: 8000 }, // +8000歲
    { level: 41, name: "大乘 中境", qiCap: 5000000000, gain: 90000, breakRate: 0.008, lifeGain: 1000 },
    { level: 42, name: "大乘 後境", qiCap: 8000000000, gain: 100000, breakRate: 0.007, lifeGain: 1000 },
    { level: 43, name: "大乘 大成", qiCap: 12000000000, gain: 110000, breakRate: 0.006, lifeGain: 1000 },
    { level: 44, name: "大乘 圓滿", qiCap: 18000000000, gain: 120000, breakRate: 0.005, lifeGain: 1000 },

    // ===== 渡劫期 45~49 ===== (壽元至 50000+)
    { level: 45, name: "渡劫 初境", qiCap: 30000000000, gain: 250000, breakRate: 0.004, lifeGain: 20000 }, // +20000歲
    { level: 46, name: "渡劫 中境", qiCap: 50000000000, gain: 280000, breakRate: 0.003, lifeGain: 2000 },
    { level: 47, name: "渡劫 後境", qiCap: 80000000000, gain: 310000, breakRate: 0.002, lifeGain: 2000 },
    { level: 48, name: "渡劫 大成", qiCap: 120000000000, gain: 340000, breakRate: 0.001, lifeGain: 2000 },
    { level: 49, name: "渡劫 圓滿", qiCap: 180000000000, gain: 370000, breakRate: 0.001, lifeGain: 2000 },

    // ===== 真仙期 50~54 ===== (與天地同壽)
    { level: 50, name: "真仙 初證", qiCap: 300000000000, gain: 1000000, breakRate: 0.001, lifeGain: 50000 },
    { level: 51, name: "真仙 二階", qiCap: 500000000000, gain: 1200000, breakRate: 0.001, lifeGain: 10000 },
    { level: 52, name: "真仙 三階", qiCap: 800000000000, gain: 1400000, breakRate: 0.001, lifeGain: 10000 },
    { level: 53, name: "真仙 四階", qiCap: 1200000000000, gain: 1600000, breakRate: 0.001, lifeGain: 10000 },
    { level: 54, name: "真仙 圓滿", qiCap: 9999999999999, gain: 2000000, breakRate: 0.001, lifeGain: 10000 },
];

// 後面 getRealm / realmName / getQiCapForLevel / baseQiGainForRealm ... 都可以沿用原本的
function getRealm(level) {
    return RealmTable.find(r => r.level === level);
}

function realmName(level) {
    return getRealm(level)?.name || `未知境界(${level})`;
}

function getQiCapForLevel(level) {
    return getRealm(level)?.qiCap || 100;
}

function baseQiGainForRealm(level) {
    return getRealm(level)?.gain || 1;
}

function getBreakRate(level) {
    return getRealm(level)?.breakRate || 0.01;
}

function getLifeGainForLevel(level) {
    return getRealm(level)?.lifeGain || 0;
}
function getRealmColor(level) {
    if (level >= 1 && level <= 14) return "realm-white";   // 練氣 + 築基
    if (level >= 15 && level <= 24) return "realm-green";  // 金丹 + 元嬰
    if (level >= 25 && level <= 34) return "realm-blue";   // 化神 + 煉虛
    if (level >= 35 && level <= 44) return "realm-purple"; // 合體 + 大乘
    if (level >= 45 && level <= 54) return "realm-orange"; // 渡劫 + 真仙
    return "realm-white";
}
