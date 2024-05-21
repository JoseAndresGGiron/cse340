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
module.exports = {
  registerAccount, checkExistingEmail
};