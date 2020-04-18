import React, {useEffect, useReducer} from "react";
import Dice from "./dice";
import reducer, {getInitialState} from './gameReducer';
import {canSelectNumbers, sumArray, possibleChoices} from './gameHelpers';

const Game = () => {
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
      <Dice dice={dice} needsToRoll={needsToRoll}/>
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
  );
};

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

export default Game;