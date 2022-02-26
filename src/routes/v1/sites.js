import express from 'express'
import controller from '#controllers/sites.js'

const router = express.Router()

router.get('/', controller.index)

export default router
