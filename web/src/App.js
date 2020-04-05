import React, {useEffect, useState} from 'react';

function App() {
  const [dice, setDice] = useState([]);
  const [availableChoices, setAvailableChoices] = useState(allChoices());
  const [pickingNumbers, setPickingNumbers] = useState(false);
  const [needsToRoll, setNeedsToRoll] = useState(true);
  const [selectedNumbers, setSelectedNumbers] = useState(new Set());
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState(false);

  console.log('gameState',
    dice,
    availableChoices,
    pickingNumbers,
    needsToRoll,
    selectedNumbers,
    gameOver);

  useEffect(() => {
    if(!needsToRoll && !isPossible([...availableChoices], 0, sumArray(dice))) {
      setGameOver(true);
      setNeedsToRoll(false);
    }
  }, [needsToRoll]);

  useEffect(() => {
    if(availableChoices.size === 0) {
      setGameOver(true);
      setWinner(true);
    }
  }, [availableChoices.size]);

  const newGame = () => {
    setDice([]);
    setAvailableChoices(allChoices());
    setPickingNumbers(false);
    setSelectedNumbers(new Set());
    setGameOver(false);
    setNeedsToRoll(true);
  };

  const toggleChoice = choice => {
    const newChosenNumbers = new Set(selectedNumbers);
    selectedNumbers.has(choice) ? newChosenNumbers.delete(choice) : newChosenNumbers.add(choice);
    setSelectedNumbers(newChosenNumbers);
  };

  const finalizeSelection = () => {
    const newAvailableChoices = new Set(availableChoices);
    [...selectedNumbers].forEach(number => newAvailableChoices.delete(number));
    setAvailableChoices(newAvailableChoices);
    setSelectedNumbers(new Set());
    setDice([]);
    setPickingNumbers(false);
    setNeedsToRoll(true);
  };

  return (
    <div className="App">
      <div style={{display: 'flex', flexDirection: 'column'}}>
        <Numbers
          availableChoices={availableChoices}
          chosenNumbers={selectedNumbers}
          toggleChoice={toggleChoice}
          disabled={!pickingNumbers}
          gameOver={gameOver} />
        <div>
          <button
            disabled={!pickingNumbers || !canSelectNumbers(selectedNumbers, sumArray(dice))}
            onClick={finalizeSelection}
          >
            Select these numbers
          </button>
        </div>
        <div>
          <button
            onClick={() => {
              Math.max(...[...availableChoices]) > 6 ? setDice([rollDie(), rollDie()]) : setDice([rollDie()]);
              setNeedsToRoll(false);
              setPickingNumbers(true);
            }}
            disabled={!needsToRoll}
          >
            Roll
          </button>
        </div>
        Dice:
        {dice.length > 0 && <Dice dice={dice}/>}
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

                <button onClick={newGame}>Start new game</button>
              </div>
            )
            : <div>not game over</div>
        }
      </div>
    </div>
  );
}

export default App;

function Dice({dice}) {
  return (
    <div>
      {dice.map(die => <div>{die}</div>)}
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
    console.log("sum", sum)
    return true;
  }
  if(sum > target) {
    return false;
  }
  for(let i = 0; i < valuesArray.length; i++) {
    let remainingValues = valuesArray.slice(0); // copy
    remainingValues.splice(i,1);
    console.log("depth")
    if(isPossible(remainingValues, sum + valuesArray[i], target)) {
      console.log("remainingValues", "valuesArray[i]", "target")
      console.log(remainingValues, valuesArray[i], target)
      return true;
    }
  }
  return false;
};