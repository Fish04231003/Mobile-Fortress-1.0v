// js/physics.js

function resolveCirclePolygonCollision(circle, b) {
    let globalPts = getBuildingVertices(b);
    let collisionNormal = null; let maxPenetration = 0; let hit = false;

    for (let i = 0; i < globalPts.length; i++) {
        let p1 = globalPts[i]; let p2 = globalPts[(i+1) % globalPts.length];
        let lineDx = p2.x - p1.x; let lineDy = p2.y - p1.y;
        let lineLen = Math.hypot(lineDx, lineDy);
        let lineNx = lineDx / lineLen; let lineNy = lineDy / lineLen;

        let nx = -lineNy; let ny = lineNx;
        let cx = circle.x - p1.x; let cy = circle.y - p1.y;
        let dot = cx * lineNx + cy * lineNy;
        
        let closestX, closestY;
        if (dot < 0) { closestX = p1.x; closestY = p1.y; } 
        else if (dot > lineLen) { closestX = p2.x; closestY = p2.y; } 
        else { closestX = p1.x + dot * lineNx; closestY = p1.y + dot * lineNy; }

        let distX = circle.x - closestX; let distY = circle.y - closestY;
        let dist = Math.hypot(distX, distY);

        if (dist < circle.radius) {
            hit = true;
            let pen = circle.radius - dist;
            if (pen > maxPenetration) {
                maxPenetration = pen;
                if (dist > 0) collisionNormal = { x: distX / dist, y: distY / dist };
                else collisionNormal = { x: nx, y: ny };
            }
        }
    }

    if (isPointInPolygon(circle.x, circle.y, globalPts) && !hit) {
        hit = true; maxPenetration = circle.radius; collisionNormal = { x: 0, y: -1 }; 
    }

    if (hit && collisionNormal) {
        circle.x += collisionNormal.x * maxPenetration;
        circle.y += collisionNormal.y * maxPenetration;
        return collisionNormal;
    }
    return null;
}

function applyPhysics(dt, baseMoveDist) {
    let baseVel = dt > 0 ? baseMoveDist / dt : 0;

    // ⭐ 第一步：重力、移動與絕對座標轉換
    for (let u of units) {
        if (u.state === 'dying') {
            u.vy += GAME_CONFIG.unitGravity * dt; 
            u.x += u.vx * dt; u.y += u.vy * dt;
            continue;
        }
        u.vy += GAME_CONFIG.unitGravity * dt;
        u.x += u.vx * dt; u.y += u.vy * dt;

        if (u.isOnBase) {
            let hostVel = baseVel;
            if (u.hostBuilding && !u.hostBuilding.welded) hostVel = (u.hostBuilding.vx || 0);
            u.x += hostVel * dt; // 車子推動
        }
    }

    // ⭐ 第二步：單位間的推擠碰撞 (純世界座標計算)
    let absV = units.map(u => {
        let hostVel = 0;
        if (u.isOnBase) hostVel = (u.hostBuilding && !u.hostBuilding.welded) ? (u.hostBuilding.vx || 0) : baseVel;
        return { vx: u.vx + hostVel, vy: u.vy };
    });

    for (let i = 0; i < units.length; i++) {
        let u1 = units[i];
        if (u1.state === 'dying') continue;
        for (let j = i + 1; j < units.length; j++) {
            let u2 = units[j];
            if (u2.state === 'dying') continue;
            let dx = u2.x - u1.x; let dy = u2.y - u1.y;
            let dist = Math.hypot(dx, dy); let minDist = u1.radius + u2.radius;
            if (dist < minDist) {
                if (dist === 0) { dx = Math.random()-0.5; dy = -1; dist = Math.hypot(dx, dy); }
                let overlap = minDist - dist;
                let nx = dx / dist; let ny = dy / dist;
                let m1 = u1.mass || 1; let m2 = u2.mass || 1; let totalMass = m1 + m2;
                
                u1.x -= nx * overlap * (m2 / totalMass) * 0.5; 
                u2.x += nx * overlap * (m1 / totalMass) * 0.5;
                
                let rvx = absV[j].vx - absV[i].vx; let rvy = absV[j].vy - absV[i].vy;
                let velAlongNormal = rvx * nx + rvy * ny;
                if (velAlongNormal < 0) {
                    let jImpulse = -(1 + 0.5) * velAlongNormal / (1/m1 + 1/m2);
                    absV[i].vx -= (nx * jImpulse) / m1; absV[i].vy -= (ny * jImpulse) / m1;
                    absV[j].vx += (nx * jImpulse) / m2; absV[j].vy += (ny * jImpulse) / m2;
                }
            }
        }
    }

    // ⭐ 第三步：建築與牆壁阻擋 (被推進牆會被擠出來！)
    for (let i = 0; i < units.length; i++) {
        let u = units[i];
        if (u.state === 'dying') continue;

        let hostVel = 0;
        if (u.isOnBase) hostVel = (u.hostBuilding && !u.hostBuilding.welded) ? (u.hostBuilding.vx || 0) : baseVel;
        u.vx = absV[i].vx - hostVel; u.vy = absV[i].vy;

        let landed = false; let targetHost = null; let targetVx = 0;

        // 轉換為世界速度做碰撞
        let worldVx = u.vx + hostVel;
        u.vx = worldVx; 

        // 檢查車台
        if (u.vy >= 0 && u.y + u.radius >= base.y && u.y - u.radius <= base.y + base.height) {
            if (u.x >= base.x && u.x <= base.x + base.width) {
                u.y = base.y - u.radius; landed = true; targetHost = null; targetVx = baseVel; u.vy = 0;
            }
        }

        // 檢查建築多邊形 (阻擋穿透)
        for (let b of buildings) {
            if (b.state === 'dying' || !b.welded) continue;
            let hitNormal = resolveCirclePolygonCollision(u, b);
            if (hitNormal) {
                let bVel = b.welded ? baseVel : (b.vx || 0);
                if (hitNormal.y < -0.5) { landed = true; targetHost = b; targetVx = bVel; u.vy = 0; }
                else if (Math.abs(hitNormal.x) > 0.5) { 
                    let relVx = u.vx - bVel;
                    u.vx = bVel + relVx * -0.5;
                }
            }
        }

        if (u.y + u.radius >= floorY) killUnit(u);

        // ⭐ 恢復相對速度與摩擦力
        if (landed) {
            if (!u.isOnBase) { u.isOnBase = true; u.squishY = 0.6; }
            u.hostBuilding = targetHost;
            u.vx = u.vx - targetVx; // 改回車內相對速度
            
            let friction = 1500; 
            if (Math.abs(u.vx) < friction * dt) u.vx = 0;
            else u.vx -= Math.sign(u.vx) * friction * dt;
        } else {
            u.isOnBase = false; u.hostBuilding = null;
        }
        
        u.rollAngle += (u.vx * dt) / u.radius;
    }
}