const User = require('../models/userModel');
const catchAsyncError = require('../utils/catchAsyncError');



exports.getAllUsers = catchAsyncError((req, res) => {
    res.send("this is all users route");
})
