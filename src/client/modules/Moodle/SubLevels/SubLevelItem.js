 import React from 'react'
import {Link} from 'react-router'
import Constants from 'src/client/Constants/Constants'

class SubLevelItem extends React.Component {
    render() {
        let image = "/images/basico.jpg"
        let cardClass = "card-text-container web-backg-initial"
        if (this.props.levelId == 3) {
            cardClass = "card-text-container web-backg-operational"
            image = "/images/avanzado.jpg"
        } else if (this.props.levelId == 2) {
          cardClass = "card-text-container web-backg-fundamental"
            image = "/images/intermedio.jpg"
        }

        let ConditionalLink = this.props.userdata.passed || this.props.isTeacher
            ? Link
            : "div";
        let href = Constants.ADMIN_PATH + `/user-area/course/lessons/?levelName=${this.props.levelName}&subLevelName=${this.props.subName}&subLevelId=${this.props.subLevelId}`

        return (
            <div className="col-xs-12 col-md-3 col-sm-6 card-container">

                <ConditionalLink to={href}>
                    <div className="card">
                        <div className="image-container">
                            <img src={image}/> {(() => {
                                if (!this.props.userdata.passed && !this.props.isTeacher) {

                                    return (
                                        <div className="bloqued-big-container">
                                            <img className="bloqued-big" src="/images/bloquedbig.png"/>
                                        </div>
                                    )
                                }
                            })()}
                        </div>

                        <div className={cardClass}>
                            <span className="card-text-title">
                                {this.props.subName}
                            </span>
                        </div>
                    </div>
                </ConditionalLink>
            </div>
        )
    }
}

export default SubLevelItem
