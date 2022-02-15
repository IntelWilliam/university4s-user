import React from 'react'

export default class PausedStudents extends React.Component {
  /**
   * Metodo encargado de cambiar el estado del chat a un profesor, de acuerdo a esto se decide
   * si se muestra la lista de alumnos o el chat con alguno
   * @param userId
   */

  constructor() {
    super();
    this.state = {
      activeList: false,
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.student != nextProps.student) {
      this.setState({activeList: false})
    }
  }

  handleClick(studentId) {
    if(!this.props.onStreaming){
      this.props.onResumeCall.call(null, studentId);
    }else{
      swal("Estas en llamada", "Pausa la llamda actual antes de reanudar otra.");
    }
  }

  render() {
    let userImg = this.props.student.profileImg
      ? this.props.student.profileImg
      : '/images/profile-img.png'


    console.log('this.props.student', this.props.student);

    return (
      <div className="col-xs-12">
        <div
          className={"learner-list "}
          style={{
          background: 'gray'
        }}>
          <div
            className="img-user-list"
            onClick={this.handleClick.bind(this, this.props.student )}>
            <img src={userImg} className="cosmo-image"/>
          </div>
          <div
            className="user-list-header-text-container"
            style={{
            maxWidth: "9em"
          }}
            onClick={this.handleClick.bind(this, this.props.student)}>
            <span
              className="user-list-header-text-learner">{this.props.student.name + ' ' + this.props.student.lastname}</span>
            {/* <span title="Notificación" className="badge ">{badge}</span> */}
          </div>

        </div>

      </div>
    )
  }
}
