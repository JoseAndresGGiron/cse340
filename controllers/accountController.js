// Require the utilities module
const utilities = require("../utilities");

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

// Export the buildLogin function
module.exports = { buildLogin, buildRegister };
