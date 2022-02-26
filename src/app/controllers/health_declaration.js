import getHealthDeclarationModel from '#models/Health_declaration.js'
import HealthDeclarationRequest from '#requests/Health_declaration.js'
import { ObjectId } from 'mongodb'

class HealthDeclarationController {
  // [GET] /user
  async index(req, res, next) {
    const currentPage = req.query.page || 1
    const perPage = 20
    const skip = (currentPage - 1) * perPage
    const totalPage = await getHealthDeclarationModel().countDocuments({})

    const data = await getHealthDeclarationModel()
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
    getHealthDeclarationModel()
      .findOne({
        _id: ObjectId(req.params.id),
      })
      .then((rs) => {
        res.status(200)
        res.json({
          status: 'success',
          data: rs,
        })
      })
  }

  // [POST] /user
  store(req, res, next) {
    // Validation
    const validation = HealthDeclarationRequest.create(req.body)

    if (validation.error)
      return res.json({
        status: 'error',
        errors: validation.error.details,
      })

    getHealthDeclarationModel()
      .insertOne({
        ...validation.value,
        created_at: Date.now,
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
    const validation = HealthDeclarationRequest.update(req.body)

    if (validation.error)
      return res.json({
        status: 'error',
        errors: validation.error.details,
      })

    getHealthDeclarationModel()
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
    getHealthDeclarationModel()
      .deleteOne({ _id: req.params.id })
      .then((rs) => {
        res.json({
          status: 'success',
          data: rs,
        })
      })
  }
}

export default new HealthDeclarationController()
