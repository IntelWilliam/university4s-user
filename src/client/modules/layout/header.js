import React from 'react'
import { Link } from 'react-router'
// import Constants from 'src/client/Constants/Constants'
import loginUser from 'src/client/modules/Login/'

export default class Header extends React.Component {

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
      mobileSubMenu: this.state.mobileSubMenu == item ? 0 : item
    })
  }

  goHome(){
    let curUser = JSON.parse(localStorage.user)
    if (loginUser.loggedIn()) {
      if(curUser.role == "learner"){
        this.context.router.push('/user-area/')
      }else{
        this.context.router.push('/user-area/video-chat/')
      }
    }else{
      this.context.router.replace('/')
    }
  }

  render() {
    let curUser = JSON.parse(localStorage.user)


    let userImage
    if(localStorage.user){
      userImage = JSON.parse(localStorage.user).profileImg? JSON.parse(localStorage.user).profileImg : '/images/profile-img.png'
    }else{
      userImage = '/images/profile-img.png'
    }


    let hrefAccount = '/user-area/account/'
    let hrefPractices = '/user-area/practices/'
    let hrefWebPractice = '/user-area/practice-web/'
    let hrefEval = '/user-area/exams/'
    let hrefDash = '/user-area/metricas/'
    let hrefVideo = '/user-area/video/'
    let videoTutorial = '/video-tutorial/'

    let hrefSimulGrammar = '/user-area/simulation/?sectionId=1&sectionName=Gramática'
    let hrefSimulRead = '/user-area/simulation/?sectionId=2&sectionName=Comprensión de Lectura'
    let hrefSimulListen = '/user-area/simulation/?sectionId=3&sectionName=Comprensión Auditiva'

    let hrefCurso = '/user-area/'
    let hrefChat = '/user-area/video-chat/'
    let hrefInquiryBox = '/user-area/inquirybox/'
    let hrefHelp = '/user-area/help/'
    let teacherName = curUser.role == "learner" ? "user-nav-container" : 'user-nav-container teacher-display'
    let teacherClass = curUser.role == "learner" ? 'row height-100 center-flex' : 'row height-100 center-flex teacher-position'

    let openMenuClass = this.state.mobileMenu ? 'menu-mobile open-menu ' : 'menu-mobile'
    let openSubMenuClass1 = this.state.mobileSubMenu == 1 ? 'mobile-sub-menu col-xs-12 open-sub-menu' : 'mobile-sub-menu col-xs-12'
    let openSubMenuClass2 = this.state.mobileSubMenu == 2 ? 'mobile-sub-menu col-xs-12 open-sub-menu' : 'mobile-sub-menu col-xs-12'
    let openSubMenuClass3 = this.state.mobileSubMenu == 3 ? 'mobile-sub-menu col-xs-12 open-sub-menu' : 'mobile-sub-menu col-xs-12'

    let newTab = (this.props.path === '/user-area/video-chat/' )? "_blank" : "";
    // let newTab = (curUser.role !== "learner" && this.props.path === '/user-area/video-chat/' )? "_blank" : "";

    return (
      <div>
                <header>
                    <div className="container height-100 header-container">
                        <div className="col-xs-12 height-100">
                            <div className={teacherClass}>
                                <div className="col-xs-3 col-sm-2 col-md-1 image-logo-container height-100">
                                        <img src="/images/logo.png" onClick={this.goHome.bind(this)} className="logo-page mousePoint"/>
                                </div>
                                {(() => {
                                    if(true) {
                                    // if(curUser.role == "learner") {
                                      return  (
                                        <div className="col-xs height-100 menu-top-container">
                                            <ul className="menu-top menu-top-flex">
                                                {/* <li className="item-menu">
                                                    <Link className="mousePoint tutorial-button" target={newTab} to={videoTutorial}>Video tutoriales
                                                    </Link>
                                                </li> */}

                                                <li className="item-menu">
                                                    <Link className="mousePoint" target={newTab} to={hrefCurso}>Curso
                                                    </Link>
                                                </li>
                                                <li className="item-menu-border">
                                                    <a className="mousePoint">Laboratorios</a>
                                                    <div className="sub-menu">
                                                        <ul>
                                                            <li>
                                                                <Link target={newTab} to={hrefWebPractice}>Web prácticas
                                                                </Link>
                                                            </li>
                                                            <li>
                                                                <Link target={newTab} to={hrefPractices}>Prácticas
                                                                </Link>
                                                            </li>
                                                            <li>
                                                              <Link target={newTab} to={hrefVideo}>Video
                                                              </Link>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </li>

                                                <li className="item-menu-border">
                                                    <a className="mousePoint">Simuladores</a>
                                                    <div className="sub-menu">
                                                        <ul>
                                                            <li>
                                                                <Link target={newTab} to={hrefSimulGrammar}>Gramática
                                                                </Link>
                                                            </li>
                                                            <li>
                                                                <Link target={newTab} to={hrefSimulRead}>Comprensión de Lectura
                                                                </Link>
                                                            </li>
                                                            <li>
                                                                <Link target={newTab} to={hrefSimulListen}>Comprensión Auditiva
                                                                </Link>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </li>

                                              <li className="item-menu-border">
                                                <Link className="mousePoint" target={newTab} to={hrefEval}>Evaluación
                                                </Link>
                                              </li>

                                              <li className="item-menu-border">
                                                <Link className="mousePoint" target={newTab} to={hrefDash}> Progreso
                                                </Link>
                                              </li>

                                                
                                                <li className="item-menu-border">
                                                    <a className="mousePoint">Consultas</a>
                                                    <div className="sub-menu">
                                                        <ul>
                                                            <li>
                                                              <Link target={newTab} to={hrefInquiryBox}>Buzón de consultas
                                                              </Link>
                                                            </li>
                                                            <li>
                                                              <Link target={newTab} to={hrefHelp}>Ayuda
                                                              </Link>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </li>
                                            </ul>
                                        </div>
                                        )
                                    }else{
                                      return(
                                        <div className="col-xs height-100 menu-top-teacher">
                                            {/* <ul className="menu-top">
                                                <li className="item-menu">
                                                      <Link to={hrefChat}>Video chats
                                                    </Link>
                                                </li>
                                            </ul> */}
                                        </div>

                                      )
                                    }
                                })()}
                                <div className="nav-user-area height-100 user-icon-container">
                                    <Link target={newTab} to={hrefAccount} className={teacherName}>
                                        <span className="name-user">{curUser.name + ' ' + curUser.lastname}</span>
                                    </Link>
                                    <Link to={hrefAccount} target={newTab} className="img-user-list">
                                        <img src={userImage} className="cosmo-image"/>
                                    </Link>
                                </div>
                                {(() => {
                                    if(true) {
                                    // if(curUser.role == "learner") {
                                        return (<div className="mobile-button mousePoint" onClick={this.openMenu.bind(this)}>
                                                <div className="border-menu"></div>
                                            </div>)
                                    }
                                })()}
                            </div>
                        </div>
                    </div>
                </header>
                {(() => {
                    if(true) {
                    // if(curUser.role == "learner") {
                        return ( <div className={openMenuClass}>
                                    <div className="col-xs-12">
                                        <div className="col-xs-12 item-mobile-menu">
                                            <Link to={videoTutorial} target={newTab} className="link-menu">Video tutoriales
                                            </Link>
                                        </div>

                                        <div className="col-xs-12 item-mobile-menu">
                                            <Link to={hrefCurso} target={newTab} className="link-menu">Curso
                                            </Link>
                                        </div>
                                        <div className="col-xs-12 item-mobile-menu">
                                            <div className="row">
                                                <div className="col-xs-12 mousePoint" onClick={this.openSubMenu.bind(this, 1)}>
                                                    <a className="link-menu">
                                                        <span>Laboratorios</span>
                                                        <div className="rowgo rowgo-mobile"><img src="/images/rowgo.png"/></div>
                                                    </a>
                                                </div>
                                            </div>
                                            <div className={openSubMenuClass1}>
                                                <div className="col-xs-12 item-mobile-sub-menu">
                                                    <Link target={newTab} to={hrefWebPractice}>Web práctica
                                                    </Link>
                                                </div>
                                                <div className="col-xs-12 item-mobile-sub-menu">
                                                    <Link target={newTab} to={hrefPractices}>Prácticas
                                                    </Link>
                                                </div>
                                                <div className="col-xs-12 item-mobile-sub-menu">
                                                    <Link target={newTab} to={hrefVideo}>Video
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="col-xs-12 item-mobile-menu">
                                            <div className="row">
                                                <div className="col-xs-12 mousePoint" onClick={this.openSubMenu.bind(this, 2)}>
                                                    <a className="link-menu">
                                                        <span>Simuladores</span>
                                                        <div className="rowgo rowgo-mobile"><img src="/images/rowgo.png"/></div>
                                                    </a>
                                                </div>
                                            </div>
                                            <div className={openSubMenuClass2}>
                                                <div className="col-xs-12 item-mobile-sub-menu">
                                                    <Link target={newTab} to={hrefSimulGrammar}>Gramática</Link>
                                                </div>
                                                <div className="col-xs-12 item-mobile-sub-menu">
                                                    <Link target={newTab} to={hrefSimulRead}>Comprensión de Lectura</Link>
                                                </div>
                                                <div className="col-xs-12 item-mobile-sub-menu">
                                                    <Link target={newTab} to={hrefSimulListen}>Comprensión Auditiva</Link>
                                                </div>
                                            </div>
                                        </div>
                                      <div className="col-xs-12 item-mobile-menu">
                                        <Link target={newTab} to={hrefEval}>Evaluación
                                        </Link>
                                      </div>
                                        <div className="col-xs-12 item-mobile-menu">
                                              <Link className="link-menu" to={hrefChat}>Video chat
                                            </Link>
                                        </div>


                                        <div className="col-xs-12 item-mobile-menu">
                                            <div className="row">
                                                <div className="col-xs-12 mousePoint" onClick={this.openSubMenu.bind(this, 3)}>
                                                    <a className="link-menu">
                                                        <span>Consultas</span>
                                                        <div className="rowgo rowgo-mobile"><img src="/images/rowgo.png"/></div>
                                                    </a>
                                                </div>
                                            </div>
                                            <div className={openSubMenuClass3}>
                                                <div className="col-xs-12 item-mobile-sub-menu">
                                                    <Link target={newTab} to={hrefInquiryBox}>Buzón de consultas</Link>
                                                </div>
                                                <div className="col-xs-12 item-mobile-sub-menu">
                                                    <Link target={newTab} to={hrefHelp}>Ayuda</Link>
                                                </div>
                                            </div>
                                        </div>

                                        {/* <div className="col-xs-12 item-mobile-menu">
                                            <a className="link-menu" href="#">Consultas</a>
                                        </div> */}
                                    </div>
                                </div>)
                    }
                })()}
            </div>

    )
  }
}

Header.contextTypes = {
  router: React.PropTypes.object
}
