import React, {useEffect, useReducer} from 'react';

function App() {
  const [state, dispatch] = useReducer(reducer, null, getInitialState);
  const {dice, availableChoices, pickingNumbers, needsToRoll, selectedNumbers, gameOver, winner} = state;

  const canFinalizeSelection = pickingNumbers && canSelectNumbers(selectedNumbers, sumArray(dice));

  useEffect(() => {
    const handleKeypress = event => {
      switch(event.key) {
        case "r":
          dispatch({type: "ROLL_DICE"});
          break;
        case "n":
          dispatch({type: "NEW_GAME"});
          break;
        case "1":
        case "2":
        case "3":
        case "4":
        case "5":
        case "6":
        case "7":
        case "8":
        case "9":
          if(pickingNumbers) {
            dispatch({type: "TOGGLE_CHOICE", payload: parseInt(event.key)});
          }
          break;
        case "Enter":
          if(canFinalizeSelection) {
            dispatch({type: "FINALIZE_SELECTION"});
          }
          break;
        default:
          break;
      }
    };
    window.addEventListener("keypress", handleKeypress);
    return () => window.removeEventListener("keypress", handleKeypress);
  });

  return (
    <div className="App">
      <div style={{display: 'flex', flexDirection: 'column'}}>
        <Numbers
          availableChoices={availableChoices}
          chosenNumbers={selectedNumbers}
          toggleChoice={choice => dispatch({type: "TOGGLE_CHOICE", payload: choice})}
          disabled={!(gameOver || pickingNumbers)}
          gameOver={gameOver} />
        <div>
          <button
            disabled={!canFinalizeSelection}
            onClick={() => dispatch({type: "FINALIZE_SELECTION"})}
          >
            Select these numbers
          </button>
        </div>
        <div>
          <button
            onClick={() => dispatch({type: "ROLL_DICE"})}
            disabled={!needsToRoll}
          >
            Roll
          </button>
        </div>
        Dice:
        <Dice dice={dice}/>
        {
          gameOver ?
            (
              <div>
                <div>GAME OVER</div>
                {
                  winner ?
                    <div>You shut the box!!!</div>
                    :
                    <>
                      <div>{JSON.stringify([...availableChoices])}</div>
                      <div>Total <span>{sumArray([...availableChoices])}</span></div>
                    </>
                }

                <button onClick={() => dispatch({type: "NEW_GAME"})}>Start new game</button>
              </div>
            )
            : <div>{pickingNumbers ? "Select your numbers" : "Roll the dice"}</div>
        }
      </div>
    </div>
  );
}

export default App;

function Dice({dice}) {
  return (
    <div>
      {dice.map((die, i) => <div key={`die${i}`}>{die}</div>)}
    </div>
  );
}

const Numbers = ({availableChoices, chosenNumbers, toggleChoice, disabled, gameOver}) => {
  return (
    <div>
      {possibleChoices.map(choice => (
        <button
          key={choice}
          disabled={disabled || !availableChoices.has(choice)}
          style={{color: availableChoices.has(choice) && chosenNumbers.has(choice) && 'red'}}
          onClick={() => {!gameOver && toggleChoice(choice)}}
        >
          {choice}
        </button>
      ))}
    </div>
  );
};
const possibleChoices = [...Array(9).keys()].map(i => i + 1);

const rollDie = () => Math.ceil(Math.random()*6);

const allChoices = () => new Set([...Array(9).keys()].map(i => i + 1));

const canSelectNumbers = (selectedNumbers, total) => (
  sumArray([...selectedNumbers]) === total
);

const sumArray = (arr) => arr.reduce((a, b) => a + b, 0);

const isPossible = (valuesArray, sum, target) => {
  if(sum === target) {
    return true;
  }
  if(sum > target) {
    return false;
  }
  for(let i = 0; i < valuesArray.length; i++) {
    let remainingValues = valuesArray.slice(0); // copy
    remainingValues.splice(i,1);
    if(isPossible(remainingValues, sum + valuesArray[i], target)) {
      return true;
    }
  }
  return false;
};

const getInitialState = () => ({
  dice: [],
  availableChoices: allChoices(),
  pickingNumbers: false,
  needsToRoll: true,
  selectedNumbers: new Set(),
  gameOver: false,
  winner: false,
});

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

const newGameReducer = () => getInitialState();