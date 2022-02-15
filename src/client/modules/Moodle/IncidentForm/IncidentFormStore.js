import Constants from 'src/client/Constants/Constants'

class IncidentFormStore {

  getOne(id, callback) {
    $.get(Constants.API_LINK + 'userIncident/' + id, (data) => {
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

  SendForm(data, cb) {
    // se hace el post para iniciar session
    $.ajax({
      url: Constants.API_LINK + 'incident/',
      type: 'POST',
      processData: false, // important
      contentType: false, // important
      data: data
    }).done(function(body) {
      cb(null, body)
    }).fail((err) => {
      console.log('err', err)
      // si falla la peticion se envia el error
      cb(err)
    });
  }

  uploadFile(formData, fileName, callback, percentComplete) {
    console.log('percentComplete: ', percentComplete);
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
      url: "/api/upload-file-incident/",
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

let IncidentFormStoreInstance = new IncidentFormStore();

export default IncidentFormStoreInstance;
