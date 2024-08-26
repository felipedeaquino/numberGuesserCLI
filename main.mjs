import { levels, options, rules, texts } from './config.mjs';
import { formatMessage, promptMessage } from './message.mjs';
import { rl, promptUserForValidInput } from './input.mjs';
  
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
    promptMessage(texts.gameOverMessage)
  }
  
  await askToPlayAgain(difficultyLevel);
}

async function askToPlayAgain() {
  let continueGame;
  continueGame = await promptUserForValidInput({
    value: continueGame,
    text: texts.playAgain,
    rules: [rules.isValidContinueInput],
    invalid: texts.invalidContinue,
    isNumber: false
  });

  if (rules.isContinue(continueGame)) {
    await initGame();
  } else {
    promptMessage(texts.greetings);
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