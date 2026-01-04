// battle-core.js
// 新戰鬥系統核心 - 完全重構版本
// 採用面向對象設計,支持完整的效果系統

console.log("Loading battle-core.js v2.0...");

// ==========================================
// Effect 類 - 效果系統
// ==========================================
class Effect {
    constructor(config) {
        this.type = config.type; // buff, debuff, dot, hot, stun, freeze, bind, shield
        this.duration = config.duration || 1;
        this.remaining = config.duration || 1;
        this.source = config.source || 'unknown';
        this.stackable = config.stackable || false;

        // 效果數值
        this.damage = config.damage || 0;
        this.heal = config.heal || 0;
        this.stats = config.stats || {}; // {attack: 0.3, defense: 0.2}
        this.element = config.element || null;
        this.name = config.name || this.type;
    }

    // 應用時觸發
    onApply(unit) {
        if (window.BattleUI) {
            switch (this.type) {
                case 'buff':
                    window.BattleUI.showMessage(`${unit.name} 獲得增益: ${this.name}`, 'buff');
                    break;
                case 'debuff':
                    window.BattleUI.showMessage(`${unit.name} 受到減益: ${this.name}`, 'debuff');
                    break;
                case 'dot':
                    window.BattleUI.showMessage(`${unit.name} 開始燃燒!`, 'damage');
                    break;
                case 'stun':
                    window.BattleUI.showMessage(`${unit.name} 被眩暈!`, 'control');
                    break;
                case 'freeze':
                    window.BattleUI.showMessage(`${unit.name} 被冰凍!`, 'control');
                    break;
            }
        }
    }

    // 每回合觸發
    tick(unit) {
        switch (this.type) {
            case 'dot':
                unit.takeDamage(this.damage, { source: this.source, isDOT: true });
                if (window.BattleUI) {
                    window.BattleUI.showDOT(unit, this.damage, this.element);
                }
                break;
            case 'hot':
                unit.heal(this.heal, { isHOT: true });
                break;
        }

        this.remaining--;
    }

    // 移除時觸發
    onRemove(unit) {
        if (window.BattleUI && this.duration > 1) {
            window.BattleUI.showMessage(`${unit.name} 的 ${this.name} 效果消失`, 'info');
        }
    }

    // 是否過期
    isExpired() {
        return this.remaining <= 0;
    }

    // 獲取圖標
    getIcon() {
        const icons = {
            'buff': '⬆️',
            'debuff': '⬇️',
            'dot': '🔥',
            'hot': '💚',
            'stun': '💫',
            'freeze': '❄️',
            'shield': '🛡️'
        };
        return icons[this.type] || '✨';
    }
}

// ==========================================
// BattleUnit 類 - 戰鬥單位
// ==========================================
class BattleUnit {
    constructor(data, type) {
        this.type = type; // 'player' or 'enemy'
        this.name = data.name || (type === 'player' ? '玩家' : '敵人');
        this.id = type;

        // 基礎屬性
        this.baseStats = {
            maxHp: data.maxHp || 100,
            attack: data.attack || 10,
            defense: data.defense || 5,
            speed: data.speed || 10,
            critRate: data.critRate || 0.05,
            critDamage: data.critDamage || 0.5
        };

        // 當前狀態
        this.currentHp = this.baseStats.maxHp;
        this.currentMana = data.mana || data.maxMana || 100;
        this.maxMana = data.maxMana || 100;
        this.shield = 0;

        // 效果列表
        this.effects = [];

        // 技能熟練度(僅玩家)
        this.skillProficiency = data.learnedSkills || {};

        // 戰鬥數據
        this.totalDamageDealt = 0;
        this.totalDamageTaken = 0;
        this.totalHealing = 0;
    }

    // 獲取屬性(包含buff加成)
    getStat(statName) {
        let value = this.baseStats[statName] || 0;

        // 應用buff加成
        this.effects.forEach(effect => {
            if (effect.type === 'buff' && effect.stats[statName]) {
                value *= (1 + effect.stats[statName]);
            }
            if (effect.type === 'debuff' && effect.stats[statName]) {
                value *= (1 - effect.stats[statName]);
            }
        });

        return value;
    }

    // 受到傷害
    takeDamage(amount, options = {}) {
        amount = Math.max(1, Math.floor(amount));

        // 先扣護盾
        if (this.shield > 0) {
            if (amount <= this.shield) {
                this.shield -= amount;
                if (window.BattleUI) {
                    window.BattleUI.showDamage(this, amount, 'shield', options.isCrit);
                }
                return 0;
            } else {
                amount -= this.shield;
                this.shield = 0;
            }
        }

        // 扣血
        const actualDamage = Math.min(amount, this.currentHp);
        this.currentHp -= actualDamage;
        this.currentHp = Math.max(0, this.currentHp);
        this.totalDamageTaken += actualDamage;

        if (window.BattleUI) {
            const damageType = options.isDOT ? 'dot' : 'normal';
            window.BattleUI.showDamage(this, actualDamage, damageType, options.isCrit);
            window.BattleUI.updateHP(this);
            window.BattleUI.shakeUnit(this);
        }

        return actualDamage;
    }

    // 治療
    heal(amount, options = {}) {
        amount = Math.floor(amount);
        const actualHeal = Math.min(amount, this.baseStats.maxHp - this.currentHp);

        if (actualHeal > 0) {
            this.currentHp += actualHeal;
            this.totalHealing += actualHeal;

            if (window.BattleUI) {
                window.BattleUI.showHeal(this, actualHeal, options.isHOT);
                window.BattleUI.updateHP(this);
            }
        }

        return actualHeal;
    }

    // 添加護盾
    addShield(amount) {
        amount = Math.floor(amount);
        this.shield += amount;

        if (window.BattleUI) {
            window.BattleUI.showShield(this, amount);
        }
    }

    // 恢復真氣
    restoreMana(amount) {
        amount = Math.floor(amount);
        const actualRestore = Math.min(amount, this.maxMana - this.currentMana);

        if (actualRestore > 0) {
            this.currentMana += actualRestore;

            if (window.BattleUI) {
                window.BattleUI.showManaRestore(this, actualRestore);
                window.BattleUI.updateMana(this);
            }
        }

        return actualRestore;
    }

    // 消耗真氣
    consumeMana(amount) {
        this.currentMana -= amount;
        this.currentMana = Math.max(0, this.currentMana);

        if (window.BattleUI) {
            window.BattleUI.updateMana(this);
        }
    }

    // 檢查能否使用技能
    canUseSkill(skill) {
        // 檢查真氣
        if (this.currentMana < skill.manaCost) {
            return { can: false, reason: '真氣不足' };
        }

        // 檢查控制狀態
        if (this.hasEffect('stun')) {
            return { can: false, reason: '眩暈中' };
        }
        if (this.hasEffect('freeze')) {
            return { can: false, reason: '冰凍中' };
        }

        return { can: true };
    }

    // 添加效果
    addEffect(effect) {
        // 檢查是否可疊加
        if (!effect.stackable) {
            const existing = this.effects.find(e => e.source === effect.source && e.type === effect.type);
            if (existing) {
                // 刷新持續時間
                existing.remaining = effect.duration;
                return;
            }
        }

        this.effects.push(effect);
        effect.onApply(this);

        if (window.BattleUI) {
            window.BattleUI.updateEffects(this);
        }
    }

    // 移除效果
    removeEffect(effect) {
        const index = this.effects.indexOf(effect);
        if (index > -1) {
            this.effects.splice(index, 1);
            effect.onRemove(this);

            if (window.BattleUI) {
                window.BattleUI.updateEffects(this);
            }
        }
    }

    // 檢查是否有某種效果
    hasEffect(type) {
        return this.effects.some(e => e.type === type);
    }

    // 效果tick(每回合)
    tickEffects() {
        const toRemove = [];

        this.effects.forEach(effect => {
            effect.tick(this);

            if (effect.isExpired()) {
                toRemove.push(effect);
            }
        });

        toRemove.forEach(effect => this.removeEffect(effect));
    }

    // 獲取技能熟練度
    getSkillProficiency(skillId) {
        return this.skillProficiency[skillId] || 0;
    }

    // 是否死亡
    isDead() {
        return this.currentHp <= 0;
    }

    // 回合開始
    onTurnStart() {
        // 真氣自然恢復
        if (this.type === 'player') {
            const regen = Math.floor(this.maxMana * 0.1);
            this.restoreMana(regen);
        }
    }

    // 回合結束
    onTurnEnd() {
        this.tickEffects();
    }
}

// ==========================================
// BattleManager 類 - 戰鬥管理器
// ==========================================
class BattleManager {
    constructor(playerData, enemyData) {
        this.player = new BattleUnit(playerData, 'player');
        this.enemy = new BattleUnit(enemyData, 'enemy');
        this.round = 0;
        this.currentTurn = null; // 'player' or 'enemy'
        this.battleLog = [];
        this.isActive = false;
        this.isPaused = false;
    }

    // 初始化戰鬥
    startBattle() {
        console.log("Battle Start!");
        this.isActive = true;
        this.round = 1;

        // 初始化UI
        if (window.BattleUI) {
            window.BattleUI.init(this);
            window.BattleUI.updateAll();
        }

        // 決定先攻
        this.calculateTurnOrder();

        // 開始第一回合
        this.startRound();
    }

    // 計算行動順序
    calculateTurnOrder() {
        const playerSpeed = this.player.getStat('speed');
        const enemySpeed = this.enemy.getStat('speed');

        if (playerSpeed >= enemySpeed) {
            this.currentTurn = 'player';
            this.addLog(`${this.player.name} 先攻!`);
        } else {
            this.currentTurn = 'enemy';
            this.addLog(`${this.enemy.name} 先攻!`);
        }
    }

    // 開始新回合
    startRound() {
        this.addLog(`--- 第 ${this.round} 回合 ---`);

        // 回合開始處理
        this.player.onTurnStart();
        this.enemy.onTurnStart();

        // 開始當前單位的回合
        this.processTurn();
    }

    // 處理回合
    processTurn() {
        if (!this.isActive || this.isPaused) return;

        // 檢查勝負
        if (this.checkVictory()) return;

        const currentUnit = this.getCurrentUnit();

        if (this.currentTurn === 'player') {
            this.enablePlayerActions();
        } else {
            setTimeout(() => this.executeEnemyTurn(), 1000);
        }

        if (window.BattleUI) {
            window.BattleUI.updateTurnIndicator(this.currentTurn);
        }
    }

    // 啟用玩家操作
    enablePlayerActions() {
        if (window.BattleUI) {
            window.BattleUI.enableActions(true);
        }
    }

    // 執行敵人回合
    executeEnemyTurn() {
        if (!this.isActive) return;

        // 簡單AI: 隨機普通攻擊
        this.performBasicAttack(this.enemy, this.player);

        setTimeout(() => this.endTurn(), 1000);
    }

    // 執行普通攻擊
    performBasicAttack(attacker, target) {
        // 播放攻擊動畫
        if (window.AnimationManager) {
            const color = attacker.type === 'player' ? '#4fc3f7' : '#ff5555';
            window.AnimationManager.playProjectile(attacker, target, color);
        }

        // 延遲執行傷害(等動畫)
        setTimeout(() => {
            const damage = this.calculateBasicDamage(attacker, target);
            target.takeDamage(damage.amount, { isCrit: damage.isCrit });

            attacker.totalDamageDealt += damage.amount;

            this.addLog(`${attacker.name} 攻擊 ${target.name}, 造成 ${damage.amount} 傷害${damage.isCrit ? ' (暴擊!)' : ''}`);
        }, 400);
    }

    // 計算基礎傷害
    calculateBasicDamage(attacker, target) {
        const attack = attacker.getStat('attack');
        const defense = target.getStat('defense');

        // 防禦減傷
        const defReduction = defense / (defense + 100);
        let damage = attack * (1 - defReduction);

        // 暴擊判定
        const critRate = attacker.getStat('critRate');
        const isCrit = Math.random() < critRate;

        if (isCrit) {
            const critDamage = attacker.getStat('critDamage');
            damage *= (1 + critDamage);
        }

        return {
            amount: Math.max(1, Math.floor(damage)),
            isCrit: isCrit
        };
    }

    // 使用技能
    useSkill(skillId) {
        const skill = window.SKILLS?.[skillId];
        if (!skill) {
            console.error("Skill not found:", skillId);
            return false;
        }

        const caster = this.player;
        const target = this.enemy;

        // 檢查能否使用
        const canUse = caster.canUseSkill(skill);
        if (!canUse.can) {
            if (window.BattleUI) {
                window.BattleUI.showMessage(canUse.reason, 'error');
            }
            return false;
        }

        // 消耗真氣
        caster.consumeMana(skill.manaCost);

        // 執行技能
        this.executeSkill(skill, caster, target);

        // 記錄日誌
        this.addLog(`${caster.name} 使用 ${skill.name}`);

        // 結束回合
        setTimeout(() => this.endTurn(), 1500);

        return true;
    }

    // 執行技能效果
    executeSkill(skill, caster, target) {
        const proficiency = caster.getSkillProficiency(skill.id);
        const bonus = this.calculateProficiencyBonus(proficiency);

        // 播放動畫
        if (window.AnimationManager) {
            window.AnimationManager.playSkillAnimation(skill, caster, target);
        }

        // 延遲執行效果(等動畫)
        setTimeout(() => {
            this.applySkillEffects(skill, caster, target, bonus);
        }, 300);
    }

    // 應用技能效果
    applySkillEffects(skill, caster, target, bonus) {
        // 傷害類
        if (skill.baseDamage) {
            const damage = this.calculateSkillDamage(skill, caster, target, bonus);
            target.takeDamage(damage.amount, { isCrit: damage.isCrit });
            caster.totalDamageDealt += damage.amount;
        }

        // 治療類
        if (skill.baseHeal) {
            const heal = Math.floor(skill.baseHeal * (1 + bonus));
            caster.heal(heal);
        }

        // 護盾類
        if (skill.shieldAmount) {
            const shield = Math.floor(skill.shieldAmount * (1 + bonus));
            caster.addShield(shield);
        }

        // 真氣恢復
        if (skill.manaRestore) {
            const mana = Math.floor(skill.manaRestore * (1 + bonus));
            caster.restoreMana(mana);
        }

        // 增益類
        if (skill.attackBonus || skill.defenseBonus || skill.speedBonus) {
            const buff = new Effect({
                type: 'buff',
                name: skill.name,
                stats: {
                    attack: skill.attackBonus || 0,
                    defense: skill.defenseBonus || 0,
                    speed: skill.speedBonus || 0
                },
                duration: skill.duration || 3,
                source: skill.id
            });
            caster.addEffect(buff);
        }

        // 控制類 - 眩暈
        if (skill.stunChance && Math.random() < skill.stunChance) {
            const stun = new Effect({
                type: 'stun',
                name: '眩暈',
                duration: 1,
                source: skill.id
            });
            target.addEffect(stun);
        }

        // 持續傷害
        if (skill.burnDamage) {
            const dot = new Effect({
                type: 'dot',
                name: '燃燒',
                damage: skill.burnDamage,
                duration: skill.duration || 3,
                source: skill.id,
                element: 'fire'
            });
            target.addEffect(dot);
        }
    }

    // 計算技能傷害
    calculateSkillDamage(skill, caster, target, bonus) {
        const baseAtk = caster.getStat('attack');
        const baseDef = target.getStat('defense');

        // 基礎傷害
        let damage = skill.baseDamage * baseAtk * (1 + bonus);

        // 防禦減傷
        let defReduction = baseDef / (baseDef + 100);

        // 破甲
        if (skill.armorPierce) {
            defReduction *= (1 - skill.armorPierce);
        }

        damage *= (1 - defReduction);

        // 暴擊判定
        const critRate = caster.getStat('critRate');
        const isCrit = Math.random() < critRate;

        if (isCrit) {
            const critDamage = caster.getStat('critDamage');
            damage *= (1 + critDamage);
        }

        return {
            amount: Math.max(1, Math.floor(damage)),
            isCrit: isCrit
        };
    }

    // 計算熟練度加成
    calculateProficiencyBonus(proficiency) {
        if (proficiency >= 81) return 1.0;  // 宗師
        if (proficiency >= 61) return 0.6;  // 大師
        if (proficiency >= 41) return 0.4;  // 精通
        if (proficiency >= 21) return 0.2;  // 熟練
        return 0.0;  // 初學
    }

    // 結束回合
    endTurn() {
        if (!this.isActive) return;

        // 回合結束處理
        const currentUnit = this.getCurrentUnit();
        currentUnit.onTurnEnd();

        // 檢查勝負
        if (this.checkVictory()) return;

        // 切換回合
        this.switchTurn();
    }

    // 切換回合
    switchTurn() {
        if (this.currentTurn === 'player') {
            this.currentTurn = 'enemy';
        } else {
            this.currentTurn = 'player';
            this.round++;
            this.startRound();
            return;
        }

        this.processTurn();
    }

    // 獲取當前單位
    getCurrentUnit() {
        return this.currentTurn === 'player' ? this.player : this.enemy;
    }

    // 檢查勝負
    checkVictory() {
        if (this.player.isDead()) {
            this.endBattle('defeat');
            return true;
        }
        if (this.enemy.isDead()) {
            this.endBattle('victory');
            return true;
        }
        return false;
    }

    // 結束戰鬥
    endBattle(result) {
        this.isActive = false;
        this.addLog(`戰鬥結束: ${result === 'victory' ? '勝利!' : '失敗!'}`);

        if (window.BattleUI) {
            window.BattleUI.showResult(result, this);
        }

        if (result === 'victory') {
            this.grantRewards();
        }
    }

    // 發放獎勵
    grantRewards() {
        // TODO: 實現獎勵系統
        console.log("Victory! Granting rewards...");
    }

    // 添加日誌
    addLog(message) {
        this.battleLog.push(message);
        console.log(`[Battle] ${message}`);
    }
}

// ==========================================
// AnimationManager - 動畫管理器
// ==========================================
const AnimationManager = {
    // 播放技能動畫
    playSkillAnimation(skill, caster, target) {
        const color = this.getSkillColor(skill);

        // 根據技能類型選擇動畫
        if (skill.baseDamage) {
            this.playProjectile(caster, target, color);
        } else if (skill.baseHeal) {
            this.playHealEffect(caster, color);
        } else if (skill.shieldAmount) {
            this.playShieldEffect(caster, color);
        } else {
            this.playBuffEffect(caster, color);
        }
    },

    // 彈道動畫
    playProjectile(caster, target, color) {
        const start = this.getUnitPosition(caster);
        const end = this.getUnitPosition(target);

        const projectile = document.createElement('div');
        projectile.style.cssText = `
            position: absolute;
            left: ${start.x}px;
            top: ${start.y}px;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: ${color};
            box-shadow: 0 0 20px ${color};
            z-index: 1000;
            pointer-events: none;
        `;

        document.body.appendChild(projectile);

        projectile.animate([
            { left: start.x + 'px', top: start.y + 'px', opacity: 1 },
            { left: end.x + 'px', top: end.y + 'px', opacity: 1 }
        ], {
            duration: 400,
            easing: 'ease-out'
        }).onfinish = () => {
            projectile.remove();
            this.playHitEffect(target, color);
        };
    },

    // 命中特效
    playHitEffect(target, color) {
        const pos = this.getUnitPosition(target);
        const hit = document.createElement('div');
        hit.style.cssText = `
            position: absolute;
            left: ${pos.x - 30}px;
            top: ${pos.y - 30}px;
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background: radial-gradient(circle, ${color} 0%, transparent 70%);
            animation: hitExpand 0.4s ease-out forwards;
            z-index: 999;
            pointer-events: none;
        `;

        document.body.appendChild(hit);
        setTimeout(() => hit.remove(), 400);
    },

    // 治療特效
    playHealEffect(unit, color) {
        const pos = this.getUnitPosition(unit);
        const heal = document.createElement('div');
        heal.style.cssText = `
            position: absolute;
            left: ${pos.x - 40}px;
            top: ${pos.y - 40}px;
            width: 80px;
            height: 80px;
            border-radius: 50%;
            background: radial-gradient(circle, ${color}80 0%, transparent 70%);
            animation: healPulse 1s ease-out forwards;
            z-index: 999;
            pointer-events: none;
        `;

        document.body.appendChild(heal);
        setTimeout(() => heal.remove(), 1000);
    },

    // 護盾特效
    playShieldEffect(unit, color) {
        const elem = document.getElementById(unit.type === 'player' ? 'player' : 'enemy');
        if (!elem) return;

        elem.style.boxShadow = `0 0 30px ${color}`;
        setTimeout(() => {
            elem.style.boxShadow = '';
        }, 1500);
    },

    // Buff特效
    playBuffEffect(unit, color) {
        const pos = this.getUnitPosition(unit);
        const buff = document.createElement('div');
        buff.style.cssText = `
            position: absolute;
            left: ${pos.x - 50}px;
            top: ${pos.y - 50}px;
            width: 100px;
            height: 100px;
            border: 3px solid ${color};
            border-radius: 50%;
            animation: buffRing 1s ease-out forwards;
            z-index: 999;
            pointer-events: none;
        `;

        document.body.appendChild(buff);
        setTimeout(() => buff.remove(), 1000);
    },

    // 獲取技能顏色
    getSkillColor(skill) {
        if (skill.faction === '丹塔') return '#90ee90';
        if (skill.faction === '陣殿') return '#ffd700';
        if (skill.faction === '器閣') return '#c0c0c0';
        if (skill.faction === '符盟') return '#ff69b4';
        return '#4fc3f7';
    },

    // 獲取單位位置
    getUnitPosition(unit) {
        const elem = document.getElementById(unit.type === 'player' ? 'player' : 'enemy');
        if (!elem) return { x: 0, y: 0 };

        const rect = elem.getBoundingClientRect();
        return {
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2
        };
    }
};

// ==========================================
// BattleUI - UI管理器
// ==========================================
const BattleUI = {
    battle: null,

    // 初始化
    init(battleManager) {
        this.battle = battleManager;
    },

    // 更新所有UI
    updateAll() {
        this.updateHP(this.battle.player);
        this.updateHP(this.battle.enemy);
        this.updateMana(this.battle.player);
        this.updateEffects(this.battle.player);
        this.updateEffects(this.battle.enemy);
    },

    // 更新血量條
    updateHP(unit) {
        const hpBar = document.getElementById(unit.type === 'player' ? 'php' : 'ehp');
        const hpText = document.getElementById(unit.type === 'player' ? 'player-hp-text' : 'enemy-hp-text');

        if (!hpBar || !hpText) return;

        const percent = (unit.currentHp / unit.baseStats.maxHp) * 100;
        hpBar.style.width = Math.max(0, percent) + '%';
        hpText.textContent = `${Math.floor(unit.currentHp)}/${unit.baseStats.maxHp}`;
    },

    // 更新真氣條
    updateMana(unit) {
        if (unit.type !== 'player') return;

        const manaBar = document.getElementById('pmana');
        const manaText = document.getElementById('player-mana-text');

        if (!manaBar || !manaText) return;

        const percent = (unit.currentMana / unit.maxMana) * 100;
        manaBar.style.width = Math.max(0, percent) + '%';
        manaText.textContent = `${Math.floor(unit.currentMana)}/${unit.maxMana}`;
    },

    // 顯示傷害數字
    showDamage(unit, amount, type, isCrit) {
        const pos = this.getUnitScreenPosition(unit);
        const dmg = document.createElement('div');
        dmg.className = 'damage-number';

        let color = '#ff5555';
        let text = `-${amount}`;

        if (type === 'shield') {
            color = '#4fc3f7';
            text = `🛡️ -${amount}`;
        } else if (type === 'dot') {
            color = '#ff8800';
            text = `🔥 -${amount}`;
        }

        if (isCrit) {
            color = '#ffd700';
            text = `CRIT! -${amount}`;
        }

        dmg.style.cssText = `
            position: absolute;
            left: ${pos.x}px;
            top: ${pos.y}px;
            color: ${color};
            font-weight: bold;
            font-size: ${isCrit ? '24px' : '20px'};
            text-shadow: 0 0 5px #000, 0 0 10px #000;
            animation: floatUp 1s ease-out forwards;
            z-index: 2000;
            pointer-events: none;
        `;
        dmg.textContent = text;

        document.body.appendChild(dmg);
        setTimeout(() => dmg.remove(), 1000);
    },

    // 顯示治療數字
    showHeal(unit, amount, isHOT) {
        const pos = this.getUnitScreenPosition(unit);
        const heal = document.createElement('div');
        heal.className = 'heal-number';

        heal.style.cssText = `
            position: absolute;
            left: ${pos.x}px;
            top: ${pos.y}px;
            color: #90ee90;
            font-weight: bold;
            font-size: 20px;
            text-shadow: 0 0 5px #000, 0 0 10px #000;
            animation: floatUp 1s ease-out forwards;
            z-index: 2000;
            pointer-events: none;
        `;
        heal.textContent = `${isHOT ? '💚' : '+'} ${amount}`;

        document.body.appendChild(heal);
        setTimeout(() => heal.remove(), 1000);
    },

    // 顯示護盾
    showShield(unit, amount) {
        const pos = this.getUnitScreenPosition(unit);
        const shield = document.createElement('div');

        shield.style.cssText = `
            position: absolute;
            left: ${pos.x}px;
            top: ${pos.y}px;
            color: #4fc3f7;
            font-weight: bold;
            font-size: 20px;
            text-shadow: 0 0 5px #000;
            animation: floatUp 1s ease-out forwards;
            z-index: 2000;
            pointer-events: none;
        `;
        shield.textContent = `🛡️ +${amount}`;

        document.body.appendChild(shield);
        setTimeout(() => shield.remove(), 1000);
    },

    // 顯示真氣恢復
    showManaRestore(unit, amount) {
        const pos = this.getUnitScreenPosition(unit);
        const mana = document.createElement('div');

        mana.style.cssText = `
            position: absolute;
            left: ${pos.x}px;
            top: ${pos.y}px;
            color: #4fc3f7;
            font-weight: bold;
            font-size: 18px;
            text-shadow: 0 0 5px #000;
            animation: floatUp 1s ease-out forwards;
            z-index: 2000;
            pointer-events: none;
        `;
        mana.textContent = `💙 +${amount}`;

        document.body.appendChild(mana);
        setTimeout(() => mana.remove(), 1000);
    },

    // 顯示DOT傷害
    showDOT(unit, amount, element) {
        // 使用showDamage with dot type
        this.showDamage(unit, amount, 'dot', false);
    },

    // 震動單位
    shakeUnit(unit) {
        const elem = document.getElementById(unit.type === 'player' ? 'player' : 'enemy');
        if (!elem) return;

        elem.classList.add('damaged');
        setTimeout(() => elem.classList.remove('damaged'), 300);
    },

    // 更新效果圖標
    updateEffects(unit) {
        const containerId = unit.type === 'player' ? 'player-effects' : 'enemy-effects';
        const container = document.getElementById(containerId);

        if (!container) return;

        // 清空
        container.innerHTML = '';

        // 添加效果圖標
        unit.effects.forEach(effect => {
            const icon = document.createElement('div');
            icon.className = 'effect-icon';
            icon.style.cssText = `
                display: inline-block;
                margin: 2px;
                padding: 4px 8px;
                background: rgba(0,0,0,0.7);
                border-radius: 4px;
                font-size: 12px;
                color: #fff;
            `;
            icon.textContent = `${effect.getIcon()} ${effect.remaining}`;
            icon.title = effect.name;
            container.appendChild(icon);
        });
    },

    // 更新回合指示器
    updateTurnIndicator(turn) {
        const indicator = document.getElementById('turn-indicator');
        if (!indicator) return;

        indicator.textContent = turn === 'player' ? '你的回合' : '敵方回合';
        indicator.style.color = turn === 'player' ? '#90ee90' : '#ff5555';
    },

    // 啟用/禁用操作
    enableActions(enabled) {
        const buttons = document.querySelectorAll('.skill-btn, .attack-btn');
        buttons.forEach(btn => {
            btn.disabled = !enabled;
            btn.style.opacity = enabled ? '1' : '0.5';
            btn.style.cursor = enabled ? 'pointer' : 'not-allowed';
        });
    },

    // 顯示訊息
    showMessage(text, type = 'info') {
        console.log(`[${type}] ${text}`);

        const msg = document.createElement('div');
        const colors = {
            'info': '#4fc3f7',
            'error': '#ff5555',
            'buff': '#90ee90',
            'debuff': '#ff8800',
            'damage': '#ff5555',
            'control': '#ffd700'
        };

        msg.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            padding: 15px 30px;
            background: rgba(0,0,0,0.9);
            color: ${colors[type] || '#fff'};
            font-size: 18px;
            font-weight: bold;
            border-radius: 8px;
            z-index: 9999;
            animation: fadeInOut 2s ease-out forwards;
            pointer-events: none;
        `;
        msg.textContent = text;

        document.body.appendChild(msg);
        setTimeout(() => msg.remove(), 2000);
    },

    // 顯示結果
    showResult(result, battle) {
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            inset: 0;
            background: rgba(0,0,0,0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
        `;

        const content = document.createElement('div');
        content.style.cssText = `
            background: #2a2520;
            padding: 40px;
            border-radius: 12px;
            text-align: center;
            color: #fff;
            min-width: 300px;
        `;

        const title = result === 'victory' ? '🎉 勝利!' : '💀 失敗';
        const color = result === 'victory' ? '#90ee90' : '#ff5555';

        content.innerHTML = `
            <h2 style="color: ${color}; font-size: 32px; margin-bottom: 20px;">${title}</h2>
            <div style="margin: 20px 0;">
                <p>造成傷害: ${battle.player.totalDamageDealt}</p>
                <p>承受傷害: ${battle.player.totalDamageTaken}</p>
                <p>治療量: ${battle.player.totalHealing}</p>
            </div>
            <button onclick="window.location.reload()" style="
                padding: 10px 30px;
                background: #444;
                color: #fff;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-size: 16px;
            ">返回</button>
        `;

        modal.appendChild(content);
        document.body.appendChild(modal);
    },

    // 獲取單位屏幕位置
    getUnitScreenPosition(unit) {
        const elem = document.getElementById(unit.type === 'player' ? 'player' : 'enemy');
        if (!elem) return { x: 0, y: 0 };

        const rect = elem.getBoundingClientRect();
        return {
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2 - 30
        };
    }
};

// 導出到全局
window.Effect = Effect;
window.BattleUnit = BattleUnit;
window.BattleManager = BattleManager;
window.AnimationManager = AnimationManager;
window.BattleUI = BattleUI;

console.log("✅ Battle Core v2.0 loaded successfully!");
