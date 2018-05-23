var bCrypt = require("bcrypt-nodejs");
var utils = require("./utils.js");

module.exports = function(passport, user) {
    var User = user;
    var LocalStrategy = require("passport-local").Strategy;
    var RememberMeStrategy = require("../..").Strategy;

    // serialize
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });
    
    // deserialize user 
    passport.deserializeUser(function(id, done) {
        User.findById(id).then(function(user) {
            if (user) {
                done(null, user.get());
            }
            else {
                done(user.errors, null);
            }
        });
    });

    // LOCAL SIGNUP
    passport.use("local-signup", new LocalStrategy({
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) {
        var generateHash = function(password) {
            return bCrypt.hashSync(password, bCrypt.genSaltSync(8), null);
        };

        User.findOne({
            where: {
                email: email
            }
        }).then(function(user) {
            if (user) {
                return done(null, false, {
                    message: "That email is already taken"
                });
            }
            else {
                var userPassword = generateHash(password);
                var data =
                    {
                        email: email,
                        password: userPassword,
                        firstname: req.body.firstname,
                        lastname: req.body.lastname
                    };
                User.create(data).then(function(newUser, created) {
                    if (!newUser) {
                        return done(null, false);
                    }
                    if (newUser) {
                        return done(null, newUser);
                    }
                });
            }
        });
    }));

    // LOCAL SIGNIN
    passport.use("local-signin", new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) {
        var User = user;
        var isValidPassword = function(userpass, password) {
            return bCrypt.compareSync(password, userpass);
        };

        User.findOne({
            where: {
                email: email
            }
        }).then(function(user) {
            if (!user) {
                return done(null, false, {
                    message: "Email does not exist"
                });
            }
            if (!isValidPassword(user.password, password)) {
                return done(null, false, {
                    message: "Incorrect password."
                });
            }
            var userInfo = user.get();
            return done(null, userInfo);
        }).catch(function(err) {
            console.log("Error:", err);
            return done(null, false, {
                message: "Something went wrong with your Signin"
            });
        });
    }));

    // Remember Me cookie strategy
    // This strategy consumes a remember me token, supplying the user the
    // token was originally issued to.  The token is single-use, so a new
    // token is then issued to replace it.
    passport.use("remember-me", new RememberMeStrategy(
        function (token, done) {
            consumeRememberMeToken(token, function (err, uid) {
                if (err) { return done(err); }
                if (!uid) { return done(null, false); }

                findById(uid, function (err, user) {
                    if (err) { return done(err); }
                    if (!user) { return done(null, false); }
                    return done(null, user);
                });
            });
        },
        issueToken
    ));

    function issueToken(user, done) {
        var token = utils.randomString(64);
        saveRememberMeToken(token, user.id, function (err) {
            if (err) { return done(err); }
            return done(null, token);
        });
    };

    var tokens = {};

    function consumeRememberMeToken(token, fn) {
        var uid = tokens[token];
        // invalidate the single-use token
        delete tokens[token];
        return fn(null, uid);
    };

    function saveRememberMeToken(token, uid, fn) {
        tokens[token] = uid;
        return fn();
    };
};
