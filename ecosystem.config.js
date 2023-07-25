module.exports = {
  apps: [
    {
      name: 'ibceducacion.com',
      script: '/home/ubuntu/akronenglish-user/dist/src/server/index.js',
      env_production: {
        PORT: '3017',
        NODE_ENV: 'production',
        NODE_PATH: '/home/ubuntu/akronenglish-user/dist',
        MONGOLAB_URI: 'mongodb://cosmoEditor:tCmY49WBhcSQwyrs@54.145.189.241:15514/cosmo',
        API_URL: 'https://php.ibceducacion.com/',
        API_BASE_URL: 'https://php.ibceducacion.com/base/api/',
        API_BASE_URL_CHAT: 'https://php.ibceducacion.com/base/ajax/',
        AJAX_BASE_URL: 'https://php.ibceducacion.com/base/ajax/',
        DOMAIN: 'ibceducacion.com',
      },
    },
  ],
};
