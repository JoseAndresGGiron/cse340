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
  });
}

// Process Registration function
async function registerAccount(req, res) {
  // Get navigation links
  let nav = await utilities.getNav();

  // Extract registration data from request body
  const { account_firstname, account_lastname, account_email, account_password } = req.body;

  // Attempt to register the account
  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    account_password
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
    });
  } else {
    // If registration failed, render registration view with error message
    req.flash("notice", "Sorry, the registration failed.");
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
    });
  }
}

// Export the buildLogin function
module.exports = { buildLogin, buildRegister, registerAccount };
