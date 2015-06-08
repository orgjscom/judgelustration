var express  = require('express');
var http = require('http');
var path = require('path');
var fs = require('fs');
var json2xls = require('json2xls');
var nodemailer = require('nodemailer');
var app = express();


var transporter = nodemailer.createTransport( {
    host: "mx1.hostinger.com.ua",
    secureConnection: true,
    port: 2525,
    auth: {
        user: 'admin@blagoustriy.net',
        pass: '11111111'
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



    /**
     *
     * @type {string}
     */
    var htmlMgs =
        "<hr>Повідомлення - "	        + sendObj.message +
        "<hr>№ справи або рішення - "	+ sendObj.number  +
        "<hr>Контакти - "	            + sendObj.contact +
        '<hr><b><a href="http://judgelustration.herokuapp.com/24">переглнути таблицю judgelustration</a></b>' +
        '<hr><b><a href="http://judgelustration.herokuapp.com/">перейти на головну judgelustration</a></b>' +
        '<hr><b><a href="http://judgelustration.herokuapp.com/ok/data.xlsx">скачати EXCEL judgelustration</a></b>';

    /**
     *
     * @type {{from: string, to: string, subject: string, text: string, html: string}}
     */
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
        } else{
            console.log('Message sent: ' + info.response + mailOptions.html);
        }
    });

};



http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});

