// bookmain.js
// 每次打開功法閣此檔案都會重新執行 → 自動刷新最新勢力資料

(function () {

    // ===== 返回宗門大殿 =====
    function backToFaction() {
        if (window.parent && window.parent.document) {
            const frame = window.parent.document.getElementById("faction-frame");
            if (frame) {
                frame.src = "faction.html";
                return;
            }
        }
        window.location.href = "faction.html";
    }
    window.backToFaction = backToFaction;


    // ===== 取得最新勢力 =====
    function getCurrentFaction() {
        if (window.parent && window.parent.gameState) return window.parent.gameState.faction;
        if (window.gameState) return window.gameState.faction;
        return "none";
    }

    // ===== 讀取功法資料 =====
    const allBooks = window.BookList || [];

    document.addEventListener("DOMContentLoaded", () => {

        const menuListEl     = document.getElementById("bookMenuList");
        const cardNameEl     = document.getElementById("cardName");
        const cardTagEl      = document.getElementById("cardTag");
        const cardProgressEl = document.getElementById("cardProgress");
        const cardRarityEl   = document.getElementById("cardRarity");
        const actionBtn      = document.getElementById("actionBtn");
        const rightTitleEl   = document.getElementById("rightTitle");
        const rightContentEl = document.getElementById("rightContent");
        const rightTipEl     = document.getElementById("rightTip");

        // 每次載入必定重新取得勢力
        const currentFaction = getCurrentFaction();

        // 依勢力重新篩選
        let factionBooks = allBooks.filter(b => b.faction === currentFaction);

        // 無勢力 → 空清單
        if (currentFaction === "none") {
            factionBooks = [];
        }

        // 有勢力但沒有功法 → 顯示提示
        if (currentFaction !== "none" && factionBooks.length === 0) {
            factionBooks = [{
                id: "none_available",
                faction: "none",
                label: "暫無可研習功法",

                cardName: "未開放",
                cardTag: "待更新",
                progress: "-",
                rarity: "白品",
                button: "返回",

                rightTitle: "提示",
                rightContent: "該勢力目前尚無可研讀功法。",
                rightTip: "請稍後更新或加入其他勢力。"
            }];
        }

        // ===== 建立左側列表 =====
        function buildMenu() {
            if (!menuListEl) return;
            menuListEl.innerHTML = "";

            factionBooks.forEach((book, i) => {
                const div = document.createElement("div");
                div.className = "menu-item";
                if (i === 0) div.classList.add("active");
                div.dataset.bookId = book.id;
                div.textContent = book.label;
                menuListEl.appendChild(div);
            });
        }

        // ===== 顯示某本功法 =====
        function applyBook(book) {
            console.log("當前功法 ID:", book?.id);
            console.log("所屬勢力 ID:", book?.faction);
            console.log("所屬勢力 名稱:", window.Factions?.[book?.faction]?.name);

            if (!book) {
                cardNameEl.textContent = "無門無派散修";
                cardTagEl.textContent = "無";
                cardProgressEl.textContent = "-";
                cardRarityEl.textContent = "白品";
                actionBtn.textContent = "無可研讀";

                rightTitleEl.textContent = "提示";
                rightContentEl.textContent = "你尚未加入任何勢力。";
                rightTipEl.textContent = "請先加入宗門。";
                return;
            }

            cardNameEl.textContent = book.cardName;
            cardTagEl.textContent = book.cardTag;
            cardProgressEl.textContent = book.progress;
            cardRarityEl.textContent = book.rarity;
            actionBtn.textContent = book.button;

            rightTitleEl.textContent = book.rightTitle;
            rightContentEl.textContent = book.rightContent;
            rightTipEl.textContent = book.rightTip;
        }

        // ===== 左側點擊切換 =====
        function bindMenuEvents() {
            const items = menuListEl.querySelectorAll(".menu-item");
            items.forEach(item => {
                item.addEventListener("click", () => {
                    menuListEl.querySelector(".menu-item.active")?.classList.remove("active");
                    item.classList.add("active");

                    const book = factionBooks.find(b => b.id === item.dataset.bookId);
                    applyBook(book);
                });
            });
        }

        // ===== 初始化（每次載入都重跑） =====
        buildMenu();
        bindMenuEvents();

        if (factionBooks.length > 0) applyBook(factionBooks[0]);
        else applyBook(null);

    });
})();
