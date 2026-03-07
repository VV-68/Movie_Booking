const express = require('express');
const router = express.Router();
const { getAdminProfile, getUserProfile } = require('../controllers/profile.controller');
const { protect } = require('../middleware/auth.middleware');
const { admin } = require('../middleware/role.middleware');

// GET /api/profile/admin => Profile info for logged in admin
router.get('/admin', protect, admin, getAdminProfile);

// GET /api/profile/user => Profile info for logged in normal user
router.get('/user', protect, getUserProfile);

module.exports = router;
