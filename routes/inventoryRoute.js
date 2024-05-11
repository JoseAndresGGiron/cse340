// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")

// Route to build inventory by classification view W3 - Inventory Delivery By Classification Activity
router.get("/type/:classificationId", invController.buildByClassificationId);

//Route to build single view of a specific inventory item
router.get("/detail/:inventoryId", invController.viewInventoryItemDetails);

module.exports = router;