import getUserModel from '#models/User.js'
import UserRequest from '#requests/User.js'
import { ObjectId } from 'mongodb'

class UserController {
  // [GET] /user
  async index(req, res, next) {
    try {
      let { currentPage, perPage, ...filter } = req.query
      // Convert to number
      currentPage = +currentPage || 1
      perPage = +perPage || 0

      // Calculation pagination
      const skip = (currentPage - 1) * perPage
      const count = await getUserModel().countDocuments({ role: 'user' })

      // Create regex for search
      if (filter) {
        if (filter.hasOwnProperty('search') && filter.search) {
          filter = {
            $or: [
              { name: new RegExp(filter.search, 'i') },
              { phone: new RegExp(filter.search, 'i') },
              { email: new RegExp(filter.search, 'i') },
            ],
          }
        } else {
          filter = {}
        }
      }

      filter.role = 'user'

      const data = await getUserModel()
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
      return req.badreq(error)
    }
  }

  // [GET] /user/:_id
  async show(req, res, next) {
    try {
      const data = await getUserModel()
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

  // [POST] /user
  async store(req, res, next) {
    try {
      let user = req.body
      let role = user.role || 'user'

      if (req.files && req.files.avatar)
        user.avatar = '/user/' + req.files.avatar[0].filename

      // Unique email and phone
      const checkEmail = await UserRequest.checkUniqueField({
        email: user.email,
      })
      const checkPhone = await UserRequest.checkUniqueField({
        phone: user.phone,
      })

      let uniqueMessage = {}

      if (!checkEmail) uniqueMessage.email = 'Email đã được sử dụng'
      if (!checkPhone) uniqueMessage.phone = 'Số điện thoại đã được sử dụng'

      if (Object.keys(uniqueMessage).length !== 0)
        throw {
          errors: uniqueMessage,
          type: 'validation',
        }

      const data = await getUserModel()
        .insertOne({
          ...req.body,
          role,
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

  //[PUT] /user
  async update(req, res, next) {
    try {
      let user = req.body

      if (req.files && req.files.avatar)
        user.avatar = '/user/' + req.files.avatar[0].filename

      // Unique email and phone
      // Unique email and phone
      const checkEmail = UserRequest.checkUniqueField(
        { email: user.email },
        req.query._id
      )
      const checkPhone = UserRequest.checkUniqueField(
        { phone: user.phone },
        req.query._id
      )

      let uniqueMessage = {}

      if (!checkEmail) uniqueMessage.email = 'Email đã được sử dụng'
      if (!checkPhone) uniqueMessage.phone = 'Số điện thoại đã được sử dụng'

      if (Object.keys(uniqueMessage).length !== 0)
        throw {
          errors: uniqueMessage,
          type: 'validation',
        }

      const data = await getUserModel()
        .findOneAndUpdate(
          {
            _id: ObjectId(req.query._id),
          },
          {
            $set: user,
            $currentDate: { updated_at: true },
          },
          { returnDocument: 'after' }
        )
        .then((rs) => rs)

      const { avatar, name, _id } = data.value

      return res.success({ avatar, name, _id })
    } catch (error) {
      return res.badreq(error)
    }
  }

  // [DELETE] /user?ids=[]
  async destroy(req, res, next) {
    try {
      const ids = req.query.ids.map((id, index) => ObjectId(id))
      const data = await getUserModel().deleteMany({ _id: { $in: ids } })

      return res.success({
        data,
      })
    } catch (error) {
      return res.badreq(error)
    }
  }
}

export default new UserController()
