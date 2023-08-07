import React from 'react'
import {Link} from 'react-router'

export default class LoginHeader extends React.Component {

    render() {
        return (
            <div className="col-xs-12 front front-nackground">
                <div className="row" style={{paddingBottom: "1rem"}}>
                    <div className="container width-100">
                        <div className="col-xs-12 height-login-header">
                            <div className="row height-100">
                                <div className="col-xs-6 start-xs height-100 login-nav-img-container">
                                    <div className="image-logo-container header-login">
                                    <Link to="/">
                                        <img src="/images/logo.png" className="logo-page" style={{paddingBottom: "0.5rem"}}/>
                                    </Link>
                                    </div>
                                </div>
                                <Link to="/newaccount/" className="col-xs-6 end-xs height-100 register-container">
                                    <button className="register">Regístrate</button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
