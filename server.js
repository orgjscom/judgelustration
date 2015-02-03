var express  = require('express');
//var mongoose = require('mongoose');
var http = require('http');
var path = require('path');
//var fs = require('fs');
//var json2xls = require('json2xls');
//var nodeExcel  = require('excel-export');
//var excelParser = require('excel-parser');


var app = express();


//app.engine('html', require('hogan-express'));
//app.set('view options', {layout: true});
//app.set('layout', 'layout');
//app.enable('view cache');
//app.set('port', process.env.PORT || 3000);
//app.set('view engine', 'html');
//app.use(express.favicon());
//app.use(express.logger('dev'));
//app.use(express.bodyParser());
//app.use(express.methodOverride());
//app.use(app.router);
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

//app.post('/login', function(req, res){
//    mongoose.model('users').find(function(err, users){
//        if(err){
//            res.json(err)
//        } else{
//            for(i = 0; i < users.length; i++){
//                var name = users[i]._doc.name;
//                var pass = users[i]._doc.pass;
//
//                if( name == "admin" && pass == "admin") {
//                    res.statusCode = 302;
//                    res.setHeader("adminLocation", "/admin");
////                    res.end();
//                    res.send(users);
//                }
//
//            }
//        }
//    })
//});


//var xls = require('excel');
//
//xls('data.xlsx', function(err, data) {
//    if(err) throw err;
//    // data is an array of arrays
//});





//app.get('/excel', function(req, res){


//var jsonArr = [{
//    foo: 'bar',
//    qux: 'moo',
//    poo: 123,
//    stux: new Date()
//},
//    {
//        foo: 'bar',
//        qux: 'moo',
//        poo: 345,
//        stux: new Date()
//    }];
//
//app.use(json2xls.middleware);
//
//app.get('/',function(req, res) {
//    json2xls('data.xlsx', jsonArr);
//});



//var jsonArr = [{
//    foo: 'bar',
//    qux: 'moo',
//    poo: 135675637356756,
//    stux: new Date()
//},
//    {
//        foo: 'bar',
//        qux: 'moo',
//        poo: 345,
//        stux: new Date()
//    }];
//
//app.use(json2xls.middleware);

//app.get('/',function(res) {
//    res.xls('www/data.xlsx', jsonArr);
//});


//});



//excelParser.worksheets({
//    inFile: 'data.xlsx'
//}, function(err, worksheets){
//    if(err) console.error(err);
//    console.log(worksheets);
//});




//var conf ={};
//conf.stylesXmlFile = "styles.xml";
//conf.cols = [{
//    caption:'string',
//    type:'string',
//    beforeCellWrite:function(row, cellData){
//        return cellData.toUpperCase();
//    },
//    width:28.7109375
//},{
//    caption:'date',
//    type:'date',
//    beforeCellWrite:function(){
//        var originDate = new Date(Date.UTC(1899,11,30));
//        return function(row, cellData, eOpt){
//            if (eOpt.rowNum%2){
//                eOpt.styleIndex = 1;
//            }
//            else{
//                eOpt.styleIndex = 2;
//            }
//            if (cellData === null){
//                eOpt.cellType = 'string';
//                return 'N/A';
//            } else
//                return (cellData - originDate) / (24 * 60 * 60 * 1000);
//        }
//    }()
//},{
//    caption:'bool',
//    type:'bool'
//},{
//    caption:'number',
//    type:'number'
//}];
//conf.rows = [
//    ['pi', new Date(Date.UTC(2013, 4, 1)), true, 3.14],
//    ["e", new Date(2012, 4, 1), false, 2.7182],
//    ["M&M<>'", new Date(Date.UTC(2013, 6, 9)), false, 1.61803],
//    ["null date", null, true, 1.414]
//];
//var result = nodeExcel.execute(conf);
//res.setHeader('Content-Type', 'application/vnd.openxmlformats');
//res.setHeader("Content-Disposition", "attachment; filename=" + "data.xlsx");
//res.end(result, 'binary');



//var json = {
//    foo: 'bar',
//    qux: 'moo',
//    poo: 123,
//    stux: new Date()
//};
//
//var xls = json2xls(json);
//
//fs.writeFileSync('data.xlsx', xls, 'binary');






http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});
