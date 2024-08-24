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

async function initGame() {
  console.log(welcomeMessage);
  console.log(difficultyMenu);
  difficultyLevel = await getInput({ text: choiceTemplate });
  await checkDifficulty(difficultyLevel);
  console.log(`\nGreat! You have selected the ${translateDifficulty[difficultyLevel]} difficulty level.\nLet's start the game!`)   
}

async function playGame() {
  attempts = 0;
  answer = Math.floor(Math.random() * 100) + 1;

  let compared = false;

  while (attempts < attemptsPerDifficulty[difficultyLevel] && !compared){
    const guess = await getInput({ text: choiceTemplate });
    await checkGuess(guess);
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

async function checkDifficulty(difficultyLevel) {
  while (![1, 2, 3].includes(difficultyLevel)) {
    console.log(invalidInput);
    difficultyLevel = await getInput({ text: choiceTemplate });
  }
  return difficultyLevel;
}

async function checkGuess(guess) {  
  while (Number(guess) <= 0 || Number(guess) > 100 || Number.isNaN(guess)) {
    console.log('Invalid input. Please enter a number between 1 and 100.\n');
    guess = await getInput({ text: guessLine });
  }
}

function compare(guess) {
  if (guess !== answer) {;
    console.log(`Incorrect! The number is ${guess > answer ? 'less than' : 'greater than'} ${guess}.\n`)
    return false;
  }
  return true;
}

async function getInput({ text, isNumber = true }) {
  return new Promise((resolve) => {
    rl.question(text, (input) => {
      isNumber? resolve(Number(input)) : resolve(input);
    });
  });
};

(async () => {
  await initGame();
  await playGame();
})()