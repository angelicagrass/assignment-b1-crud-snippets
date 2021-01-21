
// import { bcryptjs } from 'bcryptjs'
import mongoose from 'mongoose'

// Create a schema.
const schema = new mongoose.Schema({
  username: {
    type: String,
    required: '`{PATH}` is required!',
    minlength: [3, '`{PATH}` ({VALUE}) username needs to be at least 3 characters ({MIN}).'],
    maxlength: [30, '`{PATH}` ({VALUE}) exceeds the limit ({MAX}).'],
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    minlength: [8, '`{PATH}` ({VALUE}) password needs to be at least 8 characters ({MIN}).'],
    maxlength: [500, '`{PATH}` ({VALUE}) exceeds the limit ({MAX}).'],
    required: true
  }
}, {
  timestamps: true,
  versionKey: false
})

schema.pre('save', async function () {
  this.password = await bcrypt.hash(this.password, 8)
  console.log('schemat!')
})

// schema.post('save', async function () {
//   // this.password = await bcrypt.hash(this.password, 8)
//   console.log('posten!')
// })

// Create a model using the schema.





export const UserInfo = mongoose.model('UserInfo', schema)