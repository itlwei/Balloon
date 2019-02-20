/*                       
 *@author:gaoliwei
 *@QQ:28701884
 * Version: 0.0.1
 */
(function(window){

//$调动的时候是否覆盖其他库的方法；
//建议设置成false，防止其他库因为内部函数暴露，出现不可预知的错误。
var _usurp = false,
//B(obj)调用时，obj的值。
	_value;

//构造函数，B(obj)时，把obj封装。
var B = function(obj, chain) {
    if (obj instanceof B) return obj;
    if (this instanceof B){
		this.value = obj;
		this[0] = this.value;
		this.chain = chain || false;
	}else {
    	return new B(obj, chain);
	}
}

//获得封装对象的真正的值.
B.value = function() {
	return this.value;
}

//是否霸占式，覆盖其他库方法。
B.usurp = function (val) {
	this._usurp = arguments.length ? val : true;	
}

//循环获得obj的值，放到iterator中执行
//如果支持ECMAScript 5原生forEach方法
//list (Arrays or Objects)
//list.length === +list.length判断length属性是否为数字
B.each = B.forEach = function(list, iterator, context) {
	if (list == null) return;
	
	if (Array.prototype.forEach && list.forEach === Array.prototype.forEach) {
		list.forEach(iterator, context);
	
	} else if (list.length === +list.length) {
		for (var i = 0, l = list.length; i < l; i++) {
			if (iterator.call(context, list[i], i, list) === {}) return;
		}
	} else {
		for (var key in list) {
			if (B.has(list, key)) {
				if (iterator.call(context, list[key], key, list) === {}) return;
			}
		}
	}
};

  
//遍历list的每一个值通过iterator产生新数组
//如果有原生的 map 函数
B.map = function(obj, iterator, context) {
    var results = [];
    if (obj == null) return results;
    if (Array.prototype.map && obj.map === Array.prototype.map) return obj.map(iterator, context);
    each(obj, function(value, index, list) {
      results.push(iterator.call(context, value, index, list));
    });
    return results;
  };

function result (obj){
	B(obj) == obj ? true : false;
}
  
//返回 list 里最大的元素. 如果传入了 iterator, 它将用来比较每个值
//list长度不能超过 65535
B.max = function(list, iterator, context) {
	if (!iterator && B.isArray(list) && list[0] === +list[0] && list.length < 65535) {
		return Math.max.apply(Math, list);
	}
	if (!iterator && B.isEmpty(list)) return -Infinity;
	var result = {computed : -Infinity, value: -Infinity};
	B.each(list, function(value, index, list) {
  		var computed = iterator ? iterator.call(context, value, index, list) : value;
  		computed > result.computed && (result = {value : value, computed : computed});
	});
	return result.value;
}

//返回 list 里最小的元素. 如果传入了 iterator, 它将用来比较每个值.
//list长度不能超过 65535
B.min = function(obj, iterator, context) {
	if (!iterator && B.isArray(obj) && obj[0] === +obj[0] && obj.length < 65535) {
		return Math.min.apply(Math, obj);
	}
	if (!iterator && B.isEmpty(obj)) return Infinity;
	var result = {computed : Infinity, value: Infinity};
    B.each(obj, function(value, index, list) {
		var computed = iterator ? iterator.call(context, value, index, list) : value;
		computed < result.computed && (result = {value : value, computed : computed});
    });
    return result.value;
};

//返回list中,元素的个数
//如果是String,支持中文
B.size = B.length = function(list) {
    if (list == null) return 0;
	if (B.isArray(list)) return list.length
	if (B.isString) {
		var length = 0;
		for(i = 0,len =list.length; i < len; i++) list.charCodeAt(i) > 255? length += 2:length++;
		return length;
	}
    return (list.length === +list.length) ? list.length : B.keys(list).length;
};
  
   // Zip together multiple lists into a single array -- elements that share
  // an index go together.
B.zip = function() {
	var length = B.max(B.pluck(arguments, "length").concat(0));
	var results = new Array(length);
	for (var i = 0; i < length; i++) {
	  results[i] = B.pluck(arguments, '' + i);
	}
	return results;
};

// 把数组打乱顺序
B.shuffle = function(obj) {
    var rand;
    var index = 0;
    var shuffled = [];
    B.each(obj, function(value) {
      rand = B.random(index++);
      shuffled[index - 1] = shuffled[rand];
      shuffled[rand] = value;
    });
    return shuffled;
};

//获取数组中的随机数,产生随机数 最小/最大
B.random = B.r = function( min, max ){
	if (B.isArray(min)) return _randomArray( min, max );
	if (max == null) {
		max = min;
		min = 0;
	}
	max = max || min || 999;
	return min + Math.floor(Math.random() * (max - min + 1));
}

//获取数组中的随机数
var _randomArray = function(arr, n){
	var arr = B.copy(arr),re=[],n=n||1;
	for (var i=0 ; i<n ; i++){
		var t=B.random(arr.length);
		re.push(arr[t]);
		arr.splice(t,1);
	}
	return re;
}

	
//数字排序
B.sort = function(arr){
	return arr.sort(function (a, b) {return a - b})
}
  
// 获得value在数组的位置索引
B.indexOf = function(array, item) {
    if (!B.isArray(array)) return -1;
	if (Array.prototype.indexOf) return array.indexOf(item);
    var i = 0, l = array.length;
    for (; i < l; i++) if (array[i] === item) return i;
    return -1;
};
  
// Delegates to **ECMAScript 5**'s native `lastIndexOf` if available.
B.lastIndexOf = function(array, item, from) {
    if (array == null) return -1;
    var hasIndex = from != null;
    if (Array.prototype.lastIndexOf && array.lastIndexOf === Array.prototype.lastIndexOf) {
      return hasIndex ? array.lastIndexOf(item, from) : array.lastIndexOf(item);
    }
    var i = (hasIndex ? from : array.length);
    while (i--) if (array[i] === item) return i;
    return -1;
};
  
  
//*** 判断 *** //
//判断对象类型类型
B.type = function( obj ){
	if ( obj == null ) {
		return String( obj );
	}
	return typeof obj === "object" || typeof obj === "function" ?
		B.isArray(obj) ? "array" : "object" :
		typeof obj;
}

//深度对比两个对象相等(非全等).  **暂未实现
B.isEqual = function(a, b) {};

// 如果 object 里没包含任何东西, 将返回 true.
B.isEmpty = function(obj) {
	if (obj == null) return true;
	if (B.isArray(obj) || B.isString(obj)) return obj.length === 0;
	for (var key in obj) if (B.has(obj, key)) return false;
	return true;
};

// 如果 object 是一个数组, 将返回 true.
B.isElement = function(obj) {
	return !!(obj && obj.nodeType === 1);
};

// 判断是否为 array
// 如果实现了ECMA5则使用原生的方法Array.isArray
B.isArray = Array.isArray || function(obj) {
	if (obj == null) return false;
	return Object.prototype.toString.call(obj) == '[object Array]';
};

/*
// 判断是否为 object?
B.isObject = function(obj) {
	return obj === Object(obj);
};
*/

// 定义几个类型: isArguments, isFunction, isString, isNumber, isDate, isRegExp.
B.each(['Object','Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp'], function(name) {
B['is' + name] = function(obj) {
  return Object.prototype.toString.call(obj) == '[object ' + name + ']';
};
});

// Define a fallback version of the method in browsers (ahem, IE), where
// there isn't any inspectable "Arguments" type.
if (!B.isArguments(arguments)) {
B.isArguments = function(obj) {
	return !!(obj && B.has(obj, 'callee'));
};
}

// 优化isFunction方法，解决某些浏览器把正则当成function的问题
if (typeof (/./) !== 'function') {
	B.isFunction = function(obj) {
		return typeof obj === 'function';
	};
}

// 判断是否为number类型
B.isFinite = function(obj) {
	return isFinite(obj) && !isNaN(parseFloat(obj));
};

// 判断是否为 NaN
B.isNaN = function(obj) {
	return B.isNumber(obj) && obj != +obj;
};

// 判断对象是否 boolean 类型?
B.isBoolean = function(obj) {
	return obj === true || obj === false || toString.call(obj) == '[object Boolean]';
};

// 判断对象是否 null?
B.isNull = function(obj) {
	return obj === null;
};

// 判断对象是否 undefined?
B.isUndefined = function(obj) {
	return obj === void 0;
};

// Shortcut function for checking if an object has a given property directly
// on itself (in other words, not on a prototype).
//判断对象 object 包含指定的属性 key 吗
//和 object.hasOwnProperty(key) 相同
B.has = function(obj, key) {
return hasOwnProperty.call(obj, key);
};

//判断是否为android平台
B.isAndroid = function(){
	return /android/i.test(navigator.userAgent);
}
//判断是否为ipad平台
B.isIpad = function(){
	return /ipad/i.test(navigator.userAgent);
}
//判断是否为iphone平台
B.isIphone = function(){
	return /iphone/i.test(navigator.userAgent);
}
//判断是否为macintosh平台
B.isMac = function(){
	return /macintosh/i.test(navigator.userAgent);
}
//判断是否为windows平台
B.isWindows = function(){
	return /windows/i.test(navigator.userAgent);
}
//判断是否为x11平台
B.isX11 = function(){
	return /x11/i.test(navigator.userAgent);
}

//返回操作系统类型
B.osType = function(){
	if (B.isWindows()) return "windows";
	if (B.isAndroid()) return "androin";
	if (B.isIphone()) return "iphone";
	if (B.isIpad()) return "ipad";
	if (B.isMac()) return "mac";
	if (B.isX11()) return "x11";
	return false;
}

//判断是否严格标准的渲染模式
B.isStrict = function(){
	return document.compatMode == "CSS1Compat";	
}
//判断是否为gecko内核
B.isGecko = function(){
	return /gecko/i.test(navigator.userAgent) && !/like gecko/i.test(navigator.userAgent);	
}
//判断是否为webkit内核
B.isWebkit = function(){
	return /webkit/i.test(navigator.userAgent);	
}
//判断是否为chrome浏览器
B.isChrome = function(){
	return /chrome\/(\d+\.\d+)/i.test(navigator.userAgent) ?
			 + RegExp['\x241'] : undefined;	
}
//判断是否为firefox浏览器
B.isFirefox = function(){
	return /firefox\/(\d+\.\d+)/i.test(navigator.userAgent) ?
			 + RegExp['\x241'] : undefined;	
}
//判断是否为ie浏览器
B.isIe = function(){
	return /msie (\d+\.\d+)/i.test(navigator.userAgent) ?
		 (document.documentMode || + RegExp['\x241']) : undefined;;	
}
//判断是否为maxthon浏览器
B.isMaxthon = function(){
	try {
		if (/(\d+\.\d+)/.test(external.max_version)) {
			return + RegExp['\x241'];
		}
	} catch (e) {
		return false	
	}	
}
//判断是否为opera浏览器
B.isOpera = function(){
	return /opera(\/| )(\d+(\.\d+)?)(.+?(version\/(\d+(\.\d+)?)))?/i.test(navigator.userAgent) ?
			  + ( RegExp["\x246"] || RegExp["\x242"] ) : undefined;	
}
//判断是否为safari浏览器, 支持ipad
B.isSafari = function(){
	var ua = navigator.userAgent;
	return /(\d+\.\d)?(?:\.\d)?\s+safari\/?(\d+\.\d+)?/i.test(ua) && !/chrome/i.test(ua) ?
			 + (RegExp['\x241'] || RegExp['\x242']) : undefined;	
}

//返回浏览器类型
B.browserType = function(){
	if (B.isIe()) return "ie";
	if (B.isChrome()) return "chrome";
	if (B.isFirefox()) return "firefox";
	if (B.isSafari()) return "safari";
	if (B.isGecko()) return "gecko";
	if (B.isWebkit()) return "webkit";
	if (B.isOpera()) return "opera";
	return false;
}


/****UI*******************************/
  //取得ID
B.id = function(id){
	return document.getElementById(id);
}

//取得tag
B.tag = function(tag){
	return document.getElementsByTagName(tag);
}
//删除数组中为s的数据	
B.del = function(array , val){	
	for (var i=0; i<array.length ; i++){
		if (array[i] == val) array.splice(i,1);
	}
	return array;
}

//判断数组数据是否有重复
B.isRepeat = function (array){
	var obj = {};
	for (var i=0,l=array.length; i < l&&!obj[array[i]]; obj[array[i++]]=1);
	return i < l;	
}
	
//产生数字数组 开始/长度/步幅
B.create = function (n, len, b){
	var arr = [],b=b||1;
	for (var i=n; i<=len * b; i+=b) arr.push(i);
	return arr;
}

// 数组去重复
B.unRepeat = function(a){
	for (var o={},r=[],i=0,l=a.length;i<l;i++){
		if (!o[a[i]]){
			r.push(a[i]);
			o[a[i]] = true;
		}
	}
	return r;
}
	




//得到日期及星期，val是否取得星期
B.date = function(val,x) {
	var data=val?new Date(val):new Date();
	return data.getFullYear()+"年"+(data.getMonth() + 1)+ "月" + data.getDay() + "日 "
			+(x?" 星期"+"日一二三四五六".charAt( data.getDay() ):""); 
}
	
//时间转时间戳 2011-03-09 15:01:23
B.timestamp = function(val) {
	return new Date(val.slice(0,4),(parseFloat(val.slice(5,7))-1),val.slice(8,10),
					val.slice(11,13),val.slice(14,16),val.slice(17,19)).getTime();
}
	
	//时间戳转时间
B.sjcToTime = function(val){
	var time = new Date(val) 
	var month = time.getMonth()+1;
	month = month < 10  ? "0"+ month :month;
	var date = time.getDate();
	date = date < 10  ? "0"+ date :date;
	
	var hours = time.getHours();
	hours = hours < 10  ? "0"+ hours :hours;
	
	var minutes = time.getMinutes();
	minutes = minutes < 10  ? "0"+ minutes :minutes;
	
	var seconds = time.getSeconds();
	seconds = seconds < 10  ? "0"+ seconds :seconds;
	return time.getFullYear()+"-"+month+"-"+date+" "+hours+":"+minutes+":"+seconds;
}
	
	//格式化时间
B.format = function(str){
	return new Date(str.replace(/[\-\u4e00-\u9fa5]/g, "/"));
}
	
//秒转换成时间
B.formatSec = function(time){
	var s = Math.floor(time % 60);             //秒      
	var m = Math.floor((time / 60) % 60);      //分  
	var h = Math.floor((time / 3600) % 24);    //时  
	var d = Math.floor((time / 3600) / 24);     //天
	return {"d":d,"h":h,"m":m,"s":s}; 
}
	
//时间增减
B.timeDrift = function(t,val){
	var d=new Date();
	d.setTime(new Date(t.replace( /-/g,"/")).getTime()+val);
	return d;
}
	
//时间格式化
B.dataFormat = function(t){
	var Y=t.getFullYear();
	var M=(t.getMonth()<9)?"0"+(t.getMonth()+1):t.getMonth()+1
	var D=(t.getDate()<10)?"0"+t.getDate():t.getDate()
	
	var h=(t.getHours()<10)?"0"+t.getHours():t.getHours()
	var m=(t.getMinutes()<10)?"0"+t.getMinutes():t.getMinutes();
	var m=(t.getMinutes()<10)?"0"+t.getMinutes():t.getMinutes();
	var s=(t.getSeconds()<10)?"0"+t.getSeconds():t.getSeconds();
	return  Y+"-"+M+"-"+D+" "+h+":"+m+":"+s;
}

	
//去除字符串首尾空格
B.trim = function(s){
	var reg = /^\s*(.*?)\s*$/gim;
	return s.replace(reg,"$1");
}
	
//去除任意HTML标签,不写标签名代表所有标签
B.trimHtml = function(val , tag){
	tag ? reg = new RegExp("<\/?"+tag+"(?:(.|\s)*?)>","gi"):reg = /<(?:.|\s)*?>/gi;
	return val.replace(reg,"");
}

//对数字逗号分隔
B.comma = function (val, length) {
	var length = length || 3;
	val = String(val).split(".");
	val[0] = val[0].replace(new RegExp('(\\d)(?=(\\d{'+length+'})+$)','ig'),"$1,");
	return val.join(".");
}

B.format = function(num,opt){
	return opt?parseInt(num).toLocaleString():parseInt(num).toLocaleString().split(".")[0];
}
	
//数字前补零
B.pad = function (val,len){
	var len = len || 2;
	return Array(len).join("0").concat(val).slice(-len);
}
	
//保留小数点后多少位
B.toFixed = function (num,len){
	if (!num) return "";
	return parseFloat(num).toFixed(len||2);
}

//
B.time2sjc = function(val) {
		return new Date(val.slice(0,4),(parseFloat(val.slice(5,7))-1),val.slice(8,10),
						val.slice(11,13),val.slice(14,16),val.slice(17,19)).getTime();
}

//时间戳转时间
B.sjc2time = function(val){
	var time = new Date(val) 
	var month = time.getMonth()+1;
	month = month < 10  ? "0"+ month :month;
	var date = time.getDate();
	date = date < 10  ? "0"+ date :date;
	
	var hours = time.getHours();
	hours = hours < 10  ? "0"+ hours :hours;
	
	var minutes = time.getMinutes();
	minutes = minutes < 10  ? "0"+ minutes :minutes;
	
	var seconds = time.getSeconds();
	seconds = seconds < 10  ? "0"+ seconds :seconds;
	return time.getFullYear()+"-"+month+"-"+date+" "+hours+":"+minutes+":"+seconds;
}	


//排列组合结果数
//isRepeat 是否列出重复结果
B.C = function (n ,m , isRepeat){
	if (isRepeat){
		var c = 1;
		for (var i=n-m; i<n; c*=++i);
		return c;
		
	}else{
		var n1=1, n2=1;
		for (var i=n,j=1; j<=m; n1*=i--,n2*=j++);
		return n1/n2;
	}
}
	
//列出所有排列结果
//isRepeat 是否列出重复结果
B.lists = function (arr, num , isRepeat){
	if (isRepeat){
		var r = [];
		(function f(t,a,n){
			if (n==0) return r.push(t);
			for (var i=0,l=a.length; i<l; i++){
				f(t.concat(a[i]), a.slice(0,i).concat(a.slice(i+1)), n-1);
			}
		})([],arr,num);
		return r;
		
	}else{
		var r = [];
		(function f(t,a,n){
			if(n==0) return r.push(t);
			for(var i=0,l=a.length-n; i<=l; i++){
				f(t.concat(a[i]), a.slice(i+1), n-1);
			}
		})([],arr,num);
		return r;
	}
}
//多维数组排列组合
B.mix = function (a, n){
	var n = n || a.length
	return (n = n || a.length) == 1 ? a[0] : function(p,p1,p2,i,j){
		for(i = p2.length; i--;)
			for(j = p1.length; j--;)
				p.push([].concat(p2[i], p1[j]));
		return p;
	}([],a[--n],arguments.callee(a, n))
}

//深度克隆对象
B.copy = function( obj ){
	var val;
	if ( B.isObject( obj ) ) {
		val = {};
		for(var i in obj){
			val[i] = arguments.callee(obj[i]);
		}
	}else if ( B.isArray( obj ) ){
		val = [];
		for(var i=0;i<obj.length;i++){
			val[i] = arguments.callee(obj[i]);
		}
	}else{
		return obj;	
	}
	return val || obj;
}

//去除字符串前后空格
B.trim = function( text ) {
	if (text == null ) return "";
	reg = new RegExp( "^[\\x20\\t\\r\\n\\f]+|((?:^|[^\\\\])(?:\\\\.)*)[\\x20\\t\\r\\n\\f]+$", "g" ),
	text = ( text + "" ).replace( reg, "" );
	return text;
}

//json字符串与对象互转
B.json = B.JSON = function(val) {
	if ( val === null )  return val;
	if ( B.isString(val) ) {
		if ( window.JSON && window.JSON.parse ) {
			return window.JSON.parse( val );
		}else{
			val = B.trim(val);
			return ( new Function( "return " + val ) )();	
		}
	}
	return (function(val){
		if( B.isArray(val) ){
			var result = [];
			for (var i = 0, len = val.length; i < len; i++) {
				result.push( arguments.callee(val[i]));
			}
			return '[' + result.toString(',') + ']';
		}
		if (B.isObject(val) ){
			var result = [];
			for (var key in val) {
				result.push('"'+key + '":' + arguments.callee(val[key]));
			}
			return '{' + result.join(',') + '}';
		}
		if (B.isString( val)){
			return  '"' +val.replace(/(\\|\")/g, '\\$1')
				.replace(/\n|\r|\t/g,function(a) { return ('\n' == a) ? '\\n':('\r' == a) ? '\\r':('\t' == a) ? '\\t': '';}) +'"';
		}
		if (B.isFunction( val )){
			return 'function(){}';
		}
		return val.toString();
	}(val))
}
	

//url/对象互转
B.url = B.href = function( val ){
	if ( val === null )  return val;
	if ( B.isObject(val) ){
		var arr = [];
		for ( var i in val ) {
			arr.push( i+"="+ val[i]);
		}
		return arr.join( "&" );
	}else{
		var url = location.search;
			json = {};
		if (url.indexOf("?") === -1) return {};
		var arr = url.substr(1).split("&");
		for(var i = 0, len = arr.length; i < len; i ++) {
			json[arr[i].split("=")[0]]=unescape(arr[i].split("=")[1]);
		}
		return json;
	}
}

B.cookie = function(name, value, options) {
    if (typeof value != 'undefined') { // name and value given, set cookie
        options = options || {};
        if (value === null) {
            value = '';
            options.expires = -1;
        }
        var expires = '';
        if (options.expires && (typeof options.expires == 'number' || options.expires.toUTCString)) {
            var date;
            if (typeof options.expires == 'number') {
                date = new Date();
                date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
            } else {
                date = options.expires;
            }
            expires = '; expires=' + date.toUTCString(); // use expires attribute, max-age is not supported by IE
        }
        var path = options.path ? '; path=' + (options.path) : '';
        var domain = options.domain ? '; domain=' + (options.domain) : '';
        var secure = options.secure ? '; secure' : '';
        document.cookie = [name, '=', encodeURIComponent(value), expires, path, domain, secure].join('');
    } else { // only name given, get cookie
        var cookieValue = null;
        if (document.cookie && document.cookie != '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = B.trim(cookies[i]);
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) == (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
};

//弹出对象的各个属性
B.alert = function (val,n){
	if (typeof val !== "object") return alert(val);
	var arr = [];
	for (var key in val) arr.push(key + " = " + val[key]);
	return alert(arr.join(n||"\n\r"));
}


//弹出对象的各个属性
B.log = function (obj){
	if (window.console && console.log){
		console.log(obj);
	}
}

B.mixin = function(obj){
	for (var key in obj){
		var fn = B[key] = obj[key];
		(function(fn, key){
			B.prototype[key] = function(){
				var arg = [this.value];
				Array.prototype.push.apply(arg, arguments);
				var _obj = fn.apply(B , arg);
				return this.chain ? B(_obj) : _obj;
			}
		}(fn, key))
	}
}



B.chain = function(obj){
	this.chain = true;
	return this;
}

B.extend = function (defaults ,options){
	for (var key in options) {
		if (!defaults[key]) defaults[key] = options[key];
	}
}

B.mixin(B);
window.$ ? B.extend( $, B) : window.B = B;

//简写
window.l = $.log;
window.z = $.alert;
})(window)