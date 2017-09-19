addLoadEvent(prepareDelete);
function prepareDelete()
{
	if(!document.getElementById)
	{
		return false;
	}
	if(!document.getElementsByClassName)
	{
		return false;
	}
	var deleteApp = document.getElementsByClassName("deleteApp");
	for(var i = 0; i < deleteApp.length ; i++ ){
	deleteApp[i].onclick = function()
	{
		onClickDelete(this);
		myAppAcquire();
		acquire();
	};
}
}

function onClickDelete(whichbut){
	var number = whichbut.id.slice(6,8);
	number = parseInt(number);
	var td_room_id = document.getElementsByClassName("td_room_id");
	var td_time_period = document.getElementsByClassName("td_time_period");
	var td_day_reserve = document.getElementsByClassName("td_day_reserve");
	var room_id = td_room_id[number].getAttribute("value");
	var time_period = td_time_period[number].getAttribute("value");
	var day_reserve = td_day_reserve[number].getAttribute("value");
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
		    alert('删除成功！');
			}
		  };
		
		xmlhttp.open("POST","/deleteApp",true);
		xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
		xmlhttp.send("room_id="+room_id+"&day_reserve="+day_reserve+"&time_period="+time_period);
	}

