import { rl, promptUserForValidInput } from './input.mjs';
import { promptMessage, formatText } from './message.mjs';
import { levels, options, rules, texts } from './config.mjs';
import { initGame } from './main.mjs';

async function playGame(answer, difficultyLevel) {
  let attempts = 0;
  let guess;

  let isRightAnswer = false;

  do {
    guess = await promptUserForValidInput({
      value: guess,
      type: 'guess',
      text: texts.guessLine,
      rules: [rules.isInRange(options.guess.min, options.guess.max)],
      invalid: texts.invalidInput
    });
    isRightAnswer = (answer === guess);
    !isRightAnswer && evaluateAnswer(answer, guess);
    attempts++;
  } while (attempts < levels[difficultyLevel].attempts && !isRightAnswer);

  isRightAnswer
   ? promptMessage(formatText({ text: texts.congratulations, variables: { attempts } }))
   : promptMessage(texts.gameOverMessage)
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

function getAnswer() {
  return Math.floor(Math.random() * options.guess.max) + 1;
}

function evaluateAnswer(answer, guess) {
  let compared;
  guess > answer 
    ? compared = 'less'
    : compared = 'greater'

  promptMessage(formatText({ text: texts.numberComparison, variables: { compared, guess } }))
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

export {
  askToPlayAgain,
  evaluateAnswer,
  getAnswer,
  playGame,
  setDifficulty
}