import express from 'express'
import controller from '#controllers/healthDeclaration.js'
import authMiddleware from '#middlewares/auth.js'

const router = express.Router()

router.get('/general_stat', controller.generalStat)

router.get('/', controller.index)

router.get('/:_id', controller.show)

router.post('/', authMiddleware, controller.store)

router.put('/', authMiddleware, controller.update)

router.delete('/', authMiddleware, controller.destroy)

export default router
