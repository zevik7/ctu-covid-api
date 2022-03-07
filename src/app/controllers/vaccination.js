import getVaccination from '#models/Vaccination.js'
import { ObjectId } from 'mongodb'

class VaccinationController {
  // [GET] /vaccination
  async index(req, res, next) {
    try {
      const currentPage = +req.query.currentPage || 1
      const perPage = +req.query.perPage || 20
      const skip = (currentPage - 1) * perPage
      const totalPage = await getVaccination().countDocuments({})

      const data = await getVaccination()
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

  // [GET] /vaccination?_id
  async show(req, res, next) {
    try {
      const data = getVaccination()
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

  // [POST] /vaccination
  async store(req, res, next) {
    try {
      const data = await getVaccination()
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

  //[PUT] /vaccination
  async update(req, res, next) {
    try {
      const data = await getVaccination()
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

  // [DELETE] /vaccination?ids=[]
  async destroy(req, res, next) {
    try {
      const ids = req.query.ids.map((id, index) => ObjectId(id))
      const data = await getVaccination().deleteMany({ _id: { $in: ids } })

      return res.success({
        data,
      })
    } catch (error) {
      return res.badreq(error)
    }
  }
}

export default new VaccinationController()
