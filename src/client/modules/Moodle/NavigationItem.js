import React from 'react'
import {Link} from 'react-router'

export default class NavigationItem extends React.Component {

    render() {
        let classRow = this.props.index > 0
            ? 'row-navigation navgation-item'
            : 'navgation-item'
        return (
            <div>
                {(() => {
                    if (this.props.url) {
                        return (
                            <Link to={this.props.url}>
                                <span className={classRow}>{this.props.name}</span>
                            </Link>
                        )

                    } else {
                        return <span className={classRow}>{this.props.name}</span>
                    }
                })()}
            </div>
        )
    }
}
