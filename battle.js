// battle.js
// ===== 戰鬥與戰力計算模組 =====
// 依賴：
//   state.js → gameState, randomChance
//   root.js  → getElementRestraintMultiplier

// ===== 通用取值工具 =====

// 安全取得攻擊力
function getAttackPower(unit) {
    if (!unit) return 0;
    return typeof unit.attack === "number" ? unit.attack : 0;
}

// 安全取得防禦力
function getDefensePower(unit) {
    if (!unit) return 0;
    return typeof unit.defense === "number" ? unit.defense : 0;
}

// 安全取得暴擊率（0~1）
function getCritRate(unit) {
    if (!unit || typeof unit.critRate !== "number") return 0;
    return Math.max(0, Math.min(1, unit.critRate));
}

// 安全取得暴擊傷害加成（例如 0.5 = 額外 +50%）
function getCritDamageBonus(unit) {
    if (!unit || typeof unit.critDamage !== "number") return 0;
    return Math.max(0, unit.critDamage);
}

// 安全取得血量
function getMaxHp(unit) {
    if (!unit || typeof unit.maxHp !== "number") return 0;
    return Math.max(0, unit.maxHp);
}

// 取得境界等級（敵人也可以用同樣欄位）
function getRealmLevel(unit) {
    if (!unit || typeof unit.realmLevel !== "number") return 0;
    return Math.max(0, unit.realmLevel);
}

// 取得屬性攻擊（五行）
function getElementAttack(unit) {
    if (!unit) return null;
    // 你目前玩家用 elementAttack 當主屬性
    if (unit.elementAttack) return unit.elementAttack;
    // 如果敵人用 element / elementType 之類的，也兼容
    if (unit.element) return unit.element;
    if (unit.elementType) return unit.elementType;
    return null;
}

// ===== 防禦減傷計算 =====
// 使用一個常見公式：effectiveMultiplier = 1 - def / (def + K)
// K 越大，防禦效果越平滑；這裡先取 100 當常數
const DEF_CONST = 100;

function getDefenseReductionMultiplier(def) {
    if (def <= 0) return 1.0;
    const reduction = def / (def + DEF_CONST); // 0 ~ 1
    const multiplier = 1 - reduction;          // 1 = 無減傷，0 = 完全頂住
    return Math.max(0.2, multiplier);          // 至少保留 20% 傷害，不會完全打不動
}

// ===== 戰力計算 =====

// 給任意單位（玩家 / 怪物）計算戰力
function calcBattlePowerFromStats(unit) {
    if (!unit) return 0;

    const realmLevel = getRealmLevel(unit);
    const attack = getAttackPower(unit);
    const defense = getDefensePower(unit);
    const maxHp = getMaxHp(unit);
    const critRate = getCritRate(unit);
    const critDamage = getCritDamageBonus(unit);
    const comp = typeof unit.comprehension === "number" ? unit.comprehension : 0;
    const luck = typeof unit.luck === "number" ? unit.luck : 0;

    const realmScore = realmLevel * 20;
    const atkScore = attack * 5;
    const defScore = defense * 3;
    const hpScore = maxHp * 0.8;
    const critRateScore = critRate * 100 * 2;   // 每 1% 暴擊率 = 2 戰力
    const critDmgScore = critDamage * 100 * 1; // 每 1% 暴傷 = 1 戰力
    const compScore = comp * 2;
    const luckScore = luck * 1.5;

    return Math.floor(
        realmScore +
        atkScore +
        defScore +
        hpScore +
        critRateScore +
        critDmgScore +
        compScore +
        luckScore
    );
}

// 🔹 專門給玩家用（使用全域 gameState）
// 🔹 專門給玩家用（使用全域變數）
function calcBattlePower() {
    // 直接使用 window.state 作為 playerObj
    if (typeof window.state === "undefined") return 0;
    return calcBattlePowerFromStats(window.state);
}

// ===== 單次攻擊傷害計算 =====

// 計算「未進行暴擊判定」的基礎傷害
function calcBaseDamage(attacker, defender) {
    const atk = getAttackPower(attacker);
    const def = getDefensePower(defender);

    // 防禦減傷
    const defMult = getDefenseReductionMultiplier(def);

    // 境界壓制：高一階境界就多 3%，最多 ±30%
    const atkRealm = getRealmLevel(attacker);
    const defRealm = getRealmLevel(defender);
    let realmDiff = atkRealm - defRealm;
    let realmMult = 1 + realmDiff * 0.03;
    realmMult = Math.max(0.7, Math.min(1.3, realmMult));

    // 屬性相剋（使用 root.js 裡的 getElementRestraintMultiplier）
    const atkElem = getElementAttack(attacker);
    const defElem = getElementAttack(defender);
    let elemMult = 1.0;
    if (typeof getElementRestraintMultiplier === "function") {
        elemMult = getElementRestraintMultiplier(atkElem, defElem);
    }

    const raw = atk * defMult * realmMult * elemMult;
    return {
        damage: Math.max(1, Math.floor(raw)),
        detail: {
            defMult,
            realmMult,
            elemMult
        }
    };
}

// 執行一次攻擊（含暴擊），回傳結果
function performAttack(attacker, defender) {
    const baseResult = calcBaseDamage(attacker, defender);
    const critRate = getCritRate(attacker);
    const critBonus = getCritDamageBonus(attacker);

    let isCrit = false;
    let finalDamage = baseResult.damage;

    // 暴擊判定
    if (critRate > 0 && typeof randomChance === "function") {
        if (randomChance(critRate)) {
            isCrit = true;
            finalDamage = Math.floor(finalDamage * (1 + critBonus));
        }
    }

    return {
        damage: Math.max(1, finalDamage),
        isCrit,
        base: baseResult.damage,
        detail: baseResult.detail
    };
}

// 對 defender 直接套用傷害（會扣 HP），並回傳實際扣血
function applyDamage(attacker, defender) {
    if (!defender) return { damage: 0, isCrit: false };

    const result = performAttack(attacker, defender);

    if (typeof defender.hp === "number") {
        defender.hp = Math.max(0, defender.hp - result.damage);
    }

    return result;
}
