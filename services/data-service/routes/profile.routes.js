const express = require('express')
const router = express.Router()
const profile = require('../controllers/profile.controller')
const protect = require('../middlewares/auth.middleware')

router.post('/profile', protect, profile.createProfile)
router.get('/profiles', protect, profile.getProfiles)
router.get('/health', profile.health)

module.exports = router