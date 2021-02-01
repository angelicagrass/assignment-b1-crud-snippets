/**
 * Module for the PureNumbersController.
 *
 * @author Angelica Grass
 * @version 1.0.0
 */

import moment from 'moment'
import { PureNumber } from '../models/home-model.js'
import { UserInfo } from '../models/user-model.js'

/**
 * Encapsulates a controller.
 */
export class PureNumbersController {
  /**
   * Displays a list of pure numbers.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async index (req, res, next) {
    try {
      const viewData = {
        loggedIn: req.session.loggedin, 
        pureNumbers: (await PureNumber.find({}))
          .map(pureNumber => ({
            id: pureNumber._id,
            createdAt: moment(pureNumber.createdAt).fromNow(),
            value: pureNumber.value,
            user: pureNumber.user,
            checkuser: req.session.name === pureNumber.user,
            editSnippet: req.session.editSnippet === pureNumber.id,
            text: pureNumber.text
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
   * Returns a HTML form for creating a new pure number.
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
   * Creates a new pure number.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   */
  async create (req, res) {
    try {
      // Create a new pure number...
      const pureNumber = new PureNumber({
        value: req.body.value,
        user: req.session.name

      })

      // ...save the number to the database...
      await pureNumber.save()

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

  async user (req, res, next) {
    res.render('pure-numbers/user')
  }

  async loginUser (req, res, next) {
    try {
      const username = req.body.usrname
      const password = req.body.psw
      const user = new UserInfo({
        username: username,
        password: password
      })

      await user.save()
      req.session.flash = { type: 'success', text: 'You created a new user! Sign in to start creating snippets!'}
      res.redirect('./user')
    } catch (error) {
      req.session.flash = { type: 'danger', text: 'Failed! User was not created!'}
      res.redirect('./user')
    }
  }

  async loginPost (req, res, next) {
    try {
      const user = await UserInfo.authenticate(req.body.user, req.body.pass)
      req.session.regenerate(async () => {
        req.session.loggedin = true
        const userID = await UserInfo.findOne({username: req.body.user})
        const id = userID._id
        req.session.name = req.body.user
        res.redirect('./')
      })
    } catch (error) {
      req.session.flash = { type: 'warning', text: 'Something went wrong!'}
      res.redirect('./user')
    }
  }

  async logout (req, res) {
    req.session.destroy()
    res.redirect('./user')
  }

  async removeSnippet (req, res) {
    try {
      await PureNumber.findOneAndDelete({_id: req.url.substring(14)})
      req.session.flash = { type: 'secondary', text: 'Your snippet was removed'}
      res.redirect('.')
    } catch (error) {
      req.session.flash = { type: 'warning', text: 'You cant remove others snippets!'}
    }
  }

  async edit (req, res) {
    try {
      req.session.editSnippet = req.url.substr(12)
      res.redirect('.')
    } catch (error) {
      next(error)
    }
  }

  async savesnippet(req, res) {
    try {
      await PureNumber.findOneAndUpdate({ _id: req.body.value }, { value: req.body.text})
      req.session.editSnippet = false
      req.session.flash = { type: 'info', text: 'Your snippet was updated!'}
      res.redirect('.')
    } catch (error) {
      next(error)
    }
  }

  async createnewuser(req, res) {
    res.render('pure-numbers/newuser')
  }
}
