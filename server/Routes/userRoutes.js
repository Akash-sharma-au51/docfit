const express = require('express');
const {registerUser,loginUser,logoutUser} = require('../controllers/userController')
const router = express.Router();
const authourizeUser = require('../middlewares/auth')

router.post('/register',registerUser);
router.post('/login',loginUser);
router.get('/logout',authourizeUser,logoutUser);

module.exports = router;
