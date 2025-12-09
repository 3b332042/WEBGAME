// trial.js
// ===== 歷練系統：在單一彈窗內完成一系列分支選擇 =====
//
// 功能：
//   - 點「歷練」按鈕 → 打開歷練彈窗（列表模式）
//   - 在表格中點某行 → 進入該歷練的劇情模式（同一個彈窗裡切畫面）
//   - 劇情模式：顯示標題、描述、選項按鈕
//   - 點選項 → 寫入修行日誌（含你選了什麼），可進入下一節點或結束歷練
//   - 一趟歷練結束時，會一次顯示「本次歷練總收穫：攻擊+X、氣運+Y…」
//
// 依賴：
//   - 全域變數 / 函式：window, addLog, renderUI, randomInt, randomChance
//   - materials.js：addMaterial, getMaterialDef（可選，用於材料掉落）
//   - HTML 中有：
//       #btn-trial, #trial-modal, #trial-modal-bg, #trial-close-btn
//       #trial-view-list, #trial-view-story
//       #trial-story-title, #trial-story-text, #trial-story-choices, #trial-back-btn
//       .trial-table tbody tr    （歷練列表表格的列）

// ==========================================================
// 一、歷練總表 & 註冊函式（給各地圖檔案用）
// ==========================================================

// 統一的歷練總表（由各個檔案註冊進來）
const TrialTrees = {};

// 名稱快查
const TrialNameMap = {};

/**
 * 外部劇情檔用這個函式把自身註冊進來
 * @param {Object} trialDef - 單一歷練定義，例如 { id, name, startNodeId, nodes }
 */
function registerTrialTree(trialDef) {
    if (!trialDef || !trialDef.id) {
        console.warn("[trial.js] registerTrialTree 收到不合法的定義：", trialDef);
        return;
    }
    TrialTrees[trialDef.id] = trialDef;
    TrialNameMap[trialDef.id] = trialDef.name || trialDef.id;
}

// 如果要在 console 看得到
if (typeof window !== "undefined") {
    window.TrialTrees = TrialTrees;
    window.TrialNameMap = TrialNameMap;
    window.registerTrialTree = registerTrialTree;
}

// ===== 二、目前正在進行中的歷練狀態 =====
let currentTrialId = null;
let currentNodeId = null;

// 🔹 本次歷練總收穫暫存：{ "攻擊": 3, "氣運": 2, "材料": 5, ... }
let currentTrialGains = null;

// ==========================================================
// 三、套用歷練效果（支援屬性／勢力／材料／物品掉落）
// ==========================================================
function applyTrialEffects(effects = {}) {
    if (!effects) return;

    if (!currentTrialGains) currentTrialGains = {};
    const gains = currentTrialGains;

    function applyOne(field, delta, descKey) {
        if (typeof delta !== "number" || delta === 0) return;

        if (typeof window.state[field] !== "number") {
            window.state[field] = 0;
        }

        const before = window.state[field];
        window.state[field] += delta;

        // 特別處理 HP（不可低於 1）
        if (field === "hp") {
            const after = Math.max(1, window.state.hp);
            window.state.hp = after;
            delta = after - before;
        }
        // 真氣、靈石不可為負，同時修正實際 delta
        else if (field === "spiritStones" || field === "qi") {
            const after = Math.max(0, window.state[field]);
            window.state[field] = after;
            delta = after - before;
        }

        // 累積本次總收穫（顯示用）
        gains[descKey] = (gains[descKey] || 0) + delta;
    }

    // ===== 基礎屬性變動 =====
    applyOne("attack", effects.attackDelta, "攻擊");
    applyOne("defense", effects.defenseDelta, "防禦");
    applyOne("hp", effects.hpDelta, "生命");
    applyOne("mindset", effects.mindsetDelta, "心境");
    applyOne("luck", effects.luckDelta, "氣運");
    applyOne("spiritStones", effects.spiritStonesDelta, "靈石");
    applyOne("qi", effects.qiDelta, "真氣");

    // ===== 勢力：加入 / 聲望變動 =====

    // 加入勢力（例如青雲宗）
    if (effects.factionId && typeof joinFaction === "function") {
        const initialRep = typeof effects.initialFactionRep === "number"
            ? effects.initialFactionRep
            : window.state.factionRep || 0;
        joinFaction(effects.factionId, { initialRep });
    }

    // 變動勢力聲望
    if (typeof effects.factionRepDelta === "number") {
        if (typeof addFactionRep === "function") {
            addFactionRep(effects.factionRepDelta);
        } else {
            window.state.factionRep = Math.max(
                0,
                (window.state.factionRep || 0) + effects.factionRepDelta
            );
        }
    }

    // ===== 材料掉落（隨機） =====
    // effects.materialDrops: 陣列，每一個元素：
    //   { id: "beast_fang", min: 1, max: 3, chance: 0.6 }
    if (Array.isArray(effects.materialDrops) && typeof addMaterial === "function") {
        let totalMatCount = 0;

        effects.materialDrops.forEach(drop => {
            if (!drop || !drop.id) return;

            // 掉落機率（預設 100%）
            const chance = (typeof drop.chance === "number") ? drop.chance : 1;
            if (typeof randomChance === "function") {
                if (!randomChance(chance)) return;
            } else {
                // 沒有 randomChance 就簡單 Math.random
                if (Math.random() >= chance) return;
            }

            // 數量 min/max（沒寫 max 就用 min）
            const min = (typeof drop.min === "number") ? drop.min : 1;
            const max = (typeof drop.max === "number") ? drop.max : min;
            let count = min;
            if (typeof randomInt === "function") {
                count = randomInt(min, max);
            } else if (max > min) {
                count = min + Math.floor(Math.random() * (max - min + 1));
            }

            if (count <= 0) return;

            addMaterial(drop.id, count, { source: "歷練" });
            totalMatCount += count;
        });

        if (totalMatCount > 0) {
            gains["材料"] = (gains["材料"] || 0) + totalMatCount;
        }
    }

    // ===== 物品獎勵：單一給予（非隨機） =====
    // effects.giveItem: "itemId"
    // effects.giveItemCount: 數量（可選，預設 1）
    if (effects.giveItem) {
        const itemId = effects.giveItem;
        const count = (typeof effects.giveItemCount === "number" && effects.giveItemCount > 0)
            ? effects.giveItemCount
            : 1;

        if (typeof addItem === "function") {
            // 推薦路徑：items.js + inventory.js
            addItem(itemId, count);
        } else if (typeof addInventoryItem === "function") {
            // 備用：直接用背包 API
            addInventoryItem(itemId, count);
        }

        // 統計這一趟拿了多少件物品（顯示用，不分種類）
        gains["物品"] = (gains["物品"] || 0) + count;
    }

    // ===== 物品掉落表（隨機） =====
    // effects.itemDrops: 陣列，每一個元素：
    //   { id: "heal_pill_small", min: 1, max: 2, chance: 0.5 }
    if (Array.isArray(effects.itemDrops)) {
        let totalItemCount = 0;

        effects.itemDrops.forEach(drop => {
            if (!drop || !drop.id) return;

            const chance = (typeof drop.chance === "number") ? drop.chance : 1;
            if (typeof randomChance === "function") {
                if (!randomChance(chance)) return;
            } else {
                if (Math.random() >= chance) return;
            }

            const min = (typeof drop.min === "number") ? drop.min : 1;
            const max = (typeof drop.max === "number") ? drop.max : min;
            let count = min;
            if (typeof randomInt === "function") {
                count = randomInt(min, max);
            } else if (max > min) {
                count = min + Math.floor(Math.random() * (max - min + 1));
            }

            if (count <= 0) return;

            if (typeof addItem === "function") {
                addItem(drop.id, count);
            } else if (typeof addInventoryItem === "function") {
                addInventoryItem(drop.id, count);
            }

            totalItemCount += count;
        });

        if (totalItemCount > 0) {
            gains["物品"] = (gains["物品"] || 0) + totalItemCount;
        }
    }
}

// 🔹 歷練結束時，把本次總收穫寫入修行日誌
function logTrialTotalGains(trialName) {
    if (!currentTrialGains) return;

    const parts = [];
    for (const [name, val] of Object.entries(currentTrialGains)) {
        if (!val) continue;
        const sign = val > 0 ? "+" : "";
        parts.push(`${name}${sign}${val}`);
    }

    if (parts.length && typeof addLog === "function") {
        addLog(`本次在「${trialName}」的歷練總收穫：${parts.join("、")}。`, "great-event");
    }

    currentTrialGains = null;
}

// ==========================================================
// 四、UI 操作：切換列表 / 劇情視圖
// ==========================================================
function setupTrialUI() {
    const btnTrial = document.getElementById("btn-trial");
    const trialModal = document.getElementById("trial-modal");
    const trialModalBg = document.getElementById("trial-modal-bg");
    const trialCloseBtn = document.getElementById("trial-close-btn");

    const viewList = document.getElementById("trial-view-list");
    const viewStory = document.getElementById("trial-view-story");
    const storyTitleEl = document.getElementById("trial-story-title");
    const storyTextEl = document.getElementById("trial-story-text");
    const storyChoicesEl = document.getElementById("trial-story-choices");
    const trialBackBtn = document.getElementById("trial-back-btn");

    if (!btnTrial || !trialModal || !trialModalBg || !trialCloseBtn ||
        !viewList || !viewStory || !storyTitleEl || !storyTextEl || !storyChoicesEl || !trialBackBtn) {
        console.warn("[trial.js] 歷練相關 DOM 元素不完整，請檢查 HTML 結構。");
        return;
    }

    function showTrialListView() {
        viewList.style.display = "block";
        viewStory.style.display = "none";
    }

    function showTrialStoryView() {
        viewList.style.display = "none";
        viewStory.style.display = "block";
    }

    function openTrialModal() {
        trialModal.style.display = "block";
        trialModalBg.style.display = "block";
        updateTrialListUI(); // New: update UI status
        showTrialListView();
    }

    function closeTrialModal() {
        trialModal.style.display = "none";
        trialModalBg.style.display = "none";
        currentTrialId = null;
        currentNodeId = null;
        currentTrialGains = null;
    }

    // Check Status and Update Rows
    function updateTrialListUI() {
        if (!window.state) return;
        const completed = window.state.completedTrials || [];
        const rows = document.querySelectorAll(".trial-table tbody tr");

        rows.forEach(row => {
            const tid = row.getAttribute("data-trial-id");
            if (completed.includes(tid)) {
                row.classList.add("trial-completed");
                row.style.opacity = "0.5";
                row.style.pointerEvents = "none";
                row.style.cursor = "default";
                // Optional: Add a "Finished" badge?
                const cells = row.querySelectorAll("td");
                if (cells.length > 0 && !row.querySelector(".completed-badge")) {
                    // cells[0].innerHTML += ` <span class="completed-badge" style="color:red; font-size:12px;">(已完成)</span>`;
                    // Doing simple style change is safer for now.
                }
            } else {
                row.classList.remove("trial-completed");
                row.style.opacity = "1";
                row.style.pointerEvents = "auto";
                row.style.cursor = "pointer";
            }
        });
    }

    // 綁定按鈕
    btnTrial.addEventListener("click", openTrialModal);
    trialCloseBtn.addEventListener("click", closeTrialModal);
    trialModalBg.addEventListener("click", closeTrialModal);
    trialBackBtn.addEventListener("click", () => {
        showTrialListView();
        updateTrialListUI(); // Refresh list when coming back
    });

    // 歷練列表：點表格列 → 進入對應歷練
    const rows = document.querySelectorAll(".trial-table tbody tr");
    if (!rows.length) {
        console.warn("[trial.js] 找不到 .trial-table 的列，請確認 HTML 中有歷練表格。");
    }

    rows.forEach(row => {
        const trialId = row.getAttribute("data-trial-id");
        if (!trialId) return; // Allow rows without definition if placeholder

        row.style.cursor = "pointer";
        row.addEventListener("click", () => {
            startTrial(trialId);
        });
    });

    // ── 內部：開始某個歷練 ──
    function startTrial(trialId) {
        // Validation
        if (!window.state.completedTrials) window.state.completedTrials = [];
        if (window.state.completedTrials.includes(trialId)) {
            if (window.toast) window.toast("此地已歷練過，不可再入。", "warning");
            return;
        }

        const trial = TrialTrees[trialId];
        if (!trial) return;

        currentTrialId = trialId;
        currentNodeId = trial.startNodeId;
        currentTrialGains = {}; // 重置本次總收穫

        if (typeof addLog === "function") {
            addLog(`你踏上「${trial.name}」的歷練之路。`, "event");
        }

        showTrialStoryView();
        renderCurrentTrialNode();
    }

    // ── 內部：渲染當前節點 ──
    function renderCurrentTrialNode() {
        if (!currentTrialId || !currentNodeId) return;

        const trial = TrialTrees[currentTrialId];
        if (!trial) return;

        const node = trial.nodes[currentNodeId];
        if (!node) return;

        // 標題 / 內文
        storyTitleEl.textContent = node.title || trial.name;
        storyTextEl.textContent = node.text || "";

        // 清空舊選項
        storyChoicesEl.innerHTML = "";

        // 生成新的選項按鈕
        (node.choices || []).forEach(choice => {
            const btn = document.createElement("button");
            btn.className = "trial-choice-btn";
            btn.textContent = choice.label || "選項";

            btn.addEventListener("click", () => {
                // 0. 執行自定義回調（用於獎勵等）
                if (typeof choice.onSelect === "function") {
                    choice.onSelect();
                }

                // 1. 應用屬性／勢力／材料／物品效果
                if (choice.effects) {
                    applyTrialEffects(choice.effects);
                }

                // 2. 寫入日誌
                if (typeof addLog === "function" && choice.logText) {
                    addLog(choice.logText, "event");
                }

                // 3. 若有下一節點 → 繼續；否則結束歷練
                if (choice.next) {
                    currentNodeId = choice.next;
                    renderCurrentTrialNode();
                } else {
                    // 歷練結束
                    if (typeof addLog === "function") {
                        addLog(`你結束了在「${trial.name}」的一次歷練。`, "event");
                    }

                    // Mark as Completed
                    if (!window.state.completedTrials) window.state.completedTrials = [];
                    if (!window.state.completedTrials.includes(currentTrialId)) {
                        window.state.completedTrials.push(currentTrialId);
                    }

                    // ⭐ 在這裡輸出本次總收穫
                    logTrialTotalGains(trial.name);

                    // 關掉整個彈窗
                    closeTrialModal();
                }

                // 4. 更新 UI（屬性 / 戰力 / 勢力 / 背包顯示）
                if (typeof renderUI === "function") {
                    renderUI();
                }
            });

            storyChoicesEl.appendChild(btn);
        });
    }

    console.log("[trial.js] 歷練系統初始化完成。");
}

console.log("[trial.js] 歷練系統腳本載入完成，等待初始化。");

// DOM 都在 body 之後，但為了確保其他 trial 檔都註冊完，改成等 DOM 就緒後再初始化
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
        setupTrialUI();
        console.log("[trial.js] 歷練系統 DOMContentLoaded 後初始化完成。");
    });
} else {
    // 萬一 script 是在 DOM 完成後才動態載入
    setupTrialUI();
    console.log("[trial.js] 歷練系統立即初始化完成。");
}  
