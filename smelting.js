// smelting.js
// 熔煉系統：分解 (Decompose) 與 合成 (Upgrade)

console.log("Loading smelting.js...");

const SmeltingSystem = {
    mode: "decompose", // "decompose" or "upgrade"

    // 初始化
    init() { },

    // Render into shared container
    renderInto(containerEl) {
        const infoPanel = document.querySelector("#arts-modal .arts-info-panel");

        containerEl.innerHTML = "";

        let subNav = document.getElementById("smelting-sub-nav");
        if (!subNav) {
            subNav = document.createElement("div");
            subNav.id = "smelting-sub-nav";
            subNav.style.display = "flex";
            subNav.style.gap = "10px";
            subNav.style.marginBottom = "10px";
            subNav.innerHTML = `
                <button class="craft-btn" onclick="SmeltingSystem.setMode('decompose')">分解</button>
                <button class="craft-btn" onclick="SmeltingSystem.setMode('upgrade')">合成</button>
            `;
            containerEl.appendChild(subNav);
        } else {
            containerEl.appendChild(subNav);
        }

        const contentDiv = document.createElement("div");
        contentDiv.style.flex = "1";
        contentDiv.style.overflowY = "auto";
        containerEl.appendChild(contentDiv);

        if (this.mode === "decompose") {
            if (infoPanel) infoPanel.innerHTML = "將多餘材料分解為靈石";
            this.renderDecomposeList(contentDiv);
        } else {
            if (infoPanel) infoPanel.innerHTML = "消耗 4 個任意同階材料，指定合成一個高階材料";
            this.renderUpgradeList(contentDiv);
        }
    },

    setMode(m) {
        this.mode = m;
        if (window.renderArtsUI) window.renderArtsUI();
    },

    renderDecomposeList(container) {
        if (!window.state || !window.state.inventory) return;
        const materials = window.state.inventory.filter(item => item.type === "material");

        if (materials.length === 0) {
            container.innerHTML = `<div class="empty-tip">背包中沒有可分解的材料。</div>`;
            return;
        }

        materials.forEach(item => {
            if (item.count <= 0) return;
            const div = document.createElement("div");
            div.className = "arts-item";
            let price = 5;
            if (item.rarity === "green") price = 15;
            if (item.rarity === "blue") price = 50;
            if (item.rarity === "purple") price = 150;
            if (item.rarity === "orange") price = 500;

            div.innerHTML = `
                <div class="arts-item-header">
                    <div class="arts-item-title rarity-${item.rarity}">
                        ${item.name} 
                        <span style="font-size:12px; color:#aaa; font-weight:normal;">(擁有: ${item.count})</span>
                    </div>
                    <div style="font-size:12px; color:#888;">分解可獲得: ${price} 靈石/個</div>
                </div>
                <div class="arts-item-action">
                    <button class="craft-btn" onclick="SmeltingSystem.decompose('${item.id}', 1)">分解 1</button>
                    <button class="craft-btn" onclick="SmeltingSystem.decompose('${item.id}', 10)">分解 10</button>
                    <button class="craft-btn" onclick="SmeltingSystem.decompose('${item.id}', 'all')">全部分解</button>
                </div>
            `;
            container.appendChild(div);
        });
    },

    decompose(id, amount) {
        const item = window.state.inventory.find(i => i.id === id);
        if (!item || item.count <= 0) return;
        let count = 0;
        if (amount === 'all') count = item.count;
        else count = parseInt(amount);
        if (count > item.count) count = item.count;

        let price = 5;
        if (item.rarity === "green") price = 15;
        if (item.rarity === "blue") price = 50;
        if (item.rarity === "purple") price = 150;
        if (item.rarity === "orange") price = 500;

        const totalEarn = price * count;
        item.count -= count;
        if (item.count <= 0) {
            window.state.inventory = window.state.inventory.filter(i => i.id !== id);
        }
        window.state.spiritStones = (window.state.spiritStones || 0) + totalEarn;
        if (window.toast) window.toast(`分解成功 +${totalEarn}靈石`, "success");
        if (window.renderArtsUI) window.renderArtsUI();
    },

    // Targeted Synthesis: List all craftable high-tier items with Collapsible Categories (Arts > Rarity)
    renderUpgradeList(container) {
        const DB = window.MATERIAL_DB || {};
        const targets = Object.values(DB).filter(i => i.type === "material" && i.rarity !== "white");

        if (targets.length === 0) {
            container.innerHTML = `<div class="empty-tip">暫無可合成的高階材料。</div>`;
            return;
        }

        // Helper: Get Art Type
        const getArtType = (item) => {
            if (item.tags) {
                if (item.tags.includes("pill")) return "pill";
                if (item.tags.includes("weapon")) return "weapon";
                if (item.tags.includes("talisman")) return "talisman";
                if (item.tags.includes("formation")) return "formation";
            }
            if (item.type === "material_pill") return "pill";
            if (item.type === "material_weapon") return "weapon";
            if (item.type === "material_talisman") return "talisman";
            if (item.type === "material_formation") return "formation";
            return "misc";
        };

        const ARTS = [
            { id: "pill", name: "丹道 (醫術)", open: true },
            { id: "weapon", name: "器道 (鍛造)", open: false },
            { id: "talisman", name: "符道 (符籙)", open: false },
            { id: "formation", name: "陣道 (陣法)", open: false }
        ];

        const RARITIES = [
            { id: "orange", name: "天階 (傳說)" },
            { id: "purple", name: "地階 (史詩)" },
            { id: "blue", name: "玄階 (稀有)" },
            { id: "green", name: "黃階 (優質)" }
        ];

        const PREV_TIER_MAP = {
            "green": { id: "white", name: "凡階" },
            "blue": { id: "green", name: "黃階" },
            "purple": { id: "blue", name: "玄階" },
            "orange": { id: "purple", name: "地階" }
        };

        ARTS.forEach(art => {
            // Filter targets belonging to this art
            const artTargets = targets.filter(t => getArtType(t) === art.id);
            if (artTargets.length === 0) return;

            // Art Section Details
            const artDetails = document.createElement("details");
            artDetails.className = "smelting-category art-section";
            artDetails.style.marginBottom = "10px";
            artDetails.style.border = "1px solid #444";
            if (art.open) artDetails.open = true;

            const artSummary = document.createElement("summary");
            artSummary.className = "smelting-header";
            artSummary.style.background = "#222";
            artSummary.style.borderBottom = "1px solid #444";
            artSummary.innerHTML = `<span style="font-size:1.1em; color:#ddd;">${art.name}</span>`;
            artDetails.appendChild(artSummary);

            const artContent = document.createElement("div");
            artContent.style.padding = "10px";

            RARITIES.forEach(rarity => {
                const groupItems = artTargets.filter(t => t.rarity === rarity.id);
                if (groupItems.length === 0) return;

                // Rarity Header
                const rarityHeader = document.createElement("div");
                rarityHeader.innerHTML = `<div class="rarity-${rarity.id}" style="margin: 10px 0 5px 0; font-weight:bold; border-bottom:1px dashed #555;">${rarity.name}</div>`;
                artContent.appendChild(rarityHeader);

                // Grid
                const grid = document.createElement("div");
                grid.className = "smelting-grid";

                groupItems.forEach(target => {
                    const prev = PREV_TIER_MAP[target.rarity];
                    if (!prev) return;

                    // Calculate Inventory: MUST be Same Art & Prev Tier
                    const prevTierID = prev.id;

                    // DEBUG: Log all inventory items
                    console.log(`[Smelting Debug] Looking for ${art.id} materials with rarity ${prevTierID} for target ${target.name}`);
                    console.log('[Smelting Debug] All inventory items:', window.state.inventory);

                    const mats = window.state.inventory.filter(i => {
                        // More robust material check
                        const isMat = i.type === "material" || (i.type && i.type.startsWith("material"));
                        const correctRarity = i.rarity === prevTierID;
                        const correctArt = getArtType(i) === art.id;

                        // DEBUG: Log each check
                        if (isMat && correctRarity) {
                            console.log(`[Smelting Debug] Item ${i.name}: isMat=${isMat}, rarity=${i.rarity}(need ${prevTierID}), art=${getArtType(i)}(need ${art.id})`);
                        }

                        if (!isMat) return false;
                        if (!correctRarity) return false;
                        return correctArt;
                    });

                    console.log(`[Smelting Debug] Found ${mats.length} matching materials:`, mats);

                    const totalCount = mats.reduce((sum, i) => sum + i.count, 0);
                    const canCraft = totalCount >= 4;

                    const div = document.createElement("div");
                    div.className = `arts-item ${canCraft ? "" : "locked"}`;

                    // Build material selection UI with clickable cards
                    let matsHtml = '';
                    if (canCraft) {
                        matsHtml = '<div style="margin: 10px 0; padding: 10px; background: #1a1a1a; border-radius: 4px;">';
                        matsHtml += '<div style="font-size: 12px; color: #888; margin-bottom: 8px;">點擊材料來選擇（可重複點擊，需選4個）：</div>';
                        matsHtml += '<div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 8px;">';

                        mats.forEach(mat => {
                            matsHtml += `
                                <div class="material-card" 
                                    data-mat-id="${mat.id}"
                                    data-target-id="${target.id}"
                                    data-max-count="${mat.count}"
                                    data-selected-count="0"
                                    onclick="SmeltingSystem.toggleMaterialSelection(this, event)"
                                    oncontextmenu="SmeltingSystem.toggleMaterialSelection(this, event); return false;"
                                    style="
                                        padding: 10px;
                                        background: #2a2a2a;
                                        border: 2px solid #444;
                                        border-radius: 4px;
                                        cursor: pointer;
                                        transition: all 0.2s;
                                        text-align: center;
                                    ">
                                    <div class="rarity-${mat.rarity}" style="font-size: 12px; font-weight: bold; margin-bottom: 4px;">${mat.name}</div>
                                    <div style="font-size: 10px; color: #666;">擁有: ${mat.count}</div>
                                    <div class="selection-badge" style="
                                        margin-top: 6px;
                                        padding: 2px 8px;
                                        background: #1a1a1a;
                                        border-radius: 10px;
                                        font-size: 11px;
                                        color: #888;
                                        display: none;
                                    ">已選: <span class="count">0</span></div>
                                </div>
                            `;
                        });

                        matsHtml += '</div>';
                        matsHtml += '<div id="selection-count-' + target.id + '" style="margin-top: 8px; font-size: 12px; color: #ffd700;">已選: 0/4</div>';
                        matsHtml += '</div>';
                    }

                    div.innerHTML = `
                        <div class="arts-item-header">
                            <div class="arts-item-title rarity-${target.rarity}">${target.name}</div>
                            <div class="arts-req-badge ${canCraft ? 'ok' : ''}">需要同道${prev.name} x4</div>
                        </div>
                        <div style="padding: 0 10px 10px 10px;">
                            <div style="font-size:12px; color:#aaa; margin-bottom:8px;">${target.desc}</div>
                            ${canCraft ? matsHtml : `
                                <div style="font-size:12px; color:#888; margin-bottom:8px;">
                                    同道${prev.name}總量: ${totalCount}
                                </div>
                            `}
                            <button class="craft-btn" 
                                id="synth-btn-${target.id}"
                                onclick="SmeltingSystem.synthesizeTargetManual('${target.id}')" 
                                ${canCraft ? "" : "disabled"}>
                                ${canCraft ? "合成" : "材料不足"}
                            </button>
                        </div>
                    `;
                    grid.appendChild(div);
                });
                artContent.appendChild(grid);
            });

            artDetails.appendChild(artContent);
            container.appendChild(artDetails);
        });
    },

    // Toggle material selection (click-based with counter)
    toggleMaterialSelection(cardElement, event) {
        const targetId = cardElement.getAttribute('data-target-id');
        const maxCount = parseInt(cardElement.getAttribute('data-max-count'));
        let selectedCount = parseInt(cardElement.getAttribute('data-selected-count')) || 0;

        // Check total selection across all materials
        const allCards = document.querySelectorAll(`.material-card[data-target-id="${targetId}"]`);
        let totalSelected = 0;
        allCards.forEach(c => {
            totalSelected += parseInt(c.getAttribute('data-selected-count')) || 0;
        });

        // Right click to decrease
        if (event && event.button === 2) {
            event.preventDefault();
            if (selectedCount > 0) {
                selectedCount--;
            }
        } else {
            // Left click to increase
            if (totalSelected >= 4) {
                if (window.toast) window.toast("最多只能選擇4個材料！", "error");
                return;
            }
            if (selectedCount >= maxCount) {
                if (window.toast) window.toast(`${cardElement.querySelector('.rarity-white, .rarity-green, .rarity-blue, .rarity-purple, .rarity-orange').textContent} 數量不足！`, "error");
                return;
            }
            selectedCount++;
        }

        // Update card appearance
        cardElement.setAttribute('data-selected-count', selectedCount);
        const badge = cardElement.querySelector('.selection-badge');
        const countSpan = badge.querySelector('.count');

        if (selectedCount > 0) {
            badge.style.display = 'block';
            countSpan.textContent = selectedCount;
            cardElement.style.background = 'linear-gradient(135deg, #4caf50, #2e7d32)';
            cardElement.style.borderColor = '#4caf50';
        } else {
            badge.style.display = 'none';
            cardElement.style.background = '#2a2a2a';
            cardElement.style.borderColor = '#444';
        }

        this.updateSelectionCountFromCards(targetId);
    },

    // Update selection count from card selections
    updateSelectionCountFromCards(targetId) {
        const allCards = document.querySelectorAll(`.material-card[data-target-id="${targetId}"]`);
        let totalSelected = 0;

        allCards.forEach(c => {
            totalSelected += parseInt(c.getAttribute('data-selected-count')) || 0;
        });

        const countDisplay = document.getElementById(`selection-count-${targetId}`);
        if (countDisplay) {
            countDisplay.textContent = `已選: ${totalSelected}/4`;
            countDisplay.style.color = totalSelected === 4 ? '#4caf50' : (totalSelected > 4 ? '#ff5252' : '#ffd700');
        }

        // Enable/disable button based on selection
        const btn = document.getElementById(`synth-btn-${targetId}`);
        if (btn) {
            btn.disabled = totalSelected !== 4;
            btn.textContent = totalSelected === 4 ? '合成' : `請選擇4個材料 (${totalSelected}/4)`;
        }
    },

    // Update selection count display (legacy for number inputs)
    updateSelectionCount(targetId) {
        const inputs = document.querySelectorAll(`input[data-target-id="${targetId}"]`);
        let total = 0;
        inputs.forEach(input => {
            total += parseInt(input.value) || 0;
        });

        const countDisplay = document.getElementById(`selection-count-${targetId}`);
        if (countDisplay) {
            countDisplay.textContent = `已選: ${total}/4`;
            countDisplay.style.color = total === 4 ? '#4caf50' : (total > 4 ? '#ff5252' : '#ffd700');
        }

        // Enable/disable button based on selection
        const btn = document.getElementById(`synth-btn-${targetId}`);
        if (btn) {
            btn.disabled = total !== 4;
            btn.textContent = total === 4 ? '合成' : (total > 4 ? '選擇過多' : '請選擇4個材料');
        }
    },

    // Manual synthesis with user-selected materials
    synthesizeTargetManual(targetId) {
        const DB = window.MATERIAL_DB || {};
        const targetDef = DB[targetId];
        if (!targetDef) return;

        // Collect selected materials from cards (using counter)
        const allCards = document.querySelectorAll(`.material-card[data-target-id="${targetId}"]`);
        const selected = [];
        let totalSelected = 0;

        allCards.forEach(card => {
            const count = parseInt(card.getAttribute('data-selected-count')) || 0;
            if (count > 0) {
                const matId = card.getAttribute('data-mat-id');
                selected.push({
                    id: matId,
                    count: count
                });
                totalSelected += count;
            }
        });

        // Validate
        if (totalSelected !== 4) {
            if (window.toast) window.toast("請選擇恰好4個材料！", "error");
            return;
        }

        // Consume selected materials
        const consumedNames = [];
        for (let sel of selected) {
            const invItem = window.state.inventory.find(i => i.id === sel.id);
            if (!invItem || invItem.count < sel.count) {
                if (window.toast) window.toast("材料數量不足！", "error");
                return;
            }
            invItem.count -= sel.count;
            consumedNames.push(`${invItem.name}x${sel.count}`);
            if (invItem.count <= 0) {
                invItem._remove = true;
            }
        }
        window.state.inventory = window.state.inventory.filter(i => !i._remove);

        // Grant Target
        if (window.addMaterial) {
            window.addMaterial(targetId, 1, { log: false });
        } else {
            const existing = window.state.inventory.find(i => i.id === targetDef.id);
            if (existing) existing.count++;
            else {
                window.state.inventory.push({
                    id: targetDef.id,
                    name: targetDef.name,
                    type: "material",
                    rarity: targetDef.rarity,
                    count: 1,
                    desc: targetDef.desc,
                    tags: targetDef.tags
                });
            }
        }

        if (window.toast) window.toast(`合成成功：${targetDef.name}`, "success");
        if (window.addLog) window.addLog(`消耗 [${consumedNames.join(", ")}] 合成了 [${targetDef.name}]`);

        if (window.renderArtsUI) window.renderArtsUI();
    },

    synthesizeTarget(targetId) {
        const DB = window.MATERIAL_DB || {};
        const targetDef = DB[targetId];
        if (!targetDef) return;

        // Helper: Get Art Type (Duplicated for safety or move to global helper if preferred)
        const getArtType = (item) => {
            if (item.tags) {
                if (item.tags.includes("pill")) return "pill";
                if (item.tags.includes("weapon")) return "weapon";
                if (item.tags.includes("talisman")) return "talisman";
                if (item.tags.includes("formation")) return "formation";
            }
            if (item.type === "material_pill") return "pill";
            if (item.type === "material_weapon") return "weapon";
            if (item.type === "material_talisman") return "talisman";
            if (item.type === "material_formation") return "formation";
            return "misc";
        };

        const targetArt = getArtType(targetDef);

        const PREV_TIER_MAP = {
            "green": "white",
            "blue": "green",
            "purple": "blue",
            "orange": "purple"
        };
        const prevTier = PREV_TIER_MAP[targetDef.rarity];
        if (!prevTier) return;

        // Check Inventory with STRICT ART TYPE Check
        const mats = window.state.inventory.filter(i => {
            const isMat = i.type === "material" || (i.type && i.type.startsWith("material"));
            if (!isMat) return false;
            if (i.rarity !== prevTier) return false;
            return getArtType(i) === targetArt;
        });

        const totalCount = mats.reduce((sum, i) => sum + i.count, 0);

        if (totalCount < 4) {
            if (window.toast) window.toast("同類型材料不足！", "error");
            return;
        }

        // Consume
        let needed = 4;
        const consumedNames = [];
        for (let item of mats) {
            if (needed <= 0) break;
            let take = Math.min(needed, item.count);
            item.count -= take;
            needed -= take;
            consumedNames.push(`${item.name}x${take}`);
            if (item.count <= 0) item._remove = true;
        }
        window.state.inventory = window.state.inventory.filter(i => !i._remove);

        // Grant Target
        if (window.addMaterial) {
            window.addMaterial(targetId, 1, { log: false });
        } else {
            // Fallback
            const existing = window.state.inventory.find(i => i.id === targetDef.id);
            if (existing) existing.count++;
            else {
                window.state.inventory.push({
                    id: targetDef.id,
                    name: targetDef.name,
                    type: "material",
                    rarity: targetDef.rarity,
                    count: 1,
                    desc: targetDef.desc,
                    tags: targetDef.tags
                });
            }
        }

        if (window.toast) window.toast(`合成成功：${targetDef.name}`, "success");
        if (window.addLog) window.addLog(`消耗 [${consumedNames.join(", ")}] 合成了 [${targetDef.name}]`);

        if (window.renderArtsUI) window.renderArtsUI();
    }
};

window.SmeltingSystem = SmeltingSystem;
if (document.readyState === "complete" || document.readyState === "interactive") {
    setTimeout(SmeltingSystem.init, 100);
} else {
    document.addEventListener("DOMContentLoaded", SmeltingSystem.init);
}
