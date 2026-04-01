// js/settings.js

const GAME_CONFIG = {
    // --- 【時間與日夜設定】 ---
    combatDuration: 60,
    safeZoneWaitTime: 30,
    travelSpeedMult: 4.5,

    // --- 【怪物(殭屍)設定】 ---
    spawnCountMult: 1.5, // 殭屍數量倍率 (1.5倍)
    zombieSpawnMin: 2.0,
    zombieSpawnMax: 3.0,
    zombieHp: 20,
    zombieSpeedMin: 120,
    zombieSpeedMax: 180,
    zombieDamage: 5,
    coinReward: 5,
    zombieColor: '#1e662a',

    zombieJumpMin: 200,
    zombieJumpMax: 450,

    // --- 【浪潮(Wave)設定】 ---
    waveZombies: 10,
    waveFastZombies: 5,
    waveDuration: 4.0,

    // --- 【快速殭屍設定】 ---
    fastZombieHp: 10,
    fastZombieSpeedMin: 225,
    fastZombieSpeedMax: 300,
    fastZombieDamage: 5,
    fastZombieJumpMin: 150,
    fastZombieJumpMax: 250,
    fastCoinReward: 8,
    fastZombieColor: '#2ecc71',

    // --- 【盾牌殭屍設定】 ---
    shieldZombieHp: 10,
    shieldHp: 20,
    shieldZombieSpeedMin: 120,
    shieldZombieSpeedMax: 150,
    shieldZombieDamage: 5,
    shieldZombieJumpMin: 150,
    shieldZombieJumpMax: 250,
    shieldCoinReward: 12,
    shieldZombieColor: '#144d1f',

    // --- 【毒液殭屍設定】 ---
    venomZombieHp: 10,
    venomZombieSpeedMin: 105,
    venomZombieSpeedMax: 165,
    venomZombieDamage: 2,
    venomZombieCooldown: 2.5,
    venomZombieRange: 600, // 射程從 400 增加一半到 600
    venomZombieJumpMin: 200,
    venomZombieJumpMax: 400,
    venomCoinReward: 10,
    venomZombieColor: '#9b59b6', // 紫色
    venomProjectileColor: '#2ecc71', // 毒液綠色
    venomShootForce: 550, // 噴射力增加，讓毒液飛得更高

    // --- 【分裂殭屍設定】 ---
    splitZombieHp: 10,
    splitZombieDamage: 5,
    splitZombieSpeedMin: 120,
    splitZombieSpeedMax: 180,
    splitZombieJumpMin: 200,
    splitZombieJumpMax: 450,
    splitZombieColor: '#27ae60', // 裂痕綠色
    splitZombieReward: 0,
    splitZombieCount: 3, // 分裂數量設定

    miniZombieScale: 0.7,
    miniZombieHp: 5,
    miniZombieDamage: 3,
    miniZombieSpeedMin: 150, // 快一點點
    miniZombieSpeedMax: 210,
    miniZombieJumpMin: 100, // 較低跳躍
    miniZombieJumpMax: 200,
    miniZombieReward: 4,

    // --- 【炸彈殭屍設定】 ---
    bombZombieHp: 10,
    bombZombieDamage: 10,
    bombZombieExplodeRadius: 90, // 預設兩個單位大 (1個單位約40)
    bombZombieSpeedMin: 120,
    bombZombieSpeedMax: 180,
    bombZombieJumpMin: 200,
    bombZombieJumpMax: 450,
    bombZombieColor: '#1e662a', // 改為深綠色
    bombCoinReward: 8,

    // --- 【小飛機殭屍設定】 ---
    planeZombieHp: 10,
    planeHp: 20,
    planeZombieDamage: 5,
    planeZombieSpeedMin: 120,
    planeZombieSpeedMax: 180,
    planeZombieFloatHeight: 120, // 比氣球(200)低一點
    planeZombieOscillation: 15,
    planeZombieColor: '#1e662a',
    planeColor: '#7f8c8d',
    planeCoinReward: 5,

    // --- 【氣球殭屍設定】 ---
    balloonZombieHp: 10,
    balloonZombieDamage: 5,
    balloonZombieSpeedMin: 100,
    balloonZombieSpeedMax: 135,
    balloonZombieFloatHeight: 200,
    balloonZombieOscillation: 20,
    balloonZombieColor: '#27ae60', // 稍微不同的綠色
    balloonColor: '#e74c3c',
    balloonCoinReward: 10,

    // --- 【持刀殭屍設定】 ---
    bladeZombieHp: 10,
    bladeZombieSpeedMin: 120,
    bladeZombieSpeedMax: 180,
    bladeZombieDamage: 10,
    bladeZombieCooldown: 2.5,
    bladeLength: 50,
    bladeWidth: 40,
    bladeJumpMin: 200,
    bladeJumpMax: 450,
    bladeCoinReward: 12,
    bladeZombieColor: '#1e662a',

    // --- 【鐵甲殭屍設定】 ---
    armorZombieHp: 20,
    armorHp: 40,
    armorZombieSpeedMin: 100,
    armorZombieSpeedMax: 150,
    armorZombieDamage: 8,
    armorCoinReward: 20,
    armorZombieColor: '#1e662a', // 深綠色
    armorColor: '#95a5a6', // 鐵灰色盔甲
    armorJumpMin: 150, // 鐵甲小跳躍
    armorJumpMax: 300,

    // --- 【難度設定】 ---
    difficulty: 'normal', // normal, hard, nightmare
    difficultyMultipliers: {
        normal: { hp: 1, dmg: 1, spawn: 1 },
        hard: { hp: 2, dmg: 1.5, spawn: 1.5 },
        nightmare: { hp: 3, dmg: 2, spawn: 2 }
    },

    // --- 【玩家與車輛設定】 ---
    baseSpeed: 80,
    baseMaxHp: 100,
    baseHitBoost: 150,
    unitGravity: 1500,

    // --- 【單位花費設定】 ---
    archerCost: 20,
    archerHp: 15,
    archerDamage: 10,
    archerCooldown: 1,
    archerShootForce: 400,
    archerKnockback: 30, // Reduced from 60
    archerColor: '#2ecc71',
    archerMass: 1.0,

    pistolCost: 45,
    pistolHp: 10,
    pistolDamage: 5,
    pistolCooldown: 1.2,
    pistolShootForce: 800,
    pistolKnockback: 45,
    pistolColor: '#d2a679', // 木頭色
    pistolMass: 1.0,

    cannonCost: 50,
    cannonHp: 20,
    cannonDamage: 10,
    cannonCooldown: 2.0,
    cannonAoeRadius: 40,
    cannonShootForce: 300,
    cannonKnockback: 220,
    cannonColor: '#34495e',
    cannonMass: 3.0,

    swordsmanCost: 30,
    swordsmanHp: 20,
    swordsmanDamage: 10,
    swordsmanCooldown: 1.2,
    swordsmanRange: 55,
    swordsmanKnockback: 500,
    swordsmanColor: '#95a5a6',
    swordsmanMass: 1.5,

    // --- 【建築設定】 ---
    buildingCost: 15,
    buildingHp: 10,
    brickBuildingCost: 60,
    brickBuildingHp: 40,
    steelBuildingCost: 150,
    steelBuildingHp: 100,

    // --- 【商店解鎖設定】 ---
    unitUpgradePrice: 200,
    pistolUnlockPrice: 150,
    cannonUnlockPrice: 150,
    swordsmanUnlockPrice: 120,
    squareUnlockPrice: 100,
    rectUnlockPrice: 100,
    triUnlockPrice: 100,
    rtriUnlockPrice: 100,

    // ⭐ --- 【系統開關】 ---
    sfxVolume: 0.6,
    sfxEnabled: true,
    musicVolume: 0.15,
    showUnitHp: true,
    showEnemyHp: true,
    showDamageText: true, // 顯示傷害飄字
    showUnitDamageText: true, // 顯示我方受傷飄字

    // ⭐ --- 【擊退設定】 ---
    meleeCanKnockbackArmored: false, // 近戰是否能擊退有護甲的敵人
    meleeKnockbackVy: -300,          // 近戰擊退的垂直速度
    rangedKnockbackVy: -150,         // 遠程擊退的垂直速度

    // ⭐ --- 【戰鬥/休息 時間設定】 ---
    // combatDuration 已在上方定義 (60秒)
    restDuration: 30,                // 休息站秒數（白天30秒）

    // ⭐ --- 【牢籠系統設定】 ---
    cageSpawnChance: 0.35,           // 每秒生成一個牢籠的機率 (0~1)，可後台調整
    cageHp: 50,                      // 牢籠固定血量（不受難度影響）
    cageSpeed: -80,                   // 牢籠移動速度（隨平台移動）
    cageContents: {                  // 各單位出現在牢籠的機率與數量範圍
        archer: { weight: 5, min: 1, max: 3 },
        pistol: { weight: 3, min: 1, max: 2 },
        swordsman: { weight: 3, min: 1, max: 2 },
        cannon: { weight: 1, min: 1, max: 1 }
    },
    cageSpawnIntervalMin: 8,         // 牢籠最短生成間隔（秒）
    cageSpawnIntervalMax: 20,        // 牢籠最長生成間隔（秒）

    // ⭐ --- 【商店設定】 ---
    shopRefreshCost: 150,            // 一般商店刷新費用（可後台設定）
    premiumShopRefreshCost: 240,     // 高級商店刷新費用（可後台設定）
    shopItemCountMin: 4,             // 商店最少展示商品數
    shopItemCountMax: 8,             // 商店最多展示商品數
    // 商店各品項售賣數量範圍（購買一次給幾個）
    shopItemStock: {
        archer: { min: 2, max: 8 },
        swordsman: { min: 2, max: 8 },
        pistol: { min: 1, max: 6 },
        cannon: { min: 1, max: 6 },
        square: { min: 6, max: 12 },
        rect: { min: 6, max: 12 },
        tri: { min: 6, max: 12 },
        rtri: { min: 6, max: 12 },
        brick_square: { min: 4, max: 8 },
        brick_rect: { min: 4, max: 8 },
        brick_tri: { min: 4, max: 8 },
        brick_rtri: { min: 4, max: 8 },
        steel_square: { min: 1, max: 6 },
        steel_rect: { min: 1, max: 6 },
        steel_tri: { min: 1, max: 6 },
        steel_rtri: { min: 1, max: 6 }
    },

    // ⭐ --- 【小房子設定】 ---
    houseUnits: [                    // 小房子會跳出的單位設定（weight=權重）
        { type: 'archer', min: 1, max: 3, weight: 5 },
        { type: 'swordsman', min: 1, max: 2, weight: 3 },
        { type: 'pistol', min: 1, max: 2, weight: 3 },
        { type: 'cannon', min: 1, max: 1, weight: 1 }
    ],
    houseUnitCount: 2,               // 小房子每次跳出幾種單位

    // ⭐ --- 【升級站設定】 ---
    repairCostPerHp: 5,              // 修復1點血量的費用（可後台設定）

    // ⭐ --- 【地圖設定】 ---
    mapPointsMin: 2,                 // 每次開啟地圖最少生成幾個關卡點
    mapPointsMax: 5,                 // 每次開啟地圖最多生成幾個關卡點
    mapMinPoints: 3,                 // 地圖上至少保留幾個點（防止只剩困難點）

    // ⭐ --- 【關卡點設定】（可後台設定各關卡的敵人配置）---
    levelPresets: {
        easy: [
            {
                name: '簡單 1',
                enemies: { zombie: [5, 8], fastZombie: [1, 2], shieldZombie: [0, 0] },
                cageEnabled: true, cageChance: 0.4, cagePossible: ['archer', 'swordsman']
            },
            {
                name: '簡單 2',
                enemies: { zombie: [7, 10], fastZombie: [2, 3], shieldZombie: [0, 1] },
                cageEnabled: true, cageChance: 0.4, cagePossible: ['archer', 'swordsman']
            },
            {
                name: '簡單 3',
                enemies: { zombie: [8, 12], fastZombie: [2, 4], shieldZombie: [1, 2] },
                cageEnabled: true, cageChance: 0.4, cagePossible: ['archer', 'swordsman', 'pistol']
            }
        ],
        normal: [
            {
                name: '普通 1',
                enemies: { zombie: [10, 14], fastZombie: [3, 5], shieldZombie: [1, 2] },
                cageEnabled: true, cageChance: 0.35, cagePossible: ['archer', 'swordsman', 'pistol']
            },
            {
                name: '普通 2',
                enemies: { zombie: [12, 16], fastZombie: [4, 6], shieldZombie: [2, 3] },
                cageEnabled: true, cageChance: 0.35, cagePossible: ['archer', 'swordsman', 'pistol']
            },
            {
                name: '普通 3',
                enemies: { zombie: [14, 18], fastZombie: [5, 7], shieldZombie: [2, 4], venomZombie: [0, 2] },
                cageEnabled: true, cageChance: 0.35, cagePossible: ['archer', 'pistol', 'cannon']
            }
        ],
        hard: [
            {
                name: '困難 1',
                enemies: { 
                    zombie: [1, 5], fastZombie: [6, 8], shieldZombie: [40, 50], 
                    balloonZombie: [2, 4], venomZombie: [2, 4],
                    bladeZombie: [0, 0], bombZombie: [0, 0], planeZombie: [0, 0] 
                },
                cageEnabled: true, cageChance: 0.3, cagePossible: ['archer', 'pistol', 'cannon']
            },
            {
                name: '困難 2',
                enemies: { 
                    zombie: [20, 30], shieldZombie: [25, 30], balloonZombie: [16, 30], venomZombie: [30, 50],
                    armorZombie: [0, 0], splitZombie: [0, 0], bladeZombie: [0, 0]
                },
                cageEnabled: true, cageChance: 0.3, cagePossible: ['pistol', 'cannon', 'swordsman']
            },
            {
                name: '困難 3',
                enemies: { 
                    zombie: [30, 50], fastZombie: [20, 30], shieldZombie: [10, 20], 
                    armorZombie: [10, 20], splitZombie: [10, 20],
                    bombZombie: [5, 10], planeZombie: [2, 4], bladeZombie: [5, 5]
                },
                cageEnabled: true, cageChance: 0.3, cagePossible: ['pistol', 'cannon']
            }
        ]
    },

    // ⭐ --- 【平台重置設定（死亡後）】 ---
    respawnMaxHp: 100,               // 死亡後平台重置的最大血量
    respawnMaxUnits: 10,             // 死亡後平台重置的最大單位數
};

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// ⭐ --- 【資源管理器 (Assets)】 ---
const ASSETS = {
    imgBuilding: new Image(),
    imgBuilding2: new Image(),
    imgBuilding3: new Image(),
    imgCloud: new Image(),
    imgBow: new Image(),
    imgLogo: new Image(),
    imgSettings: new Image(),
    imgBgNight: new Image(),
    imgBgDay: new Image(),
    imgMap: new Image(),
    imgCage: new Image(),

    sfxButton: new Audio('assets/audio/button.mp3'),
    sfxBuy: new Audio('assets/audio/buy.mp3'),
    sfxDie: new Audio('assets/audio/DIE.mp3'),
    bgmMenu: new Audio('assets/audio/music-loop.mp3'),
    bgmCity: new Audio('assets/audio/城市音樂1.mp3'),
    bgmSafeZone: new Audio('assets/audio/安全區音樂1.mp3'),
    sfxWarning: new Audio('assets/audio/注意.mp3')
};
// 載入圖片 (使用正確的中文檔名)
ASSETS.imgBuilding.src = 'assets/images/building_1.png';
ASSETS.imgBuilding2.src = 'assets/images/building_2.png';
ASSETS.imgBuilding3.src = 'assets/images/building_3.png';
ASSETS.imgCloud.src = 'assets/images/雲朵.png';
ASSETS.imgBow.src = 'assets/images/bow_1.png';
ASSETS.imgLogo.src = 'assets/images/LOGO.png';
ASSETS.imgSettings.src = 'assets/images/設定.png';
ASSETS.imgBgNight.src = 'assets/images/夜晚1.png';
ASSETS.imgBgDay.src = 'assets/images/白天1.png';
ASSETS.imgMap.src = 'assets/images/地圖1.png'; // 地圖背景 (如果不存則使用 fallback)
ASSETS.imgCage.src = 'assets/images/牢籠.png';

ASSETS.bgmMenu.loop = true; // 主選單音樂循環
ASSETS.bgmCity.loop = true; // 城市音樂循環
ASSETS.bgmCity.volume = 0;
ASSETS.bgmSafeZone.loop = false; // 安全區音樂用 timeupdate 控制截尾
ASSETS.bgmSafeZone.volume = 0;

// ⭐ 安全區音樂：片尾最後 7 秒裁切 (用 timeupdate 在 duration-7 時重置)
ASSETS.bgmSafeZone.addEventListener('timeupdate', function () {
    if (this.duration && this.currentTime >= this.duration - 7) {
        this.currentTime = 0;
    }
});

let gameTime = 0;
let lastTime = performance.now();
let cameraX = 0;
const gravity = 0.4;
const floorY = 480;

let mouseScreenX = 0;
let mouseScreenY = 0;

// ⭐ 遊戲初始狀態
const gameState = {
    phase: 'menu',      // menu / intro / tutorial_combat / tutorial_clearing /
    // combat / clearing / rest_shop / rest_house / rest_upgrade /
    // map / transition_in / game_over
    introState: 0,
    menuAlpha: 1.0,
    timer: 0,           // 戰鬥/休息計時器
    restTimer: 0,       // 休息站倒數計時器
    restType: 'shop',   // 'shop' | 'house' | 'upgrade' (當前休息站類型)
    isPremiumShop: false, // 是否為高級商店
    isInTutorial: true, // 是否在新手教學（第一次遊玩）
    safeZoneX: 0,
    shopTimer: 0,
    bgTransition: 0.0,
    // 戰鬥敵人生成管理
    levelConfig: null,  // 當前關卡設定（levelPresets 的一個值）
    spawnedCounts: {},  // 各類型已生成敵人數量
    nextSpawnTime: 0,   // 下次生成敵人的時間
    warningPlayed: false,

    // 地圖系統
    map: {
        playerPos: { x: 200, y: 200 },   // 玩家圖標在地圖上的座標
        points: [],                         // 當前關卡點列表
        clearedPoints: [],                  // 已清除的關卡點 ID
        unlockedRegions: ['city'],          // 已解鎖區域
        selectedPoint: null,                // 當前選中的關卡點
        panelOpen: false,                   // 左側資訊面板是否開啟
    },
    mapKeys: { w: false, a: false, s: false, d: false }, // WASD 狀態
    transitionAlpha: 0,                     // 轉場動畫不透明度
    transitionDir: 1,                       // 1=淡出進黑, -1=淡入
    transitionCallback: null,               // 轉場完成後的回調

    // 商店刷新狀態
    shopItems: [],       // 當前商店商品列表
    shopRefreshed: false,

    // 小房子跳出單位
    houseGifts: [],      // [{type, count}]
    houseAnimTimer: 0,   // 動畫計時器

    // 設定選單動畫參數
    settingsOpen: false,
    settingsScale: 0.0,
    settingsScaleVel: 0.0,
    setBtnHovered: false,
    setBtnScale: 1.0,
    setBtnScaleVel: 0.0,
    encyBtnHovered: false,
    encyBtnScale: 1.0,
    encyBtnScaleVel: 0.0,

    // ⭐ 圖鑑系統狀態
    encyclopediaOpen: false,
    encyclopediaScale: 0.0,
    encyclopediaScaleVel: 0.0,
    encyCloseBtnHovered: false,
    encyCloseBtnScale: 1.0,
    encyCloseBtnScaleVel: 0.0,
    encyclopediaCategory: 'unit', // 分類：'unit', 'building', 'enemy'
    encyclopediaScrollY: 0,       // 列表滾動
    encyclopediaDetailScrollY: 0, // 詳細內容滾動
    encyclopediaSelectedTarget: null, // 目前查看詳細資訊的對象

    // ⭐ 難度選擇狀態
    showDifficultySelection: false,
    difficultySelectionAlpha: 0,

    // ⭐ 底部背包動畫與狀態
    backpackOpen: false,
    backpackAnimVal: 0,
    backpackAnimVel: 0,
    backpackTab: 'all',  // 'all', 'unit', 'building'
    backpackScrollY: 0,

    // ⭐ 拖曳裝備狀態
    draggedItem: null,
    dragSource: null,
    dragSourceIndex: -1,

    // ⭐ 底排快捷列動畫
    slotScale: [1, 1, 1, 1, 1],
    slotScaleVel: [0, 0, 0, 0, 0],

    // ⭐ 音樂淡入淡出管理
    // currentBgm: 'menu' | 'city' | 'safezone' | null
    // fadeOut: { track, speed } | null
    // fadeIn : { track, speed } | null
    musicState: 'menu', // 目前播放的音樂狀態

    // ⭐ 解鎖通知列表
    unlockNotifications: []
};

const player = {
    hp: GAME_CONFIG.baseMaxHp, maxHp: GAME_CONFIG.baseMaxHp,
    unitCount: 0, maxUnits: 10, selectedSlot: -1, loadoutRow: 0,
    loadout: [
        { id: 'archer', category: 'unit', type: 1, cost: GAME_CONFIG.archerCost, name: 'Arch', count: 4 },
        { id: 'swordsman', category: 'unit', type: 3, cost: GAME_CONFIG.swordsmanCost, name: 'Swor', count: 2 },
        { id: 'square', category: 'building', type: 1, cost: GAME_CONFIG.buildingCost, name: 'Squa', count: 5 },
        null, null, null, null, null, null, null
    ],
    inventory: [
        { id: 'archer', category: 'unit', type: 1, cost: GAME_CONFIG.archerCost, name: 'Arch', count: 4 },
        { id: 'swordsman', category: 'unit', type: 3, cost: GAME_CONFIG.swordsmanCost, name: 'Swor', count: 2 },
        { id: 'square', category: 'building', type: 1, cost: GAME_CONFIG.buildingCost, name: 'Squa', count: 5 }
    ],
    coins: 100,
    kills: 0,
    unlockedCannon: false,
    unlockedPistol: false,
    unlockedSwordsman: true,
    unlockedSquare: true,
    unlockedRect: false,
    unlockedTri: false,
    unlockedRTri: false,
    unlockedBrickSquare: false,
    unlockedBrickRect: false,
    unlockedBrickTri: false,
    unlockedBrickRTri: false,
    unlockedSteelSquare: false,
    unlockedSteelRect: false,
    unlockedSteelTri: false,
    unlockedSteelRTri: false,
    unlockedBuilding: true,
    encountered: {},
    shopScrollY: 0,
    buildAngle: 0,
    aimingUnit: null, reaimMode: false, deleteMode: false, summonMode: false, hoveredEntity: null,
    maxUnitCost: GAME_CONFIG.unitUpgradePrice,
    maxHpUpgradeCount: 0
};

// ⭐ baseScreenX 改為 let，方便在開場動畫中移動
let baseScreenX = -1000;
const base = {
    width: 240, height: 20, x: 0, y: floorY - 20,
    speed: GAME_CONFIG.baseSpeed, wheelAngle: 0, flashTimer: 0, speedBoost: 0
};
base.x = cameraX + baseScreenX;

let units = [];
let buildings = [];
let enemies = [];
let arrows = [];
let particles = [];
let floatingTexts = [];
let explosions = [];
let slashes = [];

function randomRange(min, max) { return Math.random() * (max - min) + min; }
function hexToRgb(hex) {
    let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) } : null;
}
function lerpColor(c1, c2, t) {
    const rgb1 = hexToRgb(c1); const rgb2 = hexToRgb(c2);
    const r = Math.round(rgb1.r + (rgb2.r - rgb1.r) * t);
    const g = Math.round(rgb1.g + (rgb2.g - rgb1.g) * t);
    const b = Math.round(rgb1.b + (rgb2.b - rgb1.b) * t);
    return `rgb(${r},${g},${b})`;
}
function drawCircle(x, y, radius, color, squishX = 1, squishY = 1) {
    ctx.fillStyle = color;
    ctx.beginPath(); ctx.ellipse(x, y, radius * squishX, radius * squishY, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.beginPath(); ctx.ellipse(x - radius * 0.3, y - radius * 0.3, radius * 0.3, radius * 0.3, 0, 0, Math.PI * 2); ctx.fill();
}
function drawWheel(x, y, radius, angle) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(angle);
    ctx.fillStyle = '#2c3e50'; ctx.beginPath(); ctx.arc(0, 0, radius, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#7f8c8d'; ctx.fillRect(-radius + 2, -2, radius * 2 - 4, 4); ctx.fillRect(-2, -radius + 2, 4, radius * 2 - 4);
    ctx.restore();
}
function createParticles(x, y, color, count = 8) {
    for (let i = 0; i < count; i++) {
        particles.push({ x: x, y: y, vx: randomRange(-100, 100), vy: randomRange(-100, 100), life: 0.3, maxLife: 0.3, color: color, alpha: 1 });
    }
}

function getBuildingVertices(b) {
    let ow = b.type === 2 ? 80 : 40; let oh = b.type === 2 ? 20 : 40;
    let pts = [];
    if (b.type === 1 || b.type === 2) pts = [{ x: -ow / 2, y: -oh / 2 }, { x: ow / 2, y: -oh / 2 }, { x: ow / 2, y: oh / 2 }, { x: -ow / 2, y: oh / 2 }];
    else if (b.type === 3) pts = [{ x: 0, y: -oh / 2 }, { x: ow / 2, y: oh / 2 }, { x: -ow / 2, y: oh / 2 }];
    else if (b.type === 4) pts = [{ x: -ow / 2, y: -oh / 2 }, { x: ow / 2, y: oh / 2 }, { x: -ow / 2, y: oh / 2 }];
    let rad = b.angle * Math.PI / 180;
    let cos = Math.cos(rad); let sin = Math.sin(rad);
    return pts.map(p => ({ x: b.x + p.x * cos - p.y * sin, y: b.y + p.x * sin + p.y * cos }));
}

function polygonsTouch(poly1, poly2, tolerance = 3) {
    let edges = [];
    for (let i = 0; i < poly1.length; i++) edges.push({ p1: poly1[i], p2: poly1[(i + 1) % poly1.length] });
    for (let i = 0; i < poly2.length; i++) edges.push({ p1: poly2[i], p2: poly2[(i + 1) % poly2.length] });

    for (let i = 0; i < edges.length; i++) {
        let edge = edges[i];
        let nx = -(edge.p2.y - edge.p1.y); let ny = edge.p2.x - edge.p1.x;
        let len = Math.hypot(nx, ny); nx /= len; ny /= len;

        let min1 = Infinity, max1 = -Infinity;
        for (let p of poly1) { let proj = p.x * nx + p.y * ny; min1 = Math.min(min1, proj); max1 = Math.max(max1, proj); }
        let min2 = Infinity, max2 = -Infinity;
        for (let p of poly2) { let proj = p.x * nx + p.y * ny; min2 = Math.min(min2, proj); max2 = Math.max(max2, proj); }
        if (max1 < min2 - tolerance || max2 < min1 - tolerance) return false;
    }
    return true;
}

function isPointInPolygon(px, py, poly) {
    let inside = false;
    for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
        let xi = poly[i].x, yi = poly[i].y;
        let xj = poly[j].x, yj = poly[j].y;
        let intersect = ((yi > py) !== (yj > py)) && (px < (xj - xi) * (py - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }
    return inside;
}