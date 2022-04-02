import express from 'express'
import controller from '#controllers/positiveDeclaration.js'
import multer from 'multer'

const router = express.Router()

const upload = multer()

router.use(upload.none())

// Stats
router.get('/statByDates', controller.statByDates)

router.get('/', controller.index)

router.post('/', controller.store)

router.get('/:_id', controller.show)

router.put('/', controller.update)

// router.delete('/', controller.destroy)

export default router
