import React from 'react'
import { Link } from 'react-router'

class OptionItem extends React.Component {
  // se ejecuta cuando el componente ya esté montado
  componentDidMount() {
    // $('.tooltipped').tooltip({ delay: 50 });
  }

  render() {
    if (this.props.selected) {
      return (
        <option selected value={this.props.value}>{this.props.name}</option>
      )
    } else {
      return (
        <option value={this.props.value}>{this.props.name}</option>
      )
    }

  }
}

export default OptionItem
