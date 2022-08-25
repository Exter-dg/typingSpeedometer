const textBox = document.querySelector('#text');
const startButton = document.querySelector('#start');

var startTime = 0;

function calculateWords(string) {
    return string.split(' ').length;
}

function calculateWPM(string) {
    const noOfWords = calculateWords(string);
    const noOfSec = (performance.now() - startTime) / (1000);

    return noOfWords/noOfSec * 60;
}

startButton.addEventListener('click', () => {
    startTime = performance.now();
    textBox.value='';
    textBox.focus();
});

textBox.addEventListener('input', (event) => {
  const result = document.querySelector('#speed');
  result.textContent = `Words Per Min: ${calculateWPM(event.target.value)}`;
});
