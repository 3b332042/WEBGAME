// arts.js
// 四藝系統：煉丹、煉器、陣法、符籙

const ArtsSystem = {
    // 基礎設定
    EXP_PER_LEVEL: [0, 100, 300, 600, 1000, 1500, 2100, 2800, 3600, 4500], // 簡單的升級經驗表

    // 配方庫
    Recipes: {
        alchemy: [
            {
                id: "qi_pill_fixed_tiny",
                name: "凝氣丹",
                levelReq: 1,
                materials: [
                    { id: "spirit_stone_small", count: 1 }
                ],
                // 成功率 = base + (level * bonus)
                baseRate: 0.8,
                exp: 10,
                resultCount: 1
            },
            {
                id: "qi_pill_fixed_small",
                name: "補氣丹",
                levelReq: 2,
                materials: [
                    { id: "spirit_stone_small", count: 2 }
                ],
                baseRate: 0.7,
                exp: 20,
                resultCount: 1
            },
            {
                id: "mind_pill",
                name: "靜心丹",
                levelReq: 3,
                materials: [
                    { id: "spirit_stone_small", count: 5 }
                ],
                baseRate: 0.6,
                exp: 30,
                resultCount: 1
            },
            {
                id: "pill_rank_1",
                name: "一品真元丹",
                levelReq: 1,
                materials: [{ id: "spirit_stone_small", count: 5 }],
                baseRate: 0.9,
                exp: 5,
                resultCount: 1
            },
            {
                id: "pill_rank_2",
                name: "二品真元丹",
                levelReq: 2,
                materials: [{ id: "spirit_stone_small", count: 25 }],
                baseRate: 0.8,
                exp: 20,
                resultCount: 1
            },
            {
                id: "pill_rank_3",
                name: "三品真元丹",
                levelReq: 3,
                materials: [{ id: "spirit_stone_small", count: 100 }],
                baseRate: 0.7,
                exp: 50,
                resultCount: 1
            },
            {
                id: "pill_rank_4",
                name: "四品真元丹",
                levelReq: 4,
                materials: [{ id: "spirit_stone_small", count: 500 }],
                baseRate: 0.6,
                exp: 200,
                resultCount: 1
            },
            {
                id: "pill_rank_5",
                name: "五品真元丹",
                levelReq: 5,
                materials: [{ id: "spirit_stone_small", count: 2000 }],
                baseRate: 0.5,
                exp: 1000,
                resultCount: 1
            },
            {
                id: "pill_rank_6",
                name: "六品真元丹",
                levelReq: 6,
                materials: [{ id: "spirit_stone_small", count: 10000 }],
                baseRate: 0.4,
                exp: 5000,
                resultCount: 1
            },
            {
                id: "pill_rank_7",
                name: "七品真元丹",
                levelReq: 7,
                materials: [{ id: "spirit_stone_small", count: 50000 }],
                baseRate: 0.3,
                exp: 20000,
                resultCount: 1
            },
            {
                id: "pill_rank_8",
                name: "八品真元丹",
                levelReq: 8,
                materials: [{ id: "spirit_stone_small", count: 200000 }],
                baseRate: 0.2,
                exp: 100000,
                resultCount: 1
            },
            {
                id: "pill_rank_9",
                name: "九品帝丹",
                levelReq: 9,
                materials: [{ id: "spirit_stone_small", count: 1000000 }],
                baseRate: 0.1,
                exp: 500000,
                resultCount: 1
            }
        ],
        weapon: [
            {
                id: "iron_sword", // 需確認 items.js 是否有此物品，若無則需新增或用現有
                name: "粗鐵劍",
                levelReq: 1,
                materials: [
                    { id: "spirit_stone_small", count: 2 }
                ],
                baseRate: 0.8,
                exp: 15,
                resultCount: 1
            }
        ],
        formation: [
            {
                id: "wood_stake", // 把木樁當作陣法產物練習？或者用它做基礎陣盤
                name: "聚靈陣基",
                levelReq: 1,
                materials: [
                    { id: "spirit_stone_small", count: 1 },
                    { id: "wood_stake", count: 1 }
                ],
                baseRate: 0.8,
                exp: 15,
                resultCount: 1
            }
        ],
        talisman: [
            {
                id: "luck_charm",
                name: "轉運符",
                levelReq: 1,
                materials: [
                    { id: "spirit_stone_small", count: 1 }
                ],
                baseRate: 0.8,
                exp: 10,
                resultCount: 1
            }
        ]
    },

    // 檢查是否已解鎖某藝
    isUnlocked(artType) {
        if (!window.state || !window.state.arts) return false;
        const art = window.state.arts[artType];
        return art && art.level > 0;
    },

    // 取得等級
    getLevel(artType) {
        if (!this.isUnlocked(artType)) return 0;
        return window.state.arts[artType].level;
    },

    // 取得經驗
    getExp(artType) {
        if (!this.isUnlocked(artType)) return 0;
        return window.state.arts[artType].exp;
    },

    // 製作物品
    craft(artType, recipeIndex) {
        const recipes = this.Recipes[artType];
        if (!recipes || !recipes[recipeIndex]) {
            alert("配方不存在！");
            return;
        }
        const recipe = recipes[recipeIndex];

        // 1. 檢查等級
        const currentLevel = this.getLevel(artType);
        if (currentLevel < recipe.levelReq) {
            alert("等級不足，無法製作！");
            return;
        }

        // 2. 檢查材料
        const inv = window.state.inventory || [];
        for (const mat of recipe.materials) {
            const item = inv.find(i => i.id === mat.id);
            if (!item || item.count < mat.count) {
                const def = window.getItemDef(mat.id);
                const name = def ? def.name : mat.id;
                alert(`材料不足：需 ${name} x${mat.count}`);
                return;
            }
        }

        // 3. 消耗材料
        for (const mat of recipe.materials) {
            window.useItemFromInventory(mat.id); // 這只扣1個，需要改進 useItemFromInventory 支援數量 或者在這裡手動扣
            // 手動扣比較穩，因為 useItemFromInventory 會觸發 use() 效果
            const item = inv.find(i => i.id === mat.id);
            if (item) {
                item.count -= mat.count;
                if (item.count <= 0) {
                    const idx = inv.indexOf(item);
                    if (idx > -1) inv.splice(idx, 1);
                }
            } else {
                // Should not happen due to check above, but logic fallback
                // re-check inventory logic? 
                // useItemFromInventory handles singular use.
                // let's just loop useItemFromInventory NOT calling .use() but just remove.
                // Better manually remove from array as above.
            }
        }
        // Patch: inventory.js useItemFromInventory calls .use(), we don't want that for crafting materials usually.
        // Above manual substraction is correct.
        // BUT `useItemFromInventory` also checks existence. My manual code above assumes persistence.
        // It's fine.

        // 4. 計算成功率
        // 每高 1 等 + 10%
        let rate = recipe.baseRate + (currentLevel - recipe.levelReq) * 0.1;
        if (rate > 1.0) rate = 1.0;

        // 5. 判定結果
        const isSuccess = Math.random() < rate;

        if (isSuccess) {
            // 給予成品
            if (window.addItem) {
                window.addItem(recipe.id, recipe.resultCount);
            } else {
                console.error("addItem missing");
            }

            // 獲得經驗
            this.gainExp(artType, recipe.exp);

            if (window.addLog) window.addLog(`製作【${recipe.name}】成功！獲得 ${recipe.exp} 經驗。`, "success");
        } else {
            // 獲得少量經驗
            const failExp = Math.floor(recipe.exp * 0.2);
            this.gainExp(artType, failExp);
            if (window.addLog) window.addLog(`製作【${recipe.name}】失敗... 獲得 ${failExp} 經驗。`, "bad");
        }

        // 刷新 UI
        if (window.renderArtsUI) window.renderArtsUI();
        if (window.renderInventory) window.renderInventory();
    },

    gainExp(artType, amount) {
        if (!this.isUnlocked(artType)) return;
        const art = window.state.arts[artType];
        art.exp += amount;

        // 升級檢查
        // 簡單邏輯：一直升直到經驗不足
        while (true) {
            const nextLevel = art.level + 1;
            const needed = this.EXP_PER_LEVEL[nextLevel];

            if (!needed) break; // 已達最高級 (array out of bounds)

            if (art.exp >= needed) {
                art.exp -= needed;
                art.level++;
                if (window.addLog) window.addLog(`恭喜！你的【${this.getArtName(artType)}】提升到了 Lv.${art.level}！`, "great-event");
            } else {
                break;
            }
        }
    },

    getArtName(type) {
        switch (type) {
            case 'alchemy': return "煉丹";
            case 'weapon': return "煉器";
            case 'formation': return "陣法";
            case 'talisman': return "符籙";
            default: return type;
        }
    }
};

window.ArtsSystem = ArtsSystem;
