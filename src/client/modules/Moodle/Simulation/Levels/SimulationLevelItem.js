import React from 'react'
import {Link} from 'react-router'
import Constants from 'src/client/Constants/Constants'

import SubLevelsStore from 'src/client/modules/Moodle/SubLevels/SubLevelsStore'
import SimulationSubLevelItem from 'src/client/modules/Moodle/Simulation/SubLevels/SimulationSubLevelItem'

class PracticeLevelItem extends React.Component {
    constructor() {
        super()
        this.state = {
            allSubLevels: []
        }
    }

    componentWillMount() {
        // se cargan los datos
        this.loadData()
    }

    loadData(page) {
        SubLevelsStore.getOne(this.props.id, (err, response) => {
            if (err)
                return
            this.setState({allSubLevels: response})
        })
    }

    render() {
        let titleClass = "title-inicial"
        if (this.props.id == 2) {
            titleClass = "title-fundamental"
        } else if (this.props.id == 3) {
            titleClass = "title-operacional"
        }
        return (

            <div className="row">
                <div className="col-xs-12">
                    <div className="row">
                        <div className="col-xs-12 text-left title-container title-container-practice">
                            <span className={titleClass}>{this.props.levelName}</span>
                        </div>
                    </div>
                </div>

                {this.state.allSubLevels.map((subLevel, index) => {
                    return <SimulationSubLevelItem key={index} isTeacher={this.props.isTeacher} subName={subLevel.name} subLevelId={subLevel.code} levelId={this.props.id} levelName={this.props.levelName} userdata={this.props.levelUserData[index + 1]} sectionId={this.props.sectionId}/>
                })}

            </div>

        )
    }
}

export default PracticeLevelItem
