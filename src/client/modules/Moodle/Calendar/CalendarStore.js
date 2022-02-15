import Constants from 'src/client/Constants/Constants'
import loginUser from 'src/client/modules/Login/'

class CalendarStore {
    getThisMonth(firstDate, secondDate, callback) {
        $.get(Constants.API_LINK + 'event/?firstDate=' + firstDate + '&secondDate=' + secondDate, (data) => {
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

let CalendarStoreInstance = new CalendarStore();

export default CalendarStoreInstance;
