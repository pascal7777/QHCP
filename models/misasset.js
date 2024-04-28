const mongoose = require('mongoose');
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

const misassetSchema = new Schema(
    {


        name: {
            type: String
        },
        manufacturer: {
            type: String
        },
        model: {
            type: String
        },
        cost: {
            type: String
        },
        url: {
            type: String
        },
        quantity: {
            type: Number
        },
        images: [ImageSchema],
        department: 
        {
            type: Schema.Types.ObjectId,
            ref: 'Department'
        },

},
opts
);


misassetSchema.post("findOneAndDelete", async function (doc) {
    if (doc) {
      await Review.deleteMany({
        _id: {
          $in: doc.reviews,
        },
      });
    }
  });

const Misasset = mongoose.model('Misasset', misassetSchema);
module.exports = Misasset; 
