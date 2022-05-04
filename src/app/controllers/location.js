import getLocation from '#models/Location.js'
import getHealthDecla from '#models/Health_declaration.js'
import getUser from '#models/User.js'
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
      const count = await getLocation().countDocuments({})

      const data = await getLocation()
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
      return res.badreq(error.stack)
    }
  }

  // [GET] /location/:_id
  async show(req, res, next) {
    try {
      const result = await getLocation().findOne({
        _id: ObjectId(req.params._id),
      })

      return res.success(result)
    } catch (error) {
      return res.badreq(error.stack)
    }
  }

  // [POST] /location
  async store(req, res, next) {
    try {
      const { name, created_by_id, position } = req.body

      // Get created user
      const createdUser = await getUser().findOne(
        {
          _id: ObjectId(created_by_id),
        },
        {
          projection: { _id: 1, name: 1, email: 1 },
        }
      )

      if (!createdUser)
        throw {
          errors: {
            created_user_id:
              'Không tìm thấy người dùng, \n vui lòng tạo thông tin trước',
          },
          type: 'validation',
        }

      const result = await getLocation()
        .insertOne({
          name,
          created_by: createdUser,
          position,
          created_at: new Date(),
          updated_at: new Date(),
        })
        .then((rs) => rs)

      return res.success(result)
    } catch (error) {
      return res.badreq(error)
    }
  }

  //[PUT] /location
  async update(req, res, next) {
    try {
      const idParam = req.query._id
      const { name, position } = req.body

      // Update Ref: health_declarations
      await getHealthDecla().updateMany(
        {
          'location._id': ObjectId(idParam),
        },
        {
          $set: { location: { _id: ObjectId(idParam), name, position } },
          $currentDate: { updated_at: true },
        }
      )

      const result = await getLocation().updateOne(
        {
          _id: ObjectId(idParam),
        },
        {
          $set: {
            name,
            position,
          },
          $currentDate: { updated_at: true },
        }
      )

      return res.success(result)
    } catch (error) {
      return res.badreq(error)
    }
  }

  // [DELETE] /location?ids=[]
  async destroy(req, res, next) {
    try {
      const ids = req.query.ids.map((id, index) => ObjectId(id))

      // Delete reference collection
      await getHealthDecla().deleteMany({ 'location._id': { $in: ids } })

      const result = await getLocation().deleteMany({ _id: { $in: ids } })

      return res.success(result)
    } catch (error) {
      return res.badreq(error.stack)
    }
  }
}

export default new LocationController()
