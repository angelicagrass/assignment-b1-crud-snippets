/**
 * Module for the PureNumbersController.
 *
 * @author Mats Loock
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
    console.log('INDEX!')
    console.log(req.session)

    // console.log(req.session.username)
    try {
      const viewData = {
        loggedIn: req.session.loggedin, 
        pureNumbers: (await PureNumber.find({}))
          .map(pureNumber => ({
            id: pureNumber._id,
            createdAt: moment(pureNumber.createdAt).fromNow(),
            value: pureNumber.value,
            user: pureNumber.user,
            checkuser: req.session.name === pureNumber.user
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
    console.log('NEW')

    console.log(req.session.name)
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
      req.session.flash = { type: 'success', text: 'The pure number was saved successfully.' }
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
    console.log(req.body.usrname)

    try {
      const username = req.body.usrname
      const password = req.body.psw
      
      const user = new UserInfo({
        username: username,
        password: password
      })

      await user.save()
      
    } catch (error) {
      req.session.flash = { type: 'danger', text: 'Failed!'}
      res.redirect('./user')
    }
    // res.render('pure-numbers/userstart')
  }


  async loginPost (req, res, next) {

    try {
      const user = await UserInfo.authenticate(req.body.user, req.body.pass)
      req.session.regenerate(async() => {
        req.session.loggedin = true
        const userID = await UserInfo.findOne({username: req.body.user})
        const id = userID._id
        req.session.name = req.body.user
        // const thisUser = (await UserInfo.findOne({username: req.body.value[0]}))
        // req.session.userID = thisUser._id
        // console.log(req.session.userID)
        res.redirect('/new')
      })
      
    } catch (e) {
      console.log(e)
    }
  }

  async logout (req, res) {
    req.session.destroy()
    res.redirect('..')
  }

  async removeSnippet (req, res) {

    console.log('removeeeew')
    console.log(req.url)
    
    try {
      await PureNumber.findOneAndDelete({_id: req.url.substring(14)})
      req.session.flash = { type: 'secondary', text: 'Your snippet was removed'}
      res.redirect('.')
      
    } catch (error) {
      req.session.flash = { type: 'warning', text: 'You cant remove others snippets!'}
    }
  }

  async edit (req, res) {

    console.log(req)



  }





}
