
import mongoose from 'mongoose'

// Create a schema.
const schema = new mongoose.Schema({
  // value: {
  //   type: String,
  //   required: '`{PATH}` is required!',
  //   max: [42, '`{PATH}` ({VALUE}) exceeds the limit ({MAX}).'],
  //   min: [1, '`{PATH}` ({VALUE}) is beneath the limit ({MIN}).']
  // }
  value: {
    type: String,
    // required: true,
    maxlength: 2000,
    minlength: 2
  },
  user: {
    type: String,
    required: true,
  }
}, {
  timestamps: true,
  versionKey: false
})

// Create a model using the schema.
export const PureNumber = mongoose.model('PureNumber', schema)