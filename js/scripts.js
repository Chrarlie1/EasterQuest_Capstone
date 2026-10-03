/*==========================================================
    Campus Explorer
    scripts.js
==========================================================*/

let selectedBuilding = null;

/*==========================================================
    DOM
==========================================================*/

const popup = document.getElementById("popup");

const popupTitle = document.getElementById("popupTitle");

const popupText = document.getElementById("popupText");

const sidebarTitle = document.getElementById("buildingTitle");

const sidebarDescription = document.getElementById("buildingDescription");

const sidebarImage = document.getElementById("buildingImage");

const sidebarButton = document.getElementById("sidebarButton");

const statusBadge = document.getElementById("statusBadge");

/*==========================================================
    Marker Click
==========================================================*/

function markerClicked(event,key){

    const building = buildings[key];

    if(!building){

        return;

    }

    selectedBuilding = building;

    updateSidebar(building);

    updatePopup(building,event.target);

}

/*==========================================================
    Sidebar
==========================================================*/

function updateSidebar(building){

    sidebarTitle.textContent = building.title;

    sidebarDescription.textContent = building.description;

    sidebarImage.src = building.image;

    sidebarImage.alt = building.title;

    sidebarButton.disabled = false;

    if(building.completed){

        statusBadge.textContent = "Completed";

        statusBadge.classList.remove("incomplete");

        statusBadge.classList.add("completed");

    }

    else{

        statusBadge.textContent = "Not Completed";

        statusBadge.classList.remove("completed");

        statusBadge.classList.add("incomplete");

    }

}

/*==========================================================
    Popup
==========================================================*/

function updatePopup(building,marker){

    popupTitle.textContent = building.title;

    popupText.textContent = building.short;

    popup.style.display = "block";

    positionPopup(marker);

}

/*==========================================================
    Position Popup
==========================================================*/

function positionPopup(marker){

    const map = document.querySelector(".map-container");

    const mapRect = map.getBoundingClientRect();

    const markerRect = marker.getBoundingClientRect();

    const left =
        markerRect.left -
        mapRect.left +
        markerRect.width +
        10;

    const top =
        markerRect.top -
        mapRect.top -
        20;

    popup.style.left = left + "px";

    popup.style.top = top + "px";

}

/*==========================================================
    Hide Popup
==========================================================*/

function hidePopup(){

    popup.style.display = "none";

}

/*==========================================================
    Start Game
==========================================================*/

function startGame(){

    if(!selectedBuilding){

        return;

    }

    window.location.href = selectedBuilding.link;

}

/*==========================================================
    Close Popup Outside Click
==========================================================*/

document.addEventListener("click",function(e){

    if(

        popup.style.display==="block"

        &&

        !popup.contains(e.target)

        &&

        !e.target.classList.contains("marker")

    ){

        hidePopup();

    }

});

/*==========================================================
    Escape Key
==========================================================*/

document.addEventListener("keydown",function(e){

    if(e.key==="Escape"){

        hidePopup();

    }

});

/*==========================================================
    Window Resize
==========================================================*/

window.addEventListener("resize",function(){

    hidePopup();

});

/*==========================================================
    Hover Animation
==========================================================*/

document.querySelectorAll(".marker").forEach(marker=>{

    marker.addEventListener("mouseenter",function(){

        marker.style.transform="scale(1.2)";

    });

    marker.addEventListener("mouseleave",function(){

        marker.style.transform="scale(1)";

    });

});

/*==========================================================
    Prevent Image Drag
==========================================================*/

document.querySelectorAll("img").forEach(img=>{

    img.draggable=false;

});

/*==========================================================
    Prevent Context Menu on Map
==========================================================*/

const map = document.querySelector(".map");

if(map){

    map.addEventListener("contextmenu",function(e){

        e.preventDefault();

    });

}

/*==========================================================
    Initial State
==========================================================*/

sidebarButton.disabled = true;

statusBadge.textContent = "Not Completed";

statusBadge.classList.add("incomplete");