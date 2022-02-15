import React from 'react'
import RoomsStore from 'src/client/modules/Chat/Rooms/RoomsStore'
import UserInfo from 'src/client/modules/Chat/Chat/UserInfo'

class ActiveRooms extends React.Component {

    render() {
        return (
            <div>
                <div className="col-xs-12">
                            <div className="blue lighten-1">
                                    <div className="center-align">
                                        <div className="col-xs-12 caption white-text"><p>En sesión</p></div>
                                    </div>
                            </div>
                </div>
                <div>
                {
                    this.props.allRooms.map((room, index) => {
                        let footerMessage = room.status == 1 ? "En llamada": "en chat";
                       return (
                        <div className="row" key={index}>
                            <div className="col-xs-12">
                                <div className="row">
                                    <div className="col-xs-12">
                                        <div className="card  grey lighten-3">
                                            <div className="card-content white-text">
                                                {
                                                    room.users.map((user, index) => {
                                                        let image = user.role == 'teacher' ?
                                                            "images/teacher.png":"images/student.png"
                                                        return (
                                                        <div className="chip blue lighten-1 white-text col-xs-12"
                                                             style={{margin: '4px'}} key={index}>
                                                            <img src={image} alt="Materialize" />
                                                            {user.name} {user.lastname}
                                                        </div>
                                                        )
                                                    })
                                                }
                                            </div>
                                            <div className="card-action cyan darken-4">
                                            <a href="#" className="cyan-text text-lighten-5">{footerMessage}</a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                       )
                    })}
                </div>
            </div>
        )
    }
}
export default ActiveRooms
