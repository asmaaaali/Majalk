// sendResponse method as util
const sendResponse = (res, statusCode, message, result = null) => {
    return res.status(statusCode).json({
        statusCode: statusCode,
        message: message,
        result: result
    })
}

// Export sendResponse
module.exports = sendResponse;