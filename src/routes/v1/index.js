import express from 'express'

import handleResponse from '#middlewares/handleResponse.js'
import authMiddleware from '#middlewares/auth.js'

import SitesRouter from './sites.js'
import UserRouter from './user.js'
import DeclarationRouter from './declaration.js'
import LocationRouter from './location.js'
import VaccinationRouter from './vaccination.js'
import AuthRouter from './auth.js'

const router = express.Router()

// Custom response
router.use(handleResponse)

router.use('/', SitesRouter)

router.use('/admin/auth', AuthRouter)

router.use('/user', authMiddleware, UserRouter)

router.use('/heath_declaration', authMiddleware, DeclarationRouter)

router.use('/location', authMiddleware, LocationRouter)

router.use('/vaccination', authMiddleware, VaccinationRouter)

router.use('/vaccine_type', authMiddleware, VaccinationRouter)

// Custom handle error

export default router
