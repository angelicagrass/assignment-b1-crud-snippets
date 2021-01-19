/**
 * Module for the PureNumbersController.
 *
 * @author Mats Loock
 * @version 1.0.0
 */

import moment from 'moment'
import { PureNumber } from '../models/home-model.js'

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
        pureNumbers: (await PureNumber.find({}))
          .map(pureNumber => ({
            id: pureNumber._id,
            createdAt: moment(pureNumber.createdAt).fromNow(),
            value: pureNumber.value
          }))
          .sort((a, b) => a.value - b.value)
      }
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
      value: undefined
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
        value: req.body.value
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
}
