// js/mapManager.js
// ⭐ 地圖系統 — 顯示城市圖片地圖，WASD 控制平台圖標移動，點擊關卡點進入戰鬥

const MAP_PLAYER_SPEED = 180; // 地圖圖標移動速度（像素/秒）
const MAP_PLAYER_RADIUS = 18; // 碰撞半徑
const MAP_POINT_RADIUS = 22;  // 關卡點半徑

// ⭐ WASD 鍵盤事件監聽
document.addEventListener('keydown', (e) => {
    if (gameState.phase !== 'map') return;
    let k = e.key.toLowerCase();
    if (k === 'w' || k === 'arrowup')    gameState.mapKeys.w = true;
    if (k === 'a' || k === 'arrowleft')  gameState.mapKeys.a = true;
    if (k === 's' || k === 'arrowdown')  gameState.mapKeys.s = true;
    if (k === 'd' || k === 'arrowright') gameState.mapKeys.d = true;
});
document.addEventListener('keyup', (e) => {
    let k = e.key.toLowerCase();
    if (k === 'w' || k === 'arrowup')    gameState.mapKeys.w = false;
    if (k === 'a' || k === 'arrowleft')  gameState.mapKeys.a = false;
    if (k === 's' || k === 'arrowdown')  gameState.mapKeys.s = false;
    if (k === 'd' || k === 'arrowright') gameState.mapKeys.d = false;

    // Spacebar to enter level [Req 9]
    if (k === ' ' && gameState.phase === 'map') {
        let map = gameState.map;
        if (map.selectedPoint && map.nearestDist < MAP_POINT_RADIUS + 35) {
            map.panelOpen = false;
            enterCombatFromMap(map.selectedPoint);
        }
    }
});

// ⭐ 地圖更新（主循環呼叫）
function updateMap(dt) {
    let map = gameState.map;
    let pos = map.playerPos;
    let keys = gameState.mapKeys;

    let dx = 0, dy = 0;
    if (keys.a) dx -= 1;
    if (keys.d) dx += 1;
    if (keys.w) dy -= 1;
    if (keys.s) dy += 1;

    // 正規化斜向速度
    let len = Math.sqrt(dx * dx + dy * dy);
    if (len > 0) { dx /= len; dy /= len; }

    let newX = pos.x + dx * MAP_PLAYER_SPEED * dt;
    let newY = pos.y + dy * MAP_PLAYER_SPEED * dt;

    // 邊界限制（地圖畫布尺寸）
    let mapW = canvas.width, mapH = canvas.height;
    newX = Math.max(MAP_PLAYER_RADIUS, Math.min(mapW - MAP_PLAYER_RADIUS, newX));
    newY = Math.max(MAP_PLAYER_RADIUS, Math.min(mapH - MAP_PLAYER_RADIUS, newY));

    // 建築物碰撞
    let obstacles = map.obstacles || [];
    for (let obs of obstacles) {
        let cx = obs.x + obs.w / 2;
        let cy = obs.y + obs.h / 2;
        let hw = obs.w / 2 + MAP_PLAYER_RADIUS;
        let hh = obs.h / 2 + MAP_PLAYER_RADIUS;

        if (newX > obs.x - MAP_PLAYER_RADIUS && newX < obs.x + obs.w + MAP_PLAYER_RADIUS &&
            newY > obs.y - MAP_PLAYER_RADIUS && newY < obs.y + obs.h + MAP_PLAYER_RADIUS) {
            let overlapX = hw - Math.abs(newX - cx);
            let overlapY = hh - Math.abs(newY - cy);
            if (overlapX < overlapY) {
                newX = newX < cx ? obs.x - MAP_PLAYER_RADIUS : obs.x + obs.w + MAP_PLAYER_RADIUS;
            } else {
                newY = newY < cy ? obs.y - MAP_PLAYER_RADIUS : obs.y + obs.h + MAP_PLAYER_RADIUS;
            }
        }
    }

    pos.x = newX;
    pos.y = newY;

    // 更新滾輪旋轉
    base.wheelAngle += (Math.abs(dx) + Math.abs(dy)) * MAP_PLAYER_SPEED * dt * 0.05;

    // 最近的點
    let nearest = null, nearestDist = Infinity;
    for (let pt of map.points) {
        if (pt.cleared) continue;
        let dist = Math.hypot(pos.x - pt.x, pos.y - pt.y);
        if (dist < nearestDist) { nearestDist = dist; nearest = pt; }
    }
    map.nearestPoint = nearest;
    map.nearestDist = nearestDist;

    if (nearest && nearestDist < MAP_POINT_RADIUS + 30) {
        if (map.selectedPoint !== nearest) {
            map.selectedPoint = nearest;
            map.panelOpen = true;
        }
    } else if (nearestDist > MAP_POINT_RADIUS + 60) {
        if (map.panelOpen && map.selectedPoint === nearest) {
            map.panelOpen = false;
            map.selectedPoint = null;
        }
    }
}

// ⭐ 地圖繪製
function drawMap() {
    let map = gameState.map;
    let pos = map.playerPos;

    if (ASSETS.imgMap && ASSETS.imgMap.complete && ASSETS.imgMap.naturalWidth > 0) {
        ctx.drawImage(ASSETS.imgMap, 0, 0, canvas.width, canvas.height);
    } else {
        ctx.fillStyle = '#1a2a1a';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = '#2c3e50';
        ctx.fillRect(0, canvas.height / 2 - 20, canvas.width, 40);
        ctx.fillRect(canvas.width / 2 - 20, 0, 40, canvas.height);

        ctx.strokeStyle = '#f1c40f'; ctx.lineWidth = 2; ctx.setLineDash([15, 15]);
        ctx.beginPath();
        ctx.moveTo(0, canvas.height / 2); ctx.lineTo(canvas.width, canvas.height / 2);
        ctx.moveTo(canvas.width / 2, 0); ctx.lineTo(canvas.width / 2, canvas.height);
        ctx.stroke(); ctx.setLineDash([]);

        let obstacles = map.obstacles || [];
        obstacles.forEach(obs => {
            ctx.fillStyle = '#34495e';
            ctx.fillRect(obs.x, obs.y, obs.w, obs.h);
            ctx.strokeStyle = '#2c3e50'; ctx.lineWidth = 2;
            ctx.strokeRect(obs.x, obs.y, obs.w, obs.h);
            ctx.fillStyle = '#f1c40f';
            for (let wy = obs.y + 10; wy < obs.y + obs.h - 10; wy += 20) {
                for (let wx = obs.x + 8; wx < obs.x + obs.w - 8; wx += 18) {
                    ctx.fillRect(wx, wy, 8, 8);
                }
            }
        });

        ctx.fillStyle = '#27ae60';
        ctx.fillRect(680, 200, 80, 80);
        ctx.fillRect(20, 300, 60, 60);
    }

    // ⭐ 繪製關卡點
    let now = gameTime;
    map.points.forEach(pt => {
        if (pt.cleared) {
            ctx.fillStyle = 'rgba(50,50,50,0.7)';
            ctx.beginPath(); ctx.arc(pt.x, pt.y, MAP_POINT_RADIUS, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = '#2ecc71'; ctx.font = 'bold 14px "Courier New"'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
            ctx.fillText('✓', pt.x, pt.y);
            return;
        }

        let diffColor = pt.difficulty === 'easy' ? '#2ecc71' : pt.difficulty === 'hard' ? '#e74c3c' : '#f39c12';
        let destIcon = pt.destinationType === 'shop' ? '🛒' :
                       pt.destinationType === 'premium_shop' ? '⭐' :
                       pt.destinationType === 'house' ? '🏠' :
                       pt.destinationType === 'upgrade' ? '🔧' : '⚔️';

        let pulse = 1 + 0.1 * Math.sin(now * 3 + pt.x * 0.01);
        let isSelected = (map.selectedPoint === pt);
        let r = MAP_POINT_RADIUS * (isSelected ? 1.2 : 1.0) * pulse;

        ctx.save();
        ctx.globalAlpha = 0.3 + 0.1 * Math.sin(now * 3);
        ctx.fillStyle = diffColor;
        ctx.beginPath(); ctx.arc(pt.x, pt.y, r + 8, 0, Math.PI * 2); ctx.fill();
        ctx.restore();

        ctx.fillStyle = isSelected ? diffColor : 'rgba(20,20,20,0.85)';
        ctx.beginPath(); ctx.arc(pt.x, pt.y, r, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = diffColor; ctx.lineWidth = isSelected ? 3 : 2;
        ctx.stroke();

        ctx.font = `${r * 0.85}px serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText(destIcon, pt.x, pt.y);

        ctx.fillStyle = '#fff'; ctx.font = 'bold 10px "Courier New"'; ctx.textBaseline = 'alphabetic';
        ctx.fillText(pt.difficulty.toUpperCase(), pt.x, pt.y + r + 14);
    });

    // ⭐ 左側資訊面板
    // ⭐ 左側資訊面板
    if (map.panelOpen && map.selectedPoint) {
        let pt = map.selectedPoint;
        let pw = 220;
        let px = 15;
        
        let cfg = pt.levelConfig;
        let enemyTypes = Object.entries(cfg.enemies).filter(([k,v]) => v > 0);
        
        let iconSize = 28;
        let gap = 12;
        let maxCols = 4;
        let rows = Math.ceil(enemyTypes.length / maxCols);
        
        // ⭐ 動態計算面板高度
        let ph = 210 + (rows - 1) * 50; 
        let py = canvas.height / 2 - ph / 2;

        ctx.fillStyle = 'rgba(10,15,25,0.93)';
        ctx.beginPath();
        if (ctx.roundRect) ctx.roundRect(px, py, pw, ph, 10);
        else ctx.rect(px, py, pw, ph);
        ctx.fill();

        let diffColor = pt.difficulty === 'easy' ? '#2ecc71' : pt.difficulty === 'hard' ? '#e74c3c' : '#f39c12';
        ctx.strokeStyle = diffColor; ctx.lineWidth = 2; ctx.stroke();

        let lx = px + pw / 2;
        ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';

        ctx.fillStyle = diffColor; ctx.font = 'bold 16px "Courier New"';
        ctx.fillText(pt.difficulty.toUpperCase() + ' ZONE', lx, py + 28);

        ctx.fillStyle = '#bdc3c7'; ctx.font = '13px "Courier New"';
        let destLabel = pt.destinationType === 'shop' ? '★ SHOP' :
                        pt.destinationType === 'premium_shop' ? '★★ PREMIUM SHOP' :
                        pt.destinationType === 'house' ? '🏠 REST HOUSE' :
                        pt.destinationType === 'upgrade' ? '🔧 REPAIR STATION' : '⚔️ COMBAT';
        ctx.fillText('休息站: ' + destLabel, lx, py + 52);

        ctx.fillStyle = '#ecf0f1'; ctx.font = 'bold 12px "Courier New"';
        ctx.fillText('敵人分布:', lx, py + 80);

        let startIY = py + 110;
        enemyTypes.forEach(([type, count], idx) => {
            let row = Math.floor(idx / maxCols);
            let col = idx % maxCols;
            let rowCount = Math.min(maxCols, enemyTypes.length - row * maxCols);
            let rowW = rowCount * (iconSize + gap);
            let rowStartX = lx - rowW / 2 + iconSize / 2;
            let ix = rowStartX + col * (iconSize + gap);
            let iy = startIY + row * 50;
            
            ctx.save(); ctx.translate(ix, iy);
            ctx.scale(0.85, 0.85);
            let drawType = type.replace('Zombie', ''); 
            if (drawType === 'zombie') drawType = 'normal';
            let color = GAME_CONFIG[type + 'Color'] || GAME_CONFIG.zombieColor || '#2ecc71';
            drawEncyclopediaIcon({ type: 'enemy', drawType: drawType, color: color }, ctx, true);
            ctx.restore();
            ctx.fillStyle = '#fff'; ctx.font = 'bold 12px Arial';
            ctx.fillText('x' + count, ix, iy + 30);
        });

        // ⭐ 根據行數動態下移牢籠資訊與按鈕
        let cageY = py + 165 + (rows - 1) * 50;
        ctx.fillStyle = cfg.cageEnabled ? '#2ecc71' : '#7f8c8d';
        ctx.font = 'bold 12px "Courier New"';
        ctx.fillText(cfg.cageEnabled ? '🔑 牢籠可出現' : '無牢籠', lx, cageY);

        let btnY = py + ph - 40;
        let canEnter = map.nearestDist < MAP_POINT_RADIUS + 35;
        ctx.fillStyle = canEnter ? '#e74c3c' : '#7f8c8d';
        ctx.fillRect(px + 15, btnY, pw - 30, 26);
        ctx.strokeStyle = '#fff'; ctx.lineWidth = 1; ctx.strokeRect(px + 15, btnY, pw - 30, 26);
        ctx.fillStyle = '#fff'; ctx.font = 'bold 12px "Courier New"'; ctx.textBaseline = 'middle';
        ctx.fillText(canEnter ? '按下 [空白鍵] 進入' : '請靠近該點', lx, btnY + 13);
    }

    // ⭐ 繪製作玩家圖標
    ctx.save();
    ctx.translate(pos.x, pos.y);
    ctx.fillStyle = '#c0392b'; ctx.fillRect(-22, -10, 44, 18);
    ctx.fillStyle = '#a93226'; ctx.fillRect(-22, -5, 44, 3); ctx.fillRect(-22, 2, 44, 3);
    let wa = base.wheelAngle;
    [[-14, 8], [14, 8]].forEach(([wx, wy]) => {
        ctx.save(); ctx.translate(wx, wy);
        ctx.fillStyle = '#2c3e50'; ctx.beginPath(); ctx.arc(0, 0, 6, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = '#ecf0f1'; ctx.lineWidth = 1.5; ctx.beginPath();
        ctx.moveTo(Math.cos(wa) * 5, Math.sin(wa) * 5); ctx.lineTo(Math.cos(wa + Math.PI) * 5, Math.sin(wa + Math.PI) * 5);
        ctx.stroke(); ctx.restore();
    });
    ctx.restore();

    // ⭐ 操作提示
    ctx.fillStyle = 'rgba(0,0,0,0.65)';
    ctx.fillRect(canvas.width/2 - 120, canvas.height - 35, 240, 28);
    ctx.fillStyle = '#bdc3c7'; ctx.font = '12px "Courier New"'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('WASD 移動 │ 靠近點按下 [Space] 進入', canvas.width/2, canvas.height - 21);
}

// ⭐ 地圖點擊處理
function handleMapClick(sx, sy) {
    let map = gameState.map;
    if (map.panelOpen && map.selectedPoint) {
        let pt = map.selectedPoint;
        let pw = 220, ph = 240;
        let px = 15, py = canvas.height / 2 - ph / 2;
        let btnY = py + ph - 40;
        let pDist = Math.hypot(map.playerPos.x - pt.x, map.playerPos.y - pt.y);
        if (sx >= px + 15 && sx <= px + pw - 15 && sy >= btnY && sy <= btnY + 32 && pDist < MAP_POINT_RADIUS + 35) {
            map.panelOpen = false;
            enterCombatFromMap(pt);
            return;
        }
        if (sx < px || sx > px + pw || sy < py || sy > py + ph) {
            map.panelOpen = false;
            map.selectedPoint = null;
        }
        return;
    }
    for (let pt of map.points) {
        if (pt.cleared) continue;
        if (Math.hypot(sx - pt.x, sy - pt.y) <= MAP_POINT_RADIUS + 10) {
            map.selectedPoint = pt; map.panelOpen = true; return;
        }
    }
    map.panelOpen = false; map.selectedPoint = null;
}
