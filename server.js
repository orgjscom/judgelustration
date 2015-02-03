var express  = require('express');
var mongoose = require('mongoose');

var http = require('http');
var path = require('path');

var app = express();

app.engine('html', require('hogan-express'));
app.set('view options', {layout: true});
app.set('layout', 'layout');
app.enable('view cache');
app.set('port', process.env.PORT || 3000);
app.set('view engine', 'html');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'www')));

if ('development' == app.get('env')) {
    app.use(express.errorHandler());
    mongoose.connect('mongodb://localhost/clothing');
}

var MySignIn = new mongoose.Schema({
    name : String,
    pass : String
});

var user = mongoose.model('users',MySignIn);

app.post('/register', function(req, res){
    new user({
        name : req.body.name,
        pass : req.body.pass
    }).save(function(err,doc){
            if(err) res.json(err);
            else res.statusCode = 302;
            res.setHeader("Location", "/users");
            res.end();
        });
});

var admin  = "../www/admin/admin";
app.get('/admin', function(req, res){
//    res.render(admin)
    mongoose.model('users').find(function(err, users){
        res.send(users);
    });
});

app.post('/login', function(req, res){
    mongoose.model('users').find(function(err, users){
        if(err){
            res.json(err)
        } else{
            for(i = 0; i < users.length; i++){
                var name = users[i]._doc.name;
                var pass = users[i]._doc.pass;

                if( name == "admin" && pass == "admin") {
                    res.statusCode = 302;
                    res.setHeader("adminLocation", "/admin");
//                    res.end();
                    res.send(users);
                }

            }
        }
    })
})




var Spreadsheet = require('edit-google-spreadsheet');

Spreadsheet.load({
    debug: true,
    spreadsheetName: 'node-edit-spreadsheet',
    worksheetName: 'Sheet1',

    // Choose from 1 of the 4 authentication methods:

    //    1. Username and Password
    username: 'my-name@google.email.com',
    password: 'my-5uper-t0p-secret-password',

    // OR 2. OAuth
    oauth : {
        email: 'my-name@google.email.com',
        keyFile: 'my-private-key.pem'
    },

    // OR 3. Static Token
    accessToken: {
        type: 'Bearer',
        token: 'my-generated-token'
    },

    // OR 4. Dynamic Token
    accessToken: function(callback) {
        //... async stuff ...
        callback(null, token);
    }
}, function sheetReady(err, spreadsheet) {
    //use speadsheet!
});



http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});
