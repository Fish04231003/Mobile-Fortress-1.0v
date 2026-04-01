// js/main.js

let menuUnits = [
    { type: 'archer', x: 0, y: floorY - 12, vy: 0, color: GAME_CONFIG.archerColor, onBase: false },
    { type: 'swordsman', x: 0, y: floorY - 12, vy: 0, color: GAME_CONFIG.swordsmanColor, onBase: false }
];
let menuZombies = [
    { x: 0, y: floorY - 16, vy: 0, timer: 0 },
    { x: 0, y: floorY - 16, vy: 0, timer: 1 },
    { x: 0, y: floorY - 16, vy: 0, timer: 2 }
];

// ⭐ 敵人排程計時器（combat 隨機生成用）
let nextEnemySpawnTime = 0;

function scheduleNextEnemy() {
    nextEnemySpawnTime = gameTime + randomRange(GAME_CONFIG.zombieSpawnMin, GAME_CONFIG.zombieSpawnMax);
}

// ⭐ 關卡驅動式敵人生成（60秒內根據 levelConfig 均勻刷出）
function updateCombatEnemySpawn(dt) {
    let cfg = gameState.levelConfig;
    if (!cfg) {
        // fallback：舊式隨機生成
        if (gameTime >= nextEnemySpawnTime) {
            spawnEnemy();
            nextEnemySpawnTime = gameTime + randomRange(GAME_CONFIG.zombieSpawnMin, GAME_CONFIG.zombieSpawnMax);
        }
        return;
    }

    // 計算每種敵人應該在這時間點前已生成的數量
    let elapsed = gameState.timer;
    let total = GAME_CONFIG.combatDuration;
    let sc = gameState.spawnedCounts;

    for (let [type, target] of Object.entries(cfg.enemies)) {
        if (!target || target <= 0) continue;
        let shouldSpawn = Math.floor((elapsed / total) * target);
        let alreadySpawned = sc[type] || 0;
        while (alreadySpawned < shouldSpawn) {
            spawnSpecificZombie(type === 'zombie' ? 'normal' :
                type === 'fastZombie' ? 'fast' :
                    type === 'shieldZombie' ? 'shield' :
                        type === 'venomZombie' ? 'venom' :
                            type === 'balloonZombie' ? 'balloon' :
                                type === 'bladeZombie' ? 'blade' :
                                    type === 'armorZombie' ? 'armor' :
                                        type === 'bombZombie' ? 'bomb' :
                                            type === 'planeZombie' ? 'plane' :
                                                type === 'splitZombie' ? 'split' : 'normal');
            alreadySpawned++;
        }
        sc[type] = alreadySpawned;
    }
}

// ⭐ 進入休息站
function enterRestStation(type, isPremium) {
    gameState.restType = type || 'shop';
    gameState.isPremiumShop = isPremium || false;
    gameState.restTimer = GAME_CONFIG.restDuration;
    player.reaimMode = false;
    player.deleteMode = false;
    player.summonMode = false;
    player.aimingUnit = null;

    if (type === 'shop') {
        gameState.shopItems = generateShopItems(isPremium);
        gameState.shopRefreshed = false;
        player.shopScrollY = 0;
        gameState.phase = 'rest_shop';
        startMusicCrossfade('safezone');
    } else if (type === 'house') {
        gameState.houseGifts = generateHouseGifts();
        gameState.houseAnimTimer = 0;
        gameState.phase = 'rest_house';
        startMusicCrossfade('safezone');
    } else if (type === 'upgrade') {
        gameState.phase = 'rest_upgrade';
        startMusicCrossfade('safezone');
    }
}

// ⭐ 生成商店商品清單（隨機 4~8 項）
function generateShopItems(isPremium) {
    let allPool = [
        { id: 'archer', category: 'unit', type: 1, cost: GAME_CONFIG.archerCost, name: '弓箭手', hp: GAME_CONFIG.archerHp, color: GAME_CONFIG.archerColor },
        { id: 'swordsman', category: 'unit', type: 3, cost: GAME_CONFIG.swordsmanCost, name: '劍士', hp: GAME_CONFIG.swordsmanHp, color: GAME_CONFIG.swordsmanColor },
        { id: 'pistol', category: 'unit', type: 10, cost: GAME_CONFIG.pistolCost, name: '槍手', hp: GAME_CONFIG.pistolHp, color: GAME_CONFIG.pistolColor },
        { id: 'cannon', category: 'unit', type: 2, cost: GAME_CONFIG.cannonCost, name: '砲兵', hp: GAME_CONFIG.cannonHp, color: GAME_CONFIG.cannonColor },
        { id: 'square', category: 'building', type: 1, cost: GAME_CONFIG.buildingCost, name: '木製方塊', hp: GAME_CONFIG.buildingHp, color: '#8B4513', material: 'wood' },
        { id: 'rect', category: 'building', type: 2, cost: GAME_CONFIG.buildingCost, name: '木製長方', hp: GAME_CONFIG.buildingHp, color: '#8B4513', material: 'wood' },
        { id: 'tri', category: 'building', type: 3, cost: GAME_CONFIG.buildingCost, name: '木製三角', hp: GAME_CONFIG.buildingHp, color: '#8B4513', material: 'wood' },
        { id: 'rtri', category: 'building', type: 4, cost: GAME_CONFIG.buildingCost, name: '木製斜三', hp: GAME_CONFIG.buildingHp, color: '#8B4513', material: 'wood' },
        { id: 'brick_square', category: 'building', type: 1, cost: GAME_CONFIG.brickBuildingCost, name: '磚塊方塊', hp: GAME_CONFIG.brickBuildingHp, color: '#A52A2A', material: 'brick' },
        { id: 'brick_rect', category: 'building', type: 2, cost: GAME_CONFIG.brickBuildingCost, name: '磚塊長方', hp: GAME_CONFIG.brickBuildingHp, color: '#A52A2A', material: 'brick' },
        { id: 'brick_tri', category: 'building', type: 3, cost: GAME_CONFIG.brickBuildingCost, name: '磚塊三角', hp: GAME_CONFIG.brickBuildingHp, color: '#A52A2A', material: 'brick' },
        { id: 'brick_rtri', category: 'building', type: 4, cost: GAME_CONFIG.brickBuildingCost, name: '磚塊斜三', hp: GAME_CONFIG.brickBuildingHp, color: '#A52A2A', material: 'brick' },
        { id: 'steel_square', category: 'building', type: 1, cost: GAME_CONFIG.steelBuildingCost, name: '鋼鐵方塊', hp: GAME_CONFIG.steelBuildingHp, color: '#708090', material: 'steel' },
        { id: 'steel_rect', category: 'building', type: 2, cost: GAME_CONFIG.steelBuildingCost, name: '鋼鐵長方', hp: GAME_CONFIG.steelBuildingHp, color: '#708090', material: 'steel' },
        { id: 'steel_tri', category: 'building', type: 3, cost: GAME_CONFIG.steelBuildingCost, name: '鋼鐵三角', hp: GAME_CONFIG.steelBuildingHp, color: '#708090', material: 'steel' },
        { id: 'steel_rtri', category: 'building', type: 4, cost: GAME_CONFIG.steelBuildingCost, name: '鋼鐵斜三', hp: GAME_CONFIG.steelBuildingHp, color: '#708090', material: 'steel' },
    ];

    // 高級商店：加入升級商品
    let upgradeItems = [
        { id: 'upgrade', category: 'upgrade', type: 'upgrade', cost: player.maxUnitCost, name: '單位上限 +1' },
        { id: 'hpUpgrade', category: 'upgrade', type: 'upgrade', cost: 200 * Math.pow(2, player.maxHpUpgradeCount || 0), name: `最大HP +100` }
    ];

    // 決定商品數量
    let countMin = GAME_CONFIG.shopItemCountMin || 4;
    let countMax = GAME_CONFIG.shopItemCountMax || 8;
    let count = Math.floor(randomRange(countMin, countMax + 1));

    // 打亂並取前 count 個
    let shuffled = allPool.slice().sort(() => Math.random() - 0.5);
    let items = shuffled.slice(0, count);

    // [Req 8] Upgrades only in Upgrade Station, not here.
    // (We will handle Upgrade Station separately or it will use its own logic)

    // 為每個品項加上隨機庫存數量
    items.forEach(item => {
        if (item.category === 'upgrade') { item.stockCount = 1; return; }
        let stock = GAME_CONFIG.shopItemStock[item.id];
        if (stock) {
            item.stockCount = Math.floor(randomRange(stock.min, stock.max + 1));
        } else {
            item.stockCount = 3;
        }
    });

    return items;
}

// ⭐ 生成小房子禮物清單
function generateHouseGifts() {
    let houseUnitConf = GAME_CONFIG.houseUnits;
    let count = GAME_CONFIG.houseUnitCount || 2;
    let gifts = [];

    // 加權隨機選取
    let totalWeight = houseUnitConf.reduce((s, u) => s + u.weight, 0);
    let picked = [];
    let pool = houseUnitConf.slice();

    for (let i = 0; i < count && pool.length > 0; i++) {
        let r = Math.random() * pool.reduce((s, u) => s + u.weight, 0);
        let acc = 0;
        let chosen = null;
        for (let u of pool) {
            acc += u.weight;
            if (r <= acc) { chosen = u; break; }
        }
        if (!chosen) chosen = pool[0];
        pool = pool.filter(u => u !== chosen);
        let unitCount = Math.floor(randomRange(chosen.min, chosen.max + 1));
        gifts.push({ type: chosen.type, count: unitCount });
    }
    return gifts;
}

// ⭐ 離開休息站，前往地圖
function leaveRestStation() {
    if (player.aimingUnit) confirmAim();
    player.reaimMode = false;
    player.deleteMode = false;
    player.summonMode = false;
    player.selectedSlot = -1;
    player.aimingUnit = null;

    // 新手教學第一次休息後 → 進地圖
    if (gameState.isInTutorial) {
        gameState.isInTutorial = false;
        enterMap();
    } else {
        enterMap();
    }
}

// ⭐ 進入地圖
function enterMap() {
    startTransition(() => {
        gameState.phase = 'map';
        enemies = []; arrows = [];
        // 每次進入地圖都刷新關卡點 [Req 8]
        generateMapPoints();
        startMusicCrossfade('menu');
    });
}

// ⭐ 生成地圖關卡點
function generateMapPoints() {
    let map = gameState.map;
    let target = Math.floor(randomRange(GAME_CONFIG.mapPointsMin, GAME_CONFIG.mapPointsMax + 1));
    // 確保至少保留 mapMinPoints 個
    let needed = Math.max(target, GAME_CONFIG.mapMinPoints);
    let newPoints = [];
    let difficulties = ['easy', 'normal', 'hard'];
    let destTypes = ['shop', 'house', 'upgrade', 'premium_shop', 'random'];

    // 城市區域的地圖範圍（畫布內的相對位置）
    let regionBounds = { x: 60, y: 60, w: 700, h: 350 };

    // 建築物碰撞區（玩家不可站在這裡）
    let obstacles = [
        { x: 80, y: 80, w: 90, h: 120 },
        { x: 350, y: 120, w: 80, h: 100 },
        { x: 560, y: 70, w: 100, h: 140 },
        { x: 200, y: 250, w: 70, h: 90 },
        { x: 500, y: 260, w: 90, h: 80 },
    ];
    map.obstacles = obstacles;

    for (let i = 0; i < needed; i++) {
        let pt = null;
        let attempts = 0;
        while (!pt && attempts < 50) {
            attempts++;
            let px = Math.floor(randomRange(regionBounds.x + 40, regionBounds.x + regionBounds.w - 40));
            let py = Math.floor(randomRange(regionBounds.y + 40, regionBounds.y + regionBounds.h - 40));

            // 檢查是否與建築物重疊
            let blocked = obstacles.some(o =>
                px > o.x - 20 && px < o.x + o.w + 20 &&
                py > o.y - 20 && py < o.y + o.h + 20
            );
            // 檢查是否與已有點太近
            let tooClose = newPoints.some(p => Math.hypot(p.x - px, p.y - py) < 80);

            if (!blocked && !tooClose) {
                let diff = difficulties[Math.floor(Math.random() * difficulties.length)];
                let dest = destTypes[Math.floor(Math.random() * destTypes.length)];

                // ⭐ 使用新輔助函數解析解析隨機預設 [Req 5]
                let finalPreset = resolveLevelConfig(diff);

                pt = {
                    id: 'pt_' + Date.now() + '_' + i,
                    x: px, y: py,
                    region: 'city',
                    difficulty: diff,
                    destinationType: dest,
                    levelConfig: finalPreset,
                    cleared: false,
                };
            }
        }
        if (pt) newPoints.push(pt);
    }
    map.points = newPoints;
}

// ⭐ 轉場動畫（淡出→黑→淡入）
function startTransition(callback) {
    gameState.phase = 'transition_in';
    gameState.transitionAlpha = 0;
    gameState.transitionDir = 1;
    gameState.transitionCallback = callback;
}

// ⭐ 從地圖點進入戰鬥
function enterCombatFromMap(point) {
    let oldBaseX = base.x;
    startTransition(() => {
        // 設定關卡設定 (如果沒傳 point 則隨機抽一個 normal 作為備援)
        let cfg = point ? point.levelConfig : (resolveLevelConfig('normal'));
        let diffMult = GAME_CONFIG.difficultyMultipliers[GAME_CONFIG.difficulty] || { hp: 1, dmg: 1, spawn: 1 };

        // 套用難度倍率到敵人數量
        let scaledConfig = JSON.parse(JSON.stringify(cfg));
        for (let k in scaledConfig.enemies) {
            scaledConfig.enemies[k] = Math.floor(scaledConfig.enemies[k] * diffMult.spawn);
        }

        gameState.levelConfig = scaledConfig;
        gameState.spawnedCounts = {};
        gameState.nextSpawnTime = gameTime + 2; // 2秒後才開始刷敵人
        gameState.timer = 0;
        gameState.warningPlayed = false;
        gameState.currentPoint = point;
        gameState.phase = 'combat';

        // ⭐ 確保轉場到戰鬥時重置攝影機與平台位置 [Req 5]
        cameraX = 0;
        baseScreenX = 150;
        let newBaseX = cameraX + baseScreenX;
        let dx = newBaseX - oldBaseX;

        // ⭐ 同步移動所有單位與建築，防止進入關卡後消失 [Req 5]
        base.x = newBaseX;
        units.forEach(u => { if (u.isOnBase) u.x += dx; });
        buildings.forEach(b => { if (b.welded) b.x += dx; });

        enemies = []; arrows = [];
        if (typeof initCageManager === 'function') initCageManager();
        startMusicCrossfade('city');
    });
}

function update(dt) {
    if (player.hp <= 0 && gameState.phase !== 'game_over') {
        gameState.phase = 'game_over';
    }

    gameTime += dt;

    // ⭐ 彈簧動畫更新（設定/圖鑑/快捷列）
    let targetScale = gameState.settingsOpen ? 1.0 : 0.0;
    gameState.settingsScaleVel += (targetScale - gameState.settingsScale) * 300 * dt;
    gameState.settingsScaleVel *= 0.85;
    gameState.settingsScale += gameState.settingsScaleVel * dt;
    if (gameState.settingsScale < 0) { gameState.settingsScale = 0; gameState.settingsScaleVel = 0; }

    let targetSetHover = gameState.setBtnHovered ? 1.2 : 1.0;
    gameState.setBtnScaleVel += (targetSetHover - gameState.setBtnScale) * 300 * dt;
    gameState.setBtnScaleVel *= 0.85;
    gameState.setBtnScale += gameState.setBtnScaleVel * dt;

    let targetEncyHover = gameState.encyBtnHovered ? 1.2 : 1.0;
    gameState.encyBtnScaleVel += (targetEncyHover - gameState.encyBtnScale) * 300 * dt;
    gameState.encyBtnScaleVel *= 0.85;
    gameState.encyBtnScale += gameState.encyBtnScaleVel * dt;

    let targetEncyScale = gameState.encyclopediaOpen ? 1.0 : 0.0;
    gameState.encyclopediaScaleVel += (targetEncyScale - gameState.encyclopediaScale) * 300 * dt;
    gameState.encyclopediaScaleVel *= 0.85;
    gameState.encyclopediaScale += gameState.encyclopediaScaleVel * dt;
    if (gameState.encyclopediaScale < 0) { gameState.encyclopediaScale = 0; gameState.encyclopediaScaleVel = 0; }

    let targetCloseHover = gameState.encyCloseBtnHovered ? 1.2 : 1.0;
    gameState.encyCloseBtnScaleVel += (targetCloseHover - gameState.encyCloseBtnScale) * 300 * dt;
    gameState.encyCloseBtnScaleVel *= 0.85;
    gameState.encyCloseBtnScale += gameState.encyCloseBtnScaleVel * dt;

    // 背包面板動畫
    let targetBackpack = gameState.backpackOpen ? 1.0 : 0.0;
    gameState.backpackAnimVal += (targetBackpack - gameState.backpackAnimVal) * 12 * dt;
    if (Math.abs(targetBackpack - gameState.backpackAnimVal) < 0.001) gameState.backpackAnimVal = targetBackpack;

    // 底排快捷列動畫
    if (!gameState.slotScale) {
        gameState.slotScale = [1, 1, 1, 1, 1];
        gameState.slotScaleVel = [0, 0, 0, 0, 0];
    }
    for (let i = 0; i < 5; i++) {
        let loadoutIndex = player.loadoutRow * 5 + i;
        let isSelected = (player.selectedSlot === loadoutIndex) && !player.deleteMode;
        let targetSlotScale = isSelected ? 1.15 : 1.0;
        gameState.slotScaleVel[i] += (targetSlotScale - gameState.slotScale[i]) * 300 * dt;
        gameState.slotScaleVel[i] *= 0.85;
        gameState.slotScale[i] += gameState.slotScaleVel[i] * dt;
    }

    // 解鎖通知更新
    if (gameState.unlockNotifications && gameState.unlockNotifications.length > 0) {
        for (let i = gameState.unlockNotifications.length - 1; i >= 0; i--) {
            let n = gameState.unlockNotifications[i];
            n.timer -= dt;
            if (n.timer <= 0) gameState.unlockNotifications.splice(i, 1);
        }
    }

    // 音樂淡入淡出
    updateMusicCrossfade(dt);

    // 速度加速衰減
    if (base.speedBoost > 0) {
        base.speedBoost -= 150 * dt;
        if (base.speedBoost < 0) base.speedBoost = 0;
    }

    let baseMoveDist = 0;
    let currentBaseSpeed = base.speed + (base.speedBoost || 0);

    // =============================================
    // ⭐ 主遊戲 Phase 狀態機
    // =============================================
    if (gameState.phase === 'menu') {
        baseMoveDist = -GAME_CONFIG.baseSpeed * dt;
        baseScreenX = -1000;

        menuUnits.forEach((u, idx) => {
            let targetX = canvas.width / 2 - 250 + idx * 50;
            u.x = cameraX + targetX;
            u.vy += GAME_CONFIG.unitGravity * dt;
            u.y += u.vy * dt;
            if (u.y >= floorY - 12) { u.y = floorY - 12; u.vy = -randomRange(250, 400); }
        });
        menuZombies.forEach((z, idx) => {
            z.timer += dt;
            let targetX = canvas.width / 2 + 150 + idx * 50;
            z.x = cameraX + targetX + Math.sin(z.timer * (1 + idx * 0.5)) * 20;
            z.vy += GAME_CONFIG.unitGravity * dt;
            z.y += z.vy * dt;
            if (z.y >= floorY - 16) { z.y = floorY - 16; z.vy = -randomRange(250, 350); }
        });
    }

    // ⭐ 開場動畫（保留原邏輯）
    else if (gameState.phase === 'intro') {
        baseMoveDist = -GAME_CONFIG.baseSpeed * dt;
        gameState.menuAlpha = Math.max(0, gameState.menuAlpha - dt * 1.5);

        if (gameState.introState === 1) {
            if (gameState.introPlatformWorldX === undefined) {
                gameState.introPlatformWorldX = cameraX - 250;
            }
            let targetCameraX = gameState.introPlatformWorldX - 150;
            let cameraReached = false;
            if (cameraX > targetCameraX) {
                cameraX -= 400 * dt;
                if (cameraX <= targetCameraX) { cameraX = targetCameraX; cameraReached = true; }
            } else { cameraReached = true; }

            if (cameraReached) { baseScreenX = 150; base.x = cameraX + baseScreenX; }
            else { base.x = gameState.introPlatformWorldX; baseScreenX = base.x - cameraX; }

            let allOnBase = true;
            menuUnits.forEach((u, idx) => {
                u.vy += GAME_CONFIG.unitGravity * dt; u.y += u.vy * dt;
                if (!u.onBase) {
                    let targetBaseX = base.x + base.width - 40 - idx * 50;
                    let dx = targetBaseX - u.x;
                    if (dx > 10) u.x += 350 * dt; else if (dx < -10) u.x -= 350 * dt;
                    if (u.y >= floorY - 12) { u.y = floorY - 12; u.vy = -350; }
                    if (Math.abs(dx) < 20) {
                        if (u.y <= base.y) { u.onBase = true; u.y = base.y - 12; u.vy = 0; u.x = targetBaseX; }
                        else { u.vy = -600; }
                    } else { allOnBase = false; }
                } else { u.x = base.x + base.width - 40 - idx * 50; u.y = base.y - 12; }
            });
            menuZombies.forEach(z => {
                z.vy += GAME_CONFIG.unitGravity * dt; z.y += z.vy * dt;
                let targetDriveX = base.x + base.width - 20;
                let dx = targetDriveX - z.x;
                if (dx > 5) z.x += 325 * dt; else if (dx < -5) z.x -= 325 * dt;
                if (z.y >= floorY - 16) { z.y = floorY - 16; z.vy = -randomRange(300, 450); }
            });
            if (allOnBase && cameraReached) {
                gameState.introTimer += dt;
                if (gameState.introTimer >= 1.0) { gameState.introState = 2; gameState.introTimer = 0; }
            }
        }
        else if (gameState.introState === 2) {
            let rushSpeed = 600;
            base.x -= rushSpeed * dt; base.wheelAngle -= 30 * dt;
            baseScreenX = base.x - cameraX;
            menuUnits.forEach((u, idx) => { u.x = base.x + base.width - 40 - idx * 50; u.y = base.y - 12; u.vy = 0; });
            menuZombies.forEach(z => {
                z.vy += GAME_CONFIG.unitGravity * dt; z.y += z.vy * dt;
                let dx = (base.x + base.width - 20) - z.x;
                if (dx > 5) z.x += 375 * dt; else if (dx < -5) z.x -= 375 * dt;
                if (z.y >= floorY - 16) { z.y = floorY - 16; z.vy = -randomRange(300, 450); }
            });
            if (baseScreenX < -400) {
                gameState.introTimer += dt;
                if (gameState.introTimer > 1.0) { gameState.introState = 3; gameState.introPlatformWorldX = undefined; }
            }
        }
        else if (gameState.introState === 3) {
            cameraX = 0; baseScreenX = canvas.width + 200; base.x = cameraX + baseScreenX;
            units = []; buildings = []; enemies = []; arrows = []; slashes = [];

            let swordsman = { type: 'swordsman', radius: 12, color: GAME_CONFIG.swordsmanColor, mass: GAME_CONFIG.swordsmanMass, shootForce: 0, gravityMult: 0, damage: GAME_CONFIG.swordsmanDamage, cooldown: GAME_CONFIG.swordsmanCooldown, aoeRadius: GAME_CONFIG.swordsmanRange, hp: GAME_CONFIG.swordsmanHp, state: 'active', x: base.x + base.width - 30, y: base.y - 12, vx: 0, vy: 0, isOnBase: true, isAiming: false, localAimAngle: 0, rollAngle: 0, lastShootTime: 0, squishY: 1, flashTimer: 0, maxHp: GAME_CONFIG.swordsmanHp };
            let archer = { type: 'archer', radius: 12, color: GAME_CONFIG.archerColor, mass: GAME_CONFIG.archerMass, shootForce: GAME_CONFIG.archerShootForce, gravityMult: 600, damage: GAME_CONFIG.archerDamage, cooldown: GAME_CONFIG.archerCooldown, aoeRadius: 0, hp: GAME_CONFIG.archerHp, state: 'active', x: base.x + base.width - 90, y: base.y - 12, vx: 0, vy: 0, isOnBase: true, isAiming: false, localAimAngle: -Math.PI / 4, rollAngle: 0, lastShootTime: 0, squishY: 1, flashTimer: 0, maxHp: GAME_CONFIG.archerHp };
            units.push(archer, swordsman);
            player.unitCount = 2;
            gameState.introState = 4;
        }
        else if (gameState.introState === 4) {
            baseMoveDist = 0;
            let rushSpeed = 800;
            baseScreenX -= rushSpeed * dt; base.wheelAngle -= 40 * dt;
            base.x = cameraX + baseScreenX;
            units.forEach(u => {
                if (u.type === 'swordsman') u.x = base.x + base.width - 30;
                if (u.type === 'archer') u.x = base.x + base.width - 90;
                u.y = base.y - 12; u.vy = 0; u.isOnBase = true; u.rollAngle = 0;
            });
            if (baseScreenX <= 150) {
                baseScreenX = 150; base.x = cameraX + baseScreenX;
                units.forEach(u => {
                    if (u.type === 'swordsman') u.x = base.x + base.width - 30;
                    if (u.type === 'archer') u.x = base.x + base.width - 90;
                    u.rollAngle = 0;
                });
                // ⭐ 進入新手教學戰鬥
                gameState.phase = 'tutorial_combat';
                gameState.timer = 0;
                gameState.isInTutorial = true;
                gameState.warningPlayed = false;
                // 新手教學使用隨機抽樣 resolved normal preset
                gameState.levelConfig = resolveLevelConfig('normal');
                gameState.spawnedCounts = {};
                scheduleNextEnemy();
                if (typeof initCageManager === 'function') initCageManager();
                menuUnits = []; menuZombies = [];
            }
        }
    }

    // ⭐ 新手教學戰鬥（60秒，結束後固定進商店）
    else if (gameState.phase === 'tutorial_combat') {
        gameState.timer += dt;
        baseMoveDist = -currentBaseSpeed * dt;

        let timeLeft = GAME_CONFIG.combatDuration - gameState.timer;
        if (timeLeft <= 3.0 && !gameState.warningPlayed) {
            gameState.warningPlayed = true;
            if (ASSETS.sfxWarning) playSound(ASSETS.sfxWarning, 0.8);
        }
        updateCombatEnemySpawn(dt);

        if (gameState.timer >= GAME_CONFIG.combatDuration) {
            gameState.phase = 'tutorial_clearing';
        }
    }

    // ⭐ 新手教學清場（等敵人清完）
    else if (gameState.phase === 'tutorial_clearing') {
        baseMoveDist = -currentBaseSpeed * dt;
        if (enemies.length === 0) {
            // ⭐ 新手教學結束：重做切入動畫 [Req 3]
            // 動畫目標：平台移動到建築物停下，建築物在右側固定位置
            gameState.phase = 'tutorial_transition_to_rest';
            gameState.transitionRestTimer = 4.0;
            // 設立一個固定建築物在右側
            gameState.tutorialBuildingPos = cameraX + canvas.width + 200;
        }
    }

    // ⭐ 新手教學過場：平台移動到固定建築 [Req 3]
    else if (gameState.phase === 'tutorial_transition_to_rest') {
        let p = (gameState.transitionRestTimer / 4.0); // 1.0 -> 0.0
        let speedMult = p * p; // 減速曲線
        baseMoveDist = -currentBaseSpeed * speedMult * dt;
        gameState.transitionRestTimer -= dt;

        if (gameState.transitionRestTimer <= 0) {
            enterRestStation('shop', false);
        }
    }

    // ⭐ 戰鬥（正式關卡）
    else if (gameState.phase === 'combat') {
        gameState.timer += dt;
        baseMoveDist = -currentBaseSpeed * dt;

        let timeLeft = GAME_CONFIG.combatDuration - gameState.timer;
        if (timeLeft <= 3.0 && !gameState.warningPlayed) {
            gameState.warningPlayed = true;
            if (ASSETS.sfxWarning) playSound(ASSETS.sfxWarning, 0.8);
        }
        updateCombatEnemySpawn(dt);

        if (gameState.timer >= GAME_CONFIG.combatDuration) {
            gameState.phase = 'clearing';
        }
    }

    // ⭐ 清場（等敵人全部死亡）
    else if (gameState.phase === 'clearing') {
        baseMoveDist = -currentBaseSpeed * dt;
        if (enemies.length === 0) {
            // Initiate transition sequence instead of snapping directly [Req 2]
            gameState.phase = 'transition_to_rest';
            gameState.transitionRestTimer = 2.5; // 稍長一點，讓減速更有感
        }
    }

    // ⭐ 前往休息站的過場動畫 (持續開車並減速)
    else if (gameState.phase === 'transition_to_rest') {
        let p = (gameState.transitionRestTimer / 2.5); // 1.0 -> 0.0
        // 使用 p^2 讓減速曲線更平滑，並確保最後速度降為 0
        baseMoveDist = -currentBaseSpeed * (p * p) * dt;
        gameState.transitionRestTimer -= dt;
        if (gameState.transitionRestTimer <= 0) {
            // 進入真正的休息站
            let pt = gameState.currentPoint;
            let destType = pt ? pt.destinationType : 'shop';
            if (destType === 'premium_shop') enterRestStation('shop', true);
            else if (destType === 'house') enterRestStation('house', false);
            else if (destType === 'upgrade') enterRestStation('upgrade', false);
            else if (destType === 'random') {
                let types = ['shop', 'house', 'upgrade'];
                enterRestStation(types[Math.floor(Math.random() * types.length)], false);
            } else {
                enterRestStation('shop', false);
            }
        }
    }

    // ⭐ 休息站：商店（30秒）
    else if (gameState.phase === 'rest_shop') {
        baseMoveDist = 0;
        gameState.restTimer -= dt;
        if (gameState.restTimer <= 0) {
            leaveRestStation();
        }
    }

    // ⭐ 休息站：小房子（30秒）
    else if (gameState.phase === 'rest_house') {
        baseMoveDist = 0;
        gameState.restTimer -= dt;
        gameState.houseAnimTimer += dt;
        if (gameState.restTimer <= 0) {
            // 將禮物加入背包
            applyHouseGifts();
            leaveRestStation();
        }
    }

    // ⭐ 休息站：升級站（30秒）
    else if (gameState.phase === 'rest_upgrade') {
        baseMoveDist = 0;
        gameState.restTimer -= dt;
        if (gameState.restTimer <= 0) {
            leaveRestStation();
        }
    }

    // ⭐ 地圖探索（在 mapManager.js 中處理 WASD 移動）
    else if (gameState.phase === 'map') {
        baseMoveDist = 0;
        if (typeof updateMap === 'function') updateMap(dt);
    }

    // ⭐ 轉場動畫更新 (獨立於 Phase，確保換場後仍能淡出) [Req 5]
    if (gameState.transitionAlpha > 0 || (gameState.phase === 'transition_in')) {
        gameState.transitionAlpha += gameState.transitionDir * 2.5 * dt;
        if (gameState.transitionDir === 1 && gameState.transitionAlpha >= 1.0) {
            gameState.transitionAlpha = 1.0;
            if (gameState.transitionCallback) {
                gameState.transitionCallback();
                gameState.transitionCallback = null;
            }
            gameState.transitionDir = -1;
        } else if (gameState.transitionDir === -1 && gameState.transitionAlpha <= 0) {
            gameState.transitionAlpha = 0;
            gameState.transitionDir = 1;
        }
    }

    // ⭐ 死亡畫面
    if (gameState.phase === 'game_over') {
        baseMoveDist = 0;
    }

    // 更新世界
    updateWorld(dt, baseMoveDist);
    updateBuildings(dt, baseMoveDist);

    if (gameState.phase !== 'intro' && gameState.phase !== 'map' && gameState.phase !== 'game_over') {
        applyPhysics(dt, baseMoveDist);
        // 僅在休息站轉場時停止開火 (瞄準模式已由 updateUnits 內部個別判斷)
        if (gameState.phase !== 'transition_to_rest') {
            updateUnits(dt, baseMoveDist);
        } else {
            // 轉場中：只更新位置，不開槍
            updateUnitsNoShoot(dt, baseMoveDist);
        }
    } else if (gameState.phase === 'intro' && gameState.introState === 4) {
        units.forEach(u => {
            if (u.type === 'swordsman') u.x = base.x + base.width - 30;
            if (u.type === 'archer') u.x = base.x + base.width - 90;
            u.y = base.y - 12; u.vy = 0; u.isOnBase = true; u.rollAngle = 0;
        });
    }

    updateProjectiles(dt);
    updateEnemies(dt);
    if (typeof updateCages === 'function') updateCages(dt);

    // 粒子
    for (let i = particles.length - 1; i >= 0; i--) {
        let p = particles[i]; p.life -= dt;
        if (p.life <= 0) { particles.splice(i, 1); continue; }
        p.x += p.vx * dt; p.y += p.vy * dt; p.alpha = p.life / p.maxLife;
    }

    // 飄字
    for (let i = floatingTexts.length - 1; i >= 0; i--) {
        let ft = floatingTexts[i]; ft.life -= dt;
        if (ft.life <= 0) { floatingTexts.splice(i, 1); continue; }
        if (!ft.fixed) { ft.vy += 300 * dt; ft.y += ft.vy * dt; }
    }

    // 爆炸/斬擊
    for (let i = explosions.length - 1; i >= 0; i--) {
        let exp = explosions[i]; exp.life -= dt;
        exp.radius = exp.maxRadius * (1 - exp.life / exp.maxLife);
        if (exp.life <= 0) explosions.splice(i, 1);
    }
    for (let i = slashes.length - 1; i >= 0; i--) {
        let s = slashes[i]; s.life -= dt;
        if (s.life <= 0) slashes.splice(i, 1);
    }
}

// ⭐ 不開槍版本的 updateUnits（瞄準模式用）
function updateUnitsNoShoot(dt, baseMoveDist) {
    // 只做位置/物理更新，不觸發射擊
    // 使用 applyPhysics 已處理物理，這裡只更新單位跟平台的位置關係
    units.forEach(u => {
        if (u.state !== 'active') return;
        // u.x += baseMoveDist;  <-- 移除此行，applyPhysics 已處理
    });
}

// ⭐ 小房子禮物發放
function applyHouseGifts() {
    gameState.houseGifts.forEach(gift => {
        // ⭐ 解鎖圖鑑 [Req 3]
        player.encountered[gift.type] = true;

        let invItem = player.inventory.find(i => i.id === gift.type || i.type === gift.type);
        if (invItem) {
            invItem.count = (invItem.count || 0) + gift.count;
            // 同步 loadout
            let loadoutItem = player.loadout.find(l => l && (l.id === gift.type));
            if (loadoutItem) loadoutItem.count = invItem.count;
        } else {
            // 新加入背包
            let unitConf = {
                archer: { id: 'archer', category: 'unit', type: 1, cost: 0, name: 'Arch', drawType: 1, color: GAME_CONFIG.archerColor },
                swordsman: { id: 'swordsman', category: 'unit', type: 3, cost: 0, name: 'Swor', drawType: 3, color: GAME_CONFIG.swordsmanColor },
                pistol: { id: 'pistol', category: 'unit', type: 10, cost: 0, name: 'Gun', drawType: 10, color: GAME_CONFIG.pistolColor },
                cannon: { id: 'cannon', category: 'unit', type: 2, cost: 0, name: 'Cann', drawType: 2, color: GAME_CONFIG.cannonColor },
            };
            let tmpl = unitConf[gift.type];
            if (tmpl) {
                let newItem = { ...tmpl, count: gift.count };
                player.inventory.push(newItem);
                // 嘗試加入裝備欄（找空格）
                let emptySlot = player.loadout.indexOf(null);
                if (emptySlot !== -1) player.loadout[emptySlot] = newItem;
            }
        }
        floatingTexts.push({
            text: `+${gift.count} ${gift.type}!`, x: canvas.width / 2, y: canvas.height / 2 - 30,
            vy: -30, life: 2, maxLife: 2, color: '#2ecc71', fixed: true
        });
    });
    gameState.houseGifts = [];
}

function draw() {
    let wYOffset = (gameState.backpackAnimVal || 0) * (-canvas.height / 2);
    ctx.save();
    ctx.translate(0, wYOffset);

    // ⭐ 地圖 Phase 由 mapManager 獨立繪製
    if (gameState.phase === 'map') {
        ctx.restore();
        if (typeof drawMap === 'function') drawMap();
        drawUI();
        return;
    }

    drawWorld();

    if (gameState.phase === 'menu' || (gameState.phase === 'intro' && gameState.introState < 3)) {
        ctx.save(); ctx.translate(-cameraX, 0);
        menuUnits.forEach(u => {
            ctx.fillStyle = u.color; ctx.beginPath(); ctx.arc(u.x, u.y, 12, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = 'rgba(255,255,255,0.4)'; ctx.beginPath(); ctx.arc(u.x - 3.6, u.y - 3.6, 3.6, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = '#000'; ctx.fillRect(u.x - 6, u.y - 4, 3, 3); ctx.fillRect(u.x - 12, u.y - 4, 3, 3);
        });
        menuZombies.forEach(z => {
            ctx.fillStyle = GAME_CONFIG.zombieColor; ctx.beginPath(); ctx.arc(z.x, z.y, 16, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = 'rgba(255,255,255,0.4)'; ctx.beginPath(); ctx.arc(z.x - 4.8, z.y - 4.8, 4.8, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = '#000'; ctx.fillRect(z.x - 8, z.y - 4, 3, 3); ctx.fillRect(z.x - 2, z.y - 4, 3, 3);
        });
        ctx.restore();
    }

    drawBuildings();
    if (gameState.phase !== 'intro' || gameState.introState >= 3) {
        drawUnitsAndProjectiles();
    }
    drawEnemies();
    if (typeof drawCageRescues === 'function') drawCageRescues();

    ctx.save(); ctx.translate(-cameraX, 0);
    particles.forEach(p => { ctx.globalAlpha = p.alpha; ctx.fillStyle = p.color; ctx.fillRect(p.x, p.y, 6, 6); });
    floatingTexts.forEach(ft => {
        if (!ft.fixed) {
            ctx.globalAlpha = Math.max(0, ft.life / ft.maxLife);
            ctx.fillStyle = ft.color; ctx.font = 'bold 20px "Courier New"'; ctx.textAlign = 'center';
            ctx.strokeStyle = '#000'; ctx.lineWidth = 3; ctx.strokeText(ft.text, ft.x, ft.y);
            ctx.fillText(ft.text, ft.x, ft.y);
        }
    });
    ctx.globalAlpha = 1.0; ctx.restore();

    floatingTexts.forEach(ft => {
        if (ft.fixed) {
            ctx.globalAlpha = Math.max(0, ft.life / ft.maxLife);
            ctx.fillStyle = ft.color; ctx.font = 'bold 20px "Courier New"'; ctx.textAlign = 'center';
            ctx.strokeStyle = '#000'; ctx.lineWidth = 3; ctx.strokeText(ft.text, ft.x, ft.y);
            ctx.fillText(ft.text, ft.x, ft.y);
        }
    });
    ctx.globalAlpha = 1.0;
    ctx.restore(); // Restore world transform

    // ⭐ 轉場黑幕（在 UI 之前繪製）
    if (gameState.transitionAlpha > 0) {
        ctx.fillStyle = `rgba(0,0,0,${gameState.transitionAlpha})`;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    drawUI();
}

function gameLoop(timestamp) {
    let dt = (timestamp - lastTime) / 1000;
    lastTime = timestamp;
    if (dt > 0.1) dt = 0.1;
    update(dt);
    draw();
    requestAnimationFrame(gameLoop);
}

nextEnemySpawnTime = gameTime + randomRange(GAME_CONFIG.zombieSpawnMin, GAME_CONFIG.zombieSpawnMax);
requestAnimationFrame(gameLoop);

// ⭐ 重置遊戲（死亡後回地圖用）
function resetPlatformAfterDeath() {
    // 清空單位和建築物
    units = []; buildings = []; enemies = []; arrows = [];
    particles = []; floatingTexts = []; explosions = []; slashes = [];

    // 重置平台
    player.hp = GAME_CONFIG.respawnMaxHp;
    player.maxHp = GAME_CONFIG.respawnMaxHp;
    player.unitCount = 0;
    player.maxUnits = GAME_CONFIG.respawnMaxUnits;

    // 重置 UI 與 輸入狀態
    gameState.backpackOpen = false;
    gameState.backpackAnimVal = 0;
    gameState.encyclopediaOpen = false;
    gameState.encyclopediaScale = 0;
    gameState.settingsOpen = false;
    gameState.settingsScale = 0;
    player.reaimMode = false;
    player.deleteMode = false;
    player.summonMode = false;
    player.selectedSlot = -1;
    player.aimingUnit = null;

    // 重置 base
    cameraX = 0;
    baseScreenX = 150;
    base.x = cameraX + baseScreenX;
}

// ⭐ 完整重置（新手教學死亡 → 回主選單）
function resetGame() {
    units = []; buildings = []; enemies = []; arrows = [];
    particles = []; floatingTexts = []; explosions = []; slashes = [];

    player.hp = player.maxHp;
    player.unitCount = 2; // 教學預設 2 單位
    player.kills = 0;

    gameState.phase = 'menu';
    gameState.timer = 0;
    gameState.restTimer = 0;
    gameState.warningPlayed = false;
    gameState.introState = 0;
    gameState.introTimer = 0;
    gameState.isInTutorial = true;
    gameState.levelConfig = null;
    gameState.spawnedCounts = {};
    gameState.map.points = [];

    // 重置選單狀態
    gameState.menuAlpha = 0;
    gameState.showDifficultySelection = false;
    gameState.difficultySelectionAlpha = 0;
    gameState.playBtnHovered = false;

    // 關閉所有視窗
    gameState.backpackOpen = false;
    gameState.backpackAnimVal = 0;
    gameState.encyclopediaOpen = false;
    gameState.encyclopediaOpenAlpha = 0;
    gameState.encyclopediaScale = 0;
    gameState.settingsOpen = false;
    gameState.settingsScale = 0;

    player.reaimMode = false;
    player.deleteMode = false;
    player.summonMode = false;
    player.selectedSlot = -1;
    player.aimingUnit = null;

    gameTime = 0;
    cameraX = 0;
    baseScreenX = 150;
    base.x = cameraX + baseScreenX;

    if (typeof startMusicCrossfade === 'function') startMusicCrossfade('menu');
}
function resolveLevelConfig(diff) {
    let presets = GAME_CONFIG.levelPresets[diff] || GAME_CONFIG.levelPresets.normal;
    // 如果傳入的是物件而非陣列，嘗試直接回傳 (保險機制)
    if (!Array.isArray(presets)) {
        let conf = JSON.parse(JSON.stringify(presets));
        for (let eType in conf.enemies) {
            let r = conf.enemies[eType];
            if (Array.isArray(r)) conf.enemies[eType] = Math.floor(randomRange(r[0], r[1] + 1));
        }
        return conf;
    }
    // 從陣列隨機挑選一個
    let raw = presets[Math.floor(Math.random() * presets.length)];
    let final = JSON.parse(JSON.stringify(raw));
    // 處理 [min, max] 隨機敵人數量
    for (let eType in final.enemies) {
        let range = final.enemies[eType];
        if (Array.isArray(range)) {
            final.enemies[eType] = Math.floor(randomRange(range[0], range[1] + 1));
        }
    }
    return final;
}
