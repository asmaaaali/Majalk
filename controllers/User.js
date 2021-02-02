/*
 * This Controller includes the User Router Handlers and Business Logic
 * Here is the User Signup Controller
 * Here is the User Login Controller
*/

// Import Packages
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Import Models
const User = require('../models/User');

// Import Functions
const sendResponse = require('../utils/sendResponse');

/*
 * All User Router Handlers
*/

// Signup signup Controller
const Signup = async (req, res) => {
    try {

        // ValidatorJS

        const { firstName, lastName, email, password, country } = req.body;

        if(firstName.length < 6) {
            return sendResponse(res, 400, 'الاسم الأول يجب الأ يقل عن 6 أحرف');
        }

        if(lastName.length < 6) {
            return sendResponse(res, 400, 'الاسم الثاني يجب الأ يقل عن 6 أحرف');
        }
        
        if(!email.match(/^\w+([-+.]\w+)*@((yahoo|gmail)\.com)$/)) {
            return sendResponse(res, 400, 'البريد الإلكتروني يجب أن يكون ياهو أو جيميل');
        }

        if(password.length < 6) {
            return sendResponse(res, 400, 'الرقم السري يجب ألا يقل عن 6 أحرف');
        }

        if(!['Egypt'].includes(country)) {
            return sendResponse(res, 400, 'هذه الدولة غير موجودة');
        }

        
      
        // The User is found in the User Collection
        let founded = await User.findOne({ email: email });
        if (founded) {
            return sendResponse(res, 409, 'هذا الحساب موجود مُسبقًا');
        }

        // The User is not found in the User Collection
        let user = await new User({
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: await bcrypt.hash(password, 10),
            country: country
        }).save();

        return sendResponse(res, 201, 'تم إنشاء الحساب بنجاح', user);
    } catch (err) {
        console.log(`Error Messageg : ${err.message}`);
        return sendResponse(res, 500, err.message, 'حدث خطأ ما');
    }

}

// User Login Controller
const Login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return sendResponse(res, 400, 'الحقول إجبارية');
        }
        const user = await User.findOne({ email: email });
        if (!user) {
            return sendResponse(res, 401, 'الحساب غير موجود');
        }
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return sendResponse(res, 401, 'خطأ في كلمة السر');
        }
        const token = jwt.sign({ _id: user._id }, process.env.JWT_KEY);
        const result = { token: token, user: user };
        return sendResponse(res, 200, 'تم تسجيل الدخول بنجاح', result);
    } catch (err) {
        console.log(`Error Messageg : ${err.message}`);
        return sendResponse(res, 500, err.message, 'حدث خطأ ما');
    }
}


// Export all Account Router Handlers
module.exports = {
    Signup,
    Login
}