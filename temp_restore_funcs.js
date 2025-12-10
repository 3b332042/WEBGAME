// ===== 傷害計算函數 =====
function getSkillDamage(multiplier = 1.0, element = null, skillId = null) {
    let bonus = 0;
    if (skillId && window.state && window.state.learnedSkills) {
        const prof = window.state.learnedSkills[skillId] || 0;
        if (window.getProficiencyBonus) {
            bonus = window.getProficiencyBonus(prof);
        }
    }
    const finalMult = multiplier * (1 + bonus);

    if (typeof performAttack === 'function') {
        let originalElem = playerUnit.elementAttack;
        if (element) playerUnit.elementAttack = element;
        const resultRaw = performAttack(playerUnit, enemyUnit);
        if (element) playerUnit.elementAttack = originalElem;
        const dmg = Math.floor(resultRaw.damage * finalMult);
        return { dmg: Math.max(1, dmg), isCrit: resultRaw.isCrit };
    } else {
        const baseAtk = playerUnit.attack || 10;
        const enemyDef = enemyUnit.defense || 0;
        const defMult = 1 - (enemyDef / (enemyDef + 100));
        const baseDmg = Math.floor(baseAtk * defMult * finalMult);
        const critRate = playerUnit.critRate || 0.05;
        const isCrit = Math.random() < critRate;
        const dmg = isCrit ? Math.floor(baseDmg * (1 + (playerUnit.critDamage || 0.5))) : baseDmg;
        return { dmg: Math.max(1, dmg), isCrit };
    }
}

function checkLearned(skillId) {
    if (!window.state) return true;
    const loaded = window.state.learnedSkills || {};
    if (!loaded.hasOwnProperty(skillId)) {
        const msg = document.createElement('div');
        msg.style.cssText = 'position:absolute;top:40%;left:50%;transform:translate(-50%,-50%);background:rgba(0,0,0,0.8);color:#fff;padding:10px 20px;border-radius:4px;z-index:9999';
        msg.textContent = "尚未學習此功法！請前往功法閣學習。";
        document.body.appendChild(msg);
        setTimeout(() => msg.remove(), 1500);
        return false;
    }
    return true;
}

function checkMana(skillId) {
    const skill = window.SKILLS ? window.SKILLS[skillId] : null;
    if (!skill) return true; 
