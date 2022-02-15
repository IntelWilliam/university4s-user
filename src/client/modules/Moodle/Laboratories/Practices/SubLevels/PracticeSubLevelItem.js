import React from 'react'
import {Link} from 'react-router'
import Constants from 'src/client/Constants/Constants'

class SubLevelItem extends React.Component {
    render() {
        let image = "/images/practicas-sublevel-inicial.png"
        let cardClass = "card-text-container web-backg-initial"
        if (this.props.levelId == 2) {
            cardClass = "card-text-container web-backg-fundamental"
            image = "/images/practicas-sublevel-operacional.png"
        } else if (this.props.levelId == 3) {
          cardClass = "card-text-container web-backg-operational"
            image = "/images/practicas-sublevel-fundamental.png"
        }

        let ConditionalLink = this.props.userdata.passed
            ? Link
            : "div";
        let href = Constants.ADMIN_PATH + `/user-area/practices/lessons/?levelName=${this.props.levelName}&subLevelName=${this.props.subName}&subLevelId=${this.props.subLevelId}`

        return (

            <div className="col-xs-12 col-md-3 col-sm-6 card-container">
                <ConditionalLink to={href}>
                    <div className="card">
                        <div className="image-container">
                            <img src={image}/>{(() => {
                                if (!this.props.userdata.passed) {

                                    return (
                                        <div className="bloqued-big-container">
                                            <img className="bloqued-big" src="/images/bloquedbig.png"/>
                                        </div>
                                    )
                                }
                            })()}
                        </div>
                        <div className={cardClass}>
                            <span className="card-text-title practices-title-card">
                                {this.props.subName}
                            </span>
                        </div>
                    </div>
                </ConditionalLink>
                {/* </a> */}
            </div>
        )
    }
}

export default SubLevelItem
