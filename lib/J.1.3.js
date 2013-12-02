(function(window){
var J = function(val){
	return new J.init(val);
	},
	undefined=window.undefined;
	var toString = Object.prototype.toString,
	push = Array.prototype.push,
	slice = Array.prototype.slice;
J.init = function( val ){
	if (typeof val === "object"){
		this[0] = val;
	} else {
		this[0] = document.getElementById( val );
	}
	return this;
}
J.prototype = J.init.prototype = {
	version:"1.3",
	del: function( val ){return J.arr.del( this[0] , val )},
	indexOf: function( val ){return J.arr.indexOf( this[0] , val )},
	delIndex : function( val,n ){return J.arr.delIndex( this[0] , val,n )},
	max : function(){return J.arr.max( this[0] )},
	min : function(){return J.arr.min( this[0] )},
	X : function(){return J.arr.X( this[0] )},
	isRepeat : function(){return J.arr.isRepeat( this[0])},
	clone : function(){
		return toString.call( this[0] ) === "[object Array]"?
		J.arr.clone( this[0] ):J.obj.clone( this[0] );
	},
	unRepeat: function(){return J.arr.unRepeat( this[0] )},
	asc: function(){return J.arr.asc( this[0] )},
	random : function( val ){return J.arr.random( this[0] , val )},
	toJson : function( val ){return J.obj.objToJson( this[0] , val )}
	
}
J.fn = {

//取得ID
id:function(id){
	return document.getElementById(id);
},

//取得tag
tag:function(tag){
	return document.getElementsByTagName(tag);
},

//数组扩展方法
array:{
	
	//返回数组中指定字符串的索引
	indexOf:function(a,s){	
		for(var i = 0;i < a.length;i++){
			if(a[i] == s) return i;
		}
		return -1;
	},
	
	//在数组任意索引处删除N项	
	delIndex:function(a,i,n){
		a.splice(i,n||1);
		return a
	},
	
	//删除数组中为s的数据	
	del:function(a,s){
		var arr=[];
		for (var i=0; i<a.length ; i++){
			if (a[i] == s) a.splice(i,1);
		}
		return a;
	},
	
	//返回数组中最大项
	max:function(a){
		return Math.max.apply({},a);
	},
	
	//返回数组中最小项
	min:function(a){
		return Math.min.apply({},a);
	},
	
	//数组相乘
	X : function(arr){
		var n = 1;
		for (var i=0,l=arr.length;i<l;i++) n*=arr[i];
		return n;
	},
	
	//判断数组数据是否有重复
	isRepeat : function (a){
		var b = {};
		for (var i=0,l=a.length; i<l&&!b[a[i]]; b[a[i++]]=1);
		return i<l;	
	},
	
	//产生数字数组 开始/长度/步幅
	create : function (n, len, b){
		var arr = [],b=b||1;
		for (var i=n; i<=len * b; i+=b) arr.push(i);
		return arr;
	},
	
	//克隆数组（包括arguments转换）
	clone : function (arr){
		return arr.slice();
	},
	
	//获取数组中的随机数
	random : function(arr, n){
		var arr = J.arr.clone(arr),re=[],n=n||1;
		for (var i=0 ; i<n ; i++){
			var t=J.r(arr.length);
			re.push(arr[t]);
			arr.splice(t,1);
		}
		return re.length==1?re[0]:re;
	},
	
	// 数组去重复
	unRepeat : function(a){
		for (var o={},r=[],i=0,l=a.length;i<l;i++){
			if (!o[a[i]]){
				r.push(a[i]);
				o[a[i]] = true;
			}
		}
		return r;
	},
	
	//数字排序
	asc : function(arr){
		return arr.sort(function (a, b) {return a - b})
	}
},

//日期处理方法
date: {
	//得到日期及星期，val是否取得星期
	getDate:function(val,x) {
		var data=val?new Date(val):new Date();
		return data.getFullYear()+"年"+(data.getMonth() + 1)+ "月" + data.getDay() + "日 "
				+(x?" 星期"+"日一二三四五六".charAt( data.getDay() ):""); 
	},
	
	//时间转时间戳 2011-03-09 15:01:23
	timeToSjc : function(val) {
		return new Date(val.slice(0,4),(parseFloat(val.slice(5,7))-1),val.slice(8,10),
						val.slice(11,13),val.slice(14,16),val.slice(17,19)).getTime();
	},
	
	//时间戳转时间
	sjcToTime : function(val){
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
	},
	
	//格式化时间
	format : function(str){
		return new Date(str.replace(/[\-\u4e00-\u9fa5]/g, "/"));
	},
	
	//秒转换成时间
	sToTime : function(time){
		var s = Math.floor(time % 60);             //秒      
		var m = Math.floor((time / 60) % 60);      //分  
		var h = Math.floor((time / 3600) % 24);    //时  
		var d = Math.floor((time / 3600) / 24);     //天
		return {"d":d,"h":h,"m":m,"s":s}; 
	},
	
	//时间增减
	timeDrift : function(t,val){
		var d=new Date();
		d.setTime(new Date(t.replace( /-/g,"/")).getTime()+val);
		return d;
	},
	
	//时间格式化
	dataFormat : function(t){
		var Y=t.getFullYear();
		var M=(t.getMonth()<9)?"0"+(t.getMonth()+1):t.getMonth()+1
		var D=(t.getDate()<10)?"0"+t.getDate():t.getDate()
		
		var h=(t.getHours()<10)?"0"+t.getHours():t.getHours()
		var m=(t.getMinutes()<10)?"0"+t.getMinutes():t.getMinutes();
		var m=(t.getMinutes()<10)?"0"+t.getMinutes():t.getMinutes();
		var s=(t.getSeconds()<10)?"0"+t.getSeconds():t.getSeconds();
		return  Y+"-"+M+"-"+D+" "+h+":"+m+":"+s;
	}
},

//字符串处理方法
string:{
	
	//得到有汉字字符串的长度
	len:function(s){
		 var len = 0;
		 for(i = 0;i < s.length;i++){
			 s.charCodeAt(i) > 255?len += 2:len++;
		 }
		 return len;
	},
	
	//去除字符串首尾空格
	trim:function(s){
		var reg = /^\s*(.*?)\s*$/gim;
		return s.replace(reg,"$1");
	},
	
	//去除任意HTML标签,不写标签名代表所有标签
	trimHtml: function(tag){
		tag ? reg = new RegExp("<\/?"+tag+"(?:(.|\s)*?)>","gi"):reg = /<(?:.|\s)*?>/gi;
		return this.replace(reg,"");
	},
	commaSplit : function(srcNumber) {
		var rxSplit = new RegExp('([0-9])([0-9][0-9][0-9][,.])');
		var arrNumber = ('' + srcNumber).split('.');
		arrNumber[0] += '.';
		do {
			arrNumber[0] = arrNumber[0].replace(rxSplit, '$1,$2');
		} while (rxSplit.test(arrNumber[0]));
		if (arrNumber.length > 1) {
			return arrNumber.join('');
		}else {
		return arrNumber[0].split('.')[0];
      	}
	}
},

//数学方法
math: {
	format: function(num,opt){
		return opt?parseInt(num).toLocaleString():parseInt(num).toLocaleString().split(".")[0];
	},
	
	//数字前补零
	format : function (val,len){
		var len=len||1
		return Array(len).join("0").concat(val).slice(-len);
	},
	
	//保留小数点后多少位
	toFixed : function (num,len){
		return parseFloat(num).toFixed(len||2);
	},
	
	//产生随机数 最大/最小
	random: function( n,m ){
		return Math.floor( Math.random() * ( n || 9999 ) + ( m || 0 ) );
	},
	
	//排列组合 返回组合个数
	C : function (n,m){
		var n1=1, n2=1;
		for (var i=n,j=1; j<=m; n1*=i--,n2*=j++);
		return n1/n2;
	},
	
	//包括重复的排列组合个数 返回组合个数
	C2 : function (n,m){
		var c = 1;
		for (var i=n-m; i<n; c*=++i);
		return c;
	},
	
	//数组排列 返回组合个数
	arrC : function (arr, num){
		var r = 0;
		(function f(t,a,n){
			if (n==0) return (r+=t);
			for (var i=0,l=a.length; i<=l-n; i++){
				 f(t*a[i], a.slice(i+1), n-1);
			}
		})(1,arr,num);
    	return r;
	},
	
	//排列结果  包括重复内容
	arrCPermute : function (arr, num){
		var r = [];
		(function f(t,a,n){
			if(n==0) return r.push(t);
			for(var i=0,l=a.length-n; i<=l; i++){
				f(t.concat(a[i]), a.slice(i+1), n-1);
			}
		})([],arr,num);
		return r;
	},
	//排列结果  不包括重复内容
	arrCPermute1 : function (arr, num){
    	var r = [];
    	(function f(t,a,n){
			if (n==0) return r.push(t);
			for (var i=0,l=a.length; i<l; i++){
            	f(t.concat(a[i]), a.slice(0,i).concat(a.slice(i+1)), n-1);
			}
		})([],arr,num);
    	return r;
	},
	//多维数组排列组合
	mix : function (a,n){
	var n = n || a.length
	return (n = n || a.length) == 1 ? a[0] : function(p,p1,p2,i,j){
		for(i = p2.length; i--;)
			for(j = p1.length; j--;)
				p.push([].concat(p2[i], p1[j]));
		return p;
		}([],a[--n],J.math.mix(a, n))
	}
},
//ui方法
UI:{
	
	//滚动
	scroll: function( obj , opt ){
		var opt = opt || {} , boxH = opt.boxH || 30 , trH = opt.trH || 30 ,
			intervalTime = opt.intervalTime || 10, stopTime = opt.stopTime || 1500, play = true;
		obj.style.height = boxH + "px";
		obj.style.lineHeight = trH + "px";
		obj.style.overflow = "hidden";
		obj.innerHTML+=obj.innerHTML;
		obj.onmouseover=function(){play=false};
		obj.onmouseout=function(){play=true};
		(function (){
			var stop=obj.scrollTop%trH==0&&!play;
			if(!stop)obj.scrollTop==parseInt(obj.scrollHeight/2)?obj.scrollTop=0:obj.scrollTop++;
			setTimeout(arguments.callee,obj.scrollTop%trH?intervalTime:stopTime);
		})()
	},
	
	//iframe自动高度    未调试
	iframeAuto : function (id){
    var a = J("iframe");
    for (var i=0;i<a.length;i++){
        try{
            var d = a[i].contentWindow.document;
            var h = Math.min(d.documentElement.scrollHeight,d.body.scrollHeight);
            fw.dom.setHeight(a[i],h);
        }catch(e){};
    }
}
},

//对象方法
object:{
	
	//obj转换json
	toJson : function(obj) {
		switch (typeof(obj)) {
			case 'object':
				var result = [];
				if (obj instanceof Array) {
					for (var i = 0, len = obj.length; i < len; i++) {
						result.push( J.object.toJson(obj[i]));
					}
					return '[' + result.toString(',') + ']';
				} else if (obj instanceof RegExp) {
					return obj.toString();
				} else {
					for (var attribute in obj) {
						result.push('"'+attribute + '":' + J.object.toJson(obj[attribute]));
					}
					return '{' + result.join(',') + '}';
				}
			case 'function': return 'function(){}';
			case 'number':return obj.toString();
			case 'string':return  '"' +obj.replace(/(\\|\")/g, '\\$1')
					.replace(/\n|\r|\t/g,function(a) { return ('\n' == a) ? '\\n':('\r' == a) ? '\\r':('\t' == a) ? '\\t': '';}) +'"';
			case 'boolean':return obj.toString();
			default: return obj.toString();
		}
	},
	
	//深度克隆对象
	clone : function(o){
		var r;
		if (o.constructor==Object) {
			r = {};
			for(var i in o) r[i] = arguments.callee(o[i]);
		}else if (o.constructor==Array){
			r = [];
			for(var i=0;i<o.length;i++)r[i] = arguments.callee(o[i]);
		}else{
			return o;	
		}
		return r;
	}
},

//include文件
include : function(val){
	document.write('<scr\ipt type="text/javascript" src="'+val+'"></scr\ipt>');
},

//url/对象互转
url: function( val ){
	if ( typeof val !== "object" ){
		var url = val || location.href,json = {};
		url.replace( /[\?\&](\w+)=(\w+)/g, function( s , s1 , s2 ){ json[s1] = s2 } );
		return json;
	}else{
		var arr = [];
		for ( var i in val ) arr.push( i+" = "+val[i] );
		return arr.join( "&" );
	}
},

//弹出对象的各个属性
alert:function (obj,n){
	if (typeof obj !== "object") return alert(obj);
	var arr = [];
	for (var i in obj) arr.push(i+" = "+obj[i]);
	return alert(arr.join(n||"\n\r"));
},
//弹出对象的各个属性
log:function (obj){
	console.log(obj);
}
}
J.extend = function ( obj ) {for (var i in obj ) J[ i ] = obj[ i ];}
J.extend(J.fn);
//简写
J.a=J.alert;
J.r=J.math.random;
J.u=J.url;
J.arr=J.array;
J.str=J.string;
J.obj=J.object
J.num=J.math;
J.scroll=J.UI.scroll;
window.a=window.z=J.alert;
window.log=J.log;
window.J = J;
})(window)
//扩展
J.lottery = {
	//字符串开奖号码 转换为球
	toHtml: function(val,opt){
		var opt= opt || {},RB=opt.RB||"RB",BB=opt.BB||"BB",OB=opt.OB||"OB",tag=opt.tag||"li";
		var str=val.replace(/(\#|\:)/g,"+").replace(/(\ )/g,",");
		var getStr=function(arr,css){
		var t="";
			for(var i=0;i<arr.length;i++){
				t+='<'+tag+' class="'+css+'">'+arr[i]+'</'+tag+'>\r';
			}
			return t;
		}
		var tmp=str.indexOf("+")==-1?
			getStr(str.split(','),OB):
			getStr(str.split('+')[0].split(','),RB)+getStr(str.split('+')[1].split(','),BB);
		return tmp;
	},
	//字符串开奖号码 转换为数组
	toArray: function(val){
		if ( typeof val !== "string" ) return false;
		var val=val.replace(/(\#|\:)/g,"+").replace(/(\ )/g,",");
		if ( val.indexOf( "+" ) == -1 ) return [val.split( "," ) , ];
		var arr = val.split( "+" );
		return [arr[0].split( "," ) , arr[1].split( "," )];
	}
}
J.lot=J.lottery;