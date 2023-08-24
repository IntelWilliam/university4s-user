import express from 'express'
import { sendCorreo } from '../../lib/consult';


// creando nuevo router para almacenar rutas 
const router = express.Router()

// ruta {host/api/consult/ } donde enviaremos consultas desde el formualrio Home 
router.post('/', (req, res) => {
  
  // traer data que vienee del front 
  const data = req.body; 
  console.log(data, "data del back");

  // enviar esa data a que lo procese mi controlador
  const result = sendCorreo(data)
  res.json(result)

})

// se exporta el nuevo router
export default router
