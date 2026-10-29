/* ===========================================================
   The Natural Dye Studio - Logic
   =========================================================== */

const levels = [
    {
        targetColor: "Forest Green",
        targetHex: "#228B22",
        requiredIngredients: ["Indigo Leaves", "Yellow Bark"],
        targetPattern: "zigzag",
        fact: "In 1909, Deaconess Anne Hargreaves helped open the school to girls. The Easter Weaving Room taught them to use natural plants like indigo and bark to create vibrant, world-class fabrics!"
    },
    {
        targetColor: "Sunset Orange",
        targetHex: "#FF8C00",
        requiredIngredients: ["Red Roots", "Yellow Bark"],
        targetPattern: "diamond",
        fact: "Before synthetic dyes, weavers used local roots and bark. The 'Diamond' pattern is a traditional Cordilleran design representing the eyes of the ancestors watching over the community."
    },
    {
        targetColor: "Royal Purple",
        targetHex: "#800080",
        requiredIngredients: ["Indigo Leaves", "Red Roots"],
        targetPattern: "river",
        fact: "The 'River Flow' pattern symbolizes the continuous journey of life. Easter College's weaving room became famous for preserving these intricate, meaningful designs for future generations."
    }
];

let currentLevelIndex = 0;
let vatIngredients = [];
let clothDyed = false;
let patternApplied = false;

// DOM Elements
const currentLevelEl = document.getElementById('currentLevel');
const totalLevelsEl = document.getElementById('totalLevels');
const requestTextEl = document.getElementById('requestText');
const vatLiquid = document.getElementById('vatLiquid');
const fabricCloth = document.getElementById('fabricCloth');
const clothPattern = document.getElementById('clothPattern');
const patternsPanel = document.getElementById('patternsPanel');
const factModal = document.getElementById('factModal');
const winScreen = document.getElementById('winScreen');

function init() {
    totalLevelsEl.textContent = levels.length;
    loadLevel();
    setupDragAndDrop();
    setupButtons();
}

function loadLevel() {
    const level = levels[currentLevelIndex];
    currentLevelEl.textContent = currentLevelIndex + 1;
    requestTextEl.textContent = `I need a "${level.targetColor}" fabric with a "${level.targetPattern}" pattern!`;
    
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

function setupButtons() {
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
            // Success!
            clothDyed = true;
            fabricCloth.style.backgroundColor = level.targetHex;
            patternsPanel.classList.add('active');
        } else {
            // Wrong mix - flash red
            vatLiquid.style.backgroundColor = '#ef4444';
            setTimeout(() => {
                vatLiquid.style.backgroundColor = '#d1d5db';
            }, 500);
        }
    });

    document.getElementById('closeModal').addEventListener('click', () => factModal.classList.remove('active'));
    document.getElementById('continueBtn').addEventListener('click', () => {
        factModal.classList.remove('active');
        currentLevelIndex++;
        if (currentLevelIndex < levels.length) {
            loadLevel();
        } else {
            winScreen.classList.add('active');
        }
    });

    document.getElementById('finishBtn').addEventListener('click', () => {
        const urlParams = new URLSearchParams(window.location.search);
        const buildingId = urlParams.get('id') || 2; 
        window.location.href = `../../complete.php?id=${buildingId}`;
    });
}

function setupDragAndDrop() {
    let draggedElement = null;
    let originalParent = null;
    let offsetX = 0;
    let offsetY = 0;

    function onPointerDown(e) {
        draggedElement = e.currentTarget;
        originalParent = draggedElement.parentElement;
        const rect = draggedElement.getBoundingClientRect();
        offsetX = e.clientX - rect.left;
        offsetY = e.clientY - rect.top;
        
        draggedElement.style.position = 'fixed';
        draggedElement.style.zIndex = '1000';
        draggedElement.style.pointerEvents = 'none'; // Let events pass through to check drop targets
        
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

        // Check drop targets
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
                        document.getElementById('modalFact').textContent = level.fact;
                        factModal.classList.add('active');
                    }, 800);
                } else {
                    // Wrong pattern - shake cloth
                    fabricCloth.style.transform = 'translateX(10px)';
                    setTimeout(() => fabricCloth.style.transform = 'translateX(-10px)', 100);
                    setTimeout(() => fabricCloth.style.transform = 'translateX(0)', 200);
                }
            }
        }
        
        draggedElement = null;
    }

    // Attach to ingredients
    document.querySelectorAll('.ingredient').forEach(el => {
        el.addEventListener('pointerdown', onPointerDown);
    });

    // Attach to patterns
    document.querySelectorAll('.pattern-stamp').forEach(el => {
        el.addEventListener('pointerdown', onPointerDown);
    });
}

function updateVatVisuals() {
    const level = levels[currentLevelIndex];
    const hasRequired = level.requiredIngredients.every(ing => vatIngredients.includes(ing));
    
    // Fill vat
    vatLiquid.style.height = `${Math.min(vatIngredients.length * 30, 90)}%`;
    
    // Change color based on ingredients
    if (vatIngredients.includes('Indigo Leaves') && vatIngredients.includes('Yellow Bark')) {
        vatLiquid.style.backgroundColor = '#228B22'; // Green
    } else if (vatIngredients.includes('Red Roots') && vatIngredients.includes('Yellow Bark')) {
        vatLiquid.style.backgroundColor = '#FF8C00'; // Orange
    } else if (vatIngredients.includes('Indigo Leaves') && vatIngredients.includes('Red Roots')) {
        vatLiquid.style.backgroundColor = '#800080'; // Purple
    } else if (vatIngredients.length > 0) {
        vatLiquid.style.backgroundColor = '#9ca3af'; // Gray/Muddy
    }
}

// Start the game
init();