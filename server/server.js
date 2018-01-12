require('dotenv').config();

const express = require('express')
    , bodyParser = require('body-parser')
    , session = require('express-session')
    , massive = require('massive')
    , cors = require('cors')
    , app = express()
    , port = 3012
    , passport = require('passport')
    , Auth0strat = require('passport-auth0')

app.use(bodyParser.json());
app.use(cors());

app.use(session({
    secret: process.env.SECRET,
    resave: false, 
    saveUninitialized: true
}))

app.use(passport.initialize());
app.use(passport.session());

//sim3: 105C. Auth0strat is a constructor that is used in auth0. The domain-scope values are constructed for each user being authorized. 
passport.use(new Auth0strat({
    domain: process.env.DOMAIN,
    clientID: process.env.CLIENTID,
    clientSecret: process.env.CLIENTSECRET,
    callbackURL: process.env.CALLBACKURL,
    scope: "openid profile"
}, 
//sim3: 83C. This function is a callback function that is passed to auth0 and determines what is passed onto the serializeUser function. 
function(accessToken, refreshToken, extraParams, profile, done ){
    const db = app.get("db");
    console.log("profile", profile);
    let {user_id, displayName}=profile;
    let lastname = profile.name.familyName;
    let firstname = profile.name.givenName;
    let email = "test@email.net";

    (firstname===undefined) ? "" : firstname;
    (lastname===undefined) ? "" : lastname;

   db.findUser([user_id]).then(user=>{
       console.log('finding user', user[0]);
        if (!user[0]){
            db.addUser([firstname, lastname, displayName, email, user_id]).then(res=>{
                console.log("added user", res);
                const {firstname, lastname, id} = user[0];              return done(null, firstname, lastname, id);
            })
        }
        else {
            const {firstname, lastname, id} = user[0]; 
            return done(null, firstname, lastname, id);
        }
    }).catch(e=>console.log(e)) //sim3: 104D
    }))

//these next two functions will be modified once I see what the profile from auth0 looks like exactly and determine what this app needs
passport.serializeUser((firstname, lastname, id, done)=>{
    console.log('hitting serialize');
    done(null, firstname, lastname, id);
})

passport.deserializeUser((firstname, lastname, id, done)=>{
    done(null, firstname, lastname, id);
})

//sim3: 83D and 83E. After the user is authenticated, the callback function in Auth0strat gets invoked to pass along information to passport.serializeUser. 
app.get('/api/auth/login', passport.authenticate('auth0',{
    successRedirect: "/api/auth/setUser",
    failureRedirect: "/api/auth/login"
}));

app.get("/api/auth/setUser", function (req,res){
    console.log(res.data);
    if (!req.user){
        res.status(404).send("user not found");
    }
    else {res.status(200).send(req.user).redirect('http://localhost:3012/dashboard')
}}) 

massive(process.env.CONNECTION).then(database=>{
    app.set('db', database);
    app.listen(port, ()=>console.log('Big Brother is listening on port 3012'));
})


    