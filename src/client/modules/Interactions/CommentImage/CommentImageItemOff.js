import React from 'react';

class CommentImageItemOff extends React.Component {
  render() {
    const OLD_URL = 'https://image.re-cosmo.com/source';
    const NEW_URL = 'https://dl2ugelrl67z6.cloudfront.net';
    let newUrlResponse = this.props.imageUrl;
    newUrlResponse = newUrlResponse.replace(OLD_URL, NEW_URL);
    return (
      <div className={this.props.classCorrect}>
        <div
          className='image-container-comment'
          onMouseEnter={this.props.mouseEnter}
        >
          <img className='image-interaction-comment' src={newUrlResponse} />
          {(() => {
            if (this.props.classCorrect == ' correct-pronunciation') {
              return (
                <div className='enter-comment'>
                  <div className='icon-comment-container'>
                    <img src='/images/check.png' className='icon-comment' />
                  </div>
                </div>
              );
            }
          })()}
        </div>
      </div>
    );
  }
}

export default CommentImageItemOff;
