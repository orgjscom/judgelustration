exports.funcSendEmail = function(sendObj){
    var nodemailer = require('nodemailer');
 //dataToWriteGlobal = JSON.stringify(jsonObj);

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
        from: 'Люстрація суддів judgelustration.com.ua ✔ <judgelustration.com.ua>',
        to: 'san4osq@ya.ru, yura.makedon@gmail.com, vgavdeev@gmail.com',
       // to: 'vgavdeev@gmail.com',
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