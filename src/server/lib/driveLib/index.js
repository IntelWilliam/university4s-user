import { filterQuery } from 'src/server/lib'
import _ from 'lodash'
import fs from 'fs'
import readline from 'readline'
import google from 'googleapis'
import googleAuth from 'google-auth-library'
import path from 'path'

// If modifying these scopes, delete your previously saved credentials
// at ~/.credentials/drive-nodejs-quickstart.json
const SCOPES = ['https://www.googleapis.com/auth/drive.metadata.readonly'];
const TOKEN_DIR = (process.env.HOME || process.env.HOMEPATH ||
  process.env.USERPROFILE) + '/.credentials/';
const TOKEN_PATH = TOKEN_DIR + 'drive-nodejs-quickstart.json';

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 *
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, query, callback, callback2) {
  let clientSecret = credentials.web.client_secret;
  let clientId = credentials.web.client_id;
  let redirectUrl = credentials.web.redirect_uris[0];
  let auth = new googleAuth();
  let oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);
  oauth2Client.credentials = {
    access_token: query.access_token,
    client_id: clientId,
    token_type: "Bearer"
  };
  callback(oauth2Client, query, callback2);

}

/**
 * Lists the names and IDs of up to 10 files.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
function saveFile(auth, file, cb) {
  let service = google.drive('v3');
  let dest = fs.createWriteStream(path.join("/var", "www", "html", "imagemanager", "source", file.name));
  service.files.get({
      auth: auth,
      fileId: file.fileId,
      alt: 'media'
    })
    .on('error', function(err) {
      return cb({ error: err });
    })
    .pipe(dest);

  dest.on('finish', function() {
      return cb(null, { name: file.name })
    })
    .on('error', function(err) {
      return cb({ error: err })
    });
}

/*
 * Esta función crea un nuevo registro
 */
export function addFile(query, callback) {
  // Load client secrets from a local file.
  fs.readFile(path.join(__dirname, 'client_secret.json'), (err, content) => {
    if (err) {
      return cb({ error: err });
    }
    // Authorize a client with the loaded credentials, then call the
    // Drive API.
    authorize(JSON.parse(content), query, saveFile, callback);
  });
}
