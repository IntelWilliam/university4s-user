import https from 'https'

// funcion para enviar mensaje por watsap al registrarse un nuevo usuario
export function sendWatsap(correo, contra, numero) {
  return new Promise((resolve, reject) => {
 
    // logica para hacer el Post a la APi de Meta 
    const number = numero
    const email = correo
    const pass = contra

    const url = "https://graph.facebook.com/v17.0/110751975407808/messages";
    const token =
      "EAANuWnlZBCEwBAHyoI2TpB5Rb9l0vSDjmg2UoyaJsmCidZBTt34U0CZCeF5f1iXfB367Ec7DHZAHWcyM86w09O7KCknP6SoUzIZBmXBzPJk3hSXzZBJDtcP0fp50pQdnAHjnX71f7QzUTOZBCkqzKqbUWW8yBK0dLZBO4etOR0yQNJhdnCeUstbud3E2Qrs6tWGzjvaGvaoXwAZDZD";

    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };

    const data = {
      messaging_product: "whatsapp",
      to: number,
      type: "template",
      template: {
        name: "credential",
        language: {
          code: "es",
        },
        // parametros de la plantilla
        components: [
          {
            type: "body",
            parameters: [
              {
                type: "text",
                text: email,
              },
              {
                type: "text",
                text: pass,
              },
            ],
          },
        ],
      },
    };

    const options = {
      hostname: "graph.facebook.com",
      path: "/v17.0/110751975407808/messages",
      method: 'POST',
      headers
    }

    const req = https.request(options, (res) => {
      let responseData = '';

      res.on('data', (chunk) => {
        responseData += chunk;
      });

      res.on('end', () => {
        console.log('Mensaje enviado de maravilla', responseData);
        resolve({ status:"success", mensaje:'mensaje enviado a la graph de facebook' });
      });
    });

    req.on('error', (error) => {
      console.error('Error enviando el mensaje:', error);
      reject({ status: "error", mensaje: "ocurrió un error pipipi"});
    });

    req.write(JSON.stringify(data));
    req.end();
    
  })

}
