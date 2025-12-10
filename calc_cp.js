const RealmTable = [
    { level: 1, name: '練氣 1層' }, { level: 2, name: '練氣 2層' }, { level: 3, name: '練氣 3層' }, { level: 4, name: '練氣 4層' }, { level: 5, name: '練氣 5層' }, { level: 6, name: '練氣 6層' }, { level: 7, name: '練氣 7層' }, { level: 8, name: '練氣 8層' }, { level: 9, name: '練氣 9層' },
    { level: 10, name: '築基 初期' }, { level: 11, name: '築基 中期' }, { level: 12, name: '築基 後期' }, { level: 13, name: '築基 大成' }, { level: 14, name: '築基 圓滿' },
    { level: 15, name: '金丹 初凝' }, { level: 16, name: '金丹 中期' }, { level: 17, name: '金丹 後期' }, { level: 18, name: '金丹 大圓滿' }, { level: 19, name: '金丹 巔峰' },
    { level: 20, name: '元嬰 初凝' }, { level: 21, name: '元嬰 中期' }, { level: 22, name: '元嬰 後期' }, { level: 23, name: '元嬰 大成' }, { level: 24, name: '元嬰 圓滿' },
    { level: 25, name: '化神 初境' }, { level: 26, name: '化神 中境' }, { level: 27, name: '化神 後境' }, { level: 28, name: '化神 大成' }, { level: 29, name: '化神 圓滿' },
    { level: 30, name: '煉虛 初境' }, { level: 31, name: '煉虛 中境' }, { level: 32, name: '煉虛 後境' }, { level: 33, name: '煉虛 大成' }, { level: 34, name: '煉虛 圓滿' },
    { level: 35, name: '合體 初境' }, { level: 36, name: '合體 中境' }, { level: 37, name: '合體 後境' }, { level: 38, name: '合體 大成' }, { level: 39, name: '合體 圓滿' },
    { level: 40, name: '大乘 初境' }, { level: 41, name: '大乘 中境' }, { level: 42, name: '大乘 後境' }, { level: 43, name: '大乘 大成' }, { level: 44, name: '大乘 圓滿' },
    { level: 45, name: '渡劫 初境' }, { level: 46, name: '渡劫 中境' }, { level: 47, name: '渡劫 後境' }, { level: 48, name: '渡劫 大成' }, { level: 49, name: '渡劫 圓滿' },
    { level: 50, name: '真仙 初證' }
];

let stats = {
    realmLevel: 1,
    attack: 10,
    defense: 5,
    maxHp: 100,
    critRate: 0.05,
    critDamage: 0.5,
    comprehension: 8,
    luck: 5
};

console.log('| 等級 (Level) | 境界名稱 (Realm) | 攻擊 (Atk) | 防禦 (Def) | 血量 (HP) | 預估戰力 (CP) |');
console.log('|---|---|---|---|---|---|');

function calcCP(s) {
    const realmScore = s.realmLevel * 20;
    const atkScore = s.attack * 5;
    const defScore = s.defense * 3;
    const hpScore = s.maxHp * 0.8;
    const critRateScore = s.critRate * 100 * 2;
    const critDmgScore = s.critDamage * 100 * 1;
    const compScore = s.comprehension * 2;
    const luckScore = s.luck * 1.5;
    return Math.floor(realmScore + atkScore + defScore + hpScore + critRateScore + critDmgScore + compScore + luckScore);
}

for (let lvl = 1; lvl <= 50; lvl++) {
    // Current stats at level 'lvl'
    const name = RealmTable.find(r => r.level === lvl)?.name || '';
    const cp = calcCP(stats);
    console.log(`| ${lvl} | ${name} | ${stats.attack} | ${stats.defense} | ${stats.maxHp} | **${cp}** |`);

    // Simulate breakthrough to next level
    if (lvl < 50) {
        // Logic from breakthrough function
        // realmLevel increases from lvl to lvl+1
        const nextLvl = lvl + 1;
        stats.realmLevel = nextLvl;

        const attackGain = Math.floor(2 + Math.pow(nextLvl, 1.5));
        const defenseGain = Math.floor(1 + Math.pow(nextLvl, 1.4));
        const hpGain = Math.floor(10 + Math.pow(nextLvl, 1.8));

        stats.attack += attackGain;
        stats.defense += defenseGain;
        stats.maxHp += hpGain;
    }
}
