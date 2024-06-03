// Require the database index file
const pool = require("../database");

// Register new account function
async function registerAccount(account_firstname, account_lastname, account_email, account_password) {
  try {
    const sql = "INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *";
    const result = await pool.query(sql, [account_firstname, account_lastname, account_email, account_password]);
    return result.rowCount > 0; // Return true if at least one row was inserted
  } catch (error) {
    // Handle errors
    console.error("Error registering account:", error);
    return false; // Return false if an error occurred
  }
}

/* **********************
 *   Check for existing email
 * ********************* */
async function checkExistingEmail(account_email) {
  try {
    const sql = "SELECT * FROM account WHERE account_email = $1"
    const email = await pool.query(sql, [account_email])
    return email.rowCount
  } catch (error) {
    return error.message
  }
}

/* *****************************
 * Return account data using email address
 * ***************************** */
async function getAccountByEmail(account_email) {
  try {
    const result = await pool.query(
      'SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_email = $1',
      [account_email])
    return result.rows[0]
  } catch (error) {
    return new Error("No matching email found")
  }
}

//Return account data using the account ID
async function getAccountById(account_id) {
  try {
    const result = await pool.query(
      'SELECT account_id, account_firstname, account_lastname, account_email, account_type FROM account WHERE account_id = $1',
      [account_id]
    );
    return result.rows[0];
  } catch (error) {
    return new Error("No matching account ID found");
  }
}

// Update account information function
async function updateAccount(account_id, account_firstname, account_lastname, account_email) {
  try {
    const sql = "UPDATE account SET account_firstname = $1, account_lastname = $2, account_email = $3 WHERE account_id = $4 RETURNING *";
    const result = await pool.query(sql, [account_firstname, account_lastname, account_email, account_id]);
    return result.rowCount > 0; // Return true if at least one row was updated
  } catch (error) {
    console.error("Error updating account:", error);
    return false; // Return false if an error occurred
  }
}

// Update password function
async function updatePassword(account_id, hashedPassword) {
  try {
    const sql = "UPDATE account SET account_password = $1 WHERE account_id = $2 RETURNING *";
    const result = await pool.query(sql, [hashedPassword, account_id]);
    return result.rowCount > 0; // Return true if at least one row was updated
  } catch (error) {
    console.error("Error updating password:", error);
    return false; // Return false if an error occurred
  }
}

async function getAccountReviews(account_id) {
  try {
    const query = `
      SELECT r.review_text, 
             r.review_date,
             r.review_id,
             i.inv_make,
             i.inv_model,
             i.inv_year,
             i.inv_color
      FROM reviews r 
      JOIN inventory i ON r.inv_id = i.inv_id 
      WHERE r.account_id = $1 
      ORDER BY r.review_date DESC`;
    const result = await pool.query(query, [account_id]);
    return result.rows;
  } catch (error) {
    throw error;
  }
}

// Function to get review by review_id
async function getReviewById(review_id) {
  try {
    const query = `
          SELECT review_id, review_text, review_date
          FROM reviews
          WHERE review_id = $1
      `;
    const result = await pool.query(query, [review_id]);
    // Check if a review with the given review_id exists
    if (result.rows.length === 0) {
      return null; // Return null if review not found
    }
    return result.rows[0]; // Return the review data
  } catch (error) {
    throw error;
  }
}

// Function to update review text
async function updateReview(review_id, updatedReviewText) {
  try {
    const query = `
          UPDATE reviews
          SET review_text = $1
          WHERE review_id = $2
          RETURNING *;
      `;
    const result = await pool.query(query, [updatedReviewText, review_id]);
    return result.rowCount > 0; // Return true if at least one row was updated
  } catch (error) {
    console.error('Error updating review:', error);
    throw error;
  }
}

// Function to delete review
async function deleteReview(review_id) {
  try {
    const query = `
          DELETE FROM reviews
          WHERE review_id = $1
      `;
    const result = await pool.query(query, [review_id]);
    return result.rowCount > 0; // Return true if at least one row was deleted
  } catch (error) {
    console.error('Error deleting review:', error);
    throw error;
  }
}

module.exports = {
  registerAccount,
  checkExistingEmail,
  getAccountByEmail,
  getAccountById,
  updateAccount,
  updatePassword,
  getAccountReviews,
  getReviewById,
  updateReview,
  deleteReview
};