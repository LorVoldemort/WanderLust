const Listing = require("../models/listing");
const Review = require("../models/reviews");

module.exports.saveredirectUrl = (req,res,next)=>{
    if(req.session.nextUrl){
        res.locals.redirectUrl = req.session.nextUrl;
    }
    next();
}

module.exports.isloggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.nextUrl = req.originalUrl;
        req.flash('error',"logged In");
        return res.redirect('/user/login');
    }
    else next();
}

module.exports.isowner = async (req,res,next)=>{
    let {id} = req.params;
    let list = await Listing.findById(id);
    if(!list.owner._id.equals(res.locals.currUser._id)){
        req.flash('error','Not Authorized User');
        return res.redirect(`/listing/${id}`);
    }
    next();
}

module.exports.isAuthor = async (req,res,next)=>{
    let {id2} = req.params;
    let review = await Review.findById(id2);
    if(!review.author._id.equals(res.locals.currUser._id)){
        req.flash('error','Not Authorized User');
        return res.redirect(`/listing/${id}`);
    }
    next();
}
