import React from 'react'
// import Names from 'src/client/Constants/PagesNames'
import Footer from 'src/client/modules/layout/footer'
import Constants from 'src/client/Constants/Constants'
import HeaderPage from 'src/client/modules/Moodle/HeaderPage'
import helpStore from 'src/client/modules/Moodle/Help/HelpStore'
import HelpContainer from 'src/client/modules/Moodle/Help/HelpContainer'
import FrontTextsActions from 'src/client/modules/FrontTexts/FrontTextsActions'

export default class Help extends React.Component {
  constructor() {
    super()
    this.state = {
      helpInfo: [],
      pageTexts: []
    }
  }

  loadPageTexts(){
    FrontTextsActions.getTexts("HELP", (err, body) => {
      // si llega un error
      if (err) {
        console.log("error", err)
      } else {
        // console.log('body.texts', body.texts);
        // se setea el mensaje a mostrar
        this.setState({pageTexts: body.texts})
      }

    })
  }

  componentWillMount() {
    this.loadData()
    this.loadPageTexts()
  }

  componentDidMount() {
    this.goTop()
  }

  loadData() {
    helpStore.getOne((err, response) => {
      if (err)
      return
      // se cambia el estado allLessons con los nuevos usuarios
      this.setState({helpInfo: response})
    })
  }

  goTop() {
    $("html, body").animate({
      scrollTop: 0
    }, "slow");
  }

  render() {
    let navigationArray = [
      {
        'name': this.state.pageTexts[0],
        // 'name': 'Inicio',
        'url': Constants.ADMIN_PATH + `/user-area/`
      }, {
        'name': this.state.pageTexts[1],
        // 'name': 'Ayuda',
        'url': null
      }
    ]
    let headerInfo = {
      title: this.state.pageTexts[2],
      translation: this.state.pageTexts[3],
      description: this.state.pageTexts[4],
      // title: Names.HELP.TITLE,
      // translation: Names.HELP.TRANSLATION,
      // description: Names.HELP.DESCRIPTION,
    }

    var activeCount = 0;

    return (
      <div style={{
        background: "#F6F7F7"
      }}>
      <HeaderPage navigation={navigationArray} headerInfo={headerInfo} borderTittle="true"/>
      <div className="container" style={{
        marginTop: "1em"
      }}>

      <div className="col-xs-10 col-xs-offset-1 learner-data-container">
        <div className="row">

          <div className="col-xs-12">
            <div className="row">
              <div className="col-xs-12">
                <div className="info-title-section-container" style={{
                  marginTop: "2em"
                }}>
                <div className="pdf-icon-container">
                  <img className="pdf-icon" src="/images/icono_preguntas.png"/>
                </div>
                <div className="info-title-container">
                  <span className="info-title">{this.state.pageTexts[5]}</span>
                  {/* <span className="info-title">Preguntas frecuentes</span> */}
                </div>
              </div>
            </div>

            <div className="col-xs-12 marginHelp">
              <div className="row">
                <div className="col-xs-12">
                  <div className="exercise-border">
                    <span>&nbsp;</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {this.state.helpInfo.map((info, index) => {
          if(info.a25Estado == "A"){
            activeCount += 1;
            return <HelpContainer
              key={index}
              indexInfo = {activeCount}
              info={info}/>
            }
          })}

        </div>
      </div>

    </div>

    <Footer/>
  </div>
)
}
}
