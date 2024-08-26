import readline from 'node:readline';
import { options } from './config.mjs';
import { formatInvalidInputPrompt, promptMessage } from './message.mjs';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function isValidInput(value, rules) {
  return rules.every(rule => rule(value));
}

async function promptUserForValidInput({ value, type = null, text, rules = [], invalid, isNumber = true }) {
  while (true) {
    value = await getInput({ text, isNumber });

    if (isValidInput(value, rules)) {
      return value;
    }

    if (isNumber) {
      promptMessage(formatInvalidInputPrompt({ 
        template: invalid,
        min: options[type].min,
        max: options[type].max
      }));
    } else {
      promptMessage(invalid);
    }
  }
}

async function getInput({ text, isNumber = true }) {
  return new Promise((resolve) => {
    rl.question(text, (input) => {
      resolve(isNumber ? Number(input) : input);
    });
  });
}

export {
  isValidInput,
  promptUserForValidInput,
  getInput,
  rl
}