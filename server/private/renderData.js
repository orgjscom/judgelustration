exports.renderDataToAdmin = function(app) {

    var all  = "../www/all";
    app.get('/24', function(req, res){
        res.render(all, { "data": dataToWriteGlobal })
    });


};