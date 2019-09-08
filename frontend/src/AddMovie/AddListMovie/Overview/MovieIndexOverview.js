import PropTypes from 'prop-types';
import React, { Component } from 'react';
import TextTruncate from 'react-text-truncate';
import dimensions from 'Styles/Variables/dimensions';
import fonts from 'Styles/Variables/fonts';
import MoviePoster from 'Movie/MoviePoster';
import styles from './MovieIndexOverview.css';

const columnPadding = parseInt(dimensions.movieIndexColumnPadding);
const columnPaddingSmallScreen = parseInt(dimensions.movieIndexColumnPaddingSmallScreen);
const defaultFontSize = parseInt(fonts.defaultFontSize);
const lineHeight = parseFloat(fonts.lineHeight);

// Hardcoded height beased on line-height of 32 + bottom margin of 10.
// Less side-effecty than using react-measure.
const titleRowHeight = 42;

function getContentHeight(rowHeight, isSmallScreen) {
  const padding = isSmallScreen ? columnPaddingSmallScreen : columnPadding;

  return rowHeight - padding;
}

class MovieIndexOverview extends Component {

  //
  // Lifecycle

  constructor(props, context) {
    super(props, context);

    this.state = {
    };
  }

  //
  // Render

  render() {
    const {
      style,
      title,
      year,
      overview,
      images,
      posterWidth,
      posterHeight,
      rowHeight,
      isSmallScreen
    } = this.props;

    const elementStyle = {
      width: `${posterWidth}px`,
      height: `${posterHeight}px`
    };

    const contentHeight = getContentHeight(rowHeight, isSmallScreen);
    const overviewHeight = contentHeight - titleRowHeight;

    return (
      <div className={styles.container} style={style}>
        <div className={styles.content}>
          <div className={styles.poster}>
            <div className={styles.posterContainer}>

              <MoviePoster
                className={styles.poster}
                style={elementStyle}
                images={images}
                size={250}
                lazy={false}
                overflow={true}
              />
            </div>
          </div>

          <div className={styles.info} style={{ maxHeight: contentHeight }}>
            <div className={styles.titleRow}>
              {title} ({year})
            </div>

            <div className={styles.details}>
              <TextTruncate
                line={Math.floor(overviewHeight / (defaultFontSize * lineHeight))}
                text={overview}
              />

            </div>
          </div>
        </div>
      </div>
    );
  }
}

MovieIndexOverview.propTypes = {
  style: PropTypes.object.isRequired,
  tmdbId: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  year: PropTypes.number.isRequired,
  overview: PropTypes.string.isRequired,
  monitored: PropTypes.bool.isRequired,
  status: PropTypes.string.isRequired,
  titleSlug: PropTypes.string.isRequired,
  images: PropTypes.arrayOf(PropTypes.object).isRequired,
  posterWidth: PropTypes.number.isRequired,
  posterHeight: PropTypes.number.isRequired,
  rowHeight: PropTypes.number.isRequired,
  overviewOptions: PropTypes.object.isRequired,
  showRelativeDates: PropTypes.bool.isRequired,
  shortDateFormat: PropTypes.string.isRequired,
  longDateFormat: PropTypes.string.isRequired,
  timeFormat: PropTypes.string.isRequired,
  isSmallScreen: PropTypes.bool.isRequired
};

export default MovieIndexOverview;
