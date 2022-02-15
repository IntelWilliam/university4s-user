import React from 'react'

export default class NotificationItem extends React.Component {
  render() {
    return (
        <li>
          <a href="#!"><i className={this.props.icon} /> {this.props.subject}</a>
          <time className="media-meta" dateTime={this.props.dateTime}>{this.props.timeAgo}</time>
        </li>
    )
  }
}