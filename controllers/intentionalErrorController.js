//w3 assignment task 3
// Controller function to handle intentional error route
const triggerError = (req, res, next) => {
    // This intentionally throws an error to simulate a 500-type error
    throw new Error('Intentional error triggered');
};

module.exports = {
    triggerError,
};