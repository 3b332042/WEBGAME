// faction.js
// ========================
// 勢力系統 v4：宗門 + 聲望 + 貢獻 + 戰鬥晉升階級
// ========================
//
// 依賴：
//   gameState（state.js）
//   addLog / renderUI（main.js）
//
// 功能：
//   - 記錄玩家當前勢力（宗門）
//   - 記錄宗門聲望值 factionRep（用於任務、兌換等，不影響階級）
//   - 記錄宗門貢獻 factionContrib（用於兌換獎勵）
//   - ⭐ 階級由 factionRank 決定（通過榮譽堂戰鬥晉升獲得）
//   - joinFaction：加入勢力
//   - addFactionRep：增加 / 減少 勢力聲望（純資源，不影響階級）
//   - addFactionContrib：增加 / 減少 宗門貢獻
//   - spendFactionContrib：消耗貢獻（不足會失敗）
//   - renderFactionUI：更新左側「勢力」區塊顯示

// 目前可加入的勢力（之後要擴充可以在這裡加）
const Factions = {
    none: {
        id: "none",
        name: "無所屬",
        desc: "尚未拜入任何宗門，仍是自由散修。",
        // 無勢力就不搞 6 階了，單純一個「無」
        ranks: ["無"],
        repRequired: [0]
    },

    // 青雲宗：劍修正道（6 階）
    qingyun: {
        id: "qingyun",
        name: "青雲宗",
        desc: "以劍道聞名的正道大宗，講究劍心通明。",
        // 5階身分（刪除雜役弟子）
        ranks: [
            "外門弟子",   // 0
            "內門弟子",   // 1
            "真傳弟子",   // 2
            "執事長老",   // 3
            "太上長老"    // 4
        ],
        // 對應每一階所需聲望
        //      0        1        2        3        4
        repRequired: [0, 20, 60, 150, 400]
    },

    // 魔雲殿：魔道勢力（6 階）
    moyun: {
        id: "moyun",
        name: "魔雲殿",
        desc: "魔道勢力，重利輕義，以實力為尊。",
        ranks: [
            "雜役信徒",   // 0
            "記名弟子",   // 1
            "入殿弟子",   // 2
            "親傳弟子",   // 3
            "血祭護法",   // 4
            "魔殿尊者"    // 5
        ],
        repRequired: [0, 30, 80, 180, 450, 900]
    },

    // 丹盟：丹道組織（6 階）
    danmeng: {
        id: "danmeng",
        name: "丹盟",
        desc: "專精丹道的鬆散聯盟，以交易與配方著稱。",
        ranks: [
            "試藥童子",   // 0
            "外盟客卿",   // 1
            "內盟客卿",   // 2
            "丹閣執事",   // 3
            "盟內長老",   // 4
            "太上丹尊"    // 5
        ],
        repRequired: [0, 40, 100, 220, 500, 1000]
    }
};

// ===== 初始修正 =====
if (!state.faction) {
    state.faction = "none";
}
if (typeof state.factionRep !== "number") {
    state.factionRep = 0;
}

// ⭐ 新增：宗門貢獻初始值 =====
if (typeof state.factionContrib !== "number") {
    state.factionContrib = 0;
}

// 若存檔中的勢力 id 不存在，重置為 none
if (!Factions[state.faction]) {
    state.faction = "none";
    state.factionRep = 0;
    state.factionContrib = 0;
}

// ===== 工具：取得當前勢力物件 =====
function getFaction() {
    return Factions[state.faction] || Factions.none;
}

// 取得當前位階 index（0,1,2…）
// ⭐ 修改：直接使用 factionRank，不再根據聲望計算
function getFactionRankIndex() {
    const f = getFaction();
    if (f.id === "none") return 0;

    // 直接返回存檔中的 factionRank
    // 這個值由戰鬥晉升系統（123.html 的 handleVictory）來設定
    const rank = state.factionRank || 0;

    // 確保不超過該勢力的最大階級
    const maxRank = (f.ranks || []).length - 1;
    return Math.min(rank, maxRank);
}

// 取得當前位階名稱（顯示用）
function getFactionRank() {
    const f = getFaction();
    const idx = getFactionRankIndex();
    return f.ranks[idx] || "無";
}

// ⭐ 取得當前宗門貢獻（純讀取）=====
function getFactionContrib() {
    return state.factionContrib || 0;
}

// ===== UI：更新左側勢力顯示 =====
function renderFactionUI() {
    const f = getFaction();
    const nameEl = document.getElementById("s-faction-name");
    const repEl = document.getElementById("s-faction-rep");
    const rankEl = document.getElementById("s-faction-rank");
    const contribEl = document.getElementById("s-faction-contrib"); // ⭐ 新增：顯示宗門貢獻

    if (nameEl) nameEl.textContent = f.name;
    if (repEl) repEl.textContent = state.factionRep;
    if (rankEl) rankEl.textContent = getFactionRank();
    if (contribEl) contribEl.textContent = getFactionContrib();

    // ⭐ 修改：若沒加入宗門，則隱藏「前往宗門」按鈕
    const btnEnter = document.getElementById("btn-enter-faction");
    if (btnEnter) {
        if (f.id === "none") {
            btnEnter.style.display = "none";
        } else {
            // style.css 預設可能是 inline-block 或 block，這裡恢復顯示即可
            btnEnter.style.display = "inline-block";
        }
    }
}

// ===== 加入勢力 =====
//
// factionId: "qingyun" / "moyun" / "danmeng"... 
// options.initialRep: 初始聲望（例如 10）
// options.initialContrib: 初始貢獻（例如 100）
function joinFaction(factionId, options = {}) {
    if (!Factions[factionId]) return;

    const f = Factions[factionId];
    const oldFaction = getFaction();

    state.faction = factionId;
    state.factionRep = typeof options.initialRep === "number" ? options.initialRep : 0;
    // ⭐ 新增：加入新宗門時，重置宗門貢獻（或你想保留就自己改）
    state.factionContrib = typeof options.initialContrib === "number" ? options.initialContrib : 0;

    if (typeof addLog === "function") {
        if (oldFaction.id !== "none" && oldFaction.id !== f.id) {
            addLog(`你離開了「${oldFaction.name}」，改投「${f.name}」。`, "event");
        }
        addLog(`你正式加入「${f.name}」。`, "great-event");
    }

    renderFactionUI();
}

// ===== 增加 / 減少 聲望 =====
//
// ⭐ 修改：聲望現在只是一種資源，不再影響位階
// 位階完全由 factionRank（戰鬥晉升）決定
// amount: 正數 = 提升聲望；負數 = 降低聲望
// reason: 可選，用於 log 說明
function addFactionRep(amount, reason = "") {
    const f = getFaction();
    if (f.id === "none") return; // 無勢力不處理

    state.factionRep += amount;
    if (state.factionRep < 0) state.factionRep = 0;

    if (typeof addLog === "function") {
        const sign = amount > 0 ? "+" : "";
        const extra = reason ? `（${reason}）` : "";
        addLog(
            `你在「${f.name}」的聲望變動：${sign}${amount}，目前聲望：${state.factionRep}${extra}`,
            amount >= 0 ? "event" : "bad-event"
        );
    }

    renderFactionUI();
}

// ⭐ 新增：增加 / 減少 宗門貢獻 =====
//
// amount: 正數 = 獲得貢獻；負數 = 扣除貢獻（一般請用 spendFactionContrib）
// reason: 額外說明
// options:
//   alsoRep: number｜false   -> 例如每 +10 貢獻就 +1 聲望，可以在外面自己控制
function addFactionContrib(amount, reason = "", options = {}) {
    const f = getFaction();
    if (f.id === "none") return;

    const before = getFactionContrib();
    state.factionContrib += amount;

    if (state.factionContrib < 0) state.factionContrib = 0;

    const after = state.factionContrib;
    const delta = after - before;

    if (typeof addLog === "function" && delta !== 0) {
        const sign = delta > 0 ? "+" : "";
        const extra = reason ? `（${reason}）` : "";
        addLog(
            `你在「${f.name}」的宗門貢獻變動：${sign}${delta}，目前貢獻：${after}${extra}`,
            delta >= 0 ? "event" : "bad-event"
        );
    }

    // 若你想「貢獻帶動聲望」，可以在 options 裡控制
    if (options && typeof options.alsoRep === "number" && delta > 0) {
        // 例如：每 10 貢獻 +1 聲望，就在外面呼叫時傳 alsoRep = delta / 10 之類
        addFactionRep(options.alsoRep, "宗門貢獻帶來的聲望提升");
    }

    renderFactionUI();
}

// ⭐ 新增：消耗宗門貢獻（例如兌換獎勵）=====
//
// cost: 需要消耗的貢獻
// reason: 記錄在日誌裡的說明
// 回傳：true = 成功；false = 貢獻不足
function spendFactionContrib(cost, reason = "") {
    const f = getFaction();
    if (f.id === "none") return false;
    if (cost <= 0) return true;

    if (getFactionContrib() < cost) {
        if (typeof addLog === "function") {
            addLog(`你在「${f.name}」的宗門貢獻不足，無法進行：${reason || "兌換"}`, "bad-event");
        }
        return false;
    }

    state.factionContrib -= cost;
    if (state.factionContrib < 0) state.factionContrib = 0;

    if (typeof addLog === "function") {
        addLog(
            `你消耗了「${f.name}」的宗門貢獻 ${cost} 點，用於：${reason || "兌換獎勵"}。剩餘貢獻：${state.factionContrib}`,
            "event"
        );
    }

    renderFactionUI();
    return true;
}
