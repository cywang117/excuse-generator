import { initialState } from './store';

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_GENERATED_EXCUSE':
      return Object.assign({}, state, { excuse: action.excuse });
      break;
    case 'SET_SESSION_LIKES':
      return Object.assign({}, state, { sessionLikes: action.sessionLikes });
      break;
    case 'SET_TOP_EXCUSES':
      return Object.assign({}, state, { topExcuses: action.topExcuses });
      break;
    default:
      return state;
  }
};

export default reducer;