__captchaStart(__start);
__captchaIfChange(__start);

function __captchaReSet(o)
{
	var d=document.getElementById('_table');
	if(d && d.children)
	{
		d=d.children;
		var i;
		for(i=0;i<d.length;i++)
		{
			if(d[i].children[0].innerHTML==o['url'])
				break;
		}
		if(i<d.length)
		{
			o['notquestion']=(d[i].children[1].children[0].checked?1:0);
			o['work']=(d[i].children[2].children[0].checked?1:0);
			o['autosubmit']=(d[i].children[3].children[0].checked?1:0);
			o['phrase']=(d[i].children[4].children[0].checked?1:0);
			o['regsense']=(d[i].children[5].children[0].checked?1:0);
			o['numeric']=(d[i].children[6].children[0].checked?1:0);
			o['calc']=(d[i].children[7].children[0].checked?1:0);
			o['is_russian']=(d[i].children[8].children[0].checked?1:0);
			__captchaSetSite(o['url'],o);
			if(__captchaFX)
				self.port.emit("again",{});
			/*if(!__captchaFX)
				__start();
			else
				self.port.emit("again",{});*/
		}
	}
}

function __start()
{
	if(!__captchaFX)
		chrome.storage[__captchaSettings['storage']].get(null,function(e){_drawTable(e);});
	else
		_drawTable(__captchaStorage);
}

function _drawTable(e)
{
	var d=document.getElementById('_table');
	if(d) while(d.children.length>0) d.removeChild(d.children[0]);
	for(var i in e)
	{
		if(!/^__captchaURL_/.test(i)) continue;
		var o=e[i];
		
		if(typeof o =='string')
		{
			var t=o.split('[||]');
			var z;
			o={};
			for(z=0;z<t.length;z++)
			{
				var c=t[z].split('[|]');
				o[c[0]]=c[1];
			}
			__captchaSaveStorage(i,o);
		}
		else if(!__captchaFX) __captchaStorage[i]=o;
		if(!('notquestion' in o) || !o['notquestion'])
		{
			if('url' in o)
				chrome.storage[__captchaSettings['storage']].remove(i);
			continue;
		}
		var tr=document.createElement('TR');
		var td=document.createElement('TD');
		td.innerText=o['url'];
		tr.appendChild(td);
		for(var j in __captchaTable[__captchaSettings['lang']])
		{
			td=document.createElement('TD');
			var inp=document.createElement('INPUT');
			inp.type='checkbox';
			inp.checked=(j in o  && o[j]);
			__captchaAddHandler(inp,'change',function(e){
					var url=this.parentNode.parentNode.children[0].innerText;
					__captchaGetSite(url,__captchaReSet);
			});
			var txt=document.createTextNode(__captchaTable[__captchaSettings['lang']][j]);
			td.appendChild(inp);
			td.appendChild(txt);
			tr.appendChild(td);
		}
		d.appendChild(tr);
	}
	var d=document.getElementById('_instruction');
	if(d)
	{
		while(d.children.length>0) d.removeChild(d.children[0]);
		d.innerText='';
		var t1=document.createTextNode(__captchaInstruction[__captchaSettings['lang']]['title']);
		var b1=document.createElement('BR');
		var t2=document.createTextNode(__captchaInstruction[__captchaSettings['lang']]['text']);
		var b2=document.createElement('BR');
		var t3=document.createTextNode(__captchaInstruction[__captchaSettings['lang']]['sites']);
		d.appendChild(t1);
		d.appendChild(b1);
		d.appendChild(t2);
		d.appendChild(b2);
		d.appendChild(t3);
	}
}