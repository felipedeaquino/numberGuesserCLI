import { levels, options, rules, texts } from './config.mjs';
import { formatMessage, promptMessage } from './message.mjs';
import {
  rl,
  promptUserForValidInput,
  getInput
} from './input.mjs';
  
let answer;
let attempts;
let guess;

async function initGame() {
  promptMessage(texts.welcomeMessage);
  promptMessage(texts.difficultyMenu);
  const difficultyLevel = await setDifficulty();
  promptMessage(formatMessage({ text: texts.difficultySelected, value: difficultyLevel }));
  await playGame(difficultyLevel);
}

async function setDifficulty() {
  let difficultyLevel;
  return promptUserForValidInput({
    value: difficultyLevel,
    type: 'difficulty',
    text: texts.choiceTemplate,
    rules: [rules.isInRange(options.difficulty.min, options.difficulty.max)],
    invalid: texts.invalidInput
  });
}

async function playGame(difficultyLevel) {
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
  
  await askToPlayAgain(difficultyLevel);
}

async function askToPlayAgain(difficultyLevel) {
  let continueGame;
  do { continueGame = await getInput({ text: texts.playAgain, isNumber: false});
  } while (!['YES', 'Y', 'NO', 'N'].includes(continueGame.toUpperCase()));

  if (continueGame.toUpperCase() === 'YES' || continueGame.toUpperCase() === 'Y') {
    await initGame();
    await playGame(difficultyLevel);
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

(async () => {
  await initGame();
})()