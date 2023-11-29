import React from 'react';
import Footer from 'src/client/modules/layout/footer';
// import Names from 'src/client/Constants/PagesNames'
import { Link } from 'react-router';
import Constants from 'src/client/Constants/Constants';
import HeaderPage from 'src/client/modules/Moodle/HeaderPage';
import LessonStore from 'src/client/modules/Moodle/Lessons/Lesson/LessonStore';
// import LessonItem from 'src/client/modules/Moodle/Lessons/Lesson/LessonItem'
import NextEvents from 'src/client/modules/Moodle/NextEvents/NextEvents';
import FrontTextsActions from 'src/client/modules/FrontTexts/FrontTextsActions';

export default class Lesson extends React.Component {
  constructor() {
    super();
    this.state = {
      allSections: [],
      images: [],
      pageTexts: [],
    };
  }

  loadPageTexts() {
    FrontTextsActions.getTexts('CURSE_LESSON', (err, body) => {
      // si llega un error
      if (err) {
        console.log('error', err);
      } else {
        // console.log('body.texts', body.texts);
        // se setea el mensaje a mostrar
        this.setState({ pageTexts: body.texts });
      }
    });
  }

  componentWillMount() {
    this.loadPageTexts();
    // this.loadSections()
    this.loadImageData();
  }

  componentDidMount() {
    this.goTop();
  }

  goTop() {
    $('html, body').animate(
      {
        scrollTop: 0,
      },
      'slow'
    );
  }

  loadImageData() {
    LessonStore.getImage(
      this.props.location.query.lessonId,
      (err, response) => {
        if (err) return err;
        // se cambia el estado allLessons con los nuevos usuarios
        this.setState({ images: response });
      }
    );
  }

  // loadSections() {
  //
  //   // se inician las variables necesarias para la pagina
  //   let params = {}
  //
  //   if (this.props.location.query.lessonId) {
  //     params['lessonId'] = this.props.location.query.lessonId
  //     params['limit'] = 100
  //   }
  //   LessonStore.getSections(params, (err, response) => {
  //     if (err)
  //     return
  //     // se cambia el estado allLessons con los nuevos usuarios
  //     this.setState({allSections: response.data})
  //   })
  // }

  goBack() {
    window.history.back();
  }

  iframeChange() {
    let iframe = document.getElementById('iframeBooks');
    iframe.style.height = '1000px';

    $('#iframeBooks').attr('allowfullscreen', 'true');
    $('#iframeBooks').attr('webkitallowfullscreen', 'true');
    $('#iframeBooks').attr('mozallowfullscreen', 'true');

    setTimeout(() => {
      this.afterloadIframe();
    }, 100);
  }

  afterloadIframe() {
    var iFrame = document.getElementById('iframeBooks');
    var iFrameBody;
    if (iFrame.contentDocument) {
      // FF
      iFrameBody =
        iFrame.contentDocument.getElementsByTagName('body')[0].children[0];
    } else if (iFrame.contentWindow) {
      // IE
      iFrameBody =
        iFrame.contentWindow.document.getElementsByTagName('body')[0]
          .children[0];
    }

    if (iFrameBody) {
      document.getElementById('iframeBooks').style.height =
        iFrameBody.offsetHeight + 'px';
    }
  }

  romanize(num) {
    var lookup = { v: 5, iv: 4, i: 1 },
      roman = '',
      i;
    for (i in lookup) {
      while (num >= lookup[i]) {
        roman += i;
        num -= lookup[i];
      }
    }
    return roman;
  }

  render() {
    let sublevelIndex =
      this.props.location.query.subName[
        this.props.location.query.subName.length - 1
      ];

      console.log('sublevelIndex', sublevelIndex);
      var levelName = this.props.location.query.levelName.toLowerCase().replace(/\s+/g, '_'); // Esto reemplaza todos los espacios por guiones bajos
      var bookSrc = 'https://university-4s.s3.amazonaws.com/new_books_course/' + 
                    levelName +
                    '_' +
                    this.romanize(parseInt(sublevelIndex)) +
                    '/lesson_' +
                    this.props.location.query.lessonIndex +
                    '/1.html';
                    
    console.log('bookSrc', bookSrc);

    let subName = this.props.location.query.subName;
    let subId = this.props.location.query.subId;

    let navigationArray = [
      {
        name: this.state.pageTexts[0],
        // 'name': 'Inicio',
        url: null,
      },
      {
        name: this.state.pageTexts[1],
        // 'name': 'Curso',
        url: Constants.ADMIN_PATH + `/user-area/`,
      },
      {
        name: subName,
        url:
          Constants.ADMIN_PATH +
          `/user-area/course/lessons/?levelName=${this.props.location.query.levelName}&subLevelName=${subName}&subLevelId=${subId}`,
      },
      {
        name: this.props.location.query.lessonName,
        url: null,
      },
    ];
    let headerInfo = {
      title: this.props.location.query.lessonName,
      translation: this.props.location.query.subName,
    };

    let href = '/user-area/exams/';

    return (
      <div
        style={{
          background: '#F6F7F7',
        }}
      >
        <HeaderPage navigation={navigationArray} headerInfo={headerInfo} />
        <div
          className='container'
          style={{
            marginTop: '1em',
          }}
        >
          <div className='col-xs-12 section-name'>
            <div className='col-xs-12'>
              <div className='row'>
                <div className='col-xs-12'>
                  <div className='info-title-section-container'>
                    <div
                      className='pdf-icon-container'
                      style={{
                        height: '2.4em',
                      }}
                    >
                      <img className='pdf-icon' src='/images/course.png' />
                    </div>
                    <div className='info-title-container'>
                      <span className='info-title tittle-blue'>
                        {this.props.location.query.lessonName}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='col-xs-12'>
            <div className='row'>
              <div className='col-md-3 col-xs-12'>
                <NextEvents />

                <div className='card-next-event col-xs-12'>
                  <div className='row'>
                    <div className='col-xs-12 header-card header-calendar'>
                      <span className='card-next-event-title'>
                        {this.state.pageTexts[3]}
                      </span>
                      {/* <span className="card-next-event-title">Navegación</span> */}
                    </div>
                    <div className='col-xs-12 body-card'>
                      <div className='col-xs-12'>
                        <span className='card-next-event-title-body'>
                          {this.state.pageTexts[4]}
                        </span>
                        {/* <span className="card-next-event-title-body">Página principal</span> */}
                      </div>
                      <div className='col-xs-12 navegation-container'>
                        <div className='arrow-down-navegation'></div>
                        <span className='navegation-2'>
                          {this.state.pageTexts[5]}
                        </span>
                        {/* <span className="navegation-2">Cursos</span> */}
                      </div>
                      <div className='col-xs-12 navegation-container navegation-container-3'>
                        <div className='arrow-down-navegation'></div>
                        <span className='navegation-2'>
                          {this.props.location.query.subName}
                        </span>
                      </div>
                      <div className='col-xs-12 navegation-container navegation-container-4'>
                        <span className='navegation-2'>
                          {this.props.location.query.lessonName}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div id='iframeContainer' className='col-md-9 col-xs-12'>
                {/* {this.state.allSections.map((section, index) => {
            if(section.name != 'Solucionario')
              return <LessonItem
                key={index}
                location={this.props.location.query}
                sectionIndex={index}
                sectionName={section.name}
                lessonIndex={this.props.location.lessonIndex}
                sectionId={section._id}/>
          })} */}

                <iframe
                  style={{ height: '1500px' }}
                  id='iframeBooks'
                  onLoad={this.iframeChange.bind(this)}
                  className='iframe-books'
                  src={bookSrc}
                  allowfullscreen='true'
                  webkitallowfullscreen='true'
                  mozallowfullscreen='true'
                ></iframe>
                {/* <iframe style={{height: '5000px'}}  id="iframeBooks" onLoad={this.iframeChange.bind(this)} className="iframe-books" src="/api/new-books-curse/inicial_i/lesson_1/1.html"></iframe> */}
              </div>
            </div>
          </div>

          {(() => {
            if (this.props.location.query.lastLesson == 'true')
              return (
                <div className='col-xs-12 section-name'>
                  <div className='col-xs-12'>
                    <div className='row'>
                      <Link to={href} className='col-xs-12 action-container'>
                        <button className='next-button mousePoint'>
                          {this.state.pageTexts[6]}
                        </button>
                        {/* <button className="next-button mousePoint">Ir a exámen</button> */}
                      </Link>
                    </div>
                  </div>
                </div>
              );
          })()}

          <div className='col-xs-12 action-container'>
            <button
              className='solution-button mousePoint back-button'
              onClick={this.goBack.bind(this)}
            >
              {this.state.pageTexts[7]}
            </button>
            {/* <button className="solution-button mousePoint back-button" onClick={this.goBack.bind(this)}>Volver</button> */}
          </div>
        </div>

        <Footer />
      </div>
    );
  }
}
