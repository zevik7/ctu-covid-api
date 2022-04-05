import getUserModel from '#models/User.js'
import getHealthDecla from '#models/Health_declaration.js'
import getInjection from '#models/Injection.js'
import getLocation from '#models/Location.js'
import getPosDecla from '#models/Positive_declaration.js'
import UserRequest from '#requests/User.js'
import { ObjectId } from 'mongodb'

class UserController {
  // [GET] /user
  async index(req, res, next) {
    try {
      let { currentPage, perPage, ...filter } = req.query
      // Convert to number
      currentPage = +currentPage || 1
      perPage = +perPage || 0 // Zero for no limit

      // Calculation pagination
      const skip = (currentPage - 1) * perPage

      // Create regex for search
      if (filter.searchText && filter.searchText.trim()) {
        filter.$or = [
          { name: new RegExp(filter.searchText, 'i') },
          { phone: new RegExp(filter.searchText, 'i') },
          { email: new RegExp(filter.searchText, 'i') },
          { address: new RegExp(filter.searchText, 'i') },
        ]
      }
      delete filter.searchText

      filter.role = 'user'

      const data = await getUserModel()
        .find(filter)
        .sort()
        .skip(skip)
        .limit(perPage)
        .toArray()

      const count = await getUserModel().countDocuments(filter)

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
      const user = req.body
      const idParam = req.query._id

      if (req.files && req.files.avatar)
        user.avatar = '/user/' + req.files.avatar[0].filename

      // Unique email and phone
      const checkEmail = UserRequest.checkUniqueField(
        { email: user.email },
        idParam
      )
      const checkPhone = UserRequest.checkUniqueField(
        { phone: user.phone },
        idParam
      )

      let uniqueMessage = {}

      if (!checkEmail) uniqueMessage.email = 'Email đã được sử dụng'
      if (!checkPhone) uniqueMessage.phone = 'Số điện thoại đã được sử dụng'

      if (Object.keys(uniqueMessage).length !== 0)
        throw {
          errors: uniqueMessage,
          type: 'validation',
        }

      // Update Ref: health_declarations, injections, locations, positive_declarations
      const updateOption = [
        {
          'user._id': ObjectId(idParam),
        },
        {
          $set: { user: { _id: ObjectId(idParam), ...user } },
          $currentDate: { updated_at: true },
        },
      ]
      await getHealthDecla().updateMany(...updateOption)
      await getInjection().updateMany(...updateOption)
      await getPosDecla().updateMany(...updateOption)
      // For created_by field for location colllection
      await getLocation().updateMany(
        {
          'created_by._id': ObjectId(idParam),
        },
        {
          $set: { created_by: user },
          $currentDate: { updated_at: true },
        }
      )

      const data = await getUserModel().findOneAndUpdate(
        {
          _id: ObjectId(idParam),
        },
        {
          $set: { _id: ObjectId(idParam), ...user },
          $currentDate: { updated_at: true },
        }
      )

      return res.success({ data })
    } catch (error) {
      return res.badreq(error.stack)
    }
  }

  // [DELETE] /user?ids=[]
  async destroy(req, res, next) {
    try {
      const ids = req.query.ids.map((id, index) => ObjectId(id))
      // Delete ref: health_declarations, injections, locations, positive_declarations
      await getHealthDecla().deleteMany({ 'user._id': { $in: ids } })
      await getInjection().deleteMany({ 'user._id': { $in: ids } })
      await getPosDecla().deleteMany({ 'user._id': { $in: ids } })
      // For created_by field for location colllection
      await getLocation().deleteMany({ 'created_by._id': { $in: ids } })

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
