var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

mongoose.connect('mongodb://localhost/projectdb');
var db = mongoose.connection;
var bcrypt = require('bcrypt-nodejs');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var cookieParser = require('cookie-parser');
var cookieSession = require('cookie-session');

/*Body parser*/
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use('/js', express.static(__dirname + '/js'));
app.use('/css', express.static(__dirname + '/css'));

/*Initialize sessions*/
app.use(cookieParser());
app.use(bodyParser());
app.use(cookieSession({
    name: 'session',
    keys: ['key1', 'key2']
}));

/*Initialize Passport*/
app.use(passport.initialize());
app.use(passport.session());

/*Model decaleration */
//User model
var UserSchema = new mongoose.Schema({
     email: String,
     password: String
 });

var User = mongoose.model('user', UserSchema);

//project model
var ProjectSchema = new mongoose.Schema({
    name: String,
    description: String,
    startdate: String,
    enddate: String,
    postedBy : {
		type: mongoose.Schema.Types.ObjectId, ref: 'User'
	}
});

var Project = mongoose.model('project', ProjectSchema);

/* routes */
app.get('/', function (req, res, next) {
 res.sendFile( __dirname + '/index.html');
});

app.get('/register', function (req, res, next) {
    res.sendFile( __dirname + '/register.html');
});

app.get('/project', loggedIn, function (req, res, next) {
    res.sendFile( __dirname + '/project.html');
});


app.get('/home', loggedIn, function (req, res, next) {
	res.sendFile( __dirname + '/home.html');
});

app.get('/projects', loggedIn, function (req, res, next) {
	Project.find({postedBy: mongoose.Types.ObjectId(req.user.id)}, function(err, project) {
       return res.json(project);
   });
});

app.get('/user', loggedIn, function (req, res, next) {
    User.findById({ _id: req.user._id }, function(err, user) {
        return res.json(user);
    });
});

app.get('/home', loggedIn, function (req, res, next) {
    res.sendFile( __dirname + '/home.html');
});

app.post('/project', loggedIn, function (req, res, next) {
	var uid = req.user.id;
	
	var project = {
		name : req.body.name,
		description : req.body.descp,
		startdate : req.body.sdate,
		enddate : req.body.edate,
		postedBy : uid
	}
	Project.create(project, function(err, saved) {
    	if(err) {
    		console.log("error while adding project");
        	console.log(err);
        	res.json({ message : err });
    	} else {
        	res.json({ message : "Project Added successfully!"});
    	}
    });
	
});

app.post('/edit', loggedIn, function (req, res, next) {
    Project.findById({ _id: mongoose.Types.ObjectId(req.body._id) }, function(err, project) {
        if(err) {
            console.log(err);
            return res.json({ message : err });
        } else {
            //Modify new values here
            project.name = req.body.name;
            project.description = req.body.description;
            project.startdate = req.body.startdate;
            project.enddate = req.body.enddate;

            //Save the new values
            project.save(function(err){
                if(err) {
                    console.log(err);
                    return res.json({ message : err });
                } else {
                    return res.json({ message : "Project edited successfully!" });
                }
            });
       }
   });
});

app.post('/delete', loggedIn, function (req, res, next) {
    Project.findOneAndRemove({ _id: mongoose.Types.ObjectId(req.body._id) }, function(err, project) {
        if(err) {
            console.log(err);
            return res.json({ message : err });
        } else {
            return res.json({ message : "Project deleted successfully!"});
        }
    });
});


app.post('/login', passport.authenticate('local'),
    function(req, res) {
        res.redirect('/home');
});

app.get('/logout', function (req, res, next) {
    req.logout();
    res.redirect('/');
});

app.post('/register', function (req, res, next) {
       var password = bcrypt.hashSync(req.body.password);
    req.body.password = password;
    User.create(req.body, function(err, saved) {
         if(err) {
            return res.json({ message : err });
        } else {
            return res.json({ message : "Registered successfully!"});
        }
    });
}); 

function loggedIn(req, res, next) {
    if (req.user) {
        next();
    } else {
        res.redirect('/');
    }
}

/**********
The login logic where it passes here if it reaches passport.authenticate
**********/

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  }, function(email, password, done) {
        User.findOne({ email: email }, function (err, user) {
            if(user !== null) {
                var isPasswordCorrect = bcrypt.compareSync(password, user.password);
                if(isPasswordCorrect) {
                    console.log("Email and password correct!");
                    return done(null, user);
                } else {
                    console.log("Password incorrect!");
                    return done(null, false);
                }
           } else {
               console.log("Email does not exist!");
               return done(null, false);
           }
       });
    }
));

/**********
Serialize and Deserialize here for passport.authenticate
**********/

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});

app.listen(3030, function() {
 console.log('Server running at port 3030');
});