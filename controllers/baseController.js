const utilities = require("../utilities/")
const baseController = {}

baseController.buildHome = async function(req, res){
  const nav = await utilities.getNav()
  //The below line was added and commented out as part of w4 learning activitites. The "notice" adds a class to the flash messages, I can write css rules usint these classes.
  //req.flash("notice", "This is a flash message.")
  res.render("index", {title: "Home", nav})
}

module.exports = baseController