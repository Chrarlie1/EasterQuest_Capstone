<?php

require_once "auth.php";

/*
|--------------------------------------------------------------------------
| Load Buildings + User Progress
|--------------------------------------------------------------------------
*/

$stmt = $db->prepare("

SELECT

    buildings.id,
    buildings.name,
    buildings.description,
    buildings.image,

    progress.completed

FROM buildings

LEFT JOIN progress

ON progress.building_id = buildings.id

WHERE progress.user_id = ?

ORDER BY buildings.id

");

$stmt->execute([$userID]);

$buildings = $stmt->fetchAll();

/*
|--------------------------------------------------------------------------
| Convert to JavaScript Object
|--------------------------------------------------------------------------
*/

$buildingData = [];

foreach ($buildings as $building) {

    $key = strtolower(
        preg_replace(
            "/[^a-zA-Z0-9]/",
            "",
            $building["name"]
        )
    );

    $buildingData[$key] = [

        "id" => $building["id"],

        "title" => $building["name"],

        "short" => "Click to begin exploring.",

        "description" => $building["description"],

        "image" => $building["image"],

        "completed" => $building["completed"] ? true : false,

        "link" => "game.php?id=" . $building["id"]

    ];
}

?>

<!DOCTYPE html>

<html lang="en">

<head>

    <meta charset="UTF-8">

    <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0">

    <title>

        Campus Explorer

    </title>

    <link
        rel="stylesheet"
        href="css/styles.css">

</head>

<body>

    <div class="container">

        <!-- ====================================== -->
        <!-- Sidebar -->
        <!-- ====================================== -->

        <aside class="sidebar">

            <div class="logo">

                <h1>

                    EasterQuest

                </h1>

                <p>

                    Welcome,

                    <strong>

                        <?= htmlspecialchars($username) ?>

                    </strong>

                </p>

            </div>

            <hr>

            <section class="instructions">

                <h2>

                    How to Play

                </h2>

                <ol>

                    <li>Click a building marker.</li>

                    <li>Read the popup summary.</li>

                    <li>Read the building information.</li>

                    <li>Click Start Game.</li>

                    <li>Complete every building.</li>

                </ol>

                <a

                    href="logout.php"

                    class="logout-button">

                    Logout

                </a>
                
            </section>

            <hr>

            <section class="building-info">

                <h2 id="buildingTitle">

                    Select a Building

                </h2>

                <img

                    id="buildingImage"

                    src="images/default.jpg"

                    alt="Building">

                <p id="buildingDescription">

                    Click any marker to begin.

                </p>

                <div class="completion">

                    <h3>

                        Completion Status

                    </h3>

                    <div

                        id="statusBadge"

                        class="status incomplete">

                        Not Completed

                    </div>

                </div>

                <button

                    type="button"

                    id="sidebarButton"

                    onclick="startGame()"

                    disabled>

                    Start Game

                </button>



            </section>

        </aside>

        <!-- ====================================== -->
        <!-- Map -->
        <!-- ====================================== -->

        <main class="map-section">

            <div class="map-container">

                <img

                    src="images/map.png"

                    class="map"

                    alt="Campus Map">

                <!--
Marker positions will be adjusted
to match your actual map.
-->

                <button

                    type="button"

                    class="marker marker1"

                    onclick="markerClicked(event,'elementarydepartment')">

                    📍

                </button>

                <button

                    type="button"

                    class="marker marker2"

                    onclick="markerClicked(event,'departmentofhospitality')">

                    📍

                </button>

                <button

                    type="button"

                    class="marker marker3"

                    onclick="markerClicked(event,'highschooldepartment')">

                    📍

                </button>

                <button

                    type="button"

                    class="marker marker4"

                    onclick="markerClicked(event,'collegedepartment')">

                    📍

                </button>

                <!-- Popup -->

                <div

                    id="popup"

                    class="popup">

                    <button

                        type="button"

                        class="close-btn"

                        onclick="hidePopup()">

                        ✕

                    </button>

                    <h3 id="popupTitle">

                        Building

                    </h3>

                    <p id="popupText">

                        Description

                    </p>

                    <button

                        type="button"

                        class="popup-button"

                        onclick="startGame()">

                        Start Game

                    </button>

                </div>

            </div>

        </main>

    </div>

    <!-- Pass PHP Data to JavaScript -->

    <script>
        const buildings =

            <?= json_encode(

                $buildingData,

                JSON_PRETTY_PRINT

            ); ?>;
    </script>

    <script src="js/scripts.js"></script>

</body>

</html>