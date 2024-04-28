const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const ImageSchema = new Schema({
    url: String,
    filename: String
});

ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200');
});

const assetSchema = new Schema({
        name: {
            type: String
        },
        manufacturer: {
            type: String
        },
        country: {
            type: String
        },
        model: {
            type: String
        },
        serial: {
            type: String
        },
        idNumber: {
            type: String
        },
        mfYear: {
            type: String
        },
        installDate: {
            type: Date
        },
        supplier: {
            type: String
        },
        lastMai: {
            type: Date
        },
        nextMai: {
            type: Date
        },
        fund: {
            type: String
        },
        manual: {
            type: String
        },
        sparePart: {
            type: String
        },
        images: [ImageSchema],
        department: 
        {
            type: Schema.Types.ObjectId,
            ref: 'Department'
        },
},
{ timestamps: true }
);


const Asset = mongoose.model('Asset', assetSchema);



module.exports = Asset; 
