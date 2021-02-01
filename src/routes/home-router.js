import express from 'express'
import { PureSnippetController } from '../controllers/home-controller.js'

export const router = express.Router()

const controller = new PureSnippetController()

// Map HTTP verbs and route paths to controller actions.
router.get('/', controller.index)
router.get('/new', controller.new)
router.get('/user', controller.user)
router.get('/logout', controller.logout)
router.get('/createnewuser', controller.createnewuser)

router.post('/remove', controller.removeSnippet)
router.post('/edit', controller.edit)
router.post('/savesnippet', controller.savesnippet)
router.post('/loginPost', controller.loginPost)
router.post('/loginUser', controller.loginUser)
router.post('/create', controller.create)
