import express from 'express'
import controller from '#controllers/user.js'
import multer from 'multer'

const router = express.Router()

// Form multipart parse
const storage = multer.diskStorage({
  destination: 'src/public/user',
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now())
  },
})

const upload = multer({ storage: storage })

// Get upload images file
router.use(upload.fields([{ name: 'avatar', maxCount: 1 }]))

router.get('/', controller.index)

router.post('/', controller.store)

router.get('/:_id', controller.show)

router.put('/', controller.update)

router.delete('/', controller.destroy)

export default router
