import dateFormat from 'dateformat'
import getPositiveDeclarationModel from '#models/Positive_declaration.js'
import getLocation from '#models/Location.js'
import getUser from '#models/User.js'
import { ObjectId } from 'mongodb'

class PositiveDeclarationController {
  async statByDates(req, res, next) {
    try {
      const dateCount = req.query.dateCount || 7
      let stat = {
        dates: [],
        positive_case: [],
        serious_case: [],
      }

      for (let i = 0; i < dateCount; i++) {
        const date = new Date()
        date.setDate(date.getDate() - i)
        stat.dates.unshift(dateFormat(date, 'yyyy-mm-dd'))
      }

      const positiveCase = await getPositiveDeclarationModel()
        .aggregate([
          {
            $group: {
              _id: {
                $dateToString: { format: '%Y-%m-%d', date: '$start_date' },
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

      const seriousCase = await getPositiveDeclarationModel()
        .aggregate([
          {
            $match: {
              severe_symptoms: true,
            },
          },
          {
            $group: {
              _id: {
                $dateToString: { format: '%Y-%m-%d', date: '$start_date' },
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

        stat.positive_case.push(
          positiveCase.find((pos) => pos._id === date)?.total || 0
        )
        stat.serious_case.push(
          seriousCase.find((ser) => ser._id === date)?.total || 0
        )
      }

      return res.success({
        ...stat,
      })
    } catch (error) {
      return res.badreq(error.stack)
    }
  }
  // [GET] /positive_declaration
  async index(req, res, next) {
    try {
      let { currentPage, perPage, ...filter } = req.query
      // Convert to number
      currentPage = +currentPage || 1
      perPage = +perPage || 0

      // Calculation pagination
      const skip = (currentPage - 1) * perPage
      const count = await getPositiveDeclarationModel().countDocuments({})

      // Filters
      if (filter) {
        if (filter.hasOwnProperty('created_at_between')) {
          const { start, end } = JSON.parse(filter.created_at_between)
          filter.created_at = { $gte: new Date(start), $lte: new Date(end) }
          delete filter.created_at_between
        }
        if (filter.hasOwnProperty('location._id')) {
          filter['location._id'] = ObjectId(filter['location._id'])
        }
        if (filter.hasOwnProperty('user._id')) {
          filter['user._id'] = ObjectId(filter['user._id'])
        }
      }

      const data = await getPositiveDeclarationModel()
        .find(filter)
        .sort()
        .skip(skip)
        .limit(100)
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

  // [GET] /positive_declaration?_id
  async show(req, res, next) {
    try {
      const data = await getPositiveDeclarationModel()
        .findOne({
          _id: ObjectId(req.params.id),
        })
        .then((rs) => rs)
      return res.success({
        data,
      })
    } catch (error) {
      return res.badreq(error.stack)
    }
  }

  // [POST] /positive_declaration
  async store(req, res, next) {
    try {
      // Get user
      // const user = await getUser().findOne(
      //   {
      //     $or: [
      //       { phone: req.body.user_indentity },
      //       { email: req.body.user_indentity },
      //     ],
      //   },
      //   {
      //     projection: { _id: 1, name: 1, phone: 1, email: 1, address: 1 },
      //   }
      // )

      // if (!user)
      //   throw {
      //     errors: {
      //       user_indentity: 'Không tìm thấy người dùng',
      //     },
      //     type: 'validation',
      //   }

      console.log(req.body)

      const data = {}

      // const data = await getPositiveDeclarationModel()
      //   .insertOne({
      //     user: { ...user },
      //     location: { ...location },
      //     severe_symptoms: req.body.severe_symptoms,
      //     start_date: req.body.start_date,
      //     end_date: null,
      //     created_at: new Date(),
      //   })
      //   .then((rs) => rs)

      return res.success({
        data: data,
      })
    } catch (error) {
      return res.badreq(error)
    }
  }

  //[PUT] /positive_declaration
  async update(req, res, next) {
    try {
      const data = await getPositiveDeclarationModel()
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

  // [DELETE] /positive_declaration?ids=[]
  async destroy(req, res, next) {
    try {
      const ids = req.query.ids.map((id, index) => ObjectId(id))
      const data = await getPositiveDeclarationModel().deleteMany({
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

export default new PositiveDeclarationController()
