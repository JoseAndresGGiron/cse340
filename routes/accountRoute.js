//W3 Learning Activities - Deliver Login View
// Needed Resources
const express = require("express");
const router = express.Router();
const accountController = require("../controllers/accountController");

// Route for "/account/login"
router.get("/login", accountController.buildLogin);

module.exports = router;
