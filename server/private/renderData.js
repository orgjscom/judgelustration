exports.renderDataToAdmin = function(app, dataToWriteGlobal) {

    var all  = "../www/all";
    app.get('/24', function(req, res){
        res.render(all, { "data": dataToWriteGlobal })
    });


};