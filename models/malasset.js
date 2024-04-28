const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const ImageSchema = new Schema({
    url: String,
    filename: String
});

ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200');
});


const malassetSchema = new Schema(
    {


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
        fund: {
            type: String
        },
        manual: {
            type: String
        },
        sparePart: {
            type: String
        },
        malSince: {
            type: Date
        },
        scrap: {
            type: String
        },
        wOrderTo: {
            type: String
        },
        wOrderWhen: {
            type: Date
        },
        images: [ImageSchema],
        department: 
        {
            type: Schema.Types.ObjectId,
            ref: 'Department'
        },

},
);


const Malasset = mongoose.model('Malasset', malassetSchema);



module.exports = Malasset; 
