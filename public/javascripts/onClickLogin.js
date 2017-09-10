window.onload = prepareLogin;
function prepareLogin()
{
	if(!document.getElementById)
	{
		return false;
	}
	if(!document.getElementsByClassName)
	{
		return false;
	}
	if(!document.getElementById("panel_element_small1"))
	{
		return false;
	}
	var appointment = document.getElementsByClassName("appointment");
	for(var i = 0; i < appointment.length ; i++ ){
	appointment[i].onclick = function()
	{
		onClickLogin(this);
		acquire();
	};
}
}

function onClickLogin(whichbut){
	var room_id = whichbut.id.slice(0,3);
	var time_period =whichbut.id.slice(3,4);
	var xmlhttp;
	if (window.XMLHttpRequest)
		{
			//  IE7+, Firefox, Chrome, Opera, Safari 浏览器执行代码
			xmlhttp=new XMLHttpRequest();
		}
		else
		{
			// IE6, IE5 浏览器执行代码
			xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
		}
		xmlhttp.onreadystatechange = function()
		{
		  if (xmlhttp.readyState==4 && xmlhttp.status==200)
		  {
		  	//var logincontainer = document.getElementById("loign-container-001");
		  	//logincontainer.setAttribute("aria-hidden","false");
		    //var loginalert = document.getElementById("login-alert");
		    //loginalert.setAttribute("class","alert alert-danger alert-dismissable");
		    alert('预订成功！');
			}
		  };
		
		xmlhttp.open("POST","/appointing",true);
		xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
		xmlhttp.send("room_id="+room_id+"&"+"time_period="+time_period);
	}

