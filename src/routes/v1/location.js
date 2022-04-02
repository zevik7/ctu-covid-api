import express from 'express'
import controller from '#controllers/location.js'
import authMiddleware from '#middlewares/auth.js'

const router = express.Router()

router.get('/', controller.index)

router.post('/', authMiddleware, controller.store)

router.get('/:_id', controller.show)

router.put('/', authMiddleware, controller.update)

router.delete('/', authMiddleware, controller.destroy)

export default router
