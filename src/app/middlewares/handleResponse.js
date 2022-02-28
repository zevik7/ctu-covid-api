export default (req, res, next) => {
  /**
   * Success response
   */
  res.success = (data) => res.status(200).json(data)

  /**
   * Bad request response
   * (status 400)
   * The server could not understand the request due to invalid syntax.
   */

  res.badreq = (errors) => res.status(400).json(errors)

  /**
   * Unauthorize request response
   * (status 401)
   */

  res.unauth = (errors) => res.status(401).json(errors)

  /**
   * Forbidden request response
   * (status 403)
   * The client does not have access rights to the content; that is, it is unauthorized,
   * so the server is refusing to give the requested resource.
   * Unlike 401 Unauthorized, the client's identity is known to the server.
   */

  res.forbidden = (errors) => res.status(403).json(errors)

  /**
   * (status 500)
   * Internal request response
   */

  res.internal = (errors) => res.status(500).json(errors)

  next()
}
