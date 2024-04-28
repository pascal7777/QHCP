const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');

const Campground = require('../models/campground');
const Department = require('../models/department');



module.exports.getDepartment = async (req, res) => {
    const departments = await Department.find({}).populate('campground').populate('asset').populate('malasset').populate('misasset');
    res.render('departments/index', { departments })
}




module.exports.createDepartment = async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const department = new Department(req.body.department);
    department.author = req.user._id;
    campground.departments.push(department);
    await department.save();
    await campground.save();
    req.flash('success', 'Added new Department!');
    res.redirect(`/campgrounds/${campground._id}`);
}







module.exports.deleteDepartment = async (req, res) => {
    const { id, departmentId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { departments: departmentId } });
    await Department.findByIdAndDelete(departmentId);
    req.flash('success', 'You deleted this department')
    res.redirect(`/campgrounds/${id}`);
}



