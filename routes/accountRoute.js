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

// Process the login attempt
router.post(
    //added this on the below line to complete team activity: regValidate.loginRules(), regValidate.checkLoginData,
    "/login", regValidate.loginRules(), regValidate.checkLoginData, Util.handleErrors(accountController.accountLogin)
)

// Process the Logout attempt
router.get("/logout", (req, res) => {
    res.clearCookie("jwt");
    req.flash("notice", "You have successfully logged out.");
    res.redirect("/");
});

// Route for "/account/register"
router.get("/register", Util.handleErrors(accountController.buildRegister));

//POST register account Route
router.post('/register', regValidate.registationRules(), regValidate.checkRegData, Util.handleErrors(accountController.registerAccount))

//Defatul account Route
router.get("/", Util.checkLogin, Util.handleErrors(accountController.buildAccountManagement));

// Route to update account information
router.get("/update/:account_id", Util.checkLogin, Util.handleErrors(accountController.buildUpdateAccount));

// POST route to handle account update form submission
router.post("/update", Util.checkLogin, regValidate.updateAccountRules(), regValidate.checkUpdateAccountData, Util.handleErrors(accountController.updateAccount));

// POST route to handle password change form submission
router.post("/change-password", Util.checkLogin, regValidate.changePasswordRules(), regValidate.checkPasswordChangeData, Util.handleErrors(accountController.changePassword));

// Route to display the update review view
router.get('/review-update/:review_id', accountController.showUpdateReview);

// Route to handle updating a review
router.post('/review-update/:review_id', accountController.updateReview);

// Route to display the delete review confirmation view
router.get('/review-delete/:review_id', accountController.showDeleteReview);

// Route to handle deleting a review
router.post('/review-delete/:review_id', accountController.deleteReview);


module.exports = router;