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
            }
        }
    }

    addLog(`你閉關修煉了 ${years} 年，真氣累積到 ${state.qi}/${state.qiCap}。`, "qi");
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

        const baseAttack = 1;
        const baseDefense = 1;
        const baseHp = 10;
        const realmBonus = 1 + Math.floor(state.realmLevel / 5) * 0.5;

        const attackGain = Math.floor(baseAttack * realmBonus);
        const defenseGain = Math.floor(baseDefense * realmBonus);
        const hpGain = Math.floor(baseHp * realmBonus);

        state.attack += attackGain;
        state.defense += defenseGain;
        state.maxHp += hpGain;
        state.hp += hpGain;

        addLog(
            `你成功突破至「${realmName(state.realmLevel)}」，消耗一輪真氣，壽元延長了 ${lifeGain} 年！（成功率 ${(successRate * 100).toFixed(1)}%）`,
            "break-success"
        );
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
    if (!window.ArtsSystem) return;

    const arts = window.state.arts;

    // Special handling for Smelting tab
    if (currentArtTab === "smelting") {
        if (window.SmeltingSystem && typeof window.SmeltingSystem.renderInto === "function") {
            const listEl = document.getElementById("arts-recipe-list");
            if (listEl) window.SmeltingSystem.renderInto(listEl);

            // Update Info Panel specific for Smelting is handled by renderInto or we do it here?
            // renderInto handles it.

            // Hide Level Display stuff if present
            const lvlEl = document.getElementById("art-level-display");
            const expEl = document.getElementById("art-exp-display");
            const bar = document.getElementById("art-exp-bar-container");
            if (lvlEl) lvlEl.innerHTML = "";
            if (expEl) expEl.style.display = "none";
            if (bar) bar.style.display = "none";
        }
        return;
    }

    const artData = arts[currentArtTab];

    // 更新等級顯示 & 進度條
    const lvlEl = document.getElementById("art-level-display");
    const expEl = document.getElementById("art-exp-display");

    if (lvlEl && expEl) {
        // 清空舊內容並重建結構
        const container = expEl.parentElement;
        // 保持 .arts-info-panel 結構，但我們會動態改變內部顯示

        if (!artData || artData.level === 0) {
            lvlEl.textContent = "未習得";
            expEl.innerHTML = `<span style="color:#888;">需使用對應典籍解鎖</span>`;
            // 如果有進度條容器，隱藏它
            let bar = document.getElementById("art-exp-bar-container");
            if (bar) bar.style.display = "none";
        } else {
            const gradeRarity = getGradeRarity(artData.level);
            lvlEl.innerHTML = `<span class="art-level-badge rarity-${gradeRarity}">${artData.level}品</span>`;

            const nextExp = window.ArtsSystem.EXP_PER_LEVEL[artData.level + 1];
            let pct = 0;
            let expText = "";

            if (!nextExp) {
                expText = "已達最高境界";
                pct = 100;
            } else {
                pct = Math.min(100, (artData.exp / nextExp) * 100);
                expText = `${artData.exp} / ${nextExp}`;
            }

            // 建立或更新進度條 HTML
            let barContainer = document.getElementById("art-exp-bar-container");
            if (!barContainer) {
                barContainer = document.createElement("div");
                barContainer.id = "art-exp-bar-container";
                barContainer.className = "art-exp-bar-bg";

                const fill = document.createElement("div");
                fill.id = "art-exp-bar-fill";
                fill.className = "art-exp-bar-fill";

                const text = document.createElement("div");
                text.id = "art-exp-bar-text";
                text.className = "art-exp-bar-text";

                barContainer.appendChild(fill);
                barContainer.appendChild(text);

                // Insert after expEl
                expEl.after(barContainer);
                // expEl mainly used for label now? hide it or use it for "Exp:" label
                expEl.style.display = "none";
            } else {
                barContainer.style.display = "block";
            }

            document.getElementById("art-exp-bar-fill").style.width = `${pct}%`;
            document.getElementById("art-exp-bar-text").textContent = expText;
        }
    }

    // 更新配方列表
    const listEl = document.getElementById("arts-recipe-list");
    if (!listEl) return;
    listEl.innerHTML = "";

    if (!artData || artData.level === 0) {
        listEl.innerHTML = `<div class="empty-tip">尚未習得此藝，請先研讀典籍。</div>`;
        return;
    }

    const recipes = window.ArtsSystem.Recipes[currentArtTab];
    if (!recipes || recipes.length === 0) {
        listEl.innerHTML = `<div class="empty-tip">暫無配方可供研習。</div>`;
        return;
    }

    recipes.forEach((recipe, index) => {
        const canCraft = artData.level >= recipe.levelReq;
        const itemDef = window.getItemDef(recipe.id); // 嘗試獲取成品定義以取得稀有度
        const rarity = itemDef ? itemDef.rarity : "white";
        const reqRarity = getGradeRarity(recipe.levelReq);

        let materialsHtml = "";
        recipe.materials.forEach(mat => {
            const def = window.getItemDef(mat.id);
            const name = def ? def.name : mat.id;

            const invItem = state.inventory.find(i => i.id === mat.id);
            const count = invItem ? invItem.count : 0;
            const hasEnough = count >= mat.count;
            const matClass = hasEnough ? "mat-enough" : "mat-missing";

            materialsHtml += `<span class="mat-chip ${matClass}">${name} ${count}/${mat.count}</span>`;
        });

        const div = document.createElement("div");
        div.className = `arts-item ${canCraft ? '' : 'locked'}`;

        div.innerHTML = `
            <div class="arts-item-header">
                <div class="arts-item-title rarity-${rarity}">
                    ${recipe.name} 
                    <span class="arts-req-badge rarity-${reqRarity} ${canCraft ? 'ok' : 'no'}">${recipe.levelReq}品</span>
                </div>
                <div class="arts-item-mats">
                    ${materialsHtml}
                </div>
            </div>
            <div class="arts-item-action">
                <button class="craft-btn" data-type="${currentArtTab}" data-idx="${index}" ${canCraft ? "" : "disabled"}>
                    ${canCraft ? "煉製" : "品級不足"}
                </button>
            </div>
        `;
        listEl.appendChild(div);
    });

    // Bind craft buttons
    const btns = listEl.querySelectorAll(".craft-btn");
    btns.forEach(btn => {
        btn.addEventListener("click", (e) => {
            const type = e.target.dataset.type;
            const idx = parseInt(e.target.dataset.idx);
            window.ArtsSystem.craft(type, idx);
        });
    });
}
window.renderArtsUI = renderArtsUI;


// Bind Events
const btnArts = document.getElementById("btn-toggle-arts");
if (btnArts) {
    btnArts.addEventListener("click", () => toggleArtsModal());
}

const btnArtsClose = document.getElementById("arts-close-btn");
const bgArts = document.getElementById("arts-modal-bg");
if (btnArtsClose) btnArtsClose.addEventListener("click", () => toggleArtsModal(false));
if (bgArts) bgArts.addEventListener("click", () => toggleArtsModal(false));

// Ensure Smelting Tab exists (Self-healing for cache issues)
const tabsContainer = document.querySelector(".arts-tabs");
if (tabsContainer) {
    let smeltingBtn = tabsContainer.querySelector('[data-type="smelting"]');
    if (!smeltingBtn) {
        smeltingBtn = document.createElement("button");
        smeltingBtn.className = "arts-tab-btn";
        smeltingBtn.dataset.type = "smelting";
        smeltingBtn.style.color = "#ffd700";
        smeltingBtn.textContent = "熔煉";
        tabsContainer.appendChild(smeltingBtn);

        // Bind event freshly
        smeltingBtn.addEventListener("click", (e) => {
            document.querySelectorAll(".arts-tab-btn").forEach(b => b.classList.remove("active"));
            e.target.classList.add("active");
            currentArtTab = "smelting";
            renderArtsUI();
        });
    }
}

// Re-bind all tabs just in case
const tabBtns = document.querySelectorAll(".arts-tab-btn");
tabBtns.forEach(btn => {
    // Remove old listeners? Hard to do without cloning.
    // We assume this runs once. If we added dynamic button, valid.
    btn.onclick = (e) => { // Use onclick override to be safe against multi-bind
        document.querySelectorAll(".arts-tab-btn").forEach(b => b.classList.remove("active"));
        e.target.classList.add("active");
        currentArtTab = e.target.dataset.type;
        renderArtsUI();
    };
});
