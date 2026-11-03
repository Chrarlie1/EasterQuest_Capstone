<?php

session_start();

require_once "db.php";

/*
|--------------------------------------------------------------------------
| Already Logged In
|--------------------------------------------------------------------------
*/

if (isset($_SESSION["user_id"])) {

    header("Location: map.php");

    exit();
}

$error = "";

/*
|--------------------------------------------------------------------------
| Success Message
|--------------------------------------------------------------------------
*/

$success = "";

if (isset($_SESSION["success"])) {

    $success = $_SESSION["success"];

    unset($_SESSION["success"]);
}

/*
|--------------------------------------------------------------------------
| Login
|--------------------------------------------------------------------------
*/

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    $username = trim($_POST["username"] ?? "");

    $password = $_POST["password"] ?? "";

    if ($username == "" || $password == "") {

        $error = "Please enter your username and password.";
    } else {

        $stmt = $db->prepare("

            SELECT *

            FROM users

            WHERE username = ?

            LIMIT 1

        ");

        $stmt->execute([$username]);

        $user = $stmt->fetch();

        if (!$user) {

            $error = "Invalid username or password.";
        } elseif (!password_verify($password, $user["password"])) {

            $error = "Invalid username or password.";
        } else {

            session_regenerate_id(true);

            $_SESSION["user_id"] = $user["id"];

            $_SESSION["username"] = $user["username"];

            header("Location: index.php");

            exit();
        }
    }
}

?>

<!DOCTYPE html>

<html lang="en">

<head>

    <meta charset="UTF-8">

    <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0">

    <title>EasterQuest Login</title>

    <link
        rel="stylesheet"
        href="css/login.css">

</head>

<body>

    <div class="login-container">

        <div class="login-card">

            <h1>EasterQuest</h1>

            <p>Easter Colleges</p>

            <?php if ($success): ?>

                <div class="success">

                    <?= htmlspecialchars($success) ?>

                </div>

            <?php endif; ?>

            <?php if ($error): ?>

                <div class="error">

                    <?= htmlspecialchars($error) ?>

                </div>

            <?php endif; ?>

            <form method="POST">

                <label>

                    Username

                </label>

                <input

                    type="text"

                    name="username"

                    autocomplete="username"

                    required>

                <label>

                    Password

                </label>

                <input

                    type="password"

                    name="password"

                    autocomplete="current-password"

                    required>

                <button
                    type="submit">

                    Login

                </button>

            </form>

            <div class="footer">

                Don't have an account?

                <a href="register.php">

                    Register

                </a>

            </div>

        </div>

    </div>

</body>

</html>