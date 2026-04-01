// js/world.js

const clouds = Array.from({length: 6}, () => ({
    x: randomRange(0, 2000), 
    y: randomRange(20, 180), 
    speed: randomRange(5, 15), 
    size: randomRange(80, 150)
}));

const stars = Array.from({length: 80}, () => ({
    x: randomRange(0, 2000), 
    y: randomRange(0, floorY - 150), 
    size: randomRange(1, 3), 
    alpha: randomRange(0.2, 1)
}));

function updateWorld(dt, baseMoveDist) {
    if (base.flashTimer > 0) base.flashTimer -= dt;

    // 晝夜切換目標：0.0 = 夜晚（大廳/開場/戰鬥）, 1.0 = 白天（休息站/地圖）
    let isCombatPhase = (gameState.phase === 'combat' || gameState.phase === 'tutorial_combat' ||
        gameState.phase === 'clearing' || gameState.phase === 'tutorial_clearing' ||
        gameState.phase === 'menu' || gameState.phase === 'intro' ||
        gameState.phase === 'game_over' || gameState.phase === 'transition_in');
    let targetTransition = isCombatPhase ? 0.0 : 1.0;

    if (gameState.bgTransition < targetTransition) {
        gameState.bgTransition = Math.min(1.0, gameState.bgTransition + dt * 0.4); 
    } else if (gameState.bgTransition > targetTransition) {
        gameState.bgTransition = Math.max(0.0, gameState.bgTransition - dt * 0.4);
    }

    cameraX += baseMoveDist;
    base.x = cameraX + baseScreenX;
    
    // ⭐ 輪子轉動速度：降低乘數以匹配較快的移動速度，0.06 接近真實滾動 (v = r * ω)
    let wheelMult = (gameState.phase === 'combat' || gameState.phase === 'tutorial_combat' || gameState.phase === 'clearing' || gameState.phase === 'tutorial_clearing') ? 0.08 : 0.04;
    base.wheelAngle += baseMoveDist * wheelMult; 

    // 雲朵緩慢移動
    clouds.forEach(c => { 
        c.x += c.speed * dt; 
        if (c.x > canvas.width + 200) c.x = -200; 
    });
}

function drawWorld() {
    // 1. 繪製夜晚背景 (最底層)
    if (ASSETS.imgBgNight.complete && ASSETS.imgBgNight.naturalWidth > 0) {
        ctx.drawImage(ASSETS.imgBgNight, 0, 0, canvas.width, canvas.height);
    } else {
        ctx.fillStyle = '#2c3e50';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // 2. 繪製白天背景 (透過 Alpha 達成交叉淡化)
    if (gameState.bgTransition > 0) {
        ctx.save();
        ctx.globalAlpha = gameState.bgTransition;
        if (ASSETS.imgBgDay.complete && ASSETS.imgBgDay.naturalWidth > 0) {
            ctx.drawImage(ASSETS.imgBgDay, 0, 0, canvas.width, canvas.height);
        } else {
            ctx.fillStyle = '#87CEEB';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
        ctx.restore();
    }

    // 繪製雲朵
    ctx.globalAlpha = 0.8 - (gameState.bgTransition * 0.4);
    ctx.filter = `brightness(${0.5 + 0.5 * gameState.bgTransition})`;
    clouds.forEach(c => {
        if (ASSETS.imgCloud.complete && ASSETS.imgCloud.naturalWidth > 0) {
            ctx.drawImage(ASSETS.imgCloud, c.x, c.y, c.size, c.size * 0.6);
        } else {
            ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(c.x, c.y, c.size/3, 0, Math.PI*2); ctx.fill();
        }
    });
    ctx.filter = 'none';
    ctx.globalAlpha = 1.0;

    ctx.save();
    ctx.translate(-cameraX, 0);

    if (gameState.bgTransition < 1.0) {
        ctx.fillStyle = `rgba(241, 196, 15, ${1.0 - gameState.bgTransition})`; 
        stars.forEach(s => {
            let starX = s.x + (cameraX * 0.1);
            ctx.fillRect(starX % (canvas.width * 2) + cameraX - canvas.width, s.y, s.size, s.size);
        });
    }

    let brightness = 0.3 + 0.7 * gameState.bgTransition;
    ctx.filter = `brightness(${brightness})`;

    // ⭐ 無限數學隨機生成背景大樓 (徹底修復走到一半消失的問題)
    let bgBaseX = cameraX * 0.2; 
    let startX = cameraX - bgBaseX; 
    let firstBg = Math.floor(startX / 350) * 350; 

    for (let x = firstBg - 350; x < startX + canvas.width + 700; x += 350) {
        // 利用座標作為隨機種子，確保每次滾動回來的建築是一模一樣的
        let seed = Math.abs(x);
        let rand = (Math.sin(seed) * 10000) - Math.floor(Math.sin(seed) * 10000);
        let bType = Math.floor(rand * 3);
        let offsetX = (rand * 100) - 50; 
        
        let img = null;
        if (bType === 0) img = ASSETS.imgBuilding;
        else if (bType === 1) img = ASSETS.imgBuilding2;
        else img = ASSETS.imgBuilding3;

        let finalX = x + offsetX + bgBaseX;

        if (img && img.complete && img.naturalWidth > 0) {
            ctx.drawImage(img, finalX, floorY - 320, 240, 360);
        } else {
            ctx.fillStyle = lerpColor('#4c5c68', '#bdc3c7', gameState.bgTransition);
            ctx.fillRect(finalX, floorY - 320, 240, 360);
        }
    }
    ctx.filter = 'none';

    // 休息站地標 [Req 3]
    if (gameState.phase === 'transition_to_rest' || gameState.phase === 'tutorial_transition_to_rest' || 
        gameState.phase === 'rest_shop' || gameState.phase === 'rest_house' || gameState.phase === 'rest_upgrade') {
        
        let offsetX = canvas.width * 0.6;
        let rzX = cameraX + offsetX;

        if (gameState.phase === 'transition_to_rest') {
            let p = (gameState.transitionRestTimer / 2.5); // 1.0 -> 0.0
            offsetX -= p * canvas.width;
            rzX = cameraX + offsetX;
        } else if (gameState.phase === 'tutorial_transition_to_rest') {
            // ⭐ 新手教學：建築物位置在右側外鏡頭固定點 [Req 3]
            rzX = gameState.tutorialBuildingPos; 
        }
        
        // --- 繪製建築物本體 (Premium 設計) ---
        // 陰影
        ctx.fillStyle = 'rgba(0,0,0,0.3)';
        ctx.fillRect(rzX - 240, floorY - 10, 480, 20);

        // 主體色調：深灰色基底 + 金色邊框 (Shop) 或 綠色 (House)
        let destType = gameState.currentPoint ? gameState.currentPoint.destinationType : 'shop';
        let primaryColor = '#2c3e50';
        let accentColor = '#f1c40f';
        if (destType === 'house') accentColor = '#27ae60';
        if (destType === 'upgrade') accentColor = '#9b59b6';
        if (destType === 'premium_shop') accentColor = '#e67e22';

        // 繪製建築背景
        let grad = ctx.createLinearGradient(rzX - 250, floorY - 300, rzX + 250, floorY);
        grad.addColorStop(0, '#34495e');
        grad.addColorStop(1, '#2c3e50');
        ctx.fillStyle = grad;
        ctx.fillRect(rzX - 250, floorY - 320, 500, 320);
        
        // 玻璃幕牆效果 (Glassmorphism)
        ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
        ctx.fillRect(rzX - 230, floorY - 280, 460, 100);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.lineWidth = 1;
        ctx.strokeRect(rzX - 230, floorY - 280, 460, 100);

        // 繪製門與裝飾
        ctx.fillStyle = primaryColor;
        ctx.fillRect(rzX - 60, floorY - 120, 120, 120);
        ctx.strokeStyle = accentColor;
        ctx.lineWidth = 4;
        ctx.strokeRect(rzX - 60, floorY - 120, 120, 120);
        
        // 招牌
        ctx.fillStyle = accentColor;
        ctx.fillRect(rzX - 200, floorY - 350, 400, 60);
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 3;
        ctx.strokeRect(rzX - 200, floorY - 350, 400, 60);

        ctx.fillStyle = '#fff';
        ctx.font = 'bold 32px "Courier New"'; ctx.textAlign = 'center';
        let label = '';
        if (destType === 'premium_shop') label = '★ PREMIUM SHOP ★';
        else if (destType === 'shop') label = 'TRADING POST';
        else if (destType === 'house') label = 'REST HOUSE';
        else if (destType === 'upgrade') label = 'TECH CENTER';
        else label = 'REST STOP';

        if (gameState.phase !== 'transition_to_rest') {
            label = gameState.restType === 'shop' ? (gameState.isPremiumShop ? '★ PREMIUM SHOP ★' : 'TRADING POST') :
                    gameState.restType === 'house' ? 'REST HOUSE' : 'TECH CENTER';
        }
        ctx.fillText(label, rzX, floorY - 308);

        // 窗戶細節
        ctx.fillStyle = 'rgba(241, 196, 15, 0.3)';
        for(let i=0; i<4; i++) {
            ctx.fillRect(rzX - 200 + i*110, floorY - 180, 50, 40);
        }
    }

    ctx.fillStyle = lerpColor('#1e8449', '#27ae60', gameState.bgTransition);
    ctx.fillRect(cameraX, floorY, canvas.width, canvas.height - floorY);
    
    ctx.fillStyle = lerpColor('#229954', '#2ecc71', gameState.bgTransition);
    let firstFloor = Math.floor(cameraX / 50) * 50;
    for(let x = firstFloor; x < cameraX + canvas.width + 100; x += 50) {
        ctx.fillRect(x, floorY, 48, 10);
    }

    if (gameState.phase !== 'menu' && gameState.phase !== 'map') {
        ctx.fillStyle = base.flashTimer > 0 ? '#ffffff' : '#c0392b';
        ctx.fillRect(base.x, base.y, base.width, base.height);
        if (base.flashTimer <= 0) {
            ctx.fillStyle = '#a93226';
            ctx.fillRect(base.x, base.y + 5, base.width, 3);
            ctx.fillRect(base.x, base.y + 12, base.width, 3);
        }
        drawWheel(base.x + 40, base.y + base.height, 20, base.wheelAngle);
        drawWheel(base.x + base.width - 40, base.y + base.height, 20, base.wheelAngle);
    }
    
    ctx.restore();
}