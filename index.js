const textBox = document.querySelector('#userTextBox');
const startButton = document.querySelector('#start');
const testText = document.querySelector('#testText');
const result = document.querySelector('#speed');

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
    return noOfWords/noOfSec * 60;
}

function checkText(string) {
    return testTextGiven.startsWith(string);
}

startButton.addEventListener('click', () => {
    startTime = performance.now();
    testTextGiven = textArray[Math.floor(Math.random()*textArray.length)];
    testText.textContent = testTextGiven;
    textBox.value = '';
    textBox.focus();
    result.textContent = 'Words Per Min:';
});

textBox.addEventListener('input', (event) => {

  const isTextCorrect = checkText(event.target.value);
  if(isTextCorrect)
    result.textContent = `Words Per Min: ${calculateWPM(event.target.value).toFixed(0)}`;
  console.log(isTextCorrect);
});
