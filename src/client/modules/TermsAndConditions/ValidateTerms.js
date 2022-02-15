import React from 'react'
import HeaderPage from 'src/client/modules/Moodle/HeaderPage'
import HeaderHome from 'src/client/modules/layout/HeaderHome'
import TermsContent from 'src/client/modules/TermsAndConditions/TermsContent'
import TermsStore from 'src/client/modules/TermsAndConditions/TermsStore'
import WelcomeMessageStore from 'src/client/modules/TermsAndConditions/WelcomeMessageStore'

export default class ValidateTerms extends React.Component {
  constructor() {
    super()
    this.state = {
      isLogin: false,
    }
    this.sendWelcomeMessage = this.sendWelcomeMessage.bind(this)
  }

  componentDidMount() {
    this.goTop()
  }

  validateUserTerms() {

    let user = JSON.parse(localStorage.user)

    TermsStore.userAcceptTerms(user, (err, data) => {
      if (err) {
        console.log("no se pudo guardar (userAcceptTerms)", err);
      } else {

        let user = JSON.parse(localStorage.user)
        user.acceptTerms = true

        console.log('enviar email de bienvenida');
        var welcomeEmail = {};
        welcomeEmail['email'] = user.email;
        this.sendWelcomeMessage(welcomeEmail);
        // this.sendWelcomeMessage(JSON.parse(localStorage.user));

        localStorage.user = JSON.stringify(user)
        this.context.router.replace('/user-area/')
      }

    })
  }

  sendWelcomeMessage(email) {
    WelcomeMessageStore.SendWelcomeEmail(email, (err, body) => {
      if (err) {
        console.log("no se pudo enviar el email de bienvenida", err);
      }
    })
  }

  // sendWelcomeMessage(userData) {
  //   WelcomeMessageStore.SendForm(userData, (err, response) => {
  //     if (err) {
  //       console.log("no se pudo enviar el email de bienvenida", err);
  //     }
  //   })
  // }


  handleInputChange() {
    this.setState({
      isAccept: !this.state.isAccept
    })
  }

  goTop() {
    $("html, body").animate({
      scrollTop: 0
    }, "slow");
  }

  render() {
    let navigationArray = []
    let headerInfo = {
      title: "Términos y Condiciones",
    }

    console.log("this.state.isAccept", this.state.isAccept);

    return (
      <div style={{
        background: "#F6F7F7"
      }}>

        <HeaderHome/>
        <HeaderPage navigation={navigationArray} headerInfo={headerInfo} tutorial={true} borderTittle="true"/>

        <TermsContent/>


        <div className="container gray-font" style={{marginTop: '2em', 'marginBottom': '3em'}}>

          <div className="row">
            <div className="col-xs-6">

              <label className='checkbox-button'>
                <input
                  name="acceptTerms"
                  type="checkbox"
                  checked={this.state.isAccept}
                  onChange={this.handleInputChange.bind(this)}/>
                <span>He leído y acepto los términos y condiciones de uso</span>
              </label>
            </div>


            <div className="col-xs-6 action-container">
              <button
                style={!this.state.isAccept? {opacity: "0.3", cursor: "no-drop"} : {cursor: "pointer"}}
                disabled={(!this.state.isAccept) ? "disabled" : ""}
                className="solution-button back-button"
                onClick={this.validateUserTerms.bind(this)}>Continuar
              </button>
            </div>
          </div>


        </div>

      </div>
    )
  }
}

ValidateTerms.contextTypes = {
  router: React.PropTypes.object
}
