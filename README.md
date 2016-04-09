<div><dl>
	<dt>面向人群：</dt>
	<dd>零基础或初学者</dd>
	<dt>难度：</dt>
	<dd>中等</dd>
</dl>

<h3>重要说明</h3>
<p>百度前端技术学院的课程任务是由百度前端工程师专为对前端不同掌握程度的同学设计。我们尽力保证课程内容的质量以及学习难度的合理性，但即使如此，真正决定课程效果的，还是你的每一次思考和实践。</p>
<p>课程多数题目的解决方案都不是唯一的，这和我们在实际工作中的情况也是一致的。因此，我们的要求不仅仅是实现设计稿的效果，更是要多去思考不同的解决方案，评估不同方案的优劣，然后使用在该场景下最优雅的方式去实现。那些最终没有被我们采纳的方案，同样也可以帮助我们学到很多知识。所以，我们列出的参考资料未必是实现需求所必须的。有的时候，实现题目的要求很简单，甚至参考资料里就有，但是背后的思考和亲手去实践却是任务最关键的一部分。在学习这些资料时，要多思考，多提问，多质疑。相信通过和小伙伴们的交流，能让你的学习事半功倍。</p>

<h3>任务目的</h3>
<ul>
	<li>在上一任务基础上继续JavaScript的体验</li>
	<li>接触更加复杂的表单对象</li>
	<li>实现页面上的一个完整交互功能</li>
  <li>用DOM实现一个柱状图图表</li>
</ul>

<h3>任务描述</h3>
<ul>
	<li>参考以下示例代码，原始数据包含几个城市的空气质量指数数据</li>
	<li>用户可以选择查看不同的时间粒度，以选择要查看的空气质量指数是以天为粒度还是以周或月为粒度
    <ul>
      <li>天：显示每天的空气质量指数</li>
      <li>周：以自然周（周一到周日）为粒度，统计一周7天的平均数为这一周的空气质量数值，如果数据中缺少一个自然周的几天，则按剩余天进行计算</li>
      <li>月：以自然月为粒度，统一一个月所有天的平均数为这一个月的空气质量数值</li>
    </ul>
  </li>
  <li>用户可以通过select切换城市</li>
  <li>通过在"aqi-chart-wrap"里添加DOM，来模拟一个柱状图图表，横轴是时间，纵轴是空气质量指数，<a target="_blank" href="http://7xrp04.com1.z0.glb.clouddn.com/task_2_17_1.jpg">参考图（点击打开）</a>。天、周、月的数据只根据用户的选择显示一种。
    <ul>
      <li>天：每天的数据是一个很细的矩形</li>
      <li>周：每周的数据是一个矩形</li>
      <li>月：每周的数据是一个很粗的矩形</li>
    </ul>
  </li>
  <li>鼠标移动到柱状图的某个柱子时，用title属性提示这个柱子的具体日期和数据</li>
</ul>

<h4>task.html</h4>
<pre>&lt;!DOCTYPE&gt;
&lt;html&gt;
  &lt;head&gt;
    &lt;meta charset="utf-8"&gt;
    &lt;title&gt;IFE JavaScript Task 01&lt;/title&gt;
    &lt;script src="task.js"&gt;&lt;/script&gt;
  &lt;/head&gt;
&lt;body&gt;
  &lt;fieldset id="form-gra-time"&gt;
    &lt;legend&gt;请选择日期粒度：&lt;/legend&gt;
    &lt;label&gt;日&lt;input name="gra-time" value="day" type="radio" checked="checked"&gt;&lt;/label&gt;
    &lt;label&gt;周&lt;input name="gra-time" value="week" type="radio"&gt;&lt;/label&gt;
    &lt;label&gt;月&lt;input name="gra-time" value="month" type="radio"&gt;&lt;/label&gt;
  &lt;/fieldset&gt;

  &lt;fieldset&gt;
    &lt;legend&gt;请选择查看的城市：&lt;/legend&gt;
    &lt;select id="city-select"&gt;
      &lt;option&gt;北京&lt;/option&gt;
    &lt;/select&gt;
  &lt;/fieldset&gt;

  &lt;div class="aqi-chart-wrap"&gt;
  &lt;/div&gt;
&lt;/body&gt;
&lt;/html&gt;
</pre>

<h4>task.js</h4>
<pre>/* 数据格式演示
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
  m = m &lt; 10 ? '0' + m : m;
  var d = dat.getDate();
  d = d &lt; 10 ? '0' + d : d;
  return y + '-' + m + '-' + d;
}
function randomBuildData(seed) {
  var returnData = {};
  var dat = new Date("2016-01-01");
  var datStr = ''
  for (var i = 1; i &lt; 92; i++) {
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

// 用于渲染图表的数据
var chartData = {};

// 记录当前页面的表单选项
var pageState = {
  nowSelectCity: -1,
  nowGraTime: "day"
}

/**
 * 渲染图表
 */
function renderChart() {

}

/**
 * 日、周、月的radio事件点击时的处理函数
 */
function graTimeChange() {
  // 确定是否选项发生了变化 

  // 设置对应数据

  // 调用图表渲染函数
}

/**
 * select发生变化时的处理函数
 */
function citySelectChange() {
  // 确定是否选项发生了变化 

  // 设置对应数据

  // 调用图表渲染函数
}

/**
 * 初始化日、周、月的radio事件，当点击时，调用函数graTimeChange
 */
function initGraTimeForm() {

}

/**
 * 初始化城市Select下拉选择框中的选项
 */
function initCitySelector() {
  // 读取aqiSourceData中的城市，然后设置id为city-select的下拉列表中的选项

  // 给select设置事件，当选项发生变化时调用函数citySelectChange

}

/**
 * 初始化图表需要的数据格式
 */
function initAqiChartData() {
  // 将原始的源数据处理成图表需要的数据格式
  // 处理好的数据存到 chartData 中
}

/**
 * 初始化函数
 */
function init() {
  initGraTimeForm()
  initCitySelector();
  initAqiChartData();
}

init();

</pre>

<h3>任务注意事项</h3>
<ul>
	<li>实现简单功能的同时，请仔细学习JavaScript基本语法、事件、DOM相关的知识</li>
	<li>请注意代码风格的整齐、优雅</li>
  <li>代码中含有必要的注释</li>
  <li>示例图仅为参考，不需要完全一致</li>
	<li>点击select或者radio选项时，如果没有发生变化，则图表不需要重新渲染</li>
  <li>建议不使用任何第三方库、框架</li>
  <li>示例代码仅为示例，可以直接使用，也可以完全自己重写</li>
</ul>

<h3>任务协作建议</h3>

<ul>
  <li>如果是各自工作，可以按以下方式：
    <ul>
      <li>团队集中讨论，明确题目要求，保证队伍各自对题目要求认知一致</li>
      <li>各自完成任务实践</li>
      <li>交叉互相Review其他人的代码，建议每个人至少看一个同组队友的代码</li>
      <li>相互讨论，最后合成一份组内最佳代码进行提交</li>
    </ul>
  </li>
  <li>如果是分工工作（推荐），可以按以下模块切分
    <ul>
      <li>基础图表部分</li>
      <li>选择天的处理逻辑</li>
      <li>选择周的处理逻辑</li>
      <li>选择月的处理逻辑</li>
      <li>切换城市时的处理逻辑</li>
    </ul>
  </li>
</ul>
<h3>在线学习参考资料</h3>
<ul>
	<li><a target="_blank" href="http://www.imooc.com/view/36">JavaScript入门篇</a></li>
	<li><a target="_blank" href="https://developer.mozilla.org/zh-CN/docs/Web/JavaScript">MDN JavaScript</a></li>
</ul></div>
