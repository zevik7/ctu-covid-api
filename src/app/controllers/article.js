import getArticle from '#models/Article.js'
import getUser from '#models/User.js'
import { ObjectId } from 'mongodb'

class ArticleController {
  // [GET] /article
  async index(req, res, next) {
    try {
      let { currentPage, perPage, ...filter } = req.query
      // Convert to number
      currentPage = +currentPage || 1
      perPage = +perPage || 0

      // Calculation pagination
      const skip = (currentPage - 1) * perPage

      if (filter.hasOwnProperty('user._id')) {
        filter['user._id'] = ObjectId(filter['user._id'])
      }

      // Create regex for search
      if (filter.searchText && filter.searchText.trim()) {
        let regex = new RegExp(filter.searchText, 'i')
        filter.$or = [
          { 'created_by.name': regex },
          { 'created_by.email': regex },
          { title: regex },
        ]
      }
      delete filter.searchText

      console.log(filter)

      const count = await getArticle().countDocuments(filter)

      const data = await getArticle()
        .find(filter)
        .sort({ pinned: -1 })
        .skip(skip)
        .limit(perPage)
        .toArray()

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

  // [GET] /article?_id
  async show(req, res, next) {
    try {
      const data = await getArticle()
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

  // [POST] /article
  async store(req, res, next) {
    try {
      // Get user
      const { created_by_id, title, content, pinned } = req.body

      const created_by = await getUser().findOne(
        { _id: ObjectId(created_by_id) },
        {
          projection: { _id: 1, name: 1, email: 1 },
        }
      )

      const data = await getArticle()
        .insertOne({
          created_by,
          title,
          content,
          pinned,
          created_at: Date.now(),
          updated_at: Date.now(),
        })
        .then((rs) => rs)

      return res.success({
        data: data,
      })
    } catch (error) {
      return res.badreq(error)
    }
  }

  //[PUT] /article
  async update(req, res, next) {
    try {
      const article = req.body

      const data = await getArticle()
        .updateOne(
          {
            _id: ObjectId(req.query._id),
          },
          {
            $set: article,
            $currentDate: { updated_at: true },
          }
        )
        .then((rs) => rs)

      return res.success({
        data,
      })
    } catch (error) {
      return res.badreq(error)
    }
  }

  // [DELETE] /injection?ids=[]
  async destroy(req, res, next) {
    try {
      const ids = req.query.ids.map((id, index) => ObjectId(id))
      const data = await getArticle().deleteMany({ _id: { $in: ids } })

      return res.success({
        data,
      })
    } catch (error) {
      return res.badreq(error)
    }
  }
}

export default new ArticleController()
