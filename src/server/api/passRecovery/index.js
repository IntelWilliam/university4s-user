import express from 'express'
import { findSendEmail } from 'src/server/lib/passRecovery'

// se crea el nuevo router para almacenar rutas
const router = express.Router()

/*
 * Este endpoint crea un nuevo registro
 */
router.post('/', (req, res) => {
  let params = req.body.email
  findSendEmail(params, (err, passRecovery) => {
    if (err) return res.json(err)
    res.json(passRecovery)
  })
})

// se exporta el nuevo router
export default router
