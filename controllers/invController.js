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

    // Call the model function to retrieve reviews for the specific inventory item
    const reviews = await invModel.getReviewsByItemId(inventoryId);

    // Build HTML for the specific inventory item using utilities function
    const inventoryItemHTML = await utilities.buildInventoryItemHTML(inventoryItem);

    // Build HTML for reviews section
    const reviewsHTML = await utilities.buildReviewsHTML(reviews);

    // Determine if the user is logged in and get the account_id if available
    const accountData = res.locals.accountData;

    // Review form
    const reviewFormHTML = await utilities.buildReviewFormHTML(accountData ? accountData.account_id : null, inventoryId);

    // Get navigation links
    let nav = await utilities.getNav();

    // Render the view with the inventory item details
    res.render("./inventory/detail", {
      title: inventoryItem.inv_year + ' ' + inventoryItem.inv_make + ' ' + inventoryItem.inv_model,
      nav,
      inventoryItemHTML: inventoryItemHTML,
      reviewsHTML: reviewsHTML,
      reviewFormHTML: reviewFormHTML
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
    const classificationSelect = await utilities.buildClassificationList()
    res.render("./inventory/management", {
      title: "Inventory Management",
      nav,
      classificationSelect,
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

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

/* ***************************
 *  Build Edit inventory view
 * ************************** */
invCont.editInventoryView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()
  const itemData = await invModel.getInventoryItemById(inv_id)
  const classificationSelect = await utilities.buildClassificationList(itemData.classification_id)
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  res.render("./inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id
  })
}

/* ***************************
 *  edit updated inventory to the database
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const {
    inv_id,
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
    const updateResult = await invModel.updateInventory(
      inv_id,
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
      classification_id
    );

    if (updateResult) {
      const itemName = updateResult.inv_make + " " + updateResult.inv_model
      req.flash("Notice", `The ${itemName} was succesfully updated.`);
      res.redirect('/inv/');
    } else {
      const classificationSelect = await utilities.buildClassificationList(classification_id)
      const itemName = `${inv_make} ${inv_model}`
      req.flash("notice", "Sorry, the insert failed.")
      res.status(501).render("inventory/edit-inventory", {
        title: "Edit " + itemName,
        nav,
        classificationSelect: classificationSelect,
        errors: null,
        inv_id,
        inv_make,
        inv_model,
        inv_year,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_miles,
        inv_color,
        classification_id
      })
    }
  } catch (error) {
    console.error("Error updating inventory item:", error);
    req.flash('error', 'Failed to edit vehicle.');
    res.redirect('/inv/edit-inventory');
  }
};

/* ***************************
 *  Build Delete inventory view
 * ************************** */
invCont.deleteInventoryView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()
  const itemData = await invModel.getInventoryItemById(inv_id)
  const classificationSelect = await utilities.buildClassificationList(itemData.classification_id)
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  res.render("./inventory/delete-inventory", {
    title: "Delete " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_price: itemData.inv_price,
    classification_id: itemData.classification_id
  })
}

/* ***************************
 *  Delete inventory to the database
 * ************************** */
invCont.deleteInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_price,
    classification_id
  } = req.body;

  try {
    // Log the request body to ensure all fields are being captured
    console.log("Request body:", req.body);

    // Call the model function to delete the inventory item
    const deleteResult = await invModel.deleteInventory(
      inv_id
    );

    if (deleteResult) {
      const itemName = inv_make + " " + inv_model
      req.flash("Notice", `The ${itemName} was succesfully deleted.`);
      res.redirect('/inv/');
    } else {
      const classificationSelect = await utilities.buildClassificationList(classification_id)
      const itemName = `${inv_make} ${inv_model}`
      req.flash("notice", "Sorry, the delete failed.")
      res.status(501).render("inventory/delete-inventory", {
        title: "Edit " + itemName,
        nav,
        classificationSelect: classificationSelect,
        errors: null,
        inv_id,
        inv_make,
        inv_model,
        inv_year,
        inv_price,
        classification_id
      })
    }
  } catch (error) {
    console.error("Error deleting inventory item:", error);
    req.flash('error', 'Failed to delete vehicle.');
    res.redirect('inventory/delete-inventory');
  }
};

module.exports = invCont;