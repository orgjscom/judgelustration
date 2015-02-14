var express  = require('express');
//var mongoose = require('mongoose');
//var mail = require('./email');
var http = require('http');
var path = require('path');
var fs = require('fs');
var json2xls = require('json2xls');
var nodemailer = require('nodemailer');


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
        funcSendEmail(sendObj)
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
    //dataToWriteNewFunc(dataToWrite);
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


//var dataToWriteNewFunc = function(dataToWrite){
//    return dataToWrite;
//};


var all  = "../www/all";
app.get('/24', function(req, res){
    res.render(all, { "data": dataToWriteGlobal })
});

var funcSendEmail = function(sendObj) {

    var transporter = nodemailer.createTransport( {
        host: "mx1.hostinger.com.ua",
        secureConnection: true,
        port: 2525,
        auth: {
            user: 'admin@blagoustriy.net',
            pass: '11111111'
        }
    });
    var htmlMgs =
        "<hr>Повідомлення - "	        + sendObj.message +
        "<hr>№ справи або рішення - "	+ sendObj.number  +
        "<hr>Контакти - "	            + sendObj.contact +
        '<hr><b><a href="http://judgelustration.herokuapp.com/24">переглнути таблицю judgelustration</a></b>' +
        '<hr><b><a href="http://judgelustration.herokuapp.com/">перейти на головну judgelustration</a></b>' +
        '<hr><b><a href="http://judgelustration.herokuapp.com/ok/data.xlsx">скачати EXCEL judgelustration</a></b>';

    var mailOptions = {
        from: 'judgelustration ✔ <judgelustration.com>',
        to: 'san4osq@ya.ru, yura.makedon@gmail.com, vgavdeev@gmail.com',
        subject: 'judgelustration',
        text: 'judgelustration',
        html: htmlMgs
    };
    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            console.log(error);
        }else{
            console.log('Message sent: ' + info.response + mailOptions.html);
        }
    });

};


function generate_xml_sitemap() {
    // this is the source of the URLs on your site, in this case we use a simple array, actually it could come from the database
    var urls = ['index.html'];
    // the root of your website - the protocol and the domain name with a trailing slash
    var root_path = 'http://judgelustration.herokuapp.com/';
    // XML sitemap generation starts here
    var priority = 0.5;
    var freq = 'monthly';
    var xml = '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
    for (var i in urls) {
        xml += '<url>';
        xml += '<loc>'+ root_path + urls[i] + '</loc>';
        xml += '<changefreq>'+ freq +'</changefreq>';
        xml += '<priority>'+ priority +'</priority>';
        xml += '</url>';
        i++;
    }
    xml += '</urlset>';
    return xml;
}

app.get('/sitemap.xml', function(req, res) {
    var sitemap = generate_xml_sitemap(); // get the dynamically generated XML sitemap
    res.header('Content-Type', 'text/xml');
    res.send(sitemap);
})

var zlib = require('zlib');
app.get('/sitemap.xml.gz', function(req, res) {
    // get the dynamically generated XML sitemap
    var sitemap = generate_xml_sitemap();
    // Set the appropriate HTTP headers to help old and new browsers equally to how to handle the output
    res.header('Content-Type: application/x-gzip');
    res.header('Content-Encoding: gzip');np
    res.header('Content-Disposition: attachment; filename="sitemap.xml.gz"');
    zlib.gzip(new Buffer(sitemap, 'utf8'), function(error, data) {
        res.send(data);
    });
});





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

