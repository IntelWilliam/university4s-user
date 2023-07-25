import React from 'react';
import { Link } from 'react-router';

export class HeaderHome extends React.Component {
  constructor() {
    super();
    this.state = {
      mobileMenu: false,
      mobileSubMenu: 0,
    };
  }

  openMenu() {
    this.setState({
      mobileMenu: !this.state.mobileMenu,
    });
  }

  openSubMenu(item) {
    this.setState({
      mobileSubMenu: this.state.mobileSubMenu == item ? 0 : item,
    });
  }

  goTo(element) {
    if ($(element).length) {
      $('html, body').animate(
        {
          scrollTop: $(element).position().top,
        },
        'slow'
      );
    }
  }

  goNewPlatform(platform) {
    swal({
      text: '¿Tienes una licencia con formato A1001B? Ingresa directamente a la nueva versión de tu plataforma, regístrate y goza de nuestras novedades. ¿Tienes una licencia con formato 000ZF-GJFJDKD y nunca creaste tu cuenta? Accede primero a la antigua versión de tu plataforma y regístrate. Luego, podrás ingresar a la nueva versión con tu correo y contraseña registrados.',
      showCancelButton: true,
      confirmButtonColor: '#DD6B55',
      confirmButtonText: 'Continuar',
      cancelButtonText: 'Regresar',
      // confirmButtonText: "Si, contactar!",
      // cancelButtonText: "No, Regresar"
    }).then(() => {
      if (platform === 'new') {
        this.context.router.push('/login');
      } else {
        // window.location = "https://php.akronenglish.com"

        var win = window.open('https://php.akronenglish.com', '_blank');
        win.focus();
      }
    });
  }

  render() {
    let hrefLogin = '/login';
    let openMenuClass = this.state.mobileMenu
      ? 'menu-mobile open-menu '
      : 'menu-mobile';
    // let openSubMenuClass1 = this.state.mobileSubMenu == 1
    //     ? 'mobile-sub-menu col-xs-12 open-sub-menu'
    //     : 'mobile-sub-menu col-xs-12'
    // let openSubMenuClass2 = this.state.mobileSubMenu == 2
    //     ? 'mobile-sub-menu col-xs-12 open-sub-menu'
    //     : 'mobile-sub-menu col-xs-12'

    let videoTutorial = '/video-tutorial/';

    return (
      <div>
        <header>
          <div className='container height-100 header-container'>
            <div className='col-xs-12 height-100'>
              <div className='row height-100'>
                <div className='col-xs-3 col-sm-2 col-md-1 image-logo-container height-100'>
                  <img src='/images/logo.png' className='logo-page' />
                </div>
                <div className='col-xs height-100 menu-top-container'>
                  <ul className='menu-top menu-top-flex'>
                    <Link
                      to={'/?goTo=Nosotros'}
                      className='item-menu mousePoint'
                    >
                      <span onClick={this.goTo.bind(this, '#Nosotros')}>
                        Nosotros
                      </span>
                    </Link>
                    <Link
                      to={'/?goTo=Programas'}
                      className='item-menu-border mousePoint'
                    >
                      <span onClick={this.goTo.bind(this, '#Programas')}>
                        Programas
                      </span>
                    </Link>
                    <Link
                      to={'/?goTo=Testimonios'}
                      className='item-menu-border mousePoint'
                    >
                      <span onClick={this.goTo.bind(this, '#Testimonios')}>
                        Testimonios
                      </span>
                    </Link>
                    <Link
                      to={'/?goTo=Convenios'}
                      className='item-menu-border mousePoint'
                    >
                      <span onClick={this.goTo.bind(this, '#Convenios')}>
                        Convenios
                      </span>
                    </Link>
                    <Link
                      to={'/?goTo=Contacto'}
                      className='item-menu-border mousePoint'
                    >
                      <span onClick={this.goTo.bind(this, '#Contacto')}>
                        Contacto
                      </span>
                    </Link>
                    <li
                      onClick={this.goNewPlatform.bind(this, 'new')}
                      className='item-menu mousePoint tutorial-button old-platform-link'
                      style={{ maxWidth: '8em', marginRight: '1em' }}
                    >
                      <span>Plataforma</span>
                    </li>
                  </ul>
                </div>
                <div
                  className='mobile-button mousePoint'
                  onClick={this.openMenu.bind(this)}
                >
                  <div className='border-menu'></div>
                </div>
              </div>
            </div>
          </div>
        </header>
        <div className={openMenuClass}>
          <div className='col-xs-12'>
            <Link to={videoTutorial} className='col-xs-12 item-mobile-menu'>
              <span className='link-menu'>Video tutoriales</span>
            </Link>
            <div className='col-xs-12 item-mobile-menu'>
              <a
                className='link-menu'
                onClick={this.goTo.bind(this, '#Nosotros')}
              >
                Nosotros
              </a>
            </div>
            <div className='col-xs-12 item-mobile-menu'>
              <a
                className='link-menu'
                onClick={this.goTo.bind(this, '#Programas')}
              >
                Programas
              </a>
            </div>
            <div className='col-xs-12 item-mobile-menu'>
              <a
                className='link-menu'
                onClick={this.goTo.bind(this, '#Testimonios')}
              >
                Testimonios
              </a>
            </div>
            <div className='col-xs-12 item-mobile-menu'>
              <a
                className='link-menu'
                onClick={this.goTo.bind(this, '#Convenios')}
              >
                Convenios
              </a>
            </div>
            <div className='col-xs-12 item-mobile-menu'>
              <a
                className='link-menu'
                onClick={this.goTo.bind(this, '#Contacto')}
              >
                Contacto
              </a>
            </div>

            <div className='col-xs-12 item-mobile-menu'>
              <Link className='link-menu' to={hrefLogin}>
                Ingreso a Plataforma
              </Link>
              {/*<a className="link-menu" href="https://php.akronenglish.com/">Cuenta</a>*/}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

HeaderHome.contextTypes = {
  router: React.PropTypes.object,
};

export default HeaderHome;
