exports.xml = function(app){

    function generate_xml_sitemap() {
        // this is the source of the URLs on your site, in this case we use a simple array, actually it could come from the database
        var urls = ['index.html'];
        // the root of your website - the protocol and the domain name with a trailing slash
        var root_path = 'http://judgelustration.com.ua/';
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
}