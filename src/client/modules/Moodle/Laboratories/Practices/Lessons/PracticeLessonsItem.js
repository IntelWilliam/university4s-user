import React from 'react';
import { Link } from 'react-router';
import Constants from 'src/client/Constants/Constants';
import LessonsStore from 'src/client/modules/Moodle/Lessons/LessonsStore';

class LessonItem extends React.Component {
  constructor() {
    super();
    this.state = {
      images: [],
    };
  }

  componentWillMount() {
    this.loadImageData();
  }

  loadImageData() {
    LessonsStore.getImage(this.props.lessonId, (err, response) => {
      if (err) return err;
      // se cambia el estado allLessons con los nuevos usuarios
      const OLD_URL = 'https://image.re-cosmo.com/source';
      const NEW_URL =
        'https://devimage.ibceducacion.com.s3-website-us-east-1.amazonaws.com';
      const newUrlResponse = response;
      newUrlResponse.imageUrl = newUrlResponse.imageUrl.replace(
        OLD_URL,
        NEW_URL
      );
      newUrlResponse.smallImage = newUrlResponse.smallImage.replace(
        OLD_URL,
        NEW_URL
      );
      this.setState({ images: newUrlResponse });
    });
  }

  render() {
    let banner = '/images/lessonimage.png';
    let href =
      Constants.ADMIN_PATH +
      `/user-area/practices/lessons/Lesson/?levelName=${this.props.levelName}&subLevelName=${this.props.subLevelName}&subLevelId=${this.props.subId}&lessonName=${this.props.lessonName}&lessonId=${this.props.lessonId}&lessonIndex=${this.props.lessonIndex}`;

    if (this.state.images) {
      banner = this.state.images.smallImage;
    }

    return (
      <div className='col-xs-12 col-md-3 col-sm-6 card-container'>
        <Link to={href}>
          <div className='card'>
            <div className='image-container'>
              <img src={banner} />
            </div>
            <div className='card-text-container practices-title-card'>
              <div className='row'>
                <div className='col-xs-12'>
                  <div className='header-navigation'>
                    <span className='navgation-item practices-navigation practices-navigation-item'>
                      {this.props.subLevelName}
                    </span>
                    <span className='row-navigation navgation-item practices-navigation practices-navigation-item'>
                      Lección {this.props.lessonIndex}
                    </span>
                  </div>
                </div>
                <div className='col-xs-12'>
                  <span className='card-text-title practices-navigation'>
                    {this.props.lessonName}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Link>
      </div>
    );
  }
}

export default LessonItem;
