import React from 'react'

export default class Slider extends React.Component {
  componentDidMount() {
    $('.bxslider').bxSlider({
      adaptiveHeight: true,
      controls: false,
      auto: true,
      speed: 1000
    });
  }
  render() {
    return (
      <div className="col-xs-12">
        <div className="row">
          <div className="col-xs-12 no-padding">
        <ul className="bxslider">
          <li>
            <img src="/images/slider1.jpg" />
          </li>
          <li><img src="/images/slider2.jpg" /></li>
        </ul>
          </div>
        </div>
      </div>    )
  }
}
