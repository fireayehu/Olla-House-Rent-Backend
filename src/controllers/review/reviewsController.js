const Review = require("../../models/reviewModel");
const controller = require("../generalController");
const catchAsync = require("../../utils/catchAsyncError");
const { sendResponse } = require("../../utils/successResponse");
const AppError = require("../../utils/appError");

//async route handler methods

exports.getAllReviews = controller.getAll(Review);
exports.getReview = controller.getOne(Review);
exports.createReview = controller.createOne(Review);
exports.updateReview = controller.updateOne(Review);
exports.deleteReview = controller.deleteOne(Review);

exports.getUserReview = catchAsync(async (req, res, next) => {
  const { userId } = req.params;
  const reviews = await Review.find({ user: userId });
  if (!reviews) next(new AppError("No document with that id", 404));
  sendResponse(200, reviews, res);
});

exports.getHouseReview = catchAsync(async (req, res, next) => {
  const { houseId } = req.params;
  const review = await Review.find({ house: houseId });

  if (!review) next(new AppError("No document with that id", 404));
  sendResponse(200, review, res);
});

exports.setProductAndUserId = (req, res, next) => {
  if (!req.body.house) req.body.house = req.params.house;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};
