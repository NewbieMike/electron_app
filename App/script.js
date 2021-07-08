import React from 'react';
import { render } from 'react-dom';
//import AppDescription from './AppDescription';
const { BrowserWindow } = require('electron');

const SECONDS_IN_MINUTES = 60;
const STATUSES = {
  off: 'off',
  work: 'work',
  rest: 'rest'
};

class App extends React.Component {
  constructor(){
    super()
    this.state = { status: 'off',time: {}, seconds: 1201 };
    this.timer = 0;
    this.pause = false;
    this.startTimer = this.startTimer.bind(this);
    this.countDown = this.countDown.bind(this);
    this.leaveApp = this.leaveApp.bind(this);
    this.stopTimer = this.stopTimer.bind(this);
  }
  
  
  secondsToTime(secs) {
    let hours = Math.floor(secs / (SECONDS_IN_MINUTES * SECONDS_IN_MINUTES));

    let divisor_for_minutes = secs % (SECONDS_IN_MINUTES * SECONDS_IN_MINUTES);
    let minutes = Math.floor(divisor_for_minutes / SECONDS_IN_MINUTES);

    let divisor_for_seconds = divisor_for_minutes % SECONDS_IN_MINUTES;
    let seconds = Math.ceil(divisor_for_seconds);

    let obj = {
      "h": hours,
      "m": minutes,
      "s": seconds
    };
    return obj
  };
  componentDidMount() {
    let timeLeftVar = this.secondsToTime(this.state.seconds);
    this.setState({ time: timeLeftVar });
    
  }

  startTimer() {
    let status = STATUSES.work;
    if (this.timer == 0 && this.state.seconds > 0) {
      this.timer = setInterval(this.countDown, 1000);
    } else {
      console.log('newstate');
      status = STATUSES.rest;
    }
    this.setState({status});
  }
  countDown() {
    // Remove one second, set state so a re-render happens.
    let seconds = this.state.seconds - 1;
    if (seconds >= 0) {
      this.setState({
        time: this.secondsToTime(seconds),
        seconds: seconds,
      });
    }
    // Check if we're at zero.
    else { 
      //clearInterval(this.timer);
      if(this.state.status == STATUSES.rest){
        this.setState({status: STATUSES.work, seconds: 1201});
      } else {
        this.setState({status: STATUSES.rest, seconds: 21});
      }
      
    }
  }
  leaveApp(){
    window.close()
  }
  stopTimer(){
    console.log('stopped');
    this.timer === 0;
    this.state.seconds === 1200;
    this.setState({status: STATUSES.off});
  }
  render() {

    const { status } = this.state;
    const sec = this.state.time.s;
    const min = this.state.time.m;
    return (
      <div>
        <h1>Protect your eyes</h1>
        {(status === STATUSES.off) && <div>
          <p>According to optometrists in order to save your eyes, you should follow the 20/20/20. It means you should rest your eyes every 20 minutes for 20 seconds by looking more than 20 feet away.</p>
          <p>This app will help you track your time and inform you when it's time to rest.</p>
        </div>}
        {(status === STATUSES.work) && <img src="./images/work.png" />}
        {(status === STATUSES.rest) && <img src="./images/rest.png" />}
        {(status !== STATUSES.off) && <div className="timer">{min < 10 ? '0' + min : min} : {sec < 10 ? '0' + sec : sec}</div>}
        {(status === STATUSES.off) && <button className="btn" onClick={this.startTimer}>Start</button>}
        {(status !== STATUSES.off) && <button className="btn" onClick={this.stopTimer}>Stop</button>}
        <button className="btn btn-close" onClick={this.leaveApp}>X</button>
      </div>
    )
  };
};

render(<App />, document.querySelector('#app'));
