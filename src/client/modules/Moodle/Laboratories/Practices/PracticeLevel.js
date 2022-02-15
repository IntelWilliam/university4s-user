import React from 'react'
import Footer from 'src/client/modules/layout/footer'
// import Names from 'src/client/Constants/PagesNames'
import Constants from 'src/client/Constants/Constants'
import HeaderPage from 'src/client/modules/Moodle/HeaderPage'
import UserStore from 'src/client/modules/Moodle/UserData/UserStore'
import LevelsStore from 'src/client/modules/Moodle/Levels/LevelsStore'
import PracticeLevelItem from 'src/client/modules/Moodle/Laboratories/Practices/Levels/PracticeLevelItem'
import loading from 'src/client/modules/Chat/Modals/loading'
import FrontTextsActions from 'src/client/modules/FrontTexts/FrontTextsActions'

export default class PracticeLevel extends React.Component {

  constructor() {
    super()
    this.state = {
      allLevels: [],
      userId: JSON.parse(localStorage.user).userIdDev,
      userData: [],
      pageTexts: []
    }
  }

  loadPageTexts(){
    FrontTextsActions.getTexts("LAB_PRACTICE", (err, body) => {
      // si llega un error
      if (err) {
        console.log("error", err)
      } else {
        // console.log('body.texts', body.texts);
        // se setea el mensaje a mostrar
        this.setState({pageTexts: body.texts})
        let loadingNew = loading.replace(/text-to-load/g, body.texts[7]);
        // let loadingNew = loading.replace(/text-to-load/g, "Cargando");
        swal({
          html: loadingNew,
          showCloseButton: false,
          showCancelButton: false,
          showConfirmButton: false
        })
      }

    })
  }

  componentWillMount() {
    this.loadPageTexts()
    this.loadDataUser()

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
        // 'name': 'Laboratorios',
        'url': null
      }, {
        'name': this.state.pageTexts[2],
        // 'name': 'Prácticas',
        'url': null
        // 'url': '#'
      }
    ]
    let headerInfo = {
      title: this.state.pageTexts[3],
      translation: this.state.pageTexts[4],
      description: this.state.pageTexts[5],
      // title: Names.LABORATORIES.PRACTICES_LEVELS.TITLE,
      // description: Names.LABORATORIES.PRACTICES_LEVELS.DESCRIPTION,
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
              return <PracticeLevelItem key={index} levelName={level.name} levelUserData={this.state.userData[level.alias]} id={level.code}/>
            })}

          </div>
        </div>
      </div>
      <div className="col-xs-12 action-container">
        <button className="solution-button mousePoint back-button" onClick={this.goBack.bind(this)}>{this.state.pageTexts[6]}</button>
        {/* <button className="solution-button mousePoint back-button" onClick={this.goBack.bind(this)}>Volver</button> */}
      </div>
    </div>


    <Footer/>
  </div>
)
}
}
