import Constants from 'src/client/Constants/Constants'

class InquiryBoxStore {

    SendForm(data, cb) {
        // se hace el post para iniciar session
        console.log(data, "data");
    //     console.log("constans", formdata.get("fullname"), formdata.get("email"),);
    // console.log("constans", formdata.get("type"), formdata.get("comment"));
        $.ajax({
            url: Constants.API_LINK + 'consult/',
            type: 'POST',
            processData: false, // important
            contentType: 'application/json', // important
            data: data
        }).done(function(body) {
            console.log('esta respuesta del servidor');
            console.log(body)
            cb(null, body);
        }).fail((err) => {
            console.log('err', err)
            // si falla la peticion se envia el error
            cb(err)
        });
    }

}

let InquiryBoxStoreInstance = new InquiryBoxStore();

export default InquiryBoxStoreInstance;
