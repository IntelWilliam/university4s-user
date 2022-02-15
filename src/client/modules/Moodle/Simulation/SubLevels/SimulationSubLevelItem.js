import React from 'react'
import {Link} from 'react-router'
import Constants from 'src/client/Constants/Constants'

class SubLevelItem extends React.Component {
    render() {
        let image = "/images/practicas-sublevel-inicial.png"
        if (this.props.levelId == 2) {
            image = "/images/practicas-sublevel-operacional.png"
        } else if (this.props.levelId == 3) {
            image = "/images/practicas-sublevel-fundamental.png"
        }

        let ConditionalLink = this.props.userdata.passed || this.props.isTeacher
            ? Link
            : "div";


        let href = Constants.ADMIN_PATH + `/user-area/simulation/grammar/?sectionId=${this.props.sectionId}&subLevelId=${this.props.subLevelId}&subName=${this.props.subName}`
        if (this.props.sectionId == 2)
          href = Constants.ADMIN_PATH + `/user-area/simulation/reading/?sectionId=${this.props.sectionId}&subLevelId=${this.props.subLevelId}&subName=${this.props.subName}`
        if (this.props.sectionId == 3)
          href = Constants.ADMIN_PATH + `/user-area/simulation/listening/?sectionId=${this.props.sectionId}&subLevelId=${this.props.subLevelId}&subName=${this.props.subName}`



        return (

            <div className="col-xs-12 col-md-3 col-sm-6 card-container">
                {/* <a href="#"> */}
                <ConditionalLink to={href}>
                    <div className="card">
                        <div className="image-container">
                            <img src={image}/>{(() => {
                                if (!this.props.userdata.passed && !this.props.isTeacher) {

                                    return (
                                        <div className="bloqued-big-container">
                                            <img className="bloqued-big" src="/images/bloquedbig.png"/>
                                        </div>
                                    )
                                }
                            })()}
                        </div>
                        <div className="card-text-container">
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
