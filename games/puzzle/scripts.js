/*==========================================================
    COLLEGE DEPARTMENT PUZZLE
==========================================================*/

let currentRound = 0;

let timer = 0;

let timerInterval = null;

let piecesPlaced = 0;

let totalPieces = 0;

let game;

/*==========================================================
    ROUNDS
==========================================================*/

const rounds = [

    {

        title: "History",

        image: "assets/round1.jpg",

        grid: 3,

        description:

            "Discover the beginnings of the College Department.",

        history:

            "The College Department has provided higher education for many years while maintaining its commitment to academic excellence.",

        academic:

            "It prepares students through classroom learning, practical activities, and community engagement.",

        fun:

            "The department continues to adapt to modern educational technologies while preserving its traditions."

    },

    {

        title: "Academic Programs",

        image: "assets/round2.jpg",

        grid: 4,

        description:

            "Learn about the academic programs offered.",

        history:

            "Programs are regularly updated to meet current industry standards.",

        academic:

            "Students gain knowledge, technical skills, and leadership abilities.",

        fun:

            "Many graduates continue to become successful professionals."

    },

    {

        title: "Campus Life",

        image: "assets/round3.jpg",

        grid: 5,

        description:

            "Experience student life at the College Department.",

        history:

            "Campus activities encourage holistic development.",

        academic:

            "Students participate in organizations, outreach, and competitions.",

        fun:

            "Campus traditions help strengthen the college community."

    }

];

/*==========================================================
    BUTTONS
==========================================================*/

document
    .getElementById("startButton")
    .addEventListener("click", startGame);

document
    .getElementById("nextButton")
    .addEventListener("click", nextRound);

document
    .getElementById("completeButton")
    .addEventListener("click", completeGame);

/*==========================================================
    START GAME
==========================================================*/

function startGame() {

    document
        .getElementById("loadingScreen")
        .style.display = "none";

    document
        .getElementById("hud")
        .style.display = "flex";

    document
        .getElementById("progressContainer")
        .style.display = "block";

    timer = 0;

    startTimer();

    loadRound();

}

/*==========================================================
    LOAD ROUND
==========================================================*/

function loadRound() {

    const round = rounds[currentRound];

    document.getElementById("roundText").innerHTML =
        `Round ${currentRound + 1} / ${rounds.length}`;

    piecesPlaced = 0;

    totalPieces = round.grid * round.grid;

    updatePieces();

    updateProgress();

    createPuzzle(round);

}

/*==========================================================
    TIMER
==========================================================*/

function startTimer() {

    if (timerInterval) {

        clearInterval(timerInterval);

    }

    timerInterval = setInterval(function () {

        timer++;

        let minutes = Math.floor(timer / 60);

        let seconds = timer % 60;

        minutes = String(minutes).padStart(2, "0");

        seconds = String(seconds).padStart(2, "0");

        document
            .getElementById("timer")
            .innerHTML = `${minutes}:${seconds}`;

    }, 1000);

}

/*==========================================================
    PIECES
==========================================================*/

function updatePieces() {

    document
        .getElementById("pieces")
        .innerHTML =
        `${piecesPlaced} / ${totalPieces}`;

}

/*==========================================================
    PROGRESS BAR
==========================================================*/

function updateProgress() {

    const percent =
        (currentRound / rounds.length) * 100;

    document
        .getElementById("progressBar")
        .style.width = percent + "%";

}

/*==========================================================
    ROUND COMPLETED
==========================================================*/

function roundCompleted() {

    const round = rounds[currentRound];

    document
        .getElementById("factTitle")
        .innerHTML = round.title;

    document
        .getElementById("factDescription")
        .innerHTML = round.description;

    document
        .getElementById("historyText")
        .innerHTML = round.history;

    document
        .getElementById("academicText")
        .innerHTML = round.academic;

    document
        .getElementById("funFact")
        .innerHTML = round.fun;

    document
        .getElementById("factPhoto")
        .src = round.image;

    document
        .getElementById("factPanel")
        .style.display = "flex";

}

/*==========================================================
    NEXT ROUND
==========================================================*/

function nextRound() {

    document
        .getElementById("factPanel")
        .style.display = "none";

    currentRound++;

    if (currentRound >= rounds.length) {

        victory();

        return;

    }

    loadRound();

}

/*==========================================================
    VICTORY
==========================================================*/

function victory() {

    clearInterval(timerInterval);

    document
        .getElementById("victoryScreen")
        .style.display = "flex";

    document
        .getElementById("progressBar")
        .style.width = "100%";

}

/*==========================================================
    COMPLETE GAME
==========================================================*/

function completeGame() {
    // Read the ID from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const buildingId = urlParams.get('id') || 4; // Fallback to 4 just in case
    
    // Redirect with the correct ID
    window.location.href = `../../complete.php?id=${buildingId}`;
}

/*==========================================================
    CREATE PHASER GAME
==========================================================*/

function createPuzzle(round) {

    if (game) {

        game.destroy(true);

    }

    document
        .getElementById("gameContainer")
        .innerHTML = "";

    const config = {

        type: Phaser.AUTO,

        parent: "gameContainer",

        backgroundColor: "#F4F7F2",

        scale: {

            mode: Phaser.Scale.RESIZE,

            parent: "gameContainer",

            width: "100%",

            height: "100%",

            autoCenter: Phaser.Scale.CENTER_BOTH

        },

        scene: {

            preload: function () {

                this.load.image(

                    "image",

                    round.image

                );

            },

            create: function () {

                const scene = this;

                const image = scene.textures
                    .get("image")
                    .getSourceImage();

                const rows = round.grid;

                const cols = round.grid;

                let correctPieces = 0;

                const pieces = [];

                const graphics = scene.add.graphics();

                const board = scene.add.rectangle(

                    0,

                    0,

                    10,

                    10,

                    0xffffff

                )

                    .setStrokeStyle(4, 0x1B5E20)

                    .setDepth(-2);


                function resizeGame() {

                    const leftArea =
                        scene.scale.width * 0.20;

                    const rightArea =
                        scene.scale.width * 0.20;

                    const topMargin =
                        scene.scale.height * 0.05;

                    const bottomMargin =
                        scene.scale.height * 0.05;

                    const boardWidth =
                        scene.scale.width -
                        leftArea -
                        rightArea;

                    const boardHeight =
                        scene.scale.height -
                        topMargin -
                        bottomMargin;

                    const boardX =
                        leftArea;

                    const boardY =
                        (scene.scale.height - boardHeight) / 2;

                    const displayPieceWidth =
                        boardWidth / cols;

                    const displayPieceHeight =
                        boardHeight / rows;

                    board
                        .setPosition(

                            boardX + boardWidth / 2,

                            boardY + boardHeight / 2

                        )

                        .setSize(

                            boardWidth + 20,

                            boardHeight + 20

                        );

                    graphics.clear();

                    graphics.lineStyle(

                        2,

                        0xcccccc

                    );

                    for (let r = 0; r <= rows; r++) {

                        graphics.moveTo(

                            boardX,

                            boardY + r * displayPieceHeight

                        );

                        graphics.lineTo(

                            boardX + boardWidth,

                            boardY + r * displayPieceHeight

                        );

                    }

                    for (let c = 0; c <= cols; c++) {

                        graphics.moveTo(

                            boardX + c * displayPieceWidth,

                            boardY

                        );

                        graphics.lineTo(

                            boardX + c * displayPieceWidth,

                            boardY + boardHeight

                        );

                    }

                    graphics.strokePath();

                    pieces.forEach(function (piece) {

                        piece.setDisplaySize(

                            displayPieceWidth,

                            displayPieceHeight

                        );

                        piece.correctX =

                            boardX +

                            piece.col * displayPieceWidth +

                            displayPieceWidth / 2;

                        piece.correctY =

                            boardY +

                            piece.row * displayPieceHeight +

                            displayPieceHeight / 2;

                        if (piece.locked) {

                            piece.x = piece.correctX;

                            piece.y = piece.correctY;

                        }

                    });

                }
                /*
                ----------------------------------------
                Create Puzzle Pieces
                ----------------------------------------
                */

                for (let row = 0; row < rows; row++) {

                    for (let col = 0; col < cols; col++) {

                        const pieceWidth =
                            image.width / cols;

                        const pieceHeight =
                            image.height / rows;

                        const rt = scene.make.renderTexture({

                            width: pieceWidth,

                            height: pieceHeight,

                            add: false

                        });

                        rt.drawFrame(

                            "image",

                            undefined,

                            -col * pieceWidth,

                            -row * pieceHeight

                        );

                        const textureKey =
                            `piece_${row}_${col}`;

                        rt.saveTexture(textureKey);

                        rt.destroy();

                        const piece = scene.add.image(

                            0,

                            0,

                            textureKey

                        );

                        piece.row = row;

                        piece.col = col;

                        piece.locked = false;

                        piece.setInteractive();

                        piece.setDepth(1);

                        piece.setTint(0xffffff);

                        pieces.push(piece);

                        piece.on(

                            "pointerover",

                            function () {

                                if (piece.locked) return;


                            }

                        );

                        piece.on(

                            "pointerout",

                            function () {

                                if (piece.locked) return;


                            }

                        );

                        piece.on(

                            "pointerdown",

                            function () {

                                if (piece.locked) return;

                                scene.children.bringToTop(piece);


                            }

                        );

                        scene.input.setDraggable(piece);

                    }

                }

                resizeGame();

                /*
                ----------------------------------------
                Initial Piece Positions
                ----------------------------------------
                */

                pieces.forEach(function (piece) {

                    const spawnMinX =
                        scene.scale.width * 0.80;

                    const spawnMaxX =
                        scene.scale.width -
                        piece.displayWidth / 2 -
                        20;

                    const spawnMinY =
                        piece.displayHeight / 2 +
                        20;

                    const spawnMaxY =
                        scene.scale.height -
                        piece.displayHeight / 2 -
                        20;

                    piece.x = Phaser.Math.Between(

                        Math.floor(spawnMinX),

                        Math.floor(spawnMaxX)

                    );

                    piece.y = Phaser.Math.Between(

                        Math.floor(spawnMinY),

                        Math.floor(spawnMaxY)

                    );

                });

                /*
                ----------------------------------------
                Dragging
                ----------------------------------------
                */
                scene.input.on(

                    "drag",

                    function (

                        pointer,

                        obj,

                        dragX,

                        dragY

                    ) {

                        if (obj.locked) return;

                        obj.x = dragX;

                        obj.y = dragY;

                    }

                );

                /*
                ----------------------------------------
                Drop
                ----------------------------------------
                */

                scene.input.on(

                    "dragend",

                    function (

                        pointer,

                        obj

                    ) {

                        if (obj.locked) return;


                        const distance =
                            Phaser.Math.Distance.Between(

                                obj.x,

                                obj.y,

                                obj.correctX,

                                obj.correctY

                            );

                        if (distance < 25) {

                            scene.tweens.add({

                                targets: obj,

                                x: obj.correctX,

                                y: obj.correctY,

                                duration: 120,

                                ease: "Back.Out"

                            });

                            obj.locked = true;

                            obj.setTint(0xffffff);

                            scene.tweens.add({

                                targets: obj,

                                scale: 1,

                                duration: 150,

                                yoyo: true

                            });

                            correctPieces++;

                            piecesPlaced++;

                            updatePieces();

                            if (correctPieces === rows * cols) {

                                scene.cameras.main.flash(

                                    350,

                                    255,

                                    255,

                                    255

                                );

                                scene.cameras.main.shake(

                                    250,

                                    0.004

                                );

                                setTimeout(function () {

                                    scene.tweens.add({

                                        targets: graphics,

                                        alpha: 0,

                                        duration: 500

                                    });

                                    roundCompleted();

                                }, 600);

                            }

                        }

                    }

                );

            }

        }

    };
    game = new Phaser.Game(config);
}




