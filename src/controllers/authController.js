const User = require('../models/userModel');
const { signJwtToken, verifyJwtToken } = require('../utils/processJWT');
const catchAsync = require('../utils/catchAsyncError');
const AppError = require('../utils/appError');

// /**
//  * user registeration handler
//  * @param {Object} req - request object
//  * @param {Object} res - response object
//  * @param {Function} next - function to call next middleware
//  */
exports.login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email }, '+password').select(['-__v']);


    if (!user) next(new AppError("Wrong credentials", 404));
    if (!(await user.comparePassword(password, user.password))) next(new AppError("Wrong credentials", 400));

    const token = await signJwtToken({
        id: user.id, name: `${user.firstname} ${user.lastname}`
    });
    user.password = undefined
    res.send({
        token,
        user
    })

});

// /**
//  * user registeration handler
//  * @param {Object} req - request object
//  * @param {Object} res - response object
//  * @param {Function} next - function to call next middleware
//  */
exports.register = catchAsync(async (req, res, next) => {
    const { firstname, lastname, email, phone, password } = req.body;

    if (await User.findOne({ email })) next(new AppError("Email already in use", 400))

    const newUser = await User.create({ firstname, lastname, email, phone, password });
    res.status(200).send({
        status: "sucess",
        message: "registerd successfully!",
        data: newUser
    });
})
