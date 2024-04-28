const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');

const Campground = require('../models/campground');
const Department = require('../models/department');
const Asset = require('../models/asset');


module.exports.getAsset = async (req, res) => {
    const assets = await Asset.find({}).populate('department')
   .populate({
      path: 'department',
      // Get friends of friends - populate the 'friends' array for every friend
      populate: { path: 'campground' }
    });
    res.render('assets/index', { assets })
}

module.exports.createAsset = async (req, res) => {
    const department = await Department.findById(req.params.id);
    const asset= new Asset(req.body.department);
    asset.author = req.user._id;
    department.assets.push(asset);
    await asset.save();
    await department.save();
    req.flash('success', 'Added new Asset');
    res.redirect(`/departments/${department._id}`);
}







module.exports.deleteAsset = async (req, res) => {
    const { id, assetId } = req.params;
    await Department.findByIdAndUpdate(id, { $pull: { assets: assetId } });
    await Asset.findByIdAndDelete(assetId);
    req.flash('success', 'You deleted this asset')
    res.redirect(`/departments/${id}`);
}

