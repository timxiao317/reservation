window.onload = prepareDate;

function prepareDate(){
 var now = new Date();
 var nowYear = now.getFullYear();    
 var nowMonth= now.getMonth()+1;
 if(nowMonth<10)
 {
      nowMonth = "0"+nowMonth;
 }
 var nowDate = now.getDate();
 now = nowYear+"-"+nowMonth+"-"+nowDate;
 //alert(now);
 document.getElementById("currentDate").innerText=now;
 $(".form_datetime").datetimepicker({
 format: "yyyy-mm-dd",
 autoclose: true,
 todayBtn: true,
 startDate: today = new Date(),
 todayHighlight: true,
 showMeridian: true,
 pickerPosition: "bottom-left",
 language: 'zh-CN',//中文，需要引用zh-CN.js包
 startView: 2,//月视图
 minView: 2//日期时间选择器所能够提供的最精确的时间选择视图
 }).on("changeDate",function(er){
      erYear = er.date.getFullYear();    
      erMonth= er.date.getMonth()+1;
      if(erMonth<10)
      {
          erMonth = "0"+erMonth;
      }
      erDate = er.date.getDate();
      changedDate=erYear+"-"+erMonth+"-"+erDate;
      document.getElementById("currentDate").innerText=changedDate;
      acquire();
 }); 
 today.setDate(today.getDate() + 7);
 $('.form_datetime').datetimepicker('setEndDate', today);

}
