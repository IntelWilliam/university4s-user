import React from 'react'
import { sentenceCase } from 'src/client/Util/Capitalize'

class LessonCard extends React.Component {

  render() {
    let cardClass = 'card-text-container web-backg-initial'
    if(this.props.levelName == 'fundamental' ){
      cardClass = 'card-text-container web-backg-fundamental'
    }else if(this.props.levelName == 'operacional' ){
      cardClass = 'card-text-container web-backg-operational'
    }

    let imageUrl ="/images/Web-lessons.png";
    // let imageUrl = this.props.smallImage ? this.props.smallImage : "/images/Web-lessons.png";
    return (
      <div className="card" style={{position: 'relative'}}>
        {(() => {
          if(!this.props.isUnlocked) {
            return (
              <div className="bloqued-big-container">
                <img className="bloqued-big" src="/images/bloquedbig.png"/>
              </div>
            )
          }
        })()}
          <div className="image-container">
              <img src={imageUrl}/>

          </div>
          <div className={cardClass}>
              <span className="card-text-title">
                {sentenceCase(this.props.name)}
              </span>

              {(() => {
                if(this.props.description) {
                  return (
                    <span className="card-text" style={{height: 'auto'}}>
                      {sentenceCase(this.props.description)}
                    </span>
                  )
                }
              })()}
          </div>
      </div>
    )
  }
}

export default LessonCard
