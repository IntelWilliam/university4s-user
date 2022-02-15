import React from 'react'
import Footer from 'src/client/modules/layout/footer'
import Names from 'src/client/Constants/PagesNames'
import Constants from 'src/client/Constants/Constants'
import HeaderPage from 'src/client/modules/Moodle/HeaderPage'
import UserStore from 'src/client/modules/Moodle/UserData/UserStore'
import LevelsStore from 'src/client/modules/Moodle/Levels/LevelsStore'
import SimulationLevelItem from 'src/client/modules/Moodle/Simulation/Levels/SimulationLevelItem'
import loading from 'src/client/modules/Chat/Modals/loading'
import FrontTextsActions from 'src/client/modules/FrontTexts/FrontTextsActions'

export default class Simulation extends React.Component {

  constructor() {
    super()
    this.state = {
      allLevels: [],
      userId: JSON.parse(localStorage.user).userIdDev,
      userData: [],
      pageTexts: [],
      isTeacher: false
    }
  }

  loadPageTexts(){
    FrontTextsActions.getTexts("SIM_EXAMS", (err, body) => {
      // si llega un error
      if (err) {
        console.log("error", err)
      } else {
        let loadingNew = loading.replace(/text-to-load/g, body.texts[7]);
        // let loadingNew = loading.replace(/text-to-load/g, "Cargando");
        swal({
          html: loadingNew,
          showCloseButton: false,
          showCancelButton: false,
          showConfirmButton: false
        })
        // console.log('body.texts', body.texts);
        // se setea el mensaje a mostrar
        this.setState({pageTexts: body.texts})
      }

    })
  }

  componentWillMount() {
    this.loadPageTexts()
    this.loadDataUser()
    let curUser = JSON.parse(localStorage.user)
    this.setState({
      isTeacher: curUser.role == "teacher" ? true : false,
    })
  }

  componentDidMount() {
    this.goTop()

  }

  goTop() {
    $("html, body").animate({
      scrollTop: 0
    }, "slow");
  }

  loadDataUser() {
    UserStore.getOne(this.state.userId, (err, response) => {
      if (err)
      return
      swal.close()
      this.setState({userData: response})
      this.loadData()
    })
  }

  loadData() {
    LevelsStore.getAll((err, response) => {
      if (err)
      return
      this.setState({allLevels: response})
    })
  }

  goBack(){
    window.history.back();
  }

  render() {
    let navigationArray = [
      {
        'name': this.state.pageTexts[0],
        // 'name': 'Inicio',
        'url': Constants.ADMIN_PATH + `/user-area/`
      }, {
        'name': this.state.pageTexts[1],
        // 'name': 'Simulador',
        'url': null
      }, {
        'name': this.props.location.query.sectionName,
        'url': null
      }
    ]

    const descriptionBySection = this.props.location.query.sectionId == 1 ? this.state.pageTexts[3] : this.props.location.query.sectionId == 2 ? this.state.pageTexts[4] : this.state.pageTexts[5]
    // const descriptionBySection = this.props.location.query.sectionId == 1 ? Names.SIMULATION.DESCRIPTION_GRAMMAR : this.props.location.query.sectionId == 2 ? Names.SIMULATION.DESCRIPTION_READING : Names.SIMULATION.DESCRIPTION_LISTENING

    let headerInfo = {
      title: this.state.pageTexts[2],
      // title: Names.SIMULATION.TITLE,
      translation: this.props.location.query.sectionName,
      description: descriptionBySection,
    }
    return (
      <div style={{
        background: "#F6F7F7"
      }}>
      <HeaderPage navigation={navigationArray} headerInfo={headerInfo}/>
      <div className="container" style={{
        marginTop: "2em"
      }}>
      <div className="col-xs-12">
        <div className="row">
          <div className="col-xs-12">

            {this.state.allLevels.map((level, index) => {
              return <SimulationLevelItem key={index} isTeacher={this.state.isTeacher} levelName={level.name} levelUserData={this.state.userData[level.alias]} id={level.code} sectionId={this.props.location.query.sectionId}/>
            })}

          </div>
        </div>

      </div>

      <div className="col-xs-12 action-container">
        <button  className="solution-button mousePoint back-button" onClick={this.goBack.bind(this)}>{this.state.pageTexts[6]}</button>
        {/* <button  className="solution-button mousePoint back-button" onClick={this.goBack.bind(this)}>Volver</button> */}
      </div>

    </div>
    <Footer/>
  </div>
)
}
}
