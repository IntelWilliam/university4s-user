import React from 'react'
import TranslationFlags from 'src/client/modules/Chat/Header/TranslationFlags'
import NotificationDropdown from 'src/client/modules/Chat/Header/NotificationDropdown'

export default class HeaderNav extends React.Component {
  render() {
    return (
              <ul className="right hide-on-med-and-down">
                <li>
                <a href="javascript:void(0);" className="waves-effect waves-block waves-light translation-button" data-activates="translation-dropdown"><img src="/images/flag-icons/United-States.png" alt="USA" /></a>
                <TranslationFlags />
                </li>
                <li><a href="javascript:void(0);" className="waves-effect waves-block waves-light toggle-fullscreen"><i className="mdi-action-settings-overscan" /></a>
                </li>
                <li><a href="javascript:void(0);" className="waves-effect waves-block waves-light notification-button" data-activates="notifications-dropdown"><i className="mdi-social-notifications"><small className="notification-badge">5</small></i></a>
                  <NotificationDropdown notifications={this.props.notifications}/>
                </li>                        
                <li><a href="#" data-activates="chat-out" className="waves-effect waves-block waves-light chat-collapse"><i className="mdi-communication-chat" /></a>
                </li>
              </ul>
    )
  }
}
