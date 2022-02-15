import React from 'react'
import { sentenceCase } from 'src/client/Util/Capitalize'

class PracticeItem extends React.Component {

    isBlock() {
        swal({
            title: this.props.pageTexts[4],
            text: this.props.pageTexts[5],
            // title: 'Error!',
            // text: 'Esta práctica esta bloqueada, debe terminar las lecciones o practicas anteriores',
            type: 'warning',
            showCancelButton: 'true',
            confirmButtonText: this.props.pageTexts[6]
            // confirmButtonText: 'Ir a lecciones'
        }).then(() => {
            this.context.router.push('/user-area/practice-web/')
        })
    }

    callSelected() {
        this.props.practiceSelected.call(null, this.props.practiceIndex);
        this.props.onPracticeClicked.call(null);
    }


    render() {

        let itemClass = this.props.itemSelected == this.props.practiceIndex? 'some-selected practice lesson-practice mousePoint' : 'practice lesson-practice mousePoint'
        return (
            <div className="col-xs-12 col-md-6 front">
                {(() => {
                    // if (true) {
                    //freeAccess
                    if (this.props.isUnlocked || this.props.isTeacher) {
                        return (
                            <span className={itemClass} onClick={this.callSelected.bind(this)}>
                                <span className="practice-text">{this.props.practiceIndex + ". "}{sentenceCase(this.props.name)}</span>
                            </span>)
                    } else {
                        return (
                            <span className="practice bloqued" onClick={this.isBlock.bind(this)}>
                                <img className="bloqued-icon" src="/images/bloqued.png" />
                                <span className="practice-text">{this.props.practiceIndex + ". "}{sentenceCase(this.props.name)}</span>
                            </span>)
                    }
                })()}
            </div>
        )
    }
}

export default PracticeItem

PracticeItem.contextTypes = {
    router: React.PropTypes.object
}
