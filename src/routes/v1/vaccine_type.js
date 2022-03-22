import express from 'express'
import multer from 'multer'
import controller from '#controllers/vaccine_type.js'

const router = express.Router()

const upload = multer()

router.use(upload.none())

router.get('/', controller.index)

router.post('/', controller.store)

router.get('/:_id', controller.show)

router.put('/', controller.update)

router.delete('/', controller.destroy)

export default router
