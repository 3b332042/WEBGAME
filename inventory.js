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

    invEl.innerHTML = "";

    state.inventory.forEach(item => {
        const def = window.getItemDef(item.id);
        if (!def) return;

        const rarityClass =
            (typeof window.getRarityClass === "function")
                ? window.getRarityClass(def.rarity)
                : "";

        const canUseObj =
            (typeof def.canUse === "function") ? def.canUse(window.state) : { ok: true };

        const disabledAttr = canUseObj.ok ? "" : "disabled";
        const disableMsg = canUseObj.ok ? "" : `（${canUseObj.reason}）`;

        const html = `
            <div class="inv-item">
                <div class="inv-item-header">
                    <span class="inv-item-name ${rarityClass}">${def.name}</span>
                    <span class="inv-item-count">x${item.count}</span>
                </div>

                <div class="inv-item-desc">${def.desc || ""}</div>
                <div class="inv-item-lore">${def.lore || ""}</div>
                <div class="inv-item-disable">${disableMsg}</div>

                <button class="inv-use-btn" data-id="${def.id}" ${disabledAttr}>
                    使用
                </button>
            </div>
        `;

        const wrapper = document.createElement("div");
        wrapper.innerHTML = html;
        invEl.appendChild(wrapper);
    });
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

    // 真正使用
    window.useItemFromInventory(id);

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
