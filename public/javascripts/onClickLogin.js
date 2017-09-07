//window.onload = prepareLogin();

function prepareLogin()
{
	if(!document.getElementById)
	{
		return false;
	}
	var Login = document.getElementById('login');
	Login.onclick = function(){
		return !onClickLogin();
};
}

function onClickLogin(){
	var username=document.getElementById("inputEmail3").value;
	var password=document.getElementById("inputPassword3").value;
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
		return xmlhttp.onreadystatechange=function()
		{
		  if (xmlhttp.readyState==4 && xmlhttp.status==200)
		  {
		  	if (xmlhttp.responseText == "invalid")
		  	{
		  	//var logincontainer = document.getElementById("loign-container-001");
		  	//logincontainer.setAttribute("aria-hidden","false");
		    var loginalert = document.getElementById("login-alert");
		    loginalert.setAttribute("class","alert alert-danger alert-dismissable");
		    return false
			}
		  }
		};
		xmlhttp.open("POST","/login",true);
		xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
		xmlhttp.send("username="+username+"&"+"password="+password);
};