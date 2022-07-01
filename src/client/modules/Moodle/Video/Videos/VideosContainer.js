import React from 'react';
import Constants from 'src/client/Constants/Constants';

export default class VideosContainer extends React.Component {
  constructor() {
    super();
    this.state = {
      videoPath: null,
      thumbPath: null,
    };
  }

  imageNotFound(event) {
    this.setState({ thumbPath: '/images/Videos_default.png' });
  }

  componentWillMount() {
    const cat = this.props.category;
    const pathCat =
      cat == 'R' ? 'reforzamiento/' : cat == 'T' ? 'conversacion/' : null;
    const levelname = this.props.levelName.toLowerCase();
    const SubLevel =
      this.props.subLevelIndex == 1
        ? '_i/'
        : this.props.subLevelIndex == 2
        ? '_ii/'
        : this.props.subLevelIndex == 3
        ? '_iii/'
        : this.props.subLevelIndex == 4
        ? '_iv/'
        : null;
    const pathLevel = levelname + SubLevel;
    const videoHtml = this.props.video.html_code;

    const videoIndex = videoHtml.substring(
      videoHtml.search('/lesson_') + 8,
      videoHtml.search('.mp4')
    );

    const videoName = 'lesson_' + videoIndex + '.mp4';
    const thumbName = 'lesson_' + videoIndex + '.png';
    const VIDEO_URL =
      'http://devbooks.ibceducacion.com.s3-website-us-east-1.amazonaws.com/Finales-Akron/';

    if (cat == 'C') {
      var videoP = VIDEO_URL + pathLevel + videoName;
      var thumbP = VIDEO_URL + pathLevel + thumbName;
    } else {
      var videoP = VIDEO_URL + pathCat + pathLevel + videoName;
      var thumbP = VIDEO_URL + pathCat + pathLevel + thumbName;
    }

    // if (cat == "C"){
    //   var videoP = `https://akronenglish1.com/api/privados/videos/` + pathLevel + videoName
    //   var thumbP = `https://akronenglish1.com/api/privados/videos/` + pathLevel + thumbName
    // }else{
    //   var videoP = `https://akronenglish1.com/api/privados/videos/` + pathCat + pathLevel + videoName
    //   var thumbP = `https://akronenglish1.com/api/privados/videos/` + pathCat + pathLevel + thumbName
    // }

    this.setState({ videoPath: videoP, thumbPath: thumbP });
  }

  playVideo() {
    this.props.playVideo.call(
      null,
      this.state.videoPath,
      this.props.video.spanish_statement,
      this.props.subLevelIndex,
      this.props.videoIndexOrLesson + 1
    );
  }

  render() {
    return (
      <div className='col-xs-12 col-sm-3 card-container presentation-main'>
        <div
          className='card'
          id='videoCard'
          onClick={this.playVideo.bind(this)}
        >
          <div className='image-container color-video-clase paddin-image'>
            {/* <div className="image-container color-video-clase paddin-image" onClick={this.openModal.bind(this)}> */}
            <img
              src={this.state.thumbPath}
              onError={this.imageNotFound.bind(this)}
            />
          </div>

          <div className='card-text-container videos-cards'>
            <span className='video-card-text'>
              {this.props.video.spanish_statement}
            </span>
          </div>
        </div>
      </div>
    );
  }
}

VideosContainer.contextTypes = {
  router: React.PropTypes.object,
};
