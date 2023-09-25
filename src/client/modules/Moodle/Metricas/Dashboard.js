import React from 'react'
import Footer from 'src/client/modules/layout/footer'
// import Names from 'src/client/Constants/PagesNames'
import Constants from 'src/client/Constants/Constants'
import HeaderPage from 'src/client/modules/Moodle/HeaderPage'
import UserStore from 'src/client/modules/Moodle/UserData/UserStore'
import LevelsStore from 'src/client/modules/Moodle/Levels/LevelsStore'
import ExamLevelItem from 'src/client/modules/Moodle/Exams/ExamLevelItem'
import loading from 'src/client/modules/Chat/Modals/loading'
import FrontTextsActions from 'src/client/modules/FrontTexts/FrontTextsActions'

export default class Exams extends React.Component {
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
    FrontTextsActions.getTexts("EXAMS", (err, body) => {
      // si llega un error
      if (err) {
        console.log("error", err)
      } else {
        // console.log('body.texts', body.texts);
        // se setea el mensaje a mostrar
        this.setState({pageTexts: body.texts})
        let loadingNew = loading.replace(/text-to-load/g, this.state.pageTexts[29]);
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

  loadDataUser(){
    UserStore.getOne(this.state.userId, (err, response) => {
      if (err) return
      console.log("notas", response);
      this.loadData()
      this.setState({
        userData: response,
      })
    })
  }

  loadData() {
    LevelsStore.getAll( (err, response) => {
      if (err) return
      this.setState({
        allLevels: response,
      })
      swal.close()
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
        // 'name': 'Mis notas',
        'url': null
      }
    ]
    let headerInfo = {
      title: this.state.pageTexts[2],
      // title: Names.EXAMS.TITLE,
    }

    return (

      <div style={{ background: "#F6F7F7" }}>
        <HeaderPage pageTexts={this.state.pageTexts} navigation={navigationArray} headerInfo={headerInfo} headerType="notas"/>
        <div className="container" style={{marginTop: "1em"}}>
          <iframe
            title="prueba1-bi"
            width="1140"
            height="541.25"
            src="https://app.powerbi.com/reportEmbed?reportId=c5e2d052-9615-4b95-b500-37fbe58b98ef&autoAuth=true&ctid=6b61eefc-1459-44d4-842b-3ffc40a3148b"
            frameBorder="0"
            allowFullScreen="true"
          ></iframe>
        </div>
        <Footer/>
      </div>
  )
}
}
