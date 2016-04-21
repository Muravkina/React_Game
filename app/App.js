import React, { Component } from 'react';
import {render} from 'react-dom';

class StarsFrame extends Component {
  render() {

    let stars = [];
    for(let i = 0; i < this.props.numberOfStars; i++) {
      stars.push(
        <span className="glyphicon glyphicon-star"></span>
      )
    }
    return (
      <div id="stars-frame">
        <div className="well">
          {stars}
        </div>
      </div>
    );
  }
}

class NumbersFrame extends Component {
  render () {
    let numbers = [],
        selectedNumbers = this.props.selectedNumbers,
        selectNumber = this.props.selectNumber,
        className;

    for(let i = 1; i<= 9; i++) {
      className = `number selected-${(selectedNumbers.indexOf(i)>=0)}`
      numbers.push(
        <div className={className}
            //selectNumber(i) => with closure of the var i. Create copy of the function that remebers the value of it
             onClick={selectNumber.bind(null,i)}>
              {i}
        </div>
      )
    }
    return (
      <div id="numbers-frame">
        <div className="well">
          {numbers}
        </div>
      </div>
    );
  }
}

class ButtonFrame extends Component {
  render() {
    let disabled,
        button,
        correct = this.props.correct;

    switch(correct) {
      case true:
        button = ( <button className="btn btn-success btn-lg">
                    <span className="glyphicon glyphicon-ok"></span>
                  </button> );

        break;

      case false:
        button = ( <button className="btn btn-danger btn-lg">
                      <span className="glyphicon glyphicon-remove"></span>
                   </button> );
        break;

      default:
        disabled = (this.props.selectedNumbers.length === 0);
        button = ( <button className="btn btn-primary btn-lg"
                           disabled={disabled}
                           onClick={this.props.checkAnswer}>
                           =
                   </button> );

    }
    return (
      <div id="button-frame">
        {button}
      </div>
    );
  }
}

class AnswerFrame extends Component {
  render() {

    let selectedNumbers = this.props.selectedNumbers.map((selectedNumber) => (
        //closure on the variable
        <span onClick={this.props.unselectNumber.bind(null, selectedNumber)}>{selectedNumber}</span>
      ))

    return (
      <div id="answer-frame">
        <div className="well">
          {selectedNumbers}
        </div>
      </div>
    );
  }
}

class Game extends Component {
  constructor() {
    super();
    this.state = {
      numberOfStars: Math.floor(Math.random()*9) + 1,
      selectedNumbers: [],
      corerect: null
    }
  }
  unselectNumber(clickedNumber) {
    let selectedNumbers = this.state.selectedNumbers,
        indeOfNumber = selectedNumbers.indexOf(clickedNumber);

    selectedNumbers.splice(indeOfNumber, 1);

    this.setState({selectedNumbers: selectedNumbers});
  }
  selectNumber(clickedNumber) {
    if (this.state.selectedNumbers.indexOf(clickedNumber) < 0) {
      this.setState({selectedNumbers: this.state.selectedNumbers.concat(clickedNumber)})
    }
  }
  sumOfSelectedNumbers() {
    return this.state.selectedNumbers.reduce((p,n) => p + n, 0)
  }
  checkAnswer(){
    this.setState({ correct: this.state.numberOfStars == this.sumOfSelectedNumbers() })
  }
  render() {
    let selectedNumbers = this.state.selectedNumbers,
        numberOfStars = this.state.numberOfStars,
        correct = this.state.correct;
    return (
      <div id="game">
        <h1>Play Nine</h1>
        <hr/>
        <div className="clearfix">
          <StarsFrame numberOfStars={numberOfStars}/>
          <ButtonFrame selectedNumbers={selectedNumbers}
                       correct={correct}
                       checkAnswer={this.checkAnswer.bind(this)} />
          <AnswerFrame selectedNumbers={selectedNumbers}
                       unselectNumber={this.unselectNumber.bind(this)}/>
        </div>

        <NumbersFrame selectedNumbers={selectedNumbers}
                      selectNumber={this.selectNumber.bind(this)}/>

      </div>
    );
  }
}

render(<Game />, document.getElementById('container'))
