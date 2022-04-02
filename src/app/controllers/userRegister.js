import getUserModel from '#models/User.js'
import UserRequest from '#requests/User.js'
import { ObjectId } from 'mongodb'

class UserRegister {
  // [POST] /userPofile
  async store(req, res, next) {
    try {
      let user = req.body
      let role = 'user'

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
          created_at: new Date(),
          updated_at: new Date(),
        })
        .then((rs) => rs)

      return res.success({
        data: data,
      })
    } catch (error) {
      return res.badreq(error)
    }
  }
}

export default new UserRegister()
