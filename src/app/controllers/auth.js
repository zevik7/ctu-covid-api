import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { ObjectId } from 'mongodb'
import getUserModel from '#models/User.js'
import auth from '#config/auth.config.js '
import AuthRequest from '#requests/Auth.js'

class LoginController {
  //[POST] /admin/auth/login
  async login(req, res, next) {
    try {
      const validation = AuthRequest.login(req.body)

      if (validation.error) return res.badreq(validation.error.details)

      const { username, password } = validation.value
      const user = await getUserModel().findOne({ username })

      if (!user)
        return res.badreq({
          message: 'Tên đăng nhập hoặc mật khẩu không đúng',
        })

      const validPass = await bcrypt.compare(password, user.password)

      if (!validPass)
        return res.badreq({
          message: 'Tên đăng nhập hoặc mật khẩu không đúng',
        })

      const token = jwt.sign(
        {
          id: user.id,
          username: user.username,
        },
        process.env.JWT_ACCESS_KEY,
        {
          expiresIn: '365d',
        }
      )

      delete user.password

      return res.success({ ...user, token })
    } catch (err) {
      return res.internal({
        message: 'Something failed on server',
      })
    }
  }
}

export default new LoginController()
