
/**
 * Send the response formatted with a json error and an error status set
 * @param {Object} response - the http response object
 * @param {String} message - the error message
 * @param {Number} status - the error code to set
 */
module.exports.sendJsonError = (response, message, status) => {
  response
  .status(status)
  .json({"error" : true, "message" : message});
}
