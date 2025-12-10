// contribution.js
// 貢獻堂邏輯：懸賞BOSS + 靈石小遊戲

const ContributionHall = {
    // === 懸賞 BOSS 資料 ===
    // === 懸賞 BOSS 資料 (更加平滑的難度曲線) ===
    // 數值參考: 1 Power ≈ 25 戰力 (HP*0.8 + Atk*5 + Def*3)
    // 練氣期玩家戰力約 100~300
    bosses: [
        // 練氣期 (Qi Condensation: CP 150 - 400)
        { id: "boss_qi_1", name: "暴躁的野豬王", desc: "皮糙肉厚，經常破壞藥田。", power: 6, rewardContrib: 5, rewardStones: 10, rewardRep: 5, realmLevel: 3 },
        { id: "boss_qi_2", name: "青鱗毒蛇", desc: "潛伏在草叢中的劇毒妖獸。", power: 10, rewardContrib: 10, rewardStones: 20, rewardRep: 10, realmLevel: 6 },
        { id: "boss_qi_3", name: "流浪散修", desc: "為了資源不擇手段的低階修士。", power: 16, rewardContrib: 20, rewardStones: 30, rewardRep: 20, realmLevel: 9 },

        // 筑基期 (Foundation: CP 800 - 1500)
        { id: "boss_found_1", name: "鐵臂魔猿", desc: "力大無窮，拳風呼嘯。", power: 32, rewardContrib: 50, rewardStones: 50, rewardRep: 50, realmLevel: 10 },
        { id: "boss_found_2", name: "偷丹賊 (高階)", desc: "身法詭異，甚至能使用簡單的法器。", power: 45, rewardContrib: 80, rewardStones: 80, rewardRep: 80, realmLevel: 12 },
        { id: "boss_found_3", name: "叛逃內門弟子", desc: "掌握宗門劍法，不容小覷。", power: 60, rewardContrib: 120, rewardStones: 120, rewardRep: 120, realmLevel: 14 },

        // 金丹期 (Core: CP 2500 - 5000)
        { id: "boss_core_1", name: "赤炎妖虎", desc: "渾身燃燒著烈焰的兇猛妖獸。", power: 100, rewardContrib: 300, rewardStones: 300, rewardRep: 300, realmLevel: 16 },
        { id: "boss_core_2", name: "千年樹妖", desc: "盤踞在深山的古老妖物，根鬚如鐵。", power: 150, rewardContrib: 500, rewardStones: 500, rewardRep: 500, realmLevel: 18 },
        { id: "boss_core_3", name: "血影刺客", desc: "專門獵殺修士的頂尖殺手。", power: 220, rewardContrib: 800, rewardStones: 800, rewardRep: 800, realmLevel: 20 },

        // 元嬰期 (Soul: CP 10000+)
        { id: "boss_soul_1", name: "深淵魔使", desc: "來自魔界的先鋒，實力深不可測。", power: 450, rewardContrib: 2000, rewardStones: 2000, rewardRep: 2000, realmLevel: 24 },

        // 化神期 (Divinity: CP 20000+)
        { id: "boss_divinity_1", name: "化神魔尊", desc: "掌握部分天地法則的魔道大能。", power: 600, rewardContrib: 2500, rewardStones: 3000, rewardRep: 3000, realmLevel: 25 },
        { id: "boss_divinity_2", name: "上古劍靈", desc: "遊蕩在古戰場的強大殘魂劍意。", power: 800, rewardContrib: 3500, rewardStones: 4500, rewardRep: 4000, realmLevel: 27 },
        { id: "boss_divinity_3", name: "虛空吞噬者", desc: "能夠吞噬空間裂縫的異界生物。", power: 1000, rewardContrib: 5000, rewardStones: 6000, rewardRep: 6000, realmLevel: 29 },

        // 煉虛期 (Void: CP 50000+)
        { id: "boss_void_1", name: "煉虛老祖", desc: "閉關千年的宗門老怪，舉手投足撕裂虛空。", power: 1500, rewardContrib: 8000, rewardStones: 10000, rewardRep: 10000, realmLevel: 30 },
        { id: "boss_void_2", name: "星空巨獸", desc: "遊蕩於星域之間的龐大巨獸。", power: 2000, rewardContrib: 12000, rewardStones: 15000, rewardRep: 15000, realmLevel: 32 },
        { id: "boss_void_3", name: "混沌魔神", desc: "誕生於混沌之中的原始魔神投影。", power: 2800, rewardContrib: 18000, rewardStones: 25000, rewardRep: 20000, realmLevel: 34 },

        // 合體期 (Unity: CP 100000+)
        { id: "boss_unity_1", name: "合體大能", desc: "肉身與元神完美融合，近乎不死不滅。", power: 4000, rewardContrib: 30000, rewardStones: 50000, rewardRep: 30000, realmLevel: 35 }
    ],

    // === 懸賞 BOSS 挑戰邏輯 ===
    async challengeBoss(bossId) {
        const boss = this.bosses.find(b => b.id === bossId);
        if (!boss) return alert("錯誤：找不到該BOSS");

        // Safe parent access attempt
        let p = null;
        try {
            p = window.state;
            if (!p && window.parent) p = window.parent.state || window.parent.gameState;
        } catch (err) {
            console.warn("Parent access blocked:", err);
            p = { name: "Player" };
        }

        if (!p) return alert("錯誤：找不到玩家資料");

        // 2. 構建戰鬥數據
        // Nerfed stats for better balance
        // 2. 構建戰鬥數據
        // Nerfed stats for better balance
        const battleBoss = {
            id: boss.id,
            name: boss.name,
            maxHp: boss.power * 12,
            hp: boss.power * 12,
            attack: Math.floor(boss.power * 1.0),
            defense: Math.floor(boss.power * 0.2),
            critRate: 0.1,
            critDamage: 0.5,
            elementAttack: "fire",
            color: "#8B0000",
            realmLevel: boss.realmLevel || 10 // Pass realmLevel
        };

        // 3. 保存戰鬥上下文
        localStorage.setItem("current-battle-enemy", JSON.stringify(battleBoss));
        localStorage.setItem("battle-return-to", "contribution");

        // 4. Navigate
        if (window.parent && window.parent.document) {
            const frame = window.parent.document.getElementById("faction-frame");
            if (frame) {
                // Ensure overlay visible
                const overlay = window.parent.document.getElementById("faction-overlay");
                if (overlay) overlay.style.display = "block";
                frame.src = "123.html";
            } else {
                window.location.href = "123.html";
            }
        } else {
            window.location.href = "123.html";
        }
    },

    // === 小遊戲：猜大小 (靈石賭注) ===
    gamble(betStart, choice) {
        // betStart: 'low' (1-3) or 'high' (4-6)
        // 骰子 1-6
        const dice = Math.floor(Math.random() * 6) + 1;
        const isLow = dice <= 3;
        const result = isLow ? 'low' : 'high';

        const win = (choice === result);
        return {
            dice: dice,
            win: win,
            msg: win ? `骰出 ${dice}，你贏了！` : `骰出 ${dice}，你輸了...`
        };
    },

    // === 小遊戲：宗門猜拳 (贏了拿貢獻) ===
    // 0: 剪刀, 1: 石頭, 2: 布
    rps(playerChoice) {
        const elderChoice = Math.floor(Math.random() * 3);
        // 判斷勝負
        // 平手: 0-0, 1-1, 2-2
        // 贏: 0-2 (剪刀>布), 1-0 (石頭>剪刀), 2-1 (布>石頭)
        // 輸: else

        let result = 'draw';
        if (playerChoice === elderChoice) {
            result = 'draw';
        } else if (
            (playerChoice === 0 && elderChoice === 2) ||
            (playerChoice === 1 && elderChoice === 0) ||
            (playerChoice === 2 && elderChoice === 1)
        ) {
            result = 'win';
        } else {
            result = 'lose';
        }

        const names = ["剪刀", "石頭", "布"];
        return {
            elderChoice: elderChoice,
            elderChoiceName: names[elderChoice],
            result: result
        };
    }
};

// 掛載到 window (讓 faction.html 可以存取)
window.ContributionHall = ContributionHall;
