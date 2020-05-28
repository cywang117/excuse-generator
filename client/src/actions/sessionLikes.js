export const setSessionLikes = (sessionLikes) => ({
  type: 'SET_SESSION_LIKES',
  sessionLikes
});

export const fetchSessionLikes = () => {
  return (dispatch) => {
    return fetch('/api/likes/session')
      .then(res => res.json())
      .then(sessionLikes => dispatch(setSessionLikes(sessionLikes)));
  }
};