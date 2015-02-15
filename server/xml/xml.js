exports.xml = function(app){

    var sm = require('sitemap');
    var  sitemap = sm.createSitemap ({
        hostname: 'http://judgelustration.com.ua',
        cacheTime: 600000,        // 600 sec - cache purge period
        urls: [
            { url: '/index.html/',  changefreq: 'daily', priority: 0.3 }
//            ,
//            { url: '/page-2/',  changefreq: 'monthly',  priority: 0.7 },
//            { url: '/page-3/' }     // changefreq: 'weekly',  priority: 0.5
        ]
    });
    app.get('/sitemap.xml', function(req, res) {
        sitemap.toXML( function (xml) {
            res.header('Content-Type', 'application/xml');
            res.send( xml );
        });
    });

}