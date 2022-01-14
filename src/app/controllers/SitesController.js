class SitesController {
	// [GET]
	index(req, res, next) {
		res.json('site controller');
	}
}

export default new SitesController();
