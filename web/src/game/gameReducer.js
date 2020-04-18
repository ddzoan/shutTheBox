import {sumArray, isPossible} from "./gameHelpers";

const reducer = (state, action) => {
  switch(action.type) {
    case "ROLL_DICE":
      return rollDiceReducer(state);
    case "TOGGLE_CHOICE":
      return toggleChoiceReducer(state, action.payload);
    case "FINALIZE_SELECTION":
      return finalizeSelectionReducer(state);
    case "NEW_GAME":
      return newGameReducer();
    default:
      return state;
  }
};

export const getInitialState = (dice) => ({
  dice: dice || [],
  availableChoices: allChoices(),
  pickingNumbers: false,
  needsToRoll: true,
  selectedNumbers: new Set(),
  gameOver: false,
  winner: false,
});

const rollDiceReducer = (state) => {
  const {gameOver, needsToRoll, availableChoices} = state;
  if(gameOver || !needsToRoll) {
    return state;
  }
  const shouldRollTwoDice = sumArray([...availableChoices]) > 6;
  const dice = shouldRollTwoDice ? [rollDie(), rollDie()] : [rollDie()];

  const isGameOver = !isPossible([...availableChoices], 0, sumArray(dice));
  return {
    dice,
    availableChoices,
    pickingNumbers: !isGameOver,
    needsToRoll: false,
    selectedNumbers: new Set(),
    gameOver: isGameOver,
    winner: false,
  }
};

const toggleChoiceReducer = (state, choice) => {
  const {gameOver, availableChoices, selectedNumbers} = state;
  if(gameOver || !availableChoices.has(choice)) {
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
  const {gameOver, needsToRoll, availableChoices, selectedNumbers} = state;
  if(gameOver || needsToRoll || !selectedNumbersValid(selectedNumbers, availableChoices)) {
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

const rollDie = () => Math.ceil(Math.random()*6);

const allChoices = () => new Set([...Array(9).keys()].map(i => i + 1));

const newGameReducer = () => getInitialState();

export default reducer;