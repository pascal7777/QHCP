const express = require('express');
const router = express.Router({ mergeParams: true });
const {isLoggedIn, isDepartmentAuthor } = require('../middleware');
const Campground = require('../models/campground');
const Department = require('../models/department');
const Asset = require('../models/asset');
const Malasset = require('../models/malasset');
const Misasset = require('../models/misasset');
const campgrounds = require('../controllers/campgrounds');
const departments = require('../controllers/departments');
const assets = require('../controllers/assets');
const ExpressError = require('../utils/ExpressError');
const catchAsync = require('../utils/catchAsync');



router.route('/')
    .get(catchAsync(departments.getDepartment))


    router.get('/:id/assets/new', isLoggedIn, catchAsync(async (req,res) => {
        const {id} = req.params;
        const department = await Department.findById(id).populate('campground').populate ('author').populate ('editor');
        res.render('assets/new',{department})
    }));
    
    router.get('/:id/malassets/new', isLoggedIn, catchAsync(async (req,res) => {
        const {id} = req.params;
        const department = await Department.findById(id).populate('campground').populate ('author').populate ('editor');
        res.render('malassets/new',{department})
    }));

    router.get('/:id/misassets/new', isLoggedIn, catchAsync(async (req,res) => {
        const {id} = req.params;
        const department = await Department.findById(id).populate('campground').populate ('author').populate ('editor');
        res.render('misassets/new',{department})
    }));

    
    router.post('/:id/assets/', isLoggedIn, catchAsync(async(req,res) => {
        const { id } = req.params;
        const department = await Department.findById(id);
        const asset = new Asset (req.body.asset);
        department.assets.push(asset);
        asset.department = department;
        asset.author = req.user._id;
        asset.editor = req.user._id;
        await department.save();
        await asset.save();
        console.log (asset)
        res.redirect(`/departments/${id}`)
    }))
    
    router.post('/:id/malassets/', isLoggedIn, catchAsync(async(req,res) => {
        const { id } = req.params;
        const department = await Department.findById(id);
        const malasset = new Malasset (req.body.malasset);
        department.malassets.push(malasset);
        malasset.department = department;
        malasset.author = req.user._id;
        malasset.editor = req.user._id;
        await department.save();
        await malasset.save();
        console.log (malasset)
        res.redirect(`/departments/${id}`)
    }))
    
    router.post('/:id/misassets/', isLoggedIn, catchAsync(async(req,res) => {
        const { id } = req.params;
        const department = await Department.findById(id);
        const misasset = new Misasset (req.body.misasset);
        department.misassets.push(misasset);
        misasset.department = department;
        misasset.author = req.user._id;
        misasset.editor = req.user._id;
        await department.save();
        await misasset.save();
        console.log (misasset)
        res.redirect(`/departments/${id}`)
    }))

router.get('/:id', isLoggedIn, catchAsync(async (req, res,) => {   
    const {id} =req.params;  
    const department = await Department.findById(id).populate('campground').populate({
        path: 'assets',
        populate: {
            path: ''
        }
    }).populate({
        path: 'malassets',
        populate: {
            path: ''
        }
    }).populate({
        path: 'misassets',
        populate: {
            path: ''
        }
    }).populate ('author').populate ('editor');
    if (!department) {
        req.flash('error', 'This department was deleted');
        return res.redirect('/departments');
    }
    res.render('departments/show', { department });
}));




router.delete('/:departmentId', isLoggedIn, isDepartmentAuthor, catchAsync(departments.deleteDepartment))


module.exports = router;



