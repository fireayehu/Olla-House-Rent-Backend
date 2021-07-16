const { Schema, model, SchemaTypes } = require("mongoose");

const houseSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "House needs to have title"],
    },
    description: {
      type: String,
      required: [true, "house needs to have description"],
    },
    price: {
      type: Number,
      required: [true, "House needs to have price"],
    },
    postedBy: {
      type: SchemaTypes.ObjectId,
      ref: "User",
      required: [true, "House needs to have postedBy user id"],
    },
    postDate: {
      type: Date,
      default: Date.now(),
    },
    imageCover: {
      type: String,
      required: [true, "House should have a cover image"],
    },
    images: [String],
    isSold: {
      type: Boolean,
      default: false,
    },
    category: {
      type: String,
      required: [true, "House should have category"],
    },
    location: {
      //geo json location
      type: {
        type: String,
        default: "Point",
        enum: ["Point"],
      },
      coordinates: [Number],
      address: String,
    },
    averageRating: {
      type: Number,
      default: 2.5,
      required: false,
      min: [1, "House rating can only be between 1 and 5 value!"],
      max: [5, "House rating can only be between 1 and 5 value!"],
      set: (val) => Math.round(val * 10) / 10,
    },
    ratingQuantity: {
      type: Number,
      default: 0,
    },
    totalLike: {
      type: Number,
      default: 0,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// index averageRating for faster query
houseSchema.index({ averageRating: 1, price: -1 });

//populate reviews on product fetch
houseSchema.virtual("reviews", {
  ref: "Review",
  foreignField: "house",
  localField: "_id",
});

// fetch associated users on house query
houseSchema.pre(/^find/, function (next) {
  this.populate({
    path: "postedBy",
    select: "firstname lastname email phone soldItems avatar",
  });

  next();
});

const House = model("House", houseSchema);

module.exports = House;
