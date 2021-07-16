const express = require("express");
const reviewsRoute = require("./reviewRoute");
const housesController = require("../controllers/house/housesController");
const { isHouseOwner } = require("../middlewares/authorizeRoute");
const protectRoute = require("../controllers/auth/authController").protectRoute;

const houseRouter = express.Router();

// mount review router on this url
houseRouter.use("/:house/reviews", reviewsRoute);

houseRouter
  .route("/")
  .get(housesController.getAllHouses)
  .post(protectRoute, housesController.createHouse);

houseRouter.route("/category").get(housesController.getAllCategory);
houseRouter.route("/search").get(housesController.searchHouses);
houseRouter.route("/owner").get(protectRoute, housesController.getUserHouses);

houseRouter
  .route("/trending")
  .get(housesController.aliasForTreanding, housesController.getAllHouses);

houseRouter.route("/category/all").get(housesController.getAllCategoryFull);

houseRouter
  .route("/:id")
  .get(housesController.getHouse)
  .patch(
    protectRoute,
    isHouseOwner({ admin: true }),
    housesController.updateHouse
  )
  .delete(
    protectRoute,
    isHouseOwner({ admin: true }),
    housesController.deleteHouse
  );

module.exports = houseRouter;
