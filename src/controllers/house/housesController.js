const House = require('../../models/houseModel');
const User = require('../../models/userModel');
const controller = require('../generalController');
const catchAsync = require('../../utils/catchAsyncError');
const { sendResponse } = require('../../utils/successResponse');
const AppError = require('../../utils/appError');

//async route handler methods
exports.getAllHouses = controller.getAll(House);
exports.getHouse = controller.getOne(House, { path: 'reviews', limit: 5 });
exports.createHouse = controller.createOne(House);
exports.deleteHouse = controller.deleteOne(House);
exports.updateHouse = controller.updateOne(House);

exports.aliasForTreanding = (req, resp, next) => {
    req.query.limit = '4';
    req.query.page = '1';
    req.query.sort = '-ratingQuantity';
    req.query.fields = 'title,price,image, ratingQuantity, averageRating, totalLikes';
    next();
};

exports.getAllCategory = catchAsync(async (req, res, next) => {

    const houseCategory = await House.aggregate([
        {
            $group: {
                _id: { $toUpper: '$category' },
                itemCount: { $sum: 1 },
                houses: { $push: { id: '$_id', name: '$title' } },
            },
        },
    ]);

    sendResponse(200, houseCategory, res);
});
