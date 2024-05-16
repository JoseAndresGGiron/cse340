/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
//W4 learning Activity:
const session = require("express-session")
const pool = require('./database/')

const express = require("express")
const expressLayouts = require("express-ejs-layouts")
const env = require("dotenv").config()
const app = express()
const static = require("./routes/static")
const baseController = require("./controllers/baseController") // Added require statement for baseController
const utilities = require("./utilities/"); //Adeded require statment on w3 activities so line 41 works good
//w3 inventory classification activity
const inventoryRoute = require("./routes/inventoryRoute")
//W4 Deliver Login View
const accountRoute = require("./routes/accountRoute");
// W4 Provess the Registration
const bodyParser = require("body-parser")

/* ***********************
 * Middleware
 * ************************/
app.use(session({
  store: new (require('connect-pg-simple')(session))({
    createTableIfMissing: true,
    pool,
  }),
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  name: 'sessionId',
}))

// Express Messages Middleware from W4 learning Activities
app.use(require('connect-flash')())
app.use(function(req, res, next){
  res.locals.messages = require('express-messages')(req, res)
  next()
})

//W4 Process the Registration
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

/* ***********************
 * View Engine and Templates
 *************************/
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout") // not at views root

app.use(static)

/* ***********************
 * Routes
 *************************/

// Index route
app.get("/", utilities.handleErrors(baseController.buildHome))

//w4 Deliver Account View
app.use("/account", accountRoute);

// Inventory routes - w3 classification activity
app.use("/inv", inventoryRoute)

// Trigger intentional error when '/error/trigger-error' is accessed
app.get('/error/trigger-error', (req, res, next) => {
  // Trigger intentional error here
  next(new Error('Intentional error to test error handling'));
});

// File Not Found Route - must be last route in list
app.use(async (req, res, next) => {
  next({status: 400, message: 'Sorry, we appear to have lost that page.'})
})

/* Before line looked like this:
app.get("/", function(req, res){
  res.render("index", {title: "Home"})
})
*/

/* ***********************
* Express Error Handler
* Place after all other middleware
*************************/
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav();
  console.error(`Error at: "${req.originalUrl}": ${err.message}`);

  let message = ''; // Initialize message variable
  
  // Check the status code of the error
  if (err.status === 404) {
    message = err.message; // Set message for 404 error
  } else if (err.status === 500) {
    message = err.message; // Set message for 500 error
  } else {
    message = 'Oh no! There was a crash. Maybe try a different route?'; // Default message for other errors
  }

  res.render("errors/error", {
    title: err.status || 'Server Error',
    message,
    nav
  });
});

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT
const host = process.env.HOST

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
})
