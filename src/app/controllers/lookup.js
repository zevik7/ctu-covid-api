import getUserModel from '#models/User.js'
import getHealthDeclarationModel from '#models/Health_declaration.js'
import getPositiveDeclarationModel from '#models/Positive_declaration.js'
import getInjectionModel from '#models/Injection.js'
import { ObjectId } from 'mongodb'

class LookupController {
  // [GET] /lookup/user
  async user(req, res, next) {
    try {
      const user_identify = req.query.user_identify

      const result = await getUserModel().findOne(
        {
          $or: [{ phone: user_identify }, { email: user_identify }],
          role: 'user',
        },
        { projection: { _id: 1, name: 1 } }
      )

      if (!result)
        throw {
          errors: { user_identify: 'Không tìm thấy người dùng' },
          type: 'validation',
        }

      return res.success(result)
    } catch (error) {
      return res.badreq(error)
    }
  }

  async healthDeclaration(req, res, next) {
    try {
      const result = await getHealthDeclarationModel()
        .find({ 'user._id': ObjectId(req.query['user._id']) })
        .sort()
        .toArray()

      return res.success(result)
    } catch (error) {
      return res.badreq(error.stack)
    }
  }

  async positiveDeclaration(req, res, next) {
    try {
      let { ...filter } = req.query

      // Filters
      if (filter) {
        if (filter.hasOwnProperty('created_at_between')) {
          const { start, end } = JSON.parse(filter.created_at_between)
          filter.created_at = { $gte: new Date(start), $lte: new Date(end) }
        }
        if (filter.hasOwnProperty('user._id')) {
          filter['user._id'] = ObjectId(filter['user._id'])
        }
      }
      delete filter.created_at_between

      const result = await getPositiveDeclarationModel().find(filter).toArray()

      return res.success(result)
    } catch (error) {
      return res.badreq(error.stack)
    }
  }

  async injection(req, res, next) {
    try {
      const result = await getInjectionModel()
        .find({ 'user._id': ObjectId(req.query['user._id']) })
        .sort()
        .toArray()

      return res.success(result)
    } catch (error) {
      return res.badreq(error.stack)
    }
  }
}

export default new LookupController()
