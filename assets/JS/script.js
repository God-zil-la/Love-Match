document.addEventListener("DOMContentLoaded", function() {
    let buttons = document.getElementsByTagName("button");

    for (let button of buttons) {
        button.addEventListener("click", function() {
            if (this.getAttribute("data-type") === "submit") {
                checkAnswer();
            } else {
                let gameType = this.getAttribute("data-type");
                runGame(gameType);
            }
        });
    }

    document.getElementById("answer-box").addEventListener("keydown", function(event) {
        if (event.key === "Enter") {
            checkAnswer();
        }
    });

    // Start on addition by default
    runGame("addition");
});

/**
 * The main game "loop", called when the script is first loaded
 * and after the user's answer has been processed.
 */
function runGame(gameType) {

    // Clear the answer box and focus
    let answerBox = document.getElementById("answer-box");
    answerBox.value = "";
    answerBox.focus();

    let operand1, operand2;

    // Generate operand1 and operand2 based on the gameType
    if (gameType === "division") {
        /**
         * For division, we must ensure it's always a whole number (no remainder).
         * One approach: pick a random divisor (operand2), then pick a random
         * quotient, and multiply them to get operand1.
         */
        operand2 = Math.floor(Math.random() * 12) + 1;  // 1..12
        let quotient = Math.floor(Math.random() * 12) + 1; // 1..12
        operand1 = operand2 * quotient; // Ensures operand1 ÷ operand2 is an integer
        
        // The higher number goes first; in this logic, operand1 is guaranteed >= operand2.
        displayDivisionQuestion(operand1, operand2);

    } else {
        // For addition, subtraction, multiplication: pick random 1..25
        operand1 = Math.floor(Math.random() * 25) + 1;
        operand2 = Math.floor(Math.random() * 25) + 1;

        // Ensure the higher number appears first for all operations
        if (operand1 < operand2) {
            [operand1, operand2] = [operand2, operand1];
        }

        if (gameType === "addition") {
            displayAdditionQuestion(operand1, operand2);
        } else if (gameType === "subtract") {
            displaySubtractQuestion(operand1, operand2);
        } else if (gameType === "multiply") {
            displayMultiplyQuestion(operand1, operand2);
        } else {
            alert(`Unknown game type: ${gameType}`);
            throw `Unknown game type: ${gameType}. Aborting!`;
        }
    }
}

/**
 * Checks the answer against the first element in
 * the returned calculateCorrectAnswer array.
 */
function checkAnswer() {
    let userAnswer = parseFloat(document.getElementById("answer-box").value);
    let calculatedAnswer = calculateCorrectAnswer();
    let isCorrect = userAnswer === calculatedAnswer[0];

    if (isCorrect) {
        alert("Hey! You got it right! :D");
        incrementScore();
    } else {
        alert(`Awwww... You answered ${userAnswer}. The correct answer was ${calculatedAnswer[0]}!`);
        incrementWrongAnswer();
    }

    runGame(calculatedAnswer[1]);
}

/**
 * Gets the operands (the numbers) and the operator (plus, minus, etc)
 * directly from the DOM and returns the correct answer along with the game type.
 */
function calculateCorrectAnswer() {
    let operand1 = parseFloat(document.getElementById("operand1").innerText);
    let operand2 = parseFloat(document.getElementById("operand2").innerText);
    let operator = document.getElementById("operator").innerText;

    if (operator === "+") {
        return [operand1 + operand2, "addition"];
    } else if (operator === "-") {
        return [operand1 - operand2, "subtract"];
    } else if (operator === "x") {
        return [operand1 * operand2, "multiply"];
    } else if (operator === "÷") {
        // We already ensured it's a whole number in runGame, so no decimal remainder expected
        return [operand1 / operand2, "division"];
    } else {
        alert(`Unimplemented operator: ${operator}`);
        throw `Unimplemented operator: ${operator}. Aborting!`;
    }
}

/** 
 * Get the current score from the DOM and increment by 1.
 */
function incrementScore() {
    let oldScore = parseInt(document.getElementById("score").innerText);
    document.getElementById("score").innerText = ++oldScore;
}

/** 
 * Get the current tally of incorrect answers from the DOM and increment by 1.
 */
function incrementWrongAnswer() {
    let oldScore = parseInt(document.getElementById("incorrect").innerText);
    document.getElementById("incorrect").innerText = ++oldScore;
}

// ----- Functions to display each question type -----
function displayAdditionQuestion(operand1, operand2) {
    document.getElementById("operand1").textContent = operand1;
    document.getElementById("operator").textContent = "+";
    document.getElementById("operand2").textContent = operand2;
}

function displaySubtractQuestion(operand1, operand2) {
    // After swapping, operand1 is always >= operand2, so result won't be negative
    document.getElementById("operand1").textContent = operand1;
    document.getElementById("operator").textContent = "-";
    document.getElementById("operand2").textContent = operand2;
}

function displayMultiplyQuestion(operand1, operand2) {
    document.getElementById("operand1").textContent = operand1;
    document.getElementById("operator").textContent = "x";
    document.getElementById("operand2").textContent = operand2;
}

function displayDivisionQuestion(operand1, operand2) {
    // operand1 >= operand2 by design, so it always shows the bigger number first
    document.getElementById("operand1").textContent = operand1;
    document.getElementById("operator").textContent = "÷";
    document.getElementById("operand2").textContent = operand2;
}
