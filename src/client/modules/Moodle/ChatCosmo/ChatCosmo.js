import React from 'react'
import Constants from 'src/client/Constants/Constants'
import Footer from 'src/client/modules/layout/footer'
import HeaderPage from 'src/client/modules/Moodle/HeaderPage'
import ChatCosmoStore from 'src/client/modules/Moodle/ChatCosmo/ChatCosmoStore'
// import FrontTextsActions from 'src/client/modules/FrontTexts/FrontTextsActions'
import ConversationSectionItem from 'src/client/modules/Moodle/ChatCosmo/Conversation/ConversationSectionItem'
import ChatMessages from 'src/client/modules/Moodle/BoxChat/Chat/ChatMessages'
import MessageSender from 'src/client/modules/Moodle/BoxChat/Chat/MessageSender'

export default class ChatCosmo extends React.Component {
  constructor() {
    super()
    this.socket = null
    this.state = {
      allMessages: [],
      stsSesion: '',
      cosmoSesion: '',
      allMessages: [],
      emojiPicker: new EmojiPicker({
        emojiable_selector: '[data-emojiable=true]',
        assetsPath: '/images/emoji/',
        popupButtonClasses: 'fa fa-smile-o'
      }),
      // user: JSON.parse(localStorage.user),
      pageTexts: [],
      topic: '',
      storyRaw: [],
      topicDesc: '',
      codeUser: null
    }
  }

  // loadPageTexts(){
  //   FrontTextsActions.getTexts("SIM_READ", (err, body) => {
  //     // si llega un error
  //     if (err) {
  //       console.log("error", err)
  //     } else {
  //       // console.log('body.texts', body.texts);
  //       // se setea el mensaje a mostrar
  //       this.setState({pageTexts: body.texts})
  //     }
  //
  //   })
  // }

  loadTopic() {
    ChatCosmoStore.getTopic((err, response) => {
      if (err)
      return

          this.setState({
            topic: response.data,
            storyRaw: response.storyRaw
          })
    })
  }

  s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }

  guid() {
    return this.s4() + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' + this.s4() + this.s4() + this.s4();
  }

  responseSTS(phrase) {
    ChatCosmoStore.getSTSResp(phrase, this.state.stsSesion, (err, response) => {
      if (err)
      return

      let mesagges = this.state.allMessages
      mesagges.push({
        text: response,
        actor: 'cosmo'
      })
      this.setState({
        allMessages: mesagges
      })

    })
  }

  componentWillMount() {
    // this.loadPageTexts()
    this.loadTopic()
    this.setState({
      stsSesion: this.guid(),
      cosmoSesion: this.guid()
    })
  }

  changeTopic(){
    this.loadTopic()

    this.refs['Conversation'].resetState()
  }

  componentDidMount() {
    this.goTop(0)
    console.log("stsSesion", this.state.stsSesion)
    console.log("cosmoSesion", this.state.cosmoSesion)
  }

  componentWillMount() {
    this.randomString(32, '0123456789abcdefghijklmnopqrstuvwxyz')
  }

  randomString(length, chars) {
    let result = '';
    for (let i = length; i > 0; --i) result += chars[Math.round(Math.random() * (chars.length - 1))];
    console.log('result >>> ', result);
    this.setState({
      codeUser: result
    }, () => {
      this.webSocketConversation();
    })
  }


  componentWillUnmount(){
  }

  webSocketConversation() {
    let cosmoMessage;
    this.socket = new WebSocket("wss://neuralconvo-ec2.huggingface.co/?agent=webchat&user=" + this.state.codeUser);

    this.socket.onopen = (e) => {
      console.log("[open] Connection established");
      // console.log("Sending to server");

    };

    this.socket.onmessage = (event) => {
      // console.log(event.data);

      if (event.data.includes('MSG')) {
        console.log(event.data);
        cosmoMessage = event.data.replace('MSG', '');
        cosmoMessage = JSON.parse(cosmoMessage);
        let mesagges = this.state.allMessages;
        mesagges.push({
          text: cosmoMessage.content,
          actor: 'cosmo'
        })
        this.setState({
          allMessages: mesagges
        })
      }
    };

    this.socket.onclose = (event) => {
      if (event.wasClean) {
        console.log(`[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
      } else {
        // e.g. server process killed or network down
        // event.code is usually 1006 in this case
        console.log('[close] Connection died');
        this.webSocketConversation();
      }
    };

    this.socket.onerror = function(error) {
      console.log(`[error] ${error.message}`);
    };

  }

  sendMessageButton() {

    // llamo la funcion que envía el mensaje
    let word = $('#input-message').val()
    // si la palabra es diferente de vacio

    console.log('word >>> ', word);
    this.socket.send(JSON.stringify({"content":word}));
    if (word != '') {
      let mesagges = this.state.allMessages
      mesagges.push({
        text: word,
        actor: 'user'
      })
      this.setState({
        allMessages: mesagges
      })
      // this.responseSTS(word)
      // this.props.sendQuestion.call(null, word, this.props.refComponent)
      $('#input-message').val("")
      $('.emoji-wysiwyg-editor').empty();
      $('#input-message').focus()
    }

  }

  goTop(move) {
    $("html, body").animate({
      scrollTop: move
    }, "slow");
  }

  render() {
    let navigationArray = [
      {
        // 'name': this.state.pageTexts[0],
        'name': 'Inicio',
        'url': Constants.ADMIN_PATH + `/user-area/`
      },{
        // 'name': this.state.pageTexts[2],
        'name': 'Talk to Cosmo',
        'url': null
      }
    ]

    let headerInfo = {
      // title: this.state.pageTexts[3],
      // translation: this.state.pageTexts[4],
      // description: this.state.pageTexts[5],

      title: 'Talk to Cosmo',
      translation: 'Habla con cosmo',
      description: 'Selecciona aleatoriamente un tema y hazle preguntas a cosmo sobre el tema',
    }


    return (

      <div style={{
        background: "#F6F7F7"
      }}>
      <HeaderPage borderTittle='true' navigation={navigationArray} headerInfo={headerInfo}/>
      <div className="container" style={{
        marginTop: "2em"
      }}>
      <div className="col-xs-12 section-name">
        <div className="col-xs-12">
          <div className="row">
            <div className="col-xs-12">
              <div className="info-title-section-container">
                <div className="pdf-icon-container">
                  <img className="pdf-icon" src="/images/studymanual.png"/>
                </div>
                <div className="info-title-container">
                  <span className="info-title">Encuesta</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-xs-12" style={{ marginTop: '1em'}} >
          <div className="info-title-section-container" style={{ marginLeft: '3em'}} >
            <div className="info-title-container">
              <a className="pdf-link" target="_blanck" href="https://goo.gl/forms/gM3ZT9jSpGXUiRqg2">
                <span className="pdf-title">Abrir encuesta</span>
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="col-xs-12 section-name">
      <span className="info-title">Chat Sequence To Sequence</span>
      <div className="col-xs-12 chat-container">
        <div id="chat-color" className="chat-color-box">
          {(() => {
            return this.state.allMessages.map((message, index) => {
              // console.log('message', message);
              if((index + 1) ==  this.state.allMessages.length){
                setTimeout(() => {
                  let chatContainer = document.getElementById("chat-color");
                  chatContainer.scrollTop = chatContainer.scrollHeight;
                }, 100)
              }
              if(message.actor == 'user'){
                return (
                  <div key={index} className="col-xs-12">
                    <div className="message-container">
                      <div className="row">
                        <div className="col-xs-12 flex-disp student-message-container">
                          <div className="message-subcontainer student-message">
                            <span className="" style={{ maxWidth: '100%'}}>
                              {message.text}
                            </span>
                          </div>
                          <div className="img-user-list">
                            <img src="/images/chat-teacher.png" className="cosmo-image"/>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  )
              } else {
                return (
                    <div key={index} className="col-xs-12">
                      <div className="message-container">
                        <div className="row">
                          <div className="col-xs-12 flex-disp">
                            <div className="img-user-list">
                              <img src="/images/chat-teacher.png" className="cosmo-image"/>
                            </div>
                            <div className="message-subcontainer teacher-trianglestudent-message">
                              <span className="" style={{ maxWidth: '100%'}}>
                              {message.text}
                             </span>
                           </div>
                         </div>
                       </div>
                     </div>
                   </div>
                  )
              }
            })
          })()}
        </div>
        <div className="chat-sender">
          <div className="row">
            <div className="col-xs-9">
              <span className="input-chat-container ">
                <input
                  id="input-message"
                  data-emojiable="true"
                  placeholder="Escribir mensaje"
                  className="input-chat"
                  type="text"
                  // onKeyPress={this.sendMessage.bind(this)}
                />
                <div className="triangle-right">
                  <div className="inner-triangle"></div>
                </div>
              </span>
            </div>
            <div className="col-xs-3" style={{ display: 'grid'}}>
              <button className="chat-button" onClick={this.sendMessageButton.bind(this)} title="Enviar mensaje"><i className="material-icons">send</i></button>
            </div>
          </div>
        </div>
      </div>
        <div className="col-xs-12">
          <div className="row">
            <div className="col-xs-12">
              <div className="exercise-border">
                <span>&nbsp;</span>
              </div>
            </div>
          </div>
        </div>
        <span className="info-title">Chat basado en contexto</span>
        <div className="col-xs-12 section-name">
          <div className="col-xs-12">
            <div className="row">
              <div className="col-xs-12 action-container">
                <button className="next-button mousePoint" onClick={this.changeTopic.bind(this)}>Cambiar tema</button>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xs-12">
          <div className="row">
            <div className="col-xs-12 col-md">
              <div className="image-drag-excercise">
                <div className="pdf-icon-container">
                  <img className="pdf-icon" src="/images/book.png"/>
                </div>
                <div className="info-title-container">
                  <div className="row">
                    {/* <div className="col-xs-12">
                      <span className="info-title">{this.state.topic}</span>
                    </div> */}
                    <div className="col-xs-12">
                      <span className="info-description" style={{
                        'fontSize': '1.4em',
                        'whiteSpace':'pre-wrap'
                      }}>{this.state.topic}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xs-12">
          <div className="row">
            <div className="col-xs-12">
              <div className="exercise-border-dotted">
                <span>&nbsp;</span>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-xs-12 bold" style={{
            'paddingLeft': '2.5em'
          }}>
        </div>
      </div>
    </div>

    <ConversationSectionItem ref="Conversation"
      cosmoSesion = {this.state.cosmoSesion}
      storyRaw = {this.state.storyRaw}
      topic = {this.state.topic}
    />


</div>
{<Footer hideIncidentForm={true}/>}
</div>
)
}
}

ChatCosmo.contextTypes = {
  router: React.PropTypes.object
}
