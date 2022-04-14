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
      const total_user = await getUser().countDocuments({})

      return res.success({
        total: firstTime,
        total_user,
        by_time: {
          labels: ['Mũi 1', 'Mũi 2', 'Mũi 3'],
          data: [firstTime, secondTime, thirdTime],
        },
      })
    } catch (error) {
      return res.badreq(error)
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

      if (filter.hasOwnProperty('user._id')) {
        filter['user._id'] = ObjectId(filter['user._id'])
      }

      // Create regex for search
      if (filter.searchText && filter.searchText.trim()) {
        let regex = new RegExp(filter.searchText, 'i')
        filter.$or = [
          { 'user.name': regex },
          { 'user.phone': regex },
          { 'user.email': regex },
          { 'user.address': regex },
          { 'vaccine_type.name': regex },
          { injection_date: regex },
        ]
      }
      delete filter.searchText

      const count = await getInjection().countDocuments(filter)

      const data = await getInjection()
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

  // [GET] /injection?_id
  async show(req, res, next) {
    try {
      const result = await getInjection()
        .findOne({
          _id: ObjectId(req.params._id),
        })
        .then((rs) => rs)
      return res.success(result)
    } catch (error) {
      return res.badreq(error)
    }
  }

  // [POST] /injection
  async store(req, res, next) {
    try {
      const reqData = req.body
      const { user_id, user_identity, vaccine_type_id, injection_date } =
        reqData
      const userFilter = {
        $or: [
          { _id: ObjectId(user_id) },
          { phone: user_identity },
          { email: user_identity },
        ],
      }
      // Get ref document
      const user = await getUser().findOne(userFilter, {
        projection: { _id: 1, name: 1, phone: 1, email: 1, address: 1 },
      })

      if (!user)
        throw {
          errors: {
            user_identity:
              'Không tìm thấy người dùng, \n vui lòng tạo thông tin trước',
          },
          type: 'validation',
        }

      const vaccine_type = await getVaccineType().findOne(
        {
          _id: ObjectId(vaccine_type_id),
        },
        {
          projection: { _id: 1, name: 1 },
        }
      )

      if (!vaccine_type)
        throw {
          errors: {
            vaccine_type:
              'Không tìm thấy loại vắc-xin, vui lòng tạo thông tin trước',
          },
          type: 'validation',
        }

      const injection = {
        user,
        vaccine_type,
        injection_date: new Date(injection_date),
      }

      if (req?.files?.images)
        injection.images = req.files.images.map((image, index) => ({
          url: '/injection/' + image.filename,
        }))
      else
        injection.images = [
          {
            url: '/images/injection_proof.jpg',
            desc: 'none',
          },
          {
            url: '/images/injection_proof.jpg',
            desc: 'none',
          },
        ]

      // Count time
      let currentTime = await getInjection().countDocuments(userFilter)

      injection.time = currentTime + 1

      const result = await getInjection()
        .insertOne({
          ...injection,
          created_at: new Date(),
          updated_at: new Date(),
        })
        .then((rs) => rs)

      return res.success(result)
    } catch (error) {
      return res.badreq(error)
    }
  }

  //[PUT] /injection
  async update(req, res, next) {
    try {
      const { vaccine_type_id, injection_date } = req.body

      const vaccine_type = await getVaccineType().findOne(
        {
          _id: ObjectId(vaccine_type_id),
        },
        {
          projection: { _id: 1, name: 1 },
        }
      )

      if (!vaccine_type)
        throw {
          errors: {
            vaccine_type:
              'Không tìm thấy loại vắc-xin, vui lòng tạo thông tin trước',
          },
          type: 'validation',
        }

      let injection = {
        vaccine_type,
        injection_date: new Date(injection_date),
      }

      if (req.files && req.files.images)
        injection.images = req.files.images.map((image, index) => ({
          url: '/injection/' + image.filename,
        }))
      else
        injection.images = [
          {
            url: '/images/injection_proof.jpg',
            desc: 'none',
          },
          {
            url: '/images/injection_proof.jpg',
            desc: 'none',
          },
        ]

      const result = await getInjection().updateOne(
        {
          _id: ObjectId(req.query._id),
        },
        {
          $set: injection,
          $currentDate: { updated_at: true },
        }
      )

      return res.success(result)
    } catch (error) {
      return res.badreq(error)
    }
  }

  // [DELETE] /injection?ids=[]
  async destroy(req, res, next) {
    try {
      const ids = req.query.ids.map((id, index) => ObjectId(id))
      const result = await getInjection().deleteMany({ _id: { $in: ids } })

      return res.success(result)
    } catch (error) {
      return res.badreq(error)
    }
  }
}

export default new InjectionController()
