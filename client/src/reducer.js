import { initialState } from './store';

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_GENERATED_EXCUSE':
      return { ...state, excuse: action.excuse };
      break;
    case 'SET_SESSION_LIKES':
      return { ...state, sessionLikes: action.sessionLikes };
      break;
    case 'SET_TOP_EXCUSES':
      return { ...state, topExcuses: action.topExcuses };
      break;
    case 'SET_GENERATED_LIKE_TOGGLED':
      return { ...state, generatedLiked: action.isLiked };
      break;
    case 'SET_GENERATED_ID':
      return { ...state, generatedId: action._id };
      break;
    case 'SET_STATUS_MESSAGE':
      return { ...state, message: action.message };
      break;
    default:
      return state;
  }
};

export default reducer;