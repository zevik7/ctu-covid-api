import Joi from 'joi'

// schema options
const options = {
  abortEarly: false, // include all errors
  allowUnknown: true, // ignore unknown props
  stripUnknown: true, // remove unknown props
}

const login = (data) => {
  // login schema object
  const schema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
  })

  const validationResult = schema.validate(data, options)

  return validationResult
}

export default { login }
