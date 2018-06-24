import React, { Component } from 'react';
import BottomBar from './bottomBar';
import List from './list';
import './index.scss';

class Main extends Component {
  render() {
    return (
      <div className="g-fullscreen main">
        <List />
        <BottomBar />
      </div>
    );
  }
}

export default Main;
