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
		  		var record_time = new Date(result[i].record_time);
		  		table.innerHTML=table.innerHTML+'<tr><td class="td_room_id" value='+result[i].room_id+'>会议室'+result[i].room_id+'</td><td>'+
		  		result[i].user_id+'</td><td class="td_time_period" value='+record_time+'>'+record_time+
		  		'</td><td>'+result[i].access+'</td></tr>';
		  	}
			}
		  };
		
		//xmlhttp.open("get","/acquire",true);
		//xmlhttp.send();
		xmlhttp.open("POST","/adminRecordsAcquire",true);
		xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
		xmlhttp.send("day_reserve="+day_reserve);
}
