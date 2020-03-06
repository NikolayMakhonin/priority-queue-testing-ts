!function(){
var ceil=Math.ceil,floor=Math.floor,toInteger=function(argument){
return isNaN(argument=+argument)?0:(argument>0?floor:ceil)(argument)
},requireObjectCoercible=function(it){
if(null==it)throw TypeError("Can't call method on "+it)
;return it
},createMethod=function(CONVERT_TO_STRING){
return function($this,pos){
var first,second,S=String(requireObjectCoercible($this)),position=toInteger(pos),size=S.length
;return position<0||position>=size?CONVERT_TO_STRING?"":void 0:(first=S.charCodeAt(position))<55296||first>56319||position+1===size||(second=S.charCodeAt(position+1))<56320||second>57343?CONVERT_TO_STRING?S.charAt(position):first:CONVERT_TO_STRING?S.slice(position,position+2):second-56320+(first-55296<<10)+65536
}},stringMultibyte={codeAt:createMethod(!1),
charAt:createMethod(!0)
},commonjsGlobal="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{}
;function createCommonjsModule(fn,module){
return fn(module={exports:{}
},module.exports),module.exports}
var check=function(it){
return it&&it.Math==Math&&it
},global_1=check("object"==typeof globalThis&&globalThis)||check("object"==typeof window&&window)||check("object"==typeof self&&self)||check("object"==typeof commonjsGlobal&&commonjsGlobal)||Function("return this")(),fails=function(exec){
try{return!!exec()}catch(error){return!0}
},descriptors=!fails((function(){
return 7!=Object.defineProperty({},1,{
get:function(){return 7}})[1]
})),isObject=function(it){
return"object"==typeof it?null!==it:"function"==typeof it
},document$1=global_1.document,EXISTS=isObject(document$1)&&isObject(document$1.createElement),documentCreateElement=function(it){
return EXISTS?document$1.createElement(it):{}
},ie8DomDefine=!descriptors&&!fails((function(){
return 7!=Object.defineProperty(documentCreateElement("div"),"a",{
get:function(){return 7}}).a
})),anObject=function(it){
if(!isObject(it))throw TypeError(String(it)+" is not an object")
;return it
},toPrimitive=function(input,PREFERRED_STRING){
if(!isObject(input))return input;var fn,val
;if(PREFERRED_STRING&&"function"==typeof(fn=input.toString)&&!isObject(val=fn.call(input)))return val
;if("function"==typeof(fn=input.valueOf)&&!isObject(val=fn.call(input)))return val
;if(!PREFERRED_STRING&&"function"==typeof(fn=input.toString)&&!isObject(val=fn.call(input)))return val
;throw TypeError("Can't convert object to primitive value")
},nativeDefineProperty=Object.defineProperty,objectDefineProperty={
f:descriptors?nativeDefineProperty:function(O,P,Attributes){
if(anObject(O),P=toPrimitive(P,!0),
anObject(Attributes),ie8DomDefine)try{
return nativeDefineProperty(O,P,Attributes)
}catch(error){}
if("get"in Attributes||"set"in Attributes)throw TypeError("Accessors not supported")
;return"value"in Attributes&&(O[P]=Attributes.value),
O}
},createPropertyDescriptor=function(bitmap,value){
return{enumerable:!(1&bitmap),
configurable:!(2&bitmap),writable:!(4&bitmap),
value:value}
},createNonEnumerableProperty=descriptors?function(object,key,value){
return objectDefineProperty.f(object,key,createPropertyDescriptor(1,value))
}:function(object,key,value){
return object[key]=value,object
},sharedStore=global_1["__core-js_shared__"]||function(key,value){
try{
createNonEnumerableProperty(global_1,key,value)
}catch(error){global_1[key]=value}return value
}("__core-js_shared__",{}),functionToString=Function.toString
;"function"!=typeof sharedStore.inspectSource&&(sharedStore.inspectSource=function(it){
return functionToString.call(it)})
;var set,get,has$1,inspectSource=sharedStore.inspectSource,WeakMap=global_1.WeakMap,nativeWeakMap="function"==typeof WeakMap&&/native code/.test(inspectSource(WeakMap)),hasOwnProperty={}.hasOwnProperty,has=function(it,key){
return hasOwnProperty.call(it,key)
},shared=createCommonjsModule((function(module){
(module.exports=function(key,value){
return sharedStore[key]||(sharedStore[key]=void 0!==value?value:{})
})("versions",[]).push({version:"3.6.4",
mode:"pure",
copyright:"© 2020 Denis Pushkarev (zloirock.ru)"})
})),id=0,postfix=Math.random(),uid=function(key){
return"Symbol("+String(void 0===key?"":key)+")_"+(++id+postfix).toString(36)
},keys=shared("keys"),sharedKey=function(key){
return keys[key]||(keys[key]=uid(key))
},hiddenKeys={},WeakMap$1=global_1.WeakMap
;if(nativeWeakMap){
var store$1=new WeakMap$1,wmget=store$1.get,wmhas=store$1.has,wmset=store$1.set
;set=function(it,metadata){
return wmset.call(store$1,it,metadata),metadata
},get=function(it){
return wmget.call(store$1,it)||{}
},has$1=function(it){return wmhas.call(store$1,it)
}}else{var STATE=sharedKey("state")
;hiddenKeys[STATE]=!0,set=function(it,metadata){
return createNonEnumerableProperty(it,STATE,metadata),
metadata},get=function(it){
return has(it,STATE)?it[STATE]:{}
},has$1=function(it){return has(it,STATE)}}
var IteratorPrototype,PrototypeOfArrayIteratorPrototype,arrayIterator,internalState={
set:set,get:get,has:has$1,enforce:function(it){
return has$1(it)?get(it):set(it,{})},
getterFor:function(TYPE){return function(it){
var state
;if(!isObject(it)||(state=get(it)).type!==TYPE)throw TypeError("Incompatible receiver, "+TYPE+" required")
;return state}}
},nativePropertyIsEnumerable={}.propertyIsEnumerable,getOwnPropertyDescriptor=Object.getOwnPropertyDescriptor,objectPropertyIsEnumerable={
f:getOwnPropertyDescriptor&&!nativePropertyIsEnumerable.call({
1:2},1)?function(V){
var descriptor=getOwnPropertyDescriptor(this,V)
;return!!descriptor&&descriptor.enumerable
}:nativePropertyIsEnumerable
},toString={}.toString,classofRaw=function(it){
return toString.call(it).slice(8,-1)
},split="".split,indexedObject=fails((function(){
return!Object("z").propertyIsEnumerable(0)
}))?function(it){
return"String"==classofRaw(it)?split.call(it,""):Object(it)
}:Object,toIndexedObject=function(it){
return indexedObject(requireObjectCoercible(it))
},nativeGetOwnPropertyDescriptor=Object.getOwnPropertyDescriptor,objectGetOwnPropertyDescriptor={
f:descriptors?nativeGetOwnPropertyDescriptor:function(O,P){
if(O=toIndexedObject(O),
P=toPrimitive(P,!0),ie8DomDefine)try{
return nativeGetOwnPropertyDescriptor(O,P)
}catch(error){}
if(has(O,P))return createPropertyDescriptor(!objectPropertyIsEnumerable.f.call(O,P),O[P])
}
},replacement=/#|\.prototype\./,isForced=function(feature,detection){
var value=data[normalize(feature)]
;return value==POLYFILL||value!=NATIVE&&("function"==typeof detection?fails(detection):!!detection)
},normalize=isForced.normalize=function(string){
return String(string).replace(replacement,".").toLowerCase()
},data=isForced.data={},NATIVE=isForced.NATIVE="N",POLYFILL=isForced.POLYFILL="P",isForced_1=isForced,path={},aFunction=function(it){
if("function"!=typeof it)throw TypeError(String(it)+" is not a function")
;return it
},functionBindContext=function(fn,that,length){
if(aFunction(fn),void 0===that)return fn
;switch(length){case 0:return function(){
return fn.call(that)};case 1:return function(a){
return fn.call(that,a)};case 2:
return function(a,b){return fn.call(that,a,b)}
;case 3:return function(a,b,c){
return fn.call(that,a,b,c)}}return function(){
return fn.apply(that,arguments)}
},getOwnPropertyDescriptor$1=objectGetOwnPropertyDescriptor.f,wrapConstructor=function(NativeConstructor){
var Wrapper=function(a,b,c){
if(this instanceof NativeConstructor){
switch(arguments.length){case 0:
return new NativeConstructor;case 1:
return new NativeConstructor(a);case 2:
return new NativeConstructor(a,b)}
return new NativeConstructor(a,b,c)}
return NativeConstructor.apply(this,arguments)}
;return Wrapper.prototype=NativeConstructor.prototype,
Wrapper},_export=function(options,source){
var USE_NATIVE,VIRTUAL_PROTOTYPE,key,sourceProperty,targetProperty,nativeProperty,resultProperty,descriptor,TARGET=options.target,GLOBAL=options.global,STATIC=options.stat,PROTO=options.proto,nativeSource=GLOBAL?global_1:STATIC?global_1[TARGET]:(global_1[TARGET]||{}).prototype,target=GLOBAL?path:path[TARGET]||(path[TARGET]={}),targetPrototype=target.prototype
;for(key in source)USE_NATIVE=!isForced_1(GLOBAL?key:TARGET+(STATIC?".":"#")+key,options.forced)&&nativeSource&&has(nativeSource,key),
targetProperty=target[key],
USE_NATIVE&&(nativeProperty=options.noTargetGet?(descriptor=getOwnPropertyDescriptor$1(nativeSource,key))&&descriptor.value:nativeSource[key]),
sourceProperty=USE_NATIVE&&nativeProperty?nativeProperty:source[key],
USE_NATIVE&&typeof targetProperty==typeof sourceProperty||(resultProperty=options.bind&&USE_NATIVE?functionBindContext(sourceProperty,global_1):options.wrap&&USE_NATIVE?wrapConstructor(sourceProperty):PROTO&&"function"==typeof sourceProperty?functionBindContext(Function.call,sourceProperty):sourceProperty,
(options.sham||sourceProperty&&sourceProperty.sham||targetProperty&&targetProperty.sham)&&createNonEnumerableProperty(resultProperty,"sham",!0),
target[key]=resultProperty,
PROTO&&(has(path,VIRTUAL_PROTOTYPE=TARGET+"Prototype")||createNonEnumerableProperty(path,VIRTUAL_PROTOTYPE,{}),
path[VIRTUAL_PROTOTYPE][key]=sourceProperty,
options.real&&targetPrototype&&!targetPrototype[key]&&createNonEnumerableProperty(targetPrototype,key,sourceProperty)))
},toObject=function(argument){
return Object(requireObjectCoercible(argument))
},correctPrototypeGetter=!fails((function(){
function F(){}
return F.prototype.constructor=null,Object.getPrototypeOf(new F)!==F.prototype
})),IE_PROTO=sharedKey("IE_PROTO"),ObjectPrototype=Object.prototype,objectGetPrototypeOf=correctPrototypeGetter?Object.getPrototypeOf:function(O){
return O=toObject(O),
has(O,IE_PROTO)?O[IE_PROTO]:"function"==typeof O.constructor&&O instanceof O.constructor?O.constructor.prototype:O instanceof Object?ObjectPrototype:null
},nativeSymbol=!!Object.getOwnPropertySymbols&&!fails((function(){
return!String(Symbol())
})),useSymbolAsUid=nativeSymbol&&!Symbol.sham&&"symbol"==typeof Symbol.iterator,WellKnownSymbolsStore=shared("wks"),Symbol$1=global_1.Symbol,createWellKnownSymbol=useSymbolAsUid?Symbol$1:Symbol$1&&Symbol$1.withoutSetter||uid,wellKnownSymbol=function(name){
return has(WellKnownSymbolsStore,name)||(nativeSymbol&&has(Symbol$1,name)?WellKnownSymbolsStore[name]=Symbol$1[name]:WellKnownSymbolsStore[name]=createWellKnownSymbol("Symbol."+name)),
WellKnownSymbolsStore[name]
},BUGGY_SAFARI_ITERATORS=(wellKnownSymbol("iterator"),
!1)
;[].keys&&("next"in(arrayIterator=[].keys())?(PrototypeOfArrayIteratorPrototype=objectGetPrototypeOf(objectGetPrototypeOf(arrayIterator)))!==Object.prototype&&(IteratorPrototype=PrototypeOfArrayIteratorPrototype):BUGGY_SAFARI_ITERATORS=!0),
null==IteratorPrototype&&(IteratorPrototype={})
;var activeXDocument,iteratorsCore={
IteratorPrototype:IteratorPrototype,
BUGGY_SAFARI_ITERATORS:BUGGY_SAFARI_ITERATORS
},min=Math.min,toLength=function(argument){
return argument>0?min(toInteger(argument),9007199254740991):0
},max=Math.max,min$1=Math.min,toAbsoluteIndex=function(index,length){
var integer=toInteger(index)
;return integer<0?max(integer+length,0):min$1(integer,length)
},createMethod$1=function(IS_INCLUDES){
return function($this,el,fromIndex){
var value,O=toIndexedObject($this),length=toLength(O.length),index=toAbsoluteIndex(fromIndex,length)
;if(IS_INCLUDES&&el!=el){
for(;length>index;)if((value=O[index++])!=value)return!0
}else for(;length>index;index++)if((IS_INCLUDES||index in O)&&O[index]===el)return IS_INCLUDES||index||0
;return!IS_INCLUDES&&-1}},arrayIncludes={
includes:createMethod$1(!0),
indexOf:createMethod$1(!1)
},indexOf=arrayIncludes.indexOf,objectKeysInternal=function(object,names){
var key,O=toIndexedObject(object),i=0,result=[]
;for(key in O)!has(hiddenKeys,key)&&has(O,key)&&result.push(key)
;for(;names.length>i;)has(O,key=names[i++])&&(~indexOf(result,key)||result.push(key))
;return result
},enumBugKeys=["constructor","hasOwnProperty","isPrototypeOf","propertyIsEnumerable","toLocaleString","toString","valueOf"],objectKeys=Object.keys||function(O){
return objectKeysInternal(O,enumBugKeys)
},objectDefineProperties=descriptors?Object.defineProperties:function(O,Properties){
anObject(O)
;for(var key,keys=objectKeys(Properties),length=keys.length,index=0;length>index;)objectDefineProperty.f(O,key=keys[index++],Properties[key])
;return O},aFunction$1=function(variable){
return"function"==typeof variable?variable:void 0
},getBuiltIn=function(namespace,method){
return arguments.length<2?aFunction$1(path[namespace])||aFunction$1(global_1[namespace]):path[namespace]&&path[namespace][method]||global_1[namespace]&&global_1[namespace][method]
},html=getBuiltIn("document","documentElement"),IE_PROTO$1=sharedKey("IE_PROTO"),EmptyConstructor=function(){},scriptTag=function(content){
return"<script>"+content+"<\/script>"
},NullProtoObject=function(){try{
activeXDocument=document.domain&&new ActiveXObject("htmlfile")
}catch(error){}var iframeDocument,iframe
;NullProtoObject=activeXDocument?function(activeXDocument){
activeXDocument.write(scriptTag("")),
activeXDocument.close()
;var temp=activeXDocument.parentWindow.Object
;return activeXDocument=null,temp
}(activeXDocument):((iframe=documentCreateElement("iframe")).style.display="none",
html.appendChild(iframe),
iframe.src=String("javascript:"),(iframeDocument=iframe.contentWindow.document).open(),
iframeDocument.write(scriptTag("document.F=Object")),
iframeDocument.close(),iframeDocument.F)
;for(var length=enumBugKeys.length;length--;)delete NullProtoObject.prototype[enumBugKeys[length]]
;return NullProtoObject()}
;hiddenKeys[IE_PROTO$1]=!0
;var objectCreate=Object.create||function(O,Properties){
var result
;return null!==O?(EmptyConstructor.prototype=anObject(O),result=new EmptyConstructor,
EmptyConstructor.prototype=null,
result[IE_PROTO$1]=O):result=NullProtoObject(),void 0===Properties?result:objectDefineProperties(result,Properties)
},test={};test[wellKnownSymbol("toStringTag")]="z"
;var toStringTagSupport="[object z]"===String(test),TO_STRING_TAG$1=wellKnownSymbol("toStringTag"),CORRECT_ARGUMENTS="Arguments"==classofRaw(function(){
return arguments
}()),classof=toStringTagSupport?classofRaw:function(it){
var O,tag,result
;return void 0===it?"Undefined":null===it?"Null":"string"==typeof(tag=function(it,key){
try{return it[key]}catch(error){}
}(O=Object(it),TO_STRING_TAG$1))?tag:CORRECT_ARGUMENTS?classofRaw(O):"Object"==(result=classofRaw(O))&&"function"==typeof O.callee?"Arguments":result
},objectToString=toStringTagSupport?{}.toString:function(){
return"[object "+classof(this)+"]"
},defineProperty=objectDefineProperty.f,TO_STRING_TAG$2=wellKnownSymbol("toStringTag"),setToStringTag=function(it,TAG,STATIC,SET_METHOD){
if(it){var target=STATIC?it:it.prototype
;has(target,TO_STRING_TAG$2)||defineProperty(target,TO_STRING_TAG$2,{
configurable:!0,value:TAG
}),SET_METHOD&&!toStringTagSupport&&createNonEnumerableProperty(target,"toString",objectToString)
}
},iterators={},IteratorPrototype$1=iteratorsCore.IteratorPrototype,returnThis=function(){
return this
},createIteratorConstructor=function(IteratorConstructor,NAME,next){
var TO_STRING_TAG=NAME+" Iterator"
;return IteratorConstructor.prototype=objectCreate(IteratorPrototype$1,{
next:createPropertyDescriptor(1,next)
}),setToStringTag(IteratorConstructor,TO_STRING_TAG,!1,!0),
iterators[TO_STRING_TAG]=returnThis,
IteratorConstructor
},objectSetPrototypeOf=Object.setPrototypeOf||("__proto__"in{}?function(){
var setter,CORRECT_SETTER=!1,test={};try{
(setter=Object.getOwnPropertyDescriptor(Object.prototype,"__proto__").set).call(test,[]),
CORRECT_SETTER=test instanceof Array
}catch(error){}return function(O,proto){
return anObject(O),function(it){
if(!isObject(it)&&null!==it)throw TypeError("Can't set "+String(it)+" as a prototype")
}(proto),
CORRECT_SETTER?setter.call(O,proto):O.__proto__=proto,O
}
}():void 0),redefine=function(target,key,value,options){
options&&options.enumerable?target[key]=value:createNonEnumerableProperty(target,key,value)
},IteratorPrototype$2=iteratorsCore.IteratorPrototype,BUGGY_SAFARI_ITERATORS$1=iteratorsCore.BUGGY_SAFARI_ITERATORS,ITERATOR$1=wellKnownSymbol("iterator"),returnThis$1=function(){
return this
},defineIterator=function(Iterable,NAME,IteratorConstructor,next,DEFAULT,IS_SET,FORCED){
createIteratorConstructor(IteratorConstructor,NAME,next)
;var CurrentIteratorPrototype,methods,KEY,getIterationMethod=function(KIND){
if(KIND===DEFAULT&&defaultIterator)return defaultIterator
;if(!BUGGY_SAFARI_ITERATORS$1&&KIND in IterablePrototype)return IterablePrototype[KIND]
;switch(KIND){case"keys":case"values":
case"entries":return function(){
return new IteratorConstructor(this,KIND)}}
return function(){
return new IteratorConstructor(this)}
},TO_STRING_TAG=NAME+" Iterator",INCORRECT_VALUES_NAME=!1,IterablePrototype=Iterable.prototype,nativeIterator=IterablePrototype[ITERATOR$1]||IterablePrototype["@@iterator"]||DEFAULT&&IterablePrototype[DEFAULT],defaultIterator=!BUGGY_SAFARI_ITERATORS$1&&nativeIterator||getIterationMethod(DEFAULT),anyNativeIterator="Array"==NAME&&IterablePrototype.entries||nativeIterator
;if(anyNativeIterator&&(CurrentIteratorPrototype=objectGetPrototypeOf(anyNativeIterator.call(new Iterable)),
IteratorPrototype$2!==Object.prototype&&CurrentIteratorPrototype.next&&(setToStringTag(CurrentIteratorPrototype,TO_STRING_TAG,!0,!0),
iterators[TO_STRING_TAG]=returnThis$1)),
"values"==DEFAULT&&nativeIterator&&"values"!==nativeIterator.name&&(INCORRECT_VALUES_NAME=!0,
defaultIterator=function(){
return nativeIterator.call(this)
}),FORCED&&IterablePrototype[ITERATOR$1]!==defaultIterator&&createNonEnumerableProperty(IterablePrototype,ITERATOR$1,defaultIterator),
iterators[NAME]=defaultIterator,
DEFAULT)if(methods={
values:getIterationMethod("values"),
keys:IS_SET?defaultIterator:getIterationMethod("keys"),
entries:getIterationMethod("entries")
},FORCED)for(KEY in methods)!BUGGY_SAFARI_ITERATORS$1&&!INCORRECT_VALUES_NAME&&KEY in IterablePrototype||redefine(IterablePrototype,KEY,methods[KEY]);else _export({
target:NAME,proto:!0,
forced:BUGGY_SAFARI_ITERATORS$1||INCORRECT_VALUES_NAME
},methods);return methods
},charAt=stringMultibyte.charAt,setInternalState=internalState.set,getInternalState=internalState.getterFor("String Iterator")
;defineIterator(String,"String",(function(iterated){
setInternalState(this,{type:"String Iterator",
string:String(iterated),index:0})}),(function(){
var point,state=getInternalState(this),string=state.string,index=state.index
;return index>=string.length?{value:void 0,done:!0
}:(point=charAt(string,index),
state.index+=point.length,{value:point,done:!1})
}))
;var callWithSafeIterationClosing=function(iterator,fn,value,ENTRIES){
try{
return ENTRIES?fn(anObject(value)[0],value[1]):fn(value)
}catch(error){var returnMethod=iterator.return
;throw void 0!==returnMethod&&anObject(returnMethod.call(iterator)),
error}
},ITERATOR$2=wellKnownSymbol("iterator"),ArrayPrototype=Array.prototype,isArrayIteratorMethod=function(it){
return void 0!==it&&(iterators.Array===it||ArrayPrototype[ITERATOR$2]===it)
},createProperty=function(object,key,value){
var propertyKey=toPrimitive(key)
;propertyKey in object?objectDefineProperty.f(object,propertyKey,createPropertyDescriptor(0,value)):object[propertyKey]=value
},ITERATOR$3=wellKnownSymbol("iterator"),getIteratorMethod=function(it){
if(null!=it)return it[ITERATOR$3]||it["@@iterator"]||iterators[classof(it)]
},ITERATOR$4=wellKnownSymbol("iterator"),SAFE_CLOSING=!1
;try{var called=0,iteratorWithReturn={
next:function(){return{done:!!called++}},
return:function(){SAFE_CLOSING=!0}}
;iteratorWithReturn[ITERATOR$4]=function(){
return this
},Array.from(iteratorWithReturn,(function(){
throw 2}))}catch(error){}
var checkCorrectnessOfIteration=function(exec,SKIP_CLOSING){
if(!SKIP_CLOSING&&!SAFE_CLOSING)return!1
;var ITERATION_SUPPORT=!1;try{var object={}
;object[ITERATOR$4]=function(){return{
next:function(){return{done:ITERATION_SUPPORT=!0}}
}},exec(object)}catch(error){}
return ITERATION_SUPPORT
},INCORRECT_ITERATION=!checkCorrectnessOfIteration((function(iterable){
Array.from(iterable)}));_export({target:"Array",
stat:!0,forced:INCORRECT_ITERATION},{
from:function(arrayLike){
var length,result,step,iterator,next,value,O=toObject(arrayLike),C="function"==typeof this?this:Array,argumentsLength=arguments.length,mapfn=argumentsLength>1?arguments[1]:void 0,mapping=void 0!==mapfn,iteratorMethod=getIteratorMethod(O),index=0
;if(mapping&&(mapfn=functionBindContext(mapfn,argumentsLength>2?arguments[2]:void 0,2)),
null==iteratorMethod||C==Array&&isArrayIteratorMethod(iteratorMethod))for(result=new C(length=toLength(O.length));length>index;index++)value=mapping?mapfn(O[index],index):O[index],
createProperty(result,index,value);else for(next=(iterator=iteratorMethod.call(O)).next,
result=new C;!(step=next.call(iterator)).done;index++)value=mapping?callWithSafeIterationClosing(iterator,mapfn,[step.value,index],!0):step.value,
createProperty(result,index,value)
;return result.length=index,result}})
;var from_1$2=path.Array.from,freezing=!fails((function(){
return Object.isExtensible(Object.preventExtensions({}))
})),internalMetadata=createCommonjsModule((function(module){
var defineProperty=objectDefineProperty.f,METADATA=uid("meta"),id=0,isExtensible=Object.isExtensible||function(){
return!0},setMetadata=function(it){
defineProperty(it,METADATA,{value:{
objectID:"O"+ ++id,weakData:{}}})
},meta=module.exports={REQUIRED:!1,
fastKey:function(it,create){
if(!isObject(it))return"symbol"==typeof it?it:("string"==typeof it?"S":"P")+it
;if(!has(it,METADATA)){
if(!isExtensible(it))return"F"
;if(!create)return"E";setMetadata(it)}
return it[METADATA].objectID},
getWeakData:function(it,create){
if(!has(it,METADATA)){
if(!isExtensible(it))return!0;if(!create)return!1
;setMetadata(it)}return it[METADATA].weakData},
onFreeze:function(it){
return freezing&&meta.REQUIRED&&isExtensible(it)&&!has(it,METADATA)&&setMetadata(it),
it}};hiddenKeys[METADATA]=!0
})),iterate_1=(internalMetadata.REQUIRED,internalMetadata.fastKey,
internalMetadata.getWeakData,
internalMetadata.onFreeze,createCommonjsModule((function(module){
var Result=function(stopped,result){
this.stopped=stopped,this.result=result}
;(module.exports=function(iterable,fn,that,AS_ENTRIES,IS_ITERATOR){
var iterator,iterFn,index,length,result,next,step,boundFunction=functionBindContext(fn,that,AS_ENTRIES?2:1)
;if(IS_ITERATOR)iterator=iterable;else{
if("function"!=typeof(iterFn=getIteratorMethod(iterable)))throw TypeError("Target is not iterable")
;if(isArrayIteratorMethod(iterFn)){
for(index=0,length=toLength(iterable.length);length>index;index++)if((result=AS_ENTRIES?boundFunction(anObject(step=iterable[index])[0],step[1]):boundFunction(iterable[index]))&&result instanceof Result)return result
;return new Result(!1)}
iterator=iterFn.call(iterable)}
for(next=iterator.next;!(step=next.call(iterator)).done;)if("object"==typeof(result=callWithSafeIterationClosing(iterator,boundFunction,step.value,AS_ENTRIES))&&result&&result instanceof Result)return result
;return new Result(!1)}).stop=function(result){
return new Result(!0,result)}
}))),anInstance=function(it,Constructor,name){
if(!(it instanceof Constructor))throw TypeError("Incorrect "+(name?name+" ":"")+"invocation")
;return it},isArray=Array.isArray||function(arg){
return"Array"==classofRaw(arg)
},SPECIES=wellKnownSymbol("species"),arraySpeciesCreate=function(originalArray,length){
var C
;return isArray(originalArray)&&("function"!=typeof(C=originalArray.constructor)||C!==Array&&!isArray(C.prototype)?isObject(C)&&null===(C=C[SPECIES])&&(C=void 0):C=void 0),
new(void 0===C?Array:C)(0===length?0:length)
},push=[].push,createMethod$2=function(TYPE){
var IS_MAP=1==TYPE,IS_FILTER=2==TYPE,IS_SOME=3==TYPE,IS_EVERY=4==TYPE,IS_FIND_INDEX=6==TYPE,NO_HOLES=5==TYPE||IS_FIND_INDEX
;return function($this,callbackfn,that,specificCreate){
for(var value,result,O=toObject($this),self=indexedObject(O),boundFunction=functionBindContext(callbackfn,that,3),length=toLength(self.length),index=0,create=specificCreate||arraySpeciesCreate,target=IS_MAP?create($this,length):IS_FILTER?create($this,0):void 0;length>index;index++)if((NO_HOLES||index in self)&&(result=boundFunction(value=self[index],index,O),
TYPE))if(IS_MAP)target[index]=result;else if(result)switch(TYPE){
case 3:return!0;case 5:return value;case 6:
return index;case 2:push.call(target,value)
}else if(IS_EVERY)return!1
;return IS_FIND_INDEX?-1:IS_SOME||IS_EVERY?IS_EVERY:target
}},arrayIteration={forEach:createMethod$2(0),
map:createMethod$2(1),filter:createMethod$2(2),
some:createMethod$2(3),every:createMethod$2(4),
find:createMethod$2(5),findIndex:createMethod$2(6)
},defineProperty$1=objectDefineProperty.f,forEach=arrayIteration.forEach,setInternalState$1=internalState.set,internalStateGetterFor=internalState.getterFor,redefineAll=function(target,src,options){
for(var key in src)options&&options.unsafe&&target[key]?target[key]=src[key]:redefine(target,key,src[key],options)
;return target
},SPECIES$1=wellKnownSymbol("species"),setSpecies=function(CONSTRUCTOR_NAME){
var Constructor=getBuiltIn(CONSTRUCTOR_NAME),defineProperty=objectDefineProperty.f
;descriptors&&Constructor&&!Constructor[SPECIES$1]&&defineProperty(Constructor,SPECIES$1,{
configurable:!0,get:function(){return this}})
},defineProperty$2=objectDefineProperty.f,fastKey=internalMetadata.fastKey,setInternalState$2=internalState.set,internalStateGetterFor$1=internalState.getterFor,setInternalState$3=(function(CONSTRUCTOR_NAME,wrapper,common){
var Constructor,IS_MAP=-1!==CONSTRUCTOR_NAME.indexOf("Map"),IS_WEAK=-1!==CONSTRUCTOR_NAME.indexOf("Weak"),ADDER=IS_MAP?"set":"add",NativeConstructor=global_1[CONSTRUCTOR_NAME],NativePrototype=NativeConstructor&&NativeConstructor.prototype,exported={}
;if(descriptors&&"function"==typeof NativeConstructor&&(IS_WEAK||NativePrototype.forEach&&!fails((function(){
(new NativeConstructor).entries().next()})))){
Constructor=wrapper((function(target,iterable){
setInternalState$1(anInstance(target,Constructor,CONSTRUCTOR_NAME),{
type:CONSTRUCTOR_NAME,
collection:new NativeConstructor
}),null!=iterable&&iterate_1(iterable,target[ADDER],target,IS_MAP)
}))
;var getInternalState=internalStateGetterFor(CONSTRUCTOR_NAME)
;forEach(["add","clear","delete","forEach","get","has","set","keys","values","entries"],(function(KEY){
var IS_ADDER="add"==KEY||"set"==KEY
;KEY in NativePrototype&&(!IS_WEAK||"clear"!=KEY)&&createNonEnumerableProperty(Constructor.prototype,KEY,(function(a,b){
var collection=getInternalState(this).collection
;if(!IS_ADDER&&IS_WEAK&&!isObject(a))return"get"==KEY&&void 0
;var result=collection[KEY](0===a?0:a,b)
;return IS_ADDER?this:result}))
})),IS_WEAK||defineProperty$1(Constructor.prototype,"size",{
configurable:!0,get:function(){
return getInternalState(this).collection.size}})
}else Constructor=common.getConstructor(wrapper,CONSTRUCTOR_NAME,IS_MAP,ADDER),
internalMetadata.REQUIRED=!0
;setToStringTag(Constructor,CONSTRUCTOR_NAME,!1,!0),
exported[CONSTRUCTOR_NAME]=Constructor,_export({
global:!0,forced:!0
},exported),IS_WEAK||common.setStrong(Constructor,CONSTRUCTOR_NAME,IS_MAP)
}("Map",(function(init){return function(){
return init(this,arguments.length?arguments[0]:void 0)
}}),{
getConstructor:function(wrapper,CONSTRUCTOR_NAME,IS_MAP,ADDER){
var C=wrapper((function(that,iterable){
anInstance(that,C,CONSTRUCTOR_NAME),setInternalState$2(that,{
type:CONSTRUCTOR_NAME,index:objectCreate(null),
first:void 0,last:void 0,size:0
}),descriptors||(that.size=0),null!=iterable&&iterate_1(iterable,that[ADDER],that,IS_MAP)
})),getInternalState=internalStateGetterFor$1(CONSTRUCTOR_NAME),define=function(that,key,value){
var previous,index,state=getInternalState(that),entry=getEntry(that,key)
;return entry?entry.value=value:(state.last=entry={
index:index=fastKey(key,!0),key:key,value:value,
previous:previous=state.last,next:void 0,
removed:!1
},state.first||(state.first=entry),previous&&(previous.next=entry),descriptors?state.size++:that.size++,
"F"!==index&&(state.index[index]=entry)),that
},getEntry=function(that,key){
var entry,state=getInternalState(that),index=fastKey(key)
;if("F"!==index)return state.index[index]
;for(entry=state.first;entry;entry=entry.next)if(entry.key==key)return entry
};return redefineAll(C.prototype,{
clear:function(){
for(var state=getInternalState(this),data=state.index,entry=state.first;entry;)entry.removed=!0,
entry.previous&&(entry.previous=entry.previous.next=void 0),
delete data[entry.index],entry=entry.next
;state.first=state.last=void 0,descriptors?state.size=0:this.size=0
},delete:function(key){
var state=getInternalState(this),entry=getEntry(this,key)
;if(entry){var next=entry.next,prev=entry.previous
;delete state.index[entry.index],
entry.removed=!0,prev&&(prev.next=next),next&&(next.previous=prev),
state.first==entry&&(state.first=next),
state.last==entry&&(state.last=prev),descriptors?state.size--:this.size--
}return!!entry},forEach:function(callbackfn){
for(var entry,state=getInternalState(this),boundFunction=functionBindContext(callbackfn,arguments.length>1?arguments[1]:void 0,3);entry=entry?entry.next:state.first;)for(boundFunction(entry.value,entry.key,this);entry&&entry.removed;)entry=entry.previous
},has:function(key){return!!getEntry(this,key)}
}),redefineAll(C.prototype,IS_MAP?{
get:function(key){var entry=getEntry(this,key)
;return entry&&entry.value},
set:function(key,value){
return define(this,0===key?0:key,value)}}:{
add:function(value){
return define(this,value=0===value?0:value,value)}
}),descriptors&&defineProperty$2(C.prototype,"size",{
get:function(){return getInternalState(this).size}
}),C},
setStrong:function(C,CONSTRUCTOR_NAME,IS_MAP){
var ITERATOR_NAME=CONSTRUCTOR_NAME+" Iterator",getInternalCollectionState=internalStateGetterFor$1(CONSTRUCTOR_NAME),getInternalIteratorState=internalStateGetterFor$1(ITERATOR_NAME)
;defineIterator(C,CONSTRUCTOR_NAME,(function(iterated,kind){
setInternalState$2(this,{type:ITERATOR_NAME,
target:iterated,
state:getInternalCollectionState(iterated),
kind:kind,last:void 0})}),(function(){
for(var state=getInternalIteratorState(this),kind=state.kind,entry=state.last;entry&&entry.removed;)entry=entry.previous
;return state.target&&(state.last=entry=entry?entry.next:state.state.first)?"keys"==kind?{
value:entry.key,done:!1}:"values"==kind?{
value:entry.value,done:!1}:{
value:[entry.key,entry.value],done:!1
}:(state.target=void 0,{value:void 0,done:!0})
}),IS_MAP?"entries":"values",!IS_MAP,!0),
setSpecies(CONSTRUCTOR_NAME)}
}),internalState.set),getInternalState$1=internalState.getterFor("Array Iterator")
;defineIterator(Array,"Array",(function(iterated,kind){
setInternalState$3(this,{type:"Array Iterator",
target:toIndexedObject(iterated),index:0,kind:kind
})}),(function(){
var state=getInternalState$1(this),target=state.target,kind=state.kind,index=state.index++
;return!target||index>=target.length?(state.target=void 0,
{value:void 0,done:!0}):"keys"==kind?{value:index,
done:!1}:"values"==kind?{value:target[index],
done:!1}:{value:[index,target[index]],done:!1}
}),"values");iterators.Arguments=iterators.Array
;var TO_STRING_TAG$3=wellKnownSymbol("toStringTag")
;for(var COLLECTION_NAME in{CSSRuleList:0,
CSSStyleDeclaration:0,CSSValueList:0,
ClientRectList:0,DOMRectList:0,DOMStringList:0,
DOMTokenList:1,DataTransferItemList:0,FileList:0,
HTMLAllCollection:0,HTMLCollection:0,
HTMLFormElement:0,HTMLSelectElement:0,MediaList:0,
MimeTypeArray:0,NamedNodeMap:0,NodeList:1,
PaintRequestList:0,Plugin:0,PluginArray:0,
SVGLengthList:0,SVGNumberList:0,SVGPathSegList:0,
SVGPointList:0,SVGStringList:0,SVGTransformList:0,
SourceBufferList:0,StyleSheetList:0,
TextTrackCueList:0,TextTrackList:0,TouchList:0}){
var Collection=global_1[COLLECTION_NAME],CollectionPrototype=Collection&&Collection.prototype
;CollectionPrototype&&classof(CollectionPrototype)!==TO_STRING_TAG$3&&createNonEnumerableProperty(CollectionPrototype,TO_STRING_TAG$3,COLLECTION_NAME),
iterators[COLLECTION_NAME]=iterators.Array}
var map$2=path.Map
;window.Map=map$2,window.Array.from=from_1$2,_export({
target:"Object",stat:!0,sham:!descriptors},{
create:objectCreate})
;var METHOD_NAME,Object$1=path.Object,create=function(P,D){
return Object$1.create(P,D)
},create$2=create,whitespaces="\t\n\v\f\r                　\u2028\u2029\ufeff",whitespace="["+whitespaces+"]",ltrim=RegExp("^"+whitespace+whitespace+"*"),rtrim=RegExp(whitespace+whitespace+"*$"),createMethod$3=function(TYPE){
return function($this){
var string=String(requireObjectCoercible($this))
;return 1&TYPE&&(string=string.replace(ltrim,"")),
2&TYPE&&(string=string.replace(rtrim,"")),string}
},stringTrim={start:createMethod$3(1),
end:createMethod$3(2),trim:createMethod$3(3)
},$trim=stringTrim.trim;_export({target:"String",
proto:!0,
forced:(METHOD_NAME="trim",fails((function(){
return!!whitespaces[METHOD_NAME]()||"​᠎"!="​᠎"[METHOD_NAME]()||whitespaces[METHOD_NAME].name!==METHOD_NAME
})))},{trim:function(){return $trim(this)}})
;var entryVirtual=function(CONSTRUCTOR){
return path[CONSTRUCTOR+"Prototype"]
},trim=entryVirtual("String").trim,StringPrototype=String.prototype,trim$2=function(it){
var own=it.trim
;return"string"==typeof it||it===StringPrototype||it instanceof String&&own===StringPrototype.trim?trim:own
},ITERATOR$5=wellKnownSymbol("iterator"),nativeUrl=!fails((function(){
var url=new URL("b?a=1&b=2&c=3","http://a"),searchParams=url.searchParams,result=""
;return url.pathname="c%20d",
searchParams.forEach((function(value,key){
searchParams.delete("b"),result+=key+value
})),!url.toJSON||!searchParams.sort||"http://a/c%20d?a=1&c=3"!==url.href||"3"!==searchParams.get("c")||"a=1"!==String(new URLSearchParams("?a=1"))||!searchParams[ITERATOR$5]||"a"!==new URL("https://a@b").username||"b"!==new URLSearchParams(new URLSearchParams("a=b")).get("a")||"xn--e1aybc"!==new URL("http://тест").host||"#%D0%B1"!==new URL("http://a#б").hash||"a1c3"!==result||"x"!==new URL("http://x",void 0).host
})),getIterator=function(it){
var iteratorMethod=getIteratorMethod(it)
;if("function"!=typeof iteratorMethod)throw TypeError(String(it)+" is not iterable")
;return anObject(iteratorMethod.call(it))
},$fetch=getBuiltIn("fetch"),Headers=getBuiltIn("Headers"),ITERATOR$6=wellKnownSymbol("iterator"),setInternalState$4=internalState.set,getInternalParamsState=internalState.getterFor("URLSearchParams"),getInternalIteratorState=internalState.getterFor("URLSearchParamsIterator"),plus=/\+/g,sequences=Array(4),percentSequence=function(bytes){
return sequences[bytes-1]||(sequences[bytes-1]=RegExp("((?:%[\\da-f]{2}){"+bytes+"})","gi"))
},percentDecode=function(sequence){try{
return decodeURIComponent(sequence)}catch(error){
return sequence}},deserialize=function(it){
var result=it.replace(plus," "),bytes=4;try{
return decodeURIComponent(result)}catch(error){
for(;bytes;)result=result.replace(percentSequence(bytes--),percentDecode)
;return result}},find=/[!'()~]|%20/g,replace={
"!":"%21","'":"%27","(":"%28",")":"%29","~":"%7E",
"%20":"+"},replacer=function(match){
return replace[match]},serialize=function(it){
return encodeURIComponent(it).replace(find,replacer)
},parseSearchParams=function(result,query){
if(query)for(var attribute,entry,attributes=query.split("&"),index=0;index<attributes.length;)(attribute=attributes[index++]).length&&(entry=attribute.split("="),
result.push({key:deserialize(entry.shift()),
value:deserialize(entry.join("="))}))
},updateSearchParams=function(query){
this.entries.length=0,parseSearchParams(this.entries,query)
},validateArgumentsLength=function(passed,required){
if(passed<required)throw TypeError("Not enough arguments")
},URLSearchParamsIterator=createIteratorConstructor((function(params,kind){
setInternalState$4(this,{
type:"URLSearchParamsIterator",
iterator:getIterator(getInternalParamsState(params).entries),
kind:kind})}),"Iterator",(function(){
var state=getInternalIteratorState(this),kind=state.kind,step=state.iterator.next(),entry=step.value
;return step.done||(step.value="keys"===kind?entry.key:"values"===kind?entry.value:[entry.key,entry.value]),
step})),URLSearchParamsConstructor=function(){
anInstance(this,URLSearchParamsConstructor,"URLSearchParams")
;var iteratorMethod,iterator,next,step,entryIterator,entryNext,first,second,key,init=arguments.length>0?arguments[0]:void 0,that=this,entries=[]
;if(setInternalState$4(that,{
type:"URLSearchParams",entries:entries,
updateURL:function(){},
updateSearchParams:updateSearchParams
}),void 0!==init)if(isObject(init))if("function"==typeof(iteratorMethod=getIteratorMethod(init)))for(next=(iterator=iteratorMethod.call(init)).next;!(step=next.call(iterator)).done;){
if((first=(entryNext=(entryIterator=getIterator(anObject(step.value))).next).call(entryIterator)).done||(second=entryNext.call(entryIterator)).done||!entryNext.call(entryIterator).done)throw TypeError("Expected sequence with length 2")
;entries.push({key:first.value+"",
value:second.value+""})
}else for(key in init)has(init,key)&&entries.push({
key:key,value:init[key]+""
});else parseSearchParams(entries,"string"==typeof init?"?"===init.charAt(0)?init.slice(1):init:init+"")
},URLSearchParamsPrototype=URLSearchParamsConstructor.prototype
;redefineAll(URLSearchParamsPrototype,{
append:function(name,value){
validateArgumentsLength(arguments.length,2)
;var state=getInternalParamsState(this)
;state.entries.push({key:name+"",value:value+""
}),state.updateURL()},delete:function(name){
validateArgumentsLength(arguments.length,1)
;for(var state=getInternalParamsState(this),entries=state.entries,key=name+"",index=0;index<entries.length;)entries[index].key===key?entries.splice(index,1):index++
;state.updateURL()},get:function(name){
validateArgumentsLength(arguments.length,1)
;for(var entries=getInternalParamsState(this).entries,key=name+"",index=0;index<entries.length;index++)if(entries[index].key===key)return entries[index].value
;return null},getAll:function(name){
validateArgumentsLength(arguments.length,1)
;for(var entries=getInternalParamsState(this).entries,key=name+"",result=[],index=0;index<entries.length;index++)entries[index].key===key&&result.push(entries[index].value)
;return result},has:function(name){
validateArgumentsLength(arguments.length,1)
;for(var entries=getInternalParamsState(this).entries,key=name+"",index=0;index<entries.length;)if(entries[index++].key===key)return!0
;return!1},set:function(name,value){
validateArgumentsLength(arguments.length,1)
;for(var entry,state=getInternalParamsState(this),entries=state.entries,found=!1,key=name+"",val=value+"",index=0;index<entries.length;index++)(entry=entries[index]).key===key&&(found?entries.splice(index--,1):(found=!0,
entry.value=val));found||entries.push({key:key,
value:val}),state.updateURL()},sort:function(){
var entry,entriesIndex,sliceIndex,state=getInternalParamsState(this),entries=state.entries,slice=entries.slice()
;for(entries.length=0,
sliceIndex=0;sliceIndex<slice.length;sliceIndex++){
for(entry=slice[sliceIndex],entriesIndex=0;entriesIndex<sliceIndex;entriesIndex++)if(entries[entriesIndex].key>entry.key){
entries.splice(entriesIndex,0,entry);break}
entriesIndex===sliceIndex&&entries.push(entry)}
state.updateURL()},forEach:function(callback){
for(var entry,entries=getInternalParamsState(this).entries,boundFunction=functionBindContext(callback,arguments.length>1?arguments[1]:void 0,3),index=0;index<entries.length;)boundFunction((entry=entries[index++]).value,entry.key,this)
},keys:function(){
return new URLSearchParamsIterator(this,"keys")},
values:function(){
return new URLSearchParamsIterator(this,"values")
},entries:function(){
return new URLSearchParamsIterator(this,"entries")
}},{enumerable:!0
}),redefine(URLSearchParamsPrototype,ITERATOR$6,URLSearchParamsPrototype.entries),
redefine(URLSearchParamsPrototype,"toString",(function(){
for(var entry,entries=getInternalParamsState(this).entries,result=[],index=0;index<entries.length;)entry=entries[index++],
result.push(serialize(entry.key)+"="+serialize(entry.value))
;return result.join("&")}),{enumerable:!0
}),setToStringTag(URLSearchParamsConstructor,"URLSearchParams"),
_export({global:!0,forced:!nativeUrl},{
URLSearchParams:URLSearchParamsConstructor
}),nativeUrl||"function"!=typeof $fetch||"function"!=typeof Headers||_export({
global:!0,enumerable:!0,forced:!0},{
fetch:function(input){
var init,body,headers,args=[input]
;return arguments.length>1&&(init=arguments[1],
isObject(init)&&(body=init.body,"URLSearchParams"===classof(body)&&((headers=init.headers?new Headers(init.headers):new Headers).has("content-type")||headers.set("content-type","application/x-www-form-urlencoded;charset=UTF-8"),
init=objectCreate(init,{
body:createPropertyDescriptor(0,String(body)),
headers:createPropertyDescriptor(0,headers)
}))),args.push(init)),$fetch.apply(this,args)}})
;var match,version,urlSearchParams$2=path.URLSearchParams,engineUserAgent=getBuiltIn("navigator","userAgent")||"",process=global_1.process,versions=process&&process.versions,v8=versions&&versions.v8
;v8?version=(match=v8.split("."))[0]+match[1]:engineUserAgent&&(!(match=engineUserAgent.match(/Edge\/(\d+)/))||match[1]>=74)&&(match=engineUserAgent.match(/Chrome\/(\d+)/))&&(version=match[1])
;var engineV8Version=version&&+version,SPECIES$2=wellKnownSymbol("species"),arrayMethodHasSpeciesSupport=function(METHOD_NAME){
return engineV8Version>=51||!fails((function(){
var array=[]
;return(array.constructor={})[SPECIES$2]=function(){
return{foo:1}},1!==array[METHOD_NAME](Boolean).foo
}))
},defineProperty$3=Object.defineProperty,cache={},thrower=function(it){
throw it
},arrayMethodUsesToLength=function(METHOD_NAME,options){
if(has(cache,METHOD_NAME))return cache[METHOD_NAME]
;options||(options={})
;var method=[][METHOD_NAME],ACCESSORS=!!has(options,"ACCESSORS")&&options.ACCESSORS,argument0=has(options,0)?options[0]:thrower,argument1=has(options,1)?options[1]:void 0
;return cache[METHOD_NAME]=!!method&&!fails((function(){
if(ACCESSORS&&!descriptors)return!0;var O={
length:-1};ACCESSORS?defineProperty$3(O,1,{
enumerable:!0,get:thrower
}):O[1]=1,method.call(O,argument0,argument1)}))
},HAS_SPECIES_SUPPORT=arrayMethodHasSpeciesSupport("slice"),USES_TO_LENGTH=arrayMethodUsesToLength("slice",{
ACCESSORS:!0,0:0,1:2
}),SPECIES$3=wellKnownSymbol("species"),nativeSlice=[].slice,max$1=Math.max
;_export({target:"Array",proto:!0,
forced:!HAS_SPECIES_SUPPORT||!USES_TO_LENGTH},{
slice:function(start,end){
var Constructor,result,n,O=toIndexedObject(this),length=toLength(O.length),k=toAbsoluteIndex(start,length),fin=toAbsoluteIndex(void 0===end?length:end,length)
;if(isArray(O)&&("function"!=typeof(Constructor=O.constructor)||Constructor!==Array&&!isArray(Constructor.prototype)?isObject(Constructor)&&null===(Constructor=Constructor[SPECIES$3])&&(Constructor=void 0):Constructor=void 0,
Constructor===Array||void 0===Constructor))return nativeSlice.call(O,k,fin)
;for(result=new(void 0===Constructor?Array:Constructor)(max$1(fin-k,0)),
n=0;k<fin;k++,
n++)k in O&&createProperty(result,n,O[k])
;return result.length=n,result}})
;var defer,channel,port,slice=entryVirtual("Array").slice,ArrayPrototype$1=Array.prototype,slice$2=function(it){
var own=it.slice
;return it===ArrayPrototype$1||it instanceof Array&&own===ArrayPrototype$1.slice?slice:own
},nativePromiseConstructor=global_1.Promise,SPECIES$4=wellKnownSymbol("species"),speciesConstructor=function(O,defaultConstructor){
var S,C=anObject(O).constructor
;return void 0===C||null==(S=anObject(C)[SPECIES$4])?defaultConstructor:aFunction(S)
},engineIsIos=/(iphone|ipod|ipad).*applewebkit/i.test(engineUserAgent),location=global_1.location,set$1=global_1.setImmediate,clear=global_1.clearImmediate,process$1=global_1.process,MessageChannel=global_1.MessageChannel,Dispatch=global_1.Dispatch,counter=0,queue={},run=function(id){
if(queue.hasOwnProperty(id)){var fn=queue[id]
;delete queue[id],fn()}},runner=function(id){
return function(){run(id)}
},listener=function(event){run(event.data)
},post=function(id){
global_1.postMessage(id+"",location.protocol+"//"+location.host)
};set$1&&clear||(set$1=function(fn){
for(var args=[],i=1;arguments.length>i;)args.push(arguments[i++])
;return queue[++counter]=function(){
("function"==typeof fn?fn:Function(fn)).apply(void 0,args)
},defer(counter),counter},clear=function(id){
delete queue[id]
},"process"==classofRaw(process$1)?defer=function(id){
process$1.nextTick(runner(id))
}:Dispatch&&Dispatch.now?defer=function(id){
Dispatch.now(runner(id))
}:MessageChannel&&!engineIsIos?(port=(channel=new MessageChannel).port2,
channel.port1.onmessage=listener,
defer=functionBindContext(port.postMessage,port,1)):!global_1.addEventListener||"function"!=typeof postMessage||global_1.importScripts||fails(post)?defer="onreadystatechange"in documentCreateElement("script")?function(id){
html.appendChild(documentCreateElement("script")).onreadystatechange=function(){
html.removeChild(this),run(id)}}:function(id){
setTimeout(runner(id),0)
}:(defer=post,global_1.addEventListener("message",listener,!1)))
;var flush,head,last,notify,toggle,node,promise,then,task={
set:set$1,clear:clear
},getOwnPropertyDescriptor$2=objectGetOwnPropertyDescriptor.f,macrotask=task.set,MutationObserver=global_1.MutationObserver||global_1.WebKitMutationObserver,process$2=global_1.process,Promise=global_1.Promise,IS_NODE="process"==classofRaw(process$2),queueMicrotaskDescriptor=getOwnPropertyDescriptor$2(global_1,"queueMicrotask"),queueMicrotask=queueMicrotaskDescriptor&&queueMicrotaskDescriptor.value
;queueMicrotask||(flush=function(){var parent,fn
;for(IS_NODE&&(parent=process$2.domain)&&parent.exit();head;){
fn=head.fn,head=head.next;try{fn()}catch(error){
throw head?notify():last=void 0,error}}
last=void 0,parent&&parent.enter()
},IS_NODE?notify=function(){
process$2.nextTick(flush)
}:MutationObserver&&!engineIsIos?(toggle=!0,node=document.createTextNode(""),
new MutationObserver(flush).observe(node,{
characterData:!0}),notify=function(){
node.data=toggle=!toggle
}):Promise&&Promise.resolve?(promise=Promise.resolve(void 0),
then=promise.then,notify=function(){
then.call(promise,flush)}):notify=function(){
macrotask.call(global_1,flush)})
;var Internal,OwnPromiseCapability,PromiseWrapper,microtask=queueMicrotask||function(fn){
var task={fn:fn,next:void 0}
;last&&(last.next=task),head||(head=task,notify()),last=task
},PromiseCapability=function(C){var resolve,reject
;this.promise=new C((function($$resolve,$$reject){
if(void 0!==resolve||void 0!==reject)throw TypeError("Bad Promise constructor")
;resolve=$$resolve,reject=$$reject
})),this.resolve=aFunction(resolve),this.reject=aFunction(reject)
},newPromiseCapability={f:function(C){
return new PromiseCapability(C)}
},promiseResolve=function(C,x){
if(anObject(C),isObject(x)&&x.constructor===C)return x
;var promiseCapability=newPromiseCapability.f(C)
;return(0,promiseCapability.resolve)(x),
promiseCapability.promise},perform=function(exec){
try{return{error:!1,value:exec()}}catch(error){
return{error:!0,value:error}}
},task$1=task.set,SPECIES$5=wellKnownSymbol("species"),PROMISE="Promise",getInternalState$2=internalState.get,setInternalState$5=internalState.set,getInternalPromiseState=internalState.getterFor(PROMISE),PromiseConstructor=nativePromiseConstructor,TypeError$1=global_1.TypeError,document$2=global_1.document,process$3=global_1.process,newPromiseCapability$1=(getBuiltIn("fetch"),
newPromiseCapability.f),newGenericPromiseCapability=newPromiseCapability$1,IS_NODE$1="process"==classofRaw(process$3),DISPATCH_EVENT=!!(document$2&&document$2.createEvent&&global_1.dispatchEvent),FORCED=isForced_1(PROMISE,(function(){
if(!(inspectSource(PromiseConstructor)!==String(PromiseConstructor))){
if(66===engineV8Version)return!0
;if(!IS_NODE$1&&"function"!=typeof PromiseRejectionEvent)return!0
}if(!PromiseConstructor.prototype.finally)return!0
;if(engineV8Version>=51&&/native code/.test(PromiseConstructor))return!1
;var promise=PromiseConstructor.resolve(1),FakePromise=function(exec){
exec((function(){}),(function(){}))}
;return(promise.constructor={})[SPECIES$5]=FakePromise,
!(promise.then((function(){}))instanceof FakePromise)
})),INCORRECT_ITERATION$1=FORCED||!checkCorrectnessOfIteration((function(iterable){
PromiseConstructor.all(iterable).catch((function(){}))
})),isThenable=function(it){var then
;return!(!isObject(it)||"function"!=typeof(then=it.then))&&then
},notify$1=function(promise,state,isReject){
if(!state.notified){state.notified=!0
;var chain=state.reactions;microtask((function(){
for(var value=state.value,ok=1==state.state,index=0;chain.length>index;){
var result,then,exited,reaction=chain[index++],handler=ok?reaction.ok:reaction.fail,resolve=reaction.resolve,reject=reaction.reject,domain=reaction.domain
;try{
handler?(ok||(2===state.rejection&&onHandleUnhandled(promise,state),state.rejection=1),
!0===handler?result=value:(domain&&domain.enter(),
result=handler(value),domain&&(domain.exit(),
exited=!0)),result===reaction.promise?reject(TypeError$1("Promise-chain cycle")):(then=isThenable(result))?then.call(result,resolve,reject):resolve(result)):reject(value)
}catch(error){
domain&&!exited&&domain.exit(),reject(error)}}
state.reactions=[],state.notified=!1,
isReject&&!state.rejection&&onUnhandled(promise,state)
}))}},dispatchEvent=function(name,promise,reason){
var event,handler
;DISPATCH_EVENT?((event=document$2.createEvent("Event")).promise=promise,
event.reason=reason,
event.initEvent(name,!1,!0),global_1.dispatchEvent(event)):event={
promise:promise,reason:reason
},(handler=global_1["on"+name])?handler(event):"unhandledrejection"===name&&function(a,b){
var console=global_1.console
;console&&console.error&&(1===arguments.length?console.error(a):console.error(a,b))
}("Unhandled promise rejection",reason)
},onUnhandled=function(promise,state){
task$1.call(global_1,(function(){
var result,value=state.value
;if(isUnhandled(state)&&(result=perform((function(){
IS_NODE$1?process$3.emit("unhandledRejection",value,promise):dispatchEvent("unhandledrejection",promise,value)
})),
state.rejection=IS_NODE$1||isUnhandled(state)?2:1,result.error))throw result.value
}))},isUnhandled=function(state){
return 1!==state.rejection&&!state.parent
},onHandleUnhandled=function(promise,state){
task$1.call(global_1,(function(){
IS_NODE$1?process$3.emit("rejectionHandled",promise):dispatchEvent("rejectionhandled",promise,state.value)
}))},bind=function(fn,promise,state,unwrap){
return function(value){
fn(promise,state,value,unwrap)}
},internalReject=function(promise,state,value,unwrap){
state.done||(state.done=!0,
unwrap&&(state=unwrap),state.value=value,state.state=2,
notify$1(promise,state,!0))
},internalResolve=function(promise,state,value,unwrap){
if(!state.done){
state.done=!0,unwrap&&(state=unwrap);try{
if(promise===value)throw TypeError$1("Promise can't be resolved itself")
;var then=isThenable(value)
;then?microtask((function(){var wrapper={done:!1}
;try{
then.call(value,bind(internalResolve,promise,wrapper,state),bind(internalReject,promise,wrapper,state))
}catch(error){
internalReject(promise,wrapper,error,state)}
})):(state.value=value,state.state=1,
notify$1(promise,state,!1))}catch(error){
internalReject(promise,{done:!1},error,state)}}}
;FORCED&&(PromiseConstructor=function(executor){
anInstance(this,PromiseConstructor,PROMISE),
aFunction(executor),Internal.call(this)
;var state=getInternalState$2(this);try{
executor(bind(internalResolve,this,state),bind(internalReject,this,state))
}catch(error){internalReject(this,state,error)}
},(Internal=function(executor){
setInternalState$5(this,{type:PROMISE,done:!1,
notified:!1,parent:!1,reactions:[],rejection:!1,
state:0,value:void 0})
}).prototype=redefineAll(PromiseConstructor.prototype,{
then:function(onFulfilled,onRejected){
var state=getInternalPromiseState(this),reaction=newPromiseCapability$1(speciesConstructor(this,PromiseConstructor))
;return reaction.ok="function"!=typeof onFulfilled||onFulfilled,
reaction.fail="function"==typeof onRejected&&onRejected,
reaction.domain=IS_NODE$1?process$3.domain:void 0,
state.parent=!0,state.reactions.push(reaction),
0!=state.state&&notify$1(this,state,!1),
reaction.promise},catch:function(onRejected){
return this.then(void 0,onRejected)}
}),OwnPromiseCapability=function(){
var promise=new Internal,state=getInternalState$2(promise)
;this.promise=promise,
this.resolve=bind(internalResolve,promise,state),this.reject=bind(internalReject,promise,state)
},
newPromiseCapability.f=newPromiseCapability$1=function(C){
return C===PromiseConstructor||C===PromiseWrapper?new OwnPromiseCapability(C):newGenericPromiseCapability(C)
}),_export({global:!0,wrap:!0,forced:FORCED},{
Promise:PromiseConstructor
}),setToStringTag(PromiseConstructor,PROMISE,!1,!0),setSpecies(PROMISE),
PromiseWrapper=getBuiltIn(PROMISE),_export({
target:PROMISE,stat:!0,forced:FORCED},{
reject:function(r){
var capability=newPromiseCapability$1(this)
;return capability.reject.call(void 0,r),
capability.promise}}),_export({target:PROMISE,
stat:!0,forced:!0},{resolve:function(x){
return promiseResolve(this===PromiseWrapper?PromiseConstructor:this,x)
}}),_export({target:PROMISE,stat:!0,
forced:INCORRECT_ITERATION$1},{
all:function(iterable){
var C=this,capability=newPromiseCapability$1(C),resolve=capability.resolve,reject=capability.reject,result=perform((function(){
var $promiseResolve=aFunction(C.resolve),values=[],counter=0,remaining=1
;iterate_1(iterable,(function(promise){
var index=counter++,alreadyCalled=!1
;values.push(void 0),remaining++,$promiseResolve.call(C,promise).then((function(value){
alreadyCalled||(alreadyCalled=!0,
values[index]=value,--remaining||resolve(values))
}),reject)})),--remaining||resolve(values)}))
;return result.error&&reject(result.value),
capability.promise},race:function(iterable){
var C=this,capability=newPromiseCapability$1(C),reject=capability.reject,result=perform((function(){
var $promiseResolve=aFunction(C.resolve)
;iterate_1(iterable,(function(promise){
$promiseResolve.call(C,promise).then(capability.resolve,reject)
}))}))
;return result.error&&reject(result.value),capability.promise
}}),_export({target:"Promise",stat:!0},{
allSettled:function(iterable){
var C=this,capability=newPromiseCapability.f(C),resolve=capability.resolve,reject=capability.reject,result=perform((function(){
var promiseResolve=aFunction(C.resolve),values=[],counter=0,remaining=1
;iterate_1(iterable,(function(promise){
var index=counter++,alreadyCalled=!1
;values.push(void 0),remaining++,promiseResolve.call(C,promise).then((function(value){
alreadyCalled||(alreadyCalled=!0,values[index]={
status:"fulfilled",value:value
},--remaining||resolve(values))}),(function(e){
alreadyCalled||(alreadyCalled=!0,values[index]={
status:"rejected",reason:e
},--remaining||resolve(values))}))
})),--remaining||resolve(values)}))
;return result.error&&reject(result.value),capability.promise
}})
;var NON_GENERIC=!!nativePromiseConstructor&&fails((function(){
nativePromiseConstructor.prototype.finally.call({
then:function(){}},(function(){}))}));_export({
target:"Promise",proto:!0,real:!0,
forced:NON_GENERIC},{finally:function(onFinally){
var C=speciesConstructor(this,getBuiltIn("Promise")),isFunction="function"==typeof onFinally
;return this.then(isFunction?function(x){
return promiseResolve(C,onFinally()).then((function(){
return x}))}:onFinally,isFunction?function(e){
return promiseResolve(C,onFinally()).then((function(){
throw e}))}:onFinally)}})
;var promise$3=path.Promise,entries$1=entryVirtual("Array").entries,ArrayPrototype$2=Array.prototype,DOMIterables={
DOMTokenList:!0,NodeList:!0
},entries$2=function(it){var own=it.entries
;return it===ArrayPrototype$2||it instanceof Array&&own===ArrayPrototype$2.entries||DOMIterables.hasOwnProperty(classof(it))?entries$1:own
},$map=arrayIteration.map,HAS_SPECIES_SUPPORT$1=arrayMethodHasSpeciesSupport("map"),USES_TO_LENGTH$1=arrayMethodUsesToLength("map")
;_export({target:"Array",proto:!0,
forced:!HAS_SPECIES_SUPPORT$1||!USES_TO_LENGTH$1
},{map:function(callbackfn){
return $map(this,callbackfn,arguments.length>1?arguments[1]:void 0)
}})
;var map$3=entryVirtual("Array").map,ArrayPrototype$3=Array.prototype,map$5=function(it){
var own=it.map
;return it===ArrayPrototype$3||it instanceof Array&&own===ArrayPrototype$3.map?map$3:own
},hiddenKeys$1=enumBugKeys.concat("length","prototype"),objectGetOwnPropertyNames={
f:Object.getOwnPropertyNames||function(O){
return objectKeysInternal(O,hiddenKeys$1)}
},nativeGetOwnPropertyNames=objectGetOwnPropertyNames.f,toString$1={}.toString,windowNames="object"==typeof window&&window&&Object.getOwnPropertyNames?Object.getOwnPropertyNames(window):[],objectGetOwnPropertyNamesExternal={
f:function(it){
return windowNames&&"[object Window]"==toString$1.call(it)?function(it){
try{return nativeGetOwnPropertyNames(it)
}catch(error){return windowNames.slice()}
}(it):nativeGetOwnPropertyNames(toIndexedObject(it))
}
},nativeGetOwnPropertyNames$1=objectGetOwnPropertyNamesExternal.f,FAILS_ON_PRIMITIVES=fails((function(){
return!Object.getOwnPropertyNames(1)}));_export({
target:"Object",stat:!0,forced:FAILS_ON_PRIMITIVES
},{getOwnPropertyNames:nativeGetOwnPropertyNames$1
})
;var Object$2=path.Object,getOwnPropertyNames$2=function(it){
return Object$2.getOwnPropertyNames(it)};_export({
target:"Array",stat:!0},{isArray:isArray})
;var isArray$3=path.Array.isArray,arrayMethodIsStrict=function(METHOD_NAME,argument){
var method=[][METHOD_NAME]
;return!!method&&fails((function(){
method.call(null,argument||function(){throw 1},1)
}))
},$forEach=arrayIteration.forEach,STRICT_METHOD=arrayMethodIsStrict("forEach"),USES_TO_LENGTH$2=arrayMethodUsesToLength("forEach"),arrayForEach=STRICT_METHOD&&USES_TO_LENGTH$2?[].forEach:function(callbackfn){
return $forEach(this,callbackfn,arguments.length>1?arguments[1]:void 0)
};_export({target:"Array",proto:!0,
forced:[].forEach!=arrayForEach},{
forEach:arrayForEach})
;var forEach$2=entryVirtual("Array").forEach,ArrayPrototype$4=Array.prototype,DOMIterables$1={
DOMTokenList:!0,NodeList:!0
},forEach$3=function(it){var own=it.forEach
;return it===ArrayPrototype$4||it instanceof Array&&own===ArrayPrototype$4.forEach||DOMIterables$1.hasOwnProperty(classof(it))?forEach$2:own
},wellKnownSymbolWrapped={f:wellKnownSymbol
},defineProperty$4=objectDefineProperty.f,defineWellKnownSymbol=function(NAME){
var Symbol=path.Symbol||(path.Symbol={})
;has(Symbol,NAME)||defineProperty$4(Symbol,NAME,{
value:wellKnownSymbolWrapped.f(NAME)})}
;defineWellKnownSymbol("iterator")
;var iterator=wellKnownSymbolWrapped.f("iterator"),iterator$2=iterator,$indexOf=arrayIncludes.indexOf,nativeIndexOf=[].indexOf,NEGATIVE_ZERO=!!nativeIndexOf&&1/[1].indexOf(1,-0)<0,STRICT_METHOD$1=arrayMethodIsStrict("indexOf"),USES_TO_LENGTH$3=arrayMethodUsesToLength("indexOf",{
ACCESSORS:!0,1:0});_export({target:"Array",
proto:!0,
forced:NEGATIVE_ZERO||!STRICT_METHOD$1||!USES_TO_LENGTH$3
},{indexOf:function(searchElement){
return NEGATIVE_ZERO?nativeIndexOf.apply(this,arguments)||0:$indexOf(this,searchElement,arguments.length>1?arguments[1]:void 0)
}})
;var indexOf$1=entryVirtual("Array").indexOf,ArrayPrototype$5=Array.prototype,indexOf$3=function(it){
var own=it.indexOf
;return it===ArrayPrototype$5||it instanceof Array&&own===ArrayPrototype$5.indexOf?indexOf$1:own
},IS_CONCAT_SPREADABLE=wellKnownSymbol("isConcatSpreadable"),IS_CONCAT_SPREADABLE_SUPPORT=engineV8Version>=51||!fails((function(){
var array=[]
;return array[IS_CONCAT_SPREADABLE]=!1,array.concat()[0]!==array
})),SPECIES_SUPPORT=arrayMethodHasSpeciesSupport("concat"),isConcatSpreadable=function(O){
if(!isObject(O))return!1
;var spreadable=O[IS_CONCAT_SPREADABLE]
;return void 0!==spreadable?!!spreadable:isArray(O)
};_export({target:"Array",proto:!0,
forced:!IS_CONCAT_SPREADABLE_SUPPORT||!SPECIES_SUPPORT
},{concat:function(arg){
var i,k,length,len,E,O=toObject(this),A=arraySpeciesCreate(O,0),n=0
;for(i=-1,length=arguments.length;i<length;i++)if(E=-1===i?O:arguments[i],
isConcatSpreadable(E)){
if(n+(len=toLength(E.length))>9007199254740991)throw TypeError("Maximum allowed index exceeded")
;for(k=0;k<len;k++,
n++)k in E&&createProperty(A,n,E[k])}else{
if(n>=9007199254740991)throw TypeError("Maximum allowed index exceeded")
;createProperty(A,n++,E)}return A.length=n,A}})
;var objectGetOwnPropertySymbols={
f:Object.getOwnPropertySymbols
},$forEach$1=arrayIteration.forEach,HIDDEN=sharedKey("hidden"),TO_PRIMITIVE=wellKnownSymbol("toPrimitive"),setInternalState$6=internalState.set,getInternalState$3=internalState.getterFor("Symbol"),ObjectPrototype$1=Object.prototype,$Symbol=global_1.Symbol,$stringify=getBuiltIn("JSON","stringify"),nativeGetOwnPropertyDescriptor$1=objectGetOwnPropertyDescriptor.f,nativeDefineProperty$1=objectDefineProperty.f,nativeGetOwnPropertyNames$2=objectGetOwnPropertyNamesExternal.f,nativePropertyIsEnumerable$1=objectPropertyIsEnumerable.f,AllSymbols=shared("symbols"),ObjectPrototypeSymbols=shared("op-symbols"),StringToSymbolRegistry=shared("string-to-symbol-registry"),SymbolToStringRegistry=shared("symbol-to-string-registry"),WellKnownSymbolsStore$1=shared("wks"),QObject=global_1.QObject,USE_SETTER=!QObject||!QObject.prototype||!QObject.prototype.findChild,setSymbolDescriptor=descriptors&&fails((function(){
return 7!=objectCreate(nativeDefineProperty$1({},"a",{
get:function(){
return nativeDefineProperty$1(this,"a",{value:7
}).a}})).a}))?function(O,P,Attributes){
var ObjectPrototypeDescriptor=nativeGetOwnPropertyDescriptor$1(ObjectPrototype$1,P)
;ObjectPrototypeDescriptor&&delete ObjectPrototype$1[P],
nativeDefineProperty$1(O,P,Attributes),
ObjectPrototypeDescriptor&&O!==ObjectPrototype$1&&nativeDefineProperty$1(ObjectPrototype$1,P,ObjectPrototypeDescriptor)
}:nativeDefineProperty$1,wrap=function(tag,description){
var symbol=AllSymbols[tag]=objectCreate($Symbol.prototype)
;return setInternalState$6(symbol,{type:"Symbol",
tag:tag,description:description
}),descriptors||(symbol.description=description),
symbol},isSymbol=useSymbolAsUid?function(it){
return"symbol"==typeof it}:function(it){
return Object(it)instanceof $Symbol
},$defineProperty=function(O,P,Attributes){
O===ObjectPrototype$1&&$defineProperty(ObjectPrototypeSymbols,P,Attributes),
anObject(O);var key=toPrimitive(P,!0)
;return anObject(Attributes),has(AllSymbols,key)?(Attributes.enumerable?(has(O,HIDDEN)&&O[HIDDEN][key]&&(O[HIDDEN][key]=!1),
Attributes=objectCreate(Attributes,{
enumerable:createPropertyDescriptor(0,!1)
})):(has(O,HIDDEN)||nativeDefineProperty$1(O,HIDDEN,createPropertyDescriptor(1,{})),
O[HIDDEN][key]=!0),
setSymbolDescriptor(O,key,Attributes)):nativeDefineProperty$1(O,key,Attributes)
},$defineProperties=function(O,Properties){
anObject(O)
;var properties=toIndexedObject(Properties),keys=objectKeys(properties).concat($getOwnPropertySymbols(properties))
;return $forEach$1(keys,(function(key){
descriptors&&!$propertyIsEnumerable.call(properties,key)||$defineProperty(O,key,properties[key])
})),O},$propertyIsEnumerable=function(V){
var P=toPrimitive(V,!0),enumerable=nativePropertyIsEnumerable$1.call(this,P)
;return!(this===ObjectPrototype$1&&has(AllSymbols,P)&&!has(ObjectPrototypeSymbols,P))&&(!(enumerable||!has(this,P)||!has(AllSymbols,P)||has(this,HIDDEN)&&this[HIDDEN][P])||enumerable)
},$getOwnPropertyDescriptor=function(O,P){
var it=toIndexedObject(O),key=toPrimitive(P,!0)
;if(it!==ObjectPrototype$1||!has(AllSymbols,key)||has(ObjectPrototypeSymbols,key)){
var descriptor=nativeGetOwnPropertyDescriptor$1(it,key)
;return!descriptor||!has(AllSymbols,key)||has(it,HIDDEN)&&it[HIDDEN][key]||(descriptor.enumerable=!0),
descriptor}},$getOwnPropertyNames=function(O){
var names=nativeGetOwnPropertyNames$2(toIndexedObject(O)),result=[]
;return $forEach$1(names,(function(key){
has(AllSymbols,key)||has(hiddenKeys,key)||result.push(key)
})),result},$getOwnPropertySymbols=function(O){
var IS_OBJECT_PROTOTYPE=O===ObjectPrototype$1,names=nativeGetOwnPropertyNames$2(IS_OBJECT_PROTOTYPE?ObjectPrototypeSymbols:toIndexedObject(O)),result=[]
;return $forEach$1(names,(function(key){
!has(AllSymbols,key)||IS_OBJECT_PROTOTYPE&&!has(ObjectPrototype$1,key)||result.push(AllSymbols[key])
})),result}
;if(nativeSymbol||(redefine(($Symbol=function(){
if(this instanceof $Symbol)throw TypeError("Symbol is not a constructor")
;var description=arguments.length&&void 0!==arguments[0]?String(arguments[0]):void 0,tag=uid(description),setter=function(value){
this===ObjectPrototype$1&&setter.call(ObjectPrototypeSymbols,value),
has(this,HIDDEN)&&has(this[HIDDEN],tag)&&(this[HIDDEN][tag]=!1),
setSymbolDescriptor(this,tag,createPropertyDescriptor(1,value))
}
;return descriptors&&USE_SETTER&&setSymbolDescriptor(ObjectPrototype$1,tag,{
configurable:!0,set:setter}),wrap(tag,description)
}).prototype,"toString",(function(){
return getInternalState$3(this).tag
})),redefine($Symbol,"withoutSetter",(function(description){
return wrap(uid(description),description)
})),objectPropertyIsEnumerable.f=$propertyIsEnumerable,
objectDefineProperty.f=$defineProperty,
objectGetOwnPropertyDescriptor.f=$getOwnPropertyDescriptor,
objectGetOwnPropertyNames.f=objectGetOwnPropertyNamesExternal.f=$getOwnPropertyNames,
objectGetOwnPropertySymbols.f=$getOwnPropertySymbols,
wellKnownSymbolWrapped.f=function(name){
return wrap(wellKnownSymbol(name),name)
},descriptors&&nativeDefineProperty$1($Symbol.prototype,"description",{
configurable:!0,get:function(){
return getInternalState$3(this).description}
})),_export({global:!0,wrap:!0,
forced:!nativeSymbol,sham:!nativeSymbol},{
Symbol:$Symbol
}),$forEach$1(objectKeys(WellKnownSymbolsStore$1),(function(name){
defineWellKnownSymbol(name)})),_export({
target:"Symbol",stat:!0,forced:!nativeSymbol},{
for:function(key){var string=String(key)
;if(has(StringToSymbolRegistry,string))return StringToSymbolRegistry[string]
;var symbol=$Symbol(string)
;return StringToSymbolRegistry[string]=symbol,SymbolToStringRegistry[symbol]=string,
symbol},keyFor:function(sym){
if(!isSymbol(sym))throw TypeError(sym+" is not a symbol")
;if(has(SymbolToStringRegistry,sym))return SymbolToStringRegistry[sym]
},useSetter:function(){USE_SETTER=!0},
useSimple:function(){USE_SETTER=!1}}),_export({
target:"Object",stat:!0,forced:!nativeSymbol,
sham:!descriptors},{create:function(O,Properties){
return void 0===Properties?objectCreate(O):$defineProperties(objectCreate(O),Properties)
},defineProperty:$defineProperty,
defineProperties:$defineProperties,
getOwnPropertyDescriptor:$getOwnPropertyDescriptor
}),_export({target:"Object",stat:!0,
forced:!nativeSymbol},{
getOwnPropertyNames:$getOwnPropertyNames,
getOwnPropertySymbols:$getOwnPropertySymbols
}),_export({target:"Object",stat:!0,
forced:fails((function(){
objectGetOwnPropertySymbols.f(1)}))},{
getOwnPropertySymbols:function(it){
return objectGetOwnPropertySymbols.f(toObject(it))
}}),$stringify){
var FORCED_JSON_STRINGIFY=!nativeSymbol||fails((function(){
var symbol=$Symbol()
;return"[null]"!=$stringify([symbol])||"{}"!=$stringify({
a:symbol})||"{}"!=$stringify(Object(symbol))}))
;_export({target:"JSON",stat:!0,
forced:FORCED_JSON_STRINGIFY},{
stringify:function(it,replacer,space){
for(var $replacer,args=[it],index=1;arguments.length>index;)args.push(arguments[index++])
;if($replacer=replacer,
(isObject(replacer)||void 0!==it)&&!isSymbol(it))return isArray(replacer)||(replacer=function(key,value){
if("function"==typeof $replacer&&(value=$replacer.call(this,key,value)),
!isSymbol(value))return value
}),args[1]=replacer,$stringify.apply(null,args)}})
}
$Symbol.prototype[TO_PRIMITIVE]||createNonEnumerableProperty($Symbol.prototype,TO_PRIMITIVE,$Symbol.prototype.valueOf),
setToStringTag($Symbol,"Symbol"),
hiddenKeys[HIDDEN]=!0,defineWellKnownSymbol("asyncIterator"),
defineWellKnownSymbol("hasInstance"),
defineWellKnownSymbol("isConcatSpreadable"),
defineWellKnownSymbol("match"),defineWellKnownSymbol("matchAll"),
defineWellKnownSymbol("replace"),
defineWellKnownSymbol("search"),defineWellKnownSymbol("species"),
defineWellKnownSymbol("split"),
defineWellKnownSymbol("toPrimitive"),defineWellKnownSymbol("toStringTag"),
defineWellKnownSymbol("unscopables"),
setToStringTag(Math,"Math",!0),setToStringTag(global_1.JSON,"JSON",!0)
;var symbol=path.Symbol,symbol$2=symbol
;!function(exports){if(!exports.fetch){
var support_searchParams="URLSearchParams"in self,support_iterable="Symbol"in self&&"iterator"in symbol$2,support_blob="FileReader"in self&&"Blob"in self&&function(){
try{return new Blob,!0}catch(e){return!1}
}(),support_formData="FormData"in self,support_arrayBuffer="ArrayBuffer"in self
;if(support_arrayBuffer)var viewClasses=["[object Int8Array]","[object Uint8Array]","[object Uint8ClampedArray]","[object Int16Array]","[object Uint16Array]","[object Int32Array]","[object Uint32Array]","[object Float32Array]","[object Float64Array]"],isArrayBufferView=ArrayBuffer.isView||function(obj){
return obj&&indexOf$3(viewClasses).call(viewClasses,Object.prototype.toString.call(obj))>-1
};Headers.prototype.append=function(name,value){
name=normalizeName(name),value=normalizeValue(value)
;var oldValue=map$5(this)[name]
;map$5(this)[name]=oldValue?oldValue+", "+value:value
},Headers.prototype.delete=function(name){
delete map$5(this)[normalizeName(name)]
},Headers.prototype.get=function(name){
return name=normalizeName(name),this.has(name)?map$5(this)[name]:null
},Headers.prototype.has=function(name){
return map$5(this).hasOwnProperty(normalizeName(name))
},Headers.prototype.set=function(name,value){
map$5(this)[normalizeName(name)]=normalizeValue(value)
},Headers.prototype.forEach=function(callback,thisArg){
for(var name in map$5(this))map$5(this).hasOwnProperty(name)&&callback.call(thisArg,map$5(this)[name],name,this)
},Headers.prototype.keys=function(){
var _context2,items=[]
;return forEach$3(_context2=this).call(_context2,(function(value,name){
items.push(name)})),iteratorFor(items)
},Headers.prototype.values=function(){
var _context3,items=[]
;return forEach$3(_context3=this).call(_context3,(function(value){
items.push(value)})),iteratorFor(items)
},Headers.prototype.entries=function(){
var _context4,items=[]
;return forEach$3(_context4=this).call(_context4,(function(value,name){
items.push([name,value])})),iteratorFor(items)
},support_iterable&&(Headers.prototype[iterator$2]=entries$2(Headers.prototype))
;var methods=["DELETE","GET","HEAD","OPTIONS","POST","PUT"]
;Request.prototype.clone=function(){
return new Request(this,{body:this._bodyInit})
},Body.call(Request.prototype),Body.call(Response.prototype),
Response.prototype.clone=function(){
return new Response(this._bodyInit,{
status:this.status,statusText:this.statusText,
headers:new Headers(this.headers),url:this.url})
},Response.error=function(){
var response=new Response(null,{status:0,
statusText:""})
;return response.type="error",response}
;var redirectStatuses=[301,302,303,307,308]
;Response.redirect=function(url,status){
if(-1===indexOf$3(redirectStatuses).call(redirectStatuses,status))throw new RangeError("Invalid status code")
;return new Response(null,{status:status,headers:{
location:url}})
},exports.DOMException=self.DOMException;try{
new exports.DOMException}catch(err){
exports.DOMException=function(message,name){
this.message=message,this.name=name
;var error=Error(message);this.stack=error.stack
},exports.DOMException.prototype=create$2(Error.prototype),
exports.DOMException.prototype.constructor=exports.DOMException
}
return fetch.polyfill=!0,self.fetch||(self.fetch=fetch,self.Headers=Headers,self.Request=Request,
self.Response=Response),
exports.Headers=Headers,exports.Request=Request,exports.Response=Response,
exports.fetch=fetch,exports}
function normalizeName(name){
if("string"!=typeof name&&(name=String(name)),/[^a-z0-9\-#$%&'*+.^_`|~]/i.test(name))throw new TypeError("Invalid character in header field name")
;return name.toLowerCase()}
function normalizeValue(value){
return"string"!=typeof value&&(value=String(value)),
value}function iteratorFor(items){var iterator={
next:function(){var value=items.shift();return{
done:void 0===value,value:value}}}
;return support_iterable&&(iterator[iterator$2]=function(){
return iterator}),iterator}
function Headers(headers){
if(this.map={},headers instanceof Headers)forEach$3(headers).call(headers,(function(value,name){
this.append(name,value)
}),this);else if(isArray$3(headers))forEach$3(headers).call(headers,(function(header){
this.append(header[0],header[1])
}),this);else if(headers){var _context
;forEach$3(_context=getOwnPropertyNames$2(headers)).call(_context,(function(name){
this.append(name,headers[name])}),this)}}
function consumed(body){
if(body.bodyUsed)return promise$3.reject(new TypeError("Already read"))
;body.bodyUsed=!0}
function fileReaderReady(reader){
return new promise$3((function(resolve,reject){
reader.onload=function(){resolve(reader.result)
},reader.onerror=function(){reject(reader.error)}
}))}function readBlobAsArrayBuffer(blob){
var reader=new FileReader,promise=fileReaderReady(reader)
;return reader.readAsArrayBuffer(blob),promise}
function bufferClone(buf){
if(slice$2(buf))return slice$2(buf).call(buf,0)
;var view=new Uint8Array(buf.byteLength)
;return view.set(new Uint8Array(buf)),view.buffer}
function Body(){
return this.bodyUsed=!1,this._initBody=function(body){
var obj
;this._bodyInit=body,body?"string"==typeof body?this._bodyText=body:support_blob&&Blob.prototype.isPrototypeOf(body)?this._bodyBlob=body:support_formData&&FormData.prototype.isPrototypeOf(body)?this._bodyFormData=body:support_searchParams&&urlSearchParams$2.prototype.isPrototypeOf(body)?this._bodyText=body.toString():support_arrayBuffer&&support_blob&&((obj=body)&&DataView.prototype.isPrototypeOf(obj))?(this._bodyArrayBuffer=bufferClone(body.buffer),
this._bodyInit=new Blob([this._bodyArrayBuffer])):support_arrayBuffer&&(ArrayBuffer.prototype.isPrototypeOf(body)||isArrayBufferView(body))?this._bodyArrayBuffer=bufferClone(body):this._bodyText=body=Object.prototype.toString.call(body):this._bodyText="",
this.headers.get("content-type")||("string"==typeof body?this.headers.set("content-type","text/plain;charset=UTF-8"):this._bodyBlob&&this._bodyBlob.type?this.headers.set("content-type",this._bodyBlob.type):support_searchParams&&urlSearchParams$2.prototype.isPrototypeOf(body)&&this.headers.set("content-type","application/x-www-form-urlencoded;charset=UTF-8"))
},support_blob&&(this.blob=function(){
var rejected=consumed(this)
;if(rejected)return rejected
;if(this._bodyBlob)return promise$3.resolve(this._bodyBlob)
;if(this._bodyArrayBuffer)return promise$3.resolve(new Blob([this._bodyArrayBuffer]))
;if(this._bodyFormData)throw new Error("could not read FormData body as blob")
;return promise$3.resolve(new Blob([this._bodyText]))
},this.arrayBuffer=function(){
return this._bodyArrayBuffer?consumed(this)||promise$3.resolve(this._bodyArrayBuffer):this.blob().then(readBlobAsArrayBuffer)
}),this.text=function(){
var rejected=consumed(this)
;if(rejected)return rejected
;if(this._bodyBlob)return function(blob){
var reader=new FileReader,promise=fileReaderReady(reader)
;return reader.readAsText(blob),promise
}(this._bodyBlob)
;if(this._bodyArrayBuffer)return promise$3.resolve(function(buf){
for(var view=new Uint8Array(buf),chars=new Array(view.length),i=0;i<view.length;i++)chars[i]=String.fromCharCode(view[i])
;return chars.join("")}(this._bodyArrayBuffer))
;if(this._bodyFormData)throw new Error("could not read FormData body as text")
;return promise$3.resolve(this._bodyText)
},support_formData&&(this.formData=function(){
return this.text().then(decode)
}),this.json=function(){
return this.text().then(JSON.parse)},this}
function Request(input,options){
var method,upcased,body=(options=options||{}).body
;if(input instanceof Request){
if(input.bodyUsed)throw new TypeError("Already read")
;this.url=input.url,this.credentials=input.credentials,
options.headers||(this.headers=new Headers(input.headers)),
this.method=input.method,
this.mode=input.mode,this.signal=input.signal,body||null==input._bodyInit||(body=input._bodyInit,
input.bodyUsed=!0)}else this.url=String(input)
;if(this.credentials=options.credentials||this.credentials||"same-origin",
!options.headers&&this.headers||(this.headers=new Headers(options.headers)),
this.method=(method=options.method||this.method||"GET",
upcased=method.toUpperCase(),
indexOf$3(methods).call(methods,upcased)>-1?upcased:method),
this.mode=options.mode||this.mode||null,
this.signal=options.signal||this.signal,
this.referrer=null,("GET"===this.method||"HEAD"===this.method)&&body)throw new TypeError("Body not allowed for GET or HEAD requests")
;this._initBody(body)}function decode(body){
var _context5,form=new FormData
;return forEach$3(_context5=trim$2(body).call(body).split("&")).call(_context5,(function(bytes){
if(bytes){
var split=bytes.split("="),name=split.shift().replace(/\+/g," "),value=split.join("=").replace(/\+/g," ")
;form.append(decodeURIComponent(name),decodeURIComponent(value))
}})),form}function Response(bodyInit,options){
options||(options={}),this.type="default",
this.status=void 0===options.status?200:options.status,
this.ok=this.status>=200&&this.status<300,
this.statusText="statusText"in options?options.statusText:"OK",
this.headers=new Headers(options.headers),
this.url=options.url||"",this._initBody(bodyInit)}
function fetch(input,init){
return new promise$3((function(resolve,reject){
var _context9,request=new Request(input,init)
;if(request.signal&&request.signal.aborted)return reject(new exports.DOMException("Aborted","AbortError"))
;var xhr=new XMLHttpRequest;function abortXhr(){
xhr.abort()}xhr.onload=function(){
var rawHeaders,_context6,headers,preProcessedHeaders,options={
status:xhr.status,statusText:xhr.statusText,
headers:(rawHeaders=xhr.getAllResponseHeaders()||"",
headers=new Headers,preProcessedHeaders=rawHeaders.replace(/\r?\n[\t ]+/g," "),
forEach$3(_context6=preProcessedHeaders.split(/\r?\n/)).call(_context6,(function(line){
var _context7,parts=line.split(":"),key=trim$2(_context7=parts.shift()).call(_context7)
;if(key){
var _context8,value=trim$2(_context8=parts.join(":")).call(_context8)
;headers.append(key,value)}})),headers)}
;options.url="responseURL"in xhr?xhr.responseURL:options.headers.get("X-Request-URL")
;var body="response"in xhr?xhr.response:xhr.responseText
;resolve(new Response(body,options))
},xhr.onerror=function(){
reject(new TypeError("Network request failed"))
},xhr.ontimeout=function(){
reject(new TypeError("Network request failed"))
},xhr.onabort=function(){
reject(new exports.DOMException("Aborted","AbortError"))
},xhr.open(request.method,request.url,!0),
"include"===request.credentials?xhr.withCredentials=!0:"omit"===request.credentials&&(xhr.withCredentials=!1),
"responseType"in xhr&&support_blob&&(xhr.responseType="blob"),
forEach$3(_context9=request.headers).call(_context9,(function(value,name){
xhr.setRequestHeader(name,value)
})),request.signal&&(request.signal.addEventListener("abort",abortXhr),
xhr.onreadystatechange=function(){
4===xhr.readyState&&request.signal.removeEventListener("abort",abortXhr)
}),xhr.send(void 0===request._bodyInit?null:request._bodyInit)
}))}}(window)
;var toStringTag$2=wellKnownSymbolWrapped.f("toStringTag"),iterator$4=iterator
;defineWellKnownSymbol("asyncDispose"),
defineWellKnownSymbol("dispose"),defineWellKnownSymbol("observable"),
defineWellKnownSymbol("patternMatch"),
defineWellKnownSymbol("replaceAll")
;var symbol$4=symbol;function _typeof(obj){
return(_typeof="function"==typeof symbol$4&&"symbol"==typeof iterator$4?function(obj){
return typeof obj}:function(obj){
return obj&&"function"==typeof symbol$4&&obj.constructor===symbol$4&&obj!==symbol$4.prototype?"symbol":typeof obj
})(obj)}function _assertThisInitialized(self){
if(void 0===self)throw new ReferenceError("this hasn't been initialised - super() hasn't been called")
;return self}
var FAILS_ON_PRIMITIVES$1=fails((function(){
objectGetPrototypeOf(1)}));_export({
target:"Object",stat:!0,
forced:FAILS_ON_PRIMITIVES$1,
sham:!correctPrototypeGetter},{
getPrototypeOf:function(it){
return objectGetPrototypeOf(toObject(it))}})
;var getPrototypeOf$2=path.Object.getPrototypeOf
;_export({target:"Object",stat:!0},{
setPrototypeOf:objectSetPrototypeOf})
;var setPrototypeOf$2=path.Object.setPrototypeOf
;function _getPrototypeOf(o){
return(_getPrototypeOf=setPrototypeOf$2?getPrototypeOf$2:function(o){
return o.__proto__||getPrototypeOf$2(o)})(o)}
var nativeGetOwnPropertyDescriptor$2=objectGetOwnPropertyDescriptor.f,FAILS_ON_PRIMITIVES$2=fails((function(){
nativeGetOwnPropertyDescriptor$2(1)}));_export({
target:"Object",stat:!0,
forced:!descriptors||FAILS_ON_PRIMITIVES$2,
sham:!descriptors},{
getOwnPropertyDescriptor:function(it,key){
return nativeGetOwnPropertyDescriptor$2(toIndexedObject(it),key)
}})
;var getOwnPropertyDescriptor$4=createCommonjsModule((function(module){
var Object=path.Object,getOwnPropertyDescriptor=module.exports=function(it,key){
return Object.getOwnPropertyDescriptor(it,key)}
;Object.getOwnPropertyDescriptor.sham&&(getOwnPropertyDescriptor.sham=!0)
}));_export({target:"Reflect",stat:!0},{
get:function get$1(target,propertyKey){
var descriptor,prototype,receiver=arguments.length<3?target:arguments[2]
;return anObject(target)===receiver?target[propertyKey]:(descriptor=objectGetOwnPropertyDescriptor.f(target,propertyKey))?has(descriptor,"value")?descriptor.value:void 0===descriptor.get?void 0:descriptor.get.call(receiver):isObject(prototype=objectGetPrototypeOf(target))?get$1(prototype,propertyKey,receiver):void 0
}});var get$4=path.Reflect.get
;function _get(target,property,receiver){
return(_get="undefined"!=typeof Reflect&&get$4?get$4:function(target,property,receiver){
var base=function(object,property){
for(;!Object.prototype.hasOwnProperty.call(object,property)&&null!==(object=_getPrototypeOf(object)););
return object}(target,property);if(base){
var desc=getOwnPropertyDescriptor$4(base,property)
;return desc.get?desc.get.call(receiver):desc.value
}})(target,property,receiver||target)}
var create$4=create;function _setPrototypeOf(o,p){
return(_setPrototypeOf=setPrototypeOf$2||function(o,p){
return o.__proto__=p,o})(o,p)}
var slice$3=[].slice,MSIE=/MSIE .\./.test(engineUserAgent),wrap$1=function(scheduler){
return function(handler,timeout){
var boundArgs=arguments.length>2,args=boundArgs?slice$3.call(arguments,2):void 0
;return scheduler(boundArgs?function(){
("function"==typeof handler?handler:Function(handler)).apply(this,args)
}:handler,timeout)}};_export({global:!0,bind:!0,
forced:MSIE},{
setTimeout:wrap$1(global_1.setTimeout),
setInterval:wrap$1(global_1.setInterval)})
;var setTimeout$2=path.setTimeout,HAS_SPECIES_SUPPORT$2=arrayMethodHasSpeciesSupport("splice"),USES_TO_LENGTH$4=arrayMethodUsesToLength("splice",{
ACCESSORS:!0,0:0,1:2
}),max$2=Math.max,min$2=Math.min;_export({
target:"Array",proto:!0,
forced:!HAS_SPECIES_SUPPORT$2||!USES_TO_LENGTH$4
},{splice:function(start,deleteCount){
var insertCount,actualDeleteCount,A,k,from,to,O=toObject(this),len=toLength(O.length),actualStart=toAbsoluteIndex(start,len),argumentsLength=arguments.length
;if(0===argumentsLength?insertCount=actualDeleteCount=0:1===argumentsLength?(insertCount=0,
actualDeleteCount=len-actualStart):(insertCount=argumentsLength-2,
actualDeleteCount=min$2(max$2(toInteger(deleteCount),0),len-actualStart)),
len+insertCount-actualDeleteCount>9007199254740991)throw TypeError("Maximum allowed length exceeded")
;for(A=arraySpeciesCreate(O,actualDeleteCount),
k=0;k<actualDeleteCount;k++)(from=actualStart+k)in O&&createProperty(A,k,O[from])
;if(A.length=actualDeleteCount,
insertCount<actualDeleteCount){
for(k=actualStart;k<len-actualDeleteCount;k++)to=k+insertCount,
(from=k+actualDeleteCount)in O?O[to]=O[from]:delete O[to]
;for(k=len;k>len-actualDeleteCount+insertCount;k--)delete O[k-1]
}else if(insertCount>actualDeleteCount)for(k=len-actualDeleteCount;k>actualStart;k--)to=k+insertCount-1,
(from=k+actualDeleteCount-1)in O?O[to]=O[from]:delete O[to]
;for(k=0;k<insertCount;k++)O[k+actualStart]=arguments[k+2]
;return O.length=len-actualDeleteCount+insertCount,
A}})
;var splice=entryVirtual("Array").splice,ArrayPrototype$6=Array.prototype,splice$2=function(it){
var own=it.splice
;return it===ArrayPrototype$6||it instanceof Array&&own===ArrayPrototype$6.splice?splice:own
};_export({target:"Object",stat:!0,
forced:!descriptors,sham:!descriptors},{
defineProperty:objectDefineProperty.f})
;var defineProperty_1=createCommonjsModule((function(module){
var Object=path.Object,defineProperty=module.exports=function(it,key,desc){
return Object.defineProperty(it,key,desc)}
;Object.defineProperty.sham&&(defineProperty.sham=!0)
})),defineProperty$6=defineProperty_1
;function _classCallCheck(instance,Constructor){
if(!(instance instanceof Constructor))throw new TypeError("Cannot call a class as a function")
}var defineProperty$8=defineProperty_1
;function _defineProperties(target,props){
for(var i=0;i<props.length;i++){
var descriptor=props[i]
;descriptor.enumerable=descriptor.enumerable||!1,descriptor.configurable=!0,
"value"in descriptor&&(descriptor.writable=!0),
defineProperty$8(target,descriptor.key,descriptor)
}}
function _createClass(Constructor,protoProps,staticProps){
return protoProps&&_defineProperties(Constructor.prototype,protoProps),
staticProps&&_defineProperties(Constructor,staticProps),
Constructor}var Emitter=function(){
function Emitter(){
_classCallCheck(this,Emitter),defineProperty$6(this,"listeners",{
value:{},writable:!0,configurable:!0})}
return _createClass(Emitter,[{
key:"addEventListener",
value:function(type,callback){
type in this.listeners||(this.listeners[type]=[]),
this.listeners[type].push(callback)}},{
key:"removeEventListener",
value:function(type,callback){
if(type in this.listeners)for(var stack=this.listeners[type],i=0,l=stack.length;i<l;i++)if(stack[i]===callback)return void splice$2(stack).call(stack,i,1)
}},{key:"dispatchEvent",value:function(event){
var _this=this;if(event.type in this.listeners){
for(var debounce=function(callback){
setTimeout$2((function(){
return callback.call(_this,event)}))
},stack=this.listeners[event.type],i=0,l=stack.length;i<l;i++)debounce(stack[i])
;return!event.defaultPrevented}}}]),Emitter
}(),AbortSignal=function(_Emitter){
function AbortSignal(){var _this2
;return _classCallCheck(this,AbortSignal),(_this2=function(self,call){
return!call||"object"!==_typeof(call)&&"function"!=typeof call?_assertThisInitialized(self):call
}(this,_getPrototypeOf(AbortSignal).call(this))).listeners||Emitter.call(_assertThisInitialized(_this2)),
defineProperty$6(_assertThisInitialized(_this2),"aborted",{
value:!1,writable:!0,configurable:!0
}),defineProperty$6(_assertThisInitialized(_this2),"onabort",{
value:null,writable:!0,configurable:!0}),_this2}
return function(subClass,superClass){
if("function"!=typeof superClass&&null!==superClass)throw new TypeError("Super expression must either be null or a function")
;subClass.prototype=create$4(superClass&&superClass.prototype,{
constructor:{value:subClass,writable:!0,
configurable:!0}
}),superClass&&_setPrototypeOf(subClass,superClass)
}(AbortSignal,_Emitter),_createClass(AbortSignal,[{
key:"toString",value:function(){
return"[object AbortSignal]"}},{
key:"dispatchEvent",value:function(event){
"abort"===event.type&&(this.aborted=!0,
"function"==typeof this.onabort&&this.onabort.call(this,event)),
_get(_getPrototypeOf(AbortSignal.prototype),"dispatchEvent",this).call(this,event)
}}]),AbortSignal
}(Emitter),AbortController=function(){
function AbortController(){
_classCallCheck(this,AbortController),defineProperty$6(this,"signal",{
value:new AbortSignal,writable:!0,configurable:!0
})}return _createClass(AbortController,[{
key:"abort",value:function(){var event;try{
event=new Event("abort")}catch(e){
"undefined"!=typeof document?document.createEvent?(event=document.createEvent("Event")).initEvent("abort",!1,!1):(event=document.createEventObject()).type="abort":event={
type:"abort",bubbles:!1,cancelable:!1}}
this.signal.dispatchEvent(event)}},{
key:"toString",value:function(){
return"[object AbortController]"}
}]),AbortController}()
;void 0!==symbol$2&&toStringTag$2&&(AbortController.prototype[toStringTag$2]="AbortController",
AbortSignal.prototype[toStringTag$2]="AbortSignal"),
function(self){(function(self){
return self.__FORCE_INSTALL_ABORTCONTROLLER_POLYFILL?(console.log("__FORCE_INSTALL_ABORTCONTROLLER_POLYFILL=true is set, will force install polyfill"),
!0):"function"==typeof self.Request&&!self.Request.prototype.hasOwnProperty("signal")||!self.AbortController
})(self)&&(self.AbortController=AbortController,
self.AbortSignal=AbortSignal)
}("undefined"!=typeof self?self:global)}();
