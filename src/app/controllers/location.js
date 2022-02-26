import getLocationModel from '#models/Location.js'
import LocationRequest from '#requests/Location.js'
import { ObjectId } from 'mongodb'

class LocationController {
  // [GET] /user
  async index(req, res, next) {
    const currentPage = req.query.page || 1
    const perPage = 20
    const skip = (currentPage - 1) * perPage
    const totalPage = await getLocationModel().countDocuments({})

    for (const key in req.query) {
      req.query[key] = new RegExp(req.query[key])
    }

    const data = await getLocationModel()
      .find(req.query)
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
    getLocationModel()
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
    const validation = LocationRequest.create(req.body)

    if (validation.error)
      return res.json({
        status: 'error',
        errors: validation.error.details,
      })

    getLocationModel()
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
    const validation = LocationRequest.update(req.body)

    if (validation.error)
      return res.json({
        status: 'error',
        errors: validation.error.details,
      })

    getLocationModel()
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
    getLocationModel()
      .deleteOne({ _id: req.params.id })
      .then((rs) => {
        res.json({
          status: 'success',
          data: rs,
        })
      })
  }
}

export default new LocationController()
