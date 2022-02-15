import React from 'react'
// import Constants from 'src/client/Constants/Constants'
import SubLevelsStore from 'src/client/modules/Moodle/SubLevels/SubLevelsStore'
import SubExamLevelItem from 'src/client/modules/Moodle/Exams/SubExamLevelItem'

class ExamLevelItem extends React.Component {
  constructor() {
    super()
    this.state = {
      allSubLevels: []
    }
  }

  componentWillMount() {
    // se cargan los datos
    this.loadData()
  }

  loadData() {
    SubLevelsStore.getOne(this.props.id, (err, response) => {
      if (err)
      return
      this.setState({allSubLevels: response})
    })
  }

  render() {
    let titleClass = "cicle-title"
    if (this.props.id == 3) {
      titleClass = "cicle-title cicle-title-fund"
    } else if (this.props.id == 2) {
      titleClass = "cicle-title cicle-title-op"
    }
    return (

      <div className="col-xs-12 level-notes">
        <div className="row">
          <div className="col-xs-12">
            <div className={titleClass}>
              <span>{this.props.name}</span>
            </div>
          </div>
          <div className="col-xs-12 body-exam-note">
            <div className="col-xs-12">
              <div className="row">
                <div className="head-title-note col-xs-12 col-md-2">
                  <div className="row">
                    <div className="title-note col-xs-12"></div>
                    <div className="title-note col-xs-12">{this.props.pageTexts[11]}</div>
                    <div className="title-note col-xs-12">{this.props.pageTexts[12]}</div>
                    <div className="title-note col-xs-12">{this.props.pageTexts[13]}</div>
                    <div className="title-note title-note-last col-xs-12">{this.props.pageTexts[14]}</div>
                    {/* <div className="title-note col-xs-12">Examen</div>
                    <div className="title-note col-xs-12">Parcial</div>
                    <div className="title-note col-xs-12">Intento</div>
                    <div className="title-note title-note-last col-xs-12">Promedio</div> */}
                  </div>
                </div>

                {this.state.allSubLevels.map((subLevel, index) => {
                  return <SubExamLevelItem sublevelIndex={index + 1 } isTeacher={this.props.isTeacher} pageTexts={this.props.pageTexts} key={index} subName={subLevel.name} subLevelId={subLevel.code} levelId={this.props.id} levelName={this.props.name} userdata={this.props.levelUserData[index + 1]}/>
                })}

              </div>
            </div>
          </div>
          <div className="col-xs-12">
            <div className="cicle-title-note">
              <span>{this.props.pageTexts[15]}</span>
              {/* <span>Ciclo</span> */}
              <span className="note">{this.props.levelUserData
                ? this.props.levelUserData.level_note
                : ""}</span>
              </div>
            </div>
          </div>
        </div>
      )
    }
  }

  export default ExamLevelItem
