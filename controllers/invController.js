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
  try {
    // Retrieve the inventory item ID from the URL parameters
    const inventoryId = req.params.inventoryId;
    
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
    // Handle errors, perhaps by rendering an error page or redirecting
    console.error("Error fetching inventory item details:", error);
    res.status(500).send("Error fetching inventory item details");
  }
};




module.exports = invCont
