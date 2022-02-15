import React from 'react'

export default class UserInfo extends React.Component {
  render() {
    return (
        <div className="favorite-associate-list chat-out-list row">
            <div className="col-xs-4">
              <img src={this.props.picture} alt="" className="circle responsive-img online-user valign profile-image"/>
            </div>
            <div className="col-xs-8">
                <p>{this.props.name} {this.props.lastname}</p>
                <p className="place">{this.props.email}</p>
            </div>
        </div>
    )
  }
}
