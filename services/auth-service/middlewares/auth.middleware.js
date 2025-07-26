const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token missing or malformed' })
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET?.trim())

    // attach user payload to request
    req.user = decoded;

    // log which service handled the request
    console.log(`[AuthMiddleware] verified token for userId=${decoded.userId} on ${process.env.HOSTNAME || 'unknown-host'}`)

    next()
  } catch (err) {
    console.error(`[AuthMiddleware] invalid token: ${err.message}`)
    return res.status(401).json({ message: 'Invalid token' })
  }
};
