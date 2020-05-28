import { fetchTopExcuses } from './topExcuses';
import { fetchSessionLikes } from  './sessionLikes';

export const likeExcuse = (_id, excuse) => {
  return (dispatch) => {
    return fetch('/api/like', {
      method: 'POST',
      body: JSON.stringify({ _id, excuse }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      // .then(res => res.json())
      // .then(message => console.log(message)) // TODO: do something with message sent by server from liking item
      .then(() => {
        fetchSessionLikes()(dispatch);
        fetchTopExcuses()(dispatch);
      });
  }
};