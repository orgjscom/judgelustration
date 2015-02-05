var express  = require('express');
//var mongoose = require('mongoose');
var mail = require('./email')
var http = require('http');
var path = require('path');
var fs = require('fs');
var json2xls = require('json2xls');

//var json2xls = require('json2xls');
//var nodeExcel  = require('excel-export');
//var excelParser = require('excel-parser');


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

//app.configure(function (){
//    app.use(express.cookieParser('keyboard cat'));
//    app.use(express.session({ cookie: { maxAge: 60000 }}));
//});

//if ('development' == app.get('env')) {
//    app.use(express.errorHandler());
//    mongoose.connect('mongodb://localhost/clothing');
//}

//var MySignIn = new mongoose.Schema({
//    name : String,
//    pass : String
//});
//
//var user = mongoose.model('users',MySignIn);
//
//app.post('/register', function(req, res){
//    new user({
//        name : req.body.name,
//        pass : req.body.pass
//    }).save(function(err,doc){
//            if(err) res.json(err);
//            else res.statusCode = 302;
//            res.setHeader("Location", "/users");
//            res.end();
//        });
//});

//var admin  = "../www/admin/admin";
//app.get('/admin', function(req, res){
////    res.render(admin)
//    mongoose.model('users').find(function(err, users){
//        res.send(users);
//    });
//});


var index  = "../www/index";
app.get('/', function(req, res){
    res.render(index)
});

var sendObj = {};
app.post('/send', function(req, res){
    sendObj = {
        "email" :   req.body.email  ,
        "message" : req.body.message,
        "name" :    req.body.name   ,
        "subject" : req.body.subject
    };
    funcWriteJson(sendObj, res);
    res.writeHead(302, {
        'Location': '/'
    });
    res.end();
});

var dataToWriteGlobal = [];
var url = 'www/data.json';
var readFile = fs.readFileSync( url );
var jsonObj = JSON.parse( readFile );
var arr = [];
for( var i = 0; i < jsonObj.length; i++){
    arr.push(JSON.stringify(jsonObj[i]))
}

var funcWriteJson = function(sendObj, res){
    arr.push(JSON.stringify(sendObj));
    var dataToWrite = "[" + arr + "]";
    fs.writeFileSync( url , dataToWrite );
    dataToWriteGlobal = JSON.stringify(jsonObj);
    dataToWriteNewFunc(dataToWrite);
    funcWriteExcel(dataToWrite, res)
};

dataToWriteGlobal = JSON.stringify(jsonObj);

var funcWriteExcel = function(dataToWrite, res){
    var data = JSON.parse(dataToWrite);
    var xls = json2xls(data);
    try{
        fs.writeFileSync('www/data.xlsx', xls, 'binary');
    } catch (e){
        console.log(e);
        res.writeHead(302, {
            'Location': '/'
        });
        res.end();
    }
};
var dataToWriteNewFunc = function(dataToWrite){
    return dataToWrite;
};


var all  = "../www/all";
app.get('/24', function(req, res){
    res.render(all, {"data": dataToWriteGlobal })
});


var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport( {
    host: "mx1.hostinger.com.ua", // hostname
    secureConnection: true, // use SSL
    port: 2525, // port for secure SMTP
    auth: {
        user: 'admin@blagoustriy.net',
        pass: '11111111'
    }
});
var mailOptions = {
    from: 'judgelustration ✔ <admin@blagoustriy.net>', // sender address
    to: 'san4osq@ya.ru', // list of receivers
    subject: 'Hello ✔', // Subject line
    text: 'Hello world ✔', // plaintext body
    html: '<b>Hello world ✔2</b>' // html body
};
transporter.sendMail(mailOptions, function(error, info){
    if(error){
        console.log(error);
    }else{
        console.log('Message sent: ' + info.response);
    }
});
http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});

