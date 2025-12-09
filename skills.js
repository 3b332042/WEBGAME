// skills.js - 技能系統核心邏輯

// 技能數據定義
const SKILLS = {
    // === 金系 ===
    metal: {
        id: 'metal',
        name: '金 · 裂金劍氣',
        type: 'small',
        element: '金',
        baseDamage: 1.8,
        manaCost: 15,
        rankRequired: 0,
        desc: "凝聚金靈氣化為劍氣，對敵人造成傷害。"
    },
    goldUltimate: {
        id: 'goldUltimate',
        name: '金 · 萬劍歸宗',
        type: 'ultimate',
        element: '金',
        baseDamage: 0.6,
        manaCost: 50,
        rankRequired: 2,
        desc: "召喚無數飛劍，對敵人進行覆蓋式打擊。"
    },

    // === 木系 ===
    wood: {
        id: 'wood',
        name: '木 · 回春術',
        type: 'small',
        element: '木',
        baseHeal: 25,
        manaCost: 12,
        rankRequired: 0,
        desc: "引導木靈氣，恢復自身生命值。"
    },
    woodUlt: {
        id: 'woodUlt',
        name: '木 · 萬木聖域',
        type: 'ultimate',
        element: '木',
        baseDamage: 3.5,
        manaCost: 40,
        rankRequired: 2,
        desc: "召喚古樹降臨，造成巨大傷害並恢復大量生命。"
    },

    // === 水系 ===
    water: {
        id: 'water',
        name: '水 · 寒冰術',
        type: 'small',
        element: '水',
        baseDamage: 1.7,
        manaCost: 14,
        rankRequired: 0,
        desc: "凝水成冰，攻擊敵人。"
    },
    waterUlt: {
        id: 'waterUlt',
        name: '水 · 蒼龍漩渦',
        type: 'ultimate',
        element: '水',
        baseDamage: 4.0,
        manaCost: 45,
        rankRequired: 2,
        desc: "召喚水龍捲，造成巨大傷害並凍結敵人。"
    },

    // === 火系 ===
    fire: {
        id: 'fire',
        name: '火 · 狐火術',
        type: 'small',
        element: '火',
        baseDamage: 2.0,
        manaCost: 18,
        rankRequired: 0,
        desc: "釋放靈動狐火，灼燒敵人。"
    },
    fireUlt: {
        id: 'fireUlt',
        name: '火 · 紅蓮業火',
        type: 'ultimate',
        element: '火',
        baseDamage: 4.5,
        manaCost: 48,
        rankRequired: 2,
        desc: "綻放毀滅紅蓮，造成毀滅性火焰傷害。"
    },

    // === 土系 ===
    earth: {
        id: 'earth',
        name: '土 · 落石術',
        type: 'small',
        element: '土',
        baseDamage: 1.6,
        manaCost: 13,
        rankRequired: 0,
        desc: "召喚巨石從天而降，砸向敵人。"
    },
    earthUlt: {
        id: 'earthUlt',
        name: '土 · 隕星災變',
        type: 'ultimate',
        element: '土',
        baseDamage: 4.2,
        manaCost: 42,
        rankRequired: 2,
        desc: "召喚隕石衝擊，造成大範圍破壞。"
    }
};

// 熟練度等級稱號
const PROFICIENCY_RANKS = [
    { min: 0, title: "初學", bonus: 0.0 },
    { min: 21, title: "熟練", bonus: 0.2 },
    { min: 41, title: "精通", bonus: 0.4 },
    { min: 61, title: "大師", bonus: 0.6 },
    { min: 81, title: "宗師", bonus: 1.0 }
];

// 獲取當前熟練度加成
function getProficiencyBonus(proficiency) {
    let bonus = 0;
    for (let rank of PROFICIENCY_RANKS) {
        if (proficiency >= rank.min) {
            bonus = rank.bonus;
        }
    }
    return bonus;
}

// 獲取熟練度稱號
function getProficiencyTitle(proficiency) {
    let title = "初學";
    for (let rank of PROFICIENCY_RANKS) {
        if (proficiency >= rank.min) {
            title = rank.title;
        }
    }
    return title;
}

// 計算升級/學習消耗
function getSkillCost(skillId, currentProficiency) {
    const skill = SKILLS[skillId];
    let baseCost = (skill.type === 'ultimate') ? 200 : 50;

    // 如果是學習新技能 (proficiency 0 -> 1，這裡我們視為從 未學習 狀態開始)
    // 但邏輯上我們用 currentProficiency 來算 "提升下一級" 的成本
    // 如果 currentProficiency 為 undefined 或 0，代表是"學習"成本

    // 公式: 基礎消耗 * (1 + 當前熟練度 / 50)
    const prof = currentProficiency || 0;
    const cost = Math.floor(baseCost * (1 + prof / 50));

    return cost;
}

// 檢查是否可以學習/提升
function canLearnOrUpgrade(skillId) {
    const skill = SKILLS[skillId];
    if (!skill) return { can: false, reason: "技能不存在" };

    // 1. 檢查靈根
    // rootElements 應該是一個陣列，如 ["fire", "wood"]
    // 如果 rootElements 未定義，假設不能學
    const playerElements = window.state.rootElements || [];
    // 有些代碼可能用中文 '金'，有些用英文 'metal'。這裡假設 state.js 用英文或需要轉換
    // 根據 task 描述，state.js 用的是英文 rootElements: []
    // 但 faction.html 顯示我們會檢查 'wood', 'fire' 等
    if (!playerElements.includes(skill.element)) {
        return { can: false, reason: `靈根不符（需要 ${skill.element} 靈根）` };
    }

    // 2. 檢查階級 (只針對學習，已學習的不受階級限制提升? 暫定都要檢查)
    if ((window.state.factionRank || 0) < skill.rankRequired) {
        return { can: false, reason: "宗門職位不足" };
    }

    // 3. 檢查熟練度上限
    const learned = window.state.learnedSkills || {};
    const currentProf = learned[skillId] || 0;
    if (currentProf >= 100) {
        return { can: false, reason: "已達宗師境界" };
    }

    // 4. 檢查聲望
    const cost = getSkillCost(skillId, currentProf);
    if ((window.state.factionRep || 0) < cost) {
        return { can: false, reason: `聲望不足 (需要 ${cost})` };
    }

    return { can: true, cost: cost };
}

// 執行學習/提升
function learnOrUpgradeSkill(skillId) {
    const check = canLearnOrUpgrade(skillId);
    if (!check.can) return check; // { can: false, reason: ... }

    // 扣除聲望
    window.state.factionRep -= check.cost;

    // 提升熟練度
    if (!window.state.learnedSkills) {
        window.state.learnedSkills = {};
    }

    const currentProf = window.state.learnedSkills[skillId] || 0;
    // 如果是剛學習，從 0 -> 1，如果是提升，+10 (根據需求描述 "每次 +10")
    // 需求: "學習技能（熟練度 0 → 1）... 提升熟練度（每次 +10）" (這個描述有點歧義，可能是學習變成1，之後每次加10?)
    // 讓我們假設: 
    // 未學習 -> 學習: 設定為 1
    // 已學習 -> 提升: +10

    let newProf = 0;
    if (currentProf === 0 && !window.state.learnedSkills.hasOwnProperty(skillId)) {
        newProf = 1;
    } else {
        newProf = currentProf + 10;
    }

    if (newProf > 100) newProf = 100;

    window.state.learnedSkills[skillId] = newProf;

    // 保存
    if (window.GameStateManager) {
        window.GameStateManager.save();
        window.GameStateManager.sync();
    }

    return { can: true, newProf: newProf, cost: check.cost };
}

// 導出給全域使用
window.SKILLS = SKILLS;
window.learnOrUpgradeSkill = learnOrUpgradeSkill;
window.getSkillCost = getSkillCost;
window.getProficiencyBonus = getProficiencyBonus;
window.getProficiencyTitle = getProficiencyTitle;
window.canLearnOrUpgrade = canLearnOrUpgrade;
