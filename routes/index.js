var express = require('express');
var router = express.Router();
var mysql  = require('mysql'); 
var crypto = require('crypto');

/*md5加密*/
var md5 = crypto.createHash('md5');
/*mysql连接*/
var connection = mysql.createConnection({     
  host     : 'localhost',       
  user     : 'root',              
  password : '31756581021',       
  port: '3306',                   
  database: 'reservation', 
}); 

connection.connect();

/* GET home page. */
router.get('/', function(req, res, next) {

  res.redirect('/index');
});
router.get('/index', function(req, res, next) {
	if(req.session.user){
		console.log("islogin?"+"yes");
		res.render('main',{});
	}
  	else
  	{
  		console.log("notlogin  "+req.session.islogin);
  		res.render('index', {ishidden : 'hidden' });
  	}

});
router.get('/main', function(req, res, next) {
	if(req.session.user){
		console.log("mainislogin?"+"yes");
		res.render('main',{});
	}
	else
		res.redirect('index');
});
router.get('/appointment', function(req, res, next) {
  res.render('appointment', { title: 'express' });
});
router.post('/login',function(req, res, next) {
  var user_id = req.body.username;
  //console.log(crypto.getHashes()); //打印支持的hash算法
  var password = crypto.createHash('md5').update(req.body.password).digest('hex');
  var sql = 'Select password From Users where user_id = ?';
  var sqlparams = [user_id];
  
  connection.query(sql,sqlparams,function (err, result) {
        if(err){
          console.log('[SELECT ERROR] - ',err.message);
          res.render("/index");
          return ;
        }
        else if(result[0].password == password)
        {
        	req.session.user = user_id;
        	console.log("user="+req.session.user);
        	res.redirect("/main");
	    }
	    else 
	    {
	    	req.isWrong = 1;
	    	console.log(password+"   "+result[0].password);
	    	res.render("index",{ishidden: " "});
	    }
   	    }
       );
      });



module.exports = router;
