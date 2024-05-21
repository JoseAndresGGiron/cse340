//w4 Server Side data Validation learning activities
const regValidate = require('../utilities/account-validation')


//W3 Learning Activities - Deliver Login View
// Needed Resources
const express = require("express");
const router = express.Router();
const accountController = require("../controllers/accountController");
const Util = require("../utilities");

// Route for "/account/login"
// I just added the Util.handleErrors
router.get("/login", Util.handleErrors(accountController.buildLogin));

// Route for "/account/register"
router.get("/register", Util.handleErrors(accountController.buildRegister));

//POST register account Route
router.post('/register', regValidate.registationRules(), regValidate.checkRegData, Util.handleErrors(accountController.registerAccount))

module.exports = router;