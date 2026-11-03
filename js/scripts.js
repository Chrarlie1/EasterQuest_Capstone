/* ==========================================================
Campus Explorer
scripts.js
========================================================== */

let selectedBuilding = null;
let isZooming = false;
let isZoomedIn = false;

// Global variables for Google Maps style zoom/pan
let currentScale = 1;
let translateX = 0;
let translateY = 0;
let isPanning = false;
let startX, startY;

/* ==========================================================
DOM Elements
========================================================== */
const popup = document.getElementById("popup");
const popupTitle = document.getElementById("popupTitle");
const popupText = document.getElementById("popupText");
const sidebarTitle = document.getElementById("buildingTitle");
const sidebarDescription = document.getElementById("buildingDescription");
const sidebarImage = document.getElementById("buildingImage");
const sidebarButton = document.getElementById("sidebarButton");
const statusBadge = document.getElementById("statusBadge");

const mapContent = document.querySelector(".map-content");
const mapContainer = document.querySelector(".map-container");

/* ==========================================================
Marker Mapping
========================================================== */
const markerMap = {
    elementarydepartment: ".marker1",
    departmentofhospitality: ".marker2",
    highschooldepartment: ".marker3",
    collegedepartment: ".marker4"
};

/* ==========================================================
Helper: Inverse Marker Scaling
========================================================== */
function updateMarkerScales() {
    document.querySelectorAll(".marker").forEach(marker => {
        // Keeps markers the exact same visual size while the map zooms
        marker.style.transform = `scale(${1 / currentScale})`;
    });
}

/* ==========================================================
Helper: Apply Transform (FIXED ORIGIN APPROACH)
========================================================== */
function applyTransform(animate = true) {
    if (!mapContent) return;
    
    if (animate) {
        mapContent.style.transition = "transform 0.5s cubic-bezier(0.25, 0.8, 0.25, 1)";
    } else {
        mapContent.style.transition = "none";
    }
    
    // CRITICAL: We NEVER change the transform-origin after initialization.
    // This prevents the "snap back" glitch entirely.
    mapContent.style.transformOrigin = "center center";
    mapContent.style.transform = `scale(${currentScale}) translate(${translateX / currentScale}px, ${translateY / currentScale}px)`;
    
    updateMarkerScales();
}

/* ==========================================================
Initialize Markers
========================================================== */
function initializeMarkers() {
    for (const buildingKey in markerMap) {
        const building = buildings[buildingKey];
        const marker = document.querySelector(markerMap[buildingKey]);
        if (!building || !marker) continue;

        if (building.completed) {
            marker.classList.add("completed");
            marker.classList.remove("incomplete");
        } else {
            marker.classList.add("incomplete");
            marker.classList.remove("completed");
        }
    }
}

/* ==========================================================
Marker Click (SMART ZOOM & PAN LOGIC)
========================================================== */
function markerClicked(event, key) {
    const building = buildings[key];
    if (!building) return;

    // If clicking the SAME marker while zoomed in, zoom out
    if (isZoomedIn && selectedBuilding === building) {
        hidePopup();
        return;
    }

    isZooming = true;
    isZoomedIn = true;
    selectedBuilding = building;
    updateSidebar(building);

    const marker = event.target;
    const markerRect = marker.getBoundingClientRect();
    const containerRect = mapContainer.getBoundingClientRect();

    // 1. Get marker's current visual position relative to the container
    const markerX = markerRect.left - containerRect.left + markerRect.width / 2;
    const markerY = markerRect.top - containerRect.top + markerRect.height / 2;

    // 2. Get the center of the container
    const centerX = containerRect.width / 2;
    const centerY = containerRect.height / 2;

    const targetScale = 1.5;
    const ratio = targetScale / currentScale;

    // 3. Math: Calculate the exact translation needed to smoothly pan 
    // the marker to the center of the screen while adjusting the zoom.
    translateX = ratio * (translateX + centerX - markerX);
    translateY = ratio * (translateY + centerY - markerY);
    currentScale = targetScale;

    // 4. Apply the smooth animation
    applyTransform(true);

    setTimeout(() => { isZooming = false; }, 500);
    updatePopup(building, marker);
}

/* ==========================================================
Popup & Positioning
========================================================== */
function updatePopup(building, marker) {
    popupTitle.textContent = building.title;
    if (building.completed) {
        popupText.innerHTML = building.short + '<br><strong class="popup-completed">✓ COMPLETED</strong>';
    } else {
        popupText.textContent = building.short;
    }
    popup.style.display = "block";
    positionPopup(marker);
}

function positionPopup(marker) {
    const mapRect = mapContainer.getBoundingClientRect();
    const markerRect = marker.getBoundingClientRect();

    let left = markerRect.left - mapRect.left + markerRect.width + 10;
    let top = markerRect.top - mapRect.top - 20;

    if (left + popup.offsetWidth > mapRect.width) {
        left = markerRect.left - mapRect.left - popup.offsetWidth - 20;
    }
    if (top < 10) top = 10;
    if (top + popup.offsetHeight > mapRect.height) {
        top = mapRect.height - popup.offsetHeight - 10;
    }

    popup.style.left = left + "px";
    popup.style.top = top + "px";
}

/* ==========================================================
Hide Popup & Zoom Out
========================================================== */
function hidePopup() {
    popup.style.display = "none";
    isZoomedIn = false;
    isZooming = false;
    selectedBuilding = null;
    
    currentScale = 1;
    translateX = 0;
    translateY = 0;

    applyTransform(true);
}

/* ==========================================================
Sidebar & Game
========================================================== */
function updateSidebar(building) {
    sidebarTitle.textContent = building.title;
    if (building.completed) {
        sidebarDescription.innerHTML = building.description + '<br><span class="completed-subtitle">✓ COMPLETED</span>';
    } else {
        sidebarDescription.textContent = building.description;
    }
    sidebarImage.src = building.image;
    sidebarImage.alt = building.title;
    sidebarButton.disabled = false;

    if (building.completed) {
        statusBadge.textContent = "Completed";
        statusBadge.classList.remove("incomplete");
        statusBadge.classList.add("completed");
    } else {
        statusBadge.textContent = "Not Completed";
        statusBadge.classList.remove("completed");
        statusBadge.classList.add("incomplete");
    }
}

function startGame() {
    if (!selectedBuilding) return;
    window.location.href = selectedBuilding.link;
}

/* ==========================================================
Event Listeners
========================================================== */
document.addEventListener("click", function (e) {
    if (popup.style.display === "block" && !popup.contains(e.target) && !e.target.classList.contains("marker")) {
        hidePopup();
    }
});

document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") hidePopup();
});

window.addEventListener("resize", function () { hidePopup(); });

document.querySelectorAll(".marker").forEach(marker => {
    marker.addEventListener("mouseenter", function () {
        if (!isZooming) marker.style.transform = `scale(${1.2 / currentScale})`;
    });
    marker.addEventListener("mouseleave", function () {
        if (!isZooming) marker.style.transform = `scale(${1 / currentScale})`;
    });
});

document.querySelectorAll("img").forEach(img => { img.draggable = false; });
const mapImg = document.querySelector(".map");
if (mapImg) mapImg.addEventListener("contextmenu", function (e) { e.preventDefault(); });

/* ==========================================================
Google Maps Style: Scroll to Zoom
========================================================== */
if (mapContainer) {
    mapContainer.addEventListener("wheel", function (e) {
        e.preventDefault();
        
        const rect = mapContainer.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const zoomStep = 0.2;
        let newScale = currentScale;
        
        if (e.deltaY < 0) {
            newScale = Math.min(currentScale + zoomStep, 3); // Max zoom 3x
        } else {
            newScale = Math.max(currentScale - zoomStep, 1); // Min zoom 1x
        }
        
        if (newScale !== currentScale) {
            // Math: Adjust translation so the point under the mouse stays perfectly still
            translateX = translateX + (currentScale - newScale) * (mouseX - centerX);
            translateY = translateY + (currentScale - newScale) * (mouseY - centerY);
            
            currentScale = newScale;
            
            if (currentScale === 1) {
                hidePopup();
            } else {
                isZoomedIn = true;
                applyTransform(false); // Instant update for scroll
            }
        }
    }, { passive: false });
}

/* ==========================================================
Google Maps Style: Drag to Pan
========================================================== */
if (mapContainer) {
    mapContainer.addEventListener("mousedown", (e) => {
        if (currentScale > 1 && !e.target.classList.contains("marker") && !popup.contains(e.target)) {
            isPanning = true;
            startX = e.clientX - translateX;
            startY = e.clientY - translateY;
            mapContainer.style.cursor = "grabbing";
        }
    });

    document.addEventListener("mousemove", (e) => {
        if (isPanning) {
            e.preventDefault();
            translateX = e.clientX - startX;
            translateY = e.clientY - startY;
            applyTransform(false);
        }
    });

    document.addEventListener("mouseup", () => {
        isPanning = false;
        if (mapContainer) mapContainer.style.cursor = "default";
    });
}

/* ==========================================================
Initial State
========================================================== */
sidebarButton.disabled = true;
statusBadge.textContent = "Not Completed";
statusBadge.classList.add("incomplete");
initializeMarkers();

// Lock the transform origin to the center permanently on load
if (mapContent) {
    mapContent.style.transformOrigin = "center center";
}