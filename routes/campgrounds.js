const express = require('express');
const router = express.Router();
const campgrounds = require('../controllers/campgrounds');
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

const Campground = require('../models/campground');
const Department = require('../models/department');

router.get('/new', isLoggedIn, campgrounds.renderNewForm)
router.route('/')
    .get(catchAsync(campgrounds.index))
    .post(isLoggedIn, upload.array('image'), validateCampground, catchAsync(campgrounds.createCampground))


router.get('/:id/departments/new', isLoggedIn, catchAsync(async (req,res) => {
    const {id} = req.params;
    const campground = await Campground.findById(id);
    res.render('departments/new',{campground})
}));


router.post('/:id/departments/', isLoggedIn, catchAsync(async(req,res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    const department = new Department (req.body.department);
    campground.departments.push(department);
    department.campground = campground;
    department.author = req.user._id;
    department.editor = req.user._id;
    await campground.save();
    await department.save();
    console.log (department)
    res.redirect(`/campgrounds/${id}`)
}))



router.route('/:id')
    .get(catchAsync(campgrounds.showCampground))
    .put(isLoggedIn, isAuthor, upload.array('image'), validateCampground, catchAsync(campgrounds.updateCampground))
    .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm))



module.exports = router;