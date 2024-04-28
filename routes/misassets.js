const express = require('express');
const router = express.Router({ mergeParams: true });
const {isLoggedIn, isDepartmentAuthor } = require('../middleware');
const Campground = require('../models/campground');
const Department = require('../models/department');
const Misasset = require('../models/misasset');
const campgrounds = require('../controllers/campgrounds');
const departments = require('../controllers/departments');
const misassets = require('../controllers/misassets');
const ExpressError = require('../utils/ExpressError');
const catchAsync = require('../utils/catchAsync');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });
const { cloudinary } = require("../cloudinary");


router.route('/')
    .get(catchAsync(misassets.getMisasset))
    .post(isLoggedIn, catchAsync(misassets.createMisasset))


    router.get('/:id', isLoggedIn, catchAsync(async (req, res,) => {   
        const {id} =req.params;  
        const misasset = await Misasset.findById(id).populate('campground').populate ('author').populate ('editor');
        if (!misasset) {
            req.flash('error', 'This mis asset was deleted');
            return res.redirect('/misassets');
        }
        res.render('misassets/show', { misasset });
    }));
    
    
    
    
    router.delete('/:misassetId', isLoggedIn, catchAsync(misassets.deleteMisasset))
    
    
    module.exports = router;