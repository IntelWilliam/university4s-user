import React from 'react'
import { sentenceCase } from 'src/client/Util/Capitalize'
import { Link } from 'react-router'

export default class LessonDetailItem extends React.Component {

  goBack(){
    window.history.back();
  }

  render() {
    const webPractice = 'user-area/practice-web/'
    return (
      <div>
        <div className="col-xs-12">
          <div className="row">
            <button className="solution-button mousePoint back-button" onClick={this.goBack.bind(this)}>{this.props.pageTexts[0]}</button>
            {/* <button className="solution-button mousePoint back-button" onClick={this.goBack.bind(this)}>Volver</button> */}
          </div>
        </div>

        <div className="col-xs-12">
          <div className="row">
            <span className="lesson-title" style={{marginBottom: '0.2em'}}>{sentenceCase(this.props.levelName)}</span>
          </div>
        </div>

        {(() => {
          if (this.props.showParentTitle) {
            return <span className="lesson-index">{sentenceCase(this.props.parentTitle)}</span>
          }
        })()}
    

        <span className="lesson-title">{sentenceCase(this.props.name)}</span>
        <span className="lesson-subtitle">{sentenceCase(this.props.translation)}</span>
        <div className="lesson-border">
          <span>&nbsp;</span>
        </div>
        <span className="lesson-description">{sentenceCase(this.props.description)}</span>
      </div>
    )
  }
}
