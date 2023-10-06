module.exports = {
  apps: [
    {
      name: "b12.ibcinstituto.com",
      script: "/home/ubuntu/ibc-user/dist/src/server/index.js",
      env_production: {
        PORT: "3017",
        NODE_ENV: "production",
        NODE_PATH: "/home/ubuntu/ibc-user/dist",
        MONGOLAB_URI:
          "mongodb://cosmoEditor:tCmY49WBhcSQwyrs@44.197.94.152:15514/cosmo",
        API_URL: "https://phpb12.ibcinstituto.com/",
        API_BASE_URL: "https://phpb12.ibcinstituto.com/base/api/",
        API_BASE_URL_CHAT: "https://phpb12.ibcinstituto.com/base/ajax/",
        AJAX_BASE_URL: "https://phpb12.ibcinstituto.com/base/ajax/",
        DOMAIN: "b12.ibcinstituto.com",
      },
    },
  ],
}

// cmabiando la configuracion para el insituto