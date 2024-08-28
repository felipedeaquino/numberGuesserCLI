import { levels, options, rules, texts } from './config.mjs';
import { formatMessage, promptMessage, formatCongratulations } from './message.mjs';
import { rl, promptUserForValidInput } from './input.mjs';
import { getAnswer, setDifficulty } from './utils.mjs';

let answer;
let attempts;
let guess;

async function playGame(difficultyLevel) {
  attempts = 0;

  let isRightAnswer = false;

  while (attempts < levels[difficultyLevel].attempts && !isRightAnswer){
    guess = await promptUserForValidInput({
      value: guess,
      type: 'guess',
      text: texts.guessLine,
      rules: [rules.isInRange(options.guess.min, options.guess.max)],
      invalid: texts.invalidInput
    });
    isRightAnswer = evaluateAnswer(guess);
    attempts++;
  }

  if (isRightAnswer) {
    promptMessage(formatCongratulations({ text: texts.congratulations, value: attempts }))
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

function evaluateAnswer(guess) {
  if (guess !== answer) {;
    console.log(`Incorrect! The number is ${guess > answer ? 'less than' : 'greater than'} ${guess}.\n`)
    return false;
  }
  return true;
}

(async () => {
  promptMessage(texts.welcomeMessage);
  promptMessage(texts.difficultyMenu);
  const difficultyLevel = await setDifficulty();
  promptMessage(formatMessage({ text: texts.difficultySelected, value: difficultyLevel }));
  answer = getAnswer();
  await playGame(difficultyLevel);
})()