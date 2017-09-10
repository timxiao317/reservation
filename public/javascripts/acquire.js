addLoadEvent(acquire);
function acquire()
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
	var username = document.getElementById("username").innerText;
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
		  	var result = JSON.parse(xmlhttp.responseText);
		  	for ( var i = 0 ; i < result.length; i ++ )
		  	{
		  		var id=result[i].room_id+result[i].time_period;
		  		var appointed = document.getElementById(id);
		  		var parent = appointed.parentNode.parentNode.parentNode.parentNode.parentNode;
		  		var progress = parent.getElementsByClassName("progress-bar");
		  		//alert(typeof(progress[0].style.width));
		  		//progress[0].style.width=progress[0].style.width + 0.11;
		  		if (username !== result[i].user_id & appointed.classList.contains("btn-info"))
		  		{
		  			appointed.classList.remove("btn-info");
		  			appointed.classList.add("btn-danger");
		  			appointed.classList.add("disabled");
		  			appointed.innerText = appointed.innerText +"（该时段已被预约）";
		  			var width = parseInt(progress[0].style.width);
		  			width = width - 10;
		  			if(width>20&width<70){
		  			progress[0].classList.remove("progress-bar-danger");
		  			progress[0].classList.remove("progress-bar-success");
		  			progress[0].classList.add("progress-bar-warning");
		  			}
		  			else if(width<=20){
		  			progress[0].classList.remove("progress-bar-success");
		  			progress[0].classList.remove("progress-bar-warning");
		  			progress[0].classList.add("progress-bar-danger");	
		  			}
		  			else {
		  				progress[0].classList.remove("progress-bar-danger");
		  				progress[0].classList.remove("progress-bar-warning");
		  				progress[0].classList.add("progress-bar-success");	
		  			}
		  			progress[0].style.width= width+"%";
		  			progress[0].innerText=((width)/10)+"/10";
		  		}
		  		else if (appointed.classList.contains("btn-info"))
		  		{
		  			appointed.classList.remove("btn-info");
		  			appointed.classList.add("btn-success");
		  			appointed.classList.add("disabled");
		  			appointed.innerText = appointed.innerText +"（您已预约该时段）";
		  			var width = parseInt(progress[0].style.width);
		  			width = width - 10;
		  			if(width>20&width<70){
		  			progress[0].classList.remove("progress-bar-danger");	
		  			progress[0].classList.remove("progress-bar-success");
		  			progress[0].classList.add("progress-bar-warning");
		  			}
		  			else if(width<=20){
		  			progress[0].classList.remove("progress-bar-success");
		  			progress[0].classList.remove("progress-bar-warning");
		  			progress[0].classList.add("progress-bar-danger");	
		  			}
		  			else {
		  				progress[0].classList.remove("progress-bar-danger");
		  				progress[0].classList.remove("progress-bar-warning");
		  				progress[0].classList.add("progress-bar-success");	
		  			}
		  			progress[0].style.width= width+"%";
		  			progress[0].innerText=((width)/10)+"/10";
		  		}
		  	}
			}
		  };
		
		xmlhttp.open("get","/acquire",true);
		xmlhttp.send();
}


