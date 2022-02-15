import Constants from 'src/client/Constants/Constants'
import loginUser from 'src/client/modules/Login/'

class NextEvetsStore {
  getEvents(callback) {
    $.get(Constants.API_LINK + 'event/', (data) => {
      // console.log("data",data);
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

  addEvents(callback) {
    $.post(Constants.API_LINK + 'event/', (data) => {
      // console.log("data",data);
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

let NextEvetsStoreInstance = new NextEvetsStore();

export default NextEvetsStoreInstance;
