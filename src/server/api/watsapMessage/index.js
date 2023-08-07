import express from 'express'
import { sendWatsap } from '../../lib/sendWatsap';
import bodyParser from 'body-parser';

// Se crea nueva Router para almacenar todos los mensajes Relacioandos a Watsap 
const router = express.Router()

// Para interpretar json de la solicitud del backend
router.use(bodyParser.json()) 

router.post('/', (req, res) => {
  console.log(req.body)
  const {email, pass, number} = req.body
  sendWatsap(email, pass, number) 
    .then(data => { res.json(data)})
    .catch(err => {
      console.log(err)
      res.status(500).json({error: "ocurrio un error pipipi"})
    })

})



// se exporta el nuevo router
export default router