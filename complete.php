<?php

require_once "auth.php";

/*
|--------------------------------------------------------------------------
| Validate Building ID
|--------------------------------------------------------------------------
*/

if (!isset($_GET["id"]) || !is_numeric($_GET["id"])) {

    header("Location: map.php");
    exit();

}

$buildingID = (int)$_GET["id"];

/*
|--------------------------------------------------------------------------
| Verify Building Exists
|--------------------------------------------------------------------------
*/

$stmt = $db->prepare("

SELECT id

FROM buildings

WHERE id = ?

LIMIT 1

");

$stmt->execute([$buildingID]);

$building = $stmt->fetch();

if (!$building) {

    header("Location: map.php");
    exit();

}

/*
|--------------------------------------------------------------------------
| Update Progress
|--------------------------------------------------------------------------
*/

$stmt = $db->prepare("

UPDATE progress

SET completed = 1

WHERE

user_id = ?

AND

building_id = ?

");

$stmt->execute([

    $userID,

    $buildingID

]);

/*
|--------------------------------------------------------------------------
| Redirect Back
|--------------------------------------------------------------------------
*/

header("Location: map.php");

exit();

?>