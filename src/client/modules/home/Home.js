import React from 'react'
import Footer from 'src/client/modules/layout/footer'
import HeaderPage from 'src/client/modules/Moodle/HeaderPage'
import HeaderHome from 'src/client/modules/layout/HeaderHome'
// import InquiryBoxStore from 'src/client/modules/Moodle/InquiryBox/InquiryBoxStore'
import loading from 'src/client/modules/Chat/Modals/loading'
import FrontTextsActions from 'src/client/modules/FrontTexts/FrontTextsActions'

export default class Home extends React.Component {
  constructor() {
    super()
    this.slider
    this.sliderT

    this.state = {
      allLevels: [],
      userData: [],
      pageTexts: []
    }
  }

  loadPageTexts() {
    FrontTextsActions.getTexts("HOME", (err, body) => {
      // si llega un error
      if (err) {
        console.log("error", err)
      } else {
        // console.log('body', body);
        // se setea el mensaje a mostrar
        this.setState({pageTexts: body.texts})
      }

    })
  }

  componentWillMount() {
    this.loadPageTexts()
  }

  componentDidMount() {
    // this.goTop()
    this.slider = $(".comments-slider").slick({
      infinite: true,
      slidesToShow: 1,
      slidesToScroll: 1,
      dots: true,
      speed: 500,
      variableWidth: true,
      centerMode: true,
      autoplay: true,
      autoplaySpeed: 5000,
      pauseOnFocus: true,
      adaptiveHeight: true
    });

    this.sliderT = $(".testimony-slider").slick({
      infinite: true,
      slidesToShow: 1,
      slidesToScroll: 1,
      dots: true,
      speed: 500,
      variableWidth: true,
      centerMode: true,
      autoplay: false,
      autoplaySpeed: 5000,
      pauseOnFocus: true,
      adaptiveHeight: true
    });

    $("#formlogin").validate({
      rules: {
        fullname: {
          required: true,
          minlength: 2
        },
        email: {
          required: true,
          email: true
        },
        type: {
          required: true
        },
        comment: {
          required: true,
          minlength: 10
        }
      },
      //For custom messages
      messages: {
        fullname: {
          required: "Ingrese su Nombre completo",
          minlength: "Ingrese al menos 4 caracteres"
        },
        email: {
          required: "Ingrese sus Email",
          email: "Ingrese un email valido"
        },
        type: {
          required: "Seleccione uno"
        },
        comment: {
          required: "Ingrese la Consulta",
          minlength: "Ingrese al menos 10 caracteres"
        }
      },
      errorElement: 'div',
      errorPlacement: (error, element) => {
        var placement = $(element).data('error');
        if (placement) {
          $(placement).append(error)
        } else {
          error.insertAfter(element);
        }
      },
      submitHandler: this.confirm.bind(this)
      // submitHandler: this.handleSubmit.bind(this)
    })

    let goTo = this.props.location.query.goTo ? this.props.location.query.goTo : false

    if (goTo) {
      setTimeout(() => {
        this.goTo('#' + goTo)
      }, 500);
    }

    const videoSrc = document.getElementById("videoHome");
    videoSrc.src = '/images/home_video/gaston_acuario.mp4';

    $('#videoHome').attr('controlsList', 'nodownload');

    videoSrc.addEventListener("click", () => {
      if (videoSrc.paused == true) {
        videoSrc.play();
      }
      else{
        videoSrc.pause();
      }
    });
  }

  goTo(element) {
    $("html, body").animate({
      scrollTop: $(element).position().top
    }, "slow");
  }

  handleForm(event) {
    const {name, value} = event.target;
    this.setState((prevState) => ({
      userData: { ...prevState.userData, [name]: value }
    }))
    
  };

  confirm() {
    let loadingNew = loading.replace(/text-to-load/g, this.state.pageTexts[45]);

    swal({html: loadingNew, showCloseButton: false, showCancelButton: false, showConfirmButton: false})

    const {fullname, email, type, comment} = this.state.userData;

    const dataline = {fullname, email, type, comment}
    const data = JSON.stringify(dataline)

    const baseUrl = window.location.hostname === 'localhost' ? 'http://localhost:3017' : 'https://ibceducacion.com';
    
    $.ajax({
      url: `${baseUrl}/api/consult/`,
      type: 'POST',
      processData: false, 
      contentType: 'application/json', 
      data: data,
      success: (body) => { 
        console.log('json que se envia al back:', body.message);
        swal({
          title: "Enviado",
          text: "Su consulta fue enviada exitosamente!",
          confirmButtonColor: "#DD6B55",
          confirmButtonText: "Aceptar",
          type: "success"
        }).then(() => {
          this.goTop();
          this.context.router.push('/user-area/');
        });
      },
      error: (err) => { // Manejar el error con el método error
        console.log('error', err);
        swal({
          title: "Error",
          text: "Hubo un error al enviar su consulta",
          confirmButtonColor: "#DD6B55",
          confirmButtonText: "Aceptar",
          type: "error"
        }).then(() => {
          this.goTop();
          this.context.router.push('/user-area/');
        });
      }
    });
  }

  goTop() {
    $("html, body").animate({
      scrollTop: 0
    }, "slow");
  }

  render() {
    let backgroundImage = "/images/fo.jpg";
    let headerInfo = {
      backgroundImage: backgroundImage
    }


    return (
      <div>
        <HeaderHome/>
        <div style={{
          background: "#F6F7F7"
        }}>
          <HeaderPage home={true} pageTexts={this.state.pageTexts} headerInfo={headerInfo}/>

          <div className="container" style={{
            marginTop: "1em"
          }}>
            <div className="col-xs-12" id="Nosotros">
              <div className="row">
                <div className="col-xs-12">
                  <div className="row">
                    <div className="col-xs-12 col-md-4 padding-card-home">
                      <div className="row">
                        <div className="col-xs-12 center-img-home">
                          <img className="second-card-img" src="/images/home-second-1.png"/>
                        </div>
                        <div className="col-xs-12 tittle-card-home">
                          {/* <span> Nuevos </span> */}
                          <span> {this.state.pageTexts[4]} </span>
                        </div>
                        <div className="col-xs-12 tittle-card-home bold">
                          <span> {this.state.pageTexts[5]}</span>
                          {/* <span> Recursos</span> */}
                        </div>
                        <div className="col-xs-12 second-home-description-container">
                      <span className="second-home-description">
                        {this.state.pageTexts[6]}
                        {/* Nuestro  es la mejor de mundo innovador e intensivo método de aprendizaje concibe la utilización de diferentes herramientas tecnológicas y pedagógicas como Skype, medio por el que podrás tener asesorías en línea  con nuestros tutores las 24 horas del día y Cosmos, con quien practicarás la pronunciación y conversación en este programa. */}
                      </span>
                        </div>
                      </div>
                    </div>

                    {/* Nueva Metodologia */}
                    <div className="col-xs-12 col-md-4 padding-card-home">
                      <div className="row">
                        <div className="col-xs-12 center-img-home">
                          <img className="second-card-img" src="/images/home-second-2.png"/>
                        </div>
                        <div className="col-xs-12 tittle-card-home">
                          <span> {this.state.pageTexts[7]}</span>
                          {/* <span> Nueva</span> */}
                        </div>
                        <div className="col-xs-12 tittle-card-home bold">
                          <span> {this.state.pageTexts[8]}</span>
                          {/* <span> Metodología</span> */}
                        </div>

                        <div className="col-xs-12 second-home-description-container">
                          <span className="second-home-description">
                            {this.state.pageTexts[9]}
                            {/* Con nuestro sistema de autoaprendizaje podrás aprovechar al máximo las herramientas disponibles y tener acceso a una gran cantidad de recursos novedosos en el mismo lugar. Estas herramientas han sido desarrolladas por un equipo de profesionales especializados en la enseñanza del idioma inglés. */}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Optimo Aprendizaje */}
                    <div className="col-xs-12 col-md-4 padding-card-home">
                      <div className="row">
                        <div className="col-xs-12 center-img-home">
                          <img className="second-card-img" src="/images/home-second-3.png"/>
                        </div>

                        <div className="col-xs-12 tittle-card-home">
                          {/* <span> Eficaz</span> */}
                          <span> {this.state.pageTexts[10]}</span>
                        </div>
                        <div className="col-xs-12 tittle-card-home bold">
                          <span> {this.state.pageTexts[11]}</span>
                          {/* <span> Aprendizaje</span> */}
                        </div>

                        <div className="col-xs-12 second-home-description-container">
                          <span className="second-home-description">
                            {this.state.pageTexts[12]}
                            {this.state.pageTexts[13]}
                            {this.state.pageTexts[15]}
                          </span>                    
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            </div>
          </div>

          <div style={{
            background: "#ed8112",
            paddingTop: '3em'
          }}>
            <div className="container" style={{
              marginTop: "1em"
            }}>
              <div className="col-xs-12" id="Programas">
                <div className="row center-flex" >
                  <div className="col-xs-12 center-flex">
                    <span className="home-title" style={{color: "white"}} > {this.state.pageTexts[16]} <span
                      className="home-title bold" style={{color: "white"}} > {this.state.pageTexts[17]} </span> </span>
                    {/* <span className="home-title"> Nuestro &nbsp; <span className="home-title bold"> Programa </span> </span> */}
                  </div>
                  <div className="col-xs-10 center-flex">
                    <span className="home-subtitle" >
                      {this.state.pageTexts[18]}
                      {/* AKRON ENGLISH es un programa diseñado para satisfacer tus necesidades como alumno de inglés. Tendrás acceso a asesorías personalizadas con tutores conectados a Skype las 24 horas del día que te ayudarán a resolver tus dudas o inquietudes durante el tiempo de estudio. */}
                    </span>
                  </div>
                  <div className="col-xs-12">
                    <div className="row">
                      <div className="col-xs-12 col-md-4">
                        <div className="row">
                          <div className="col-xs-12 center-img-home">
                            <img className="second-card-img" src="/images/program-second-1.png"/>
                          </div>
                          <div className="col-xs-12 second-home-description-container center-img-home">
                            <span className="second-home-description program-card-text bold">
                              {this.state.pageTexts[19]}
                              {/* Inicial */}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="col-xs-12 col-md-4">
                        <div className="row">
                          <div className="col-xs-12 center-img-home">
                            <img className="second-card-img" src="/images/program-second-2.png"/>
                          </div>
                          <div className="col-xs-12 second-home-description-container center-img-home">
                              <span className="second-home-description program-card-text bold">
                                {this.state.pageTexts[20]}
                                {/* Fundamental */}
                              </span>
                          </div>
                        </div>
                      </div>
                      <div className="col-xs-12 col-md-4">
                        <div className="row">
                          <div className="col-xs-12 center-img-home">
                            <img className="second-card-img" src="/images/program-second-3.png"/>
                          </div>
                          <div className="col-xs-12 second-home-description-container center-img-home">
                    <span className="second-home-description program-card-text bold">
                      {this.state.pageTexts[21]}
                      {/* Operacional */}
                    </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* PLATAFORMA E-LEARNING */}
          <div className="col-xs-12 padding-big" id="" style={{display:"none",
            marginTop: "4em"
          }}>
            <div>
              <h2 className='home-title'> Plataforma E-learning </h2>
            </div>
            <div className="row">
              <div className="col-md-4 col-xs-12 no-padding background-home background-home-1">
                <div className="home-first-container">
                  <div className="first-card row">
                    <div className="col-xs-12 center-flex">
                      <img className="first-card-img" src="/images/home-1-back.jpg"/>
                    </div>
                    <div className="col-xs-12 ">
                      <p className="home-first-card-description-title bold">
                        {this.state.pageTexts[22]}
                        {/* Curso Completo */}
                      </p>
                      <p className="home-first-card-description">
                        {this.state.pageTexts[23]}
                        {/* El programa AKRON ENGLISH cubre tres niveles: Inicial, Fundamental y Operacional. Ahora sí podrás superar las barreras del futuro. Recuerda que el objetivo final es que seas capaz de dar como mínimo el examen PET ( Preliminary English Test) y tener una calificación exitosa. */}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-4 col-xs-12 no-padding background-home background-home-3">
                <div className="home-first-container">
                  <div className="first-card row">
                    <div className="col-xs-12 center-flex">
                      <img className="first-card-img" src="/images/home-3-back.jpg"/>
                    </div>
                    <div className="col-xs-12">
                      <p className="home-first-card-description-title bold">
                        {this.state.pageTexts[26]}
                        {/* Novedoso Programa */}
                      </p>
                      <p className="home-first-card-description">
                        {this.state.pageTexts[27]}
                        {/* Experiencia e innovación educativa puestas en práctica para darte lo mejor del mundo virtual, con una plataforma educativa, moderna, ágil y motivadora. Aprender inglés no será una carga, será tu solución. */}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-4 col-xs-12 no-padding background-home background-home-2">
                <div className="home-first-container">
                  <div className="first-card row">
                    <div className="col-xs-12 center-flex">
                      <img className="first-card-img" src="/images/home-2-back.jpg"/>
                    </div>
                    <div className="col-xs-12">
                      <p className="home-first-card-description-title bold">
                        {this.state.pageTexts[24]}
                        {/* Nuestras Herramientas */}
                      </p>
                      <p className="home-first-card-description">
                        {this.state.pageTexts[25]}
                        {/* Tu computadora, tu aliada. Tu smartphone, tu compañero.  En este proceso de enseñanza online puedes conectarte con nosotros en donde estés y en el momento que gustes. */}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* TESTIMONIOS - OCULTO */}
          <div className="container" style={{display: "none"}}>
            <div className="col-xs-12 padding-big" id="Testimonios">
              <div className="row">
                <div className="col-xs-12 center-flex">
          <span className="home-title bold">
            {this.state.pageTexts[28]}
            {/* Testimonios */}
          </span>
                </div>
                <div className="col-xs-12">

                  <div className="testimony-slider">

                    <div>
                      <div className="relative">
                        <img src="/images/hoyos_rubio1.jpg" style={{height: "15em"}}/>
                        <p className="testimony-card-text">
                          Alumnos de inglés en el Cuartel José Galvez- Unidad de Ingeniería - Fuerte Hoyos Rubio- Lima.
                        </p>
                      </div>
                    </div>
                    <div>
                      <div className="relative">
                        <img src="/images/chorrillos.jpg" style={{height: "15em"}}/>
                        <p className="testimony-card-text">
                          Alumnos de inglés en el Comando de Educación y Doctrina del Ejercito- Chorrillos.
                        </p>
                      </div>
                    </div>
                    <div>
                      <div className="relative">
                        <img src="/images/hoyos_rubio2.jpg" style={{height: "15em"}}/>
                        <p className="testimony-card-text">
                          Alumnos de inglés en Fuerte Hoyos Rubio- Lima.
                        </p>
                      </div>
                    </div>

                    <div>
                      <div className="relative">
                        <img src="/images/base-naval.jpg" style={{height: "15em"}}/>
                        <p className="testimony-card-text">
                          Certificación nivel Básico 2018 – Base Naval del Callao.
                          {/*{this.state.pageTexts[29]}*/}
                          {/* Entrega de certificados de nivel básico de los alumnos de la Capitanía de Guardacostas en Pisco. */}
                        </p>
                      </div>
                    </div>

                    <div>
                      <div className="relative">
                        <img src="/images/acuario2.jpg" style={{height: "15em"}}/>
                        <p className="testimony-card-text">
                          Graduación de alumnos de la Fundación Pachacútec 2017 – Gastón Acurio.
                          {/*{this.state.pageTexts[29]}*/}
                          {/* Entrega de certificados de nivel básico de los alumnos de la Capitanía de Guardacostas en Pisco. */}
                        </p>
                      </div>
                    </div>
                    <div>
                      <div className="relative">
                        <img src="/images/acuario3.png" style={{height: "15em"}}/>
                        <p className="testimony-card-text">
                          Graduación de alumnos de la Fundación Pachacútec 2017 – Gastón Acurio.
                          {/*{this.state.pageTexts[29]}*/}
                          {/* Entrega de certificados de nivel básico de los alumnos de la Capitanía de Guardacostas en Pisco. */}
                        </p>
                      </div>
                    </div>

                    <div>
                      <div className="relative">
                        <img src="/images/Hospital_Loayza.jpg" style={{height: "15em"}}/>
                        <p className="testimony-card-text">
                          Alumnas del Hospital Loayza recibiendo su certificado de nivel avanzado 2017.
                          {/*{this.state.pageTexts[29]}*/}
                          {/* Entrega de certificados de nivel básico de los alumnos de la Capitanía de Guardacostas en Pisco. */}
                        </p>
                      </div>
                    </div>

                    <div>
                      <div className="relative">
                        <img src="/images/testimony1.jpg" style={{height: "15em"}}/>
                        <p className="testimony-card-text">
                          {this.state.pageTexts[29]}
                          {/* Entrega de certificados de nivel básico de los alumnos de la Capitanía de Guardacostas en Pisco. */}
                        </p>
                      </div>
                    </div>

                    <div>
                      <div className="relative">
                        <img src="/images/testimony2.jpg" style={{height: "15em"}}/>
                        <p className="testimony-card-text">
                          {this.state.pageTexts[30]}
                          {/* Entrega de certificados de nivel básico de los alumnos de la Capitanía de Guardacostas en Pisco. */}
                        </p>
                      </div>
                    </div>

                    <div>
                      <div className="relative">
                        <img src="/images/testimony3.jpg" style={{height: "15em"}}/>
                        <p className="testimony-card-text">
                          {this.state.pageTexts[31]}
                          {/* Entrega de certificados de nivel básico de los alumnos de la Capitanía de Guardacostas en Pisco. */}
                        </p>
                      </div>
                    </div>

                    <div>
                      <div className="relative">
                        <img src="/images/acuario1.jpg" style={{height: "15em"}}/>
                        <p className="testimony-card-text">
                          Graduación de alumnos de la Fundación Pachacútec 2017 – Gastón Acurio.
                          {/*{this.state.pageTexts[29]}*/}
                          {/* Entrega de certificados de nivel básico de los alumnos de la Capitanía de Guardacostas en Pisco. */}
                        </p>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ALIANZAS Y CONVENIOS - OCULTO */}
          <div className="container" style={{display: "none", marginTop: "1em", marginBottom: "2em"}}>
            <div className="col-xs-12 padding-big" id="Convenios">
              <div className="row">
                <div className="col-xs-10 col-xs-offset-1 ">
          <span className="home-title"><span className="home-title bold" style={{paddingLeft: "10rem"}}  >
                  Alianzas estratégicas y convenios
          </span></span>

                  <p className="justify-text">Nuestro convenio de cooperación interinstitucional con las empresas
                    comerciales, agroindustriales, asociaciones, gremios, cooperativas e instituciones nacionales,
                    extranjeras y del Estado, nos ha permitido realizar un intercambio científico y tecnológico, mejorar
                    la calidad de nuestros programas educativos de idiomas y ampliar los horizontes de nuestros
                    asociados mediante asesorías académicas.</p>
                  <p className="justify-text">Contamos con el respaldo de múltiples instituciones para garantizar
                    estabilidad a quienes decidan aprender un nuevo idioma que les abra las fronteras del mundo.</p>
                  <p className="justify-text" style={{marginBottom: "2em"}}>Todos nuestros usuarios podrán disfrutar de
                    una experiencia de aprendizaje de inglés interactiva y moderna gracias a nuestras asociaciones con
                    empresas especializadas en el ámbito tecnológico que nos permiten brindar un soporte virtual de
                    calidad en cualquier momento y desde cualquier lugar utilizando únicamente una conexión a
                    internet.</p>

                  {/*<iframe className="video-home" width="100%" height="518"*/}
                          {/*src="https://www.youtube.com/embed/WHoym6JJnJQ" frameBorder="0" gesture="media"*/}
                          {/*allow="encrypted-media" allowFullScreen></iframe>*/}

                  <div className="row">
                    <video id="videoHome" width="100%" height="100%" controls controlsList="nodownload"></video>
                  </div>

                </div>
              </div>

              <div className="row">
                <div className="col-xs-12 comments-slider-container">
                  <div className="comments-slider">
                    <div>
                      <img style={{height: "5em"}} src="/images/convenios/1.jpg"></img>
                    </div>
                    <div>
                      <img style={{height: "5em"}} src="/images/convenios/2.jpg"></img>
                    </div>
                    <div>
                      <img style={{height: "5em"}} src="/images/convenios/3.jpg"></img>
                    </div>
                    <div>
                      <img style={{height: "5em"}} src="/images/convenios/4.jpg"></img>
                    </div>
                    <div>
                      <img style={{height: "5em"}} src="/images/convenios/5.jpg"></img>
                    </div>
                    <div>
                      <img style={{height: "5em"}} src="/images/convenios/6.jpg"></img>
                    </div>
                    <div>
                      <img style={{height: "5em"}} src="/images/convenios/7.png"></img>
                    </div>
                    <div>
                      <img style={{height: "5em"}} src="/images/convenios/8.png"></img>
                    </div>
                    <div>
                      <img style={{height: "5em"}} src="/images/convenios/9.png"></img>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>

          
          {/* CONSULTA Y FORMULARIO - OCULTO */}
          <div className="col-xs-12 learner-data-container" style={{ display: "none",
            background: "#0c2d70"
          }} id="Contacto">
            <div className="row">
              <div className="col-xs-12 center-flex">
                <span className="home-title bold" style={{color: "white"}}>
                  {this.state.pageTexts[33]}
                  {/* Contacto */}
                </span>
              </div>
              <div className="col-xs-12 col-sm-8">
                <form
                  className="login-form formValidate account-login-form"
                  id="formlogin"
                  method="POST"
                >

                  <div className="row">

                  {/* Campo para FullName */}
                  <div className="col-xs-12">
                      <div className="row">
                        <div className="col-xs-12 col-sm-8 account-container">
                          <div className="row">
                            <div className="col-xs-6 account-input-text-container">
                              <span className="bold account-input-text">
                                {this.state.pageTexts[34]}
                                {/* Nombre completo */}
                              </span>
                            </div>
                          <div className="col-xs-6 input-flex">
                            <input
                              value={this.state.userData.fullname || ''}
                              onChange={this.handleForm.bind(this)}
                              id="fullname"
                              name="fullname"
                              className="account-input"
                              data-error=".errorTxt2"
                            >
                            </input>
                          </div>
                          <div className="col-xs-6 col-xs-offset-6 errorTxt2"></div>
                          </div>
                        </div>
                      </div>
                  </div>

                  {/* Campo para Email */}
                  <div className="col-xs-12">
                    <div className="row">
                      <div className="col-xs-12 col-sm-8 account-container">
                        <div className="row">
                          <div className="col-xs-6 account-input-text-container">
                            <span className="bold account-input-text">
                              {this.state.pageTexts[35]}
                              {/* Correo electrónico */}
                              <span style={{color: 'red'}}>&nbsp;*</span>
                            </span>
                          </div>
                          <div className="col-xs-6 input-flex">
                            <input
                              value={this.state.userData.email || ''}
                              onChange={this.handleForm.bind(this)}
                              id="email"
                              name="email"
                              className="account-input"
                              data-error=".errorTxt3">
                            </input>
                          </div>
                          <div className="col-xs-6 col-xs-offset-6 errorTxt3"></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Campo para TIPO DE CONSULTA  */}
                  <div className="col-xs-12">
                    <div className="row">
                      <div className="col-xs-12 col-sm-8 account-container">
                        <div className="row">
                          <div className="col-xs-6 account-input-text-container">
                            <span className="bold account-input-text">
                              {this.state.pageTexts[36]}
                              {/* Tipo de consulta */}
                              <span style={{color: 'red'}}>&nbsp;*</span>
                            </span>
                          </div>
                          <div className="col-xs-6 input-flex">
                            <select
                              defaultValue="0"
                              onChange={this.handleForm.bind(this)}
                              id="type"
                              name="type"
                              className="account-input"
                              data-error=".errorTxt4"
                            >
                              <option className="account-input" value="0" disabled>{this.state.pageTexts[37]}</option>
                              <option className="account-input" value="Consulta Técnica">{this.state.pageTexts[38]}</option>
                              <option className="account-input" value="Consulta Aministrativa">{this.state.pageTexts[39]}</option>
                              <option className="account-input" value="Consulta de Contenidos">{this.state.pageTexts[40]}</option>
                            </select>
                          </div>
                          <div className="col-xs-6 col-xs-offset-6 errorTxt4"></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Campo para el CONTENDIO DE CONSULTA */}
                  <div className="col-xs-12">
                    <div className="row">
                      <div className="col-xs-12 account-container">
                        <div className="row">
                          <div
                            className="col-xs-4 account-input-text-container"
                            style={{'alignItems': 'baseline','paddingTop': '0.5em'}}
                          >
                            <span className="bold account-input-text">
                              {this.state.pageTexts[41]}
                              {/* Consulta */}
                            </span>
                          </div>
                          <div className="col-xs-8 input-flex">
                            <textarea
                              rows="10"
                              cols="10"
                              placeholder={this.state.pageTexts[41]}
                              value={this.state.userData.comment || ''}
                              onChange={this.handleForm.bind(this)}
                              id="comment"
                              name="comment"
                              className="account-input"
                              data-error=".errorTxt5">
                            </textarea>
                          </div>
                          <div className="col-xs-6 col-xs-offset-4 errorTxt5"></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-xs-12 account-container">
                    <div className="row">
                      <div className="col-xs-12">
                        <div style={{float: 'right'}}>
                          <button
                            className="crop-button bold inquiryButton"
                            type="submit" 
                          >
                            {this.state.pageTexts[44]}
                          </button>
                          {/* <button className="crop-button bold inquiryButton" type="submit">Aceptar</button> */}
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </form>

            </div>

              <div className="col-xs-12 col-sm-3">
                <div className="row">

                  <div className="col-xs-12 col-sm-10 col-sm-offset-2">
                    <div className="row">

                      <div className="card-next-event account-container col-xs-12">
                        <div className="row">
                          <div className="col-xs-12 header-card inquiryCard">
                            <span className="card-next-event-title">{this.state.pageTexts[42]}</span>
                            {/* <span className="card-next-event-title">Información</span> */}
                          </div>
                          <div className="col-xs-12 inquiryCard-body" style={{color: 'white'}}>
                            <div className="col-xs-12">
                              <p>
                                {this.state.pageTexts[43]}
                                {/* La respuesta llegará a su correo electrónico en un plazo de 24 a 48 horas. */}
                              </p>
                            </div>  
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Footer home={true} hideIncidentForm={true} />
        </div>
      </div>
    )
  }
}
