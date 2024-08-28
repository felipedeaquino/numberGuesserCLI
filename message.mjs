function formatText({ text, variables }) {
  Object.keys(variables).forEach(key => {
    text = text.replace(`{${key}}`, variables[key]);
  });
  return text;
}

function promptMessage(text) {
  console.log(text); 
}

export {
  formatText,
  promptMessage,
}