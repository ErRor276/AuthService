const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');

router.post('/signup', authController.signup_post);
router.post('/login', authController.login_post);
router.get('/validate/:id', authController.validate_post);
router.post('/logout', authController.logout_post);

module.exports = router;
