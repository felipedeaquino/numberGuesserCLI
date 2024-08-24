import readline from 'node:readline';
import {
  welcomeMessage,
  difficultyMenu,
  invalidInput,
  choiceTemplate,
  guessLine,
  attemptsPerDifficulty,
  translateDifficulty,
  playAgain,
} from './assets.mjs';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
  
let answer;
let difficultyLevel;
let attempts;
let guess;
let guessMin = 1;
let guessMax = 100;
let difficultyMin = 1;
let difficultyMax = 100;

const difficultyRules = (difficultyLevel) => [1, 2, 3].includes(difficultyLevel);
const guessRules = (guess) => Number(guess) >= guessMin && Number(guess) <= guessMax && !Number.isNaN(guess);

async function initGame() {
  console.log(welcomeMessage);
  console.log(difficultyMenu);
  difficultyLevel = await getFromUser({ min: difficultyMin, max: difficultyMax, value: difficultyLevel, text: choiceTemplate, rules: difficultyRules, invalid: invalidInput });
  console.log(`\nGreat! You have selected the ${translateDifficulty[difficultyLevel]} difficulty level.\nLet's start the game!`)   
}

async function playGame() {
  attempts = 0;
  answer = Math.floor(Math.random() * 100) + 1;

  let compared = false;

  while (attempts < attemptsPerDifficulty[difficultyLevel] && !compared){
    guess = await getFromUser({ min: guessMin, max: guessMax, value: guess, text: guessLine, rules: guessRules, invalid: invalidInput });
    compared = compare(guess);
    attempts++;
  }

  if (compared) {
    console.log(`Congratulations! You guessed the correct number in ${attempts} attempts.\n`)
  }  else {
    console.log('You fucking lose. Loser.\n');
  }
  
  await wannaPlayAgain();
}

async function wannaPlayAgain() {
  let answer;
  do { answer = await getInput({ text: playAgain, isNumber: false});
  } while (!['YES', 'Y', 'NO', 'N'].includes(answer.toUpperCase()));

  if (answer.toUpperCase() === 'YES' || answer.toUpperCase() === 'Y') {
    await initGame();
    await playGame();
  } else {
    console.log('Thanks for playing!');
    rl.close();
  }
}

function compare(guess) {
  if (guess !== answer) {;
    console.log(`Incorrect! The number is ${guess > answer ? 'less than' : 'greater than'} ${guess}.\n`)
    return false;
  }
  return true;
}

async function getFromUser({ min = null, max = null, value, text, rules, invalid }) {
  while (true) {
    value = await getInput({ text });

    if (rules(value)) {
      return value;
    }
    console.log(formatInvalidInput({ template: invalid, min, max }));  
  }
}

async function getInput({ text, isNumber = true }) {
  return new Promise((resolve) => {
    rl.question(text, (input) => {
      resolve(isNumber ? Number(input) : input);
    });
  });
}

function formatInvalidInput({ template, min, max }) {
  return template.replace('{min}', min).replace('{max}', max);
}

(async () => {
  await initGame();
  await playGame();
})()