class SitesController {
  // [GET]
  index(req, res, next) {
    res.json({
      status: 'success',
      message: 'Nothing to show here',
    })
  }
}

export default new SitesController()
