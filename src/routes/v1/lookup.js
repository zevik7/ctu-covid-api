import express from 'express'
import controller from '#controllers/lookup.js'

const router = express.Router()

router.get('/user', controller.user)

export default router
