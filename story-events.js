// story-events.js
// 劇情事件系統 - 在特定年齡和條件下觸發的劇情選擇事件

// ============================================
// 劇情事件數據庫
// ============================================
const STORY_EVENTS = [
    // ====== 16歲 - 拜師抉擇 ======
    {
        id: "age16_master_choice",
        name: "拜師抉擇",
        triggerAge: 20,
        triggerOnce: true,
        conditions: {
            minRealm: 1,
            maxRealm: 3,
            faction: "none"  // 必須未加入宗門
        },
        story: `你今年十六歲,已經初窺修行之門。\n\n一位雲遊道人路過你的村莊,看出你有修行資質,願意收你為徒,帶你前往他的小門派修行。\n\n但你也聽聞,獨自修煉雖然艱難,卻能保持自由之身,不受門規束縛。\n\n你該如何抉擇?`,
        choices: [
            {
                text: "拜師學藝,加入門派",
                desc: "獲得師門庇護,但需遵守門規",
                effects: (state) => {
                    state.comprehension += 2;
                    state.spiritStones += 500;
                    addLog("你拜入道人門下,獲得了一些修煉資源。悟性 +2,靈石 +500", "event");
                    // 可以在這裡設置一個標記,後續可能觸發師門相關事件
                    if (!state.storyFlags) state.storyFlags = {};
                    state.storyFlags.hasMaster = true;
                }
            },
            {
                text: "婉拒道人,獨自修煉",
                desc: "保持自由,但修行之路更加艱辛",
                effects: (state) => {
                    state.mindset += 2;
                    state.luck += 1;
                    addLog("你選擇了獨自修煉的道路。心境 +2,氣運 +1", "event");
                    if (!state.storyFlags) state.storyFlags = {};
                    state.storyFlags.loneWolf = true;
                }
            }
        ]
    },

    // ====== 25歲 - 洞府奇遇 ======
    {
        id: "age25_cave_encounter",
        name: "洞府奇遇",
        triggerAge: 25,
        triggerOnce: true,
        conditions: {
            minRealm: 5,
            maxRealm: 15
        },
        story: `你在野外歷練時,無意間發現了一處隱秘的洞府。\n\n洞府中靈氣濃郁,似乎是某位前輩的修煉之所。你在洞府深處發現了兩樣東西:\n\n一卷古老的功法秘籍,散發著玄奧的氣息;\n一瓶丹藥,藥香撲鼻,但你不確定其藥性。\n\n你只能帶走一樣,該如何選擇?`,
        choices: [
            {
                text: "帶走功法秘籍",
                desc: "提升修煉速度,但需要時間參悟",
                effects: (state) => {
                    if (state.techniqueTier < 2) {
                        state.techniqueTier = 2;
                        addLog("你獲得了「玄階心法」!修煉速度大幅提升!", "great-event");
                    } else {
                        state.comprehension += 5;
                        addLog("你參悟功法秘籍,悟性 +5", "event");
                    }
                }
            },
            {
                text: "帶走丹藥",
                desc: "立即提升修為,但可能有副作用",
                effects: (state) => {
                    const roll = Math.random();
                    if (roll < 0.7) {
                        // 70% 機率獲得大量真氣
                        const qiGain = Math.floor(state.qiCap * 0.5);
                        state.qi += qiGain;
                        addLog(`你服下丹藥,真氣暴漲 ${qiGain} 點!`, "great-event");
                    } else {
                        // 30% 機率藥性太猛,損傷根基
                        state.lifespan -= 5;
                        state.qi += Math.floor(state.qiCap * 0.3);
                        addLog("丹藥藥性太猛,你雖然獲得了真氣,但壽元受損 5 年!", "bad");
                    }
                }
            },
            {
                text: "兩樣都不拿,恭敬離去",
                desc: "尊重前輩遺物,獲得因果庇佑",
                effects: (state) => {
                    state.luck += 3;
                    state.mindset += 3;
                    addLog("你恭敬地離開洞府。冥冥中,你感覺到一股善意的力量。氣運 +3,心境 +3", "event");
                }
            }
        ]
    },

    // ====== 50歲 - 心魔劫 ======
    {
        id: "age50_inner_demon",
        name: "心魔劫",
        triggerAge: 50,
        triggerOnce: true,
        conditions: {
            minRealm: 15,
            maxRealm: 30
        },
        story: `你修行已有數十載,但最近心中總有一股莫名的煩躁。\n\n在一次閉關中,你的心魔突然爆發!過往的種種執念化為幻象,在你心中翻騰。\n\n你看到了三條路:\n一是強行壓制,以真氣鎮壓心魔;\n二是直面心魔,與之對話;\n三是暫時逃避,先出關再說。\n\n你該如何應對?`,
        choices: [
            {
                text: "強行壓制心魔",
                desc: "消耗真氣,可能傷及根基",
                effects: (state) => {
                    state.qi = Math.floor(state.qi * 0.5);
                    const roll = Math.random();
                    if (roll < 0.6) {
                        state.mindset += 5;
                        addLog("你成功壓制了心魔!心境大幅提升 +5,但真氣損失慘重。", "event");
                    } else {
                        state.mindset -= 2;
                        state.lifespan -= 10;
                        addLog("你壓制心魔失敗,反而受到反噬!心境 -2,壽元 -10", "bad");
                    }
                }
            },
            {
                text: "直面心魔,與之對話",
                desc: "風險與機遇並存",
                effects: (state) => {
                    const roll = Math.random();
                    if (roll < 0.5) {
                        state.mindset += 8;
                        state.comprehension += 3;
                        state.breakBonus = (state.breakBonus || 0) + 0.05;
                        addLog("你直面心魔,領悟了心境的真諦!心境 +8,悟性 +3,突破成功率永久 +5%!", "great-event");
                    } else {
                        state.mindset -= 5;
                        state.comprehension -= 2;
                        addLog("你被心魔所惑,陷入迷障!心境 -5,悟性 -2", "bad");
                    }
                }
            },
            {
                text: "暫時逃避,出關散心",
                desc: "保守選擇,不會有太大變化",
                effects: (state) => {
                    state.age += 1;
                    addLog("你選擇暫時逃避,出關散心一年。心魔依然潛伏,但暫時平息了。", "event");
                }
            }
        ]
    },

    // ====== 100歲 - 傳承抉擇 ======
    {
        id: "age100_legacy",
        name: "傳承抉擇",
        triggerAge: 100,
        triggerOnce: true,
        conditions: {
            minRealm: 25
        },
        story: `你已經修行百年,在修真界也算是有些名望的前輩了。\n\n一位資質不錯的年輕修士找到你,懇求拜你為師。\n\n收徒可以傳承你的道統,但也會分散你的精力;\n拒絕則可以專心修煉,衝擊更高境界。\n\n你該如何選擇?`,
        choices: [
            {
                text: "收徒傳承",
                desc: "獲得聲望,但修煉速度降低",
                effects: (state) => {
                    state.luck += 5;
                    state.mindset += 5;
                    if (state.faction && state.faction !== "none") {
                        state.factionRep = (state.factionRep || 0) + 1000;
                        addLog("你收下弟子,在宗門中聲望大增。氣運 +5,心境 +5,宗門聲望 +1000", "event");
                    } else {
                        addLog("你收下弟子,開始傳授修行之道。氣運 +5,心境 +5", "event");
                    }
                    if (!state.storyFlags) state.storyFlags = {};
                    state.storyFlags.hasDisciple = true;
                }
            },
            {
                text: "婉拒,專心修煉",
                desc: "保持專注,衝擊更高境界",
                effects: (state) => {
                    state.comprehension += 5;
                    state.qi += Math.floor(state.qiCap * 0.3);
                    addLog("你婉拒了年輕修士,繼續專心修煉。悟性 +5,真氣增加", "event");
                }
            }
        ]
    },

    // ====== 30歲 - 仇家尋仇 (條件:曾經獨狼) ======
    {
        id: "age30_revenge",
        name: "仇家尋仇",
        triggerAge: 30,
        triggerOnce: true,
        conditions: {
            minRealm: 8,
            storyFlags: { loneWolf: true }  // 必須選擇過獨自修煉
        },
        story: `因為你當年拒絕了那位道人,他的門派認為你不識抬舉。\n\n如今,該門派的一位弟子找上門來,要與你比試一番,實則是想給你一個教訓。\n\n你可以選擇應戰、逃避或者賠禮道歉。`,
        choices: [
            {
                text: "應戰比試",
                desc: "憑實力說話,但可能受傷",
                effects: (state) => {
                    const playerPower = state.attack + state.defense;
                    const enemyPower = state.realmLevel * 15;

                    if (playerPower > enemyPower) {
                        state.mindset += 3;
                        state.spiritStones += 300;
                        addLog("你擊敗了對方,揚名立萬!心境 +3,獲得靈石 300", "great-event");
                    } else {
                        state.lifespan -= 5;
                        state.qi = Math.floor(state.qi * 0.7);
                        addLog("你不敵對方,身受重傷。壽元 -5,真氣損失", "bad");
                    }
                }
            },
            {
                text: "暫避鋒芒,逃離此地",
                desc: "保全性命,但損失顏面",
                effects: (state) => {
                    state.mindset -= 2;
                    state.age += 2;
                    addLog("你選擇逃離,雖然保住性命,但心境受損。心境 -2,逃亡耗時 2 年", "event");
                }
            },
            {
                text: "賠禮道歉,化解恩怨",
                desc: "損失資源,但化干戈為玉帛",
                effects: (state) => {
                    state.spiritStones = Math.max(0, state.spiritStones - 500);
                    state.luck += 2;
                    addLog("你誠懇道歉並送上靈石,對方接受了你的歉意。靈石 -500,氣運 +2", "event");
                }
            }
        ]
    },

    // ====== 35歲 - 結識道友 ======
    {
        id: "age35_make_friend",
        name: "結識道友",
        triggerAge: 35,
        triggerOnce: true,
        conditions: {
            minRealm: 5,
            maxRealm: 20
        },
        story: `你在一處靈泉旁修煉時，遇到了一位修為相當的修士。\n\n此人氣質不凡，談吐間頗有見地。你們相談甚歡，他/她提議結為道友，日後互相照應。\n\n修仙路漫漫，多一個朋友總是好的，但也意味著多一份牽掛。`,
        choices: [
            {
                text: "欣然結交",
                desc: "結為道友，互相扶持",
                effects: (state) => {
                    state.luck += 3;
                    state.mindset += 2;
                    if (!state.storyFlags) state.storyFlags = {};
                    state.storyFlags.hasFriend = true;
                    addLog("你與這位修士結為道友，約定日後互相照應。氣運 +3，心境 +2", "event");
                }
            },
            {
                text: "保持距離",
                desc: "禮貌拒絕，獨來獨往",
                effects: (state) => {
                    state.mindset += 2;
                    state.comprehension += 1;
                    addLog("你婉拒了對方的好意，選擇繼續獨自修行。心境 +2，悟性 +1", "event");
                }
            },
            {
                text: "切磋武藝",
                desc: "先比試一番，看看對方實力",
                effects: (state) => {
                    const playerPower = state.attack + state.defense;
                    const friendPower = state.realmLevel * 12;

                    if (playerPower > friendPower) {
                        state.spiritStones += 500;
                        state.comprehension += 2;
                        if (!state.storyFlags) state.storyFlags = {};
                        state.storyFlags.hasFriend = true;
                        addLog("你在切磋中略勝一籌，對方欽佩不已，你們成為了道友。靈石 +500，悟性 +2", "great-event");
                    } else {
                        state.mindset += 1;
                        addLog("切磋不分勝負，你們惺惺相惜，但最終各走各路。心境 +1", "event");
                    }
                }
            }
        ]
    },

    // ====== 40歲 - 秘境探險 ======
    {
        id: "age40_secret_realm",
        name: "秘境探險",
        triggerAge: 40,
        triggerOnce: true,
        conditions: {
            minRealm: 10,
            maxRealm: 25,
            minLuck: 8
        },
        story: `你偶然得到消息，附近出現了一處上古秘境的入口。\n\n據說秘境中有前輩高人留下的寶藏，但也充滿了致命的陣法和機關。\n\n許多修士已經前往探險，有人滿載而歸，也有人一去不返。`,
        choices: [
            {
                text: "獨自探險",
                desc: "憑藉自己的實力闖蕩秘境",
                effects: (state) => {
                    const roll = Math.random();
                    if (roll < 0.4) {
                        // 40% 獲得天階功法
                        if (state.techniqueTier < 4) {
                            state.techniqueTier = 4;
                            addLog("你在秘境深處發現了「天階心法」！修煉速度暴增！", "great-event");
                        } else {
                            state.comprehension += 10;
                            state.spiritStones += 3000;
                            addLog("你在秘境中獲得了大量寶物！悟性 +10，靈石 +3000", "great-event");
                        }
                    } else if (roll < 0.7) {
                        // 30% 中等收益
                        state.spiritStones += 1500;
                        state.comprehension += 5;
                        addLog("你在秘境中有所收穫。靈石 +1500，悟性 +5", "event");
                    } else {
                        // 30% 觸發陷阱
                        state.lifespan -= 10;
                        state.hp = Math.floor(state.hp * 0.5);
                        addLog("你觸發了秘境中的陷阱，身受重傷！壽元 -10，血量減半", "bad");
                    }
                }
            },
            {
                text: "邀請道友同行",
                desc: "與道友一起探險，互相照應",
                effects: (state) => {
                    if (state.storyFlags?.hasFriend) {
                        state.spiritStones += 2000;
                        state.comprehension += 6;
                        state.luck += 2;
                        addLog("你與道友聯手探索秘境，配合默契，收穫頗豐！靈石 +2000，悟性 +6，氣運 +2", "great-event");
                    } else {
                        addLog("你沒有道友可以邀請，只能獨自前往。", "event");
                        // 回退到獨自探險的邏輯
                        const roll = Math.random();
                        if (roll < 0.3) {
                            state.spiritStones += 1500;
                            addLog("你小心翼翼地探索，獲得了一些寶物。靈石 +1500", "event");
                        } else {
                            state.lifespan -= 5;
                            addLog("你在秘境中受了輕傷。壽元 -5", "bad");
                        }
                    }
                }
            },
            {
                text: "放棄機會",
                desc: "太過危險，還是穩妥修煉",
                effects: (state) => {
                    state.mindset += 3;
                    addLog("你選擇了穩妥的修煉之路，雖然錯失機緣，但保全了性命。心境 +3", "event");
                }
            }
        ]
    },

    // ====== 45歲 - 正邪抉擇 ======
    {
        id: "age45_alignment_choice",
        name: "正邪抉擇",
        triggerAge: 45,
        triggerOnce: true,
        conditions: {
            minRealm: 10,
            maxRealm: 25
        },
        story: `你在修煉中遇到了瓶頸，進境緩慢。\n\n一位魔道修士找到你，展示了一種吸取他人精血快速提升修為的邪法。他說：「正邪不過是勝者的定義，力量才是永恆的真理。」\n\n同時，一位正道前輩也願意傳授你正統心法，但修煉緩慢，需要數十年苦功。`,
        choices: [
            {
                text: "修煉邪法",
                desc: "快速提升，但墮入魔道",
                effects: (state) => {
                    state.realmLevel += 1;
                    state.qiCap = getQiCapForLevel(state.realmLevel);
                    state.attack += 20;
                    state.lifespan -= 20;
                    state.mindset -= 5;
                    if (!state.storyFlags) state.storyFlags = {};
                    state.storyFlags.alignment = "魔道";
                    addLog("你選擇了魔道邪法，修為暴漲！境界 +1，攻擊力 +20，但壽元 -20，心境 -5", "bad");
                    addLog("你已踏入魔道，正道修士將視你為敵！", "event");
                }
            },
            {
                text: "學習正法",
                desc: "堅守正道，穩紮穩打",
                effects: (state) => {
                    state.comprehension += 5;
                    state.mindset += 5;
                    state.luck += 3;
                    if (!state.storyFlags) state.storyFlags = {};
                    state.storyFlags.alignment = "正道";
                    addLog("你選擇了正道心法，雖然修煉緩慢，但根基穩固。悟性 +5，心境 +5，氣運 +3", "event");
                }
            },
            {
                text: "兩者都不選",
                desc: "保持中立，自己摸索",
                effects: (state) => {
                    state.mindset += 3;
                    state.comprehension += 2;
                    if (!state.storyFlags) state.storyFlags = {};
                    state.storyFlags.alignment = "中立";
                    addLog("你拒絕了兩者，選擇走自己的道路。心境 +3，悟性 +2", "event");
                }
            }
        ]
    },

    // ====== 65歲 - 宗門危機 ======
    {
        id: "age65_sect_crisis",
        name: "宗門危機",
        triggerAge: 65,
        triggerOnce: true,
        conditions: {
            minRealm: 15,
            maxRealm: 30,
            minFactionRep: 1000
        },
        story: `你所在的宗門遭到敵對勢力的圍攻！\n\n掌門召集所有弟子商議對策。敵方實力強大，正面交戰勝算不大。\n\n作為宗門的中堅力量，你的選擇將影響宗門的命運。`,
        choices: [
            {
                text: "主動請戰",
                desc: "率領弟子迎敵，以戰止戰",
                effects: (state) => {
                    const playerPower = state.attack + state.defense;
                    const enemyPower = state.realmLevel * 20;

                    if (playerPower > enemyPower) {
                        state.factionRep = (state.factionRep || 0) + 3000;
                        state.factionRank = Math.min((state.factionRank || 0) + 2, 7);
                        state.spiritStones += 5000;
                        addLog("你率眾迎敵，大獲全勝！宗門聲望 +3000，位階 +2，靈石 +5000", "great-event");
                    } else {
                        state.lifespan -= 15;
                        state.hp = Math.floor(state.hp * 0.3);
                        state.factionRep = (state.factionRep || 0) + 1000;
                        addLog("你奮勇作戰，雖然擊退了敵人，但自己也身受重傷。壽元 -15，血量大減，聲望 +1000", "bad");
                    }
                }
            },
            {
                text: "獻計退敵",
                desc: "運用智謀，不戰而屈人之兵",
                effects: (state) => {
                    if (state.comprehension >= 15) {
                        state.factionRep = (state.factionRep || 0) + 2000;
                        state.mindset += 5;
                        state.comprehension += 3;
                        addLog("你獻上妙計，宗門不戰而勝！掌門對你讚賞有加。聲望 +2000，心境 +5，悟性 +3", "great-event");
                    } else {
                        state.factionRep = Math.max(0, (state.factionRep || 0) - 500);
                        state.mindset -= 2;
                        addLog("你的計策失敗了，宗門損失慘重。聲望 -500，心境 -2", "bad");
                    }
                }
            },
            {
                text: "保存實力",
                desc: "避戰觀望，保全自己",
                effects: (state) => {
                    state.factionRep = Math.max(0, (state.factionRep || 0) - 1000);
                    state.mindset -= 3;
                    addLog("你選擇保存實力，但宗門上下對你頗有微詞。聲望 -1000，心境 -3", "bad");

                    if (state.factionRep < 500) {
                        state.faction = "none";
                        addLog("由於你的表現，宗門將你逐出！", "bad");
                    }
                }
            }
        ]
    },

    // ====== 80歲 - 掌門之位 ======
    {
        id: "age80_sect_leader",
        name: "掌門之位",
        triggerAge: 80,
        triggerOnce: true,
        conditions: {
            minRealm: 20,
            maxRealm: 35,
            minFactionRank: 5,
            minFactionRep: 5000
        },
        story: `老掌門即將坐化，宗門需要選出新的掌門。\n\n憑藉你的實力和聲望，你成為了最有力的候選人之一。\n\n但掌門之位意味著責任與束縛，你將為宗門操勞，難有時間專心修煉。`,
        choices: [
            {
                text: "競爭掌門",
                desc: "成為掌門，統領宗門",
                effects: (state) => {
                    state.factionRank = 8; // 掌門
                    state.spiritStones += 10000;
                    state.comprehension += 10;
                    state.mindset += 10;
                    if (!state.storyFlags) state.storyFlags = {};
                    state.storyFlags.isSectLeader = true;
                    addLog("你成為了新任掌門！獲得大量資源。靈石 +10000，悟性 +10，心境 +10", "great-event");
                    addLog("作為掌門，你需要為宗門的發展負責。", "event");
                }
            },
            {
                text: "推薦他人",
                desc: "推舉賢能，自己專心修煉",
                effects: (state) => {
                    state.factionRep = (state.factionRep || 0) + 3000;
                    state.mindset += 10;
                    state.comprehension += 5;
                    addLog("你推薦了更合適的人選，獲得了宗門上下的尊敬。聲望 +3000，心境 +10，悟性 +5", "event");
                }
            },
            {
                text: "離開宗門",
                desc: "成為散修，追求自由",
                effects: (state) => {
                    state.faction = "none";
                    state.factionRep = 0;
                    state.factionRank = 0;
                    state.mindset += 8;
                    state.luck += 5;
                    if (!state.storyFlags) state.storyFlags = {};
                    state.storyFlags.freeCultivator = true;
                    addLog("你選擇離開宗門，成為自由散修。心境 +8，氣運 +5", "event");
                }
            }
        ]
    },

    // ====== 120歲 - 天材地寶 ======
    {
        id: "age120_treasure",
        name: "天材地寶",
        triggerAge: 120,
        triggerOnce: true,
        conditions: {
            minRealm: 20,
            maxRealm: 40,
            minSpiritStones: 5000
        },
        story: `你在一場拍賣會上，發現了一株萬年靈芝！\n\n此物可以大幅提升修為，甚至有助於突破大境界。\n\n但起拍價就高達8000靈石，而且有一位合體期大能也對此物志在必得。`,
        choices: [
            {
                text: "傾家蕩產購買",
                desc: "花費10000靈石競拍",
                effects: (state) => {
                    if (state.spiritStones >= 10000) {
                        state.spiritStones -= 10000;
                        state.realmLevel += 2;
                        state.qiCap = getQiCapForLevel(state.realmLevel);
                        state.qi += Math.floor(state.qiCap * 0.5);
                        state.lifespan += 50;
                        addLog("你成功拍下萬年靈芝！境界 +2，真氣大增，壽元 +50", "great-event");
                    } else {
                        addLog("你的靈石不足10000，無法競拍。", "bad");
                    }
                }
            },
            {
                text: "放棄競拍",
                desc: "保留靈石，另尋機緣",
                effects: (state) => {
                    state.mindset += 2;
                    addLog("你選擇放棄競拍，保留實力。心境 +2", "event");
                }
            },
            {
                text: "暗中奪取",
                desc: "拍賣會後伏擊得主（需要魔道）",
                effects: (state) => {
                    if (state.storyFlags?.alignment === "魔道") {
                        const roll = Math.random();
                        if (roll < 0.5) {
                            state.realmLevel += 2;
                            state.qiCap = getQiCapForLevel(state.realmLevel);
                            state.mindset -= 5;
                            addLog("你成功奪取了萬年靈芝！境界 +2，但心境 -5", "great-event");
                        } else {
                            state.lifespan -= 30;
                            state.hp = Math.floor(state.hp * 0.2);
                            addLog("你被合體期大能發現，身受重傷！壽元 -30，血量大減", "bad");
                        }
                    } else {
                        addLog("你不是魔道修士，無法選擇此項。", "event");
                    }
                }
            }
        ]
    },

    // ====== 135歲 - 渡劫之難 ======
    {
        id: "age135_tribulation",
        name: "渡劫之難",
        triggerAge: 135,
        triggerOnce: true,
        conditions: {
            minRealm: 35,
            maxRealm: 45
        },
        story: `你即將面臨天劫，這是突破大乘期的必經之路。\n\n天劫凶險無比，歷代修士中，能夠成功渡劫者不足三成。\n\n你可以選擇不同的渡劫方式，每種方式都有其風險與機遇。`,
        choices: [
            {
                text: "硬抗天劫",
                desc: "憑藉自身實力硬抗",
                effects: (state) => {
                    const roll = Math.random();
                    const successRate = 0.5 + (state.mindset * 0.01);

                    if (roll < successRate) {
                        state.realmLevel += 3;
                        state.qiCap = getQiCapForLevel(state.realmLevel);
                        state.attack += 30;
                        state.defense += 20;
                        state.lifespan += 100;
                        addLog("你成功渡過天劫！境界 +3，攻擊 +30，防禦 +20，壽元 +100", "great-event");
                    } else {
                        state.lifespan -= 30;
                        state.hp = Math.floor(state.hp * 0.3);
                        state.mindset -= 5;
                        addLog("你渡劫失敗，身受重傷！壽元 -30，血量大減，心境 -5", "bad");
                    }
                }
            },
            {
                text: "使用法寶輔助",
                desc: "消耗5000靈石購買渡劫法寶",
                effects: (state) => {
                    if (state.spiritStones >= 5000) {
                        state.spiritStones -= 5000;
                        const roll = Math.random();

                        if (roll < 0.8) {
                            state.realmLevel += 3;
                            state.qiCap = getQiCapForLevel(state.realmLevel);
                            state.lifespan += 100;
                            addLog("借助法寶之力，你成功渡劫！境界 +3，壽元 +100", "great-event");
                        } else {
                            state.lifespan -= 15;
                            addLog("法寶在天劫中損毀，你受了輕傷。壽元 -15", "bad");
                        }
                    } else {
                        addLog("你的靈石不足5000，無法購買法寶。", "bad");
                    }
                }
            },
            {
                text: "尋求道友幫助",
                desc: "請道友為你護法（需要道友）",
                effects: (state) => {
                    if (state.storyFlags?.hasFriend) {
                        state.realmLevel += 3;
                        state.qiCap = getQiCapForLevel(state.realmLevel);
                        state.lifespan += 100;
                        state.luck += 5;
                        addLog("在道友的幫助下，你順利渡劫！境界 +3，壽元 +100，氣運 +5", "great-event");
                        addLog("你欠下了道友一個大人情。", "event");
                    } else {
                        addLog("你沒有道友可以幫助，只能獨自面對天劫。", "event");
                        // 回退到硬抗邏輯
                        const roll = Math.random();
                        if (roll < 0.4) {
                            state.realmLevel += 3;
                            state.qiCap = getQiCapForLevel(state.realmLevel);
                            addLog("你勉強渡過天劫。境界 +3", "event");
                        } else {
                            state.lifespan -= 30;
                            addLog("渡劫失敗，壽元 -30", "bad");
                        }
                    }
                }
            }
        ]
    },

    // ====== 150歲 - 魔道入侵 ======
    {
        id: "age150_demon_invasion",
        name: "魔道入侵",
        triggerAge: 150,
        triggerOnce: true,
        conditions: {
            minRealm: 40
        },
        story: `魔道大軍突然入侵修真界！\n\n正道聯盟號召所有修士共同抵禦外敵。這是一場關乎修真界存亡的大戰。\n\n你的選擇將決定修真界的命運，也將決定你未來的道路。`,
        choices: [
            {
                text: "加入正道聯盟",
                desc: "與正道修士並肩作戰",
                effects: (state) => {
                    const playerPower = state.attack + state.defense;
                    const roll = Math.random();

                    if (roll < 0.7) {
                        state.spiritStones += 10000;
                        state.factionRep = (state.factionRep || 0) + 5000;
                        state.comprehension += 10;
                        state.lifespan += 50;
                        if (!state.storyFlags) state.storyFlags = {};
                        state.storyFlags.alignment = "正道";
                        state.storyFlags.warHero = true;
                        addLog("你在大戰中立下赫赫戰功！靈石 +10000，聲望 +5000，悟性 +10，壽元 +50", "great-event");
                    } else {
                        state.lifespan -= 20;
                        state.hp = Math.floor(state.hp * 0.4);
                        addLog("你在戰鬥中受了重傷，但成功擊退了魔道。壽元 -20，血量大減", "bad");
                    }
                }
            },
            {
                text: "投靠魔道",
                desc: "加入魔道陣營（需要魔道）",
                effects: (state) => {
                    if (state.storyFlags?.alignment === "魔道") {
                        state.attack += 50;
                        state.spiritStones += 8000;
                        state.mindset -= 10;
                        if (!state.storyFlags) state.storyFlags = {};
                        state.storyFlags.demonLord = true;
                        addLog("你投靠魔道，獲得了強大的力量！攻擊 +50，靈石 +8000，但心境 -10", "event");
                        addLog("你已成為正道的公敵！", "bad");
                    } else {
                        addLog("你不是魔道修士，無法投靠魔道。", "event");
                    }
                }
            },
            {
                text: "保持中立",
                desc: "兩不相幫，獨善其身",
                effects: (state) => {
                    state.mindset += 5;
                    state.luck -= 3;
                    addLog("你選擇中立，但兩邊都對你頗有微詞。心境 +5，氣運 -3", "event");
                }
            }
        ]
    },

    // ====== 170歲 - 守護蒼生 ======
    {
        id: "age170_protect_mortals",
        name: "守護蒼生",
        triggerAge: 170,
        triggerOnce: true,
        conditions: {
            minRealm: 40
        },
        story: `魔道首領施展禁術，要毀滅整個凡人界！\n\n無數凡人將在這場浩劫中喪生。作為修真界的強者，你有能力阻止這一切。\n\n但代價可能是你的性命，或者至少是數十年的壽元。`,
        choices: [
            {
                text: "犧牲自己封印魔頭",
                desc: "以命換命，守護蒼生",
                effects: (state) => {
                    state.lifespan -= 50;
                    state.mindset += 20;
                    state.luck += 10;
                    state.breakBonus = (state.breakBonus || 0) + 0.15;
                    if (!state.storyFlags) state.storyFlags = {};
                    state.storyFlags.protector = true;
                    addLog("你犧牲了50年壽元，成功封印魔頭！", "great-event");
                    addLog("你獲得了「蒼生守護者」的稱號！心境 +20，氣運 +10，突破成功率永久 +15%", "great-event");
                }
            },
            {
                text: "聯合眾人圍攻",
                desc: "號召修士聯手對敵",
                effects: (state) => {
                    const playerPower = state.attack + state.defense;
                    const roll = Math.random();

                    if (roll < 0.6) {
                        state.spiritStones += 15000;
                        state.comprehension += 15;
                        state.mindset += 10;
                        addLog("你聯合眾修士，成功擊敗魔頭！靈石 +15000，悟性 +15，心境 +10", "great-event");
                    } else {
                        state.lifespan -= 30;
                        state.hp = Math.floor(state.hp * 0.3);
                        addLog("圍攻失敗，你身受重傷！壽元 -30，血量大減", "bad");
                    }
                }
            },
            {
                text: "保存實力",
                desc: "凡人生死與我何干",
                effects: (state) => {
                    state.mindset -= 20;
                    state.luck -= 10;
                    if (!state.storyFlags) state.storyFlags = {};
                    state.storyFlags.selfish = true;
                    addLog("你選擇袖手旁觀，凡人界生靈塗炭。心境 -20，氣運 -10", "bad");
                    addLog("你的冷血讓所有人心寒。", "bad");
                }
            }
        ]
    },

    // ====== 190歲 - 最終抉擇 ======
    {
        id: "age190_final_choice",
        name: "最終抉擇",
        triggerAge: 190,
        triggerOnce: true,
        conditions: {
            minRealm: 45
        },
        story: `你已經站在了飛升的門檻前，回顧這一生的修行。\n\n從凡人到如今的大乘期修士，你經歷了無數磨難與抉擇。\n\n在飛升之前，你想明白了自己真正追求的是什麼。`,
        choices: [
            {
                text: "追求力量",
                desc: "力量才是一切的根本",
                effects: (state) => {
                    state.attack += 50;
                    state.defense += 30;
                    state.mindset -= 10;
                    addLog("你領悟了力量的真諦。攻擊 +50，防禦 +30，但心境 -10", "event");
                }
            },
            {
                text: "追求長生",
                desc: "唯有長生，才能見證永恆",
                effects: (state) => {
                    state.lifespan += 100;
                    state.comprehension += 10;
                    addLog("你領悟了長生的奧秘。壽元 +100，悟性 +10", "event");
                }
            },
            {
                text: "追求大道",
                desc: "大道至簡，返璞歸真",
                effects: (state) => {
                    state.comprehension += 20;
                    state.mindset += 20;
                    state.breakBonus = (state.breakBonus || 0) + 0.1;
                    addLog("你領悟了大道的真諦！悟性 +20，心境 +20，突破成功率 +10%", "great-event");
                }
            }
        ]
    },

    // ====== 210歲 - 了結因果 ======
    {
        id: "age210_settle_karma",
        name: "了結因果",
        triggerAge: 210,
        triggerOnce: true,
        conditions: {
            minRealm: 50
        },
        story: `你已經達到真仙境界，飛升在即。\n\n但在飛升之前，你需要了結塵世間的因果。\n\n你想起了這一生中遇到的人和事，是時候做個了斷了。`,
        choices: [
            {
                text: "拜訪故人",
                desc: "與舊識告別，了結心願",
                effects: (state) => {
                    state.mindset += 10;
                    state.breakBonus = (state.breakBonus || 0) + 0.05;
                    const ascensionBonus = (state.ascensionBonus || 0) + 0.05;
                    state.ascensionBonus = ascensionBonus;
                    addLog("你拜訪了故人，了結了心中的牽掛。心境 +10，飛升成功率 +5%", "event");
                }
            },
            {
                text: "傳承衣鉢",
                desc: "將畢生所學傳授後人",
                effects: (state) => {
                    state.mindset += 15;
                    state.luck += 10;
                    const ascensionBonus = (state.ascensionBonus || 0) + 0.1;
                    state.ascensionBonus = ascensionBonus;
                    if (!state.storyFlags) state.storyFlags = {};
                    state.storyFlags.hasSuccessor = true;
                    addLog("你傳承了衣鉢，獲得「傳承者」稱號。心境 +15，氣運 +10，飛升成功率 +10%", "great-event");
                }
            },
            {
                text: "直接飛升",
                desc: "斬斷塵緣，立即飛升",
                effects: (state) => {
                    state.mindset += 5;
                    addLog("你斬斷了所有塵緣，心無旁騖。心境 +5", "event");
                }
            }
        ]
    },

    // ====== 230歲 - 飛升前夕 ======
    {
        id: "age230_before_ascension",
        name: "飛升前夕",
        triggerAge: 230,
        triggerOnce: true,
        conditions: {
            minRealm: 54
        },
        story: `你已經達到真仙圓滿，天劫即將降臨。\n\n這是你最後的準備時間。一旦開始飛升，就再無回頭路。\n\n你要如何做最後的準備？`,
        choices: [
            {
                text: "閉關調息",
                desc: "調整狀態至最佳",
                effects: (state) => {
                    state.qi = state.qiCap;
                    state.hp = state.maxHp;
                    state.mindset += 5;
                    addLog("你閉關調息，狀態恢復至巔峰。真氣、血量全滿，心境 +5", "event");
                }
            },
            {
                text: "祭煉法寶",
                desc: "消耗10000靈石強化法寶",
                effects: (state) => {
                    if (state.spiritStones >= 10000) {
                        state.spiritStones -= 10000;
                        const ascensionBonus = (state.ascensionBonus || 0) + 0.15;
                        state.ascensionBonus = ascensionBonus;
                        addLog("你祭煉了渡劫法寶。靈石 -10000，飛升成功率 +15%", "event");
                    } else {
                        addLog("你的靈石不足10000，無法祭煉法寶。", "bad");
                    }
                }
            },
            {
                text: "立即飛升",
                desc: "無需準備，直接飛升",
                effects: (state) => {
                    addLog("你決定立即飛升，不再猶豫！", "event");
                }
            }
        ]
    }
];

// ============================================
// 事件觸發檢測
// ============================================
function checkStoryEvents() {
    if (!window.state) return null;

    // 初始化已觸發事件記錄
    if (!state.triggeredStoryEvents) {
        state.triggeredStoryEvents = [];
    }

    // 遍歷所有事件,找到符合條件的
    for (const event of STORY_EVENTS) {
        // 檢查是否已觸發過
        if (event.triggerOnce && state.triggeredStoryEvents.includes(event.id)) {
            continue;
        }

        // 檢查年齡
        if (state.age !== event.triggerAge) {
            continue;
        }

        // 檢查其他條件
        if (!checkEventConditions(event.conditions)) {
            continue;
        }

        // 找到符合的事件
        return event;
    }

    return null;
}

// 檢查事件條件
function checkEventConditions(conditions) {
    if (!conditions) return true;

    // 檢查境界範圍
    if (conditions.minRealm !== undefined && state.realmLevel < conditions.minRealm) {
        return false;
    }
    if (conditions.maxRealm !== undefined && state.realmLevel > conditions.maxRealm) {
        return false;
    }

    // 檢查氣運
    if (conditions.minLuck !== undefined && state.luck < conditions.minLuck) {
        return false;
    }

    // 檢查靈石
    if (conditions.minSpiritStones !== undefined && state.spiritStones < conditions.minSpiritStones) {
        return false;
    }

    // 檢查宗門聲望
    if (conditions.minFactionRep !== undefined && (state.factionRep || 0) < conditions.minFactionRep) {
        return false;
    }

    // 檢查宗門位階
    if (conditions.minFactionRank !== undefined && (state.factionRank || 0) < conditions.minFactionRank) {
        return false;
    }

    // 檢查宗門
    if (conditions.faction !== undefined) {
        if (conditions.faction === "none" && state.faction && state.faction !== "none") {
            return false;
        }
        if (conditions.faction !== "none" && state.faction !== conditions.faction) {
            return false;
        }
    }

    // 檢查故事標記
    if (conditions.storyFlags) {
        if (!state.storyFlags) return false;
        for (const [key, value] of Object.entries(conditions.storyFlags)) {
            if (state.storyFlags[key] !== value) {
                return false;
            }
        }
    }

    return true;
}

// ============================================
// 顯示劇情事件UI
// ============================================
function showStoryEvent(event) {
    const modal = document.getElementById("story-event-modal");
    const bg = document.getElementById("story-event-modal-bg");
    const title = document.getElementById("story-event-title");
    const story = document.getElementById("story-event-story");
    const choicesContainer = document.getElementById("story-event-choices");

    if (!modal || !bg) {
        console.error("Story event modal not found!");
        return;
    }

    // 設置標題和劇情
    if (title) title.textContent = event.name;
    if (story) story.textContent = event.story;

    // 清空並生成選項按鈕
    if (choicesContainer) {
        choicesContainer.innerHTML = "";

        event.choices.forEach((choice, index) => {
            const btn = document.createElement("button");
            btn.className = "story-choice-btn";
            btn.innerHTML = `
                <div class="choice-text">${choice.text}</div>
                <div class="choice-desc">${choice.desc || ""}</div>
            `;

            btn.addEventListener("click", () => {
                handleStoryChoice(event, choice);
            });

            choicesContainer.appendChild(btn);
        });
    }

    // 顯示彈窗
    modal.style.display = "block";
    bg.style.display = "block";
}

// 處理玩家選擇
function handleStoryChoice(event, choice) {
    // 執行選擇效果
    if (choice.effects && typeof choice.effects === "function") {
        choice.effects(window.state);
    }

    // 記錄事件已觸發
    if (event.triggerOnce) {
        if (!state.triggeredStoryEvents) {
            state.triggeredStoryEvents = [];
        }
        state.triggeredStoryEvents.push(event.id);
    }

    // 關閉彈窗
    closeStoryEventModal();

    // 更新UI
    if (typeof renderUI === "function") {
        renderUI();
    }

    // 存檔
    if (typeof GameStateManager !== "undefined") {
        GameStateManager.save();
    }
}

// 關閉劇情事件彈窗
function closeStoryEventModal() {
    const modal = document.getElementById("story-event-modal");
    const bg = document.getElementById("story-event-modal-bg");

    if (modal) modal.style.display = "none";
    if (bg) bg.style.display = "none";
}

// 導出函數
window.checkStoryEvents = checkStoryEvents;
window.showStoryEvent = showStoryEvent;
window.closeStoryEventModal = closeStoryEventModal;
