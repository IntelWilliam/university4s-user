import React from 'react'
// import Names from 'src/client/Constants/PagesNames'
import Footer from 'src/client/modules/layout/footer'
import Constants from 'src/client/Constants/Constants'
import HeaderPage from 'src/client/modules/Moodle/HeaderPage'
import {Link} from 'react-router'
import FrontTextsActions from 'src/client/modules/FrontTexts/FrontTextsActions'

export default class Video extends React.Component {
  constructor() {
    super();
    // se inician los estados
    this.state = {
      pageTexts: []
    }
  }

  componentDidMount() {
    this.goTop()
  }

  goTop() {
    $("html, body").animate({
      scrollTop: 0
    }, "slow");
  }

  componentWillMount() {
    this.loadPageTexts()
  }

  loadPageTexts(){
    FrontTextsActions.getTexts("VIDEO_LEVEL", (err, body) => {
      // si llega un error
      if (err) {
        console.log("error", err)
      } else {
        // console.log('body.texts', body.texts);
        // se setea el mensaje a mostrar
        this.setState({pageTexts: body.texts})
        // let loadingNew = loading.replace(/text-to-load/g, 'Cargando');
      }

    })
  }

  render() {
    let navigationArray = [
      {
        'name': this.state.pageTexts[0],
        // 'name': 'Inicio',
        'url': Constants.ADMIN_PATH + `/user-area/`
      }, {
        'name': this.state.pageTexts[1],
        // 'name': 'Laboratorio',
        'url': null
      }, {
        'name': this.state.pageTexts[2],
        // 'name': 'Videos',
        'url': null
      }
    ]
    let headerInfo = {
      title: this.state.pageTexts[3],
      translation: this.state.pageTexts[4],
      description: this.state.pageTexts[5],
      // title: Names.VIDEO_LEVEL.TITLE,
      // translation: Names.VIDEO_LEVEL.TRANSLATION,
      // description: Names.VIDEO_LEVEL.DESCRIPTION,
    }

    let hrefInicial = "/user-area/video/category/?levelName=Inicial&levelId=1"
    let hrefFundamental = "/user-area/video/category/?levelName=Fundamental&levelId=2"
    let hrefOperacional = "/user-area/video/category/?levelName=Operacional&levelId=3"

    return (
      <div style={{
        background: "#F6F7F7"
      }}>
      <HeaderPage navigation={navigationArray} headerInfo={headerInfo} borderTittle="true"/>
      <div className="container" style={{
        marginTop: "1em"
      }}>

      <div className="col-xs-12 section-name">
        <div className="col-xs-12">
          <div className="row">
            <div className="col-xs-12">
              <div className="image-drag-excercise">
                <div className="pdf-icon-container">
                  <img className="pdf-icon" src="/images/objetive.png"/>
                </div>
                <div className="info-title-container title-container flex">
                  <div className="row">
                    <div className="col-xs-12">
                      <span className="info-title">{this.state.pageTexts[6]}</span>
                      {/* <span className="info-title">Niveles</span> */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-xs-12">
          <div className="row">
            <div className="col-xs-12">
              <div className="exercise-border-dotted">
                <span>&nbsp;</span>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xs-12 page-content">
          <div className="row">

            <div className="col-xs-12 col-sm-4 card-container presentation-main">
              <Link to={hrefInicial}>
                <div className="card">
                  <div className="image-container">
                    <img src="/images/video-inicial.png"/>
                  </div>

                  <div className="card-text-container web-backg-initial">
                    <span className="video-card-text">
                      Inicial
                    </span>
                  </div>
                </div>
              </Link>
            </div>

            <div className="col-xs-12 col-sm-4 card-container presentation-main">
              <Link to={hrefFundamental}>
                <div className="card">
                  <div className="image-container">
                    <img src="/images/video-fundamental.png"/>
                  </div>

                  <div className="card-text-container web-backg-fundamental">
                    <span className="video-card-text">
                      Fundamental
                    </span>
                  </div>
                </div>
              </Link>
            </div>

            <div className="col-xs-12 col-sm-4 card-container presentation-main">
              <Link to={hrefOperacional}>
                <div className="card">
                  <div className="image-container">
                    <img src="/images/video-operacional.png"/>
                  </div>

                  <div className="card-text-container web-backg-operational">
                    <span className="video-card-text">
                      Operacional
                    </span>
                  </div>
                </div>
              </Link>
            </div>

          </div>
        </div>

      </div>

    </div>

    <Footer/>
  </div>
)
}
}
