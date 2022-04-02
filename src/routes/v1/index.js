import express from 'express'
import multer from 'multer'

import handleResponse from '#middlewares/handleResponse.js'
import authMiddleware from '#middlewares/auth.js'

import SitesRouter from './sites.js'
import UserRouter from './user.js'
import HealthDeclarationRouter from './healthDeclaration.js'
import LocationRouter from './location.js'
import InjectionRouter from './injection.js'
import VaccineTypeRouter from './vaccineType.js'
import AuthRouter from './auth.js'
import userRegisterRouter from './userRegister.js'
import PositiveDeclarationRouter from './positiveDeclaration.js'
import LookupRouter from './lookup.js'

const router = express.Router()

// Custom response
router.use(handleResponse)

// Public router
router.use('/', SitesRouter)

router.use('/auth', AuthRouter)

router.use('/user_register', userRegisterRouter)

router.use('/lookup', LookupRouter)

router.use('/positive_declaration', PositiveDeclarationRouter)

// Auth router
router.use('/user', authMiddleware, UserRouter)

router.use('/heath_declaration', authMiddleware, HealthDeclarationRouter)

router.use('/location', authMiddleware, LocationRouter)

router.use('/injection', authMiddleware, InjectionRouter)

router.use('/vaccine_type', authMiddleware, VaccineTypeRouter)

// Custom handle error

export default router
