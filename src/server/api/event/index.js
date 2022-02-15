import express from 'express'
import { addEvents, getEvents, addEventsBooks } from 'src/server/lib/event'

// se crea el nuevo router para almacenar rutas
const router = express.Router()


/*
 * Este endpoint crea los eventos de un usuario de acuerdo a los libros y lecciones
 */
router.post('/', (req, res) => {

  var id

  if(req.user){
    id = req.user._id
  }else if(req.body.userId){
    id= req.body.userId
  }else{
    return res.json( "Faltan datos" )
  }

  let date = req.body.date;

  addEventsBooks(date, id, (err, response) => {
    if (err)
      return res.status(500).json(err)
    res.json(response)
  })
})


/*
 * Este end point devuelve todos las entradas de un usuario en unas fechas específicas
 */
router.get('/', (req, res) => {
  let query = req.query
  let firstDate = query.firstDate;
  let secondDate = query.secondDate;
  getEvents(firstDate, secondDate, req.user._id, (err, response) => {
    if (err)
      return res.status(500).json(err)
    res.json(response)
  })
})

/*
 * Este endpoint crea los eventos de un usuario de acuerdo a las entradas que tiene nivel moodle
 */
router.post('/entries', (req, res) => {

  var id

  if(req.user){
    id = req.user._id
  }else if(req.body.userId){
    id= req.body.userId
  }else{
    return res.json( "Faltan datos" )
  }

  let date = req.body.date;
  addEvents(date, id, (err, response) => {
    if (err)
      return res.status(500).json(err)
    res.json(response)
  })
})

// se exporta el nuevo router
export default router
