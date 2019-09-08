import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { setMovieOverviewOption } from 'Store/Actions/movieIndexActions';
import MovieIndexOverviewOptionsModalContent from './MovieIndexOverviewOptionsModalContent';

function createMapStateToProps() {
  return createSelector(
    (state) => state.addListMovie,
    (addListMovie) => {
      return addListMovie.overviewOptions;
    }
  );
}

function createMapDispatchToProps(dispatch, props) {
  return {
    onChangeOverviewOption(payload) {
      dispatch(setMovieOverviewOption(payload));
    }
  };
}

export default connect(createMapStateToProps, createMapDispatchToProps)(MovieIndexOverviewOptionsModalContent);
