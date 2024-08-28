import { promptUserForValidInput } from "./input.mjs";
import { options, rules, texts } from "./config.mjs";

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

export {
  getAnswer,
  setDifficulty,
}