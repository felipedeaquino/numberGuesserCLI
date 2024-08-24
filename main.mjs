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
  promptMessage(texts.welcomeMessage);
  promptMessage(texts.difficultyMenu);
  difficultyLevel = await setDifficulty();
  promptMessage(formatMessage({ text: texts.difficultySelected, value: difficultyLevel }));
  await playGame();
}

async function setDifficulty() {
  return promptUserForValidInput({
    value: difficultyLevel,
    type: 'difficulty',
    text: texts.choiceTemplate,
    rules: [rules.isInRange(options.difficulty.min, options.difficulty.max)],
    invalid: texts.invalidInput
  });
}

async function playGame() {
  attempts = 0;
  answer = Math.floor(Math.random() * options.guess.max) + 1;

  let compared = false;

  while (attempts < levels[difficultyLevel].attempts && !compared){
    guess = await promptUserForValidInput({
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

function isValidInput(value, rules) {
  return rules.every(rule => rule(value));
}

async function promptUserForValidInput({ value, type, text, rules = [], invalid }) {
  while (true) {
    value = await getInput({ text });

    if (isValidInput(value, rules)) {
      return value;
    }

    promptMessage(
      formatInvalidInputPrompt({ 
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

function formatInvalidInputPrompt({ template, min, max }) {
  return template.replace('{min}', min).replace('{max}', max);
}

function formatMessage({ text, value }) {
  return text.replace('{difficulty}', levels[value].difficulty);
}

function promptMessage(text) {
  console.log(text); 
 }

(async () => {
  await initGame();
})()