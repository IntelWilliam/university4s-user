import React from 'react'

export default class LoginFooter extends React.Component {

    render() {
        return (
            <footer className="login-footer">
                <div className="col-xs-12">
                    <div className="row center-xs footer-container">
                        <img className="login-footer-icon" src="/images/mailicon.png"/>
                        <span className="footer-text-login">
                          consultas@ibceducacion.com
                        </span>
                        <img className="login-footer-icon" src="/images/phoneicon.png"/>
                        <span className="footer-text-login-last">
                          Whatsapp: 987 400 536
                        </span>
                        {/*<img className="login-footer-icon" src="/images/facebookicon.png"/>*/}
                        {/*<span className="footer-text-login-last">*/}
                          {/*Facebook*/}
                        {/*</span>*/}
                    </div>
                </div>
            </footer>
        )
    }
}
