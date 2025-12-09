// sword_mountain.js
// 試劍山歷練（擴充版 - 每條線至少4個節點）

const SwordMountainTrial = {
    id: "sword_mountain",
    name: "試劍山",
    startNodeId: "enter",
    nodes: {
        // ====== 起點 ======
        enter: {
            title: "試劍山腳下",
            text: "你來到試劍山腳下，山風獵獵，劍意縱橫。",
            choices: [
                {
                    id: "enter_meditate",
                    label: "盤膝打坐調息",
                    logText: "你盤膝打坐調息數時辰。",
                    next: "meditate_path"
                },
                {
                    id: "enter_explore",
                    label: "深入劍山探索",
                    logText: "你選擇深入劍山。",
                    next: "explore_path"
                }
            ]
        },

        // ====== 打坐路線（至少4個節點）======
        // 節點1: 打坐（增加陣法分支）
        meditate_path: {
            title: "調息",
            text: "你盤膝打坐調息數時辰。就在氣息漸穩之時...",
            choices: [
                {
                    id: "notice_disturbance",
                    label: "察覺靈氣異常",
                    logText: "你察覺到周圍靈氣流動有些古怪。",
                    next: "formation_discovery"
                },
                {
                    id: "wait_quietly",
                    label: "靜心等待",
                    logText: "你繼續靜心打坐。",
                    next: "cultivator_encounter"
                }
            ]
        },

        // 節點1b: 發現陣法（獲得陣圖路線）
        formation_discovery: {
            title: "古怪石林",
            text: "你順著靈氣流動尋找，發現一片石林排列得極為玄妙，似乎是一座天然殘陣。",
            choices: [
                {
                    id: "study_formation",
                    label: "推演陣法",
                    logText: "你沉浸在陣法推演之中。",
                    next: "formation_solved"
                },
                {
                    id: "ignore_formation",
                    label: "轉身離開",
                    logText: "你對陣法不感興趣，轉身離開。",
                    next: "meditate_gain"
                }
            ]
        },

        formation_solved: {
            title: "陣法已破",
            text: "經過半日推演，你終於看破陣眼，從石林中心取出一卷古樸陣圖。",
            choices: [
                {
                    id: "take_formation_manual",
                    label: "取走陣圖",
                    logText: "你獲得了陣圖傳承。",
                    next: null,
                    onSelect: () => grantTrialReward("sword_mountain", "formation_reward")
                }
            ]
        },

        // 節點1c: 遇到修士（原劇情）
        cultivator_encounter: {
            title: "遭遇修士",
            text: "一群修士路過，詢問你是否見過一名素衣老人。",
            choices: [
                {
                    id: "tell_truth",
                    label: "如實告知",
                    logText: "你如實告知見過素衣老人。",
                    next: "cultivator_question"
                },
                {
                    id: "deny",
                    label: "否認見過",
                    logText: "你否認見過，明哲保身。",
                    next: "deny_path"
                },
                {
                    id: "lie",
                    label: "隨口亂指方向",
                    logText: "你隨口指向一個方向。",
                    next: null,
                    onSelect: () => {
                        state.deathReason = "欺騙修士被識破，遭到擊殺";
                        state.lifespan = state.age;
                        state.hp = 0;
                        addLog("修士們很快發現你在說謊，神色陰沉。", "bad");
                        addLog("「敢戲弄本宗！」劍光一閃，你被當場斬殺——你死了——", "bad");
                        setTimeout(() => showVictoryScreen(false), 500);
                    }
                }
            ]
        },

        // 節點2: 修士詢問
        cultivator_question: {
            title: "修士追問",
            text: "領頭修士神色一凜，追問你素衣老人往哪個方向去了。",
            choices: [
                {
                    id: "help_track",
                    label: "主動提出同行追蹤",
                    logText: "你主動提出與他們同行追蹤。",
                    next: "track_together"
                },
                {
                    id: "just_point",
                    label: "只是指路不參與",
                    logText: "你只是指出方向，不願多管閒事。",
                    next: "point_direction"
                }
            ]
        },

        // 節點3a: 同行追蹤
        track_together: {
            title: "追蹤素衣老人",
            text: "你與修士們一路追蹤，終於在山林深處找到素衣老人。他正在布陣，殺機四伏。",
            choices: [
                {
                    id: "watch_battle",
                    label: "退到一旁觀戰",
                    logText: "你退到陣外觀戰。",
                    next: "watch_result"
                },
                {
                    id: "join_battle",
                    label: "衝上前助戰",
                    logText: "你抽劍上前助戰。",
                    next: "battle_result"
                }
            ]
        },

        // 節點4a: 觀戰結果
        watch_result: {
            title: "觀戰結束",
            text: "修士們斬殺了素衣老者，隨手丟給你一瓶丹藥作謝禮。",
            choices: [
                {
                    id: "leave_1",
                    label: "結束歷練",
                    logText: "你帶著丹藥離開了試劍山。",
                    next: null,
                    onSelect: () => grantTrialReward("sword_mountain", "watch_reward")
                }
            ]
        },

        // 節點4b: 助戰結果
        battle_result: {
            title: "助戰有功",
            text: "你被餘波震傷，但修士們給了你療傷丹。丹藥入口即化，傷勢痊癒。領頭修士對你頗為欣賞。",
            choices: [
                {
                    id: "ask_join",
                    label: "詢問能否加入宗門",
                    logText: "你詢問能否加入青雲宗。",
                    next: "join_sect"
                },
                {
                    id: "just_leave",
                    label: "拱手告辭",
                    logText: "你拱手告辭，不願受宗門束縛。",
                    next: null,
                    onSelect: () => grantTrialReward("sword_mountain", "attack_heal")
                }
            ]
        },

        // 節點5: 加入宗門
        join_sect: {
            title: "青雲宗邀請",
            text: "領頭修士點頭道：「你資質不錯，且有膽識。若願意，可隨我們回宗門，成為外門弟子。」",
            choices: [
                {
                    id: "accept_join",
                    label: "欣然接受",
                    logText: "你欣然接受邀請。",
                    next: "join_success"
                },
                {
                    id: "decline_join",
                    label: "婉拒邀請",
                    logText: "你婉拒了邀請，選擇自由修行。",
                    next: null,
                    onSelect: () => grantTrialReward("sword_mountain", "attack_heal")
                }
            ]
        },

        // 節點6: 加入成功
        join_success: {
            title: "加入青雲宗",
            text: "你正式成為青雲宗外門弟子，獲得宗門身份令牌和修煉資源。",
            choices: [
                {
                    id: "leave_with_sect",
                    label: "結束歷練",
                    logText: "你隨修士們返回青雲宗。",
                    next: null,
                    onSelect: () => {
                        // 加入青雲宗
                        if (typeof joinFaction === "function") {
                            joinFaction("qingyun", { initialRep: 100 });
                            addLog("你成功加入青雲宗，成為外門弟子！", "great-event");
                        } else {
                            state.faction = "qingyun";
                            state.factionRep = 100;
                            addLog("你成功加入青雲宗，成為外門弟子！", "great-event");
                        }
                        // 發放加入宗門獎勵
                        grantTrialReward("sword_mountain", "join_faction");
                    }
                }
            ]
        },

        // 節點3b: 只指路
        point_direction: {
            title: "指路後",
            text: "修士們按你指的方向離去。你獨自留在原地，思考接下來該做什麼。",
            choices: [
                {
                    id: "leave_now",
                    label: "離開劍山",
                    logText: "你決定離開劍山。",
                    next: "safe_leave"
                },
                {
                    id: "continue_explore",
                    label: "繼續探索",
                    logText: "你決定繼續探索劍山。",
                    next: "explore_path"
                }
            ]
        },

        // 否認路線
        deny_path: {
            title: "否認後",
            text: "修士們雖然不滿，但也無法強逼你。他們離去後，四下重歸寂靜。",
            choices: [
                {
                    id: "stay_meditate",
                    label: "繼續打坐",
                    logText: "你繼續打坐修煉。",
                    next: "meditate_gain"
                },
                {
                    id: "leave_safe",
                    label: "離開劍山",
                    logText: "你選擇離開劍山。",
                    next: "safe_leave"
                }
            ]
        },

        meditate_gain: {
            title: "打坐有得",
            text: "你靜心打坐，感悟劍山劍意，心境有所提升。",
            choices: [
                {
                    id: "leave_3",
                    label: "結束歷練",
                    logText: "你心滿意足地離開劍山。",
                    next: null,
                    onSelect: () => grantTrialReward("sword_mountain", "reject_leave")
                }
            ]
        },

        safe_leave: {
            title: "明哲保身",
            text: "你選擇離開試劍山，雖然收穫不多，但也算平安。",
            choices: [
                {
                    id: "leave_4",
                    label: "結束歷練",
                    logText: "你平安離開了試劍山。",
                    next: null,
                    onSelect: () => grantTrialReward("sword_mountain", "reject_leave")
                }
            ]
        },

        // ====== 探索路線（至少4個節點）======
        // 節點1: 岔路
        explore_path: {
            title: "深入劍山",
            text: "你沿山勢深入，前方出現岔路：一條通往河邊，一條通往山頂。",
            choices: [
                {
                    id: "go_riverside",
                    label: "前往河邊",
                    logText: "你選擇前往河邊。",
                    next: "riverside"
                },
                {
                    id: "climb_peak",
                    label: "攀登山頂",
                    logText: "你決定攀登山頂。",
                    next: "climb_mountain"
                }
            ]
        },

        // 節點2a: 攀登山頂（增加器譜分支）
        climb_mountain: {
            title: "山路崎嶇",
            text: "你沿山路向上，劍意越發濃烈。途中你看見一處廢棄的劍爐遺址。",
            choices: [
                {
                    id: "continue_climb",
                    label: "無視遺址，繼續攻頂",
                    logText: "你一心登頂，無視了旁物。",
                    next: "mountain_peak"
                },
                {
                    id: "inspect_furnace",
                    label: "探查劍爐",
                    logText: "你停下腳步，探查廢棄劍爐。",
                    next: "sword_furnace"
                },
                {
                    id: "turn_back",
                    label: "返回岔路",
                    logText: "你覺得不對勁，決定返回。",
                    next: "riverside"
                }
            ]
        },

        // 隱藏節點：劍爐（獲得器譜路線）
        sword_furnace: {
            title: "廢棄劍爐",
            text: "劍爐雖已熄滅千年，但仍殘留著驚人的火氣。你在爐灰中發現一本完好的鐵卷。",
            choices: [
                {
                    id: "take_weapon_manual",
                    label: "拾取鐵卷",
                    logText: "你獲得了歐冶子的傳承。",
                    next: null,
                    onSelect: () => grantTrialReward("sword_mountain", "weapon_reward")
                }
            ]
        },

        // 節點3a: 山頂劍冢（死亡）
        mountain_peak: {
            title: "劍冢禁地",
            text: "你終於抵達山頂，發現這裡是一座劍冢，滿是斷劍殘痕。",
            choices: [
                {
                    id: "enter_tomb",
                    label: "踏入劍冢",
                    logText: "你踏入劍冢中央。",
                    next: null,
                    onSelect: () => {
                        state.deathReason = "闖入劍冢禁地，被劍氣斬殺";
                        state.lifespan = state.age;
                        state.hp = 0;
                        addLog("一道金色劍光從天而降！", "bad");
                        addLog("你被瞬間斬成兩段——你死了——", "bad");
                        setTimeout(() => showVictoryScreen(false), 500);
                    }
                }
            ]
        },

        // 節點2b: 河邊
        riverside: {
            title: "河邊",
            text: "你來到一條靈氣縈繞的河邊，水霧氤氳，靈光若隱若現。",
            choices: [
                {
                    id: "walk_riverside",
                    label: "沿河邊行走",
                    logText: "你選擇沿著河岸慢慢前行。",
                    next: "riverside_walk"
                },
                {
                    id: "dive_river",
                    label: "潛入水中探查",
                    logText: "你縱身跳入水中。",
                    next: "underwater"
                }
            ]
        },

        // 節點3b: 河邊行走（增加符錄分支）
        riverside_walk: {
            title: "河岸探索",
            text: "你沿著河岸行走，忽然看見一隻紙鶴掛在古樹梢頭，靈韻流轉。",
            choices: [
                {
                    id: "check_paper_crane",
                    label: "取下紙鶴",
                    logText: "你躍上樹梢取下紙鶴。",
                    next: "talisman_story"
                },
                {
                    id: "take_herbs",
                    label: "無視紙鶴，採集靈草",
                    logText: "你專注於採集地上的靈草。",
                    next: "find_herbs"
                },
                {
                    id: "continue_walk",
                    label: "繼續前行",
                    logText: "你繼續沿河前行。",
                    next: "river_end"
                }
            ]
        },

        // 隱藏節點：天師符錄（獲得符錄路線）
        talisman_story: {
            title: "紙鶴傳書",
            text: "紙鶴入手即化，化作一道流光鑽入你的識海，竟是一部玄妙的符錄傳承！",
            choices: [
                {
                    id: "absorb_talisman",
                    label: "感悟傳承",
                    logText: "你獲得了天師符錄傳承。",
                    next: null,
                    onSelect: () => grantTrialReward("sword_mountain", "talisman_reward")
                }
            ]
        },

        // 節點4b: 找到靈草
        find_herbs: {
            title: "靈草入手",
            text: "你成功採集到幾株靈草，心滿意足。",
            choices: [
                {
                    id: "leave_5",
                    label: "結束歷練",
                    logText: "你帶著靈草離開劍山。",
                    next: null,
                    onSelect: () => grantTrialReward("sword_mountain", "river_walk")
                }
            ]
        },

        river_end: {
            title: "河流盡頭",
            text: "你來到河流盡頭，發現一個小瀑布，水聲隆隆，飛珠濺玉。",
            choices: [
                {
                    id: "leave_6",
                    label: "結束歷練",
                    logText: "你離開劍山。",
                    next: null,
                    onSelect: () => grantTrialReward("sword_mountain", "reject_leave")
                },
                {
                    id: "search_waterfall",
                    label: "探查瀑布後方",
                    logText: "你運用靈目術探查瀑布後方。",
                    next: "waterfall_cave"
                }
            ]
        },

        // 隱藏節點：瀑布洞穴
        waterfall_cave: {
            title: "別有洞天",
            text: "穿過瀑布，你竟然發現一個乾燥的石洞！洞口設有簡易的避水陣法，顯然曾有人居住。",
            choices: [
                {
                    id: "enter_cave_depths",
                    label: "深入石洞",
                    logText: "你小心翼翼地深入石洞。",
                    next: "cave_legacy"
                },
                {
                    id: "leave_cave_safe",
                    label: "轉身離開",
                    logText: "你擔心有詐，退出了石洞。",
                    next: "safe_leave"
                }
            ]
        },

        // 隱藏節點：前輩遺骨
        cave_legacy: {
            title: "前輩遺骨",
            text: "石洞深處有一具盤坐的枯骨，身前放著一個破舊的丹爐和一本泛黃的冊子。牆上刻著『丹道難成，悔不當初』八個大字。",
            choices: [
                {
                    id: "bow_and_take",
                    label: "行禮後取寶",
                    logText: "你恭敬地行禮，然後取走了遺物。",
                    next: null,
                    onSelect: () => grantTrialReward("sword_mountain", "cave_reward")
                }
            ]
        },

        // 節點3c: 水底探查
        underwater: {
            title: "潛入水底",
            text: "你潛入水底，靈氣自四面八方湧入體內。",
            choices: [
                {
                    id: "go_deeper",
                    label: "繼續往深處潛",
                    logText: "你往水底更深處潛行。",
                    next: "find_python"
                },
                {
                    id: "surface",
                    label: "浮出水面",
                    logText: "你覺得危險，浮出水面。",
                    next: "riverside_walk"
                }
            ]
        },

        // 節點4c: 發現巨蟒
        find_python: {
            title: "沉睡巨蟒",
            text: "你在水底發現一條盤踞巨蟒，正沉睡不動，旁邊有一團淡金色的靈物緩緩旋轉。",
            choices: [
                {
                    id: "sneak_steal",
                    label: "偷偷靠近靈物",
                    logText: "你屏息潛行，打算悄悄取走靈物。",
                    next: "steal_treasure"
                },
                {
                    id: "attack_python",
                    label: "趁機斬殺巨蟒",
                    logText: "你拔劍全力攻擊。",
                    next: null,
                    onSelect: () => {
                        state.deathReason = "歷練中被元嬰大妖反殺";
                        state.lifespan = state.age;
                        state.hp = 0;
                        addLog("你一劍刺入巨蟒，卻驚醒了元嬰大妖！", "bad");
                        addLog("巨蟒瞬間反擊，你被妖威抹殺——你死了——", "bad");
                        setTimeout(() => showVictoryScreen(false), 500);
                    }
                },
                {
                    id: "retreat_now",
                    label: "悄悄撤退",
                    logText: "你覺得太危險，悄悄撤退。",
                    next: "riverside_walk"
                }
            ]
        },

        // 節點5: 偷取成功
        steal_treasure: {
            title: "偷取成功",
            text: "你小心翼翼地奪走靈物，巨蟒甦醒追來，你藉著泥沙掩護狼狽逃出水面。",
            choices: [
                {
                    id: "leave_7",
                    label: "結束歷練",
                    logText: "你帶著靈物離開劍山。",
                    next: null,
                    onSelect: () => grantTrialReward("sword_mountain", "sneak_left_escape")
                }
            ]
        }
    }
};

// 註冊試劍山歷練到全局系統
if (typeof window.registerTrialTree === "function") {
    window.registerTrialTree(SwordMountainTrial);
} else {
    if (typeof window.TrialTrees !== "undefined") {
        window.TrialTrees["sword_mountain"] = SwordMountainTrial;
        if (typeof window.TrialNameMap !== "undefined") {
            window.TrialNameMap["sword_mountain"] = "試劍山";
        }
    }
}

window.SwordMountainTrial = SwordMountainTrial;
