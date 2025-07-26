const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.warn(`[DataService][AuthMiddleware] Token missing or malformed`)
    return res.status(401).json({ message: 'Token missing or malformed' })
  }

  const token = authHeader.split(' ')[1]

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET?.trim())

    // attach decoded user info to request
    req.user = decoded;

    // log who and where for debugging
    console.log(`[DataService][AuthMiddleware] User ${decoded.userId} authenticated via ${process.env.HOSTNAME || 'unknown-replica'}`)

    next();
  } catch (err) {
    console.error(`[DataService][AuthMiddleware] Invalid token:`, err.message)
    return res.status(401).json({ message: 'Invalid token' })
  }
};
