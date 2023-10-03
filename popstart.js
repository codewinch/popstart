// Popstart © 2023 MIT
// Important: the Startup() function relies on newer allSettled function,so a
// Promises polyfill recommended for older browser support:
// https://cdnjs.com/libraries/promise-polyfill

'use strict'

let logLevel='warn'
logLevel='debug'
let MutationObserver=window.MutationObserver||window.WebKitMutationObserver

window.__=window.__||{}
__.data=__.data||{}
__.state=__.state||{}
__.config=__.config||{
	AlwaysPreventDefault:false,
	AlwaysPreventFormSubmission:true,
	AlwaysPreventClickPropagation:true,
	AttrPrefixes:['','x-','data-'],
	BoundEventNames:['click','change','input','focus','blur','keyup','submit','mouseover','mouseout'],
	DebounceTimes:{'click': 50, 'input':300,'change':300,'keyup':300,"DOMWatcher.MyObserver":100},
	// by default, stop	propagation on these events:
	StopPropagationEventNames:['click'],
	errorNameArgs:['error','err','errorResponse','errorResponseText'],
	eventNameArgs:['ev','evt','event'],
	elementNameArgs:['el','ele','element'],
}

// general utility functions
__.del=(selector)=>__.el(selector).forEach(el=>el.remove())
__.text=(selector,content)=>__.el(selector).forEach(el=>content===undefined?el.textContent:el.textContent=content)
__.html=(selector,content)=>__.el(selector).forEach(el=>content===undefined?el.innerHTML:el.innerHTML=content)
__.val=(selector,value)=>__.el(selector).forEach(el=>value===undefined?el.value:el.value=value)
__.on=(selector,event,cb)=>__.el(selector).forEach(el=>el.addEventListener(event,cb))
__.off=(selector,event,cb)=>__.el(selector).forEach(el=>el.removeEventListener(event,cb))
__.css=(selector,styles)=>__.el(selector).forEach(el=>
	typeofstyles==='string'?getComputedStyle(el)[styles]:Object.assign(el.style,styles))
// hide is different from show because often a number of elements will be
// hidden with only one shown. we don't want to trigger hide in that case:
__.hide=function(selector,trigger){if(!selector)selector=this;__.el(selector).forEach(el=>{
	__.addClass(el,'hidden')
	if(trigger)__.trigger(selector,'hidden')})}
__.show=(selector)=>__.el(selector).forEach(el=>{
	__.removeClass(el,'hidden')
	if(!el.hasAttribute('already-shown')){el.setAttribute('already-shown','true');__.trigger(selector,'firstdisplay')}
	__.trigger(selector,'shown')})
__.toggle=(selector)=>__.el(selector).forEach(el=>{
	if(el.classList.contains('hidden'))__.removeClass(el,'hidden')
	else __.addClass(el,'hidden')
	__.trigger(selector,el.classList.contains('hidden')?'hidden':'shown')})
__.switch=(on,off)=>{__.hide(off);__.show(on)}
__.addClass=(selector,className)=>className.split(' ').forEach(className=>__.el(selector).forEach(el=>el.classList.add(className)))
__.removeClass=(selector,className)=>className.split(' ').forEach(className=>__.el(selector).forEach(el=>el.classList.remove(className)))
__.removeAllClasses=(selector, suffix)=>{__.el(selector).forEach(el=>{
	for(let c of el.classList)if(c.endsWith(suffix))el.classList.remove(c)})}
__.hasClass=(selector,className)=>__.el(selector).some(el=>el.classList.contains(className))
__.toggleClass=(selector,className)=>__.el(selector).forEach(el=>el.classList.toggle(className))
__.removeAttr=(selector,name)=>__.el(selector).forEach(el=>el.removeAttribute(name))
__.clone=(from,to)=>{__.el(to).forEach(toEl=>toEl.innerHTML=__.el(from)[0].innerHTML)}
__.cloneMe=function(to){__.el(to).forEach(toEl=>toEl.innerHTML=this.innerHTML)}
__.noop=()=>{}, // can also be used to stop click propagation
__.test=(text)=>{__.alert((text)?text:'Howdy!',"info")}
__.alert=(text)=>{alert((text)?text:'no __.alert function'+text)}
__.error=(text)=>{console.error((text)?text:'no __.error function'+text)}
__.shuffle=function(selector){let parent=this;if(selector&&selector!=="")parent=__.el(selector)[0]
		for(let i=parent.children.length;i>=0;i--){parent.appendChild(parent.children[Math.random()*i|0])}}
__.prefersDarkMode=window.matchMedia('(prefers-color-scheme:dark)').matches
__.addDarkMode=()=>{if(__.prefersDarkMode)document.body.classList.add('dark')}
__.quietLogger=function(...params){setTimeout(console.log.bind(console,...params))}
__.trigger=(selector,event)=>__.el(selector).forEach(el=>__.PopEvent.call(el,{type:event}))
__.delay=(time)=>new Promise(resolve=>setTimeout(resolve,time||1000))
__.click=(selector)=>__.trigger(selector,'click')
__.empty=(selector)=>__.el(selector).forEach(el=>el.innerHTML='')

__.append=(selector,html)=>__.el(selector).forEach(el=>el.insertAdjacentHTML('beforeend',html))
__.dataclean=(path)=>{if(path)delete __.data[path]}
__.datawrite=(path,name,value)=>{__.data[path]=__.data[path]||{};__.data[path][name]=value}
__.dataread=(path,name)=>{__.data[path]=__.data[path]||{};return __.data[path][name]}
__.uuid=()=>{let uuid='',i,random
	for(i=0;i<32;i++){random=(Math.random()*16)|0;if(i===8||i===12||i===16||i===20){
		uuid+='-'}uuid+=(i===12?4:i===16?(random&3)|8:random).toString(16)}return uuid}//v1
__.visible=(selector)=>__.el(selector).some(el=>el.offsetParent!==null)
__.attr=(selector,name,value)=>{
	if(!value)return __.el(selector)[0].getAttribute(name)
	__.el(selector).forEach(el=>el.setAttribute(name,value))
}

__.debounce=(func,wait)=>{
	let timeout;return function(...args){const context=this
	clearTimeout(timeout);timeout=setTimeout(()=>func.apply(context,args),wait||25)}}

__.parent=function(selector){return this.parentElement.matches(selector)}
__.parentChild=function(selector){let parts=selector.split(':child(');let parentSelector=parts[0]
	let childSelector=parts[1].slice(0,-1);let parent=this.closest(parentSelector)
	return parent&&parent.querySelector(childSelector)===this}

__.el=(selector,container)=>{
	let c=container
	if(selector instanceof Array&&selector.length > 0)selector=selector[0]
	if(selector instanceof Element&&!container)return[selector]
	if(c instanceof Array&&c.length>0)c=c[0]
	else if(!c)c=document
	else if(typeof c==='string')c=document.querySelector(c)||(()=>{error('Container not found:',c); return[]})()
	if(!(c instanceof Element))return Array.from(document.querySelectorAll(selector))
	if(selector instanceof Element)return c.contains(selector)?[selector]:[]
	try{
		const eles=c.querySelectorAll(selector)
		if(!eles)return[]
		// debug("__.el",`Found ${eles.length} elements matching "${selector}"`, eles)
		const foundEls=Array.from(eles)
		if(c.matches(selector))foundEls.unshift(c)
		return foundEls
	}catch(e) {
		error(`Error:${e.message}`)
		return[]
	}
}

__.hiddeninput=(selector, name, readdatapath)=>{
	readatapath=readatapath||'form'
	let i= document.createElement("input")
	i.type = "hidden"
	i.name = name
	i.value = __.dataread(readatapath,name)
	__.el(selector).forEach(el=>el.appendChild(i))
}

// this attr function also works with inline styles:
__.attr=(selector,name,value)=>{
	const els=__.el(selector)
	if(name==='style'){
		if(value===undefined){
			return els.map(el=>el.style.cssText)
		}else{
			els.forEach(el=>el.style.cssText=value)
		}
	}else{
		if(value===undefined){
			return els.map(el=>el.getAttribute(name))
		}else{
			els.forEach(el=>el.setAttribute(name,value))
		}
	}
}

// popstart's simple logger
const l=(()=>{
	return{
		logger:(...args)=>{
			const levels=['debug','info','warn','danger','error',
				'section'
			]
			let colors=['#05f','#091','#d15e00','#610','#921',
				'purple;font-weight:bold'
			]
			if(__.prefersDarkMode)colors=['#5af','#193','orange','#f62','#d31',
				'purple;font-weight:bold'
			]
			const defaultLevel='debug'
			let color=colors[0]
			let level=args[0]
			if(typeof level==='string' && levels.includes(level)){
				level=levels.indexOf(level)
				args.shift()
				color=colors[level]
			}
			if(logLevel===''||level>=levels.indexOf(logLevel)){
				// const message=args[0]
				const logArgs=args
				let line2=''
				const stack=new Error().stack
				// make sure stack has enough lines:
				const stackSplit=stack.split('\n')
				if(stackSplit.length<4){
					__.quietLogger(`%c${logArgs[0]}`,`background-color:${color},color:#fff`,...logArgs.slice(1))
					return
				}
				const line=stack.split('\n')[3].trim()
				// also remove the URL part and just specify filename and line number,
				const lineSplit=line.split('/')
				const lineSplit2=lineSplit[lineSplit.length - 1].split(':')
				lineSplit2.pop()
				line2=lineSplit2.join(':')
				logArgs.unshift(line2)
				// concatenate the arguments from logArgs,but only ifthey are
				// simple types like string. leave the other args untouched:
				let o=''
				let newArgs=[]
				for(let i=1;i<logArgs.length;i++){
					const arg=logArgs[i]
					if(typeof arg==='string' || typeof arg==='number' || typeof arg==='boolean'){
						o +=' '+arg
					}else{
						// add them to the end of the array,and then o will be at the beginning
						newArgs.push(arg)
					}
				}
				if(o){
					newArgs.unshift(o)
				}
				__.quietLogger(`%c${line2}%c${newArgs[0]}`,`border-radius:3px;padding:2px 3px 1px;color:#fff;background-color:${color}`,`color:${color}`,...newArgs.slice(1))
			}
		},
		log:(...args)=>{l.logger('debug',...args)},
		debug:(...args)=>{l.logger('debug',...args)},
		info:(...args)=>{l.logger('info',...args)},
		warn:(...args)=>{l.logger('warn',...args)},
		danger:(...args)=>{l.logger('danger',...args)},
		error:(...args)=>{l.logger('error',...args)},
		// new: section logger
		section:(...args)=>{l.logger('section',...args)},
	}
})()
const log=l
const debug=l.debug
const info=l.info
const warn=l.warn
const danger=l.danger
const error=l.error
const Section=l.section

info('Popstart is loading')

__.parseErrorResponse=(r)=>{
	// You can replace this method,or __.displayError with your own
	// implementation ifyou have a different error message format or
	// preference for a different error display method
	// ifit's an XHR,extract responseText.
	// This will try to extract JSON if possible.
	if(typeof r==="object" && r.responseText){
		r=r.responseText
	}
	try{
		debug('parseErrorResponse',r)
		const rJson=JSON.parse(r)
		if(rJson.message){
			r=rJson.message
			debug('parseErrorResponse',rJson.message)
		}else if(rJson.error){
			r=rJson.error
			debug('parseErrorResponse',rJson.error)
			if(r.message){
				r=r.message
				debug('parseErrorResponse',rJson.error.message)
			}
		}
	}catch(e){
		danger(`Error Message is not JSON: "${r}"`, e)
	}
	if(r==="Unauthorized")r="Sorry, you lack authority to do that."
	if(r==="Bad Gateway")r="The server is down. Please try again later."
	return r
}

// replaced regex with this string split version instead,
// slightly longer but more readable.
//(note the regex would be O(m)and this is O(n*m))
__.getArgs=fn=>{
	let args=null
	let fnString=fn.toString()
	// detect ifthe function contains()\s*=>or function\s*\(\s*\)
	// which means it's an arrow function or a function with no arguments
	// in which case return an empty array
	let tempfnString=fnString.replace(/\s/g,'')
	// we have to substring only up to the first {
	// because the function may contain a nested function
	// which would cause the regex to fail
	tempfnString=tempfnString.substring(0,tempfnString.indexOf('{'))
	if(tempfnString.includes('()=>')|| tempfnString.includes('function()')){
		return []
	}
	if(fnString.includes('=>')){
		args=fnString.split('=>')[0].trim()
	}else if(fnString.includes('function')){
		args=fnString.split('function')[1].split('{')[0].trim()
	}else{
		warn(`Unsupported function signature:${fnString}`)
		return []
	}
	if(args.includes('(')){
		return args.split('(')[1].split(')')[0].split(',').map(arg=>arg.trim().split('=')[0].trim())
	}else{
		return [args]
	}
}

// critical methods used by __.PopEvent:

__.GetStringAttr=(ele,name,fnName,eleName)=>{
	// error(ele,`__.GetStringAttr ${fnName}for ${eleName}:${name}`)
	if(!ele){
		return ''
	}
	if(!eleName)eleName=__.GetElementName(ele)
	if(!ele.getAttribute){
		error(ele,`__.GetStringAttr ${fnName}for ${eleName}:${name} ele has no getAttribute`)
		return ''
	}
	for(const prefix of __.config.AttrPrefixes){
		let attr=ele.getAttribute(prefix+name)
		if(attr){
			// debug(ele,prefix+name,`__.GetStringAttr ${fnName}for ${eleName}:${name}recd attr:${attr}`)
			debug(`__.GetStringAttr ${fnName} for ${eleName}:${name}:found attr:${attr}.`)
			return attr
		}
		// check lower case ifnot found
		attr=ele.getAttribute((prefix+name).toLowerCase())
		if(attr){
			// debug(ele,prefix+name,`__.GetStringAttr ${fnName}for ${eleName}:${name}recd attr:${attr}`)
			debug(`__.GetStringAttr ${fnName} for ${eleName}:${name}:found attr:${attr}.`)
			return attr
		}
	}
	// if(!name.toLowerCase().endsWith('writedatapath'))
	//	debug(`__.GetStringAttr ${fnName} for ${eleName}:${name}:found no attr.`)
	return ''
}

__.GetIntAttr=(ele,name,fnName,eleName)=>{
	const attr=__.GetStringAttr(ele,name,fnName,eleName)
	if(attr){
		const int=parseInt(attr)
		if(!isNaN(int)){
			debug(`__.GetIntAttr ${fnName} for ${eleName}:${name}:found int:${int}.`)
			return int
		}
	}
	debug(`__.GetIntAttr ${fnName} for ${eleName}:${name}:found no int.`)
	return 0
}

__.triggerChangeEvent=(element)=>element.dispatchEvent(new Event('change', {bubbles: true}))

__.handleInputChange=(el)=>__.triggerChangeEvent(el.target)

__.attachInputListeners=()=>document.querySelectorAll(
	'input,textarea,select,[contenteditable]').forEach((el) => {
		el.addEventListener('input',__.handleInputChange)
})

__.removeInputListeners=(removedNode)=>{
	if (
		removedNode.nodeType === Node.ELEMENT_NODE &&
		(removedNode.matches('input, textarea, select') ||
			removedNode.hasAttribute('contenteditable'))
	) {
		removedNode.removeEventListener('input', __.handleInputChange);
	}
	if (removedNode && removedNode.nodeType === Node.ELEMENT_NODE) {
		removedNode.querySelectorAll('input, textarea, select, [contenteditable]').forEach((element) => {
			element.removeEventListener('input', __.handleInputChange);
		})
	}
}

__.Binding=(()=>{
	const bound={}
	return{
		on:(els,name,f)=>{
			for(const el of els){
				if(!bound[el])bound[el]={}
				if(!bound[el][name])bound[el][name]=[]
				bound[el][name].push(f)
				el.addEventListener(name,f)}},
		off:(els,name)=>{
			for(const el of els){
				if(bound[el] && bound[el][name]){
					for(const f of bound[el][name]){
						el.removeEventListener(name,f)}}}}}
})()

__.Popstart=()=>{
	for(let i=0;i<__.config.BoundEventNames.length;i++){
		var eventname=__.config.BoundEventNames[i]
		__.config.AttrPrefixes.map(
			(prefix)=>{
				let selector="[" + prefix + eventname + "]"
				let els=__.el(selector)
				__.Binding.off(els,eventname)
				if(__.config.DebounceTimes[eventname])
					__.Binding.on(els,eventname, 
						__.debounce(__.PopEvent, __.config.DebounceTimes[eventname])
					)
				else
					__.Binding.on(els,eventname,__.PopEvent)
			})}}

__.functionFinder=(path,arr)=>{
	// find the actual function to call(in window)
	let obj=window
	while(arr.length &&(obj=obj[arr.shift()])){}
	return obj||window[path]
}

__.functionParser=(functionName,arr)=>{
		// debug("__.functionParser",functionName,arr)
		// handle function names with numbers at the end
		let idx=functionName.match(/\d+$/)
		let Suffix=''
		if(idx){
			functionName=functionName.substring(0,functionName.length - idx[0].length - 1)
			// remove the number from the end of the function name in arr
			arr[arr.length-1]=functionName
			idx=parseInt(idx[0])
			Suffix=`-${idx}`
		}
		// debug("__.functionParser",functionName,Suffix)
		return [functionName,Suffix]
}

__.GetElementName=(el)=>{
	let elName=el.tagName.toLowerCase()
	if(el.classList.length){
		elName+="."+el.classList[el.classList.length-1]
	}
	return elName
}

__.CheckAndStop=(ev, el, elName)=>{
	let stopHere=(ev)=>{
		danger(`__.CheckAndStop: ${elName} ${ev.type} stopped.`)
		if(typeof ev.preventDefault==='function')ev.preventDefault()
		else danger(`__.CheckAndStop: ${elName} ${ev.type} could not prevent default.`)
		if(typeof ev.stopPropagation==='function')ev.stopPropagation()
		else danger(`__.CheckAndStop: ${elName} ${ev.type} could not stop propagation.`)
	}
	if(__.config.AlwaysPreventDefault)stopHere(ev)
	if(__.config.AlwaysPreventFormSubmission&&ev.type=="submit")stopHere(ev)
	if(__.config.AlwaysPreventClickPropagation&&ev.type=="click")stopHere(ev)
	let s=__.GetStringAttr(el,ev.type+"-prevent-default","N/A",elName)
	if(s&&s.toLowerCase()[0]==='t')stopHere(ev)
	if(__.config.StopPropagationEventNames.includes(ev.type))stopHere(ev)
}

__.PopEvent=function(ev){

	// do not replace with arrow function because `this` is needed
	// PopEvent is actually called with a single argument, the event.
	// `this` is passed in as the element, which is then used to
	// find the function name(s) to call.  The function name(s) are then
	// looked up in the window object and a promise is created for each
	// with that function name as the 'funcPath'.  The promise is then added
	// to the promises array.  The promises array is then passed to
	// Promise.all which will resolve when all promises are resolved.  The
	// promises are resolved by calling the function with the event as the
	// first argument, and the element as the second argument.  The
	// function is called with the element as the 'this' context.

	let el=this
	if(!el)el=window
	let promises=[]
	let fn=el.getAttribute(ev.type)
	if(!fn || fn===""){
		return
	}
	let elName=__.GetElementName(el)
	__.config.AttrPrefixes.map((prefix)=>{if(!fn)fn=el.getAttribute(prefix + ev.type)})
	__.state.lastOp={ev:ev,this:el}
	if(!fn){
		debug("No",ev.type,"is configured for",elName)
		return
	}

	__.CheckAndStop(ev, el, elName)

	let promiseLoader=(funcPath)=>{
		let createPromise=()=>{
			return new Promise((resolve,reject)=>{

				let idx,Suffix,functionName,arr,path
				Section(`From event ${ev.type} on ${elName}, calling function ${funcPath} now..`)

				path=funcPath.trim()
				arr=path.split(".")
				if(arr.length==0){
					debug("No function name provided for",funcPath)
					return
				}
				// the functionName is the actual functionName,
				// without the container object(s)
				functionName=arr[arr.length-1]
				info("functionName",functionName,arr)

				// handle function names with numbers at the end
				let t=__.functionParser(functionName,arr)
				functionName=t[0]
				Suffix=t[1]

				// find the actual function to call(in window)
				let f=__.functionFinder(path,arr)
				if(!f){
					warn("Function",path,"doesn't exist")
					return
				}

				// get list of and prepare arguments for the func
				let args=[]
				__.getArgs(f).map((arg)=>{
					// debug("arg",arg)
					let attr=__.GetStringAttr(el,
						`${functionName}-${arg}${Suffix}`,functionName,elName)
					if(attr){args.push(attr);return}
					else if(arg==='msg')args.push(em)
					else if(arg==='message')args.push(em)
					else if(__.config.errorNameArgs.indexOf(arg)>-1)args.push(em)
					else if(__.config.eventNameArgs.indexOf(arg)>-1)args.push(ev)
					else if(__.config.elementNameArgs.indexOf(arg)>-1)args.push(ev)
					// we have no argument available,so push undefined
					warn(`No arg ${functionName}-${arg} on ${elName}`)
					args.push(undefined)
				})

				debug(`${elName}:${functionName}(${args})`)

				let dataPath=__.GetStringAttr(el,
					`${functionName}-writedatapath${Suffix}`,functionName,elName)

				// call it(whether promise or function)
				let possiblePromise=f.apply(el,[...args])
				if(possiblePromise && typeof possiblePromise.then==='function'){

					// this is a promise:
					possiblePromise.then((d)=>{
						if(d){
							// debug(path,d)
							__.state.lastOp.last=d
							__.data[path]=d
							if(dataPath!=="")__.data[dataPath]=d
						}
						resolve(args)

					}).catch((err)=>{

						warn("Unable to execute",path + ":",err)

						// check for a specific functionName err handler
						let ehName=__.GetStringAttr(el,
							`${functionName}-error${Suffix}`,functionName,elName)
						// check for an element err handler
						if(ehName===''){
							ehName=__.GetStringAttr(el,`error`,functionName,elName)
						}

						// fallback to default err handler
						if(ehName=='') ehName="__.error"
						else warn("Default error handler:",ehName)

						// determine ifthe err handler's name has a suffix
						// and extract it(separate it out)using functionParser
						let u=__.functionParser(ehName,ehName.split("."))
						ehName=u[0]
						let ehIdxSuffix=u[1]
						let ehNameLastPart=ehName.split(".").pop()

						warn("Error handler:",ehName)

						// retrieve the err handler func
						let eh=__.functionFinder(ehName,ehName.split("."))
						if(!eh){
							warn("Error Function",ehName,"doesn't exist")
							return
						}

						// parse error response
						const em=__.parseErrorResponse(err)
						info("PARSED ERROR RESPONSE",em)

						// get list of and prepare arguments for the err handler func
						let ehArgs=[]
						__.getArgs(eh).map((arg)=>{
							debug(`Parsing ${ehName}-${arg}${ehIdxSuffix}`)
							let attr=__.GetStringAttr(el,
								`${ehNameLastPart}-${arg}${ehIdxSuffix}`,
									ehNameLastPart,elName)
							if(attr)ehArgs.push(attr)
							else if(em!==""&&arg==='err')ehArgs.push(em)
							else if(em!==""&&arg==='e')ehArgs.push(em)
							else if(em!==""&&arg==='msg')ehArgs.push(em)
							else if(em!==""&&arg==='message')ehArgs.push(em)
							else if(__.config.errorNameArgs.indexOf(arg)>-1)ehArgs.push(em)
							else if(__.config.eventNameArgs.indexOf(arg)>-1)ehArgs.push(ev)
							else if(__.config.elementNameArgs.indexOf(arg)>-1)ehArgs.push(ev)
						})

						// call the err handler
						debug(`${elName}${ehName}(${ehArgs})`)

						// call it(whether promise or function)
						let errPossiblePromise=eh.apply(el,[...ehArgs])
						if(errPossiblePromise && typeof errPossiblePromise.then==='function'){
							errPossiblePromise.then((d)=>{
								if(d){
									debug(ehName,d)
									__.state.lastOp.last=d
									__.data[ehName]=d
									if(dataPath!=="")__.data[dataPath]=d
								}
								resolve(args)
							}).catch((err)=>{
								possiblePromise.catch((err)=>eh(err))
								warn("Unable to execute",ehName + ":",err)
							})
						}

					})

				}else{

					// NOT a promise
					if(possiblePromise){
						__.state.lastOp.last=possiblePromise
						__.data[path]=possiblePromise
						if(dataPath!=="")__.data[dataPath]=possiblePromise
					}
					resolve(args)
				}
			})
		}
		promises.push(createPromise)
	}

	// we allow for multiple functions to be specified via comma or
	// whitespace delimiting,along with comments
	//
	// remove /* ... */ from function name(s):
	const fns=fn.replace(/\/\*[\s\S]*?\*\//g,'')
		// if# or // are found,remove from there to the end of the newline
		.replace(/(\/\/|#).*$/gm,'')
		// remove whitespace also.
		// finally,split on whitespace and commas and
		// execute promiseLoader
		// on each function name in the list
		.trim().split(/[\t\n,]+/)

	Section(`Event "${ev.type}" on ${elName}; calling functions (in order):\n` +
		fns.map((fn,idx)=>`\t\t${idx+1}. ${fn}`).join("\n"))

	fns.map(promiseLoader)

	// if any promise is rejected,then the entire chain stops, by design!
	promises.reduce((prev,cur)=>prev.then((result)=>cur(result)),Promise.resolve([]))

	info("Returning promises",promises.length,promises)

	return promises
}

// detect dom changes and call Popstart and removeInputListeners
__.DOMWatcher = {
    MyObserver: new MutationObserver(__.debounce(__.Popstart, __.config.DebounceTimes["DOMWatcher.MyObserver"])),
	isRunning: false,
	RemovalObserver: new MutationObserver((records) => {
		for (const record of records) {
			for (const removedNode of record.removedNodes) {
				__.removeInputListeners(removedNode);
			}
		}
	}),
	start:()=> {
		if (!__.DOMWatcher.isRunning){
			__.DOMWatcher.MyObserver.observe(document.body,{childList:true,subtree:true})
			__.DOMWatcher.RemovalObserver.observe(document.body,{childList:true,subtree:true})
			__.DOMWatcher.isRunning=true
			// Call the new function to attach input listeners
			__.attachInputListeners()
		}
	},
	stop:()=>{
		if (__.DOMWatcher.isRunning) {
			__.DOMWatcher.MyObserver.disconnect()
			__.DOMWatcher.RemovalObserver.disconnect()
			__.DOMWatcher.isRunning = false
		}
	},
}



// Startup loads the actual functions that are called by the event handlers.
__.Startup=()=>{

	// Launch immediately
	__.Popstart()

	// also launch on popstate
	// https://developer.mozilla.org/en-US/docs/Web/API/Window/popstate_event
	window.addEventListener("popstate",__.Popstart)

	// or on hashchange
	// https://developer.mozilla.org/en-US/docs/Web/API/WindowEventHandlers/onhashchange
	window.addEventListener("hashchange",__.Popstart)

	// when 'startup' is specified on an element, call those functions
	__.DOMWatcher.stop()
	let startupPromises=[]
	let failureFunctions=[]
	document.querySelectorAll("[startup]").forEach((item)=>{
		let el=item
		let startupFunction=()=>__.PopEvent.call(el,{type:"startup"})
		startupPromises.push(startupFunction())
		let failureFunctionName=el.getAttribute("startup-failure")
		if(failureFunctionName){
			let failureFunction=__.defaultErrorHandler
			if(failureFunction){
				failureFunctions.push(()=>failureFunction.call(el,{type:"startup-failure"}))
			}
		}
	})

	// call allSettled on the startup promises:
	// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/allSettled
	// This is the most modern item that we use, so a polyfill is STRONGLY
	// recommended to support browsers before 2020:
	// https://cdnjs.com/libraries/promise-polyfill
	return Promise.allSettled(startupPromises)
	.then((results)=>{
		let successfulResults=results.filter(
			(result)=>result.status==="fulfilled"
		)
		let failedResults=results.filter(
			(result)=>result.status==="rejected"
		)
		if(failedResults.length>0){
			error(failedResults)
			let failurePromises=[]
			failureFunctions.forEach((failureFunction)=>{
				failurePromises.push(failureFunction())
			})
			return Promise.allSettled(failurePromises).then(()=>{
				__.DOMWatcher.start()
			})
		}
		__.DOMWatcher.start()
		return successfulResults
	})
	.catch((e)=>{
		warn("Popstart startup failed:")
		error(e)
		__.error(e)
		__.DOMWatcher.start()
	})

}

// Startup (after DOM content loaded)
document.addEventListener('DOMContentLoaded',
	()=>__.Startup()
	.then((result)=>info("Popstart Startup complete")))
