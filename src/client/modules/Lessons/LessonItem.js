import React from 'react'
import { Link } from 'react-router'
import LessonCard from 'src/client/modules/Lessons/LessonCard'
class LessonItem extends React.Component {

  render() {
    let href = `/user-area/practice-web/level/${this.props.levelId}/sub-level/${this.props.subLevelId}/lesson/${this.props.id}/levelName/${this.props.levelName + ' ' + this.props.selectedSubLevel}`
    return (
      <div className="col-xs-12 col-md-3 col-sm-6 card-container">
                {(() => {
                // freeAccess
                // if(true) {
                if(this.props.isUnlocked || this.props.isTeacher) {
                    return (
                        <Link to={href}>
                            <LessonCard
                                        name={this.props.name}
                                        levelName = {this.props.levelName}
                                        description={this.props.description}
                                        smallImage= {this.props.smallImage}
                                        // freeAccess
                                        // isUnlocked={this.props.isUnlocked}/>
                                        isUnlocked={true}/>
                        </Link>
                    )
                } else {
                    return <LessonCard name={this.props.name}
                                       levelName = {this.props.levelName}
                                       description={this.props.description}
                                       smallImage= {this.props.smallImage}
                                       isUnlocked={this.props.isUnlocked}/>
                }
                })()}
            </div>
    )
  }
}

export default LessonItem
