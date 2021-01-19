import express from 'express'
import { PureNumbersController } from '../controllers/home-controller.js'

export const router = express.Router()

const controller = new PureNumbersController()

// Map HTTP verbs and route paths to controller actions.
router.get('/', controller.index)

router.get('/new', controller.new)
router.post('/create', controller.create)
