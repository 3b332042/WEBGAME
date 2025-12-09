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

    // Targeted Synthesis: List all craftable high-tier items
    renderUpgradeList(container) {
        const DB = window.MATERIAL_DB || {};
        const items = Object.values(DB).filter(i => i.type === "material" && i.rarity !== "white");

        // Prev Tier Mapping
        const PREV_TIER = {
            "green": { id: "white", name: "凡階" },
            "blue": { id: "green", name: "黃階" },
            "purple": { id: "blue", name: "玄階" },
            "orange": { id: "purple", name: "地階" }
        };
        const RARITY_NAME = {
            "green": "黃階",
            "blue": "玄階",
            "purple": "地階",
            "orange": "天階"
        };
        // Sort by rarity
        const order = ["green", "blue", "purple", "orange"];
        items.sort((a, b) => order.indexOf(a.rarity) - order.indexOf(b.rarity));

        items.forEach(target => {
            const prev = PREV_TIER[target.rarity];
            if (!prev) return;

            // Calculate Inventory of Prev Tier
            const mats = window.state.inventory.filter(i => i.type === "material" && i.rarity === prev.id);
            const totalCount = mats.reduce((sum, i) => sum + i.count, 0);
            const canCraft = totalCount >= 4;

            const div = document.createElement("div");
            div.className = `arts-item ${canCraft ? "" : "locked"}`;
            div.innerHTML = `
                 <div class="arts-item-header">
                    <div class="arts-item-title rarity-${target.rarity}">
                        ${target.name} 
                        <span class="arts-req-badge rarity-${target.rarity}">${RARITY_NAME[target.rarity]}</span>
                    </div>
                    <div class="arts-item-mats">
                        <span class="mat-chip ${canCraft ? 'mat-enough' : 'mat-missing'}">
                            消耗 4 個${prev.name}材料 (${totalCount}/4)
                        </span>
                    </div>
                </div>
                <div class="arts-item-action">
                    <button class="craft-btn" 
                        onclick="SmeltingSystem.synthesizeTarget('${target.id}')" 
                        ${canCraft ? "" : "disabled"}>
                        合成
                    </button>
                </div>
            `;
            container.appendChild(div);
        });

        if (items.length === 0) {
            container.innerHTML = `<div class="empty-tip">暫無可合成的高階材料。</div>`;
        }
    },

    synthesizeTarget(targetId) {
        const DB = window.MATERIAL_DB || {};
        const targetDef = DB[targetId];
        if (!targetDef) return;

        const PREV_TIER_MAP = {
            "green": "white",
            "blue": "green",
            "purple": "blue",
            "orange": "purple"
        };
        const prevTier = PREV_TIER_MAP[targetDef.rarity];
        if (!prevTier) return;

        // Check Inventory
        const mats = window.state.inventory.filter(i => i.type === "material" && i.rarity === prevTier);
        const totalCount = mats.reduce((sum, i) => sum + i.count, 0);

        if (totalCount < 4) {
            if (window.toast) window.toast("材料不足！", "error");
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
                    desc: targetDef.desc
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
