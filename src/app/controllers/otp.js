import getUserModel from '#models/User.js'
import getHealthDecla from '#models/Health_declaration.js'
import getInjection from '#models/Injection.js'
import getLocation from '#models/Location.js'
import getPosDecla from '#models/Positive_declaration.js'
import UserRequest from '#requests/User.js'
import { ObjectId } from 'mongodb'
import Vonage from '@vonage/server-sdk'

class OtpController {
  async get(req, res, next) {
    const { phone } = req.body

    const vonage = new Vonage({
      apiKey: '20cdd035',
      apiSecret: 'MReEZAri6N7xaiWb',
    })

    const from = 'CTU-Covid'
    const to = phone.toString().replace('0', '84')
    const code = Math.floor(Math.random() * 1001 + 1000)
    const text = 'Ma xac nhan cua ban la ' + code

    vonage.message.sendSms(from, to, text, (err, responseData) => {
      if (err) {
        console.log(err)
        return res.badreq({ status: 'error', message: 'Đã xảy ra lỗi !!!' })
      } else {
        if (responseData.messages[0]['status'] === '0') {
          console.log('Message sent successfully.')
        } else {
          console.log(
            `Message failed with error: ${responseData.messages[0]['error-text']}`
          )
        }
        console.log(responseData)
        return res.success({ status: 'success', otpCode: code })
      }
    })
  }
}

export default new OtpController()
