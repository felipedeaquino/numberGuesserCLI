const texts = {
  welcomeMessage: `Welcome to the Number Guessing Game!,
I'm thinking of a number between 1 and 100.\n`,
  difficultyMenu: `Please select the difficulty level:
1. Easy (10 chances)
2. Medium (5 chances)
3. Hard (3 chances)\n`,
  invalidInput: `Invalid input. Please enter a number between {min} and {max}.\n`,
  choiceTemplate: `Enter your choice: `,
  guessLine: `Enter your guess: `,
  playAgain: 'Would you like to play again? (Yes/No) '
}

const levels = {
  1: { difficulty: 'Easy', attempts: 10 },
  2: { difficulty: 'Medium', attempts: 5 },
  3: { difficulty: 'Hard', attempts: 3 }
}

export {
  levels,
  texts,
}