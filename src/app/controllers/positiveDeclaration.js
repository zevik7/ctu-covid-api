import getPositiveDeclarationModel from '#models/Positive_declaration.js'
import getLocation from '#models/Location.js'
import getUser from '#models/User.js'
import { ObjectId } from 'mongodb'

class PositiveDeclarationController {
  // [GET] /health_declaration
  async index(req, res, next) {
    try {
      let { currentPage, perPage, ...filter } = req.query
      // Convert to number
      currentPage = +currentPage || 1
      perPage = +perPage || 0

      // Calculation pagination
      const skip = (currentPage - 1) * perPage
      const count = await getPositiveDeclarationModel().countDocuments({})

      // Filters
      if (filter) {
        if (filter.hasOwnProperty('created_at_between')) {
          const { start, end } = JSON.parse(filter.created_at_between)
          filter.created_at = { $gte: new Date(start), $lte: new Date(end) }
          delete filter.created_at_between
        }
        if (filter.hasOwnProperty('location._id')) {
          filter['location._id'] = ObjectId(filter['location._id'])
        }
        if (filter.hasOwnProperty('user._id')) {
          filter['user._id'] = ObjectId(filter['user._id'])
        }
      }

      const data = await getPositiveDeclarationModel()
        .find(filter)
        .sort()
        .skip(skip)
        .limit(perPage)
        .toArray()

      return res.success({
        currentPage,
        perPage,
        count,
        data,
      })
    } catch (error) {
      return res.badreq(error)
    }
  }

  // [GET] /health_declaration?_id
  async show(req, res, next) {
    try {
      const data = await getPositiveDeclarationModel()
        .findOne({
          _id: ObjectId(req.params.id),
        })
        .then((rs) => rs)
      return res.success({
        data,
      })
    } catch (error) {
      return res.badreq(error.stack)
    }
  }

  // [POST] /health_declaration
  async store(req, res, next) {
    try {
      // Get location
      const location = await getLocation().findOne(
        {
          _id: ObjectId(req.body.location_id),
        },
        {
          projection: { _id: 1, name: 1, position: 1 },
        }
      )

      // Get user
      const user = await getUser().findOne(
        {
          $or: [
            { phone: req.body.user_indentity },
            { email: req.body.user_indentity },
          ],
        },
        {
          projection: { _id: 1, name: 1, phone: 1, email: 1, address: 1 },
        }
      )

      if (!user)
        throw {
          errors: {
            user_indentity: 'Không tìm thấy người dùng',
          },
          type: 'validation',
        }

      const data = await getPositiveDeclarationModel()
        .insertOne({
          user: { ...user },
          location: { ...location },
          status: req.body.status,
          created_at: new Date(),
          updated_at: new Date(),
        })
        .then((rs) => rs)

      return res.success({
        data: data,
      })
    } catch (error) {
      return res.badreq(error.stack)
    }
  }

  //[PUT] /health_declaration
  async update(req, res, next) {
    try {
      const data = await getPositiveDeclarationModel()
        .updateOne(
          {
            _id: ObjectId(req.query._id),
          },
          {
            $set: req.body,
            $currentDate: { updated_at: true },
          }
        )
        .then((rs) => rs)

      return res.success({
        data,
      })
    } catch (error) {
      return res.badreq(error)
    }
  }

  // [DELETE] /health_declaration?ids=[]
  async destroy(req, res, next) {
    try {
      const ids = req.query.ids.map((id, index) => ObjectId(id))
      const data = await getPositiveDeclarationModel().deleteMany({
        _id: { $in: ids },
      })

      return res.success({
        data,
      })
    } catch (error) {
      return res.badreq(error)
    }
  }
}

export default new PositiveDeclarationController()
