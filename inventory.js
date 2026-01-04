// ===============================
//      inventory.js（背包 UI）
// ===============================

// 當前選中的背包分頁
let currentInventoryTab = "materials"; // "materials", "consumables", "equipment"
let currentRarityFilter = "all"; // "all", "white", "green", "blue", "purple", "orange"
let currentSearchText = ""; // 搜索文字
let currentMaterialCategory = "all"; // "all", "pill", "weapon", "talisman", "formation"
let currentEquipmentTierFilter = "all"; // "all", "1", "2", "3", "4", "5", "6", "7", "8", "9"


// 顯示背包內容 - 分頁版本
function renderInventory() {
    const invEl = document.getElementById("inventory-list");
    if (!invEl) return;

    // 分類
    const materials = [];      // 材料
    const consumables = [];    // 消耗品(丹藥等)
    const equipments = [];     // 裝備

    // 如果背包有物品,進行分類
    if (Array.isArray(state.inventory) && state.inventory.length > 0) {
        state.inventory.forEach(item => {
            const def = window.getItemDef(item.id);
            if (!def) return;

            // 判斷是否為裝備：有 slot 屬性或 type 是裝備部位
            const isEquip = def.equip || def.slot || ["weapon", "head", "body", "legs", "feet", "formation"].includes(def.type);

            // 判斷是否為材料
            const isMaterial = def.type === "material" || (def.type && def.type.startsWith("material"));

            if (isEquip) {
                equipments.push({ item, def });
            } else if (isMaterial) {
                materials.push({ item, def });
            } else {
                consumables.push({ item, def });
            }
        });
    }

    // 構建 HTML - 分頁佈局
    let html = `
    <div class="inv-tabs-container">
        <!-- 分頁標籤 -->
        <div class="inv-tabs">
            <button class="inv-tab ${currentInventoryTab === 'materials' ? 'active' : ''}" onclick="switchInventoryTab('materials')">
                材料 (${materials.length})
            </button>
            <button class="inv-tab ${currentInventoryTab === 'consumables' ? 'active' : ''}" onclick="switchInventoryTab('consumables')">
                消耗品 (${consumables.length})
            </button>
            <button class="inv-tab ${currentInventoryTab === 'equipment' ? 'active' : ''}" onclick="switchInventoryTab('equipment')">
                裝備 (${equipments.length})
            </button>
        </div>

        <!-- 材料分類篩選 (只在材料分頁顯示) -->
        ${currentInventoryTab === 'materials' ? `
        <div class="inv-material-categories">
            <button class="inv-category-btn ${currentMaterialCategory === 'all' ? 'active' : ''}" onclick="setMaterialCategory('all')">
                全部
            </button>
            <button class="inv-category-btn ${currentMaterialCategory === 'pill' ? 'active' : ''}" onclick="setMaterialCategory('pill')">
                煉丹素材
            </button>
            <button class="inv-category-btn ${currentMaterialCategory === 'weapon' ? 'active' : ''}" onclick="setMaterialCategory('weapon')">
                煉器素材
            </button>
            <button class="inv-category-btn ${currentMaterialCategory === 'talisman' ? 'active' : ''}" onclick="setMaterialCategory('talisman')">
                符籙素材
            </button>
            <button class="inv-category-btn ${currentMaterialCategory === 'formation' ? 'active' : ''}" onclick="setMaterialCategory('formation')">
                陣法素材
            </button>
        </div>
        ` : ''}

        <!-- 篩選器 -->
        <div class="inv-filters">
            ${currentInventoryTab === 'equipment' ? `
            <div class="inv-filter-group">
                <label style="color: #b8a88f; font-size: 12px; margin-right: 8px;">品階:</label>
                <select class="inv-filter-select" onchange="setEquipmentTierFilter(this.value)">
                    <option value="all" ${currentEquipmentTierFilter === 'all' ? 'selected' : ''}>全部</option>
                    <option value="1" ${currentEquipmentTierFilter === '1' ? 'selected' : ''}>1品</option>
                    <option value="2" ${currentEquipmentTierFilter === '2' ? 'selected' : ''}>2品</option>
                    <option value="3" ${currentEquipmentTierFilter === '3' ? 'selected' : ''}>3品</option>
                    <option value="4" ${currentEquipmentTierFilter === '4' ? 'selected' : ''}>4品</option>
                    <option value="5" ${currentEquipmentTierFilter === '5' ? 'selected' : ''}>5品</option>
                    <option value="6" ${currentEquipmentTierFilter === '6' ? 'selected' : ''}>6品</option>
                    <option value="7" ${currentEquipmentTierFilter === '7' ? 'selected' : ''}>7品</option>
                    <option value="8" ${currentEquipmentTierFilter === '8' ? 'selected' : ''}>8品</option>
                    <option value="9" ${currentEquipmentTierFilter === '9' ? 'selected' : ''}>9品</option>
                </select>
            </div>
            ` : ''}
            <div class="inv-filter-group">
                <label style="color: #b8a88f; font-size: 12px; margin-right: 8px;">稀有度:</label>
                <select class="inv-filter-select" onchange="setRarityFilter(this.value)">
                    <option value="all" ${currentRarityFilter === 'all' ? 'selected' : ''}>全部</option>
                    <option value="white" ${currentRarityFilter === 'white' ? 'selected' : ''}>凡階</option>
                    <option value="green" ${currentRarityFilter === 'green' ? 'selected' : ''}>黃階</option>
                    <option value="blue" ${currentRarityFilter === 'blue' ? 'selected' : ''}>玄階</option>
                    <option value="purple" ${currentRarityFilter === 'purple' ? 'selected' : ''}>地階</option>
                    <option value="orange" ${currentRarityFilter === 'orange' ? 'selected' : ''}>天階</option>
                </select>
            </div>
            <div class="inv-filter-group">
                <input type="text" 
                    class="inv-search-input" 
                    placeholder="搜索物品名稱..." 
                    value="${currentSearchText}"
                    oninput="setSearchText(this.value)">
            </div>
            ${(currentRarityFilter !== 'all' || currentSearchText || currentEquipmentTierFilter !== 'all') ? `
                <button class="inv-clear-filters" onclick="clearFilters()">清除篩選</button>
            ` : ''}
        </div>

        <!-- 分頁內容 -->
        <div class="inv-tab-content">
            ${currentInventoryTab === 'materials' ? renderTabContent(materials, '材料') : ''}
            ${currentInventoryTab === 'consumables' ? renderTabContent(consumables, '消耗品') : ''}
            ${currentInventoryTab === 'equipment' ? renderTabContent(equipments, '裝備') : ''}
        </div>
    </div>
    `;

    invEl.innerHTML = html;
}

// 渲染分頁內容
function renderTabContent(items, tabName) {
    // 應用篩選
    let filteredItems = items;

    // 材料分類篩選 (只在材料分頁時生效)
    if (tabName === '材料' && currentMaterialCategory !== 'all') {
        filteredItems = filteredItems.filter(obj => {
            const id = obj.def.id || '';
            const tags = obj.def.tags || [];

            // 檢查 ID 前綴
            if (id.startsWith(currentMaterialCategory + '_')) {
                return true;
            }

            // 檢查 tags 陣列（用於橙色材料的特殊命名）
            // pill -> herb, weapon -> ore/weapon, talisman -> talisman/blood, formation -> formation/jade
            if (currentMaterialCategory === 'pill' && (tags.includes('pill') || tags.includes('herb'))) {
                return true;
            }
            if (currentMaterialCategory === 'weapon' && (tags.includes('weapon') || tags.includes('ore'))) {
                return true;
            }
            if (currentMaterialCategory === 'talisman' && (tags.includes('talisman') || tags.includes('blood'))) {
                return true;
            }
            if (currentMaterialCategory === 'formation' && (tags.includes('formation') || tags.includes('jade'))) {
                return true;
            }

            return false;
        });
    }

    // 裝備品階篩選 (只在裝備分頁時生效)
    if (tabName === '裝備' && currentEquipmentTierFilter !== 'all') {
        const targetTier = parseInt(currentEquipmentTierFilter);
        filteredItems = filteredItems.filter(obj => {
            const tier = obj.def.tier || window.getEquipmentTier(obj.def.id);
            return tier === targetTier;
        });
    }

    // 稀有度篩選
    if (currentRarityFilter !== 'all') {
        filteredItems = filteredItems.filter(obj => obj.def.rarity === currentRarityFilter);
    }

    // 名稱搜索
    if (currentSearchText) {
        const searchLower = currentSearchText.toLowerCase();
        filteredItems = filteredItems.filter(obj =>
            obj.def.name.toLowerCase().includes(searchLower) ||
            (obj.def.desc && obj.def.desc.toLowerCase().includes(searchLower))
        );
    }

    if (filteredItems.length === 0) {
        return `<div class="inv-empty">暫無符合條件的${tabName}</div>`;
    }

    return `
        <div class="inv-grid-area">
            ${filteredItems.map(obj => renderItemSlot(obj.item, obj.def)).join('')}
        </div>
    `;
}

// 切換背包分頁
function switchInventoryTab(tab) {
    currentInventoryTab = tab;
    // 切換到非材料分頁時,重置材料分類篩選
    if (tab !== 'materials') {
        currentMaterialCategory = 'all';
    }
    // 切換到非裝備分頁時,重置裝備品階篩選
    if (tab !== 'equipment') {
        currentEquipmentTierFilter = 'all';
    }
    renderInventory();
}

// 設置材料分類篩選
function setMaterialCategory(category) {
    currentMaterialCategory = category;
    renderInventory();
}

// 設置稀有度篩選
function setRarityFilter(rarity) {
    currentRarityFilter = rarity;
    renderInventory();
}

// 設置裝備品階篩選
function setEquipmentTierFilter(tier) {
    currentEquipmentTierFilter = tier;
    renderInventory();
}

// 設置搜索文字
function setSearchText(text) {
    currentSearchText = text;
    renderInventory();
}

// 清除所有篩選
function clearFilters() {
    currentRarityFilter = 'all';
    currentSearchText = '';
    currentMaterialCategory = 'all';
    currentEquipmentTierFilter = 'all';
    renderInventory();
}

window.switchInventoryTab = switchInventoryTab;
window.setMaterialCategory = setMaterialCategory;
window.setRarityFilter = setRarityFilter;
window.setEquipmentTierFilter = setEquipmentTierFilter;
window.setSearchText = setSearchText;
window.clearFilters = clearFilters;

// 輔助函式：渲染單個物品格子
function renderItemSlot(item, def) {
    const rarityClass = (typeof window.getRarityClass === "function") ? window.getRarityClass(def.rarity) : "";

    // 使用圖片作為背景
    const bgImage = def.image ? `background-image: url('${def.image}');` : '';

    return `
        <div class="inv-slot rarity-${def.rarity}" data-item-id="${def.id}" onclick="showItemDetail('${def.id}')">
            <div class="inv-slot-img" style="${bgImage}"></div>
            ${item.count > 1 ? `<div class="inv-slot-count">${item.count}</div>` : ''}
        </div>
    `;
}

// 輔助函式：渲染單個物品卡片（舊版，保留以防需要）
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
            ${def.image ? `<div class="inv-item-image material-img-border rarity-${def.rarity}" style="width: 100%; height: 120px; background: url('${def.image}') no-repeat center center; background-size: contain; border-radius: 4px; margin: 4px 0; background-color: rgba(0,0,0,0.3);"></div>` : ''}

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

        // 播放打開背包音效
        if (typeof SoundManager !== 'undefined') {
            SoundManager.play('inventoryOpen');
        }
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

// ===============================
//     物品詳情彈窗
// ===============================
function showItemDetail(itemId) {
    const item = window.state.inventory.find(i => i.id === itemId);
    const def = window.getItemDef(itemId);

    if (!item || !def) return;

    const rarityClass = (typeof window.getRarityClass === "function") ? window.getRarityClass(def.rarity) : "";
    const canUseObj = (typeof def.canUse === "function") ? def.canUse(window.state) : { ok: true };
    const disabledAttr = canUseObj.ok ? "" : "disabled";
    const isEquip = def.equip || def.slot;
    const btnText = isEquip ? "裝備" : "使用";
    const disableMsg = canUseObj.ok ? "" : `（${canUseObj.reason}）`;

    // 檢查是否為材料,並查找可用於製作的配方
    const isMaterial = def.type === "material" || (def.type && def.type.startsWith("material"));
    let craftingUsage = "";

    if (isMaterial && window.ArtsSystem && window.ArtsSystem.Recipes) {
        const recipes = [];

        // 遍歷所有四藝的配方
        for (const artType in window.ArtsSystem.Recipes) {
            const artRecipes = window.ArtsSystem.Recipes[artType];
            if (!Array.isArray(artRecipes)) continue;

            artRecipes.forEach(recipe => {
                // 檢查配方是否使用此材料
                if (recipe.materials && recipe.materials.some(mat => mat.id === itemId)) {
                    const artName = window.ArtsSystem.getArtName ? window.ArtsSystem.getArtName(artType) : artType;
                    const resultDef = window.getItemDef(recipe.id);
                    const resultName = resultDef ? resultDef.name : recipe.name;
                    const resultRarity = resultDef ? resultDef.rarity : "white";
                    const resultRarityClass = window.getRarityClass ? window.getRarityClass(resultRarity) : "";

                    recipes.push({
                        artName,
                        name: resultName,
                        rarityClass: resultRarityClass,
                        levelReq: recipe.levelReq
                    });
                }
            });
        }

        if (recipes.length > 0) {
            // 按等級排序
            recipes.sort((a, b) => a.levelReq - b.levelReq);

            craftingUsage = `
                <div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid rgba(255,255,255,0.1);">
                    <div style="color: #b8a88f; font-size: 13px; font-weight: bold; margin-bottom: 8px;">📜 可用於製作:</div>
                    <div style="max-height: 150px; overflow-y: auto; font-size: 12px;">
                        ${recipes.map(r => `
                            <div style="padding: 4px 0; display: flex; justify-content: space-between; align-items: center;">
                                <span class="${r.rarityClass}" style="flex: 1;">${r.name}</span>
                                <span style="color: #888; font-size: 11px; margin-left: 8px;">${r.artName} Lv.${r.levelReq}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }
    }

    // 創建彈窗
    const existingModal = document.getElementById("item-detail-modal");
    if (existingModal) existingModal.remove();

    const existingBg = document.getElementById("item-detail-modal-bg");
    if (existingBg) existingBg.remove();

    // 背景
    const bg = document.createElement("div");
    bg.id = "item-detail-modal-bg";
    bg.style.cssText = `
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.7);
        z-index: 3000;
        backdrop-filter: blur(2px);
    `;
    bg.onclick = () => closeItemDetail();

    // 彈窗
    const modal = document.createElement("div");
    modal.id = "item-detail-modal";
    modal.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 400px;
        max-width: 90vw;
        max-height: 80vh;
        overflow-y: auto;
        background: linear-gradient(135deg, #2a2520 0%, #1a1510 100%);
        border: 2px solid rgba(180, 150, 100, 0.5);
        border-radius: 12px;
        padding: 24px;
        z-index: 3001;
        box-shadow: 0 0 40px rgba(0, 0, 0, 0.9);
        color: #eee;
    `;

    modal.innerHTML = `
        <div style="text-align: center;">
            ${def.image ? `<div class="detail-img-large material-img-border rarity-${def.rarity}" style="background-image: url('${def.image}');"></div>` : ''}
            <div class="detail-title ${rarityClass}">${def.name}</div>
            <div class="detail-type">x${item.count}</div>
            <div class="detail-desc">${def.desc || ""}</div>
            ${def.lore ? `<div class="detail-lore">${def.lore}</div>` : ''}
            ${craftingUsage}
            ${disableMsg ? `<div style="color: #d32f2f; font-size: 0.9em; margin-bottom: 12px;">${disableMsg}</div>` : ''}
            <div class="detail-actions">
                ${!isMaterial ? `<button class="detail-btn btn-use" data-id="${def.id}" ${disabledAttr}>${btnText}</button>` : ''}
                <button class="detail-btn" onclick="closeItemDetail()">關閉</button>
            </div>
        </div>
    `;

    // 綁定使用按鈕事件
    const useBtn = modal.querySelector(".btn-use");
    if (useBtn) {
        useBtn.onclick = () => {
            if (isEquip) {
                if (typeof window.equipItem === "function") {
                    window.equipItem(itemId);
                }
            } else {
                window.useItemFromInventory(itemId);
            }
            closeItemDetail();
            if (typeof window.renderUI === "function") renderUI();
            renderInventory();
        };
    }

    document.body.appendChild(bg);
    document.body.appendChild(modal);
}

function closeItemDetail() {
    const modal = document.getElementById("item-detail-modal");
    const bg = document.getElementById("item-detail-modal-bg");
    if (modal) modal.remove();
    if (bg) bg.remove();
}

window.showItemDetail = showItemDetail;
window.closeItemDetail = closeItemDetail;
