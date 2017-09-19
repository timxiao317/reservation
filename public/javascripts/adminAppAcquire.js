addLoadEvent(adminAppAcquire);
function adminAppAcquire()
{
	if(!document.getElementById)
	{
		return false;
	}
	if(!document.getElementsByClassName)
	{
		return false;
	}
	var xmlhttp;
	var day_reserve = document.getElementById("currentDate").innerText;
	var table = document.getElementById("adminTable");
	table.innerHTML="";
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
		  	var result = JSON.parse(xmlhttp.responseText);
		  	for ( var i = 0 ; i < result.length; i ++ )
		  	{
		  		if(result[i].time_period=="a"){
		  			time_period="8:00-9:00";
		  		}
		  		else if(result[i].time_period=="b"){
		  			time_period="9:00-10:00";
		  		}
		  		else if(result[i].time_period=="c"){
		  			time_period="10:00-11:00";
		  		}
		  		else if(result[i].time_period=="d"){
		  			time_period="11:00-12:00";
		  		}
		  		else if(result[i].time_period=="e"){
		  			time_period="13:00-14:00";
		  		}
		  		else if(result[i].time_period=="f"){
		  			time_period="14:00-15:00";
		  		}
		  		else if(result[i].time_period=="g"){
		  			time_period="15:00-16:00";
		  		}
		  		else if(result[i].time_period=="h"){
		  			time_period="16:00-17:00";
		  		}
		  		else if(result[i].time_period=="i"){
		  			time_period="17:00-18:00";
		  		}
		  		else if(result[i].time_period=="j"){
		  			time_period="18:00-19:00";
		  		}
		  		else if(result[i].time_period=="k"){
		  			time_period="19:00-20:00";
		  		}
		  		table.innerHTML=table.innerHTML+'<tr><td class="td_room_id" value='+result[i].room_id+'>会议室'+result[i].room_id+'</td><td>'+
		  		result[i].user_id+'</td><td class="td_time_period" value='+result[i].time_period+'>'+time_period+
		  		'</td><td><a type="button" class="btn btn-danger deleteApp" id="delete'+i+'">'
		  		+'删除订单</a></td></tr>';
		  	}
		  	prepareDelete();
			}
		  };
		
		//xmlhttp.open("get","/acquire",true);
		//xmlhttp.send();
		xmlhttp.open("POST","/adminAppAcquire",true);
		xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
		xmlhttp.send("day_reserve="+day_reserve);
}
