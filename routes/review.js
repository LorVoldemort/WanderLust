const express = require('express');
const router = express.Router({mergeParams : true});
const Review = require('../models/reviews');
const Listing = require('../models/listing');
const {reviewValidate }= require('../ServerValidation');
const wrapAsync = require('../utils/wrapAsync');
const ExpressError = require('../utils/ExpressError');
const { isowner, isloggedIn, isAuthor } = require('../utils/islogin');

let validateReview = (req,res,next)=>{
    let {error} = reviewValidate.validate(req.body);
    if(error){
        throw new ExpressError(400,error);
    }
    else next();
}


router.post('/',isloggedIn,validateReview,wrapAsync(async (req,res)=>{
    
    let {id} = req.params;
    let newrew = new Review(req.body);
    newrew.author = req.user._id;
    let li = await Listing.findById(id);
    await newrew.save();
    li.reviews.push(newrew);
    req.flash('success',"New review is added");
    await li.save(); 

    res.redirect(`/listing/${id}`);
}))

//delete review of the listing
router.delete('/:id2/delete',isloggedIn,isAuthor,wrapAsync(async (req,res)=>{
    let {id,id2} = req.params;
    await Listing.findByIdAndUpdate(id,{$pull : {reviews : id2}});
    await Review.findByIdAndDelete(id2);
    req.flash('deletesuccess',"Review deleted successfully");
    res.redirect(`/listing/${id}`);
}))

module.exports = router;