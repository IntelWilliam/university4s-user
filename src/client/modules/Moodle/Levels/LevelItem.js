import React from 'react'

import SubLevelsStore from 'src/client/modules/Moodle/SubLevels/SubLevelsStore'
import SubLevelItem from 'src/client/modules/Moodle/SubLevels/SubLevelItem'

class LevelItem extends React.Component {
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

    loadData() {
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
            <div className="row" style={{'paddingBottom': '2.5em'}}>
                <div className="col-xs-12">
                    <div className="row">
                        <div className="col-xs-12 text-left title-container">
                            <span className={titleClass}>{this.props.name}</span>
                        </div>
                    </div>
                </div>
                {this.state.allSubLevels.map((subLevel, index) => {
                    return <SubLevelItem key={index} isTeacher={this.props.isTeacher} subName={subLevel.name} subLevelId={subLevel.code} levelId={this.props.id} levelName={this.props.name} userdata={this.props.levelUserData[index + 1]}/>
                })}
            </div>
        )
    }
}

export default LevelItem
