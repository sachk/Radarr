import { createAction } from 'redux-actions';
import getSectionState from 'Utilities/State/getSectionState';
import updateSectionState from 'Utilities/State/updateSectionState';
import createFetchHandler from './Creators/createFetchHandler';
import sortByName from 'Utilities/Array/sortByName';
import { createThunk, handleThunks } from 'Store/thunks';
import { filterBuilderTypes, filterBuilderValueTypes, sortDirections } from 'Helpers/Props';
import createSetSettingValueReducer from './Creators/Reducers/createSetSettingValueReducer';
import createSetTableOptionReducer from './Creators/Reducers/createSetTableOptionReducer';
import createSetClientSideCollectionSortReducer from './Creators/Reducers/createSetClientSideCollectionSortReducer';
import createSetClientSideCollectionFilterReducer from './Creators/Reducers/createSetClientSideCollectionFilterReducer';
import createHandleActions from './Creators/createHandleActions';
import { filters, filterPredicates, sortPredicates } from './movieActions';

//
// Variables

export const section = 'addListMovie';

//
// State

export const defaultState = {
  isFetching: false,
  isPopulated: false,
  error: null,
  isAdding: false,
  isAdded: false,
  addError: null,
  items: [],
  sortKey: 'sortTitle',
  sortDirection: sortDirections.ASCENDING,
  secondarySortKey: 'sortTitle',
  secondarySortDirection: sortDirections.ASCENDING,
  view: 'posters',

  defaults: {
    rootFolderPath: '',
    monitor: 'true',
    qualityProfileId: 0,
    tags: []
  },

  posterOptions: {
    detailedProgressBar: false,
    size: 'large',
    showTitle: false,
    showMonitored: true,
    showQualityProfile: true,
    showSearchAction: false
  },

  overviewOptions: {
    detailedProgressBar: false,
    size: 'medium',
    showMonitored: true,
    showStudio: true,
    showQualityProfile: true,
    showAdded: false,
    showPath: false,
    showSizeOnDisk: false,
    showSearchAction: false
  },

  tableOptions: {
    showSearchAction: false
  },

  columns: [
    {
      name: 'select',
      columnLabel: 'select',
      isSortable: false,
      isVisible: true,
      isModifiable: false
    },
    {
      name: 'status',
      columnLabel: 'Status',
      isSortable: true,
      isVisible: true,
      isModifiable: false
    },
    {
      name: 'sortTitle',
      label: 'Movie Title',
      isSortable: true,
      isVisible: true,
      isModifiable: false
    },
    {
      name: 'studio',
      label: 'Studio',
      isSortable: true,
      isVisible: true
    },
    {
      name: 'qualityProfileId',
      label: 'Quality Profile',
      isSortable: true,
      isVisible: true
    },
    {
      name: 'added',
      label: 'Added',
      isSortable: true,
      isVisible: false
    },
    {
      name: 'inCinemas',
      label: 'In Cinemas',
      isSortable: true,
      isVisible: false
    },
    {
      name: 'physicalRelease',
      label: 'Physical Release',
      isSortable: true,
      isVisible: false
    },
    {
      name: 'path',
      label: 'Path',
      isSortable: true,
      isVisible: false
    },
    {
      name: 'genres',
      label: 'Genres',
      isSortable: false,
      isVisible: false
    },
    {
      name: 'ratings',
      label: 'Rating',
      isSortable: true,
      isVisible: false
    },
    {
      name: 'certification',
      label: 'Certification',
      isSortable: false,
      isVisible: false
    },
    {
      name: 'tags',
      label: 'Tags',
      isSortable: false,
      isVisible: false
    },
    {
      name: 'actions',
      columnLabel: 'Actions',
      isVisible: true,
      isModifiable: false
    }
  ],

  sortPredicates: {
    ...sortPredicates,

    studio: function(item) {
      const studio = item.studio;

      return studio ? studio.toLowerCase() : '';
    },

    sizeOnDisk: function(item) {
      const { statistics = {} } = item;

      return statistics.sizeOnDisk;
    },

    ratings: function(item) {
      const { ratings = {} } = item;

      return ratings.value;
    }
  },

  selectedFilterKey: 'all',

  filters,
  filterPredicates,

  filterBuilderProps: [
    {
      name: 'monitored',
      label: 'Monitored',
      type: filterBuilderTypes.EXACT,
      valueType: filterBuilderValueTypes.BOOL
    },
    {
      name: 'status',
      label: 'Status',
      type: filterBuilderTypes.EXACT,
      valueType: filterBuilderValueTypes.SERIES_STATUS
    },
    {
      name: 'studio',
      label: 'Studio',
      type: filterBuilderTypes.ARRAY,
      optionsSelector: function(items) {
        const tagList = items.reduce((acc, movie) => {
          acc.push({
            id: movie.studio,
            name: movie.studio
          });

          return acc;
        }, []);

        return tagList.sort(sortByName);
      }
    },
    {
      name: 'qualityProfileId',
      label: 'Quality Profile',
      type: filterBuilderTypes.EXACT,
      valueType: filterBuilderValueTypes.QUALITY_PROFILE
    },
    {
      name: 'added',
      label: 'Added',
      type: filterBuilderTypes.DATE,
      valueType: filterBuilderValueTypes.DATE
    },
    {
      name: 'inCinemas',
      label: 'In Cinemas',
      type: filterBuilderTypes.DATE,
      valueType: filterBuilderValueTypes.DATE
    },
    {
      name: 'physicalRelease',
      label: 'Physical Release',
      type: filterBuilderTypes.DATE,
      valueType: filterBuilderValueTypes.DATE
    },
    {
      name: 'path',
      label: 'Path',
      type: filterBuilderTypes.STRING
    },
    {
      name: 'sizeOnDisk',
      label: 'Size on Disk',
      type: filterBuilderTypes.NUMBER,
      valueType: filterBuilderValueTypes.BYTES
    },
    {
      name: 'genres',
      label: 'Genres',
      type: filterBuilderTypes.ARRAY,
      optionsSelector: function(items) {
        const tagList = items.reduce((acc, movie) => {
          movie.genres.forEach((genre) => {
            acc.push({
              id: genre,
              name: genre
            });
          });

          return acc;
        }, []);

        return tagList.sort(sortByName);
      }
    },
    {
      name: 'ratings',
      label: 'Rating',
      type: filterBuilderTypes.NUMBER
    },
    {
      name: 'certification',
      label: 'Certification',
      type: filterBuilderTypes.EXACT
    },
    {
      name: 'tags',
      label: 'Tags',
      type: filterBuilderTypes.ARRAY,
      valueType: filterBuilderValueTypes.TAG
    }
  ]
};

export const persistState = [
  'addListMovie.defaults'
];

//
// Actions Types

export const FETCH_LIST_MOVIES = 'addListMovie/fetchListMovies';
export const FETCH_DISCOVER_MOVIES = 'addListMovie/fetchDiscoverMovies';
export const SET_LIST_MOVIE_VALUE = 'addListMovie/setListMovieValue';
export const CLEAR_LIST_MOVIE = 'addListMovie/clearListMovie';
export const SET_LIST_MOVIE_DEFAULT = 'addListMovie/setListovieDefault';

export const SET_LIST_MOVIE_SORT = 'addListMovie/setListMovieSort';
export const SET_LIST_MOVIE_FILTER = 'addListMovie/setListMovieFilter';
export const SET_LIST_MOVIE_VIEW = 'addListMovie/setListMovieView';
export const SET_LIST_MOVIE_TABLE_OPTION = 'addListMovie/setListMovieTableOption';
export const SET_LIST_MOVIE_POSTER_OPTION = 'addListMovie/setListMoviePosterOption';
export const SET_LIST_MOVIE_OVERVIEW_OPTION = 'addListMovie/setListMovieOverviewOption';

//
// Action Creators

export const fetchListMovies = createThunk(FETCH_LIST_MOVIES);
export const fetchDiscoverMovies = createThunk(FETCH_DISCOVER_MOVIES);
export const clearListMovie = createAction(CLEAR_LIST_MOVIE);
export const setListMovieDefault = createAction(SET_LIST_MOVIE_DEFAULT);

export const setListMovieSort = createAction(SET_LIST_MOVIE_SORT);
export const setListMovieFilter = createAction(SET_LIST_MOVIE_FILTER);
export const setListMovieView = createAction(SET_LIST_MOVIE_VIEW);
export const setListMovieTableOption = createAction(SET_LIST_MOVIE_TABLE_OPTION);
export const setListMoviePosterOption = createAction(SET_LIST_MOVIE_POSTER_OPTION);
export const setListMovieOverviewOption = createAction(SET_LIST_MOVIE_OVERVIEW_OPTION);

export const setListMovieValue = createAction(SET_LIST_MOVIE_VALUE, (payload) => {
  return {
    section,
    ...payload
  };
});

//
// Action Handlers

export const actionHandlers = handleThunks({

  [FETCH_LIST_MOVIES]: createFetchHandler(section, '/netimport/movies'),

  [FETCH_DISCOVER_MOVIES]: createFetchHandler(section, '/movies/discover')

});

//
// Reducers

export const reducers = createHandleActions({

  [SET_LIST_MOVIE_VALUE]: createSetSettingValueReducer(section),

  [SET_LIST_MOVIE_DEFAULT]: function(state, { payload }) {
    const newState = getSectionState(state, section);

    newState.defaults = {
      ...newState.defaults,
      ...payload
    };

    return updateSectionState(state, section, newState);
  },

  [SET_LIST_MOVIE_SORT]: createSetClientSideCollectionSortReducer(section),
  [SET_LIST_MOVIE_FILTER]: createSetClientSideCollectionFilterReducer(section),

  [SET_LIST_MOVIE_VIEW]: function(state, { payload }) {
    return Object.assign({}, state, { view: payload.view });
  },

  [SET_LIST_MOVIE_TABLE_OPTION]: createSetTableOptionReducer(section),

  [SET_LIST_MOVIE_POSTER_OPTION]: function(state, { payload }) {
    const posterOptions = state.posterOptions;

    return {
      ...state,
      posterOptions: {
        ...posterOptions,
        ...payload
      }
    };
  },

  [SET_LIST_MOVIE_OVERVIEW_OPTION]: function(state, { payload }) {
    const overviewOptions = state.overviewOptions;

    return {
      ...state,
      overviewOptions: {
        ...overviewOptions,
        ...payload
      }
    };
  },

  [CLEAR_LIST_MOVIE]: function(state) {
    const {
      defaults,
      ...otherDefaultState
    } = defaultState;

    return Object.assign({}, state, otherDefaultState);
  }

}, defaultState, section);
