const User = require('../../models/userModel');
const AppError = require('../../utils/appError');
const catchAsync = require('../../utils/catchAsyncError');
const { signJwtToken } = require('../../utils/processJWT');
const { sendResponse, sendResponseWithToken } = require('../../utils/successResponse');
const constroller = require('../generalController');

const filterBody = (reqBody, ...allowedFields) => {
    let newReqBody = {};
    Object.keys(reqBody).forEach(el => {
        if (allowedFields.includes(el)) {
            newReqBody[el] = reqBody[el];
        }
    });
    return newReqBody;
}

// user operations
exports.getMe = (req, res, next) => {
    req.params.id = req.user.id;
    next();
};

exports.updateMyPassword = catchAsync(async (req, res, next) => {
    const { currentPassword, newPassword } = req.body;
    const user = req.user;
    if (!currentPassword || !newPassword) return next(new AppError("The current and new password is required!", 401));
    if (currentPassword === newPassword) return next(new AppError("Password is same! please choose different password", 401));
    console.log(currentPassword)
    if (!(await user.comparePassword(currentPassword, req.user.password))) return next(new AppError("old password is wrong!", 401));

    user.password = newPassword;
    await user.save();

    const newToken = await signJwtToken({ id: user.id, name: `${user.firstname} ${user.lastname}` });
    req.user.password = undefined
    sendResponseWithToken(200, req.user, res, newToken);
});

exports.updateMe = catchAsync(async (req, res, next) => {
    const filtedFields = filterBody(req.body, 'firstname', 'lastname', 'phone', 'email');
    await User.findByIdAndUpdate(req.user.id, filtedFields, { new: true, runValidators: true });

    req.user.password = undefined
    sendResponse(200, null, res);
});

exports.deleteMe = catchAsync(async (req, res, next) => {
    const { password } = req.body;

    if (!password) return next(new AppError("Password is required for this operation!", 401))
    if (!(await req.user.comparePassword(password.toString(), req.user.password))) return next(new AppError("Password is wrong!", 401));
    await User.findByIdAndUpdate(req.user.id, { active: false });

    sendResponse(204, null, res);
});






// admin operations

// dont try to update user password through this
exports.updateUser = constroller.updateOne(User);
exports.getAllUsers = constroller.getAll(User);
exports.getUser = constroller.getOne(User);
exports.deleteUser = constroller.deleteOne(User);

