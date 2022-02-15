import React from 'react'
import MoodleDetail from 'src/client/modules/Moodle/MoodleDetail'

export default class HeaderPage extends React.Component {

  constructor() {
    super()
    this.state = {
      pageInfo: []
    }
  }

  goBody() {
    $("html, body").animate({
      scrollTop: window.innerHeight
    }, "slow");
  }
  render() {
    let blur = this.props.home
    ? ' home-blur'
    : ''

    let colorBack= this.props.tutorial?  'header-image-container tutorial-color': 'header-image-container'

    return (
      <div className={colorBack + " col-xs-12"}>
        <div className="row">
          <img className={"bg-image-img" + blur} src={this.props.headerInfo.backgroundImage}/>
        </div>
        {(() => {
          if (this.props.home) {
            return (
              <div className="row height-calc">
                <div className="container presentation-main">
                  <div className="col-xs-12">
                    <div className="row center-flex">
                      <div className="col-xs-12 front">
                        <div>
                          {/* <span className="title-home break-word-tittle">¡El inglés es la lengua */}
                            <span className="title-home break-word-tittle">{this.props.pageTexts[0]}
                          </span>
                          {/* <span className="subtitle-home break-word-tittle">global de la comunicación!</span> */}
                          <span className="subtitle-home break-word-tittle">{this.props.pageTexts[1]}</span>
                        </div>
                      </div>
                      <div className="bottom-div"></div>
                      <div className="col-xs-12 col-md-10 front">
                        <div className="home-description" style={{'textAlign': 'center'}}>
                          <p className="disp-block">
                            {/* <span>Somos AKRON INTERNATIONAL, una organización especializada en la enseñanza del programa de autoaprendizaje del idioma inglés con asesoría online con tutores las 24 horas del día y dueña del programa educativo AKRON ENGLISH. </span> */}
                            <span>{this.props.pageTexts[2]}</span>
                          </p>
                          <p className="disp-block">
                            {/* <span>Nuestro programa educativo de inglés, AKRON ENGLISH, tiene como objetivo lograr que nuestros alumnos se comuniquen en inglés de manera fácil, eficaz y fluida usando los avances tecnológicos que tienen a su disposición. </span> */}
                            <span>{this.props.pageTexts[3]}</span>
                          </p>

                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          } else {
            return (
              <div className="row">
                <div className="container presentation-main padding-main">
                  <div className="col-xs-12 col-md-6">
                    <div className="row">
                      <div className="col-xs-12 front">
                        <MoodleDetail pageTexts={this.props.pageTexts}  nextButton={this.props.nextButton} headerType={this.props.headerType} navigation={this.props.navigation} title={this.props.headerInfo.title} translation={this.props.headerInfo.translation} description={this.props.headerInfo.description} borderTittle={this.props.borderTittle} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          }
        })()}

        {(() => {
          if (this.props.home) {
            return (
              <div className="row">
                <div className="white-arrow-down-container mousePoint" onClick={this.goBody}>
                  <div className="white-arrow-down">
                    <img className="white-arrow-down-img" src="/images/white-arrow-down.png"/>
                  </div>
                </div>
              </div>
            )
          }
        })()}
      </div>
    )
  }
}
