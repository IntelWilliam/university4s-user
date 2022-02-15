import React from 'react'
// import Constants from 'src/client/Constants/Constants'
import LessonStore from 'src/client/modules/Moodle/Lessons/Lesson/LessonStore'
import EntryItem from 'src/client/modules/Moodle/Lessons/Entries/EntryItem'

class LessonItem extends React.Component {
  constructor() {
    super()
    this.state = {
      allEntries: []
    }
  }

  componentWillMount() {
    this.loadImageData()
  }

  loadImageData(page) {
    // si no viene pagina se inicia en 1
    if (!page) {
      page = 1
    }
    // se inician las variables necesarias para la pagina
    let params = {
      sortType: 1,
      sortField: 'position',
      page: page
    }
    if (this.props.sectionId) {
      // se busca si es una busqueda filtrada para un nivel
      params['sectionId'] = this.props.sectionId
      // suponiendo que cada nivel no tenga mas de 100 subniveles
      params['limit'] = 100
    }
    LessonStore.getEntries(params, (err, response) => {
      if (err)
      return
      this.setState({allEntries: response.data})
    })
  }

  render() {
    return (
      <div className="row">
        {(() => {
          if (this.props.sectionIndex == 3) {
            return (
              <div className="col-xs-12">
                <div className="col-xs-12">
                  <div className="row">
                    <div className="col-xs-12">
                      <div className="info-title-section-container">
                        <div className="pdf-icon-container" style={{
                          height: "2.4em"
                        }}>
                        <img className="pdf-icon" src="/images/course.png"/>
                      </div>
                      <div className="info-title-container">
                        <span className="info-title tittle-blue">Improving your skills</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xs-12">
                <div className="row">
                  <div className="col-xs-12">
                    <div className="exercise-border">
                      <span>&nbsp;</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        }
      })()}

      {(() => {
        if (this.state.allEntries.length > 0) {
          return (
            <div className="col-xs-12">

              <div className="col-xs-12">
                <div className="row">
                  <div className="col-xs-12 text-left title-container">
                    <span className="title-inicial tittle-blue">{this.props.sectionName}</span>
                  </div>
                </div>
              </div>
              <div className="col-xs-12 section-course">

                {this.state.allEntries.map((entry, index) => {
                  return <EntryItem
                    key={index}
                    entry={entry}
                    location={this.props.location}/>
                })}

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

            </div>
          )
        }
      })()}
    </div>
  )
}
}

export default LessonItem
