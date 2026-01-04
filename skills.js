// skills.js - 技能系統核心邏輯

// 技能數據定義
const SKILLS = {
    // =============================
    // === 五行術法 (5個基礎技能) ===
    // =============================

    fire_fox: {
        id: 'fire_fox',
        name: '狐火術',
        type: 'small',
        faction: 'qingyun',
        element: '火',
        baseDamage: 1.8,
        burnChance: 0.5,
        burnDamage: 0.15, // 15% of Attack
        duration: 1,
        spCost: 2,
        rankRequired: 0,
        desc: "釋放狐火,50%機率燃燒敵人(15%攻擊力)一回合。"
    },
    water_stream: {
        id: 'water_stream',
        name: '水靈流',
        type: 'small',
        faction: 'qingyun',
        element: '水',
        baseDamage: 1.6,
        freezeChance: 0.5,
        spCost: 2,
        rankRequired: 0,
        desc: "水流攻擊,50%機率凍結敵人一回合。"
    },
    wood_leaf: {
        id: 'wood_leaf',
        name: '翠靈葉',
        type: 'small',
        faction: 'qingyun',
        element: '木',
        // baseDamage: 1.5, // Removed damage, pure heal
        baseHeal: 0.2, // 20% Max HP
        spCost: 2,
        rankRequired: 0,
        desc: "木靈之力,恢復20%最大生命值。"
    },
    metal_sword: {
        id: 'metal_sword',
        name: '飛劍刺',
        type: 'small',
        faction: 'qingyun',
        element: '金',
        baseDamage: 2.0,
        spCost: 3,
        rankRequired: 0,
        desc: "金屬性飛劍,銳利無比。"
    },
    earth_rock: {
        id: 'earth_rock',
        name: '落石術',
        type: 'small',
        faction: 'qingyun',
        element: '土',
        baseDamage: 1.7,
        shieldAmount: 0.10, // 10% MaxHP Shield
        duration: 2,
        spCost: 2,
        rankRequired: 0,
        desc: "土石攻擊,獲得10%最大生命值的護盾(2回合)。"
    },

    // 五行大招 (5個)
    fire_lotus: {
        id: 'fire_lotus',
        name: '紅蓮業火',
        type: 'ultimate',
        faction: 'qingyun',
        element: '火',
        baseDamage: 4.5,
        burnDamage: 0.15, // 15% of Attack
        duration: 3,
        spCost: 5,
        rankRequired: 2,
        desc: "紅蓮業火焚燒一切,造成持續傷害(15%攻擊力)。"
    },
    water_vortex: {
        id: 'water_vortex',
        name: '蒼龍漩渦',
        type: 'ultimate',
        faction: 'qingyun',
        element: '水',
        baseDamage: 4.0,
        freezeChance: 1.0,
        spCost: 5,
        rankRequired: 2,
        desc: "蒼龍漩渦凍結敵人,必定凍結一回合。"
    },
    wood_tree: {
        id: 'wood_tree',
        name: '古樹降臨',
        type: 'ultimate',
        faction: 'qingyun',
        element: '木',
        baseDamage: 3.5,
        baseHeal: 0.35, // 35% Max HP
        spCost: 5,
        rankRequired: 2,
        desc: "古樹之力,攻擊並恢復35%最大生命值。"
    },
    metal_storm: {
        id: 'metal_storm',
        name: '萬劍歸宗',
        type: 'ultimate',
        faction: 'qingyun',
        element: '金',
        baseDamage: 5.0,
        hits: 5,
        spCost: 6,
        rankRequired: 2,
        desc: "萬劍齊發,連續攻擊5次。"
    },
    earth_meteor: {
        id: 'earth_meteor',
        name: '隕星災變',
        type: 'ultimate',
        faction: 'qingyun',
        element: '土',
        baseDamage: 4.8,
        shieldAmount: 0.20, // 20% MaxHP Shield
        duration: 2,
        spCost: 6,
        rankRequired: 2,
        desc: "隕石墜落,造成巨大傷害並獲得20%最大生命值的護盾(2回合)。"
    },

    // =============================
    // === 丹塔術法 (10個) ===
    // =============================

    // 小技能 (5個)
    danTowerHeal1: {
        id: 'danTowerHeal1',
        name: '丹塔 · 回春丹氣',
        type: 'small',
        faction: 'danta',
        baseHeal: 30,
        spCost: 2,
        rankRequired: 0,
        desc: "釋放丹氣,恢復生命值。"
    },
    danTowerShield1: {
        id: 'danTowerShield1',
        name: '丹塔 · 護體丹光',
        type: 'small',
        faction: 'danta',
        shieldAmount: 40,
        spCost: 2,
        rankRequired: 0,
        desc: "丹光護體,吸收傷害。"
    },
    danTowerMana1: {
        id: 'danTowerMana1',
        name: '丹塔 · 真氣回復',
        type: 'small',
        faction: 'danta',
        manaRestore: 25,
        spCost: 2,
        rankRequired: 0,
        desc: "恢復真氣值。"
    },
    danTowerBuff1: {
        id: 'danTowerBuff1',
        name: '丹塔 · 淬體丹勁',
        type: 'small',
        faction: 'danta',
        attackBonus: 0.25,
        duration: 3,
        spCost: 2,
        rankRequired: 0,
        desc: "提升攻擊力25%,持續3回合。"
    },
    danTowerCure1: {
        id: 'danTowerCure1',
        name: '丹塔 · 解毒丹訣',
        type: 'small',
        faction: 'danta',
        baseHeal: 20,
        removeDebuff: true,
        spCost: 3,
        rankRequired: 0,
        desc: "治療並解除負面狀態。"
    },

    // 大招 (5個)
    danTowerUlt1: {
        id: 'danTowerUlt1',
        name: '丹塔 · 仙丹聖域',
        type: 'ultimate',
        faction: 'danta',
        baseHeal: 150,
        healOverTime: 30,
        duration: 3,
        spCost: 5,
        rankRequired: 2,
        desc: "創造聖域,大量治療並持續恢復。"
    },
    danTowerUlt2: {
        id: 'danTowerUlt2',
        name: '丹塔 · 九轉金丹',
        type: 'ultimate',
        faction: 'danta',
        fullRestore: true,
        tempInvincible: true,
        spCost: 6,
        rankRequired: 2,
        desc: "完全恢復生命真氣,短暫無敵。"
    },
    danTowerUlt3: {
        id: 'danTowerUlt3',
        name: '丹塔 · 涅槃重生',
        type: 'ultimate',
        faction: 'danta',
        revive: true,
        reviveHp: 0.5,
        spCost: 6,
        rankRequired: 2,
        desc: "死亡時自動復活,恢復50%生命。"
    },
    danTowerUlt4: {
        id: 'danTowerUlt4',
        name: '丹塔 · 萬靈丹陣',
        type: 'ultimate',
        faction: 'danta',
        allStatsBonus: 0.5,
        duration: 5,
        spCost: 5,
        rankRequired: 2,
        desc: "全屬性提升50%,持續5回合。"
    },
    danTowerUlt5: {
        id: 'danTowerUlt5',
        name: '丹塔 · 天地造化',
        type: 'ultimate',
        faction: 'danta',
        baseHeal: 200,
        maxHpBonus: 100,
        spCost: 6,
        rankRequired: 2,
        desc: "大量治療並永久提升生命上限。"
    },

    // =============================
    // === 陣殿術法 (10個) ===
    // =============================

    // 小技能 (5個)
    arrayPalaceTrap1: {
        id: 'arrayPalaceTrap1',
        name: '陣殿 · 困敵陣',
        type: 'small',
        faction: 'zhendian',
        baseDamage: 1.5,
        bindChance: 0.4,
        spCost: 2,
        rankRequired: 0,
        desc: "困住敵人,40%機率束縛。"
    },
    arrayPalaceShield1: {
        id: 'arrayPalaceShield1',
        name: '陣殿 · 護身陣法',
        type: 'small',
        faction: 'zhendian',
        shieldAmount: 45,
        reflectDamage: 0.2,
        spCost: 3,
        rankRequired: 0,
        desc: "陣法護盾,反彈20%傷害。"
    },
    arrayPalaceDodge1: {
        id: 'arrayPalaceDodge1',
        name: '陣殿 · 迷蹤陣',
        type: 'small',
        faction: 'zhendian',
        dodgeBonus: 0.3,
        duration: 2,
        spCost: 2,
        rankRequired: 0,
        desc: "提升閃避30%,持續2回合。"
    },
    arrayPalaceSlow1: {
        id: 'arrayPalaceSlow1',
        name: '陣殿 · 減速陣',
        type: 'small',
        faction: 'zhendian',
        baseDamage: 1.3,
        slowEffect: 0.4,
        duration: 3,
        spCost: 2,
        rankRequired: 0,
        desc: "減緩敵人速度40%。"
    },
    arrayPalaceMana1: {
        id: 'arrayPalaceMana1',
        name: '陣殿 · 聚靈陣',
        type: 'small',
        faction: 'zhendian',
        manaRestore: 30,
        manaRegen: 10,
        duration: 2,
        spCost: 2,
        rankRequired: 0,
        desc: "恢復真氣並持續回復。"
    },

    // 大招 (5個)
    arrayPalaceUlt1: {
        id: 'arrayPalaceUlt1',
        name: '陣殿 · 九宮封魔陣',
        type: 'ultimate',
        faction: 'zhendian',
        baseDamage: 3.8,
        sealChance: 0.6,
        duration: 3,
        spCost: 5,
        rankRequired: 2,
        desc: "封印敵人,60%機率禁止使用技能。"
    },
    arrayPalaceUlt2: {
        id: 'arrayPalaceUlt2',
        name: '陣殿 · 八卦困龍陣',
        type: 'ultimate',
        faction: 'zhendian',
        baseDamage: 4.0,
        stunChance: 0.7,
        spCost: 5,
        rankRequired: 2,
        desc: "困龍陣法,70%機率眩暈。"
    },
    arrayPalaceUlt3: {
        id: 'arrayPalaceUlt3',
        name: '陣殿 · 五行逆轉陣',
        type: 'ultimate',
        faction: 'zhendian',
        baseDamage: 3.5,
        reverseStats: true,
        duration: 4,
        spCost: 6,
        rankRequired: 2,
        desc: "逆轉五行,敵人攻防互換。"
    },
    arrayPalaceUlt4: {
        id: 'arrayPalaceUlt4',
        name: '陣殿 · 七星北斗陣',
        type: 'ultimate',
        faction: 'zhendian',
        baseDamage: 4.2,
        areaAttack: true,
        hits: 7,
        spCost: 6,
        rankRequired: 2,
        desc: "七星連擊,範圍攻擊。"
    },
    arrayPalaceUlt5: {
        id: 'arrayPalaceUlt5',
        name: '陣殿 · 太極兩儀陣',
        type: 'ultimate',
        faction: 'zhendian',
        baseDamage: 3.0,
        healAmount: 100,
        balance: true,
        spCost: 5,
        rankRequired: 2,
        desc: "陰陽平衡,攻擊同時治療。"
    },

    // =============================
    // === 器閣術法 (10個) ===
    // =============================

    // 小技能 (5個)
    weaponPavilionSword1: {
        id: 'weaponPavilionSword1',
        name: '器閣 · 飛劍術',
        type: 'small',
        faction: 'qige',
        baseDamage: 2.0,
        spCost: 3,
        rankRequired: 0,
        desc: "御劍攻擊,物理傷害。"
    },
    weaponPavilionPierce1: {
        id: 'weaponPavilionPierce1',
        name: '器閣 · 破甲擊',
        type: 'small',
        faction: 'qige',
        baseDamage: 1.8,
        armorPierce: 0.4,
        spCost: 3,
        rankRequired: 0,
        desc: "無視40%防禦。"
    },
    weaponPavilionCombo1: {
        id: 'weaponPavilionCombo1',
        name: '器閣 · 連環斬',
        type: 'small',
        faction: 'qige',
        baseDamage: 1.5,
        hits: 3,
        spCost: 3,
        rankRequired: 0,
        desc: "連續攻擊3次。"
    },
    weaponPavilionShield1: {
        id: 'weaponPavilionShield1',
        name: '器閣 · 神兵護體',
        type: 'small',
        faction: 'qige',
        shieldAmount: 50,
        counterAttack: 0.5,
        spCost: 2,
        rankRequired: 0,
        desc: "護盾,受擊時50%機率反擊。"
    },
    weaponPavilionCrit1: {
        id: 'weaponPavilionCrit1',
        name: '器閣 · 暴擊強化',
        type: 'small',
        faction: 'qige',
        critRateBonus: 0.3,
        critDamageBonus: 0.5,
        duration: 3,
        spCost: 2,
        rankRequired: 0,
        desc: "暴擊率+30%,暴傷+50%。"
    },

    // 大招 (5個)
    weaponPavilionUlt1: {
        id: 'weaponPavilionUlt1',
        name: '器閣 · 萬劍歸宗',
        type: 'ultimate',
        faction: 'qige',
        baseDamage: 5.0,
        swordCount: 10,
        spCost: 6,
        rankRequired: 2,
        desc: "萬劍齊發,毀滅性打擊。"
    },
    weaponPavilionUlt2: {
        id: 'weaponPavilionUlt2',
        name: '器閣 · 神兵天降',
        type: 'ultimate',
        faction: 'qige',
        baseDamage: 4.8,
        armorPierce: 0.8,
        spCost: 5,
        rankRequired: 2,
        desc: "神兵從天而降,無視80%防禦。"
    },
    weaponPavilionUlt3: {
        id: 'weaponPavilionUlt3',
        name: '器閣 · 劍氣縱橫',
        type: 'ultimate',
        faction: 'qige',
        baseDamage: 4.5,
        areaAttack: true,
        bleedDamage: 30,
        spCost: 5,
        rankRequired: 2,
        desc: "劍氣橫掃,造成流血。"
    },
    weaponPavilionUlt4: {
        id: 'weaponPavilionUlt4',
        name: '器閣 · 破天一擊',
        type: 'ultimate',
        faction: 'qige',
        baseDamage: 6.0,
        critGuaranteed: true,
        spCost: 6,
        rankRequired: 2,
        desc: "必定暴擊的毀滅一擊。"
    },
    weaponPavilionUlt5: {
        id: 'weaponPavilionUlt5',
        name: '器閣 · 兵刃風暴',
        type: 'ultimate',
        faction: 'qige',
        baseDamage: 3.5,
        hits: 5,
        lifeSteal: 0.3,
        spCost: 6,
        rankRequired: 2,
        desc: "連續5次攻擊,吸取30%生命。"
    },

    // =============================
    // === 符盟術法 (10個) ===
    // =============================

    // 小技能 (5個)
    talismanLeagueThunder1: {
        id: 'talismanLeagueThunder1',
        name: '符盟 · 雷符',
        type: 'small',
        faction: 'fumeng',
        baseDamage: 1.9,
        paralyzeChance: 0.3,
        spCost: 2,
        rankRequired: 0,
        desc: "雷電符籙,30%機率麻痺。"
    },
    talismanLeagueFire1: {
        id: 'talismanLeagueFire1',
        name: '符盟 · 火符',
        type: 'small',
        faction: 'fumeng',
        baseDamage: 2.1,
        burnDamage: 10,
        spCost: 3,
        rankRequired: 0,
        desc: "火焰符籙,造成灼燒。"
    },
    talismanLeagueIce1: {
        id: 'talismanLeagueIce1',
        name: '符盟 · 冰符',
        type: 'small',
        faction: 'fumeng',
        baseDamage: 1.7,
        freezeChance: 0.35,
        spCost: 2,
        rankRequired: 0,
        desc: "寒冰符籙,35%機率冰凍。"
    },
    talismanLeagueWind1: {
        id: 'talismanLeagueWind1',
        name: '符盟 · 風符',
        type: 'small',
        faction: 'fumeng',
        baseDamage: 1.6,
        speedBonus: 0.4,
        duration: 3,
        spCost: 2,
        rankRequired: 0,
        desc: "疾風符籙,提升速度40%。"
    },
    talismanLeagueEarth1: {
        id: 'talismanLeagueEarth1',
        name: '符盟 · 土符',
        type: 'small',
        faction: 'fumeng',
        shieldAmount: 55,
        defenseBonus: 0.3,
        spCost: 2,
        rankRequired: 0,
        desc: "大地符籙,護盾+防禦。"
    },

    // 大招 (5個)
    talismanLeagueUlt1: {
        id: 'talismanLeagueUlt1',
        name: '符盟 · 五雷轟頂',
        type: 'ultimate',
        faction: 'fumeng',
        baseDamage: 4.7,
        stunChance: 0.8,
        spCost: 5,
        rankRequired: 2,
        desc: "召喚天雷,80%機率眩暈。"
    },
    talismanLeagueUlt2: {
        id: 'talismanLeagueUlt2',
        name: '符盟 · 業火焚天',
        type: 'ultimate',
        faction: 'fumeng',
        baseDamage: 5.2,
        burnDamage: 50,
        duration: 3,
        spCost: 6,
        rankRequired: 2,
        desc: "業火焚燒,持續傷害。"
    },
    talismanLeagueUlt3: {
        id: 'talismanLeagueUlt3',
        name: '符盟 · 萬符齊發',
        type: 'ultimate',
        faction: 'fumeng',
        baseDamage: 3.2,
        hits: 10,
        randomElement: true,
        spCost: 5,
        rankRequired: 2,
        desc: "釋放萬符,隨機元素攻擊。"
    },
    talismanLeagueUlt4: {
        id: 'talismanLeagueUlt4',
        name: '符盟 · 陰陽逆轉',
        type: 'ultimate',
        faction: 'fumeng',
        baseDamage: 4.0,
        stealBuff: true,
        transferDebuff: true,
        spCost: 6,
        rankRequired: 2,
        desc: "竊取增益,轉移減益。"
    },
    talismanLeagueUlt5: {
        id: 'talismanLeagueUlt5',
        name: '符盟 · 符陣合一',
        type: 'ultimate',
        faction: 'fumeng',
        baseDamage: 4.5,
        allElements: true,
        areaAttack: true,
        spCost: 6,
        rankRequired: 2,
        desc: "符陣融合,五行齊發。"
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

    const prof = currentProficiency || 0;
    const cost = Math.floor(baseCost * (1 + prof / 50));

    return cost;
}

// 檢查是否可以學習/提升
function canLearnOrUpgrade(skillId) {
    const skill = SKILLS[skillId];
    if (!skill) return { can: false, reason: "技能不存在" };

    // 1. 檢查勢力
    if (skill.faction) {
        const playerFaction = window.state.faction || "";
        if (playerFaction !== skill.faction) {
            return { can: false, reason: `需要加入${skill.faction}` };
        }
    }

    // 2. 檢查階級
    if ((window.state.factionRank || 0) < skill.rankRequired) {
        return { can: false, reason: "宗門職位不足" };
    }

    // 3. 檢查熟練度上限
    const learned = window.state.learnedSkills || {};
    const currentProf = learned[skillId] || 0;
    if (currentProf >= 100) {
        return { can: false, reason: "已達宗師境界" };
    }

    // 4. 檢查貢獻
    const cost = getSkillCost(skillId, currentProf);
    if ((window.state.factionContrib || 0) < cost) {
        return { can: false, reason: `貢獻不足 (需要 ${cost})` };
    }

    return { can: true, cost: cost };
}

// 執行學習/提升
function learnOrUpgradeSkill(skillId) {
    const check = canLearnOrUpgrade(skillId);
    if (!check.can) return check;

    // 扣除貢獻
    window.state.factionContrib -= check.cost;

    // 提升熟練度
    if (!window.state.learnedSkills) {
        window.state.learnedSkills = {};
    }

    const currentProf = window.state.learnedSkills[skillId] || 0;
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
