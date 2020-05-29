import { connect } from 'react-redux';
import LikedExcuseList from '../components/LikedExcuseList';
import { likeExcuse } from '../actions/likeExcuse';
import { unlikeExcuse } from '../actions/unlikeExcuse';
import { fetchSessionLikes } from '../actions/sessionLikes';
import { fetchTopExcuses } from '../actions/topExcuses';
import { updateExcuseLikeAndId } from '../actions/generatedExcuse';

const mapStateToProps = (state) => ({
  topExcuses: state.topExcuses,
  sessionLikes: state.sessionLikes,
  generatedId: state.generatedId,
  generatedLiked: state.generatedLiked
});

const mapDispatchToProps = (dispatch) => ({
  likeExcuse: (_id, excuse) =>  dispatch(likeExcuse(_id, excuse, false)),
  unlikeExcuse: (_id, excuse) => dispatch(unlikeExcuse(_id, excuse, false)),
  getSessionLikes: () => dispatch(fetchSessionLikes()),
  getTopExcuses: () => dispatch(fetchTopExcuses()),
  updateGenerated: (_id, excuse, isLiked) => dispatch(updateExcuseLikeAndId(excuse, isLiked, _id))
});

const LikedExcuseListContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(LikedExcuseList);

export default LikedExcuseListContainer;

