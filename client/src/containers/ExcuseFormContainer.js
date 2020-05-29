import { connect } from 'react-redux';
import ExcuseForm from '../components/ExcuseForm';
import addExcuse from '../actions/addExcuse';

const mapDispatchToProps = (dispatch) => ({
  addExcuse: (excuse) => dispatch(addExcuse(excuse))
});

const ExcuseFormContainer = connect(
  null,
  mapDispatchToProps
)(ExcuseForm);

export default ExcuseFormContainer;