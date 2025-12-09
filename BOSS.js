// BOSS.js
// ===== BOSS 資料庫 + 建立實例 =====

// 純資料庫：想改數值就改這裡
const BOSS_DB = {
    lava_ape_king: {
        id: "lava_ape_king",
        name: "熔炎猿王",
        title: "熔岩妖皇",
        color: "#ff5a4a",

        realmLevel: 10,
        maxHp: 800,
        attack: 35,
        defense: 15,
        critRate: 0.12,
        critDamage: 0.7,
        elementAttack: "火"
    },

    qingyun_sword_sage: {
        id: "qingyun_sword_sage",
        name: "青雲劍宗長老",
        title: "天劍古修",
        color: "#7fd3ff",

        realmLevel: 12,
        maxHp: 900,
        attack: 40,
        defense: 18,
        critRate: 0.18,
        critDamage: 0.8,
        elementAttack: "金"
    },

    ancient_treant_king: {
        id: "ancient_treant_king",
        name: "古木妖皇",
        title: "萬木之主",
        color: "#55aa55",

        realmLevel: 11,
        maxHp: 1000,
        attack: 32,
        defense: 22,
        critRate: 0.10,
        critDamage: 0.6,
        elementAttack: "木"
    },

    // ===== 宗門挑戰 NPC =====
    npc_inner: {
        id: "npc_inner",
        name: "內門弟子",
        title: "築基圓滿",
        color: "#2f8b55",
        realmLevel: 10,
        maxHp: 460,
        attack: 46,
        defense: 23,
        critRate: 0.1,
        critDamage: 0.5,
        elementAttack: "木"
    },
    npc_core: {
        id: "npc_core",
        name: "真傳弟子",
        title: "金丹圓滿",
        color: "#2f6aa6",
        realmLevel: 15,
        maxHp: 820,
        attack: 82,
        defense: 41,
        critRate: 0.15,
        critDamage: 0.6,
        elementAttack: "水"
    },
    npc_elder: {
        id: "npc_elder",
        name: "傳功長老",
        title: "元嬰圓滿",
        color: "#7f3a80",
        realmLevel: 20,
        maxHp: 1300,
        attack: 130,
        defense: 65,
        critRate: 0.2,
        critDamage: 0.7,
        elementAttack: "火"
    },
    npc_guard: {
        id: "npc_guard",
        name: "護法",
        title: "化神圓滿",
        color: "#c89f60",
        realmLevel: 25,
        maxHp: 1900,
        attack: 190,
        defense: 95,
        critRate: 0.25,
        critDamage: 0.8,
        elementAttack: "金"
    },
    npc_master: {
        id: "npc_master",
        name: "宗主",
        title: "煉虛圓滿",
        color: "#b94128",
        realmLevel: 30,
        maxHp: 2620,
        attack: 262,
        defense: 131,
        critRate: 0.3,
        critDamage: 1.0,
        elementAttack: "金"
    },

    // ===== 默認敵方 (試煉對手) =====
    default_shadow: {
        id: "default_shadow",
        name: "赤焰妖影",
        title: "心魔幻象",
        color: "#ff4444",
        realmLevel: 1,
        maxHp: 100,
        attack: 9,
        defense: 4,
        critRate: 0.10,
        critDamage: 0.5,
        elementAttack: "火"
    }
};

// 建立一個可戰鬥的 BOSS 實例（給 battle-demo 用）
function createBossInstance(id) {
    const cfg = BOSS_DB[id];
    if (!cfg) {
        console.warn("[BOSS] 找不到 BOSS：", id);
        return null;
    }

    // 回傳一份「可被修改」的拷貝（HP 會被扣）
    return {
        ...cfg,
        hp: cfg.maxHp
    };
}
