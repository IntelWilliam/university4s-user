module.exports = {
  apps: [
    {
      name: 'ibceducacion.com',
      script: '/home/ubuntu/ibc-user/dist/src/server/index.js',
      env_production: {
        PORT: '3017',
        NODE_ENV: 'production',
        NODE_PATH: '/home/ubuntu/ibc-user/dist',
        MONGOLAB_URI: 'mongodb://cosmoEditor:tCmY49WBhcSQwyrs@54.145.189.241:15514/cosmo',
        API_URL: 'https://ibceducacion.com/',
        API_BASE_URL: 'https://ibceducacion.com/base/api/',
        API_BASE_URL_CHAT: 'https://ibceducacion.com/base/ajax/',
        AJAX_BASE_URL: 'https://ibceducacion.com/base/ajax/',
        DOMAIN: 'ibceducacion.com',
      },
    },
  ],
};

// probando estas urls y apis