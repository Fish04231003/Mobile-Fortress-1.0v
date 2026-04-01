// js/building.js

function addBuilding(item, x, y, angle) {
    let type = (typeof item === 'object') ? item.type : item;
    let material = item.material || 'wood';
    let hp = item.hp || GAME_CONFIG.buildingHp;
    let bColor = item.color || '#8B4513';
    let sColor = item.strokeColor || '#5c2a08';

    let w = 40, h = 40;
    if (type === 2) { w = 80; h = 20; }
    
    let b = { 
        type: type, material: material, x: x, y: y, w: w, h: h, angle: angle, 
        hp: hp, maxHp: hp, color: bColor, strokeColor: sColor,
        state: 'active', welded: false, vx: 0, vy: 0, flashTimer: 0 
    };
    buildings.push(b);
    checkBuildingConnections(); 
}

function killBuilding(b) {
    if (b.state === 'dying') return;
    b.state = 'dying'; b.vy = -150; b.vx = randomRange(-50, 50); b.welded = false;
    checkBuildingConnections(); 
}

function checkBuildingConnections() {
    buildings.forEach(b => { if (b.state !== 'dying') b.welded = false; });
    let queue = [];
    let basePoly = [
        {x: base.x, y: base.y}, {x: base.x + base.width, y: base.y},
        {x: base.x + base.width, y: base.y + base.height}, {x: base.x, y: base.y + base.height}
    ];

    // ⭐ 使用超精準的 SAT 多邊形碰觸偵測，誤差值 2px
    buildings.forEach(b => {
        if (b.state === 'dying') return;
        let bPoly = getBuildingVertices(b);
        if (polygonsTouch(bPoly, basePoly, 2)) {
            b.welded = true; queue.push(b);
        }
    });
    
    while (queue.length > 0) {
        let curr = queue.shift();
        let currPoly = getBuildingVertices(curr);
        buildings.forEach(b => {
            if (b.state === 'dying' || b.welded) return;
            let bPoly = getBuildingVertices(b);
            if (polygonsTouch(bPoly, currPoly, 2)) {
                b.welded = true; queue.push(b);
            }
        });
    }
}

function updateBuildings(dt, baseMoveDist) {
    let baseVel = dt > 0 ? baseMoveDist / dt : 0;
    
    for (let i = buildings.length - 1; i >= 0; i--) {
        let b = buildings[i];
        if (b.flashTimer > 0) b.flashTimer -= dt;

        if (b.state === 'dying') {
            b.vy += GAME_CONFIG.unitGravity * dt; b.x += b.vx * dt; b.y += b.vy * dt;
            if (b.y > floorY + 50) buildings.splice(i, 1); 
            continue;
        }

        if (b.welded) {
            b.x += baseMoveDist; b.vy = 0; b.vx = baseVel;
        } else {
            b.vy += GAME_CONFIG.unitGravity * dt; b.x += b.vx * dt; b.y += b.vy * dt;
            
            // ⭐ 取得建築最底部的 Y 座標，精準判定是否碰到地板
            let bPoly = getBuildingVertices(b);
            let lowestY = Math.max(...bPoly.map(p => p.y));
            if (lowestY >= floorY) {
                b.hp = 0; killBuilding(b);
            }
            else if (b.vy > 0 && lowestY >= base.y && lowestY <= base.y + base.height && b.x > base.x && b.x < base.x + base.width) {
                b.vy = 0; b.vx = baseVel;
            }
        }
    }
}

function drawBuildings() {
    ctx.save(); ctx.translate(-cameraX, 0);
    buildings.forEach(b => {
        ctx.save(); ctx.translate(b.x, b.y); ctx.rotate(b.angle * Math.PI / 180);
        ctx.fillStyle = b.flashTimer > 0 ? '#ffffff' : (b.color || '#8B4513'); 
        if (b.state === 'dying') ctx.globalAlpha = 0.5; 
        ctx.strokeStyle = b.strokeColor || '#5c2a08'; ctx.lineWidth = 2;

        let ow = b.type === 2 ? 80 : 40; let oh = b.type === 2 ? 20 : 40;
        ctx.beginPath();
        if (b.type === 1 || b.type === 2) { ctx.rect(-ow/2, -oh/2, ow, oh); } 
        else if (b.type === 3) { ctx.moveTo(0, -oh/2); ctx.lineTo(ow/2, oh/2); ctx.lineTo(-ow/2, oh/2); ctx.closePath(); } 
        else if (b.type === 4) { ctx.moveTo(-ow/2, -oh/2); ctx.lineTo(ow/2, oh/2); ctx.lineTo(-ow/2, oh/2); ctx.closePath(); }
        ctx.fill(); ctx.stroke();

        if (b.state !== 'dying') {
            if (b.hp <= b.maxHp * 0.5) {
                // 第一條裂痕
                ctx.strokeStyle = 'rgba(0,0,0,0.6)'; ctx.lineWidth = 1.5; ctx.beginPath(); 
                ctx.moveTo(-10, -10); ctx.lineTo(0, 5); ctx.lineTo(8, -2); ctx.lineTo(15, 10); ctx.stroke();
            }
            if (b.hp <= b.maxHp * 0.25) {
                // 第二條裂痕 (血量更低時出現)
                ctx.strokeStyle = 'rgba(0,0,0,0.7)'; ctx.lineWidth = 1.8; ctx.beginPath(); 
                ctx.moveTo(-15, 5); ctx.lineTo(-2, -5); ctx.lineTo(5, 8); ctx.lineTo(12, -12); ctx.stroke();
            }
        }
        ctx.restore();
    });
    ctx.restore();
}