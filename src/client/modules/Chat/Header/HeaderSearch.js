import React from 'react'

export default class HeaderSearch extends React.Component {
  render() {
    return (
      <div className="header-search-wrapper hide-on-med-and-down">
        <i className="mdi-action-search" />
        <input type="text" name="Search" className="header-search-input z-depth-2" placeholder={this.props.placeholder} />
      </div>
    )
  }
}
