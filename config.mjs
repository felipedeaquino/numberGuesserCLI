const levels = {
  1: { difficulty: 'Easy', attempts: 10 },
  2: { difficulty: 'Medium', attempts: 5 },
  3: { difficulty: 'Hard', attempts: 3 }
}

const options = {
  guess: { min: 1, max: 100 },
  difficulty: { min: 1, max: Object.keys(levels).length  }
}

const rules = {
  isInRange: (min, max) => value => Number(value) >= min && Number(value) <= max,
  isValidContinueInput: (input) => ['YES', 'Y', 'NO', 'N'].includes(String(input).toUpperCase()),
  isContinue: (input) => String(input).toUpperCase() === 'YES' || String(input).toUpperCase() === 'Y',
}

const texts = {
  welcomeMessage: `Welcome to the Number Guessing Game!,
I'm thinking of a number between ${options.guess.min} and ${options.guess.max}.\n`,
  difficultyMenu: `Please select the difficulty level:\n${
  Object.keys(levels)
    .map(key => `${key}. ${levels[key].difficulty} (${levels[key].attempts} chances)`)
    .join('\n')
  }\n`,
  invalidInput: 'Invalid input. Please enter a number between {min} and {max}.\n',
  difficultySelected: "\nGreat! You have selected the {difficulty} difficulty level.\nLet's start the game!\n",
  choiceTemplate: 'Enter your choice: ',
  guessLine: 'Enter your guess: ',
  playAgain: 'Would you like to play again? (Yes/No) ',
  gameOverMessage: 'You fucking lose. Loser.\n',
  greetings: '\nThanks for playing!', 
  invalidContinue: 'Invalid input. Please enter "yes", "y", "no" or "n" to continue.\n',
  congratulations: 'Congratulations! You guessed the correct number in {attempts} attempts.\n',
  numberComparison: 'Incorrect! The number is {compared} than {guess}.\n',
}

export {
  levels,
  options,
  rules,
  texts,
}