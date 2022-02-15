import express from 'express'
import { getUserLessons, addUserLesson, checkIfLessonIsUnlockedAndIsLast } from 'src/server/lib/userlesson'
import { getUserPractices, addUserPractice, checkIfPracticeIsUnlockedAndIsLast } from 'src/server/lib/userpractice'
import { getUserSections, addUserSection , checkIfSectionIsUnlockedAndIsLast} from 'src/server/lib/usersection'
import {unlockNextSubLevel, unlockNextLevel} from 'src/server/lib/user'

// se crea el nuevo router para almacenar rutas
const router = express.Router()

/*
 * Este end point devuelve todas las lecciones desbloqueadas por un usuario en un subnivel
 */
router.get('/:id/sub-level/:subLevelId', (req, res) => {
  getUserLessons(req.params.subLevelId, req.params.id, (err, response) => {
    if (err) return res.status(500).json({ error: err })
    res.json(response)
  })
})

/*
 * Este end point devuelvet todas las practicas desbloqueadas por un usuario en una leccion
 */
router.get('/:id/lesson/:lessonId', (req, res) => {
  getUserPractices(req.params.lessonId, req.params.id, (err, response) => {
    if (err) return res.status(500).json({ error: err })
    res.json(response)
  })
})

/**
 * este endpoint desbloquea la siguiente sección
 */
router.put('/practice/:practiceId/section/:sectionId', (req, res) => {
  checkIfSectionIsUnlockedAndIsLast(req.params.practiceId,req.user._id,req.params.sectionId,
      (err, response) => {
      if (err) return res.status(500).json({ error: err })
      res.json(response)
    })
})

/**
 * este endpoint desbloquea la siguiente practica
 */
router.put('/lesson/:lessonId/practice/:practiceId', (req, res) => {
  checkIfPracticeIsUnlockedAndIsLast(req.params.lessonId,req.user._id,req.params.practiceId,
      (err, response) => {
        if (err) return res.status(500).json({ error: err })
        res.json(response)
      })
})

/*
 * Este end point desbloquea el siguiente sub nivel
 */
router.put('/sub-level/:subLevelId/lesson/:lessonId', (req, res) => {
    checkIfLessonIsUnlockedAndIsLast(req.params.lessonId,req.user._id,req.params.subLevelId,
        (err, response) => {
            if (err) return res.status(500).json({ error: err })
            res.json(response)
        })
})

/*
 * Este end point desbloquea la siguiente leccion
 */
router.put('/sub-level/:subLevelId/lesson/:lessonId', (req, res) => {
    checkIfLessonIsUnlockedAndIsLast(req.params.lessonId,req.user._id,req.params.subLevelId,
        (err, response) => {
            if (err) return res.status(500).json({ error: err })
            res.json(response)
        })
})

router.put('/level/:id/sub-level/:subLevelId', (req, res) => {
    unlockNextSubLevel(req.params.id,req.user,req.params.subLevelId,
        (err, response) => {
            if (err) return res.status(500).json({ error: err })
            res.json(response)
        })
})

router.put('/level/:id', (req, res) => {
    unlockNextLevel(req.params.id,req.user,
        (err, response) => {
            if (err) return res.status(500).json({ error: err })
            res.json(response)
        })
})

/*
 * Este end point devuelve todas las secciones desbloquedas por un usuario en una practica
 */
router.get('/:id/practice/:practiceId', (req, res) => {
  getUserSections(req.params.practiceId, req.params.id, (err, response) => {
    if (err) return res.status(500).json({ error: err })
    res.json(response)
  })
})



// se exporta el nuevo router
export default router
