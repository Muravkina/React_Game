import React, { Component } from 'react';
import {render} from 'react-dom';

var possibleCombinationSum = function(arr, n) {
  if (arr.indexOf(n) >= 0) { return true; }
  if (arr[0] > n) { return false; }
  if (arr[arr.length - 1] > n) {
    arr.pop();
    return possibleCombinationSum(arr, n);
  }
  var listSize = arr.length, combinationsCount = (1 << listSize)
  for (var i = 1; i < combinationsCount ; i++ ) {
    var combinationSum = 0;
    for (var j=0 ; j < listSize ; j++) {
      if (i & (1 << j)) { combinationSum += arr[j]; }
    }
    if (n === combinationSum) { return true; }
  }
  return false;
};

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
        usedNumbers = this.props.usedNumbers,
        selectNumber = this.props.selectNumber,
        className;

    for(let i = 1; i<= 9; i++) {
      className = `number selected-${(selectedNumbers.indexOf(i)>=0)}`;
      className += ` used-${usedNumbers.indexOf(i)>=0}`
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
        button = ( <button className="btn btn-success btn-lg"
                   onClick={this.props.acceptAnswer}>
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
        <br /><br />
        <button className="btn btn-warning btn-xs"
                onClick={this.props.redraw}
                disabled={this.props.redraws === 0}>
          <span className="glyphicon glyphicon-refresh"></span>
          &nbsp;
          {this.props.redraws}
        </button>
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

class DoneFrame extends Component {
  render() {
    return (
      <div className="well text-center">
        <h2>{this.props.doneStatus}</h2>
        <button className="btn btn-default"
                onClick={this.props.resetGame}>Play again</button>
      </div>
    );
  }
}

const initialState = {
  numberOfStars: Math.floor(Math.random()*9) + 1,
  selectedNumbers: [],
  corerect: null,
  usedNumbers: [],
  redraws: 5,
  doneStatus: null
}

class Game extends Component {
  constructor() {
    super();
    this.state = initialState;
  }
  resetGame () {
    this.setState(initialState);
  }
  randomNumber() {
    return Math.floor(Math.random()*9) + 1;
  }
  unselectNumber(clickedNumber) {
    let selectedNumbers = this.state.selectedNumbers,
        indeOfNumber = selectedNumbers.indexOf(clickedNumber);

    selectedNumbers.splice(indeOfNumber, 1);

    this.setState({selectedNumbers: selectedNumbers, correct: null});
  }
  selectNumber(clickedNumber) {
    if (this.state.selectedNumbers.indexOf(clickedNumber) < 0) {
      this.setState({selectedNumbers: this.state.selectedNumbers.concat(clickedNumber), correct: null})
    }
  }
  sumOfSelectedNumbers() {
    return this.state.selectedNumbers.reduce((p,n) => p + n, 0)
  }
  acceptAnswer() {
    //useNumbers
    var usedNumbers = this.state.usedNumbers.concat(this.state.selectedNumbers);
    this.setState({
      selectedNumbers: [],
      usedNumbers: usedNumbers,
      correct: null,
      numberOfStars: this.randomNumber(),
    }, function(){
      this.updateDoneStatus();
    });
  }
  checkAnswer() {
    this.setState({ correct: this.state.numberOfStars == this.sumOfSelectedNumbers() })
  }
  redraw() {
    if(this.state.redraws > 0) {
      this.setState({
        numberOfStars: this.randomNumber(),
        correct: null,
        selectedNumbers: [],
        redraws: this.state.redraws - 1
      }, function(){
        this.updateDoneStatus();
      });
    }
  }
  possibleSolutions () {
    var numberOfStars = this.state.numberOfStars,
        possibleNumbers = [],
        usedNumbers = this.state.usedNumbers;

    for ( let i = 0; i <= 9; i++) {
      if (usedNumbers.indexOf(i) < 0 ) {
        possibleNumbers.push(i);
      }
    }

    return  possibleCombinationSum(possibleNumbers, numberOfStars);
  }
  updateDoneStatus() {
    if (this.state.usedNumbers.length === 9) {
      this.setState({ doneStatus: 'Done. Nice!'});
      return
    } else if ( this.state.redraws === 0 && !this.possibleSolutions()) {
      this.setState({ doneStatus: 'Game Over!' })
    }
  }
  render() {
    let selectedNumbers = this.state.selectedNumbers,
        numberOfStars = this.state.numberOfStars,
        correct = this.state.correct,
        usedNumbers = this.state.usedNumbers,
        redraws = this.state.redraws,
        doneStatus = this.state.doneStatus,
        bottomFrame;

    if(doneStatus) {
      bottomFrame = <DoneFrame doneStatus={doneStatus}
                     resetGame={this.resetGame.bind(this)}/>;
    } else {
      bottomFrame = <NumbersFrame selectedNumbers={selectedNumbers}
                      usedNumbers={usedNumbers}
                      selectNumber={this.selectNumber.bind(this)}/>;
    }
    return (
      <div id="game">
        <h1>Play Nine</h1>
        <hr/>
        <div className="clearfix">
          <StarsFrame numberOfStars={numberOfStars}/>
          <ButtonFrame selectedNumbers={selectedNumbers}
                       correct={correct}
                       acceptAnswer={this.acceptAnswer.bind(this)}
                       redraw={this.redraw.bind(this)}
                       redraws={redraws}
                       checkAnswer={this.checkAnswer.bind(this)} />
          <AnswerFrame selectedNumbers={selectedNumbers}
                       unselectNumber={this.unselectNumber.bind(this)}/>
        </div>

        {bottomFrame}

      </div>
    );
  }
}

render(<Game />, document.getElementById('container'))
