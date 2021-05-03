/**
 * Module for the PureSnippetController.
 *
 * @author Angelica Grass
 * @version 1.0.0
 */

import moment from 'moment'
import { PureSnippet } from '../models/home-model.js'
import { UserInfo } from '../models/user-model.js'

/**
 * Encapsulates a controller.
 */
export class PureSnippetController {
  /**
   * Displays a list of snippets.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async index (req, res, next) {
    try {
      const viewData = {
        loggedIn: req.session.loggedin,
        pureSnippet: (await PureSnippet.find({}))
          .map(pureSnippet => ({
            id: pureSnippet._id, // Id to identify the snippet at server.
            createdAt: moment(pureSnippet.createdAt).fromNow(), // Time when created.
            value: pureSnippet.value,
            user: pureSnippet.user,
            checkuser: req.session.name === pureSnippet.user, // checks if session name is equal to owner of snippet.
            editSnippet: req.session.editSnippet === pureSnippet.id, // checks if edit snippet is equal to id of pure snippet.
            text: pureSnippet.text
          }))
          .sort((a, b) => a.value - b.value)
      }
      console.log(viewData)
      res.render('pure-numbers/index', { viewData })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Returns a HTML form for creating a new snippet.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   */
  async new (req, res) {
    const viewData = {
      loggedIn: req.session.loggedin,
      username: req.session.name
    }
    res.render('pure-numbers/new', { viewData })
  }

  /**
   * Creates a new snippet.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   */
  async create (req, res) {
    try {
      // Create a new snippet...
      const pureSnippet = new PureSnippet({
        value: req.body.value,
        user: req.session.name

      })

      // ...save the number to the database...
      await pureSnippet.save()

      // ...and redirect and show a message.
      req.session.flash = { type: 'success', text: 'The snippet was saved successfully.' }
      res.redirect('.')
    } catch (error) {
      // If an error, or validation error, occurred, view the form and an error message.
      res.render('pure-numbers/new', {
        validationErrors: [error.message] || [error.errors.value.message],
        value: req.body.value
      })
    }
  }

  /**
   * Renders /user path.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   */
  async user (req, res) {
    res.render('pure-numbers/user')
  }

  /**
   * Checks if input username and password is available.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   */
  async loginUser (req, res) {
    try {
      const username = req.body.usrname
      const password = req.body.psw
      // Create and save new user to the server.
      const user = new UserInfo({
        username: username,
        password: password
      })

      await user.save()
      req.session.flash = { type: 'success', text: 'You created a new user! Sign in to start creating snippets!' }
      res.redirect('./user') // send user to loginpage
    } catch (error) {
      req.session.flash = { type: 'danger', text: 'Failed! User was not created!' }
      res.redirect('./user') // send user to loginpage
    }
  }

  /**
   * Checks if input username and password is right. LOG IN.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   */
  async loginPost (req, res) {
    try {
      await UserInfo.authenticate(req.body.user, req.body.pass)
      req.session.regenerate(async () => {
        req.session.loggedin = true
        await UserInfo.findOne({ username: req.body.user })
        req.session.name = req.body.user
        res.redirect('./')
      })
    } catch (error) {
      req.session.flash = { type: 'warning', text: 'Something went wrong!' }
      res.redirect('./user')
    }
  }

  /**
   * Logout user by destroying session.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   */
  async logout (req, res) {
    req.session.destroy()
    res.redirect('./user')
  }

  /**
   * Checks if input username and password is available.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   */
  async removeSnippet (req, res) {
    try {
      await PureSnippet.findOneAndDelete({ _id: req.body.value })
      req.session.flash = { type: 'secondary', text: 'Your snippet was removed' }
      res.redirect('.')
    } catch (error) {
      req.session.flash = { type: 'warning', text: 'You cant remove others snippets!' }
    }
  }

  /**
   * Edit snippet.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   */
  async edit (req, res) {
    try {
      req.session.editSnippet = req.body.value
      res.redirect('.')
    } catch (error) {
      res.redirect('.')
    }
  }

  /**
   * Save edited snippet.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   */
  async savesnippet (req, res) {
    try {
      await PureSnippet.findOneAndUpdate({ _id: req.body.value }, { value: req.body.text })
      req.session.editSnippet = false
      req.session.flash = { type: 'info', text: 'Your snippet was updated!' }
      res.redirect('.')
    } catch (error) {
      req.session.flash = { type: 'warning', text: 'Your snippet was not updated!' }
      res.redirect('.')
    }
  }

  /**
   * Save edited snippet.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   */
  async createnewuser (req, res) {
    res.render('pure-numbers/newuser')
  }
}
