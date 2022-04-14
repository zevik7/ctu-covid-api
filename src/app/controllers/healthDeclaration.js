import { ObjectId } from 'mongodb'
import dateFormat from 'dateformat'
import getHealthDeclaration from '#models/Health_declaration.js'
import getLocation from '#models/Location.js'
import getUser from '#models/User.js'
import morgan from 'morgan'

class HealthDeclarationController {
  async generalStat(req, res, next) {
    try {
      let { dateCount, location } = req.query
      let filter = {}
      // From 30 days ago
      dateCount = dateCount || 30

      if (location) filter['location._id'] = ObjectId(location)

      const total = await getHealthDeclaration().countDocuments(filter)

      let stat = {
        total,
        dates: [],
        count_by_timestamp: [],
      }

      for (let i = 0; i < dateCount; i++) {
        const date = new Date()
        date.setDate(date.getDate() - i)
        stat.dates.unshift(dateFormat(date, 'yyyy-mm-dd'))
      }

      const count = await getHealthDeclaration()
        .aggregate([
          { $match: filter },
          {
            $group: {
              _id: {
                $dateToString: { format: '%Y-%m-%d', date: '$created_at' },
              },
              total: { $sum: 1 },
            },
          },
          {
            $match: {
              _id: { $in: stat.dates },
            },
          },
          {
            $sort: {
              _id: 1,
            },
          },
          { $limit: dateCount },
        ])
        .toArray()

      for (let i = 0; i < stat.dates.length; i++) {
        const date = stat.dates[i]

        stat.count_by_timestamp.push([
          date,
          count.find((rec) => rec._id === date)?.total || 0,
        ])
      }

      return res.success({
        ...stat,
      })
    } catch (error) {
      return res.badreq(error.stack)
    }
  }

  // [GET] /health_declaration
  async index(req, res, next) {
    try {
      let { currentPage, perPage, ...filter } = req.query
      // Convert to number
      currentPage = +currentPage || 1
      perPage = +perPage || 0

      // Calculation pagination
      const skip = (currentPage - 1) * perPage

      // Filters
      if (filter['created_at_between']) {
        const { start, end } = JSON.parse(filter.created_at_between)
        filter.created_at = { $gte: new Date(start), $lte: new Date(end) }
        delete filter.created_at_between
      }
      if (filter['location._id']) {
        filter['location._id'] = ObjectId(filter['location._id'])
      }
      if (filter['user._id']) {
        filter['user._id'] = ObjectId(filter['user._id'])
      }

      // Create regex for search
      if (filter.searchText && filter.searchText.trim()) {
        filter.$or = [
          { 'user.name': new RegExp(filter.searchText, 'i') },
          { 'user.phone': new RegExp(filter.searchText, 'i') },
          { 'user.email': new RegExp(filter.searchText, 'i') },
          { 'user.address': new RegExp(filter.searchText, 'i') },
          { 'location.name': new RegExp(filter.searchText, 'i') },
        ]
      }
      delete filter.searchText

      const count = await getHealthDeclaration().countDocuments(filter)

      const data = await getHealthDeclaration()
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

  // [GET] /health_declaration?_id
  async show(req, res, next) {
    try {
      const result = await getHealthDeclaration()
        .findOne({
          _id: ObjectId(req.params.id),
        })
        .then((rs) => rs)
      return res.success(result)
    } catch (error) {
      return res.badreq(error.stack)
    }
  }

  // [POST] /health_declaration
  async store(req, res, next) {
    try {
      const { user_indentity, location_id, status } = req.body

      // Get location
      const location = await getLocation().findOne(
        {
          _id: ObjectId(location_id),
        },
        {
          projection: { _id: 1, name: 1, position: 1 },
        }
      )

      if (!location)
        throw {
          errors: {
            location: 'Không tìm thấy địa điểm',
          },
          type: 'validation',
        }

      // Get user
      const user = await getUser().findOne(
        {
          $or: [{ phone: user_indentity }, { email: user_indentity }],
        },
        {
          projection: { _id: 1, name: 1, phone: 1, email: 1, address: 1 },
        }
      )

      if (!user)
        throw {
          errors: {
            user_indentity: 'Không tìm thấy người dùng',
          },
          type: 'validation',
        }

      const result = await getHealthDeclaration()
        .insertOne({
          user,
          location,
          status,
          created_at: new Date(),
          updated_at: new Date(),
        })
        .then((rs) => rs)

      return res.success(result)
    } catch (error) {
      return res.badreq(error)
    }
  }

  //[PUT] /health_declaration
  async update(req, res, next) {
    try {
      const data = await getHealthDeclaration()
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

      // Delete reference collections
      const data = await getHealthDeclaration().deleteMany({
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
