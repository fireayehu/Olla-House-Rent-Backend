const House = require("../../models/houseModel");
const controller = require("../generalController");
const catchAsync = require("../../utils/catchAsyncError");
const { sendResponse } = require("../../utils/successResponse");
const ApiFilters = require("../../utils/apiFilters");

//async route handler methods
exports.getAllHouses = controller.getAll(House);
exports.getHouse = controller.getOne(House, { path: "reviews", limit: 5 });
exports.createHouse = controller.createOne(House);
exports.deleteHouse = controller.deleteOne(House);
exports.updateHouse = controller.updateOne(House);

exports.aliasForTreanding = (req, resp, next) => {
  req.query.limit = "10";
  req.query.page = "1";
  req.query.sort = "isSold";
  //   req.query.fields = "";
  next();
};

exports.getAllCategory = catchAsync(async (req, res, next) => {
  const houseCategory = await House.aggregate([
    {
      $group: {
        _id: { $toUpper: "$category" },
        itemCount: { $sum: 1 },
        houses: { $push: { id: "$_id", name: "$title" } },
      },
    },
  ]);

  sendResponse(200, houseCategory, res);
});

exports.getAllCategoryFull = catchAsync(async (req, res, next) => {
  let limit = req.query.limit ? req.query.limit * 1 : 6;
  if (limit > 20) limit = 20;
  if (limit < 1) limit = 1;
  const houseCategoryFull = await House.aggregate([
    {
      $group: {
        _id: { $toUpper: "$category" },
        itemCount: { $sum: 1 },
        houses: { $push: "$$ROOT" },
      },
    },
    { $project: { houses: { $slice: ["$houses", limit] } } },
  ]);
  if (!houseCategoryFull) return next(new AppError("No document found!", 404));

  sendResponse(200, houseCategoryFull, res);
});

exports.searchHouses = catchAsync(async (req, res, next) => {
  let searchQuery = req.query.q;
  let searchParam = { $regex: searchQuery, $options: "i" };

  const queryObj = { ...req.query };
  const queryExcluded = ["page", "limit", "sort", "fields", "q"];
  queryExcluded.forEach((el) => delete queryObj[el]);

  let queryStr = JSON.stringify(queryObj);
  queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

  const doc = await House.find(JSON.parse(queryStr)).or([
    { title: searchParam },
    { description: searchParam },
  ]);

  // send responce to client
  sendResponse(200, doc, res);
});

exports.getUserHouses = catchAsync(async (req, res, next) => {
  const doc = await House.find({ postedBy: req.user.id });
  if (!doc) return next(new AppError("No document found with that id!", 404));
  // send responce to client
  sendResponse(200, doc, res);
});
