import { levels } from './config.mjs';

function formatInvalidInputPrompt({ template, min, max }) {
  return template.replace('{min}', min).replace('{max}', max);
}

function formatMessage({ text, value }) {
  return text.replace('{difficulty}', levels[value].difficulty);
}

function formatCongratulations({ text, value}) {
  return text.replace('{attempts}', value);
}

function promptMessage(text) {
  console.log(text); 
}

export {
  formatInvalidInputPrompt,
  formatMessage,
  formatCongratulations,
  promptMessage,
}