import React, { Component } from 'react';
import { padStart } from 'lodash';
import { weekDayArray, monthArray } from '../../../../utils/date';
import './index.scss';

class Timer extends Component {
  constructor(props) {
    super(props);
    this.now = new Date();
    this.state = {
      now: new Date()
    }
  }
  
  componentDidMount() {
    this.timer = setInterval(() => {
      // const now = new Date();
      this.setState({
        now: new Date()
      });
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
    this.timer = null;
  }

  render() {
    return (
      <div className="timer">
        Today is {weekDayArray[this.state.now.getDay()]}
        <br />
        <span className="timer__date">
          {`${monthArray[this.state.now.getMonth()]} ${this.state.now.getDate()}`}
        </span>
        <i className="timer__split" />
        <span className="timer__clock">
          {`${padStart(this.state.now.getHours(), 2, '0')}:${padStart(this.state.now.getMinutes(), 2, '0')}:${padStart(this.state.now.getSeconds(), 2, '0')}`}
        </span>
      </div>
    );
  }
}

export default Timer;
