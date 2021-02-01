/**
 * Module for the PureSnippet schema.
 *
 * @author Angelica Grass
 * @version 1.0.0
 */

import mongoose from 'mongoose'

// Create a schema.
const schema = new mongoose.Schema({
  value: {
    type: String,
    maxlength: 2000,
    minlength: 2
  },
  text: {
    type: String,
    maxlength: 2000
  },
  user: {
    type: String,
    required: true
  }
}, {
  timestamps: true,
  versionKey: false
})

// Create a model using the schema.
export const PureSnippet = mongoose.model('PureNumber', schema)
