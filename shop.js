// shop.js
// ===== 靈寶商店：只負責 UI + 扣靈石 + 呼叫 grantItem =====
//
// 依賴：
//   - gameState（state.js）
//   - ItemDB / getItemDef / grantItem（items.js）
//   - addLog、renderUI、renderInventory（可選，有就用）
//   - showShopToast（可選，有就用）
//
// HTML 依賴：
//   #shop-modal, #shop-modal-bg
//   #shop-list, #shop-balance, #shop-close-btn
//
// main.js 會呼叫 toggleShopModal(true) 來開啟商店

// =============================
// 小工具：日誌 / Toast
// =============================

function shopLog(text, type = "event") {
    if (typeof window.addLog === "function") {
        window.addLog(text, type);
    }
}
function shopToast(text, level = "info") {
    // 可選：先把舊的 toast 移除，避免一次太多
    const oldToasts = document.querySelectorAll(".shop-toast");
    oldToasts.forEach(el => el.remove());

    // 建立元素
    const toast = document.createElement("div");
    toast.className = "shop-toast";
    toast.textContent = text;

    // 依 level 調整左側那條顏色（可自行改色）
    if (level === "success") {
        toast.style.borderLeft = "4px solid #4caf50";
    } else if (level === "warn" || level === "warning") {
        toast.style.borderLeft = "4px solid #ffb300";
    } else if (level === "error") {
        toast.style.borderLeft = "4px solid #e53935";
    } else {
        // info
        toast.style.borderLeft = "4px solid #ffa726";
    }

    document.body.appendChild(toast);

    // 觸發 CSS 的 .show 動畫
    requestAnimationFrame(() => {
        toast.classList.add("show");
    });

    // 2 秒後消失
    setTimeout(() => {
        toast.classList.remove("show");
        setTimeout(() => toast.remove(), 300);
    }, 700);
}



// =============================
// DOM 抓取
// =============================

let currentShopCategory = "全部";

const shopModal = document.getElementById("shop-modal");
const shopModalBg = document.getElementById("shop-modal-bg");
const shopCloseBtn = document.getElementById("shop-close-btn");
const shopListEl = document.getElementById("shop-list");
const shopBalanceEl = document.getElementById("shop-balance");

// =============================
// 狀態初始化
// =============================

function ensureShopState() {
    if (!state.shopBuyCounts) {
        state.shopBuyCounts = {};
    }
    if (typeof state.spiritStones !== "number") {
        state.spiritStones = state.spiritStones || 0;
    }
}

// =============================
// 取得商店販售物品（從 ItemDB 讀）
// =============================

function getShopItemDefs() {
    if (!window.ItemDB) return [];
    return Object.values(window.ItemDB).filter(def => def.shop && def.shop.isShopItem);
}

function getSortedShopItemDefs() {
    const rarityWeight = {
        white: 1,
        green: 2,
        blue: 3,
        purple: 4,
        orange: 5
    };

    const items = getShopItemDefs();

    items.sort((a, b) => {
        const sa = (a.shop && a.shop.sort != null) ? a.shop.sort : 999;
        const sb = (b.shop && b.shop.sort != null) ? b.shop.sort : 999;
        if (sa !== sb) return sa - sb;

        const ra = rarityWeight[a.rarity] || 99;
        const rb = rarityWeight[b.rarity] || 99;
        if (ra !== rb) return ra - rb;

        const pa = (a.shop && a.shop.price) || 0;
        const pb = (b.shop && b.shop.price) || 0;
        return pa - pb;
    });

    return items;
}

// =============================
// 渲染商店 UI
// =============================

function renderShop(category) {
    if (category) {
        currentShopCategory = category;
    }
    const selectedCategory = currentShopCategory;

    ensureShopState();
    if (!shopListEl) return;

    // 上方靈石顯示
    if (shopBalanceEl) {
        shopBalanceEl.textContent = `💰 靈石：${state.spiritStones || 0}`;
    }

    shopListEl.innerHTML = "";

    const defs = getSortedShopItemDefs();
    if (!defs.length) {
        const div = document.createElement("div");
        div.textContent = "目前沒有可以購買的物品。";
        shopListEl.appendChild(div);
        return;
    }

    // 類別順序
    const categoryOrder = [
        "全部",
        "真氣恢復",
        "屬性提升",
        "戰鬥強化",
        "壽命體質",
        "靈根改造",
        "突破輔助",
        "功法卷軸",
        "保命道具"
    ];

    // 創建分類標籤欄
    const tabContainer = document.createElement("div");
    tabContainer.className = "shop-category-tabs";

    categoryOrder.forEach(cat => {
        const tab = document.createElement("button");
        tab.className = "shop-category-tab";
        if (cat === selectedCategory) {
            tab.classList.add("active");
        }
        tab.textContent = cat;
        tab.onclick = () => renderShop(cat);
        tabContainer.appendChild(tab);
    });

    shopListEl.appendChild(tabContainer);

    // 過濾物品
    let filteredDefs = defs;
    if (selectedCategory !== "全部") {
        filteredDefs = defs.filter(def => {
            const category = (def.shop && def.shop.category) || "其他";
            return category === selectedCategory;
        });
    }

    if (filteredDefs.length === 0) {
        const emptyMsg = document.createElement("div");
        emptyMsg.style.cssText = "text-align:center; padding:40px; color:#999; font-size:14px;";
        emptyMsg.textContent = "此類別暫無商品";
        shopListEl.appendChild(emptyMsg);
        return;
    }

    // 渲染物品
    filteredDefs.forEach(def => {
        const meta = def.shop || {};
        const price = meta.price || 0;
        const maxBuy = (typeof meta.maxBuy === "number") ? meta.maxBuy : null;
        const bought = state.shopBuyCounts[def.id] || 0;
        const remain = (maxBuy == null) ? Infinity : Math.max(0, maxBuy - bought);
        const soldOut = remain <= 0;

        const wrapper = document.createElement("div");
        wrapper.className = "shop-item";

        const rarityClass = window.getRarityClass ? window.getRarityClass(def.rarity) : "";

        let remainHtml = "";
        if (maxBuy != null) {
            remainHtml = `<span class="shop-remaining">剩餘：${remain}/${maxBuy}</span>`;
        }

        wrapper.innerHTML = `
            <div class="shop-item-header">
                <span class="shop-item-name ${rarityClass}">${def.name}</span>
                <span class="shop-price">${price} 靈石</span>
                ${remainHtml}
            </div>

            <div class="shop-item-body">
                <div class="shop-item-desc">${def.desc || ""}</div>
                <div class="shop-item-lore">${def.lore || ""}</div>
            </div>

            <div class="shop-buy-row" style="display:flex; align-items:center; gap:6px; margin-top:6px;">
                <button class="qty-btn minus" data-id="${def.id}" ${soldOut ? "disabled" : ""} style="width:28px;">−</button>

                <span class="shop-qty" data-id="${def.id}" style="min-width:24px; text-align:center;">1</span>

                <button class="qty-btn plus" data-id="${def.id}" ${soldOut ? "disabled" : ""} style="width:28px;">＋</button>

                <button class="shop-buy" data-id="${def.id}" ${soldOut ? "disabled" : ""} style="margin-left:10px;">
                    ${soldOut ? "售罄" : "購買"}
                </button>
            </div>
        `;

        shopListEl.appendChild(wrapper);
    });
}


// =============================
// 購買邏輯（扣靈石 + grantItem）
// =============================

function buyShopItem(itemId) {
    ensureShopState();
    console.log(">>> buyShopItem 執行了");

    const def = window.getItemDef ? window.getItemDef(itemId) : null;
    if (!def || !def.shop || !def.shop.isShopItem) {
        shopToast("此物品目前不可購買。", "warn");
        return;
    }

    const meta = def.shop;
    const price = meta.price || 0;
    const maxBuy = (typeof meta.maxBuy === "number") ? meta.maxBuy : null;
    const bought = state.shopBuyCounts[itemId] || 0;
    const remain = (maxBuy == null) ? Infinity : Math.max(0, maxBuy - bought);

    // ⭐ 找到 qty
    const qtyEl = shopListEl.querySelector(`.shop-qty[data-id="${itemId}"]`);
    let qty = qtyEl ? parseInt(qtyEl.textContent) : 1;
    if (isNaN(qty) || qty < 1) qty = 1;

    // ⭐ 檢查限購
    if (maxBuy != null && remain <= 0) {
        shopToast(`「${def.name}」已售罄。`, "warn");
        return;
    }
    if (qty > remain) {
        shopToast(`此物品最多只能再購買 ${remain} 個。`, "warn");
        qty = remain;
    }

    // ⭐ 檢查金額
    const totalCost = price * qty;
    if (totalCost > state.spiritStones) {
        shopToast(`靈石不足（需要 ${totalCost} 枚）。`, "error");
        return;
    }

    // ⭐ 扣除靈石
    state.spiritStones -= totalCost;

    // ⭐ 記錄購買次數
    state.shopBuyCounts[itemId] = bought + qty;

    // ⭐ 給物品
    if (typeof window.grantItem === "function") {
        grantItem(itemId, qty, { source: "shop" });
    }

    // ⭐ 成功提示！
    shopToast(`成功購買「${def.name}」x${qty}`, "success");
    shopLog(`你購買了「${def.name}」x${qty}（花費 ${totalCost} 靈石）`, "event");

    // ⭐ 刷新 UI
    if (window.renderUI) renderUI();
    if (window.renderInventory) renderInventory();
    renderShop();
}


window.buyShopItem = buyShopItem;

window.buyShopItem = buyShopItem;

// =============================
// 開關商店（給 main.js 用）
// =============================

function openShopModal() {
    if (!shopModal || !shopModalBg) return;
    shopModal.style.display = "block";
    shopModalBg.style.display = "block";
    renderShop();
}

function closeShopModal() {
    if (!shopModal || !shopModalBg) return;
    shopModal.style.display = "none";
    shopModalBg.style.display = "none";
}

function toggleShopModal(forceOpen) {
    if (!shopModal || !shopModalBg) return;

    let willOpen;
    if (forceOpen === true) {
        willOpen = true;
    } else if (forceOpen === false) {
        willOpen = false;
    } else {
        willOpen = (shopModal.style.display !== "block");
    }

    if (willOpen) {
        openShopModal();
    } else {
        closeShopModal();
    }
}
window.toggleShopModal = toggleShopModal;

// 關閉按鈕、背景點擊關閉
if (shopCloseBtn) {
    shopCloseBtn.addEventListener("click", () => {
        closeShopModal();
    });
}
if (shopModalBg) {
    shopModalBg.addEventListener("click", () => {
        closeShopModal();
    });
}

// 監聽「購買」按鈕
if (shopListEl) {
    shopListEl.addEventListener("click", (e) => {
        const btn = e.target.closest(".shop-buy");
        if (!btn) return;
        const id = btn.getAttribute("data-id");
        if (!id) return;

        buyShopItem(id);
    });// 處理數量 - / +
    shopListEl.addEventListener("click", (e) => {
        const minus = e.target.closest(".qty-btn.minus");
        const plus = e.target.closest(".qty-btn.plus");

        // ————— 減少 —————
        if (minus) {
            const id = minus.getAttribute("data-id");
            const qtyEl = shopListEl.querySelector(`.shop-qty[data-id="${id}"]`);
            let qty = parseInt(qtyEl.textContent);
            qty = Math.max(1, qty - 1);
            qtyEl.textContent = qty;
            return;
        }

        // ————— 增加 —————
        if (plus) {
            const id = plus.getAttribute("data-id");
            const qtyEl = shopListEl.querySelector(`.shop-qty[data-id="${id}"]`);

            const def = window.getItemDef(id);
            const meta = def.shop;
            const maxBuy = meta.maxBuy ?? null;
            const bought = state.shopBuyCounts[id] || 0;
            const remain = (maxBuy == null) ? Infinity : Math.max(0, maxBuy - bought);

            let qty = parseInt(qtyEl.textContent);
            qty = Math.min(remain, qty + 1);
            qtyEl.textContent = qty;
            return;
        }
    });

}

console.log("[shop.js] 靈寶商店初始化完成。");
