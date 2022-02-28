export default (err, req, res, next) => {
  return res.status(500).json({
    message: 'Something failed on server',
  })
}
