import getHealthDeclarationModel from '#models/Health_declaration.js'
import { ObjectId } from 'mongodb'

class HealthDeclarationController {
  // [GET] /health_declaration
  async index(req, res, next) {
    try {
      let { currentPage, perPage, ...filter } = req.query
      // Convert to number
      currentPage = +currentPage || 1
      perPage = +perPage || 0

      // Calculation pagination
      const skip = (currentPage - 1) * perPage
      const count = await getHealthDeclarationModel().countDocuments({})

      // Filters
      if (filter) {
        if (filter.hasOwnProperty('created_at_between')) {
          const { start, end } = JSON.parse(filter.created_at_between)
          filter.created_at = { $gte: new Date(start), $lte: new Date(end) }
          delete filter.created_at_between
        }
      }

      const data = await getHealthDeclarationModel()
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
      const data = await getHealthDeclarationModel()
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

  // [POST] /health_declaration
  async store(req, res, next) {
    try {
      const data = await getHealthDeclarationModel()
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

  //[PUT] /health_declaration
  async update(req, res, next) {
    try {
      const data = await getHealthDeclarationModel()
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
      const data = await getHealthDeclarationModel().deleteMany({
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

export default new HealthDeclarationController()
