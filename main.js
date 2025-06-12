// Setting Game Name
let gameName = "Guess The Word";
document.title = gameName;
document.querySelector("h1").innerHTML = gameName;
document.querySelector("footer").innerHTML = `${gameName} Game Created By Abdalrhman`;
// Setting Game Option
let numbersOfTries = 6;
let numbersOfLetters = 6;
let currentTry = 1;
let numberOfHints = 2;

// Manage Words
let wordToGuess = "";
const words = ["Create", "Update", "Delete", "Master", "Branch", "Mainly", "Elzero", "School"];
wordToGuess = words[Math.floor(Math.random() * words.length)].toLowerCase();
let messageArea = document.querySelector(".message");

// Manage Hints
document.querySelector(".hint span").innerHTML = numberOfHints;
const getHintButton = document.querySelector(".hint");
getHintButton.addEventListener("click", getHint);

function generateInput() {
    const inputsContainer = document.querySelector(".inputs");
    // Create Tips
    for (let i = 1 ;i <= numbersOfTries ;i++) {
        const tryDiv = document.createElement("div");
        tryDiv.classList.add(`try-${i}`);
        tryDiv.innerHTML = `<span>Try ${i}</span>`;

        if (i != 1) {
            tryDiv.classList.add("disabled-inputs");
        }
        // Create Inputes
        for (let j = 1 ;j <= numbersOfLetters ;j++) {
            const input = document.createElement("input");
            input.type = "text";
            input.id = `guess-${i}-letter-${j}`;
            input.setAttribute("maxlength","1");
            tryDiv.appendChild(input);
        }
        inputsContainer.appendChild(tryDiv);
    }
    // Disable All Input In First Try Element
    inputsContainer.children[0].children[1].focus();

    // Disable All Input Except First One
    const inputInDisabledDiv = document.querySelectorAll(".disabled-inputs input");
    inputInDisabledDiv.forEach((input) => (input.disabled = true));

    const inputs = document.querySelectorAll("input");
    inputs.forEach((input, index) => {
        // Convert input to UpperCase
        input.addEventListener("input", function(){
            this.value =this.value.toUpperCase();
            const nextInput = inputs[index + 1];
            if (nextInput) nextInput.focus();
        });
        input.addEventListener("keydown", function(){
            const currentIndex = Array.from(inputs).indexOf(event.target);
            if (event.key === "ArrowRight") {
                const nextInput = currentIndex + 1;
                if (nextInput < inputs.length) inputs[nextInput].focus();
            }
            if (event.key === "ArrowLeft") {
                const prevInput = currentIndex - 1;
                if (prevInput >= 0) inputs[prevInput].focus();
            }
        });
    });
    
}

const guessButton = document.querySelector(".check");
guessButton.addEventListener("click", handleGuesses);

function handleGuesses() {
    let successGuess = true;
    console.log(wordToGuess);
    for (let i = 1; i <= numbersOfLetters; i++) {
        const inputField = document.querySelector(`#guess-${currentTry}-letter-${i}`);
        const letter = inputField.value.toLowerCase();
        const actualLetter = wordToGuess[i-1];

        // Game Logic
        if (letter === actualLetter) {
            // Letter Is True And In Place
            inputField.classList.add("yes-in-place"); 
        } else if (wordToGuess.includes(letter) && letter !== "") {
            // Letter Is True And Not In Place
            inputField.classList.add("not-in-place"); 
            successGuess = false;
        } else {
            // Letter Is Wronge
            inputField.classList.add("no"); 
            successGuess = false;
        }
    }
    // Check If User Win Or Lose

    if (successGuess) {

        messageArea.innerHTML = `You Win The Game The Ward Is <span>${wordToGuess}</span>`;
        
        // Add Disable To All Input
        let allTries = document.querySelectorAll(".inputs > div");
        allTries.forEach((tryDiv) => tryDiv.classList.add("disabled-inputs"));

        // Disable Guess Button
        guessButton.disabled = true;

    } else {
        document.querySelector(`.try-${currentTry}`).classList.add("disabled-inputs");
        const currentTryInputs = document.querySelectorAll(`.try-${currentTry} input`);
        currentTryInputs.forEach((input) => (input.disabled = true));

        currentTry++;
        
        const nextTryInputs = document.querySelectorAll(`.try-${currentTry} input`);
        nextTryInputs.forEach((input) => (input.disabled = false));

        let el = document.querySelector(`.try-${currentTry}`);
        if (el) {
            document.querySelector(`.try-${currentTry}`).classList.remove("disabled-inputs");
            el.children[1].focus();
        } else {
            // Disable Guess Button
            guessButton.disabled = true;
            messageArea.innerHTML = `You Lose The Game The Ward Is <span>${wordToGuess}</span>`;
        }
    }
    
}

function getHint() {
    if (numberOfHints > 0) {
        numberOfHints--;
        document.querySelector(".hint span").innerHTML = numberOfHints;
    }
    if (numberOfHints === 0) {
        getHintButton.disabled = true;
    }   
    const enabledInputs = document.querySelectorAll("input:not([disabled])");
    const emptyEnabledInputs = Array.from(enabledInputs).filter((input) => input.value === "");

    if (emptyEnabledInputs.length > 0) {
        const randomIndex = Math.floor(Math.random() * emptyEnabledInputs.length);
        const randomInput = emptyEnabledInputs[randomIndex];
        const indexToFill = Array.from(enabledInputs).indexOf(randomInput);
        if (indexToFill !== -1) {
            randomInput.value = wordToGuess[indexToFill].toUpperCase();
        }
    }
}

function handleBackspace(event) {
    if (event.key === "Backspace") {
        const inputs = document.querySelectorAll("input:not([disabled])");
        const currentIndex = Array.from(inputs).indexOf(document.activeElement);

        if (currentIndex > 0) {
            const currentInputs = inputs[currentIndex];
            const prevInput = inputs[currentIndex - 1];
            currentInputs.value = "";
            prevInput.value = "";
            prevInput.focus();
        }
    }
}

document.addEventListener("keydown" , handleBackspace);

window.onload = function() {
    generateInput();
};