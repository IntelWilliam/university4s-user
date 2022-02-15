import React from 'react'
import SubLevelStore from 'src/client/modules/SubLevels/SubLevelStore'
import LessonStore from 'src/client/modules/Lessons/LessonStore'
import LessonItem from 'src/client/modules/Lessons/LessonItem'
import { sentenceCase } from 'src/client/Util/Capitalize'

class LevelItem extends React.Component {

  constructor() {
    super()
    this.state = {
        allSubLevels: [],
        allLessons: [],
        value: '',
        selectedSubLevel: 1,
        pagination: {
          total: 0, // cantidad de items
          page: 0, // página actual
          pages: 0 // cantidad de páginas
        }
      }
      // se manda el contexto a los metodos
    this.loadData.bind(this)
  }

  // se ejecuta antes de de montar el componente
  componentWillMount() {
    // se cargan los datos
    this.loadData()
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

    // se busca si es una busqueda filtrada para un nivel
    params['levelId'] = this.props.id
      // suponiendo que cada nivel no tenga mas de 100 subniveles
    params['limit'] = 100

    // pagina que se va a cargar
    params.page = page
      // se piden todos los subniveles
    SubLevelStore.getAll(params, (err, response) => {
      if (err)
        return
        // se cambia el estado allSubLevels
        // solo se mostraran los niveles habilitados
      let enabledSubLevels = response.data.filter((subLevel) => {
        return subLevel.isEnabled
      })
      let firstElement = enabledSubLevels[0];
      if (firstElement) {
        this.loadLessonData(firstElement._id);
        this.setState({
          allSubLevels: enabledSubLevels,
          value: firstElement._id,
          pagination: {
            total: response.total,
            page: response.page,
            pages: response.pages
          }
        })
      }
    })
  }

  handleChange(event) {
    var index = event.nativeEvent.target.selectedIndex;
    this.setState({ value: event.target.value, selectedSubLevel: event.nativeEvent.target[index].text });
    this.loadLessonData(event.target.value)
  }

  loadLessonData(subLevelId, page) {
      if (!page) {
        page = 1
      }
      // se inician las variables necesarias para la pagina
      let params = {
        sortType: 1,
        sortField: 'position'
      }

      // se busca si es una busqueda filtrada para un lección
      params['subLevelId'] = subLevelId
        // suponiendo que cada lección no tenga mas de 100 lecciones
      params['limit'] = 100

      // pagina que se va a cargar
      params.page = page
        // se piden todos los usuarios nuevamente
      LessonStore.getAll(params, (err, response) => {
        if (err)
          return
        let enabledLessons = response.data.filter((lesson) => {
          return lesson.isEnabled
        })

        this.getUnlockedLessons(subLevelId, enabledLessons);
      })
    }
    // funcion encargada de obtener las funciones desbloqueadas e iterar sobre el total de lecciones
    // para mostrar bloqueadas y desbloqueadas
  getUnlockedLessons(subLevelId, subLevelLessons) {
    LessonStore.getUserLessons(this.props.user._id, subLevelId, (err, response) => {
      if (err) {
        console.log(err)
        return
      }
      let lessons = [];
      if (response) {
        let lastUnlockedIndex = response.unlockedLessons.length - 1
          // logica para saber si está bloqueada o desbloqueada una lección
        lessons = subLevelLessons.map((subLevel) => {
          subLevel.isUnlocked = false;
          subLevel.isFinished = false;
          response.unlockedLessons.filter((unlockedLesson, index) => {
            if (unlockedLesson == subLevel._id) {
              if (index <= lastUnlockedIndex) {
                subLevel.isUnlocked = true;
              } else {
                subLevel.isFinished = true;
              }
              return true;
            } else {
              return false;
            }
          })
          return subLevel;
        })
      } else {
        lessons = subLevelLessons.map((subLevel) => {
          subLevel.isUnlocked = false;
          return subLevel;
        })
      }
      // se cambia el estado allLessons
      this.setState({ allLessons: lessons })
    })

  }

  render() {
    let titleClass = 'title-inicial web-practice-initial'
    if(this.props.name == 'fundamental' ){
      titleClass = 'title-inicial web-practice-fundamental'
    }else if(this.props.name == 'operacional' ){
      titleClass = 'title-inicial web-practice-operational'
    }

    return (<div className="col-xs-12" >
              <div className="row" >
                <div className="col-xs-12" >
                  <div className="row" >
                    <div className="col-xs-12 text-left title-container" >
                      <span className={titleClass} > { sentenceCase(this.props.name  + " " + this.state.selectedSubLevel )  }</span>
                      <div className="" >
                        <select style={{width: '3em',    height: '2.5em'}} onChange={ this.handleChange.bind(this) } value={ this.state.value }>
                          {this.state.allSubLevels.map((subLevel, index) => {
                            return <option key = { index } value = { subLevel._id }> { index + 1 } </option>
                          })}
                        </select>
                      </div>
                    </div>
                    <div className="col-xs-12 text-left" >
                      {/* <span className="sub-title"> { this.state.selectedSubLevel }/Lecciones</span> */}
                    </div>
                  </div>
                </div>
                {this.state.allLessons.map((lesson, index) => {
                  return <LessonItem
                            key={ index }
                            isTeacher={this.props.isTeacher}
                            levelName = {this.props.name}
                            description={ lesson.description }
                            smallImage={ lesson.smallImage }
                            isUnlocked={ lesson.isUnlocked }
                            name={ lesson.name }
                            id={ lesson._id }
                            selectedSubLevel={this.state.selectedSubLevel}
                            subLevelId={ this.state.value }
                            levelId={ this.props.id }
                            isEnabled={ lesson.isEnabled }/>
                })}
              </div>
            </div>)
  }
}

export default LevelItem
