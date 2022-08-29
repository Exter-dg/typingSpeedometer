const textBox = document.querySelector('#userTextBox');
const startButton = document.querySelector('#start');
const testText = document.querySelector('#testText');
const result = document.querySelector('#speed');
const modal = document.querySelector('#modal')
const btnReset = document.querySelector('#reset')

const textArray = [
    "That was what I wanted, but I don't need it to be gone. I can love you and I can love life and bear the pain all at the same time. I think the pain might even make the rest better, the way a good setting can make a diamond look better.",
    "Was it all put into words, or did both understand that they had the same thing at heart and in their minds, so that there was no need to speak of it aloud, and better not to speak of it?",
    "You never should settle for the lifetime that is handed to you. There's always a line to be cut and someone to barrel through. And if you should find that you're about to get the short of the stick, take what you want, return what you get.",
    "There will come a time when all of us are dead."
];

var startTime = 0;
var testTextGiven = '';

function calculateWords(string) {
    return string.split(' ').length;
}

function calculateWPM(string) {
    const noOfWords = calculateWords(string);
    const noOfSec = (performance.now() - startTime) / (1000);
    return noOfWords / noOfSec * 60;
}

function checkText(string) {
    return testTextGiven.startsWith(string);
}

function checkIfComplete(string) {
    return string === testTextGiven;
}

function findFirstDiffPos(a, b) {
    if (a.length < b.length) [a, b] = [b, a];
    return [...a].findIndex((chr, i) => chr !== b[i]);
}

function resetPage() {
    textBox.value = '';
    testText.textContent = 'Click Start to start the test.';
    result.textContent = 'Words per minute(WPM):';
    textBox.disabled = true;
}

function toggleModal() {
    modal.classList.toggle('visible')
    modal.classList.toggle('hidden')
}

function openModal(message) {
    modal.textContent = message;
    toggleModal()
    setTimeout(toggleModal, 5000)
}

startButton.addEventListener('click', () => {
    testTextGiven = textArray[Math.floor(Math.random() * textArray.length)];
    testText.textContent = testTextGiven;

    startTime = performance.now();
    textBox.value = '';
    textBox.disabled = false;
    textBox.focus();
    result.textContent = 'Words per minute(WPM):';
});

textBox.addEventListener('input', (event) => {
    const isComplete = checkIfComplete(event.target.value);
    if (isComplete) {
        openModal(`Congratulations, your WPM is ${calculateWPM(event.target.value).toFixed(0)}`)
        resetPage();
        return;
    }

    const isTextCorrect = checkText(event.target.value);
    if (isTextCorrect) {
        result.textContent = `Words per minute(WPM): ${calculateWPM(event.target.value).toFixed(0)}`;
        testText.textContent = testTextGiven;
    } else {
        const diffPosStart = findFirstDiffPos(testTextGiven, event.target.value);
        const diffPosEnd = event.target.value.length - 1;
        testText.innerHTML = testTextGiven.substring(0, diffPosStart) +
            '<mark>' + testTextGiven.substring(diffPosStart, diffPosEnd + 1) + '</mark>' +
            testTextGiven.substring(diffPosEnd + 1);
    }
});

textBox.addEventListener('paste', (event) => {
    openModal('Nah! That won\'t work.')
    resetPage();
})


btnReset.addEventListener('click', resetPage)