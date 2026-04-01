// js/musicManager.js
// ⭐ 音樂淡入淡出管理系統
// musicState: 'menu' | 'city' | 'safezone'
// 每次呼叫 startMusicCrossfade(target) 就觸發:
//   1. 當前音樂在 FADE_DURATION 秒內淡出
//   2. 目標音樂同時淡入

const MUSIC_FADE_DURATION = 2.0; // 秒

// 各軌道對應
function getMusicTrack(name) {
    if (name === 'menu')     return ASSETS.bgmMenu;
    if (name === 'city')     return ASSETS.bgmCity;
    if (name === 'safezone') return ASSETS.bgmSafeZone;
    return null;
}

// 正在進行的 fade 列表: [{ track, targetVol, speed }]
let _musicFades = [];

/**
 * 觸發音樂切換：
 *   - 把所有正在播放的其他軌道淡出到 0
 *   - 把目標軌道淡入到 1
 * @param {string} target  'menu' | 'city' | 'safezone'
 */
function startMusicCrossfade(target) {
    if (GAME_CONFIG.musicVolume <= 0) return;
    if (gameState.musicState === target) return; // 已經是目標，不重複觸發

    gameState.musicState = target;

    const allTracks = ['menu', 'city', 'safezone'];
    const speed = 1 / MUSIC_FADE_DURATION;

    // 清除舊的 fade 任務
    _musicFades = [];

    for (const name of allTracks) {
        const track = getMusicTrack(name);
        if (!track) continue;

        if (name === target) {
            // 目標軌道：如果已暫停則重新播放，然後淡入
            if (track.paused) {
                track.currentTime = 0;
                track.volume = 0;
                track.play().catch(() => {});
            }
            _musicFades.push({ track, targetVol: GAME_CONFIG.musicVolume, speed });
        } else {
            // 其他軌道：淡出後暫停
            if (!track.paused) {
                _musicFades.push({ track, targetVol: 0.0, speed, pauseWhenDone: true });
            }
        }
    }
}

/**
 * 每幀呼叫，更新所有音量
 * @param {number} dt  delta time (seconds)
 */
function updateMusicCrossfade(dt) {
    // 主選單音樂：如果 musicState === 'menu' 且被暫停，重新播放
    if (GAME_CONFIG.musicVolume > 0 && gameState.musicState === 'menu' && ASSETS.bgmMenu.paused && _musicFades.length === 0) {
        ASSETS.bgmMenu.volume = GAME_CONFIG.musicVolume;
        ASSETS.bgmMenu.play().catch(() => {});
    }

    // Sync volume dynamically when no fades are active
    if (GAME_CONFIG.musicVolume > 0 && _musicFades.length === 0) {
        const track = getMusicTrack(gameState.musicState);
        if (track && track.volume !== GAME_CONFIG.musicVolume) {
            track.volume = GAME_CONFIG.musicVolume;
        }
        
        // ⭐ 城市音樂循環邏輯 (1:11 長，但在 1:07 循環)
        if (gameState.musicState === 'city' && track) {
            if (track.currentTime >= 67) {
                track.currentTime = 0;
            }
        }
    }

    for (let i = _musicFades.length - 1; i >= 0; i--) {
        const f = _musicFades[i];

        if (GAME_CONFIG.musicVolume <= 0) {
            // 音樂被關掉 → 全部靜音暫停
            f.track.volume = 0;
            if (!f.track.paused) f.track.pause();
            _musicFades.splice(i, 1);
            continue;
        }

        const diff = f.targetVol - f.track.volume;
        const step = f.speed * dt;

        if (Math.abs(diff) <= step) {
            // 到達目標音量
            f.track.volume = f.targetVol;
            if (f.pauseWhenDone && !f.track.paused) {
                f.track.pause();
            }
            _musicFades.splice(i, 1);
        } else {
            f.track.volume += Math.sign(diff) * step;
        }
    }
}

/**
 * 設定音效開關時呼叫：音樂啟用/停用
 */
function handleMusicToggle() {
    if (!GAME_CONFIG.musicEnabled) {
        // 全部暫停
        ASSETS.bgmMenu.pause();
        ASSETS.bgmCity.pause();
        ASSETS.bgmSafeZone.pause();
        _musicFades = [];
    } else {
        // 重新依目前 musicState 播放正確軌道
        _musicFades = [];
        const track = getMusicTrack(gameState.musicState);
        if (track) {
            if (track.paused) {
                track.currentTime = 0;
                track.volume = 0;
            }
            _musicFades.push({ track, targetVol: GAME_CONFIG.musicVolume, speed: 1 / MUSIC_FADE_DURATION });
            track.play().catch(() => {});
        }
    }
}
