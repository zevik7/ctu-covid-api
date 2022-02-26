import getUserModel from '#models/User.js'
import UserRequest from '#requests/User.js'
import { ObjectId } from 'mongodb'

class UserController {
  // [GET] /user
  async index(req, res, next) {
    const currentPage = req.query.page || 1
    const perPage = 20
    const skip = (currentPage - 1) * perPage
    const totalPage = await getUserModel().countDocuments({})

    const data = await getUserModel()
      .find()
      .sort()
      .skip(skip)
      .limit(perPage)
      .toArray()

    res.success({
      currentPage,
      totalPage,
      data,
    })
  }

  // [GET] /user/:id
  show(req, res, next) {
    getUserModel()
      .findOne({
        _id: ObjectId(req.params.id),
      })
      .then((result) => {
        res.success({
          result,
        })
      })
  }

  // [POST] /user
  store(req, res, next) {
    // Validation
    const validation = UserRequest.create(req.body)

    if (validation.error)
      return res.json({
        status: 'error',
        errors: validation.error.details,
      })

    getUserModel()
      .insertOne({
        ...validation.value,
        created_at: Date.now,
        updated_at: Date.now,
        deleted: false,
      })
      .then((rs) => {
        return res.json({
          status: 'success',
          data: rs,
        })
      })
  }

  //[PUT] /user/:id
  update(req, res, next) {
    // Validation
    const validation = UserRequest.update(req.body)

    if (validation.error)
      return res.json({
        status: 'error',
        errors: validation.error.details,
      })

    getUserModel()
      .updateOne(
        {
          _id: ObjectId(req.params.id),
        },
        {
          $set: validation.value,
          $currentDate: { updated_at: true },
        }
      )
      .then((rs) => {
        res.status(200)
        res.json({
          status: 'success',
          data: rs,
        })
      })
  }

  // [DELETE] /user/:id
  destroy(req, res, next) {
    getUserModel()
      .deleteOne({ _id: req.params.id })
      .then((rs) => {
        res.json({
          status: 'success',
          data: rs,
        })
      })
  }
}

export default new UserController()
