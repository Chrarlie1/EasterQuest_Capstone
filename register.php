<?php

session_start();

require_once "db.php";

$error = "";
$success = "";

if ($_SERVER["REQUEST_METHOD"] === "POST") {

    $username = trim($_POST["username"] ?? "");
    $password = $_POST["password"] ?? "";
    $confirmPassword = $_POST["confirm_password"] ?? "";

    /* -----------------------------
       Validation
    ------------------------------ */

    if ($username === "" || $password === "" || $confirmPassword === "") {

        $error = "Please fill in all fields.";

    }

    elseif (strlen($username) < 4) {

        $error = "Username must be at least 4 characters.";

    }

    elseif (strlen($password) < 6) {

        $error = "Password must be at least 6 characters.";

    }

    elseif ($password !== $confirmPassword) {

        $error = "Passwords do not match.";

    }

    else {

        /* -----------------------------
           Check Username
        ------------------------------ */

        $stmt = $db->prepare("

            SELECT id

            FROM users

            WHERE username = ?

            LIMIT 1

        ");

        $stmt->execute([$username]);

        if ($stmt->fetch()) {

            $error = "Username already exists.";

        }

        else {

            /* -----------------------------
               Create User
            ------------------------------ */

            $hash = password_hash(

                $password,

                PASSWORD_DEFAULT

            );

            $insert = $db->prepare("

                INSERT INTO users

                (username,password)

                VALUES

                (?,?)

            ");

            $insert->execute([

                $username,

                $hash

            ]);

            $userID = $db->lastInsertId();

            /* -----------------------------
               Create Progress
            ------------------------------ */

            $buildings = $db->query("

                SELECT id

                FROM buildings

            ");

            $progress = $db->prepare("

                INSERT INTO progress

                (user_id,building_id,completed)

                VALUES

                (?,?,0)

            ");

            foreach ($buildings as $building) {

                $progress->execute([

                    $userID,

                    $building["id"]

                ]);

            }

            $_SESSION["success"] =
                "Registration successful. Please login.";

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

<title>Register</title>

<link
rel="stylesheet"
href="css/login.css">

</head>

<body>

<div class="login-container">

    <div class="login-card">

        <h1>Campus Explorer</h1>

        <p>Create your account</p>

        <?php if($error): ?>

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

                required

                autocomplete="username"

            >

            <label>

                Password

            </label>

            <input

                type="password"

                name="password"

                required

                autocomplete="new-password"

            >

            <label>

                Confirm Password

            </label>

            <input

                type="password"

                name="confirm_password"

                required

                autocomplete="new-password"

            >

            <button
                type="submit">

                Register

            </button>

        </form>

        <div class="footer">

            Already have an account?

            <a href="index.php">

                Login

            </a>

        </div>

    </div>

</div>

</body>

</html>