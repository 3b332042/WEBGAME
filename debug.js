// debug.js
// 控制台邏輯

console.log("Loading debug.js...");

const DebugController = {
    // 切換顯示
    toggle() {
        const el = document.getElementById('debug-console');
        if (el) {
            el.style.display = el.style.display === 'none' ? 'block' : 'none';
        }
    },

    // 修改資源
    addResource(type, amount) {
        if (!window.state) return;

        switch (type) {
            case 'stones':
                window.state.spiritStones = (window.state.spiritStones || 0) + amount;
                alert(`Added ${amount} Spirit Stones.`);
                break;
            case 'contrib':
                window.state.factionContrib = (window.state.factionContrib || 0) + amount;
                alert(`Added ${amount} Faction Contribution.`);
                break;
            case 'qi':
                window.state.qi = (window.state.qi || 0) + amount;
                alert(`Added ${amount} Qi.`);
                break;
        }
        if (window.renderUI) window.renderUI();
    },

    // 修改屬性
    setAttribute(type, val) {
        if (!window.state) return;
        const value = parseInt(val);
        if (isNaN(value)) return;

        switch (type) {
            case 'lifespan':
                window.state.lifespan = value;
                break;
            case 'realm':
                window.state.realmLevel = value;
                // Update cap
                if (window.getQiCapForLevel) {
                    window.state.qiCap = window.getQiCapForLevel(window.state.realmLevel);
                }
                break;
            case 'mindset':
                window.state.mindset = value;
                break;
            case 'comprehension':
                window.state.comprehension = value;
                break;
        }
        if (window.renderUI) window.renderUI();
        alert(`Set ${type} to ${value}`);
    },

    // 觸發隨機事件
    triggerRandomEvent() {
        if (window.smallFortuneEvent) {
            window.smallFortuneEvent();
            alert("Triggered Random Event (Check Logs)");
        } else {
            alert("smallFortuneEvent function not found.");
        }
    },

    // 觸發特定宗門事件
    triggerSectEvent() {
        // Find sect event logic manually or force it
        if (!window.state.faction || window.state.faction === "none") {
            alert("Join a faction first!");
            return;
        }

        // Mocking the event trigger directly to ensure it happens
        const ev = {
            id: "debug_sect_reward",
            effect: () => {
                const contrib = 500;
                window.state.factionContrib = (window.state.factionContrib || 0) + contrib;
                window.addLog(`[DEBUG] 觸發宗門獎勵，獲得 ${contrib} 貢獻。`, "event");
            }
        };
        ev.effect();
        if (window.renderUI) window.renderUI();
        alert("Triggered Debug Sect Event (+500 Contrib)");
    },

    // 恢復狀態
    fullHeal() {
        if (!window.state) return;
        window.state.hp = window.state.maxHp;
        window.state.mana = window.state.maxMana;
        if (window.renderUI) window.renderUI();
        alert("Full Healed.");
    },

    // 切換宗門
    joinFaction(factionId) {
        if (!window.state) return;

        if (factionId === "none") {
            window.state.faction = "none";
            window.state.factionRep = 0;
            window.state.factionContrib = 0;
            window.state.factionRank = "無";
            alert("已退出宗門");
        } else if (factionId === "qingyun") {
            window.state.faction = "qingyun";
            window.state.factionRep = 100;
            window.state.factionContrib = 100;
            window.state.factionRank = "外門弟子";
            alert("已加入青雲宗 (外門弟子)");
        }

        if (window.renderUI) window.renderUI();
    }
};

window.DebugController = DebugController;

// Extends DebugController
DebugController.setArtLevel = function (type, lvl) {
    if (!window.state) return;
    const level = parseInt(lvl);
    if (isNaN(level)) return;

    if (!window.state.arts) window.state.arts = {};
    if (!window.state.arts[type]) window.state.arts[type] = { level: 0, exp: 0 };

    window.state.arts[type].level = level;
    window.state.arts[type].exp = 0; // reset exp logic or keep?

    if (window.renderUI) window.renderUI();
    // Need to trigger Arts UI update if open?
    if (typeof window.renderArtsUI === "function") window.renderArtsUI();

    alert(`Set ${type} to Level ${level}`);
};

DebugController.unlockAllArts = function () {
    if (!window.state) return;
    if (!window.state.arts) window.state.arts = {};

    ['alchemy', 'weapon', 'formation', 'talisman'].forEach(type => {
        if (!window.state.arts[type]) window.state.arts[type] = { level: 0, exp: 0 };
        if (window.state.arts[type].level === 0) window.state.arts[type].level = 1;
    });

    if (window.renderUI) window.renderUI();
    if (typeof window.renderArtsUI === "function") window.renderArtsUI();

    alert("Unlocked All Arts (Level 1)");
};
