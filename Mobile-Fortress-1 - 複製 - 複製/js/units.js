// js/units.js
function killUnit(u) {
    if (u.state === 'dying') return;
    u.state = 'dying'; u.isOnBase = false; u.hp = 0;
    player.unitCount--;
    const angle = Math.PI + Math.PI / 6; 
    const force = 300;
    u.vx = Math.cos(angle) * force; u.vy = Math.sin(angle) * force;
    if (player.aimingUnit === u) player.aimingUnit = null;
}

function updateUnits(dt, baseMoveDist) {
    for (let i = units.length - 1; i >= 0; i--) {
        let u1 = units[i];
        u1.squishY += (1 - u1.squishY) * 0.1;
        if (u1.flashTimer > 0) u1.flashTimer -= dt;

        if (u1.state === 'dying') {
            if (u1.y + u1.radius >= floorY) {
                createParticles(u1.x, floorY, u1.color, 15);
                units.splice(i, 1);
            }
            continue;
        }

        if (gameState.phase === 'combat' || gameState.phase === 'clearing' || gameState.phase === 'wave' || 
            gameState.phase === 'tutorial_combat' || gameState.phase === 'tutorial_clearing') {
            if (u1.reaimCooldown > 0) u1.reaimCooldown -= dt;
            if (!u1.isAiming && (u1.reaimCooldown || 0) <= 0 && gameTime - u1.lastShootTime >= u1.cooldown) {
                u1.lastShootTime = gameTime;
                u1.squishY = u1.type === 'cannon' ? 1.5 : 1.3;
                
                let absoluteAimAngle = (u1.localAimAngle || 0) + (u1.rollAngle || 0);

                if (u1.type === 'swordsman') {
                    slashes.push({ x: u1.x, y: u1.y, angle: absoluteAimAngle, radius: u1.aoeRadius, life: 0.15, maxLife: 0.15 });
                    
                    for (let j = enemies.length - 1; j >= 0; j--) {
                        let e = enemies[j];
                        let dx = e.x - u1.x; let dy = e.y - u1.y;
                        let dist = Math.sqrt(dx*dx + dy*dy);
                        
                        if (dist <= u1.aoeRadius + e.radius) {
                            let angleToEnemy = Math.atan2(dy, dx);
                            let angleDiff = Math.abs(angleToEnemy - absoluteAimAngle);
                            while (angleDiff > Math.PI) angleDiff -= 2 * Math.PI;
                            
                            if (Math.abs(angleDiff) <= Math.PI / 2.5) {
                                // 劍氣判定載具/盾牌
                                let hitCarrierSlash = false;
                                
                                // 小飛機
                                if (e.isPlane && !e.planeBroken && u1.y > e.y) { // 玩家從下方砍到飛機
                                    e.planeHp -= u1.damage;
                                    e.flashTimer = 0.1;
                                    if (e.planeHp <= 0) e.planeBroken = true;
                                    hitCarrierSlash = true;
                                }
                                // 氣球
                                else if (e.isBalloon && !e.balloonPop && u1.y < e.y - 30) { // 玩家從上方砍到氣球
                                    e.balloonPop = true;
                                    e.originalVx = -randomRange(GAME_CONFIG.zombieSpawnMin, GAME_CONFIG.zombieSpawnMax); // 此處應為 speed
                                    hitCarrierSlash = true;
                                }
                                // 盾牌
                                else if (e.hasShield && !e.shieldBroken) {
                                    const shieldX = e.x - 12;
                                    const distToShield = Math.hypot(u1.x - shieldX, u1.y - e.y);
                                    if (distToShield <= u1.aoeRadius + 12) {
                                        e.shieldHp -= u1.damage;
                                        e.flashTimer = 0.1;
                                        if (e.shieldHp <= 0) {
                                            e.shieldBroken = true;
                                            if (!window.fallingShields) window.fallingShields = [];
                                            window.fallingShields.push({ x: shieldX, y: e.y, vx: 100, vy: -200, alpha: 1.0, angle: 0 });
                                        }
                                        hitCarrierSlash = true;
                                    }
                                }

                                if (!hitCarrierSlash) {
                                    e.hp -= u1.damage; 
                                    e.flashTimer = 0.1;
                                    if (e.hp <= 0) killEnemy(j);
                                }
                                // 劍士擊退：
                                // meleeCanKnockbackArmored=true → 始終擊退（無論有無護甲/載具）
                                // meleeCanKnockbackArmored=false → 命中護甲/盾牌/載具時不擊退，只有命中本體才擊退
                                let shouldKnockback = !hitCarrierSlash || GAME_CONFIG.meleeCanKnockbackArmored;
                                if (shouldKnockback) {
                                    e.vx = Math.cos(absoluteAimAngle) * GAME_CONFIG.swordsmanKnockback;
                                    e.vy = GAME_CONFIG.meleeKnockbackVy;
                                }
                                createParticles(e.x, e.y, '#fff', 5);
                            }
                        }
                    }
                } else {
                    arrows.push({
                        type: u1.type, x: u1.x, y: u1.y,
                        vx: Math.cos(absoluteAimAngle) * u1.shootForce + (baseMoveDist / dt), 
                        vy: Math.sin(absoluteAimAngle) * u1.shootForce,
                        damage: u1.damage, gravityMult: u1.gravityMult, aoeRadius: u1.aoeRadius, active: true
                    });
                }
            }
        }
    }
}

function updateProjectiles(dt) {
    for (let i = arrows.length - 1; i >= 0; i--) {
        let a = arrows[i];
        a.vy += a.gravityMult * dt; a.x += a.vx * dt; a.y += a.vy * dt;

        let hitEnemy = false;
        let hitShield = false;
        let hitBlade = false;
        for (let j = enemies.length - 1; j >= 0; j--) {
            let e = enemies[j];
            const dx = a.x - e.x; const dy = a.y - e.y;
            const dist = Math.sqrt(dx*dx + dy*dy);
            
            // 持刀殭屍揮砍擋子彈
            if (e.isBlade && e.bladeActiveTimer > 0) {
                // 如果拋射物在持刀殭屍前方且在刀的長度內
                if (a.x < e.x && Math.abs(e.x - a.x) < GAME_CONFIG.bladeLength && Math.abs(e.y - a.y) < GAME_CONFIG.bladeWidth) {
                    hitBlade = true;
                    createParticles(a.x, a.y, '#fff', 5);
                    break;
                }
            }

            // 鐵甲判定 (全方位防禦)—遠程命中鐵甲不擊退本體，子彈消失
            if (e.hasArmor && !e.armorBroken && dist < e.radius + 5) {
                let damageDealt = Math.min(a.damage, e.armorHp);
                e.armorHp -= a.damage;
                if (GAME_CONFIG.showDamageText) showDamageText(e.x, e.y, damageDealt, true);
                e.flashTimer = 0.1;
                if (e.armorHp <= 0) {
                    e.armorBroken = true;
                    if (!window.fallingShields) window.fallingShields = [];
                    window.fallingShields.push({ x: e.x, y: e.y, vx: 50, vy: -150, alpha: 1.0, angle: 0, color: GAME_CONFIG.armorColor });
                }
                // 遠程命中鐵甲：不擊退（子彈被鐵甲阻擋，直接消失）
                hitEnemy = true;
                break;
            }
            // 盾牌判定區域 (在殭屍前方)—遠程命中盾牌不擊退本體
            if (e.hasShield && !e.shieldBroken) {
                const shieldX = e.x - 12;
                const shieldDist = Math.hypot(a.x - shieldX, a.y - e.y);
                if (shieldDist < 12 + 5) {
                    hitShield = true;
                    let damageDealt = Math.min(a.damage, e.shieldHp);
                    e.shieldHp -= a.damage;
                    if (GAME_CONFIG.showDamageText) showDamageText(shieldX, e.y, damageDealt, true);
                    e.flashTimer = 0.1;
                    if (e.shieldHp <= 0) {
                        e.shieldBroken = true;
                        if (!window.fallingShields) window.fallingShields = [];
                        window.fallingShields.push({
                            x: shieldX, y: e.y, vx: 100, vy: -200, alpha: 1.0, angle: 0
                        });
                    }
                    break;
                }
            }

            // ⭐ 小飛機判定 (下方命中飛機，上方命中本體)
            if (e.isPlane && !e.planeBroken) {
                const planeDist = Math.hypot(a.x - e.x, a.y - (e.y + 12)); // 飛機中心在 e.y + 12
                if (planeDist < 30 && a.y > e.y) { // 從下方攻擊飛機
                    let damageDealt = Math.min(a.damage, e.planeHp);
                    e.planeHp -= a.damage;
                    if (GAME_CONFIG.showDamageText) showDamageText(e.x, e.y + 12, damageDealt, true);
                    e.flashTimer = 0.1;
                    if (e.planeHp <= 0) {
                        e.planeBroken = true;
                        createParticles(e.x, e.y + 12, GAME_CONFIG.planeColor, 15);
                    }
                    
                    // 擊退效果 (命中飛機)—遠程不擊退本體，子彈止此消失
                    hitEnemy = true;
                    break;
                }
            }

            // 氣球判定 (上方命中氣球，下方命中本體)
            if (e.isBalloon && !e.balloonPop) {
                const balloonY = e.y - 60;
                const balloonDist = Math.hypot(a.x - e.x, a.y - balloonY);
                if (balloonDist < 20 && a.y < e.y - 30) { // 從上方攻擊氣球
                    e.balloonPop = true;
                    e.originalVx = -randomRange(GAME_CONFIG.zombieSpeedMin, GAME_CONFIG.zombieSpeedMax);
                    e.vx = e.originalVx;
                    createParticles(e.x, balloonY, GAME_CONFIG.balloonColor, 10);
                    
                    hitEnemy = true;
                    break;
                }
            }

            // 本體判定
            if (dist < e.radius + 5) {
                hitEnemy = true;
                if (a.type !== 'cannon') {
                    let damageDealt = Math.min(a.damage, e.hp);
                    e.hp -= a.damage; 
                    if (GAME_CONFIG.showDamageText) showDamageText(e.x, e.y, damageDealt, false);
                    e.flashTimer = 0.1;
                    
                    // 擊退效果：遠程子彈命中本體—必須覆蓋 vx，不能累加
                    let kb = GAME_CONFIG[a.type + 'Knockback'] || 0;
                    if (kb > 0) {
                        let angle = Math.atan2(a.vy, a.vx);
                        let newVx = Math.cos(angle) * kb;
                        e.vx = (newVx > 0) ? Math.max(e.vx, newVx) : Math.min(e.vx, newVx);
                        e.vy = GAME_CONFIG.rangedKnockbackVy;
                    }
                    
                    if (e.hp <= 0) killEnemy(j);
                }
                break;
            }
        }

        if (hitEnemy || hitShield || hitBlade || a.y >= floorY) {
            if (a.y > floorY && !hitEnemy && !hitBlade) a.y = floorY; 
            if (a.type === 'cannon') {
                createParticles(a.x, a.y, '#e67e22', 15);
                explosions.push({ x: a.x, y: a.y, radius: 0, maxRadius: a.aoeRadius, life: 0.2, maxLife: 0.2 });
                for (let j = enemies.length - 1; j >= 0; j--) {
                    let e = enemies[j];
                    let dx = a.x - e.x; let dy = a.y - e.y;
                    if (Math.sqrt(dx*dx + dy*dy) <= a.aoeRadius + e.radius) {
                    if (e.hasShield && !e.shieldBroken) {
                        e.shieldHp -= a.damage;
                        if (e.shieldHp <= 0) {
                            e.shieldBroken = true;
                            e.shieldFlyX = e.x - 10; e.shieldFlyY = e.y;
                            e.shieldFlyVx = 200; e.shieldFlyVy = -300;
                        }
                    }
                    if (e.hasArmor && !e.armorBroken) {
                        e.armorHp -= a.damage;
                        if (e.armorHp <= 0) {
                            e.armorBroken = true;
                            if (!window.fallingShields) window.fallingShields = [];
                            window.fallingShields.push({ x: e.x, y: e.y, vx: 50, vy: -150, alpha: 1.0, angle: 0, color: GAME_CONFIG.armorColor });
                        }
                    }
                    // 砲彈是範圍傷害，盾牌/鐵甲扣血本體也扣血
                    e.hp -= a.damage; 
                    e.flashTimer = 0.1;
                    
                    // 擊退效果 (砲彈中心向外彈開)—砲彈為近戰型，可擊退有護甲敵人
                    let kb = GAME_CONFIG.cannonKnockback || 0;
                    if (kb > 0) {
                        let kbAngle = Math.atan2(e.y - a.y, e.x - a.x);
                        // 砲彈使用強力覆蓋 vx
                        let newVx = Math.cos(kbAngle) * kb;
                        e.vx = (newVx > 0) ? Math.max(e.vx, newVx) : Math.min(e.vx, newVx);
                        e.vy = GAME_CONFIG.meleeKnockbackVy; // 砲彈向上擊飛更明顯
                    }
                    
                    if (e.hp <= 0) killEnemy(j);
                }
                }
            } else {
                if (!hitEnemy && !hitBlade) createParticles(a.x, floorY, '#f1c40f', 3);
            }
            arrows.splice(i, 1);
        }
    }
}

function drawUnitsAndProjectiles() {
    ctx.save(); ctx.translate(-cameraX, 0);
    
    units.forEach(u => {
        let drawColor = u.flashTimer > 0 ? '#ffffff' : u.color;
        let wYOffset = (gameState.backpackAnimVal || 0) * (-canvas.height / 2);
        let absoluteLookAngle = u.isAiming ? Math.atan2((mouseScreenY - wYOffset) - u.y, (mouseScreenX + cameraX) - u.x) : ((u.localAimAngle || 0) + (u.rollAngle || 0));
        
        ctx.save();
        ctx.translate(u.x, u.y);
        
        // ⭐ 安全區選取特效 (修正：僅選取最接近滑鼠的單一單位)
        if (gameState.phase === 'safezone_shop' && player.reaimMode && !player.aimingUnit) {
            let mouseX = mouseScreenX + cameraX;
            let mouseY = mouseScreenY - wYOffset;
            let d = Math.hypot(mouseX - u.x, mouseY - u.y);
            
            // 找出範圍內最接近滑鼠的單位
            let closest = null;
            let minDist = 30;
            for (let other of units) {
                if (other.state === 'active') {
                    let dist = Math.hypot(mouseX - other.x, mouseY - other.y);
                    if (dist < minDist) { minDist = dist; closest = other; }
                }
            }
            
            if (u === closest) {
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
                ctx.lineWidth = 3;
                ctx.setLineDash([5, 5]);
                ctx.beginPath();
                ctx.arc(0, 0, u.radius + 12, 0, Math.PI * 2);
                ctx.stroke();
                ctx.setLineDash([]);
            }
        }

        ctx.save();
        ctx.rotate(u.rollAngle || 0); 
        
        ctx.fillStyle = drawColor;
        ctx.beginPath(); ctx.ellipse(0, 0, u.radius * 1, u.radius * u.squishY, 0, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.beginPath(); ctx.ellipse(-u.radius*0.3, -u.radius*0.3, u.radius * 0.3, u.radius * 0.3, 0, 0, Math.PI * 2); ctx.fill();
        
        let eyeAngle = absoluteLookAngle - (u.rollAngle || 0);
        let ex = Math.cos(eyeAngle) * 4;
        let ey = -4 + Math.sin(eyeAngle) * 4;
        ctx.fillStyle = '#000';
        ctx.fillRect(ex - 4, ey - 2, 3, 3);
        ctx.fillRect(ex + 2, ey - 2, 3, 3);
        ctx.restore(); 

        // ⭐ 繪製血條 (單位)
        if (GAME_CONFIG.showUnitHp) {
            let barW = 20; let barH = 3;
            let bx = 0 - barW/2; let by = - u.radius - 8;
            ctx.fillStyle = 'rgba(0,0,0,0.5)'; ctx.fillRect(bx, by, barW, barH);
            ctx.fillStyle = '#2ecc71'; ctx.fillRect(bx, by, barW * (u.hp/u.maxHp), barH);
        }

        ctx.save();
        ctx.rotate(absoluteLookAngle);
        if (u.type === 'cannon') {
            ctx.strokeStyle = '#2c3e50'; ctx.lineWidth = 6; ctx.lineCap = 'round'; ctx.beginPath();
            ctx.moveTo(0, -u.radius * 0.5); ctx.lineTo(16, -u.radius * 0.5); ctx.stroke();
        } else if (u.type === 'pistol') {
            ctx.fillStyle = '#7f8c8d'; // 鐵灰色槍身
            ctx.fillRect(4, -3, 12, 4); // 槍管
            ctx.fillStyle = '#8e44ad'; // 握把
            ctx.fillRect(2, -3, 4, 8); 
        } else if (u.type === 'archer') {
            // ⭐ 弓箭大一倍 (40x40)，調整為對齊手部的中心點
            if (ASSETS.imgBow.complete && ASSETS.imgBow.naturalWidth > 0) {
                ctx.drawImage(ASSETS.imgBow, -10, -20, 40, 40); 
            } else {
                ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; ctx.beginPath(); 
                ctx.moveTo(0, -2); ctx.lineTo(10, -2); ctx.stroke();
            }
        } else if (u.type === 'swordsman') {
            let timeSinceShoot = gameTime - u.lastShootTime;
            let rotation = -Math.PI/4; 
            if (!u.isAiming && timeSinceShoot < u.cooldown && timeSinceShoot < 0.15) {
                let progress = timeSinceShoot / 0.15;
                rotation = -Math.PI/3 + (Math.PI/1.5 * progress); 
            }
            ctx.rotate(rotation);
            ctx.fillStyle = '#ecf0f1'; ctx.fillRect(0, -2, 22, 4); 
            ctx.fillStyle = '#e67e22'; ctx.fillRect(-2, -6, 4, 12); 
        }
        ctx.restore();
        ctx.restore(); 
    });

    if (player.aimingUnit) {
        let u = player.aimingUnit;
        let wYOffset2 = (gameState.backpackAnimVal || 0) * (-canvas.height / 2);
        let angle = Math.atan2((mouseScreenY - wYOffset2) - u.y, (mouseScreenX + cameraX) - u.x);
        
        ctx.save(); ctx.translate(u.x, u.y); ctx.rotate(angle);
        
        if (u.type === 'pistol') {
            // 槍手專屬 3 單位長度虛線
            ctx.setLineDash([5, 5]);
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(15, 0);
            ctx.lineTo(135, 0); // 假設 1 單位約 40px，3 單位 120px + 起點 15 = 135
            ctx.stroke();
            ctx.setLineDash([]);
        } else {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.7)'; ctx.fillRect(15, -2, 30, 4);
            ctx.beginPath(); ctx.moveTo(45, -8); ctx.lineTo(60, 0); ctx.lineTo(45, 8); ctx.fill();
        }
        
        if (u.type === 'swordsman') {
            ctx.beginPath(); ctx.moveTo(0, 0); ctx.arc(0, 0, u.aoeRadius, -Math.PI/2.5, Math.PI/2.5);
            ctx.fillStyle = 'rgba(236, 240, 241, 0.2)'; ctx.fill();
        }
        ctx.restore();
    }

    slashes.forEach(s => {
        ctx.save(); ctx.translate(s.x, s.y); ctx.rotate(s.angle);
        ctx.beginPath(); ctx.arc(0, 0, s.radius, -Math.PI/3, Math.PI/3);
        ctx.lineWidth = 6; ctx.strokeStyle = `rgba(255, 255, 255, ${(s.life / s.maxLife)})`; ctx.stroke();
        ctx.restore();
    });

    arrows.forEach(a => {
        if (a.type === 'cannon') {
            ctx.fillStyle = '#0b0f19'; ctx.beginPath(); ctx.arc(a.x, a.y, 7, 0, Math.PI*2); ctx.fill();
            ctx.strokeStyle = '#bdc3c7'; ctx.lineWidth = 1.5; ctx.stroke();
        } else if (a.type === 'pistol') {
            ctx.fillStyle = '#bdc3c7'; ctx.beginPath(); ctx.arc(a.x, a.y, 3, 0, Math.PI*2); ctx.fill();
            ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.arc(a.x - 1, a.y - 1, 1, 0, Math.PI*2); ctx.fill();
            // 子彈尾跡
            ctx.strokeStyle = 'rgba(189, 195, 199, 0.4)'; ctx.lineWidth = 2;
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(a.x - a.vx * 0.02, a.y - a.vy * 0.02); ctx.stroke();
        } else {
            ctx.fillStyle = '#f1c40f'; ctx.save(); ctx.translate(a.x, a.y); ctx.rotate(Math.atan2(a.vy, a.vx));
            ctx.fillRect(-6, -2, 12, 4); ctx.fillStyle = '#fff'; ctx.fillRect(6, -3, 4, 6); ctx.restore();
        }
    });

    explosions.forEach(exp => {
        ctx.fillStyle = `rgba(230, 126, 34, ${exp.life/exp.maxLife * 0.7})`;
        ctx.beginPath(); ctx.arc(exp.x, exp.y, exp.radius, 0, Math.PI*2); ctx.fill();
    });

    ctx.restore();
}