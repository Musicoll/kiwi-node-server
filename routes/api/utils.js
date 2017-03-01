
/**
 * Send the response formatted with a json error and an error status set
 * @param {Object} response - the http response object
 * @param {String} message - the error message
 * @param {Number} status - the error code to set
 */
module.exports.sendJsonError = (response, message = "An error occured !", status = 404) => {
  response
  .status(404)
  .json({"error" : true, "message" : message});
}
