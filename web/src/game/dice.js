import React from 'react';
import "./dice.css";

class Dice extends React.Component {
  constructor(props) {
    super(props);
    this.state = {diceClassToggler: false};
  }

  componentDidUpdate(prevProps) {
    if(prevProps.needsToRoll === true && this.props.needsToRoll === false) {
      this.setState({diceClassToggler: !this.state.diceClassToggler});
    }
  }

  render() {
    const {dice} = this.props;
    const {diceClassToggler} = this.state;

    return (
      <div className="dice-bg">
        <div className="dice">
          {dice.map((die, i) => (
            <ol className={`die-list ${diceToggler(diceClassToggler, i) ? "even-roll" : "odd-roll"}`} data-roll={die} key={i}>
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
  }
};

export default Dice;

const diceToggler = (toggler, index) => index % 2 === 0 ? toggler : !toggler;