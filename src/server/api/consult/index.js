import express from 'express'
import { sendCorreo } from '../../lib/consult';


// creando nuevo router para almacenar rutas 
const router = express.Router()

// ruta {host/api/consult/ } donde enviaremos consultas desde el formualrio Home 
router.post('/', (req, res) => {
  
  // traer data que vienee del front 
  const data = req.body; 
  console.log(data, "data del backend");

  // enviar esa data a que lo procese mi controlador
  sendCorreo(data, function(message) {
    res.json({message});
  })

})

// se exporta el nuevo router
export default router
