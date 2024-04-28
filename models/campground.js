const mongoose = require("mongoose");
const Review = require("./review");
const Department = require("./department");
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
  url: String,
  filename: String,
});

ImageSchema.virtual("thumbnail").get(function () {
return this.url.replace("/upload", "/upload/w_200");
});
ImageSchema.virtual('cardImage').get(function() {
return this.url.replace('/upload', '/upload/ar_4:3,c_crop'); })

const opts = { toJSON: { virtuals: true }, timestamps: true };

const campgroundSchema = new Schema(
  {
    name: String,
    images: [ImageSchema],
    geometry: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    province: String,
    district: String,
    facility_type: String,
    bed_size: Number,
    hf_code: String,
    opd: Number,
    em: Number,
    ipdadmis: Number,
    ipdlos: Number,
    surgmin: Number,
    surgmaj: Number,
    referral: Number,
    location: String,
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    departments: [
      {
          type: Schema.Types.ObjectId,
          ref: "Department",
      },
  ],
    reviews: [
      {
        type: Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
  },
  opts
);

campgroundSchema.virtual("properties.popUpMarkup").get(function () {
  return `
    <strong><a href="/campgrounds/${this._id}">${this.name}</a><strong>
    <p>${this.facility_type.substring(0, 20)}...</p>`;
});

campgroundSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await Review.deleteMany({
      _id: {
        $in: doc.reviews,
      },
    });
  }
});

module.exports = mongoose.model("Campground", campgroundSchema);
