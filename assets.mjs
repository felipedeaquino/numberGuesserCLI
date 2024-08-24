const welcomeMessage = `Welcome to the Number Guessing Game!
I'm thinking of a number between 1 and 100.\n`;

const difficultyMenu = `Please select the difficulty level:
1. Easy (10 chances)
2. Medium (5 chances)
3. Hard (3 chances)\n`;

const invalidInput = `Invalid input. Please enter a number between 1 and 3.\n`

const choiceTemplate = `Enter your choice: `;

const guessLine = `Enter your guess: `

const attemptsPerDifficulty = {
  1: 10,
  2: 5,
  3: 3
}

const translateDifficulty = {
  1: 'Easy',
  2: 'Medium',
  3: 'Hard'
}

export {
  welcomeMessage,
  difficultyMenu,
  invalidInput,
  choiceTemplate,
  guessLine,
  attemptsPerDifficulty,
  translateDifficulty,
}