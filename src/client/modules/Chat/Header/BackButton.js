import React from 'react'

export default class BackButton extends React.Component {
  onBackPressed() {
    this.props.onBack.call(null);
  }
  render() {
    return (
      <ul className="card-action-buttons" style={{ position: "fixed", zIndex: "9999"}}>
        <li style={{margin: '5px'}}><a className="btn-floating waves-effect waves-light blue accent-4" onClick={this.onBackPressed.bind(this)}><i className="mdi-navigation-arrow-back"></i></a>
        </li>
    </ul>
    )
  }
}
