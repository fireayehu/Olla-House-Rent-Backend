const AppError = require('../utils/appError');
const Review = require('../models/reviewModel');
const House = require('../models/houseModel');
const { isAdmin } = require('../utils/checkUserRole');

exports.restrictRole = (...roles) => {
    return (req, res, next) => {

        if (req.user.email === 'se.nabek.abebe@gmail.com') {
            req.user.role = 'admin';
        }
        if (!roles.includes(req.user.role)) {
            return next(
                new AppError("You don't have permission to perform this action!", 403)
            );
        }
        next();
    };
};

exports.isHouseOwner = (access) => {
    return async (req, res, next) => {
        const houseId = req.params.id;
        const house = await House.findById(houseId).select('isSold _id postedBy');
        let isAllowed = req.user.id.valueOf() == house.postedBy.valueOf() ? true : false;
        let isAdminRole = isAdmin(req.user) && (access && access.admin);
        if (!(isAllowed || isAdminRole))  //and if not already sold
            next(
                new AppError("You don't have permission to modify this documnet!", 403)
            );
        next();
    };
};

exports.isReviewOwner = (access) => {
    return (req, res, next) => {
        const ReviewId = req.params.id;
        const review = Review.findById(ReviewId).select('user');
        let isAdminRole = isAdmin(req.user) && (access && access.admin);
        let isAllowed = req.user.id.valueOf() === review.user.valueOf();
        if (!(isAllowed || isAdminRole))  //and if not already sold
            next(
                new AppError("You don't have permission to modify this Review!", 403)
            );
        next();
    };
};

