// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.9.3/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.9.3/firebase-analytics.js";
import { getFirestore, collection, getDocs, addDoc } from "https://www.gstatic.com/firebasejs/9.9.3/firebase-firestore.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD0n1p5snTqoruznZRTYeJe3hMSAZWTbLQ",
  authDomain: "typing-speedometer.firebaseapp.com",
  projectId: "typing-speedometer",
  storageBucket: "typing-speedometer.appspot.com",
  messagingSenderId: "901758642440",
  appId: "1:901758642440:web:a22b51a89e06735da024bd",
  measurementId: "G-3FTWHTL7GV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const analytics = getAnalytics(app);

const textBox = document.querySelector('#userTextBox');
const startButton = document.querySelector('#start');
const testText = document.querySelector('#testText');
const result = document.querySelector('#speed');
const startLight1 = document.querySelector('#startLight1');
const startLight2 = document.querySelector('#startLight2');
const startLight3 = document.querySelector('#startLight3');

const textArray = [
    "That was what I wanted, but I don't need it to be gone. I can love you and I can love life and bear the pain all at the same time. I think the pain might even make the rest better, the way a good setting can make a diamond look better.",
    "Was it all put into words, or did both understand that they had the same thing at heart and in their minds, so that there was no need to speak of it aloud, and better not to speak of it?",
    "You never should settle for the lifetime that is handed to you. There's always a line to be cut and someone to barrel through. And if you should find that you're about to get the short of the stick, take what you want, return what you get.",
    "There will come a time when all of us are dead."
];

let users = {}

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

function checkIfComplete(string) {
    return string === testTextGiven;
}

function findFirstDiffPos(a, b) {
    if (a.length < b.length) [a, b] = [b, a];
    return [...a].findIndex((chr, i) => chr !== b[i]);
}  

function clearLights() {
    startLight1.style.backgroundColor='white';
    startLight2.style.backgroundColor='white';
    startLight3.style.backgroundColor='white';
}

function resetPage() {
    textBox.value = '';
    testText.textContent = 'Click Start to start the test';
    result.textContent = 'Words Per Min:';
    textBox.disabled=true;
}

async function getData() {
    const querySnapshot = await getDocs(collection(db, "users"));
    querySnapshot.forEach((doc) => {
        const data = doc.data();
        if(users[data['name']] !== undefined) {
            users[data['name']] = Math.max(users[data['name']], data['score']);
        }
        else
            users[data['name']] = data['score'];
        // console.log(data['score']);
        // console.log(`${doc.id} => ${doc.data()}`);
    });
    console.log(users);
}

async function addData(userName, score) {
    try {
        const docRef = await addDoc(collection(db, "users"), {
            name: userName,
            score: parseInt(score),
        });
        console.log("Document written with ID: ", docRef.id);
      } catch (e) {
        console.error("Error adding document: ", e);
      }
}

function sortUsers() {
    users = Object.fromEntries(
        Object.entries(users).sort(([,a],[,b]) => b-a)
    );
}

function displayUsers() {
    var table = document.createElement("TABLE");
    table.setAttribute("id", "userScoreTable"); 
    document.body.appendChild(table);
    
    var thead = document.createElement('thead');
    table.appendChild(thead);
    thead.appendChild(document.createElement("th")).
            appendChild(document.createTextNode('User'));
    thead.appendChild(document.createElement("th")).
            appendChild(document.createTextNode('Score'));
    let i =0;
    for(const user in users) {
        if(i==5)
            break;
        var row = document.createElement("TR");
        var userNameCell = document.createElement("TD");
        var userScoreCell = document.createElement("TD");

        row.appendChild(userNameCell);
        row.appendChild(userScoreCell);

        var userName = document.createTextNode(user);
        var userScore = document.createTextNode(users[user]);

        userNameCell.appendChild(userName);
        userScoreCell.appendChild(userScore);
        table.appendChild(row);
        i+=1;
    }
}

startButton.addEventListener('click', () => {
    clearLights();
    testTextGiven = textArray[Math.floor(Math.random()*textArray.length)];
    testText.textContent = testTextGiven;

    // ! Any better way to do this?
    setTimeout(()=> {
        startLight1.style.backgroundColor='red';
        setTimeout(()=> {
            startLight2.style.backgroundColor='yellow';
            setTimeout(()=> {
                startLight1.style.backgroundColor='green';
                startLight2.style.backgroundColor='green';
                startLight3.style.backgroundColor='green';
                startTime = performance.now();
                textBox.value = '';
                textBox.disabled=false;
                textBox.focus();
                result.textContent = 'Words Per Min:';
            }, 1000);
        }, 1000);
    }, 1000);
});

textBox.addEventListener('input', async (event) => {
    const isComplete = checkIfComplete(event.target.value);
    if(isComplete) {
        clearLights();
        const wpm = calculateWPM(event.target.value).toFixed(0);
        alert(`Congratulations, your WPM is ${wpm}`);
        var name = window.prompt("Let's add you to the leaderboards, Enter your name: ");   
        await addData(name, wpm);
        location.reload(); 
        return;
    }

    const isTextCorrect = checkText(event.target.value);
    if(isTextCorrect) {
        result.textContent = `Words Per Min: ${calculateWPM(event.target.value).toFixed(0)}`;
        testText.textContent = testTextGiven;
    } else {
        const diffPosStart = findFirstDiffPos(testTextGiven, event.target.value);
        const diffPosEnd = event.target.value.length-1;
        testText.innerHTML = testTextGiven.substring(0, diffPosStart) + 
                            '<mark>'+ testTextGiven.substring(diffPosStart, diffPosEnd+1) + '</mark>' + 
                            testTextGiven.substring(diffPosEnd+1);
    }
});

textBox.addEventListener('paste', (event) => {
    alert("Nah! That won't work.");
    clearLights();
    resetPage();
})

await getData();
sortUsers();
displayUsers();