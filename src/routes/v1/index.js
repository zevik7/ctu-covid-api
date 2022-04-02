import express from 'express'

import handleResponse from '#middlewares/handleResponse.js'

import SitesRouter from './sites.js'
import UserRouter from './user.js'
import HealthDeclarationRouter from './healthDeclaration.js'
import LocationRouter from './location.js'
import InjectionRouter from './injection.js'
import VaccineTypeRouter from './vaccineType.js'
import AuthRouter from './auth.js'
import PositiveDeclarationRouter from './positiveDeclaration.js'
import LookupRouter from './lookup.js'

const router = express.Router()

// Custom response
router.use(handleResponse)

router.use('/', SitesRouter)

router.use('/auth', AuthRouter)

router.use('/lookup', LookupRouter)

router.use('/positive_declaration', PositiveDeclarationRouter)

router.use('/user', UserRouter)

router.use('/heath_declaration', HealthDeclarationRouter)

router.use('/location', LocationRouter)

router.use('/injection', InjectionRouter)

router.use('/vaccine_type', VaccineTypeRouter)

// Custom handle error

export default router
