import getVaccineType from '#models/Vaccine_type.js'
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
      const count = await getVaccineType().countDocuments({})

      // Create regex for search
      if (filter.searchText && filter.searchText.trim()) {
        filter.$or = [
          { title: new RegExp(filter.searchText, 'i') },
          { 'created_by.name': new RegExp(filter.searchText, 'i') },
          { 'created_by.email': new RegExp(filter.searchText, 'i') },
        ]
      }
      delete filter.searchText

      const data = await getVaccineType()
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

  // [GET] /vaccine_type/:_id
  async show(req, res, next) {
    try {
      const result = await getVaccineType()
        .findOne({
          _id: ObjectId(req.params.id),
        })
        .then((rs) => rs)
      return res.success(result)
    } catch (error) {
      return res.badreq(error.stack)
    }
  }

  // [POST] /vaccine_type
  async store(req, res, next) {
    try {
      const vaccineType = req.body

      const result = await getVaccineType()
        .insertOne({
          ...vaccineType,
          created_at: new Date(),
          updated_at: new Date(),
        })
        .then((rs) => rs)

      return res.success(result)
    } catch (error) {
      return res.badreq(error)
    }
  }

  //[PUT] /vaccine_type
  async update(req, res, next) {
    try {
      const idObj = ObjectId(req.query._id)
      const vaccine_type = req.body

      // Update Ref collection: health_declarations
      await getInjection().updateMany(
        {
          'vaccine_type._id': idObj,
        },
        {
          $set: { vaccine_type: { _id: idObj, ...vaccine_type } },
          $currentDate: { updated_at: true },
        }
      )

      const result = await getVaccineType()
        .updateOne(
          {
            _id: idObj,
          },
          {
            $set: vaccine_type,
            $currentDate: { updated_at: true },
          }
        )
        .then((rs) => rs)

      return res.success(result)
    } catch (error) {
      return res.badreq(error)
    }
  }

  // [DELETE] /vaccine_type?ids=[]
  async destroy(req, res, next) {
    try {
      const ids = req.query.ids.map((id, index) => ObjectId(id))

      await getInjection().deleteMany({ 'vaccine_type._id': { $in: ids } })

      const result = await getVaccineType().deleteMany({ _id: { $in: ids } })

      return res.success(result)
    } catch (error) {
      return res.badreq(error.stack)
    }
  }
}

export default new VaccineTypeController()
