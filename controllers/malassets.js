const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');

const Campground = require('../models/campground');
const Department = require('../models/department');
const Malasset = require('../models/malasset');


module.exports.getMalasset = async (req, res) => {
    const malassets = await Malasset.find({}).populate('department')
   .populate({
      path: 'department',
      // Get friends of friends - populate the 'friends' array for every friend
      populate: { path: 'campground' }
    });
    res.render('malassets/index', { malassets })
}

module.exports.createMalasset = async (req, res) => {
    const department = await Department.findById(req.params.id);
    const malasset= new Malasset(req.body.department);
    malasset.author = req.user._id;
    department.malassets.push(malasset);
    await malasset.save();
    await department.save();
    req.flash('success', 'Added new Mal Asset');
    res.redirect(`/departments/${department._id}`);
}







module.exports.deleteMalasset = async (req, res) => {
    const { id, malassetId } = req.params;
    await Department.findByIdAndUpdate(id, { $pull: { malassets: malassetId } });
    await Malasset.findByIdAndDelete(malassetId);
    req.flash('success', 'You deleted this mal asset')
    res.redirect(`/departments/${id}`);
}

