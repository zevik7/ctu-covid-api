import express from 'express'
import controller from '#controllers/user.js'
import multer from 'multer'

const router = express.Router()

// Form multipart parse
const storage = multer.diskStorage({
  destination: 'src/public/images/user',
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now())
  },
})

const upload = multer({ storage: storage })

// For avatar image file
router.use(upload.single('avatar'))

router.get('/', controller.index)

router.post('/', controller.store)

router.get('/:id', controller.show)

router.put('/', controller.update)

router.delete('/', controller.destroy)

export default router
