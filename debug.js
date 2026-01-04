// debug.js
// 獨立的 Debug 系統：自動生成 UI，包含所有常用的測試/作弊功能

console.log("Loading debug.js...");

const DebugController = {
    visible: false,

    init() {
        console.log("Initializing Debug UI...");
        this.createStyles();
        this.createUI();
        this.bindKeys();
    },

    createStyles() {
        const style = document.createElement('style');
        style.innerHTML = `
            #debug-floating-btn {
                position: fixed;
                bottom: 20px;
                right: 20px;
                width: 50px;
                height: 50px;
                background: linear-gradient(135deg, #d32f2f, #b71c1c);
                color: white;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: bold;
                font-size: 12px;
                cursor: pointer;
                box-shadow: 0 4px 10px rgba(0,0,0,0.5);
                z-index: 10000;
                transition: transform 0.2s;
                user-select: none;
            }
            #debug-floating-btn:hover {
                transform: scale(1.1);
            }
            #debug-panel {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 700px;
                max-width: 95vw;
                height: 600px;
                max-height: 90vh;
                background: #1a1a1a;
                border: 2px solid #444;
                border-radius: 8px;
                box-shadow: 0 0 20px rgba(0,0,0,0.8);
                z-index: 10001;
                display: none;
                flex-direction: column;
                color: #eee;
                font-family: sans-serif;
            }
            .debug-header {
                padding: 10px 15px;
                background: #333;
                border-bottom: 1px solid #555;
                display: flex;
                justify-content: space-between;
                align-items: center;
                font-weight: bold;
                font-size: 16px;
            }
            .debug-close {
                cursor: pointer;
                color: #ff5555;
                font-size: 20px;
            }
            .debug-body {
                flex: 1;
                display: flex;
                overflow: hidden;
            }
            .debug-sidebar {
                width: 120px;
                background: #222;
                border-right: 1px solid #444;
                display: flex;
                flex-direction: column;
            }
            .debug-tab {
                padding: 12px;
                cursor: pointer;
                border-bottom: 1px solid #333;
                color: #aaa;
                transition: background 0.2s;
            }
            .debug-tab:hover, .debug-tab.active {
                background: #444;
                color: #fff;
            }
            .debug-content {
                flex: 1;
                padding: 20px;
                overflow-y: auto;
            }
            .debug-page {
                display: none;
            }
            .debug-page.active {
                display: block;
            }
            .debug-row {
                margin-bottom: 15px;
                padding-bottom: 10px;
                border-bottom: 1px solid #333;
            }
            .debug-row h4 {
                margin: 0 0 10px 0;
                color: #ffd700;
            }
            .debug-btn {
                background: #444;
                border: 1px solid #666;
                color: white;
                padding: 5px 10px;
                margin-right: 5px;
                margin-bottom: 5px;
                border-radius: 4px;
                cursor: pointer;
            }
            .debug-btn:hover {
                background: #555;
            }
            .debug-input {
                background: #222;
                border: 1px solid #555;
                color: white;
                padding: 5px;
                border-radius: 4px;
                width: 80px;
                margin-right: 5px;
            }
            .debug-select {
                background: #222;
                border: 1px solid #555;
                color: white;
                padding: 5px;
                border-radius: 4px;
                margin-right: 5px;
                max-width: 200px;
            }
        `;
        document.head.appendChild(style);
    },

    createUI() {
        // Floating Button
        /*
        const btn = document.createElement('div');
        btn.id = 'debug-floating-btn';
        btn.textContent = 'DEBUG';
        btn.onclick = () => this.toggle();
        document.body.appendChild(btn);
        */

        // Panel
        const panel = document.createElement('div');
        panel.id = 'debug-panel';
        panel.innerHTML = `
            <div class="debug-header">
                <span>🔧 開發者控制台</span>
                <span class="debug-close" onclick="DebugController.toggle()">×</span>
            </div>
            <div class="debug-body">
                <div class="debug-sidebar">
                    <div class="debug-tab active" data-target="page-resources">基礎資源</div>
                    <div class="debug-tab" data-target="page-stats">戰鬥屬性</div>
                    <div class="debug-tab" data-target="page-items">物品道具</div>
                    <div class="debug-tab" data-target="page-arts">修真百藝</div>
                    <div class="debug-tab" data-target="page-world">世界與勢力</div>
                    <div class="debug-tab" data-target="page-training">⚔️ 訓練場</div>
                </div>
                <div class="debug-content">
                    <div id="page-resources" class="debug-page active"></div>
                    <div id="page-stats" class="debug-page"></div>
                    <div id="page-items" class="debug-page"></div>
                    <div id="page-arts" class="debug-page"></div>
                    <div id="page-world" class="debug-page"></div>
                    <div id="page-training" class="debug-page"></div>
                </div>
            </div>
        `;
        document.body.appendChild(panel);

        // Bind Tabs
        const tabs = panel.querySelectorAll('.debug-tab');
        tabs.forEach(tab => {
            tab.onclick = () => {
                tabs.forEach(t => t.classList.remove('active'));
                panel.querySelectorAll('.debug-page').forEach(p => p.classList.remove('active'));

                tab.classList.add('active');
                const targetId = tab.getAttribute('data-target');
                document.getElementById(targetId).classList.add('active');
                this.renderPage(targetId);
            };
        });

        this.renderAllPages();
    },

    bindKeys() {
        // Ctrl + ` to toggle
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === '`') {
                this.toggle();
            }
        });
    },

    toggle() {
        const panel = document.getElementById('debug-panel');
        this.visible = !this.visible;
        panel.style.display = this.visible ? 'flex' : 'none';
        if (this.visible) this.renderAllPages();
    },

    renderAllPages() {
        this.renderResources();
        this.renderStats();
        this.renderItems();
        this.renderArts();
        this.renderWorld();
        this.renderTraining();
    },

    renderPage(id) {
        if (id === 'page-resources') this.renderResources();
        if (id === 'page-stats') this.renderStats();
        if (id === 'page-items') this.renderItems();
        if (id === 'page-arts') this.renderArts();
        if (id === 'page-world') this.renderWorld();
        if (id === 'page-training') this.renderTraining();
    },

    // ==========================================
    // Page Renderers
    // ==========================================

    renderResources() {
        const container = document.getElementById('page-resources');
        container.innerHTML = `
            <div class="debug-row">
                <h4>生命與狀態</h4>
                <button class="debug-btn" onclick="DebugController.action('fullHeal')">一鍵恢復狀態</button>
                <button class="debug-btn" onclick="DebugController.action('die')">立即坐化</button>
            </div>
            <div class="debug-row">
                <h4>資源修改</h4>
                ${this.makeInputRow('靈石', 'spiritStones')}
                ${this.makeInputRow('真氣', 'qi')}
                ${this.makeInputRow('宗門貢獻', 'factionContrib')}
                ${this.makeInputRow('壽元', 'lifespan')}
                ${this.makeInputRow('心境', 'mindset')}
            </div>
            <div class="debug-row">
                <h4>時間控制</h4>
                <button class="debug-btn" onclick="DebugController.action('addTime', 1)">+1 年</button>
                <button class="debug-btn" onclick="DebugController.action('addTime', 10)">+10 年</button>
                <button class="debug-btn" onclick="DebugController.action('addTime', 100)">+100 年</button>
            </div>
        `;
    },

    renderStats() {
        const container = document.getElementById('page-stats');
        container.innerHTML = `
             <div class="debug-row">
                <h4>境界修為</h4>
                <button class="debug-btn" onclick="DebugController.action('levelUp')">提升境界 (+1 Level)</button>
                <button class="debug-btn" onclick="DebugController.action('maxQi')">真氣填滿</button>
            </div>
            <div class="debug-row">
                <h4>基礎屬性 (Base Stats)</h4>
                ${this.makeInputRow('基礎攻擊', 'attack')}
                ${this.makeInputRow('基礎防禦', 'defense')}
                ${this.makeInputRow('身法(Speed)', 'speed')}
                ${this.makeInputRow('基礎血量', 'maxHp')}
                ${this.makeInputRow('基礎暴擊率', 'critRate', 0.01)}
                ${this.makeInputRow('基礎暴傷', 'critDamage', 0.1)}
            </div>
             <div class="debug-row">
                <h4>屬性 (悟性/氣運)</h4>
                ${this.makeInputRow('悟性', 'comprehension')}
                ${this.makeInputRow('氣運', 'luck')}
            </div>
        `;
    },

    renderItems() {
        const container = document.getElementById('page-items');

        // Build Item Options - Merge ItemDB and MATERIAL_DB
        let itemOptions = '<option value="">-- 選擇物品 --</option>';
        const allItems = [];

        // Add items from ItemDB
        if (window.ItemDB) {
            Object.values(window.ItemDB).forEach(item => {
                allItems.push({ ...item, source: 'ItemDB' });
            });
        }

        // Add materials from MATERIAL_DB
        if (window.MATERIAL_DB) {
            Object.values(window.MATERIAL_DB).forEach(mat => {
                allItems.push({ ...mat, source: 'MaterialDB' });
            });
        }

        // Sort by rarity
        const rarityOrder = { white: 1, green: 2, blue: 3, purple: 4, orange: 5 };
        allItems.sort((a, b) => {
            const rarityA = rarityOrder[a.rarity] || 0;
            const rarityB = rarityOrder[b.rarity] || 0;
            return rarityA - rarityB;
        });

        allItems.forEach(item => {
            const sourceTag = item.source === 'MaterialDB' ? '[材料]' : '';
            itemOptions += `<option value="${item.id}">[${item.rarity || 'white'}] ${sourceTag}${item.name} (${item.id})</option>`;
        });

        container.innerHTML = `
            <div class="debug-row">
                <h4>添加物品</h4>
                <div style="display:flex; align-items:center; margin-bottom:10px;">
                    <select id="debug-item-select" class="debug-select">${itemOptions}</select>
                    <input type="number" id="debug-item-count" class="debug-input" value="1" placeholder="數量">
                    <button class="debug-btn" onclick="DebugController.addItemFromUI()">添加</button>
                </div>
                <button class="debug-btn" onclick="DebugController.action('clearInventory')">清空背包</button>
            </div>
            <div class="debug-row">
                <h4>快速獲得裝備</h4>
                <button class="debug-btn" onclick="DebugController.action('addAllEquipment')">獲得所有裝備</button>
                <button class="debug-btn" onclick="DebugController.action('addAllWeapons')">所有武器</button>
                <button class="debug-btn" onclick="DebugController.action('addAllArmor')">所有護甲</button>
                <button class="debug-btn" onclick="DebugController.action('addAllFormations')">所有陣盤</button>
            </div>
            <div class="debug-row">
                <h4>添加材料 (MaterialDB)</h4>
                <button class="debug-btn" onclick="DebugController.action('addAllMaterials', 10)">所有材料各 +10</button>
            </div>
        `;
    },

    renderArts() {
        const container = document.getElementById('page-arts');
        container.innerHTML = `
            <div class="debug-row">
                <h4>技藝等級</h4>
                ${this.makeArtInput('煉丹', 'alchemy')}
                ${this.makeArtInput('煉器', 'weapon')}
                ${this.makeArtInput('陣法', 'formation')}
                ${this.makeArtInput('符籙', 'talisman')}
            </div>
            <div class="debug-row">
                <h4>快速操作</h4>
                <button class="debug-btn" onclick="DebugController.action('unlockAllArts')">解鎖所有技藝</button>
                <button class="debug-btn" onclick="DebugController.action('maxArts')">技藝全滿級</button>
            </div>
            <div class="debug-row">
                <h4>術法系統</h4>
                <button class="debug-btn" onclick="DebugController.action('unlockAllSkills')">解鎖所有術法</button>
                <button class="debug-btn" onclick="DebugController.action('maxAllSkills')">所有術法滿熟練度</button>
            </div>
        `;
    },

    renderWorld() {
        const container = document.getElementById('page-world');
        const currentRank = window.state?.factionRank || 0;
        const rankNames = ['外門弟子', '內門弟子', '核心弟子', '真傳弟子', '長老', '太上長老', '副掌門', '掌門', '宗主'];
        const currentRankName = rankNames[currentRank] || '無';

        container.innerHTML = `
            <div class="debug-row">
                <h4>宗門勢力</h4>
                <button class="debug-btn" onclick="DebugController.action('joinFaction', 'qingyun')">加入青雲宗</button>
                <button class="debug-btn" onclick="DebugController.action('joinFaction', 'moyun')">加入魔雲殿</button>
                <button class="debug-btn" onclick="DebugController.action('joinFaction', 'danta')">加入丹塔</button>
                <button class="debug-btn" onclick="DebugController.action('joinFaction', 'qige')">加入器閣</button>
                <button class="debug-btn" onclick="DebugController.action('joinFaction', 'fumeng')">加入符盟</button>
                <button class="debug-btn" onclick="DebugController.action('joinFaction', 'zhendian')">加入陣殿</button>
                <button class="debug-btn" onclick="DebugController.action('leaveFaction')">退出宗門</button>
            </div>
            <div class="debug-row">
                <h4>宗門職位 (當前: ${currentRankName} - Rank ${currentRank})</h4>
                <button class="debug-btn" onclick="DebugController.action('promoteRank')">晉升 (+1)</button>
                <button class="debug-btn" onclick="DebugController.action('demoteRank')">降級 (-1)</button>
                <button class="debug-btn" onclick="DebugController.action('setRank', 0)">外門弟子</button>
                <button class="debug-btn" onclick="DebugController.action('setRank', 3)">真傳弟子</button>
                <button class="debug-btn" onclick="DebugController.action('setRank', 4)">長老</button>
                <button class="debug-btn" onclick="DebugController.action('setRank', 7)">掌門</button>
            </div>
             <div class="debug-row">
                <h4>歷練測試</h4>
                <button class="debug-btn" onclick="DebugController.action('resetTrials')">重置歷練紀錄</button>
            </div>
        `;
    },

    renderTraining() {
        const container = document.getElementById('page-training');
        container.innerHTML = `
            <div class="debug-row">
                <h4>⚔️ 快速戰鬥</h4>
                <button class="debug-btn" onclick="DebugController.action('quickBattle', 'weak')">弱敵 (測試傷害)</button>
                <button class="debug-btn" onclick="DebugController.action('quickBattle', 'normal')">普通敵人</button>
                <button class="debug-btn" onclick="DebugController.action('quickBattle', 'strong')">強敵 (測試生存)</button>
                <button class="debug-btn" onclick="DebugController.action('quickBattle', 'boss')">BOSS級</button>
            </div>
            <div class="debug-row">
                <h4>🎯 技能測試</h4>
                <button class="debug-btn" onclick="DebugController.action('unlockAllSkills')">解鎖所有技能</button>
                <button class="debug-btn" onclick="DebugController.action('maxSkillProficiency')">滿級熟練度</button>
                <button class="debug-btn" onclick="DebugController.action('testAnimations')">測試所有動畫</button>
            </div>
            <div class="debug-row">
                <h4>👹 BOSS選擇</h4>
                <button class="debug-btn" onclick="DebugController.action('fightBoss', 'boss_1')">賞金BOSS 1</button>
                <button class="debug-btn" onclick="DebugController.action('fightBoss', 'boss_2')">賞金BOSS 2</button>
                <button class="debug-btn" onclick="DebugController.action('fightBoss', 'boss_3')">賞金BOSS 3</button>
            </div>
            <div class="debug-row">
                <h4>⚡ 戰鬥狀態</h4>
                <button class="debug-btn" onclick="DebugController.action('fullEnergy')">滿能量條</button>
                <button class="debug-btn" onclick="DebugController.action('godMode')">無敵模式</button>
                <button class="debug-btn" onclick="DebugController.action('oneHitKill')">一擊必殺</button>
                <button class="debug-btn" style="${localStorage.getItem('debug_invincible_battle') === 'true' ? 'background:#4caf50;color:white;' : ''}" onclick="DebugController.action('bothSidesInvincible')">
                    ${localStorage.getItem('debug_invincible_battle') === 'true' ? '雙方無敵 (ON)' : '雙方無敵 (OFF)'}
                </button>
                <button class="debug-btn" style="background:#2196f3;color:white;" onclick="DebugController.action('startInvincibleBattle')">
                    ⚔️ 直接無敵開戰
                </button>
            </div>
        `;
    },

    // ==========================================
    // UI Helpers
    // ==========================================

    makeInputRow(label, key, step = 1) {
        let val = 0;
        if (window.state) {
            val = window.state[key] !== undefined ? window.state[key] : (window.state.baseStats ? window.state.baseStats[key] : 0);
        }
        // Handle nested or loose props. For now assume state[key]
        return `
            <div style="margin-bottom:5px;">
                <label style="display:inline-block; width:100px;">${label}:</label>
                <input type="number" class="debug-input" value="${val}" step="${step}" id="debug-input-${key}">
                 <button class="debug-btn" onclick="DebugController.action('setVal', '${key}')">設定</button>
            </div>
        `;
    },

    makeArtInput(label, type) {
        let lvl = 0;
        if (window.state && window.state.arts && window.state.arts[type]) {
            lvl = window.state.arts[type].level || 0;
        }
        return `
            <div style="margin-bottom:5px;">
                <label style="display:inline-block; width:100px;">${label} Lv:</label>
                <input type="number" class="debug-input" value="${lvl}" id="debug-art-${type}">
                 <button class="debug-btn" onclick="DebugController.action('setArt', '${type}')">設定</button>
            </div>
        `;
    },

    addItemFromUI() {
        const select = document.getElementById('debug-item-select');
        const countInput = document.getElementById('debug-item-count');
        const id = select.value;
        const count = parseInt(countInput.value) || 1;

        if (!id) return alert("請選擇物品");

        // Check if it's a material first
        if (window.MATERIAL_DB && window.MATERIAL_DB[id]) {
            if (window.addMaterial) {
                window.addMaterial(id, count, { log: true });
                if (window.toast) window.toast(`已添加 ${window.MATERIAL_DB[id].name} x${count}`, "success");
            } else {
                alert("No addMaterial function found");
            }
        }
        // Otherwise try ItemDB
        else if (window.addItem) {
            window.addItem(id, count);
        } else if (window.grantItem) {
            window.grantItem(id, count);
        } else {
            alert("No addItem function found");
        }

        // Refresh UI
        if (window.renderInventory) window.renderInventory();
        if (window.renderUI) window.renderUI();
    },

    // ==========================================
    // Actions
    // ==========================================

    action(act, arg1, arg2) {
        if (!window.state) return alert("Game state not ready");

        switch (act) {
            case 'fullHeal':
                if (window.state.hpMax) window.state.hp = window.state.hpMax;
                else window.state.hp = 10000; // fallback
                if (window.state.qiCap) window.state.qi = window.state.qiCap;
                else window.state.qi = 10000;
                break;
            case 'die':
                window.state.hp = 0;
                break;
            case 'setVal':
                const key = arg1;
                const input = document.getElementById(`debug-input-${key}`);
                let val = parseFloat(input.value);
                window.state[key] = val;

                // Special handlers
                if (key === 'realmLevel' && window.getQiCapForLevel) {
                    // Update Qi Cap if Realm Changed
                    // window.state.qiCap = window.getQiCapForLevel(val); 
                    // Usually this is calculated dynamically or stored. 
                    // Let's assume just setting the value works for now or game loop handles it.
                }
                break;
            case 'addTime':
                if (window.cultivate) window.cultivate(arg1);
                break;
            case 'levelUp':
                window.state.realmLevel = (window.state.realmLevel || 0) + 1;
                break;
            case 'maxQi':
                // Check if getQiCapForLevel exists
                let cap = 999999;
                if (window.getQiCapForLevel) cap = window.getQiCapForLevel(window.state.realmLevel);
                window.state.qi = cap;
                break;
            case 'setArt':
                const artType = arg1;
                const artInput = document.getElementById(`debug-art-${artType}`);
                const artLvl = parseInt(artInput.value);
                if (!window.state.arts) window.state.arts = {};
                if (!window.state.arts[artType]) window.state.arts[artType] = { exp: 0 };
                window.state.arts[artType].level = artLvl;
                break;
            case 'unlockAllArts':
                ['alchemy', 'weapon', 'formation', 'talisman'].forEach(t => {
                    if (!window.state.arts) window.state.arts = {};
                    if (!window.state.arts[t]) window.state.arts[t] = { level: 1, exp: 0 };
                    if (window.state.arts[t].level < 1) window.state.arts[t].level = 1;
                });
                this.renderArts();
                break;
            case 'maxArts':
                ['alchemy', 'weapon', 'formation', 'talisman'].forEach(t => {
                    if (!window.state.arts) window.state.arts = {};
                    if (!window.state.arts[t]) window.state.arts[t] = { level: 10, exp: 999999 }; // Assuming 10 is max
                    window.state.arts[t].level = 9;
                });
                this.renderArts();
                break;
            case 'clearInventory':
                window.state.inventory = [];
                break;
            case 'addAllMaterials':
                if (window.MATERIAL_DB) {
                    Object.keys(window.MATERIAL_DB).forEach(mid => {
                        window.addMaterial(mid, arg1 || 10, { log: false });
                    });
                    if (window.addLog) window.addLog("已添加所有材料 x" + arg1);
                }
                break;
            case 'joinFaction':
                if (window.joinFaction) window.joinFaction(arg1);
                break;
            case 'leaveFaction':
                if (window.state.faction) {
                    window.state.faction = null;
                    if (window.addLog) window.addLog("已退出宗門");
                }
                break;
            case 'resetTrials':
                window.state.completedTrials = [];
                if (window.addLog) window.addLog("歷練紀錄已重置");
                break;
            case 'addAllEquipment':
                this.addAllEquipmentItems();
                break;
            case 'addAllWeapons':
                this.addEquipmentByType('weapon');
                break;
            case 'addAllArmor':
                this.addEquipmentByType(['head', 'body', 'legs', 'feet']);
                break;
            case 'addAllFormations':
                this.addEquipmentByType('formation');
                break;
            case 'unlockAllSkills':
                // 解鎖所有術法
                if (!window.SKILLS) {
                    alert("SKILLS not found");
                    return;
                }
                if (!window.state.learnedSkills) window.state.learnedSkills = {};

                let unlockedCount = 0;
                Object.keys(window.SKILLS).forEach(skillId => {
                    if (!window.state.learnedSkills[skillId]) {
                        window.state.learnedSkills[skillId] = 1;
                        unlockedCount++;
                    }
                });

                if (window.addLog) window.addLog(`已解鎖所有術法 (共 ${unlockedCount} 個)`);
                if (window.toast) window.toast(`已解鎖所有術法 (共 ${unlockedCount} 個)`, "success");
                break;
            case 'maxAllSkills':
                // 所有術法滿熟練度
                if (!window.SKILLS) {
                    alert("SKILLS not found");
                    return;
                }
                if (!window.state.learnedSkills) window.state.learnedSkills = {};

                Object.keys(window.SKILLS).forEach(skillId => {
                    window.state.learnedSkills[skillId] = 100; // 宗師級
                });

                if (window.addLog) window.addLog("所有術法已達宗師境界 (熟練度100)");
                if (window.toast) window.toast("所有術法已達宗師境界!", "success");
                break;
            case 'promoteRank':
                // 晉升宗門職位
                window.state.factionRank = Math.min((window.state.factionRank || 0) + 1, 8);
                if (window.addLog) window.addLog(`宗門職位晉升至 Rank ${window.state.factionRank}`);
                if (window.toast) window.toast(`晉升成功! 當前職位: Rank ${window.state.factionRank}`, "success");
                this.renderWorld();
                break;
            case 'demoteRank':
                // 降級宗門職位
                window.state.factionRank = Math.max((window.state.factionRank || 0) - 1, 0);
                if (window.addLog) window.addLog(`宗門職位降至 Rank ${window.state.factionRank}`);
                if (window.toast) window.toast(`降級至 Rank ${window.state.factionRank}`, "info");
                this.renderWorld();
                break;
            case 'setRank':
                // 設定特定職位
                const targetRank = arg1;
                window.state.factionRank = Math.max(0, Math.min(targetRank, 8));
                const rankNames = ['外門弟子', '內門弟子', '核心弟子', '真傳弟子', '長老', '太上長老', '副掌門', '掌門', '宗主'];
                if (window.addLog) window.addLog(`宗門職位設定為: ${rankNames[window.state.factionRank]}`);
                if (window.toast) window.toast(`職位設定為: ${rankNames[window.state.factionRank]}`, "success");
                this.renderWorld();
                break;

            // === 訓練場功能 ===
            case 'quickBattle':
                // 快速開始戰鬥
                const difficulty = arg1 || 'normal';
                const enemyTemplates = {
                    weak: { id: 'training_weak', name: '練習假人', maxHp: 100, hp: 100, attack: 5, defense: 2 },
                    normal: { id: 'training_normal', name: '普通敵人', maxHp: 500, hp: 500, attack: 20, defense: 10 },
                    strong: { id: 'training_strong', name: '強大敵人', maxHp: 2000, hp: 2000, attack: 50, defense: 30 },
                    boss: { id: 'training_boss', name: '訓練BOSS', maxHp: 5000, hp: 5000, attack: 80, defense: 50 }
                };
                const enemy = enemyTemplates[difficulty];
                localStorage.setItem('current-battle-enemy', JSON.stringify(enemy));
                window.open('fighting.html', '_blank');
                if (window.toast) window.toast(`開始戰鬥: ${enemy.name}`, "info");
                break;

            case 'unlockAllSkills':
                // 解鎖所有技能
                if (!window.state.learnedSkills) window.state.learnedSkills = {};
                if (window.SKILLS) {
                    Object.keys(window.SKILLS).forEach(skillId => {
                        window.state.learnedSkills[skillId] = 1;
                    });
                }
                if (window.addLog) window.addLog("已解鎖所有技能");
                if (window.toast) window.toast("已解鎖所有技能!", "success");
                break;

            case 'maxSkillProficiency':
                // 所有技能滿級熟練度
                if (!window.state.learnedSkills) window.state.learnedSkills = {};
                if (window.SKILLS) {
                    Object.keys(window.SKILLS).forEach(skillId => {
                        window.state.learnedSkills[skillId] = 100;
                    });
                }
                if (window.addLog) window.addLog("所有技能熟練度已滿");
                if (window.toast) window.toast("所有技能達到宗師級!", "success");
                break;

            case 'testAnimations':
                // 測試所有動畫
                if (window.toast) window.toast("請進入戰鬥使用技能測試動畫", "info");
                this.action('quickBattle', 'weak');
                break;

            case 'fightBoss':
                // 挑戰特定BOSS
                const bossId = arg1;
                if (window.ContributionHall && window.ContributionHall.challengeBoss) {
                    window.ContributionHall.challengeBoss(bossId);
                } else {
                    if (window.toast) window.toast("賞金系統未就緒", "error");
                }
                break;

            case 'fullEnergy':
                // 滿能量條 (需要在戰鬥中)
                if (window.toast) window.toast("請在戰鬥中使用此功能", "info");
                break;

            case 'godMode':
                // 無敵模式
                if (window.toast) window.toast("無敵模式需要在戰鬥中手動設置", "info");
                break;

            case 'oneHitKill':
                // 一擊必殺
                if (window.toast) window.toast("一擊必殺需要在戰鬥中手動設置", "info");
                break;

            case 'bothSidesInvincible':
                // 雙方無敵模式
                const isInvincible = localStorage.getItem('debug_invincible_battle') === 'true';
                const newState = !isInvincible;
                localStorage.setItem('debug_invincible_battle', newState);

                if (window.toast) window.toast(`雙方無敵模式已${newState ? '開啟' : '關閉'}`, "success");
                if (window.addLog) window.addLog(`[Debug] 雙方無敵模式: ${newState ? 'ON' : 'OFF'}`);

                // Refresh Debug UI to update button state
                this.renderTraining();
                break;

            case 'startInvincibleBattle':
                // 直接開始無敵戰鬥
                localStorage.setItem('debug_invincible_battle', 'true');

                // ⭐ Auto-unlock all skills and max them out
                this.action('unlockAllSkills');
                this.action('maxSkillProficiency');

                // ⭐ CRITICAL: Save state so fighting.html can see the new skills
                if (window.GameStateManager) {
                    window.GameStateManager.save();
                    console.log("[Debug] State saved before battle start.");
                }

                // Inline quickBattle logic
                const debugEnemy = { id: 'training_normal', name: '普通敵人', maxHp: 500, hp: 500, attack: 20, defense: 10 };
                localStorage.setItem('current-battle-enemy', JSON.stringify(debugEnemy));

                if (window.toast) window.toast("已開啟無敵模式並全開技能！", "success");

                // Try open new window, fallback to current window if blocked
                const debugWin = window.open('fighting.html', '_blank');
                if (!debugWin) {
                    console.log("Popup blocked, navigating in current window");
                    window.location.href = 'fighting.html';
                }

                // Update UI to reflect the ON state
                setTimeout(() => this.renderTraining(), 100);
                break;
        }

        if (window.renderUI) window.renderUI();
        if (window.renderInventory) window.renderInventory();
        if (window.renderArtsUI) window.renderArtsUI();

        // Re-render debug page to reflect changes
        this.renderAllPages();
    },

    // ==========================================
    // Equipment Helper Functions
    // ==========================================

    addAllEquipmentItems() {
        if (!window.ItemDB) {
            alert("ItemDB not found");
            return;
        }

        let count = 0;
        Object.values(window.ItemDB).forEach(item => {
            // Check if it's equipment (has slot or equip property)
            if (item.slot || item.equip || ['weapon', 'head', 'body', 'legs', 'feet', 'formation'].includes(item.type)) {
                if (window.grantItem) {
                    window.grantItem(item.id, 1);
                    count++;
                }
            }
        });

        if (window.addLog) window.addLog(`已添加所有裝備 (共 ${count} 件)`);
        if (window.toast) window.toast(`已添加所有裝備 (共 ${count} 件)`, "success");
    },

    addEquipmentByType(types) {
        if (!window.ItemDB) {
            alert("ItemDB not found");
            return;
        }

        // Convert single type to array
        const typeArray = Array.isArray(types) ? types : [types];
        let count = 0;

        Object.values(window.ItemDB).forEach(item => {
            // Check if item matches any of the specified types
            if (typeArray.includes(item.type) || typeArray.includes(item.slot)) {
                if (window.grantItem) {
                    window.grantItem(item.id, 1);
                    count++;
                }
            }
        });

        const typeName = typeArray.length === 1 ? typeArray[0] : '護甲';
        if (window.addLog) window.addLog(`已添加所有${typeName}裝備 (共 ${count} 件)`);
        if (window.toast) window.toast(`已添加所有${typeName}裝備 (共 ${count} 件)`, "success");
    }
};

window.DebugController = DebugController;

// Auto Init on Load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => DebugController.init());
} else {
    DebugController.init();
}
