// js/player.js

function playSound(asset, volScale = 1.0) {
    if (!asset) return;
    let sfxv = GAME_CONFIG.sfxVolume !== undefined ? GAME_CONFIG.sfxVolume : 1.0;
    if (sfxv <= 0) return;

    try {
        let snd = asset.cloneNode();
        snd.volume = Math.max(0, Math.min(1, sfxv * volScale));
        if (snd.volume > 0) {
            snd.play().catch(e => console.warn("SFX Play Error:", e));
        }
    } catch (e) {
        console.warn("SFX Clone Error:", e);
    }
}

// 取得圖鑑資料 (⭐ 修正 undefined 陷阱，強制加上 !! 轉型為嚴格的布林值)
function getEncyclopediaItems(category) {
    let diff = GAME_CONFIG.difficulty || 'normal';
    let mults = GAME_CONFIG.difficultyMultipliers[diff];

    if (category === 'unit') {
        return [
            // 弓箭手預設可製造，直接解鎖
            { id: 'archer', name: '弓箭手', type: 'unit', drawType: 1, hp: GAME_CONFIG.archerHp, dmg: GAME_CONFIG.archerDamage, aspd: GAME_CONFIG.archerCooldown, cost: GAME_CONFIG.archerCost, color: GAME_CONFIG.archerColor, unlocked: true },
            { id: 'pistol', name: '槍手', type: 'unit', drawType: 10, hp: GAME_CONFIG.pistolHp, dmg: GAME_CONFIG.pistolDamage, aspd: GAME_CONFIG.pistolCooldown, cost: GAME_CONFIG.pistolCost, color: GAME_CONFIG.pistolColor, unlocked: !!player.unlockedPistol },
            { id: 'cannon', name: '砲兵', type: 'unit', drawType: 2, hp: GAME_CONFIG.cannonHp, dmg: GAME_CONFIG.cannonDamage, aspd: GAME_CONFIG.cannonCooldown, cost: GAME_CONFIG.cannonCost, color: GAME_CONFIG.cannonColor, unlocked: !!player.unlockedCannon },
            { id: 'swordsman', name: '劍士', type: 'unit', drawType: 3, hp: GAME_CONFIG.swordsmanHp, dmg: GAME_CONFIG.swordsmanDamage, aspd: GAME_CONFIG.swordsmanCooldown, cost: GAME_CONFIG.swordsmanCost, color: GAME_CONFIG.swordsmanColor, unlocked: !!player.unlockedSwordsman }
        ];
    } else if (category === 'building') {
        return [
            { id: 'square', name: '方形木塊', type: 'building', drawType: 1, hp: GAME_CONFIG.buildingHp, cost: GAME_CONFIG.buildingCost, color: '#8B4513', unlocked: true },
            { id: 'rect', name: '長方形木塊', type: 'building', drawType: 2, hp: GAME_CONFIG.buildingHp, cost: GAME_CONFIG.buildingCost, color: '#8B4513', unlocked: !!player.unlockedRect },
            { id: 'tri', name: '三角形木塊', type: 'building', drawType: 3, hp: GAME_CONFIG.buildingHp, cost: GAME_CONFIG.buildingCost, color: '#8B4513', unlocked: !!player.unlockedTri },
            { id: 'rtri', name: '直角木塊', type: 'building', drawType: 4, hp: GAME_CONFIG.buildingHp, cost: GAME_CONFIG.buildingCost, color: '#8B4513', unlocked: !!player.unlockedRTri },

            { id: 'brick_square', name: '磚塊方塊', type: 'building', drawType: 1, hp: GAME_CONFIG.brickBuildingHp, cost: GAME_CONFIG.brickBuildingCost, color: '#A52A2A', unlocked: !!player.unlockedBrickSquare },
            { id: 'brick_rect', name: '磚塊長方', type: 'building', drawType: 2, hp: GAME_CONFIG.brickBuildingHp, cost: GAME_CONFIG.brickBuildingCost, color: '#A52A2A', unlocked: !!player.unlockedBrickRect },
            { id: 'brick_tri', name: '磚塊三角', type: 'building', drawType: 3, hp: GAME_CONFIG.brickBuildingHp, cost: GAME_CONFIG.brickBuildingCost, color: '#A52A2A', unlocked: !!player.unlockedBrickTri },
            { id: 'brick_rtri', name: '磚塊斜三', type: 'building', drawType: 4, hp: GAME_CONFIG.brickBuildingHp, cost: GAME_CONFIG.brickBuildingCost, color: '#A52A2A', unlocked: !!player.unlockedBrickRTri },

            { id: 'steel_square', name: '鋼鐵方塊', type: 'building', drawType: 1, hp: GAME_CONFIG.steelBuildingHp, cost: GAME_CONFIG.steelBuildingCost, color: '#708090', unlocked: !!player.unlockedSteelSquare },
            { id: 'steel_rect', name: '鋼鐵長方', type: 'building', drawType: 2, hp: GAME_CONFIG.steelBuildingHp, cost: GAME_CONFIG.steelBuildingCost, color: '#708090', unlocked: !!player.unlockedSteelRect },
            { id: 'steel_tri', name: '鋼鐵三角', type: 'building', drawType: 3, hp: GAME_CONFIG.steelBuildingHp, cost: GAME_CONFIG.steelBuildingCost, color: '#708090', unlocked: !!player.unlockedSteelTri },
            { id: 'steel_rtri', name: '鋼鐵斜三', type: 'building', drawType: 4, hp: GAME_CONFIG.steelBuildingHp, cost: GAME_CONFIG.steelBuildingCost, color: '#708090', unlocked: !!player.unlockedSteelRTri }
        ];
    } else if (category === 'enemy') {
        return [
            { id: 'zombie', name: '普通殭屍', type: 'enemy', drawType: 'normal', hp: Math.floor(GAME_CONFIG.zombieHp * mults.hp), dmg: Math.floor(GAME_CONFIG.zombieDamage * mults.dmg), reward: GAME_CONFIG.coinReward, speed: `${GAME_CONFIG.zombieSpeedMin}~${GAME_CONFIG.zombieSpeedMax}`, jump: '200~450', color: GAME_CONFIG.zombieColor, unlocked: !!player.encountered.zombie },
            { id: 'fastZombie', name: '快速殭屍', type: 'enemy', drawType: 'fast', hp: Math.floor(GAME_CONFIG.fastZombieHp * mults.hp), dmg: Math.floor(GAME_CONFIG.fastZombieDamage * mults.dmg), reward: GAME_CONFIG.fastCoinReward, speed: `${GAME_CONFIG.fastZombieSpeedMin}~${GAME_CONFIG.fastZombieSpeedMax}`, jump: `${GAME_CONFIG.fastZombieJumpMin}~${GAME_CONFIG.fastZombieJumpMax}`, color: GAME_CONFIG.fastZombieColor, unlocked: !!player.encountered.fastZombie },
            { id: 'shieldZombie', name: '盾牌殭屍', type: 'enemy', drawType: 'shield', hp: Math.floor(GAME_CONFIG.shieldZombieHp * mults.hp), shieldHp: Math.floor(GAME_CONFIG.shieldHp * mults.hp), dmg: Math.floor(GAME_CONFIG.shieldZombieDamage * mults.dmg), reward: GAME_CONFIG.shieldCoinReward, speed: `${GAME_CONFIG.shieldZombieSpeedMin}~${GAME_CONFIG.shieldZombieSpeedMax}`, jump: `${GAME_CONFIG.shieldZombieJumpMin}~${GAME_CONFIG.shieldZombieJumpMax}`, color: GAME_CONFIG.shieldZombieColor, unlocked: !!player.encountered.shieldZombie },
            { id: 'venomZombie', name: '毒液殭屍', type: 'enemy', drawType: 'venom', hp: Math.floor(GAME_CONFIG.venomZombieHp * mults.hp), dmg: Math.floor(GAME_CONFIG.venomZombieDamage * mults.dmg), reward: GAME_CONFIG.venomCoinReward, range: GAME_CONFIG.venomZombieRange, aspd: GAME_CONFIG.venomZombieCooldown, speed: `${GAME_CONFIG.venomZombieSpeedMin}~${GAME_CONFIG.venomZombieSpeedMax}`, jump: `${GAME_CONFIG.venomZombieJumpMin}~${GAME_CONFIG.venomZombieJumpMax}`, color: GAME_CONFIG.venomZombieColor, unlocked: !!player.encountered.venomZombie },
            { id: 'balloonZombie', name: '氣球殭屍', type: 'enemy', drawType: 'balloon', hp: Math.floor(GAME_CONFIG.balloonZombieHp * mults.hp), dmg: Math.floor(GAME_CONFIG.balloonZombieDamage * mults.dmg), reward: GAME_CONFIG.balloonCoinReward, speed: `${GAME_CONFIG.balloonZombieSpeedMin}~${GAME_CONFIG.balloonZombieSpeedMax}`, color: GAME_CONFIG.balloonZombieColor, unlocked: !!player.encountered.balloonZombie },
            { id: 'bladeZombie', name: '持刀殭屍', type: 'enemy', drawType: 'blade', hp: Math.floor(GAME_CONFIG.bladeZombieHp * mults.hp), dmg: Math.floor(GAME_CONFIG.bladeZombieDamage * mults.dmg), reward: GAME_CONFIG.bladeCoinReward, speed: `${GAME_CONFIG.bladeZombieSpeedMin}~${GAME_CONFIG.bladeZombieSpeedMax}`, jump: `${GAME_CONFIG.bladeJumpMin}~${GAME_CONFIG.bladeJumpMax}`, aspd: GAME_CONFIG.bladeZombieCooldown, color: GAME_CONFIG.bladeZombieColor, unlocked: !!player.encountered.bladeZombie },
            { id: 'armorZombie', name: '鐵甲殭屍', type: 'enemy', drawType: 'armor', hp: Math.floor(GAME_CONFIG.armorZombieHp * mults.hp), armorHp: Math.floor(GAME_CONFIG.armorHp * mults.hp), dmg: Math.floor(GAME_CONFIG.armorZombieDamage * mults.dmg), reward: GAME_CONFIG.armorCoinReward, speed: `${GAME_CONFIG.armorZombieSpeedMin}~${GAME_CONFIG.armorZombieSpeedMax}`, jump: `${GAME_CONFIG.armorJumpMin}~${GAME_CONFIG.armorJumpMax}`, color: GAME_CONFIG.armorZombieColor, unlocked: !!player.encountered.armorZombie },
            { id: 'bombZombie', name: '炸彈殭屍', type: 'enemy', drawType: 'bomb', hp: Math.floor(GAME_CONFIG.bombZombieHp * mults.hp), dmg: Math.floor(GAME_CONFIG.bombZombieDamage * mults.dmg), reward: GAME_CONFIG.bombCoinReward, explodeRadius: GAME_CONFIG.bombZombieExplodeRadius, speed: `${GAME_CONFIG.bombZombieSpeedMin}~${GAME_CONFIG.bombZombieSpeedMax}`, jump: `${GAME_CONFIG.bombZombieJumpMin}~${GAME_CONFIG.bombZombieJumpMax}`, color: GAME_CONFIG.bombZombieColor, unlocked: !!player.encountered.bombZombie },
            { id: 'planeZombie', name: '小飛機殭屍', type: 'enemy', drawType: 'plane', hp: Math.floor(GAME_CONFIG.planeZombieHp * mults.hp), planeHp: Math.floor(GAME_CONFIG.planeHp * mults.hp), dmg: Math.floor(GAME_CONFIG.planeZombieDamage * mults.dmg), reward: GAME_CONFIG.planeCoinReward, speed: `${GAME_CONFIG.planeZombieSpeedMin}~${GAME_CONFIG.planeZombieSpeedMax}`, color: GAME_CONFIG.planeZombieColor, unlocked: !!player.encountered.planeZombie },
            { id: 'splitZombie', name: '分裂殭屍', type: 'enemy', drawType: 'split', hp: Math.floor(GAME_CONFIG.splitZombieHp * mults.hp), dmg: Math.floor(GAME_CONFIG.splitZombieDamage * mults.dmg), reward: GAME_CONFIG.splitZombieReward, splitCount: GAME_CONFIG.splitZombieCount, speed: `${GAME_CONFIG.splitZombieSpeedMin}~${GAME_CONFIG.splitZombieSpeedMax}`, jump: `${GAME_CONFIG.splitZombieJumpMin}~${GAME_CONFIG.splitZombieJumpMax}`, color: GAME_CONFIG.splitZombieColor, unlocked: !!player.encountered.splitZombie },
            { id: 'miniZombie', name: '小殭屍', type: 'enemy', drawType: 'mini', hp: Math.floor(GAME_CONFIG.miniZombieHp * mults.hp), dmg: Math.floor(GAME_CONFIG.miniZombieDamage * mults.dmg), reward: GAME_CONFIG.miniZombieReward, speed: `${GAME_CONFIG.miniZombieSpeedMin}~${GAME_CONFIG.miniZombieSpeedMax}`, jump: `${GAME_CONFIG.miniZombieJumpMin}~${GAME_CONFIG.miniZombieJumpMax}`, color: GAME_CONFIG.splitZombieColor, unlocked: !!player.encountered.splitZombie }
        ];
    }
    return [];
}

// 繪製圖鑑中的小圖示
function drawEncyclopediaIcon(item, ctxTarget, isUnlocked = true) {
    ctxTarget.save();

    // ⭐ 完美純黑剪影邏輯：若未解鎖，強制使用純黑繪製基礎幾何圖形，無視所有高光與細節
    if (!isUnlocked) {
        ctxTarget.fillStyle = '#000000';
        ctxTarget.strokeStyle = '#000000';
        ctxTarget.lineWidth = 2;
        ctxTarget.beginPath();

        if (item.type === 'unit') {
            if (item.drawType === 1 || item.drawType === 3 || item.drawType === 10) {
                ctxTarget.arc(0, 0, 10, 0, Math.PI * 2);
            } else if (item.drawType === 2) {
                ctxTarget.ellipse(0, 3, 11 * 1.2, 11 * 0.8, 0, 0, Math.PI * 2);
            }
        } else if (item.type === 'building') {
            if (item.drawType === 1) ctxTarget.rect(-10, -10, 20, 20);
            if (item.drawType === 2) ctxTarget.rect(-15, -5, 30, 10);
            if (item.drawType === 3) { ctxTarget.moveTo(0, -10); ctxTarget.lineTo(10, 10); ctxTarget.lineTo(-10, 10); ctxTarget.closePath(); }
            if (item.drawType === 4) { ctxTarget.moveTo(-10, -10); ctxTarget.lineTo(10, 10); ctxTarget.lineTo(-10, 10); ctxTarget.closePath(); }
        } else if (item.type === 'enemy') {
            ctxTarget.arc(0, 0, 16, 0, Math.PI * 2);
            if (item.drawType === 'shield') {
                ctxTarget.arc(-12, 0, 12, 0, Math.PI * 2);
            } else if (item.drawType === 'venom') {
                ctxTarget.arc(0, 0, 16, 0, Math.PI * 2);
            } else if (item.drawType === 'balloon') {
                ctxTarget.arc(0, 0, 16, 0, Math.PI * 2);
                ctxTarget.moveTo(0, -16); ctxTarget.lineTo(0, -40);
                ctxTarget.ellipse(0, -60, 15, 20, 0, 0, Math.PI * 2);
            } else if (item.drawType === 'blade') {
                ctxTarget.arc(0, 0, 16, 0, Math.PI * 2);
                ctxTarget.moveTo(-10, 0); ctxTarget.lineTo(-30, -20);
            } else if (item.drawType === 'armor') {
                ctxTarget.arc(0, 0, 18, 0, Math.PI * 2);
            } else if (item.drawType === 'bomb') {
                ctxTarget.arc(0, 0, 16, 0, Math.PI * 2);
                ctxTarget.arc(8, -12, 6, 0, Math.PI * 2);
            } else if (item.drawType === 'plane') {
                ctxTarget.ellipse(0, 0, 25, 10, 0, 0, Math.PI * 2);
            } else if (item.drawType === 'split') {
                ctxTarget.arc(0, 0, 16, 0, Math.PI * 2);
                ctxTarget.moveTo(-8, -8); ctxTarget.lineTo(0, 0); ctxTarget.lineTo(-4, 8);
                ctxTarget.moveTo(8, -8); ctxTarget.lineTo(2, 0); ctxTarget.lineTo(6, 8);
                ctxTarget.moveTo(0, -10); ctxTarget.lineTo(-2, 0); ctxTarget.lineTo(0, 10);
            } else if (item.drawType === 'mini') {
                ctxTarget.arc(0, 0, 11, 0, Math.PI * 2); // 縮小影子
            }
        }

        ctxTarget.fill();
        if (item.type === 'building') ctxTarget.stroke();
        ctxTarget.restore();
        return; // 畫完純黑剪影就提早結束，不畫細節
    }

    // 正常解鎖狀態繪製
    if (item.type === 'unit') {
        if (item.drawType === 1) {
            drawCircle(0, 0, 10, item.color);
            ctxTarget.strokeStyle = '#fff'; ctxTarget.lineWidth = 2; ctxTarget.beginPath(); ctxTarget.moveTo(0, -1); ctxTarget.lineTo(6, -6); ctxTarget.stroke();
        } else if (item.drawType === 2) {
            drawCircle(0, 3, 11, item.color, 1.2, 0.8);
            ctxTarget.strokeStyle = '#2c3e50'; ctxTarget.lineWidth = 3; ctxTarget.beginPath(); ctxTarget.moveTo(0, 0); ctxTarget.lineTo(10, -6); ctxTarget.stroke();
        } else if (item.drawType === 3) {
            drawCircle(0, 0, 10, item.color);
            ctxTarget.strokeStyle = '#ecf0f1'; ctxTarget.lineWidth = 2; ctxTarget.beginPath(); ctxTarget.moveTo(-3, 3); ctxTarget.lineTo(6, -6); ctxTarget.stroke();
        } else if (item.drawType === 10) {
            drawCircle(0, 0, 10, item.color);
            ctxTarget.fillStyle = '#7f8c8d'; ctxTarget.fillRect(2, -2, 8, 3); // 槍管
        }
    } else if (item.type === 'building') {
        const fill = item.color || '#8B4513';
        ctxTarget.fillStyle = fill;
        ctxTarget.strokeStyle = (fill === '#8B4513') ? '#5c2a08' : '#333';
        ctxTarget.lineWidth = 2; ctxTarget.beginPath();
        if (item.drawType === 1) ctxTarget.rect(-10, -10, 20, 20);
        if (item.drawType === 2) ctxTarget.rect(-15, -5, 30, 10);
        if (item.drawType === 3) { ctxTarget.moveTo(0, -10); ctxTarget.lineTo(10, 10); ctxTarget.lineTo(-10, 10); ctxTarget.closePath(); }
        if (item.drawType === 4) { ctxTarget.moveTo(-10, -10); ctxTarget.lineTo(10, 10); ctxTarget.lineTo(-10, 10); ctxTarget.closePath(); }
        ctxTarget.fill(); ctxTarget.stroke();
    } else if (item.type === 'enemy') {
        let radius = (item.drawType === 'mini') ? 11 : 16;
        let drawY = (item.drawType === 'plane') ? -5 : 0;

        drawCircle(0, drawY, radius, item.color);
        ctxTarget.fillStyle = '#000';
        let eyeScale = (item.drawType === 'mini') ? 0.6 : 1.0;
        ctxTarget.fillRect(-8 * eyeScale, drawY - 4 * eyeScale, 3 * eyeScale, 3 * eyeScale);
        ctxTarget.fillRect(-2 * eyeScale, drawY - 4 * eyeScale, 3 * eyeScale, 3 * eyeScale);

        if (item.drawType === 'shield') {
            ctxTarget.save();
            ctxTarget.translate(-12, 0);
            ctxTarget.fillStyle = '#5d4037'; ctxTarget.strokeStyle = '#3e2723'; ctxTarget.lineWidth = 2;
            ctxTarget.beginPath(); ctxTarget.arc(0, 0, 12, 0, Math.PI * 2); ctxTarget.fill(); ctxTarget.stroke();
            ctxTarget.restore();
        } else if (item.drawType === 'venom') {
            ctxTarget.fillStyle = 'rgba(46, 204, 113, 0.6)';
            ctxTarget.beginPath(); ctxTarget.arc(4, -4, 8, 0, Math.PI * 2); ctxTarget.fill();
        } else if (item.drawType === 'balloon') {
            ctxTarget.strokeStyle = '#fff'; ctxTarget.lineWidth = 1;
            ctxTarget.beginPath(); ctxTarget.moveTo(0, -10); ctxTarget.lineTo(0, -20); ctxTarget.stroke();
            ctxTarget.fillStyle = '#e74c3c'; ctxTarget.beginPath();
            ctxTarget.ellipse(0, -30, 10, 14, 0, 0, Math.PI * 2); ctxTarget.fill();
        } else if (item.drawType === 'blade') {
            ctxTarget.strokeStyle = '#95a5a6'; ctxTarget.lineWidth = 3;
            ctxTarget.beginPath(); ctxTarget.moveTo(-8, 0); ctxTarget.lineTo(-20, -15); ctxTarget.stroke();
            ctxTarget.strokeStyle = '#7f8c8d'; ctxTarget.lineWidth = 1;
            ctxTarget.beginPath(); ctxTarget.moveTo(-20, -15); ctxTarget.lineTo(-25, -20); ctxTarget.stroke();
        } else if (item.drawType === 'armor') {
            ctxTarget.strokeStyle = '#95a5a6'; ctxTarget.lineWidth = 3;
            ctxTarget.beginPath(); ctxTarget.arc(0, 0, 14, 0, Math.PI * 2); ctxTarget.stroke();
            ctxTarget.fillStyle = 'rgba(149, 165, 166, 0.4)'; ctxTarget.fill();
        } else if (item.drawType === 'bomb') {
            ctxTarget.fillStyle = '#000'; ctxTarget.beginPath(); ctxTarget.arc(8, -12, 6, 0, Math.PI * 2); ctxTarget.fill();
            ctxTarget.strokeStyle = '#f1c40f'; ctxTarget.lineWidth = 2; ctxTarget.beginPath(); ctxTarget.moveTo(8, -18); ctxTarget.lineTo(12, -24); ctxTarget.stroke();
        } else if (item.drawType === 'plane') {
            // 小飛機 (覆蓋在上方)
            ctxTarget.fillStyle = GAME_CONFIG.planeColor;
            ctxTarget.beginPath();
            ctxTarget.ellipse(0, 12, 30, 15, 0, 0, Math.PI * 2);
            ctxTarget.fill();
            ctxTarget.fillRect(-10, -2, 20, 30);
            ctxTarget.strokeStyle = '#fff'; ctxTarget.lineWidth = 2;
            ctxTarget.beginPath();
            let propOffset = Math.sin(gameState.timer * 25) * 12;
            ctxTarget.moveTo(-30, 12 - propOffset);
            ctxTarget.lineTo(-30, 12 + propOffset);
            ctxTarget.stroke();
        } else if (item.drawType === 'split') {
            ctxTarget.strokeStyle = 'rgba(0,0,0,0.5)'; ctxTarget.lineWidth = 1.5;
            ctxTarget.beginPath();
            ctxTarget.moveTo(-8, -8); ctxTarget.lineTo(-4, 0); ctxTarget.lineTo(-6, 8);
            ctxTarget.moveTo(8, -8); ctxTarget.lineTo(4, 0); ctxTarget.lineTo(6, 8);
            ctxTarget.moveTo(0, -10); ctxTarget.lineTo(2, 0); ctxTarget.lineTo(-1, 10);
            ctxTarget.stroke();
        }
    }

    ctxTarget.restore();
}


canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouseScreenX = (e.clientX - rect.left) * (canvas.width / rect.width);
    mouseScreenY = (e.clientY - rect.top) * (canvas.height / rect.height);

    if (gameState.settingsOpen && e.buttons === 1) {
        let menuW = 300; let menuH = 440; // 調整為 440
        let menuX = canvas.width / 2 - menuW / 2;
        let menuY = canvas.height / 2 - menuH / 2;
        // 音樂音量拉條 (中心 y=100, 高度 40)
        if (mouseScreenY >= menuY + 80 && mouseScreenY <= menuY + 120) {
            let barX = menuX + 50; let barW = 200;
            let vol = (mouseScreenX - barX) / barW;
            if (vol < 0) vol = 0; if (vol > 1) vol = 1;
            GAME_CONFIG.musicVolume = vol;
            const track = getMusicTrack(gameState.musicState);
            if (track) track.volume = GAME_CONFIG.musicVolume;
        }
        // 音效音量拉條 (中心 y=160, 高度 40)
        else if (mouseScreenY >= menuY + 140 && mouseScreenY <= menuY + 180) {
            let barX = menuX + 50; let barW = 200;
            let vol = (mouseScreenX - barX) / barW;
            if (vol < 0) vol = 0; if (vol > 1) vol = 1;
            GAME_CONFIG.sfxVolume = vol;
        }
    }
});

canvas.addEventListener('mouseup', (e) => {
    if (gameState.draggedItem) {
        let rect = canvas.getBoundingClientRect();
        let clickScreenX = (e.clientX - rect.left) * (canvas.width / rect.width);
        let clickScreenY = (e.clientY - rect.top) * (canvas.height / rect.height);

        let panelH = (canvas.height / 2) * (gameState.backpackAnimVal || 0);
        const uiY = canvas.height - panelH - 70;

        let targetSlot = -1;

        if (gameState.backpackAnimVal > 0.01) {
            // === 1. 檢查底部快捷列 (5格 × 目前顯示列) ===
            if (clickScreenY > uiY && clickScreenY < uiY + 50) {
                let offsetIndex = player.loadoutRow * 5;
                for (let i = 0; i < 5; i++) {
                    let boxX = 20 + i * 70;
                    if (clickScreenX > boxX && clickScreenX < boxX + 60) {
                        targetSlot = offsetIndex + i;
                        break;
                    }
                }
            }

            // === 2. 檢查大背包面板裡的 10 格裝備欄 ===
            if (targetSlot === -1) {
                let panelY = canvas.height - panelH;
                let sepX = Math.round(canvas.width * 0.42);
                let lSlotW = 70; let lSlotH = 62; let lGap = 6; let lCols = 5;
                let lTotalW = lCols * lSlotW + (lCols - 1) * lGap;
                let lStartX = Math.max(4, Math.round((sepX - lTotalW) / 2));
                let lRow1Y = panelY + 26;
                let lRow2Y = lRow1Y + lSlotH + lGap + 14;

                for (let row = 0; row < 2; row++) {
                    let rowY = row === 0 ? lRow1Y : lRow2Y;
                    if (clickScreenY >= rowY && clickScreenY <= rowY + lSlotH) {
                        for (let col = 0; col < lCols; col++) {
                            let colX = lStartX + col * (lSlotW + lGap);
                            if (clickScreenX >= colX && clickScreenX <= colX + lSlotW) {
                                targetSlot = row * lCols + col;
                                break;
                            }
                        }
                    }
                    if (targetSlot !== -1) break;
                }
            }

            if (targetSlot !== -1) {
                if (gameState.dragSource === 'loadout') {
                    // 從裝備欄拖出：兩格互換
                    let existingItem = player.loadout[targetSlot];
                    player.loadout[gameState.dragSourceIndex] = existingItem; // 抗招 item 互換
                    player.loadout[targetSlot] = gameState.draggedItem;
                } else {
                    // 從庫存拖出：检查同一物品是否已裝在別格 (防止重複)
                    let oldSlot = player.loadout.findIndex(s => s && s.id === gameState.draggedItem.id);
                    if (oldSlot !== -1 && oldSlot !== targetSlot) {
                        player.loadout[oldSlot] = null; // 銀除舊裝備位
                    }
                    // 目標格子原有的物品不需處理 (他仍在庫存裡)
                    player.loadout[targetSlot] = gameState.draggedItem;
                }
                playSound(ASSETS.sfxBuy, 1.0);
            } else {
                // 沒放到任何格子
                if (gameState.dragSource === 'loadout') {
                    // 從裝備欄拖出但沒有放到任何目標 → 放回原來的格子
                    player.loadout[gameState.dragSourceIndex] = gameState.draggedItem;
                    playSound(ASSETS.sfxButton, 1.0);
                }
                // 從庫存拖出但沒放到任何目標 → 什麼都不做 (庫存不變)
            }
        }

        gameState.draggedItem = null;
        gameState.dragSource = null;
        gameState.dragSourceIndex = -1;
    }
});

function confirmAim() {
    let u = player.aimingUnit;
    if (!u) return;
    let wYOffset = (gameState.backpackAnimVal || 0) * (-canvas.height / 2);
    let absoluteAngle = Math.atan2((mouseScreenY - wYOffset) - u.y, (mouseScreenX + cameraX) - u.x);
    u.localAimAngle = absoluteAngle - (u.rollAngle || 0);
    u.isAiming = false; 
    u.reaimCooldown = 1.0; // ⭐ 調整方向後 1 秒 CD [Req 1]
    u.lastShootTime = gameTime; // ⭐ 重設射擊計時，確保不會立即發射 [Req 1]
    player.aimingUnit = null;
}

canvas.addEventListener('wheel', (e) => {
    let rect = canvas.getBoundingClientRect();
    let mouseX = (e.clientX - rect.left) * (canvas.width / rect.width);
    let mouseY = (e.clientY - rect.top) * (canvas.height / rect.height);

    // Backpack Scroll Priority
    if (gameState.backpackOpen && gameState.backpackAnimVal > 0.5) {
        let sepX = Math.round(canvas.width * 0.42);
        let panelY = canvas.height - (canvas.height / 2);

        if (mouseX > sepX && mouseY > panelY) {
            gameState.backpackScrollY -= e.deltaY;
            if (gameState.backpackScrollY > 0) gameState.backpackScrollY = 0;

            let itemsToDraw = player.inventory.filter(item => {
                if (gameState.backpackTab === 'all') return true;
                return item.category === gameState.backpackTab;
            });
            let rows = Math.ceil(itemsToDraw.length / 7); // 7 cols
            let contentH = rows * 65; // gridH + gap (50 + 15)
            let visibleH = (canvas.height / 2) - 50;
            let maxScroll = Math.min(0, visibleH - contentH);
            if (gameState.backpackScrollY < maxScroll) gameState.backpackScrollY = maxScroll;
            return;
        }
    }

    // 圖鑑捲動攔截
    if (gameState.encyclopediaOpen) {
        if (gameState.encyclopediaSelectedTarget) {
            gameState.encyclopediaDetailScrollY -= e.deltaY * 0.5;
            if (gameState.encyclopediaDetailScrollY > 0) gameState.encyclopediaDetailScrollY = 0;
            let maxScroll = -250; // 增加捲動空間
            if (gameState.encyclopediaDetailScrollY < maxScroll) gameState.encyclopediaDetailScrollY = maxScroll;
        } else {
            gameState.encyclopediaScrollY -= e.deltaY * 0.5;
            if (gameState.encyclopediaScrollY > 0) gameState.encyclopediaScrollY = 0;

            let items = getEncyclopediaItems(gameState.encyclopediaCategory);
            let rows = Math.ceil(items.length / 4);
            let maxScroll = Math.min(0, 310 - (rows * 130));
            if (gameState.encyclopediaScrollY < maxScroll) gameState.encyclopediaScrollY = maxScroll;
        }
        return;
    }

    if (gameState.phase === 'safezone_shop' || gameState.phase === 'rest_shop') {
        let wYOffset = (gameState.backpackAnimVal || 0) * (-canvas.height / 2);
        let sx = canvas.width - 340; let sy = 80 + wYOffset; let sw = 320; let sh = 360;
        if (mouseX >= sx && mouseX <= sx + sw && mouseY >= sy && mouseY <= sy + sh) {
            player.shopScrollY -= e.deltaY * 0.5;
            if (player.shopScrollY > 0) player.shopScrollY = 0;

            let items = (gameState.phase === 'rest_shop') ? (gameState.shopItems || []) : getShopItems();
            let totalHeight = items.length * 50 + 20; // 50px per item + some padding
            let visibleHeight = sh - 140;
            let maxScroll = Math.min(0, visibleHeight - totalHeight);

            if (player.shopScrollY < maxScroll) player.shopScrollY = maxScroll;
            return;
        }
    }

    if (gameState.phase === 'rest_upgrade') {
        let uw = 340; let uh = 320;
        let ux = canvas.width / 2 - uw / 2; let uy = 70;
        if (mouseX >= ux && mouseX <= ux + uw && mouseY >= uy && mouseY <= uy + uh) {
            player.shopScrollY -= e.deltaY * 0.5;
            if (player.shopScrollY > 0) player.shopScrollY = 0;
            let totalContentH = 340; // Approx height for upgrade UI
            let visibleHeight = uh - 80;
            let maxScroll = Math.min(0, visibleHeight - totalContentH);
            if (player.shopScrollY < maxScroll) player.shopScrollY = maxScroll;
            return;
        }
    }
});

canvas.addEventListener('mousedown', (e) => {
    const rect = canvas.getBoundingClientRect();
    let clickScreenX = (e.clientX - rect.left) * (canvas.width / rect.width);
    let clickScreenY = (e.clientY - rect.top) * (canvas.height / rect.height);
    let clickWorldX = clickScreenX + cameraX;

    let wYOffset = (gameState.backpackAnimVal || 0) * (-canvas.height / 2);
    let clickWorldY = clickScreenY - wYOffset;

    // ⭐ 處理死亡後的重新開始
    if (gameState.phase === 'game_over' || player.hp <= 0) {
        let btnW, btnH, cx3, cy3;
        if (gameState.isInTutorial) {
            btnW = 260; btnH = 55; cx3 = canvas.width / 2; cy3 = canvas.height / 2 + 80;
            if (clickScreenX >= cx3 - btnW/2 && clickScreenX <= cx3 + btnW/2 &&
                clickScreenY >= cy3 - btnH/2 && clickScreenY <= cy3 + btnH/2) {
                playSound(ASSETS.sfxButton, 1.0);
                resetGame(); // 完全重置 → 回主選單
            }
        } else {
            btnW = 240; btnH = 55; cx3 = canvas.width / 2; cy3 = canvas.height / 2 + 85;
            if (clickScreenX >= cx3 - btnW/2 && clickScreenX <= cx3 + btnW/2 &&
                clickScreenY >= cy3 - btnH/2 && clickScreenY <= cy3 + btnH/2) {
                playSound(ASSETS.sfxButton, 1.0);
                resetPlatformAfterDeath(); // 平台重置，回地圖
                enterMap();
            }
        }
        return;
    }

    let panelH = (canvas.height / 2) * (gameState.backpackAnimVal || 0);
    let bpBtnX = canvas.width - 50;
    let bpBtnY = canvas.height - panelH - 50;

    // Enable backpack button in many phases including Map [Req 6]
    let canToggleBackpack = (gameState.phase !== 'menu' && gameState.phase !== 'intro' && gameState.phase !== 'game_over');
    if (canToggleBackpack && clickScreenX >= bpBtnX && clickScreenX <= bpBtnX + 30 && clickScreenY >= bpBtnY && clickScreenY <= bpBtnY + 30) {
        gameState.backpackOpen = !gameState.backpackOpen;
        playSound(ASSETS.sfxButton, 1.0);
        return;
    }

    let isClickingRestPanel = false;
    if (gameState.phase === 'rest_shop') {
        let sx = canvas.width - 340; let sw = 320; let sh = 400;
        let sy = 80; if (canvas.height < 700) sy = 20;
        if (clickScreenX >= sx && clickScreenX <= sx + sw && clickScreenY >= sy && clickScreenY <= sy + sh) {
            isClickingRestPanel = true;
        }
    }

    if (!isClickingRestPanel && gameState.backpackAnimVal > 0.01 && clickScreenY > canvas.height - (canvas.height / 2) * gameState.backpackAnimVal) {
        let panelH = (canvas.height / 2) * gameState.backpackAnimVal;
        let panelY = canvas.height - panelH;
        let sepX = Math.round(canvas.width * 0.42);
        let invY = panelY + 20;

        let tabW = 80; let tabH = 30;
        let tabX = canvas.width - (tabW * 3) - 20;

        if (clickScreenY >= invY && clickScreenY <= invY + tabH && clickScreenX >= sepX) {
            if (clickScreenX >= tabX && clickScreenX < tabX + tabW) {
                gameState.backpackTab = 'all'; gameState.backpackScrollY = 0;
            } else if (clickScreenX >= tabX + tabW && clickScreenX < tabX + tabW * 2) {
                gameState.backpackTab = 'unit'; gameState.backpackScrollY = 0;
            } else if (clickScreenX >= tabX + tabW * 2 && clickScreenX <= tabX + tabW * 3) {
                gameState.backpackTab = 'building'; gameState.backpackScrollY = 0;
            }
            playSound(ASSETS.sfxButton, 1.0);
        }

        // 右側庫存網格點擊 (Drag & Drop 來源)
        let invX = sepX + 20; let gridY = invY + tabH + 20;
        let gridW = 60; let gridH = 50; let gap = 15; let cols = 7;
        if (clickScreenX >= invX && clickScreenY >= gridY) {
            let relativeY = clickScreenY - gridY - gameState.backpackScrollY;
            let relativeX = clickScreenX - invX;
            let c = Math.floor(relativeX / (gridW + gap));
            let r = Math.floor(relativeY / (gridH + gap));

            if (relativeX % (gridW + gap) <= gridW && relativeY % (gridH + gap) <= gridH && c >= 0 && r >= 0 && c < cols) {
                let index = r * cols + c;
                let itemsToDraw = player.inventory.filter(item => {
                    if (gameState.backpackTab === 'all') return true;
                    return item.category === gameState.backpackTab;
                });
                if (index < itemsToDraw.length) {
                    gameState.draggedItem = itemsToDraw[index];
                    gameState.dragSource = 'inventory';
                    gameState.dragSourceIndex = index;
                }
            }
        }

        // 左側裝備欄 Loadout slots 拖曳來源 (只在面板內的裝備格才能拖)
        if (clickScreenX < sepX) {
            let lSlotW = 70; let lSlotH = 62; let lGap = 6; let lCols = 5;
            let lTotalW = lCols * lSlotW + (lCols - 1) * lGap;
            let lStartX = Math.max(4, Math.round((sepX - lTotalW) / 2));
            let lRow1Y = panelY + 26;
            let lRow2Y = lRow1Y + lSlotH + lGap + 14;

            for (let row = 0; row < 2; row++) {
                let rowY = row === 0 ? lRow1Y : lRow2Y;
                if (clickScreenY >= rowY && clickScreenY <= rowY + lSlotH) {
                    for (let col = 0; col < lCols; col++) {
                        let colX = lStartX + col * (lSlotW + lGap);
                        if (clickScreenX >= colX && clickScreenX <= colX + lSlotW) {
                            let slotIndex = row * lCols + col;
                            let item = player.loadout[slotIndex];
                            if (item) {
                                gameState.draggedItem = item;
                                gameState.dragSource = 'loadout';
                                gameState.dragSourceIndex = slotIndex;
                                player.loadout[slotIndex] = null;
                            }
                            break;
                        }
                    }
                }
            }
        }

        return; // Intercept backpack panel clicks
    }

    // 設定按鈕判斷
    let btnSize = 35; let btnX = canvas.width - 20 - btnSize; let btnY = 20;
    if (clickScreenX >= btnX && clickScreenX <= btnX + btnSize && clickScreenY >= btnY && clickScreenY <= btnY + btnSize) {
        gameState.settingsOpen = !gameState.settingsOpen;
        if (!gameState.settingsOpen) gameState.settingsScaleVel = 5.0;
        playSound(ASSETS.sfxButton, 1.0);
        return;
    }

    // 圖鑑按鈕判斷 (加大為 50x50)
    let encyBtnSize = 50;
    let encyBtnX = canvas.width - 20 - encyBtnSize;
    let encyBtnY = 20 + btnSize + 15; // 在設定按鈕下方
    if (clickScreenX >= encyBtnX && clickScreenX <= encyBtnX + encyBtnSize && clickScreenY >= encyBtnY && clickScreenY <= encyBtnY + encyBtnSize) {
        if (player.hp > 0 && gameState.phase !== 'menu') {
            gameState.encyclopediaOpen = !gameState.encyclopediaOpen;
            if (!gameState.encyclopediaOpen) gameState.encyclopediaScaleVel = 5.0;
            else {
                gameState.encyclopediaSelectedTarget = null;
                gameState.encyclopediaScrollY = 0;
            }
            playSound(ASSETS.sfxButton, 1.0);
            return;
        }
    }

    // 攔截圖鑑開啟時的所有點擊
    if (gameState.encyclopediaOpen) {
        let menuW = 600; let menuH = 400;
        let menuX = canvas.width / 2 - menuW / 2;
        let menuY = canvas.height / 2 - menuH / 2;

        if (clickScreenX >= menuX && clickScreenX <= menuX + menuW && clickScreenY >= menuY && clickScreenY <= menuY + menuH) {
            // 關閉按鈕 X
            if (clickScreenX >= menuX + menuW - 40 && clickScreenY <= menuY + 40) {
                gameState.encyclopediaOpen = false;
                gameState.encyclopediaScaleVel = 5.0;
                playSound(ASSETS.sfxButton, 1.0);
                return;
            }

            if (gameState.encyclopediaSelectedTarget) {
                // 返回按鈕
                if (clickScreenX >= menuX + 20 && clickScreenX <= menuX + 100 && clickScreenY >= menuY + 15 && clickScreenY <= menuY + 45) {
                    gameState.encyclopediaSelectedTarget = null;
                    gameState.encyclopediaDetailScrollY = 0;
                    playSound(ASSETS.sfxButton, 1.0);
                }
            } else {
                // 標籤切換判定
                let tabW = 180;
                let tabsStartX = menuX + 30;
                if (clickScreenY >= menuY + 50 && clickScreenY <= menuY + 90) {
                    if (clickScreenX >= tabsStartX && clickScreenX < tabsStartX + tabW) {
                        gameState.encyclopediaCategory = 'unit';
                        gameState.encyclopediaScrollY = 0;
                        playSound(ASSETS.sfxButton, 1.0);
                    } else if (clickScreenX >= tabsStartX + tabW && clickScreenX < tabsStartX + tabW * 2) {
                        gameState.encyclopediaCategory = 'building';
                        gameState.encyclopediaScrollY = 0;
                        playSound(ASSETS.sfxButton, 1.0);
                    } else if (clickScreenX >= tabsStartX + tabW * 2 && clickScreenX <= tabsStartX + tabW * 3) {
                        gameState.encyclopediaCategory = 'enemy';
                        gameState.encyclopediaScrollY = 0;
                        playSound(ASSETS.sfxButton, 1.0);
                    }
                }

                // 方格點擊
                let items = getEncyclopediaItems(gameState.encyclopediaCategory);
                let cols = 4; let boxSize = 100; let gap = 30;
                let startX = menuX + 55;
                let startY = menuY + 110 + gameState.encyclopediaScrollY;

                for (let i = 0; i < items.length; i++) {
                    let r = Math.floor(i / cols);
                    let c = i % cols;
                    let bx = startX + c * (boxSize + gap);
                    let by = startY + r * (boxSize + gap);

                    if (clickScreenY > menuY + 90 && clickScreenY < menuY + menuH) {
                        if (clickScreenX >= bx && clickScreenX <= bx + boxSize && clickScreenY >= by && clickScreenY <= by + boxSize) {
                            if (items[i].unlocked) {
                                gameState.encyclopediaSelectedTarget = items[i];
                                gameState.encyclopediaDetailScrollY = 0;
                                playSound(ASSETS.sfxButton, 1.0);
                            }
                            break;
                        }
                    }
                }
            }
        }
        return;
    }

    if (gameState.settingsOpen) {
        let menuW = 300; let menuH = 440; // 調整為 440
        let menuX = canvas.width / 2 - menuW / 2;
        let menuY = canvas.height / 2 - menuH / 2;

        if (clickScreenX >= menuX && clickScreenX <= menuX + menuW && clickScreenY >= menuY && clickScreenY <= menuY + menuH) {
            // 音樂音量拉條
            if (clickScreenY >= menuY + 80 && clickScreenY <= menuY + 120) {
                let barX = menuX + 50; let barW = 200;
                let vol = (clickScreenX - barX) / barW;
                if (vol < 0) vol = 0; if (vol > 1) vol = 1;
                GAME_CONFIG.musicVolume = vol;
                const track = getMusicTrack(gameState.musicState);
                if (track) track.volume = GAME_CONFIG.musicVolume;
            }
            // 音效音量拉條
            else if (clickScreenY >= menuY + 140 && clickScreenY <= menuY + 180) {
                let barX = menuX + 50; let barW = 200;
                let vol = (clickScreenX - barX) / barW;
                if (vol < 0) vol = 0; if (vol > 1) vol = 1;
                GAME_CONFIG.sfxVolume = vol;
                if (ASSETS.sfxButton) playSound(ASSETS.sfxButton, 1.0);
            }
            // 血條與傷害開關 (需與 drawUI 同步座標)
            let sy = menuY + 200;
            // 單位血條
            if (clickScreenY >= sy && clickScreenY <= sy + 20 && clickScreenX >= menuX + 50 && clickScreenX <= menuX + 80) {
                GAME_CONFIG.showUnitHp = !GAME_CONFIG.showUnitHp;
                if (ASSETS.sfxButton) playSound(ASSETS.sfxButton, 1.0);
            }
            // 敵人血條
            sy += 30;
            if (clickScreenY >= sy && clickScreenY <= sy + 20 && clickScreenX >= menuX + 50 && clickScreenX <= menuX + 80) {
                GAME_CONFIG.showEnemyHp = !GAME_CONFIG.showEnemyHp;
                if (ASSETS.sfxButton) playSound(ASSETS.sfxButton, 1.0);
            }
            // 敵人傷害飄字
            sy += 30;
            if (clickScreenY >= sy && clickScreenY <= sy + 20 && clickScreenX >= menuX + 50 && clickScreenX <= menuX + 80) {
                GAME_CONFIG.showDamageText = !GAME_CONFIG.showDamageText;
                if (ASSETS.sfxButton) playSound(ASSETS.sfxButton, 1.0);
            }
            // 我方傷害飄字
            sy += 30;
            if (clickScreenY >= sy && clickScreenY <= sy + 20 && clickScreenX >= menuX + 50 && clickScreenX <= menuX + 80) {
                GAME_CONFIG.showUnitDamageText = !GAME_CONFIG.showUnitDamageText;
                if (ASSETS.sfxButton) playSound(ASSETS.sfxButton, 1.0);
            }
        }
        return;
    }

    if (gameState.phase === 'menu') {
        let cx = canvas.width / 2;

        // === 【自定義調整區同步：LOGO 與 標題】 ===
        // 請確保這裡的基礎數值與 drawUI 函數中的對應數值保持一致
        let logoBaseW = 1000; // 最大化寬度
        let logoY_Base = 5; 

        let logoW = logoBaseW;
        let logoH = 200;
        if (ASSETS.imgLogo.complete && ASSETS.imgLogo.naturalWidth > 0) {
            let aspect = (ASSETS.imgLogo.naturalHeight / ASSETS.imgLogo.naturalWidth) * 1.3;
            logoH = logoW * aspect;
        }

        let maxLogoH = canvas.height * 0.52; // 最大高度再放寬
        if (logoH > maxLogoH) {
            let scale = maxLogoH / logoH;
            logoH = maxLogoH;
            logoW = logoW * scale;
        }

        let btnW = 280; let btnH = 65; 
        let pBtnY = logoY_Base + logoH + 10; // 壓縮間距
        let pBtnX = cx - btnW / 2;
        // === 【自定義調整區結束】 ===

        // 如果正在顯示難度選擇
        if (gameState.difficultySelectionAlpha > 0.5) {
            let diffW = 240; let diffH = 55; 
            let diffGap = 5; // 壓縮按鈕間距
            let startY = pBtnY + 8; // 壓縮選單起始位置

            // 普通 (黃色)
            if (clickScreenX >= cx - diffW / 2 && clickScreenX <= cx + diffW / 2 && clickScreenY >= startY && clickScreenY <= startY + diffH) {
                GAME_CONFIG.difficulty = 'normal';
                startGameWithDifficulty();
            }
            // 困難 (紅色)
            else if (clickScreenX >= cx - diffW / 2 && clickScreenX <= cx + diffW / 2 && clickScreenY >= startY + diffH + diffGap && clickScreenY <= startY + diffH * 2 + diffGap) {
                GAME_CONFIG.difficulty = 'hard';
                startGameWithDifficulty();
            }
            // 惡夢 (紫色)
            else if (clickScreenX >= cx - diffW / 2 && clickScreenX <= cx + diffW / 2 && clickScreenY >= startY + (diffH + diffGap) * 2 && clickScreenY <= startY + diffH * 3 + diffGap * 2) {
                GAME_CONFIG.difficulty = 'nightmare';
                startGameWithDifficulty();
            }
            // 返回
            else if (clickScreenX >= cx - diffW / 2 && clickScreenX <= cx + diffW / 2 && clickScreenY >= startY + (diffH + diffGap) * 3 && clickScreenY <= startY + diffH * 4 + diffGap * 3) {
                playSound(ASSETS.sfxButton, 1.0);
                gameState.showDifficultySelection = false;
            }
            return;
        }

        if (clickScreenX >= pBtnX && clickScreenX <= pBtnX + btnW && clickScreenY >= pBtnY && clickScreenY <= pBtnY + btnH) {
            playSound(ASSETS.sfxButton, 1.0);
            gameState.showDifficultySelection = true;
            return;
        }
        return;
    }

    if (gameState.phase === 'intro') return;

    // ⭐ 地圖不做點選，強制用 WASD 與 Space [Req 9]
    if (gameState.phase === 'map') {
        // Disabled clicking map nodes as per request
        return;
    }

    // ⭐ 筆准模式按鈕（戰鬥 + 休息站都可用）
    let isCombatOrRestPhase = (gameState.phase === 'combat' || gameState.phase === 'tutorial_combat' ||
        gameState.phase === 'clearing' || gameState.phase === 'tutorial_clearing' ||
        gameState.phase === 'rest_shop' || gameState.phase === 'rest_house' || gameState.phase === 'rest_upgrade' ||
        gameState.phase === 'transition_to_rest');

    let isRestPhaseNow = (gameState.phase === 'rest_shop' || gameState.phase === 'rest_house' || gameState.phase === 'rest_upgrade' || gameState.phase === 'transition_to_rest');
    let aimBtnSize = 50;
    let aimBtnX = isRestPhaseNow ? 20 : canvas.width - 130;
    let aimBtnY_ref = isRestPhaseNow ? 200 : 20 + 35 + 15 + 60; // 同步 drawUI

    if (isCombatOrRestPhase &&
        clickScreenX >= aimBtnX && clickScreenX <= aimBtnX + aimBtnSize &&
        clickScreenY >= aimBtnY_ref && clickScreenY <= aimBtnY_ref + aimBtnSize) {
        player.reaimMode = !player.reaimMode;
        if (player.reaimMode) {
            player.deleteMode = false;
            player.summonMode = false;
            player.selectedSlot = -1;
        }
        playSound(ASSETS.sfxButton, 1.0);
        return;
    }

    // ⭐ 商店休息站點擊處理
    if (gameState.phase === 'rest_shop') {
        let sx = canvas.width - 340; let sw = 320; let sh = 400;
        let sy = 80; if (canvas.height < 700) sy = 20;

        // Shift shop click bounds UP if backpack is open [Req 1]
        let bpShift = (gameState.backpackAnimVal || 0) * 150;
        sy -= bpShift;

        if (clickScreenX >= sx && clickScreenX <= sx + sw && clickScreenY >= sy && clickScreenY <= sy + sh) {
            if (player.deleteMode || (player.reaimMode && !player.aimingUnit)) {
                player.deleteMode = false;
            }

            // 跳過按鈕
            if (clickScreenY >= sy + sh - 50 && clickScreenY <= sy + sh - 10 &&
                clickScreenX >= sx + 10 && clickScreenX <= sx + sw - 10) {
                gameState.restTimer = 0; return;
            }

            // 刷新按鈕 (sx+20 ~ sx+150, sy+68 ~ sy+92)
            let refreshCost = gameState.isPremiumShop ? GAME_CONFIG.premiumShopRefreshCost : GAME_CONFIG.shopRefreshCost;
            if (clickScreenY >= sy + 68 && clickScreenY <= sy + 92 &&
                clickScreenX >= sx + 20 && clickScreenX <= sx + 150) {
                if (player.coins >= refreshCost) {
                    player.coins -= refreshCost;
                    gameState.shopItems = generateShopItems(gameState.isPremiumShop);
                    gameState.shopRefreshed = true;
                    player.shopScrollY = 0;
                    playSound(ASSETS.sfxBuy, 1.0);
                }
                return;
            }

            // 商品點擊
            let shopItems = gameState.shopItems || [];
            let currentY = sy + 105 + (player.shopScrollY || 0);
            for (let item of shopItems) {
                if (clickScreenY >= sy + 95 && clickScreenY <= sy + sh - 55) {
                    if (clickScreenY >= currentY && clickScreenY <= currentY + 45 &&
                        clickScreenX >= sx + 10 && clickScreenX <= sx + sw - 10) {
                        // 購買
                        if (item.category === 'upgrade' && item.id === 'upgrade') {
                            if (player.coins >= player.maxUnitCost) {
                                player.coins -= player.maxUnitCost;
                                player.maxUnits += 1; player.maxUnitCost = Math.floor(player.maxUnitCost * 2);
                                playSound(ASSETS.sfxBuy, 1.0);
                                floatingTexts.push({ text: 'UPGRADED!', x: sx + sw / 2, y: currentY - 10, vy: -20, life: 1, maxLife: 1, color: '#2ecc71', fixed: true });
                            }
                        } else if (item.category === 'upgrade' && item.id === 'hpUpgrade') {
                            let cost = 200 * Math.pow(2, player.maxHpUpgradeCount || 0);
                            if (player.coins >= cost) {
                                player.coins -= cost;
                                player.maxHp += 100; player.hp += 100;
                                player.maxHpUpgradeCount = (player.maxHpUpgradeCount || 0) + 1;
                                playSound(ASSETS.sfxBuy, 1.0);
                                floatingTexts.push({ text: 'HP UP!', x: sx + sw / 2, y: currentY - 10, vy: -20, life: 1, maxLife: 1, color: '#2ecc71', fixed: true });
                            }
                        } else {
                            let qty = 1; // Single item purchase per click
                            if (player.coins >= item.cost && (item.stockCount === undefined || item.stockCount > 0)) {
                                player.coins -= item.cost;
                                let invItem = player.inventory.find(i => i.id === item.id);
                                if (invItem) {
                                    invItem.count = (invItem.count || 0) + qty;
                                    let lo = player.loadout.find(l => l && l.id === item.id);
                                    if (lo) lo.count = invItem.count;
                                } else {
                                    let newItm = { id: item.id, category: item.category, type: item.type, drawType: item.type, cost: 0, hp: item.hp, color: item.color, material: item.material, name: item.name, count: qty };
                                    player.inventory.push(newItm);
                                    let emptySlot = player.loadout.indexOf(null);
                                    if (emptySlot !== -1) player.loadout[emptySlot] = newItm;
                                }
                                const unlockMap = { 'pistol':'unlockedPistol','cannon':'unlockedCannon','swordsman':'unlockedSwordsman','rect':'unlockedRect','tri':'unlockedTri','rtri':'unlockedRTri','brick_square':'unlockedBrickSquare','brick_rect':'unlockedBrickRect','brick_tri':'unlockedBrickTri','brick_rtri':'unlockedBrickRTri','steel_square':'unlockedSteelSquare','steel_rect':'unlockedSteelRect','steel_tri':'unlockedSteelTri','steel_rtri':'unlockedSteelRTri' };
                                if (unlockMap[item.id]) player[unlockMap[item.id]] = true;
                                if (item.stockCount !== undefined) item.stockCount--;
                                playSound(ASSETS.sfxBuy, 1.0);
                                floatingTexts.push({ text: 'BOUGHT!', x: sx + sw / 2, y: currentY - 10, vy: -20, life: 1, maxLife: 1, color: '#2ecc71', fixed: true });
                            }
                        }
                        return;
                    }
                }
                currentY += 50;
            }
            return;
        }
    }

    // ⭐ 小房子休息站
    if (gameState.phase === 'rest_house') {
        let pw = 300; let ph = 250; let px = canvas.width / 2 - pw / 2; let py = 80;
        if (clickScreenX >= px + 20 && clickScreenX <= px + pw - 20 &&
            clickScreenY >= py + ph - 50 && clickScreenY <= py + ph - 15) {
            applyHouseGifts();
            gameState.restTimer = 0; return;
        }
    }

    // ⭐ 升級站休息站
    if (gameState.phase === 'rest_upgrade') {
        let uw = 340; let uh = 320; let ux = canvas.width / 2 - uw / 2; let uy = 70;
        let repairCost = GAME_CONFIG.repairCostPerHp || 5;
        let missingHp = player.maxHp - player.hp;
        let lineY = uy + 110;
        let repairBtns = [
            { cost: repairCost, hp: 1 },
            { cost: Math.min(missingHp, 10) * repairCost, hp: Math.min(10, missingHp) },
            { cost: missingHp * repairCost, hp: missingHp },
        ];
        for (let btn of repairBtns) {
            if (clickScreenX >= ux + 20 && clickScreenX <= ux + uw - 20 &&
                clickScreenY >= lineY && clickScreenY <= lineY + 32) {
                if (player.coins >= btn.cost && btn.hp > 0) {
                    player.coins -= btn.cost;
                    player.hp = Math.min(player.maxHp, player.hp + btn.hp);
                    playSound(ASSETS.sfxBuy, 1.0);
                    floatingTexts.push({ text: `+${btn.hp} HP`, x: canvas.width/2, y: 200, vy: -30, life: 1.5, maxLife: 1.5, color: '#2ecc71', fixed: true });
                }
                return;
            }
            lineY += 40;
        }
        lineY += 5;
        if (clickScreenX >= ux + 20 && clickScreenX <= ux + uw - 20 &&
            clickScreenY >= lineY && clickScreenY <= lineY + 32) {
            if (player.coins >= player.maxUnitCost) {
                player.coins -= player.maxUnitCost;
                player.maxUnits += 1; player.maxUnitCost = Math.floor(player.maxUnitCost * 2);
                playSound(ASSETS.sfxBuy, 1.0);
            }
            return;
        }
        if (clickScreenX >= ux + 20 && clickScreenX <= ux + uw - 20 &&
            clickScreenY >= uy + uh - 45 && clickScreenY <= uy + uh - 10) {
            gameState.restTimer = 0; return;
        }
    }

    if (e.button === 2) {
        if (player.aimingUnit) confirmAim();
        else {
            player.deleteMode = !player.deleteMode;
            if (player.deleteMode) {
                player.selectedSlot = -1;
                player.reaimMode = false;
                player.summonMode = false;
            }
        }
        return;
    }

    if (e.button === 0) {
        // ⭐ 瞄準模式：戰鬥 + 休息站皆可選取單位
        let isCombatOrRest2 = (gameState.phase === 'combat' || gameState.phase === 'tutorial_combat' ||
            gameState.phase === 'clearing' || gameState.phase === 'tutorial_clearing' ||
            gameState.phase === 'rest_shop' || gameState.phase === 'rest_house' || gameState.phase === 'rest_upgrade');
        if (isCombatOrRest2 && player.reaimMode) {
            if (player.aimingUnit) {
                confirmAim();
                return;
            }
            let targetUnit = null; let minDist = 30;
            for (let u of units) {
                if (u.state === 'active') {
                    let d = Math.hypot(clickWorldX - u.x, clickWorldY - u.y);
                    if (d < minDist) { minDist = d; targetUnit = u; }
                }
            }
            if (targetUnit) {
                player.aimingUnit = targetUnit;
                targetUnit.isAiming = true; // Set individually so only this unit stops fire [Req 5]
                playSound(ASSETS.sfxButton, 1.0);
                return;
            }
        }

        if (player.deleteMode) {
            let target = null;
            let minDist = Infinity;

            units.forEach(u => {
                if (u.state === 'dying') return;
                let dist = Math.hypot(clickWorldX - u.x, clickWorldY - u.y);
                if (dist < u.radius + 15 && dist < minDist) {
                    minDist = dist;
                    target = { type: 'unit', ref: u };
                }
            });

            buildings.forEach(b => {
                if (b.state === 'dying') return;
                let bPoly = getBuildingVertices(b);
                if (isPointInPolygon(clickWorldX, clickWorldY, bPoly)) {
                    let dist = Math.hypot(clickWorldX - b.x, clickWorldY - b.y);
                    if (dist + 20 < minDist) {
                        minDist = dist + 20;
                        target = { type: 'building', ref: b };
                    }
                }
            });

            if (target) {
                if (target.type === 'unit') killUnit(target.ref);
                else killBuilding(target.ref);
                player.deleteMode = false;
            }
            return;
        }

        let panelH = (canvas.height / 2) * (gameState.backpackAnimVal || 0);
        const uiY = canvas.height - panelH - 70;

        if (clickScreenX > 20 && clickScreenX < 50 && clickScreenY > uiY - 25 && clickScreenY < uiY - 5) {
            player.loadoutRow = (player.loadoutRow === 0) ? 1 : 0;
            // 觸發快速切換動畫 (將格子縮放歸零，由彈簧物理自然彈回)
            if (gameState.slotScale) {
                gameState.slotScale = [0.5, 0.5, 0.5, 0.5, 0.5];
                gameState.slotScaleVel = [5, 5, 5, 5, 5];
            }
            player.deleteMode = false;
            return;
        }

        if (clickScreenY > uiY && clickScreenY < uiY + 50) {
            let offsetIndex = player.loadoutRow * 5;
            for (let i = 0; i < 5; i++) {
                let loadoutIndex = offsetIndex + i;
                if (loadoutIndex >= player.loadout.length) break;

                let boxX = 20 + i * 70;
                if (clickScreenX > boxX && clickScreenX < boxX + 60) {
                    // 上方快捷列永遠是選取行為，不管背包是否開啟
                    if (player.selectedSlot === loadoutIndex) {
                        player.selectedSlot = -1;
                    } else {
                        player.selectedSlot = loadoutIndex;
                        player.deleteMode = false;
                        player.reaimMode = false;
                    }
                    return;
                }
            }
        }

        if (player.aimingUnit) confirmAim();
        else {
            let insideBuilding = false;
            for (let b of buildings) {
                if (b.state === 'dying') continue;
                let bPoly = getBuildingVertices(b);
                if (isPointInPolygon(clickWorldX, clickWorldY, bPoly)) { insideBuilding = true; break; }
            }

            if (insideBuilding) {
                floatingTexts.push({ text: "BLOCKED!", x: clickWorldX, y: clickWorldY, vy: -20, life: 1, maxLife: 1, color: '#e74c3c', fixed: false });
                return;
            }

            let selItem = player.selectedSlot >= 0 ? player.loadout[player.selectedSlot] : null;

            if (selItem && selItem.category === 'building') {
                let w = 40, h = 40; if (selItem.type === 2) { w = 80; h = 20; }
                let minRadius = Math.min(w, h) / 2;
                let overlapUnit = false;
                for (let u of units) {
                    if (u.state === 'dying') continue;
                    if (Math.hypot(clickWorldX - u.x, clickWorldY - u.y) < minRadius + u.radius + 2) {
                        overlapUnit = true; break;
                    }
                }

                if (overlapUnit) {
                    floatingTexts.push({ text: "BLOCKED!", x: clickWorldX, y: clickWorldY, vy: -20, life: 1, maxLife: 1, color: '#e74c3c', fixed: false });
                } else if (selItem.count <= 0) {
                    floatingTexts.push({ text: "OUT OF STOCK!", x: clickWorldX, y: clickWorldY, vy: -20, life: 1, maxLife: 1, color: '#e74c3c', fixed: false });
                    player.loadout[player.selectedSlot] = null;
                    player.selectedSlot = -1;
                } else {
                    selItem.count--;
                    // 同步減少並檢查數量 (歸零時從背包移除)
                    let invMatch = player.inventory.find(i => i.id === selItem.id);
                    if (invMatch) {
                        invMatch.count = selItem.count;
                        if (invMatch.count <= 0) {
                            player.inventory = player.inventory.filter(i => i !== invMatch);
                        }
                    }

                    addBuilding(selItem, clickWorldX, clickWorldY, player.buildAngle);
                    if (selItem.count <= 0) {
                        player.loadout[player.selectedSlot] = null;
                        player.selectedSlot = -1;
                    }
                    playSound(ASSETS.sfxBuy, 1.0);
                }
            }
            else if (selItem && selItem.category === 'unit') {
                if (player.unitCount >= player.maxUnits) {
                    floatingTexts.push({ text: "MAX UNITS!", x: clickWorldX, y: clickWorldY, vy: -20, life: 1, maxLife: 1, color: '#e74c3c', fixed: false });
                    return;
                }
                if (selItem.count <= 0) {
                    floatingTexts.push({ text: "OUT OF STOCK!", x: clickWorldX, y: clickWorldY, vy: -20, life: 1, maxLife: 1, color: '#e74c3c', fixed: false });
                    player.loadout[player.selectedSlot] = null;
                    player.selectedSlot = -1;
                    return;
                }

                let unitData = null;
                if (selItem.id === 'archer') {
                    unitData = { type: 'archer', radius: 12, color: GAME_CONFIG.archerColor, mass: GAME_CONFIG.archerMass, shootForce: GAME_CONFIG.archerShootForce, gravityMult: 600, damage: GAME_CONFIG.archerDamage, cooldown: GAME_CONFIG.archerCooldown, aoeRadius: 0, hp: GAME_CONFIG.archerHp };
                } else if (selItem.id === 'pistol') {
                    unitData = { type: 'pistol', radius: 12, color: GAME_CONFIG.pistolColor, mass: GAME_CONFIG.pistolMass, shootForce: GAME_CONFIG.pistolShootForce, gravityMult: 0, damage: GAME_CONFIG.pistolDamage, cooldown: GAME_CONFIG.pistolCooldown, aoeRadius: 0, hp: GAME_CONFIG.pistolHp };
                } else if (selItem.id === 'cannon') {
                    unitData = { type: 'cannon', radius: 14, color: GAME_CONFIG.cannonColor, mass: GAME_CONFIG.cannonMass, shootForce: GAME_CONFIG.cannonShootForce, gravityMult: 1000, damage: GAME_CONFIG.cannonDamage, cooldown: GAME_CONFIG.cannonCooldown, aoeRadius: GAME_CONFIG.cannonAoeRadius, hp: GAME_CONFIG.cannonHp };
                } else if (selItem.id === 'swordsman') {
                    unitData = { type: 'swordsman', radius: 12, color: GAME_CONFIG.swordsmanColor, mass: GAME_CONFIG.swordsmanMass, shootForce: 0, gravityMult: 0, damage: GAME_CONFIG.swordsmanDamage, cooldown: GAME_CONFIG.swordsmanCooldown, aoeRadius: GAME_CONFIG.swordsmanRange, hp: GAME_CONFIG.swordsmanHp };
                }

                if (unitData) {
                    selItem.count--;
                    // 同步減少並檢查數量 (歸零時從背包移除)
                    let invMatch = player.inventory.find(i => i.id === selItem.id);
                    if (invMatch) {
                        invMatch.count = selItem.count;
                        if (invMatch.count <= 0) {
                            player.inventory = player.inventory.filter(i => i !== invMatch);
                        }
                    }

                    player.unitCount++;
                    let newUnit = { ...unitData, state: 'active', x: clickWorldX, y: clickWorldY, vx: 0, vy: 0, isOnBase: false, isAiming: true, localAimAngle: 0, rollAngle: 0, lastShootTime: gameTime, squishY: 1, flashTimer: 0, maxHp: unitData.hp };
                    units.push(newUnit); player.aimingUnit = newUnit;

                    if (selItem.count <= 0) {
                        player.loadout[player.selectedSlot] = null;
                        player.selectedSlot = -1;
                    }
                    playSound(ASSETS.sfxBuy, 1.0);
                }
            }
        }
    }
});

window.addEventListener('keydown', (e) => {
    if (e.key >= '1' && e.key <= '5') {
        let idx = parseInt(e.key) - 1;
        let loadoutIndex = player.loadoutRow * 5 + idx;
        if (loadoutIndex < player.loadout.length) {
            if (player.selectedSlot === loadoutIndex) {
                player.selectedSlot = -1;
            } else {
                player.selectedSlot = loadoutIndex;
            }
            player.deleteMode = false;
        }
    }

    let selItem = player.selectedSlot >= 0 ? player.loadout[player.selectedSlot] : null;
    if (e.key.toLowerCase() === 'r' && selItem && selItem.category === 'building' && !player.deleteMode) {
        player.buildAngle = (player.buildAngle + 45) % 360;
    }
});

function startGameWithDifficulty() {
    playSound(ASSETS.sfxButton, 1.0);
    gameState.showDifficultySelection = false;
    gameState.difficultySelectionAlpha = 0;
    gameState.playBtnHovered = false;
    startMusicCrossfade('city');
    gameState.phase = 'intro';
    gameState.introState = 1;
    gameState.introTimer = 0;
    gameState.introPlatformWorldX = cameraX - 350;
}

function getShopItems() {
    return [
        { id: 'upgrade', type: 'upgrade', category: 'upgrade', cost: player.maxUnitCost, name: 'Max Units +1' },
        { id: 'hpUpgrade', type: 'upgrade', category: 'upgrade', cost: 200 * Math.pow(2, player.maxHpUpgradeCount || 0), name: `Max HP +100 (Lv.${(player.maxHpUpgradeCount || 0) + 1})` },

        { id: 'archer', category: 'unit', type: 1, cost: 30, name: '弓箭手' },
        { id: 'swordsman', category: 'unit', type: 3, cost: 40, name: '劍士' },
        { id: 'cannon', category: 'unit', type: 2, cost: 120, name: '砲兵' },
        { id: 'pistol', category: 'unit', type: 10, cost: 60, name: '槍手' },

        // --- 木製系列 ($15) ---
        { id: 'square', category: 'building', type: 1, cost: 15, name: '木製正方', material: 'wood', hp: GAME_CONFIG.buildingHp, color: '#8B4513' },
        { id: 'rect', category: 'building', type: 2, cost: 15, name: '木製長方', material: 'wood', hp: GAME_CONFIG.buildingHp, color: '#8B4513' },
        { id: 'tri', category: 'building', type: 3, cost: 15, name: '木製三角', material: 'wood', hp: GAME_CONFIG.buildingHp, color: '#8B4513' },
        { id: 'rtri', category: 'building', type: 4, cost: 15, name: '木製斜三', material: 'wood', hp: GAME_CONFIG.buildingHp, color: '#8B4513' },

        // --- 磚頭系列 ($60) ---
        { id: 'brick_square', category: 'building', type: 1, cost: 60, name: '磚頭正方', material: 'brick', hp: GAME_CONFIG.brickBuildingHp, color: '#A52A2A' },
        { id: 'brick_rect', category: 'building', type: 2, cost: 60, name: '磚頭長方', material: 'brick', hp: GAME_CONFIG.brickBuildingHp, color: '#A52A2A' },
        { id: 'brick_tri', category: 'building', type: 3, cost: 60, name: '磚頭三角', material: 'brick', hp: GAME_CONFIG.brickBuildingHp, color: '#A52A2A' },
        { id: 'brick_rtri', category: 'building', type: 4, cost: 60, name: '磚頭斜三', material: 'brick', hp: GAME_CONFIG.brickBuildingHp, color: '#A52A2A' },

        // --- 鋼鐵系列 ($150) ---
        { id: 'steel_square', category: 'building', type: 1, cost: 150, name: '鋼鐵正方', material: 'steel', hp: GAME_CONFIG.steelBuildingHp, color: '#708090' },
        { id: 'steel_rect', category: 'building', type: 2, cost: 150, name: '鋼鐵長方', material: 'steel', hp: GAME_CONFIG.steelBuildingHp, color: '#708090' },
        { id: 'steel_tri', category: 'building', type: 3, cost: 150, name: '鋼鐵三角', material: 'steel', hp: GAME_CONFIG.steelBuildingHp, color: '#708090' },
        { id: 'steel_rtri', category: 'building', type: 4, cost: 150, name: '鋼鐵斜三', material: 'steel', hp: GAME_CONFIG.steelBuildingHp, color: '#708090' }
    ];
}

function drawUI() {
    ctx.textAlign = 'left';

    if (gameState.phase === 'combat' || gameState.phase === 'tutorial_combat' ||
        gameState.phase === 'clearing' || gameState.phase === 'tutorial_clearing') {
        const enemyList = getEncyclopediaItems('enemy');
        enemies.forEach(e => {
            let targetId = '';
            if (e.type === 'fast') targetId = 'fastZombie';
            else if (e.type === 'shield') targetId = 'shieldZombie';
            else if (e.type === 'venom') targetId = 'venomZombie';
            else if (e.type === 'balloon') targetId = 'balloonZombie';
            else if (e.type === 'blade') targetId = 'bladeZombie';
            else if (e.type === 'armor') targetId = 'armorZombie';
            else if (e.type === 'bomb') targetId = 'bombZombie';
            else if (e.type === 'plane') targetId = 'planeZombie';
            else if (e.type === 'split' || e.type === 'mini') targetId = 'splitZombie';
            else if (e.type === 'normal') targetId = 'zombie';

            if (targetId && !player.encountered[targetId]) {
                player.encountered[targetId] = true;
                let info = enemyList.find(x => x.id === targetId);
                if (info) {
                    gameState.unlockNotifications.push({ item: info, name: info.name, timer: 5.0, type: 'enemy' });
                }
            }
        });
    }

    if (gameState.phase === 'menu' || (gameState.phase === 'intro' && gameState.introState === 1)) {
        ctx.globalAlpha = gameState.menuAlpha;

        let cx = canvas.width / 2;

        // === 【自定義調整區：LOGO 與 標題】 ===
        // 您可以調整這裡的數值來改變尺寸與位置
        let logoBaseW = 1000; // 再次放大寬度 (原為 880)
        let logoFloatY = Math.sin(gameState.timer * 2) * 10; 
        let logoY_Base = 5; 

        let logoW = logoBaseW;
        let logoH = 200;
        if (ASSETS.imgLogo.complete && ASSETS.imgLogo.naturalWidth > 0) {
            let aspect = (ASSETS.imgLogo.naturalHeight / ASSETS.imgLogo.naturalWidth) * 1.3;
            logoH = logoW * aspect;
        }

        let maxLogoH = canvas.height * 0.52; // 最大高度再放寬
        if (logoH > maxLogoH) {
            let scale = maxLogoH / logoH;
            logoH = maxLogoH;
            logoW = logoW * scale;
        }

        let logoY = logoY_Base + logoFloatY;
        ctx.drawImage(ASSETS.imgLogo, cx - logoW / 2, logoY, logoW, logoH);

        // 標題字體大小設定
        let titleSize = Math.max(26, Math.min(65, Math.floor(logoW * 0.15))); // 稍微放大標題 (與 logo 同步)
        ctx.fillStyle = '#fff';
        ctx.font = 'bold ' + titleSize + 'px "Courier New"';
        ctx.textAlign = 'center';

        // 標題位置設定 (logoY + logoH 座標的偏移量)
        ctx.fillText("MOBILE FORTRESS", cx, logoY + logoH - (logoH * 0.05));
        // === 【自定義調整區結束】 ===

        let btnW = 280; let btnH = 65; 
        let pBtnY = logoY_Base + logoH + 10; // 壓縮間距
        let pBtnX = cx - btnW / 2;

        // 更新難度選擇動畫
        if (gameState.difficultySelectionAlpha === undefined) gameState.difficultySelectionAlpha = 0;
        if (gameState.showDifficultySelection && gameState.phase === 'menu') {
            gameState.difficultySelectionAlpha = Math.min(1.0, gameState.difficultySelectionAlpha + 0.05);
        } else {
            gameState.difficultySelectionAlpha = Math.max(0.0, gameState.difficultySelectionAlpha - 0.05);
        }

        // 如果正在顯示難度選擇
        if (gameState.difficultySelectionAlpha > 0.01) {
            ctx.save();
            ctx.globalAlpha = gameState.difficultySelectionAlpha;
            let diffW = 240; let diffH = 55; 
            let diffGap = 5; // 壓縮間隙
            let startY = pBtnY + 8; // 調整起始位置

            let difficulties = [
                { id: 'normal', label: '普通', color: '#f1c40f' },
                { id: 'hard', label: '困難', color: '#e74c3c' },
                { id: 'nightmare', label: '惡夢', color: '#9b59b6' }
            ];

            difficulties.forEach((d, i) => {
                let dy = startY + i * (diffH + diffGap);
                let isHovered = (mouseScreenX >= cx - diffW / 2 && mouseScreenX <= cx + diffW / 2 && mouseScreenY >= dy && mouseScreenY <= dy + diffH);

                ctx.fillStyle = d.color;
                if (isHovered) {
                    ctx.globalAlpha = 1.0;
                    ctx.shadowBlur = 15; ctx.shadowColor = d.color;
                } else {
                    ctx.globalAlpha = 0.7 * gameState.difficultySelectionAlpha;
                    ctx.shadowBlur = 0;
                }

                ctx.fillRect(cx - diffW / 2, dy, diffW, diffH);
                ctx.strokeStyle = '#fff'; ctx.lineWidth = 3;
                ctx.strokeRect(cx - diffW / 2, dy, diffW, diffH);

                ctx.fillStyle = '#fff'; ctx.font = 'bold 24px "Courier New"'; ctx.textAlign = 'center'; 
                ctx.fillText(d.label, cx, dy + diffH / 2 + 8);
            });

            // 返回按鈕
            let backY = startY + 3 * (diffH + diffGap);
            let isBackHovered = (mouseScreenX >= cx - diffW / 2 && mouseScreenX <= cx + diffW / 2 && mouseScreenY >= backY && mouseScreenY <= backY + diffH);
            ctx.fillStyle = isBackHovered ? '#95a5a6' : '#7f8c8d';
            if (isBackHovered) {
                ctx.globalAlpha = 1.0;
                ctx.shadowBlur = 15; ctx.shadowColor = '#95a5a6';
            } else {
                ctx.globalAlpha = 0.7 * gameState.difficultySelectionAlpha;
                ctx.shadowBlur = 0;
            }
            ctx.fillRect(cx - diffW / 2, backY, diffW, diffH);
            ctx.strokeStyle = '#fff'; ctx.lineWidth = 3; ctx.strokeRect(cx - diffW / 2, backY, diffW, diffH);
            ctx.fillStyle = '#fff'; ctx.font = 'bold 24px "Courier New"'; ctx.textAlign = 'center';
            ctx.fillText("返回", cx, backY + diffH / 2 + 8);

            ctx.restore();
        }

        let hovered = (mouseScreenX >= pBtnX && mouseScreenX <= pBtnX + btnW && mouseScreenY >= pBtnY && mouseScreenY <= pBtnY + btnH);

        // PLAY 按鈕淡出，難度選擇淡入 (且只有在 menu 階段才顯示)
        if (gameState.phase === 'menu') {
            ctx.save();
            ctx.globalAlpha = 1.0 - gameState.difficultySelectionAlpha;
            if (ctx.globalAlpha > 0.01) {
                if (hovered && !gameState.playBtnHovered) {
                    gameState.playBtnHovered = true;
                    playSound(ASSETS.sfxButton, 1.0);
                } else if (!hovered) {
                    gameState.playBtnHovered = false;
                }

                canvas.style.cursor = hovered ? 'pointer' : 'crosshair';

                ctx.fillStyle = hovered ? '#e74c3c' : '#c0392b';
                if (hovered) {
                    ctx.shadowBlur = 20; ctx.shadowColor = '#e74c3c';
                }
                ctx.fillRect(pBtnX, pBtnY, btnW, btnH);
                ctx.strokeStyle = '#fff'; ctx.lineWidth = 4; ctx.strokeRect(pBtnX, pBtnY, btnW, btnH);
                ctx.fillStyle = '#fff'; ctx.font = 'bold 38px "Courier New"'; ctx.textBaseline = 'middle'; 
                ctx.fillText("PLAY", cx, pBtnY + btnH / 2 + 3);
            }
            ctx.restore();
        }

        ctx.globalAlpha = 1.0;
    }

    if (gameState.phase !== 'menu' && gameState.phase !== 'intro' && gameState.phase !== 'game_over') {
        // ⭐ Top-Left Info Card (Always visible except menu/intro/death) [Req 4]
        // Styled HUD (mirrors Map HUD) [Req 7]
        ctx.fillStyle = 'rgba(0,0,0,0.7)';
        ctx.fillRect(10, 10, 180, 75);
        ctx.strokeStyle = '#f1c40f'; ctx.lineWidth = 2;
        ctx.strokeRect(10, 10, 180, 75);

        ctx.fillStyle = '#f1c40f'; ctx.font = 'bold 16px "Courier New"'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
        ctx.fillText(`💰 ${player.coins}`, 20, 30);
        ctx.fillStyle = '#e74c3c';
        ctx.fillText(`❤ ${player.hp}/${player.maxHp}`, 20, 52);
        ctx.fillStyle = '#fff'; ctx.font = 'bold 14px "Courier New"';
        ctx.fillText(`👥 Units: ${player.unitCount}/${player.maxUnits}`, 20, 72);

        // ⭐ 頂部狀態文字（新 phase 系統）
        let stateText = '';
        let stateColor = '#9b59b6';
        if (gameState.phase === 'combat') {
            let timeLeft = Math.max(0, GAME_CONFIG.combatDuration - Math.floor(gameState.timer));
            stateText = `COMBAT (${timeLeft}s)`;
            stateColor = '#e74c3c';
        } else if (gameState.phase === 'tutorial_combat') {
            let timeLeft = Math.max(0, GAME_CONFIG.combatDuration - Math.floor(gameState.timer));
            stateText = `TUTORIAL COMBAT (${timeLeft}s)`;
            stateColor = '#e74c3c';
        } else if (gameState.phase === 'clearing' || gameState.phase === 'tutorial_clearing') {
            stateText = `CLEARING... (${enemies.length} left)`;
            stateColor = '#e67e22';
        } else if (gameState.phase === 'rest_shop') {
            stateText = gameState.isPremiumShop ? `PREMIUM SHOP (${Math.ceil(gameState.restTimer)}s)` : `SHOP (${Math.ceil(gameState.restTimer)}s)`;
            stateColor = '#2ecc71';
        } else if (gameState.phase === 'rest_house') {
            stateText = `REST HOUSE (${Math.ceil(gameState.restTimer)}s)`;
            stateColor = '#3498db';
        } else if (gameState.phase === 'rest_upgrade') {
            stateText = `UPGRADE STATION (${Math.ceil(gameState.restTimer)}s)`;
            stateColor = '#9b59b6';
        } else if (gameState.phase === 'transition_in') {
            stateText = 'TRAVELLING...';
            stateColor = '#f1c40f';
        }

        if (stateText) {
            ctx.fillStyle = stateColor;
            ctx.font = 'bold 22px "Courier New"'; ctx.textAlign = 'center';
            ctx.fillText(stateText, canvas.width / 2, 40);
        }

        let panelH = (canvas.height / 2) * (gameState.backpackAnimVal || 0);
        const uiY = canvas.height - panelH - 70;

        ctx.fillStyle = '#34495e'; ctx.fillRect(20, uiY - 25, 30, 20);
        ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.moveTo(35, uiY - 22); ctx.lineTo(45, uiY - 8); ctx.lineTo(25, uiY - 8); ctx.fill();

        function drawSummonBox(x, item, index, animScale) {
            let isSelected = (player.selectedSlot === index) && !player.deleteMode;
            let affordable = player.coins >= item.cost;

            ctx.save();
            ctx.translate(x + 30, uiY + 25);
            ctx.scale(animScale, animScale);
            ctx.translate(-(x + 30), -(uiY + 25));

            ctx.fillStyle = !affordable ? '#bdc3c7' : (isSelected ? '#f39c12' : '#ffffff');
            ctx.fillRect(x, uiY, 60, 50); ctx.strokeStyle = '#2c3e50'; ctx.lineWidth = 3; ctx.strokeRect(x, uiY, 60, 50);
            ctx.fillStyle = isSelected ? '#ffffff' : '#2c3e50'; ctx.font = 'bold 12px "Courier New"'; ctx.textAlign = 'left'; ctx.fillText(item.name, x + 3, uiY + 14);

            // 將召喚金額改為顯示庫存數量
            ctx.fillStyle = (item.count > 0) ? (isSelected ? '#ffffff' : '#f1c40f') : '#7f8c8d';
            ctx.font = 'bold 12px "Courier New"'; ctx.textAlign = 'right';
            ctx.fillText('x' + item.count, x + 57, uiY + 45);

            ctx.save(); ctx.translate(x + 30, uiY + 32);
            if (item.category === 'unit') {
                if (item.id === 'archer' || item.drawType === 1) { drawCircle(0, 0, 10, GAME_CONFIG.archerColor); ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(0, -1); ctx.lineTo(6, -6); ctx.stroke(); }
                else if (item.id === 'cannon' || item.drawType === 2) { drawCircle(0, 3, 11, GAME_CONFIG.cannonColor, 1.2, 0.8); ctx.strokeStyle = '#2c3e50'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(10, -6); ctx.stroke(); }
                else if (item.id === 'swordsman' || item.drawType === 3) { drawCircle(0, 0, 10, GAME_CONFIG.swordsmanColor); ctx.strokeStyle = '#ecf0f1'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(-3, 3); ctx.lineTo(6, -6); ctx.stroke(); }
                else if (item.id === 'pistol' || item.drawType === 10) {
                    drawCircle(0, 0, 10, GAME_CONFIG.pistolColor);
                    ctx.fillStyle = '#7f8c8d'; ctx.fillRect(2, -2, 8, 3); // 槍管
                }
            } else {
                ctx.fillStyle = item.color || '#8B4513'; ctx.strokeStyle = item.strokeColor || '#5c2a08'; ctx.lineWidth = 2; ctx.beginPath();
                let dType = item.drawType || item.type;
                if (dType === 1) ctx.rect(-10, -10, 20, 20);
                if (dType === 2) ctx.rect(-15, -5, 30, 10);
                if (dType === 3) { ctx.moveTo(0, -10); ctx.lineTo(10, 10); ctx.lineTo(-10, 10); ctx.closePath(); }
                if (dType === 4) { ctx.moveTo(-10, -10); ctx.lineTo(10, 10); ctx.lineTo(-10, 10); ctx.closePath(); }
                ctx.fill(); ctx.stroke();
            }
            ctx.restore();
            ctx.restore();
        }

        ctx.fillStyle = '#f1c40f'; ctx.font = 'bold 14px "Courier New"'; ctx.textAlign = 'left';
        ctx.fillText(`Row ${player.loadoutRow + 1}`, 60, uiY - 10);

        let offsetIndex = player.loadoutRow * 5;
        let scaleArr = gameState.slotScale || [1, 1, 1, 1, 1];
        for (let i = 0; i < 5; i++) {
            let loadoutIndex = offsetIndex + i;
            let boxX = 20 + i * 70;
            let item = player.loadout[loadoutIndex];
            if (item) {
                drawSummonBox(boxX, item, loadoutIndex, scaleArr[i]);
            } else {
                ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
                ctx.fillRect(boxX, uiY, 60, 50);
                ctx.strokeStyle = '#2c3e50'; ctx.lineWidth = 1;
                ctx.strokeRect(boxX, uiY, 60, 50);
            }

            ctx.fillStyle = '#fff'; ctx.font = 'bold 10px "Courier New"'; ctx.textAlign = 'center';
            let displayNum = (player.loadoutRow === 0) ? (i + 1) : (i + 6);
            ctx.fillText(displayNum, boxX + 30, uiY + 62);
        }

        ctx.fillStyle = '#fff'; ctx.font = 'bold 14px "Courier New"'; ctx.textAlign = 'right';
        // 如果 selectedSlot 指向的格子是 null (空格)，自動清除
        if (player.selectedSlot >= 0 && !player.loadout[player.selectedSlot]) {
            player.selectedSlot = -1;
        }
        let selItemObj = player.selectedSlot >= 0 ? player.loadout[player.selectedSlot] : null;
        let prompt = player.aimingUnit ? `Right Click: CONFIRM AIM` : `Right Click: DELETE MODE`;
        if (selItemObj && selItemObj.category === 'building' && !player.deleteMode) prompt += ` | R: ROTATE`;
        ctx.fillText(prompt, canvas.width - 60, canvas.height - panelH - 20);

        // ⭐ 背包切換按鈕
        let bpBtnX = canvas.width - 50;
        let bpBtnY = canvas.height - panelH - 50;
        ctx.fillStyle = gameState.backpackOpen ? '#f39c12' : '#34495e';
        ctx.fillRect(bpBtnX, bpBtnY, 30, 30);
        ctx.fillStyle = '#fff'; ctx.beginPath();
        if (gameState.backpackOpen) {
            ctx.moveTo(bpBtnX + 5, bpBtnY + 10); ctx.lineTo(bpBtnX + 25, bpBtnY + 10); ctx.lineTo(bpBtnX + 15, bpBtnY + 25);
        } else {
            ctx.moveTo(bpBtnX + 5, bpBtnY + 25); ctx.lineTo(bpBtnX + 25, bpBtnY + 25); ctx.lineTo(bpBtnX + 15, bpBtnY + 10);
        }
        ctx.fill();

        if (selItemObj && selItemObj.category === 'building' && !player.deleteMode) {
            let mWorldX = mouseScreenX + cameraX; let mWorldY = mouseScreenY;
            let previewB = { type: selItemObj.type, x: mWorldX, y: mWorldY, angle: player.buildAngle };
            let previewPoly = getBuildingVertices(previewB);
            let basePoly = [{ x: base.x, y: base.y }, { x: base.x + base.width, y: base.y }, { x: base.x + base.width, y: base.y + base.height }, { x: base.x, y: base.y + base.height }];

            let isConnected = polygonsTouch(previewPoly, basePoly, 2);
            if (!isConnected) {
                for (let b of buildings) {
                    if (b.state === 'dying' || !b.welded) continue;
                    let bPoly = getBuildingVertices(b);
                    if (polygonsTouch(previewPoly, bPoly, 2)) { isConnected = true; break; }
                }
            }

            let w = 40, h = 40; if (selItemObj.type === 2) { w = 80; h = 20; }
            let minRadius = Math.min(w, h) / 2;
            let overlapUnit = false;
            for (let u of units) {
                if (u.state === 'dying') continue;
                let dist = Math.hypot(mWorldX - u.x, mWorldY - u.y);
                if (dist < minRadius + u.radius + 2) { overlapUnit = true; break; }
            }

            ctx.save(); ctx.translate(mouseScreenX, mouseScreenY); ctx.rotate(player.buildAngle * Math.PI / 180);
            ctx.fillStyle = !overlapUnit ? (isConnected ? 'rgba(46, 204, 113, 0.6)' : 'rgba(241, 196, 15, 0.6)') : 'rgba(231, 76, 60, 0.6)';
            let ow = selItemObj.type === 2 ? 80 : 40; let oh = selItemObj.type === 2 ? 20 : 40;
            ctx.beginPath();
            if (selItemObj.type === 1 || selItemObj.type === 2) ctx.rect(-ow / 2, -oh / 2, ow, oh);
            else if (selItemObj.type === 3) { ctx.moveTo(0, -oh / 2); ctx.lineTo(ow / 2, oh / 2); ctx.lineTo(-ow / 2, oh / 2); }
            else if (selItemObj.type === 4) { ctx.moveTo(-ow / 2, -oh / 2); ctx.lineTo(ow / 2, oh / 2); ctx.lineTo(-ow / 2, oh / 2); }
            ctx.fill(); ctx.restore();
        }
    }

    if (!player.deleteMode && !gameState.playBtnHovered) {
        canvas.style.cursor = 'crosshair';
    }

    if (player.hp > 0) {
        let btnSize = 35; let btnX = canvas.width - 20 - btnSize; let btnY = 20;

        let sHovered = (mouseScreenX >= btnX && mouseScreenX <= btnX + btnSize && mouseScreenY >= btnY && mouseScreenY <= btnY + btnSize);
        gameState.setBtnHovered = sHovered;

        ctx.save();
        ctx.translate(btnX + btnSize / 2, btnY + btnSize / 2);
        ctx.scale(gameState.setBtnScale || 1.0, gameState.setBtnScale || 1.0);
        ctx.translate(-(btnX + btnSize / 2), -(btnY + btnSize / 2));

        if (ASSETS.imgSettings.complete && ASSETS.imgSettings.naturalWidth > 0) {
            ctx.drawImage(ASSETS.imgSettings, btnX, btnY, btnSize, btnSize);
        } else {
            ctx.fillStyle = '#7f8c8d'; ctx.fillRect(btnX, btnY, btnSize, btnSize);
            ctx.fillStyle = '#fff'; ctx.font = '10px Courier New'; ctx.textAlign = 'center'; ctx.fillText('SET', btnX + btnSize / 2, btnY + btnSize / 2 + 3);
        }
        ctx.strokeStyle = '#000'; ctx.lineWidth = 3; ctx.strokeRect(btnX, btnY, btnSize, btnSize);
        ctx.restore();

        if (gameState.phase !== 'menu') {
            let encyBtnSize = 50;
            let encyBtnX = canvas.width - 20 - encyBtnSize;
            let encyBtnY = 20 + btnSize + 15;
            let eHovered = (mouseScreenX >= encyBtnX && mouseScreenX <= encyBtnX + encyBtnSize && mouseScreenY >= encyBtnY && mouseScreenY <= encyBtnY + encyBtnSize);
            gameState.encyBtnHovered = eHovered;

            ctx.save();
            ctx.translate(encyBtnX + encyBtnSize / 2, encyBtnY + encyBtnSize / 2);
            ctx.scale(gameState.encyBtnScale || 1.0, gameState.encyBtnScale || 1.0);
            ctx.translate(-(encyBtnX + encyBtnSize / 2), -(encyBtnY + encyBtnSize / 2));

            ctx.fillStyle = eHovered ? '#2980b9' : '#3498db';
            ctx.fillRect(encyBtnX, encyBtnY, encyBtnSize, encyBtnSize);
            ctx.fillStyle = '#fff'; ctx.font = 'bold 16px "Courier New"'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
            ctx.fillText('圖鑑', encyBtnX + encyBtnSize / 2, encyBtnY + encyBtnSize / 2);
            ctx.strokeStyle = '#fff'; ctx.lineWidth = 3; ctx.strokeRect(encyBtnX, encyBtnY, encyBtnSize, encyBtnSize);
            ctx.restore();
        }

        // ⭐ 戰鬥計時警告（3秒閃爍）
        if ((gameState.phase === 'combat' || gameState.phase === 'tutorial_combat') &&
            (GAME_CONFIG.combatDuration - gameState.timer) <= 3.0) {
            if (Math.floor(gameTime * 4) % 2 === 0) {
                ctx.fillStyle = '#e74c3c'; ctx.font = 'bold 120px "Courier New"';
                ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
                ctx.fillText('!', canvas.width - 40, canvas.height / 2);
            }
        }

        // ⭐ 瞄準模式按鈕（戰鬥 + 休息站都顯示）
        let isCombatOrRest = (gameState.phase === 'combat' || gameState.phase === 'tutorial_combat' ||
            gameState.phase === 'clearing' || gameState.phase === 'tutorial_clearing' ||
            gameState.phase === 'rest_shop' || gameState.phase === 'rest_house' || gameState.phase === 'rest_upgrade');
        if (isCombatOrRest) {
            let isRest = (gameState.phase === 'rest_shop' || gameState.phase === 'rest_house' || gameState.phase === 'rest_upgrade' || gameState.phase === 'transition_to_rest');
            let aimBtnX = isRest ? 20 : canvas.width - 130;  // Position AIM away from shop overlap in rest [Req 4]
            let aimBtnY = isRest ? 200 : 20 + btnSize + 15 + 60;
            let aimBtnSize = 50;
            ctx.fillStyle = player.reaimMode ? '#f1c40f' : 'rgba(44,62,80,0.85)';
            ctx.fillRect(aimBtnX, aimBtnY, aimBtnSize, aimBtnSize);
            ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; ctx.strokeRect(aimBtnX, aimBtnY, aimBtnSize, aimBtnSize);
            ctx.save();
            ctx.translate(aimBtnX + aimBtnSize / 2, aimBtnY + aimBtnSize / 2);
            ctx.rotate(-Math.PI / 4);
            ctx.strokeStyle = player.reaimMode ? '#000' : '#fff'; ctx.lineWidth = 3; ctx.lineCap = 'round';
            ctx.beginPath();
            ctx.moveTo(-10, 0); ctx.lineTo(10, 0);
            ctx.moveTo(10, 0); ctx.lineTo(2, -8);
            ctx.moveTo(10, 0); ctx.lineTo(2, 8);
            ctx.stroke(); ctx.restore();
            ctx.fillStyle = player.reaimMode ? '#000' : '#fff';
            ctx.font = 'bold 10px "Courier New"'; ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';
            ctx.fillText('AIM', aimBtnX + aimBtnSize / 2, aimBtnY + aimBtnSize + 14);
        }
    } // end if phase !== menu/intro/map/game_over

    if (false) { /* gameState.phase === 'safezone_shop' (Moved to bottom) */ }

    if (gameState.settingsScale > 0.01) {
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.scale(gameState.settingsScale, gameState.settingsScale);
        ctx.translate(-canvas.width / 2, -canvas.height / 2);

        let menuW = 300; let menuH = 440; // 調整為 440
        let menuX = canvas.width / 2 - menuW / 2;
        let menuY = canvas.height / 2 - menuH / 2;

        ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
        ctx.beginPath();
        if (ctx.roundRect) ctx.roundRect(menuX, menuY, menuW, menuH, 15);
        else ctx.rect(menuX, menuY, menuW, menuH);
        ctx.fill();
        ctx.strokeStyle = '#f1c40f'; ctx.lineWidth = 3; ctx.stroke();

        ctx.fillStyle = '#fff'; ctx.font = 'bold 24px "Courier New"'; ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';
        ctx.fillText('設定 (SETTINGS)', canvas.width / 2, menuY + 40);

        // 音樂音量拉條
        ctx.fillStyle = '#1a252f';
        ctx.fillRect(menuX + 50, menuY + 80, 200, 40);
        ctx.fillStyle = '#3498db';
        ctx.fillRect(menuX + 50, menuY + 80, 200 * GAME_CONFIG.musicVolume, 40);
        let mKnobX = menuX + 50 + 200 * GAME_CONFIG.musicVolume;
        ctx.fillStyle = '#ecf0f1';
        ctx.beginPath(); ctx.arc(mKnobX, menuY + 100, 8, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = '#2c3e50'; ctx.lineWidth = 2; ctx.strokeRect(menuX + 50, menuY + 80, 200, 40);
        ctx.fillStyle = '#fff'; ctx.font = 'bold 18px "Courier New"'; ctx.textBaseline = 'middle';
        ctx.fillText(`音樂音量: ${Math.round(GAME_CONFIG.musicVolume * 100)}%`, canvas.width / 2, menuY + 100);

        // 音效音量拉條
        ctx.fillStyle = '#1a252f';
        ctx.fillRect(menuX + 50, menuY + 140, 200, 40);
        ctx.fillStyle = '#e67e22';
        ctx.fillRect(menuX + 50, menuY + 140, 200 * GAME_CONFIG.sfxVolume, 40);
        let sKnobX = menuX + 50 + 200 * GAME_CONFIG.sfxVolume;
        ctx.fillStyle = '#ecf0f1';
        ctx.beginPath(); ctx.arc(sKnobX, menuY + 160, 8, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = '#2c3e50'; ctx.lineWidth = 2; ctx.strokeRect(menuX + 50, menuY + 140, 200, 40);
        ctx.fillStyle = '#fff';
        ctx.fillText(`音效音量: ${Math.round(GAME_CONFIG.sfxVolume * 100)}%`, canvas.width / 2, menuY + 160);

        // 血條與傷害開關
        let switchY = menuY + 200;
        ctx.font = 'bold 14px "Courier New"'; // 縮小一點點字體
        ctx.textAlign = 'left';

        // 單位血條
        ctx.fillStyle = GAME_CONFIG.showUnitHp ? '#2ecc71' : '#e74c3c';
        ctx.fillRect(menuX + 50, switchY, 30, 20);
        ctx.fillStyle = '#fff';
        ctx.fillText(`單位血條: ${GAME_CONFIG.showUnitHp ? 'ON' : 'OFF'}`, menuX + 90, switchY + 15);

        // 敵人血條
        switchY += 30;
        ctx.fillStyle = GAME_CONFIG.showEnemyHp ? '#2ecc71' : '#e74c3c';
        ctx.fillRect(menuX + 50, switchY, 30, 20);
        ctx.fillStyle = '#fff';
        ctx.fillText(`敵人血條: ${GAME_CONFIG.showEnemyHp ? 'ON' : 'OFF'}`, menuX + 90, switchY + 15);

        // 傷害飄字 (敵方)
        switchY += 30;
        ctx.fillStyle = GAME_CONFIG.showDamageText ? '#2ecc71' : '#e74c3c';
        ctx.fillRect(menuX + 50, switchY, 30, 20);
        ctx.fillStyle = '#fff';
        ctx.fillText(`敵人傷害數字: ${GAME_CONFIG.showDamageText ? 'ON' : 'OFF'}`, menuX + 90, switchY + 15);

        // 傷害飄字 (我方)
        switchY += 30;
        ctx.fillStyle = GAME_CONFIG.showUnitDamageText ? '#2ecc71' : '#e74c3c';
        ctx.fillRect(menuX + 50, switchY, 30, 20);
        ctx.fillStyle = '#fff';
        ctx.fillText(`我方傷害數字: ${GAME_CONFIG.showUnitDamageText ? 'ON' : 'OFF'}`, menuX + 90, switchY + 15);

        ctx.restore();
    }

    // --- 繪製圖鑑面板 ---
    if (gameState.encyclopediaScale > 0.01) {
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.scale(gameState.encyclopediaScale, gameState.encyclopediaScale);
        ctx.translate(-canvas.width / 2, -canvas.height / 2);

        let menuW = 600; let menuH = 400;
        let menuX = canvas.width / 2 - menuW / 2;
        let menuY = canvas.height / 2 - menuH / 2;

        ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
        ctx.beginPath();
        if (ctx.roundRect) ctx.roundRect(menuX, menuY, menuW, menuH, 15);
        else ctx.rect(menuX, menuY, menuW, menuH);
        ctx.fill();
        ctx.strokeStyle = '#3498db'; ctx.lineWidth = 4; ctx.stroke();

        // 關閉按鈕
        let cxBtnX = menuX + menuW - 40;
        let cxBtnY = menuY + 10;
        let cxBtnSize = 30;
        gameState.encyCloseBtnHovered = (mouseScreenX >= cxBtnX && mouseScreenX <= cxBtnX + cxBtnSize && mouseScreenY >= cxBtnY && mouseScreenY <= cxBtnY + cxBtnSize);

        ctx.save();
        ctx.translate(cxBtnX + cxBtnSize / 2, cxBtnY + cxBtnSize / 2);
        ctx.scale(gameState.encyCloseBtnScale || 1.0, gameState.encyCloseBtnScale || 1.0);
        ctx.translate(-(cxBtnX + cxBtnSize / 2), -(cxBtnY + cxBtnSize / 2));

        ctx.fillStyle = '#e74c3c'; ctx.fillRect(cxBtnX, cxBtnY, cxBtnSize, cxBtnSize);
        ctx.fillStyle = '#fff'; ctx.font = 'bold 20px "Courier New"'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText('X', cxBtnX + cxBtnSize / 2, cxBtnY + cxBtnSize / 2);
        ctx.restore();

        if (!gameState.encyclopediaSelectedTarget) {
            // --- 圖鑑列表畫面 ---
            ctx.fillStyle = '#fff'; ctx.font = 'bold 24px "Courier New"'; ctx.textAlign = 'center';
            ctx.fillText('圖鑑 (Encyclopedia)', canvas.width / 2, menuY + 30);

            let tabW = 180;
            let tabsStartX = menuX + 30;
            let tabs = [
                { id: 'unit', text: '單位 (Units)' },
                { id: 'building', text: '建築 (Buildings)' },
                { id: 'enemy', text: '敵人 (Enemies)' }
            ];

            for (let i = 0; i < tabs.length; i++) {
                let tx = tabsStartX + i * tabW;
                let ty = menuY + 50;
                let isSel = gameState.encyclopediaCategory === tabs[i].id;
                ctx.fillStyle = isSel ? '#3498db' : '#2c3e50';
                ctx.fillRect(tx, ty, tabW, 40);
                ctx.strokeStyle = '#000'; ctx.lineWidth = 2; ctx.strokeRect(tx, ty, tabW, 40);
                ctx.fillStyle = '#fff'; ctx.font = 'bold 18px "Courier New"';
                ctx.fillText(tabs[i].text, tx + tabW / 2, ty + 20);
            }

            ctx.save();
            ctx.beginPath(); ctx.rect(menuX, menuY + 90, menuW, menuH - 90); ctx.clip();

            let items = getEncyclopediaItems(gameState.encyclopediaCategory);

            let cols = 4; let boxSize = 100; let gap = 30;
            let startX = menuX + 55;
            let startY = menuY + 110 + gameState.encyclopediaScrollY;

            for (let i = 0; i < items.length; i++) {
                let item = items[i];
                let r = Math.floor(i / cols);
                let c = i % cols;
                let bx = startX + c * (boxSize + gap);
                let by = startY + r * (boxSize + gap);

                let hoverBox = (mouseScreenX >= bx && mouseScreenX <= bx + boxSize && mouseScreenY >= by && mouseScreenY <= by + boxSize && mouseScreenY > menuY + 90);

                // ⭐ 繪製底框，加強對比
                ctx.fillStyle = (hoverBox && item.unlocked) ? '#2c3e50' : (item.unlocked ? '#1a252f' : '#0d1117');
                ctx.fillRect(bx, by, boxSize, boxSize);
                ctx.strokeStyle = item.unlocked ? '#bdc3c7' : '#1a252f';
                ctx.lineWidth = 2; ctx.strokeRect(bx, by, boxSize, boxSize);

                // ⭐ 畫縮圖，並確保強制傳遞精準的 Boolean 狀態進去
                ctx.save();
                ctx.translate(bx + boxSize / 2, by + boxSize / 2);
                ctx.scale(1.5, 1.5);
                drawEncyclopediaIcon(item, ctx, !!item.unlocked);
                ctx.restore();

                // 名稱
                ctx.fillStyle = item.unlocked ? '#fff' : '#4a5359';
                ctx.font = 'bold 14px "Courier New"'; ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';
                ctx.fillText(item.unlocked ? item.name : '???', bx + boxSize / 2, by + boxSize - 10);
            }
            ctx.restore();

        } else {
            // --- 詳細資料畫面 ---
            let item = gameState.encyclopediaSelectedTarget;

            let backHover = (mouseScreenX >= menuX + 20 && mouseScreenX <= menuX + 100 && mouseScreenY >= menuY + 15 && mouseScreenY <= menuY + 45);
            ctx.fillStyle = backHover ? '#95a5a6' : '#7f8c8d';
            ctx.fillRect(menuX + 20, menuY + 15, 80, 30);
            ctx.fillStyle = '#fff'; ctx.font = 'bold 16px "Courier New"'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
            ctx.fillText('<- 返回', menuX + 60, menuY + 30);

            ctx.fillStyle = '#2c3e50'; ctx.fillRect(menuX + 40, menuY + 80, 200, 200);
            ctx.strokeStyle = '#3498db'; ctx.strokeRect(menuX + 40, menuY + 80, 200, 200);

            ctx.save();
            ctx.translate(menuX + 140, menuY + 180);
            ctx.scale(3.0, 3.0);
            drawEncyclopediaIcon(item, ctx, true);
            ctx.restore();

            ctx.fillStyle = '#f1c40f'; ctx.font = 'bold 28px "Courier New"'; ctx.textAlign = 'center';
            ctx.fillText(item.name, menuX + 140, menuY + 310);

            let rightX = menuX + 280;
            let rightY = menuY + 80;
            let rightW = 280;
            let rightH = 280;

            ctx.fillStyle = '#34495e'; ctx.fillRect(rightX, rightY, rightW, rightH);
            ctx.strokeStyle = '#bdc3c7'; ctx.strokeRect(rightX, rightY, rightW, rightH);

            ctx.save();
            ctx.beginPath(); ctx.rect(rightX, rightY, rightW, rightH); ctx.clip();

            ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
            ctx.font = 'bold 20px "Courier New"';
            let textY = rightY + 30 + gameState.encyclopediaDetailScrollY;
            let lineGap = 45;

            ctx.fillStyle = '#ecf0f1';

            if (item.type === 'unit') {
                ctx.fillText(`攻擊力   : ${item.dmg}`, rightX + 20, textY); textY += lineGap;
                ctx.fillText(`血量     : ${item.hp}`, rightX + 20, textY); textY += lineGap;
                ctx.fillText(`攻擊冷卻 : ${item.aspd}s`, rightX + 20, textY); textY += lineGap;
            } else if (item.type === 'building') {
                ctx.fillText(`血量     : ${item.hp}`, rightX + 20, textY); textY += lineGap;
            } else if (item.type === 'enemy') {
                ctx.fillText(`血量     : ${item.hp}`, rightX + 20, textY); textY += lineGap;
                if (item.shieldHp) {
                    ctx.fillText(`盾牌血量 : ${item.shieldHp}`, rightX + 20, textY); textY += lineGap;
                }
                if (item.planeHp) {
                    ctx.fillText(`飛機血量 : ${item.planeHp}`, rightX + 20, textY); textY += lineGap;
                }
                if (item.armorHp) {
                    ctx.fillText(`鐵甲血量 : ${item.armorHp}`, rightX + 20, textY); textY += lineGap;
                }
                if (item.splitCount) {
                    ctx.fillText(`分裂數量 : ${item.splitCount}`, rightX + 20, textY); textY += lineGap;
                }
                if (item.reward !== undefined) {
                    ctx.fillStyle = '#f1c40f';
                    ctx.fillText(`掉落金幣 : $${item.reward}`, rightX + 20, textY); textY += lineGap;
                    ctx.fillStyle = '#ecf0f1';
                }
                if (item.range) {
                    ctx.fillText(`攻擊距離 : ${item.range}`, rightX + 20, textY); textY += lineGap;
                }
                if (item.aspd) {
                    ctx.fillText(`攻擊頻率 : ${item.aspd}s`, rightX + 20, textY); textY += lineGap;
                }
                ctx.fillText(`傷害     : ${item.dmg}`, rightX + 20, textY); textY += lineGap;
                ctx.fillText(`速度     : ${item.speed}`, rightX + 20, textY); textY += lineGap;
                if (item.jump) {
                    ctx.fillText(`跳躍高度 : ${item.jump}`, rightX + 20, textY); textY += lineGap;
                }
            }
            ctx.restore();
        }

        ctx.restore();
    }

    // ⭐ 繪製底層背包大面板
    if (gameState.backpackAnimVal > 0.01) {
        let panelH = (canvas.height / 2) * gameState.backpackAnimVal;
        let panelY = canvas.height - panelH;

        ctx.fillStyle = 'rgba(20, 25, 30, 0.95)';
        ctx.fillRect(0, panelY, canvas.width, panelH);

        ctx.strokeStyle = '#f39c12'; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(0, panelY); ctx.lineTo(canvas.width, panelY); ctx.stroke();

        // 左 1/3 切割線
        let sepX = Math.round(canvas.width * 0.42);
        ctx.strokeStyle = '#34495e'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(sepX, panelY); ctx.lineTo(sepX, canvas.height); ctx.stroke();

        if (panelH > 40) {
            // == 右側庫存 (Inventory) ==
            let invX = sepX + 20;
            let invW = canvas.width - invX;
            let invY = panelY + 20;

            let tabW = 80; let tabH = 30;
            let tabX = canvas.width - (tabW * 3) - 20;
            let tabs = [
                { id: 'all', label: '1:全部' }, { id: 'unit', label: '2:單位' }, { id: 'building', label: '3:建築' }
            ];

            for (let i = 0; i < 3; i++) {
                let t = tabs[i]; let tx = tabX + i * tabW;
                ctx.fillStyle = (gameState.backpackTab === t.id) ? '#f39c12' : '#2c3e50';
                ctx.fillRect(tx, invY, tabW, tabH);
                ctx.strokeStyle = '#fff'; ctx.lineWidth = 1; ctx.strokeRect(tx, invY, tabW, tabH);
                ctx.fillStyle = '#fff'; ctx.font = 'bold 14px "Courier New"'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                ctx.fillText(t.label, tx + tabW / 2, invY + tabH / 2 + 2);
            }

            // 繪製網格與滾動區域
            let gridY = invY + tabH + 20;
            let gridW = 60; let gridH = 50; let gap = 15;
            let cols = 7;

            let itemsToDraw = player.inventory.filter(item => {
                if (gameState.backpackTab === 'all') return true;
                return item.category === gameState.backpackTab;
            });

            ctx.save();
            ctx.beginPath(); ctx.rect(invX, gridY, invW, canvas.height - gridY); ctx.clip();
            ctx.translate(0, gameState.backpackScrollY);

            let totalDrawn = Math.max(35, Math.ceil(itemsToDraw.length / cols) * cols);
            for (let i = 0; i < totalDrawn; i++) {
                let r = Math.floor(i / cols); let c = i % cols;
                let bx = invX + c * (gridW + gap);
                let by = gridY + r * (gridH + gap);

                if (i < itemsToDraw.length) {
                    let item = itemsToDraw[i];
                    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)'; ctx.fillRect(bx, by, gridW, gridH);
                    ctx.strokeStyle = '#34495e'; ctx.lineWidth = 2; ctx.strokeRect(bx, by, gridW, gridH);

                    ctx.fillStyle = '#ecf0f1'; ctx.font = 'bold 12px "Courier New"'; ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
                    ctx.fillText(item.name, bx + 3, by + 14);

                    ctx.save(); ctx.translate(bx + 30, by + 32);
                    if (item.category === 'unit') {
                        if (item.drawType === 1 || item.id === 'archer') { drawCircle(0, 0, 10, GAME_CONFIG.archerColor); ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(0, -1); ctx.lineTo(6, -6); ctx.stroke(); }
                        else if (item.drawType === 2 || item.id === 'cannon') { drawCircle(0, 3, 11, GAME_CONFIG.cannonColor, 1.2, 0.8); ctx.strokeStyle = '#2c3e50'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(10, -6); ctx.stroke(); }
                        else if (item.drawType === 3 || item.id === 'swordsman') { drawCircle(0, 0, 10, GAME_CONFIG.swordsmanColor); ctx.strokeStyle = '#ecf0f1'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(-3, 3); ctx.lineTo(6, -6); ctx.stroke(); }
                        else if (item.id === 'pistol' || item.drawType === 10) {
                            drawCircle(0, 0, 10, GAME_CONFIG.pistolColor);
                            ctx.fillStyle = '#7f8c8d'; ctx.fillRect(2, -2, 8, 3); // 槍管
                        }
                    } else {
                        ctx.fillStyle = item.color || '#8B4513'; ctx.strokeStyle = item.strokeColor || '#5c2a08'; ctx.lineWidth = 2; ctx.beginPath();
                        let dType = item.drawType || item.type;
                        if (dType === 1) ctx.rect(-10, -10, 20, 20);
                        if (dType === 2) ctx.rect(-15, -5, 30, 10);
                        if (dType === 3) { ctx.moveTo(0, -10); ctx.lineTo(10, 10); ctx.lineTo(-10, 10); ctx.closePath(); }
                        if (dType === 4) { ctx.moveTo(-10, -10); ctx.lineTo(10, 10); ctx.lineTo(-10, 10); ctx.closePath(); }
                        ctx.fill(); ctx.stroke();
                    }
                    ctx.restore();

                    // ⭐ 必須加上 l 的空値檢查！loadout 可能包含 null 格
                    let isEquipped = player.loadout.some(l => l !== null && l !== undefined && l.id === item.id);
                    isEquipped = isEquipped && !gameState.draggedItem; // 拖曳中不顯示勾勾
                    if (isEquipped) {
                        ctx.fillStyle = 'rgba(46, 204, 113, 0.4)'; ctx.fillRect(bx, by, gridW, gridH);
                        ctx.fillStyle = '#2ecc71'; ctx.font = 'bold 12px "Courier New"'; ctx.textAlign = 'right'; ctx.textBaseline = 'alphabetic';
                        ctx.fillText("✔️", bx + gridW - 3, by + gridH - 18);
                    }

                    // ⭐ 顯示背包物品庫存數量
                    ctx.fillStyle = '#f1c40f'; ctx.font = 'bold 11px "Courier New"'; ctx.textAlign = 'right';
                    ctx.fillText('x' + (item.count || 0), bx + gridW - 3, by + gridH - 5);
                } else {
                    ctx.fillStyle = 'rgba(255, 255, 255, 0.05)'; ctx.fillRect(bx, by, gridW, gridH);
                    ctx.strokeStyle = '#2c3e50'; ctx.lineWidth = 1; ctx.strokeRect(bx, by, gridW, gridH);
                }
            }
            ctx.restore();

            // == 左側 Loadout 10 格裝備欄尺寸 (放大版) ==
            let lSlotW = 70; let lSlotH = 62; let lGap = 6;
            let lCols = 5;
            // 計算整個 10 格區域的起始位置 (在面板左 1/3 中置中)
            let lTotalW = lCols * lSlotW + (lCols - 1) * lGap;
            let lStartX = Math.max(4, Math.round((sepX - lTotalW) / 2));
            let lRow1Y = panelY + 26;
            let lRow2Y = lRow1Y + lSlotH + lGap + 14;

            // 標題
            ctx.fillStyle = '#f39c12'; ctx.font = 'bold 11px "Courier New"'; ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';
            ctx.fillText('ROW 1', lStartX + lTotalW / 2, lRow1Y - 4);
            ctx.fillText('ROW 2', lStartX + lTotalW / 2, lRow2Y - 4);

            function drawLoadoutSlot(slotIndex, bx, by) {
                let slotItem = player.loadout[slotIndex];
                let isBeingDraggedFrom = gameState.dragSource === 'loadout' && gameState.dragSourceIndex === slotIndex;

                // 是否為拖曳放置目標候選格 (滑鼠在上方)
                let isHoveredTarget = gameState.draggedItem &&
                    mouseScreenX >= bx && mouseScreenX <= bx + lSlotW &&
                    mouseScreenY >= by && mouseScreenY <= by + lSlotH;

                if (isHoveredTarget) {
                    ctx.fillStyle = 'rgba(243, 156, 18, 0.45)';
                } else if (slotItem) {
                    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
                } else {
                    ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
                }
                ctx.fillRect(bx, by, lSlotW, lSlotH);

                // 外框顏色
                ctx.strokeStyle = isHoveredTarget ? '#f39c12' : (slotItem ? '#7f8c8d' : '#2c3e50');
                ctx.lineWidth = isHoveredTarget ? 2 : 1;
                ctx.strokeRect(bx, by, lSlotW, lSlotH);

                // 格子號碼
                ctx.fillStyle = '#566573'; ctx.font = 'bold 9px "Courier New"'; ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
                ctx.fillText(slotIndex + 1, bx + 3, by + 10);

                if (slotItem) {
                    // 名稱
                    ctx.fillStyle = '#ecf0f1'; ctx.font = 'bold 9px "Courier New"'; ctx.textAlign = 'right';
                    ctx.fillText(slotItem.name, bx + lSlotW - 3, by + 10);

                    // 圖示
                    ctx.save(); ctx.translate(bx + lSlotW / 2, by + lSlotH / 2 + 5);
                    if (slotItem.category === 'unit') {
                        if (slotItem.drawType === 1 || slotItem.id === 'archer') { drawCircle(0, 0, 9, GAME_CONFIG.archerColor); ctx.strokeStyle = '#fff'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(0, -1); ctx.lineTo(5, -5); ctx.stroke(); }
                        else if (slotItem.drawType === 2 || slotItem.id === 'cannon') { drawCircle(0, 3, 10, GAME_CONFIG.cannonColor, 1.2, 0.8); ctx.strokeStyle = '#2c3e50'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(8, -5); ctx.stroke(); }
                        else if (slotItem.drawType === 3 || slotItem.id === 'swordsman') { drawCircle(0, 0, 9, GAME_CONFIG.swordsmanColor); ctx.strokeStyle = '#ecf0f1'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(-2, 2); ctx.lineTo(5, -5); ctx.stroke(); }
                        else if (slotItem.id === 'pistol' || slotItem.drawType === 10) {
                            drawCircle(0, 0, 9, GAME_CONFIG.pistolColor);
                            ctx.fillStyle = '#7f8c8d'; ctx.fillRect(2, -2, 7, 3); // 槍管
                        }
                    } else {
                        ctx.fillStyle = slotItem.color || '#8B4513'; ctx.strokeStyle = slotItem.strokeColor || '#5c2a08'; ctx.lineWidth = 1.5; ctx.beginPath();
                        let dType = slotItem.drawType || slotItem.type;
                        if (dType === 1) ctx.rect(-9, -9, 18, 18);
                        if (dType === 2) ctx.rect(-13, -4, 26, 8);
                        if (dType === 3) { ctx.moveTo(0, -9); ctx.lineTo(9, 9); ctx.lineTo(-9, 9); ctx.closePath(); }
                        if (dType === 4) { ctx.moveTo(-9, -9); ctx.lineTo(9, 9); ctx.lineTo(-9, 9); ctx.closePath(); }
                        ctx.fill(); ctx.stroke();
                    }
                    ctx.restore();

                    // 顯示庫存數量而非金額
                    ctx.fillStyle = (slotItem.count > 0) ? '#f1c40f' : '#7f8c8d';
                    ctx.font = 'bold 11px "Courier New"'; ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';
                    ctx.fillText('x' + slotItem.count, bx + lSlotW / 2, by + lSlotH - 3);
                } else if (isHoveredTarget) {
                    // 空格子 + 拖曳中：顯示「放這裡」提示
                    ctx.fillStyle = '#f39c12'; ctx.font = 'bold 18px "Courier New"'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                    ctx.fillText('+', bx + lSlotW / 2, by + lSlotH / 2);
                }
            }

            // Row 1 (slots 0-4)
            for (let i = 0; i < 5; i++) {
                drawLoadoutSlot(i, lStartX + i * (lSlotW + lGap), lRow1Y);
            }
            // Row 2 (slots 5-9)
            for (let i = 0; i < 5; i++) {
                drawLoadoutSlot(i + 5, lStartX + i * (lSlotW + lGap), lRow2Y);
            }

            // 操作提示
            ctx.fillStyle = '#7f8c8d'; ctx.font = '10px "Courier New"'; ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';
            ctx.fillText('從右側拖曳物品到格子', sepX / 2, lRow2Y + lSlotH + 14);
        }
    }

    if (player.deleteMode) {
        canvas.style.cursor = 'none';

        ctx.save();
        ctx.strokeStyle = '#e74c3c'; ctx.lineWidth = 3;
        ctx.beginPath();
        let mWX = mouseScreenX; let mWY = mouseScreenY;
        ctx.moveTo(mWX - 15, mWY); ctx.lineTo(mWX + 15, mWY);
        ctx.moveTo(mWX, mWY - 15); ctx.lineTo(mWX, mWY + 15);
        ctx.stroke();
        ctx.restore();

        player.hoveredEntity = null;
        let mWorldX = mouseScreenX + cameraX; let mWorldY = mouseScreenY; let minDist = Infinity;

        // ⭐ Offset the mouse coordinates by the backpack push so detection works in upper screen
        let wYOffset = (gameState.backpackAnimVal || 0) * (-canvas.height / 2);
        mWorldY -= wYOffset;

        units.forEach(u => {
            if (u.state === 'dying') return;
            let dist = Math.hypot(mWorldX - u.x, mWorldY - u.y);
            if (dist < u.radius + 15 && dist < minDist) {
                minDist = dist;
                player.hoveredEntity = { type: 'unit', ref: u };
            }
        });

        buildings.forEach(b => {
            if (b.state === 'dying') return;
            let bPoly = getBuildingVertices(b);
            if (isPointInPolygon(mWorldX, mWorldY, bPoly)) {
                let dist = Math.hypot(mWorldX - b.x, mWorldY - b.y);
                if (dist + 20 < minDist) {
                    minDist = dist + 20;
                    player.hoveredEntity = { type: 'building', ref: b };
                }
            }
        });

        if (player.hoveredEntity) {
            let ent = player.hoveredEntity;
            let bounds = { minX: 0, maxX: 0, minY: 0, maxY: 0 };
            if (ent.type === 'unit') {
                bounds = {
                    minX: ent.ref.x - ent.ref.radius, maxX: ent.ref.x + ent.ref.radius,
                    minY: ent.ref.y - ent.ref.radius, maxY: ent.ref.y + ent.ref.radius
                };
            } else {
                let p = getBuildingVertices(ent.ref);
                bounds.minX = Math.min(...p.map(pt => pt.x)); bounds.maxX = Math.max(...p.map(pt => pt.x));
                bounds.minY = Math.min(...p.map(pt => pt.y)); bounds.maxY = Math.max(...p.map(pt => pt.y));
            }

            let boxX = bounds.minX - cameraX - 5;
            let boxY = bounds.minY - 5 + wYOffset;
            let boxW = bounds.maxX - bounds.minX + 10;
            let boxH = bounds.maxY - bounds.minY + 10;

            ctx.save();
            ctx.setLineDash([5, 5]);
            ctx.lineDashOffset = -gameTime * 20;
            ctx.strokeStyle = '#e74c3c'; ctx.lineWidth = 2;
            ctx.strokeRect(boxX, boxY, boxW, boxH);

            let bounceOffset = Math.sin(gameTime * 5) * 3;
            let targetY = boxY - 10;

            ctx.fillStyle = '#c0392b';
            ctx.beginPath();
            ctx.moveTo(ent.ref.x - cameraX, targetY + bounceOffset);
            ctx.lineTo(ent.ref.x - 5 - cameraX, targetY - 10 + bounceOffset);
            ctx.lineTo(ent.ref.x + 5 - cameraX, targetY - 10 + bounceOffset);
            ctx.fill();

            ctx.font = 'bold 12px "Courier New"'; ctx.textAlign = 'center'; ctx.fillStyle = '#fff';
            ctx.fillText("DELETE", ent.ref.x - cameraX, targetY - 15 + bounceOffset);

            ctx.restore();
        }
    } else if (!gameState.playBtnHovered) {
        canvas.style.cursor = 'crosshair';
    }

    if (gameState.draggedItem) {
        let item = gameState.draggedItem;
        ctx.save();
        ctx.translate(mouseScreenX, mouseScreenY);
        ctx.scale(1.2, 1.2);
        ctx.globalAlpha = 0.8;

        ctx.fillStyle = 'rgba(0, 0, 0, 0.6)'; ctx.fillRect(-30, -25, 60, 50);
        ctx.strokeStyle = '#e67e22'; ctx.lineWidth = 3; ctx.strokeRect(-30, -25, 60, 50);

        ctx.save();
        if (item.category === 'unit') {
            if (item.drawType === 1) { drawCircle(0, 0, 10, GAME_CONFIG.archerColor); ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(0, -1); ctx.lineTo(6, -6); ctx.stroke(); }
            else if (item.drawType === 2) { drawCircle(0, 3, 11, GAME_CONFIG.cannonColor, 1.2, 0.8); ctx.strokeStyle = '#2c3e50'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(10, -6); ctx.stroke(); }
            else if (item.drawType === 3) { drawCircle(0, 0, 10, GAME_CONFIG.swordsmanColor); ctx.strokeStyle = '#ecf0f1'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(-3, 3); ctx.lineTo(6, -6); ctx.stroke(); }
        } else {
            ctx.fillStyle = item.color || '#8B4513'; ctx.strokeStyle = item.strokeColor || '#5c2a08'; ctx.lineWidth = 2; ctx.beginPath();
            if (item.drawType === 1) ctx.rect(-10, -10, 20, 20);
            if (item.drawType === 2) ctx.rect(-15, -5, 30, 10);
            if (item.drawType === 3) { ctx.moveTo(0, -10); ctx.lineTo(10, 10); ctx.lineTo(-10, 10); ctx.closePath(); }
            if (item.drawType === 4) { ctx.moveTo(-10, -10); ctx.lineTo(10, 10); ctx.lineTo(-10, 10); ctx.closePath(); }
            ctx.fill(); ctx.stroke();
        }
        ctx.restore();
        ctx.restore();
    }

    // ⭐ 商店休息站面板
    if (gameState.phase === 'rest_shop') {
        let sx = canvas.width - 340; let sw = 320; let sh = 400;
        let sy = 80; if (canvas.height < 700) sy = 20;

        // Shift panel UP if backpack is open [Req 1]
        let bpShift = (gameState.backpackAnimVal || 0) * 150;
        sy -= bpShift;
        let shopLabel = gameState.isPremiumShop ? '★ PREMIUM SHOP ★' : 'SHOP';
        let borderColor = gameState.isPremiumShop ? '#f39c12' : '#f1c40f';

        ctx.fillStyle = 'rgba(20,30,50,0.92)';
        ctx.fillRect(sx, sy, sw, sh);
        ctx.strokeStyle = borderColor; ctx.lineWidth = 4; ctx.strokeRect(sx, sy, sw, sh);

        let cx2 = sx + sw / 2;
        ctx.fillStyle = gameState.isPremiumShop ? '#f39c12' : '#2ecc71';
        ctx.font = 'bold 22px "Courier New"'; ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';
        ctx.fillText(shopLabel, cx2, sy + 35);
        ctx.fillStyle = '#fff'; ctx.font = 'bold 14px "Courier New"';
        ctx.fillText(`離開倒數: ${Math.ceil(gameState.restTimer)}s`, cx2, sy + 60);

        // 刷新按鈕
        let refreshCost = gameState.isPremiumShop ? GAME_CONFIG.premiumShopRefreshCost : GAME_CONFIG.shopRefreshCost;
        let canRefresh = player.coins >= refreshCost;
        ctx.fillStyle = canRefresh ? (gameState.shopRefreshed ? '#27ae60' : '#2ecc71') : '#7f8c8d';
        ctx.fillRect(sx + 20, sy + 68, 130, 24);
        ctx.fillStyle = '#fff'; ctx.font = 'bold 11px "Courier New"'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText(`刷新 $${refreshCost}`, sx + 85, sy + 80);

        ctx.save();
        ctx.beginPath(); ctx.rect(sx, sy + 95, sw, sh - 155); ctx.clip();

        let shopItems = gameState.shopItems || [];
        let currentY = sy + 105 + (player.shopScrollY || 0);
        for (let item of shopItems) {
            if (currentY > sy + 90 - 50 && currentY < sy + sh - 60) {
                let canAfford = player.coins >= item.cost;
                ctx.fillStyle = canAfford ? '#2c3e50' : '#1a252f';
                ctx.fillRect(sx + 10, currentY, sw - 20, 45);
                ctx.strokeStyle = canAfford ? '#bdc3c7' : '#4a5568'; ctx.lineWidth = 1;
                ctx.strokeRect(sx + 10, currentY, sw - 20, 45);

                ctx.fillStyle = '#ecf0f1'; ctx.fillRect(sx + 10, currentY, 45, 45);
                ctx.strokeStyle = '#2c3e50'; ctx.strokeRect(sx + 10, currentY, 45, 45);

                ctx.save(); ctx.translate(sx + 32, currentY + 22);
                if (item.category === 'upgrade') {
                    ctx.fillStyle = '#e74c3c'; ctx.font = 'bold 18px "Courier New"'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                    ctx.fillText('+', 0, 1);
                } else if (item.category === 'unit') {
                    if (item.id === 'cannon') { drawCircle(0,3,11,GAME_CONFIG.cannonColor,1.2,0.8); ctx.strokeStyle='#2c3e50';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(10,-6);ctx.stroke(); }
                    else if (item.id === 'swordsman') { drawCircle(0,0,10,GAME_CONFIG.swordsmanColor); ctx.strokeStyle='#ecf0f1';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(-3,3);ctx.lineTo(6,-6);ctx.stroke(); }
                    else if (item.id === 'archer') { drawCircle(0,0,10,GAME_CONFIG.archerColor); ctx.strokeStyle='#fff';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(0,-1);ctx.lineTo(6,-6);ctx.stroke(); }
                    else if (item.id === 'pistol') { drawCircle(0,0,10,GAME_CONFIG.pistolColor); ctx.fillStyle='#7f8c8d';ctx.fillRect(2,-2,8,3); }
                } else if (item.category === 'building') {
                    ctx.fillStyle = item.color||'#8B4513'; ctx.strokeStyle='#000'; ctx.lineWidth=1.5; ctx.beginPath();
                    let dt2 = item.type||1;
                    if (dt2===1) ctx.rect(-9,-9,18,18);
                    if (dt2===2) ctx.rect(-13,-5,26,10);
                    if (dt2===3){ctx.moveTo(0,-9);ctx.lineTo(9,9);ctx.lineTo(-9,9);ctx.closePath();}
                    if (dt2===4){ctx.moveTo(-9,-9);ctx.lineTo(9,9);ctx.lineTo(-9,9);ctx.closePath();}
                    ctx.fill(); ctx.stroke();
                }
                ctx.restore();

                ctx.fillStyle = canAfford ? '#fff' : '#7f8c8d';
                ctx.font = 'bold 13px "Courier New"'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
                ctx.fillText(item.name, sx + 62, currentY + 16);
                // 庫存
                if (item.stockCount !== undefined && item.category !== 'upgrade') {
                    ctx.fillStyle = '#95a5a6'; ctx.font = '11px "Courier New"';
                    ctx.fillText(`x${item.stockCount}`, sx + 62, currentY + 33);
                }
                ctx.fillStyle = canAfford ? '#f1c40f' : '#e74c3c';
                ctx.font = 'bold 13px "Courier New"'; ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
                ctx.fillText(`$${item.cost}`, sx + sw - 15, currentY + 22);
            }
            currentY += 50;
        }
        ctx.restore();

        // 跳過按鈕
        ctx.fillStyle = '#c0392b'; ctx.fillRect(sx + 10, sy + sh - 50, sw - 20, 40);
        ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; ctx.strokeRect(sx + 10, sy + sh - 50, sw - 20, 40);
        ctx.fillStyle = '#fff'; ctx.font = 'bold 13px "Courier New"'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText('DEPART NOW (SKIP)', sx + sw / 2, sy + sh - 30);
    }

    // ⭐ 小房子休息站面板
    if (gameState.phase === 'rest_house') {
        let pw = 300; let ph = 250;
        let px = canvas.width / 2 - pw / 2; let py = 80;
        ctx.fillStyle = 'rgba(20,40,30,0.92)';
        ctx.fillRect(px, py, pw, ph);
        ctx.strokeStyle = '#2ecc71'; ctx.lineWidth = 3; ctx.strokeRect(px, py, pw, ph);
        ctx.fillStyle = '#2ecc71'; ctx.font = 'bold 22px "Courier New"'; ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';
        ctx.fillText('🏠 REST HOUSE', px + pw / 2, py + 35);
        ctx.fillStyle = '#fff'; ctx.font = 'bold 14px "Courier New"';
        ctx.fillText(`離開倒數: ${Math.ceil(gameState.restTimer)}s`, px + pw / 2, py + 60);
        ctx.fillStyle = '#bdc3c7'; ctx.font = '13px "Courier New"';
        ctx.fillText('有單位跑出來加入你！', px + pw / 2, py + 85);

        // 顯示禮物
        let gifts = gameState.houseGifts || [];
        let gy = py + 110;
        gifts.forEach((g, i) => {
            let alpha = Math.min(1, gameState.houseAnimTimer - i * 0.3);
            if (alpha <= 0) return;
            ctx.save(); ctx.globalAlpha = alpha;
            ctx.fillStyle = '#2ecc71'; ctx.font = 'bold 16px "Courier New"'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
            ctx.fillText(`+ ${g.count}x ${g.type}`, px + pw / 2, gy + i * 30);
            ctx.restore();
        });

        // 跳過按鈕
        ctx.fillStyle = '#c0392b'; ctx.fillRect(px + 20, py + ph - 50, pw - 40, 35);
        ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; ctx.strokeRect(px + 20, py + ph - 50, pw - 40, 35);
        ctx.fillStyle = '#fff'; ctx.font = 'bold 13px "Courier New"'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText('SKIP', px + pw / 2, py + ph - 32);
    }

    // ⭐ 升級站休息站面板
    if (gameState.phase === 'rest_upgrade') {
        let uw = 340; let uh = 320;
        let ux = canvas.width / 2 - uw / 2; let uy = 70;
        ctx.fillStyle = 'rgba(30,20,50,0.93)';
        ctx.fillRect(ux, uy, uw, uh);
        ctx.strokeStyle = '#9b59b6'; ctx.lineWidth = 3; ctx.strokeRect(ux, uy, uw, uh);
        ctx.fillStyle = '#9b59b6'; ctx.font = 'bold 22px "Courier New"'; ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';
        ctx.fillText('⚙ UPGRADE STATION', ux + uw / 2, uy + 35);
        ctx.fillStyle = '#fff'; ctx.font = 'bold 14px "Courier New"';
        ctx.fillText(`離開倒數: ${Math.ceil(gameState.restTimer)}s`, ux + uw / 2, uy + 58);

        // 修血
        let missingHp = player.maxHp - player.hp;
        let repairCost = GAME_CONFIG.repairCostPerHp || 5;
        let repair1Cost = repairCost; let repair10Cost = Math.min(missingHp, 10) * repairCost;
        let repairAllCost = missingHp * repairCost;
        let lineY = uy + 80;

        ctx.fillStyle = '#bdc3c7'; ctx.font = 'bold 13px "Courier New"'; ctx.textAlign = 'center';
        ctx.fillText(`缺少 HP: ${missingHp}  (每點 $${repairCost})`, ux + uw / 2, lineY); lineY += 30;

        let repairBtns = [
            { label: `修復 +1 HP ($${repair1Cost})`, cost: repair1Cost, hp: 1 },
            { label: `修復 +10 HP ($${repair10Cost})`, cost: repair10Cost, hp: Math.min(10, missingHp) },
            { label: `全部修復 ($${repairAllCost})`, cost: repairAllCost, hp: missingHp },
        ];
        repairBtns.forEach((btn, i) => {
            let canAfford = player.coins >= btn.cost && btn.hp > 0;
            ctx.fillStyle = canAfford ? '#27ae60' : '#7f8c8d';
            ctx.fillRect(ux + 20, lineY, uw - 40, 32);
            ctx.strokeStyle = '#fff'; ctx.lineWidth = 1; ctx.strokeRect(ux + 20, lineY, uw - 40, 32);
            ctx.fillStyle = '#fff'; ctx.font = 'bold 12px "Courier New"'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
            ctx.fillText(btn.label, ux + uw / 2, lineY + 16);
            lineY += 40;
        });

        // 單位上限升級
        lineY += 5;
        let unitUpCost = player.maxUnitCost;
        let canUnitUp = player.coins >= unitUpCost;
        ctx.fillStyle = canUnitUp ? '#2980b9' : '#7f8c8d';
        ctx.fillRect(ux + 20, lineY, uw - 40, 32);
        ctx.strokeStyle = '#fff'; ctx.lineWidth = 1; ctx.strokeRect(ux + 20, lineY, uw - 40, 32);
        ctx.fillStyle = '#fff'; ctx.font = 'bold 12px "Courier New"'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText(`單位上限 +1 ($${unitUpCost})`, ux + uw / 2, lineY + 16);

        // 跳過按鈕
        ctx.fillStyle = '#c0392b'; ctx.fillRect(ux + 20, uy + uh - 45, uw - 40, 35);
        ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; ctx.strokeRect(ux + 20, uy + uh - 45, uw - 40, 35);
        ctx.fillStyle = '#fff'; ctx.font = 'bold 13px "Courier New"'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText('SKIP', ux + uw / 2, uy + uh - 27);
    }

    // ⭐ 繪製解鎖通知面板 (滾輪式向下排列)
    if (gameState.unlockNotifications && gameState.unlockNotifications.length > 0) {
        let nW = 160; let nH = 45;
        let startX = canvas.width - nW - 10;
        let startY = 135; // 在圖鑑按鈕下方

        gameState.unlockNotifications.forEach((n, i) => {
            let curY = startY + i * (nH + 8);
            let alpha = Math.min(1, n.timer * 2);

            ctx.save();
            ctx.globalAlpha = alpha;
            // 通知背景
            ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            ctx.fillRect(startX, curY, nW, nH);
            ctx.strokeStyle = '#f1c40f'; ctx.lineWidth = 2; ctx.strokeRect(startX, curY, nW, nH);

            // 左側圖像示 (呼叫圖鑑繪製邏輯)
            ctx.save();
            ctx.translate(startX + 22, curY + nH / 2);
            ctx.scale(0.8, 0.8); // 稍微縮小以配合面板
            drawEncyclopediaIcon(n.item, ctx, true);
            ctx.restore();

            // 右側文字
            ctx.fillStyle = '#fff'; ctx.font = 'bold 13px "Courier New"';
            ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
            ctx.fillText('NEW UNLOCK!', startX + 45, curY + 14);
            ctx.fillStyle = '#f1c40f'; ctx.font = 'bold 12px "Courier New"';
            ctx.fillText(n.name, startX + 45, curY + 30);

            ctx.restore();
        });
    }

    // ⭐ GAME OVER 畫面
    if (gameState.phase === 'game_over' || player.hp <= 0) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.85)'; ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#e74c3c'; ctx.font = 'bold 50px "Courier New"'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2 - 70);
        ctx.font = '22px "Courier New"'; ctx.fillStyle = '#bdc3c7';
        ctx.fillText(`擊殺: ${player.kills}`, canvas.width / 2, canvas.height / 2 - 20);

        if (gameState.isInTutorial) {
            // 新手教學死亡：只有回主選單
            ctx.fillStyle = '#95a5a6'; ctx.font = '16px "Courier New"'; ctx.textBaseline = 'middle';
            ctx.fillText('新手教學失敗 - 回到主選單', canvas.width / 2, canvas.height / 2 + 20);
            let btnW = 260; let btnH = 55; let cx3 = canvas.width / 2; let cy3 = canvas.height / 2 + 80;
            let isH = (mouseScreenX >= cx3 - btnW/2 && mouseScreenX <= cx3 + btnW/2 && mouseScreenY >= cy3 - btnH/2 && mouseScreenY <= cy3 + btnH/2);
            ctx.fillStyle = isH ? '#7f8c8d' : '#95a5a6';
            ctx.fillRect(cx3 - btnW/2, cy3 - btnH/2, btnW, btnH);
            ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; ctx.strokeRect(cx3 - btnW/2, cy3 - btnH/2, btnW, btnH);
            ctx.fillStyle = '#fff'; ctx.font = 'bold 20px "Courier New"'; ctx.textBaseline = 'middle';
            ctx.fillText('回到主選單 (RESTART)', cx3, cy3);
        } else {
            // 一般死亡：回地圖（平台重置但保留背包）
            ctx.fillStyle = '#bdc3c7'; ctx.font = '15px "Courier New"'; ctx.textBaseline = 'middle';
            ctx.fillText('平台被摧毁 - 返回地圖（平台重置，背包保留）', canvas.width / 2, canvas.height / 2 + 20);
            let btnW = 240; let btnH = 55; let cx3 = canvas.width / 2; let cy3 = canvas.height / 2 + 85;
            let isH = (mouseScreenX >= cx3 - btnW/2 && mouseScreenX <= cx3 + btnW/2 && mouseScreenY >= cy3 - btnH/2 && mouseScreenY <= cy3 + btnH/2);
            ctx.fillStyle = isH ? '#c0392b' : '#e74c3c';
            ctx.fillRect(cx3 - btnW/2, cy3 - btnH/2, btnW, btnH);
            ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; ctx.strokeRect(cx3 - btnW/2, cy3 - btnH/2, btnW, btnH);
            ctx.fillStyle = '#fff'; ctx.font = 'bold 20px "Courier New"'; ctx.textBaseline = 'middle';
            ctx.fillText('回到地圖 (RETRY)', cx3, cy3);
        }
    }
}