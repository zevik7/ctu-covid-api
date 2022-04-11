import getLocationModel from '#models/Location.js'
import getHealthDecla from '#models/Health_declaration.js'
import { ObjectId } from 'mongodb'

class LocationController {
  // [GET] /location
  async index(req, res, next) {
    try {
      let { currentPage, perPage, ...filter } = req.query
      // Convert to number
      currentPage = +currentPage || 1
      perPage = +perPage || 0

      // Calculation pagination
      const skip = (currentPage - 1) * perPage
      const count = await getLocationModel().countDocuments({})

      const data = await getLocationModel()
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

  // [GET] /location/:_id
  async show(req, res, next) {
    try {
      const data = await getLocationModel()
        .findOne({
          _id: ObjectId(req.params._id),
        })
        .then((rs) => rs)

      return res.success({
        data,
      })
    } catch (error) {
      return res.badreq(error)
    }
  }

  // [POST] /location
  async store(req, res, next) {
    try {
      const data = await getLocationModel()
        .insertOne({
          ...req.body,
          created_at: new Date(),
          updated_at: new Date(),
        })
        .then((rs) => rs)

      return res.success({
        data: data,
      })
    } catch (error) {
      return res.badreq(error)
    }
  }

  //[PUT] /location
  async update(req, res, next) {
    try {
      const idParam = req.query._id
      const location = req.body
      // Update Ref: health_declarations
      const updateOption = [
        {
          'location._id': ObjectId(idParam),
        },
        {
          $set: { location: { _id: ObjectId(idParam), ...location } },
          $currentDate: { updated_at: true },
        },
      ]
      await getHealthDecla().updateMany(...updateOption)

      const data = await getLocationModel()
        .updateOne(
          {
            _id: ObjectId(idParam),
          },
          {
            $set: location,
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

  // [DELETE] /location?ids=[]
  async destroy(req, res, next) {
    try {
      const ids = req.query.ids.map((id, index) => ObjectId(id))

      await getHealthDecla().deleteMany({ 'location._id': { $in: ids } })

      const data = await getLocationModel().deleteMany({ _id: { $in: ids } })

      return res.success({
        data,
      })
    } catch (error) {
      return res.badreq(error)
    }
  }
}

export default new LocationController()
