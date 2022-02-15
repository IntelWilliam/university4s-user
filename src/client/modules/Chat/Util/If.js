import React from 'react'

export default class If extends React.Component {
    render() {
        if (this.props.exist) {
            return this.props.children
        }
        else {
            return false
        }
    }
}