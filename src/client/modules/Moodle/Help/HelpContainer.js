import React from 'react'

export default class HelpContainer extends React.Component {
    render() {
        let answer = this.props.info.a25Respuesta.replace(/<[^>]*>?/g, '').replace(/&nbsp;/g, '')

        return (

            <div className="col-xs-12">
                <div className="row">

                    <div className="col-xs-12">
                        <div className="row">

                            {(() => {
                                if (this.props.indexInfo != 1) {
                                    return (
                                        <div className="col-xs-12 marginHelp">
                                            <div className="row">
                                                <div className="col-xs-12">
                                                    <div className="exercise-border-dotted">
                                                        <span>&nbsp;</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                }
                            })()}

                            <div className="col-xs-1 help-number-center">
                                <div className="row">
                                    <div className="help-number">
                                        <span className="help-number-font">{this.props.indexInfo}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="col-xs-11">
                                <div className="row">
                                    <div className="title-container helpColor" style={{
                                        'paddingLeft': 0
                                    }}>
                                        <span className="title-exercise color-text-help">{this.props.info.a25Pregunta}
                                        </span>
                                        <span className="description-exercise">
                                            <div>
                                                {answer}
                                            </div>
                                        </span>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>

                </div>
            </div>

        )
    }
}
