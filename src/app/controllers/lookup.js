import getUserModel from '#models/User.js'
import UserRequest from '#requests/User.js'
import { ObjectId } from 'mongodb'

class LookupController {
  // [GET] /lookup/user
  async user(req, res, next) {
    try {
      const user_identify = req.query.user_identify

      // Create regex for search
      const filter = {
        $or: [{ phone: user_identify }, { email: user_identify }],
        role: 'user',
      }

      const data = await getUserModel().findOne(filter)

      if (!data)
        throw {
          errors: { user_identify: 'Không tìm thấy người dùng' },
          type: 'validation',
        }

      const { name, _id } = data

      return res.success({
        data: {
          _id,
          name,
        },
      })
    } catch (error) {
      return res.badreq(error)
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

export default new LookupController()
