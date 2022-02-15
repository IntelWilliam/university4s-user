import React from 'react'
import NotificationItem from 'src/client/modules/Chat/Header/NotificationItem'

export default class NotificationDropdown extends React.Component {
  render() {
    return (
      <ul id="notifications-dropdown" className="dropdown-content">
        <li>
          <h5>NOTIFICATIONS <span className="new badge">5</span></h5>
        </li>
        <li className="divider" />
       {this.props.notifications.map((notification) => {
          return <NotificationItem
                   key={notification.key}
                   subject={notification.subject}
                   dateTime={notification.dateTime}
                   timeAgo={notification.timeAgo}
                   icon={notification.icon}
                    />
        })}
      </ul>
    )
  }
}