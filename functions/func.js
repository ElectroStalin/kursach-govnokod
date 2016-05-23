/**
 * Created by Владимир on 17.05.2016.
 */

var xlsx = require('node-xlsx');
var fs = require('fs');
module.exports = function(arg1, callback){




    var obj = xlsx.parse(fs.readFileSync('./ExcelResult/example3.xlsx'));


    function matrixArray(rows,columns){
        var arr = new Array();
        for(var i=0; i<columns; i++){
            arr[i] = new Array();
            for(var j=0; j<rows; j++){
                arr[i][j] = 0;
            }
        }
        return arr;
    }
    function round(a,b) {
        b = b || 0;
        return Math.round(a * Math.pow(10, b)) / Math.pow(10, b);
    }


    var eachStudentResault=new Array;
    var eachQuestionResault=new Array;

    //формирование массива с суммой результата каждого студента
    for(var i = 2;i<obj[0].data.length;i++){
        var sum = 0;

        for(var j in obj[0].data[i]){
            if(/[0-1]+/.test(obj[0].data[i][j]))
                sum += obj[0].data[i][j];
        }
        eachStudentResault.push(sum);
    }
    //формирование массива сколько студентов ответили на каждый вопрос
    for(var i = 2;i<obj[0].data[0].length;i++){
        var sum = 0;
        for(var j = 2;j<obj[0].data.length;j++){
            if(/[0-9]+/.test(obj[0].data[j][i]))sum += obj[0].data[j][i];
        }

        eachQuestionResault.push(sum);
    }

    var nomberOfStudents=eachStudentResault.length;
    var nomberOfQuestions=eachQuestionResault.length;
    arr = Array();testTable = Array();

    var testTable=matrixArray(nomberOfQuestions,nomberOfStudents);

    for(var i = 2;i<obj[0].data.length;i++){
        for(var j = 2;j<obj[0].data[i].length;j++){
            testTable[i-2][j-2]=obj[0].data[i][j];
        }
    }

    //считаем средние значения массивов
    var studentsAverageResault=0;
    var questionsAverageResault=0;

    for(var i=0; i<eachStudentResault.length; i++){
        studentsAverageResault+=eachStudentResault[i];
    }
    studentsAverageResault = Math.round(studentsAverageResault/eachStudentResault.length)
    for(var i=0; i<eachQuestionResault.length; i++){
        questionsAverageResault+=eachQuestionResault[i];
    }
    questionsAverageResault = Math.round(questionsAverageResault/eachQuestionResault.length);

    //Стандартное отклонение и дисперсия
    var dispersion=0;
    var standartDeviation=0;
    for(var i=0;i<eachStudentResault.length;i++){
        dispersion+=Math.pow((eachStudentResault[i]-studentsAverageResault),2);
    }
    dispersion=dispersion/(nomberOfStudents-1);
    standartDeviation=Math.sqrt(dispersion);


    //формула Кьюдера-Ричардсона(KR-20)
    var reliability=0;
    var sum=0;
    for(i=0;i<eachQuestionResault.length;i++){
        sum+=((eachQuestionResault[i]/eachStudentResault.length)*(1-eachQuestionResault[i]/eachStudentResault.length));
    }
    sum=1-(sum/dispersion);
    reliability=round(((eachQuestionResault.length/(eachQuestionResault.length-1))*sum),2);


    //матрица корреляции


    var both;
    var trueAnswersProportion=new Array();

    for (var i=0;i<nomberOfQuestions;i++){
        trueAnswersProportion[i]=eachQuestionResault[i]/nomberOfStudents;
    }

    var correlationMatrix=matrixArray(nomberOfQuestions,nomberOfQuestions);
    for (var i=0;i<nomberOfQuestions;i++){
        for(var j=0;j<nomberOfQuestions;j++){
            both=0;
            for (var k=0;k<nomberOfStudents;k++){
                if(testTable[k][i]==1 && testTable[k][j]==1){
                    both+=1;
                }
            }
            both=both/nomberOfStudents;

            correlationMatrix[i][j]=((both-(trueAnswersProportion[i]*trueAnswersProportion[j]))/
            (Math.sqrt(trueAnswersProportion[i]*trueAnswersProportion[j]*(1-trueAnswersProportion[i])*(1-trueAnswersProportion[j]))));
        }
    }

    for (var i=0;i<nomberOfQuestions;i++) {
        for (var j = 0; j < nomberOfQuestions; j++) {
            correlationMatrix[i][j] = round(correlationMatrix[i][j],3) ;
        }
    }


//Коэффициент Пирсона
    var rightAnswerAverageResault=new Array();
    var wrongAnswerAverageResault=new Array();
    var rightAnswerStudentsNomber=new Array();
    var wrongAnswerStudentsNomber=new Array();
    for (var i=0;i<nomberOfQuestions;i++){
        rightAnswerAverageResault[i]=0;
        wrongAnswerAverageResault[i]=0;
    }
    for(var i=0;i<testTable[0].length;i++){
        rightAnswerStudentsNomber[i]=0;
        wrongAnswerStudentsNomber[i]=0;
        for(var j=0;j<testTable.length;j++){
            if (/[1]/.test(testTable[j][i])){
                rightAnswerAverageResault[i]+=eachStudentResault[j];
                rightAnswerStudentsNomber[i]+=1;
            }else {
                wrongAnswerAverageResault[i]+=eachStudentResault[j];
                wrongAnswerStudentsNomber[i]+=1;
            }
        }
        rightAnswerAverageResault[i]=round(rightAnswerAverageResault[i]/rightAnswerStudentsNomber[i],3);
        wrongAnswerAverageResault[i]=round(wrongAnswerAverageResault[i]/wrongAnswerStudentsNomber[i],3);
    }

    var pointPirsonCoefficient=new Array();
    for(var i=0;i<nomberOfQuestions;i++){
        pointPirsonCoefficient[i]=((rightAnswerAverageResault[i]-wrongAnswerAverageResault[i])/standartDeviation)*
            (Math.sqrt((rightAnswerStudentsNomber[i]*wrongAnswerStudentsNomber[i])/(nomberOfStudents*(nomberOfStudents-1))));

    }
    for(var i=0;i<pointPirsonCoefficient.length;i++){
        pointPirsonCoefficient[i]= round(pointPirsonCoefficient[i],3);
    }
    console.log("таблица результатов. Строки-студенты;Столбцы-задание");
    console.log(testTable);
    console.log("Матрица Корреляции:")
    console.log(correlationMatrix);
    console.log('Корреляция заданий друг с другом не должна быть слишком высокой ≤0,3), иначе задания начинают дублировать' +
        ' друг друга. Если корреляция между двумя заданиями близка к 1, то одно из них лишнее.');
    console.log('Отрицательная корреляция задания с другими заданиями нежелательна. Если задание отрицательно коррелирует с ' +
        'большим количеством других заданий, то это означает, что исход ответов на него противоположен результатам по другим' +
        ' заданиям. По всей вероятности у такого задания либо имеются грубые ошибки в содержании и или оформлении, либо ' +
        'проверяются знания из другой предметной области');

    console.log("точечные бисериальные коэффициенты корреляции:");
    for (var i=0;i<pointPirsonCoefficient.length;i++){
        console.log((i+1)+"-е задание:"+pointPirsonCoefficient[i]);
    }

    console.log("Необходимо стремиться к тому, чтобы корреляция результатов по заданию и индивидуальными баллами была достаточно высокой," +
        "меньшей мере >0.5 "+"Если какое-либо задание отрицательно коррелирует с индивидуальными баллами (< 0), то такое задание подлежит удалению.")
    console.log("");
    console.log("Коэффициент альфа расчитанный по формуле Кьюдера-Ричардсона: "+reliability );
    console.log("> 0.9-очень хорошее ")
    console.log("> 0.8-хорошее");
    console.log("> 0.7-достаточное" );
    console.log("> 0.6-сомнительное " );
    console.log("> 0.5-плохое " );
    console.log("< 0.5-недостаточное");

    console.log("дисперсия: "+dispersion);
    console.log("стандартное отклонение: "+standartDeviation);
    callback({error:true,result:false});
};