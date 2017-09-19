window.onload=adminUsersAcquire;
function adminUsersAcquire()
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
		  		
		  		table.innerHTML=table.innerHTML+'<tr><td>'+result[i].user_id+'</td><td>'+
		  		result[i].password+'</td><td>'+result[i].physical_id+
		  		'</td><td>'+result[i].card_id+'</td></tr>'
		  	}
			}
		  };
		
		//xmlhttp.open("get","/acquire",true);
		//xmlhttp.send();
		xmlhttp.open("get","/getUsers",true);
		xmlhttp.send();
}
