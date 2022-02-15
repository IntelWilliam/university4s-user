import React from 'react'
import ActiveTeachers from 'src/client/modules/Chat/Teachers/ActiveTeachers'
import ActiveRooms from 'src/client/modules/Chat/Rooms/ActiveRooms'

export default class SessionList extends React.Component {
    render() {
        return (
            <div>
                <ActiveTeachers allTeachers={this.props.allTeachers} onCallTeacher={this.props.onCallTeacher}/>
                <ActiveRooms allRooms={this.props.allRooms}/>
            </div>
        )
    }
}
