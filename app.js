// ==== CONFIGURATION ==========================================================
var port = 8080;
var password; // TEMPORARY - ONLY FOR TESTING UNTIL HTTPS IS FINISHED
// ==== DON'T EDIT ANYTHING BELOW THIS LINE ====================================



//==== CHIRP APP ===============================================================
/*
 *  This file provides configuration and implementation of a nodejs web server.
 *  This is the "entry point" for this project.
 *  To run the server, execute the following command:
 *      node app.js
 *
 *  You can then access the web client at http://localhost:port
 *      where 'port' is the number specified in the above configuration.
 */
//==============================================================================



// ==== APP REQUIREMENTS + GLOBAL VALUES =======================================
var fileSystem  = require("fs");
var connect     = require("connect");
var serveStatic = require('serve-static');
var bodyParser  = require('body-parser');
//var favicon     = require('serve-favicon');
var cherpPath   = 'cherp';
// =============================================================================



// ==== CONFIGURE APP ROUTES ===================================================
var app = connect();
//app.use(favicon(__dirname + '/public/rsc/img/favicon.ico'));
app.use('/', serveStatic(__dirname+'/public', {'index': ['index.html', 'index.htm']}));
app.use('/cherp', bodyParser.urlencoded({ extended: false }))
app.use('/cherp', function (request, response, next){
    switch (request.method) {
    case 'GET':
        // TODO: Require Authentication
        response.setHeader('Content-Type', 'application/json');
        fileSystem.readFile(cherpPath, 'utf8', function (error, data){
            // TODO: Handle read errors, perhaps with 500 level http code.
            //response.end(data);
            response.end();
        });
        break;
    case 'POST':
        var cherpText = request.body.derp;
        app.saveCherp(cherpText);
        response.writeHead(303, {Location: '/thanks.html?cherp='+encodeURIComponent(cherpText)});
        response.end();
        break;
    default:
        response.writeHead(405);
        response.end('Error 405: Method not supported.');
    }
});
// TEMPORARY - ONLY FOR TESTING PURPOSES UNTIL HTTPS SUPPORT IS FINISHED
app.use('/'+password, function (request, response, next){
    if(request.method !== 'GET'){
        response.writeHead(405);
        response.end('Error 405: Method not supported.');
    } else{
        // TODO: Require Authentication
        response.setHeader('Content-Type', 'application/json');
        fileSystem.readFile(cherpPath, 'utf8', function (error, data){
            // TODO: Handle read errors, perhaps with 500 level http code.
            response.end(data);
        });
    }
});
// =============================================================================



// =============================================================================
app.saveCherp = function (cherpText, callback){
    var escapedCherp = JSON.stringify(cherpText)+',';
    fileSystem.appendFile(cherpPath, escapedCherp, 'utf8');
}
// =============================================================================



// ==== RUN TESTS AND START SERVER =============================================
    app.listen(port);
    console.log('Cherp Server Started on port '+port+'.')
// =============================================================================


