import express from 'express'
import multer from 'multer'

import handleResponse from '#middlewares/handleResponse.js'
import authMiddleware from '#middlewares/auth.js'

import SitesRouter from './sites.js'
import UserRouter from './user.js'
import DeclarationRouter from './declaration.js'
import LocationRouter from './location.js'
import InjectionRouter from './injection.js'
import VaccineTypeRouter from './vaccine_type.js'
import AuthRouter from './auth.js'

const router = express.Router()

// Custom response
router.use(handleResponse)

router.use('/', SitesRouter)

router.use('/auth', AuthRouter)

router.use('/user', authMiddleware, UserRouter)

router.use('/heath_declaration', authMiddleware, DeclarationRouter)

router.use('/location', authMiddleware, LocationRouter)

router.use('/injection', authMiddleware, InjectionRouter)

router.use('/vaccine_type', authMiddleware, VaccineTypeRouter)

// Custom handle error

export default router
