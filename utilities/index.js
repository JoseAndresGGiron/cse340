/*
w3 activities:
for storing functions that are not directly part of the M-V-C process. 
That is where you will build this function. Its purpose is to take an array of inventory items, 
break each item and its data out of the array and embed it into HTML. 
When done, there will be a string that will be embedded into the view.
*/
const invModel = require("../models/inventory-model")
const Util = {}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li>'
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

/* ****************************************
 * Builds HTML for displaying inventory item details
 **************************************** */
Util.buildInventoryItemHTML = async function(item) {
  let html = '<div class="inventory-item">';
  html += '<img srcset="' + item.inv_image + ' 480w, ' + item.inv_thumbnail + ' 800w"';
  html += ' sizes="(min-width: 600px) 480px, 800px"';
  html += ' src="' + item.inv_image + '"';
  html += ' alt="' + item.inv_make + ' ' + item.inv_model + '" />';  
  // Start of new div with id "descriptionPerView"
  html += '<div id="descriptionPerView">';
  html += '<h2>' + item.inv_make + ' ' + item.inv_model + ' Details' + '</h2>';
  html += '<p><strong>Price:</strong> $' + new Intl.NumberFormat('en-US').format(item.inv_price) + '</p>';
  html += '<p><strong>Description:</strong> ' + item.inv_description + '</p>';
  html += '<p><strong>Color:</strong> ' + item.inv_color + '</p>';
  html += '<p><strong>Mileage:</strong> ' + new Intl.NumberFormat('en-US').format(item.inv_miles) + '</p>';
  // End of new div
  html += '</div>';
  // Add more details as needed
  html += '</div>';
  return html;
};

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = Util