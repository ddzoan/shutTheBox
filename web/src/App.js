import React, {useState} from 'react';

function App() {
  const [die1, setDie1] = useState(0);
  const [die2, setDie2] = useState(0);
  const [availableChoices, setAvailableChoices] = useState(allChoices());
  const [pickingNumbers, setPickingNumbers] = useState(false);
  const [selectedNumbers, setSelectedNumbers] = useState(new Set());

  const newGame = () => {
    setDie1(0);
    setDie2(0);
    setAvailableChoices(allChoices());
    setPickingNumbers(false);
    setSelectedNumbers(new Set());
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
    setPickingNumbers(false);
  };

  return (
    <div className="App">
      <div style={{display: 'flex', flexDirection: 'column'}}>
        <Numbers
          availableChoices={availableChoices}
          chosenNumbers={selectedNumbers}
          toggleChoice={toggleChoice}
          disabled={!pickingNumbers} />
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
              setDie1(rollDice);
              setDie2(rollDice);
              setPickingNumbers(true);
            }}
            disabled={pickingNumbers}
          >
            Roll
          </button>
        </div>
        Dice:
        {!!die1 && <Dice number={die1}/>}
        {!!die2 && <Dice number={die2}/>}
        <div>
          <button onClick={newGame}>Start new game</button>
        </div>
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

const Numbers = ({availableChoices, chosenNumbers, toggleChoice, disabled}) => {
  return (
    <div>
      {possibleChoices.map(choice => (
        <button
          key={choice}
          disabled={disabled || !availableChoices.has(choice)}
          style={{color: availableChoices.has(choice) && chosenNumbers.has(choice) && 'red'}}
          onClick={() => toggleChoice(choice)}
        >
          {choice}
        </button>
      ))}
    </div>
  );
};
const possibleChoices = [...Array(9).keys()].map(i => i + 1);

const rollDice = () => Math.ceil(Math.random()*6);

const allChoices = () => new Set([...Array(9).keys()].map(i => i + 1));

const canSelectNumbers = (selectedNumbers, total) => (
  [...selectedNumbers].reduce((a, b) => a + b, 0) === total
);