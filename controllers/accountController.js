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

// Export the buildLogin function
module.exports = { buildLogin };
