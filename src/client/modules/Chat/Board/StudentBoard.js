import React from 'react'

export default class StudentBoard extends React.Component {

  render() {
    return (
      <div className="student-board">
        <div className="col-xs-12">
          <div className="row">
            <div className="col-xs-12 head-board">
              <span>Board</span>
            </div>
            <div className="col-xs-12" style={{
              wordWrap: 'break-word'
            }} dangerouslySetInnerHTML={{
              __html: this.props.boardContent
            }}></div>
          </div>
        </div>
      </div>
    )
  }
}
