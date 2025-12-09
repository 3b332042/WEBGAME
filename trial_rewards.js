// trial_rewards.js
// 歷練獎勵系統

// 獎勵配置表
const TrialRewards = {
    // 試劍山獎勵
    sword_mountain: {
        // 觀戰獲得丹藥
        watch_reward: {
            items: [
                { id: "qi_pill_percent_small", count: 3 }
            ],
            spiritStones: 50,
            qi: 100,
            log: "你獲得了修士贈與的丹藥和一些靈石。"
        },

        // 助戰受傷後療傷
        attack_heal: {
            items: [
                { id: "qi_pill_percent_medium", count: 2 }
            ],
            spiritStones: 80,
            qi: 200,
            comprehension: 1,
            log: "療傷丹藥效驚人，你的傷勢痊癒，境界也有所精進。"
        },

        // 河邊發現靈草
        river_walk: {
            items: [
                { id: "spirit_grass", count: 2 }
            ],
            spiritStones: 30,
            log: "你在河邊發現了兩株靈草。"
        },

        // 成功偷取水底靈物
        sneak_left_escape: {
            items: [
                { id: "spirit_stone_small", count: 1 },
                { id: "qi_pill_percent_medium", count: 1 }
            ],
            spiritStones: 150,
            qi: 300,
            luck: 1,
            log: "你成功奪得水底靈物，這是一塊蘊含靈氣的寶石！"
        },

        // 青衫男修遺物（接受）
        accept_gift: {
            items: [
                { id: "mithril_ore", count: 1 },
                { id: "qi_pill_percent_medium", count: 2 }
            ],
            spiritStones: 100,
            log: "木盒中有一塊秘銀礦和幾顆丹藥。"
        },

        // 拒絕遺物後離開
        reject_leave: {
            items: [
                { id: "spirit_grass", count: 1 }
            ],
            spiritStones: 20,
            mindset: 1,
            log: "雖然沒有獲得太多收穫，但你的心境有所提升。"
        },

        // 加入青雲宗
        join_faction: {
            items: [
                { id: "qi_pill_percent_medium", count: 3 },
                { id: "spirit_stone_small", count: 2 }
            ],
            spiritStones: 200,
            qi: 500,
            comprehension: 2,
            log: "你獲得了青雲宗的入門資源和修煉指導。"
        },

        // 獲得丹典
        cave_reward: {
            items: [
                { id: "alchemy_manual", count: 1 }
            ],
            spiritStones: 300,
            qi: 300,
            mindset: 10,
            log: "你獲得了前輩遺留的《青囊丹經》殘卷！"
        },

        // 獲得器譜 (劍爐)
        weapon_reward: {
            items: [
                { id: "weapon_manual", count: 1 },
                { id: "material_weapon_iron_white", count: 5 }
            ],
            spiritStones: 300,
            qi: 300,
            baseAttack: 5,
            log: "你獲得了歐冶子遺留的《歐冶器譜》殘卷！"
        },

        // 獲得陣圖 (石林)
        formation_reward: {
            items: [
                { id: "formation_manual", count: 1 },
                { id: "material_formation_flag_white", count: 2 }
            ],
            spiritStones: 300,
            qi: 300,
            comprehension: 2,
            log: "你獲得了古修遺留的《璇璣陣圖》殘卷！"
        },

        // 獲得符錄 (古樹)
        talisman_reward: {
            items: [
                { id: "talisman_manual", count: 1 },
                { id: "material_talisman_paper_white", count: 10 }
            ],
            spiritStones: 300,
            qi: 300,
            luck: 2,
            log: "你獲得了天師遺留的《天師符錄》殘卷！"
        },

        // 深入劍山支線的各種小獎勵
        side_path_reward_1: {
            items: [
                { id: "iron_ore", count: 2 }
            ],
            spiritStones: 40,
            log: "你在山路上發現了一些礦石。"
        },

        side_path_reward_2: {
            items: [
                { id: "talisman_paper", count: 3 }
            ],
            spiritStones: 30,
            log: "你撿到了幾張符紙。"
        }
    }
};

// 發放獎勵函數
function grantTrialReward(trialId, rewardId) {
    const reward = TrialRewards[trialId]?.[rewardId];
    if (!reward) {
        console.warn(`未找到獎勵: ${trialId}.${rewardId}`);
        return;
    }

    // 記錄獲得的物品名稱
    const itemNames = [];

    // 發放物品
    if (reward.items && reward.items.length > 0) {
        reward.items.forEach(item => {
            if (typeof grantItem === "function") {
                for (let i = 0; i < item.count; i++) {
                    grantItem(item.id);
                }
                // 獲取物品名稱
                if (typeof ItemDB !== "undefined" && ItemDB[item.id]) {
                    const itemName = ItemDB[item.id].name || item.id;
                    itemNames.push(`${itemName} x${item.count}`);
                }
            }
        });
    }

    // 發放靈石
    if (reward.spiritStones) {
        state.spiritStones += reward.spiritStones;
    }

    // 發放真氣
    if (reward.qi) {
        state.qi += reward.qi;
    }

    // 提升屬性
    if (reward.comprehension) {
        state.comprehension += reward.comprehension;
    }

    if (reward.mindset) {
        state.mindset += reward.mindset;
    }

    if (reward.luck) {
        state.luck += reward.luck;
    }

    // 記錄主要日誌
    if (reward.log && typeof addLog === "function") {
        addLog(reward.log, "event");
    }

    // 記錄詳細獲得物品
    if (itemNames.length > 0 && typeof addLog === "function") {
        addLog(`獲得物品：${itemNames.join("、")}`, "great-event");
    }

    // 記錄靈石和真氣
    const gains = [];
    if (reward.spiritStones) gains.push(`靈石 +${reward.spiritStones}`);
    if (reward.qi) gains.push(`真氣 +${reward.qi}`);
    if (reward.comprehension) gains.push(`悟性 +${reward.comprehension}`);
    if (reward.mindset) gains.push(`心境 +${reward.mindset}`);
    if (reward.luck) gains.push(`氣運 +${reward.luck}`);

    if (gains.length > 0 && typeof addLog === "function") {
        addLog(`屬性提升：${gains.join("、")}`, "great-event");
    }

    // 更新UI
    if (typeof renderUI === "function") {
        renderUI();
    }
}

// 暴露到全局
window.TrialRewards = TrialRewards;
window.grantTrialReward = grantTrialReward;
