import express from 'express'
import createError from 'http-errors'
import { router as pureNumbersRouter } from './home-router.js'

export const router = express.Router()

router.use('/', pureNumbersRouter)

// Catch 404 (ALWAYS keep this as the last route).
router.use('*', (req, res, next) => next(createError(404)))
