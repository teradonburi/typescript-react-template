import {default as mongoose} from 'mongoose'
const Schema = mongoose.Schema
import mongooseLeanVirtuals from 'mongoose-lean-virtuals'
import { model } from 'interface'

const schema = new Schema({
  gender: String,
  first: String,
  last: String,
  email: String,
}, {
  timestamps: true,
  toObject: {
    virtuals: true,
  },
  toJSON: {
    virtuals: true,
    transform: (doc, m): model.User => {
      delete m.__v
      return m
    },
  },
})

schema.pre('update', async function(next) {
  this.setOptions({runValidators: true})
  return next()
})
schema.pre('findOneAndUpdate', async function(next) {
  this.setOptions({runValidators: true, new: true})
  return next()
})

schema.virtual('thumbnail').get(function () {
  // TODO:固定じゃなくて変える
  return 'https://avatars1.githubusercontent.com/u/771218?s=460&v=4'
})

schema.plugin(mongooseLeanVirtuals)

export default mongoose.model<model.User>('User', schema)