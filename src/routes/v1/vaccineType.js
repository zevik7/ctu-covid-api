import express from 'express'
import multer from 'multer'
import controller from '#controllers/vaccineType.js'
import authMiddleware from '#middlewares/auth.js'

const router = express.Router()

const upload = multer()

router.use(upload.none())

router.get('/', authMiddleware, controller.index)

router.post('/', authMiddleware, controller.store)

router.get('/:_id', authMiddleware, controller.show)

router.put('/', authMiddleware, controller.update)

router.delete('/', authMiddleware, controller.destroy)

export default router
