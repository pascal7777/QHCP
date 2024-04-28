const express = require('express');
const router = express.Router({ mergeParams: true });
const {isLoggedIn, isDepartmentAuthor } = require('../middleware');
const Campground = require('../models/campground');
const Department = require('../models/department');
const Asset = require('../models/asset');
const campgrounds = require('../controllers/campgrounds');
const departments = require('../controllers/departments');
const assets = require('../controllers/assets');
const ExpressError = require('../utils/ExpressError');
const catchAsync = require('../utils/catchAsync');



router.route('/')
    .get(catchAsync(assets.getAsset))



    router.get('/:id', isLoggedIn, catchAsync(async (req, res,) => {   
        const {id} =req.params;  
        const asset = await Asset.findById(id).populate('campground').populate ('author').populate ('editor');
        if (!asset) {
            req.flash('error', 'This asset was deleted');
            return res.redirect('/assets');
        }
        res.render('assets/show', { asset });
    }));
    
    
    
    
    router.delete('/:assetId', isLoggedIn, catchAsync(assets.deleteAsset))
    
    
    module.exports = router;