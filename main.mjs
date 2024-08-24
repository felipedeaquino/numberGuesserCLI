import readline from 'node:readline';
import { levels, options, rules, texts } from './config.mjs';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
  
let answer;
let difficultyLevel;
let attempts;
let guess;

async function initGame() {
  console.log(texts.welcomeMessage);
  console.log(texts.difficultyMenu);
  difficultyLevel = await getFromUser({
    value: difficultyLevel,
    type: 'difficulty',
    text: texts.choiceTemplate,
    rules: [rules.isInRange(options.difficulty.min, options.difficulty.max)],
    invalid: texts.invalidInput
  });
  console.log(`\nGreat! You have selected the ${levels[difficultyLevel].difficulty} difficulty level.\nLet's start the game!`)   
}

async function playGame() {
  attempts = 0;
  answer = Math.floor(Math.random() * options.guess.max) + 1;

  let compared = false;

  while (attempts < levels[difficultyLevel].attempts && !compared){
    guess = await getFromUser({
      value: guess,
      type: 'guess',
      text: texts.guessLine,
      rules: [rules.isInRange(options.guess.min, options.guess.max)],
      invalid: texts.invalidInput
    });
    compared = compare(guess);
    attempts++;
  }

  if (compared) {
    console.log(`Congratulations! You guessed the correct number in ${attempts} attempts.\n`)
  }  else {
    console.log('You fucking lose. Loser.\n');
  }
  
  await askToPlayAgain();
}

async function askToPlayAgain() {
  let continueGame;
  do { continueGame = await getInput({ text: texts.playAgain, isNumber: false});
  } while (!['YES', 'Y', 'NO', 'N'].includes(continueGame.toUpperCase()));

  if (continueGame.toUpperCase() === 'YES' || continueGame.toUpperCase() === 'Y') {
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

async function getFromUser({ value, type, text, rules = [], invalid }) {
  while (true) {
    value = await getInput({ text });
  
    const isValid = rules.every(rule => rule(value));
    if (isValid) {
      return value;
    }

    console.log(
      formatInvalidInput({ 
        template: invalid,
        min: options[type].min,
        max: options[type].max
      }) 
    );  
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