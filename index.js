const express = require('express');
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const session = require("express-session");
const flash = require("connect-flash")
// const { playerSchema } = require('./schemas.js');
const Player = require('./models/player');
const players = require('./routes/players');
mongoose.connect('mongodb://localhost:27017/cricket', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

app.engine('ejs', ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json())
app.use(methodOverride('_method'))

app.use(express.static(path.join(__dirname, "public")));

// const validatePlayer = (req, res, next) => {
//     const { error } = playerSchema.validate(req.body);
//     if (error) {
//         const msg = error.details.map(el => el.message).join(',')
//         throw new ExpressError(msg, 400)
//     } else {
//         next();
//     }
// }


const sessionConfig = {
    secret: "thisisasecret",
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig));
app.use(flash());


app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})
app.use('/players', players)

app.get("/", catchAsync(async (req, res) => {
    res.render("homepage");
}))



app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!'
    res.status(statusCode).render('error', { err })
})

app.listen(3000, function () {
    console.log("Listening on port 3000")
})