export default (err, req, res, next) => {
  return res.internal({
    message: 'Something failed!',
  })
}
