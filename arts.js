// arts.js
// 四藝系統：煉丹、煉器、陣法、符籙
// updated for strict alternating tier logic: 
// Odd Lvs (1,3,5...) = Transition (Higher Tier + Lower Tier) or Entry (Single Type)
// Even Lvs (2,4,6...) = Mastery (Multiple Types of Same Tier)

const ArtsSystem = {
    // 基礎設定
    EXP_PER_LEVEL: [0, 100, 300, 600, 1000, 1500, 2100, 2800, 3600, 4500],

    // 配方庫
    Recipes: {
        alchemy: [
            // === 1品 (入門: 單種白色) ===
            {
                id: "qi_pill_fixed_tiny",
                name: "凝氣丹",
                levelReq: 1,
                materials: [
                    { id: "pill_white_1", count: 3 } // 只需一種
                ],
                baseRate: 0.9,
                exp: 10,
                resultCount: 1
            },

            // === 2品 (熟練: 多種白色) ===
            {
                id: "qi_pill_fixed_small",
                name: "補氣丹",
                levelReq: 2,
                materials: [
                    { id: "pill_white_2", count: 2 },
                    { id: "pill_white_3", count: 2 }
                ],
                baseRate: 0.85,
                exp: 20,
                resultCount: 1
            },


            // === 3品 (進階: 綠色 + 白色) ===
            {
                id: "qi_pill_fixed_mid",
                name: "聚氣丹",
                levelReq: 3,
                materials: [
                    { id: "pill_green_1", count: 1 }, // 核心綠
                    { id: "pill_white_5", count: 3 }  // 輔助白
                ],
                baseRate: 0.8,
                exp: 40,
                resultCount: 1
            },
            {
                id: "mind_pill",
                name: "靜心丹",
                levelReq: 3,
                materials: [
                    { id: "pill_green_2", count: 1 },
                    { id: "pill_white_4", count: 3 }
                ],
                baseRate: 0.75,
                exp: 50,
                resultCount: 1
            },
            {
                id: "comp_tea",
                name: "悟道靈茶",
                levelReq: 3,
                materials: [
                    { id: "pill_green_3", count: 1 },
                    { id: "pill_white_2", count: 5 } // 消耗大量低階
                ],
                baseRate: 0.7,
                exp: 60,
                resultCount: 1
            },

            // === 4品 (精通: 多種綠色) ===
            {
                id: "qi_pill_fixed_large",
                name: "培元丹",
                levelReq: 4,
                materials: [
                    { id: "pill_green_1", count: 2 },
                    { id: "pill_green_2", count: 2 }
                ],
                baseRate: 0.75,
                exp: 80,
                resultCount: 1
            },


            // === 5品 (突破: 藍色 + 綠色) ===
            {
                id: "qi_pill_small",
                name: "回氣丹（小）",
                levelReq: 5,
                materials: [
                    { id: "pill_blue_1", count: 1 },
                    { id: "pill_green_1", count: 3 }
                ],
                baseRate: 0.7,
                exp: 150,
                resultCount: 1
            },


            // === 6品 (大師: 多種藍色) ===
            {
                id: "qi_pill_mid",
                name: "回氣丹（中）",
                levelReq: 6,
                materials: [
                    { id: "pill_blue_3", count: 2 },
                    { id: "pill_blue_4", count: 2 }
                ],
                baseRate: 0.65,
                exp: 300,
                resultCount: 1
            },


            // === 7品 (宗師: 紫色 + 藍色) ===
            {
                id: "qi_pill_large",
                name: "回氣丹（大）",
                levelReq: 7,
                materials: [
                    { id: "pill_purple_1", count: 1 },
                    { id: "pill_blue_5", count: 3 }
                ],
                baseRate: 0.6,
                exp: 600,
                resultCount: 1
            },





            // === 新增：壽元類 ===
            {
                id: "longevity_pill_small", // 延壽丹 (3品)
                name: "延壽丹",
                levelReq: 3,
                materials: [
                    { id: "pill_green_2", count: 1 },
                    { id: "pill_white_3", count: 5 }
                ],
                baseRate: 0.75,
                exp: 50,
                resultCount: 1
            },
            {
                id: "longevity_pill_mid", // 長生丹 (5品)
                name: "長生丹",
                levelReq: 5,
                materials: [
                    { id: "pill_blue_4", count: 1 },
                    { id: "pill_green_2", count: 3 }
                ],
                baseRate: 0.65,
                exp: 200,
                resultCount: 1
            },
            {
                id: "longevity_pill_large", // 壽與天齊丹 (7品)
                name: "壽與天齊丹",
                levelReq: 7,
                materials: [
                    { id: "pill_purple_1", count: 1 },
                    { id: "pill_blue_2", count: 3 }
                ],
                baseRate: 0.5,
                exp: 600,
                resultCount: 1
            },

            // === 新增：突破輔助類 ===
            {
                id: "break_pill_small", // 破境丹 (2品)
                name: "破境丹",
                levelReq: 2,
                materials: [
                    { id: "pill_white_1", count: 2 },
                    { id: "pill_white_5", count: 2 }
                ],
                baseRate: 0.85,
                exp: 30,
                resultCount: 1
            },
            {
                id: "break_pill_mid", // 護脈丹 (4品)
                name: "護脈丹",
                levelReq: 4,
                materials: [
                    { id: "pill_green_3", count: 2 },
                    { id: "pill_green_5", count: 2 }
                ],
                baseRate: 0.75,
                exp: 100,
                resultCount: 1
            },
            {
                id: "break_pill_large", // 天心丹 (7品)
                name: "天心丹",
                levelReq: 7,
                materials: [
                    { id: "pill_purple_1", count: 2 },
                    { id: "pill_blue_3", count: 3 }
                ],
                baseRate: 0.5,
                exp: 800,
                resultCount: 1
            },

            // === 新增：8品 (大宗師: 多種紫色) ===
            {
                id: "qi_pill_mega", // 太清丹 (8品) 大量真氣
                name: "太清丹",
                levelReq: 8,
                materials: [
                    { id: "pill_purple_2", count: 2 }, // 紫
                    { id: "pill_purple_3", count: 2 }  // 紫
                ],
                baseRate: 0.4,
                exp: 1200,
                resultCount: 1
            },
            {
                id: "soul_pill", // 養魂丹 (8品) 永久屬性
                name: "養魂丹",
                levelReq: 8,
                materials: [
                    { id: "pill_purple_4", count: 2 }, // 紫
                    { id: "pill_purple_5", count: 2 }  // 紫
                ],
                baseRate: 0.4,
                exp: 1500,
                resultCount: 1
            },

            // === 新增：9品 (仙品: 橙階特殊材料) ===
            {
                id: "immortal_essence_pill", // 仙元丹 (9品)
                name: "仙元丹",
                levelReq: 9,
                materials: [
                    { id: "herb_immortal", count: 1 }, // 橙階特殊材料
                    { id: "pill_purple_1", count: 3 },
                    { id: "pill_purple_2", count: 3 }
                ],
                baseRate: 0.3,
                exp: 3000,
                resultCount: 1
            },
            {
                id: "nirvana_pill", // 涅槃重生丹 (9品)
                name: "涅槃重生丹",
                levelReq: 9,
                materials: [
                    { id: "herb_immortal", count: 1 }, // 橙階特殊材料
                    { id: "pill_purple_3", count: 3 },
                    { id: "pill_purple_4", count: 3 }
                ],
                baseRate: 0.3,
                exp: 3000,
                resultCount: 1
            }
        ],


        weapon: [
            // ===== 法器 (Weapons) =====
            // Level 1
            { id: "iron_sword", name: "粗鐵劍", levelReq: 1, materials: [{ id: "weapon_white_1", count: 3 }], baseRate: 0.9, exp: 15, resultCount: 1 },
            // Level 2
            { id: "steel_sword", name: "精鋼劍", levelReq: 2, materials: [{ id: "weapon_white_2", count: 2 }, { id: "weapon_white_3", count: 2 }], baseRate: 0.85, exp: 25, resultCount: 1 },
            // Level 3
            { id: "bronze_sword", name: "青銅劍", levelReq: 3, materials: [{ id: "weapon_green_1", count: 1 }, { id: "weapon_white_5", count: 3 }], baseRate: 0.8, exp: 40, resultCount: 1 },
            // Level 4
            { id: "cold_iron_sword", name: "寒鐵劍", levelReq: 4, materials: [{ id: "weapon_green_2", count: 2 }, { id: "weapon_green_3", count: 2 }], baseRate: 0.75, exp: 60, resultCount: 1 },
            // Level 5
            { id: "mystic_sword", name: "玄鐵劍", levelReq: 5, materials: [{ id: "weapon_blue_1", count: 1 }, { id: "weapon_green_5", count: 3 }], baseRate: 0.7, exp: 100, resultCount: 1 },
            // Level 6
            { id: "spirit_sword", name: "靈鋼劍", levelReq: 6, materials: [{ id: "weapon_blue_2", count: 2 }, { id: "weapon_blue_3", count: 2 }], baseRate: 0.6, exp: 200, resultCount: 1 },
            // Level 7
            { id: "flame_sword", name: "赤炎劍", levelReq: 7, materials: [{ id: "weapon_purple_1", count: 1 }, { id: "weapon_blue_5", count: 3 }], baseRate: 0.5, exp: 400, resultCount: 1 },
            // Level 8
            { id: "void_sword", name: "虛空劍", levelReq: 8, materials: [{ id: "weapon_purple_2", count: 2 }, { id: "weapon_purple_3", count: 2 }], baseRate: 0.4, exp: 800, resultCount: 1 },
            // Level 9
            { id: "heaven_sword", name: "天罡劍", levelReq: 9, materials: [{ id: "ore_meteoric", count: 1 }, { id: "weapon_purple_5", count: 3 }], baseRate: 0.3, exp: 1500, resultCount: 1 },

            // ===== 頭部 (Head Armor) =====
            // Level 1
            { id: "cloth_hat", name: "布帽", levelReq: 1, materials: [{ id: "weapon_white_1", count: 2 }], baseRate: 0.95, exp: 10, resultCount: 1 },
            // Level 2
            { id: "iron_helm", name: "鐵盔", levelReq: 2, materials: [{ id: "weapon_white_2", count: 2 }, { id: "weapon_white_1", count: 2 }], baseRate: 0.9, exp: 20, resultCount: 1 },
            // Level 3
            { id: "bronze_helm", name: "青銅盔", levelReq: 3, materials: [{ id: "weapon_green_1", count: 1 }, { id: "weapon_white_4", count: 3 }], baseRate: 0.85, exp: 35, resultCount: 1 },
            // Level 4
            { id: "steel_helm", name: "精鋼盔", levelReq: 4, materials: [{ id: "weapon_green_2", count: 2 }, { id: "weapon_green_1", count: 2 }], baseRate: 0.8, exp: 55, resultCount: 1 },
            // Level 5
            { id: "mystic_helm", name: "玄鐵盔", levelReq: 5, materials: [{ id: "weapon_blue_1", count: 1 }, { id: "weapon_green_4", count: 3 }], baseRate: 0.75, exp: 90, resultCount: 1 },
            // Level 6
            { id: "spirit_helm", name: "靈鋼盔", levelReq: 6, materials: [{ id: "weapon_blue_2", count: 2 }, { id: "weapon_blue_1", count: 2 }], baseRate: 0.65, exp: 180, resultCount: 1 },
            // Level 7
            { id: "dragon_helm", name: "龍鱗盔", levelReq: 7, materials: [{ id: "weapon_purple_1", count: 1 }, { id: "weapon_blue_4", count: 3 }], baseRate: 0.55, exp: 350, resultCount: 1 },
            // Level 8
            { id: "phoenix_helm", name: "鳳羽冠", levelReq: 8, materials: [{ id: "weapon_purple_2", count: 2 }, { id: "weapon_purple_1", count: 2 }], baseRate: 0.45, exp: 700, resultCount: 1 },
            // Level 9
            { id: "heaven_helm", name: "天罡盔", levelReq: 9, materials: [{ id: "ore_meteoric", count: 1 }, { id: "weapon_purple_4", count: 3 }], baseRate: 0.35, exp: 1300, resultCount: 1 },

            // ===== 衣服 (Body Armor) =====
            // Level 1
            { id: "cloth_robe", name: "布袍", levelReq: 1, materials: [{ id: "weapon_white_1", count: 3 }], baseRate: 0.9, exp: 12, resultCount: 1 },
            // Level 2
            { id: "leather_armor", name: "皮甲", levelReq: 2, materials: [{ id: "weapon_white_3", count: 3 }, { id: "weapon_white_2", count: 2 }], baseRate: 0.85, exp: 22, resultCount: 1 },
            // Level 3
            { id: "bronze_armor", name: "青銅甲", levelReq: 3, materials: [{ id: "weapon_green_1", count: 1 }, { id: "weapon_white_5", count: 3 }], baseRate: 0.8, exp: 38, resultCount: 1 },
            // Level 4
            { id: "steel_armor", name: "精鋼甲", levelReq: 4, materials: [{ id: "weapon_green_2", count: 2 }, { id: "weapon_green_3", count: 2 }], baseRate: 0.75, exp: 58, resultCount: 1 },
            // Level 5
            { id: "mystic_armor", name: "玄鐵甲", levelReq: 5, materials: [{ id: "weapon_blue_1", count: 1 }, { id: "weapon_green_5", count: 3 }], baseRate: 0.7, exp: 95, resultCount: 1 },
            // Level 6
            { id: "spirit_armor", name: "靈鋼甲", levelReq: 6, materials: [{ id: "weapon_blue_2", count: 2 }, { id: "weapon_blue_3", count: 2 }], baseRate: 0.6, exp: 190, resultCount: 1 },
            // Level 7
            { id: "dragon_armor", name: "龍鱗甲", levelReq: 7, materials: [{ id: "weapon_purple_1", count: 1 }, { id: "weapon_blue_5", count: 3 }], baseRate: 0.5, exp: 380, resultCount: 1 },
            // Level 8
            { id: "phoenix_armor", name: "鳳羽衣", levelReq: 8, materials: [{ id: "weapon_purple_3", count: 2 }, { id: "weapon_purple_2", count: 2 }], baseRate: 0.4, exp: 750, resultCount: 1 },
            // Level 9
            { id: "heaven_armor", name: "天罡甲", levelReq: 9, materials: [{ id: "ore_meteoric", count: 1 }, { id: "weapon_purple_5", count: 3 }], baseRate: 0.3, exp: 1400, resultCount: 1 },

            // ===== 褲子 (Leg Armor) =====
            // Level 1
            { id: "cloth_pants", name: "布褲", levelReq: 1, materials: [{ id: "weapon_white_1", count: 2 }], baseRate: 0.95, exp: 10, resultCount: 1 },
            // Level 2
            { id: "leather_pants", name: "皮褲", levelReq: 2, materials: [{ id: "weapon_white_3", count: 2 }, { id: "weapon_white_1", count: 2 }], baseRate: 0.9, exp: 20, resultCount: 1 },
            // Level 3
            { id: "bronze_pants", name: "青銅護腿", levelReq: 3, materials: [{ id: "weapon_green_1", count: 1 }, { id: "weapon_white_4", count: 3 }], baseRate: 0.85, exp: 35, resultCount: 1 },
            // Level 4
            { id: "steel_pants", name: "精鋼護腿", levelReq: 4, materials: [{ id: "weapon_green_2", count: 2 }, { id: "weapon_green_1", count: 2 }], baseRate: 0.8, exp: 55, resultCount: 1 },
            // Level 5
            { id: "mystic_pants", name: "玄鐵護腿", levelReq: 5, materials: [{ id: "weapon_blue_1", count: 1 }, { id: "weapon_green_4", count: 3 }], baseRate: 0.75, exp: 90, resultCount: 1 },
            // Level 6
            { id: "spirit_pants", name: "靈鋼護腿", levelReq: 6, materials: [{ id: "weapon_blue_2", count: 2 }, { id: "weapon_blue_1", count: 2 }], baseRate: 0.65, exp: 180, resultCount: 1 },
            // Level 7
            { id: "dragon_pants", name: "龍鱗護腿", levelReq: 7, materials: [{ id: "weapon_purple_1", count: 1 }, { id: "weapon_blue_4", count: 3 }], baseRate: 0.55, exp: 350, resultCount: 1 },
            // Level 8
            { id: "phoenix_pants", name: "鳳羽裙", levelReq: 8, materials: [{ id: "weapon_purple_2", count: 2 }, { id: "weapon_purple_1", count: 2 }], baseRate: 0.45, exp: 700, resultCount: 1 },
            // Level 9
            { id: "heaven_pants", name: "天罡護腿", levelReq: 9, materials: [{ id: "ore_meteoric", count: 1 }, { id: "weapon_purple_4", count: 3 }], baseRate: 0.35, exp: 1300, resultCount: 1 },

            // ===== 鞋子 (Feet Armor) =====
            // Level 1
            { id: "cloth_shoes", name: "布鞋", levelReq: 1, materials: [{ id: "weapon_white_1", count: 2 }], baseRate: 0.95, exp: 8, resultCount: 1 },
            // Level 2
            { id: "leather_boots", name: "皮靴", levelReq: 2, materials: [{ id: "weapon_white_3", count: 2 }, { id: "weapon_white_2", count: 1 }], baseRate: 0.9, exp: 18, resultCount: 1 },
            // Level 3
            { id: "bronze_boots", name: "青銅靴", levelReq: 3, materials: [{ id: "weapon_green_1", count: 1 }, { id: "weapon_white_5", count: 2 }], baseRate: 0.85, exp: 32, resultCount: 1 },
            // Level 4
            { id: "steel_boots", name: "精鋼靴", levelReq: 4, materials: [{ id: "weapon_green_2", count: 2 }, { id: "weapon_green_3", count: 1 }], baseRate: 0.8, exp: 50, resultCount: 1 },
            // Level 5
            { id: "mystic_boots", name: "玄鐵靴", levelReq: 5, materials: [{ id: "weapon_blue_1", count: 1 }, { id: "weapon_green_5", count: 2 }], baseRate: 0.75, exp: 85, resultCount: 1 },
            // Level 6
            { id: "spirit_boots", name: "靈鋼靴", levelReq: 6, materials: [{ id: "weapon_blue_2", count: 2 }, { id: "weapon_blue_3", count: 1 }], baseRate: 0.65, exp: 170, resultCount: 1 },
            // Level 7
            { id: "dragon_boots", name: "龍鱗靴", levelReq: 7, materials: [{ id: "weapon_purple_1", count: 1 }, { id: "weapon_blue_5", count: 2 }], baseRate: 0.55, exp: 330, resultCount: 1 },
            // Level 8
            { id: "phoenix_boots", name: "鳳羽靴", levelReq: 8, materials: [{ id: "weapon_purple_3", count: 2 }, { id: "weapon_purple_2", count: 1 }], baseRate: 0.45, exp: 650, resultCount: 1 },
            // Level 9
            { id: "heaven_boots", name: "天罡靴", levelReq: 9, materials: [{ id: "ore_meteoric", count: 1 }, { id: "weapon_purple_5", count: 2 }], baseRate: 0.35, exp: 1200, resultCount: 1 }
        ],


        formation: [
            // === 陣法配方：需要上一階陣盤晉升，偶數品級每種材料需要3個 ===

            // === 1品 (入門: 全部白色材料，每種1個) ===
            {
                id: "dao_array_1",
                name: "九宮陣盤",
                levelReq: 1,
                materials: [
                    { id: "formation_white_1", count: 1 },
                    { id: "formation_white_2", count: 1 },
                    { id: "formation_white_3", count: 1 },
                    { id: "formation_white_4", count: 1 },
                    { id: "formation_white_5", count: 1 }
                ],
                baseRate: 0.9,
                exp: 30,
                resultCount: 1
            },

            // === 2品 (熟練: 需要1品陣盤 + 全部白色材料每種3個) ===
            {
                id: "dao_array_2",
                name: "八卦陣盤",
                levelReq: 2,
                materials: [
                    { id: "dao_array_1", count: 1 },
                    { id: "formation_white_1", count: 3 },
                    { id: "formation_white_2", count: 3 },
                    { id: "formation_white_3", count: 3 },
                    { id: "formation_white_4", count: 3 },
                    { id: "formation_white_5", count: 3 }
                ],
                baseRate: 0.85,
                exp: 50,
                resultCount: 1
            },

            // === 3品 (進階: 需要2品陣盤 + 全部綠色材料每種1個) ===
            {
                id: "dao_array_3",
                name: "七星陣盤",
                levelReq: 3,
                materials: [
                    { id: "dao_array_2", count: 1 },
                    { id: "formation_green_1", count: 1 },
                    { id: "formation_green_2", count: 1 },
                    { id: "formation_green_3", count: 1 },
                    { id: "formation_green_4", count: 1 },
                    { id: "formation_green_5", count: 1 }
                ],
                baseRate: 0.8,
                exp: 100,
                resultCount: 1
            },

            // === 4品 (精通: 需要3品陣盤 + 全部綠色材料每種3個) ===
            {
                id: "dao_array_4",
                name: "六道陣盤",
                levelReq: 4,
                materials: [
                    { id: "dao_array_3", count: 1 },
                    { id: "formation_green_1", count: 3 },
                    { id: "formation_green_2", count: 3 },
                    { id: "formation_green_3", count: 3 },
                    { id: "formation_green_4", count: 3 },
                    { id: "formation_green_5", count: 3 }
                ],
                baseRate: 0.75,
                exp: 150,
                resultCount: 1
            },

            // === 5品 (突破: 需要4品陣盤 + 全部藍色材料每種1個) ===
            {
                id: "dao_array_5",
                name: "五行陣盤",
                levelReq: 5,
                materials: [
                    { id: "dao_array_4", count: 1 },
                    { id: "formation_blue_1", count: 1 },
                    { id: "formation_blue_2", count: 1 },
                    { id: "formation_blue_3", count: 1 },
                    { id: "formation_blue_4", count: 1 },
                    { id: "formation_blue_5", count: 1 }
                ],
                baseRate: 0.7,
                exp: 250,
                resultCount: 1
            },

            // === 6品 (大師: 需要5品陣盤 + 全部藍色材料每種3個) ===
            {
                id: "dao_array_6",
                name: "四象陣盤",
                levelReq: 6,
                materials: [
                    { id: "dao_array_5", count: 1 },
                    { id: "formation_blue_1", count: 3 },
                    { id: "formation_blue_2", count: 3 },
                    { id: "formation_blue_3", count: 3 },
                    { id: "formation_blue_4", count: 3 },
                    { id: "formation_blue_5", count: 3 }
                ],
                baseRate: 0.65,
                exp: 400,
                resultCount: 1
            },

            // === 7品 (宗師: 需要6品陣盤 + 全部紫色材料每種1個) ===
            {
                id: "dao_array_7",
                name: "三才陣盤",
                levelReq: 7,
                materials: [
                    { id: "dao_array_6", count: 1 },
                    { id: "formation_purple_1", count: 1 },
                    { id: "formation_purple_2", count: 1 },
                    { id: "formation_purple_3", count: 1 },
                    { id: "formation_purple_4", count: 1 },
                    { id: "formation_purple_5", count: 1 }
                ],
                baseRate: 0.6,
                exp: 600,
                resultCount: 1
            },

            // === 8品 (大宗師: 需要7品陣盤 + 全部紫色材料每種3個) ===
            {
                id: "dao_array_8",
                name: "兩儀陣盤",
                levelReq: 8,
                materials: [
                    { id: "dao_array_7", count: 1 },
                    { id: "formation_purple_1", count: 3 },
                    { id: "formation_purple_2", count: 3 },
                    { id: "formation_purple_3", count: 3 },
                    { id: "formation_purple_4", count: 3 },
                    { id: "formation_purple_5", count: 3 }
                ],
                baseRate: 0.5,
                exp: 1000,
                resultCount: 1
            },

            // === 9品 (仙品: 需要8品陣盤 + 特殊材料 + 全部紫色材料每種1個) ===
            {
                id: "dao_array_9",
                name: "大道陣盤",
                levelReq: 9,
                materials: [
                    { id: "dao_array_8", count: 1 },
                    { id: "void_jade", count: 1 },
                    { id: "formation_purple_1", count: 1 },
                    { id: "formation_purple_2", count: 1 },
                    { id: "formation_purple_3", count: 1 },
                    { id: "formation_purple_4", count: 1 },
                    { id: "formation_purple_5", count: 1 }
                ],
                baseRate: 0.4,
                exp: 5000,
                resultCount: 1
            },
        ],

        talisman: [
            // =============================
            // === 攻擊類符籙 ===
            // =============================

            // === 1品 (入門: 單種白色) ===
            {
                id: "attack_talisman_1",
                name: "煉體符",
                levelReq: 1,
                materials: [
                    { id: "talisman_white_1", count: 3 }
                ],
                baseRate: 0.9,
                exp: 10,
                resultCount: 1
            },

            // === 2品 (熟練: 多種白色) ===
            {
                id: "attack_talisman_2",
                name: "霸體符",
                levelReq: 2,
                materials: [
                    { id: "talisman_white_2", count: 2 },
                    { id: "talisman_white_3", count: 2 }
                ],
                baseRate: 0.85,
                exp: 20,
                resultCount: 1
            },

            // === 3品 (進階: 綠色 + 白色) ===
            {
                id: "attack_talisman_3",
                name: "破甲符",
                levelReq: 3,
                materials: [
                    { id: "talisman_green_1", count: 1 },
                    { id: "talisman_white_5", count: 3 }
                ],
                baseRate: 0.8,
                exp: 40,
                resultCount: 1
            },

            // === 5品 (突破: 藍色 + 綠色) ===
            {
                id: "attack_talisman_5",
                name: "神力符",
                levelReq: 5,
                materials: [
                    { id: "talisman_blue_1", count: 1 },
                    { id: "talisman_green_3", count: 3 }
                ],
                baseRate: 0.7,
                exp: 150,
                resultCount: 1
            },

            // === 7品 (宗師: 紫色 + 藍色) ===
            {
                id: "attack_talisman_7",
                name: "天罡符",
                levelReq: 7,
                materials: [
                    { id: "talisman_purple_1", count: 1 },
                    { id: "talisman_blue_5", count: 3 }
                ],
                baseRate: 0.6,
                exp: 600,
                resultCount: 1
            },

            // =============================
            // === 防禦類符籙 ===
            // =============================

            // === 1品 ===
            {
                id: "defense_talisman_1",
                name: "金剛符",
                levelReq: 1,
                materials: [
                    { id: "talisman_white_2", count: 3 }
                ],
                baseRate: 0.9,
                exp: 10,
                resultCount: 1
            },

            // === 2品 ===
            {
                id: "defense_talisman_2",
                name: "不壞符",
                levelReq: 2,
                materials: [
                    { id: "talisman_white_3", count: 2 },
                    { id: "talisman_white_4", count: 2 }
                ],
                baseRate: 0.85,
                exp: 20,
                resultCount: 1
            },

            // === 3品 ===
            {
                id: "defense_talisman_3",
                name: "護體符",
                levelReq: 3,
                materials: [
                    { id: "talisman_green_2", count: 1 },
                    { id: "talisman_white_4", count: 3 }
                ],
                baseRate: 0.8,
                exp: 40,
                resultCount: 1
            },

            // === 5品 ===
            {
                id: "defense_talisman_5",
                name: "玄武符",
                levelReq: 5,
                materials: [
                    { id: "talisman_blue_2", count: 1 },
                    { id: "talisman_green_4", count: 3 }
                ],
                baseRate: 0.7,
                exp: 150,
                resultCount: 1
            },

            // === 7品 ===
            {
                id: "defense_talisman_7",
                name: "無敵符",
                levelReq: 7,
                materials: [
                    { id: "talisman_purple_2", count: 1 },
                    { id: "talisman_blue_4", count: 3 }
                ],
                baseRate: 0.6,
                exp: 600,
                resultCount: 1
            },

            // =============================
            // === 速度類符籙 ===
            // =============================

            // === 1品 ===
            {
                id: "speed_talisman_1",
                name: "神行符",
                levelReq: 1,
                materials: [
                    { id: "talisman_white_4", count: 3 }
                ],
                baseRate: 0.9,
                exp: 10,
                resultCount: 1
            },

            // === 3品 ===
            {
                id: "speed_talisman_3",
                name: "御風符",
                levelReq: 3,
                materials: [
                    { id: "talisman_green_4", count: 1 },
                    { id: "talisman_white_1", count: 3 }
                ],
                baseRate: 0.8,
                exp: 40,
                resultCount: 1
            },

            // === 5品 ===
            {
                id: "speed_talisman_5",
                name: "縮地符",
                levelReq: 5,
                materials: [
                    { id: "talisman_blue_3", count: 1 },
                    { id: "talisman_green_5", count: 3 }
                ],
                baseRate: 0.7,
                exp: 150,
                resultCount: 1
            },

            // === 7品 ===
            {
                id: "speed_talisman_7",
                name: "瞬移符",
                levelReq: 7,
                materials: [
                    { id: "talisman_purple_3", count: 1 },
                    { id: "talisman_blue_3", count: 3 }
                ],
                baseRate: 0.6,
                exp: 600,
                resultCount: 1
            },

            // =============================
            // === 暴擊類符籙 ===
            // =============================

            // === 2品 ===
            {
                id: "crit_talisman_2",
                name: "破綻符",
                levelReq: 2,
                materials: [
                    { id: "talisman_white_1", count: 2 },
                    { id: "talisman_white_5", count: 2 }
                ],
                baseRate: 0.85,
                exp: 25,
                resultCount: 1
            },

            // === 4品 ===
            {
                id: "crit_talisman_4",
                name: "致命符",
                levelReq: 4,
                materials: [
                    { id: "talisman_green_3", count: 2 },
                    { id: "talisman_green_5", count: 2 }
                ],
                baseRate: 0.75,
                exp: 100,
                resultCount: 1
            },

            // === 6品 ===
            {
                id: "crit_dmg_talisman",
                name: "爆發符",
                levelReq: 6,
                materials: [
                    { id: "talisman_blue_5", count: 2 },
                    { id: "talisman_blue_1", count: 2 }
                ],
                baseRate: 0.65,
                exp: 300,
                resultCount: 1
            },

            // === 8品 ===
            {
                id: "crit_talisman_8",
                name: "必殺符",
                levelReq: 8,
                materials: [
                    { id: "talisman_purple_4", count: 2 },
                    { id: "talisman_purple_5", count: 2 }
                ],
                baseRate: 0.4,
                exp: 1500,
                resultCount: 1
            },

            // =============================
            // === 生命類符籙 ===
            // =============================

            // === 1品 ===
            {
                id: "hp_talisman_1",
                name: "固元符",
                levelReq: 1,
                materials: [
                    { id: "talisman_white_3", count: 3 }
                ],
                baseRate: 0.9,
                exp: 10,
                resultCount: 1
            },

            // === 3品 ===
            {
                id: "hp_talisman_3",
                name: "生生符",
                levelReq: 3,
                materials: [
                    { id: "talisman_green_2", count: 1 },
                    { id: "talisman_white_3", count: 3 }
                ],
                baseRate: 0.8,
                exp: 50,
                resultCount: 1
            },

            // === 5品 ===
            {
                id: "hp_talisman_5",
                name: "造化符",
                levelReq: 5,
                materials: [
                    { id: "talisman_blue_4", count: 1 },
                    { id: "talisman_green_2", count: 3 }
                ],
                baseRate: 0.7,
                exp: 200,
                resultCount: 1
            },

            // === 7品 ===
            {
                id: "hp_talisman_7",
                name: "不死符",
                levelReq: 7,
                materials: [
                    { id: "talisman_purple_1", count: 2 },
                    { id: "talisman_blue_2", count: 3 }
                ],
                baseRate: 0.5,
                exp: 600,
                resultCount: 1
            },

            // =============================
            // === 特殊符籙 ===
            // =============================

            // === 1品 ===
            {
                id: "luck_charm",
                name: "轉運符",
                levelReq: 1,
                materials: [
                    { id: "talisman_white_5", count: 3 }
                ],
                baseRate: 0.8,
                exp: 10,
                resultCount: 1
            },

            // === 9品 (仙符) ===
            {
                id: "thunder_charm",
                name: "九霄神雷符",
                levelReq: 9,
                materials: [
                    { id: "god_blood", count: 1 },
                    { id: "talisman_purple_3", count: 3 }
                ],
                baseRate: 0.25,
                exp: 3000,
                resultCount: 1
            },

            // === 新增:9品 (仙符) ===
            {
                id: "yin_yang_talisman",
                name: "陰陽調和符",
                levelReq: 9,
                materials: [
                    { id: "god_blood", count: 1 },
                    { id: "talisman_purple_1", count: 3 },
                    { id: "talisman_purple_2", count: 3 }
                ],
                baseRate: 0.25,
                exp: 3000,
                resultCount: 1
            },
            {
                id: "five_elements_talisman",
                name: "五行精通符",
                levelReq: 9,
                materials: [
                    { id: "god_blood", count: 1 },
                    { id: "talisman_purple_4", count: 3 },
                    { id: "talisman_purple_5", count: 3 }
                ],
                baseRate: 0.25,
                exp: 3000,
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
            if (window.toast) window.toast("配方不存在！", "error");
            return;
        }
        const recipe = recipes[recipeIndex];

        // 1. 檢查等級
        const currentLevel = this.getLevel(artType);
        if (currentLevel < recipe.levelReq) {
            if (window.toast) window.toast("等級不足，無法製作！", "error");
            return;
        }

        // 2. 檢查材料
        const inv = window.state.inventory || [];
        for (const mat of recipe.materials) {
            const item = inv.find(i => i.id === mat.id);
            if (!item || item.count < mat.count) {
                const def = window.getItemDef(mat.id);
                const name = def ? def.name : mat.id;
                if (window.toast) window.toast(`材料不足：需 ${name} x${mat.count}`, "error");
                return;
            }
        }

        // 3. 消耗材料
        for (const mat of recipe.materials) {
            const item = inv.find(i => i.id === mat.id);
            if (item) {
                item.count -= mat.count;
                if (item.count <= 0) {
                    const idx = inv.indexOf(item);
                    if (idx > -1) inv.splice(idx, 1);
                }
            }
        }

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
            if (window.toast) window.toast(`製作成功！`, "success");
        } else {
            // 獲得少量經驗
            const failExp = Math.floor(recipe.exp * 0.2);
            this.gainExp(artType, failExp);
            if (window.addLog) window.addLog(`製作【${recipe.name}】失敗... 獲得 ${failExp} 經驗。`, "bad");
            if (window.toast) window.toast(`製作失敗...`, "fail");
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
                if (window.toast) window.toast(`${this.getArtName(artType)} 升級了！`, "success");
            } else {
                break;
            }
        }
    },

    getArtName(type) {
        switch (type) {
            case 'alchemy': return "丹道";
            case 'weapon': return "器道";
            case 'formation': return "陣法";
            case 'talisman': return "符道";
            default: return type;
        }
    }
};

window.ArtsSystem = ArtsSystem;
