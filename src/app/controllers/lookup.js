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

      // Create regex for search
      const filter = {
        $or: [{ phone: user_identify }, { email: user_identify }],
        role: 'user',
      }

      const data = await getUserModel().findOne(filter)

      if (!data)
        throw {
          errors: { user_identify: 'Không tìm thấy người dùng' },
          type: 'validation',
        }

      const { name, _id } = data

      return res.success({
        data: {
          _id,
          name,
        },
      })
    } catch (error) {
      return res.badreq(error)
    }
  }

  async healthDeclaration(req, res, next) {
    try {
      const data = await getHealthDeclarationModel()
        .find({ 'user._id': ObjectId(req.query['user._id']) })
        .sort()
        .toArray()

      return res.success({
        data,
      })
    } catch (error) {
      return res.badreq(error)
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
          delete filter.created_at_between
        }
        if (filter.hasOwnProperty('user._id')) {
          filter['user._id'] = ObjectId(filter['user._id'])
        }
      }

      const data = await getPositiveDeclarationModel().find(filter).toArray()

      return res.success({
        data,
      })
    } catch (error) {
      return res.badreq(error)
    }
  }

  async injection(req, res, next) {
    try {
      const data = await getInjectionModel()
        .find({ 'user._id': ObjectId(req.query['user._id']) })
        .sort()
        .toArray()

      return res.success({
        data,
      })
    } catch (error) {
      return res.badreq(error)
    }
  }
}

export default new LookupController()
