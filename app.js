if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config();
}

 

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const dbUrl=process.env.DB_URL || 'mongodb://localhost:27017/yelp-camp';

const userRoutes = require('./routes/users');
const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews');

const MongoDBStore=require('connect-mongodb-session')(session);
const store=new MongoDBStore({
    uri:dbUrl,
    collection:'sessions',
    touchAfter: 24 * 60 * 60
})

store.on('error',function(error){
    console.log(error);
})

mongoose.connect(process.env.DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  tls: true,
})
.then(() => console.log('Database connected'))
.catch(err => console.log('Connection error:', err));


const app = express();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

const sessionConfig={
    store: store,
    secret: 'thisshouldbeabettersecret!',
    resave: false,
    saveUninitialized:true,
    cookie:{
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.currentUser = req.user; 
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.use('/', userRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/reviews', reviewRoutes);

app.get('/', (req, res) => {
    res.render('home');
});

// Basic error handler
app.use((err, req, res, next) => {
    console.error("🔥 Error:", err);

    if (res.headersSent) {
        return next(err); // Let Express handle it if response already started
    }

    req.flash('error', err.message || 'Something went wrong!');
    res.redirect(req.originalUrl || '/campgrounds');
});


app.listen(3000, () => {
    console.log('Server started on port 3000');
});
