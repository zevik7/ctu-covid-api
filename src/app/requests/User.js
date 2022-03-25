import Joi from 'joi'
import getUserModel from '#models/User.js'
import { ObjectId } from 'mongodb'

// schema options
const options = {
  abortEarly: false, // include all errors
  allowUnknown: true, // ignore unknown props
  stripUnknown: true, // remove unknown props
}

const create = (data) => {
  // create schema object
  const schema = Joi.object({
    name: Joi.string().required(),
    birthday: Joi.date().required(),
    gender: Joi.valid('Nam', 'Nữ').required(),
    email: Joi.string().email().required(),
    phone: Joi.string().required(),
    address: Joi.string().required(),
    username: Joi.string(),
    password: Joi.string().min(6),
    avatar: Joi.string(),
    role: Joi.string().valid('admin', 'user').required(),
  })

  // validate request body against schema
  const validationResult = schema.validate(data, options)

  return validationResult
}

const update = (data) => {
  // create schema object
  const schema = Joi.object({
    name: Joi.string(),
    birthday: Joi.date(),
    gender: Joi.valid('Nam', 'Nữ'),
    email: Joi.string().email(),
    phone: Joi.string(),
    address: Joi.string(),
    username: Joi.string(),
    password: Joi.string().min(6),
    avatar: Joi.string(),
    role: Joi.string().valid('admin', 'user'),
    tot_injections: Joi.number(),
    tot_heath_declaration: Joi.number(),
    tot_location: Joi.number(),
  })

  // validate request body against schema
  const validationResult = schema.validate(data, options)

  return validationResult
}

const checkUniqueField = async (filter, excludeId) => {
  if (excludeId) filter._id = { $ne: ObjectId(excludeId) }

  const existObj = await getUserModel().findOne(filter)

  return existObj ? false : true
}

export default { create, update, checkUniqueField }
