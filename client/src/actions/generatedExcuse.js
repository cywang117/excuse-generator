import { likeExcuse } from './likeExcuse';
import { unlikeExcuse } from './unlikeExcuse';

export const setGeneratedExcuse = (excuse) => ({
  type: 'SET_GENERATED_EXCUSE',
  excuse
});

export const setGeneratedLiked = (isLiked) => ({
  type: 'SET_GENERATED_LIKE_TOGGLED',
  isLiked
});

export const setGeneratedId = (_id) => ({
  type: 'SET_GENERATED_ID',
  _id
});

export const fetchGeneratedExcuse = () => {
  return (dispatch) => {
    return fetch('/api/excuse')
      .then(res => res.json())
      .then(excuse => {
        dispatch(setGeneratedExcuse(excuse));
        dispatch(setGeneratedLiked(false));
        dispatch(setGeneratedId(null));
      });
  }
};

export const updateExcuseLikeAndId = (excuse, isLiked, _id) => {
  return (dispatch) => {
    if (!isLiked) {
      dispatch(likeExcuse(null, excuse, true));
    } else {
      dispatch(unlikeExcuse(null, excuse, true));
    }
  }
};