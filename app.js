//var QRCode = require('qrcode');
//var mysql      = require('mysql');
const pg = require('pg');
var express = require('express');
var bcrypt = require('bcrypt-nodejs');


const client = new pg.Client('postgres://Peterbaelish:Peterbaelish@career-db1.cf0mwyqxc0sp.us-east-2.rds.amazonaws.com:5432/careerdb1');

// client.connect(function(err) {
//     if(err) {
//         return console.error('could not connect to postgres', err);
//     }
//     client.query('SELECT * FROM student', function(err, result) {
//         if(err) {
//             return console.error('error running query', err);
//         }
//         console.log(result.rows[0]);
//         //output: Tue Jan 15 2013 19:12:47 GMT-600 (CST)
//         client.end();
//     });
// });


var app = express();
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));


/*app.get('/student_details', );*/

app.get('/getqueuelist',function (req,resp) {
   var id = req.params.id;
    client.connect(function(err){
        if(err) {
            return console.error('could not connect to postgres', err);
        }
        client.query('SELECT id,companylist FROM student WHERE id='+username, function (err, result) {
            if(err){
                return console.error('error running query', err);
            }


            var clist = result.rows[0].companylist;
            var res = "{";
            if(clist != null || clist.length == 0){
                for(var comp in clist){
                    getNumberInQueue(cname, sid, function (cname, index) {
                        res += "\""+cname+"\":\""+index+"\",";

                    })
                }
            }
        });
    });


});


function getNumberInQueue(cname, sid, callback){
    client.connect(function(err){
        if(err) {
            return console.error('could not connect to postgres', err);
        }
        client.query('SELECT studlist, email, index FROM recruiter WHERE email='+cname, function (err, result) {
            if(err){
                return console.error('error running query', err);
            }


            var slist = result.rows[0].studlist;
            var index = result.rows[0].index;
            var email = result.rows[0].email;
            var res = "";
            if(slist != null || slist.length == 0){
                for(var i = index; i < slist.length; i++){
                    if(slist[i] == sid){
                        callback(email, i+1);
                    }
                }
            }
        });
    });
}

app.post('/save_student', function (req, res) {
    /*console.log(req.body);*/
    var id = req.body.id;
    var fname = req.body.fname;
    var lname = req.body.lname;
    var email = req.body.email;
    var password = bcrypt.hashSync(req.body.password);
   /* console.log(bcrypt.hashSync(req.body.password));
    console.log("till this it is fine" + id + " " + fname);*/
    //getQRCode(id, function (qrcode) {
    console.log(id + " " + fname + " " + lname + " " + email + " ");
    client.connect(function(err) {
        if(err) {
            return console.error('could not connect to postgres', err);
        }
        client.query('INSERT INTO student (id, first_name, last_name, qr_url, email, password) VALUES($1, $2, $3, $4, $5, $6)',[id, fname, lname,null,email,password], function (err, result) {
        if(err){
          res.json("{\"result\":\"fail\"}");
        }
        res.json("{\"result\":\"success\"}");
        });
    });
    //});

});

app.post('/save_recruiter', function (req,res) {
    var fname = req.body.fname;
    var lname = req.body.lname;
    var email = req.body.email;
    var password = bcrypt.hashSync(req.body.password);
    var cname = req.body.cname;
    /* console.log(bcrypt.hashSync(req.body.password));
     console.log("till this it is fine" + id + " " + fname);*/
    //getQRCode(id, function (qrcode) {
        client.connect(function(err) {

            if(err) {
                return console.error('could not connect to postgres', err);
            }

            client.query('INSERT INTO student (email, first_name, last_name, qr_url, cname, password) VALUES($1, $2, $3, $4, $5, $6)',[email, fname, lname,null,cname,password]);

        });
    //});

});

app.get('/login', function (req, res) {
    var username = req.query.username;
    var password = req.query.password;
    var isStudent = req.query.isStudent;

    if(isStudent){
        client.connect(function(err){
            if(err) {
                return console.error('could not connect to postgres', err);
            }
            client.query('SELECT id,first_name,last_name,email,password FROM student WHERE id='+username, function (err, result) {
                if(err){
                    return console.error('error running query', err);
                }

                var hash = result.rows[0].password;
                if(hash){
                    if(bcrypt.compareSync(password, hash)){
                        res.json({id:result.rows[0].id, fname:result.rows[0].first_name, lname:result.rows[0].last_name, email:result.rows[0].email});
                    }
                    else{
                        res.json({error: 'Invalid username or password'});
                    }
                }
            });
        });
    }
    else{
        client.connect(function(err){
            if(err) {
                return console.error('could not connect to postgres', err);
            }
            client.query('SELECT first_name,last_name,email,password,cname FROM recruiter WHERE email='+username, function (err, result) {
                if(err){
                    return console.error('error running query', err);
                }

                var hash = result.rows[0].password;
                if(hash){
                    if(bcrypt.compareSync(password, hash)){
                        res.json({fname:result.rows[0].first_name, lname:result.rows[0].last_name, email:result.rows[0].email,cname:result.rows[0].cname});
                    }
                    else{
                        res.json({error: 'Invalid username or password'});
                    }
                }
            });
        });
    }

});

/*apt.get('/login', function (req, res){
   var username = req.query.username;
   var password = req.query.password;
   var isStudent = req.query.student;

   if(isStudent){
       client.connect(function(err) {
           if(err) {
               return console.error('could not connect to postgres', err);
           }
           client.query('SELECT password FROM student WHERE id='+username, function(err, result) {
               if(err) {
                   return console.error('error running query', err);
               }
               var hash = result.rows[0];
               if(hash){
                   if(bcrypt.compareSync(password, hash)){

                   }
                   else{

                   }
               }
           }

           //output: Tue Jan 15 2013 19:12:47 GMT-600 (CST)
           client.end();
       });
   }


});*/

const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
console.log('Press Ctrl+C to quit.');
});


// function getQRCode(id, callback){
//     QRCode.toDataURL(id.toString(), function (err, url) {
//         return callback(url);
//     });
// }


/*var segs = [{name: 'sam', email: 'sss'}];

QRCode.toDataURL('9999999999', function (err, url) {
    console.log(url)
})*/
