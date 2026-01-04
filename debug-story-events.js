// debug-story-events.js
// 劇情事件調試工具

// 顯示當前狀態和所有劇情事件的觸發條件
function debugStoryEvents() {
    console.log("=== 劇情事件調試資訊 ===");
    console.log("當前狀態:");
    console.log(`  年齡: ${state.age}`);
    console.log(`  境界: ${state.realmLevel} (${realmName(state.realmLevel)})`);
    console.log(`  宗門: ${state.faction}`);
    console.log(`  已觸發事件: ${state.triggeredStoryEvents?.join(", ") || "無"}`);
    console.log(`  劇情標記:`, state.storyFlags);

    console.log("\n檢查所有劇情事件:");

    if (typeof STORY_EVENTS === "undefined") {
        console.error("❌ STORY_EVENTS 未定義！請確認 story-events.js 已載入。");
        return;
    }

    STORY_EVENTS.forEach((event, index) => {
        console.log(`\n[${index}] ${event.name} (ID: ${event.id})`);
        console.log(`  觸發年齡: ${event.triggerAge}`);
        console.log(`  當前年齡: ${state.age} ${state.age === event.triggerAge ? "✅" : "❌"}`);

        // 檢查是否已觸發
        const alreadyTriggered = event.triggerOnce && state.triggeredStoryEvents?.includes(event.id);
        console.log(`  已觸發: ${alreadyTriggered ? "是 ❌" : "否 ✅"}`);

        // 檢查條件
        if (event.conditions) {
            console.log("  條件檢查:");

            if (event.conditions.minRealm !== undefined) {
                const pass = state.realmLevel >= event.conditions.minRealm;
                console.log(`    境界 >= ${event.conditions.minRealm}: ${state.realmLevel} ${pass ? "✅" : "❌"}`);
            }

            if (event.conditions.maxRealm !== undefined) {
                const pass = state.realmLevel <= event.conditions.maxRealm;
                console.log(`    境界 <= ${event.conditions.maxRealm}: ${state.realmLevel} ${pass ? "✅" : "❌"}`);
            }

            if (event.conditions.faction !== undefined) {
                if (event.conditions.faction === "none") {
                    const pass = !state.faction || state.faction === "none";
                    console.log(`    未加入宗門: ${state.faction} ${pass ? "✅" : "❌"}`);
                } else {
                    const pass = state.faction === event.conditions.faction;
                    console.log(`    宗門 = ${event.conditions.faction}: ${state.faction} ${pass ? "✅" : "❌"}`);
                }
            }

            if (event.conditions.storyFlags) {
                console.log("    劇情標記:");
                for (const [key, value] of Object.entries(event.conditions.storyFlags)) {
                    const actualValue = state.storyFlags?.[key];
                    const pass = actualValue === value;
                    console.log(`      ${key} = ${value}: ${actualValue} ${pass ? "✅" : "❌"}`);
                }
            }
        }

        // 總結
        const canTrigger = checkEventConditions(event.conditions) &&
            state.age === event.triggerAge &&
            !(event.triggerOnce && state.triggeredStoryEvents?.includes(event.id));
        console.log(`  可以觸發: ${canTrigger ? "✅ 是" : "❌ 否"}`);
    });

    console.log("\n=== 調試完成 ===");
}

// 手動觸發特定劇情事件(用於測試)
function forceStoryEvent(eventId) {
    if (typeof STORY_EVENTS === "undefined") {
        console.error("❌ STORY_EVENTS 未定義！");
        return;
    }

    const event = STORY_EVENTS.find(e => e.id === eventId);
    if (!event) {
        console.error(`❌ 找不到事件: ${eventId}`);
        console.log("可用事件ID:");
        STORY_EVENTS.forEach(e => console.log(`  - ${e.id}: ${e.name}`));
        return;
    }

    console.log(`🎭 強制觸發事件: ${event.name}`);
    if (typeof showStoryEvent === "function") {
        showStoryEvent(event);
    } else {
        console.error("❌ showStoryEvent 函數未定義！");
    }
}

// 列出所有可用的劇情事件
function listStoryEvents() {
    if (typeof STORY_EVENTS === "undefined") {
        console.error("❌ STORY_EVENTS 未定義！");
        return;
    }

    console.log("=== 所有劇情事件 ===");
    STORY_EVENTS.forEach((event, index) => {
        const triggered = state.triggeredStoryEvents?.includes(event.id) ? "✅" : "⬜";
        console.log(`${triggered} [${index}] ${event.name} (ID: ${event.id}) - 觸發年齡: ${event.triggerAge}`);
    });
}

// 清除已觸發的事件記錄(用於測試)
function resetStoryEvents() {
    if (confirm("確定要清除所有已觸發的劇情事件記錄嗎？")) {
        state.triggeredStoryEvents = [];
        state.storyFlags = {};
        console.log("✅ 已清除劇情事件記錄");
        if (typeof GameStateManager !== "undefined") {
            GameStateManager.save();
        }
    }
}

// 設置年齡到特定劇情事件的觸發年齡
function jumpToEventAge(eventId) {
    if (typeof STORY_EVENTS === "undefined") {
        console.error("❌ STORY_EVENTS 未定義！");
        return;
    }

    const event = STORY_EVENTS.find(e => e.id === eventId);
    if (!event) {
        console.error(`❌ 找不到事件: ${eventId}`);
        return;
    }

    state.age = event.triggerAge;
    console.log(`✅ 年齡已設置為 ${event.triggerAge} 歲 (${event.name})`);

    if (typeof renderUI === "function") {
        renderUI();
    }

    if (typeof GameStateManager !== "undefined") {
        GameStateManager.save();
    }
}

// 導出到 window
window.debugStoryEvents = debugStoryEvents;
window.forceStoryEvent = forceStoryEvent;
window.listStoryEvents = listStoryEvents;
window.resetStoryEvents = resetStoryEvents;
window.jumpToEventAge = jumpToEventAge;

console.log("📝 劇情事件調試工具已載入！");
console.log("可用命令:");
console.log("  debugStoryEvents()     - 顯示詳細調試資訊");
console.log("  listStoryEvents()      - 列出所有劇情事件");
console.log("  forceStoryEvent(id)    - 強制觸發指定事件");
console.log("  resetStoryEvents()     - 清除已觸發記錄");
console.log("  jumpToEventAge(id)     - 跳轉到事件觸發年齡");
console.log("\n範例: forceStoryEvent('age16_master_choice')");
