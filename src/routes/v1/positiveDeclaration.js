import express from 'express'
import controller from '#controllers/positiveDeclaration.js'
import multer from 'multer'
import authMiddleware from '#middlewares/auth.js'

const router = express.Router()

const upload = multer()

router.use(upload.none())

// Stats
router.get('/general_stat', controller.generalStat)

router.get('/', controller.index)

router.post('/', controller.store)

router.get('/:_id', controller.show)

router.put('/', authMiddleware, controller.update)

router.delete('/', authMiddleware, controller.destroy)

export default router
