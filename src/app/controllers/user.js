import getUserModel from '#models/User.js'
import UserRequest from '#requests/User.js'
import { ObjectId } from 'mongodb'

class UserController {
  // [GET] /user
  async index(req, res, next) {
    try {
      let { currentPage, perPage, ...filter } = req.query
      // Convert to number
      currentPage = +currentPage || 1
      perPage = +perPage || 0

      // Calculation pagination
      const skip = (currentPage - 1) * perPage
      const count = await getUserModel().countDocuments({})

      // Create regex for search
      if (filter) {
        if (filter.hasOwnProperty('search') && filter.search) {
          filter = {
            $or: [
              { name: new RegExp(filter.search, 'i') },
              { phone: new RegExp(filter.search, 'i') },
              { email: new RegExp(filter.search, 'i') },
            ],
          }
        } else {
          filter = {}
        }
      }

      const data = await getUserModel()
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
      return req.badreq(error)
    }
  }

  // [GET] /user?_id
  async show(req, res, next) {
    try {
      const data = await getUserModel()
        .findOne({
          _id: ObjectId(req.params.id),
        })
        .then((rs) => rs)
      return res.success({
        data,
      })
    } catch (error) {
      return res.badreq(error)
    }
  }

  // [POST] /user
  async store(req, res, next) {
    try {
      const data = await getUserModel()
        .insertOne({
          ...req.body,
          created_at: Date.now,
          updated_at: Date.now,
        })
        .then((rs) => rs)

      return res.success({
        data: data,
      })
    } catch (error) {
      return res.badreq(error)
    }
  }

  //[PUT] /user
  async update(req, res, next) {
    try {
      const data = await getUserModel()
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

  // [DELETE] /user?ids=[]
  async destroy(req, res, next) {
    try {
      const ids = req.query.ids.map((id, index) => ObjectId(id))
      const data = await getUserModel().deleteMany({ _id: { $in: ids } })

      return res.success({
        data,
      })
    } catch (error) {
      return res.badreq(error)
    }
  }
}

export default new UserController()
