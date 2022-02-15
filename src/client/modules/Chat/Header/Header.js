import React from 'react'
import Logo from 'src/client/modules/Chat/Header/Logo'
import HeaderSearch from 'src/client/modules/Chat/Header/HeaderSearch'
import HeaderNav from 'src/client/modules/Chat/Header/HeaderNav'

export default class Header extends React.Component {
  constructor(props) {
    super(props)
    this.state = { notifications: [] }
  }

  componentWillMount() {
    var notifications = [{
      key: 1,
      subject: 'A new order has been placed!',
      dateTime: '2015-06-12T20:50:48+08:00',
      timeAgo: '2 hours ago',
      icon: "mdi-action-add-shopping-cart"
    }, {
      key: 2,
      subject: 'Completed the task',
      dateTime: '2015-06-12T20:50:48+08:00',
      timeAgo: '3 days ago',
      icon: "mdi-action-stars"
    }, {
      key: 3,
      subject: 'Settings updated',
      dateTime: '2015-06-12T20:50:48+08:00',
      timeAgo: '4 days ago',
      icon: "mdi-action-settings"
    }, {
      key: 4,
      subject: 'Director meeting started',
      dateTime: '2015-06-12T20:50:48+08:00',
      timeAgo: '6 days ago',
      icon: "mdi-editor-insert-invitation"
    }, {
      key: 5,
      subject: 'Generate monthly report',
      dateTime: '2015-06-12T20:50:48+08:00',
      timeAgo: '1 week ago',
      icon: "mdi-action-trending-up"
    }]
    this.setState({ notifications: notifications })

  }

  render() {
    return (
      <header id="header" className="page-topbar">
        {/* start header nav*/}
        <div className="navbar-fixed">
          <nav className="navbar-color">
            <div className="nav-wrapper">
            <Logo logo="/images/materialize-logo.png" alt="materialize logo"/>
            <HeaderSearch placeholder="Explora en la pagina" />
            <HeaderNav notifications={this.state.notifications}/>
            </div>
          </nav>
        </div>
        {/* end header nav*/}
      </header>
    )
  }
}
