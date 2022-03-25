import express from 'express'
import multer from 'multer'
import controller from '#controllers/userProfile.js'

const router = express.Router()

const upload = multer()

router.use(upload.none())

router.post('/', controller.store)

export default router
