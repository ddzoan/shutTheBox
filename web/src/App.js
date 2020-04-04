import React, {useEffect, useState} from 'react';

function App() {
  const [die1, setDie1] = useState(0);
  const [die2, setDie2] = useState(0);
  const [availableChoices, setAvailableChoices] = useState(allChoices());
  const [pickingNumbers, setPickingNumbers] = useState(false);
  const [needsToRoll, setNeedsToRoll] = useState(true);
  const [selectedNumbers, setSelectedNumbers] = useState(new Set());
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState(false);

  console.log('gameState', die1,
    die2,
    availableChoices,
    pickingNumbers,
    needsToRoll,
    selectedNumbers,
    gameOver);

  useEffect(() => {
    if(!needsToRoll && !isPossible([...availableChoices], 0, die1 + die2)) {
      setGameOver(true);
      setNeedsToRoll(false);
    }
  }, [needsToRoll]);

  useEffect(() => {
    if(availableChoices.size === 0) {
      setGameOver(true);
      setWinner(true);
    }
  });

  const newGame = () => {
    setDie1(0);
    setDie2(0);
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
    setDie1(0)
    setDie2(0)
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
            disabled={!pickingNumbers || !canSelectNumbers(selectedNumbers, die1 + die2)}
            onClick={finalizeSelection}
          >
            Select these numbers
          </button>
        </div>
        <div>
          <button
            onClick={() => {
              setDie1(rollDie);
              setDie2(rollDie);
              setNeedsToRoll(false);
              setPickingNumbers(true);
            }}
            disabled={!needsToRoll}
          >
            Roll
          </button>
        </div>
        Dice:
        {!!die1 && <Dice number={die1}/>}
        {!!die2 && <Dice number={die2}/>}
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
                      <div>Total <span>{[...availableChoices].reduce((a,b) => a + b, 0)}</span></div>
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

function Dice({number}) {
  return (
    <div>
      {number}
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
  [...selectedNumbers].reduce((a, b) => a + b, 0) === total
);

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