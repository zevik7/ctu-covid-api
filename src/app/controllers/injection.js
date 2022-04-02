import getInjection from '#models/Injection.js'
import getVaccineType from '#models/Vaccine_type.js'
import getUser from '#models/User.js'
import { ObjectId } from 'mongodb'

class InjectionController {
  async generalStat(req, res, next) {
    try {
      const firstTime = await getInjection().countDocuments({ time: 1 })
      const secondTime = await getInjection().countDocuments({ time: 2 })
      const thirdTime = await getInjection().countDocuments({ time: 3 })

      return res.success({
        total: firstTime,
        by_time: {
          labels: ['Mũi 1', 'Mũi 2', 'Mũi 3'],
          time: [firstTime, secondTime, thirdTime],
        },
      })
    } catch (error) {
      return req.badreq(error)
    }
  }

  // [GET] /injection
  async index(req, res, next) {
    try {
      let { currentPage, perPage, ...filter } = req.query
      // Convert to number
      currentPage = +currentPage || 1
      perPage = +perPage || 0

      // Calculation pagination
      const skip = (currentPage - 1) * perPage
      const count = await getInjection().countDocuments({})

      if (filter.hasOwnProperty('user._id')) {
        filter['user._id'] = ObjectId(filter['user._id'])
      }

      const data = await getInjection()
        .find(filter)
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

  // [GET] /injection?_id
  async show(req, res, next) {
    try {
      const data = await getInjection()
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

  // [POST] /injection
  async store(req, res, next) {
    try {
      const injection = {
        user: {
          _id: ObjectId(req.body.user_id),
          name: req.body.user_name,
          phone: req.body.user_phone,
          email: req.body.user_email,
        },
        vaccine_type: {
          _id: ObjectId(req.body.vaccine_type_id),
          name: req.body.vaccine_type_name,
        },
        injection_date: req.body.injection_date,
      }

      if (req.files && req.files.images)
        injection.images = req.files.images.map((image, index) => ({
          url: '/injection/' + image.filename,
        }))

      // Count time
      let currentTime = await getInjection().countDocuments({
        'user._id': req.body.user_id,
      })

      injection.time = currentTime + 1

      const data = await getInjection()
        .insertOne({
          ...injection,
          created_at: Date.now(),
          updated_at: Date.now(),
        })
        .then((rs) => rs)

      return res.success({
        data: data,
      })
    } catch (error) {
      return res.badreq(error)
    }
  }

  //[PUT] /injection
  async update(req, res, next) {
    try {
      const vaccineType = await getVaccineType().findOne({
        _id: ObjectId(req.body.vaccine_type_id),
      })

      let injection = {
        vaccine_type: {
          _id: ObjectId(req.body.vaccine_type_id),
          name: vaccineType.name,
        },
        injection_date: req.body.injection_date,
      }

      if (req.files && req.files.images)
        injection.images = req.files.images.map((image, index) => ({
          url: '/injection/' + image.filename,
        }))

      const data = await getInjection()
        .updateOne(
          {
            _id: ObjectId(req.query._id),
          },
          {
            $set: injection,
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

  // [DELETE] /injection?ids=[]
  async destroy(req, res, next) {
    try {
      const ids = req.query.ids.map((id, index) => ObjectId(id))
      const data = await getInjection().deleteMany({ _id: { $in: ids } })

      return res.success({
        data,
      })
    } catch (error) {
      return res.badreq(error)
    }
  }
}

export default new InjectionController()
