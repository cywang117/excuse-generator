import { fetchTopExcuses } from './topExcuses';
import { fetchSessionLikes } from './sessionLikes';
import { setStatus } from './statusMessage';
import { setGeneratedLiked, setGeneratedId } from './generatedExcuse';
import store from '../store';

export const unlikeExcuse = (_id, excuse, isGenerated) => {
  return (dispatch) => {
    return fetch('/api/unlike', {
      method: 'POST',
      body: JSON.stringify({ _id, excuse }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(res => res.json())
      .then(message => {
        dispatch(setStatus(message));
        if (isGenerated) {
          dispatch(setGeneratedLiked(false));
          let lastMessageId = store.getState().message._id;
          lastMessageId ?
            dispatch(setGeneratedId(lastMessageId)) :
            dispatch(setGeneratedId(null));
        }
      })
      .then(() => {
        dispatch(fetchSessionLikes());
        dispatch(fetchTopExcuses());
      });
  }
};