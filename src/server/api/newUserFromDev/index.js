import express from 'express'
import { newUserFromDev } from 'src/server/lib/newUserFromDev'

// se crea el nuevo router para almacenar rutas
const router = express.Router()

/*
 * Este end point actualiza todos los usuarios de mysql ( dev ) que no existen a mongo (nueva plataforma)
 */
router.post('/', (req, res) => {
  console.log('newUserFromDev - /');
  let params = req.body
  newUserFromDev(params, (err, resp) => {
    if (err) return res.status(500).json(err)
    res.json(resp)
  })
})


// se exporta el nuevo router
export default router
