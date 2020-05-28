export const setGeneratedExcuse = (excuse) => ({
  type: 'SET_GENERATED_EXCUSE',
  excuse
});

export const fetchGeneratedExcuse = () => {
  return (dispatch) => {
    return fetch('/api/excuse')
      .then(res => res.json())
      .then(excuse => dispatch(setGeneratedExcuse(excuse)));
  }
};