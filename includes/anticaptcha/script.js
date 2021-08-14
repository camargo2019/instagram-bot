__captchaStart(__realStart);

function __saveSettings(key,value)
{
	if(!key) return;
	__captchaSettings[key]=value;
	var o={};
	o['__captchaSettings']=__captchaSettings;
	if(!__captchaFX)
		chrome.storage['local'].set(o);
	else
		self.port.emit("gotElement",o);
}
function __setLang(lng)
{
	__saveSettings('lang',lng);
	__realStart(1);
}

function __setKey(key)
{
	__saveSettings('key',key);
}

function __getBalance()
{
	var link='http://antigate.com/res.php?soft_id=598&key='+__captchaSettings['key']+'&action=getbalance&header_acao=1';
	var aj=new ajaxRequest();
	aj.onreadystatechange=function(){
		if(aj.readyState==4 && aj.status==200)
		{
			var txt=aj.responseText.replace(/^\s+|\s+$/g,'');
			var d=document.getElementById('__balance');
			if(d)
			{
				if(__captchaSettings['lang']=='ru')
					d.innerText='Баланс: '+txt;
				else
					d.innerText='Balance: '+txt;
			}
		}
	};
	aj.open("GET",link,true);
	aj.send();
}

function __realStart(n)
{
	var d;
	if(__captchaFX)
	{
		d=document.getElementById('__settings'); 
		if(!d)
		{
			d=document.createElement('INPUT');
			d.type='button';
			d.id='__settings';
			__captchaAddHandler(d,'click',function(e){self.port.emit("settings",{});});
			document.body.appendChild(d);
		}
	}
	if(__captchaSettings['lang']=='ru')
	{
		
		d=document.getElementById('__settings'); if(d) d.value='Настройки';
		d=document.getElementById('__name'); if(d) d.innerText='Ключ:'+(!__captchaSettings['key']?' не установлен':'');
		d=document.getElementById('__setkey'); if(d) d.value='Установить';
		d=document.getElementById('__justactivetext'); if(d) d.innerText='Только в активной вкладке';
		d=document.getElementById('__manual'); 
		if(d)
		{ 
			d.value='Ручной выбор'; 
			__captchaAddHandler(d,'click',function(e){var o="window.__captchaAnother();"; __captchaExecute(o);});
			/*d.onclick=function(e){var o="window.__captchaAnother();"; __captchaExecute(o);};*/
		}
		d=document.getElementById('__pingn'); if(d) d.innerText='Период запроса капчи';
		d=document.getElementById('__pingv'); if(d) d.innerText=__captchaSettings['ping']/1000+' с';
		d=document.getElementById('__lochead'); if(d) d.innerText='Расположение хранилища';
		d=document.getElementById('__globaltext'); if(d) d.innerText='Глобальное (синхронизируется)';
		d=document.getElementById('__localtext'); if(d) d.innerText='Локальное';
		d=document.getElementById('__showinfotext'); if(d) d.innerText='Показывать информацию под изображением?';
		
	}
	else
	{
		d=document.getElementById('__settings'); if(d) d.value='Settings';
		d=document.getElementById('__name'); if(d) d.innerText='Key:'+(!__captchaSettings['key']?' not setup':'');
		d=document.getElementById('__setkey'); if(d) d.value='Setup';
		d=document.getElementById('__justactivetext'); if(d) d.innerText='Just in active tab';
		d=document.getElementById('__manual'); 
		if(d)
		{ 
			d.value='Manual selection';
			__captchaAddHandler(d,'click',function(e){var o="window.__captchaAnother();"; __captchaExecute(o);});			
			/*d.onclick=function(e){
				var o="var d=document.getElementById('__captchaReAnother'); if(d) d.click();";
				__captchaExecute(o);
			};*/
		}
		d=document.getElementById('__pingn'); if(d) d.innerText='Captcha ping';
		d=document.getElementById('__pingv'); if(d) d.innerText=__captchaSettings['ping']/1000+' s';
		d=document.getElementById('__lochead'); if(d) d.innerText='Location of storage';
		d=document.getElementById('__globaltext'); if(d) d.innerText='Global (syncronize)';
		d=document.getElementById('__localtext'); if(d) d.innerText='Local';
		d=document.getElementById('__showinfotext'); if(d) d.innerText='Show information under image?';
		
	}
	if(n==undefined)
		setInterval(__getBalance,60000);
	__getBalance();
	d=document.getElementById('_lng');
	if(d)
	{
		d=d.getElementsByTagName('INPUT');
		var i;
		if(d)
		{
			for(i=0;i<d.length;i++)
				__captchaAddHandler(d[i],'click',function(e){__setLang(this.value);});
		}
	}
	d=document.getElementById('__setkey');
	if(d)
	{
		__captchaAddHandler(d,'click',function(e){
			var tt=document.getElementById('__key'); 
			if(tt)
			{
				__setKey(tt.value);
				tt.value='';
				__realStart(1);
			}
		});
	}
	d=document.getElementById('__justactive'); 
	if(d)
	{
		d.checked=__captchaSettings['active'];
		__captchaAddHandler(d,'change',function(e){__saveSettings('active',this.checked);});
	}
	d=document.getElementById('__showinfo'); 
	if(d)
	{
		d.checked=__captchaSettings['showinfo'];
		__captchaAddHandler(d,'change',function(e){__saveSettings('showinfo',this.checked);});
	}
	d=document.getElementById('__ping'); 
	if(d)
	{
		d.value=__captchaSettings['ping']/1000;
		__captchaAddHandler(d,'change',function(e){
			var z=document.getElementById('__pingv'); 
			if(z) z.innerText=this.value+' '+(__captchaSettings['lang']=='ru'?'с':'s'); 
			__saveSettings('ping',this.value*1000);
		});
	}
	d=document.getElementById('__global'); 
	if(d)
	{
		d.checked=__captchaSettings['storage']=='sync';
		__captchaAddHandler(d,'change',function(e){if(this.checked)__saveSettings('storage','sync');});
	}
	d=document.getElementById('__local'); 
	if(d)
	{
		d.checked=__captchaSettings['storage']=='local';
		__captchaAddHandler(d,'change',function(e){if(this.checked)__saveSettings('storage','local');});
	}
	
}

/*var __captchaLang='en';
var __captchaKey='';
var __captchaJustActive=true;
var __captchaFX=/firefox/i.test(navigator.userAgent);
var __captchaFXStorage;

if(__captchaFX)
{
	self.port.on("getElements", function(storage) {
		__captchaFXStorage=storage;
		__start();
	});
	
}

function saveFXstorage(key,value)
{
	var o={};
	o[key]=value;
	__captchaFXStorage[key]=value;
	self.port.emit("gotElement",o);
}

function FXexecuteScript(text)
{
	self.port.emit("execute",text);
}

function __captchaFXGetSettings()
{
	__captchaLang=__captchaFXStorage.__captchaLang;
	if(__captchaLang==undefined)
	{
		__captchaLang='en';
		//__captchaFXStorage.__captchaLang=__captchaLang;
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
		var d=document.getElementById('__justactive'); 
		if(d)
		{
			d.checked=__captchaJustActive;
			d.onchange=function(e){
				__captchaJustActive=this.checked;
				saveFXstorage('__captchaAct',this.checked?'true':'false');
				
			};
		}
	}
}


function __captchaGetSettings()
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
			__captchaKey=e.__captchaKey;
	});
	chrome.storage.sync.get('__captchaAct',function(e){
		if(chrome.runtime.lastError)
			console.log('Storage Error: '+chrome.runtime.lastError);
		else
		{
			if(e.__captchaAct==undefined)
				__captchaJustActive=true;
			else
				__captchaJustActive=(e.__captchaAct=='true');
			var d=document.getElementById('__justactive'); 
			if(d)
			{
				d.checked=__captchaJustActive;
				d.onchange=function(e){
					__captchaJustActive=this.checked;
					
					chrome.storage.sync.set({'__captchaAct':this.checked?'true':'false'}, function(){
						if(chrome.runtime.lastError)
							console.log('Storage Error: '+chrome.runtime.lastError);
					});
				};
			}
		}
	});
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

function __setLang(lng)
{
	__captchaLang=lng;
	if(__captchaFX)
	{
		saveFXstorage('__captchaLang',lng);
	}
	else
	{
		chrome.storage.sync.set({'__captchaLang':lng}, function(){
			if(chrome.runtime.lastError)
				console.log('Storage Error: '+chrome.runtime.lastError);
		});
	}
	__realStart(1);
}

function __setKey(key)
{
	__captchaKey=key;
	if(__captchaFX)
	{
		saveFXstorage('__captchaKey',key);
	}
	else
	{
		chrome.storage.sync.set({'__captchaKey':key}, function(){
			if(chrome.runtime.lastError)
				console.log('Storage Error: '+chrome.runtime.lastError);
		});
	}
}

function __getBalance()
{
	var link='http://antigate.com/res.php?soft_id=598&key='+__captchaKey+'&action=getbalance&header_acao=1';
	var aj=new ajaxRequest();
	aj.onreadystatechange=function(){
		if(aj.readyState==4 && aj.status==200)
		{
			var txt=aj.responseText.replace(/^\s+|\s+$/g,'');
			var d=document.getElementById('__balance');
			if(d)
			{
				if(__captchaLang=='ru')
					d.innerHTML='Баланс: '+txt;
				else
					d.innerHTML='Balance: '+txt;
			}
		}
	};
	aj.open("GET",link,true);
	aj.send();
}

function __realStart(n)
{
	var d;
	if(__captchaFX)
	{
		d=document.getElementById('__settings'); 
		if(!d)
		{
			d=document.createElement('INPUT');
			d.type='button';
			d.id='__settings';
			d.onclick=function(e){
				self.port.emit("settings",{});
			};
			document.body.appendChild(d);
		}
	}
	if(__captchaLang=='ru')
	{
		
		d=document.getElementById('__settings'); if(d) d.value='Настройки';
		d=document.getElementById('__name'); if(d) d.innerHTML='Ключ:'+(!__captchaKey?' не установлен':'');
		d=document.getElementById('__setkey'); if(d) d.value='Установить';
		d=document.getElementById('__justactivetext'); if(d) d.innerHTML='Только в активной вкладке';
		d=document.getElementById('__manual'); 
		if(d)
		{ 
			d.value='Ручной выбор'; 
			d.onclick=function(e){
				var o="window.__captchaAnother();";
				if(!/firefox/i.test(navigator.userAgent))
					chrome.tabs.executeScript(null,{code:o},function(r){console.log(r);});
				else
					self.port.emit("execute",o);
			};
		}
	}
	else
	{
		d=document.getElementById('__settings'); if(d) d.value='Settings';
		d=document.getElementById('__name'); if(d) d.innerHTML='Key:'+(!__captchaKey?' not setup':'');
		d=document.getElementById('__setkey'); if(d) d.value='Setup';
		d=document.getElementById('__justactivetext'); if(d) d.innerHTML='Just in active tab';
		d=document.getElementById('__manual'); 
		if(d)
		{ 
			d.value='Manual selection'; 
			d.onclick=function(e){
				var o="var d=document.getElementById('__captchaReAnother'); if(d) d.click();";
				if(!/firefox/i.test(navigator.userAgent))
					chrome.tabs.executeScript(null,{code:o},function(r){console.log(r);});
				else
					self.port.emit("execute",o);
			};
		}
	}
	if(n==undefined)
		setInterval(__getBalance,60000);
	__getBalance();
	d=document.getElementById('_lng');
	if(d)
	{
		d=d.getElementsByTagName('INPUT');
		var i;
		if(d)
		{
			for(i=0;i<d.length;i++)
				d[i].onclick=function(e){__setLang(this.value);};
		}
	}
	d=document.getElementById('__setkey');
	if(d)
	{
		d.onclick=function(e){
			var tt=document.getElementById('__key'); 
			if(tt)
			{
				__setKey(tt.value);
				tt.value='';
				__realStart(1);
			}
		};
	}
}

function __start()
{
	if(!__captchaFX)
		__captchaGetSettings();
	else
		__captchaFXGetSettings();
	setTimeout(__realStart,1000);
}

if(!__captchaFX)
	__start();*/