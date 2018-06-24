import ReactDOM from 'react-dom';
import React from 'react';
import { Provider } from 'react-redux';
import App from './pages/App';
import configureStore from './store';

const store = configureStore();

ReactDOM.render(<Provider store={store}><App /></Provider>, document.getElementById('daygram'));
