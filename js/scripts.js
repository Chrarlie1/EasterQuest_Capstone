/*==========================================================
Campus Explorer
scripts.js
==========================================================*/
let selectedBuilding = null;
let isZooming = false;
let isZoomedIn = false; // NEW: Tracks if map is currently zoomed in

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

/*==========================================================
Marker Mapping
==========================================================*/
const markerMap = {
    elementarydepartment: ".marker1",
    departmentofhospitality: ".marker2",
    highschooldepartment: ".marker3",
    collegedepartment: ".marker4"
};

/*==========================================================
Initialize Markers
==========================================================*/
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

/*==========================================================
Marker Click (TOGGLE ZOOM LOGIC)
==========================================================*/
function markerClicked(event, key) {
    // NEW: If already zoomed in, clicking any marker zooms out
    if (isZoomedIn) {
        hidePopup();
        return;
    }

    const building = buildings[key];
    if (!building) return;

    isZooming = true;
    isZoomedIn = true; // Lock state
    selectedBuilding = building;
    updateSidebar(building);

    const marker = event.target;
    const mapContent = document.querySelector(".map-content");
    const mapContainer = document.querySelector(".map-container");

    if (mapContent && mapContainer) {
        const markerRect = marker.getBoundingClientRect();
        const containerRect = mapContainer.getBoundingClientRect();
        const x = markerRect.left - containerRect.left + (markerRect.width / 2);
        const y = markerRect.top - containerRect.top + (markerRect.height / 2);

        // 1. Instant reset to new origin
        mapContent.style.transition = "none";
        mapContent.style.transform = "scale(1)";
        mapContent.style.transformOrigin = `${x}px ${y}px`;
        void mapContent.offsetWidth; // Force browser reflow
        
        // 2. Smooth zoom in
        mapContent.style.transition = "transform 0.5s cubic-bezier(0.25, 0.8, 0.25, 1)";
        mapContent.style.transform = "scale(1.5)";

        setTimeout(() => { isZooming = false; }, 500);
    }

    updatePopup(building, marker);
}

/*==========================================================
Popup & Positioning
==========================================================*/
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
    const mapContainer = document.querySelector(".map-container");
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

/*==========================================================
Hide Popup & Zoom Out
==========================================================*/
function hidePopup() {
    popup.style.display = "none";
    isZoomedIn = false; // Unlock state
    isZooming = false;

    const mapContent = document.querySelector(".map-content");
    if (mapContent) {
        // Smooth zoom out animation
        mapContent.style.transition = "transform 0.5s cubic-bezier(0.25, 0.8, 0.25, 1)";
        mapContent.style.transform = "scale(1)";
        mapContent.style.transformOrigin = "center center";
    }
}

/*==========================================================
Sidebar & Game
==========================================================*/
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

/*==========================================================
Event Listeners
==========================================================*/
// Clicking background zooms out
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
        if (!isZooming) marker.style.transform = "scale(1.2)";
    });
    marker.addEventListener("mouseleave", function () {
        marker.style.transform = "scale(1)";
    });
});

document.querySelectorAll("img").forEach(img => { img.draggable = false; });
const mapImg = document.querySelector(".map");
if (mapImg) mapImg.addEventListener("contextmenu", function (e) { e.preventDefault(); });

/*==========================================================
Initial State
==========================================================*/
sidebarButton.disabled = true;
statusBadge.textContent = "Not Completed";
statusBadge.classList.add("incomplete");
initializeMarkers();