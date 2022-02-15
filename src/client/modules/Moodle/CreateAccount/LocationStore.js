import Constants from 'src/client/Constants/Constants'

class LocationStore {
  get_countries(callback) {
    $.get(Constants.API_LINK + 'moodle-location' + '/get-countries', (body) => {
      callback(null, body);
    }).fail((err) => {
      console.log(err)
      callback(err)
    })
  }

  get_states(params, callback) {
    $.get(Constants.API_LINK + 'moodle-location' + '/get-states', params, (body) => {
      callback(null, body);
    }).fail((err) => {
      console.log(err)
      callback(err)
    })
  }
  get_provinces(params, callback) {
    $.get(Constants.API_LINK + 'moodle-location' + '/get-provinces', params, (body) => {
      callback(null, body);
    }).fail((err) => {
      console.log(err)
      callback(err)
    })
  }
  get_cities(params, callback) {
    $.get(Constants.API_LINK + 'moodle-location' + '/get-cities', params, (body) => {
      callback(null, body);
    }).fail((err) => {
      console.log(err)
      callback(err)
    })
  }

}

let LocationStoreInstance = new LocationStore();
export default LocationStoreInstance;
