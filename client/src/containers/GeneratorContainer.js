import { connect } from 'react-redux';
import Generator from '../components/Generator';
import { fetchGeneratedExcuse, updateExcuseLikeAndId } from '../actions/generatedExcuse';

const mapStateToProps = (state) => ({
  excuse: state.excuse,
  isLiked: state.generatedLiked,
  id: state.generatedId
});

const mapDispatchToProps = (dispatch) => ({
  generateExcuse: () => dispatch(fetchGeneratedExcuse()),
  updateExcuseStatus: (excuse, isLiked, _id) => dispatch(updateExcuseLikeAndId(excuse, isLiked, _id))
});

const GeneratorContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Generator);

export default GeneratorContainer;