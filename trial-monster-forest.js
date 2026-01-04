// trial-monster-forest.js
// 妖獸林歷練 - 直接進入BOSS戰鬥

(function () {
    const MonsterForestTrial = {
        id: "monster_forest",
        name: "妖獸林歷練",
        startNodeId: "entrance",
        nodes: {
            entrance: {
                title: "妖獸林入口",
                text: "你來到了妖獸林深處,選擇挑戰的妖獸等級:",
                choices: [
                    {
                        label: "🐗 野豬妖 (白階材料)",
                        logText: "你選擇挑戰野豬妖!",
                        onSelect: function () {
                            startMonsterBattle("monster_boar");
                        }
                    },
                    {
                        label: "🦊 狐妖 (綠階材料)",
                        logText: "你選擇挑戰狐妖!",
                        onSelect: function () {
                            startMonsterBattle("monster_fox");
                        }
                    },
                    {
                        label: "🐻 熊妖 (藍階材料)",
                        logText: "你選擇挑戰熊妖!",
                        onSelect: function () {
                            startMonsterBattle("monster_bear");
                        }
                    },
                    {
                        label: "🐯 虎妖 (紫階材料)",
                        logText: "你選擇挑戰虎妖!",
                        onSelect: function () {
                            startMonsterBattle("monster_tiger");
                        }
                    }
                ]
            }
        }
    };

    // 啟動妖獸戰鬥
    function startMonsterBattle(monsterId) {
        // 關閉歷練彈窗
        const trialModal = document.getElementById('trial-modal');
        const trialModalBg = document.getElementById('trial-modal-bg');
        if (trialModal) trialModal.style.display = 'none';
        if (trialModalBg) trialModalBg.style.display = 'none';

        // 從 BOSS_DB 獲取妖獸數據
        if (typeof BOSS_DB === 'undefined' || !BOSS_DB[monsterId]) {
            console.error('[Monster Forest] BOSS_DB not found or monster not defined:', monsterId);
            alert('妖獸數據載入失敗!');
            return;
        }

        const monster = BOSS_DB[monsterId];

        // 保存到localStorage供戰鬥頁面使用
        localStorage.setItem('current-battle-enemy', JSON.stringify({
            id: monster.id,
            name: monster.name,
            title: monster.title,
            color: monster.color,
            hp: monster.maxHp,
            maxHp: monster.maxHp,
            attack: monster.attack,
            defense: monster.defense,
            critRate: monster.critRate,
            critDamage: monster.critDamage,
            isBoss: true
        }));
        localStorage.setItem('battle-return-to', 'monster_forest');

        // 保存材料獎勵配置
        if (monster.materialReward) {
            sessionStorage.setItem('monsterTier', monster.materialReward.tier);
            sessionStorage.setItem('monsterMaterialCount', JSON.stringify({
                min: monster.materialReward.min,
                max: monster.materialReward.max
            }));
        }

        // 自動存檔，確保戰鬥頁面能讀取到最新進度
        if (typeof GameStateManager !== 'undefined') {
            console.log("Auto-saving before monster battle...");
            GameStateManager.save();
        }

        // 跳轉到戰鬥頁面
        window.location.href = 'fighting.html';
    }

    // 註冊到全域歷練系統
    if (typeof registerTrialTree === "function") {
        registerTrialTree(MonsterForestTrial);
        console.log("[trial-monster-forest.js] 妖獸林歷練已註冊。");
    } else {
        console.warn("[trial-monster-forest.js] 找不到 registerTrialTree 函式,請確認 trial.js 已載入。");
    }

    // 導出函數供外部使用
    window.startMonsterBattle = startMonsterBattle;
})();
