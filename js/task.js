/* 数据格式演示
 var aqiSourceData = {
 "北京": {
 "2016-01-01": 10,
 "2016-01-02": 10,
 "2016-01-03": 10,
 "2016-01-04": 10
 }
 };
 */

// 以下两个函数用于随机模拟生成测试数据
function getDateStr(dat) {
    var y = dat.getFullYear();
    var m = dat.getMonth() + 1;
    m = m < 10 ? '0' + m : m;
    var d = dat.getDate();
    d = d < 10 ? '0' + d : d;
    return y + '-' + m + '-' + d;
}
function randomBuildData(seed) {
    var returnData = {};
    var dat = new Date("2016-01-01");
    var datStr = '';
    for (var i = 1; i < 92; i++) {
        datStr = getDateStr(dat);
        returnData[datStr] = Math.ceil(Math.random() * seed);
        dat.setDate(dat.getDate() + 1);
    }
    return returnData;
}

var aqiSourceData = {
    "北京": randomBuildData(500),
    "上海": randomBuildData(300),
    "广州": randomBuildData(200),
    "深圳": randomBuildData(100),
    "成都": randomBuildData(300),
    "西安": randomBuildData(500),
    "福州": randomBuildData(100),
    "厦门": randomBuildData(100),
    "沈阳": randomBuildData(500)
};
var citys=["北京","上海","广州","深圳","成都","西安","福州","厦门","沈阳"];
var colors=["#49C8AF","#5DACE2","#AE7AC3","#5D6E7F","#F4CF40","#EC6F63"];
// 用于渲染图表的数据
var chartData = {};

// 记录当前页面的表单选项
var pageState = {
    nowSelectCity: -1,
    nowGraTime: "day"
};
var svg;
var svgMarginWidth,svgMarginHeight;
var chartWidth,chartHeight;
var barMargin,barWidth;
var totalBars;
var maxData;

function chartSettings(ps){
    switch(ps.nowGraTime){
        case "day":
            svgMarginWidth=30;
            svgMarginHeight=50;
            barMargin=10;
            break;
        case "week":
            svgMarginWidth=30;
            svgMarginHeight=50;
            barMargin=20;
            break;
        case "month":
            svgMarginWidth=30;
            svgMarginHeight=50;
            barMargin=60;
            break;
    }
    totalBars=Object.keys(chartData[citys[ps.nowSelectCity+1]][ps.nowGraTime]).length;
    var arr = Object.keys( chartData[citys[ps.nowSelectCity+1]][ps.nowGraTime] ).map(function ( key ) { return chartData[citys[ps.nowSelectCity+1]][ps.nowGraTime][key]; });
    maxData=Math.max.apply( null, arr );
    chartWidth=svg.width.baseVal.value-2*svgMarginWidth;
    chartHeight=svg.height.baseVal.value-svgMarginHeight;
    barWidth=(chartWidth/totalBars)-barMargin;
}
function drawRectangle(x,y,wd,ht,fill,tiptext){
    var g=document.createElementNS("http://www.w3.org/2000/svg", "g");
    var rect=document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rect.setAttributeNS(null,"x",x);
    rect.setAttributeNS(null,"y",y);
    rect.setAttributeNS(null,"width",wd);
    rect.setAttributeNS(null,"height",ht);
    rect.setAttributeNS(null,"fill",fill);
    rect.setAttributeNS(null,"fill-opacity",".6");
    var animate=document.createElementNS("http://www.w3.org/2000/svg", "animate");
    animate.setAttributeNS(null,"attributeType","css");
    animate.setAttributeNS(null,"attributeName","y");
    animate.setAttributeNS(null,"from",y+ht);
    animate.setAttributeNS(null,"to",y);
    animate.setAttributeNS(null,"dur","0.5s");
    var tip = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    tip.setAttributeNS(null,"x",x);
    tip.setAttributeNS(null,"y",y);
    tip.setAttributeNS(null,"font-size","13px");
    tip.setAttributeNS(null,"fill","black");
    tip.setAttributeNS(null,"style","visibility:hidden");
    var tspan1=document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
    var tspan2=document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
    var textNode1 = document.createTextNode(tiptext.split(":")[0],true);
    var textNode2 = document.createTextNode(tiptext.split(":")[1],true);
    tspan1.appendChild(textNode1);
    tspan2.appendChild(textNode2);
    tspan1.setAttributeNS(null,"x",x);
    tspan1.setAttributeNS(null,"y",y-20);
    tspan2.setAttributeNS(null,"x",x);
    tspan2.setAttributeNS(null,"y",y-2);
    tip.appendChild(tspan1);
    tip.appendChild(tspan2);
    rect.appendChild(animate);
    g.appendChild(rect);
    g.appendChild(tip);
    svg.appendChild(g);
}
function drawChart(ps){
    var index=0;
    for(var item in chartData[citys[ps.nowSelectCity+1]][ps.nowGraTime]){
        bcHt=(chartData[citys[ps.nowSelectCity+1]][ps.nowGraTime][item]*chartHeight/maxData);
        bcX=(index++*(barWidth+barMargin))+barMargin;
        bcY=chartHeight-bcHt+svgMarginHeight;
        var date=item.indexOf("-")===-1?(ps.nowGraTime=="week"?"2016年第"+item+"周":"2016年"+item+"月"):item;
        var fill=colors[index%6];
        drawRectangle(bcX,bcY,barWidth,bcHt,fill,date+":"+"AQI--"+chartData[citys[ps.nowSelectCity+1]][ps.nowGraTime][item]);
    }
}

/**
 * 渲染图表
 */
function renderChart() {
    var chart=document.querySelector(".aqi-chart-wrap");
    chart.innerHTML="<?xml version='1.0' encoding='UTF-8'?><?xml-stylesheet href='style.css' type='text/css'?><svg height='600' width='1240'></svg>";
    svg=document.getElementsByTagName("svg")[0];
    chartSettings(pageState);
    drawChart(pageState);
}

/**
 * 日、周、月的radio事件点击时的处理函数
 */
function graTimeChange(node,target) {
    // 确定是否选项发生了变化
    if(pageState.nowGraTime!=target.getAttribute("value")){
        for(var n in node){
            node.setAttribute("checked","");
        }
        // 设置对应数据
        pageState.nowGraTime=target.getAttribute("value");
        target.setAttribute("checked","checked");
        // 调用图表渲染函数
        renderChart();
    }
}

/**
 * select发生变化时的处理函数
 */
function citySelectChange(node) {
    // 确定是否选项发生了变化
    if(citys[pageState.nowSelectCity+1]!=node.options[node.selectedIndex].value){
        // 设置对应数据
        pageState.nowSelectCity=citys.indexOf(node.options[node.selectedIndex].value)-1;
        // 调用图表渲染函数
        renderChart();
    }
}

/**
 * 初始化日、周、月的radio事件，当点击时，调用函数graTimeChange
 */
function initGraTimeForm() {
    var gratime=document.getElementById("form-gra-time");
    addEvent("click", gratime, function(e){
        var target = e.target || e.srcElement;
        if(target.nodeName.toLowerCase()=="input"){graTimeChange(gratime,target);}
    });
    var chart=document.querySelector(".aqi-chart-wrap");
    addEvent("mouseover",chart,function(e){
        var target = e.target || e.srcElement;
        if(target.nodeName.toLowerCase()=="rect"){target.nextSibling.setAttributeNS(null, "style","visibility:visible");}
    });
    addEvent("mouseout",chart,function(e){
        var target = e.target || e.srcElement;
        if(target.nodeName.toLowerCase()=="rect"){target.nextSibling.setAttributeNS(null, "style","visibility:hidden");}
    });
}

/**
 * 初始化城市Select下拉选择框中的选项
 */
function initCitySelector() {
    // 读取aqiSourceData中的城市，然后设置id为city-select的下拉列表中的选项
    var cityList=document.getElementById("city-select");
    var list="";
    for(var city in aqiSourceData){
        list+="<option>"+city+"</option>";
    }
    cityList.innerHTML=list;
    // 给select设置事件，当选项发生变化时调用函数citySelectChange
    addEvent("change",cityList,function(){
        citySelectChange(cityList);
    });
}

/**
 * 初始化图表需要的数据格式
 */
function initAqiChartData() {
    // 将原始的源数据处理成图表需要的数据格式
    // 处理好的数据存到 chartData 中
    var perWeek={},perMonth={},weekFlag,weekStart,monthFlag,monthStart,weekDays,monthDays;
    for(var city in aqiSourceData){
        chartData[city]={"day":{},"week":{},"month":{}};
        var dateArr=Object.getOwnPropertyNames(aqiSourceData[city]);
        var weekly={},monthly={},weekCount=1;
        for(var i=0;i<dateArr.length;i++){
            chartData[city]["day"][dateArr[i]]=aqiSourceData[city][dateArr[i]];
            var temp=dateArr[i].split('-');
            var d = new Date(temp[0], temp[1] - 1, temp[2]);
            weekFlag= getWeekNumber(d);
            monthFlag= d.getMonth()+1;
            if(typeof weekStart==="undefined"||weekFlag!==weekStart||i==dateArr.length-1){
                if(typeof weekStart!=="undefined"&&weekFlag!=weekStart){
                    perWeek[weekCount++]=Math.ceil(weekly[weekStart]/weekDays);
                    if(i==dateArr.length-1){
                        perWeek[weekCount++]=Math.ceil(aqiSourceData[city][dateArr[i]]);
                    }
                }else if(i==dateArr.length-1){
                    weekly[weekStart]+=aqiSourceData[city][dateArr[i]];
                    weekDays++;
                    perWeek[weekCount++]=Math.ceil(weekly[weekStart]/weekDays);
                }
                weekStart=weekFlag;
                weekly[weekStart]=0;
                weekDays=0;
            }
            if(typeof monthStart==="undefined"||monthFlag!==monthStart||i==dateArr.length-1){
                if(typeof monthStart!=="undefined"&&monthFlag!=monthStart){
                    perMonth[monthStart]=Math.ceil(monthly[monthStart]/monthDays);
                    if(i==dateArr.length-1){
                        perMonth[monthFlag]=Math.ceil(aqiSourceData[city][dateArr[i]]);
                    }
                }else if(i==dateArr.length-1){
                    monthly[monthStart]+=aqiSourceData[city][dateArr[i]];
                    monthDays++;
                    perMonth[monthStart]=Math.ceil(monthly[monthStart]/monthDays);
                }
                monthStart=monthFlag;
                monthly[monthStart]=0;
                monthDays=0;
            }
            weekly[weekStart]+=aqiSourceData[city][dateArr[i]];
            monthly[monthStart]+=aqiSourceData[city][dateArr[i]];
            weekDays++;monthDays++;
        }
        chartData[city]["week"]=perWeek;
        chartData[city]["month"]=perMonth;
        perWeek={};perMonth={};weekStart=undefined;monthStart=undefined;
    }
    return chartData;
}

/**
 * 初始化函数
 */
function init() {
    initGraTimeForm();
    initCitySelector();
    initAqiChartData();
    renderChart();
}

init();
