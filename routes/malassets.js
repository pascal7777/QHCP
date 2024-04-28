const express = require('express');
const router = express.Router({ mergeParams: true });
const {isLoggedIn, isDepartmentAuthor } = require('../middleware');
const Campground = require('../models/campground');
const Department = require('../models/department');
const Malasset = require('../models/malasset');
const campgrounds = require('../controllers/campgrounds');
const departments = require('../controllers/departments');
const malassets = require('../controllers/malassets');
const ExpressError = require('../utils/ExpressError');
const catchAsync = require('../utils/catchAsync');



router.route('/')
    .get(catchAsync(malassets.getMalasset))



    router.get('/:id', isLoggedIn, catchAsync(async (req, res,) => {   
        const {id} =req.params;  
        const malasset = await Malasset.findById(id).populate('campground').populate ('author').populate ('editor');
        if (!malasset) {
            req.flash('error', 'This mal asset was deleted');
            return res.redirect('/malassets');
        }
        res.render('malassets/show', { malasset });
    }));
    
    
    
    
    router.delete('/:malassetId', isLoggedIn, catchAsync(malassets.deleteMalasset))
    
    
    module.exports = router;