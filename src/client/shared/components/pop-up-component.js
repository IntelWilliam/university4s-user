import React from "react";
import Pronouncer from "../../modules/Pronouncer/Pronouncer";

export default class PopUpComponent extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      hasClick: false,
    }

  }

  componentDidMount() {
    this.slider = $(".comments-slider").slick({
      arrows: false,
      infinite: false,
      dots: true,
      autoplay: false,
    });

    // On before slide change
    this.slider.on('afterChange', (event, slick, currentSlide) => {
      console.log('afterChange', currentSlide);

      setTimeout(() => this.sayWord(currentSlide), 500)
    });

    // On before slide change
    this.slider.on('beforeChange', (event, slick, currentSlide, nextSlide) => {
      console.log('beforeChange', nextSlide);

      Pronouncer.stop()
    });


    if (this.props.slides.length > 0) {
      setTimeout(() => this.sayWord(0), 1000)
    }
  }

  sayWord(index) {
    // se pronuncia la palabra deseada
    console.log('this.props.slides[index]', this.props.slides[index]);

    let finalWord = '';

    this.props.slides[index].PHRASE.forEach((el) => {
      finalWord = finalWord.concat(el)
    })
    Pronouncer.sayWord(finalWord, 'es')
  }


  updateStateClick() {
    this.setState({hasClick: true})
    this.props.handleClickPopUp();
  }

  nextOrClose() {
    if (this.slider.slick('slickCurrentSlide') >= this.props.slides.length - 1) {
      this.updateStateClick()
      Pronouncer.stop()
    } else {
      this.slider.slick('slickNext')
    }
  }

  render() {
    let mStyle = this.props.hidden || this.state.hasClick ? {display: 'none'} : {};

    return (
      <div id="myModal" className="modal" style={mStyle}>
        <div className="modal-content">
          <span className="close" onClick={this.updateStateClick.bind(this)}>&times;</span>
          {/*<img width={'100%'} height={'auto'} src={this.props.image} alt="guia_interactiva"/>*/}

          <div className="comments-slider">

            {this.props.slides.map((slide, index) => {
              return <div key={index} onClick={this.nextOrClose.bind(this)}>
                <img width={'100%'} height={'auto'} src={slide.IMAGE}/>
              </div>
            })}

          </div>

        </div>
      </div>
    )
  }

}

PopUpComponent.contextTypes = {
  handleClickPopUp: React.PropTypes.func,
  slides: React.PropTypes.array
}
