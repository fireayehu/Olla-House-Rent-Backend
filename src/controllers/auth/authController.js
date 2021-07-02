const User = require('../../models/userModel');
const { signJwtToken, verifyJwtToken } = require('../../utils/processJWT');
const { sendResponse, sendResponseWithToken } = require('../../utils/successResponse');
const catchAsync = require('../../utils/catchAsyncError');
const AppError = require('../../utils/appError');
const { isAdmin } = require('../../utils/checkUserRole');

exports.login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email }, '+password').select(['-__v']);


    if (!user) next(new AppError("Wrong credentials", 404));
    if (!(await user.comparePassword(password, user.password))) return next(new AppError("Wrong credentials", 400));

    const token = await signJwtToken({
        id: user.id, name: `${user.firstname} ${user.lastname}`
    });
    user.password = undefined
    sendResponseWithToken(200, user, res, token);

});

exports.register = catchAsync(async (req, res, next) => {
    const { firstname, lastname, email, phone, password } = req.body;

    if (await User.findOne({ email })) return next(new AppError("Email already in use", 400));

    const newUser = await User.create({ firstname, lastname, email, phone, password });
    newUser.password = undefined
    newUser.__v = undefined
    sendResponse(200, newUser, res);
});


exports.protectRoute = catchAsync(async (req, res, next) => {
    let tokenString = '';

    if (req.headers.authorization) {
        tokenArray = req.header('authorization').split(' ');
        tokenString = tokenArray[0] === 'Bearer' ? tokenArray[1] : null;
    } else if (req.cookies && req.cookies.jwt) {
        tokenString = req.cookies.jwt;
    } else {
        return next(new AppError('Unauthorized! please sign in first!', 401));
    }

    if (!tokenString) return next(new AppError('Unauthorized! please sign in first!', 401));

    const decodedToken = await verifyJwtToken(tokenString);
    const userExist = await User.findById(decodedToken.id).select(['+password', '-__v', '+active']);

    if (!userExist)
        return next(
            new AppError('User no longer exist! please sign in again!', 401)
        );

    if (userExist.checkPasswordChange(decodedToken.iat))
        return next(
            new AppError('User recently changed password! please sign in again!', 401)
        );
    //check and assign role
    if (isAdmin(userExist)) {
        userExist.role = 'admin'
    } else if (userExist.role == 'admin') {
        return next(
            new AppError('Bad request! This user is not an admin', 401)
        );
    }
    req.user = userExist;
    next();
});