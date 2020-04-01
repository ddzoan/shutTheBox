import React, {useState} from 'react';

function App() {
  const [die1, setDie1] = useState(0);
  const [die2, setDie2] = useState(0);
  const [availableChoices, setAvailableChoices] = useState(newGame());

  return (
    <div className="App">
      <div style={{display: 'flex', flexDirection: 'column'}}>
        <Numbers availableChoices={availableChoices} />
        <div>
          <button onClick={() => {
            setDie1(rollDice)
            setDie2(rollDice)
          }}>Roll</button>
        </div>
        Dice:
        {!!die1 && <Dice number={die1}/>}
        {!!die2 && <Dice number={die2}/>}
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

const Numbers = ({availableChoices}) => {
  return (
    <div>
      {possibleChoices.map(choice => (
        <button disabled={!availableChoices.has(choice)}>{choice}</button>
      ))}
    </div>
  );
};
const possibleChoices = [...Array(9).keys()].map(i => i + 1);

const rollDice = () => Math.ceil(Math.random()*6);

const newGame = () => new Set([...Array(9).keys()].map(i => i + 1));