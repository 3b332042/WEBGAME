// ==========================================
//        context-menu.js (右鍵選單)
// ==========================================

window.ContextMenu = {
    init() {
        // 防止重複創建
        if (document.getElementById('custom-context-menu')) return;

        const menu = document.createElement('div');
        menu.id = 'custom-context-menu';
        menu.className = 'context-menu';
        menu.style.display = 'none';
        document.body.appendChild(menu);

        // 點擊任意處關閉選單
        document.addEventListener('click', () => this.hide());

        // 如果右鍵點擊其他地方，也會先關閉舊的（show內部會處理）
    },

    /**
     * 顯示右鍵選單
     * @param {MouseEvent} e - 滑鼠事件
     * @param {Array} items - 選項陣列 [{ label: string, action: function, danger: boolean }]
     */
    show(e, items) {
        e.preventDefault(); // 阻止瀏覽器預設選單
        const menu = document.getElementById('custom-context-menu');
        if (!menu) return;

        // 生成選項 HTML
        menu.innerHTML = '';

        if (!items || items.length === 0) {
            this.hide();
            return;
        }

        items.forEach(item => {
            const div = document.createElement('div');
            div.className = 'context-item';
            div.textContent = item.label;

            if (item.danger) {
                div.classList.add('danger');
            }

            div.onclick = (ev) => {
                ev.stopPropagation(); // 阻止冒泡，避免立即觸發 document click 關閉
                this.hide();
                if (typeof item.action === 'function') {
                    item.action();
                }
            };
            menu.appendChild(div);
        });

        // 顯示並定位
        menu.style.display = 'block';

        // 獲取選單尺寸（先顯示才能取得 offsetWidth）
        const menuWidth = menu.offsetWidth;
        const menuHeight = menu.offsetHeight;
        const winW = window.innerWidth;
        const winH = window.innerHeight;

        let x = e.clientX;
        let y = e.clientY;

        // 邊界檢查：如果超出右邊界，往左彈
        if (x + menuWidth > winW) {
            x -= menuWidth;
        }
        // 如果超出下邊界，往上彈
        if (y + menuHeight > winH) {
            y -= menuHeight;
        }

        menu.style.left = x + 'px';
        menu.style.top = y + 'px';
    },

    hide() {
        const menu = document.getElementById('custom-context-menu');
        if (menu) menu.style.display = 'none';
    }
};

// 自動初始化
document.addEventListener('DOMContentLoaded', () => {
    ContextMenu.init();
});
