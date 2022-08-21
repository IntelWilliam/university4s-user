import React, { PropTypes, Component } from 'react';
import { DropTarget } from 'react-dnd';
import Pronouncer from 'src/client/modules/Pronouncer/Pronouncer';
import { sentenceCase } from 'src/client/Util/Capitalize';

const style = {
  height: '12rem',
  width: '12rem',
  marginRight: '1.5rem',
  marginBottom: '1.5rem',
  color: 'white',
  padding: '1rem',
  textAlign: 'center',
  fontSize: '1rem',
  lineHeight: 'normal',
  float: 'left',
};

const dustbinTarget = {
  drop(props, monitor) {
    props.onDrop(monitor.getItem());
  },
};

@DropTarget((props) => props.accepts, dustbinTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  canDrop: monitor.canDrop(),
}))
export default class Dustbin extends Component {
  static propTypes = {
    connectDropTarget: PropTypes.func.isRequired,
    isOver: PropTypes.bool.isRequired,
    canDrop: PropTypes.bool.isRequired,
    accepts: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    lastDroppedItem: PropTypes.object,
    onDrop: PropTypes.func.isRequired,
  };

  sayWord() {
    // se pronuncia la palabra deseada
    Pronouncer.sayWord(this.props.lastDroppedItem.name);
  }

  sayWordSpeed() {
    // se pronuncia la palabra deseada
    Pronouncer.sayWord(this.props.lastDroppedItem.name, null, { rate: 0.5 });
  }

  render() {
    const { image, isOver, canDrop, connectDropTarget, lastDroppedItem } =
      this.props;
    const isActive = isOver && canDrop;
    let backgroundColor = '#222';
    if (isActive) {
      backgroundColor = 'darkgreen';
    } else if (canDrop) {
      backgroundColor = 'darkkhaki';
    }

    const OLD_URL = 'https://image.re-cosmo.com/source';
    const NEW_URL = 'https://dl2ugelrl67z6.cloudfront.net';
    let newUrlResponse = image;
    newUrlResponse = newUrlResponse.replace(OLD_URL, NEW_URL);

    return connectDropTarget(
      <div className='image-drag-excercise col-xs-9'>
        <div className='comment-item col-xs-4'>
          <div className='image-container-drag'>
            <img className='image-drag' src={newUrlResponse} />
          </div>
        </div>
        <div className='col-xs-8 drag-word-place-container'>
          {(() => {
            if (lastDroppedItem) {
              return (
                <div className='row'>
                  <div className='col-xs-12'>
                    <div style={{ textAlign: 'end' }}>
                      {' '}
                      <span className='text-to-say'>
                        {sentenceCase(lastDroppedItem.name)}/
                      </span>{' '}
                      <span>{sentenceCase(lastDroppedItem.translation)}</span>
                    </div>
                  </div>
                  <div className='col-xs-12'>
                    <div className='' onClick={this.sayWordSpeed.bind(this)}>
                      <img
                        style={{
                          float: 'right',
                          marginLeft: '5px',
                          marginTop: '0.3em',
                        }}
                        src='/images/turtle.png'
                        className='icon-comment mousePoint'
                      />
                    </div>
                    <div className='' onClick={this.sayWord.bind(this)}>
                      <img
                        style={{
                          float: 'right',
                          marginLeft: '5px',
                          marginTop: '0.3em',
                        }}
                        src='/images/sound.png'
                        className='icon-comment mousePoint'
                      />
                    </div>
                  </div>
                </div>
              );
            } else {
              return (
                <p className='drag-word-place'>Arrastra la palabra correcta</p>
              );
            }
          })()}
        </div>
      </div>
    );
  }
}
