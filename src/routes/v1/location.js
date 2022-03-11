import express from 'express'
import controller from '#controllers/location.js'

const router = express.Router()

router.get('/', controller.index)

router.post('/', controller.store)

router.get('/', controller.show)

router.put('/', controller.update)

router.delete('/', controller.destroy)

export default router
