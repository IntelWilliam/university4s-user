import React from 'react'

class Timer extends React.Component {

    constructor() {
        super()
        this.state = {
            currentMins: 0,
            currentSecs: 0,
            displayMins: '00',
            displaySecs: '00',
            intervalId: 0
        }
    }

    componentDidMount() {
        this.startTimer();
    }

    checkMinutes() {
        if(this.state.currentSecs >= 59) {
            let currentMins = this.state.currentMins+1;
            let currentDisplayMins = this.pad(currentMins, 2);
            this.setState({currentMins: currentMins, displayMins: currentDisplayMins});
        }
    }
    // funcion que maneja el evento click en el boton llamar
    startTimer() {
        let intervalId = setInterval(() => {
            let currentSecs = this.state.currentSecs+1 > 59 ? 0 : this.state.currentSecs+1;
            let currentDisplaySecs = this.pad(currentSecs, 2);
            this.checkMinutes();
            this.setState({currentSecs: currentSecs, displaySecs: currentDisplaySecs})

        }, 1000);
        this.setState({intervalId: intervalId});
    }

    componentWillUnmount() {
    clearInterval(this.state.intervalId);
    }

    pad(num, size) {
        var s = num + "";
        while (s.length < size) s = "0" + s;
        return s;
    }

    render() {
        return (
            <div className="timer">
                    <span>{this.state.displayMins}:{this.state.displaySecs}</span>
            </div>
        )
    }
}
export default Timer
