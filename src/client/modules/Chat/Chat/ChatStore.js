// import AppDispatcher from 'src/client/dispatcher/AppDispatcher'
// import ChatConstants from 'src/client/modules/Chat/Chat/ChatConstants';
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

  uploadFile(formData, fileName, callback, percentComplete) {
    $.ajax({
      xhr: () => {
        var xhr = new window.XMLHttpRequest();
        //Upload progress
        xhr.upload.addEventListener("progress", function (evt) {
          if (evt.lengthComputable) {
            var percent = evt.loaded / evt.total;
            //Do something with upload progress

            percentComplete(percent * 100, fileName)
            // console.log('Upload progress', percent);
          }
        }, false);
        return xhr;
      },
      url: "/api/upload-file-chat/",
      type: "POST",
      data: formData,
      processData: false,
      contentType: false,
    })
      .done(function (body) {
        // callback(null, body)
        callback(null, body, fileName)
      }).fail((err) => {
      // si hay error de autorización se desloguea
      if (err.status == 401) {
        console.log('401');
        callback(err)
      } else {
        callback(err)
      }
    })


  }


}

let ChatStoreInstance = new ChatStore();

// Register callback to handle all updates
// AppDispatcher.register(function(action) {
//
//   switch (action.actionType) {
//     case ChatConstants.CHAT_CREATE:
//       ChatStoreInstance.emitChange()
//       break;
//
//     case ChatConstants.CHAT_UPDATE:
//       ChatStoreInstance.emitChange();
//       break;
//
//     case ChatConstants.CHAT_DESTROY:
//       ChatStoreInstance.destroy(action.id);
//       ChatStoreInstance.emitChange();
//       break;
//
//     default:
//       // no op
//   }
// })

export default ChatStoreInstance;
