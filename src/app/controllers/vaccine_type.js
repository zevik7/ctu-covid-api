import getVaccineTypeModel from '#models/Vaccine_type.js'
import { ObjectId } from 'mongodb'

class VaccineTypeController {
  // [GET] /user
  async index(req, res, next) {
    try {
      const currentPage = +req.query.currentPage || 1
      const perPage = +req.query.perPage || 20
      const skip = (currentPage - 1) * perPage
      const totalPage = await getVaccineTypeModel().countDocuments({})

      const data = await getVaccineTypeModel()
        .find()
        .sort()
        .skip(+skip)
        .limit(+perPage)
        .toArray()

      return res.success({
        currentPage,
        perPage,
        totalPage,
        data,
      })
    } catch (error) {
      return req.badreq(error)
    }
  }

  // [GET] /user?_id
  async show(req, res, next) {
    try {
      const data = getVaccineTypeModel()
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
      const data = await getVaccineTypeModel()
        .insertOne({
          ...req.body,
          created_at: Date.now,
          updated_at: Date.now,
          deleted: false,
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
      const data = await getVaccineTypeModel()
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
