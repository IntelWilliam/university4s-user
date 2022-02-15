import React from 'react'

export default class Logo extends React.Component {
  render() {
    return (
      <ul className="left">                      
        <li>
	        <h1 className="logo-wrapper">
		        <a href="index.html" className="brand-logo darken-1">
		        	<img src={this.props.logo} alt={this.props.alt} />
		        </a>
		        <span className="logo-text">{this.props.alt}</span>
	        </h1>
        </li>
      </ul>
    )
  }
}