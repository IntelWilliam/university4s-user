import React from 'react'
import Footer from 'src/client/modules/layout/footer'
import Constants from 'src/client/Constants/Constants'
import HeaderPage from 'src/client/modules/Moodle/HeaderPage'
import VideosStore from 'src/client/modules/Moodle/Video/Videos/VideosStore'
import VideosBySubLevel from 'src/client/modules/Moodle/Video/Videos/VideosBySubLevel'
import PracticeStore from 'src/client/modules/Moodle/Laboratories/Practices/PracticeStore'
import FrontTextsActions from 'src/client/modules/FrontTexts/FrontTextsActions'

export default class Videos extends React.Component {
  constructor() {
    super()
    this.state = {
      allVideos: null,
      videoPath: null,
      defaultSpeed: 1,
      defaultQuality: 1080,
      strIsHidden: false,
      pageTexts: [],
      existStr: false
    }
  }

  componentWillMount() {
    this.loadData()
    this.loadPageTexts()
  }

  loadPageTexts(){
    FrontTextsActions.getTexts("VIDEO_LIST", (err, body) => {
      // si llega un error
      if (err) {
        console.log("error", err)
      } else {
        // console.log('body.texts', body.texts);
        // se setea el mensaje a mostrar
        this.setState({pageTexts: body.texts})
        // let loadingNew = loading.replace(/text-to-load/g, 'Cargando');
      }

    })
  }

  saveLabAcces(videoName, subLevelIndex, videoIndexOrLesson){

    let videoType = '';
    let cat = 0

    if (this.props.location.query.category == 'C') {
      videoType = 'Clase'
      cat = 1
    } else if (this.props.location.query.category == 'T') {
      videoType = 'Conversación'
      cat = 2
    }else if (this.props.location.query.category == 'R') {
      videoType = 'Reforzamiento'
      cat = 3
    }

    let levelName = this.props.location.query.levelName

    console.log('videoIndexOrLesson', videoIndexOrLesson);
    console.log('subLevelIndex', subLevelIndex);

    let data ={
      type: 1,
      userId : JSON.parse(localStorage.user)._id,
      videoName: videoType + ' - ' + videoName,

      category: cat,
      nivel: levelName == "Inicial" ? 1 : levelName == "Fundamental"? 2 : levelName == "Operacional"? 3 : undefined,

      sublevel: subLevelIndex,
      lesson: videoIndexOrLesson,

      userName : JSON.parse(localStorage.user).name,
      userLastName : JSON.parse(localStorage.user).lastname,
      userEmail : JSON.parse(localStorage.user).email
    }

    PracticeStore.addAccess(data, (err, response) => {
      if (err){
        console.log('err', err);
        return
      }
      console.log('resp', response);
    })
  }

  playVideo(path, videoName, subLevelIndex, videoIndexOrLesson) {
    this.saveLabAcces(videoName, subLevelIndex, videoIndexOrLesson)
    const modal = document.getElementById('myModal');
    const captionText = document.getElementById("caption");
    const videoSrc = document.getElementById("video");

    videoSrc.src = path.replace('.mp4', '_1080p.mp4');
    videoSrc.playbackRate = 1;
    modal.style.display = "flex";

    // nombre del video
    captionText.innerHTML = videoName;

    // se borran los subtitulos anteriores si existen
    while (videoSrc.firstChild) {
      videoSrc.removeChild(videoSrc.firstChild);
    }

    $.ajax({
      url: path.replace('.mp4', '.vtt'),
      type:'HEAD',
      xhrFields: {
        withCredentials: true
      },
      error: ()=>
      {
        console.log('NOEXIST');
        //file not exists
      },
      success: () =>
      {
        this.setState({existStr: true})
        console.log('existe');
      }
    });

    // se crea ls etiqueta track que contiene los subtitulos
    var track = document.createElement("track");
    track.kind = "subtitles";
    track.label = "Español";
    track.srclang = "es";
    track.id = "srtId1"
    track.src = path.replace('.mp4', '.vtt')

    videoSrc.appendChild(track);
    videoSrc.textTracks[0].mode = "showing";

    $('#video').attr('controlsList', 'nodownload');

    // se reinician todos los parametros
    this.setState({videoPath: path, defaultSpeed: 1, defaultQuality: 1080, strIsHidden: false})
    setTimeout(function() {
      $('video').trigger('play')
    }.bind(this), 1000);
  }

  closeModal() {
    const modal = document.getElementById('myModal');
    modal.style.display = "none";
    $('video').trigger('pause');
  }

  loadData() {
    // en T que es convrsación se traen los videos de clase. this.props.location.query.category == 'T'? 'C'
    VideosStore.getByCat(this.props.location.query.levelId, this.props.location.query.category == 'T'? 'C': this.props.location.query.category, (err, response) => {
      if (err)
        return
        // se cambia el estado allLessons con los nuevos usuarios
        console.log('response', response);
      var arr = Object.keys(response).map((key) => {
        return response[key]
      });
      this.setState({allVideos: arr})

    })
  }

  componentDidMount() {
    this.goTop()
  }

  goTop() {
    $("html, body").animate({
      scrollTop: 0
    }, "slow");
  }

  changeSpeed(e) {
    this.setState({defaultSpeed: e.target.value})

    const videoSrc = document.getElementById("video");
    videoSrc.playbackRate = e.target.value;

    $('#video').attr('controlsList', 'nodownload');

  }

  changeQuality(e) {
    this.setState({defaultQuality: e.target.value})

    const videoSrc = document.getElementById("video");
    var currentTime = videoSrc.currentTime

    if (e.target.value == 480) {
      videoSrc.src = this.state.videoPath.replace('.mp4', '_480p.mp4');
      videoSrc.currentTime = currentTime;
      $('video').trigger('play')
    } else if (e.target.value == 720) {
      videoSrc.src = this.state.videoPath.replace('.mp4', '_720p.mp4');
      videoSrc.currentTime = currentTime;
      $('video').trigger('play')
    } else if (e.target.value == 1080) {
      videoSrc.src = this.state.videoPath.replace('.mp4', '_1080p.mp4');
      videoSrc.currentTime = currentTime;
      $('video').trigger('play')
    } else if (e.target.value == 'source') {
      videoSrc.src = this.state.videoPath.replace('.mp4', '_1080p.mp4');
      // videoSrc.src = this.state.videoPath;
      videoSrc.currentTime = currentTime;
      $('video').trigger('play')
    }

    videoSrc.playbackRate = this.state.defaultSpeed
    $('#video').attr('controlsList', 'nodownload');

  }

  toggleCC() {
    const videoSrc = document.getElementById("video");
    var textTracks = videoSrc.textTracks; // one for each track element

    if (this.state.strIsHidden) {
      textTracks[0].mode = 'showing'
      this.setState({strIsHidden: false})
    } else {
      textTracks[0].mode = 'hidden'
      this.setState({strIsHidden: true})
    }

  }

  render() {
    let navigationArray = [
      {
        'name': this.state.pageTexts[0],
        // 'name': 'Inicio',
        'url': Constants.ADMIN_PATH + `/user-area/`
      }, {
        'name': this.state.pageTexts[1],
        // 'name': 'Laboratorio',
        'url': null
      }, {
        'name': this.state.pageTexts[2],
        // 'name': 'Videos',
        'url': Constants.ADMIN_PATH + `/user-area/video/`
      }, {
        'name': this.state.pageTexts[3],
        // 'name': 'Caregorias',
        'url': Constants.ADMIN_PATH + `/user-area/video/category/?levelName=${this.props.location.query.levelName}&levelId=${this.props.location.query.levelId}`
      }, {
        'name': this.props.location.query.levelName,
        'url': null
      }
    ]

    let headerInfo = {}

    if (this.props.location.query.category == 'C') {
      headerInfo = {
        title: this.state.pageTexts[4],
        // title: 'Videos de Clase',
        translation: this.props.location.query.levelName,
        description: this.state.pageTexts[5]
        // description: "Este video de clase te ayudará a comprender el tema a tratar de esta lección. Es altamente recomendable que lo veas antes de iniciar la lección. Puedes verlo más de una vez si así lo consideras."
      }
    } else if (this.props.location.query.category == 'T') {
      headerInfo = {
        title: this.state.pageTexts[6],
        translation: this.props.location.query.levelName,
        description: this.state.pageTexts[7]
      }
    }else if (this.props.location.query.category == 'R') {
      headerInfo = {
        title: this.state.pageTexts[8],
        translation: this.props.location.query.levelName,
        description: this.state.pageTexts[9]
      }
    }

    let isToggle = this.state.strIsHidden
      ? 'opacity-regular styled-select semi-square mousePoint'
      : 'styled-select semi-square mousePoint';

    return (
      <div style={{
        background: "#F6F7F7"
      }}>
        <HeaderPage navigation={navigationArray} headerInfo={headerInfo} borderTittle="true"/>
        <div className="container" style={{
          marginTop: "1em"
        }}>

          <div id="myModal" className="videoModal">
            <span className="closeModal" onClick={this.closeModal.bind(this)}>&times;</span>

            <div className="col-xs-8 col-xs-offset-2">

              <div className="row">
                <video id="video" width="100%" height="100%" controls controlsList="nodownload"></video>
              </div>

              <div className="row">
                <select value={this.state.defaultSpeed} onChange={this.changeSpeed.bind(this)} className="styled-select semi-square mousePoint">
                  <option value="0.5">0.5x</option>
                  <option value="0.75">0.75x</option>
                  <option value="1">1x</option>
                  <option value="1.25">1.25x</option>
                  <option value="1.5">1.5x</option>
                  <option value="1.75">1.75x</option>
                  <option value="2">2x</option>
                </select>

                <select value={this.state.defaultQuality} onChange={this.changeQuality.bind(this)} className="styled-select semi-square mousePoint">
                  <option value="480">480p</option>
                  <option value="720">720p</option>
                  <option value="1080">1080p</option>
                  <option value="source">Fuente</option>
                </select>

                {(() => {
                  if (this.state.existStr) {
                    return (
                      <button className={isToggle} onClick={this.toggleCC.bind(this)}>C.C</button>
                    )
                  }
                })()}

                {/*<button onClick={this.rewindVideo.bind(this)}> Rebobina 15s </button>*/}

              </div>

              <div className="row">
                <div id="caption"></div>
              </div>

            </div>
          </div>

          {(() => {
            if (this.state.allVideos) {
              return this.state.allVideos.map((subLevelVideos, index) => {
                return <VideosBySubLevel pageTexts={this.state.pageTexts} key={index} subLevelIndex={index + 1} levelName={this.props.location.query.levelName} category={this.props.location.query.category} playVideo={this.playVideo.bind(this)} subLevelVideos={subLevelVideos}/>
              })
            }
          })()}

        </div>

        <Footer/>
      </div>
    )
  }
}
