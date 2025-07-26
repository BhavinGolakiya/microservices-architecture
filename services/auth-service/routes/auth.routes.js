const express = require('express')
const router = express.Router()
const auth = require('../controllers/auth.controller')
const protect = require('../middlewares/auth.middleware')

router.post('/signup', auth.signup)
router.post('/login', auth.login)
router.post('/profile', protect, auth.createProfile)
router.get('/profiles', protect, auth.getProfiles)
router.get('/health', auth.health)
router.get('/metrics', auth.metrics)

module.exports = router;
