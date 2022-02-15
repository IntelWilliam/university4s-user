export function mailTemplate(msg) {
  // se encripta el mensaje
  return(
    '<div style="margin: auto;width: 60%;border: 1px solid rgb(0, 99, 168);border-radius: 5px;">' +
                      '<header style="border-bottom: 1px solid rgb(0, 99, 168);height: 5em;">' +
                        '<a target="_blank" href="https://akronenglish1.com/">' +
                          '<img style="display: block;    margin: auto;    max-width: 100%;    max-height: 100%;" src="cid:logo@akron.com" alt="logo">' +
                        '</a>' +
                      '</header>' +


                      '<div style = "color: #525252; padding: 15px">'+

                        msg +

                      '</div>'+

                    '</div>'
  )
}

export function mailMonthDisconnectTemplate(msg, cid) {
  // se encripta el mensaje

  let cidF = cid  || "cid:logo@akron.com"
  return(
    '<div style="margin: auto;width: 60%;border: 1px solid rgb(0, 99, 168);border-radius: 5px;">' +
    '<header style="border-bottom: 1px solid rgb(0, 99, 168);height: 5em;">' +
    '<a target="_blank" href="https://akronenglish1.com/">' +
    '<img style="display: block;    margin: auto;    max-width: 100%;    max-height: 100%;" src='+ cidF +' alt="logo">' +
    '</a>' +
    '</header>' +


    '<div style = "color: #525252; padding: 15px">'+

    msg +

    '</div>'+

    '</div>'
  )
}
