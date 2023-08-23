import React from 'react'
import {Link} from 'react-router'
// import Constants from 'src/client/Constants/Constants'

export default class HeaderCreateAccount extends React.Component {

    constructor() {
        super()
        this.state = {
            mobileMenu: false,
            mobileSubMenu: 0
        }
    }

    openMenu() {
        this.setState({
            mobileMenu: !this.state.mobileMenu
        })
    }

    openSubMenu(item) {
        this.setState({
            mobileSubMenu: this.state.mobileSubMenu == item
                ? 0
                : item
        })
    }

    goTo(element){
      $("html, body").animate({
          scrollTop: $(element).position().top
      }, "slow");
    }

    render() {

        let hrefLogin = '/login'
        let openMenuClass = this.state.mobileMenu
            ? 'menu-mobile open-menu '
            : 'menu-mobile'
        let openSubMenuClass1 = this.state.mobileSubMenu == 1
            ? 'mobile-sub-menu col-xs-12 open-sub-menu'
            : 'mobile-sub-menu col-xs-12'
        let openSubMenuClass2 = this.state.mobileSubMenu == 2
            ? 'mobile-sub-menu col-xs-12 open-sub-menu'
            : 'mobile-sub-menu col-xs-12'

        return (
            <div>
                <header>
                    <div className="container height-100 header-container">
                        <div className="col-xs-12 height-100">
                            <div className="row height-100">
                                <Link to="/" className="col-xs-3 col-sm-2 col-md-1 image-logo-container height-100">
                                    <img src="/images/logoi.png" className="logo-pagei"/>
                                </Link>
                                <div className="col-xs height-100 menu-top-container">
                                    <ul className="menu-top">
                                        <li className="item-menu mousePoint">
                                          <Link  to="/">Home</Link>
                                        </li>
                                        <li className="item-menu-border mousePoint">
                                            <Link to={hrefLogin}>Iniciar sesión
                                            </Link>
                                        </li>
                                        {/* <li className="item-menu-border mousePoint">
                                          <span onClick={this.goTo.bind(this, "#FAQ")}>FAQ</span>
                                        </li> */}
                                    </ul>
                                </div>
                                <div className="mobile-button mousePoint" onClick={this.openMenu.bind(this)}>
                                    <div className="border-menu"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>
                <div className={openMenuClass}>
                    <div className="col-xs-12">
                        <Link to="/" className="col-xs-12 item-mobile-menu">
                          <span className="link-menu"> Home</span>
                        </Link>
                        <div className="col-xs-12 item-mobile-menu">
                            <Link className="link-menu" to={hrefLogin}>Iniciar sesión
                            </Link>
                        </div>
                        {/* <div className="col-xs-12 item-mobile-menu">
                            <a className="link-menu" href="#">FAQ</a>
                        </div> */}
                    </div>
                </div>
            </div>

        )
    }
}
