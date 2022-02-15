import Constants from 'src/client/Constants/Constants'

class InquiryBoxStore {

    SendForm(data, cb) {
        // se hace el post para iniciar session
        $.ajax({
            url: Constants.API_LINK + 'consult/',
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

}

let InquiryBoxStoreInstance = new InquiryBoxStore();

export default InquiryBoxStoreInstance;
