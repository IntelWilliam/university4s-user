export default {
  API_LINK : '/api/',
  // API_LINK: 'http://admin.re-cosmo.com:3017/api/',
  LOG_IN_LINK : '/',
  // LOG_IN_LINK: 'http://dev.akronenglish1.com/base/api/',
  CHAT_BOX_LINK : 'http://chatbot.akronenglish1.com/',
  ADMIN_PATH : '',
  EXERCISE : {
    WORD_IMAGE: 1,
    TRANSLATE_WORD: 2,
    ORDER_WORDS: 3,
    LISTEN_WRITE: 4,
    MISSING_WORD: 5,
    ERASE_WORD: 6,
    CORRECT_TRANSLATION: 7,
    CORRECT_ANSWER: 8
  },
  SECTION : {
    VOCABULARY: "Vocabulary",
    GRAMMAR: "Grammar",
    PRONUNCIATION: "Pronunciation",
    CONVERSATION: "Conversation"

  },
  SECTION_ID : {
    VOCABULARY: 1,
    GRAMMAR: 2,
    PRONUNCIATION: 3,
    CONVERSATION: 4
  },
  AUTHOR : {
    COSMO: 1,
    USER: 2
  },
  PRATICE_ECERCISE_TYPE : {
    COMPLET: 1,
    ORDER: 2,
    MARK: 3
  },
  CONSTRAINTS: [
    true,
    {width: {exact: 1920}, height: {exact: 1080}},
    {width: {exact: 1280}, height: {exact: 720}},
    {width: {exact: 640}, height: {exact: 480}},
    {width: {exact: 320}, height: {exact: 240}}
  ]
}
