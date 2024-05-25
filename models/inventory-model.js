const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

//w3 classification data until the end of funtion getInventoryByClassificationId(classification_id)
/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
      [classification_id]
    )
    return data.rows
  } catch (error) {
    console.error("getclassificationsbyid error " + error)
  }
}

/* ***************************
 *  Get inventory item details by ID
 * ************************** */
async function getInventoryItemById(inventory_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory WHERE inv_id = $1`,
      [inventory_id]
    );
    return data.rows[0];
  } catch (error) {
    console.error("getInventoryItemById error:" + error);
    throw error;
  }
}

/* ***************************
 *  Add new classification
 * ************************** */
async function addClassification(classification_name) {
  try {
    const sql = "INSERT INTO classification (classification_name) VALUES ($1) RETURNING classification_id"
    const result = await pool.query(sql, [classification_name])
    return result.rows[0].classification_id
  } catch (error) {
    console.error("addClassification error: " + error)
    throw error
  }
}

/* ***************************
 *  Add new inventory item
 * ************************** */
async function addInventory(inv_make, inv_model, inv_year, classification_id, inv_price, inv_image, inv_thumbnail, inv_description, inv_miles, inv_color) {
  const sql = `INSERT INTO inventory (inv_make, inv_model, inv_year, classification_id, inv_price, inv_image, inv_thumbnail, inv_description, inv_miles, inv_color) 
               VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING inv_id`;

  const params = [inv_make, inv_model, inv_year, classification_id, inv_price, inv_image, inv_thumbnail, inv_description, inv_miles, inv_color];

  try {
    // Log the query and parameters to debug any issues
    console.log("Executing query:", sql);
    console.log("With parameters:", params);

    const result = await pool.query(sql, params);
    return result.rows[0].inv_id;
  } catch (error) {
    console.error("addInventory error:", error);
    throw error;
  }
}


module.exports = { getClassifications, getInventoryByClassificationId, getInventoryItemById, addClassification, addInventory };