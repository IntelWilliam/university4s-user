import React from 'react'
// import Constants from 'src/client/Constants/Constants'
import Footer from 'src/client/modules/layout/footer'
import HeaderPage from 'src/client/modules/Moodle/HeaderPage'
import Header from 'src/client/modules/layout/header'
// import FrontTextsActions from 'src/client/modules/FrontTexts/FrontTextsActions'
// import {Link} from 'react-router'
import loginUser from 'src/client/modules/Login/'
import HeaderHome from 'src/client/modules/layout/HeaderHome'
import TermsContent from 'src/client/modules/TermsAndConditions/TermsContent'

export default class TermsAndConditions extends React.Component {
    constructor() {
        super()
        this.state = {
            isLogin: false,
            // pageTexts: []
        }
    }

    componentWillMount() {
        // this.loadPageTexts()
        // funcion que se llama para autorizar la entrada a un estado de la palicacion
        if (loginUser.loggedIn()) {
            // console.log('is loguin');
            this.setState({isLogin: true})
        } else {
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
            title: "Términos, Condiciones y Políticas",
            // description: 'Sed et lorem viverra, vulputate mauris et, vulputate libero. Duis libero nulla, ullamcorper vitae volutpat in, aliquet eu eros. Nulla tempus pellentesque est, ac tincidunt massa aliquet vel. Sed at purus ut arcu placerat malesuada ut eget arcu. Pellentesque gravida tincidunt mauris, id vehicula eros congue a. Nam sodales porta velit, sed ultricies erat interdum quis. Etiam in orci tortor. Sed ac arcu eleifend, semper orci at, sollicitudin nisi.',
        }

        return (
            <div style={{
                background: "#F6F7F7"
            }}>

                {(() => {
                    if (this.state.isLogin) {
                        return (
                            <Header/>
                        )
                    } else {
                        return (
                            <HeaderHome/>
                        )
                    }
                })()}

                <HeaderPage navigation={navigationArray} headerInfo={headerInfo} tutorial={true} borderTittle="true"/>

                <TermsContent/>

                <Footer/>
            </div>
        )
    }
}
