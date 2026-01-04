// leaderboard.js
// 負責將玩家數據上傳至 Firebase Firestore

// 戰力計算函式 (如果全域沒有，就用這裡的)
function getBattlePower() {
    if (typeof window.calcBattlePower === "function") {
        return window.calcBattlePower();
    }
    // 備用計算邏輯 (參考 calc_cp.js)
    const s = window.state;
    if (!s) return 0;

    const realmScore = s.realmLevel * 20;
    const atkScore = s.attack * 5;
    const defScore = s.defense * 3;
    const hpScore = s.maxHp * 0.8;
    const critRateScore = (s.critRate || 0.05) * 100 * 2;
    const critDmgScore = (s.critDamage || 0.5) * 100 * 1;
    const compScore = s.comprehension * 2;
    const luckScore = s.luck * 1.5;

    return Math.floor(realmScore + atkScore + defScore + hpScore + critRateScore + critDmgScore + compScore + luckScore);
}

// 匿名登入並上傳數據
async function uploadToLeaderboard(showToastMsg = true) {
    if (!window.auth || !window.db) {
        console.error("Firebase not initialized.");
        if (showToastMsg && typeof showToast === "function") showToast("連線失敗：Firebase 未初始化", "fail");
        return;
    }

    try {
        // 1. 確保匿名登入
        let user = window.auth.currentUser;
        if (!user) {
            console.log("Signing in anonymously...");
            const userCredential = await window.auth.signInAnonymously();
            user = userCredential.user;
            console.log("Signed in as:", user.uid);
        }

        // 2. 準備數據
        const s = window.state;
        const power = getBattlePower();
        const realmNameStr = typeof realmName === "function" ? realmName(s.realmLevel) : `Level ${s.realmLevel}`;

        const leaderboardData = {
            uid: user.uid,              // 用於更新識別
            name: s.name || "無名散修",
            realmLevel: s.realmLevel,
            realmName: realmNameStr,
            power: power,
            lifespan: s.lifespan,
            age: s.age,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        };

        // 3. 寫入 Firestore
        // 使用 add() 自動生成 ID，從而允許同一位玩家（同 UID）擁有多筆紀錄
        await window.db.collection("leaderboard").add(leaderboardData);

        console.log("Leaderboard updated:", leaderboardData);
        if (showToastMsg && typeof showToast === "function") {
            showToast("✨ 修為已上傳至天道榜！", "success");
        } else if (showToastMsg) {
            alert("上傳成功！");
        }

        // 觸發一個自定義事件，方便其他 UI 監聽
        const event = new CustomEvent("leaderboardUpdated", { detail: leaderboardData });
        document.dispatchEvent(event);

    } catch (error) {
        console.error("Upload failed:", error);
        if (showToastMsg && typeof showToast === "function") {
            const msg = error.code === 'auth/operation-not-allowed'
                ? "上傳失敗：請聯繫管理員開啟匿名登入"
                : "上傳失敗：" + error.message;
            showToast(msg, "fail");
        } else if (showToastMsg) {
            alert("上傳失敗: " + error.message);
        }
    }
}

// 掛載到 window
window.uploadToLeaderboard = uploadToLeaderboard;
window.getBattlePower = getBattlePower;

// ===== 排行榜顯示邏輯 =====

async function fetchLeaderboard() {
    if (!window.db) return [];
    try {
        // 依照戰力 (power) 降序排列，取前 20 名
        const snapshot = await window.db.collection("leaderboard")
            .orderBy("power", "desc")
            .limit(20)
            .get();

        const list = [];
        snapshot.forEach(doc => {
            list.push(doc.data());
        });
        return list;
    } catch (error) {
        console.error("Error fetching leaderboard:", error);
        // 如果還沒建 index，可能會報錯，提醒開發者
        if (error.code === 'failed-precondition') {
            console.warn("可能需要建立 Firestore Index。請查看 Console 的連結。");
        }
        return [];
    }
}

function renderLeaderboard(list) {
    const tbody = document.querySelector("#leaderboard-table tbody");
    if (!tbody) return;

    if (list.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4" style="text-align:center; padding: 20px;">尚無紀錄，正在讀取或連接失敗</td></tr>`;
        return;
    }

    let html = "";
    list.forEach((player, index) => {
        let rankClass = "";
        if (index === 0) rankClass = "rank-1";
        else if (index === 1) rankClass = "rank-2";
        else if (index === 2) rankClass = "rank-3";

        html += `
            <tr class="${rankClass}">
                <td>${index + 1}</td>
                <td>${escapeHtml(player.name)}</td>
                <td>${player.realmName || '未知'}</td>
                <td>${player.power || 0}</td>
            </tr>
        `;
    });
    tbody.innerHTML = html;
}

function escapeHtml(text) {
    if (!text) return "";
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

async function openLeaderboardModal() {
    console.log("openLeaderboardModal called");
    console.trace(); // 追蹤是誰呼叫的
    const modal = document.getElementById("leaderboard-modal");
    const bg = document.getElementById("leaderboard-modal-bg");
    if (modal && bg) {
        modal.style.display = "flex";
        bg.style.display = "block";

        // 顯示載入中
        const tbody = document.querySelector("#leaderboard-table tbody");
        if (tbody) tbody.innerHTML = `<tr><td colspan="4" style="text-align:center;">載入中...</td></tr>`;

        // 讀取並渲染
        const data = await fetchLeaderboard();
        renderLeaderboard(data);
    }
}

function closeLeaderboardModal() {
    const modal = document.getElementById("leaderboard-modal");
    const bg = document.getElementById("leaderboard-modal-bg");
    if (modal && bg) {
        modal.style.display = "none";
        bg.style.display = "none";
    }
}

window.openLeaderboardModal = openLeaderboardModal;
window.closeLeaderboardModal = closeLeaderboardModal;

// ===== 測試用：生成假數據 =====
async function generateFakeLeaderboardData() {
    if (!window.db) return;
    const names = ["韓立", "南宮婉", "厲飛雨", "白小純", "孟浩", "王林", "蘇銘", "方源", "蕭炎", "唐三"];

    console.log("Generating fake data...");
    if (typeof showToast === "function") showToast("正在生成 30 筆假數據...", "normal");

    const promises = [];

    // 生成 30 筆數據以測試滾動
    for (let i = 0; i < 30; i++) {
        const name = names[i % names.length] + "_" + Math.floor(Math.random() * 100);
        const realmLvl = Math.floor(Math.random() * 30) + 10; // 10~40
        const power = Math.floor(Math.pow(realmLvl, 2.5) * 10);

        let rName = "未知境界";
        if (realmLvl < 10) rName = "練氣期";
        else if (realmLvl < 20) rName = "築基期";
        else if (realmLvl < 30) rName = "金丹期";
        else rName = "元嬰期";

        const fakeData = {
            uid: "fake_" + Math.random().toString(36).substring(7),
            name: name,
            realmLevel: realmLvl,
            realmName: rName,
            power: power,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        };

        // Push promise to array
        promises.push(
            window.db.collection("leaderboard").doc(fakeData.uid).set(fakeData)
                .then(() => console.log("Added:", name))
                .catch(err => console.error("Failed to add:", name, err))
        );
    }

    try {
        await Promise.all(promises);
        if (typeof showToast === "function") showToast("✅ 已生成 10 筆假數據！", "success");

        // 生成完直接刷新
        if (typeof openLeaderboardModal === "function") {
            openLeaderboardModal();
        }
    } catch (error) {
        console.error("Error generating data:", error);
        if (typeof showToast === "function") showToast("生成失敗：" + error.message, "fail");
    }
}
window.generateFakeLeaderboardData = generateFakeLeaderboardData;
