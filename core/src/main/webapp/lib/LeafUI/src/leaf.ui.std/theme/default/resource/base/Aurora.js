/*
 * Leaf UI Library.
 * Copyright(c) 2010, Hand China Co.,Ltd.
 * 
 * http://www.hand-china.com
 */

/**
 * @class Leaf
 * Leaf UI 核心工具类.
 * @author 牛佳庆
 * @singleton
 */
 
Ext.Ajax.timeout = 1800000;

$L = Leaf = {version: '1.0',revision:'$Rev: 6020 $'};
//$L.firstFire = false;
$L.fireWindowResize = function(){
	if($L.winWidth != $L.getViewportWidth() || $L.winHeight != $L.getViewportHeight()){
        $L.winHeight = $L.getViewportHeight();
        $L.winWidth = $L.getViewportWidth();
        $L.Cover.resizeCover();
	}
}
if(Ext.isIE6)Ext.EventManager.on(window, "resize", $L.fireWindowResize, this);



$L.cache = {};
$L.cmps = {};
$L.onReady = function(fn, scope, options){
	if(window['__host']){
		if(!$L.loadEvent)$L.loadEvent = new Ext.util.Event();
		$L.loadEvent.addListener(fn, scope, options);
	}else{
		Ext.onReady(fn, scope, options);
	}
}//Ext.onReady;

$L.get = Ext.get;
//$L.focusWindow;
//$L.focusTab;
$L.defaultDateFormat="isoDate";
$L.defaultDateTimeFormat="yyyy-mm-dd HH:MM:ss";
$L.defaultChineseLength = 2;

/**
 * 页面地址重定向
 * @param {String} url
 */
$L.go=function(url){
	if(!url)return;
	var r=Math.random();
	location.href=url+(url.indexOf('?')==-1?'?':'&')+'__r__='+r;
}

/**
 * 将对象居中
 * @param {Object/String} el Leaf组件对象或者是DOM对象或者是对象的ID字符串
 */
$L.center = function(el){
	var ele;
	if(typeof(el)=="string"){
        var cmp = $L.CmpManager.get(el)
        if(cmp){
            if(cmp.wrap){
                ele = cmp.wrap;
            }
        }else{
             ele = Ext.get(el);
        }             
    }else{
        ele = Ext.get(el);
    }
    var screenWidth = $L.getViewportWidth();
    var screenHeight = $L.getViewportHeight();
    var x = Math.max(0,(screenWidth - ele.getWidth())/2);
    var y = Math.max(0,(screenHeight - ele.getHeight())/2);
    ele.setStyle('position','absolute');
    ele.moveTo(x,y);
}

/**
 * 设置主题
 * @param {String} theme 主题名
 */
$L.setTheme = function(theme){
	if(theme) {
		var exp  = new Date();   
	    exp.setTime(exp.getTime() + 24*3600*1000);
	    document.cookie = "app_theme="+ escape (theme) + ";expires=" + exp.toGMTString(); 
	    window.location.reload();
	}
}
$L.CmpManager = function(){
    return {
        put : function(id, cmp){
        	if(!this.cache) this.cache = {};
        	if(this.cache[id] != null) {
	        	alert("错误: ID为' " + id +" '的组件已经存在!");
	        	return;
	        }
            if(window['__host']){
                    window['__host'].cmps[id] = cmp;
                    cmp['__host'] = window['__host'];
            }
//        	if($L.focusWindow) $L.focusWindow.cmps[id] = cmp;
//        	if($L.focusTab) $L.focusTab.cmps[id] = cmp;
        	this.cache[id]=cmp;
        	cmp.on('mouseover',$L.CmpManager.onCmpOver,$L.CmpManager);
        	cmp.on('mouseout',$L.CmpManager.onCmpOut,$L.CmpManager);
        },
        onCmpOver: function(cmp, e){
        	if($L.validInfoType != 'tip') return;
        	if(($L.Grid && cmp instanceof $L.Grid)||($L.Table && cmp instanceof $L.Table)){
        		var ds = cmp.dataset;
        		if(!ds||ds.isValid == true||!e.target)return;
        		var target = Ext.fly(e.target).findParent('td');
                if(target){
                    var atype = Ext.fly(target).getAttributeNS("","atype");
            		if(atype == 'grid-cell'||atype == 'table-cell'){
            			var rid = Ext.fly(target).getAttributeNS("","recordid");
            			var record = ds.findById(rid);
            			if(record){
                			var name = Ext.fly(target).getAttributeNS("","dataindex");        			
        					var msg = record.valid[name];
        	        		if(Ext.isEmpty(msg))return;
        	        		$L.ToolTip.show(target, msg);
            			}
                    }
        		}
        	}else{
	        	if(cmp.binder){
	        		var ds = cmp.binder.ds;
	        		if(!ds || ds.isValid == true)return;
	        		var record = cmp.record;
	        		if(!record)return;
	        		var msg = record.valid[cmp.binder.name];
	        		if(Ext.isEmpty(msg))return;
	        		$L.ToolTip.show(cmp.id, msg);
	        	}
        	}
        },
        onCmpOut: function(cmp,e){
        	if($L.validInfoType != 'tip') return;
        	$L.ToolTip.hide();
        },
        getAll : function(){
        	return this.cache;
        },
        remove : function(id){
        	var cmp = this.cache[id];
            if(cmp['__host'] && cmp['__host'].cmps){
                delete cmp['__host'].cmps[id];        
            }
        	cmp.un('mouseover',$L.CmpManager.onCmpOver,$L.CmpManager);
        	cmp.un('mouseout',$L.CmpManager.onCmpOut,$L.CmpManager);
        	delete this.cache[id];
        },
        get : function(id){
        	if(!this.cache) return null;
        	return this.cache[id];
        }
    };
}();
Ext.Ajax.on("requestexception", function(conn, response, options) {
	if($L.slideBarEnable)$L.SideBar.enable = $L.slideBarEnable;
	$L.manager.fireEvent('ajaxerror', $L.manager, response.status, response);
	if($L.logWindow){
		var record = $('HTTPWATCH_DATASET').getCurrentRecord();
		var st = $L['_startTime'];
		var ed = new Date();					
		record.set('spend',ed-st);
		record.set('status',response.status);
		record.set('result',response.statusText);
		record.set('response',response.statusText);
	}
	switch(response.status){
		case 404:
			$L.showErrorMessage(response.status + _lang['ajax.error'], _lang['ajax.error.404']+'"'+ response.statusText+'"',null,400,150);
			break;
		case 500:
            $L.showErrorMessage(response.status + _lang['ajax.error'], response.responseText,null,500,300);
            break;
        case 0:
            break;
		default:
			$L.showErrorMessage(_lang['ajax.error'], response.statusText);
			break;
	}	
}, this);

/**
 * 获取Leaf控件的对象，可以使用简写方式的$()方法
 * @param {String} id Leaf控件的id
 */
$ = $L.getCmp = function(id){
	var cmp = $L.CmpManager.get(id)
	if(cmp == null) {
		alert('未找到组件:' + id)
	}
	return cmp;
}

/**
 * 设置cookie
 * @param {String} name cookie名
 * @param {String} value cookie值
 * @param {Number} days 有效期(单位是天),默认是sessions
 */
$L.setCookie = function(name,value,days){
    var pathname = location.pathname;
    pathname = pathname.substring(0, pathname.lastIndexOf('/') + 1);
    var exp = null;
    if(days){
        exp  = new Date();
        exp.setTime(exp.getTime() + days*24*60*60*1000);
    }
    document.cookie = name + "="+ escape (value) +';path = ' + pathname + ((exp) ? (';expires=' + exp.toGMTString()) : '');
}

/**
 * 根据cookie名获取cookie值
 * @param {String} name cookie名
 */
$L.getCookie = function(name){
    var arr = document.cookie.match(new RegExp("(^| )"+name+"=([^;]*)(;|$)"));
     if(arr != null) return unescape(arr[2]); return null;

}

/**
 * 获取页面可视高度
 * @return {Number} 页面可视高度
 */
$L.getViewportHeight = function(){
    if(Ext.isIE){
        return Ext.isStrict ? document.documentElement.clientHeight :
                 document.body.clientHeight;
    }else{
        return self.innerHeight;
    }
}
/**
 * 获取页面可视宽度
 * @return {Number} 页面可视宽度
 */
$L.getViewportWidth = function() {
    if(Ext.isIE){
        return Ext.isStrict ? document.documentElement.clientWidth :
                 document.body.clientWidth;
    }else{
        return self.innerWidth;
    }
}
//$L.recordSize = function(){
//    var w = $L.getViewportWidth();
//    var h = $L.getViewportHeight();
//    document.cookie = "vw="+w;
//    document.cookie = "vh="+h;
//}
//$L.recordSize();
/**
 * post的方式提交数据，同{@link Leaf.DataSet#post}
 * @param {String} action 提交的url地址
 * @param {Object} data 数据集合
 * @param {String} target 提交目标
 */
$L.post = function(action,data,target){
    var form = Ext.getBody().createChild({style:'display:none',tag:'form',method:'post',action:action,target:target||'_self'});
    for(var key in data){
    	var v = data[key]
    	if(v) {
    		if(v instanceof Date) v = v.format('isoDate');//TODO:时分秒如何处理?
            form.createChild({tag:"input",type:"hidden",name:key,value:v});
    	}
    }
    form.dom.submit();
}
/**
 * POST方式的Ajax请求
 * <p>
 * opt对象的属性:
 * <div class="mdetail-params"><ul>
 * <li><code>url</code>
 * <div class="sub-desc">提交的url地址</div></li>
 * <li><code>para</code>
 * <div class="sub-desc">提交的参数</div></li>
 * <li><code>scope</code>
 * <div class="sub-desc">作用域</div></li>
 * <li><code>sync</code>
 * <div class="sub-desc">是否同步,默认false</div></li> 
 * <li><code>success</code>
 * <div class="sub-desc">成功的回调函数</div></li>
 * <li><code>error</code>
 * <div class="sub-desc">错误的回调函数</div></li>
 * <li><code>failure</code>
 * <div class="sub-desc">ajax调用失败的回调函数</div></li>
 * </ul></div></p>
 * @param {Object} opt 参数对象
 */
$L.request = function(opt){
	var url = opt.url,para = opt.para,successCall = opt.success,errorCall = opt.error,scope = opt.scope,failureCall = opt.failure;
	var opts = Ext.apply({},opt.opts);
	$L.manager.fireEvent('ajaxstart', url, para);
	if($L.logWindow){
		$L['_startTime'] = new Date();
		$('HTTPWATCH_DATASET').create({'url':url,'request':Ext.util.JSON.encode({parameter:para})})
	}
	var data = Ext.apply({parameter:para},opt.ext);
	return Ext.Ajax.request({
		url: url,
		method: 'POST',
		params:{_request_data:Ext.util.JSON.encode(data)},
		opts:opts,
        sync:opt.sync,
		success: function(response,options){
			if($L.logWindow){
				var st = $L['_startTime'];
				var ed = new Date();					
				var record = $('HTTPWATCH_DATASET').getCurrentRecord();
				record.set('spend',ed-st);
				record.set('result',response.statusText);
				record.set('status',response.status);
				record.set('response',response.responseText);
			}
			$L.manager.fireEvent('ajaxcomplete', url, para,response);
			if(response){
				var res = null;
				try {
					res = Ext.decode(response.responseText);
				}catch(e){
					$L.showErrorMessage(_lang['ajax.error'], _lang['ajax.error.format']);
					return;
				}
                
				if(res && !res.success){
					$L.manager.fireEvent('ajaxfailed', $L.manager, url,para,res);
					if(res.error){
                        if(res.error.code  && (res.error.code == 'session_expired' || res.error.code == 'login_required')){
                            if($L.manager.fireEvent('timeout', $L.manager))
                            $L.showErrorMessage(_lang['ajax.error'],  _lang['session.expired']);
                        }else{
    						var st = res.error.stackTrace;
    						st = (st) ? st.replaceAll('\r\n','</br>') : '';
    						if(res.error.message) {
    							var h = (st=='') ? 150 : 250;
    						    $L.showErrorMessage(_lang['ajax.error'], res.error.message+'</br>'+st,null,400,h);
    						}else{
    						    $L.showErrorMessage(_lang['ajax.error'], st,null,400,250);
    						}
                        }
						if(errorCall)
                        errorCall.call(scope, res, options);
					}								    						    
				} else {
					$L.manager.fireEvent('ajaxsuccess', $L.manager, url,para,res);
					if(successCall)successCall.call(scope,res, options);
				}
			}
		},
		failure : function(response, options){
            if(failureCall)failureCall.call(scope, response, options);
		},
		scope: scope
	});
}
Leaf.dateFormat = function () { 
	var masks = {  
        "default":      "ddd mmm dd yyyy HH:MM:ss",  
        shortDate:      "m/d/yy",  
        mediumDate:     "mmm d, yyyy",  
        longDate:       "mmmm d, yyyy",  
        fullDate:       "dddd, mmmm d, yyyy",  
        shortTime:      "h:MM TT",  
        mediumTime:     "h:MM:ss TT",  
        longTime:       "h:MM:ss TT Z",  
        isoDate:        "yyyy-mm-dd",  
        isoTime:        "HH:MM:ss",  
        isoDateTime:    "yyyy-mm-dd'T'HH:MM:ss",  
        isoUtcDateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'"  
    };
    var token = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g,  
        timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,  
        timezoneClip = /[^-+\dA-Z]/g,  
        pad = function (val, len) {  
            val = String(val);  
            len = len || 2;  
            while (val.length < len) val = "0" + val;  
            return val;  
        },
        hasTimeStamp = function(mask,token){
	    	return !!String(masks[mask] || mask || masks["default"]).match(token);
        },
        _parseDate=function(string,mask,fun){
        	for(var i=0,arr=mask.match(token),numbers=string.match(/\d+/g),value,index=0;i<arr.length;i++){
        		if(numbers.length==arr.length)value=numbers[i];
        		else if(numbers.length == 1)value=parseInt(string.slice(index,index+=arr[i].length),10);
        		else value=parseInt(string.slice(index=mask.search(arr[i]),index+arr[i].length));
        		switch(arr[i]){
        			case "mm":;
        			case "m":value--;break;
        		}
        		fun(arr[i],value);
        	}
        }; 
    return {
    	pad:pad,
    	parseDate:function(string,mask,utc){
    		if(typeof string!="string"||string=="")return null;
    		mask = String(masks[mask] || mask || masks["default"]); 
    		if (mask.slice(0, 4) == "UTC:") {  
	            mask = mask.slice(4);  
	            utc = true;  
	        }
    		var date=new Date(1970,1,2,0,0,0),
    			_ = utc ? "setUTC" : "set",  
	            d = date[_ + "Date"],  
	            m = date[_ + "Month"],  
	            yy = date[_ + "FullYear"], 
	            y = date[_ + "Year"], 
	            H = date[_ + "Hours"],  
	            M = date[_ + "Minutes"],  
	            s = date[_ + "Seconds"],  
	            L = date[_ + "Milliseconds"],  
	            //o = utc ? 0 : date.getTimezoneOffset();
				flags = {  
	                d:    d,  
	                dd:   d,
	                m:    m,  
	                mm:   m,  
	                yy:   y,  
	                yyyy: yy,  
	                h:    H,  
	                hh:   H,  
	                H:    H,  
	                HH:   H,  
	                M:    M,  
	                MM:   M,  
	                s:    s,  
	                ss:   s,  
	                l:    L,  
	                L:    L
	            }; 
	            try{
					_parseDate(string,mask,function($0,value){
					   	flags[$0].call(date,value);
					});
	            }catch(e){throw new SyntaxError("invalid date");}
				if (isNaN(date)) throw new SyntaxError("invalid date"); 
				return date;
    	},
	    format:function (date, mask, utc) {    
	        if (arguments.length == 1 && (typeof date == "string" || date instanceof String) && !/\d/.test(date)) {  
	            mask = date;  
	            date = undefined;  
	        }   
	        date = date ? new Date(date) : new Date();  
	        if (isNaN(date)) throw new SyntaxError("invalid date");  
	  
	        mask = String(masks[mask] || mask || masks["default"]);  
	        if (mask.slice(0, 4) == "UTC:") {  
	            mask = mask.slice(4);  
	            utc = true;  
	        }  
	  
	        var _ = utc ? "getUTC" : "get",  
	            d = date[_ + "Date"](),  
	            D = date[_ + "Day"](),  
	            m = date[_ + "Month"](),  
	            y = date[_ + "FullYear"](),  
	            H = date[_ + "Hours"](),  
	            M = date[_ + "Minutes"](),  
	            s = date[_ + "Seconds"](),  
	            L = date[_ + "Milliseconds"](),  
	            o = utc ? 0 : date.getTimezoneOffset(),  
	            flags = {  
	                d:    d,  
	                dd:   pad(d),
	                m:    m + 1,  
	                mm:   pad(m + 1),  
	                yy:   String(y).slice(2),  
	                yyyy: y,  
	                h:    H % 12 || 12,  
	                hh:   pad(H % 12 || 12),  
	                H:    H,  
	                HH:   pad(H),  
	                M:    M,  
	                MM:   pad(M),  
	                s:    s,  
	                ss:   pad(s),  
	                l:    pad(L, 3),  
	                L:    pad(L > 99 ? Math.round(L / 10) : L),  
	                t:    H < 12 ? "a"  : "p",  
	                tt:   H < 12 ? "am" : "pm",  
	                T:    H < 12 ? "A"  : "P",  
	                TT:   H < 12 ? "AM" : "PM",  
	                Z:    utc ? "UTC" : (String(date).match(timezone) || [""]).pop().replace(timezoneClip, ""),  
	                o:    (o > 0 ? "-" : "+") + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4),  
	                S:    ["th", "st", "nd", "rd"][d % 10 > 3 ? 0 : (d % 100 - d % 10 != 10) * d % 10]  
	            }; 
	        return mask.replace(token, function ($0) {  
	            return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1);  
	        });  
	    },
	    isDateTime:function(mask){
	    	return hasTimeStamp(mask,/([HhMs])\1?/);
	    }
    };  
}();

Ext.applyIf(String.prototype, {
	trim : function(){
		return this.replace(/(^\s*)|(\s*$)/g, "");
	}
});
Ext.applyIf(Date.prototype, {
    format : function(mask, utc){
        return Leaf.dateFormat.format(this, mask, utc);  
    }
});
Ext.applyIf(Array.prototype, {
	add : function(o){
		if(this.indexOf(o) == -1)
		this[this.length] = o;
	}
});
Ext.applyIf(String.prototype, {
    replaceAll : function(s1,s2){
        return this.replace(new RegExp(s1,"gm"),s2);  
    }
}); 
Ext.applyIf(String.prototype, {
    parseDate : function(mask,utc){
        return Leaf.dateFormat.parseDate(this.toString(),mask,utc);  
    }
}); 
$L.TextMetrics = function(){
    //var shared;
    return {
        measure : function(el, text, fixedWidth){
            //if(!shared){
              var shared = $L.TextMetrics.Instance(el, fixedWidth);
            //}
            //shared.bind(el);
            //shared.setFixedWidth(fixedWidth || 'auto');
            return shared.getSize(text);
        }
    };
}();
$L.TextMetrics.Instance = function(bindTo, fixedWidth){
	var p = '<div style="left:-1000px;top:-1000px;position:absolute;visibility:hidden"></div>';
	var ml = Ext.get(Ext.DomHelper.append(Ext.get(bindTo),p));
//    var ml = new Ext.Element(document.createElement('div'));
//    document.body.appendChild(ml.dom);
//    ml.position('absolute');
//    ml.setLeft(-1000);
//    ml.setTop(-1000);    
//    ml.hide();
    if(fixedWidth){
        ml.setWidth(fixedWidth);
    }
    var instance = {      
        getSize : function(text){
            ml.update(text);            
            var s=new Object();
            s.width=ml.getWidth();
            s.height=ml.getHeight();
            ml.update('');
            return s;
        },       
        bind : function(el){
        	var a=new Array('font-size','font-style', 'font-weight', 'font-family','line-height', 'text-transform', 'letter-spacing');	
        	var len = a.length, r = {};
        	for(var i = 0; i < len; i++){
                r[a[i]] = Ext.fly(el).getStyle(a[i]);
            }
            ml.setStyle(r);           
        },       
        setFixedWidth : function(width){
            ml.setWidth(width);
        }       
    };
    instance.bind(bindTo);
    return instance;
};
$L.ToolTip = function(){
	q = {
		init: function(){
			var sf = this;
			Ext.onReady(function(){
				var qdom = Ext.DomHelper.insertFirst(
				    Ext.getBody(),
				    {
					    tag: 'div',
					    cls: 'tip-wrap',
					    children: [{tag: 'div', cls:'tip-body'}]
				    }
				);
				var sdom = Ext.DomHelper.insertFirst(Ext.getBody(),{tag:'div',cls: 'item-shadow'});
				sf.tip = Ext.get(qdom);
				sf.shadow = Ext.get(sdom);
				sf.body = sf.tip.first("div.tip-body");
			})
			
		},
		show: function(el, text){
			if(this.tip == null){
				this.init();
				//return;
			}
			this.tip.show();
			this.shadow.show();
			this.body.update(text)
			var ele;
			if(typeof(el)=="string"){
				if(this.sid==el) return;
				this.sid = el;
				var cmp = $L.CmpManager.get(el)
				if(cmp){
					if(cmp.wrap){
						ele = cmp.wrap;
					}
				}				
			}else{
				ele = Ext.get(el);
			}
			this.shadow.setWidth(this.tip.getWidth())
			this.shadow.setHeight(this.tip.getHeight())
			this.correctPosition(ele);
		},
		correctPosition: function(ele){
			var screenWidth = $L.getViewportWidth();
			var x = ele.getX()+ele.getWidth() + 5;
			var sx = ele.getX()+ele.getWidth() + 7;
			if(x+this.tip.getWidth() > screenWidth){
				x = ele.getX() - this.tip.getWidth() - 5;
				sx = ele.getX() - this.tip.getWidth() - 3;
			}
			this.tip.setX(x);
			this.tip.setY(ele.getY());
			this.shadow.setX(sx);
			this.shadow.setY(this.tip.getY()+ 2)
		},
		hide: function(){
			this.sid = null;
			if(this.tip != null) this.tip.hide();
			if(this.shadow != null) this.shadow.hide();
		}
	}
	return q
}();
$L.SideBar = function(){
    var m = {
    	enable:true,
        bar:null,
        show : function(msg){
        	if(!this.enable)return;
//            this.hide();
            var sf = this;
            if(parent.showSideBar){
                parent.showSideBar(msg)
            }else{
            	this.hide();
                var p = '<div class="item-slideBar">'+msg+'</div>';
                this.bar = Ext.get(Ext.DomHelper.insertFirst(Ext.getBody(),p));
                this.bar.setStyle('z-index', 999999);
                var screenWidth = $L.getViewportWidth();
                var x = Math.max(0,(screenWidth - this.bar.getWidth())/2);
                this.bar.setX(x);
                this.bar.fadeIn();
//                this.bar.animate({height: {to: 50, from: 0}},0.35,function(){
                    setTimeout(function(){
                       sf.hide();
                    }, 2000);            
//                },'easeOut','run');
            }
        },
        hide : function(){
            if(!this.enable)return;
        	if(parent.hideSideBar){
                parent.hideSideBar()
            }else{
                if(this.bar) {
                    Ext.fly(this.bar).fadeOut();
                    Ext.fly(this.bar).remove();
                    this.bar = null;
                }
            }
        }
    }
    return m;
}();
$L.Status = function(){
    var m = {
        bar:null,
        enable:true,
        show : function(msg){
        	if(!this.enable)return;
        	this.hide();
        	if(parent.showStatus) {
        	   parent.showStatus(msg);
        	}else{
                var p = '<div class="item-statusBar" unselectable="on">'+msg+'</div>';
                this.bar = Ext.get(Ext.DomHelper.insertFirst(Ext.getBody(),p));
                this.bar.setStyle('z-index', 999998);
        	}
        },
        hide : function(){
            if(!this.enable)return;
        	if(parent.hideStatus){
                parent.hideStatus();
        	}else{
                if(this.bar) {
                    Ext.fly(this.bar).remove();
                    this.bar = null;
                }
        	}
        }
    }
    return m;
}();
$L.Cover = function(){
	var m = {
		bodyOverflow:null,
		sw:null,
		sh:null,
		container: {},
		cover : function(el){
//			if(!$L.Cover.bodyOverflow)$L.Cover.bodyOverflow = Ext.getBody().getStyle('overflow');		
			var scrollWidth = Ext.isStrict ? document.documentElement.scrollWidth : document.body.scrollWidth;
    		var scrollHeight = Ext.isStrict ? document.documentElement.scrollHeight : document.body.scrollHeight;
    		var screenWidth = Math.max(scrollWidth,$L.getViewportWidth());
    		var screenHeight = Math.max(scrollHeight,$L.getViewportHeight());
			var p = '<DIV class="leaf-cover"'+(Ext.isIE6?' style="position:absolute;width:'+(screenWidth-1)+'px;height:'+(screenHeight-1)+'px;':'')+'" unselectable="on"></DIV>';
			var cover = Ext.get(Ext.DomHelper.insertFirst(Ext.getBody(),p));
	    	cover.setStyle('z-index', Ext.fly(el).getStyle('z-index') - 1);
//	    	Ext.getBody().setStyle('overflow','hidden');
	    	$L.Cover.container[el.id] = cover;
		},
		uncover : function(el){
			var cover = $L.Cover.container[el.id];
			if(cover) {
				Ext.fly(cover).remove();
				$L.Cover.container[el.id] = null;
				delete $L.Cover.container[el.id];
			}
			var reset = true;
			for(key in $L.Cover.container){
                if($L.Cover.container[key]) {
                    reset = false; 	
                    break;
                }
            }
//            if(reset&&$L.Cover.bodyOverflow)Ext.getBody().setStyle('overflow',$L.Cover.bodyOverflow);
		},
		resizeCover : function(){
			for(key in $L.Cover.container){
                var cover = $L.Cover.container[key];
                Ext.fly(cover).setStyle('display','none');
            }
            setTimeout(function(){
    			var scrollWidth = Ext.isStrict ? document.documentElement.scrollWidth : document.body.scrollWidth;
        		var scrollHeight = Ext.isStrict ? document.documentElement.scrollHeight : document.body.scrollHeight;
        		var screenWidth = Math.max(scrollWidth,$L.getViewportWidth()) -1;
        		var screenHeight = Math.max(scrollHeight,$L.getViewportHeight()) -1;
    			for(key in $L.Cover.container){
    				var cover = $L.Cover.container[key];
    				Ext.fly(cover).setWidth(screenWidth);
    				Ext.fly(cover).setHeight(screenHeight);
    				Ext.fly(cover).setStyle('display','');
    			}		
            },1)
		}
	}
	return m;
}();
$L.Masker = function(){
    var m = {
        container: {},
        mask : function(el,msg){
        	if($L.Masker.container[el.id]){
        	   return;
        	}
        	msg = msg||_lang['mask.loading'];
        	var el = Ext.get(el);
            var w = el.getWidth();
            var h = el.getHeight();//leftp:0px;top:0px; 是否引起resize?
            var p = '<div class="leaf-mask"  style="left:-1000px;top:-1000px;width:'+w+'px;height:'+h+'px;position: absolute;"><div unselectable="on"></div><span style="top:'+(h/2-11)+'px">'+msg+'</span></div>';
            var wrap = el.parent('body')?el.parent():el;
            var masker = Ext.get(Ext.DomHelper.append(wrap,p));
            var zi = el.getStyle('z-index') == 'auto' ? 0 : el.getStyle('z-index');
            masker.setStyle('z-index', zi + 1);
            masker.setXY(el.getXY());
            var sp = masker.child('span');
            //var size = $L.TextMetrics.measure(sp,msg);
            //sp.setLeft((w-size.width - 45)/2)
            sp.setLeft((w-sp.getWidth() - 45)/2)
            $L.Masker.container[el.id] = masker;
        },
        unmask : function(el){
            var masker = $L.Masker.container[el.id];
            if(masker) {
                Ext.fly(masker).remove();
                $L.Masker.container[el.id] = null;
                delete $L.Masker.container[el.id];
            }
        }
    }
    return m;
}();
Ext.util.JSON.encodeDate = function(o){
	var pad = function(n) {
        return n < 10 ? "0" + n : n;
    };
    var r = '"' + o.getFullYear() + "-" +
            pad(o.getMonth() + 1) + "-" +
            pad(o.getDate());
    if(o.xtype == 'timestamp') {
        r = r + " " +
            pad(o.getHours()) + ":" +
            pad(o.getMinutes()) + ":" +
            pad(o.getSeconds())    	
    }
    r += '"';
    return r
};
$L.evalList = [];
$L.evaling = false;
$L.doEvalScript = function(){
    $L.evaling = true;
    var list = $L.evalList;
    var o = list.shift();
    if(!o) {
        window['__host'] = null;
        $L.evaling = false;
        if($L.loadEvent){
        	$L.loadEvent.fire();
	        $L.loadEvent = null;
        }
        return;
    }
    var sf = o.sf, html=o.html, loadScripts=o.loadScripts, callback=o.callback, host=o.host;
    var dom = sf.dom;
    
    if(host) window['__host'] = host;
    var links = [];
    var scripts = [];
    var hd = document.getElementsByTagName("head")[0];
    for(var i=0;i<hd.childNodes.length;i++){
        var he = hd.childNodes[i];
        if(he.tagName == 'LINK') {
            links.push(he.href);
        }else if(he.tagName == 'SCRIPT'){
            scripts.push(he.src);
        }
    }
    var jsre = /(?:<script([^>]*)?>)((\n|\r|.)*?)(?:<\/script>)/ig;
    var jsSrcRe = /\ssrc=([\'\"])(.*?)\1/i;
    
    var cssre = /(?:<link([^>]*)?>)((\n|\r|.)*?)/ig;
    var cssHreRe = /\shref=([\'\"])(.*?)\1/i;
    
    var cssm;
    while(cssm = cssre.exec(html)){
        var attrs = cssm[1];
        var srcMatch = attrs ? attrs.match(cssHreRe) : false;
        if(srcMatch && srcMatch[2]){
            var included = false;
            for(var i=0;i<links.length;i++){
                var link = links[i];
                if(link.indexOf(srcMatch[2]) != -1){
                    included = true;
                    break;
                }
            }
            if(!included) {
                var s = document.createElement("link");
                s.type = 'text/css';
                s.rel = 'stylesheet';
                s.href = srcMatch[2];
                hd.appendChild(s);
            }
        }
    }
    var match;
    var jslink = [];
    var jsscript = [];
    while(match = jsre.exec(html)){
        var attrs = match[1];
        var srcMatch = attrs ? attrs.match(jsSrcRe) : false;
        if(srcMatch && srcMatch[2]){
            var included = false;
            for(var i=0;i<scripts.length;i++){
                var script = scripts[i];
                if(script.indexOf(srcMatch[2]) != -1){
                    included = true;
                    break;
                }
            }
            if(!included) {
                jslink[jslink.length] = {
                    src:srcMatch[2],
                    type:'text/javascript'
                }
            } 
        }else if(match[2] && match[2].length > 0){
            jsscript[jsscript.length] = match[2];
        }
    }
    var loaded = 0;
    
    var onReadOnLoad = function(){
        var isready = Ext.isIE ? (!this.readyState || this.readyState == "loaded" || this.readyState == "complete") : true;
        if(isready) {
            loaded ++;
            if(loaded==jslink.length) {
                for(j=0,k=jsscript.length;j<k;j++){
                    var jst = jsscript[j];
                    if(window.execScript) {
                        window.execScript(jst);
                    } else {
                        window.eval(jst);
                    }
                }
                var el = document.getElementById(id);
                if(el){Ext.removeNode(el);} 
                Ext.fly(dom).setStyle('display', 'block');
                if(typeof callback == "function"){
                    callback();
                }
                $L.doEvalScript();
            }else{
                var js = jslink[loaded];
                var s = document.createElement("script");
                s.src = js.src;
                s.type = js.type;
                s[Ext.isIE ? "onreadystatechange" : "onload"] = onReadOnLoad;
                hd.appendChild(s);
            }
        }
    }
    
    if(jslink.length > 0){
        var js = jslink[0];
        var s = document.createElement("script");
        s.src = js.src;
        s.type = js.type;
        s[Ext.isIE ? "onreadystatechange" : "onload"] = onReadOnLoad;
        hd.appendChild(s);
    } else if(jslink.length ==0) {
        for(j=0,k=jsscript.length;j<k;j++){
            var jst = jsscript[j];
            if(window.execScript) {
               window.execScript(jst);
            } else {
               window.eval(jst);
            }
        }
        var el = document.getElementById(id);
        if(el){Ext.removeNode(el);} 
        Ext.fly(dom).setStyle('display', 'block');
        if(typeof callback == "function"){
                callback();
        }
        $L.doEvalScript();
    } 
}
Ext.Element.prototype.update = function(html, loadScripts, callback,host){
    if(typeof html == "undefined"){
        html = "";
    }
    if(loadScripts !== true){
        this.dom.innerHTML = html;
        if(typeof callback == "function"){
            callback();
        }
        return this;
    }
    
    var id = Ext.id();
    var sf = this;
    var dom = this.dom;
    html += '<span id="' + id + '"></span>';
    Ext.lib.Event.onAvailable(id, function(){
        $L.evalList.push({
            html:html,
            loadScripts:loadScripts,
            callback:callback,
            host:host,
            sf:sf
        });
        if(!$L.evaling)
        $L.doEvalScript() 
    });
    
    Ext.fly(dom).setStyle('display', 'none');
    dom.innerHTML = html.replace(/(?:<script.*?>)((\n|\r|.)*?)(?:<\/script>)/ig, "").replace(/(?:<link.*?>)((\n|\r|.)*?)/ig, "");
    return this;
}

Ext.EventObjectImpl.prototype['isSpecialKey'] = function(){
    var k = this.keyCode;
//    return (this.type == 'keypress' && this.ctrlKey) || k==8 || k== 46 || k == 9 || k == 13  || k == 40 || k == 27 || k == 44 ||
     return (this.type == 'keypress' && this.ctrlKey) || k == 9 || k == 13  || k == 40 || k == 27 ||
    (k == 16) || (k == 17) ||
    (k >= 18 && k <= 20) ||
    (k >= 33 && k <= 35) ||
    (k >= 36 && k <= 39) ||
    (k >= 44 && k <= 45);
}
Ext.removeNode = Ext.isIE && !Ext.isIE8 ? function(){
    var d;
    return function(n){
        if(n && n.tagName != 'BODY'){
            (Ext.enableNestedListenerRemoval) ? Ext.EventManager.purgeElement(n, true) : Ext.EventManager.removeAll(n);
            if(!d){
                d = document.createElement('div');
                d.id = '_removenode';
                d.style.cssText = 'position:absolute;display:none;left:-1000px;top:-1000px';
            }
//            d = d || document.createElement('<div id="_removenode" style="position:absolute;display:none;left:-1000px;top:-1000px">');
            if(!d.parentNode)document.body.appendChild(d);
            d.appendChild(n);
            d.innerHTML = '';
            delete Ext.elCache[n.id];
        }
    }
}() : function(n){
    if(n && n.parentNode && n.tagName != 'BODY'){
        (Ext.enableNestedListenerRemoval) ? Ext.EventManager.purgeElement(n, true) : Ext.EventManager.removeAll(n);
        n.parentNode.removeChild(n);
        delete Ext.elCache[n.id];
    }
}
$L.parseDate = function(str){
	if(typeof str == 'string'){  
		
		//TODO:临时, 需要服务端解决
//		if(str.indexOf('.0') !=-1) str = str.substr(0,str.length-2);
		
		var results = str.match(/^ *(\d{4})-(\d{1,2})-(\d{1,2}) *$/);      
		if(results && results.length>3)      
	  		return new Date(parseInt(results[1]),parseInt(results[2],10) -1,parseInt(results[3],10));       
		results = str.match(/^ *(\d{4})-(\d{1,2})-(\d{1,2}) +(\d{1,2}):(\d{1,2}):(\d{1,2}) *$/);  
	    if(results && results.length>6)      
    	return new Date(parseInt(results[1]),parseInt(results[2],10) -1,parseInt(results[3],10),parseInt(results[4],10),parseInt(results[5],10),parseInt(results[6],10));       
	}      
  	return null;      
}
$L.getRenderer = function(renderer){
	if(!renderer) return null;
	var rder;
    if(renderer.indexOf('Leaf.') != -1){
        rder = $L[renderer.substr(7,renderer.length)]
    }else{
        rder = window[renderer];
    }
    return rder;
}
$L.RowNumberRenderer = function(value,record,name){
    if(record && record.ds){
        var ds = record.ds;
        return (ds.currentPage-1)*ds.pagesize + ds.indexOf(record) + 1;
    }
}
/**
 * 将日期转换成默认格式的字符串，默认格式是根据Leaf.defaultDateFormat来定义的.如果没有特殊指定,默认格式为yyyy-mm-dd
 * @param {Date} date 转换的日期
 * @return {String}
 */
$L.formatDate = function(date){
	if(!date)return '';
	if(date.format)return date.format($L.defaultDateFormat);
	return date;
}
/**
 * 将日期转换成yyyy-mm-dd HH:MM:ss格式的字符串
 * @param {Date} date 需要转换的日期
 * @return {String} 转换后的字符串
 */
$L.formatDateTime = function(date){
	if(!date)return '';
	if(date.format)return date.format($L.defaultDateTimeFormat);
	return date;
}
/**
 * 将数值根据精度转换成带有千分位的字符串
 * 
 * @param {Number} value 数值
 * @param {Number} decimalprecision 小数点位数
 * @return {String}
 */
$L.formatNumber = function(value,decimalprecision){
	if(Ext.isEmpty(value))return '';
	value = String(value).replace(/,/g,'');
	if(isNaN(value))return '';
	if(decimalprecision||decimalprecision===0) value=Number(value).toFixed(decimalprecision);
    var ps = value.split('.');
    var sub = (ps.length==2)?'.'+ps[1]:'';
    var whole = ps[0];
    var r = /(\d+)(\d{3})/;
    while (r.test(whole)) {
        whole = whole.replace(r, '$1' + ',' + '$2');
    }
    v = whole + sub;
    return v;   
}
/**
 * 将数值转换成带有千分位的字符串，并保留两位小数
 * 
 * @param {Number} value 数值
 * @return {String}
 */
$L.formatMoney = function(v){
    return $L.formatNumber(v,2)
}
/**
 * 将字符串的千分位去除
 * @param {Number} value 数值
 * @param {String} rv 带有千分位的数值字符串
 * @return {Number} 数值
 */
$L.removeNumberFormat = function(rv){
    rv = String(rv||'');
    while (rv.indexOf(',')!=-1) {
        rv = rv.replace(',', '');
    }
    return isNaN(rv) ? parseFloat(rv) : rv;
}

$L.EventManager = Ext.extend(Ext.util.Observable,{
	constructor: function() {
		$L.EventManager.superclass.constructor.call(this);
		this.initEvents();
	},
	initEvents : function(){
    	this.addEvents(
    		'ajaxerror',
    		'ajaxsuccess',
    		'ajaxfailed',
    		'ajaxstart',
    		'ajaxcomplete',
    		'valid',
	        'timeout'
		);    	
    }
});
$L.manager = new $L.EventManager();
$L.manager.on('ajaxstart',function(){
    $L.Status.show(_lang['eventmanager.start']);   
})
$L.manager.on('timeout',function(){
    $L.Status.hide();
})
$L.manager.on('ajaxerror',function(){
    $L.Status.hide();
})
$L.manager.on('ajaxcomplete',function(){
    $L.Status.hide();
})
$L.manager.on('ajaxsuccess',function(){
    $L.SideBar.show(_lang['eventmanager.success'])
})

$L.regEvent = function(name, hanlder){
	$L.manager.on(name, hanlder);
}

$L.validInfoType = 'area';
$L.validInfoTypeObj = '';
$L.setValidInfoType = function(type, obj){
	$L.validInfoType = type;
	$L.validInfoTypeObj = obj;
}

$L.invalidRecords = {};
$L.addInValidReocrd = function(id, record){
	var rs = $L.invalidRecords[id];
	if(!rs){
		$L.invalidRecords[id] = rs = [];
	}
	var has = false;
	for(var i=0;i<rs.length;i++){
		var r = rs[i];
		if(r.id == record.id){
			has = true;
			break;
		}
	}
	if(!has) {
		rs.add(record)
	}
}
$L.removeInvalidReocrd = function(id,record){
	var rs = $L.invalidRecords[id];
	if(!rs) return;
	for(var i=0;i<rs.length;i++){
		var r = rs[i];
		if(r.id == record.id){
			rs.remove(r)
			break;
		}
	}
}
$L.getInvalidRecords = function(pageid){
	var records = [];
	for(var key in $L.invalidRecords){
		var ds = $L.CmpManager.get(key)
		if(ds.pageid == pageid){
			var rs = $L.invalidRecords[key];
			records = records.concat(rs);
		}
	}
	return records;
}
$L.isInValidReocrdEmpty = function(pageid){
	var isEmpty = true;
	for(var key in $L.invalidRecords){
		var ds = $L.CmpManager.get(key)
		if(ds.pageid == pageid){
			var rs = $L.invalidRecords[key];
			if(rs.length != 0){
				isEmpty = false;
				break;
			}
		}
	}
	return isEmpty;
}
$L.manager.on('valid',function(manager, ds, valid){
	switch($L.validInfoType){
		case 'area':
			$L.showValidTopMsg(ds);
			break;
		case 'message':
			$L.showValidWindowMsg(ds);
			break;
	}
})
$L.showValidWindowMsg = function(ds) {
	var empty = $L.isInValidReocrdEmpty(ds.pageid);
	if(empty == true){
		if($L.validWindow)$L.validWindow.close();
	}
	if(!$L.validWindow && empty == false){
		$L.validWindow = $L.showWarningMessage(_lang['valid.fail'],'',400,200);
		$L.validWindow.on('close',function(){
			$L.validWindow = null;			
		})
	}
	var sb =[];
	var rs = $L.getInvalidRecords(ds.pageid);
	for(var i=0;i<rs.length;i++){
		var r = rs[i];
		var index = r.ds.data.indexOf(r)+1
		sb[sb.length] =_lang['valid.fail.note']+'<a href="#" onclick="$(\''+r.ds.id+'\').locate('+index+')">('+r.id+')</a>:';

		for(var k in r.valid){
			sb[sb.length] = r.valid[k]+';'
		}
		sb[sb.length]='<br/>';
	}
	if($L.validWindow)$L.validWindow.body.child('div').update(sb.join(''))
}
$L.pageids = [];
$L.showValidTopMsg = function(ds) {
	var empty = $L.isInValidReocrdEmpty(ds.pageid);
	if(empty == true){
		var d = Ext.get(ds.pageid+'_msg');
		if(d){
			d.hide();
			d.setStyle('display','none')
			d.update('');
		}
		return;
	}
	var rs = $L.getInvalidRecords(ds.pageid);
	var sb = [];
	for(var i=0;i<rs.length;i++){
		var r = rs[i];
		var index = r.ds.data.indexOf(r)+1
		sb[sb.length] =_lang['valid.fail.note']+'<a href="#" onclick="$(\''+r.ds.id+'\').locate('+index+')">('+r.id+')</a>:';

		for(var k in r.valid){
			sb[sb.length] = r.valid[k]+';'
		}
		sb[sb.length]='<br/>';		
	}
	var d = Ext.get(ds.pageid+'_msg');
	if(d){
		d.update(sb.join(''));
		d.show(true);
	}					
}
//Ext.get(document.documentElement).on('keydown',function(e){
//	if(e.altKey&&e.keyCode == 76){
//		if(!$L.logWindow) {
//			$L.logWindow = new $L.Window({modal:false, url:'log.screen',title:'AjaxWatch', height:550,width:530});	
//			$L.logWindow.on('close',function(){
//				delete 	$L.logWindow;		
//			})
//		}
//	}
//})
$L.startCustomization = function(){
    var cust = $L.CmpManager.get('_customization');
    if(cust==null){
        cust = new $L.Customization({id:'_customization'});    
    }
    cust.start();
}
$L.stopCustomization = function(){
    var cust = $L.CmpManager.get('_customization');
    if(cust!=null){
        cust.stop();
        $L.CmpManager.remove('_customization');
    }
}
/**
 * 将数字金额转换成大写金额.
 * 
 * @param {Number} amount 金额
 * @return {String} 大写金额
 */
$L.convertMoney = function(mnum){
	mnum = Math.abs(mnum);
	var unitArray = [["元", "万", "亿"], ["仟", "", "拾", "佰"],["零", "壹", "贰", "叁", "肆", "伍", "陆", "柒", "捌", "玖"]];
	totalarray = new Array();

	totalarray = mnum.toString().split(".");
	if (totalarray.length == 1) {
		totalarray[1] = "00"
	} else if (totalarray[1].length == 1) {
		totalarray[1] += '0';
	}
	integerpart = new Array();
	decimalpart = new Array();
	var strout = "";
	for (var i = 0; i < totalarray[0].length; i++) {
		integerpart[i] = totalarray[0].charAt(i);
	}
	for (var i = 0; i < totalarray[1].length; i++) {
		decimalpart[i] = totalarray[1].charAt(i);
	}
	for (var i = 0; i < integerpart.length; i++) {
		var strTemp = (integerpart.length - i - 1) % 4 == 0
				? unitArray[0][parseInt((integerpart.length - i) / 4)]
				: (integerpart[i] == 0)
						? ""
						: unitArray[1][((integerpart.length - i) % 4)]
		strout = strout + unitArray[2][integerpart[i]] + strTemp;
	}
	strout = strout.replace(new RegExp(/零+/g), "零");
	strout = strout.replace("零万", "万");
	strout = strout.replace("零亿", "亿");
	strout = strout.replace("零元", "元");
	strout = strout.replace("亿万", "亿");
	var strdec = ""
	if (decimalpart[0] == 0 && decimalpart[1] == 0) {
		strdec = "整";
	} else {
		if (decimalpart[0] == 0) {
			strdec = "零"
		} else {
			strdec = unitArray[2][decimalpart[0]] + '角';
		}
		if (decimalpart[1] != 0) {
			strdec += unitArray[2][decimalpart[1]] + '分';
		}
	}
	strout += strdec;
	if (mnum < 0)
		strout = "负" + strout;
	return strout;
}
$L.setValidInfoType('tip'); 

$L.escapeHtml = function(str){
	if(Ext.isEmpty(str) || !Ext.isString(str))
		return str;
	return String(str).replace(/&/gm,'&amp;')
	.replace(/</gm,'&lt;').replace(/>/gm,'&gt;');
}
$L.doExport=function(dataset,cols,generate_state){
	var p={"parameter":{"_column_config_":{}}},columns=[],parentMap={},
    	_parentColumn=function(pcl,cl){
    		if(!(Ext.isDefined(pcl.forexport)?pcl.forexport:true))return null;
    		var json=Ext.encode(pcl);
    		var c=parentMap[json];
    		if(!c)c={prompt:pcl.prompt};
    		parentMap[json]=c;
    		(c["column"]=c["column"]||[]).add(cl);
    		if(pcl._parent){
    			return _parentColumn(pcl._parent,c)
    		}
    		return c;
    	};
    	for(var i=0;i<cols.length;i++){
    		var column=cols[i],forExport=Ext.isDefined(column.forexport)?column.forexport:true;
    		if(column.type != 'rowcheck' && column.type!= 'rowradio'&&forExport){
    			var c={prompt:column.prompt}
    			if(column.width)c.width=column.width;
    			if(column.name)c.name=column.exportfield||column.name;
    			c.align=column.align||"left";
    			var o=column._parent?_parentColumn(column._parent,c):c;
	    		if(o)columns.add(o);
    		}
    	}
    	p["parameter"]["_column_config_"]["column"]=columns;
    	p["_generate_state"]=Ext.isEmpty(generate_state)?true:generate_state;
    	p["_format"]="xls";
    	var r,q = {};
    	if(dataset.qds)r = dataset.qds.getCurrentRecord();
    	if(r) Ext.apply(q, r.data);
    	Ext.apply(q, dataset.qpara);
    	for(var k in q){
    	   if(Ext.isEmpty(q[k],false)) delete q[k];
    	}
    	Ext.apply(p.parameter,q)
		var form = document.createElement("form");
		form.target = "_export_window";
		form.method="post";
		var url = dataset.queryurl;
		if(url)form.action = url + (url.indexOf('?') == -1 ? '?' : '&')+'r='+Math.random();
		var iframe = Ext.get('_export_window')||new Ext.Template('<iframe id ="_export_window" name="_export_window" style="position:absolute;left:-1000px;top:-1000px;width:1px;height:1px;display:none"></iframe>').insertFirst(document.body,{},true)
		var s = document.createElement("input");
		s.id = "_request_data";
		s.type = 'hidden';
		s.name = '_request_data';
       	s.value = Ext.encode(p);
       	form.appendChild(s);
       	document.body.appendChild(form);
       	form.submit();
       	Ext.fly(form).remove();	
}