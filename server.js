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
    var mkdirp = require('mkdirp');
//var fileUpload      =       require('express-fileupload');
var app = express();
var upload = multer({ dest: 'Excel/' });


var socket = require('engine.io-client')('ws://localhost:8080');
var orm = require("orm");

// эта твоя функция, о котой мы говорили, здесь будет например твой первый курсач
var yourFunc = require('./functions/func');

app.use(    logger('dev')      );
app.use(bodyParser.urlencoded({limit: '500mb', extended: true }));
app.use(    cookieParser()          );
app.use('/Images',express.static('Images'));
//app.use('/Excel',express.static('Excel'));
//app.use(fileUpload());
app.set('trust proxy');
app.set('view engine', 'jade');


//дичь для заливания файликоов на серв


app.post('/Excel', upload.fields([{name: 'name'}, {name: 'sampleFile', maxCount: 1}]), function (req, res, next) {
    var img = req.files.sampleFile[0];
    var path = __dirname+"/ExcelResult";
    mkdirp(path,function (err) {
        if (err) return next(err);
        var newPath = path + '/' + img.originalname;
        fs.rename(img.path, newPath, function (err) {
            err ? res.sendStatus(400)
            :res.sendStatus(200);
        });
    });
    // req.file is the `avatar` file
    // req.body will hold the text fields, if there were any
});



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
app.route('/Check').get(function(req,res){
    res.render('CheckTest.jade');

});

    //var mysql = require('mysql');
    //var pool  = mysql.createPool({
    //    connectionLimit : 10,
    //    host            : 'localhost',
    //    user            : 'root',
    //    password        : '',
    //    database        : 'testservice'
    //});
    //
    //pool.query('SELECT 1 + 1 AS solution', function(err, rows, fields) {
    //    if (err) throw err;
    //
    //    console.log('The solution is: ', rows[0].solution);
    //});



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



app.listen(9000);
console.log('server start!');
