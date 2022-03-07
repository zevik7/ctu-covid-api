import express from 'express'
import controller from '#controllers/vaccine_type.js'

const router = express.Router()

router.get('/', controller.index)

router.post('/', controller.store)

router.get('/:id', controller.show)

router.put('/', controller.update)

router.delete('/', controller.destroy)

export default router
