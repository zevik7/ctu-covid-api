import express from 'express'
import controller from '#controllers/lookup.js'

const router = express.Router()

router.get('/user', controller.user)

router.get('/health_declaration', controller.healthDeclaration)

router.get('/positive_declaration', controller.positiveDeclaration)

router.get('/injection', controller.injection)

export default router
