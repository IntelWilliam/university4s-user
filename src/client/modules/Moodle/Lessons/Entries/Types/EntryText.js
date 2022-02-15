import React from 'react'
import Constants from 'src/client/Constants/Constants'
import Footer from 'src/client/modules/layout/footer'
import HeaderPage from 'src/client/modules/Moodle/HeaderPage'

export default class EntryExam extends React.Component {
    constructor() {
        super()
        this.state = {
        }
    }

    componentWillMount() {
    }

    render() {
        let styleSelec = {
            background: '#84DA4F',
            color: 'white'
        };

        let styleWrong = {
            background: 'rgba(255,0,0,0.5)',
            color: 'white',
            border: 'solid 1px rgba(255,0,0,0.5)'
        };

        return (
            <div className="col-xs-12">
                <div className="col-xs-12 section-name">
                    <div className="col-xs-12">
                        <div className="row">
                            <div className="col-xs-12">
                                <div className="exercise-border">
                                    <span>&nbsp;</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-xs-12">
                        <div className="row">
                            <div className="col-xs-12 col-md">
                                <div className="image-drag-excercise">
                                    <div className="pdf-icon-container">
                                        <img className="pdf-icon" src="/images/book.png"/>
                                    </div>
                                    <div className="info-title-container">
                                        <div className="row">
                                            <div className="col-xs-12">
                                                <span className="info-title">{this.props.entry.name}</span>
                                            </div>
                                            <div className="col-xs-12">
                                                <span className="info-description">{this.props.entry.text}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-xs-12">
                        <div className="row">
                            <div className="col-xs-12">
                                <div className="exercise-border-dotted">
                                    <span>&nbsp;</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


            </div>
        )
    }
}

EntryExam.contextTypes = {
    router: React.PropTypes.object
}
