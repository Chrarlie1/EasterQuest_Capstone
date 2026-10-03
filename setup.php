<?php

/*
|--------------------------------------------------------------------------
| Campus Explorer Database Setup
|--------------------------------------------------------------------------
|
| Run this file ONCE.
|
| It creates:
|
| database/campus.db
|
| Tables:
|   users
|   buildings
|   progress
|
| Demo Login
|
| username: admin
| password: password123
|
*/

$dbFolder = __DIR__ . "/database";

if (!is_dir($dbFolder)) {
    mkdir($dbFolder, 0777, true);
}

$dbFile = $dbFolder . "/campus.db";

$db = new PDO("sqlite:" . $dbFile);

$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);


/*
|--------------------------------------------------------------------------
| USERS
|--------------------------------------------------------------------------
*/

$db->exec("

CREATE TABLE IF NOT EXISTS users (

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    username TEXT UNIQUE NOT NULL,

    password TEXT NOT NULL,

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP

);

");


/*
|--------------------------------------------------------------------------
| BUILDINGS
|--------------------------------------------------------------------------
*/

$db->exec("

CREATE TABLE IF NOT EXISTS buildings (

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    name TEXT NOT NULL,

    description TEXT NOT NULL,

    image TEXT NOT NULL

);

");


/*
|--------------------------------------------------------------------------
| PROGRESS
|--------------------------------------------------------------------------
*/

$db->exec("

CREATE TABLE IF NOT EXISTS progress (

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    user_id INTEGER NOT NULL,

    building_id INTEGER NOT NULL,

    completed INTEGER DEFAULT 0,

    completed_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    UNIQUE(user_id, building_id),

    FOREIGN KEY(user_id) REFERENCES users(id),

    FOREIGN KEY(building_id) REFERENCES buildings(id)

);

");


/*
|--------------------------------------------------------------------------
| Demo User
|--------------------------------------------------------------------------
*/

$check = $db->prepare("

SELECT COUNT(*)

FROM users

WHERE username = ?

");

$check->execute(["admin"]);

if ($check->fetchColumn() == 0) {

    $password = password_hash("password123", PASSWORD_DEFAULT);

    $insert = $db->prepare("

    INSERT INTO users

    (username,password)

    VALUES(?,?)

    ");

    $insert->execute([

        "admin",

        $password

    ]);
}


/*
|--------------------------------------------------------------------------
| Buildings
|--------------------------------------------------------------------------
*/

$count = $db->query("SELECT COUNT(*) FROM buildings")->fetchColumn();

if ($count == 0) {

    $buildings = [

        [

            "Elementary Department",

            "The Elementary Department provides foundational education for young learners.",

            "images/elementary.jpg"

        ],

        [

            "Department of Hospitality",

            "The Department of Hospitality prepares students for careers in tourism and hospitality.",

            "images/hospitality.jpg"

        ],

        [

            "High School Department",

            "The High School Department promotes academic excellence and leadership.",

            "images/highschool.jpg"

        ],

        [

            "College Department",

            "The College Department offers degree programs and professional education.",

            "images/college.jpg"

        ]

    ];

    $insert = $db->prepare("

    INSERT INTO buildings

    (name,description,image)

    VALUES

    (?,?,?)

    ");

    foreach ($buildings as $building) {

        $insert->execute($building);
    }
}


/*
|--------------------------------------------------------------------------
| Create Progress for Demo User
|--------------------------------------------------------------------------
*/

$userID = $db->query("

SELECT id

FROM users

WHERE username='admin'

")->fetchColumn();

$totalBuildings = $db->query("

SELECT id

FROM buildings

");

foreach ($totalBuildings as $building) {

    $check = $db->prepare("

    SELECT COUNT(*)

    FROM progress

    WHERE

    user_id=?

    AND

    building_id=?

    ");

    $check->execute([

        $userID,

        $building["id"]

    ]);

    if ($check->fetchColumn() == 0) {

        $insert = $db->prepare("

        INSERT INTO progress

        (user_id,building_id,completed)

        VALUES

        (?,?,0)

        ");

        $insert->execute([

            $userID,

            $building["id"]

        ]);
    }
}

?>

<!DOCTYPE html>

<html>

<head>

    <meta charset="UTF-8">

    <title>Campus Explorer Setup</title>

    <style>
        body {

            font-family: Arial;

            background: #1F2937;

            color: white;

            display: flex;

            justify-content: center;

            align-items: center;

            height: 100vh;

        }

        .card {

            background: #374151;

            padding: 40px;

            border-radius: 15px;

            width: 500px;

        }

        h1 {

            margin-top: 0;

        }

        .success {

            color: #22C55E;

            font-weight: bold;

        }

        code {

            background: #111827;

            padding: 4px 8px;

            border-radius: 5px;

        }
    </style>

</head>

<body>

    <div class="card">

        <h1>Campus Explorer</h1>

        <p class="success">

            ✔ Database successfully created.

        </p>

        <hr>

        <h2>Demo Login</h2>

        <p>

            Username:

            <code>admin</code>

        </p>

        <p>

            Password:

            <code>password123</code>

        </p>

        <hr>

        <p>

            Next step:

            Create

            <strong>db.php</strong>

        </p>

    </div>

</body>

</html>