import React from 'react'
// import Constants from 'src/client/Constants/Constants'
import Footer from 'src/client/modules/layout/footer'
import HeaderPage from 'src/client/modules/Moodle/HeaderPage'
import Header from 'src/client/modules/layout/header'
// import FrontTextsActions from 'src/client/modules/FrontTexts/FrontTextsActions'
// import {Link} from 'react-router'
import loginUser from 'src/client/modules/Login/'
import HeaderHome from 'src/client/modules/layout/HeaderHome'

export default class videoTutorial extends React.Component {
  constructor() {
    super()
    this.state = {
      isLogin: false,
      categories: [
        {
          id: "1",
          name: "Antes de empezar",
          description: "Pasos que debes tener en cuenta antes de poder usar tu plataforma Akron English",
          authRequired: false,
          videos: [
            {
              id: "1",
              name: "Crea tu cuenta de Gmail (correo electrónico)",
              src: "https://image.re-cosmo.com/source/video-tutorial/GMAIL.mp4"
            },
            {
              id: "2",
              name: "Tutorial Video-Chat",
              src: "https://image.re-cosmo.com/source/video-tutorial/USO%20VIDEOCHAT%20-%20NUEVA%20PLAT.mp4"
            },
            {
              id: "3",
              name: "Crear tu cuenta",
              src: "https://image.re-cosmo.com/source/video-tutorial/creacion%20de%20cuentra%20akron.mp4"
            },
          ]
        },
        {
          id: "2",
          name: "Guía General",
          description: "Aprende los usos y la navegación generales de tu plataforma Akron Englis",
          authRequired: true,
          videos: [
            {
              id: "4",
              name: "Generalidades de tu curso",
              src: "https://image.re-cosmo.com/source/video-tutorial/Generalidades%20de%20tu%20curso.mp4"
            },
            {
              id: "5",
              name: "Mi perfil",
              src: "https://image.re-cosmo.com/source/video-tutorial/Mi%20perfil.mp4"
            },
            {
              id: "6",
              name: "Web práctica, tu sección para poner en práctica lo aprendido",
              src: "https://image.re-cosmo.com/source/video-tutorial/Web%20pr%C3%A1ctica.mp4"
            },
            {
              id: "7",
              name: "Cómo utilizar tu libro virtual",
              src: "https://image.re-cosmo.com/source/video-tutorial/C%C3%B3mo%20utilizar%20tu%20libro%20virtual.mp4"
            },
            {
              id: "8",
              name: "Cómo recuperar tu contraseña",
              src: "https://image.re-cosmo.com/source/video-tutorial/C%C3%B3mo%20recuperar%20tu%20contrase%C3%B1a.mp4"
            },
          ]
        }
      ],
    }
  }

  componentWillMount() {
    // this.loadPageTexts()

    // funcion que se llama para autorizar la entrada a un estado de la palicacion
    if (loginUser.loggedIn()) {
      // console.log('is loguin');
      this.setState({isLogin: true})
    }else{
      // console.log('not loguin');
      this.setState({isLogin: false})
    }
  }

  componentDidMount() {
    this.goTop()
  }

  goTop() {
    $("html, body").animate({
      scrollTop: 0
    }, "slow");
  }

  openModalVideo() {
    console.log('open modal done')
    const modal = document.getElementById('myModal');
    const captionText = document.getElementById("caption");
    const videoSrc = document.getElementById("video");
  }

  closeModal() {
    console.log('close!')
    const modal = document.getElementById('myModal');
    modal.style.display = "none";
    $('video').trigger('pause');
  }

  render() {
    let navigationArray = [
      // {
      //   'name': this.state.pageTexts[0],
      //   // 'name': 'Inicio',
      //   'url': Constants.ADMIN_PATH + `/user-area/`
      // }, {
      //   'name': this.state.pageTexts[1],
      //   // 'name': 'Video - Chat',
      //   'url': null
      // }
    ]
    let headerInfo = {
      // title: this.state.pageTexts[2],
      // description: this.state.pageTexts[4],
      title: "Video-tutoriales",
      description: 'En esta sección podrás encontrar todo el material audiovisual que te ayudará a conocer mejor tu plataforma de inglés y poder aprovechar al máximo todos sus beneficios.',
    }

    return (
      <div style={{
        background: "#F6F7F7"
      }}>
        <div id="myModal" className="videoModal">
          <span
            className="closeModal"
            onClick={this.closeModal.bind(this)}
          >&times;</span>
          <div className="col-xs-8 col-xs-offset-2">
            <div className="row">
              <video
                id="video"
                width="100%"
                height="100%"
                controls
                controlsList="nodownload"
              />
            </div>
            <div className="row">
              <div id="caption"></div>
            </div>
          </div>
        </div>

        {(() => {
          if(this.state.isLogin) {
            return (
              <Header />
            )
          } else {
            return (
              <HeaderHome/>
            )
          }
        })()}

        <HeaderPage navigation={navigationArray} headerInfo={headerInfo} tutorial={true} borderTittle="true"/>

        {this.state.categories.map(category => {
          if (category.authRequired && !this.state.isLogin) return null;

          return (
            <div
              className="row gray-font"
              style={{marginTop: '2em'}}
              key={category.id}
            >
              <div className="col-xs-12 first-col-tutorial">
                <h1 style={{marginBottom: 0}}>{category.name}</h1>
                <p style={{maxWidth: '40%'}}>{category.description}</p>
                <div className="blue-border"></div>
              </div>
              <div className="col-xs-10 col-xs-offset-1" style={{marginBottom: '2em'}}>
                <div className="row"  style={{"justifyContent": "space-around", "marginBottom": "2em"}}>
                  {category.videos.map(video => {
                    return (
                      <div
                        key={video.id}
                        className="col-xs-10 col-sm-5 box-video"
                        onClick={this.openModalVideo.bind(this)}
                        style={{paddingBottom: '5em'}}
                      >
                        <div className="card-top-section">
                          <video
                            width="100%"
                            height="100%"
                            controls
                            controlsList="nodownload"
                            src={video.src}
                            autoplay={false}
                          />
                        </div>
                        <div className="card-mid-section"></div>
                        <div className="text-card-tutorial">{video.name}</div>
                      </div>
                    )
                  })}
                </div>
              </div>
              <div className="col-sm-12 tutorial-div-section"></div>
            </div>
          );
        })}
      <Footer hideIncidentForm={true} />
    </div>
  )
}
}
