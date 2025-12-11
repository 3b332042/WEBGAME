// ===============================
//      inventory.js（背包 UI）
// ===============================

// 顯示背包內容
function renderInventory() {
    const invEl = document.getElementById("inventory-list");
    if (!invEl) return;

    if (!Array.isArray(state.inventory) || state.inventory.length === 0) {
        invEl.innerHTML = `<div class="inv-empty">背包空空如也。</div>`;
        return;
    }

    // 分類
    const consumables = [];
    const equipments = [];

    state.inventory.forEach(item => {
        const def = window.getItemDef(item.id);
        if (!def) return;

        // 判斷是否為裝備：有 slot 屬性或 type 是裝備部位
        const isEquip = def.equip || def.slot || ["weapon", "head", "body", "legs", "feet", "formation"].includes(def.type);

        if (isEquip) {
            equipments.push({ item, def });
        } else {
            consumables.push({ item, def });
        }
    });

    // 構建 HTML
    // 使用 CSS Grid 或 Flex 佈局
    let html = `
    <div class="inv-split-container" style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; height: 100%;">
        <!-- 左欄：消耗品 -->
        <div class="inv-column" style="display: flex; flex-direction: column; gap: 10px; min-width: 0;">
            <div class="inv-col-header" style="padding: 8px; background: rgba(0,0,0,0.3); border-bottom: 2px solid #5a4a3a; color: #e0d0b0; font-weight: bold;">
                消耗品 / 材料
            </div>
            <div class="inv-col-list" style="flex: 1; overflow-y: auto; padding-right: 4px; display: flex; flex-direction: column; gap: 8px;">
                ${consumables.length > 0 ? consumables.map(obj => renderItemCard(obj.item, obj.def)).join('') : '<div class="inv-empty-col">無</div>'}
            </div>
        </div>

        <!-- 右欄：裝備 -->
        <div class="inv-column" style="display: flex; flex-direction: column; gap: 10px; min-width: 0;">
            <div class="inv-col-header" style="padding: 8px; background: rgba(0,0,0,0.3); border-bottom: 2px solid #5a4a3a; color: #ffd700; font-weight: bold;">
                裝備 / 法寶
            </div>
            <div class="inv-col-list" style="flex: 1; overflow-y: auto; padding-right: 4px; display: flex; flex-direction: column; gap: 8px;">
                ${equipments.length > 0 ? equipments.map(obj => renderItemCard(obj.item, obj.def)).join('') : '<div class="inv-empty-col">無</div>'}
            </div>
        </div>
    </div>
    `;

    invEl.innerHTML = html;
}

// 輔助函式：渲染單個物品卡片
function renderItemCard(item, def) {
    const rarityClass = (typeof window.getRarityClass === "function") ? window.getRarityClass(def.rarity) : "";
    const canUseObj = (typeof def.canUse === "function") ? def.canUse(window.state) : { ok: true };
    const disabledAttr = canUseObj.ok ? "" : "disabled";
    // 如果是裝備，按鈕顯示 "裝備"，否則顯示 "使用"
    // 但 items.js 裡裝備的 use() 可能是裝備邏輯，也可能是空的。
    // 通常裝備會有 autoConsume: false。
    // 這裡我們統一調用 useItemFromInventory，讓 items.js 決定行為。
    // 不過為了 UX，按鈕文字可以變一下。
    const isEquip = def.equip || def.slot;
    const btnText = isEquip ? "裝備" : "使用";
    const disableMsg = canUseObj.ok ? "" : `（${canUseObj.reason}）`;

    return `
        <div class="inv-item" style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); padding: 8px; border-radius: 4px; display: flex; flex-direction: column; gap: 4px;">
            <div class="inv-item-header" style="display: flex; justify-content: space-between; align-items: center;">
                <span class="inv-item-name ${rarityClass}" style="font-weight: bold;">${def.name}</span>
                <span class="inv-item-count" style="color: #aaa; font-size: 0.9em;">x${item.count}</span>
            </div>

            <div class="inv-item-desc" style="font-size: 0.85em; color: #888;">${def.desc || ""}</div>
            ${def.lore ? `<div class="inv-item-lore" style="font-size: 0.8em; color: #555; font-style: italic;">${def.lore}</div>` : ''}
            ${disableMsg ? `<div class="inv-item-disable" style="color: #d32f2f; font-size: 0.8em;">${disableMsg}</div>` : ''}

            <button class="inv-use-btn" data-id="${def.id}" ${disabledAttr} 
                style="margin-top: 6px; padding: 4px 10px; cursor: pointer; background: #333; color: #ddd; border: 1px solid #555; border-radius: 3px;">
                ${btnText}
            </button>
        </div>
    `;
}

// ===============================
//     使用物品事件
// ===============================

document.addEventListener("click", (e) => {
    const btn = e.target;
    if (!btn.classList.contains("inv-use-btn")) return;

    const id = btn.getAttribute("data-id");
    if (!id) return;

    const def = window.getItemDef(id);
    if (!def) return;

    // 使用前檢查
    if (typeof def.canUse === "function") {
        const check = def.canUse(window.state);
        if (!check.ok) {
            if (window.showShopToast) {
                showShopToast(check.reason || "無法使用此物品。", "warn");
            }
            return;
        }
    }

    // 真正使用或裝備
    const isEquip = def.equip || def.slot || ["weapon", "head", "body", "legs", "feet", "formation"].includes(def.type);

    if (isEquip) {
        if (typeof window.equipItem === "function") {
            window.equipItem(id);
        } else {
            console.error("equipItem function not found!");
        }
    } else {
        window.useItemFromInventory(id);
    }

    // 重繪 UI
    if (typeof window.renderUI === "function") renderUI();
    renderInventory();
});

// ===============================
//     背包彈窗顯示/隱藏
// ===============================

function toggleInventoryModal(show) {
    const bg = document.getElementById("inventory-modal-bg");
    const modal = document.getElementById("inventory-modal");

    if (!bg || !modal) return;

    if (show === true) {
        bg.style.display = "block";
        modal.style.display = "block";
        renderInventory();
        return;
    }

    if (show === false) {
        bg.style.display = "none";
        modal.style.display = "none";
        return;
    }

    // 未指定 → 自動切換
    const isOpen = modal.style.display === "block";
    toggleInventoryModal(!isOpen);
}

// ===============================
//     綁定按鈕事件
// ===============================

document.addEventListener("DOMContentLoaded", () => {
    const btnOpen = document.getElementById("btn-toggle-inventory");
    const btnClose = document.getElementById("inventory-close-btn");
    const bg = document.getElementById("inventory-modal-bg");

    if (btnOpen) {
        btnOpen.addEventListener("click", () => toggleInventoryModal(true));
    }
    if (btnClose) {
        btnClose.addEventListener("click", () => toggleInventoryModal(false));
    }
    if (bg) {
        bg.addEventListener("click", () => toggleInventoryModal(false));
    }
});

// 導出
window.renderInventory = renderInventory;
window.toggleInventoryModal = toggleInventoryModal;

// ===============================
//     卸下裝備事件
// ===============================
document.addEventListener("click", (e) => {
    // 檢查是否點擊了裝備欄格子（.equipment-slot）
    const slotDiv = e.target.closest(".equipment-slot");
    if (!slotDiv) return;

    // 獲取部位名稱
    const slot = slotDiv.getAttribute("data-slot");
    if (!slot) return;

    // 檢查該部位是否有裝備
    if (window.state && window.state.equipment && window.state.equipment[slot]) {
        // 呼叫卸裝函式
        if (typeof window.unequipItem === "function") {
            window.unequipItem(slot);
        }
    }
});
