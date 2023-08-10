import React from 'react'
import NewsLetterActions from 'src/client/modules/layout/newsLetter/newsActions'
import { Link } from 'react-router'
import IncidentForm from 'src/client/modules/Moodle/IncidentForm/IncidentForm.js'

export default class Footer extends React.Component {
  constructor() {
    super()
    this.state = {
      newsEmail: '',
    }
  }

  goTop(){
    $("html, body").animate({ scrollTop: 0 }, "slow");
  }

  handleForm(event) {
    this.setState({newsEmail: event.target.value})
  }

  pressKeyNews(e){
    if (e.keyCode == 13 && this.state.newsEmail) {
      // console.log("enter");
      this.subscribe()
    }
  }

  subscribe(){
    // console.log("email", this.state.newsEmail);
    if(this.validateEmail(this.state.newsEmail)){

      var NewsLetter = {};
      NewsLetter['email'] = this.state.newsEmail;
      //email valido
      NewsLetterActions.create(NewsLetter, (err, body) => {
        // si llega un error
        if (err) {
          console.log("error", err)
          swal({
            title: 'Error!',
            text: 'El email ya esta subscrito a Newsletter.',
            timer: 4000,
            showConfirmButton: false,
            type: 'warning'
          }).then(() => {}, (dismiss) => {
            this.setState({newsEmail: ''})
            this.goTop()
          })
        } else {
          // se a creado de forma exitosa
          // console.log("email registrado");
          swal({
            title: 'Felicidades!',
            text: 'Estas subscrito a NewsLetter.',
            type: 'info'
          }).then((event) => {
            this.setState({newsEmail: ''})
            this.goTop()
          })
        }

      })

    }else{
      // ingrese un email valido
      swal({
        title: "Error.",
        text: "Ingrese un Email valido!",
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Continuar",
        type: "error",
      }).then(() => {
        this.setState({newsEmail: ''})
      })
    }
  }

  validateEmail(email) {
    var re = /^[a-z][a-zA-Z0-9_.]*(\.[a-zA-Z][a-zA-Z0-9_.]*)?@[a-z][a-zA-Z-0-9]*\.[a-z]+(\.[a-z]+)?$/;
    return re.test(email);
  }

  render() {
    return (
      <footer className="page-footer">
        <div className="col-xs-12">
          <div className="row center-xs page-content">
            <div className="container">
              <div className="col-xs-12">
                <div className="row flex-center">
                  <div className="col-md col-xs-12">
                    <img src="/images/logo.png" className="logo-page-footer"/>
                  </div>
                  <div className="col-md col-xs-12 flex-center">
                    <Link style={{color: 'white',fontSize: '1.5em'}} to="/terms-and-conditions" > Términos, Condiciones y Políticas </Link>
                  </div>
                  <div className="col-md col-xs-12 tooltip">
                    <img onClick={this.goTop} src="/images/up.png" className="icon-up mousePoint"/>
                    <span className="tooltiptext">SUBIR</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* {(() => {
          let hideIncidentForm = this.props.hideIncidentForm;
          if (!hideIncidentForm) {
            return <IncidentForm/>
          }
        })()} */}
      </footer>
    )
  }
}
