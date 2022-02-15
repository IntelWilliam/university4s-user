  import React from 'react'
import InteractionStore from 'src/client/modules/Interactions/InteractionStore'
import InteractionsConstants from 'src/client/Constants/InteractionsConstants'
import Constants from 'src/client/Constants/Constants'


class SectionItem extends React.Component {

  constructor() {
    super()
    this.state = {
      allComments: []
    }
    this.sendToCourse = this.sendToCourse.bind(this)
  }

  sendToCourse() {
    // console.log("lo mando a otro lado")
  }

  // Método que se encarga de cargar los ejercicios de la sección
  loadInteractions() {

    let isChromium = window.chrome,
      winNav = window.navigator,
      vendorName = winNav.vendor,
      isOpera = winNav.userAgent.indexOf("OPR") > -1,
      isIEedge = winNav.userAgent.indexOf("Edge") > -1,
      isIOSChrome = winNav.userAgent.match("CriOS");

    if (isIOSChrome) {
      // is Google Chrome on IOS
      let toRoute = `/user-area/`
      swal({
        title: this.props.pageTexts[7],
        text: this.props.pageTexts[8]
        // title: '¡Advertenia!',
        // text: "Para el correcto funcionamiento de esta sección debe usar el navegador Google Chrome en un computador o en un dispositivo Android"
      }).then(() => {
        this.context.router.push(toRoute)
      })
    } else if (isChromium !== null && isChromium !== undefined && vendorName === "Google Inc." && isOpera == false && isIEedge == false) {
      // is Google Chrome
      let params = {
        sortType: 1,
        sortField: 'position',
        differentType: 3,
        sectionId: this.props.id,
        limit: 100
      }

      // se piden todos los usuarios nuevamente

      InteractionStore.getAll(params, (err, response) => {
        if (err) return

        // se valida que seccion fue la que se clickeo
        if (this.props.name == Constants.SECTION.VOCABULARY) {
          let pictureComments = response.data.filter((interaction) => {
            return interaction.interactionType == InteractionsConstants.IMAGE_COMMENT || interaction.interactionType == InteractionsConstants.COMMENT
          })

          // se filtran cuales son ejercicios de acuerdo a el tipo de interacción
          let exercises = response.data.filter((interaction) => {
            return interaction.interactionType > 3 && interaction.interactionType < 9
          })

          console.log('exercises', exercises);

          this.props.currentExercises.call(null, exercises);
          this.props.pictureComments.call(null, pictureComments);
        } else if (this.props.name == Constants.SECTION.GRAMMAR ||
          this.props.name == Constants.SECTION.PRONUNCIATION ||
          this.props.name == Constants.SECTION.CONVERSATION) {

          this.props.currentInteractions.call(null, response.data)
        }
        this.props.onSectionClick.call(null)
      })
    } else {
      // not Google Chrome
      let toRoute = `/user-area/`
      swal({
        title: this.props.pageTexts[7],
        text: this.props.pageTexts[8]
        // title: '¡Advertenia!',
        // text: "Para el correcto funcionamiento de esta sección debe usar el navegador Google Chrome"
      }).then(() => {
        this.context.router.push(toRoute)
      })
    }
  }

  render() {
    let classSection = "section section-" + this.props.number
    let isSelect = 1

    if(this.props.sectionSelected == this.props.number){
      isSelect = 0.2
    }

    return (
      <div className="col-xs-12 col-md-3 front web-practice-sections" style={{opacity: isSelect}}>
        {(() => {
          //freeAccess
          // if (true) {
          if (this.props.isUnlocked || this.props.isTeacher) {
            return (
              <span className={classSection + " mousePoint"} onClick={this.loadInteractions.bind(this)}>
                <span className="section-text">{this.props.name}</span>
              </span>)
          } else if (this.props.isFinished) {
            return (
              <span className={classSection + " mousePoint"}>
                <div className="succes-big-container">
                  <img className="succes-big-enter" src="/images/check.png" />
                </div>
                <span className="section-text">{this.props.name}</span>
              </span>)
          } else {
            return (
              <span className={classSection}>
                <div className="bloqued-big-container">
                  <img className="bloqued-big-enter" src="/images/bloquedbig.png" />
                </div>
                <span className="section-text">{this.props.name}</span>
              </span>)
          }
        })()}
      </div>
    )
  }
}


SectionItem.contextTypes = {
  router: React.PropTypes.object
}
export default SectionItem
