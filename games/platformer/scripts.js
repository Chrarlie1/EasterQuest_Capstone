/* ===========================================================
   THE REBUILDER - Multi-Level Platformer
   =========================================================== */

let currentLevel = 0;
let score = 0;
let totalMaterials = 0;
let game;
let player;
let platforms;
let materials;
let cursors;
let isWin = false;

/* ===========================================================
   LEVELS DATA (Based on Easter College History)
   =========================================================== */
const levels = [
    {
        title: "The Foundation (1906)",
        description: "Discover the humble beginnings of Easter College.",
        history: "In 1906, the first batch of 8 Igorot boys hiked for one week from Bontoc to Baguio City just to get an education, showing immense passion for learning.",
        fun: "One of these boys, Hilary Clapp, later became a medical doctor and the governor of Mountain Province!",
        materialsCount: 3
    },
    {
        title: "The Weaving Room (1909)",
        description: "Learn about the school's commitment to equality and vocational skills.",
        history: "In 1909, the school opened its doors to girls through the efforts of Deaconess Anne Hargreaves, and the famous Easter Weaving Room was established.",
        fun: "The weaving room trained girls in creating world-class woven materials, a tradition that continues today!",
        materialsCount: 4
    },
    {
        title: "Modern Campus (1995-Present)",
        description: "Experience the growth and resilience of the college.",
        history: "The college department was added in 1995, introducing programs like Nursing and Hospitality, and surviving the challenges of time.",
        fun: "Easter College is the only school in Baguio City integrating Sign Language and Search & Rescue into its Nursing curriculum!",
        materialsCount: 5
    }
];

/* ===========================================================
   BUTTONS
   =========================================================== */
document.getElementById("startButton").addEventListener("click", startGame);
document.getElementById("nextButton").addEventListener("click", nextLevel);
document.getElementById("completeButton").addEventListener("click", completeGame);

/* ===========================================================
   START GAME
   =========================================================== */
function startGame() {
    document.getElementById("loadingScreen").style.display = "none";
    document.getElementById("hud").style.display = "flex";
    document.getElementById("progressContainer").style.display = "block";
    currentLevel = 0;
    updateProgress();
    loadLevel();
}

/* ===========================================================
   LOAD LEVEL
   =========================================================== */
function loadLevel() {
    const level = levels[currentLevel];
    document.getElementById("levelText").textContent = `Level ${currentLevel + 1} / ${levels.length}`;
    score = 0;
    totalMaterials = level.materialsCount;
    document.getElementById("materialsText").textContent = `0 / ${totalMaterials}`;
    isWin = false;
    
    // Destroy previous game instance if it exists
    if (game) {
        game.destroy(true);
    }
    document.getElementById("gameContainer").innerHTML = "";

    // Initialize Phaser Game
    const config = {
        type: Phaser.AUTO,
        width: 800,
        height: 600,
        parent: "gameContainer",
        backgroundColor: '#87CEEB',
        physics: {
            default: 'arcade',
            arcade: {
                gravity: { y: 600 },
                debug: false
            }
        },
        scene: {
            preload: preload,
            create: create,
            update: update
        }
    };

    game = new Phaser.Game(config);
}

/* ===========================================================
   PRELOAD
   =========================================================== */
function preload() {
    const graphics = this.make.graphics({ x: 0, y: 0, add: false });
    
    // Player Texture
    graphics.fillStyle(0x3b82f6, 1);
    graphics.fillRoundedRect(0, 0, 40, 40, 8);
    graphics.fillStyle(0xffffff, 1);
    graphics.fillCircle(12, 15, 5);
    graphics.fillCircle(28, 15, 5);
    graphics.fillStyle(0x000000, 1);
    graphics.fillCircle(12, 15, 2);
    graphics.fillCircle(28, 15, 2);
    graphics.fillStyle(0xef4444, 1);
    graphics.fillRoundedRect(14, 28, 12, 3, 2);
    graphics.generateTexture('player', 40, 40);
    graphics.destroy();

    // Material Texture
    const matGraphics = this.make.graphics({ x: 0, y: 0, add: false });
    matGraphics.fillStyle(0xf59e0b, 1);
    matGraphics.fillRoundedRect(0, 0, 30, 30, 5);
    matGraphics.lineStyle(2, 0xffffff, 0.8);
    matGraphics.strokeRoundedRect(2, 2, 26, 26, 4);
    matGraphics.generateTexture('material', 30, 30);
    matGraphics.destroy();
}

/* ===========================================================
   CREATE
   =========================================================== */
function create() {
    platforms = this.physics.add.staticGroup();

    // Ground
    const ground = this.add.rectangle(400, 580, 800, 40, 0x22c55e);
    this.physics.add.existing(ground, true);
    platforms.add(ground);

    // Platforms (More platforms in later levels)
    let lastX = 150;
    let lastY = 480;
    const platformCount = 5 + currentLevel; 

    for (let i = 0; i < platformCount; i++) {
        let gapX = Phaser.Math.Between(100, 220);
        let gapY = Phaser.Math.Between(-120, 60);
        let newX = lastX + gapX;
        let newY = lastY + gapY;

        if (newX > 700) {
            newX = Phaser.Math.Between(50, 200);
            newY = Phaser.Math.Between(200, 500);
        }

        newY = Phaser.Math.Clamp(newY, 150, 550);

        let p = this.add.rectangle(newX, newY, 120, 20, 0x8b5cf6);
        this.physics.add.existing(p, true);
        platforms.add(p);

        lastX = newX;
        lastY = newY;
    }

    // Materials
    materials = this.physics.add.staticGroup();
    for (let i = 0; i < totalMaterials; i++) {
        let mx = Phaser.Math.Between(100, 700);
        let my = Phaser.Math.Between(200, 540);
        materials.create(mx, my, 'material');
    }

    // Player
    player = this.physics.add.sprite(100, 400, 'player');
    player.setCollideWorldBounds(true);
    player.setBounce(0.1);

    // Collisions
    this.physics.add.collider(player, platforms);
    this.physics.add.overlap(player, materials, collectMaterial, null, this);

    // Controls
    cursors = this.input.keyboard.createCursorKeys();
}

/* ===========================================================
   UPDATE
   =========================================================== */
function update() {
    if (isWin) return;

    if (cursors.left.isDown) {
        player.setVelocityX(-220);
    } else if (cursors.right.isDown) {
        player.setVelocityX(220);
    } else {
        player.setVelocityX(0);
    }

    if (cursors.space.isDown && player.body.touching.down) {
        player.setVelocityY(-450);
    }
}

/* ===========================================================
   COLLECT MATERIAL
   =========================================================== */
function collectMaterial(player, material) {
    material.disableBody(true, true);
    score++;
    document.getElementById("materialsText").textContent = `${score} / ${totalMaterials}`;

    // Flash effect (this refers to the Phaser scene)
    this.cameras.main.flash(100, 16, 185, 129, true);

    if (score === totalMaterials) {
        isWin = true;
        this.physics.pause();
        player.setTint(0x10b981);
        
        // Show fact panel
        showFactPanel();
    }
}

/* ===========================================================
   SHOW FACT PANEL
   =========================================================== */
function showFactPanel() {
    const level = levels[currentLevel];
    document.getElementById("factTitle").textContent = `Level Complete: ${level.title}`;
    document.getElementById("factDescription").textContent = level.description;
    document.getElementById("historyText").textContent = level.history;
    document.getElementById("funFact").textContent = level.fun;
    document.getElementById("factPanel").style.display = "flex";
}

/* ===========================================================
   NEXT LEVEL
   =========================================================== */
function nextLevel() {
    document.getElementById("factPanel").style.display = "none";
    currentLevel++;
    updateProgress();
    
    if (currentLevel >= levels.length) {
        victory();
    } else {
        loadLevel();
    }
}

/* ===========================================================
   VICTORY
   =========================================================== */
function victory() {
    document.getElementById("victoryScreen").style.display = "flex";
    document.getElementById("progressBar").style.width = "100%";
}

/* ===========================================================
   PROGRESS BAR
   =========================================================== */
function updateProgress() {
    const percent = (currentLevel / levels.length) * 100;
    document.getElementById("progressBar").style.width = percent + "%";
}

/* ===========================================================
   COMPLETE GAME
   =========================================================== */
function completeGame() {
    const urlParams = new URLSearchParams(window.location.search);
    const buildingId = urlParams.get('id') || 1;
    window.location.href = `../../complete.php?id=${buildingId}`;
}