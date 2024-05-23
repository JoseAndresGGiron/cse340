///w3 classification data
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
invCont.viewInventoryItemDetails = async function (req, res, next) {
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
}

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
}

/* ***************************
 *  Add new classification to the database
 * ************************** */
invCont.addClassification = async function (req, res, next) {
  const {
    classification_name
  } = req.body
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

/* ***************************
 *  Build add new inventory view
 * ************************** */
// Controller function to render the add inventory view
invCont.buildAddInventory = async function (req, res, next) {
  try {
    // Retrieve classifications to populate the dropdown list
    const classificationList = await utilities.buildClassificationList(); // Call the utility function
    let nav = await utilities.getNav(); // Retrieve navigation links
    res.render("./inventory/add-inventory", {
      title: "Add New Vehicle",
      nav, // Pass the navigation links to the view
      classificationList: classificationList, // Pass the classification list to the view
      errors: req.flash('error'), // Flash errors if any
    });
  } catch (error) {
    next(error);
  }
}

/* ***************************
 *  Add new inventory to the database
 * ************************** */
invCont.addItemtoInventory = async function (req, res, next) {
  const {
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body;

  try {
    // Log the request body to ensure all fields are being captured
    console.log("Request body:", req.body);

    // Call the model function to add the inventory item
    const result = await invModel.addInventory(
      inv_make,
      inv_model,
      inv_year,
      classification_id,
      inv_price,
      inv_image,
      inv_thumbnail,
      inv_description,
      inv_miles,
      inv_color
    );

    if (result) {
      req.flash('Success', 'Vehicle added successfully.');
      res.redirect('/inv/');
    } else {
      req.flash('error', 'Failed to add vehicle.');
      res.redirect('/inv/add-inventory');
    }
  } catch (error) {
    console.error("Error adding inventory item:", error);
    req.flash('error', 'Failed to add vehicle.');
    res.redirect('/inv/add-inventory');
  }
};

module.exports = invCont;