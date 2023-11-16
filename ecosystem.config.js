module.exports = {
  apps: [
    {
      name: "university4s.ibcidiomas.com",
      script: "/home/ubuntu/ibc-user/dist/src/server/index.js",
      env_production: {
        PORT: "3017",
        NODE_ENV: "production",
        NODE_PATH: "/home/ubuntu/ibc-user/dist",
        MONGOLAB_URI:
          "mongodb://cosmoEditor:tCmY49WBhcSQwyrs@3.208.146.92:15514/cosmo",
        API_URL: "https://phpuniversity4s.ibcidiomas.com/",
        API_BASE_URL: "https://phpuniversity4s.ibcidiomas.com/base/api/",
        API_BASE_URL_CHAT: "https://phpuniversity4s.ibcidiomas.com/base/ajax/",
        AJAX_BASE_URL: "https://phpuniversity4s.ibcidiomas.com/base/ajax/",
        DOMAIN: "university4s.ibcidiomas.com",
      },
    },
  ],
}

// cmabiando la configuracion para el insituto