import { texts } from './config.mjs';
import { formatText, promptMessage } from './message.mjs';
import { askToPlayAgain, getAnswer, playGame, setDifficulty } from './utils.mjs';
import { levels } from './config.mjs';

async function initGame() {
  promptMessage(texts.welcomeMessage);
  promptMessage(texts.difficultyMenu);
  const difficultyLevel = await setDifficulty();
  promptMessage(formatText({ text: texts.difficultySelected, variables: { difficulty: levels[difficultyLevel].difficulty } }));
  const answer = getAnswer();
  await playGame(answer, difficultyLevel);
  await askToPlayAgain();
};

initGame();

export {
  initGame
}