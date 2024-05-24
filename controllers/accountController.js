//w5 learning activities
const jwt = require("jsonwebtoken")
require("dotenv").config()

//W4 team activity paswword
const bcrypt = require("bcryptjs")

// Require the utilities module
const utilities = require("../utilities");
// Require the account model
const accountModel = require("../models/account-model");

/* ****************************************
 *  Deliver login view
 * *************************************** */
async function buildLogin(req, res, next) {
  // Get navigation links
  let nav = await utilities.getNav();

  // Render the login view
  res.render("account/login", {
    title: "Login",
    nav,
    errors: null,
  });
}

/* ****************************************
 *  Deliver registration view
 * *************************************** */
async function buildRegister(req, res, next) {
  // Get navigation links
  let nav = await utilities.getNav();

  // Render the registration view
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null,
  });
}

// Process Registration function
async function registerAccount(req, res) {
  // Get navigation links
  let nav = await utilities.getNav();

  // Extract registration data from request body
  const {
    account_firstname,
    account_lastname,
    account_email,
    account_password
  } = req.body;

  // Hash the password before storing - w4 team activity
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }

  // Attempt to register the account
  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    //account_password commented out as part of w4 team activity, see new variable below
    hashedPassword
  );

  // Check registration result and render appropriate view
  if (regResult) {
    console.log(regResult)
    // If registration successful, render login view with success message
    req.flash(
      "notice",
      `Congratulations, you're registered ${account_firstname}. Please log in.`
    );
    res.status(201).render("account/login", {
      title: "Login",
      nav,
      errors: null,
    });
  } else {
    // If registration failed, render registration view with error message
    req.flash("notice", "Sorry, the registration failed.");
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    });
  }
}

/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  if (!accountData) {
   req.flash("notice", "Please check your credentials and try again.")
   res.status(400).render("account/login", {
    title: "Login",
    nav,
    errors: null,
    account_email,
   })
  return
  }
  try {
   if (await bcrypt.compare(account_password, accountData.account_password)) {
   delete accountData.account_password
   const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 })
   if(process.env.NODE_ENV === 'development') {
     res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
     } else {
       res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
     }
   return res.redirect("/account/")
   }
  } catch (error) {
   return new Error('Access Forbidden')
  }
 }

// Export the buildLogin function
module.exports = {
  buildLogin,
  buildRegister,
  registerAccount,
  accountLogin
};