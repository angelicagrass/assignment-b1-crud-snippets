
// import { bcryptjs } from 'bcryptjs'
import mongoose from 'mongoose'
import bcrypt from 'bcrypt'


// Create a schema.
const schema = new mongoose.Schema({
  username: {
    type: String,
    required: '`{PATH}` is required!',
    minlength: [2, '`{PATH}` ({VALUE}) username needs to be at least 2 characters ({MIN}).'],
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
})

schema.statics.authenticate = async function (user, password) {
  const loginUser = await this.findOne({ username: user })
  if (!loginUser || !(await bcrypt.compare(password, loginUser.password))) {
    throw new Error('Invalid login attempt')
  }
  return loginUser
}

// schema.post('save', async function () {
//   // this.password = await bcrypt.hash(this.password, 8)
//   console.log('posten!')
// })

// Create a model using the schema.





export const UserInfo = mongoose.model('UserInfo', schema)