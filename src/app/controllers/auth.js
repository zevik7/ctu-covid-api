import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { ObjectId } from 'mongodb'
import getUserModel from '#models/User.js'
import auth from '#config/auth.config.js '

class LoginController {
  //[POST] /admin/auth/login
  async login(req, res, next) {
    try {
      const { username, password } = req.body
      const user = await getUserModel().findOne({ username })

      if (!user)
        return res.error({
          status: 'error',
          message: 'Tên đăng nhập hoặc mật khẩu không đúng',
        })

      const validPass = await bcrypt.compare(password, user.password)

      if (!validPass)
        return res.status(404).json({
          status: 'error',
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

      res.success({
        data: { ...user, token },
      })
    } catch (err) {
      return res.error({
        errors: err,
      })
    }
  }
}

export default new LoginController()
