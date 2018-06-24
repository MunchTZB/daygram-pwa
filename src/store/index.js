import { applyMiddleware, createStore, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import reducers from './reducers';

export default function configureStore() {
  return createStore(combineReducers(reducers), applyMiddleware(thunk));
}
