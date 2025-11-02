if (process.env.NODE_ENV != 'production') {
    require('dotenv').config();
}
const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const path = require('path');
const ExpressError = require('./utils/ExpressError');
const listingRouter = require('./routes/listing');
const reviewRouter = require('./routes/review');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const localStrategy = require('passport-local');
const User = require('./models/user');
const userRouter = require('./routes/user');
const MongoStore = require('connect-mongo');
const wrapAsync = require('./utils/wrapAsync');


const app = express();
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log('Server is listening to port : 3000');
});

//default middleware
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, "public")));
app.engine('ejs', ejsMate);
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'))


const store = MongoStore.create({
    mongoUrl: process.env.ATLAS_URL,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 3600
})

const sessionOption = {
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    store
}
app.use(session(sessionOption));
app.use(flash());


app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


async function main(params) {
    await mongoose.connect(process.env.ATLAS_URL);
}
main().then(() => {
    console.log("connection Established");
}).catch(() => {
    console.log("error occuerd in database");
})

app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.deletesuccess = req.flash('deletesuccess');
    res.locals.error = req.flash('error');
    res.locals.currUser = req.user;
    next();
})


app.get('/',wrapAsync((req,res)=>{
    res.redirect('/listing');
}))

app.use('/listing', listingRouter);
app.use('/listing/:id/review', reviewRouter);
app.use('/user', userRouter);



app.use((err, req, res, next) => {
    let { status = 500, message } = err;
    res.render('./listing/error', { message });
})
