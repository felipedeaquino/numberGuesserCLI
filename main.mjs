import readline from 'node:readline';
import {
  welcomeMessage,
  difficultyMenu,
  invalidInput,
  choiceTemplate,
  guessLine,
  attemptsPerDifficulty,
  translateDifficulty,
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
  difficultyLevel = await getLevel();
  await checkDifficulty(difficultyLevel);
  console.log(`\nGreat! You have selected the ${translateDifficulty[difficultyLevel]} difficulty level.\nLet's start the game!`)   
}

async function playGame() {
  attempts = 0;
  answer = Math.floor(Math.random() * 100) + 1;

  let compared = false;

  while (attempts < attemptsPerDifficulty[difficultyLevel] && !compared){
    const guess = await getChoice();
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
  do {
    answer = await new Promise((resolve) => {
      rl.question('Would you like to play again? (Yes/No) ', (input) => {
        resolve(input);
      });
    })
  } while (!['YES', 'Y', 'NO', 'N'].includes(answer.toUpperCase()));

  if (answer.toUpperCase() === 'YES' || answer.toUpperCase() === 'Y') {
    await initGame();
    await playGame();
  } else {
    console.log('Thanks for playing!');
    rl.close();
  }
}

function getLevel() {
  return new Promise((resolve) => {
    rl.question(choiceTemplate, (input) => {
      resolve(Number(input));
    });
  });
}

async function checkDifficulty(difficultyLevel) {
  while (![1, 2, 3].includes(difficultyLevel)) {
    console.log(invalidInput);
    difficultyLevel = await getLevel();
  }
  return difficultyLevel;
}


function getChoice() {
  return new Promise((resolve) => {
    rl.question(guessLine, (input) => {
      resolve(Number(input));
    });
  });
}

async function checkGuess(guess) {
  while (Number(guess) <= 0 || Number(guess) > 100 || Number.isNaN(guess)) {
    console.log('Invalid input. Please enter a number between 1 and 100.\n');
    guess = await getChoice();
  }
}

function compare(guess) {
  if (guess !== answer) {;
    console.log(`Incorrect! The number is ${guess > answer ? 'less than' : 'greater than'} ${guess}.\n`)
    return false;
  }
  return true;
}

(async () => {
  await initGame();
  await playGame();
})()