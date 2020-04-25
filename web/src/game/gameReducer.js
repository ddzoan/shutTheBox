import {sumArray, isPossible, canSelectNumbers, rollDie} from "./gameHelpers";
export const ROLL_DICE = "ROLL_DICE";
export const FINISH_ROLL_DICE = "FINISH_ROLL_DICE";
export const TOGGLE_CHOICE = "TOGGLE_CHOICE";
export const FINALIZE_SELECTION = "FINALIZE_SELECTION";
export const NEW_GAME = "NEW_GAME";

const reducer = (state, action) => {
  switch(action.type) {
    case ROLL_DICE:
      return rollDiceReducer(state, action.dispatch);
    case FINISH_ROLL_DICE:
      return finishRollDiceReducer(state);
    case TOGGLE_CHOICE:
      return toggleChoiceReducer(state, action.payload);
    case FINALIZE_SELECTION:
      return finalizeSelectionReducer(state);
    case NEW_GAME:
      return newGameReducer(state);
    default:
      return state;
  }
};

export const getInitialState = (dice) => ({
  dice: dice || [],
  availableChoices: allChoices(),
  pickingNumbers: false,
  needsToRoll: true,
  rolling: false,
  selectedNumbers: new Set(),
  gameOver: false,
  winner: false,
});

const rollDiceReducer = (state, dispatch) => {
  const {gameOver, needsToRoll, availableChoices} = state;
  if(gameOver || !needsToRoll) {
    return state;
  }
  const shouldRollTwoDice = sumArray([...availableChoices]) > 6;
  const dice = shouldRollTwoDice ? [rollDie(), rollDie()] : [rollDie()];

  const isGameOver = !isPossible([...availableChoices], 0, sumArray(dice));
  setTimeout(() => dispatch({type: FINISH_ROLL_DICE}), 1500);
  return {
    dice,
    availableChoices,
    pickingNumbers: !isGameOver,
    needsToRoll: false,
    rolling: true,
    selectedNumbers: new Set(),
    gameOver: isGameOver,
    winner: false,
  }
};

const finishRollDiceReducer = (state) => {
  return {
    ...state,
    rolling: false,
  };
};

const toggleChoiceReducer = (state, choice) => {
  const {gameOver, availableChoices, selectedNumbers, pickingNumbers} = state;
  if(gameOver || !availableChoices.has(choice) || !pickingNumbers) {
    return state;
  }
  const newSelectedNumbers = new Set(selectedNumbers);
  const action = selectedNumbers.has(choice) ? "delete" : "add";
  newSelectedNumbers[action](choice);
  return {
    ...state,
    selectedNumbers: newSelectedNumbers
  };
};

const finalizeSelectionReducer = (state) => {
  const {gameOver, needsToRoll, availableChoices, selectedNumbers, pickingNumbers, dice} = state;
  if(
    gameOver ||
    needsToRoll ||
    !pickingNumbers ||
    !selectedNumbersValid(selectedNumbers, availableChoices) ||
    !canSelectNumbers(selectedNumbers, sumArray(dice))
  ) {
    return state;
  }
  const newAvailableChoices = new Set(availableChoices);
  selectedNumbers.forEach(num => newAvailableChoices.delete(num));

  const isWinner = newAvailableChoices.size === 0;

  return {
    dice: state.dice,
    availableChoices: newAvailableChoices,
    pickingNumbers: false,
    needsToRoll: true,
    selectedNumbers: new Set(),
    gameOver: isWinner,
    winner: isWinner,
  };
};

const selectedNumbersValid = (selectedNumbers, availableNumbers) =>
  [...selectedNumbers].every(num => availableNumbers.has(num));

const allChoices = () => new Set([...Array(9).keys()].map(i => i + 1));

const newGameReducer = (state) => getInitialState(state.dice);

export default reducer;