import React, {useReducer} from "react";
import {StyleSheet, css} from 'aphrodite/no-important';
import woodPattern from './wood-pattern.png';
import Dice from "./dice";
import reducer, {getInitialState, ROLL_DICE, NEW_GAME, FINALIZE_SELECTION, TOGGLE_CHOICE} from './gameReducer';
import {sumArray, possibleChoices, canSelectNumbers} from './gameHelpers';
import {useKeyboardShortcuts} from "./gameKeyboardShortcuts";

const Game = () => {
  const [state, dispatch] = useReducer(reducer, null, getInitialState);
  const {dice, availableChoices, pickingNumbers, needsToRoll, selectedNumbers, gameOver, winner} = state;

  useKeyboardShortcuts(dispatch);

  return (
    <div className={css(styles.gameContainer)}>
      <div className={css(styles.boxContainer)} style={{backgroundImage: `url(${woodPattern})`}}>
        <Numbers
          availableChoices={availableChoices}
          chosenNumbers={selectedNumbers}
          toggleChoice={choice => dispatch({type: TOGGLE_CHOICE, payload: choice})}
          disabled={!(gameOver || pickingNumbers)}
          gameOver={gameOver}/>
        <div>
          <button
            disabled={!pickingNumbers || !canSelectNumbers(selectedNumbers, sumArray(dice))}
            onClick={() => dispatch({type: FINALIZE_SELECTION})}
          >
            Select these numbers
          </button>
        </div>
        <div className={css(styles.diceSurface)}>
          <div>
            <button
              onClick={() => dispatch({type: ROLL_DICE})}
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

                  <button onClick={() => dispatch({type: NEW_GAME})}>Start new game</button>
                </div>
              )
              : <div>{pickingNumbers ? "Select your numbers" : "Roll the dice"}</div>
          }
        </div>
      </div>
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
          onClick={() => {
            !gameOver && toggleChoice(choice)
          }}
        >
          {choice}
        </button>
      ))}
    </div>
  );
};

export default Game;

const styles = StyleSheet.create({
  gameContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  boxContainer: {
    padding: '24px',
    backgroundColor: '#571e00',
  },
  diceSurface: {
    backgroundImage: 'none',
    backgroundColor: '#076324',
  }
});