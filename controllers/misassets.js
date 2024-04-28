const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Campground = require('../models/campground');
const Department = require('../models/department');
const Misasset = require('../models/misasset');



module.exports.getMisasset = async (req, res) => {
    const misassets = await Misasset.find({}).populate('department')
   .populate({
      path: 'department',
      populate: { path: 'campground' }
    });
    res.render('misassets/index', { misassets })
}

module.exports.createMisasset = async (req, res) => {
    const department = await Department.findById(req.params.id);
    const misasset= new Misasset(req.body.department);
    misasset.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    misasset.author = req.user._id;
    department.misassets.push(misasset);
    await misasset.save();
    await department.save();
    req.flash('success', 'Added new Mis Asset');
    res.redirect(`/departments/${department._id}`);
}







module.exports.deleteMisasset = async (req, res) => {
    const { id, misassetId } = req.params;
    await Department.findByIdAndUpdate(id, { $pull: { misassets: misassetId } });
    await Misasset.findByIdAndDelete(misassetId);
    req.flash('success', 'You deleted this Mis asset')
    res.redirect(`/departments/${id}`);
}