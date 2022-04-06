import express from 'express'
import multer from 'multer'
import controller from '#controllers/article.js'
import authMiddleware from '#middlewares/auth.js'

const router = express.Router()

// Form multipart parse
const storage = multer.diskStorage({
  destination: 'src/public/article',
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now())
  },
})

const upload = multer({ storage: storage })

// Get upload images file
router.use(upload.fields([{ name: 'images' }]))

router.get('/', controller.index)

router.post('/', authMiddleware, controller.store)

router.get('/:_id', controller.show)

router.put('/', authMiddleware, controller.update)

router.delete('/', authMiddleware, controller.destroy)

export default router
