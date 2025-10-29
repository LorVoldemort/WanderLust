const mongoose = require('mongoose');
const Review = require('./reviews');
const { string, number, required } = require('joi');
const listingSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    img: {
            url : String,
            filename : String
        },
    price: {
        type: Number
    },
    location: {
        type: String,
        required : true
    },
    country : {
        type : String
    },
    reviews : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'Review'
        }
         
    ],
    owner : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    },
    coordinates : {
        lat : Number,
        lon : Number
    },
});

listingSchema.post("findOneAndDelete",async(data)=>{
    if(data.reviews.length){
        await Review.deleteMany({_id : {$in : data.reviews}});
    }
});

const Listing = mongoose.model('Listing',listingSchema);
module.exports = Listing;