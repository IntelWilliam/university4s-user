/*
+ Esta clase permite controlar los eventos de login 
*/
class Pronouncer {

  /**
   * esta funcion se encarga de pronunciar las palabras
   * {String} word palabra a pronunciar
   */
  sayWord(word, voice, config) {
    if (!voice) {
      voice = 'US English Male'
    }
    // si se desea pronunciar en español
    if (voice == 'es') {
      voice = 'Spanish Latin American Female'
    }
    // se pronuncia la palabra deseada
    responsiveVoice.speak(word, voice, config)
  }
}

// se instancia la clase
let PronouncerInstance = new Pronouncer()
  // se exporta la instancia
export default PronouncerInstance
