export const setTopExcuses = (topExcuses) => ({
  type: 'SET_TOP_EXCUSES',
  topExcuses
});

export const fetchTopExcuses = () => {
  return (dispatch) => {
    return fetch('/api/likes')
      .then(res => res.json())
      .then(topExcuses => dispatch(setTopExcuses(topExcuses)));
  }
};