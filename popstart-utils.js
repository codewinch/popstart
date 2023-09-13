// Popstart Utils © 2023 MIT
//

__.resetForm=function(selector){
	let t=this
	if(!t)t=__.el(selector)
	__.el('input:not([type=hidden]),textarea,select',this).forEach(function(el){
		__.val(el,'')
	})
}

__.screenWidth=()=>window.innerWidth||document.documentElement.clientWidth||document.body.clientWidth
__.screenHeight=()=>window.innerHeight||document.documentElement.clientHeight||document.body.clientHeight

/*
 * __.incrHTML:
 * @param{string}selector - the selector to clone
 * @param{string}replaceValue - the value to replace in the cloned element
 * @param{number}start - the number to start at
 * @param{number}end - the number to end at
 * @param{number}step - the number to increment by
 * @returns{void}
 * @example
 * __.incrHTML(".year","replaceme",1990,2023,1)
 */

// __.incrHTML: incrementally clone an element and replace a value in the clone
__.incrHTML=(selector,replaceValue,start=0,end=0,step=1)=>{
	const overflow=100000
	// info(`incrHTML:selector:${selector}replaceValue:${replaceValue}start:${start}end:${end}step:${step}`)
	let parent=document.querySelector(selector)
	if(!parent){
		error(`incrHTML:No element found for selector:${selector}`)
		return
	}
	let el=parent.lastElementChild
	if(!el || el.length===0){
		error(`incrHTML:No element found for selector:${selector}`)
		return
	}
	let newEl=el.cloneNode(true)
	let regex=new RegExp(replaceValue,"g")
	start=parseInt(start)
	end=parseInt(end)
	step=parseInt(step)
	if(step>0){end +=1}else{end -=1}
	let i=start
	while(i!==end){
		if(i>overflow){
			error("incrHTML:overflow")
			break
		}
		let newElHTML=newEl.outerHTML.replace(regex,+i)
		let newEl2=document.createElement("div")
		newEl2.innerHTML=newElHTML
		parent.appendChild(newEl2.firstChild)
		i +=step
	}
	el.remove()
}


__.populateEach = (selector, dest, readdatapath, descending, processfn) => {

    const start = new Date()

    let fn = processfn
    readdatapath = readdatapath || "form"
  
    if (!selector) { warning('populateEach: selector not specified'); return }
    if (!dest) { warning('populateEach: dest not specified'); return }

    let data = __.data[readdatapath]
    if (!data) {
        error(`populateEach: readdatapath "${readdatapath}" not found in __.data`)
        return
    }
    if (!(typeof data === 'object')) {
        error(`populateEach: readdatapath ${readdatapath} is not an object; it's a `, typeof data)
		debug("data:",data)
        return
    }
    if (!Array.isArray(data)) data = [data]
    else if (data.length === 0) {
        error(`populateEach: readdatapath ${readdatapath} is empty`)
        return
    }
  
    const newRoot = document.createElement('div')
    newRoot.classList.add('newRoot')

    const baseElement = __.el(selector);
    const destinationElement = __.el(dest)[0];

    data.forEach(item => {
        if (fn) {
            var f = __.functionFinder(fn, fn.split("."))
            if (!f || f === window) {
                error(`processfn ${fn} not found`)
            } else {
                item = f(item, readdatapath, selector, dest, descending)
            }
        }

        baseElement.forEach(function(el) {
            let newdiv = el.cloneNode(true)
            newRoot.appendChild(newdiv)
            __.populate(newdiv, item)
        })

		if (descending) destinationElement.insertAdjacentElement('afterbegin', newRoot.children[0])
		else destinationElement.appendChild(newRoot.children[0])
    })
  
    const end = new Date()
    const elapsed = end - start
    warn(`__.populateEach: ${elapsed}ms`)
}

// __.ssePopulate: loops and populates a selector with data from a server sent events connection
__.ssePopulateEach=(url,selector,dest,descending,opt,processfn)=>{
	if(!__.state['ssePopulateEach'])
		__.state['ssePopulateEach']={}
	if(__.state['ssePopulateEach'][url])return
	__.state['ssePopulateEach'][url]=true
	__.sseOpen(url,opt).on('message',(e)=>{
		const tempid=__.uuid()
		danger("tempid", tempid)
		// parse e.data as json:
		try{
			__.data[tempid]=JSON.parse(e.data)
		}catch(e){
			danger("data[tempid]", __.data[tempid])
			error("JSON.parse(e.data) failed",e)
			__.data[tempid] = {
				id: tempid,
				data: e.data
			}
		}
		__.populateEach(selector,dest,tempid,descending,processfn)
		// __.dataclean(tempid)
	})
}


__.mapToArray=(readdatapath,writedatapath)=>{
	writedatapath=writedatapath||readdatapath
	let data=__.data[readdatapath]
	if(!data){
		error(`mapToArray: readdatapath ${readdatapath} not found in __.data`)
		return
	}
	if(!typeof data==='object'){
		error(`mapToArray: readdatapath ${readdatapath} is not an object; it's a `, typeof data)
		return
	}
	let arr=[]
	if(!Array.isArray(data))
		for(let key in data){
			let d=data[key]
			d.id=key
			arr.push(d)
		}
	else arr=data
	__.data[writedatapath]=arr
}

// __.focus: place focus on the selector (or this)
__.focus=function(selector){
	let els
	// NOT type=hidden:
	if(!selector)els=__.el('input:not([type=hidden]),textarea,select',this)
	else els=__.el(selector)
	info('focus:',els)
	if(els.length>0)els[0].focus({focusVisible:true})
}

// __.displayError: display an error message
__.displayError=function(msg,selector=".error-msg"){
	try{
		const el=__.el(selector)
		danger("Found error div")
		const existingError=el[0]
		if(existingError){
			__.text(existingError,msg)
			__.show(selector)
			setTimeout(()=>__.hide(selector),10000)
			return
		}
	}catch(e){
		warn(`Warning(probably no .error div)in __.displayError(default error handler):{e.msg}`)
	}
	return __.alert(msg,"error-msg error danger")
}

// __.clearError: clear an error message
__.clearError=(selector=".error-msg")=>{
	__.hide(selector)
}

// __.doStylesExist: check if a style exists in the DOM at all
__.doStylesExist=(selector)=>{
	let stylesheets=document.styleSheets
	for(let i=0;i<stylesheets.length;i++){
		let stylesheet=stylesheets[i]
		let rules=stylesheet.rules || stylesheet.cssRules
		for(let j=0;j<rules.length;j++){
			let rule=rules[j]
			if(rule.selectorText===selector){
				return true
			}
		}
	}
	return false
}

// __.addStyles: add a style to the DOM (if it doesn't already exist)
__.addStyles=(selector,styles)=>{
	if(!__.doStylesExist(selector)){
		const style=document.createElement('style')
		style.type='text/css'
		style.appendChild(document.createTextNode(selector + '{' + styles + '}'))
		document.head.appendChild(style)
	}
}

// __.alert: display an alert message
__.alert=(msg,classes,timeout)=>{
	// bootstrap-compatible
	timeout=timeout||10000
	__.del(".alert")
	if(!classes)classes="info"
	danger("Classes", classes)
	const m=document.createElement("div")
	m.textContent=msg
	classes +=" alert alert alert-dismissible fade show"
	classes.split(" ").forEach(c=>m.classList.add(`${c}`))
	const closeButton=document.createElement("button")
	closeButton.classList.add("close")
	closeButton.setAttribute("type","button")
	closeButton.setAttribute("data-dismiss","alert")
	closeButton.setAttribute("aria-label","Close")
	closeButton.innerHTML='<span aria-hidden="true">Ã—</span>'
	closeButton.addEventListener("click",(e)=>{m.remove();e.stopPropagation()})
	setTimeout(()=>m.remove(),timeout)
	m.appendChild(closeButton)
	document.body.appendChild(m)
}

// __.error: default error handler
__.error=(e)=>{
	const em=__.parseErrorResponse(e);(__.displayError)?(__.displayError(em)):console.error("__.displayError does not exist!", em)
}

// __.loadCSSfile: loads a css file if it's not already loaded
__.loadCSS=(url)=>{
	if(!__.el(`link[href="${url}"]`)[0])
		return new Promise((resolve,reject)=>{
			const link=document.createElement('link')
			link.href=url;link.type='text/css';link.rel='stylesheet'
			link.onload=resolve;link.onerror=reject
			document.head.appendChild(link)
		})}

// __.loadJSfile: loads a js file if it's not already loaded
__.loadJS=(url, module)=>{
	info(`loading ${url}`)
	if(!__.el(`script[src="${url}"]`)[0])
		return new Promise((resolve,reject)=>{
			const script=document.createElement('script')
			script.src=url;script.type='text/javascript'
			if(module)script.type='module'
			script.onload=resolve;script.onerror=reject
			document.head.appendChild(script)
		})}

// __.load: loads a file based on extension
__.load=(url,version)=>{
	if(url.toLowerCase().endsWith('.js'))return __.loadJS(url,version)
	if(url.toLowerCase().endsWith('.css'))return __.loadCSS(url,version)
	return __.loadHTML(url,version)}

// __.loadHTML: loads an HTML file and replaces ALL content in the specified selector
__.loadHTML=(selector, url, version)=>{
	// uses __.get to load an HTML file and replace ALL content in the specified selector
	// however, it does add a version attribute to the selector and doesn't reload if the version is the same
	if(!version)version=0
	if(__.attr(selector,'version')===version)return
	return __.get(url,{json:false}).then(
		html=>{__.el(selector).forEach(el=>{el.innerHTML=html;__.attr(selector,'version',version)})}
	)}

// __.unloadCSS: unloads a css file
__.unloadCSS=(url)=>{if(__.el(`link[href="${url}"]`)[0])__.el(`link[href="${url}"]`).forEach(el=>el.remove())}

// __.unloadJS: unloads a js file
__.unloadJS=(url)=>{if(__.el(`script[src="${url}"]`)[0])__.el(`script[src="${url}"]`).forEach(el=>el.remove())}


// __.writeCookie: write a cookie
__.writeCookie=(name,value,days)=>{
	let expires='';if(days){let date=new Date();date.setTime(date.getTime()+(days*24*60*60*1000))
		expires=`;expires=${date.toUTCString()}`}
	document.cookie=`${name}=${(value||'')}${expires};path=/`}

// __.readCookie: read a cookie
__.getCookie=(name)=>{
	// returns the value of the cookie with the given name, or undefined if not found
	let cookieValue=undefined;document.cookie.split(';').forEach(cookie=>{
		let [key,value]=cookie.split('=');if(key.trim()===name)cookieValue=value}
	);return cookieValue}

// __.succeedIfCookie: returns a promise that succeeds if the cookie exists and has the given value
__.succeedIfCookie=(name,value)=>{return new Promise((resolve,reject)=>{
	let t=__.getCookie(name);if(t===value)resolve(t);else reject(t)})}

// __.failIfCookie: returns a promise that fails if the cookie exists and has the given value
__.failIfCookie=(name,value)=>{return new Promise((resolve,reject)=>{
	let t=__.getCookie(name);if(t===value)reject(t);else resolve(t)})}

// __.storeCookie: store a cookie
__.removeCookie=(name)=>__.storeCookie(name,'',-1)

// example: http://example.com/#param1=value1&param2=value2
// __.data.hash.param1 = "value1" etc
// __.hashParse: parses the hash and stores the values in __.data.hash
__.hashParse=(writedatapath)=>{
	if(!writedatapath)writedatapath='hash'
	const hash = location.hash.substring(1); // remove the "#" at the beginning
	const hashValues = hash.split("&"); // split the hash into an array
	for (const value of hashValues) {
		const [key, val] = value.split("=")
		__.datawrite(writedatapath,key,val)
	}
}

// __.writeThemeCookie: writes a cookie with the name of the current theme
__.writeThemeCookie=(name)=>{
	__.removeAllClasses('body','-theme')
	if(!name)name='light-theme'
	else for(let c of document.body.classList)if(c.endsWith('-theme'))name=c
	__.writeCookie('theme',name,3*365)}

// __.hideIfCurrentTheme: hides the element if the current theme is the same as the value of the writethemecookie-name attribute
__.hideIfCurrentTheme=function(){
	if(this.getAttribute('writethemecookie-name')===__.getCookie('theme'))__.hide(this)}

// __.hideIfNoTheme: hides the element if there is no theme cookie
__.hideIfNoTheme=function(){if(!__.getCookie('theme'))__.hide(this)}

// __.showIfCurrentTheme: shows the element if the current theme is the same as the value of the writethemecookie-name attribute
__.themeFromCookie=()=>{
	let theme=__.getCookie('theme');
	if(theme){
		__.removeAllClasses('body','-theme')
		__.addClass('body',theme)
	}

}

/* EventSource/Server Sent Events (SSE)
 * https://developer.mozilla.org/en-US/docs/Web/API/EventSource
 * https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events
 * @param{string}url - The url to connect to
 * @param{object}opt - Options(see link above)
 * @returns{object}- An object with on,off,and close methods
 * @example
 *		const es=__.sse('/sse')
 *		debug(e.data)
 *			es.close()// close(or es.off('message')to remove the listener)
 *		})
 * The primary events are 'open','message',and 'error'. The 'message' event
 * is the only one that has a data property.
 * The 'open' event is fired when the connection is established.
 * The 'error' event is fired when the connection is closed.
 * The 'message' event is fired when a message is received.
 */

// __.sseOpen: opens a server sent events connection
__.sseOpen=(url,opt)=>{
	const es=new EventSource(url,opt)
	const on=(event,cb)=>es.addEventListener(event,cb)
	const off=(event,cb)=>es.removeEventListener(event,cb)
	const close=()=>es.close()
	return {on:on,off:off,close:close}
}

// __.unixtsToDate: converts unix timestamps to date strings
__.unixtsToDate=function(selector){
	let t=selector||this
	__.data["date-unix-timestamp"]=__.data["date-unix-timestamp"]||{}
	__.scrape(t,"date-unix-timestamp")
	debug("unixtsToDate",__.data["date-unix-timestamp"])
	// walk	__.data["date-unix-timestamp"] and convert to unix timestamp
	for(let key in __.data["date-unix-timestamp"]){
		let value=__.data["date-unix-timestamp"][key]
		let ts=parseInt(value)
		if(isNaN(ts))continue
		// convert to date string
		let d=new Date(ts*1000)
		let date=d.toDateString()
		__.data["date-unix-timestamp"][key]=`${date}`
	}
	__.populate(t,"date-unix-timestamp")
}

// __.length: truncates the innerHTML of an element to a specified length
__.length=function(max,ellipsis){
	if(!max){error("length: max not specified");return}
	let h=this.innerHTML
	if(h.length>max)h=h.substring(0,max)
	if(ellipsis)h+=ellipsis
	this.innerHTML=h
}

// just add .alert styles (wait for DOM)
__.addStyles(".alert","position:fixed;top:0;left:0;right:0;padding:0.75rem 1.25rem;animation:fadein 1s;display:flex;align-items:center;justify-content:space-between;z-index:9999;")
__.addStyles(".alert .close","background-color:transparent;border:none;color:#ffff;text-shadow:-1px -1px 1px #0007;cursor:pointer;")

__.safify=(str)=>{
	const textNode=document.createTextNode(str)
	const div=document.createElement("div")
	div.appendChild(textNode)
	return div.innerHTML
}

__.scrapeInputElement=function(inputElement,name) {
	if(!inputElement){
		error(`scrapeInputElement:inputElement is null`)
		return
	}
	let data={}
	if(!name)name=__.GetStringAttr(inputElement,"populate","__.scrapeInputElement","n/a")
	if(!name)name=inputElement.name
	if(!name) name=inputElement.className.split(" ").pop()
	switch (inputElement.type) {
		case "text":
		case "password":
		case "hidden":
		case "textarea":
		case "email":
		case "tel":
		case "url":
		case "search":
		case "number":
		case "range":
		case "color":
		case "date":
		case "datetime-local":
		case "month":
		case "week":
		case "time":
			data[name]=inputElement.value
			return data
		case "checkbox":
			data[name]=inputElement.checked
			return data
		case "radio":
			if (inputElement.checked) {
				data[name]=inputElement.value
			}
			return data
		case "select-one":
			data[name]=inputElement.value
			return data
		case "select-multiple":
			data[name]=__.el("option", inputElement)
				.filter(option=>option.selected)
				.map(option=>option.value)
			return data
		default:
			data[name]=inputElement.innerHTML
			return data
	}
}

__.scrape=function(selector, writeDataPath) {
	let el=selector ? __.el(selector) : this
	let data={}
	writeDataPath=writeDataPath||"form"
	debug("scraping data from", el)
	__.el("input,textarea,select", el).forEach(input=>{
		let singleData=__.scrapeInputElement(input)
		Object.assign(data, singleData)
	})
	debug("__.scrape RECEIVED:", el, writeDataPath, data)

	if (typeof writeDataPath==="string") {
		__.data[writeDataPath]=data
	}

	return data
}

// single-element version of __.scrape
__.scrapeElement=function(selector, writeDataPath){
	let el=selector?__.el(selector):this
	writeDataPath=writeDataPath||"form"
	let data=__.scrapeInputElement(el)
	debug(`__.scrapeElement received from: ${el} data:${data} to: wdp: ${writeDataPath}`)
	if (typeof writeDataPath==="string") {
		__.data[writeDataPath]=data
	}
	return data
}

__.upload=function(selector,url,readdatapath,writedatapath){
	let opt={}
	let querydatapath=undefined
	opt.json=false
	opt.headers=opt.headers||{}
	let el=__.el(selector||this)[0]
	if(!el){
		warn("__.upload: no element found for selector",selector)
		return
	}
	let form
	if(!url||!writedatapath){
		form=el.closest("form")
		if(!form){
			warn("__.upload: no form found for selector",selector)
		} else {
			url=url||form.action
			writedatapath=writedatapath||form.name
		}
	}
	let data=new FormData()
	if(!el.files || el.files.length==0){
		error("__.upload: no file selected for selector",selector)
		return
	}
	data.append('file',el.files[0])
	debug("File", el.files[0].name)
	return __.AJAX(url,'POST',data,opt,readdatapath,writedatapath,querydatapath)
}

__.populate=function(selector,readdatapath,urlprefix){
	let data=null
	readdatapath=readdatapath||"form"
	if(typeof(readdatapath)=='string'){
		data=__.data[readdatapath]
	}else{
		data=readdatapath
	}
	if(Array.isArray(data) && data.length==1){
		data=data[0]
	}
	let el=__.el(selector)
	__.el("input,textarea",el).forEach(input=>{
		if(input.hasAttribute("skip-populate"))return
		if(!input.name)return
		if(!data ||!data[input.name])return
		switch(input.type){
			case 'text':
			case 'password':
			case 'hidden':
			case 'textarea':
			case 'email':
			case 'tel':
			case 'url':
			case 'search':
			case 'number':
			case 'range':
			case 'color':
			case 'date':
			case 'datetime-local':
			case 'month':
			case 'week':
			case 'time':
				input.value=__.safify(data[input.name])|| ''
				break
			case 'checkbox':
				input.checked=data[input.name] || false
				break
			case 'radio':
				input.checked=input.value===data[input.name]
				break
			case 'select-one':
				input.value=__.safify(data[input.name])|| ''
				break
			case 'select-multiple':
				__.el("option",input).forEach(option=>{
					option.selected=data[input.name].includes(option.value)
				})
				break
		}
	})
	__.config.AttrPrefixes.map(
		(prefix)=>{
			__.el("["+prefix+"populate]",el).forEach(populate=>{
				var name=populate.getAttribute("populate")
				if(!name)return
				if(!data ||!data[name])return
				populate.innerHTML=__.safify(data[name])
			})
			// also for background-image url:
			__.el("["+prefix+"populate-background]",el).forEach(populate=>{
				var name=populate.getAttribute("populate-background")
				if(!name)return
				if(!data ||!data[name])return
				populate.style.backgroundImage=`url(${urlprefix||''}${__.safify(data[name])})`
			})
			// also for src:
			__.el("["+prefix+"populate-src]",el).forEach(populate=>{
				var name=populate.getAttribute("populate-src")
				if(!name)return
				if(!data ||!data[name])return
				populate.src=`${urlprefix||''}${__.safify(data[name])}`
			})
			// following two support string-replacement inside a string in {key} format:
			// 
			// example: populate-attrs=src,href
			// doesn't eliminate the above options. You may wish to have a default
			// background image, and then replace it with a data value if it exists.
			let populateAttrs=__.el("["+prefix+"populate-attrs]",el)
			if(__.attr(el[0], prefix+"populate-attrs")!==""){
				populateAttrs.push(el)
			}
			populateAttrs.forEach(populate=>{
				// Section("populate-attrs:",populate)
				var attrnames=__.attr(populate,"populate-attrs")
				if(!attrnames)return
				if(Array.isArray(attrnames)){
					attrnames=attrnames.join(",")
				}
				attrnames.split(",").forEach(attr=>{
					// this cannot currently replace non-inline styles;
					// use background-image above for that.
					if(attr==='')return
					__.el("["+attr+"]",el).forEach(attrEl=>{
						let v=__.attr(attrEl, attr)
						// debug("attrEl:",attrEl,"has",v)
						if(Array.isArray(v)&&v.length==1){
							v=v[0]
						}
						if(!v||!v.replace){
							warn(`populate-attrs: ${attr}'s value ${v} is not a string`)
							return
						}
						// walk through data and replace {k} with value in attribute
						for(var k in data){
							v=v.replace(new RegExp(`{${k}}`,'g'),data[k])
						}
						__.attr(attrEl, attr, v)
					})
				})
			})
			// walk through the entire innerhtml (this could be big and slow!)
			// and replace {k} with value in innerHTML
			__.el("["+prefix+"populate-html]",el).forEach(i=>{
				var h=i.innerHTML
				for(var k in data){
					h=h.replace(new RegExp(`{${k}}`,'g'),data[k])
				}
				i.innerHTML=h
			})

	})
}


__.AJAX=(url,method,data,opt={},readdatapath="form",writedatapath="form",querydatapath)=>{
    debug("url",url,"method",method,"data",data,"opt",opt)
    data = (!data && opt.json !== false) ? __.data[readdatapath] || {} : data;
    opt.json = (opt.json === undefined) ? true : opt.json;

    if(querydatapath){
        opt.query=__.data[querydatapath]
    }
    if(opt.query){
        const queryArgs=Object.entries(opt.query)
            .map(([key,value])=>`${encodeURIComponent(key)}=${encodeURIComponent(value)}`).join("&")
        url += (url.includes("?")) ? `&${queryArgs}` : `?${queryArgs}`;
    }
    const xhr=new XMLHttpRequest()
    xhr.open(method,url)
    xhr.withCredentials=opt.withCredentials || false
    const headers=opt.headers ||{}
    Object.entries(headers).forEach(([key,value])=>{
        xhr.setRequestHeader(key,value)
    })
    xhr.onprogress=opt.onProgress
    if(opt.auth){
        xhr.setRequestHeader('Authorization',`Basic ${btoa(`${opt.auth.username}:${opt.auth.password}`)}`)
    }
    return new Promise((resolve,reject)=>{
        xhr.onload=()=>{
            if(xhr.status<200 || xhr.status>399){
                danger(`__.AJAX: ${method} ${url} returned ${xhr.status}`)
                return reject(xhr)
            }
            if(opt.json===false){
                warn("Returning raw response", xhr.response)
                return resolve(xhr.response)
            }
            try {
                resolve(JSON.parse(xhr.response))
            } catch(e) {
                resolve(xhr.response)
            }
        }
        xhr.onerror=()=>{
            danger(`__.AJAX: ${method} ${url} returned ${xhr.status} via onError`)
            reject(xhr)
        }
        xhr.setRequestHeader('Content-type','application/json')
        xhr.send(data ? JSON.stringify(data) : null)
    })
    .then((response)=>{
        (__.clearError||function(){})()
        if(xhr.status>=300 && xhr.status<400 && opt.followRedirects){
            opt.method='GET'
            return __.AJAX(xhr.getResponseHeader('Location'),'GET',null,opt)
        }
        return response
    })
    .then((response)=>{
        if(response){
            const contentType=xhr.getResponseHeader('content-type')
            // debug("__.AJAX final response parsing:", response)
			if(typeof response != 'object'){
				try {
					__.data[writedatapath]=(contentType.startsWith('application/json')) ? JSON.parse(response) : response
				}
				catch (e) {
					warn("__.AJAX received invalid JSON response:", e)
				}
            }
			__.data[writedatapath]=response
        } else {
            warn("__.AJAX received no response at all!")
        }
        return response
    })
    .catch((error)=>{
        danger("__.AJAX error:", error)
        throw error
    })
}


__.get=(url,opt,writedatapath,notjson,querydatapath)=>{
	if(notjson){opt=opt||{};opt.json=false}
	return __.AJAX(url,'GET',null,opt,null,writedatapath,querydatapath)
}
__.post=(url,data,opt,readdatapath,writedatapath,querydatapath)=>{
	return prom=__.AJAX(url,'POST',data,opt,readdatapath,writedatapath,querydatapath)
}
__.put=(url,data,opt,readdatapath,querydatapath)=>{return __.AJAX(url,'PUT',data,opt,readdatapath,null,querydatapath)}
__.delete=(url,opt,querydatapath)=>{return __.AJAX(url,'DELETE',null,opt,null,null,querydatapath)}
__.patch=(url,data,opt,readdatapath,querydatapath)=>{return __.AJAX(url,'PATCH',data,opt,readdatapath,null,querydatapath)}

// timedclass: add a class, wait, remove it
__.timedclass=function(selector,removeclassname,addclassname,time){
	// split the classnames into an array
	__.removeClass(selector,removeclassname)
	__.addClass(selector,addclassname)
	setTimeout(()=>{__.removeClass(selector,addclassname)
		__.addClass(selector,removeclassname)},time||2000)
}

// query arg parsing
__.argsParse=(writedatapath)=>{
	writedatapath=writedatapath||'args'
	var searchParams=new URLSearchParams(location.search)
	for (const [key,value] of searchParams.entries()) {
		__.datawrite(writedatapath,key,value)
	}
}

// require an individual query arg (fail if not found)
__.requireArg=(name, writedatapath)=>{
	// return new promise
	writedatapath=writedatapath||'arg'
	return new Promise((resolve, reject) => {
		var url = new URL(window.location.href)
		var value = url.searchParams.get(name)
		if (!value){
			// throw error if no query arg
			error(`No query arg found for ${name}`)
			reject(`Missing query arg ${name}`)
		}
		__.datawrite(writedatapath,name,value)
		resolve(value)
	})
}

// wipe the console.log after a short delay. Useful when troubleshooting.
__.wipeLogs=()=>{
	setTimeout(()=>{
		if(console.clear)console.clear()
		warn("__.wipeLogs Cleared startup console logs, per your request.")
	},100)
}

__.redirect=(url)=>{
	if(url&&url!==''){
		info(`__redirect("${url}")`)
		document.location=url
	}
}
