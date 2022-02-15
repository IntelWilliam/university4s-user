import React from 'react'
import UserInfo from 'src/client/modules/Chat/Chat/UserInfo'

class ActiveTeachers extends React.Component {

  constructor() {
    super()
    this.state = {
      defaultImage: "/images/teacher-profile.png"
    }
  }

  // funcion que maneja el evento click en el boton llamar
  handleCall(teacher) {
    // llamo la funcion que llama al que está en linea
    this.props.onCallTeacher.call(null, teacher)
  }

  render() {
    return (
      <div>
        <div className="col-xs-12">
          <div className="blue lighten-1">
            <div className="center-align">
              <div className="col-xs-12 caption white-text"><p>Profesores disponibles</p></div>
            </div>
          </div>
        </div>
        <div className="divider"></div>
        {
          this.props.allTeachers.map((teacher, index) => {
          return <div style={{cursor:'pointer',bottom: 56}} key={index} onClick={this.handleCall.bind(this,teacher)}>
                  <UserInfo
                  name={teacher.name}
                  lastname={teacher.lastname}
                  email = {teacher.email}
                  picture={this.state.defaultImage}
                  />
              </div>
        })}
     </div>
    )
  }
}
export default ActiveTeachers
