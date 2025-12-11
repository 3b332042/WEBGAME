// main.js
// ===== 遊戲主程式（事件綁定、遊戲迴圈邏輯） =====
// 依賴：
//   state.js   → GameStateManager / gameState / getTechniqueMultiplier
//   ui.js      → renderUI / renderLog / addLog
//   root.js    → getRootMultiplier / getRootName / assignRootElementsByRootCount / getRootElementsText / getElementAttackDesc
//   realms.js  → realmName / getQiCapForLevel / baseQiGainForRealm / getBreakRate / getLifeGainForLevel
//   events.js  → smallFortuneEvent
//   shop.js    → toggleShopModal（若有）
//   trial.js   → openTrialModal（若有）
//   inventory.js → toggleInventoryModal（若有）
//   faction.html（iframe）

// ===== 快捷 DOM 變數 =====
const btnC1 = document.getElementById("btn-cultivate-1");
const btnC10 = document.getElementById("btn-cultivate-10");
const btnC100 = document.getElementById("btn-cultivate-100");
const btnBr = document.getElementById("btn-breakthrough");
const btnSave = document.getElementById("btn-save");
const btnLoad = document.getElementById("btn-load");
const btnRes = document.getElementById("btn-reset");

const btnTrial = document.getElementById("btn-trial");
const btnShopToggle = document.getElementById("btn-toggle-shop");
const btnInventoryToggle = document.getElementById("btn-toggle-inventory");

// 宗門
const factionOverlay = document.getElementById("faction-overlay");
const factionFrame = document.getElementById("faction-frame");
const btnFactionBack = document.getElementById("btn-close-faction");

// 難度彈窗
const diffModal = document.getElementById("difficulty-modal");
const diffModalBg = document.getElementById("difficulty-modal-bg");
// ⭐ 只抓難度視窗裡的按鈕，避免抓到「開始測試」那顆
const diffButtons = document.querySelectorAll("#difficulty-modal .difficulty-btn");

// 靈根測試彈窗
const rootTestModal = document.getElementById("root-test-modal");
const rootTestBg = document.getElementById("root-test-bg");
const rollBtn = document.getElementById("btn-roll-root");
const rollResult = document.getElementById("root-roll-result");


// ===== 修煉邏輯 =====
function cultivate(years = 1) {
    if (GameStateManager.isDead()) {
        addLog("你已坐化，此世修行已盡。", "event");
        return;
    }

    for (let i = 0; i < years; i++) {
        state.age += 1;

        if (GameStateManager.isDead()) {
            if (state.deathReason) {
                // If death reason is already set (e.g. by event), don't overwrite it.
                // Event likely already scheduled victory screen, but let's break safely.
                break;
            }
            state.deathReason = "壽元耗盡，自然坐化";
            addLog("你壽元已盡，靜坐中悄然坐化。", "event");
            setTimeout(() => {
                showVictoryScreen(false); // false = 死亡結算
            }, 500);
            break;
        }

        const baseGain = baseQiGainForRealm(state.realmLevel);
        const techMult = getTechniqueMultiplier();
        const rootMult = getRootMultiplier();
        const randomBonus = GameStateManager.randomInt(0, state.comprehension);
        const gain = Math.floor(baseGain * techMult * rootMult) + randomBonus;

        state.qi += gain;

        if (GameStateManager.randomChance(0.1 + state.luck * 0.01)) {
            if (typeof smallFortuneEvent === "function") {
                smallFortuneEvent();
                // If event caused death, stop cultivating
                if (GameStateManager.isDead()) {
                    break;
                }
            }
        }
    }

    addLog(`你閉關修煉了 ${years} 年，真氣累積到 ${state.qi}/${state.qiCap}。`, "qi");

    if (typeof showToast === "function" && window.innerWidth <= 768) {
        const totalGain = state.qi - (state.qi - years * 10); // 這裡很難算精確 gain，暫時顯示最終真氣
        showToast(`修煉結束，真氣 ${state.qi}/${state.qiCap}`);
    }
    renderUI();
}

function seclusion100() {
    if (GameStateManager.isDead()) {
        addLog("你已坐化，此世修行已盡，無法再閉關。", "event");
        return;
    }

    if (state.lifespan <= 1000) {
        addLog("你目前總壽尚不足千年，貿然百年閉關只會讓人笑話，不如再多修行些時日。", "event");
        return;
    }

    cultivate(100);
}


// ===== 突破邏輯 =====
function calcBreakthroughRate() {
    let successRate = getBreakRate(state.realmLevel) || 0;

    successRate += (state.comprehension * 0.003);
    successRate += (state.mindset * 0.002);

    if (typeof state.breakBonus === "number") {
        successRate += state.breakBonus;
    }

    successRate = Math.min(successRate, 0.98);
    return successRate;
}

window.calcBreakthroughRate = calcBreakthroughRate;

function breakthrough() {
    if (GameStateManager.isDead()) {
        addLog("你已坐化，無法再突破。", "event");
        return;
    }
    if (state.qi < state.qiCap) {
        addLog("真氣尚未圓滿，暫難突破。", "event");
        return;
    }

    const successRate = calcBreakthroughRate();

    if (GameStateManager.randomChance(successRate)) {
        const cost = state.qiCap;
        state.qi -= cost;
        if (state.qi < 0) state.qi = 0;

        state.realmLevel += 1;
        state.qiCap = getQiCapForLevel(state.realmLevel);

        state.mindset += 1;
        const lifeGain = getLifeGainForLevel(state.realmLevel);
        state.lifespan += lifeGain;

        // New Scaling Formula for better late-game scaling
        // Atk Gain: ~ 3 + Level^1.5
        // Def Gain: ~ 2 + Level^1.4
        // HP Gain: ~ 20 + Level^1.8
        const level = state.realmLevel;
        const attackGain = Math.floor(2 + Math.pow(level, 1.5));
        const defenseGain = Math.floor(1 + Math.pow(level, 1.4));
        const hpGain = Math.floor(10 + Math.pow(level, 1.8));

        state.attack += attackGain;
        state.defense += defenseGain;
        state.maxHp += hpGain;
        state.hp += hpGain;

        addLog(
            `你成功突破至「${realmName(state.realmLevel)}」，消耗一輪真氣，壽元延長了 ${lifeGain} 年！（成功率 ${(successRate * 100).toFixed(1)}%）`,
            "break-success"
        );
        if (typeof showToast === "function" && window.innerWidth <= 768) {
            showToast("✨ 突破成功！ ✨", "success");
        }
        addLog(
            `境界提升帶來的好處：攻擊力 +${attackGain}、防禦力 +${defenseGain}、最大血量 +${hpGain}`,
            "great-event"
        );

        // 記錄大境界突破（用於結算畫面）
        const majorRealms = [10, 15, 20, 25, 30, 35, 40, 45, 50];
        if (majorRealms.includes(state.realmLevel)) {
            if (!state.realmHistory) state.realmHistory = [];
            state.realmHistory.push({
                level: state.realmLevel,
                age: state.age,
                name: realmName(state.realmLevel)
            });
        }
    } else {
        state.qi -= state.qiCap;
        if (state.qi < 0) state.qi = 0;

        state.mindset = Math.max(1, state.mindset - 1);
        const lose = GameStateManager.randomInt(1, 3);
        state.lifespan -= lose;

        addLog(
            `突破失敗！真氣反噬，你受了內傷，心境受損，壽元折損 ${lose} 年。（本次成功率 ${(successRate * 100).toFixed(1)}%）`,
            "break-fail"
        );
        if (typeof showToast === "function" && window.innerWidth <= 768) {
            showToast("💔 突破失敗...", "fail");
        }

        // 檢查是否因反噬致死
        if (GameStateManager.isDead()) {
            state.deathReason = "突破失敗反噬，壽元耗盡";
            addLog("你因突破失敗反噬過重，壽元耗盡，當場坐化。", "bad");
            setTimeout(() => {
                showVictoryScreen(false); // false = 死亡結算
            }, 500);
        }
    }

    renderUI();
}


// ===== 存讀檔包裝 =====
function handleSave() {
    if (GameStateManager.save()) {
        addLog("本次修行已記錄於命格之中（已存檔）。", "event");
    }
}

function handleLoad() {
    if (GameStateManager.load()) {
        addLog("你回想起前世的修行記憶（讀檔成功）。", "event");
        renderUI && renderUI();
        renderLog && renderLog();
    } else {
        addLog("沒有找到前世記錄。", "event");
    }
}

function handleReset() {
    if (GameStateManager.reset()) {
        // 重新啟用所有按鈕
        const btn1 = document.getElementById("btn-cultivate-1");
        const btn10 = document.getElementById("btn-cultivate-10");
        const btn100 = document.getElementById("btn-cultivate-100");
        const btnBr = document.getElementById("btn-breakthrough");
        const btnAsc = document.getElementById("btn-ascension");

        if (btn1) btn1.disabled = false;
        if (btn10) btn10.disabled = false;
        if (btn100) btn100.disabled = false;
        if (btnBr) btnBr.disabled = false;
        if (btnAsc) btnAsc.disabled = false;

        renderUI && renderUI();
        renderLog && renderLog();
        openDifficultyModal();
        addLog("你轉世重修，帶著模糊的記憶重新踏入修行之路。", "event");
    }
}


// ===== 飛升系統 =====
function getAscensionRate(level) {
    // 真仙初證(50) = 20%, 二階(51) = 40%, 三階(52) = 60%, 四階(53) = 80%, 圓滿(54) = 100%
    if (level >= 54) return 100;
    if (level >= 53) return 80;
    if (level >= 52) return 60;
    if (level >= 51) return 40;
    if (level >= 50) return 20;
    return 0;
}
window.getAscensionRate = getAscensionRate;

function ascension() {
    if (GameStateManager.isDead()) {
        addLog("你已坐化，無法飛升。", "event");
        return;
    }

    if (state.realmLevel < 50) {
        addLog("你的境界尚未達到真仙，無法嘗試飛升。", "event");
        return;
    }

    if (state.ascended) {
        addLog("你已經飛升成功，無需再次飛升。", "event");
        return;
    }

    const successRate = getAscensionRate(state.realmLevel) / 100;
    const realmStage = realmName(state.realmLevel);

    addLog(`你開始嘗試飛升...當前境界：${realmStage}，成功率：${(successRate * 100).toFixed(0)}%`, "event");

    // 飛升判定
    if (GameStateManager.randomChance(successRate)) {
        // 飛升成功
        state.ascended = true;
        state.age += 1; // 飛升消耗1年

        addLog("", "event");
        addLog("✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨", "great-event");
        addLog("【飛升成功】", "great-event");
        addLog("天地震動，九天雷劫降臨！", "great-event");
        addLog("你歷經九九八十一道天雷洗禮，", "great-event");
        addLog("肉身重塑，元神昇華，", "great-event");
        addLog("終於破碎虛空，飛升仙界！", "great-event");
        addLog("✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨", "great-event");

        // 顯示結算畫面
        setTimeout(() => {
            showVictoryScreen();
        }, 500);

    } else {
        // 飛升失敗 - 直接死亡
        addLog("", "bad");
        addLog("☠️☠️☠️☠️☠️☠️☠️☠️☠️☠️☠️☠️☠️☠️☠️", "bad");
        addLog("【飛升失敗】", "bad");
        addLog("", "bad");
        addLog("天劫降臨，雷霆萬鈞！", "bad");
        addLog("你的肉身在天雷中灰飛煙滅，", "bad");
        addLog("元神破碎，道基崩毀，", "bad");
        addLog("最終隕落於飛升之劫中...", "bad");
        addLog("", "bad");
        addLog("你，坐化了。", "bad");
        addLog("☠️☠️☠️☠️☠️☠️☠️☠️☠️☠️☠️☠️☠️☠️☠️", "bad");

        // 直接死亡
        state.deathReason = "飛升失敗，陨落於天劫";
        state.lifespan = state.age;
        state.hp = 0;

        // 顯示死亡結算畫面
        setTimeout(() => {
            showVictoryScreen(false); // false = 死亡結算
        }, 500);
    }

    renderUI();
}
window.ascension = ascension;

// ===== 顯示飛升結算畫面 =====
function showVictoryScreen(isAscension = true) {
    const modal = document.getElementById("ascension-victory-modal");
    const bg = document.getElementById("ascension-victory-bg");
    const statsContainer = document.getElementById("victory-final-stats");
    const timelineContainer = document.getElementById("victory-timeline");
    const header = modal?.querySelector(".ascension-victory-header span");

    if (!modal || !bg) return;

    // 根據是否飛升顯示不同標題
    if (header) {
        if (isAscension) {
            header.textContent = "✨ 飛升成功 ✨";
        } else {
            header.textContent = "☠️ 修行結束 ☠️";
        }
    }

    // 顯示模態框
    modal.style.display = "block";
    bg.style.display = "block";

    // 渲染最終數值
    if (statsContainer) {
        const stats = [
            { label: isAscension ? "飛升年齡" : "坐化年齡", value: `${state.age}歲` },
            { label: "最終境界", value: realmName(state.realmLevel) },
            { label: "靈根資質", value: getRootName(state.rootCount) },
            { label: "功法", value: getCurrentTechnique().name },
            { label: "悟性", value: state.comprehension },
            { label: "心境", value: state.mindset },
            { label: "攻擊力", value: state.attack },
            { label: "防禦力", value: state.defense },
            { label: "最大血量", value: state.maxHp },
            { label: "戰力", value: calcBattlePower ? calcBattlePower() : "N/A" }
        ];

        // 如果是死亡，在最前面添加死因
        if (!isAscension && state.deathReason) {
            stats.unshift({ label: "死亡原因", value: state.deathReason });
        }

        statsContainer.innerHTML = stats.map(stat => `
            <div class="victory-stat-item">
                <span class="victory-stat-label">${stat.label}：</span>
                <span class="victory-stat-value">${stat.value}</span>
            </div>
        `).join("");
    }

    // 渲染修煉歷程
    if (timelineContainer) {
        if (!state.realmHistory || state.realmHistory.length === 0) {
            timelineContainer.innerHTML = '<div style="text-align:center; color:#999;">無歷程記錄</div>';
        } else {
            timelineContainer.innerHTML = state.realmHistory.map(record => {
                const colorClass = getRealmColorClass(record.level);
                return `
                    <div class="timeline-item ${colorClass}">
                        <span class="timeline-age">${record.age}歲</span>
                        <span class="timeline-realm">${record.name}</span>
                    </div>
                `;
            }).join("");
        }
    }

    // 禁用所有修煉按鈕
    const btn1 = document.getElementById("btn-cultivate-1");
    const btn10 = document.getElementById("btn-cultivate-10");
    const btn100 = document.getElementById("btn-cultivate-100");
    const btnBr = document.getElementById("btn-breakthrough");
    const btnAsc = document.getElementById("btn-ascension");

    if (btn1) btn1.disabled = true;
    if (btn10) btn10.disabled = true;
    if (btn100) btn100.disabled = true;
    if (btnBr) btnBr.disabled = true;
    if (btnAsc) btnAsc.style.display = "none";
}
window.showVictoryScreen = showVictoryScreen;


// ===== 難度選擇彈窗 =====
function openDifficultyModal() {
    if (diffModal) diffModal.style.display = "block";
    if (diffModalBg) diffModalBg.style.display = "block";
}
window.openDifficultyModal = openDifficultyModal;

function closeDifficultyModal() {
    if (diffModal) diffModal.style.display = "none";
    if (diffModalBg) diffModalBg.style.display = "none";
}

function onDifficultyClick(e) {
    const btn = e.currentTarget;
    const root = parseInt(btn.getAttribute("data-root"), 10);
    if (!root || root < 1 || root > 5) return;

    state.rootCount = root;
    addLog(`你天賦為「${getRootName(root)}」。現在可測試真實五行靈根。`, "event");
    renderUI();
    closeDifficultyModal();

    openRootTestModal();
}

if (diffButtons && diffButtons.length > 0) {
    diffButtons.forEach(btn => btn.addEventListener("click", onDifficultyClick));
}


// ===== 靈根測試彈窗 =====
function openRootTestModal() {
    if (rootTestModal) rootTestModal.style.display = "block";
    if (rootTestBg) rootTestBg.style.display = "block";
    if (rollResult) rollResult.textContent = "按下「開始測試」以占測你的靈根。";
    if (rollBtn) rollBtn.disabled = false;
}
window.openRootTestModal = openRootTestModal;

function closeRootTestModal() {
    if (rootTestModal) rootTestModal.style.display = "none";
    if (rootTestBg) rootTestBg.style.display = "none";
}

if (rollBtn) {
    rollBtn.addEventListener("click", () => {
        if (rollBtn.disabled) return;
        rollBtn.disabled = true;

        const currentRootCount = state.rootCount || 1;
        assignRootElementsByRootCount(currentRootCount); // 幾靈根就抽幾屬

        GameStateManager.save();

        // ⭐ 更新靈根寶珠顏色
        const orb = document.querySelector(".spirit-orb");
        const orbContainer = document.querySelector(".spirit-orb-container");

        const elementColors = {
            "金": "#dbdbdb", // 銀白
            "木": "#4caf50", // 翠綠
            "水": "#2196f3", // 湛藍
            "火": "#ff5252", // 烈紅
            "土": "#ff8f00"  // 深土黃
        };

        if (orb && state.rootElements) {
            const colors = state.rootElements.map(e => elementColors[e] || "#ffffff");

            // 單屬性：純色光暈 + 徑向漸層
            // 多屬性：線性漸層混合
            if (colors.length === 1) {
                const c = colors[0];
                orb.style.background = `radial-gradient(circle at 30% 30%, #fff 0%, ${c} 40%, #000 100%)`;
                orb.style.boxShadow = `0 0 30px ${c}aa, inset 0 0 20px #fff`;
            } else {
                // 建構漸層字串
                const gradientStr = colors.join(", ");
                orb.style.background = `linear-gradient(135deg, ${gradientStr})`;
                // 多屬性時光暈用第一種顏色（或白色）
                orb.style.boxShadow = `0 0 30px ${colors[0]}88, inset 0 0 10px #fff`;
            }

            // 讓周圍粒子也變色（如果有選到的話）
            const particles = document.querySelector(".orb-particles");
            if (particles) {
                // 簡單處理：用第一種屬性的顏色做粒子
                particles.style.borderColor = `${colors[0]}33`;
                // 這裡沒法輕易改伪元素，暫時不動
            }
        }

        const rootName = getRootName(currentRootCount);
        const elementsText = Array.isArray(state.rootElements) && state.rootElements.length > 0
            ? state.rootElements.join("、")
            : "未知";

        if (rollResult) {
            rollResult.innerHTML = `<span style="font-size:1.2em; color:#fff;">${rootName}</span><br><span style="font-size:0.9em; color:#ccc;">${elementsText}</span>`;
        }

        addLog(`你占測了自身靈根：${rootName}，五行屬性為 ${elementsText}。`, "event");

        // 記錄初始境界（練氣一層）
        if (!state.realmHistory) state.realmHistory = [];
        if (state.realmHistory.length === 0) {
            state.realmHistory.push({
                level: 1,
                age: state.age,
                name: realmName(1)
            });
        }

        renderUI();

        setTimeout(() => {
            closeRootTestModal();
            rollBtn.disabled = false;
        }, 1000);
    });
}


// ===== 商店開關 =====
if (btnShopToggle) {
    btnShopToggle.addEventListener("click", () => {
        if (typeof window.toggleShopModal === "function") {
            window.toggleShopModal(true);
            return;
        }
        const modal = document.getElementById("shop-modal");
        const bg = document.getElementById("shop-modal-bg");
        if (modal && bg) {
            modal.style.display = "block";
            bg.style.display = "block";
        }
        if (typeof window.renderShop === "function") {
            window.renderShop();
        }
    });
}


// ===== 背包開關 =====
if (btnInventoryToggle) {
    btnInventoryToggle.addEventListener("click", () => {
        if (typeof window.toggleInventoryModal === "function") {
            window.toggleInventoryModal(true);
            return;
        }
        const modal = document.getElementById("inventory-modal");
        const bg = document.getElementById("inventory-modal-bg");
        if (modal && bg) {
            modal.style.display = "block";
            bg.style.display = "block";
        }
        if (typeof window.renderInventory === "function") {
            window.renderInventory();
        }
    });
}


// ===== 歷練開關 =====
if (btnTrial) {
    btnTrial.addEventListener("click", () => {
        if (typeof window.openTrialModal === "function") {
            window.openTrialModal();
        } else {
            addLog("歷練系統尚未實作。", "event");
        }
    });
}


// ===== 宗門開關（iframe 覆蓋層） =====
if (btnFactionBack) btnFactionBack.style.display = "none";

function openFaction() {
    // ⭐ 進入宗門前先存檔，避免修煉進度因離開宗門時的讀檔而遺失
    if (typeof GameStateManager !== "undefined") {
        GameStateManager.save();
    }
    if (factionOverlay) factionOverlay.style.display = "block";
    if (factionFrame) factionFrame.src = "faction.html";
}
window.openFaction = openFaction;

if (btnFactionBack) {
    btnFactionBack.addEventListener("click", () => {
        if (factionOverlay) factionOverlay.style.display = "none";

        if (typeof GameStateManager !== "undefined") {
            // GameStateManager.load(); <--- REMOVED: This causes rollback if iframe didn't save
            // Just sync UI
        }
        if (typeof renderUI === "function") {
            renderUI();
            console.log("UI refreshed");
        }
    });
}

if (factionFrame) {
    factionFrame.addEventListener("load", () => {
        try {
            const url = factionFrame.contentWindow.location.pathname;
            if (url && url.includes("faction.html")) {
                if (btnFactionBack) btnFactionBack.style.display = "block";
            } else {
                if (btnFactionBack) btnFactionBack.style.display = "none";
            }
        } catch (err) {
            // 可能跨來源，忽略
        }
    });
}


// ===== 主畫面按鈕綁定 =====
if (btnC1) btnC1.addEventListener("click", () => cultivate(1));
if (btnC10) btnC10.addEventListener("click", () => cultivate(10));
if (btnC100) btnC100.addEventListener("click", () => seclusion100());
if (btnBr) btnBr.addEventListener("click", () => breakthrough());

// 飛升按鈕
const btnAscension = document.getElementById("btn-ascension");
if (btnAscension) btnAscension.addEventListener("click", () => ascension());

if (btnSave) btnSave.addEventListener("click", () => handleSave());
if (btnLoad) btnLoad.addEventListener("click", () => handleLoad());
if (btnRes) btnRes.addEventListener("click", () => handleReset());

// 結算畫面關閉按鈕
const victoryCloseBtn = document.getElementById("victory-close-btn");
if (victoryCloseBtn) {
    victoryCloseBtn.addEventListener("click", () => {
        handleReset();
        const modal = document.getElementById("ascension-victory-modal");
        const bg = document.getElementById("ascension-victory-bg");
        if (modal) modal.style.display = "none";
        if (bg) bg.style.display = "none";
    });
}

// ===== 遊戲說明彈窗 =====
const btnHelp = document.getElementById("btn-help");
const helpModal = document.getElementById("help-modal");
const helpModalBg = document.getElementById("help-modal-bg");
const helpCloseBtn = document.getElementById("help-close-btn");

if (btnHelp) {
    btnHelp.addEventListener("click", () => {
        if (helpModal) helpModal.style.display = "block";
        if (helpModalBg) helpModalBg.style.display = "block";
    });
}

if (helpCloseBtn) {
    helpCloseBtn.addEventListener("click", () => {
        if (helpModal) helpModal.style.display = "none";
        if (helpModalBg) helpModalBg.style.display = "none";
    });
}

if (helpModalBg) {
    helpModalBg.addEventListener("click", () => {
        if (helpModal) helpModal.style.display = "none";
        if (helpModalBg) helpModalBg.style.display = "none";
    });
}

// ===== 初始化：進遊戲先格式化 state → 選難度 → 抽屬性 =====
(function initGame() {
    try {
        if (typeof GameStateManager !== "undefined") {
            // ⭐ 嘗試讀取存檔，若有存檔則載入，否則重置 (Opening a new game)
            if (!GameStateManager.load()) {
                console.log("No save found, starting fresh.");
                GameStateManager.reset();
                openDifficultyModal(); // 只有新遊戲才開難度選單
                addLog && addLog("你緩緩睜眼，準備選擇此世的天賦與靈根。", "event");
            } else {
                console.log("Save loaded successfully.");
                addLog && addLog("歡迎回到修仙模擬器。", "event");
            }
        }

        renderUI && renderUI();
        renderLog && renderLog();

        // openDifficultyModal and initial log handled above
    } catch (err) {
        console.error("Initialization Error:", err);
        setTimeout(() => {
            if (typeof addLog === "function") {
                addLog("❌ 遊戲初始化發生錯誤: " + err.message, "log-bad");
            }
        }, 500);
    }
})();

// ===== 四藝 UI 邏輯 =====

let currentArtTab = "alchemy";

function toggleArtsModal(show) {
    const modal = document.getElementById("arts-modal");
    const bg = document.getElementById("arts-modal-bg");

    if (!modal || !bg) return;

    if (show === true) {
        modal.style.display = "block";
        bg.style.display = "block";
        renderArtsUI();
    } else if (show === false) {
        modal.style.display = "none";
        bg.style.display = "none";
    } else {
        const isHidden = modal.style.display === "none" || modal.style.display === "";
        toggleArtsModal(isHidden);
    }
}
window.toggleArtsModal = toggleArtsModal;

function getGradeRarity(level) {
    if (level <= 2) return "white";
    if (level <= 4) return "green";
    if (level <= 6) return "blue";
    if (level <= 8) return "purple";
    return "orange";
}


function renderArtsUI() {
    if (!window.state || !window.state.arts) return;

    // 1. Ensure Layout Structure exists
    const modalContent = document.querySelector("#arts-modal .modal-content");
    if (!modalContent) return;

    // Check if layout is already initialized
    let container = document.getElementById("arts-container");
    if (!container) {
        modalContent.innerHTML = `
            <div id="arts-container">
                <div id="arts-sidebar">
                    <div id="arts-nav-list" style="flex:1; overflow-y:auto;">
                        <!-- Nav Buttons -->
                    </div>
                    <div class="arts-status-area">
                        <div class="arts-lvl-label">當前境界</div>
                        <div class="arts-lvl-val" id="arts-status-lvl">--</div>
                        <div class="arts-exp-bar">
                            <div class="arts-exp-fill" id="arts-status-exp-fill"></div>
                        </div>
                        <div style="font-size:11px; color:#666; margin-top:4px; text-align:right;" id="arts-status-exp-text">0/0</div>
                    </div>
                </div>
                <div id="arts-content-view">
                    <div id="arts-grid-list"></div>
                </div>
            </div>
        `;
        container = document.getElementById("arts-container");
    }

    // 2. Render Sidebar Tabs
    const tabs = [
        { id: "alchemy", label: "煉丹" },
        { id: "weapon", label: "煉器" },
        { id: "formation", label: "陣法" },
        { id: "talisman", label: "符籙" },
        { id: "smelting", label: "熔煉" }
    ];

    const navList = document.getElementById("arts-nav-list");
    if (navList) {
        navList.innerHTML = "";
        tabs.forEach(tab => {
            const btn = document.createElement("button");
            btn.className = `arts-nav-btn ${currentArtTab === tab.id ? "active" : ""}`;
            btn.innerHTML = `<span style="font-size:18px;">•</span> <span>${tab.label}</span>`;
            btn.onclick = () => {
                currentArtTab = tab.id;
                renderArtsUI();
            };
            navList.appendChild(btn);
        });
    }

    // 3. Render Status (Sidebar Bottom)
    const artData = window.state.arts[currentArtTab];
    const lvlDisplay = document.getElementById("arts-status-lvl");
    const expFill = document.getElementById("arts-status-exp-fill");
    const expText = document.getElementById("arts-status-exp-text");
    const statusArea = document.querySelector(".arts-status-area");

    if (currentArtTab === "smelting") {
        if (statusArea) statusArea.style.display = "none";
    } else {
        if (statusArea) statusArea.style.display = "block";
        if (artData && lvlDisplay) {
            const lvl = artData.level || 0;
            lvlDisplay.textContent = lvl > 0 ? `${lvl} 品` : "未入門";

            const nextExp = window.ArtsSystem.EXP_PER_LEVEL[lvl + 1];
            if (!nextExp) {
                if (expFill) expFill.style.width = "100%";
                if (expText) expText.textContent = "MAX";
            } else {
                const pct = Math.min(100, (artData.exp / nextExp) * 100);
                if (expFill) expFill.style.width = `${pct}%`;
                if (expText) expText.textContent = `${artData.exp}/${nextExp}`;
            }
        }
    }

    // 4. Render Main Content
    const gridList = document.getElementById("arts-grid-list");
    if (!gridList) return;

    // Save current scroll position (optional? maybe confusing if switching tabs)
    // gridList.innerHTML = ""; // Clear normally

    if (currentArtTab === "smelting") {
        gridList.innerHTML = "";
        gridList.style.display = "flex";
        gridList.style.flexDirection = "column";
        if (window.SmeltingSystem && typeof window.SmeltingSystem.renderInto === "function") {
            window.SmeltingSystem.renderInto(gridList);
        }
        return;
    }

    // Reset Grid Style
    gridList.style.display = "grid";
    gridList.innerHTML = "";

    const recipes = window.ArtsSystem.Recipes[currentArtTab];
    if (!recipes || recipes.length === 0) {
        gridList.innerHTML = `<div style="color:#666; padding:40px; text-align:center; grid-column:1/-1;">暫無配方</div>`;
        return;
    }

    if (!artData || artData.level === 0) {
        // Show info but maybe lock? Or just show tip?
        // User wants to see what's available?
        // Let's show "Learn first".
        gridList.innerHTML = `
            <div style="grid-column:1/-1; display:flex; flex-direction:column; align-items:center; justify-content:center; height:300px; color:#888;">
                <div style="font-size:40px; margin-bottom:20px; opacity:0.3;">🔒</div>
                <div>尚未習得此藝，請先研讀典籍入门</div>
                <div style="font-size:12px; margin-top:10px; color:#555;">(您可以在商店購買入門書籍)</div>
            </div>
        `;
        return;
    }

    // Filter and Sort Logic for Display
    let displayList = recipes.map((r, i) => ({ r, idx: i }));

    // User Request: Exclude "comp_tea"
    displayList = displayList.filter(item => item.r.id !== "comp_tea");

    // User Request: Sort by Rank (Level Req) Ascending
    displayList.sort((a, b) => a.r.levelReq - b.r.levelReq);

    // === 煉器專用：分類摺疊 ===
    if (currentArtTab === "weapon") {
        // 定義裝備類別
        const categories = [
            { id: "weapons", name: "法器 (武器)", keywords: ["sword", "blade", "spear"] },
            { id: "head", name: "頭部 (頭盔)", keywords: ["hat", "helm", "crown"] },
            { id: "body", name: "衣服 (護甲)", keywords: ["robe", "armor"] },
            { id: "legs", name: "褲子 (護腿)", keywords: ["pants", "leg"] },
            { id: "feet", name: "鞋子 (靴子)", keywords: ["shoes", "boots"] }
        ];

        // 按類別分組
        const grouped = {};
        categories.forEach(cat => grouped[cat.id] = []);

        displayList.forEach(item => {
            const itemDef = window.getItemDef(item.r.id);
            if (!itemDef) return;

            // 根據 slot 或 type 分類
            const slot = itemDef.slot || itemDef.type;
            if (slot === "weapon") grouped.weapons.push(item);
            else if (slot === "head") grouped.head.push(item);
            else if (slot === "body") grouped.body.push(item);
            else if (slot === "legs") grouped.legs.push(item);
            else if (slot === "feet") grouped.feet.push(item);
        });

        // 渲染分類摺疊
        categories.forEach(cat => {
            const items = grouped[cat.id];
            if (items.length === 0) return;

            // 創建分類標題
            const categoryHeader = document.createElement("div");
            categoryHeader.className = "arts-category-header";
            categoryHeader.style.cssText = `
                grid-column: 1/-1;
                padding: 12px 16px;
                background: linear-gradient(135deg, rgba(100, 80, 60, 0.3), rgba(80, 60, 40, 0.3));
                border-left: 4px solid #d4af37;
                border-radius: 4px;
                margin: 16px 0 8px 0;
                cursor: pointer;
                user-select: none;
                display: flex;
                justify-content: space-between;
                align-items: center;
                transition: all 0.2s;
            `;
            categoryHeader.innerHTML = `
                <span style="font-weight: bold; color: #ffd700; font-size: 15px;">${cat.name}</span>
                <span class="collapse-icon" style="color: #d4af37; font-size: 18px;">▼</span>
            `;

            // 創建分類容器
            const categoryContainer = document.createElement("div");
            categoryContainer.className = "arts-category-container";
            categoryContainer.style.cssText = `
                grid-column: 1/-1;
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
                gap: 16px;
                margin-bottom: 8px;
            `;

            // 摺疊切換
            let isCollapsed = false;
            categoryHeader.onclick = () => {
                isCollapsed = !isCollapsed;
                categoryContainer.style.display = isCollapsed ? "none" : "grid";
                categoryHeader.querySelector(".collapse-icon").textContent = isCollapsed ? "▶" : "▼";
            };

            gridList.appendChild(categoryHeader);

            // 渲染該類別的配方卡片
            items.forEach(({ r: recipe, idx }) => {
                const itemDef = window.getItemDef(recipe.id);
                const rarity = itemDef ? itemDef.rarity : "white";
                const desc = itemDef ? itemDef.desc : "暫無描述";
                const canCraft = artData.level >= recipe.levelReq;

                let matsHtml = "";
                recipe.materials.forEach(mat => {
                    const mDef = window.getItemDef(mat.id);
                    const mName = mDef ? mDef.name : mat.id;
                    const mRarity = mDef ? mDef.rarity : "white";
                    const invItem = state.inventory.find(i => i.id === mat.id);
                    const count = invItem ? invItem.count : 0;
                    const enough = count >= mat.count;

                    const qtyColor = enough ? "#4caf50" : "#ff5252";

                    matsHtml += `
                    <div class="mat-req-row">
                        <span class="rarity-${mRarity}">${mName}</span>
                        <span style="color:${qtyColor};">${count}/${mat.count}</span>
                    </div>
                    `;
                });

                const card = document.createElement("div");
                card.className = `arts-card ${canCraft ? '' : 'locked'}`;
                card.innerHTML = `
                    <div class="arts-card-header">
                        <div class="arts-card-title">
                            <span class="rarity-${rarity}">${recipe.name}</span>
                        </div>
                        <div class="arts-req-badge ${canCraft ? 'ok' : ''}">${recipe.levelReq}品</div>
                    </div>
                    <div style="font-size:12px; color:#aaa; margin-bottom:8px; line-height:1.4;">
                        ${desc}
                    </div>
                    <div class="arts-card-body">
                        ${matsHtml}
                    </div>
                    <div class="arts-card-footer">
                        <button class="arts-craft-btn" ${canCraft ? '' : 'disabled'}>
                            ${canCraft ? "煉製" : "品級不足"}
                        </button>
                    </div>
                `;

                if (canCraft) {
                    const btn = card.querySelector("button");
                    btn.onclick = () => {
                        window.ArtsSystem.craft(currentArtTab, idx);
                    };
                }

                categoryContainer.appendChild(card);
            });

            gridList.appendChild(categoryContainer);
        });

        return; // 煉器專用邏輯結束
    }

    // === 其他技藝：原有邏輯 ===
    displayList.forEach(({ r: recipe, idx }) => {
        const itemDef = window.getItemDef(recipe.id);
        const rarity = itemDef ? itemDef.rarity : "white";
        const desc = itemDef ? itemDef.desc : "暫無描述";
        const canCraft = artData.level >= recipe.levelReq;

        let matsHtml = "";
        recipe.materials.forEach(mat => {
            const mDef = window.getItemDef(mat.id);
            const mName = mDef ? mDef.name : mat.id;
            const mRarity = mDef ? mDef.rarity : "white";
            const invItem = state.inventory.find(i => i.id === mat.id);
            const count = invItem ? invItem.count : 0;
            const enough = count >= mat.count;

            const qtyColor = enough ? "#4caf50" : "#ff5252"; // Green : Red

            matsHtml += `
            <div class="mat-req-row">
                <span class="rarity-${mRarity}">${mName}</span>
                <span style="color:${qtyColor};">${count}/${mat.count}</span>
            </div>
            `;
        });

        const card = document.createElement("div");
        card.className = `arts-card ${canCraft ? '' : 'locked'}`;
        card.innerHTML = `
            <div class="arts-card-header">
                <div class="arts-card-title">
                    <span class="rarity-${rarity}">${recipe.name}</span>
                </div>
                <div class="arts-req-badge ${canCraft ? 'ok' : ''}">${recipe.levelReq}品</div>
            </div>
            <div style="font-size:12px; color:#aaa; margin-bottom:8px; line-height:1.4;">
                ${desc}
            </div>
            <div class="arts-card-body">
                ${matsHtml}
            </div>
            <div class="arts-card-footer">
                <button class="arts-craft-btn" ${canCraft ? '' : 'disabled'}>
                    ${canCraft ? "煉製" : "品級不足"}
                </button>
            </div>
        `;

        if (canCraft) {
            const btn = card.querySelector("button");
            btn.onclick = () => {
                // Use original index 'idx' for crafting
                window.ArtsSystem.craft(currentArtTab, idx);
            };
        }

        gridList.appendChild(card);
    });
}
window.renderArtsUI = renderArtsUI;



// Bind Events

// Fixed Toggle Function for Arts Modal
function toggleArtsModal(show) {
    const modal = document.getElementById("arts-modal");
    const bg = document.getElementById("arts-modal-bg");
    if (!modal || !bg) return;

    const isHidden = modal.style.display === "none" || modal.style.display === "";
    const target = (typeof show === "boolean") ? show : isHidden;

    if (target) {
        modal.style.display = "flex"; // Critical: Use Flex for the new layout
        bg.style.display = "block";

        // Ensure state
        if (typeof currentArtTab === "undefined" || !currentArtTab) window.currentArtTab = "alchemy";

        // Render UI
        if (window.renderArtsUI) window.renderArtsUI();
    } else {
        modal.style.display = "none";
        bg.style.display = "none";
    }
}
window.toggleArtsModal = toggleArtsModal;

// Bind Events (Using onclick to prevent duplicate listeners)
const btnArts = document.getElementById("btn-toggle-arts");
if (btnArts) {
    btnArts.onclick = () => toggleArtsModal();
}

const btnArtsClose = document.getElementById("arts-close-btn");
const bgArts = document.getElementById("arts-modal-bg");
if (btnArtsClose) btnArtsClose.onclick = () => toggleArtsModal(false);
if (bgArts) bgArts.onclick = () => toggleArtsModal(false);




// =============================
// 手機版分頁切換邏輯
// =============================
function initMobileTabs() {
    const navBtns = document.querySelectorAll(".nav-btn");
    const panels = [
        document.getElementById("left-panel"),
        document.getElementById("center-panel"),
        document.getElementById("right-panel")
    ];

    if (!navBtns.length) return;

    function switchTab(targetId) {
        // 1. 更新按鈕狀態
        navBtns.forEach(btn => {
            if (btn.getAttribute("data-target") === targetId) {
                btn.classList.add("active");
            } else {
                btn.classList.remove("active");
            }
        });

        // 2. 更新面板顯示
        panels.forEach(panel => {
            if (!panel) return;
            if (panel.id === targetId) {
                panel.classList.add("mobile-panel-active");
            } else {
                panel.classList.remove("mobile-panel-active");
            }
        });
    }

    // 綁定點擊事件
    navBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            const target = btn.getAttribute("data-target");
            switchTab(target);
        });
    });

    // 初始化：如果是在手機寬度，預設顯示中間（修煉）
    if (window.innerWidth <= 768) {
        switchTab("center-panel");
    }

    // 監聽視窗變動，自動適配
    window.addEventListener("resize", () => {
        if (window.innerWidth <= 768) {
            // 如果當前沒有 active 的面板，補一個預設
            const hasActive = panels.some(p => p && p.classList.contains("mobile-panel-active"));
            if (!hasActive) {
                switchTab("center-panel");
            }
        } else {
            // 桌面版：移除所有 active class，讓 CSS 恢復原狀
            panels.forEach(p => p && p.classList.remove("mobile-panel-active"));
        }
    });
}

// 在 DOMContentLoaded 或 window.onload 呼叫
window.addEventListener("DOMContentLoaded", initMobileTabs);


// =============================
// 移動端漂浮提示 (Toasts)
// =============================
function showToast(message, type = "normal") {
    // 防止過多 toast 堆疊
    const existingToasts = document.querySelectorAll(".toast-message");
    if (existingToasts.length > 2) {
        existingToasts[0].remove();
    }

    const toast = document.createElement("div");
    toast.className = "toast-message " + (type === "success" ? "toast-success" : type === "fail" ? "toast-fail" : "");
    toast.textContent = message;

    document.body.appendChild(toast);

    // 動畫進場
    requestAnimationFrame(() => {
        toast.classList.add("show");
    });

    // 自動消失
    setTimeout(() => {
        toast.classList.remove("show");
        setTimeout(() => toast.remove(), 500);
    }, 2000); // 顯示 2 秒
}
window.showToast = showToast;

