const express = require('express');
const router = express.Router();
const campgrounds = require('../controllers/campgrounds');
const { isLoggedIn, isAuthor } = require('../middleware');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload=multer({storage});

// Show all campgrounds
router.get('/', campgrounds.index);

// Form to create new campground
router.get('/new', isLoggedIn, campgrounds.renderNewForm);

// Create a new campground
router.post('/', isLoggedIn, upload.array('image'), campgrounds.createCampground);



// Show one campground
router.get('/:id', campgrounds.showCampground);

// Edit form
router.get('/:id/edit', isLoggedIn, isAuthor,upload.array('image'), campgrounds.renderEditForm);

// Update campground
router.put('/:id', isLoggedIn, isAuthor,upload.array('image'), campgrounds.updateCampground);

// Delete campground
router.delete('/:id', isLoggedIn, isAuthor, campgrounds.deleteCampground);

module.exports = router;
