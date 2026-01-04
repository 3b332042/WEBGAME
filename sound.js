// =============================
//   sound.js - 音效管理系統
// =============================

const SoundManager = {
    // 音效配置
    sounds: {
        inventoryOpen: {
            id: 'sfx-inventory-open',
            src: 'music/打開背包.MP3',
            name: '打開背包'
        },
        equipItem: {
            id: 'sfx-equip-item',
            src: 'music/裝備裝備.MP3',
            name: '裝備物品'
        },
        equipHelmet: {
            id: 'sfx-equip-helmet',
            src: 'music/裝備頭盔.MP3',
            name: '裝備頭盔'
        }
        // 可以添加更多音效
        // buttonClick: {
        //     id: 'sfx-button-click',
        //     src: 'sounds/click.mp3',
        //     name: '按鈕點擊'
        // }
    },

    // 音效音量
    volume: 0.8,
    muted: false,

    // 初始化
    init() {
        // 從本地存儲讀取音量設置
        const savedVolume = localStorage.getItem('sfx_volume');
        const savedMuted = localStorage.getItem('sfx_muted');

        if (savedVolume !== null) {
            this.volume = parseFloat(savedVolume);
        }
        if (savedMuted !== null) {
            this.muted = savedMuted === 'true';
        }

        // 創建音效元素
        this.createSoundElements();

        console.log('音效管理器已初始化');
    },

    // 創建音效元素
    createSoundElements() {
        Object.values(this.sounds).forEach(sound => {
            const audio = document.getElementById(sound.id);
            if (audio) {
                audio.volume = this.volume;
            }
        });
    },

    // 播放音效
    play(soundKey) {
        if (this.muted) return;

        const sound = this.sounds[soundKey];
        if (!sound) {
            console.warn(`音效 ${soundKey} 不存在`);
            return;
        }

        const audio = document.getElementById(sound.id);
        if (audio) {
            // 重置播放位置（允許快速連續播放）
            audio.currentTime = 0;
            audio.volume = this.volume;

            audio.play().catch(err => {
                console.warn('音效播放失敗:', err);
            });
        }
    },

    // 設置音量 (0.0 - 1.0)
    setVolume(vol) {
        this.volume = Math.max(0, Math.min(1, vol));

        // 更新所有音效元素的音量
        Object.values(this.sounds).forEach(sound => {
            const audio = document.getElementById(sound.id);
            if (audio) {
                audio.volume = this.volume;
            }
        });

        // 保存到本地存儲
        localStorage.setItem('sfx_volume', this.volume.toString());

        console.log(`音效音量設置為: ${Math.round(this.volume * 100)}%`);
    },

    // 靜音/取消靜音
    toggleMute() {
        this.muted = !this.muted;

        // 保存到本地存儲
        localStorage.setItem('sfx_muted', this.muted.toString());

        console.log(this.muted ? '音效已靜音' : '音效已取消靜音');
        return this.muted;
    }
};

// 導出到全局
window.SoundManager = SoundManager;

// 頁面加載完成後初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        SoundManager.init();
    });
} else {
    SoundManager.init();
}
