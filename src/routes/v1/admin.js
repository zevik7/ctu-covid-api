import express from 'express'
import controller from '#controllers/admin.js'
import multer from 'multer'
import authMiddleware from '#middlewares/auth.js'

const router = express.Router()

const upload = multer()

router.use(upload.none())

router.get('/:_id', authMiddleware, controller.show)

router.put('/update_password', authMiddleware, controller.updatePass)

router.put('/', authMiddleware, controller.update)

export default router
