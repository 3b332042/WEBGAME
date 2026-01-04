# 晉升失敗變成太上長老 Bug 診斷

## 🐛 問題描述

用戶報告：晉升失敗後，階級變成了太上長老（Rank 5）

## 🔍 可能的原因

### 1. 戰敗時錯誤觸發晉升
- **檢查**: `handleDefeat` 是否被正確調用
- **檢查**: 是否有其他地方設置了 `factionRank`

### 2. 晉升邏輯錯誤
- **檢查**: `handleVictory` 的判斷條件
- **檢查**: `promotionMap` 的映射是否正確

### 3. 存檔數據異常
- **檢查**: localStorage 中的 `factionRank` 值
- **檢查**: 是否有其他代碼修改了存檔

## 📋 診斷步驟

### 步驟 1: 檢查當前階級
在瀏覽器 Console (F12) 執行：
```javascript
console.log("Current factionRank:", gameState.factionRank);
console.log("Current faction:", gameState.faction);
```

### 步驟 2: 檢查存檔
```javascript
const save = JSON.parse(localStorage.getItem("xiuxian-save"));
console.log("Saved factionRank:", save.factionRank);
```

### 步驟 3: 重現問題
1. 記錄當前階級
2. 挑戰一個 NPC
3. **故意輸掉戰鬥**
4. 查看 Console 日誌
5. 檢查階級是否改變

### 步驟 4: 查看 Console 日誌
戰敗時應該看到：
```
=== Battle Defeat ===
Player defeated by: [NPC名稱]
Current factionRank: [當前階級]
Enemy ID: [敵人ID]
State reloaded on defeat
```

## 🔧 臨時修復方案

如果階級被錯誤設置，在 Console 執行：
```javascript
// 重置為正確的階級（例如 Rank 0）
gameState.factionRank = 0;
GameStateManager.save();
alert("階級已重置為雜役弟子");
location.reload();
```

## 💡 可能的 Bug 來源

### 檢查點 1: promotionMap
```javascript
const promotionMap = {
    "npc_inner": 1,
    "npc_core": 2,
    "npc_elder": 3,
    "npc_guard": 4,
    "npc_master": 5
};
```

**問題**: 如果 `enemyUnit.id` 不在這個 map 中，`targetRank` 會是 `undefined`

### 檢查點 2: 晉升判斷
```javascript
if (currentRank < targetRank) {
    window.gameState.factionRank = targetRank;
}
```

**問題**: 如果 `targetRank` 是 `undefined`，這個判斷會怎樣？

### 檢查點 3: 戰敗處理
```javascript
function handleDefeat() {
    // 是否有任何代碼修改了 factionRank？
}
```

## 🎯 建議的修復

### 修復 1: 加強日誌
在 `handleDefeat` 中添加：
```javascript
console.log("=== Battle Defeat ===");
console.log("Current factionRank BEFORE:", window.gameState.factionRank);
// ... 其他代碼
console.log("Current factionRank AFTER:", window.gameState.factionRank);
```

### 修復 2: 確保戰敗不修改階級
```javascript
function handleDefeat() {
    // 重新載入狀態，確保沒有意外修改
    if (typeof GameStateManager !== 'undefined') {
        GameStateManager.load();
    }
    
    setTimeout(() => {
        alert(`【挑戰失敗】\n\n你不敵 ${enemyUnit.name}，回宗門靜養一段時日。`);
        returnToHonorHall();
    }, 500);
}
```

### 修復 3: 加強晉升判斷
```javascript
if (targetRank !== undefined && currentRank < targetRank) {
    console.log("Promoting from", currentRank, "to", targetRank);
    window.gameState.factionRank = targetRank;
    // ...
}
```

## 🧪 測試方案

1. 清除存檔重新開始
2. 加入宗門（Rank 0）
3. 挑戰內門弟子並**故意輸掉**
4. 檢查階級是否保持 Rank 0
5. 查看 Console 日誌

## 📝 需要用戶提供的信息

1. 戰敗時的 Console 完整日誌
2. 戰敗前的階級
3. 戰敗後的階級
4. 挑戰的是哪個 NPC

---

**請您**：
1. 打開遊戲，按 F12 打開 Console
2. 挑戰一個 NPC 並故意輸掉
3. 把 Console 的日誌複製給我
4. 告訴我戰敗前後的階級變化

這樣我就能準確定位問題！
