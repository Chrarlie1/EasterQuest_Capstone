/* ===========================================================
   The Natural Dye Studio - Multi-Level Logic
   =========================================================== */

const levels = [
    {
        title: "The Foundation (1909)",
        description: "Discover the humble beginnings of the Easter Weaving Room.",
        history: "In 1909, Deaconess Anne Hargreaves helped open the school to girls. The Easter Weaving Room was established as a vocational training ground.",
        fun: "Before synthetic dyes, weavers used natural plants like indigo and local bark to create vibrant, world-class fabrics!",
        targetColor: "Forest Green",
        targetHex: "#228B22",
        requiredIngredients: ["Indigo Leaves", "Yellow Bark"],
        targetPattern: "zigzag"
    },
    {
        title: "The Weaving Tradition",
        description: "Learn about the traditional patterns and natural dyes.",
        history: "The weaving room taught girls to use local roots and bark. These skills were passed down through generations.",
        fun: "The 'Diamond' pattern is a traditional Cordilleran design representing the eyes of the ancestors watching over the community.",
        targetColor: "Sunset Orange",
        targetHex: "#FF8C00",
        requiredIngredients: ["Red Roots", "Yellow Bark"],
        targetPattern: "diamond"
    },
    {
        title: "Modern Campus",
        description: "Experience the preservation of these historic crafts today.",
        history: "Today, the Easter Weaving Room continues to preserve these intricate, meaningful designs for future generations.",
        fun: "The 'River Flow' pattern symbolizes the continuous journey of life and the enduring spirit of the school.",
        targetColor: "Royal Purple",
        targetHex: "#800080",
        requiredIngredients: ["Indigo Leaves", "Red Roots"],
        targetPattern: "river"
    }
];

let currentLevelIndex = 0;
let vatIngredients = [];
let clothDyed = false;
let patternApplied = false;

// DOM Elements
const loadingScreen = document.getElementById('loadingScreen');
const hud = document.getElementById('hud');
const progressContainer = document.getElementById('progressContainer');
const progressBar = document.getElementById('progressBar');
const levelText = document.getElementById('levelText');
const progressText = document.getElementById('progressText');
const requestText = document.getElementById('requestText');
const vatLiquid = document.getElementById('vatLiquid');
const fabricCloth = document.getElementById('fabricCloth');
const clothPattern = document.getElementById('clothPattern');
const patternsPanel = document.getElementById('patternsPanel');
const factPanel = document.getElementById('factPanel');
const victoryScreen = document.getElementById('victoryScreen');

/* ===========================================================
   BUTTONS
   =========================================================== */
document.getElementById('startButton').addEventListener('click', startGame);
document.getElementById('nextButton').addEventListener('click', nextLevel);
document.getElementById('completeButton').addEventListener('click', completeGame);
document.getElementById('closeModal').addEventListener('click', () => {
    factPanel.style.display = 'none';
});

/* ===========================================================
   START GAME
   =========================================================== */
function startGame() {
    loadingScreen.style.display = 'none';
    hud.style.display = 'flex';
    progressContainer.style.display = 'block';
    currentLevelIndex = 0;
    updateProgress();
    loadLevel();
}

/* ===========================================================
   LOAD LEVEL
   =========================================================== */
function loadLevel() {
    const level = levels[currentLevelIndex];
    levelText.textContent = `Level ${currentLevelIndex + 1} / ${levels.length}`;
    requestText.textContent = `I need a "${level.targetColor}" fabric with a "${level.targetPattern}" pattern!`;
    
    // Reset state
    vatIngredients = [];
    clothDyed = false;
    patternApplied = false;
    vatLiquid.style.height = '0%';
    vatLiquid.style.backgroundColor = '#d1d5db';
    fabricCloth.style.backgroundColor = '#ffffff';
    clothPattern.style.opacity = '0';
    clothPattern.className = 'cloth-pattern';
    patternsPanel.classList.remove('active');
}

/* ===========================================================
   DRAG AND DROP
   =========================================================== */
function setupDragAndDrop() {
    let draggedElement = null;
    let offsetX = 0;
    let offsetY = 0;

    function onPointerDown(e) {
        draggedElement = e.currentTarget;
        const rect = draggedElement.getBoundingClientRect();
        offsetX = e.clientX - rect.left;
        offsetY = e.clientY - rect.top;
        
        draggedElement.style.position = 'fixed';
        draggedElement.style.zIndex = '1000';
        draggedElement.style.pointerEvents = 'none';
        
        document.addEventListener('pointermove', onPointerMove);
        document.addEventListener('pointerup', onPointerUp);
    }

    function onPointerMove(e) {
        if (!draggedElement) return;
        draggedElement.style.left = (e.clientX - offsetX) + 'px';
        draggedElement.style.top = (e.clientY - offsetY) + 'px';
    }

    function onPointerUp(e) {
        if (!draggedElement) return;
        
        draggedElement.style.position = '';
        draggedElement.style.zIndex = '';
        draggedElement.style.left = '';
        draggedElement.style.top = '';
        draggedElement.style.pointerEvents = '';
        
        document.removeEventListener('pointermove', onPointerMove);
        document.removeEventListener('pointerup', onPointerUp);

        const dropTarget = document.elementFromPoint(e.clientX, e.clientY);
        
        if (dropTarget) {
            const vat = dropTarget.closest('#dyeVat');
            const cloth = dropTarget.closest('#fabricCloth');

            if (vat && draggedElement.classList.contains('ingredient')) {
                const ingredientName = draggedElement.dataset.name;
                if (!vatIngredients.includes(ingredientName)) {
                    vatIngredients.push(ingredientName);
                    updateVatVisuals();
                }
            } else if (cloth && draggedElement.classList.contains('pattern-stamp') && clothDyed && !patternApplied) {
                const patternName = draggedElement.dataset.pattern;
                const level = levels[currentLevelIndex];
                
                if (patternName === level.targetPattern) {
                    patternApplied = true;
                    clothPattern.classList.add(`pattern-${patternName}`);
                    clothPattern.style.opacity = '1';
                    
                    setTimeout(() => {
                        showFactPanel();
                    }, 800);
                } else {
                    fabricCloth.style.transform = 'translateX(10px)';
                    setTimeout(() => fabricCloth.style.transform = 'translateX(-10px)', 100);
                    setTimeout(() => fabricCloth.style.transform = 'translateX(0)', 200);
                }
            }
        }
        
        draggedElement = null;
    }

    document.querySelectorAll('.ingredient').forEach(el => {
        el.addEventListener('pointerdown', onPointerDown);
    });

    document.querySelectorAll('.pattern-stamp').forEach(el => {
        el.addEventListener('pointerdown', onPointerDown);
    });
}

/* ===========================================================
   GAME LOGIC
   =========================================================== */
document.getElementById('resetVatBtn').addEventListener('click', () => {
    vatIngredients = [];
    vatLiquid.style.height = '0%';
    vatLiquid.style.backgroundColor = '#d1d5db';
});

document.getElementById('dipClothBtn').addEventListener('click', () => {
    if (clothDyed) return;
    
    const level = levels[currentLevelIndex];
    const hasRequired = level.requiredIngredients.every(ing => vatIngredients.includes(ing));
    const hasExtra = vatIngredients.some(ing => !level.requiredIngredients.includes(ing));

    if (hasRequired && !hasExtra && vatIngredients.length > 0) {
        clothDyed = true;
        fabricCloth.style.backgroundColor = level.targetHex;
        patternsPanel.classList.add('active');
    } else {
        vatLiquid.style.backgroundColor = '#ef4444';
        setTimeout(() => {
            vatLiquid.style.backgroundColor = '#d1d5db';
        }, 500);
    }
});

function updateVatVisuals() {
    vatLiquid.style.height = `${Math.min(vatIngredients.length * 30, 90)}%`;
    
    if (vatIngredients.includes('Indigo Leaves') && vatIngredients.includes('Yellow Bark')) {
        vatLiquid.style.backgroundColor = '#228B22';
    } else if (vatIngredients.includes('Red Roots') && vatIngredients.includes('Yellow Bark')) {
        vatLiquid.style.backgroundColor = '#FF8C00';
    } else if (vatIngredients.includes('Indigo Leaves') && vatIngredients.includes('Red Roots')) {
        vatLiquid.style.backgroundColor = '#800080';
    } else if (vatIngredients.length > 0) {
        vatLiquid.style.backgroundColor = '#9ca3af';
    }
}

/* ===========================================================
   POPUP & PROGRESSION
   =========================================================== */
function showFactPanel() {
    const level = levels[currentLevelIndex];
    document.getElementById('factTitle').textContent = `Level Complete: ${level.title}`;
    document.getElementById('factDescription').textContent = level.description;
    document.getElementById('historyText').textContent = level.history;
    document.getElementById('funFact').textContent = level.fun;
    factPanel.style.display = 'flex';
}

function nextLevel() {
    factPanel.style.display = 'none';
    currentLevelIndex++;
    updateProgress();
    
    if (currentLevelIndex >= levels.length) {
        victory();
    } else {
        loadLevel();
    }
}

function victory() {
    victoryScreen.style.display = 'flex';
    progressBar.style.width = '100%';
}

function updateProgress() {
    const percent = (currentLevelIndex / levels.length) * 100;
    progressBar.style.width = percent + '%';
    progressText.textContent = Math.round(percent) + '%';
}

function completeGame() {
    const urlParams = new URLSearchParams(window.location.search);
    const buildingId = urlParams.get('id') || 2; 
    window.location.href = `../../complete.php?id=${buildingId}`;
}

// Initialize
setupDragAndDrop();