const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications() {
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
 *  Get reviews by inventory ID
 * ************************** */
async function getReviewsByItemId(inventory_id) {
  try {
    const query = `
    SELECT r.review_text, 
       CONCAT(LEFT(a.account_firstname, 1), ', ', a.account_lastname) AS reviewer_full_name, 
       r.review_date 
FROM reviews r 
JOIN account a ON r.account_id = a.account_id 
WHERE r.inv_id = $1 
ORDER BY r.review_date DESC
  `;
    const result = await pool.query(query, [inventory_id]);
    return result.rows;
  } catch (error) {
    console.error('Error fetching reviews:', error);
    throw error;
  }
}

async function addReview(review_text, inv_id, account_id) {
  const sql = `
  INSERT INTO reviews (review_text, inv_id, account_id)
  VALUES ($1, $2, $3)
  RETURNING *;
  `;
  const values = [review_text, inv_id, account_id];

  try {
    const result = await pool.query(sql, values);
    return result.rows[0];
  } catch (error) {
    throw new Error('Could not add review: ' + error.message);
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

/* ***************************
 *  Update Inventory Data
 * ************************** */
async function updateInventory(
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
) {
  try {
    const sql =
      "UPDATE public.inventory SET inv_make = $1, inv_model = $2, inv_description = $3, inv_image = $4, inv_thumbnail = $5, inv_price = $6, inv_year = $7, inv_miles = $8, inv_color = $9, classification_id = $10 WHERE inv_id = $11 RETURNING *"
    const data = await pool.query(sql, [
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
      inv_id
    ])
    return data.rows[0]
  } catch (error) {
    console.error("model error: " + error)
  }
}

/* ***************************
 *  Update Inventory Data
 * ************************** */
async function deleteInventory(
  inv_id
) {
  try {
    const sql =
      "DELETE FROM inventory WHERE inv_id = $1"
    const data = await pool.query(sql, [
      inv_id
    ])
    return data
  } catch (error) {
    console.error("model error: " + error)
  }
}

module.exports = {
  getClassifications,
  getInventoryByClassificationId,
  getInventoryItemById,
  addClassification,
  addInventory,
  updateInventory,
  deleteInventory,
  getReviewsByItemId,
  addReview
};