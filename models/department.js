const mongoose = require('mongoose');
const { Schema } = mongoose;


const departmentSchema = new Schema({
        deptName: {
            type: String
        },
        room: {
            type: Number
        },
        campground: 
        {
            type: Schema.Types.ObjectId,
            ref: 'Campground'
        },
        assets: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Asset'
            }
        ],
        malassets: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Malasset'
            }
        ],
        misassets: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Misasset'
            }
        ],
        author: {
            type: Schema.Types.ObjectId,
            ref: 'User'
          },
},
{ timestamps: true }
);




const Department = mongoose.model('Department', departmentSchema);
module.exports = Department; 






