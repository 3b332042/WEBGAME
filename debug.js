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

        // Map short names if necessary, or just use keys directly
        switch (type) {
            case 'spiritStones':
            case 'stones':
                window.state.spiritStones = (window.state.spiritStones || 0) + amount;
                break;
            case 'factionContrib':
            case 'contrib':
                window.state.factionContrib = (window.state.factionContrib || 0) + amount;
                break;
            case 'qi':
                window.state.qi = (window.state.qi || 0) + amount;
                if (window.state.qi > window.state.qiCap) window.state.qi = window.state.qiCap; // Optional cap
                break;
            case 'lifespan':
                window.state.lifespan = (window.state.lifespan || 0) + amount;
                break;
            default:
                console.warn("Unknown resource type:", type);
                return;
        }

        // alert(`Added ${amount} to ${type}`); // Remove alert for smoother usage?
        // Add log instead
        if (window.addLog) window.addLog(`[DEBUG] Added ${amount} to ${type}`, "event");

        if (window.renderUI) window.renderUI();
    },

    // 修改屬性
    setAttribute(type, val) {
        if (!window.state) return;
        const value = parseInt(val);
        if (isNaN(value)) return;

        if (window.state.hasOwnProperty(type)) {
            window.state[type] = value;

            // Special handling for realmLevel to update cap
            if (type === 'realmLevel' && window.getQiCapForLevel) {
                window.state.qiCap = window.getQiCapForLevel(value);
            }
        }

        if (window.renderUI) window.renderUI();
        if (window.addLog) window.addLog(`[DEBUG] Set ${type} to ${value}`, "event");
    },

    // 時間跳躍
    addTime(years) {
        if (typeof window.cultivate === 'function') {
            window.cultivate(years);
            if (window.addLog) window.addLog(`[DEBUG] Skipped ${years} years`, "event");
        }
    },

    // 立即死亡
    die() {
        if (!window.state) return;
        window.state.hp = 0;
        window.state.lifespan = 0; // consistent death check
        if (window.renderUI) window.renderUI();
        alert("Debug: You died.");
        // Trigger check logic by calling cultivate(0) or similar if needed, 
        // but state.hp=0 should trigger on next action.
    },
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
