import getUserModel from '#models/User.js'
import getHealthDecla from '#models/Health_declaration.js'
import getInjection from '#models/Injection.js'
import getLocation from '#models/Location.js'
import getPosDecla from '#models/Positive_declaration.js'
import UserRequest from '#requests/User.js'
import { ObjectId } from 'mongodb'
import bcrypt from 'bcryptjs'

class UserController {
  // [GET] /admin/:_id
  async show(req, res, next) {
    try {
      const result = await getUserModel().findOne(
        {
          _id: ObjectId(req.params._id),
        },
        {
          projection: { username: 0, password: 0 },
        }
      )

      return res.success(result)
    } catch (error) {
      return res.badreq(error)
    }
  }

  //[PUT] /admin
  async update(req, res, next) {
    try {
      const admin = req.body
      const idParam = req.query._id

      if (req.files && req.files.avatar)
        admin.avatar = '/admin/' + req.files.avatar[0].filename

      // Unique email and phone for admin
      const checkEmail = UserRequest.checkUniqueField(
        { email: admin.email, role: { $ne: 'user' } },
        idParam
      )
      const checkPhone = UserRequest.checkUniqueField(
        { phone: admin.phone, role: { $ne: 'user' } },
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
      // For created_by field for location colllection
      await getLocation().updateMany(
        {
          'created_by._id': ObjectId(idParam),
        },
        {
          $set: { created_by: admin },
          $currentDate: { updated_at: true },
        }
      )

      const result = await getUserModel().findOneAndUpdate(
        {
          _id: ObjectId(idParam),
        },
        {
          $set: { _id: ObjectId(idParam), ...admin },
          $currentDate: { updated_at: true },
        },
        { returnDocument: 'after' },
        {
          projection: { username: 0, password: 0 },
        }
      )

      return res.success(result)
    } catch (error) {
      return res.badreq(error)
    }
  }

  //[PUT] /user
  async updatePass(req, res, next) {
    try {
      const { password, newPassword } = req.body
      const idParam = req.query._id

      // Check correct password
      const user = await getUserModel().findOne({
        _id: ObjectId(idParam),
      })

      const validPass = await bcrypt.compare(password, user.password)

      if (!validPass)
        throw {
          errors: {
            password: 'Mật khẩu cũ không đúng',
          },
          type: 'unmatch',
        }

      const data = await getUserModel().findOneAndUpdate(
        {
          _id: ObjectId(idParam),
        },
        {
          $set: { password: bcrypt.hashSync(newPassword) },
          $currentDate: { updated_at: true },
        }
      )

      return res.success({ data })
    } catch (error) {
      return res.badreq(error)
    }
  }
}

export default new UserController()
