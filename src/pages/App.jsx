import React, { Component } from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

// import {openDB} from '../utils/indexedDB';
import '../utils/indexedDB';

import './App.scss';
import Main from './Main';
import Edit from './Edit';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Route
          render={({ location }) => (
            <TransitionGroup>
              <CSSTransition
                key={location.key}
                classNames="fade"
                timeout={1000}>
                <Switch location={location}>
                  <Route
                    exact
                    path="/"
                    component={Main} />
                  <Route
                    exact
                    path="/main"
                    component={Main} />
                  <Route
                    exact
                    path="/edit"
                    component={Edit} />
                </Switch>
              </CSSTransition>            
            </TransitionGroup>
          )} />
      </BrowserRouter>
    );
  }
}

export default App;
