const FRONT = "card_front";
const BACK = "card_back";
const CARD = "card";
const ICON = "icon";

let firstCard = null;
let secondCard = null;

let lockBoard = false;

let matchedPairs = 0;
let moves = 0;
let score = 0;

let seconds = 0;
let timerInterval = null;

let selectedDifficulty = "normal";

let gameStarted = false;


// =====================================================
// ELEMENTOS
// =====================================================

const startScreen =
    document.getElementById("startScreen");

const gameScreen =
    document.getElementById("game");

const gameOver =
    document.getElementById("gameOver");

const gameBoard =
    document.getElementById("gameBoard");

const startButton =
    document.getElementById("startButton");

const restartButton =
    document.getElementById("restart");

const backToMenu =
    document.getElementById("backToMenu");

const playAgain =
    document.getElementById("playAgain");

const returnMenu =
    document.getElementById("returnMenu");


// =====================================================
// DIFICULDADE
// =====================================================

const difficultyButtons =
    document.querySelectorAll(".difficulty");


difficultyButtons.forEach((button) => {

    button.addEventListener("click", () => {

        difficultyButtons.forEach((btn) => {

            btn.classList.remove("active");

        });

        button.classList.add("active");

        selectedDifficulty =
            button.dataset.level;

    });

});


// =====================================================
// INICIAR JOGO
// =====================================================

startButton.addEventListener(
    "click",
    startGame
);


function startGame() {

    gameStarted = true;

    firstCard = null;
    secondCard = null;

    lockBoard = false;

    matchedPairs = 0;
    moves = 0;
    score = 0;

    seconds =
        game.difficulties[
            selectedDifficulty
        ].time;

    game.setDifficulty(
        selectedDifficulty
    );


    startScreen.classList.add("hidden");

    gameOver.classList.add("hidden");

    gameScreen.classList.remove("hidden");


    updateInterface();

    startTimer();

    createBoard();

}


// =====================================================
// CRIAR TABULEIRO
// =====================================================

function createBoard() {

    let cards =
        game.createCards();

    game.shuffleCards(cards);

    gameBoard.innerHTML = "";


    cards.forEach((card) => {

        const cardElement =
            document.createElement("div");


        cardElement.classList.add(CARD);


        cardElement.dataset.icon =
            card.icon;


        cardElement.dataset.id =
            card.id;


        createCardContent(
            card,
            cardElement
        );


        cardElement.addEventListener(
            "click",
            flipCard
        );


        gameBoard.appendChild(
            cardElement
        );

    });


    updateBoardClass();

}


// =====================================================
// CONTEÚDO DA CARTA
// =====================================================

function createCardContent(
    card,
    cardElement
) {

    createCardFace(
        FRONT,
        card,
        cardElement
    );

    createCardFace(
        BACK,
        card,
        cardElement
    );

}


// =====================================================
// FACE DA CARTA
// =====================================================

function createCardFace(
    face,
    card,
    element
) {

    const cardFace =
        document.createElement("div");

    cardFace.classList.add(face);


    if (face === FRONT) {

        const image =
            document.createElement("img");


        image.classList.add(ICON);


        image.src =
            "imagem/" +
            card.icon +
            ".jpg";


        image.alt =
            "Carta misteriosa";


        cardFace.appendChild(
            image
        );

    }

    else {

        cardFace.innerHTML = "☠";

    }


    element.appendChild(
        cardFace
    );

}


// =====================================================
// VIRAR CARTA
// =====================================================

function flipCard() {

    if (
        lockBoard ||
        !gameStarted ||
        this === firstCard ||
        this.classList.contains("matched")
    ) {

        return;

    }


    this.classList.add("flip");


    if (firstCard === null) {

        firstCard = this;

        return;

    }


    secondCard = this;


    moves++;

    updateInterface();


    checkMatch();

}


// =====================================================
// VERIFICAR PAR
// =====================================================

function checkMatch() {

    const isMatch =
        firstCard.dataset.icon ===
        secondCard.dataset.icon;


    if (isMatch) {

        disableCards();

    }

    else {

        unflipCards();

    }

}


// =====================================================
// PAR CORRETO
// =====================================================

function disableCards() {

    firstCard.classList.add("matched");

    secondCard.classList.add("matched");


    firstCard.removeEventListener(
        "click",
        flipCard
    );

    secondCard.removeEventListener(
        "click",
        flipCard
    );


    matchedPairs++;


    score += 100;


    firstCard.classList.add(
        "correct"
    );

    secondCard.classList.add(
        "correct"
    );


    showMessage(
        "VOCÊ ENCONTROU UM PAR..."
    );


    updateInterface();


    resetBoard();


    checkGameOver();

}


// =====================================================
// CARTAS ERRADAS
// =====================================================

function unflipCards() {

    lockBoard = true;


    score = Math.max(
        0,
        score - 10
    );


    showMessage(
        "NÃO É O PAR..."
    );


    setTimeout(() => {

        firstCard.classList.add(
            "wrong"
        );

        secondCard.classList.add(
            "wrong"
        );


    }, 300);


    setTimeout(() => {

        firstCard.classList.remove(
            "flip",
            "wrong"
        );

        secondCard.classList.remove(
            "flip",
            "wrong"
        );


        resetBoard();


    }, 1100);

}


// =====================================================
// RESETAR CARTAS
// =====================================================

function resetBoard() {

    firstCard = null;

    secondCard = null;

    lockBoard = false;

}


// =====================================================
// CRONÔMETRO
// =====================================================

function startTimer() {

    clearInterval(
        timerInterval
    );


    timerInterval =
        setInterval(() => {

            if (!gameStarted) {

                return;

            }


            seconds--;


            updateTimer();


            if (seconds <= 0) {

                clearInterval(
                    timerInterval
                );

                timeOver();

            }


        }, 1000);

}


// =====================================================
// ATUALIZAR CRONÔMETRO
// =====================================================

function updateTimer() {

    const minutes =
        Math.floor(seconds / 60);

    const remainingSeconds =
        seconds % 60;


    const formatted =
        String(minutes).padStart(2, "0") +
        ":" +
        String(
            remainingSeconds
        ).padStart(2, "0");


    document.getElementById(
        "timer"
    ).textContent = formatted;


    if (seconds <= 10) {

        document
            .getElementById("timer")
            .classList.add(
                "danger-timer"
            );

    }

}


// =====================================================
// TEMPO ESGOTADO
// =====================================================

function timeOver() {

    gameStarted = false;

    lockBoard = true;


    showMessage(
        "O TEMPO ACABOU..."
    );


    document.body.classList.add(
        "danger"
    );


    setTimeout(() => {

        document.body.classList.remove(
            "danger"
        );


        showGameOver(
            false
        );

    }, 1500);

}


// =====================================================
// FIM DO JOGO
// =====================================================

function checkGameOver() {

    const totalPairs =
        game.getDifficulty().pairs;


    if (
        matchedPairs === totalPairs
    ) {

        gameStarted = false;

        clearInterval(
            timerInterval
        );


        setTimeout(() => {

            showGameOver(
                true
            );

        }, 1000);

    }

}


// =====================================================
// TELA FINAL
// =====================================================

function showGameOver(
    victory
) {

    gameStarted = false;

    clearInterval(
        timerInterval
    );


    document.getElementById(
        "finalTime"
    ).textContent =
        formatTime(seconds);


    document.getElementById(
        "finalMoves"
    ).textContent =
        moves;


    document.getElementById(
        "finalScore"
    ).textContent =
        score;


    if (victory) {

        document.querySelector(
            ".victory-glitch"
        ).textContent =
            "VOCÊ SOBREVIVEU";

    }

    else {

        document.querySelector(
            ".victory-glitch"
        ).textContent =
            "VOCÊ PERDEU";

    }


    saveBestScore();


    gameScreen.classList.add(
        "hidden"
    );


    gameOver.classList.remove(
        "hidden"
    );

}


// =====================================================
// FORMATAR TEMPO
// =====================================================

function formatTime(
    value
) {

    const minutes =
        Math.floor(value / 60);

    const sec =
        value % 60;


    return (
        String(minutes)
            .padStart(2, "0")
        +
        ":" +
        String(sec)
            .padStart(2, "0")
    );

}


// =====================================================
// INTERFACE
// =====================================================

function updateInterface() {

    document.getElementById(
        "moves"
    ).textContent =
        moves;


    document.getElementById(
        "pairs"
    ).textContent =
        matchedPairs;


    document.getElementById(
        "score"
    ).textContent =
        score;


    document.getElementById(
        "totalPairs"
    ).textContent =
        game.getDifficulty().pairs;


    document.getElementById(
        "levelName"
    ).textContent =
        game.getDifficulty().name;


    updateTimer();

}


// =====================================================
// MENSAGENS DE TERROR
// =====================================================

function showMessage(
    message
) {

    const element =
        document.getElementById(
            "horrorMessage"
        );


    element.textContent =
        message;


    element.classList.remove(
        "message-show"
    );


    void element.offsetWidth;


    element.classList.add(
        "message-show"
    );

}


// =====================================================
// EVENTOS SURPRESA
// =====================================================

function randomHorrorEvent() {

    if (!gameStarted) {

        return;

    }


    const chance =
        Math.random();


    if (chance < 0.20) {

        triggerScreenGlitch();

    }

    else if (chance < 0.35) {

        triggerHeartbeat();

    }

}


// =====================================================
// GLITCH
// =====================================================

function triggerScreenGlitch() {

    document.body.classList.add(
        "glitch"
    );


    showMessage(
        "EU ESTOU VENDO VOCÊ..."
    );


    setTimeout(() => {

        document.body.classList.remove(
            "glitch"
        );

    }, 700);

}


// =====================================================
// BATIMENTO
// =====================================================

function triggerHeartbeat() {

    document.body.classList.add(
        "heartbeat"
    );


    setTimeout(() => {

        document.body.classList.remove(
            "heartbeat"
        );

    }, 1500);

}


// Evento surpresa ocasional
setInterval(() => {

    randomHorrorEvent();

}, 12000);


// =====================================================
// MELHOR PONTUAÇÃO
// =====================================================

function saveBestScore() {

    const key =
        "memoryHorrorBestScore_" +
        selectedDifficulty;


    const oldScore =
        Number(
            localStorage.getItem(key)
        ) || 0;


    const text =
        document.getElementById(
            "bestScoreText"
        );


    if (score > oldScore) {

        localStorage.setItem(
            key,
            score
        );


        text.textContent =
            "🏆 NOVO RECORDE!";

    }

    else {

        text.textContent =
            "Melhor pontuação: " +
            oldScore;

    }

}


// =====================================================
// RECOMEÇAR
// =====================================================

restartButton.addEventListener(
    "click",
    () => {

        startGame();

    }
);


// =====================================================
// JOGAR NOVAMENTE
// =====================================================

playAgain.addEventListener(
    "click",
    () => {

        gameOver.classList.add(
            "hidden"
        );

        gameScreen.classList.remove(
            "hidden"
        );

        startGame();

    }
);


// =====================================================
// VOLTAR AO MENU
// =====================================================

function returnToMenu() {

    clearInterval(
        timerInterval
    );


    gameStarted = false;


    gameScreen.classList.add(
        "hidden"
    );


    gameOver.classList.add(
        "hidden"
    );


    startScreen.classList.remove(
        "hidden"
    );

}


backToMenu.addEventListener(
    "click",
    returnToMenu
);


returnMenu.addEventListener(
    "click",
    returnToMenu
);


// =====================================================
// CLASSES DO TABULEIRO
// =====================================================

function updateBoardClass() {

    gameBoard.className = "";


    if (
        selectedDifficulty === "easy"
    ) {

        gameBoard.classList.add(
            "easy-board"
        );

    }


    if (
        selectedDifficulty === "normal"
    ) {

        gameBoard.classList.add(
            "normal-board"
        );

    }


    if (
        selectedDifficulty === "nightmare"
    ) {

        gameBoard.classList.add(
            "nightmare-board"
        );

    }

}