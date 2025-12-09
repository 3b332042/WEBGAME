// events.js
// 處理修行中的隨機事件（小機緣等）
// 依賴：gameState, addLog, randomInt, randomChance（在 main.js 裡定義）
// 依賴：getRealm, realmName, getQiCapForLevel, getLifeGainForLevel（在 realms.js 裡）


// ============================================
// 小機緣事件表（每個事件 = 一筆資料）
// ============================================

const FortuneEventTable = [
    // ====== 1. 找靈石（正面） ======
    {
        id: "find_stone",
        desc: "意外整理洞府，找到塵封的靈石。",
        weight: 4,
        effect: () => {
            const stoneGain = randomInt(5, 100);
            state.spiritStones += stoneGain;
            addLog(`你在打坐時整理洞府，意外找到塵封的靈石 ${stoneGain} 枚。`, "event");
        }
    },

    // ====== 2. 悟性小提升（正面） ======
    {
        id: "raise_comprehension",
        desc: "對某段功法忽有所悟。",
        weight: 2,
        effect: () => {
            state.comprehension += 1;
            addLog("你對某段功法忽有所悟，悟性略有提升（+1）。", "event");
        }
    },

    // ====== 3. 心境小提升（正面） ======
    {
        id: "raise_mindset",
        desc: "長年靜修，心境更加平和。",
        weight: 3,
        effect: () => {
            state.mindset += 1;
            addLog("長年靜修，使你的心境更加平和（心境 +1）。", "event");
        }
    },

    // ====== 4. 壽元微增（正面） ======
    {
        id: "gain_lifespan",
        desc: "吸收天地精華，壽元略有增長。",
        weight: 1,
        effect: () => {
            state.lifespan += 2;
            addLog("你吸收天地精華，壽元增加了 2 年。", "event");
        }
    },

    // ====== 5. 悟性大悟（正面） ======
    {
        id: "big_comprehension",
        desc: "冥想中，你突然看破某段法訣本質。",
        weight: 0.6,
        effect: () => {
            state.comprehension += 2;
            addLog("你突然領悟了功法的深層意蘊，悟性提升了 2 點！", "event");
        }
    },

    // ====== 6. 真氣暴動（負面：扣真氣） ======
    {
        id: "qi_backlash",
        desc: "體內氣機紊亂，真氣不受控制。",
        weight: 1.5,
        type: "bad",
        effect: () => {
            const loss = Math.floor(state.qi * 0.2);
            state.qi -= loss;
            if (state.qi < 0) state.qi = 0;
            addLog(`體內氣機震盪，你損失了 ${loss} 點真氣。`, "bad");
        }
    },

    // ====== 7. 心魔侵擾（負面：心境 -1） ======
    {
        id: "mind_demon",
        desc: "心魔侵擾，使你的心境動搖。",
        weight: 1,
        type: "bad",
        effect: () => {
            state.mindset = Math.max(1, state.mindset - 1);
            addLog("心魔悄然侵入，你的心境受損，下降了 1 點。", "bad");
        }
    },

    // ====== 8. 遇靈獸（正面：氣運 +1） ======
    {
        id: "meet_spirit_beast",
        desc: "你在修行途中遇到一隻溫順的靈獸。",
        weight: 1.2,
        effect: () => {
            state.luck += 1;
            addLog("你餵食靈獸後，它祝福了你，使你的氣運提升 1 點。", "event");
        }
    },

    // ====== 9. 真氣精純（正面：真氣 +10%）======
    {
        id: "qi_refine",
        desc: "你的真氣在打磨中變得更加凝練。",
        weight: 1.4,
        effect: () => {
            state.qi = Math.floor(state.qi * 1.1);
            addLog("你感受到真氣更加精純，真氣量提升了 10%。", "event");
        }
    },

    // ====== 10. 短暫走火（負面：壽元 -1） ======
    {
        id: "minor_deviation",
        desc: "走火入魔的前兆，使你元氣受到損傷。",
        weight: 0.8,
        type: "bad",
        effect: () => {
            state.lifespan -= 1;
            addLog("你險些走火入魔，壽元減少了 1 年。", "bad");

            // 檢查是否死亡
            if (GameStateManager.isDead()) {
                state.deathReason = "走火入魔，壽元耗盡";
                addLog("你因走火入魔而壽元耗盡，當場坐化。", "bad");
                setTimeout(() => {
                    if (typeof showVictoryScreen === "function") {
                        showVictoryScreen(false);
                    }
                }, 500);
            }
        }
    },

    // ====== 11. 靈氣潮湧（正面：大量真氣） ======
    {
        id: "qi_surge",
        desc: "天地靈氣突然湧入你的周身。",
        weight: 0.7,
        effect: () => {
            const add = randomInt(50, 120);
            state.qi += add;
            addLog(`天地靈氣匯聚，你瞬間吸收了 ${add} 點真氣！`, "event");
        }
    },

    // ====== 12. 極小機率靈根提升 ======
    {
        id: "root_upgrade_fortune",
        desc: "體內血脈在靈氣沖刷下發生了微妙變化。",
        weight: 0.05,
        effect: () => {
            const names = { 5: "五靈根", 4: "四靈根", 3: "三靈根", 2: "雙靈根", 1: "天靈根" };
            const before = state.rootCount || 5;

            if (before <= 1) return;

            state.rootCount = before - 1;

            addLog(
                `✨【逆天改命】在一次閉關中，你的靈根被天地重新洗練，從「${names[before]}」晉升為「${names[before - 1]}」！`,
                "great-event"
            );
        }
    },

    // ====== 13. 大機緣－直升一小境界（正面） ======
    {
        id: "big_breakthrough",
        desc: "天降大機緣，你突破瓶頸，境界自然提升！",
        weight: 0.1,
        effect: () => {
            const current = state.realmLevel;
            const next = getRealm(current + 1);
            if (!next) return;

            state.realmLevel += 1;
            state.qiCap = getQiCapForLevel(state.realmLevel);

            const lg = getLifeGainForLevel(state.realmLevel);
            state.lifespan += lg;

            state.mindset += 1;

            addLog(
                `✨【大機緣】你被天地垂憐，境界突破至「${realmName(state.realmLevel)}」！壽元 +${lg}，心境 +1。`,
                "great-event"
            );
        }
    },

    // ====== 14.（等等：心魔、壽元燃燒、走火等...）=====

    // —— 15. 道心迷惘：悟性 -1~3 ——
    {
        id: "dao_confusion",
        desc: "你在參悟大道時踏入歧途。",
        weight: 0.4,
        type: "bad",
        effect: () => {
            const loss = randomInt(1, 3);
            state.comprehension = Math.max(1, state.comprehension - loss);
            addLog(`⚠️【道心迷惘】悟性降低 ${loss} 點。`, "bad");
        }
    },

    // —— 16. 心魔暴走：心境 -2~4 ——
    {
        id: "inner_demon_eruption",
        desc: "積壓已久的心魔爆發。",
        weight: 0.35,
        type: "bad",
        effect: () => {
            const loss = randomInt(2, 4);
            state.mindset = Math.max(1, state.mindset - loss);
            addLog(`⚠️【心魔暴走】心境降低 ${loss} 點。`, "bad");
        }
    },

    // —— 17. 壽元燃燒：大量減少 ——
    {
        id: "life_burn",
        desc: "秘術反噬，壽元燃燒。",
        weight: 0.3,
        type: "bad",
        effect: () => {
            const loss = randomInt(5, 20);
            state.lifespan -= loss;
            addLog(`⚠️【壽元燃燒】壽元減少 ${loss} 年。`, "bad");

            // 檢查是否死亡
            if (GameStateManager.isDead()) {
                state.deathReason = "秘術反噬，壽元燃燒致死";
                addLog("你因秘術反噬而壽元耗盡，當場坐化。", "bad");
                setTimeout(() => {
                    if (typeof showVictoryScreen === "function") {
                        showVictoryScreen(false);
                    }
                }, 500);
            }
        }
    },

    // —— 18. 徹底走火：三重削弱 ——
    {
        id: "great_deviation",
        desc: "你在衝擊瓶頸時徹底走火入魔。",
        weight: 0.15,
        type: "bad",
        effect: () => {
            const comp = randomInt(1, 2);
            const mind = randomInt(1, 3);
            const life = randomInt(5, 30);

            state.comprehension = Math.max(1, state.comprehension - comp);
            state.mindset = Math.max(1, state.mindset - mind);
            state.lifespan -= life;

            addLog(
                `☠️【徹底走火】悟性 -${comp}、心境 -${mind}、壽元 -${life}！`,
                "bad"
            );

            // 檢查是否死亡
            if (GameStateManager.isDead()) {
                state.deathReason = "徹底走火入魔，壽元耗盡";
                addLog("你因徹底走火入魔而壽元耗盡，當場坐化。", "bad");
                setTimeout(() => {
                    if (typeof showVictoryScreen === "function") {
                        showVictoryScreen(false);
                    }
                }, 500);
            }
        }
    },

    // —— 19. 極小機率猝死 ——
    {
        id: "sudden_death",
        desc: "無形因果降臨……",
        weight: 0.01,
        effect: () => {
            if (state.deathSubstitutes > 0) {
                state.deathSubstitutes -= 1;
                addLog(
                    `⚡【替死符啟動】替你承受了致命天譴！（剩餘 ${state.deathSubstitutes} 張）`,
                    "great-event"
                );
                return;
            }
            state.deathReason = "天命難違，遭受天譴";
            state.lifespan = state.age;
            addLog("【天命難違】無形天譴降臨，你當場隕落。", "bad-event");
            setTimeout(() => {
                if (typeof showVictoryScreen === "function") {
                    showVictoryScreen(false); // false = 死亡結算
                }
            }, 500);
        }
    },

    // ====== 20. 宗門任務獎勵（需加入宗門） ======
    {
        id: "sect_task_reward",
        desc: "你順手完成了宗門發布的小任務。",
        weight: 1.5,
        condition: () => state.faction && state.faction !== "none",
        effect: () => {
            if (!state.faction || state.faction === "none") return;
            const contrib = randomInt(100, 300);
            state.factionContrib = (state.factionContrib || 0) + contrib;
            addLog(`你順手完成了宗門任務，獲得 ${contrib} 點宗門貢獻。`, "event");
        }
    },

    // ====== 21. 長老指點（需加入宗門） ======
    {
        id: "sect_guidance",
        desc: "偶遇宗門長老，獲得幾句指點。",
        weight: 0.8,
        condition: () => state.faction && state.faction !== "none",
        effect: () => {
            if (!state.faction || state.faction === "none") return;
            const contrib = randomInt(50, 150);
            const exp = 50;
            state.factionContrib = (state.factionContrib || 0) + contrib;
            state.qi += exp;
            addLog(`偶遇長老指點，修為略增，並獲得 ${contrib} 點宗門貢獻。`, "event");
        }
    }
];


// ============================================
// 根據權重選事件
// ============================================
function pickRandomEvent(table) {
    // 過濾掉不符合條件的事件
    const validEvents = table.filter(ev => {
        if (ev.condition && typeof ev.condition === 'function') {
            return ev.condition();
        }
        return true;
    });

    if (validEvents.length === 0) return null;

    const totalWeight = validEvents.reduce((sum, ev) => sum + ev.weight, 0);
    let roll = Math.random() * totalWeight;

    for (const ev of validEvents) {
        if (roll < ev.weight) return ev;
        roll -= ev.weight;
    }
    return validEvents[0];
}


// ============================================
// 小機緣觸發（已改：煉虛後不再觸發直升一境事件）
// ============================================
function smallFortuneEvent() {
    const currentLevel = state.realmLevel || 1;

    // 🔹 等級 >= 30（煉虛）→ 禁用 big_breakthrough
    const table =
        currentLevel >= 30
            ? FortuneEventTable.filter(ev => ev.id !== "big_breakthrough")
            : FortuneEventTable;

    const ev = pickRandomEvent(table);
    ev.effect();
}
