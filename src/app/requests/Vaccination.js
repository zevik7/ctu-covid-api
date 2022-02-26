import Joi from 'joi'

const create = (data) => {
  // create schema object
  const schema = Joi.object({
    user_id: Joi.string().required(),
    vaccine_type_id: Joi.string.required(),
    injection_date: Joi.date().required(),
    images: [
      {
        url: Joi.string(),
        desc: Joi.string(),
      },
    ],
  })

  // schema options
  const options = {
    abortEarly: false, // include all errors
    allowUnknown: true, // ignore unknown props
    stripUnknown: true, // remove unknown props
  }

  // validate request body against schema
  const { error, value } = schema.validate(data, options)

  return error
}

export default { create }
