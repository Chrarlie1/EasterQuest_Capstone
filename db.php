<?php

/*
|--------------------------------------------------------------------------
| Campus Explorer Database Connection
|--------------------------------------------------------------------------
|
| This file creates a reusable PDO connection to the SQLite database.
|
| Usage:
|
| require_once 'db.php';
|
*/

$dbPath = __DIR__ . "/database/campus.db";

/*
|--------------------------------------------------------------------------
| Check if Database Exists
|--------------------------------------------------------------------------
*/

if (!file_exists($dbPath)) {

    die("
        <h2>Database not found.</h2>

        <p>Please run <strong>setup.php</strong> first.</p>
    ");
}

/*
|--------------------------------------------------------------------------
| Connect
|--------------------------------------------------------------------------
*/

try {

    $db = new PDO("sqlite:" . $dbPath);

    $db->setAttribute(
        PDO::ATTR_ERRMODE,
        PDO::ERRMODE_EXCEPTION
    );

    $db->setAttribute(
        PDO::ATTR_DEFAULT_FETCH_MODE,
        PDO::FETCH_ASSOC
    );

    $db->setAttribute(
        PDO::ATTR_EMULATE_PREPARES,
        false
    );
} catch (PDOException $e) {

    die("
        <h2>Database Connection Failed</h2>

        <p>{$e->getMessage()}</p>
    ");
}
