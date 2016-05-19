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

// эта твоя функция, о котой мы говорили, здесь будет например твой первый курсач
var yourFunc = require('./functions/func');

app.use(    logger('dev')      );
app.use(bodyParser.urlencoded({limit: '500mb', extended: true }));
app.use(    cookieParser()          );
app.use('/Images',express.static('Images'))
app.set('trust proxy');
app.set('view engine', 'jade');

app.route('/').get(function(req,res){
    res.render('index');
});
app.route('/new').get(function(req,res){
    res.render('newTable.jade');
});
app.route('/AboutUs').get(function(req,res){
    res.render('AboutUs.jade');
});
app.route('/Theory').get(function(req,res){
    res.render('Theory.jade');
});
app.route('/ClassicTheory').get(function(req,res){
    res.render('ClassicTheory.jade');
});
app.route('/ModernTheory').get(function(req,res){
    res.render('ModernTheory.jade');
});
app.route('/Feedback').get(function(req,res){
    res.render('Feedback.jade');
});
app.route('/Result').get(function(req,res){
    res.render('Result.jade');
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



    /* путь сам установишь! тут вызываем твою функцию и отправляем в нее, например то, что плучили из вне
    *  обычно это храниться в req.body - тело запроса пользователя
    *  как видишь первым аргументом мы передали тело, то есть внутри этой функции (она описана в стороннем файле) мы можешь ебать это
    *  тело
    *  и чтобы ебля имела конец и результат, мы заведомо создали функцию обратного вызова, которая вернет нам хоть что-то после ебли,
    *  а затем, проанализировав (в данном случае это if)  мы отдаем клиенту что-нить, в данном случае статус об ошибке/успешном выполении.
    */
    app.route('/ololo').get(function(req,res){
        yourFunc(req.body,function(result){
            if(result.error){
                res.sendStatus(403);
            }else{
                res.sendStatus(200);
            }
        })
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
