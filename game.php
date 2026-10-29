<?php
require_once "auth.php";

/*
|--------------------------------------------------------------------------
| Validate Building ID
|--------------------------------------------------------------------------
*/
if (!isset($_GET["id"]) || !is_numeric($_GET["id"])) {
    header("Location: index.php");
    exit();
}

$buildingID = (int)$_GET["id"];

/*
|--------------------------------------------------------------------------
| Load Building
|--------------------------------------------------------------------------
*/
$stmt = $db->prepare("
    SELECT *
    FROM buildings
    WHERE id = ?
    LIMIT 1
");
$stmt->execute([$buildingID]);
$building = $stmt->fetch();

if (!$building) {
    header("Location: index.php");
    exit();
}

/*
|--------------------------------------------------------------------------
| Check Progress
|--------------------------------------------------------------------------
*/
$stmt = $db->prepare("
    SELECT completed
    FROM progress
    WHERE user_id = ?
    AND building_id = ?
    LIMIT 1
");
$stmt->execute([
    $userID,
    $buildingID
]);

$progress = $stmt->fetch();
$completed = false;

if ($progress) {
    $completed = (bool)$progress["completed"];
}

/*
|--------------------------------------------------------------------------
| Launch Mini Games
|--------------------------------------------------------------------------
*/
switch ($buildingID) {
    case 1: // Elementary Department
        header("Location: games/platformer/index.html?id=" . $buildingID);
        exit();
        
    case 2: // Department of Hospitality
        // Note: Change 'dye-studio' to 'scavenger' if that's the folder name you used!
        header("Location: games/dye-studio/index.html?id=" . $buildingID);
        exit();
        
    case 3: // High School Department
        header("Location: games/scavenger/index.html?id=" . $buildingID);
        exit();
        
    case 4: // College Department
        header("Location: games/puzzle/index.html?id=" . $buildingID);
        exit();
}

/*
|--------------------------------------------------------------------------
| Fallback UI (Shows if a game folder doesn't exist or isn't linked yet)
|--------------------------------------------------------------------------
*/
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= htmlspecialchars($building["name"]) ?></title>
    <link rel="stylesheet" href="css/styles.css">
    <style>
        body {
            background: #0F172A;
            color: white;
            font-family: Poppins, sans-serif;
        }
        .game-container {
            max-width: 1000px;
            margin: 40px auto;
            background: #1E293B;
            border-radius: 15px;
            padding: 35px;
        }
        .game-image {
            width: 100%;
            height: 350px;
            object-fit: cover;
            border-radius: 12px;
            margin: 25px 0;
        }
        .game-placeholder {
            margin: 30px 0;
            background: #334155;
            border: 3px dashed #60A5FA;
            border-radius: 12px;
            padding: 70px;
            text-align: center;
            font-size: 24px;
            font-weight: 600;
        }
        .button-row {
            display: flex;
            gap: 15px;
            margin-top: 30px;
        }
        .button {
            flex: 1;
            padding: 16px;
            border: none;
            border-radius: 10px;
            cursor: pointer;
            font-size: 16px;
            font-weight: bold;
            text-decoration: none;
            text-align: center;
            color: white;
        }
        .complete {
            background: #10B981;
        }
        .complete:hover {
            background: #059669;
        }
        .back {
            background: #2563EB;
        }
        .back:hover {
            background: #1D4ED8;
        }
        .badge {
            display: inline-block;
            padding: 8px 16px;
            border-radius: 999px;
            margin-top: 10px;
            font-weight: bold;
        }
        .done {
            background: #10B981;
        }
        .notdone {
            background: #DC2626;
        }
    </style>
</head>
<body>
    <div class="game-container">
        <h1><?= htmlspecialchars($building["name"]) ?></h1>

        <?php if ($completed): ?>
            <div class="badge done">Completed</div>
        <?php else: ?>
            <div class="badge notdone">Not Completed</div>
        <?php endif; ?>

        <img class="game-image" src="<?= htmlspecialchars($building["image"]) ?>" alt="<?= htmlspecialchars($building["name"]) ?>">
        <p><?= htmlspecialchars($building["description"]) ?></p>

        <div class="game-placeholder">
            🎮<br>
            Game for <?= htmlspecialchars($building["name"]) ?> is coming soon!<br>
            <small>(Or check that the folder path in the switch statement matches your files)</small>
        </div>

        <div class="button-row">
            <?php if (!$completed): ?>
                <a class="button complete" href="complete.php?id=<?= $buildingID ?>">
                    Complete Game
                </a>
            <?php endif; ?>
            
            <a class="button back" href="map.php">
                Back to Map
            </a>
        </div>
    </div>
</body>
</html>