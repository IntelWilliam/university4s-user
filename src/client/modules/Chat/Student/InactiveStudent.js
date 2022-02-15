import React from 'react'

export default class InactiveStudent extends React.Component {
  /**
   * Metodo encargado de cambiar el estado del chat a un profesor, de acuerdo a esto se decide
   * si se muestra la lista de alumnos o el chat con alguno
   * @param userId
   */

  constructor() {
    super();
    this.state = {
      activeList: false,
      read: false
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.student != nextProps.student) {
      this.setState({activeList: false})
    }
  }

  // componentDidMount(){   this.setState({     badgeState: this.props.badge ?
  // this.props.badge : 0   }) }

  handleClick(userId, roomId) {
    // al ser seleccionado se pone en 0 las notificaciones
    this.setState({read: true})

    // roomId = offLine
    this.props.changeChatStatus.call(null, userId, roomId);
  }

  render() {
    let userImg = this.props.student.profileImg
      ? this.props.student.profileImg
      : '/images/profile-img.png'

    let badge = 0

    // console.log('this.state.read', this.state.read);
    // if (!this.state.read) {
      badge = this.props.badge ? this.props.badge : 0
    // }

    let orangeMenssage = badge > 0
    ? 'orangeMenssage'
    : ''

    return (
      <div className="col-xs-12">
        <div
          className={"learner-list " + orangeMenssage}
          onClick={this.handleClick.bind(this, this.props.student._id, 'offLine')}
          style={{
          background: 'gray'
        }}>
          <div
            className="img-user-list">
            <img src={userImg} className="cosmo-image"/>
          </div>
          <div
            className="user-list-header-text-container"
            style={{
            maxWidth: "9em"
          }}>
            <span
              className="user-list-header-text-learner">{this.props.student.name + ' ' + this.props.student.lastname}</span>
            <span title="Notificación" className="badge ">{badge}</span>
          </div>

        </div>

      </div>
    )
  }
}
