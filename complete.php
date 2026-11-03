<<<<<<< HEAD
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
$stmt = $db->prepare("SELECT id FROM buildings WHERE id = ? LIMIT 1");
$stmt->execute([$buildingID]);

if (!$stmt->fetch()) {
    header("Location: map.php");
    exit();
}

/*
|--------------------------------------------------------------------------
| Update Progress (Simple UPDATE)
|--------------------------------------------------------------------------
| This works perfectly because setup.php and register.php already 
| guarantee that a row exists for this user and building!
*/
$stmt = $db->prepare("
    UPDATE progress 
    SET completed = 1 
    WHERE user_id = ? AND building_id = ?
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
=======
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
$stmt = $db->prepare("SELECT id FROM buildings WHERE id = ? LIMIT 1");
$stmt->execute([$buildingID]);

if (!$stmt->fetch()) {
    header("Location: map.php");
    exit();
}

/*
|--------------------------------------------------------------------------
| Update Progress (Simple UPDATE)
|--------------------------------------------------------------------------
| This works perfectly because setup.php and register.php already 
| guarantee that a row exists for this user and building!
*/
$stmt = $db->prepare("
    UPDATE progress 
    SET completed = 1 
    WHERE user_id = ? AND building_id = ?
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
>>>>>>> 5581938dcc141165df5e6d89e63c0861f988a78c
?>