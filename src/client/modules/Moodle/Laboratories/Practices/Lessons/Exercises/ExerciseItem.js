import React from 'react'
import {Link} from 'react-router'
import Constants from 'src/client/Constants/Constants'


class ExerciseItem extends React.Component {
    render() {
        let lessonType = 'practice-complete'

        if (this.props.lessonType == 2) {
            lessonType = 'practice-mark'
        } else if (this.props.lessonType == 3)
            lessonType = 'practice-order'

        let href = Constants.ADMIN_PATH + `/user-area/practices/lessons/${lessonType}/?levelName=${this.props.levelName}&subLevelName=${this.props.subLevelName}&subLevelId=${this.props.subLevelId}&lessonName=${this.props.lessonName}&lessonId=${this.props.lessonId}&lessonType=${this.props.lessonType}&lessonIndex=${this.props.lessonIndex}&exerciseId=${this.props.exerciseId}&lengthOfExer=${this.props.lengthOfExer}`
        return (
            <div className="col-xs-12 col-md-3 col-sm-6 card-container">
              <Link to={href}>
                    <div className="card">
                        <div className="image-container">
                            <img src="/images/exercise.png"/>
                        </div>
                        <div className="card-text-container practices-title-card">
                            <div className="row">
                                <div className="col-xs-12">
                                    <div className="header-navigation">
                                        <span className="navgation-item practices-navigation practices-navigation-item">
                                            {this.props.lessonName}
                                        </span>
                                    </div>
                                </div>
                                <div className="col-xs-12">
                                    <span className="card-text-title practices-navigation">
                                        Exercise {this.props.exerciseId}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                  </Link>
            </div>
        )
    }
}

export default ExerciseItem
