/*
 * Copyright (c) 2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * LanguagesStore
 */

import AppDispatcher from 'src/client/dispatcher/AppDispatcher'
import ChatConstants from 'src/client/modules/Chat/Chat/ChatConstants';
import Constants from 'src/client/Constants/Constants'
import FluxStore from 'src/client/FluxStore';
import loginUser from 'src/client/modules/Login/'


class ChatStore extends FluxStore {
  constructor() {
      super()
    }
    /**
     * Get the entire collection of TODOs.
     * @return {object}
     */
  getAll(param, callback) {
    // se piden los usuarios del sistema
    $.get(Constants.API_LINK + 'languages/', param, (data) => {
      callback(null, data)
    }).fail((err) => {
      // si hay error de autorización se desloguea
      if (err.status == 401) {
        loginUser.logout((resp) => {
          callback(err)
        })
      } else {
        callback(err)
      }

    })
  }

}

let ChatStoreInstance = new ChatStore();

// Register callback to handle all updates
AppDispatcher.register(function(action) {

  switch (action.actionType) {
    case ChatConstants.CHAT_CREATE:
      ChatStoreInstance.emitChange()
      break;

    case ChatConstants.CHAT_UPDATE:
      ChatStoreInstance.emitChange();
      break;

    case ChatConstants.CHAT_DESTROY:
      ChatStoreInstance.destroy(action.id);
      ChatStoreInstance.emitChange();
      break;

    default:
      // no op
  }
})

export default ChatStoreInstance;
