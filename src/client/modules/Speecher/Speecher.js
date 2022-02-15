/*
 * clase para el reconocimiento de voz y pronunciacion
 */
class Speecher {

  constructor() {
    this.ref = 0
    var commands = {}
    annyang.start();
    // si el comando coincide
    annyang.addCallback('resultMatch', (userSaid, commandText, phrases) => {
      this.onListen(true, this.ref)
    });

    // si el comando  no coincide
    annyang.addCallback('resultNoMatch', (userSaid) => {
      this.onListen(false, this.ref)
    });

    annyang.addCallback('result', (userSaid) => {
      let say = 0 in userSaid ? userSaid[0] : ""
      this.whatAmISaying(say, this.ref)
    });
  }

  setRef(ref) {
    this.ref = ref
  }

  /**
   * esta funcion se encarga de pronunciar las palabras
   * {String} word palabra a pronunciar
   */
  speechRecognition(word, ref) {
    this.setRef(ref)
    if (annyang) {
      // Let's define a command.
      var commands = {}
      commands[word] = () => {}
        // Add our commands to annyang
      annyang.removeCommands();
      annyang.addCommands(commands);
    }
  }

  onListen() {
  }

  whatAmISaying() {
  }
}

// se exporta la instancia
export default Speecher
