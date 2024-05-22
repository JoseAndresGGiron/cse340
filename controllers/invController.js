//w3 classification data
const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

/* ***************************
 *  Controller function to view details of a specific inventory item
 * ************************** */
invCont.viewInventoryItemDetails = async function(req, res, next) {
  // Retrieve the inventory item ID from the URL parameters
  const inventoryId = req.params.inventoryId;
  
  try {
    // Call the model function to retrieve the data for the specific inventory item
    const inventoryItem = await invModel.getInventoryItemById(inventoryId);

    // Build HTML for the specific inventory item using utilities function
    const inventoryItemHTML = await utilities.buildInventoryItemHTML(inventoryItem);
    
    // Get navigation links
    let nav = await utilities.getNav();

    // Render the view with the inventory item details
    res.render("./inventory/detail", {
        title: inventoryItem.inv_year + ' ' + inventoryItem.inv_make + ' ' + inventoryItem.inv_model,
        nav,
        inventoryItemHTML: inventoryItemHTML
    });
  } catch (error) {
    // Express error handling middleware will handle the error
    next(error);
  }
};

/* ***************************
 *  Show management view
 * ************************** */
invCont.showManagementView = async function (req, res, next) {
  try {
    let nav = await utilities.getNav()
    res.render("./inventory/management", {
      title: "Inventory Management",
      nav,
      flash: req.flash('notice'),
    })
  } catch (error) {
    next(error)
  }
}

/* ***************************
 *  Build add new classification view
 * ************************** */
invCont.buildAddClassificationView = async function (req, res, next) {
  try {
    let nav = await utilities.getNav();
    res.render("./inventory/add-classification", {
      title: "Add New Classification",
      nav,
      errors: null, // You can include any initial data or errors you want to pass to the view
    });
  } catch (error) {
    next(error);
  }
};

/* ***************************
 *  Add new classification to the database
 * ************************** */
invCont.addClassification = async function (req, res, next) {
  const { classification_name } = req.body
  try {
    const result = await invModel.addClassification(classification_name)
    if (result) {
      req.flash('notice', 'New classification added successfully.')
      let nav = await utilities.getNav() // Update navigation to include the new classification
      res.render("./inventory/management", {
        title: "Inventory Management",
        nav,
        flash: req.flash('notice'),
      })
    } else {
      req.flash('notice', 'Failed to add new classification.')
      res.redirect('/inv/add-classification')
    }
  } catch (error) {
    next(error)
  }
}

module.exports = invCont
