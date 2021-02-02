const jwt = require('jsonwebtoken');
const sendResponse = require('../utils/sendResponse');
module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        req.user = decoded;
    } catch(err) {
        return sendResponse(res, 401, 'التوكين خطأ', 'حدث خطأ في المصادقة');
    }
    next();
}