import { fetchTopExcuses } from './topExcuses';
import { fetchSessionLikes } from './sessionLikes';

export const unlikeExcuse = (_id) => {
  return (dispatch) => {
    return fetch('/api/unlike', {
      method: 'POST',
      body: JSON.stringify({ _id }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      // .then(res => res.json())
      // .then(message => console.log(message)) // TODO: do something with message sent by server from unliking item
      .then(() => {
        fetchSessionLikes()(dispatch);
        fetchTopExcuses()(dispatch);
      });
  }
};