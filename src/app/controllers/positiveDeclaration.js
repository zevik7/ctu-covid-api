import dateFormat from 'dateformat'
import getPositiveDeclaration from '#models/Positive_declaration.js'
import getUser from '#models/User.js'
import { ObjectId } from 'mongodb'

class PositiveDeclarationController {
  async generalStat(req, res, next) {
    try {
      const dateCount = req.query.dateCount || 7

      const total = await getPositiveDeclaration().countDocuments({})
      const total_recovered = await getPositiveDeclaration().countDocuments({
        end_date: { $ne: null },
      })
      const total_serious_case = await getPositiveDeclaration().countDocuments({
        severe_symptoms: true,
      })

      let stat = {
        total,
        total_recovered,
        total_serious_case,
        by_date: {
          dates: [],
          positive_case: [],
          serious_case: [],
          recovered_case: [],
        },
      }

      for (let i = 0; i < dateCount; i++) {
        const date = new Date()
        date.setDate(date.getDate() - i)
        stat.by_date.dates.unshift(dateFormat(date, 'yyyy-mm-dd'))
      }

      const positiveCase = await getPositiveDeclaration()
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
              _id: { $in: stat.by_date.dates },
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

      const seriousCase = await getPositiveDeclaration()
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
              _id: { $in: stat.by_date.dates },
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

      const recoveredCase = await getPositiveDeclaration()
        .aggregate([
          {
            $match: {
              end_date: { $ne: null },
            },
          },
          {
            $group: {
              _id: {
                $dateToString: { format: '%Y-%m-%d', date: '$end_date' },
              },
              total: { $sum: 1 },
            },
          },
          {
            $match: {
              _id: { $in: stat.by_date.dates },
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

      for (let i = 0; i < stat.by_date.dates.length; i++) {
        const date = stat.by_date.dates[i]

        stat.by_date.positive_case.push(
          positiveCase.find((pos) => pos._id === date)?.total || 0
        )
        stat.by_date.serious_case.push(
          seriousCase.find((ser) => ser._id === date)?.total || 0
        )
        stat.by_date.recovered_case.push(
          recoveredCase.find((rec) => rec._id === date)?.total || 0
        )
      }

      return res.success({
        ...stat,
      })
    } catch (error) {
      return res.badreq(error.stack)
    }
  }

  // [GET] /positive_declarations
  async index(req, res, next) {
    try {
      let { currentPage, perPage, ...filter } = req.query
      // Convert to number
      currentPage = +currentPage || 1
      perPage = +perPage || 0

      // Calculation pagination
      const skip = (currentPage - 1) * perPage

      if (filter['user._id']) {
        filter['user._id'] = ObjectId(filter['user._id'])
      }

      if (filter.searchText && filter.searchText.trim()) {
        filter.$or = [
          { 'user.name': new RegExp(filter.searchText, 'i') },
          { 'user.phone': new RegExp(filter.searchText, 'i') },
          { 'user.email': new RegExp(filter.searchText, 'i') },
          { 'user.address': new RegExp(filter.searchText, 'i') },
        ]
      }
      delete filter.searchText

      const data = await getPositiveDeclaration()
        .find(filter)
        .sort()
        .skip(skip)
        .limit(perPage)
        .toArray()

      const count = await getPositiveDeclaration().countDocuments(filter)

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

  // [GET] /positive_declaration?_id
  async show(req, res, next) {
    try {
      const result = await getPositiveDeclaration()
        .findOne({
          _id: ObjectId(req.params.id),
        })
        .then((rs) => rs)
      return res.success(result)
    } catch (error) {
      return res.badreq(error.stack)
    }
  }

  // [POST] /positive_declaration
  async store(req, res, next) {
    try {
      const { user_id, user_identity, location, severe_symptoms, start_date } =
        req.body

      const user = await getUser().findOne(
        {
          $or: [
            { _id: ObjectId(user_id) },
            { phone: user_identity },
            { email: user_identity },
          ],
        },
        {
          projection: { _id: 1, name: 1, phone: 1, email: 1, address: 1 },
        }
      )

      if (!user)
        throw {
          errors: {
            user_identity:
              'Không tìm thấy người dùng, \n vui lòng tạo thông tin trước',
          },
          type: 'validation',
        }

      // Exist positive declare without end_date
      let checkExist = await getPositiveDeclaration().findOne({
        'user._id': user._id,
        end_date: null,
      })

      if (checkExist)
        throw {
          errors: {
            exist_record:
              'Đã tồn tại khai báo, nếu bạn bị mắc covid lần nữa, ' +
              'vui lòng khai báo "Đã khỏi" cho lần trước và thực hiện lại',
          },
          type: 'validation',
        }

      let positiveDecla = {
        user,
        location,
        severe_symptoms,
        start_date: new Date(start_date),
        created_at: new Date(),
        end_date: null,
      }

      if (!positiveDecla.location.name)
        positiveDecla.location.name = user.address

      const result = await getPositiveDeclaration().insertOne(positiveDecla)

      return res.success(result)
    } catch (error) {
      return res.badreq(error.stack)
    }
  }

  //[PUT] /positive_declaration
  async update(req, res, next) {
    try {
      const { user_identity, end_date } = req.body

      const user = await getUser().findOne(
        {
          $or: [{ phone: user_identity }, { email: user_identity }],
        },
        {
          projection: { _id: 1, name: 1, phone: 1, email: 1, address: 1 },
        }
      )

      if (!user)
        throw {
          errors: {
            user_identity: 'Không tìm thấy người dùng',
          },
          type: 'validation',
        }

      let checkExist = await getPositiveDeclaration().findOne(
        {
          'user._id': user._id,
          end_date: null,
        },
        {
          projection: { _id: 1 },
        }
      )

      if (!checkExist)
        throw {
          errors: {
            exist_record: 'Bạn chưa khao báo thông tin ca nhiễm',
          },
          type: 'validation',
        }

      // Throw an error if end_date < start_date
      let dateErr = await getPositiveDeclaration().findOne({
        'user._id': user._id,
        start_date: { $gt: new Date(end_date) },
        end_date: null,
      })

      if (dateErr)
        throw {
          errors: {
            end_date:
              'Ngày khỏi bệnh không thể bé hơn hoặc trùng ngày bắt đầu mắc bệnh',
          },
          type: 'validation',
        }

      const result = await getPositiveDeclaration()
        .updateOne(
          {
            _id: checkExist._id,
          },
          {
            $set: {
              end_date: new Date(end_date),
            },
            $currentDate: { updated_at: true },
          }
        )
        .then((rs) => rs)

      return res.success(result)
    } catch (error) {
      return res.badreq(error)
    }
  }

  // [DELETE] /positive_declaration?ids=[]
  async destroy(req, res, next) {
    try {
      const ids = req.query.ids.map((id) => ObjectId(id))

      // Delete reference collection
      const result = await getPositiveDeclaration().deleteMany({
        _id: { $in: ids },
      })

      return res.success(result)
    } catch (error) {
      return res.badreq(error)
    }
  }
}

export default new PositiveDeclarationController()
