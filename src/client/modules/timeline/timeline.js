import React from 'react'
import LevelStore from 'src/client/modules/Levels/LevelStore'
import LevelItem from 'src/client/modules/Levels/LevelItem'
import Footer from 'src/client/modules/layout/footer'
import HeaderPage from 'src/client/modules/Moodle/HeaderPage'
import FrontTextsActions from 'src/client/modules/FrontTexts/FrontTextsActions'

export default class Timeline extends React.Component {

  constructor() {
    super()
    this.state = {
      allLevels: [],
      pageTexts: [],
      isTeacher: false,
      pagination: {
        total: 0, // cantidad de items
        page: 0, // página actual
        pages: 0 // cantidad de páginas
      },
      user: JSON.parse(localStorage.user)
    }
    // se manda el contexto a los metodos
    this.loadData.bind(this)
  }

  loadPageTexts(){
    FrontTextsActions.getTexts("PRACTICE_WEB", (err, body) => {
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

  // se ejecuta antes de de montar el componente
  componentWillMount() {
    // se cargan los datos
    this.loadPageTexts()
    this.loadData()
    let curUser = JSON.parse(localStorage.user)
    this.setState({
      isTeacher: curUser.role == "teacher" ? true : false,
    })
  }

  loadData(page) {
    // si no viene pagina se inicia en 1
    if (!page) {
      page = 1
    }
    // se inician las variables necesarias para la pagina
    let params = {
      sortType: 1,
      sortField: 'position'
    }
    params['limit'] = 100
    // pagina que se va a cargar
    params.page = page
    // se piden todos los usuarios nuevamente
    LevelStore.getAll(params, (err, response) => {
      if (err) return
      // solo se muestran los activos
      let enabledLevels = response.data.filter((level) => {
        return level.isEnabled
      })
      // se cambia el estado allLevels con los nuevos usuarios
      this.setState({
        allLevels: enabledLevels,
        pagination: {
          total: response.total,
          page: response.page,
          pages: response.pages
        }
      })
    })
  }

  goBack(){
    window.history.back();
  }

  render() {
    let navigationArray = [{}]

    let headerInfo = {
      title: this.state.pageTexts[0],
      translation: this.state.pageTexts[1],
      description: this.state.pageTexts[2],
      // title: 'Un nuevo punto de partida',
      // translation: '',
      // description: 'Bienvenido a los módulos de estudio.',
    }
    return (
      <div>
        <HeaderPage borderTittle='true' navigation={navigationArray} headerInfo={headerInfo}/>
        <div className="container" style={{marginTop: "1em"}}>
          <div className="col-xs-12">
            <div className="row">
              {this.state.allLevels.map((level, index) => {
                return  <LevelItem
                  key={index}
                  isTeacher={this.state.isTeacher}
                  index={index}
                  user={this.state.user}
                  name={level.name}
                  id={level._id}
                  isEnabled={level.isEnabled}
                />
              })}
            </div>
          </div>

          <div className="col-xs-12 action-container">
            <button className="solution-button mousePoint back-button" onClick={this.goBack.bind(this)}>{this.state.pageTexts[3]}</button>
            {/* <button className="solution-button mousePoint back-button" onClick={this.goBack.bind(this)}>Volver</button> */}
          </div>
        </div>
        <Footer/>
      </div>
    )
  }
}
