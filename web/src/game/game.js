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
    <div className={css(styles.numbersContainer)} style={{backgroundImage: `url(${woodPattern})`}}>
      {possibleChoices.map(choice => (
        <Number
          key={choice}
          number={choice}
          disabled={disabled || !availableChoices.has(choice)}
          selected={availableChoices.has(choice) && chosenNumbers.has(choice)}
          onClick={() => {
            !gameOver && toggleChoice(choice)
          }}
        />
      ))}
    </div>
  );
};

const Number = ({number, disabled, selected, onClick}) => (
  <Clickable className={css(disabled && styles.numberDisabledOverlay)} onClick={() => !disabled && onClick(number)}>
    <div className={css(styles.number, disabled && styles.numberDisabled, selected && styles.numberSelected)}>{number}</div>
  </Clickable>
);

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
  },
  numbersContainer: {
    display: 'inline-flex',
    backgroundColor: '#5e4300',
  },
  number: {
    padding: '16px',
    fontWeight: 'bold',
    fontSize: '32px',
    color: 'white',
    border: 'solid black 2px',
    cursor: 'pointer',
    height: '96px',
    width: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  numberSelected: {
    borderColor: 'yellow',
  },
  numberDisabled: {
    color: 'black',
  },
  numberDisabledOverlay: {
    cursor: 'unset',
    opacity: 0.5,
    backgroundColor: 'white',
  },
});

const clickableKeyPress = (onClick, event) => {
  if(event.key === ' ' || event.key === 'Enter') {
    onClick(event);
  }
};

const Clickable = ({children, onClick, ...props}) => (
  <div onKeyPress={clickableKeyPress.bind(null, onClick)} onClick={onClick} role="button" tabIndex="0" {...props}>
    {children}
  </div>
);