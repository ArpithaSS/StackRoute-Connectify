const express = require('express');
const mongoose = require('mongoose');
const User = require('./model/user');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const session = require('express-session');
const LocalStrategy = require('passport-local').Strategy;
const path=require('path');


const app = express();
app.use(express.json());

app.use(express.urlencoded({ extended: false }));

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(express.static(path.join(__dirname,'public'))); 
// app.set('view engine', 'ejs'); 
// app.set('views', path.join(__dirname, 'views'));


app.use(
    session({
        secret: "secret-Key",
        saveUninitialized: false,
        store: session.MemoryStore(),
        cookie: {
            maxAge: 60000
        },
        resave: false,
    })
);


app.use(passport.initialize());
app.use(passport.session());


passport.serializeUser((user, done) => {
    done(null, user._id);
})

passport.deserializeUser(async (id, done) => {
    await User.findById(id).then((user) => done(null, user));
});

passport.use(
    new LocalStrategy(
        { usernameField: "Email", passwordField: "Password" },
        async (username, password, done) => {
            let result = await User.findOne({ email: username });
            if (result != null) {
                if (bcrypt.compareSync(password, result.password)) {
                    return done(null, result);
                } else {
                    done(null, false, { message: "Invalid Credentials" });
                }
            } else {
                done(null, false, { message: "Invalid Credentials" });
            }
        }
    )
);

const isLoggedIn = (req, res, next) => {
    console.log(req.isAuthenticated());
    if (req.isAuthenticated()) {
        console.log("Afeter",req.isAuthenticated());
        return next();
    }
    res.redirect("/login");
};

app.get("/", (req, res) => {
    res.render("home");
});
app.get("/login", (req, res) => {
    res.render("login");
});
app.get("/register", (req, res) => {
    res.render("register");
});


app.get("/friends", isLoggedIn, (req, res) => {
    res.render("friends");
});

app.get("/logout", (req,res,next)=>{
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect('/');
      });
})

app.post("/register", async (req, res) => {
    let user = new User({
        firstname: req.body.FirstName,
        lastname: req.body.LastName,
        email: req.body.Email,
        city: req.body.City,
        // DOB: req.body.DOB,
        password: bcrypt.hashSync(req.body.Password),
    });
    await user.save();
    res.redirect("/login");
});

app.post("/login", passport.authenticate("local", { failureRedirect: "/login" }), (req, res) => {
    res.redirect("/friends");
});

mongoose.connect("mongodb://localhost:27017/ConnectionsDB");
mongoose.connection
    .once("open", () => {
        console.log("Connected to DB");
    })
    .on("error", (err) => {
        console.log(err);
    });

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});




