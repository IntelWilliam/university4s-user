import React from 'react';
// import {Link} from 'react-router'
import EntryExam from 'src/client/modules/Moodle/Lessons/Entries/Types/EntryExam';
import EntryExamMultiple from 'src/client/modules/Moodle/Lessons/Entries/Types/EntryExamMultiple';
import EntryText from 'src/client/modules/Moodle/Lessons/Entries/Types/EntryText';

class EntryItem extends React.Component {
  constructor() {
    super();
    this.state = {
      selectType: null,
      isActive: false,
    };
  }

  // LABPRACTICE: 0,
  // VIDEO: 1,
  // AUDIO: 2,
  // TEXT: 3,
  // AUDIO_TEXT: 4,
  // PDF: 5,
  // LESSON_REF: 6,
  // EXAM_MULTIPLE: 7,
  // EXAM_ONLY: 8,
  // VIDEO_AKRON : 9

  newTab(uri) {
    const win = window.open(uri, '_blank');
    win.focus();
  }

  playAudioText(path, tittle, desciption) {
    const modal = document.getElementById('myModal2');
    const caption2 = document.getElementById('caption2');
    const caption3 = document.getElementById('caption3');
    const audio = document.getElementById('audio');

    audio.src = path;

    modal.style.display = 'flex';
    caption2.innerHTML = tittle;
    caption3.innerHTML = desciption;
  }
  closeModal2() {
    const audio = document.getElementById('audio');
    audio.src = '';
    const modal = document.getElementById('myModal2');
    modal.style.display = 'none';
  }

  playVideo(path, videoName) {
    const modal = document.getElementById('myModal');
    const captionText = document.getElementById('caption');
    const videoSrc = document.getElementById('video');

    videoSrc.src = path;

    modal.style.display = 'flex';
    captionText.innerHTML = videoName;
  }

  closeModal() {
    const videoSrc = document.getElementById('video');
    videoSrc.src = '';
    const modal = document.getElementById('myModal');
    modal.style.display = 'none';
  }

  goEntry() {
    switch (this.props.entry.entryType) {
      case 0: {
        const hrefPractice =
          '/user-area/practices/lessons/exercise/?levelName=' +
          this.props.entry.nameLevel +
          '&subLevelName=' +
          this.props.entry.nameSubLevel +
          '&subLevelId=' +
          this.props.entry.sublevelMoodleId +
          '&lessonName=' +
          this.props.entry.nameLesson +
          '&lessonId=' +
          this.props.entry.lessonMoodleId +
          '&lessonType=' +
          this.props.entry.labPracticeType +
          '&lessonIndex=1';
        this.context.router.push(hrefPractice);
        //Sentencias ejecutadas cuando el resultado de expresion coincide con valor1
        break;
      }
      case 2:
        this.playAudioText(this.props.entry.uriFile, null, null);
        break;
      case 9:
        this.playVideo(
          'http://devbooks.ibceducacion.com.s3-website-us-east-1.amazonaws.com/Finales-Akron/' +
            this.props.entry.uriFile,
          this.props.entry.name
        );
        break;
      case 1:
        this.playVideo(this.props.entry.uriFile, this.props.entry.name);
        // this.newTab(this.props.entry.uriFile)
        break;
      case 4:
        this.playAudioText(
          this.props.entry.uriFile,
          this.props.entry.name,
          this.props.entry.text
        );
        // this.newTab(this.props.entry.uriFile)
        break;
      case 3:
        if (this.state.isActive) {
          this.setState({ selectType: 3, isActive: false });
        } else {
          this.setState({ selectType: 3, isActive: true });
        }
        break;
      case 5: {
        // this.newTab(this.props.entry.uriFile)
        const viewPDF = '/user-area/pdfview/';
        this.context.router.push({
          pathname: viewPDF,
          query: {
            name: this.props.entry.name,
            ultTo: this.props.entry.uriFile,
            lessonId: this.props.location.lessonId,
            subName: this.props.location.subName,
            lessonIndex: this.props.location.lessonIndex,
          },
        });
        break;
      }
      case 6: {
        // console.log('this.props.entry', this.props.entry);
        const hrefWebPractica =
          '/user-area/practice-web/level/' +
          this.props.entry.levelWebLevelId +
          '/sub-level/' +
          this.props.entry.subWebSublevelId +
          '/lesson/' +
          this.props.entry.lessonWebLessonId +
          '/levelName/' +
          this.props.entry.nameSubLevel;
        this.context.router.push(hrefWebPractica);
        break;
      }
      case 7:
        if (this.state.isActive) {
          this.setState({ selectType: 7, isActive: false });
        } else {
          this.setState({ selectType: 7, isActive: true });
        }
        break;
      case 8:
        if (this.state.isActive) {
          this.setState({ selectType: 8, isActive: false });
        } else {
          this.setState({ selectType: 8, isActive: true });
        }
        break;
    }
  }

  render() {
    let image = '/images/exam-icon.png';
    switch (this.props.entry.entryType) {
      case 0:
        image = '/images/practice.png';
        //Sentencias ejecutadas cuando el resultado de expresion coincide con valor1
        break;
      case 1:
      case 2:
      case 4:
      case 9:
        image = '/images/video-course.png';
        break;
      case 3:
        image = '/images/text-course.png';
        break;
      case 5:
        image = '/images/pdf-course.png';
        break;
      case 6:
        image = '/images/practice-web.png';
        break;
      case 7:
      case 8:
        image = '/images/exam-icon.png';
        break;
    }

    return (
      <div className='col-xs-12'>
        <div
          className='col-xs-12 course-content mousePoint'
          onClick={this.goEntry.bind(this)}
        >
          <img className='icon-course' src={image} />
          <span className='course-content-title'>{this.props.entry.name}</span>
        </div>

        <div id='myModal' className='videoModal'>
          <span className='closeModal' onClick={this.closeModal.bind(this)}>
            &times;
          </span>
          <div className='col-xs-8 col-xs-offset-2'>
            <div className='row'>
              <video width='100%' height='100%' id='video' autoPlay controls>
                <source type='video/mp4' />
                Your browser does not support the video tag.
              </video>
              <div id='caption'></div>
            </div>
          </div>
        </div>

        <div id='myModal2' className='videoModal'>
          <span className='closeModal' onClick={this.closeModal2.bind(this)}>
            &times;
          </span>

          {/* <div className="col-xs-8 col-xs-offset-2">
              <div className="info-title-container">
              <div className="row"> */}

          {/* </div>
              </div>
            </div> */}

          <div
            className='col-xs-8 col-xs-offset-2 margin-audio-text'
            style={{ color: 'white' }}
          >
            <div className='info-title-container margin-audio-text'>
              <div className='row'>
                <div className='col-xs-12 margin-audio-text'>
                  <span id='caption2' className='info-title'></span>
                </div>
                <div className='col-xs-12 margin-audio-text'>
                  <span id='caption3' className='info-description'></span>
                </div>
              </div>
            </div>

            <div className='row margin-audio-text'>
              <audio id='audio' controls autoPlay style={{ width: '100%' }}>
                <source type='audio/mpeg' />
              </audio>
            </div>
          </div>
        </div>

        {(() => {
          if (this.state.selectType == 7 && this.state.isActive) {
            return <EntryExamMultiple entry={this.props.entry} />;
          }
        })()}

        {(() => {
          if (this.state.selectType == 8 && this.state.isActive) {
            return <EntryExam entry={this.props.entry} />;
          }
        })()}

        {(() => {
          if (this.state.selectType == 3 && this.state.isActive) {
            return <EntryText entry={this.props.entry} />;
          }
        })()}
      </div>
    );
  }
}

export default EntryItem;

EntryItem.contextTypes = {
  router: React.PropTypes.object,
};
