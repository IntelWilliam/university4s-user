import React from 'react'

class CommentImageItemOff extends React.Component {

  render() {
    return (
        <div className={this.props.classCorrect}>
            <div className="image-container-comment" onMouseEnter={this.props.mouseEnter}>
                <img className="image-interaction-comment" src={this.props.imageUrl}/>
                {(() => {
                    if(this.props.classCorrect == " correct-pronunciation") {
                        return (
                            <div className="enter-comment">
                                <div className="icon-comment-container">
                                    <img src="/images/check.png" className="icon-comment"/>
                                </div>
                            </div>
                        )
                    }
                })()}
            </div>
        </div>
    )
  }
}

export default CommentImageItemOff
