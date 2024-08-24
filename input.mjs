import readline from 'node:readline';
import { options } from './config.mjs';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

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

export {
  isValidInput,
  promptUserForValidInput,
  getInput
}