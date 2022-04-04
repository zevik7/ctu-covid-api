import getVaccineTypeModel from '#models/Vaccine_type.js'
import getInjection from '#models/Injection.js'
import { ObjectId } from 'mongodb'

class VaccineTypeController {
  // [GET] /vaccine_type
  async index(req, res, next) {
    try {
      let { currentPage, perPage, ...filter } = req.query
      // Convert to number
      currentPage = +currentPage || 1
      perPage = +perPage || 0

      // Calculation pagination
      const skip = (currentPage - 1) * perPage
      const count = await getVaccineTypeModel().countDocuments({})

      const data = await getVaccineTypeModel()
        .find()
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

  // [GET] /vaccine_type?_id
  async show(req, res, next) {
    try {
      const data = await getVaccineTypeModel()
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

  // [POST] /vaccine_type
  async store(req, res, next) {
    try {
      const data = await getVaccineTypeModel()
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

  //[PUT] /vaccine_type
  async update(req, res, next) {
    try {
      const idObj = ObjectId(req.query._id)
      const vaccine_type = req.body

      // Update Ref: health_declarations
      const updateOption = [
        {
          'vaccine_type._id': idObj,
        },
        {
          $set: { vaccine_type: { _id: idObj, ...vaccine_type } },
          $currentDate: { updated_at: true },
        },
      ]
      await getInjection().updateMany(...updateOption)

      const data = await getVaccineTypeModel()
        .updateOne(
          {
            _id: idObj,
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
      return res.badreq(error.stack)
    }
  }

  // [DELETE] /vaccine_type?ids=[]
  async destroy(req, res, next) {
    try {
      const ids = req.query.ids.map((id, index) => ObjectId(id))
      const data = await getVaccineTypeModel().deleteMany({ _id: { $in: ids } })

      return res.success({
        data,
      })
    } catch (error) {
      return res.badreq(error)
    }
  }
}

export default new VaccineTypeController()
