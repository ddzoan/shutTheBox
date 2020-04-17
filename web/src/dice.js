import React from 'react';
import "./dice.css";

const Dice = ({dice}) => {
  return (
  <div className="dice-bg">
    <div className="dice">
      {dice.map((die, i) => (
        <ol className={`die-list ${"even-roll"}`} data-roll={die} key={i}>
          <li className="die-item" data-side="1">
            <span className="dot"/>
          </li>
          <li className="die-item" data-side="2">
            <span className="dot"/>
            <span className="dot"/>
          </li>
          <li className="die-item" data-side="3">
            <span className="dot"/>
            <span className="dot"/>
            <span className="dot"/>
          </li>
          <li className="die-item" data-side="4">
            <span className="dot"/>
            <span className="dot"/>
            <span className="dot"/>
            <span className="dot"/>
          </li>
          <li className="die-item" data-side="5">
            <span className="dot"/>
            <span className="dot"/>
            <span className="dot"/>
            <span className="dot"/>
            <span className="dot"/>
          </li>
          <li className="die-item" data-side="6">
            <span className="dot"/>
            <span className="dot"/>
            <span className="dot"/>
            <span className="dot"/>
            <span className="dot"/>
            <span className="dot"/>
          </li>
        </ol>
      ))}
    </div>
  </div>
)
};

export default Dice;