// js/enemies.js
// ⭐ 敵人生成排程已移至 main.js 的 updateCombatEnemySpawn()

function explodeZombie(e) {
    let radius = GAME_CONFIG.bombZombieExplodeRadius || 80;
    let dmg = GAME_CONFIG.bombZombieDamage || 10;
    let diffMult = GAME_CONFIG.difficultyMultipliers[GAME_CONFIG.difficulty || 'normal'].dmg;
    let finalDmg = dmg * diffMult;

    // 視覺效果
    createParticles(e.x, e.y, '#e67e22', 20);
    createParticles(e.x, e.y, '#f1c40f', 15);
    if (ASSETS.sfxExplode) playSound(ASSETS.sfxExplode, 0.8);

    // 傷害判定
    // 1. 玩家平台
    if (Math.abs(e.x - (base.x + base.width)) < radius) {
        let damageDealt = Math.min(finalDmg, player.hp);
        player.hp -= finalDmg;
        if (GAME_CONFIG.showUnitDamageText) showDamageText(base.x + base.width, floorY - 40, damageDealt, false, true);
    }

    // 2. 單位
    for (let u of units) {
        if (u.state === 'active') {
            let dist = Math.hypot(e.x - u.x, e.y - u.y);
            if (dist < radius + u.radius) {
                let damageDealt = Math.min(finalDmg, u.hp);
                u.hp -= finalDmg;
                if (GAME_CONFIG.showUnitDamageText) showDamageText(u.x, u.y, damageDealt, false, true);
                u.flashTimer = 0.1;
                if (u.hp <= 0) killUnit(u);
            }
        }
    }

    // 3. 建築
    for (let b of buildings) {
        if (b.state === 'active' || b.welded) {
            let dist = Math.hypot(e.x - b.x, e.y - b.y);
            if (dist < radius + 20) {
                let damageDealt = Math.min(finalDmg, b.hp);
                b.hp -= finalDmg;
                if (GAME_CONFIG.showUnitDamageText) showDamageText(b.x, b.y, damageDealt, true, true);
                b.flashTimer = 0.1;
                if (b.hp <= 0) killBuilding(b);
            }
        }
    }
}

function spawnMiniZombie(x, y) {
    let diff = GAME_CONFIG.difficulty || 'normal';
    let mults = GAME_CONFIG.difficultyMultipliers[diff];
    let scale = GAME_CONFIG.miniZombieScale;
    let speed = -randomRange(GAME_CONFIG.miniZombieSpeedMin, GAME_CONFIG.miniZombieSpeedMax);
    
    return {
        type: 'mini',
        x: x + (Math.random() * 40 - 20), 
        y: y,
        radius: 16 * scale, 
        vx: speed, 
        originalVx: speed, 
        vy: -randomRange(100, 300), 
        hp: GAME_CONFIG.miniZombieHp * mults.hp,
        maxHp: GAME_CONFIG.miniZombieHp * mults.hp,
        scale: scale,
        color: GAME_CONFIG.splitZombieColor, 
        flashTimer: 0,
        jumpMin: GAME_CONFIG.miniZombieJumpMin,
        jumpMax: GAME_CONFIG.miniZombieJumpMax,
        lastAttackTime: 0
    };
}

function spawnSpecificZombie(type) {
    let eHp = GAME_CONFIG.zombieHp;
    let eSpeedMin = GAME_CONFIG.zombieSpeedMin;
    let eSpeedMax = GAME_CONFIG.zombieSpeedMax;
    let eColor = GAME_CONFIG.zombieColor;
    let jumpMin = GAME_CONFIG.zombieJumpMin;
    let jumpMax = GAME_CONFIG.zombieJumpMax;
    let isFast = false;
    let hasShield = false;
    let isVenom = false;
    let isBalloon = false;
    let isBlade = false;
    let hasArmor = false;
    
    if (type === 'fast') {
        eHp = GAME_CONFIG.fastZombieHp;
        eSpeedMin = GAME_CONFIG.fastZombieSpeedMin;
        eSpeedMax = GAME_CONFIG.fastZombieSpeedMax;
        eColor = GAME_CONFIG.fastZombieColor;
        jumpMin = GAME_CONFIG.fastZombieJumpMin;
        jumpMax = GAME_CONFIG.fastZombieJumpMax;
        isFast = true;
    } else if (type === 'shield') {
        eHp = GAME_CONFIG.shieldZombieHp;
        eSpeedMin = GAME_CONFIG.shieldZombieSpeedMin;
        eSpeedMax = GAME_CONFIG.shieldZombieSpeedMax;
        eColor = GAME_CONFIG.shieldZombieColor;
        jumpMin = GAME_CONFIG.shieldZombieJumpMin;
        jumpMax = GAME_CONFIG.shieldZombieJumpMax;
        hasShield = true;
    } else if (type === 'venom') {
        eHp = GAME_CONFIG.venomZombieHp;
        eSpeedMin = GAME_CONFIG.venomZombieSpeedMin;
        eSpeedMax = GAME_CONFIG.venomZombieSpeedMax;
        eColor = GAME_CONFIG.venomZombieColor;
        jumpMin = GAME_CONFIG.venomZombieJumpMin;
        jumpMax = GAME_CONFIG.venomZombieJumpMax;
        isVenom = true;
    } else if (type === 'balloon') {
        eHp = GAME_CONFIG.balloonZombieHp;
        eSpeedMin = GAME_CONFIG.balloonZombieSpeedMin;
        eSpeedMax = GAME_CONFIG.balloonZombieSpeedMax;
        eColor = GAME_CONFIG.balloonZombieColor;
        jumpMin = GAME_CONFIG.zombieJumpMin;
        jumpMax = GAME_CONFIG.zombieJumpMax;
        isBalloon = true;
    } else if (type === 'blade') {
        eHp = GAME_CONFIG.bladeZombieHp;
        eSpeedMin = GAME_CONFIG.bladeZombieSpeedMin;
        eSpeedMax = GAME_CONFIG.bladeZombieSpeedMax;
        eColor = GAME_CONFIG.bladeZombieColor;
        jumpMin = GAME_CONFIG.bladeJumpMin;
        jumpMax = GAME_CONFIG.bladeJumpMax;
        isBlade = true;
    } else if (type === 'armor') {
        eHp = GAME_CONFIG.armorZombieHp;
        eSpeedMin = GAME_CONFIG.armorZombieSpeedMin;
        eSpeedMax = GAME_CONFIG.armorZombieSpeedMax;
        eColor = GAME_CONFIG.armorZombieColor;
        jumpMin = GAME_CONFIG.armorJumpMin;
        jumpMax = GAME_CONFIG.armorJumpMax;
        hasArmor = true;
    } else if (type === 'bomb') {
        eHp = GAME_CONFIG.bombZombieHp;
        eSpeedMin = GAME_CONFIG.bombZombieSpeedMin;
        eSpeedMax = GAME_CONFIG.bombZombieSpeedMax;
        eColor = GAME_CONFIG.bombZombieColor;
        jumpMin = GAME_CONFIG.bombZombieJumpMin;
        jumpMax = GAME_CONFIG.bombZombieJumpMax;
    } else if (type === 'plane') {
        eHp = GAME_CONFIG.planeZombieHp;
        eSpeedMin = GAME_CONFIG.planeZombieSpeedMin;
        eSpeedMax = GAME_CONFIG.planeZombieSpeedMax;
        eColor = GAME_CONFIG.planeZombieColor;
        jumpMin = GAME_CONFIG.zombieJumpMin;
        jumpMax = GAME_CONFIG.zombieJumpMax;
    } else if (type === 'split') {
        eHp = GAME_CONFIG.splitZombieHp;
        eSpeedMin = GAME_CONFIG.splitZombieSpeedMin;
        eSpeedMax = GAME_CONFIG.splitZombieSpeedMax;
        eColor = GAME_CONFIG.splitZombieColor;
        jumpMin = GAME_CONFIG.splitZombieJumpMin;
        jumpMax = GAME_CONFIG.splitZombieJumpMax;
    } else if (type === 'mini') {
        eHp = GAME_CONFIG.miniZombieHp;
        eSpeedMin = GAME_CONFIG.miniZombieSpeedMin;
        eSpeedMax = GAME_CONFIG.miniZombieSpeedMax;
        eColor = GAME_CONFIG.splitZombieColor;
        jumpMin = GAME_CONFIG.miniZombieJumpMin;
        jumpMax = GAME_CONFIG.miniZombieJumpMax;
    }

    let diff = GAME_CONFIG.difficulty || 'normal';
    let mults = GAME_CONFIG.difficultyMultipliers[diff];
    
    let speed = -randomRange(eSpeedMin, eSpeedMax);
    let scale = (type === 'mini') ? GAME_CONFIG.miniZombieScale : 1.0;
    
    let spawnY = floorY - 20;
    if (isBalloon) spawnY = floorY - GAME_CONFIG.balloonZombieFloatHeight;
    else if (type === 'plane') spawnY = floorY - randomRange(GAME_CONFIG.planeZombieFloatHeight, GAME_CONFIG.balloonZombieFloatHeight);

    enemies.push({
        type: type,
        x: cameraX + canvas.width + 50, 
        y: spawnY,
        radius: 16 * scale, 
        vx: speed, 
        originalVx: speed, 
        vy: 0, 
        hp: eHp * mults.hp,
        maxHp: eHp * mults.hp,
        isFast: isFast,
        hasShield: hasShield,
        isVenom: isVenom,
        isBalloon: isBalloon,
        isBlade: isBlade,
        hasArmor: hasArmor,
        isBomb: (type === 'bomb'),
        isPlane: (type === 'plane'),
        planeHp: (type === 'plane') ? GAME_CONFIG.planeHp * mults.hp : 0,
        maxPlaneHp: (type === 'plane') ? GAME_CONFIG.planeHp * mults.hp : 0,
        planeBroken: false,
        scale: scale,
        armorHp: hasArmor ? GAME_CONFIG.armorHp * mults.hp : 0,
        maxArmorHp: hasArmor ? GAME_CONFIG.armorHp * mults.hp : 0,
        armorBroken: false,
        balloonPop: false,
        floatOffset: Math.random() * Math.PI * 2,
        shieldHp: hasShield ? GAME_CONFIG.shieldHp * mults.hp : 0,
        maxShieldHp: hasShield ? GAME_CONFIG.shieldHp * mults.hp : 0,
        shieldBroken: false,
        shieldFlyX: 0, shieldFlyY: 0, shieldFlyVx: 0, shieldFlyVy: 0, shieldAlpha: 1.0,
        color: eColor, 
        flashTimer: 0,
        jumpMin: jumpMin,
        jumpMax: jumpMax,
        lastAttackTime: 0,
        bladeActiveTimer: 0
    });
}

function showDamageText(x, y, amount, isArmor = false, isUnit = false, customColor = null) {
    if (amount <= 0) return;
    let color = customColor || (isArmor ? '#95a5a6' : (isUnit ? '#e74c3c' : '#ffffff'));
    floatingTexts.push({ 
        text: `-${Math.round(amount)}`, 
        x: x + (Math.random() * 20 - 10), 
        y: y - 20, 
        vy: -100, 
        life: 0.8, 
        maxLife: 0.8, 
        color: color, 
        fixed: false 
    });
}

function killEnemy(index) {
    let e = enemies[index];

    // ⭐ 牢籠被打破：觸發救援
    if (e.isCage) {
        if (typeof startRescueUnit === 'function') {
            startRescueUnit(e.x, e.y, e.unitInside);
        }
        enemies.splice(index, 1);
        return;
    }

    createParticles(e.x, e.y, '#95a5a6', 8);
    player.kills++; 
    
    let reward = GAME_CONFIG.coinReward;
    if (e.isFast) reward = GAME_CONFIG.fastCoinReward;
    else if (e.hasShield) reward = GAME_CONFIG.shieldCoinReward;
    else if (e.isVenom) reward = GAME_CONFIG.venomCoinReward;
    else if (e.isBalloon) reward = GAME_CONFIG.balloonCoinReward;
    else if (e.isBlade) reward = GAME_CONFIG.bladeCoinReward;
    else if (e.hasArmor) reward = GAME_CONFIG.armorCoinReward;
    else if (e.isBomb) reward = GAME_CONFIG.bombCoinReward;
    else if (e.isPlane) reward = GAME_CONFIG.planeCoinReward;
    else if (e.type === 'split') reward = GAME_CONFIG.splitZombieReward;
    else if (e.type === 'mini') reward = GAME_CONFIG.miniZombieReward;
    
    player.coins += reward;
    
    if (reward > 0) {
        floatingTexts.push({ text: `+${reward}`, x: e.x - 10, y: e.y - 20, vy: -150, life: 1.0, maxLife: 1.0, color: '#f39c12', fixed: false });
    }
    
    if (ASSETS.sfxDie) {
        playSound(ASSETS.sfxDie, 0.5);
    }

    // ⭐ 炸彈殭屍死亡自爆 (被打死也會爆)
    if (e.isBomb) {
        explodeZombie(e);
    }

    // 分裂邏輯
    if (e.type === 'split') {
        let count = GAME_CONFIG.splitZombieCount || 3;
        for (let k = 0; k < count; k++) {
            let mini = spawnMiniZombie(e.x, e.y);
            enemies.push(mini);
        }
    }

    // 如果本體死亡，盾牌或氣球或鐵甲處理
    if (e.hasShield && !e.shieldBroken) {
        e.shieldBroken = true;
        if (!window.fallingShields) window.fallingShields = [];
        window.fallingShields.push({
            x: e.x - 12, y: e.y, vx: 100, vy: -200, alpha: 1.0, angle: 0
        });
    }
    
    // 鐵甲破碎動畫 (不應觸發盾牌動畫)
    if (e.hasArmor && !e.armorBroken) {
        e.armorBroken = true;
        createParticles(e.x, e.y, GAME_CONFIG.armorColor, 15); // 鐵甲破碎只放粒子
    }
    
    if (e.isBalloon && !e.balloonPop) {
        createParticles(e.x, e.y - 40, GAME_CONFIG.balloonColor, 10);
    }

    if (e.isPlane && !e.planeBroken) {
        e.planeBroken = true;
        createParticles(e.x, e.y, GAME_CONFIG.planeColor, 15);
    }

    enemies.splice(index, 1);
}

function updateEnemies(dt) {
    // ⭐ 敵人生成邏輯已移至 main.js > updateCombatEnemySpawn()
    // （若 phase 為 combat / tutorial_combat，main.js 會處理生成）

    // 更新獨立掉落盾牌
    if (window.fallingShields) {
        for (let i = window.fallingShields.length - 1; i >= 0; i--) {
            let fs = window.fallingShields[i];
            fs.x += fs.vx * dt;
            fs.y += fs.vy * dt;
            fs.vy += 800 * dt;
            fs.angle += 10 * dt;
            fs.alpha -= 1.0 * dt;
            if (fs.alpha <= 0) window.fallingShields.splice(i, 1);
        }
    }

    // 更新毒液子彈
    if (window.enemyProjectiles) {
        for (let i = window.enemyProjectiles.length - 1; i >= 0; i--) {
            let p = window.enemyProjectiles[i];
            p.x += p.vx * dt;
            p.y += p.vy * dt;
            p.vy += 400 * dt;

            // 毒液子彈碰撞 (只檢查平台、單位與建築)
            let hitBase = (p.y > floorY - 45 && p.y < floorY - 5) && (Math.abs(p.x - (base.x + base.width)) < p.radius + 10);
            let hitUnit = null;
            for (let u of units) {
                if (u.state === 'active' && Math.hypot(p.x - u.x, p.y - u.y) < p.radius + u.radius) {
                    hitUnit = u; break;
                }
            }
            let hitBuilding = null;
            for (let b of buildings) {
                if (b.state === 'active' && Math.hypot(p.x - b.x, p.y - b.y) < p.radius + 20) {
                    hitBuilding = b; break;
                }
            }

            if (hitBase || hitUnit || hitBuilding) {
                if (hitBase) {
                    let damageDealt = Math.min(p.damage, player.hp);
                    player.hp -= p.damage;
                    if (GAME_CONFIG.showUnitDamageText) showDamageText(p.x, p.y, damageDealt, false, true, '#2ecc71');
                    base.flashTimer = 0.15;
                }
                if (hitUnit) {
                    let damageDealt = Math.min(p.damage, hitUnit.hp);
                    hitUnit.hp -= p.damage;
                    if (GAME_CONFIG.showUnitDamageText) showDamageText(p.x, p.y, damageDealt, false, true, '#2ecc71');
                    hitUnit.flashTimer = 0.1;
                    if (hitUnit.hp <= 0) killUnit(hitUnit);
                }
                if (hitBuilding) {
                    let damageDealt = Math.min(p.damage, hitBuilding.hp);
                    hitBuilding.hp -= p.damage;
                    if (GAME_CONFIG.showUnitDamageText) showDamageText(p.x, p.y, damageDealt, true, true, '#2ecc71');
                    hitBuilding.flashTimer = 0.15;
                    if (hitBuilding.hp <= 0) killBuilding(hitBuilding);
                }
                createParticles(p.x, p.y, p.color, 8);
                window.enemyProjectiles.splice(i, 1);
            } else if (p.y > floorY) {
                createParticles(p.x, p.y, p.color, 4);
                window.enemyProjectiles.splice(i, 1);
            }
        }
    }

    for (let i = enemies.length - 1; i >= 0; i--) {
        let e = enemies[i];
        
        // ⭐ 安全檢查：自動移除座標異常 (NaN) 或遠超出邊界的敵人，防止存檔/波次卡死
        if (isNaN(e.x) || isNaN(e.y) || 
            e.x < cameraX - 1200 ||          // 落後平台太遠 (左側)
            e.x > cameraX + canvas.width + 3000 || // 離平台太遠 (右側)
            e.y < -2500 || e.y > floorY + 1500     // 飛太高或掉入地底
        ) {
            enemies.splice(i, 1);
            continue;
        }

        if (e.flashTimer > 0) e.flashTimer -= dt;
        if (e.knockbackCooldown > 0) e.knockbackCooldown -= dt;
        if (e.bladeActiveTimer > 0) e.bladeActiveTimer -= dt;
        
        // 持刀殭屍攻擊邏輯 (2.5秒揮砍一次)
        if (e.isBlade && !e.knockbackCooldown) {
            if (gameTime - e.lastAttackTime >= GAME_CONFIG.bladeZombieCooldown) {
                e.lastAttackTime = gameTime;
                e.bladeActiveTimer = 0.2; // 揮砍 0.2s
                
                let diffMult = GAME_CONFIG.difficultyMultipliers[GAME_CONFIG.difficulty || 'normal'].dmg;
                let finalDmg = GAME_CONFIG.bladeZombieDamage * diffMult;

                // 造成傷害
                if (Math.abs(e.x - (base.x + base.width)) < GAME_CONFIG.bladeLength) player.hp -= finalDmg;
                for (let u of units) {
                    if (u.state === 'active' && Math.abs(e.x - u.x) < GAME_CONFIG.bladeLength + u.radius) {
                        u.hp -= finalDmg; u.flashTimer = 0.1;
                        if (u.hp <= 0) killUnit(u);
                    }
                }
                for (let b of buildings) {
                    if (b.state === 'active' && Math.abs(e.x - b.x) < GAME_CONFIG.bladeLength + 20) {
                        b.hp -= finalDmg; b.flashTimer = 0.1;
                        if (b.hp <= 0) killBuilding(b);
                    }
                }
            }
        }

        // 毒液攻擊邏輯
        if (e.isVenom && !e.knockbackCooldown) {
            let distToBase = Math.abs(e.x - (base.x + base.width));
            if (distToBase < GAME_CONFIG.venomZombieRange) {
                if (gameTime - e.lastAttackTime >= GAME_CONFIG.venomZombieCooldown) {
                    e.lastAttackTime = gameTime;
                    if (!window.enemyProjectiles) window.enemyProjectiles = [];
                    let angle = -Math.PI * 0.75 + (Math.random() * 0.2 - 0.1); 
                    
                    let diffMult = GAME_CONFIG.difficultyMultipliers[GAME_CONFIG.difficulty || 'normal'].dmg;
                    window.enemyProjectiles.push({
                        x: e.x, y: e.y,
                        vx: Math.cos(angle) * (GAME_CONFIG.venomShootForce * 0.7), // 速度調慢 30%
                        vy: Math.sin(angle) * (GAME_CONFIG.venomShootForce * 0.7),
                        damage: GAME_CONFIG.venomZombieDamage * diffMult,
                        color: GAME_CONFIG.venomProjectileColor,
                        radius: 5
                    });
                }
            }
        }

        // ⭐ 小飛機判定 (墜落邏輯)
        if (e.isPlane && !e.planeBroken) {
            let isOverBase = Math.abs(e.x - (base.x + base.width)) < e.radius;
            let isOverBuilding = false;
            for (let b of buildings) {
                if (b.state === 'active' || b.welded) {
                    if (Math.hypot(e.x - b.x, e.y - b.y) < 20 + e.radius) { isOverBuilding = true; break; }
                }
            }
            let isOverUnit = false;
            for (let u of units) {
                if (u.state === 'active' && Math.abs(e.x - u.x) < u.radius) { isOverUnit = true; break; }
            }

            if (isOverBase || isOverBuilding || isOverUnit) {
                // 飛機撞毀，掉落
                e.planeBroken = true;
                e.vy = 200; 
                // 撞擊造成傷害
                let diffMult = GAME_CONFIG.difficultyMultipliers[GAME_CONFIG.difficulty || 'normal'].dmg;
                let dmg = GAME_CONFIG.planeZombieDamage * diffMult;
                if (isOverBase) { player.hp -= dmg; showDamageText(e.x, e.y, dmg, false, true); }
                else if (isOverBuilding) { /* 建築物傷害邏輯已在碰撞中處理 */ }
            }
        }

        // ⭐ 炸彈殭屍自爆觸發 (碰撞判定)
        if (e.isBomb && !e.knockbackCooldown) {
            let isOverBase = Math.abs(e.x - (base.x + base.width)) < e.radius;
            let isOverBuilding = false;
            for (let b of buildings) {
                if (b.state === 'active' || b.welded) {
                    if (Math.hypot(e.x - b.x, e.y - b.y) < 20 + e.radius) { isOverBuilding = true; break; }
                }
            }
            let isOverUnit = false;
            for (let u of units) {
                if (u.state === 'active' && Math.hypot(e.x - u.x, e.y - u.y) < u.radius + e.radius) { isOverUnit = true; break; }
            }

            if (isOverBase || isOverBuilding || isOverUnit) {
                killEnemy(i); // 觸發自爆
                continue; // 跳過後續邏輯
            }
        }

        // 更新盾牌飛出效果 (被打破時)
        if (e.shieldBroken && e.shieldAlpha > 0) {
            e.shieldFlyX += e.shieldFlyVx * dt;
            e.shieldFlyY += e.shieldFlyVy * dt;
            e.shieldFlyVy += 800 * dt; 
            e.shieldAlpha -= 1.0 * dt; 
        }

        if (e.vx > e.originalVx) {
            e.vx -= 600 * dt; 
            if (e.vx < e.originalVx) e.vx = e.originalVx;
        }

        if ((e.isBalloon && !e.balloonPop) || (e.isPlane && !e.planeBroken)) {
            // 飄浮中不套用重力，只移動 X
            e.x += e.vx * dt;
            e.vy = 0; 

            // 更新 Y 軸浮動邏輯
            if (e.isBalloon) {
                e.y = floorY - GAME_CONFIG.balloonZombieFloatHeight + Math.sin(e.floatOffset + gameTime * 2) * GAME_CONFIG.balloonZombieOscillation;
                
                // 檢查是否在移動平台或建築物上方，如果是則掉下來
                let isOverBase = Math.abs(e.x - (base.x + base.width)) < e.radius;
                let isOverBuilding = false;
                for (let b of buildings) {
                    if (b.state === 'active' || b.welded) {
                        if (Math.hypot(e.x - b.x, e.y - b.y) < 20 + e.radius) { isOverBuilding = true; break; }
                    }
                }
                if (isOverBase || isOverBuilding) {
                    e.balloonPop = true; e.vy = 200; 
                    e.originalVx = -randomRange(GAME_CONFIG.zombieSpeedMin, GAME_CONFIG.zombieSpeedMax);
                    e.vx = e.originalVx;
                }
            } else if (e.isPlane) {
                e.y = floorY - GAME_CONFIG.planeZombieFloatHeight + Math.sin(e.floatOffset + gameTime * 3) * GAME_CONFIG.planeZombieOscillation;
            }
        } else {
            // 正常套用重力
            e.vy += gravity * 20; e.x += e.vx * dt; e.y += e.vy * dt;

            if (e.y + e.radius >= floorY) {
                e.y = floorY - e.radius; 
                // 氣球破掉掉下來，或是正常殭屍
                e.vy = -randomRange(e.jumpMin, e.jumpMax); 
            }
        }

        // 冷卻期間跳過碰撞傷害（防止每幀重複傷害）
        if (e.knockbackCooldown > 0) continue;

        let hitSomething = false;
        
        for (let b of buildings) {
            if (b.state === 'dying' || !b.welded) continue;
            
            // 改用更精確的 AABB 判定替代原本寬鬆的圓形判定
            let bw = b.type === 2 ? 80 : 40;
            let bh = b.type === 2 ? 20 : 40;
            
            // 考慮到旋轉，這裡做一個稍微寬鬆但比圓形精確很多的矩形判定
            let dx = Math.abs(e.x - b.x);
            let dy = Math.abs(e.y - b.y);
            
            if (dx < (bw/2 + e.radius - 2) && dy < (bh/2 + e.radius - 2)) {
                let dmg = GAME_CONFIG.zombieDamage;
                if (e.isFast) dmg = GAME_CONFIG.fastZombieDamage;
                else if (e.hasShield) dmg = GAME_CONFIG.shieldZombieDamage;
                else if (e.isBlade) dmg = GAME_CONFIG.bladeZombieDamage;
                else if (e.isVenom) dmg = GAME_CONFIG.venomZombieDamage;
                else if (e.hasArmor) dmg = GAME_CONFIG.armorZombieDamage;
                
                let diffMult = GAME_CONFIG.difficultyMultipliers[GAME_CONFIG.difficulty || 'normal'].dmg;
                let finalDmg = dmg * diffMult;
                let damageDealt = Math.min(finalDmg, b.hp);
                b.hp -= finalDmg;
                if (GAME_CONFIG.showUnitDamageText) showDamageText(b.x, b.y, damageDealt, true, true);
                b.flashTimer = 0.15;
                createParticles(e.x, e.y, '#e74c3c', 10);
                if (b.hp <= 0) killBuilding(b);
                // 彈飛而不是自爆
                e.flashTimer = 0.15;
                let pushDist = (bw / 2) + e.radius + 2; 
                e.x = b.x + pushDist; // 擠出建築體
                e.vx = 400;  // 向右彈飛
                e.vy = -200;
                e.knockbackCooldown = 0.5; // 0.5秒內不再判斷碰撞傷害
                createParticles(e.x, e.y, '#fff', 8);
                hitSomething = true;
                break;
            }
        }

        if (!hitSomething) {
            for (let u of units) {
                if (u.state === 'dying') continue;
                let dx = e.x - u.x; let dy = e.y - u.y;
                if (Math.sqrt(dx*dx + dy*dy) < e.radius + u.radius) {
                    let dmg = GAME_CONFIG.zombieDamage;
                    if (e.isFast) dmg = GAME_CONFIG.fastZombieDamage;
                    else if (e.hasShield) dmg = GAME_CONFIG.shieldZombieDamage;
                    else if (e.isBlade) dmg = GAME_CONFIG.bladeZombieDamage;
                    else if (e.isVenom) dmg = GAME_CONFIG.venomZombieDamage;
                    else if (e.hasArmor) dmg = GAME_CONFIG.armorZombieDamage;
                    
                    let diffMult = GAME_CONFIG.difficultyMultipliers[GAME_CONFIG.difficulty || 'normal'].dmg;
                    let finalDmg = dmg * diffMult;
                    let damageDealt = Math.min(finalDmg, u.hp);
                    u.hp -= finalDmg;
                    if (GAME_CONFIG.showUnitDamageText) showDamageText(u.x, u.y, damageDealt, false, true);
                    u.flashTimer = 0.1;
                    createParticles(e.x, e.y, '#e74c3c', 10);
                    if (u.hp <= 0) killUnit(u);
                    // 彈飛而不是自爆
                    e.flashTimer = 0.15;
                    e.x = u.x + u.radius + e.radius + 1; // 擠出單位
                    e.vx = 400;  // 向右彈飛
                    e.vy = -200;
                    e.knockbackCooldown = 0.5; // 0.5秒內不再判斷碰撞傷害
                    createParticles(e.x, e.y, '#fff', 8);
                    hitSomething = true;
                    break; 
                }
            }
        }

        // ⭐ 撞擊平台：彈飛 (Knockback) 牢籠不在此限
        if (!hitSomething && !e.isCage &&
            e.x - e.radius < base.x + base.width && e.x + e.radius > base.x &&
            e.y + e.radius > base.y && e.y - e.radius < base.y + base.height) {
            
            let dmg = GAME_CONFIG.zombieDamage;
            if (e.isFast) dmg = GAME_CONFIG.fastZombieDamage;
            else if (e.hasShield) dmg = GAME_CONFIG.shieldZombieDamage;
            else if (e.isBlade) dmg = GAME_CONFIG.bladeZombieDamage;
            else if (e.isVenom) dmg = GAME_CONFIG.venomZombieDamage;
            else if (e.hasArmor) dmg = GAME_CONFIG.armorZombieDamage;
            
            let diffMult = GAME_CONFIG.difficultyMultipliers[GAME_CONFIG.difficulty || 'normal'].dmg;
            let finalDmg = dmg * diffMult;
            let damageDealt = Math.min(finalDmg, player.hp);
            player.hp -= finalDmg;
            if (GAME_CONFIG.showUnitDamageText) showDamageText(base.x + base.width, floorY - 40, damageDealt, false, true);
            base.flashTimer = 0.15; // 平台閃白光
            base.speedBoost = GAME_CONFIG.baseHitBoost; 
            
            // 敵人也閃白光並彈飛
            e.flashTimer = 0.15;
            e.x = base.x + base.width + e.radius + 1; // 把敵人擠出車體，防止卡死在裡面
            e.vx = 400;  // 給予強大的向右速度(彈飛)
            e.vy = -200; // 稍微往上擊飛
            e.knockbackCooldown = 0.5;
            
            createParticles(e.x, e.y, '#fff', 10); // 產生碰撞火花
            
            if (player.hp < 0) player.hp = 0;
        }
    }
}

function drawEnemies() {
    ctx.save(); ctx.translate(-cameraX, 0);

    // 繪製獨立掉落的盾牌
    if (window.fallingShields) {
        window.fallingShields.forEach(fs => {
            ctx.save();
            ctx.globalAlpha = fs.alpha;
            ctx.translate(fs.x, fs.y);
            ctx.rotate(fs.angle);
            ctx.fillStyle = '#5d4037'; ctx.strokeStyle = '#3e2723'; ctx.lineWidth = 2;
            ctx.beginPath(); ctx.arc(0, 0, 12, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
            ctx.strokeStyle = '#7f8c8d'; ctx.lineWidth = 1.5;
            ctx.beginPath(); ctx.arc(0, 0, 10, 0, Math.PI * 2); ctx.stroke();
            ctx.restore();
        });
    }

    enemies.forEach(e => {
        // 繪製本體
        let radius = e.radius || 16;
        let scale = e.scale || 1.0;
        
        // ⭐ 先畫殭屍本體 (如果是在飛機上，先畫本體讓它在飛機下面)
        let drawY = e.y;
        if (e.isPlane && !e.planeBroken) drawY -= 5; // 飛機殭屍往上移一點露出眼睛
        
        if (e.flashTimer > 0) drawCircle(e.x, drawY, radius, '#ffffff'); 
        else drawCircle(e.x, drawY, radius, e.color);
        
        ctx.fillStyle = '#000'; 
        ctx.fillRect(e.x - 8 * scale, drawY - 4 * scale, 3 * scale, 3 * scale); 
        ctx.fillRect(e.x - 2 * scale, drawY - 4 * scale, 3 * scale, 3 * scale);

        // ⭐ 再畫小飛機 (覆蓋在殭屍上方，讓殭屍看起來像坐在裡面)
        if (e.isPlane && !e.planeBroken) {
            ctx.save();
            ctx.fillStyle = GAME_CONFIG.planeColor;
            ctx.beginPath();
            // 飛機主體稍微往下移一點，配合殭屍往上移
            ctx.ellipse(e.x, e.y + 12, 30, 15, 0, 0, Math.PI * 2); 
            ctx.fill();
            // 機翼
            ctx.fillRect(e.x - 10, e.y - 2, 20, 30);
            // 螺旋槳
            ctx.strokeStyle = '#fff'; ctx.lineWidth = 2;
            ctx.beginPath();
            let propOffset = Math.sin(gameState.timer * 25) * 12;
            ctx.moveTo(e.x - 30, e.y + 12 - propOffset);
            ctx.lineTo(e.x - 30, e.y + 12 + propOffset);
            ctx.stroke();
            ctx.restore();
        }

        // ⭐ 炸彈殭屍視覺
        if (e.isBomb) {
            ctx.fillStyle = '#000';
            ctx.beginPath();
            ctx.arc(e.x + 8, e.y - 12, 6, 0, Math.PI * 2);
            ctx.fill();
            // 引信
            ctx.strokeStyle = '#f1c40f'; ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(e.x + 8, e.y - 18);
            ctx.lineTo(e.x + 12, e.y - 24);
            ctx.stroke();
        }

        // ⭐ 分裂殭屍的裂痕
        if (e.type === 'split') {
            ctx.strokeStyle = 'rgba(0,0,0,0.5)';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(e.x - 8, e.y - 8); ctx.lineTo(e.x - 4, e.y); ctx.lineTo(e.x - 6, e.y + 8);
            ctx.moveTo(e.x + 8, e.y - 8); ctx.lineTo(e.x + 4, e.y); ctx.lineTo(e.x + 6, e.y + 8);
            ctx.moveTo(e.x, e.y - 10); ctx.lineTo(e.x + 2, e.y); ctx.lineTo(e.x - 1, e.y + 10);
            ctx.stroke();
        }

        // 繪製血條 (敵人)
        if (GAME_CONFIG.showEnemyHp) {
            let isFullHp = (e.hp >= e.maxHp);
            let hasArmor = (e.hasShield && !e.shieldBroken) || (e.hasArmor && !e.armorBroken) || (e.isPlane && !e.planeBroken);
            let isFullArmor = true;
            let armorRatio = 0;
            if (e.hasShield && !e.shieldBroken) { isFullArmor = (e.shieldHp >= e.maxShieldHp); armorRatio = e.shieldHp / e.maxShieldHp; }
            else if (e.hasArmor && !e.armorBroken) { isFullArmor = (e.armorHp >= e.maxArmorHp); armorRatio = e.armorHp / e.maxArmorHp; }
            else if (e.isPlane && !e.planeBroken) { isFullArmor = (e.planeHp >= e.maxPlaneHp); armorRatio = e.planeHp / e.maxPlaneHp; }

            // ⭐ 只要本體或護甲任一受傷，就顯示血條
            if (!isFullHp || (hasArmor && !isFullArmor)) {
                let barW = 24 * scale; let barH = 4;
                let bx = e.x - barW/2; 
                let by = e.y - radius - 10;
                if (e.isPlane && !e.planeBroken) by = e.y - radius - 15; // 飛機高一點
                
                // 如果兩者都受傷，則顯示雙重血條
                if (!isFullHp && !isFullArmor) {
                    // 1. 上層：護甲條 (灰色)
                    ctx.fillStyle = 'rgba(0,0,0,0.5)'; ctx.fillRect(bx, by - 6, barW, barH);
                    ctx.fillStyle = '#95a5a6'; ctx.fillRect(bx, by - 6, barW * armorRatio, barH);
                    // 2. 下層：本體條 (紅色)
                    ctx.fillStyle = 'rgba(0,0,0,0.5)'; ctx.fillRect(bx, by, barW, barH);
                    ctx.fillStyle = '#e74c3c'; ctx.fillRect(bx, by, barW * (e.hp/e.maxHp), barH);
                } else if (!isFullArmor) {
                    // 僅顯示護甲條
                    ctx.fillStyle = 'rgba(0,0,0,0.5)'; ctx.fillRect(bx, by, barW, barH);
                    ctx.fillStyle = '#95a5a6'; ctx.fillRect(bx, by, barW * armorRatio, barH);
                } else if (!isFullHp) {
                    // 僅顯示本體條
                    ctx.fillStyle = 'rgba(0,0,0,0.5)'; ctx.fillRect(bx, by, barW, barH);
                    ctx.fillStyle = '#e74c3c'; ctx.fillRect(bx, by, barW * (e.hp/e.maxHp), barH);
                }
            }
        }

        // 繪製持刀殭屍的刀
        if (e.isBlade) {
            ctx.save();
            ctx.translate(e.x, e.y);
            // 揮砍方向：向左上方進攻方向 (修正：轉 180 度)
            let baseAngle = Math.PI; 
            let slashOffset = (e.bladeActiveTimer > 0) ? (0.2 - e.bladeActiveTimer) * 10 : 0;
            let angle = baseAngle - Math.PI/4 - slashOffset + Math.PI; // 加入 Math.PI 轉 180 度
            ctx.rotate(angle);
            // 刀柄
            ctx.fillStyle = '#795548'; ctx.fillRect(-2, -5, 4, 10);
            // 刀身
            ctx.fillStyle = '#95a5a6';
            ctx.beginPath();
            ctx.moveTo(-2, -5); ctx.lineTo(2, -5); ctx.lineTo(2, -GAME_CONFIG.bladeLength); ctx.lineTo(-2, -GAME_CONFIG.bladeLength);
            ctx.fill();
            // 刀尖
            ctx.strokeStyle = '#bdc3c7'; ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(2, -GAME_CONFIG.bladeLength); ctx.lineTo(-2, -GAME_CONFIG.bladeLength); ctx.stroke();
            
            // 揮砍特效
            if (e.bladeActiveTimer > 0) {
                ctx.restore(); ctx.save();
                ctx.translate(e.x, e.y);
                ctx.beginPath();
                ctx.arc(0, 0, GAME_CONFIG.bladeLength, Math.PI * 0.7, Math.PI * 1.3);
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
                ctx.lineWidth = 10;
                ctx.stroke();
                ctx.restore();
            }
            ctx.restore();
        }
        
        // ⭐ 畫牢籠 [Req 6]
        if (e.isCage) {
            if (ASSETS.imgCage && ASSETS.imgCage.complete && ASSETS.imgCage.naturalWidth > 0) {
                // 使用自定義圖片
                ctx.drawImage(ASSETS.imgCage, e.x - radius * 1.5, e.y - radius * 1.5, radius * 3, radius * 3);
            } else {
                ctx.fillStyle = '#7f8c8d'; 
                ctx.fillRect(e.x - radius, e.y - radius, radius * 2, radius * 2);
                ctx.strokeStyle = '#2c3e50'; ctx.lineWidth = 2;
                ctx.strokeRect(e.x - radius, e.y - radius, radius * 2, radius * 2);
                // 鐵柱
                ctx.fillStyle = '#34495e';
                for (let i = -10; i <= 10; i += 10) {
                    ctx.fillRect(e.x + i - 2, e.y - radius, 4, radius * 2);
                }
            }
            
            // ⭐ 標示裡面有單位 (繪製迷你圖示) [Req 6]
            ctx.save();
            ctx.translate(e.x, e.y + 5);
            ctx.scale(0.6, 0.6);
            let drawType = e.unitInside;
            let color = GAME_CONFIG[drawType + 'Color'] || '#fff';
            drawEncyclopediaIcon({ type: 'unit', drawType: drawType, color: color }, ctx, true);
            ctx.restore();

            ctx.fillStyle = '#fff'; ctx.font = 'bold 10px Arial'; ctx.textAlign = 'center';
            ctx.fillText(e.unitInside.toUpperCase(), e.x, e.y - radius - 5);
        }

        // ⭐ 繪製鐵甲殭屍的盔甲 (無死角全覆蓋)
        if (e.hasArmor && !e.armorBroken) {
            ctx.save();
            ctx.translate(e.x, e.y);
            ctx.strokeStyle = GAME_CONFIG.armorColor;
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.arc(0, 0, e.radius + 2, 0, Math.PI * 2);
            ctx.stroke();
            
            // 盔甲金屬質感
            ctx.fillStyle = 'rgba(149, 165, 166, 0.3)';
            ctx.beginPath();
            ctx.arc(0, 0, e.radius + 2, 0, Math.PI * 2);
            ctx.fill();
            
            // 裂痕效果 (當盔甲血量低於一半時)
            if (e.armorHp <= e.maxArmorHp / 2) {
                ctx.strokeStyle = '#000';
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(-5, -5); ctx.lineTo(5, 5);
                ctx.moveTo(5, -5); ctx.lineTo(-5, 5);
                ctx.stroke();
            }
            ctx.restore();
        }

        // 繪製氣球
        if (e.isBalloon && !e.balloonPop) {
            ctx.save();
            // 繩子
            ctx.strokeStyle = '#fff'; ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(e.x, e.y - e.radius); ctx.lineTo(e.x, e.y - 40); ctx.stroke();
            // 氣球
            ctx.fillStyle = GAME_CONFIG.balloonColor;
            ctx.beginPath();
            ctx.ellipse(e.x, e.y - 60, 15, 20, 0, 0, Math.PI * 2);
            ctx.fill();
            // 氣球高光
            ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
            ctx.beginPath();
            ctx.ellipse(e.x - 5, e.y - 65, 5, 8, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }

        // 繪製盾牌
        if (e.hasShield) {
            ctx.save();
            if (e.shieldBroken) {
                // 盾牌被打破飛出效果
                ctx.globalAlpha = e.shieldAlpha;
                ctx.translate(e.shieldFlyX, e.shieldFlyY);
                ctx.rotate(gameTime * 10); 
            } else {
                ctx.translate(e.x - 12, e.y); // 盾牌在前方
            }

            // 盾牌主體 (圓形破爛盾牌)
            ctx.fillStyle = '#5d4037'; // 深棕色木盾
            ctx.strokeStyle = '#3e2723';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(0, 0, 12, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();

            // 盾牌金屬邊框
            ctx.strokeStyle = '#7f8c8d';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.arc(0, 0, 10, 0, Math.PI * 2);
            ctx.stroke();

            // 裂痕效果 (當盾牌血量低於一半時)
            if (!e.shieldBroken && e.shieldHp <= e.maxShieldHp / 2) {
                ctx.strokeStyle = '#000';
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(-5, -5); ctx.lineTo(0, 0); ctx.lineTo(-3, 5);
                ctx.moveTo(5, -2); ctx.lineTo(2, 3);
                ctx.stroke();
            }
            ctx.restore();
        }
    });

    // 繪製敵方投影物 (毒液)
    if (window.enemyProjectiles) {
        window.enemyProjectiles.forEach(p => {
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fill();
            // 毒液泡泡效果
            ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
            ctx.beginPath();
            ctx.arc(p.x - 1, p.y - 1, p.radius * 0.4, 0, Math.PI * 2);
            ctx.fill();
        });
    }

    ctx.restore();
}