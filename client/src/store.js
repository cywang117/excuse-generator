import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import reducer from './reducer';

export const initialState = {
  excuse: '',
  topExcuses: [],
  sessionLikes: {}
}

export const store = createStore(
  reducer,
  initialState,
  applyMiddleware(thunk)
);