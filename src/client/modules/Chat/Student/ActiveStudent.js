import React from 'react'
import TeachersStore from 'src/client/modules/Chat/Teachers/TeachersStore'

export default class ActiveStudents extends React.Component {
  /**
   * Metodo encargado de cambiar el estado del chat a un profesor, de acuerdo a esto se decide
   * si se muestra la lista de alumnos o el chat con alguno
   * @param userId
   */

   constructor() {
     super();
     this.state = {
       allTeachers: [],
       activeList: false
     }
   }

  componentWillReceiveProps(nextProps) {
    if(this.props.student != nextProps.student){
      this.setState({
        allTeachers: [],
        activeList: false
      })
    }
  }

  handleClick(userId, roomId) {

    console.log('handleClick');

    this.props.changeChatStatus.call(null, userId, roomId);
    this.setState({
      allTeachers: [],
    })
  }

  loadTeachers(){
    console.log('this.state.activeList', this.state.activeList);
    if (!this.state.activeList){
      console.log('this.props.index', this.props.index);
      this.props.removeTeachers.call(null, this.props.index);

      TeachersStore.getOnline((err, resp)=>{
        if(err){
          console.log('err', err);
        }
        console.log('resp', resp);
        this.setState({
          allTeachers: resp,
          activeList: true
        })
      })
    }else{
      this.setState({
        allTeachers: [],
        activeList: false
      })
    }
  }

  changeTeacher(teacher, student){
    this.props.changeTeacher.call(null,teacher, student);
  }

  // si se listan los prodesores para otro estudiante se resetean
  removeTeachers(){
    this.setState({
      allTeachers: [],
      activeList: false
    })
  }

  render() {
    let userImg = this.props.student.profileImg == '' ? '/images/profile-img.png' : this.props.student.profileImg
    let orangeMenssage = this.props.student.badge? 'orangeMenssage' : ''

    return (
      <div className="col-xs-12">
          <div className={"learner-list " + orangeMenssage} onClick={this.handleClick.bind(this, this.props.student._id, this.props.student.roomId)}>
              <div className="img-user-list" >
                  <img src={userImg} className="cosmo-image"/>
              </div>
              <div className="user-list-header-text-container"
                style={{maxWidth: "9em"}}>
                  <span className="user-list-header-text-learner">{this.props.student.name + ' ' + this.props.student.lastname}</span>
                  <span className="badge ">{this.props.student.badge}</span>
              </div>

              <div className="teacher-button mousePoint"
                title={' Listar profesores disponibles'}
                onClick={this.loadTeachers.bind(this)}>
                <div className="border-menu"></div>
              </div>

          </div>

          {/* <div onClick={this.loadTeachers.bind(this)} title="Enviar a otro profesor">
            <i className="material-icons">videocam</i>
          </div> */}

          {(() => {
            if(this.state.allTeachers.length == 1){
              return(
                <div className='teachers-list'>
                    <p> No hay otros profesores </p>
                  </div>
              )
            }
          })()}

          {this.state.allTeachers.map((teacher, index) => {
            if(this.props.user._id != teacher._id){
              return(
                <div key={index} onClick={this.changeTeacher.bind(this, teacher, this.props.student)} className='teachers-list mousePoint'
                  title={'Enviar a ' + teacher.name}
                  >
                    <p> {teacher.name} </p>
                    <span className="badge ">{teacher.studentsOnline}</span>
                  </div>
                )
            }
           })}
      </div>
    )
  }
}
