// js/cageManager.js
// ⭐ 牢籠系統：生成牢籠（作為敵人之一），玩家擊破後觸發救援動畫，並獲得單位

let rescuingUnits = [];

function initCageManager() {
    rescuingUnits = [];
    gameState.nextCageSpawnTime = gameState.timer + randomRange(GAME_CONFIG.cageSpawnIntervalMin, GAME_CONFIG.cageSpawnIntervalMax);
}

// 根據當前關卡的 cagePossible，決定牢籠內的單位
function getRandomCageUnit() {
    let pt = gameState.map?.selectedPoint;
    let pool = ['archer', 'swordsman'];
    if (pt && pt.levelConfig && pt.levelConfig.cagePossible) {
        pool = pt.levelConfig.cagePossible;
    }
    return pool[Math.floor(Math.random() * pool.length)];
}

function updateCages(dt) {
    let isCombat = (gameState.phase === 'combat' || gameState.phase === 'tutorial_combat');
    if (!isCombat) return;

    let pt = gameState.map?.selectedPoint;
    let cageEnabled = pt && pt.levelConfig && pt.levelConfig.cageEnabled;

    if (cageEnabled && gameState.timer >= gameState.nextCageSpawnTime) {
        // 機率性生成
        if (Math.random() <= GAME_CONFIG.cageSpawnChance) {
            spawnCage();
        }
        gameState.nextCageSpawnTime = gameState.timer + randomRange(GAME_CONFIG.cageSpawnIntervalMin, GAME_CONFIG.cageSpawnIntervalMax);
    }

    // 更新救援中的單位動畫
    for (let i = rescuingUnits.length - 1; i >= 0; i--) {
        let ru = rescuingUnits[i];
        
        // 單位往右跑（向平台衝過去）
        ru.x += ru.vx * dt;
        
        // 抵達平台後，加入背包
        if (ru.x >= base.x) {
            addUnitToInventory(ru.type);
            floatingTexts.push({ 
                text: 'RESCUED! +1', 
                x: base.x + base.width / 2, 
                y: base.y - 20, 
                vy: -30, 
                life: 1.5, 
                maxLife: 1.5, 
                color: '#2ecc71', 
                fixed: false 
            });
            playSound(ASSETS.sfxBuy, 1.0); // 借用買東西的音效作為獲得單位的提示
            rescuingUnits.splice(i, 1);
        }
    }
}

function spawnCage() {
    let unitType = getRandomCageUnit();
    let speed = base.speedBoost + GAME_CONFIG.cageSpeed; // 相對於地面的速度，確保能從左邊追上平台

    enemies.push({
        type: 'cage',
        isCage: true,
        unitInside: unitType,
        x: cameraX - 100, // 從畫面左邊外側生成
        y: floorY - 30, // 稍微高於地板
        radius: 20,
        vx: speed,
        originalVx: speed,
        vy: 0,
        hp: GAME_CONFIG.cageHp,
        maxHp: GAME_CONFIG.cageHp,
        isFast: false, hasShield: false, isVenom: false, isBalloon: false, isBlade: false, hasArmor: false, isBomb: false, isPlane: false,
        scale: 1.0,
        color: '#7f8c8d',
        flashTimer: 0,
        knockbackCooldown: 0,
        lastAttackTime: 0
    });
}

function startRescueUnit(x, y, unitType) {
    // 產生救援單位的動畫物件
    rescuingUnits.push({
        type: unitType,
        x: x,
        y: y,
        vx: 250 // 跑步速度（比平台快才能追上跳上去）
    });
    
    // 產生木箱破裂粒子
    createParticles(x, y, '#8e44ad', 15);
    createParticles(x, y, '#f39c12', 15);
}

function drawCageRescues() {
    ctx.save();
    ctx.translate(-cameraX, 0);

    for (let ru of rescuingUnits) {
        // 用該單位的專屬顏色畫出奔跑的影子
        let color = '#fff';
        if (ru.type === 'archer') color = GAME_CONFIG.archerColor;
        else if (ru.type === 'swordsman') color = GAME_CONFIG.swordsmanColor;
        else if (ru.type === 'cannon') color = GAME_CONFIG.cannonColor;
        else if (ru.type === 'pistol') color = GAME_CONFIG.pistolColor;

        drawCircle(ru.x, ru.y, 10, color);
        // 加上跳躍的小動畫
        let jumpY = Math.abs(Math.sin(gameTime * 15)) * 10;
        ctx.fillStyle = '#f1c40f';
        ctx.beginPath();
        ctx.arc(ru.x, ru.y - jumpY, 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#000'; ctx.font = 'bold 10px "Courier New"'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText('FREE', ru.x, ru.y - jumpY - 15);
    }

    ctx.restore();
}

function addUnitToInventory(unitId) {
    let invItem = player.inventory.find(i => i.id === unitId);
    if (invItem) {
        invItem.count = (invItem.count || 0) + 1;
        let lo = player.loadout.find(l => l && l.id === unitId);
        if (lo) lo.count = invItem.count;
    } else {
        // 如果背包沒有，需要構造一個新的（需從商店資料取得正確名稱、顏色等）
        let allItems = getShopItems(); // 借用 settings.js 裡的單位模板
        let tmpl = allItems.find(i => i.id === unitId);
        if (!tmpl) { // Fallback
            tmpl = { id: unitId, category: 'unit', type: 1, color: '#f1c40f', hp: 100, name: 'Unit' };
        }
        
        let newItem = {
            id: tmpl.id, category: tmpl.category, type: tmpl.type, drawType: tmpl.type,
            cost: 0, hp: tmpl.hp, color: tmpl.color, material: tmpl.material, name: tmpl.name, count: 1
        };
        player.inventory.push(newItem);
        let emptySlot = player.loadout.indexOf(null);
        if (emptySlot !== -1) player.loadout[emptySlot] = newItem;
    }
}
