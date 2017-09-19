var express = require('express');
var router = express.Router();
var mysql  = require('mysql'); 
var crypto = require('crypto');
var moment = require('moment');

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
		res.redirect('/main');
	}
  	else
  	{
  		console.log("notlogin  "+req.session.islogin);
  		res.render('index', {ishidden : 'hidden' });
  	}
});
router.get('/main', function(req, res, next) {
	if(req.session.user){
		username=req.session.user;
		console.log("mainislogin?"+"yes");
		res.render('main',{username: req.session.user});
	}
	else
		res.redirect('index');
});
router.get('/appointment', function(req, res, next) {
  	if(req.session.user){
		username=req.session.user;
		console.log("mainislogin?"+"yes");
		res.render('appointment',{username: req.session.user,Isactive1: 'active',Isactive2: ' ',Isactive3: ' '});
	}
	else
		res.redirect('index');
});
router.post('/login',function(req, res, next) {
  var user_id = req.body.username;
  //console.log(crypto.getHashes()); //打印支持的hash算法
  var password = crypto.createHash('md5').update(req.body.password).digest('hex');
  var sql = 'Select password From users where user_id = ?';
  var sqlparams = [user_id];
  
  connection.query(sql,sqlparams,function (err, result) {
        if(err){
          console.log('[SELECT ERROR] - ',err.message);
          res.render("/index");
          return ;
        }
        if(result.length<1)
        {
        	req.isWrong = 1;
        	console.log('No such user!');
        	res.render("index",{ishidden: " " });
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
	    	res.render("index",{ishidden: " " });
	    }
   	    }
       );
});
router.post('/appointing',function(req,res,next){
	//day_reserve = moment().format('YYYY-MM-DD');
	day_reserve = req.body.day_reserve;
	var room_id = req.body.room_id;
	var time_period = req.body.time_period;
	var user_id = req.session.user;
	var sqlparams = [user_id,room_id,day_reserve,time_period];
	var sql = 'insert into users_rooms (user_id,room_id,day_reserve,time_period) values(?,?,?,?)';
	console.log("insert information:"+sqlparams);
	connection.query(sql,sqlparams,function(err,result){
		if(err){
		  console.log('[INSERT ERROR] - ',err.message);
		  return ;
		}
		  else 
		  	console.log('insert successed!');
		  	res.send('200');
	});
});
router.post('/acquire',function(req,res,next){
	day_reserve = req.body.day_reserve;
	//console.log(day_reserve);
	//day_reserve = day_reserve.format('YYYY-MM-DD');
	sqlparams = [day_reserve];
	console.log("acquire"+day_reserve);
	sql = 'Select user_id,room_id,time_period from users_rooms where day_reserve = ?;';
	connection.query(sql,sqlparams,function(err,result){
		if(err){
		  console.log('[SELECT ERROR] - ',err.message);
		  return ;
		}
		res.send(result);
	});
});
router.get('/logout',function(req,res,next){
	req.session.user = 0;
	res.redirect('index');
});
router.get('/lock',function(req,res,next){
	var physical = req.query.physical_id;
	var room = req.query.room_id;
	console.log({physical_id:physical,room_id: room});
	var sql = 'Select day_reserve,time_period from users_rooms natural join users where physical_id= ? and room_id = ? ';
	var sqlparams = [physical,room];
	var current_date = moment().format('YYYY-MM-DD');
	var current_hour = moment().format('hh');
	var judge = 0;
	//console.log(current_date);
	//console.log(current_hour);
	connection.query(sql,sqlparams,function(err,result){
		if(err){
		  console.log('[SELECT ERROR] - ',err.message);
		  return ;
		}
		console.log("possible appointment"+result);
		record_time = new Date();
		if(result.length<1)
			res.send('0');
		else
		{
			for (var i = 0; i<result.length; i++)
			{
				var day_reserve = new Date(result[i].day_reserve);
				day_reserve = moment(day_reserve);
				var gap_date = moment().diff(day_reserve);
				console.log("gap_time:"+gap_date);
				var time_period = result[i].time_period;
				if (time_period==="a"&gap_date>=0&gap_date<=32400000)/*28800000*/
					{
						res.send('1');
						judge = '1';
						break;
					}
				else if (time_period==="b"&gap_date>=32400000&gap_date<=36000000)
					{
						res.send('1');
						judge = '1';
						break;
					}
				else if (time_period==="c"&gap_date>=36000000&gap_date<=39600000)
					{
						res.send('1');
						judge = '1';
						break;
					}
				else if (time_period==="d"&gap_date>=39600000&gap_date<=43200000)
					{
						res.send('1');
						judge = '1';
						break;
					}
				else if (time_period==="e"&gap_date>=46800000&gap_date<=5040000)
					{
						res.send('1');
						judge = '1';
						break;
					}
				else if (time_period==="f"&gap_date>=50400000&gap_date<=54000000)
					{
						res.send('1');
						judge = '1';
						break;
					}
				else if (time_period==="g"&gap_date>=54000000&gap_date<=57600000)
					{
						res.send('1');
						judge = '1';
						break;
					}
				else if (time_period==="h"&gap_date>=57600000&gap_date<=61200000)
					{
						res.send('1');
						judge = '1';
						break;
					}
				else if (time_period==="i"&gap_date>=61200000&gap_date<=64800000)
					{
						res.send('1');
						judge = '1';
						break;
					}
				else if (time_period==="j"&gap_date>=64800000&gap_date<=68400000)
					{
						res.send('1');
						judge = '1';
						break; 
					}
				else if (time_period==="k"&gap_date>=68400000&gap_date<=72000000)
					{
						res.send('1');
						judge = '1';
						break;
					}
			}
			if(judge == 0)
			{
				res.send('0');
			}
		}
		sql1 = 'Select user_id from users where physical_id=?';
		sqlparams1 = [physical];
		connection.query(sql1,sqlparams1,function(err1,result1){
			  if(err1){
			  console.log('[SELECT ERROR] - ',err1.message);
			  return ;
			}
		if(result.length<1){
			var user_id = "unregistered user";
		}
		else{
		var user_id = result1[0].user_id;
	}
		var access;
		sql2 = 'Insert into records (user_id,room_id,record_time,access,day_reserve) values(?,?,?,?,?)';
		if (judge == '0'){
		access = 'N';
			}
		else {
			access = 'Y';
		}
		var now = new Date();
		 var nowYear = now.getFullYear();    
		 var nowMonth= now.getMonth()+1;
		 if(nowMonth<10)
		 {
		      nowMonth = "0"+nowMonth;
		 }
		 var nowDate = now.getDate();
		 now = nowYear+"-"+nowMonth+"-"+nowDate;
		sqlparams2 = [user_id,room,record_time,access,now];
		console.log("insert record："+sqlparams2);
		connection.query(sql2,sqlparams2,function(err2,result2){
		  if(err2){
		  console.log('[SELECT ERROR] - ',err2.message);
		  return ;
		}
		console.log('insert complete');
		});
	});
	});
});
router.get('/test',function(req,res,next){
	var sql = 'Select day_reserve,time_period from users_rooms';
	connection.query(sql,function(err,result){
		if(err){
			console.log('[SELECT ERROR] - ',err.message);
			return;
		}
		console.log(result[0]);
		var day_reserve = new Date(result[0].day_reserve);
		day_reserve = moment(day_reserve);
		var gap_date = moment().diff(day_reserve);
		console.log(gap_date);
		}
	);
});
router.get('/admin',function(req,res,next){
		if(req.session.user){
			console.log("islogin?"+"yes");
			res.redirect('/adminMain');
		}
	  	else
	  	{
	  		console.log("notlogin  "+req.session.islogin);
	  		res.render('admin', {ishidden : 'hidden' });
	  	}
});
router.post('/adminlogin',function(req, res, next) {
  var admin_id = req.body.username;
  //console.log(crypto.getHashes()); //打印支持的hash算法
  var password = crypto.createHash('md5').update(req.body.password).digest('hex');
  var sql = 'Select password From admins where admin_id = ?';
  var sqlparams = [admin_id];
  
  connection.query(sql,sqlparams,function (err, result) {
        if(err){
          console.log('[SELECT ERROR] - ',err.message);
          res.render("admin");
          return ;
        }
        if(result.length<1)
        {
        	req.isWrong = 1;
        	console.log('No such user!');
        	res.render("admin",{ishidden: " " });
        }
        else if(result[0].password == password)
        {
        	req.session.admin = admin_id;
        	console.log("user="+req.session.user);
        	res.redirect("/adminMain");
	    }
	    else 
	    {
	    	req.isWrong = 1;
	    	console.log(password+"   "+result[0].password);
	    	res.render("admin",{ishidden: " " });
	    }
   	    }
       );
});
router.get('/adminMain', function(req, res, next) {
	if(req.session.admin){
		username=req.session.admin;
		console.log("adminMainislogin?"+"yes");
		res.render('adminMain',{username: req.session.admin});
	}
	else
		res.redirect('admin');
});
router.get('/appointment2', function(req, res, next) {
  	if(req.session.user){
		username=req.session.user;
		console.log("mainislogin?"+"yes");
		res.render('appointment',{username: req.session.user, Isactive1: ' ', Isactive2: 'active', Isactive3: ' '});
	}
	else
		res.redirect('index');
});
router.get('/appointment3', function(req, res, next) {
  	if(req.session.user){
		username=req.session.user;
		console.log("mainislogin?"+"yes");
		res.render('appointment',{username: req.session.user, Isactive1: ' ', Isactive2: ' ', Isactive3: 'active'});
	}
	else
		res.redirect('index');
});
router.post('/adminAppAcquire',function(req,res,next){
	var day_reserve = req.body.day_reserve;
	//console.log(day_reserve);
	//day_reserve = day_reserve.format('YYYY-MM-DD');
	var sqlparams = [day_reserve];
	console.log("adminAppAcquire day_reserve= "+day_reserve);
	var sql = 'Select * from users_rooms where day_reserve = ? order by room_id;';
	connection.query(sql,sqlparams,function(err,result){
		if(err){
		  console.log('[SELECT ERROR] - ',err.message);
		  return ;
		}
		res.send(result);
	});
});
router.post('/deleteApp',function(req,res,next){
	var sql='delete from users_rooms where room_id= ? and day_reserve= ? and time_period= ?  ;';
	var day_reserve = req.body.day_reserve;
	var time_period = req.body.time_period;
	var room_id = req.body.room_id;
	var sqlparams =[room_id,day_reserve,time_period];
	console.log(sqlparams);
	connection.query(sql,sqlparams,function(err,result){
		if(err){
		  console.log('[DELETE ERROR] - ',err.message);
		  return ;
		}
		  else 
		  	console.log('delete successed!');
		  	res.send('200');
		  });
});
router.get('/adminRecords',function(req,res,next){
	  	if(req.session.admin){
			username=req.session.admin;
			console.log("mainislogin?"+"yes");
			res.render('adminRecords',{username: req.session.admin});
		}
		else
			res.redirect('admin');
});	
router.get('/adminUsers',function(req,res,next){
	  	if(req.session.admin){
			username=req.session.admin;
			console.log("mainislogin?"+"yes");
			res.render('adminUsers',{username: req.session.admin});
		}
		else
			res.redirect('admin');
});	
router.post('/adminRecordsAcquire',function(req,res,next){
	day_reserve = req.body.day_reserve;
	//console.log(day_reserve);
	//day_reserve = day_reserve.format('YYYY-MM-DD');
	sqlparams = [day_reserve];
	console.log("adminAppAcquire day_reserve= "+day_reserve);
	sql = 'Select * from records where day_reserve = ? order by room_id;';
	connection.query(sql,sqlparams,function(err,result){
		if(err){
		  console.log('[SELECT ERROR] - ',err.message);
		  return ;
		}
		res.send(result);
	});
});
router.get('/getUsers',function(req,res,next){
	var	sql = 'Select * from users order by user_id;';
	connection.query(sql,sqlparams,function(err,result){
		if(err){
		  console.log('[SELECT ERROR] - ',err.message);
		  return ;
		}
		res.send(result);
	});
});
router.post('/myAppAcquire',function(req,res,next){
	console.log('1');
		var user_id = req.body.user_id;
	//console.log(day_reserve);
	//day_reserve = day_reserve.format('YYYY-MM-DD');
	var sqlparams = [user_id];
	console.log("myAppAcquire user_id= "+user_id);
	sql = 'Select * from users_rooms where user_id = ? order by day_reserve;';
	connection.query(sql,sqlparams,function(err,result){
		if(err){
		  console.log('[SELECT ERROR] - ',err.message);
		  return ;
		}
		console.log(result);
		res.send(result);
	});
});
module.exports = router;
	