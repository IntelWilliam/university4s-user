import React from 'react'
import ActiveStudent from 'src/client/modules/Chat/Student/ActiveStudent'
import InactiveStudent from 'src/client/modules/Chat/Student/InactiveStudent'

export default class UsersInSession extends React.Component {
  constructor() {
    super()
    this.state = {
      userOnline: false
    }
  }

  openUserOnline() {
    this.setState({
      userOnline: !this.state.userOnline
    })
  }

  // se deja el listado de profesores en el actual
  removeTeachers(teacherListIndex){
    console.log('this.refs', this.refs);
    for (var listTeacher in this.refs) {
      if (this.refs.hasOwnProperty(listTeacher)) {
        if(listTeacher.includes('active_') ){
          console.log('listTeacher', listTeacher);
          if(listTeacher != 'active_'+teacherListIndex)
          console.log('teacherListIndex',teacherListIndex);
          this.refs[listTeacher].removeTeachers()
        }
        // console.log('this.refs.hasOwnProperty(comment)', this.refs.hasOwnProperty(comment));
      }
    }
  }

  render() {
    let openMenuClass = this.state.userOnline ? 'col-xs-12 learner-list-container learner-list-container-open' : 'col-xs-12 learner-list-container'
    return (
      <div className="users-online">
        <div className="row">
            <div className="col-xs-12 front" onClick={this.openUserOnline.bind(this)}>
                <div className="user-list">
                    <div className="user-list-header-text-container">
                        <span className="user-list-header-text">Estudiantes en linea</span>
                    </div>
                    <div className="img-user-list">
                        <img src='/images/profile-img.png' className="cosmo-image"/>
                    </div>
                </div>
            </div>
        </div>
        <div className={openMenuClass}>
            {(() => {
                // console.log('this.props.studentOrder', this.props.studentOrder);
                if(this.props.studentOrder.length > 0) {
                    return this.props.studentOrder.map((studentId, index) => {
                            if(this.props.allStudents[studentId]) {
                                return <ActiveStudent
                                    student={this.props.allStudents[studentId]}
                                    ref={'active_' + index}
                                    key={index}
                                    index={index}
                                    user={this.props.user}
                                    removeTeachers = {this.removeTeachers.bind(this)}
                                    changeTeacher={this.props.changeTeacher}
                                    changeChatStatus={this.props.changeChatStatus}
                                />
                            }
                    })
                } else  {
                    return <div className="col-xs-12">
                              <div className="learner-list">
                                  <div className="user-list-header-text-container">
                                      <span className="user-list-header-text-learner">No hay usuarios en linea</span>
                                  </div>
                              </div>
                          </div>
                }
            })()}

            <div className="col-xs-12" style ={{    textAlign: 'center'}}>
              <p style={{ borderBottom: '1px solid black' }}> Estudiantes desconectados </p>
            </div>


            {(() => {
                // console.log('this.props.studentOrder', this.props.studentOrder);
              if(this.props.usersOffLine.length > 0) {
                return this.props.usersOffLine.map((student, index) => {

                  // let badgeTittle = ''
                  // if(student.notifyType){
                  //   badgeTittle = student.notifyType == 1 ? 'LLamada perdida' : student.notifyType == 2 ? 'Mensajes sin leer' : ''
                  // }

                  // console.log('student.notifyNumber', student.notifyNumber);
                  return <InactiveStudent
                                    student={student}
                                    ref={'inAct' + index}
                                    key={index}
                                    user={this.props.user}
                                    offLine = {true}
                                    badge = {student.notifyNumber? student.notifyNumber : 0}
                                    changeChatStatus={this.props.changeChatStatus}
                                />

                })
              }
            })()}
        </div>
    </div>
    )
  }
}
