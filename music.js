// =============================
//   music.js - 背景音樂管理系統
// =============================

const MusicManager = {
    // 音樂配置
    tracks: {
        main: {
            id: 'bgm-main',
            src: 'music/天火同人.mp4',
            name: '天火同人',
            scenes: ['menu', 'town', 'cultivation', 'default']
        }
        // 可以添加更多音樂
        // battle: {
        //     id: 'bgm-battle',
        //     src: 'music/battle.mp4',
        //     name: '戰鬥音樂',
        //     scenes: ['battle']
        // }
    },

    // 當前播放的音樂
    currentTrack: null,
    currentAudio: null,

    // 音量設置
    volume: 0.3,
    muted: false,

    // 初始化
    init() {
        // 創建音頻元素
        this.createAudioElements();

        // 從本地存儲讀取音量設置
        const savedVolume = localStorage.getItem('bgm_volume');
        const savedMuted = localStorage.getItem('bgm_muted');

        if (savedVolume !== null) {
            this.volume = parseFloat(savedVolume);
        }
        if (savedMuted !== null) {
            this.muted = savedMuted === 'true';
        }

        // 初始化視窗可見性監聽
        this.initVisibilityListener();

        console.log('音樂管理器已初始化');
    },

    // 創建音頻元素
    createAudioElements() {
        Object.values(this.tracks).forEach(track => {
            const audio = document.getElementById(track.id);
            if (audio) {
                audio.volume = this.volume;
                audio.loop = true; // 循環播放
            }
        });
    },

    // 播放指定音樂
    play(trackKey) {
        const track = this.tracks[trackKey];
        if (!track) {
            console.warn(`音樂 ${trackKey} 不存在`);
            return;
        }

        // 如果已經在播放相同的音樂，不做任何操作
        if (this.currentTrack === trackKey && this.currentAudio && !this.currentAudio.paused) {
            return;
        }

        // 停止當前音樂
        this.stop();

        // 播放新音樂
        const audio = document.getElementById(track.id);
        if (audio) {
            this.currentAudio = audio;
            this.currentTrack = trackKey;

            audio.volume = this.muted ? 0 : this.volume;

            audio.play().catch(err => {
                console.warn('音樂播放失敗:', err);
                // 某些瀏覽器需要用戶互動才能播放音頻
                // 可以在用戶第一次點擊時再嘗試播放
            });

            console.log(`正在播放: ${track.name}`);
        }
    },

    // 停止當前音樂
    stop() {
        if (this.currentAudio) {
            this.currentAudio.pause();
            this.currentAudio.currentTime = 0;
        }
        this.currentTrack = null;
        this.currentAudio = null;
    },

    // 暫停
    pause() {
        if (this.currentAudio) {
            this.currentAudio.pause();
        }
    },

    // 繼續播放
    resume() {
        if (this.currentAudio && this.currentAudio.paused) {
            this.currentAudio.play().catch(err => {
                console.warn('音樂恢復播放失敗:', err);
            });
        }
    },

    // 設置音量 (0.0 - 1.0)
    setVolume(vol) {
        this.volume = Math.max(0, Math.min(1, vol));

        if (this.currentAudio) {
            this.currentAudio.volume = this.muted ? 0 : this.volume;
        }

        // 保存到本地存儲
        localStorage.setItem('bgm_volume', this.volume.toString());

        console.log(`音量設置為: ${Math.round(this.volume * 100)}%`);
    },

    // 靜音/取消靜音
    toggleMute() {
        this.muted = !this.muted;

        if (this.currentAudio) {
            this.currentAudio.volume = this.muted ? 0 : this.volume;
        }

        // 保存到本地存儲
        localStorage.setItem('bgm_muted', this.muted.toString());

        console.log(this.muted ? '音樂已靜音' : '音樂已取消靜音');
        return this.muted;
    },

    // 根據場景播放音樂
    playForScene(scene) {
        // 查找適合該場景的音樂
        for (const [key, track] of Object.entries(this.tracks)) {
            if (track.scenes.includes(scene)) {
                this.play(key);
                return;
            }
        }

        // 如果沒有找到，播放默認音樂
        this.play('main');
    },

    // 離開視窗時的音量（用於恢復）
    volumeBeforeHidden: null,

    // 初始化視窗可見性監聽
    initVisibilityListener() {
        // 使用 Page Visibility API
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                // 視窗隱藏時靜音
                if (this.currentAudio && !this.currentAudio.paused) {
                    this.volumeBeforeHidden = this.currentAudio.volume;
                    this.currentAudio.volume = 0;
                    console.log('視窗已隱藏，音樂已靜音');
                }
            } else {
                // 視窗顯示時恢復音量
                if (this.currentAudio && this.volumeBeforeHidden !== null) {
                    this.currentAudio.volume = this.muted ? 0 : this.volumeBeforeHidden;
                    this.volumeBeforeHidden = null;
                    console.log('視窗已顯示，音樂已恢復');
                }
            }
        });

        // 備用方案：使用 blur/focus 事件（適用於舊瀏覽器）
        window.addEventListener('blur', () => {
            if (this.currentAudio && !this.currentAudio.paused && this.volumeBeforeHidden === null) {
                this.volumeBeforeHidden = this.currentAudio.volume;
                this.currentAudio.volume = 0;
            }
        });

        window.addEventListener('focus', () => {
            if (this.currentAudio && this.volumeBeforeHidden !== null) {
                this.currentAudio.volume = this.muted ? 0 : this.volumeBeforeHidden;
                this.volumeBeforeHidden = null;
            }
        });

        console.log('視窗可見性監聽已啟動');
    }
};

// 導出到全局
window.MusicManager = MusicManager;

// 頁面加載完成後初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        MusicManager.init();
    });
} else {
    MusicManager.init();
}
