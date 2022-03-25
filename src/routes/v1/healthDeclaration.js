import express from 'express'
import controller from '#controllers/healthDeclaration.js'

const router = express.Router()

router.get('/', controller.index)

router.post('/', controller.store)

router.get('/:_id', controller.show)

router.put('/', controller.update)

router.delete('/', controller.destroy)

export default router
