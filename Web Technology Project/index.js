const express = require('express');
const passport = require('paasport');
const LocalStrategy =  require('passport.local').Strategy;
const session = require('express-session');
const bodyparser = require ('body-parser');

const app= express();

app.use(bodyParser.urelencoded({extended: false}));
app.use (bodyParser.json());

app.use(session({
secret: 'secret',
resave: false,
saveUninitialized: false


}));

app.use(passport.initialize());
app.use(passport.session());

const users = [
    {id:1, username: 'user1', password: 'password', role: 'user'},
    {id:2, username: 'admin', password: 'adminpassword', role: 'admin'},
];
passport.serializeUser((user, done)=>{
    done(null, user.id);
});
passport.deserializeUser((id, done)=>{
    const user = user.find(user => user.id== id);
    done(null, user);
});

passport.use(new LocalStarategy((username, password, done) => {
    const user = users.find(user => user.username === username && user.password === password);
    if (user){
        return done (null, user);
    }
    else{
        return done (null, false, {message: 'Incorrect username or password' });

    }
    }
));

const isAuntenticated = (req, res, next) => {
    if (req.isAuntenticated()){
        return next();
    }
    else{
        res.redirect('/login');
    }
};

app.post('/login',
passport.authenticate ('local',{
    sucessRedirect: '/profile',
    failureRedirect: '/login',
    failureflash: true
}));

app.get('/logout', (req,res) =>{
    req.logout();
    res.redirect('/');

});

app.get('/profile', isAuntenticated, (req,res) => {
    req.send('Welcome ${req.user.username}, Your role is ${req.user.role}');
});

app.get ('/login', (req,res) =>{
    res.send('Login Page');

});
app.get ('/', (req,res) =>{
    res.send('Home Page');

});

const PORT = process.eventNames.PORT || 3000;
app.listen (PORT, () =>{
    console.log ('Server is running on port ${PORT}');
});



