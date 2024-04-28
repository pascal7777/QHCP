if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const morgan = require ('morgan')
const methodOverride = require('method-override');
const catchAsync = require('./utils/catchAsync')
const ExpressError = require('./utils/ExpressError');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');

const User = require('./models/user');
const Campground = require('./models/campground');
const Department = require('./models/department');


const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const userRoutes = require('./routes/users');
const campgroundRoutes = require('./routes/campgrounds');
const departmentRoutes = require('./routes/departments');
const assetRoutes = require('./routes/assets');
const malassetRoutes = require('./routes/malassets');
const misassetRoutes = require('./routes/misassets');
const reviewRoutes = require('./routes/reviews');
const { isLoggedIn } = require('./middleware');

const dbURL = process.env.DB_URL || 'mongodb://localhost:27017/qchp';
const secret = process.env.SECRET || 'squirrel';

const MongoStore = require('connect-mongo');

mongoose.connect(dbURL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("MONGO CONNECTION OPEN!!!")
    })
    .catch(err => {
        console.log("OH NO MONGO CONNECTION ERROR!!!!")
        console.log(err)
    })

const app = express();

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(mongoSanitize());
app.use(morgan('tiny'))

const store =  MongoStore.create({
    mongoUrl: dbURL,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret,
}
});

store.on("error", function(e){
    console.log("Session Store Error", e)
})

const sessionConfig = {
    store,
    name: 'vientiane',
    secret,
    resave: false,
    saveUnitialized: true,
    cookie: {
        httpOnly: true,
        // secure: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.use(session(sessionConfig));
app.use(flash());
app.use(
    helmet({
      contentSecurityPolicy: false,
    })
  );



app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    if (!['/login', '/'].includes(req.originalUrl)) {
        req.session.returnTo = req.originalUrl;
    }
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})


app.use('/', userRoutes);
app.use('/departments', departmentRoutes)
app.use('/campgrounds', campgroundRoutes)
app.use('/assets', assetRoutes)
app.use('/malassets', malassetRoutes)
app.use('/misassets', misassetRoutes)
app.use('/campgrounds/:id/departments', departmentRoutes)
app.use('/departments/:id/assets', departmentRoutes)
app.use('/departments/:id/malassets', departmentRoutes)
app.use('/departments/:id/misassets', departmentRoutes)
app.use('/campgrounds/:id/reviews', reviewRoutes)


app.locals.moment = require('moment');

app.get('/', catchAsync(async (req, res) => {
    res.render('home')
}))



app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!'
    res.status(statusCode).render('error', { err })
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`App listens on Port ${PORT}`)
})

