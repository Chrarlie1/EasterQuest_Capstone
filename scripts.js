/* ===========================================================
   Easter College Interactive Map
=========================================================== */

/* -----------------------------
   Building Database
------------------------------ */

const buildings = {

    elementary: {

        title: "Elementary Department",

        short: "Explore the Elementary Department.",

        description:
            "The Elementary Department provides foundational education for young learners. It serves as one of the oldest academic buildings on campus and plays an important role in developing students' knowledge, skills, and values through engaging learning experiences.",

        image: "images/elementary.jpg",

        completed: false,

        link: "elementary.html"

    },

    hospitality: {

        title: "Department of Hospitality",

        short: "Discover Hospitality and Tourism.",

        description:
            "The Department of Hospitality equips students with practical knowledge and professional skills in tourism, culinary arts, hotel operations, and customer service. Complete this building's activity to learn more.",

        image: "images/hospitality.jpg",

        completed: false,

        link: "hospitality.html"

    },

    highschool: {

        title: "High School Department",

        short: "Visit the High School Department.",

        description:
            "The High School Department prepares students for higher education by offering quality academic instruction while promoting leadership, discipline, and personal development.",

        image: "images/highschool.jpg",

        completed: false,

        link: "highschool.html"

    },

    college: {

        title: "College Department",

        short: "Begin your college adventure.",

        description:
            "The College Department offers various degree programs that prepare students for professional careers. Explore the building and complete the learning activity to discover its history and significance.",

        image: "images/college.jpg",

        completed: false,

        link: "college.html"

    }

};

/* -----------------------------
   Current Selected Building
------------------------------ */

let selectedBuilding = null;


/* -----------------------------
   Marker Click
------------------------------ */

function markerClicked(event, buildingKey){

    const building = buildings[buildingKey];

    selectedBuilding = building;

    updateSidebar(building);

    showPopup(event, building);

}


/* -----------------------------
   Sidebar
------------------------------ */

function updateSidebar(building){

    document.getElementById("buildingTitle").textContent =
        building.title;

    document.getElementById("buildingDescription").textContent =
        building.description;

    document.getElementById("buildingImage").src =
        building.image;

    const badge =
        document.getElementById("statusBadge");

    if(building.completed){

        badge.textContent = "Completed";

        badge.classList.remove("incomplete");

        badge.classList.add("completed");

    }

    else{

        badge.textContent = "Not Completed";

        badge.classList.remove("completed");

        badge.classList.add("incomplete");

    }

    document.getElementById("sidebarButton").disabled = false;

}


/* -----------------------------
   Popup
------------------------------ */

function showPopup(event, building){

    const popup =
        document.getElementById("popup");

    document.getElementById("popupTitle").textContent =
        building.title;

    document.getElementById("popupText").textContent =
        building.short;

    popup.style.display = "block";

    const map =
        document.querySelector(".map-container");

    const mapRect =
        map.getBoundingClientRect();

    const markerRect =
        event.target.getBoundingClientRect();

    let left =
        markerRect.left -
        mapRect.left +
        45;

    let top =
        markerRect.top -
        mapRect.top -
        20;

    /* Prevent popup from overflowing */

    if(left + popup.offsetWidth > map.clientWidth){

        left =
            markerRect.left -
            mapRect.left -
            popup.offsetWidth -
            20;

    }

    if(top < 10){

        top = 10;

    }

    popup.style.left = left + "px";

    popup.style.top = top + "px";

}


/* -----------------------------
   Hide Popup
------------------------------ */

function hidePopup(){

    document.getElementById("popup").style.display =
        "none";

}


/* -----------------------------
   Start Game
------------------------------ */

function startGame(){

    if(selectedBuilding == null){

        alert("Please select a building first.");

        return;

    }

    // Redirect to game page

    window.location.href = selectedBuilding.link;

}


/* -----------------------------
   Mark Current Building Complete
------------------------------ */

function completeCurrentBuilding(){

    if(selectedBuilding == null) return;

    selectedBuilding.completed = true;

    updateSidebar(selectedBuilding);

}


/* -----------------------------
   Close Popup
------------------------------ */

document.addEventListener("click", function(e){

    const popup =
        document.getElementById("popup");

    if(
        e.target.closest(".marker") ||
        e.target.closest(".popup")
    ){
        return;
    }

    popup.style.display = "none";

});


/* -----------------------------
   Prevent Popup Closing
------------------------------ */

document
.getElementById("popup")
.addEventListener("click", function(e){

    e.stopPropagation();

});


/* -----------------------------
   Image Fallback
------------------------------ */

document
.getElementById("buildingImage")
.onerror = function(){

    this.src = "images/default.jpg";

};


/* -----------------------------
   Example
   Call this after finishing a game

   completeCurrentBuilding();

------------------------------ */