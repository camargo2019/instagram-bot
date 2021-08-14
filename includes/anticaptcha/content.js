var __captchaInterval=false;
//var __captchaDB;
//var __captchaLang='en';
//var __captchaKey='';
var __captchaWork=false;
var __captchaLastFound=false;
var __captchaChangeAnother=false;
var __captchaLastInput=false;
var __captchaAnotherInput=false;
var __captchaLastID='';
var __captchaAuto=false;
//var __captchaJustActive=true;
var __captchaFX=/firefox/i.test(navigator.userAgent);
//var __captchaFXStorage;
var __captchaSettings={};
var __captchaStorage={};

function __captchaAddClass(object,classname)
{
	if(classname===undefined || classname=="") return;
	if(object && !__captchaHaveClass(object,classname)) object.className+=(object.className==""?"":" ")+classname;
}
/*update*/
function __captchaHaveClass(object,classname)
{
	if(classname===undefined || classname=="") return false;
	if(object && ('className' in object))
	{
		if(object.className)
		{
			var r=new RegExp('(^|\\s)'+classname+'(\\s|$)','m');
			r.lastIndex=0;
			if(r.test(object.className))
				return true;
		}
	}
	return false;
}

function __captchaRemoveClass(object,classname)
{
	if(classname===undefined || classname=="") return;
	if(object && ('className' in object))
	{
		var r=new RegExp('\\b('+classname+')\\b','m');
		object.className=object.className.replace(r,'').replace(/\s\s+/g,' ').replace(/^\s*|\s*$/g,'');
	}
}
/*2.0*/
function __captchaAddHandler(element,event,handler)
{
	if (!handler.$$guid) handler.$$guid = __captchaAddHandler.guid++;
	if (!element.events) element.events = {};
	var handlers = element.events[event];
	if (!handlers) {
		handlers = element.events[event] = {};
		if (element["on" + event])
			handlers[0] = element["on" + event];
	}
	handlers[handler.$$guid] = handler;
	if(element.addEventListener) 
		element.addEventListener(event,handler,false);
	else if(element.attachEvent) 
		element.attachEvent('on'+event,handler);
}

__captchaAddHandler.guid=1;
/*2.0*/
function __captchaRemoveHandler(element,event)
{
	if (!element.events) element.events = {};
	var handlers = element.events[event];
	if (!handlers) {
		handlers = element.events[event] = {};
		if (element["on" + event])
			handlers[0] = element["on" + event];
	}
	for(var i in handlers)
	{
		var handler=handlers[i];
		if(element.removeEventListener)
			element.removeEventListener(event,handler,false);
		else if(element.detachEvent)
			element.detachEvent('on'+event,handler);
	}
	if (element.events && element.events[event])
		delete element.events[event];
}

function __captchaExecute(o)
{
	if(!__captchaFX)
		chrome.tabs.executeScript(null,{code:o},function(r){console.log(r);});
	else
		self.port.emit("execute",o);
}

/*v2.0*/
function __captchaStart(callback)
{
	if(__captchaFX)
	{
		self.port.on("getElements", function(storage) {
			__captchaStorage=storage;
			if('__captchaSettings' in __captchaStorage)
				__captchaSettings=__captchaStorage['__captchaSettings'];
			var save=false;
			if(!('lang' in __captchaSettings))
			{
				__captchaSettings['lang']=(('__captchaLang' in __captchaStorage)?__captchaStorage['__captchaLang']:'en');
				save=true;
			}
			if(!('key' in __captchaSettings))
			{
				__captchaSettings['key']=(('__captchaKey' in __captchaStorage)?__captchaStorage['__captchaKey']:'');
				save=true;
			}
			if(!('active' in __captchaSettings))
			{
				__captchaSettings['active']=(('__captchaAct' in __captchaStorage)?__captchaStorage['__captchaAct']:true);
				save=true;
			}
			if(!('showinfo' in __captchaSettings))
			{
				__captchaSettings['showinfo']=true;
				save=true;
			}
			if(!('ping' in __captchaSettings))
			{
				__captchaSettings['ping']=5000;
				save=true;
			}
			if(save)
			{
				var o={};
				o['__captchaSettings']=__captchaSettings;
				self.port.emit("gotElement",o);
			}
			if(!__captchaFX)
			{
				if(__captchaSettings['active'])
					__captchaAddHandler(document,'webkitvisibilitychange',__captchaVisibilityChange);
			}
			else
			{
				if(__captchaSettings['active'])
					__captchaAddHandler(document,'mozvisibilitychange',__captchaVisibilityChange);
			}
			if(callback) callback();
		});
		
	}
	else
	{
		var url=location.href.match(/\:\/\/([^/]*)\//)[1];
		var maybeurl='';
		if(document.body.children[0].tagName=='IMG')
			maybeurl=document.body.children[0].src;
		//console.log(":"+maybeurl);
		chrome.storage.local.get(['__captchaURL_'+url,'__captchaLang','__captchaKey','__captchaAct','__captchaSettings','__captchaIMG_'+maybeurl],function(e){
			if(chrome.runtime.lastError)
				console.log('Storage Error: '+chrome.runtime.lastError);
			else
			{
				for(var key in e)
					__captchaStorage[key]=e[key];
				//console.log(__captchaStorage);
				if('__captchaSettings' in __captchaStorage)
					__captchaSettings=__captchaStorage['__captchaSettings'];
				var save=false;
				if(!('lang' in __captchaSettings))
				{
					__captchaSettings['lang']=(('__captchaLang' in __captchaStorage)?__captchaStorage['__captchaLang']:'en');
					save=true;
				}
				if(!('key' in __captchaSettings))
				{
					__captchaSettings['key']=(('__captchaKey' in __captchaStorage)?__captchaStorage['__captchaKey']:'');
					save=true;
				}
				if(!('active' in __captchaSettings))
				{
					__captchaSettings['active']=(('__captchaAct' in __captchaStorage)?__captchaStorage['__captchaAct']:true);
					save=true;
				}
				if(!('storage' in __captchaSettings))
				{
					__captchaSettings['storage']='sync';
					save=true;
				}
				if(!('showinfo' in __captchaSettings))
				{
					__captchaSettings['showinfo']=true;
					save=true;
				}
				if(!('ping' in __captchaSettings))
				{
					__captchaSettings['ping']=5000;
					save=true;
				}
				if(save)
				{
					var o={};
					o['__captchaSettings']=__captchaSettings;
					chrome.storage['local'].set(o);
					chrome.storage['local'].remove(['__captchaLang','__captchaKey','__captchaAct']);
				}
				if(__captchaSettings['storage']=='sync')
				{
					chrome.storage.sync.get(['__captchaURL_'+url,'__captchaKey','__captchaLang','__captchaAct'],function(e){
						if(chrome.runtime.lastError)
							console.log('Storage Error: '+chrome.runtime.lastError);
						else
						{
							for(var key in e)
								__captchaStorage[key]=e[key];
							//console.log(__captchaStorage);
							var save=false;
							if('__captchaLang' in e)
							{
								__captchaSettings['lang']=__captchaStorage['__captchaLang'];
								save=true;
							}
							if('__captchaAct' in e)
							{
								__captchaSettings['active']=__captchaStorage['__captchaAct'];
								save=true;
							}
							if('__captchaKey' in __captchaStorage && __captchaSettings['key']=='')
							{
								__captchaSettings['key']=__captchaStorage['__captchaKey'];
								save=true;
							}
							if(save)
							{
								var o={};
								o['__captchaSettings']=__captchaSettings;
								chrome.storage['local'].set(o);
								chrome.storage[__captchaSettings['storage']].remove(['__captchaLang','__captchaKey','__captchaAct']);
							}
							if(callback) callback();
						}
					});
				}
				else
					if(callback) callback();
			}
		});
	}
}
var alreadyIfChange=false;
/*v2.0*/
function __captchaIfChange(callback) 
{
	if(alreadyIfChange) return;
	alreadyIfChange=true;
	if(__captchaFX)
	{
		self.port.on("againElements", function(storage) {
			__captchaStorage=storage;
			if(callback) callback();
		});
	}
	else
	{
		//var s=__captchaSettings['storage'];
		chrome.storage.onChanged.addListener(function(changes,area) {
			if(area!='local' && area!='sync') return;
			for(var key in changes)
				__captchaStorage[key]=changes[key].newValue;
			if(callback) callback();
		});
	}
}

/*v2.0*/
function __captchaSaveStorage(key,value)
{
	var o={};
	o[key]=value;
	__captchaStorage[key]=value;
	if(__captchaFX)
		self.port.emit("gotElement",o);//saveFXstorage(key,value);???
	else
	{
		if(/^__captchaIMG_/.test(key))
			chrome.storage['local'].set(o);
		else
			chrome.storage[__captchaSettings['storage']].set(o);
	}
}

function __captchGetStogare(key,callback)
{
	if(__captchaFX)
		callback(__captchaStorage[key]);
	else
	{
		var g='sync';
		if('storage' in __captchaSettings && __captchaSettings['storage']!='sync') g='local';
		chrome.storage[g].get(key,function(e){
			if(chrome.runtime.lastError)
				console.log('Storage Error: '+chrome.runtime.lastError);
			else
			{
				__captchaStorage[key]=e[key];
				callback(__captchaStorage[key]);
			}
		});
	}
}
/*stable*/
function __captchaDetected()
{
	if(__captchaWork)
		return;
	__captchaWork=true;
	var url=location.href.match(/\:\/\/([^/]*)\//)[1];
	__captchaGetSite(url,__captchaDetect);
}
/*2.0*/
function __captchaDetectedDivF(object,lng,remove)
{
	if(object)
	{
		if(remove)
			object.parentNode.removeChild(object);
		else return;
	}
	object=document.createElement('DIV');
	object.id='__captchaDetected';
	with(object.style)
	{
		zIndex='10000000'; 
		position='fixed'; 
		right='0px'; 
		top='0px'; 
		border='1px solid black'; 
		background='rgb(255,234,0)'; 
		padding='10px';
		fontFamily='Verdana';
		fontSize='10px';
		lineHeight='12px';
	}
	document.body.appendChild(object);
	var header=document.createTextNode(__captchaLNG[lng]['CAPTCHA_DETECTED']);
	var link1=document.createElement('A');
	//link1.href='';
	//link1.id='__captchaShowButton';
	link1.style.textDecoration='underline';
	link1.style.cursor='pointer';
	__captchaAddHandler(link1,'click',function(e){__captchaShow(); return false;});
	link1.innerText=__captchaLNG[lng]['SHOW'];
	var spc1=document.createTextNode(' ');
	var link2=document.createElement('A');
	link2.style.textDecoration='underline';
	link2.style.cursor='pointer';
	__captchaAddHandler(link2,'click',function(e){this.parentNode.style.display='none'; return false;});
	with(link2.style) {
		position='absolute';
		top='0px';
		right='10px';
	}
		var sup=document.createElement('SUP');
		sup.innerText='x';
		link2.appendChild(sup);
	var br1=document.createElement('BR');
	var link3=document.createElement('A');
	link3.style.textDecoration='underline';
	link3.style.cursor='pointer';
	__captchaAddHandler(link3,'click',function(e){__captchaRight(); return false;});
	link3.innerText=__captchaLNG[lng]['RIGHT'];
	var div1=document.createTextNode('|');
	var link4=document.createElement('A');
	link4.style.textDecoration='underline';
	link4.style.cursor='pointer';
	__captchaAddHandler(link4,'click',function(e){__captchaAnother(); return false;});
	link4.innerText=__captchaLNG[lng]['CHOOSEANOTHER'];
	var div2=document.createTextNode('|');
	var link5=document.createElement('A');
	link5.style.textDecoration='underline';
	link5.style.cursor='pointer';
	__captchaAddHandler(link5,'click',function(e){__captchaDontask(); return false;});
	link5.innerText=__captchaLNG[lng]['DONTASK'];
	object.appendChild(header);
	object.appendChild(link1);
	object.appendChild(spc1);
	object.appendChild(link2);
	object.appendChild(br1);
	object.appendChild(link3);
	object.appendChild(div1);
	object.appendChild(link4);
	object.appendChild(div2);
	object.appendChild(link5);
}
/*2.0*/
function __captchaSelectAnotherDivF(object,lng)
{
	if(object)
		object.parentNode.removeChild(object);
	object=document.createElement('DIV');
	object.id='__captchaDetected';
	with(object.style)
	{
		zIndex='10000000'; 
		position='fixed'; 
		right='0px'; 
		top='0px'; 
		border='1px solid black'; 
		background='rgb(255,234,0)'; 
		padding='10px';
		fontFamily='Verdana';
		fontSize='10px';
		lineHeight='12px';
	}
	document.body.appendChild(object);
	var header=document.createTextNode(__captchaLNG[lng]['SELECTANOTHER']);
	var br1=document.createElement('BR');
	var link1=document.createElement('A');
	link1.style.textDecoration='underline';
	link1.style.cursor='pointer';
	__captchaAddHandler(link1,'click',function(e){__captchaStopAnother(true); return false;});
	link1.innerText=__captchaLNG[lng]['OK'];
	var div1=document.createTextNode(' | ');
	var link2=document.createElement('A');
	link2.style.textDecoration='underline';
	link2.style.cursor='pointer';
	__captchaAddHandler(link2,'click',function(e){__captchaStopAnother(false); return false;});
	link2.innerText=__captchaLNG[lng]['CANCEL'];
	object.appendChild(header);
	object.appendChild(br1);
	object.appendChild(link1);
	object.appendChild(div1);
	object.appendChild(link2);
}
/*2.0*/
function __captchaSelectAutoDivF(object,lng)
{
	if(object)
		object.parentNode.removeChild(object);
	object=document.createElement('DIV');
	object.id='__captchaDetected';
	with(object.style)
	{
		zIndex='10000000'; 
		position='fixed'; 
		right='0px'; 
		top='0px'; 
		border='1px solid black'; 
		background='rgb(255,234,0)'; 
		padding='10px';
		fontFamily='Verdana';
		fontSize='10px';
		lineHeight='12px';
	}
	document.body.appendChild(object);
	var header=document.createTextNode(__captchaLNG[lng]['SELECTOPTIONS']);
	var br1=document.createElement('BR');
	var in1=document.createElement('INPUT'); in1.type='checkbox'; in1.id='__captchaPhraseCheck';
	var t1=document.createTextNode(__captchaLNG[lng]['PHRASE']);
	var in2=document.createElement('INPUT'); in2.type='checkbox'; in2.id='__captchaSenseCheck';
	var t2=document.createTextNode(__captchaLNG[lng]['CASE']);
	var in3=document.createElement('INPUT'); in3.type='checkbox'; in3.id='__captchaNumericCheck';
	var t3=document.createTextNode(__captchaLNG[lng]['NUMERIC']);
	var br2=document.createElement('BR');
	var in4=document.createElement('INPUT'); in4.type='checkbox'; in4.id='__captchaCalcCheck';
	var t4=document.createTextNode(__captchaLNG[lng]['CALC']);
	var in5=document.createElement('INPUT'); in5.type='checkbox'; in5.id='__captchaRussianCheck';
	var t5=document.createTextNode(__captchaLNG[lng]['RUSSIAN']);
	var br3=document.createElement('BR');
	var link1=document.createElement('A');
	link1.style.textDecoration='underline';
	link1.style.cursor='pointer';
	__captchaAddHandler(link1,'click',function(e){__captchaRight('a'); return false;});
	link1.innerText=__captchaLNG[lng]['AUTO'];
	var div1=document.createTextNode(' | ');
	var link2=document.createElement('A');
	link2.style.textDecoration='underline';
	link2.style.cursor='pointer';
	__captchaAddHandler(link2,'click',function(e){__captchaRight('m'); return false;});
	link2.innerText=__captchaLNG[lng]['MANUAL'];
	object.appendChild(header);
	object.appendChild(br1);
	object.appendChild(in1);
	object.appendChild(t1);
	object.appendChild(in2);
	object.appendChild(t2);
	object.appendChild(in3);
	object.appendChild(t3);
	object.appendChild(br2);
	object.appendChild(in4);
	object.appendChild(t4);
	object.appendChild(in5);
	object.appendChild(t5);
	object.appendChild(br3);
	object.appendChild(link1);
	object.appendChild(div1);
	object.appendChild(link2);
}

var __captchaNumeric='';
var __captchaPhrase='';
var __captchaRegsense='';
var __captchaCalc='';
var __captchaRussian='';
var __captchaNewInterval=false;
/*v2.0*/
function __captchaDetect(o)
{
	var reg=/captcha|[^r]code/i;
	if(!o)
	{
		__captchaWork=false;
		return;
	}
	if('command' in o)
	{
		
		__captchaWork=false;
		return;
	}
	if(o['url']=='vk.com' && ('notquestion' in o) && ('img_src' in o) && !('input_class' in o))
	{
		__captchaSetSite('vk.com',{'notnew':1});
		return;
	}
	if(('notnew' in o && o['notnew']) && !('notquestion' in o))
	{
		var is=document.getElementsByTagName('IMG');
		var i;
		
		var found=[];
		var l=0;
		for(i=0;i<is.length;i++)
		{
			if(is[i].clientWidth<=0 || is[i].clientHeight<=0)
				continue;
			if((is[i].id && reg.exec(is[i].id))||(is[i].name && reg.exec(is[i].name))||(is[i].src && reg.exec(is[i].src))||(is[i].className && reg.exec(is[i].className)))
			{
				found[l]=is[i];
				l++;
			}
		}
		if(l>0)
		{
			var knew_id=/recaptcha_challenge_image/i;
			var knewi_id=/recaptcha_response_field/i;
			var f=false;
			for(i=0;i<l;i++)
			{
				if(found[i].id && knew_id.exec(found[i].id))
				{
					f=found[i];
					break;
				}
			}
			var fi=false;
			var ffi=document.getElementsByTagName('INPUT');
			for(i=0;i<ffi.length;i++)
			{
				if(ffi[i].id && knewi_id.exec(ffi[i].id))
				{
					fi=ffi[i];
					break;
				}
			}
			if(!fi && !__captchaLastInput)
				fi=ffi[0];
			else if(!fi)
				fi=__captchaLastInput;
			if(!f && !__captchaLastFound)
				f=found[0];
			else if(!f)
				f=__captchaLastFound;
			if(f && __captchaChangeAnother)
				f=__captchaLastFound;
			for(i=0;i<l;i++)
			{
				if(found[i]!=f && __captchaHaveClass(found[i],'__captchaIMG'))
				{
					found[i].style.outline='';
					__captchaRemoveClass(found[i],'__captchaIMG');
				}
			}
			for(i=0;i<ffi.length;i++)
			{
				if(ffi[i]!=fi && __captchaHaveClass(found[i],'__captchaIMG'))
				{
					ffi[i].style.outline='';
					__captchaRemoveClass(found[i],'__captchaIMG');
				}
			}
			if(f) f.style.outline='4px solid #8080ff';
			if(fi) fi.style.outline='4px solid #8080ff';
			__captchaAddClass(f,'__captchaIMG');
			__captchaAddClass(fi,'__captchaIMG');
			__captchaLastInput=fi;
			__captchaLastFound=f;
			var dc=document.getElementById('__captchaDetected');
			__captchaDetectedDivF(dc,__captchaSettings['lang']);
			/*if(!dc)
			{
				dc=document.createElement('DIV');
				dc.id='__captchaDetected';
				with(dc.style)
				{
					zIndex='10000000'; 
					position='fixed'; 
					right='0px'; 
					top='0px'; 
					border='1px solid black'; 
					background='#f0f000'; 
					padding='10px';
					fontFamily='Verdana';
					fontSize='10px';
					lineHeight='12px';
				}
				dc.innerHTML=__captchaDetectedDiv[__captchaSettings['lang']];
				document.body.appendChild(dc);
				dc=document.getElementById('__captchaDetected');
			}
			if(dc)
			{
				var dd=document.getElementById('__captchaShowButton');
				__captchaAddHandler(dd,'click',function(e){__captchaShow(); return false;});
				dd=document.getElementById('__captchaRightButton');
				__captchaAddHandler(dd,'click',function(e){__captchaRight(); return false;});
				dd=document.getElementById('__captchaAnotherButton');
				__captchaAddHandler(dd,'click',function(e){__captchaAnother(); return false;});
				dd=document.getElementById('__captchaDontaskButton');
				__captchaAddHandler(dd,'click',function(e){__captchaDontask(); return false;});
				dd=document.getElementById('__captchaCloseButton');
				__captchaAddHandler(dd,'click',function(e){this.parentNode.style.display='none'; return false;});
			}*/
		}
	}
	else if(('notquestion' in o) && o['notquestion'])
	{
		if(!('work' in o) || !o['work'])
		{
			var dc=document.getElementById('__captchaDetected');
			if(dc) dc.parentNode.removeChild(dc);
			if(__captchaLastFound) __captchaLastFound.style.outline='';
			if(__captchaLastInput) __captchaLastInput.style.outline='';
			__captchaBlur();
		}
		else
		{
			var i;
			var f=false;
			var fi=false;
			if(('img_id' in o) || ('img_name' in o) || ('img_src' in o) || ('classname' in o)
				|| ('parent_id' in o) || ('parent_classname' in o))
			{
				var is=document.getElementsByTagName('IMG');
				for(i=0;i<is.length;i++)
				{
					if(is[i].clientHeight<=0 || is[i].clientWidth<=0)
						continue;
					if(('img_id' in o) && o['img_id']==is[i].id)
					{
						f=is[i];
						break;
					}
					if(('img_name' in o) && o['img_name']==is[i].name)
						f=is[i];
					else if(('img_src' in o) && o['img_src']==is[i].src)
						f=is[i];
					else if(!f && ('parent_id' in o) && is[i].parentNode && o['parent_id']==is[i].parentNode.id)
						f=is[i];
					else if(!f && ('parent_classname' in o) && is[i].parentNode && o['parent_classname']==is[i].parentNode.className)
						f=is[i];
					else if(('classname' in o) && o['classname']==is[i].className)
						f=is[i];
				}
				console.log(f);
				if(!f && !('img_id' in o) && !('img_name' in o) && !('classname' in o))
				{
					for(i=0;i<is.length;i++)
					{
						if(is[i].clientHeight<=0 || is[i].clientWidth<=0)
							continue;
						if((is[i].id && reg.exec(is[i].id))||(is[i].name && reg.exec(is[i].name))||(is[i].src && reg.exec(is[i].src))||(is[i].className && reg.exec(is[i].className)))
							f=is[i];
					}
				}
				var ii=document.getElementsByTagName('INPUT');
				for(i=0;i<ii.length;i++)
				{
					if((ii[i].type=='' || ii[i].type=='text') && !fi)
						fi=ii;
					if(('input_id' in o) && o['input_id']==ii[i].id)
					{
						fi=ii[i];
						break;
					}
					if(('input_name' in o) && o['input_name']==ii[i].name)
						fi=ii[i];
					else if(('input_class' in o) && o['input_class']==ii[i].className)
						fi=ii[i];
					else if(!fi && ('inputparent_id' in o) && o['inputparent_id']==ii[i].parentNode.className)
						fi=ii[i];
					else if(!fi && ('inputparent_class' in o) && o['inputparent_class']==ii[i].parentNode.className)
						fi=ii[i];
				}
			}
			if(f)
			{
				__captchaLastFound=f;
				__captchaLastInput=fi;
				if('phrase' in o && o['phrase']) __captchaPhrase=o['phrase'];
				if('regsense' in o && o['regsense']) __captchaRegsense=o['regsense'];
				if('numeric' in o && o['numeric']) __captchaNumeric=o['numeric'];
				if('calc' in o && o['calc']) __captchaCalc=o['calc'];
				if('is_russian' in o && o['is_russian']) __captchaRussian=o['is_russian'];
				if('autosubmit' in o && o['autosubmit']) __captchaAuto=true;
				__captchaBlur();
				__captchaAddHandler(__captchaLastFound,'load',function(e){__captchaGetAntigate();});
				__captchaNewInterval=setInterval(__captchaGetAntigate,2000);
			}
		}
	}
	__captchaWork=false;
}
/*stable*/
function __captchaShow()
{
	if(__captchaLastFound)
	{
		__captchaLastFound.scrollIntoView();
	}
}

var __captchaSelectAnother;
/*2.0*/
function __captchaAnother()
{
	__captchaBlur();
	__captchaSelectAnother=false;
	__captchaAnotherInput=false;
	var dc=document.getElementById('__captchaDetected');
	/*if(!dc)
	{
		dc=document.createElement('DIV');
		dc.id='__captchaDetected';
		with(dc.style)
		{
			zIndex='10000000'; 
			position='fixed'; 
			right='0px'; 
			top='0px'; 
			border='1px solid black'; 
			background='#f0f000'; 
			padding='10px';
		}
		dc.innerHTML=__captchaDetectedDiv[__captchaSettings['lang']];
		document.body.appendChild(dc);
		dc=document.getElementById('__captchaDetected');
	}
	if(dc)
		dc.innerHTML=__captchaSelectAnotherDiv[__captchaSettings['lang']];*/
	__captchaSelectAnotherDivF(dc,__captchaSettings['lang']);
	var d=document.body.getElementsByTagName('IMG');
	var i;
	for(i=0;i<d.length;i++)
	{
		__captchaAddHandler(d[i],'click',function(e){
			if(__captchaSelectAnother)
				__captchaSelectAnother.style.outline=''; 
			__captchaSelectAnother=this;
			this.style.outline='3px solid #ff8080';
			return false;
		});
		__captchaAddHandler(d[i],'mouseover',function(e){if(this!=__captchaSelectAnother) this.style.outline='3px solid #ff80ff';});
		__captchaAddHandler(d[i],'mouseout',function(e){if(this!=__captchaSelectAnother) this.style.outline='';});
	}
	d=document.body.getElementsByTagName('INPUT');
	for(i=0;i<d.length;i++)
	{
		__captchaAddHandler(d[i],'click',function(e){
			if(__captchaAnotherInput)
				__captchaAnotherInput.style.outline=''; 
			__captchaAnotherInput=this;
			this.style.outline='3px solid #ff8080';
			return false;
		});
		__captchaAddHandler(d[i],'mouseover',function(e){if(this!=__captchaAnotherInput) this.style.outline='3px solid #ff80ff';});
		__captchaAddHandler(d[i],'mouseout',function(e){if(this!=__captchaAnotherInput) this.style.outline='';});
	}
	/*var dd=document.getElementById('__captchaSelectAnotherOKButton');
	__captchaAddHandler(dd,'click',function(e){__captchaStopAnother(true); return false;});
	dd=document.getElementById('__captchaSelectAnotherCancelButton');
	__captchaAddHandler(dd,'click',function(e){__captchaStopAnother(false); return false;});*/
}
/*2.0*/
function __captchaStopAnother(ok)
{
	if(ok==undefined) ok=false;
	//console.log('From :'+__captchaSelectAnother+':'+__captchaAnotherInput);
	//console.log('To :'+__captchaLastFound+':'+__captchaLastInput);
	if(ok && (__captchaSelectAnother || __captchaAnotherInput))
	{
		if(__captchaLastFound)
			__captchaLastFound.style.outline='';
		if(__captchaLastInput)
			__captchaLastInput.style.outline='';
		if(__captchaSelectAnother)
			__captchaLastFound=__captchaSelectAnother;
		if(__captchaAnotherInput)
			__captchaLastInput=__captchaAnotherInput;
	}
	if(__captchaSelectAnother)
		__captchaSelectAnother.style.outline='';
	if(__captchaAnotherInput)
		__captchaAnotherInput.style.outline='';
	if(__captchaLastFound)
		__captchaLastFound.style.outline='4px solid #8080ff';
	if(__captchaLastInput)
		__captchaLastInput.style.outline='4px solid #8080ff';
	var i;
	var d=document.body.getElementsByTagName('IMG');
	for(i=0;i<d.length;i++)
	{
		__captchaRemoveHandler(d[i],'click');
		__captchaRemoveHandler(d[i],'mouseover');
		__captchaRemoveHandler(d[i],'mouseout');
	}
	d=document.body.getElementsByTagName('INPUT');
	for(i=0;i<d.length;i++)
	{
		__captchaRemoveHandler(d[i],'click');
		__captchaRemoveHandler(d[i],'mouseover');
		__captchaRemoveHandler(d[i],'mouseout');
	}
	var dc=document.getElementById('__captchaDetected');
	__captchaDetectedDivF(dc,__captchaSettings['lang'],true);
	/*if(dc)
		dc.innerHTML=__captchaDetectedDiv[__captchaSettings['lang']];
	if(dc)
	{
		var dd=document.getElementById('__captchaShowButton');
		__captchaAddHandler(dd,'click',function(e){__captchaShow(); return false;});
		dd=document.getElementById('__captchaRightButton');
		__captchaAddHandler(dd,'click',function(e){__captchaRight(); return false;});
		dd=document.getElementById('__captchaAnotherButton');
		__captchaAddHandler(dd,'click',function(e){__captchaAnother(); return false;});
		dd=document.getElementById('__captchaDontaskButton');
		__captchaAddHandler(dd,'click',function(e){__captchaDontask(); return false;});
		dd=document.getElementById('__captchaCloseButton');
		__captchaAddHandler(dd,'click',function(e){this.parentNode.style.display='none'; return false;});
	}*/
}
/*2.0*/
function __captchaDontask()
{
	var url=location.href.match(/\:\/\/([^/]*)\//)[1];
	__captchaSetSite(url,{'notnew':1,'notquestion':1});
}
/*2.0*/
function __captchaRight(mode)
{
	__captchaBlur();
	var url=location.href.match(/\:\/\/([^/]*)\//)[1];
	if(mode==undefined)
	{
		var dc=document.getElementById('__captchaDetected');
		__captchaSelectAutoDivF(dc,__captchaSettings['lang']);
		/*if(dc)
			dc.innerHTML=__captchaSelectAutoDiv[__captchaSettings['lang']];
		var dd=document.getElementById('__captchaAutoSubmitButton');
		__captchaAddHandler(dd,'click',function(e){__captchaRight('a'); return false;});
		dd=document.getElementById('__captchaManualSubmitButton');
		__captchaAddHandler(dd,'click',function(e){__captchaRight('m'); return false;});*/
	}
	else
	{
		var auto=0;
		var phrase=0;
		var regsense=0;
		var numeric=0;
		var calc=0
		var is_russian=0;
		if(mode=='a') {auto=1; __captchaAuto=true;}
		var d;
		d=document.getElementById('__captchaPhraseCheck'); if(d) phrase=d.checked?1:0;
		d=document.getElementById('__captchaSenseCheck'); if(d) regsense=d.checked?1:0;
		d=document.getElementById('__captchaNumericCheck'); if(d) numeric=d.checked?1:0;
		d=document.getElementById('__captchaCalcCheck'); if(d) calc=d.checked?1:0;
		d=document.getElementById('__captchaRussianCheck'); if(d) is_russian=d.checked?1:0;
		__captchaRemoveClass(__captchaLastFound,'__captchaIMG');
		__captchaRemoveClass(__captchaLastInput,'__captchaIMG');
		var s={'notnew':1,'notquestion':1,'work':1,'autosubmit':auto};
		if(__captchaLastFound.id) s['img_id']=__captchaLastFound.id;
		if(__captchaLastFound.name) s['img_name']=__captchaLastFound.name;
		if(__captchaLastFound.src) s['img_src']=__captchaLastFound.src;
		if(__captchaLastInput.id) s['input_id']=__captchaLastInput.id;
		if(__captchaLastInput.name) s['input_name']=__captchaLastInput.name;
		if(phrase) s['phrase']=phrase;
		if(regsense) s['regsense']=regsense;
		if(numeric) s['numeric']=numeric;
		if(calc) s['calc']=calc;
		if(is_russian) s['is_russian']=is_russian;
		if(__captchaLastFound.className) s['classname']=__captchaLastFound.className;
		if(__captchaLastInput.className) s['input_class']=__captchaLastInput.className;
		if(__captchaLastFound.parentNode)
		{
			if(__captchaLastFound.parentNode.id) s['parent_id']=__captchaLastFound.parentNode.id;
			if(__captchaLastFound.parentNode.className) s['parent_classname']=__captchaLastFound.parentNode.className;
		}
		if(__captchaLastInput.parentNode)
		{
			if(__captchaLastInput.parentNode.id) s['inputparent_id']=__captchaLastInput.parentNode.id;
			if(__captchaLastInput.parentNode.className) s['inputparent_class']=__captchaLastInput.parentNode.className;
		}
		//console.log(s);
		__captchaSetSite(url,s);
		var dc=document.getElementById('__captchaDetected');
		if(dc) dc.parentNode.removeChild(dc);
		if(__captchaLastFound) __captchaLastFound.style.outline='';
		if(__captchaLastInput) __captchaLastInput.style.outline='';
		__captchaGetAntigate();
	}
}

function ajaxRequest()
{
	var am=["Msxml2.XMLHTTP","Microsoft.XMLHTTP"];
	if(window.ActiveXObject)
	{
		for (var i=0;i<am.length;i++)
		{
			try
			{
				return new ActiveXObject(am[i]);
			}
			catch(e){}
		}
	}
	else if(window.XMLHttpRequest)
		return new XMLHttpRequest();
	return false;
}
/*2.0*/
function __captchaGetAntigate()
{
	if(__captchaNewInterval)
	{
		clearInterval(__captchaNewInterval);
		__captchaNewInterval=false;
	}
	var dataURL='';
	if(__captchaLastFound)
	{
		__captchaRemoveHandler(__captchaLastFound,'load');
		var t=true;
		try
		{
			var w=__captchaLastFound.clientWidth;
			var h=__captchaLastFound.clientHeight;
			var canvas=document.createElement('canvas');
			var	ctx=canvas.getContext('2d');
			canvas.height=h;
			canvas.width=w;
			ctx.drawImage(__captchaLastFound,0,0);
			dataURL=canvas.toDataURL().replace(/^data:image\/(png|jpg);base64,/,"");
			canvas=null;
		}
		catch(e){}
		if(dataURL!='')
		{
			__captchaSendAntigate(dataURL);
			t=false;
		}
		if(t)
		{
			//__captchaStorage['__captchaIMG_'+__captchaLastFound.src]='new';
			__captchaSaveStorage('__captchaIMG_'+__captchaLastFound.src,'new');
			__captchaIfChange(__captchaUpdateDataURL);
			/*if(!__captchaFX)
			{
				var o={};
				o['__captchaIMG_'+__captchaLastFound.src]='new';
				chrome.storage.local.set(o);
			}
			else
			{
				saveFXstorage('__captchaIMG_'+__captchaLastFound.src,'new');
			}*/
			if(!__captchaFX)
			{
				var a=document.createElement('A');
				a.href=__captchaLastFound.src;
				a.target='_blank';
				//document.body.appendChild(a);
				a.click();
			}
			else
			{
				self.port.emit("openUrl",__captchaLastFound.src);
			}
			if(__captchaFX)
				self.port.emit("again",{});
			//setTimeout(__captchaUpdateDataURL,300);
		}
	}
	
}
/*2.0*/
function __captchaUpdateDataURL()
{
	if(!__captchaLastFound)
		return;
	var o=null;
	var url=__captchaLastFound.src;
	var t=__captchaStorage['__captchaIMG_'+url];
	if(t!='new')
	{
		if(t)
			__captchaSendAntigate(t);
		delete __captchaStorage['__captchaIMG_'+url];
		if(!__captchaFX)
		{
			chrome.storage['local'].remove('__captchaIMG_'+url);
		}
		//__captchaSaveStorage('__captchaIMG_'+url,'');
	}
	else if(__captchaFX)
	{
		self.port.emit("again",{});
	}
	/*if(!__captchaFX)
	{
		chrome.storage.local.get('__captchaIMG_'+url,function(e){
			if(chrome.runtime.lastError)
			{
				console.log('Storage Error: '+chrome.runtime.lastError);
			}
			else
			{
				if(e['__captchaIMG_'+url])
				{
					var t=e['__captchaIMG_'+url];
					if(t=='new')
						setTimeout(__captchaUpdateDataURL,1000);
					else
					{
						__captchaSendAntigate(t);
						var o={};
						o['__captchaIMG_'+url]='';
						chrome.storage.local.set(o);
					}
				}
			}
			
		});
		
	}
	else
	{
		if(__captchaFXStorage['__captchaIMG_'+url])
		{
			var t=__captchaFXStorage['__captchaIMG_'+url];
			if(t=='new')
			{
				if(__captchaFX)
					self.port.emit("again",{});
				setTimeout(__captchaUpdateDataURL,1000);
			}
			else
			{
				__captchaSendAntigate(t);
				saveFXstorage('__captchaIMG_'+url,'');
			}
		}
	}*/
}
/*2.0*/
function __captchaSendAntigate(dataURL)
{
	if(__captchaLastFound && __captchaLastInput && __captchaSettings['key']!='' && __captchaSettings['key']!=undefined)
	{
		var dd=document.getElementById('__captchaIMGS');
		if(!dd && __captchaSettings['showinfo'])
		{
			dd=document.createElement('div');
			with(dd.style)
			{
				background='yellow';
				border='1px solid black';
			}
			dd.id='__captchaIMGS';
			if (__captchaLastFound.nextSibling)
				__captchaLastFound.parentNode.insertBefore(dd,__captchaLastFound.nextSibling);
			else
				__captchaLastFound.parentNode.appendChild(dd);
		}
		if(dd)
		{
			dd.style.background='yellow';
			dd.innerText=__captchaStatus[__captchaSettings['lang']][0];
		}
		var link='http://antigate.com/in.php';
		var pr='soft_id=598&header_acao=1&method=base64&key='+__captchaSettings['key'];
		if(__captchaPhrase!='') pr+='&phrase=1';
		if(__captchaRegsense!='') pr+='&regsense=1';
		if(__captchaNumeric!='') pr+='&numeric=1';
		if(__captchaCalc!='') pr+='&calc=1';
		if(__captchaRussian!='') pr+='&is_russian=1';
		pr+='&body='+encodeURIComponent(dataURL);
		var aj=new ajaxRequest();
		aj.onreadystatechange=function(){
			if(aj.readyState==4 && aj.status==200)
			{
				//console.log(aj.responseText);
				var txt=aj.responseText.replace(/^\s+|\s+$/g,'');
				//console.log(txt+":"+pr);
				if(txt.substr(0,3)=='OK|')
				{
					var dd=document.getElementById('__captchaIMGS');
					if(dd)
					{
						dd.style.background='yellow';
						dd.innerText=__captchaStatus[__captchaSettings['lang']][1];
					}
					__captchaLastID=txt.substr(3);
					console.log(__captchaLastID);
					setTimeout(__captchaGetText,__captchaSettings['ping']);
				}
				else if(txt=='ERROR_NO_SLOT_AVAILABLE')
				{
					var dd=document.getElementById('__captchaIMGS');
					if(dd)
					{
						dd.style.background='yellow';
						dd.innerText=__captchaResponse[__captchaSettings['lang']][txt];
					}
					/*setTimeout(__captchaActive,5000);*/
					setTimeout(__captchaGetAntigate,5000);
				}
				else if(txt in __captchaResponse[__captchaSettings['lang']])
				{
					var dd=document.getElementById('__captchaIMGS');
					if(dd)
					{
						dd.style.background='#f00050';
						dd.innerText='Antigate ERROR: '+__captchaResponse[__captchaSettings['lang']][txt];
					}
				}
				else
				{
					var dd=document.getElementById('__captchaIMGS');
					if(dd)
					{
						dd.style.background='#f00050';
						dd.innerText='Antigate UNKNOWN ERROR: '+txt;
					}
				}
			}
		};
		aj.open("POST",link,true);
		aj.setRequestHeader("Content-type","application/x-www-form-urlencoded");
		aj.send(pr);
	}
}

function __captchaKeyPress(object,key)
{
	if(!object || !key)
		return;
	/*var evt = document.createEvent('KeyboardEvent');
	evt.initKeyEvent("keypress",false,true,null,false,false,false,false,key,"\r");
	object.dispatchEvent(evt);*/
	__triggerKeyboardEvent(object,key);
}

function __triggerKeyboardEvent(el,keyCode)
{
	var eventObj = document.createEventObject ?	document.createEventObject() : document.createEvent("Events");

	if(eventObj.initEvent)
		eventObj.initEvent("keypress", true, true);

	eventObj.keyCode = keyCode;
	eventObj.which = keyCode;
	el.dispatchEvent ? el.dispatchEvent(eventObj) : el.fireEvent("onkeypress", eventObj); 
} 

/*2.0*/
function __captchaGetText()
{
	var link='http://antigate.com/res.php';
	link+='?soft_id=598&header_acao=1&key='+__captchaSettings['key']+'&action=get&id='+__captchaLastID;
	var aj=new ajaxRequest();
	aj.onreadystatechange=function(){
		if(aj.readyState==4 && aj.status==200)
		{
			var txt=aj.responseText.replace(/^\s+|\s+$/g,'');
			console.log(txt);
			if(txt.substr(0,3)=='OK|')
			{
				__captchaLastInput.value=txt.substr(3);
				if(__captchaAuto)
				{
					var ff=__captchaLastInput;
					while(ff.parentNode && ff.tagName!='FORM')
						ff=ff.parentNode;
					if(ff.tagName=='FORM')
						ff.submit();
					else
						__captchaKeyPress(__captchaLastInput,13);
				}
				var dd=document.getElementById('__captchaIMGS');
				if(dd) dd.parentNode.removeChild(dd);
			}
			else if(txt=='CAPCHA_NOT_READY')
			{
				var dd=document.getElementById('__captchaIMGS');
				if(dd)
				{
					dd.style.background='yellow';
					dd.innerText=__captchaResponse[__captchaSettings['lang']][txt];
				}
				setTimeout(__captchaGetText,__captchaSettings['ping']);
			}
			else if(txt=='ERROR_NO_SLOT_AVAILABLE')
			{
				var dd=document.getElementById('__captchaIMGS');
				if(dd)
				{
					dd.style.background='yellow';
					dd.innerText=__captchaResponse[__captchaSettings['lang']][txt];
				}
				/*setTimeout(__captchaActive,5000);*/
				setTimeout(__captchaGetAntigate,5000);
			}
			else if(txt in __captchaResponse[__captchaSettings['lang']])
			{
				var dd=document.getElementById('__captchaIMGS');
				if(dd)
				{
					dd.style.background='#f00050';
					dd.innerText='Antigate ERROR: '+__captchaResponse[__captchaSettings['lang']][txt];
				}
				/*var dd=document.getElementById('__captchaIMGS');
				if(dd) dd.parentNode.removeChild(dd);*/
			}
			else
			{
				var dd=document.getElementById('__captchaIMGS');
				if(dd)
				{
					dd.style.background='#f00050';
					dd.innerText='Antigate UNKNOWN ERROR: '+txt;
				}
				/*var dd=document.getElementById('__captchaIMGS');
				if(dd) dd.parentNode.removeChild(dd);*/
			}
		}
	};
	aj.open("GET",link,true);
	aj.send();
}
/*stable*/
function __captchaActive()
{
	if(!__captchaInterval) 
	{
		__captchaInterval=setInterval(__captchaDetected,1000);
		__captchaDetected();
	}
}
/*stable*/
function __captchaBlur()
{
	if(__captchaInterval)
	{
		clearInterval(__captchaInterval);
		__captchaInterval=false;
	}
}

function __captchaVisibilityChange()
{
	if((__captchaFX && document.mozHidden)||(!__captchaFX && document.webkitHidden))
		__captchaBlur();
	else
	{
		if(!__captchaLastFound || !__captchaLastInput)
			__captchaActive();
	}
}

/*function __captchaGetSettings()
{
	chrome.storage.sync.get('__captchaLang',function(e){
		if(chrome.runtime.lastError)
			console.log('Storage Error: '+chrome.runtime.lastError);
		else
			__captchaLang=e.__captchaLang;
		if(__captchaLang==undefined)
			chrome.storage.sync.set({'__captchaLang':'en'}, function(){
				if(chrome.runtime.lastError)
					console.log('Storage Error: '+chrome.runtime.lastError);
			});
	});
	chrome.storage.sync.get('__captchaKey',function(e){
		if(chrome.runtime.lastError)
			console.log('Storage Error: '+chrome.runtime.lastError);
		else if(e.__captchaKey)
		{
			__captchaKey=e.__captchaKey;
			__captchaActive();
		}
	});
	chrome.storage.sync.get('__captchaAct',function(e){
		if(chrome.runtime.lastError)
			console.log('Storage Error: '+chrome.runtime.lastError);
		else
		{
			if(e.__captchaAct==undefined)
			{
				chrome.storage.sync.set({'__captchaAct':'true'}, function(){
					if(chrome.runtime.lastError)
						console.log('Storage Error: '+chrome.runtime.lastError);
				});
				__captchaJustActive=true;
			}
			else
				__captchaJustActive=(e.__captchaAct=='true');
			if(__captchaJustActive)
				document.addEventListener("webkitvisibilitychange",__captchaVisibilityChange,false);
		}
	});
}*/

/*function __captchaWrongStorage(e)
{
	if(!__captchaFX)
		console.log('Wrong storage: '+e.toString()+":"+chrome.runtime.lastError);
	else
		console.log('Wrong storage: '+e.toString());
}
*/
/*function __captchaSetSettings(lang,key)
{
	if(!__captchaFX)
	{
		if(lang && key)
			chrome.storage.sync.set({'__captchaLang':lang,'__captchaKey':key});
		else if(lang)
			chrome.storage.sync.set({'__captchaLang':lang});
		else if(key)
			chrome.storage.sync.set({'__captchaKey':key});
	}
	else
	{
		if(lang)
			saveFXstorage('__captchaLang',lang);
		if(key)
			saveFXstorage('__captchaKey',key);
	}
}*/

/*function __captchaGetFXIMG(url)
{
	if(!url)
		return;
	var tt=true;
	if(__captchaFXStorage['__captchaIMG_'+url])
	{
		var t=__captchaFXStorage['__captchaIMG_'+url];
		if(t=='new')
		{
			tt=false;
			var wh=document.title.match(/\(\D*(\d*)\D{1,3}(\d*)\D*\)/);
			var w=wh[1];
			var h=wh[2];
			var canvas=document.createElement('canvas');
			var	ctx=canvas.getContext('2d');
			canvas.height=h;
			canvas.width=w;
			ctx.drawImage(document.body.children[0],0,0);
			dataURL=canvas.toDataURL().replace(/^data:image\/(png|jpg);base64,/,"");
			canvas=null;
			saveFXstorage('__captchaIMG_'+url,dataURL);
			window.close();
			self.port.emit("close",{});
		}
	}
	if(tt)
	{
		__captchaLang=__captchaFXStorage.__captchaLang;
		if(__captchaLang==undefined)
		{
			__captchaLang='en';
			saveFXstorage('__captchaLang','en');
		}
		__captchaKey=__captchaFXStorage.__captchaKey;
		if(__captchaKey==undefined)
			__captchaKey='';
		if(__captchaFXStorage.__captchaAct)
			__captchaJustActive=(__captchaFXStorage.__captchaAct=='true');
		else
		{
			saveFXstorage('__captchaAct','true');
			__captchaJustActive=true;
		}
		if(__captchaJustActive)
			document.addEventListener("mozvisibilitychange",__captchaVisibilityChange,false);
		__captchaActive();
	}
}

function __captchaGetIMG(url)
{
	if(!url)
		return;
	var o=null;
	chrome.storage.local.get('__captchaIMG_'+url,function(e){
		var tt=true;
		if(chrome.runtime.lastError)
		{
			console.log('Storage Error: '+chrome.runtime.lastError);
		}
		else
		{
			if(e['__captchaIMG_'+url])
			{
				var t=e['__captchaIMG_'+url];
				if(t=='new')
				{
					tt=false;
					var wh=document.title.match(/\(\D*(\d+)\D{1,3}(\d+)\D*\)/);
					var w=wh[1];
					var h=wh[2];
					var canvas=document.createElement('canvas');
					var	ctx=canvas.getContext('2d');
					canvas.height=h;
					canvas.width=w;
					ctx.drawImage(document.body.children[0],0,0);
					dataURL=canvas.toDataURL().replace(/^data:image\/(png|jpg);base64,/,"");
					canvas=null;
					var o={};
					o['__captchaIMG_'+url]=dataURL;
					chrome.storage.local.set(o);
					window.close();
				}
			}
		}
		if(tt)
		{
			__captchaGetSettings();
		}
	});
}

function __captchaFXGetSettings()
{
	__captchaLang=__captchaFXStorage.__captchaLang;
	if(__captchaLang==undefined)
	{
		__captchaLang='en';
		saveFXstorage('__captchaLang',__captchaLang);
	}
	__captchaKey=__captchaFXStorage.__captchaKey;
	if(__captchaKey==undefined)
		__captchaKey='';
	if(__captchaFXStorage.__captchaAct)
		__captchaJustActive=(__captchaFXStorage.__captchaAct=='true');
	else
	{
		saveFXstorage('__captchaAct','true');
		__captchaJustActive=true;
	}
	if(__captchaJustActive)
		document.addEventListener("mozvisibilitychange",__captchaVisibilityChange,false);
	__captchaActive();
}*/
/*2.0*/
function __captchaGetImage(url)
{
	if(!url)
		return;
	var tt=true;
	//console.log('img3');
	if(__captchaStorage['__captchaIMG_'+url])
	{
		//console.log('img4');
		var t=__captchaStorage['__captchaIMG_'+url];
		if(t=='new')
		{
			//console.log('img5:'+t);
			tt=false;
			var wh=document.title.match(/\(\D*(\d*)\D{1,3}(\d*)\D*\)/);
			var w=wh[1];
			var h=wh[2];
			var canvas=document.createElement('canvas');
			var	ctx=canvas.getContext('2d');
			canvas.height=h;
			canvas.width=w;
			ctx.drawImage(document.body.children[0],0,0);
			dataURL=canvas.toDataURL().replace(/^data:image\/(png|jpg);base64,/,"");
			canvas=null;
			__captchaSaveStorage('__captchaIMG_'+url,dataURL);
			window.close();
			if(__captchaFX)
				self.port.emit("close",{});
		}
	}
	return tt;
}
/*2.0*/
function __captchaLoadPage()
{
	var t=true;
	
	if(document.body.children[0].tagName=='IMG')
	{
		//console.log('img1');
		var wh=/\(\D*(\d+)\D{1,3}(\d+)\D*\)/.test(document.title);
		if(wh)
		{
			//console.log('img2');
			t=__captchaGetImage(document.body.children[0].src);
			/*if(!__captchaFX)
				__captchaGetIMG(document.body.children[0].src);
			else
				__captchaGetFXIMG(document.body.children[0].src);*/
		}
	}
	if(t)
	{
		/*if(!__captchaFX)
			__captchaGetSettings();
		else
			__captchaFXGetSettings();*/
		var a=document.createElement('A');
		a.href='';
		a.id='__captchaReAnother';
		__captchaAddHandler(a,'click',function(e){__captchaAnother(); return false;});
		document.body.appendChild(a);
		a=document.createElement('A');
		a.href='';
		a.id='__captchaReActive';
		__captchaAddHandler(a,'click',function(e){__captchaActive(); return false;});
		document.body.appendChild(a);
		__captchaActive();
	}
}

function __captchaGetAll()
{
	if(!__captchaFX)
	{
		chrome.storage.sync.get(null,function(e){
			for(var i in e)
				console.log(i+":"+e[i]);
		});
	}
	else
	{
		for(var i in __captchaStorage)
			console.log(i+":"+__captchaStorage[i]);
	}
}
/*v2.0*/
function __captchaGetSite(url,callback)
{
	if(!url)
		return;
	var s=null;
	if('__captchaURL_'+url in __captchaStorage)
		s=__captchaStorage['__captchaURL_'+url];
	else
		s={'url':url,'notnew':1};
	if(typeof s =='string')
	{
		var t=s.split('[||]');
		var i;
		s={};
		for(i=0;i<t.length;i++)
		{
			var c=t[i].split('[|]');
			s[c[0]]=c[1];
		}
		if(!('url' in s)) s['url']=url;
		__captchaSaveStorage('__captchaURL_'+url,s);
	}
	if(callback) callback(s);
	return s;
}
/*v2.0*/
function __captchaSetSite(url,s)
{
	if(!('url' in s)) s['url']=url;
	__captchaSaveStorage('__captchaURL_'+url,s);
}
/*function __captchaSetSite(url,notnew,notquestion,work,command,autosubmit,img_id,img_name,img_src,input_id,input_name,phrase,regsense,numeric,calc,is_russian,classname,input_class)
{
	var txt='url[|]'+url;
	if(notnew) txt+='[||]notnew[|]'+notnew;
	if(notquestion) txt+='[||]notquestion[|]'+notquestion;
	if(work) txt+='[||]work[|]'+work;
	if(autosubmit) txt+='[||]autosubmit[|]'+autosubmit;
	if(img_id) txt+='[||]img_id[|]'+img_id;
	if(img_name) txt+='[||]img_name[|]'+img_name;
	if(img_src) txt+='[||]img_src[|]'+img_src;
	if(input_id) txt+='[||]input_id[|]'+input_id;
	if(input_name) txt+='[||]input_name[|]'+input_name;
	if(phrase) txt+='[||]phrase[|]'+phrase;
	if(regsense) txt+='[||]regsense[|]'+regsense;
	if(numeric) txt+='[||]numeric[|]'+numeric;
	if(calc) txt+='[||]calc[|]'+calc;
	if(is_russian) txt+='[||]is_russian[|]'+is_russian;
	if(command) txt+='[||]command[|]'+command;
	if(classname) txt+='[||]classname[|]'+classname;
	if(input_class) txt+='[||]input_class[|]'+input_class;
	if(!__captchaFX)
	{
		var o={};
		o['__captchaURL_'+url]=txt;
		chrome.storage.sync.set(o);
	}
	else
	{
		saveFXstorage('__captchaURL_'+url,txt);
	}
}*/

/*if(!__captchaFX)
{
	__captchaLoadPage();
}*/