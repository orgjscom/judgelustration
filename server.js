var express  = require('express');
var http = require('http');
var path = require('path');
var fs = require('fs');
var json2xls = require('json2xls');
var nodemailer = require('nodemailer');
var app = express();

var transporter = nodemailer.createTransport( {
    host: "smtp.gmail.com",
    secureConnection: true,
    port: 587,
    auth: {
        user: 'judgelustration@gmail.com',
        pass: 'Dshtrih2'
    }
});

app.engine('html', require('hogan-express'));
app.set('view options', {layout: true});
app.set('layout', 'layout');
app.enable('view cache');
app.set('port', process.env.PORT || 5000);
app.set('view engine', 'html');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'www')));

/**
 *
 * @type {string}
 */
var index  = "../www/index";

app.get('/', function(req, res){
    res.render(index)
});

/**
 *
 * @type {string}
 */
var getQuestion  = "../www/question";
app.get('/question', function(req, res){
    res.render(question, { "question": question })
});
/**
 *
 * @type {{}}
 */
var sendObj = {};

app.post('/send', function(req, res){
    /**
     *
     * @type {{message: *, number: (*|data.number|number|res.fields.number|qt.number|Ht.number), contact: (*|Document.contact)}}
     */
    sendObj = {
        "message" :  req.body.message,
        "number"  :  req.body.number,
        "contact" :  req.body.contact
    };

    funcWriteJson(sendObj, res);

    try{
        funcSendEmail(sendObj)
    } catch(e){
        console.log(e)
    }

    res.writeHead(302, {
        'Location': '/'
    });
    res.end();
});
/**
 *
 * @type {Array}
 */
var dataToWriteGlobal = [];
/**
 *
 * @type {string}
 */
var url = 'www/ok/data.json';
var readFile = fs.readFileSync( url );
var jsonObj = JSON.parse( readFile );
/**
 *
 * @type {Array}
 */
var arr = [];
for( var i = 0; i < jsonObj.length; i++){
    arr.push(JSON.stringify(jsonObj[i]))
}
/**
 *
 * @param sendObj
 * @param res
 */
var funcWriteJson = function(sendObj, res){
    arr.push(JSON.stringify(sendObj));
    /**
     *
     * @type {string}
     */
    var dataToWrite = "[" + arr + "]";
    fs.writeFileSync( url , dataToWrite );
    dataToWriteGlobal = JSON.stringify(jsonObj);
    dataToWriteNewFunc(dataToWrite);
    funcWriteExcel(dataToWrite, res);
};


dataToWriteGlobal = JSON.stringify(jsonObj);

/**
 *
 * @param dataToWrite
 * @param res
 */
var funcWriteExcel = function(dataToWrite, res){

    var data = JSON.parse(dataToWrite);

    /**
     *
     * @type {*|exports}
     */
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

/**
 *
 * @param dataToWrite
 * @returns {*}
 */
var dataToWriteNewFunc = function(dataToWrite){
    return dataToWrite;
};

/**
 *
 * @type {string}
 */
var all  = "../www/all";

app.get('/24', function(req, res){
    res.render(all, { "data": dataToWriteGlobal })
});

/**
 *
 * @param sendObj
 */
var funcSendEmail = function(sendObj) {


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


//var sitemap = require('./server/xml/xml');
//sitemap.xml(app)


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
//
//var admin  = "../www/admin/admin";
//app.get('/admin', function(req, res){
//    res.render(admin)
//    mongoose.model('users').find(function(err, users){
//        res.send(users);
//    });
//});

