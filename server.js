/**
 * Created by Владимир on 03.05.2016.
 */
var express         =       require(    'express'       ),
    fs              =       require(    'fs'            ),
    multer          =       require(    'multer'        ),
    app             =       express(),
    logger          =       require(    'morgan'        ),
    bodyParser      =       require(    'body-parser'   ),
    cookieParser    =       require(    'cookie-parser' ),
    jade            =       require(    'jade'          );
var socket = require('engine.io-client')('ws://localhost:8080');
var orm = require("orm");

app.use(    logger('dev')      );
app.use(bodyParser.urlencoded({limit: '500mb', extended: true }));
app.use(    cookieParser()          );
app.set('trust proxy');
app.set('view engine', 'jade');

app.route('/').get(function(req,res){
    res.render('index');
});



    var mysql = require('mysql');
    var pool  = mysql.createPool({
        connectionLimit : 10,
        host            : 'localhost',
        user            : 'root',
        password        : '',
        database        : 'testservice'
    });

    pool.query('SELECT 1 + 1 AS solution', function(err, rows, fields) {
        if (err) throw err;

        console.log('The solution is: ', rows[0].solution);
    });

    app.route('/').get(function(req,res){
        res.render('NewTable');
});
//app.set(    'view engine', 'jade'                               );
//app.use(    express.static('file')  );
//app.use(    express.static('file/other')  );
//app.use(    express.static('node_modules/jquery/dist')  );
//app.use(    express.static('node_modules/backbone')  );
//app.use(    express.static('node_modules/requirejs')  );
//app.use(    '/file/js',             express.static('js')        );
//app.use(    '/file/js',             express.static('auth/js/')  );
//app.use(    '/file/css',            express.static('css')       );
//app.use(    '/file/other',          express.static('file')      );
//app.use(    '/file/img',            express.static('img')       );

//app.use(orm.express("mysql://root:poltava1100@prog-q.xyz/dverkoff", {
  //  define: function (db, models, next) {
    //    for(var i in DBShema(db)){
      //      models[i] = DBShema(db)[i];
       // }
        //next();
    //}
//}));

app.listen(9000);
console.log('server start!');
