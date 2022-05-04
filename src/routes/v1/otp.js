import express from 'express'
import controller from '#controllers/otp.js'

const router = express.Router()

router.post('/', controller.get)

export default router
