import React, {useReducer} from "react";
import {StyleSheet, css} from 'aphrodite/no-important';
import woodPattern from './wood-pattern.png';
import Dice from "./dice";
import reducer, {getInitialState, ROLL_DICE, NEW_GAME, FINALIZE_SELECTION, TOGGLE_CHOICE} from './gameReducer';
import {sumArray, possibleChoices, canSelectNumbers, rollDie} from './gameHelpers';
import {useKeyboardShortcuts} from "./gameKeyboardShortcuts";
import Fireworks from "./fireworks";

const Game = () => {
  const [state, dispatch] = useReducer(reducer, [rollDie(), rollDie()], getInitialState);
  const {dice, availableChoices, pickingNumbers, needsToRoll, rolling, selectedNumbers, gameOver, winner} = state;

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
          <Dice dice={dice} needsToRoll={needsToRoll}/>
          <div className={css(styles.actionsContainer)}>
            {!rolling && needsToRoll && !gameOver &&
              (
              <div>
                <button
                  onClick={() => dispatch({type: ROLL_DICE, dispatch})}
                >
                  Roll
                </button>
              </div>
              )
            }
          </div>
          {!rolling && gameOver && <GameOverOverlay availableChoices={availableChoices} winner={winner} dispatch={dispatch} />}
        </div>
      </div>
    </div>
  );
};

const GameOverOverlay = ({winner, availableChoices, dispatch}) => (
  <>
    <div className={css(styles.gameOverContainer, styles.gameOverOverlay)}/>
    { winner &&
      <div className={css(styles.gameOverContainer)}>
        <Fireworks/>
      </div>
    }
    <div className={css(styles.gameOverContainer)}>
      <div className={css(styles.gameOverTextContainer)}>
        {winner ?
          <span>You shut the box!!!</span>
          :
          <>
            <span>nope</span>
            <span>{[...availableChoices].join(' + ')}{availableChoices.size > 1 && ` = ${sumArray([...availableChoices])}`}</span>
          </>
        }
        <button onClick={() => dispatch({type: NEW_GAME})}>Start new game</button>
      </div>
    </div>
  </>
);

const Numbers = ({availableChoices, chosenNumbers, toggleChoice, disabled, gameOver}) => {
  return (
    <div className={css(styles.allNumbersContainer)} style={{backgroundImage: `url(${woodPattern})`}}>
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
  <Clickable
    className={css(
      styles.numberContainer,
      disabled && styles.numberDisabledOverlay,
      selected && styles.numberSelected
    )}
    onClick={() => !disabled && onClick(number)}
  >
    <div className={css(styles.number, disabled && styles.numberDisabled)}>{number}</div>
  </Clickable>
);

export default Game;

const NUMBER_HEIGHT = 120;
const NUMBER_HEIGHT_MOBILE = 72;

const styles = StyleSheet.create({
  gameContainer: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
  },
  boxContainer: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    flex: 1,
    padding: '24px',
    paddingBottom: NUMBER_HEIGHT_MOBILE - 24,
    backgroundColor: '#571e00',
    '@media only screen and (max-width: 479px)': {
      padding: '24px 0 48px',
    },
  },
  actionsContainer: {
    position: 'absolute',
    top: 0,
  },
  diceSurface: {
    flex: 1,
    width: '100%',
    backgroundImage: 'none',
    backgroundColor: '#076324',
    position: 'relative',
    paddingTop: 48,
  },
  gameOverOverlay: {
    backgroundColor: 'black',
    opacity: 0.3,
  },
  gameOverContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    textAlign: 'center',
    padding: 24,
  },
  gameOverTextContainer: {
    backgroundColor: 'white',
    padding: 8,
    display: 'inline-flex',
    flexDirection: 'column',
  },
  allNumbersContainer: {
    display: 'flex',
    backgroundColor: '#5e4300',
    width: '100%',
    maxWidth: '960px',
    height: NUMBER_HEIGHT,
    '@media only screen and (max-width: 479px)': {
      height: NUMBER_HEIGHT_MOBILE,
    },
  },
  numberContainer: {
    display: 'flex',
    border: 'solid black 2px',
    flex: 1,
  },
  numberSelected: {
    borderColor: 'yellow',
  },
  number: {
    flex: 1,
    fontSize: '32px',
    fontWeight: 'bold',
    color: 'white',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    '@media only screen and (max-width: 479px)': {
      fontSize: '16px',
    },
  },
  numberDisabled: {
    color: 'black',
  },
  numberDisabledOverlay: {
    cursor: 'unset',
    opacity: 0.5,
    backgroundColor: 'white',
  },
  numberSelectedOverlay: {

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