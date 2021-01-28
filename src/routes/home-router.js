import express from 'express'
import { PureNumbersController } from '../controllers/home-controller.js'

export const router = express.Router()

const controller = new PureNumbersController()

// Map HTTP verbs and route paths to controller actions.
router.get('/', controller.index)

router.get('/new', controller.new)
router.get('/user', controller.user)

router.get('/logout', controller.logout)

router.get('/remove', controller.removeSnippet)
router.get('/edit', controller.edit)

router.get('/createnewuser', controller.createnewuser)

router.post('/savesnippet', controller.savesnippet)

router.post('/loginPost', controller.loginPost)

router.post('/loginUser', controller.loginUser)
router.post('/create', controller.create)
