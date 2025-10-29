const express = require('express');
const router = express.Router({ mergeParams: true });
const methodOverride = require('method-override');
const Listing = require('../models/listing');
const { listingValidation } = require('../ServerValidation');
const wrapAsync = require('../utils/wrapAsync');
const ExpressError = require('../utils/ExpressError');
const passport = require('passport');
const { saveredirectUrl, isloggedIn, isowner } = require('../utils/islogin');
const multer = require('multer');
const { storage } = require('../cloudConfig');
const upload = multer({ storage });

router.use(methodOverride('_method'));
let validateListing = (req, res, next) => {
    let { error } = listingValidation.validate(req.body);
    if (error) {
        throw new ExpressError(400, error);
    }
    else next();
}

router.get('/', wrapAsync(async (req, res) => {
    let alllisting = await Listing.find({});
    res.render('listing/index', { alllisting });

}))

router.get('/new', saveredirectUrl, isloggedIn, wrapAsync(async (req, res) => {
    console.log(req.user);
    res.render('listing/new');
}))

router.post('/', saveredirectUrl, isloggedIn, validateListing, upload.single('img'), wrapAsync(async (req, res) => {
    const locationText = req.body.location;
    const countryText = req.body.country;
    const fullAddress = `${locationText}, ${countryText}`;
    await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(fullAddress)}`)
    .then(data => {
        if (data.length > 0) {
            const lat = data[0].lat;
            const lon = data[0].lon;
            req.body.coordinates = {lat,lon};
        }
    })
    .catch(err => console.error('Geocoding error:', err));
    let { path: url, filename } = req.file;
    let list = new Listing(req.body);
    list.owner = req.user._id;
    list.img = { url, filename };
    await list.save();
    req.flash('success', 'New listing created');
    res.redirect('/listing');
}))



router.get('/:id', wrapAsync(async (req, res) => {
    let { id } = req.params;
    let li = await Listing.findById(id).populate({ path: 'reviews', populate: { path: 'author' }, }).populate('owner');
    if (!li) {
        req.flash('error', "Listing Dose not exist");
        res.redirect('/listing');
    }
    else res.render('listing/showListing', { li });
   
}))



//edit form 
router.get('/:id/edit', saveredirectUrl, isloggedIn, isowner, wrapAsync(async (req, res) => {
    let { id } = req.params;
    let li = await Listing.findById(id);
    let newurl = li.img.url;    
    newurl.replace('/upload','/upload/h_300,w_250,c_blur:300');
    res.render('listing/editlisting', { li,newurl });
}))

//update listing
router.patch('/:id', isloggedIn, isowner, validateListing, upload.single('img'), wrapAsync(async (req, res) => {
    let { id } = req.params;
    
    let list = await Listing.findByIdAndUpdate(id, req.body);

    if (typeof req.file !== 'undefined') {
        let { path: url, filename } = req.file;
        list.img = { url, filename };
        await list.save();
    }
    req.flash('success', 'Lisitng edited successfully');
    res.redirect('/listing');
}))

//delete 
router.delete('/:id/delete', isloggedIn, isowner, wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash('deletesuccess', "Listing deleted successfully");
    res.redirect('/listing');
}))


module.exports = router;