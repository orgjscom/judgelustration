var express  = require('express');
//var mongoose = require('mongoose');
//var mail = require('./email');
var http = require('http');
var path = require('path');
var fs = require('fs');
var json2xls = require('json2xls');
var sendEmail = require('./server/sendEmail/sendEmail');



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




var index  = "../www/index";
app.get('/', function(req, res){
    res.render(index)
});

var sendObj = {};

app.post('/send', function(req, res){
    sendObj = {
        "message" :  req.body.message,
        "number"  :  req.body.number,
        "contact" :  req.body.contact
    };
    funcWriteJson(sendObj, res);
    try{
        sendEmail.funcSendEmail(sendObj)
    }catch(e){
        console.log(e)
    }
    res.writeHead(302, {
        'Location': '/'
    });
    res.end();
});

var dataToWriteGlobal = [];
var url = 'www/ok/data.json';
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
    funcWriteExcel(dataToWrite, res);

};


dataToWriteGlobal = JSON.stringify(jsonObj);

var funcWriteExcel = function(dataToWrite, res){

    var data = JSON.parse(dataToWrite);
    var xls = json2xls(data);
    try{
        fs.writeFileSync('www/ok/data.xlsx', xls, 'binary');
        dataToWriteGlobal = dataToWrite;
    } catch (e){
        console.log(e);
        res.writeHead(302, {
            'Location': '/'
        });
        res.end();
    }

};





var renderData = require('./server/private/renderData');
renderData.renderDataToAdmin(app, dataToWriteGlobal);

//var sitemap = require('./server/sitemap/sitemap');
//sitemap.toSitemap(app);

http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});


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

