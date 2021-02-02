const express = require("express");
const router = express.Router();

// Include User Controller
const { Signup, Login } = require('../controllers/User');

router.post("/signup", Signup);

router.post("/login", Login);

module.exports = router;