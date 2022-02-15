export default {
  API_BASE_URL: 'https://dev.akronenglish1.com/base/api/',
  API_BASE_URL_CHAT: 'https://dev.akronenglish1.com/base/ajax/',
  API_BASE_CHAT_COSMO: 'http://chatbot.akronenglish1.com/',
  API_BASE_CHAT_STS: 'http://neuralconvo-ec2.huggingface.co/hey/',
  AJAX_BASE_URL: 'https://dev.akronenglish1.com/base/ajax/',
  DOMAIN: 'akronenglish1.com',
  URL_EVENTS: '/user-area/calendar/',
}

// Constante de definicion de path base de recursos externos(en ruta por fuera del proyecto)
export const EXTERNAL_BASE_PATH = '/resources'
export const FILES = {
  // ruta por defecto donde quedarían las imágenes si no se reconoce el key
  DEFAULT: {
    PUBLIC_PATH: '/images',
    PATH: '/images',
    UPLOAD: '/upload'
  },

  USER: {
    // path publico, para retornar los archivos estáticos
    PUBLIC_PATH: '/images/users',
    PROFILE_PHOTO: {
      KEY: 'userPhoto',
      PATH: '/images/users'
    },
  }

}

export const FACEBOOK_APP_ID = '1852839871640376'
export const FACEBOOK_APP_SECRET_KEY = 'e9cb18765c81c46c35ba96e3f968c8f8'
