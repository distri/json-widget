window["distri/json-widget:master"]({
  "source": {
    "LICENSE": {
      "path": "LICENSE",
      "content": "The MIT License (MIT)\n\nCopyright (c) 2014 \n\nPermission is hereby granted, free of charge, to any person obtaining a copy\nof this software and associated documentation files (the \"Software\"), to deal\nin the Software without restriction, including without limitation the rights\nto use, copy, modify, merge, publish, distribute, sublicense, and/or sell\ncopies of the Software, and to permit persons to whom the Software is\nfurnished to do so, subject to the following conditions:\n\nThe above copyright notice and this permission notice shall be included in all\ncopies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\nIMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\nFITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\nAUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\nLIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\nOUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE\nSOFTWARE.",
      "mode": "100644",
      "type": "blob"
    },
    "README.md": {
      "path": "README.md",
      "content": "json-widget\n===========\n\nEdit JSON as a tree of editable nodes\n",
      "mode": "100644",
      "type": "blob"
    },
    "pixie.cson": {
      "path": "pixie.cson",
      "content": "version: \"0.1.0\"\nremoteDependencies: [\n  \"https://code.jquery.com/jquery-1.11.0.min.js\"\n]\ndependencies:\n  observable: \"distri/observable:v0.2.0-pre.1\"\n  postmaster: \"distri/postmaster:v0.2.2\"\n  util: \"distri/util:v0.1.0\"\n  \"value-widget\": \"distri/value-widget:v0.1.4-pre.2\"\n",
      "mode": "100644"
    },
    "main.coffee.md": {
      "path": "main.coffee.md",
      "content": "JSON Value Widget\n========================\n\n    global.Observable = require \"observable\"\n    {applyStylesheet} = require \"util\"\n\nCreate an editor, send events back to parent.\n\n    require \"./lib/jquery.property_editor\"\n\n    applyStylesheet(require \"./style\")\n\n    json =\n      test: \"wat\"\n      yolo: \"jawsome!\"\n      duder:\n        a: \"radical\"\n        b: \"!?!?\"\n        c: [\n          1\n          2\n          3\n        ]\n\n    jsonString = JSON.stringify(json, null, 2)\n\n    (jsonEditor = $(\"<div>\").propertyEditor(json)).appendTo(document.body)\n\n    jsonEditor.on \"dirty\", ->\n      data = jsonEditor.getProps()\n\n      console.log data\n\n      postmaster.sendToParent\n        value: data\n\nUse the postmaster to send value to our parent, store our current value in it as well.\n\n    updating = false\n    postmaster = require(\"postmaster\")()\n    postmaster.value = (newValue) ->\n      updating = true\n      jsonEditor.setProps newValue\n      updating = false\n\nExpose a focus method to our parent.\n\n    postmaster.focus = ->\n      jsonEditor.focus()\n\n    log = (data) ->\n      postmaster.sendToParent\n        log: data\n\n\n    global.postmaster = postmaster\n\nDemo\n====\n\n>     #! setup\n>     ValueWidget = require \"value-widget\"\n>     iframe = document.createElement(\"iframe\")\n>     window.json = ValueWidget\n>       debug: true\n>       value:\n>         test: \"data\"\n>         array: [1, 2, 3]\n>         boolean: true\n>         nested:\n>           bro: \"tura\"\n>           yolo: \"wat\"\n>       iframe: iframe\n>       url: \"http://distri.github.io/json-widget/\"\n>\n>     document.body.appendChild iframe\n>     json.observe (data) ->\n>       console.log data\n>       $(\".content\").last().text JSON.stringify(data, null, 2)\n",
      "mode": "100644"
    },
    "style.styl": {
      "path": "style.styl",
      "content": "*\n  box-sizing: border-box\n\nhtml\n  height: 100%\n\nbody\n  font-family: \"HelveticaNeue-Light\", \"Helvetica Neue Light\", \"Helvetica Neue\", Helvetica, Arial, \"Lucida Grande\", sans-serif\n  height: 100%\n  margin: 0\n  overflow: hidden\n\n.properties, .array\n  padding-left: 1em\n\nbody > .properties\n  padding-left: 0\n  width: 100%\n  height: 100%\n  position: absolute\n  top: 0\n  right: 0\n  overflow: auto\n\n.row\n  //WTF?\n  margin: -2px 0 -1px 0 \n\n.dealies\n  .properties > .row\n    &::after\n      content: \",\"\n  \n    &:last-child\n      &::after\n        content: \"\"\n  \n    &:first-child\n      &::before\n        content: \"{\"\n    &:last-child\n      &::after\n        content: \"}\"\n  \n  .array > .row\n    &::after\n      content: \",\"\n  \n    &:last-child\n      &::after\n        content: \"\"\n  \n    &:first-child\n      &::before\n        content: \"[\"\n    &:last-child\n      &::after\n        content: \"]\"\n\ninput\n  border: 1px solid rgba(0, 0, 0, 0.125)\n  border-left: none\n  \n  &:first-child\n    border-left: 1px solid rgba(0, 0, 0, 0.125)\n\n  margin: 0\n  \n  padding: 0 0.5em\n\n  width: 100px\n\n  &.key\n    text-align: right\n\niframe\n  border: none\n  width: 50%\n  height: 100%\n",
      "mode": "100644"
    },
    "node.haml": {
      "path": "node.haml",
      "content": "\n.node\n  - subtemplate = @subtemplate\n  - each @items, ->\n    .item\n      %input.key(value=@key)\n      %input.value(value=@value)\n",
      "mode": "100644"
    },
    "model.coffee.md": {
      "path": "model.coffee.md",
      "content": "A model of a JSON node\n======================\n  \n    Observable = require \"observable\"\n    template = require \"./node\"\n\n    module.exports = Model = (I) ->\n      # Set this to trigger update\n      update = Observable()\n\n      items = Object.keys(I).map (key) ->\n        value = I[key]\n\n        if typeof value is \"object\"\n          Model(value)\n        else\n          key: Observable key\n          value: Observable value\n\n      self =\n        items: items\n        subtemplate: template\n\n      return self\n",
      "mode": "100644"
    },
    "lib/_hamljr_runtime.js": {
      "path": "lib/_hamljr_runtime.js",
      "content": "!function(e){if(\"object\"==typeof exports)module.exports=e();else if(\"function\"==typeof define&&define.amd)define(e);else{var f;\"undefined\"!=typeof window?f=window:\"undefined\"!=typeof global?f=global:\"undefined\"!=typeof self&&(f=self),f.hamletRuntime=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require==\"function\"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error(\"Cannot find module '\"+o+\"'\")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require==\"function\"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){\n!function(){var Observable,Runtime,bindEvent,bindObservable,cleanup,contentBind,empty,eventNames,initContent,isEvent,isFragment,remove,specialBindings,valueBind,valueIndexOf,__slice=[].slice;Observable=_dereq_(\"o_0\");eventNames=\"abort\\nblur\\nchange\\nclick\\ndblclick\\ndrag\\ndragend\\ndragenter\\ndragleave\\ndragover\\ndragstart\\ndrop\\nerror\\nfocus\\ninput\\nkeydown\\nkeypress\\nkeyup\\nload\\nmousedown\\nmousemove\\nmouseout\\nmouseover\\nmouseup\\nreset\\nresize\\nscroll\\nselect\\nsubmit\\ntouchcancel\\ntouchend\\ntouchenter\\ntouchleave\\ntouchmove\\ntouchstart\\nunload\".split(\"\\n\");isEvent=function(name){return eventNames.indexOf(name)!==-1};isFragment=function(node){return(node!=null?node.nodeType:void 0)===11};initContent=function(element){var allContent,update;if(element._hamlet_content){return element._hamlet_content}allContent=element._hamlet_content!=null?element._hamlet_content:element._hamlet_content=Observable.concat();update=function(){empty(element);return allContent.each(function(item){return element.appendChild(item)})};bindObservable(element,allContent,null,update);return allContent};contentBind=function(element,value){initContent(element).push(value);return element};valueBind=function(element,value,context){var update;value=Observable(value,context);switch(element.nodeName){case\"SELECT\":element.oninput=element.onchange=function(){var optionValue,_ref,_value;_ref=this.children[this.selectedIndex],optionValue=_ref.value,_value=_ref._value;return value(_value||optionValue)};update=function(newValue){var options;element._value=newValue;if(options=element._options){if(newValue.value!=null){return element.value=(typeof newValue.value===\"function\"?newValue.value():void 0)||newValue.value}else{return element.selectedIndex=valueIndexOf(options,newValue)}}else{return element.value=newValue}};bindObservable(element,value,context,update);break;default:element.oninput=element.onchange=function(){return value(element.value)};bindObservable(element,value,context,function(newValue){return element.value=newValue})}};specialBindings={INPUT:{checked:function(element,value,context){element.onchange=function(){return typeof value===\"function\"?value(element.checked):void 0};return bindObservable(element,value,context,function(newValue){return element.checked=newValue})}},SELECT:{options:function(element,values,context){var updateValues;values=Observable(values,context);updateValues=function(values){empty(element);element._options=values;return values.map(function(value,index){var option,optionName,optionValue;option=document.createElement(\"option\");option._value=value;if(typeof value===\"object\"){optionValue=(value!=null?value.value:void 0)||index}else{optionValue=value.toString()}bindObservable(option,optionValue,value,function(newValue){return option.value=newValue});optionName=(value!=null?value.name:void 0)||value;bindObservable(option,optionName,value,function(newValue){return option.textContent=newValue});element.appendChild(option);if(value===element._value){element.selectedIndex=index}return option})};return bindObservable(element,values,context,updateValues)}}};bindObservable=function(element,value,context,update){var observable,observe,unobserve;observable=Observable(value,context);observe=function(){observable.observe(update);return update(observable())};unobserve=function(){return observable.stopObserving(update)};observe();(element._hamlet_cleanup||(element._hamlet_cleanup=[])).push(unobserve);return element};bindEvent=function(element,name,fn,context){return element[name]=function(){return fn.apply(context,arguments)}};cleanup=function(element){var _ref;Array.prototype.forEach.call(element.children,cleanup);if((_ref=element._hamlet_cleanup)!=null){_ref.forEach(function(method){return method()})}delete element._hamlet_cleanup};Runtime=function(context){var append,buffer,classes,contextTop,id,lastParent,observeAttribute,observeText,pop,push,render,self,stack,top,withContext;stack=[];lastParent=function(){var element,i;i=stack.length-1;while((element=stack[i])&&isFragment(element)){i-=1}return element};contextTop=void 0;top=function(){return stack[stack.length-1]||contextTop};append=function(child){var parent,_ref;parent=top();if(isFragment(child)&&child.childNodes.length===1){child=child.childNodes[0]}if((_ref=top())!=null){_ref.appendChild(child)}return child};push=function(child){return stack.push(child)};pop=function(){return append(stack.pop())};render=function(child){push(child);return pop()};id=function(){var element,sources,update,value;sources=1<=arguments.length?__slice.call(arguments,0):[];element=top();update=function(newValue){if(typeof newValue===\"function\"){newValue=newValue()}return element.id=newValue};value=function(){var possibleValues;possibleValues=sources.map(function(source){if(typeof source===\"function\"){return source()}else{return source}}).filter(function(idValue){return idValue!=null});return possibleValues[possibleValues.length-1]};return bindObservable(element,value,context,update)};classes=function(){var element,sources,update;sources=1<=arguments.length?__slice.call(arguments,0):[];element=top();update=function(newValue){if(typeof newValue===\"function\"){newValue=newValue()}return element.className=newValue};return function(context){var value;value=function(){var possibleValues;possibleValues=sources.map(function(source){if(typeof source===\"function\"){return source.call(context)}else{return source}}).filter(function(sourceValue){return sourceValue!=null});return possibleValues.join(\" \")};return bindObservable(element,value,context,update)}(context)};observeAttribute=function(name,value){var binding,element,nodeName,_ref;element=top();nodeName=element.nodeName;if(name===\"value\"){valueBind(element,value)}else if(binding=(_ref=specialBindings[nodeName])!=null?_ref[name]:void 0){binding(element,value,context)}else if(name.match(/^on/)&&isEvent(name.substr(2))){bindEvent(element,name,value,context)}else if(isEvent(name)){bindEvent(element,\"on\"+name,value,context)}else{bindObservable(element,value,context,function(newValue){if(newValue!=null&&newValue!==false){return element.setAttribute(name,newValue)}else{return element.removeAttribute(name)}})}return element};observeText=function(value){var element,update;element=document.createTextNode(\"\");update=function(newValue){return element.nodeValue=newValue};bindObservable(element,value,context,update);return render(element)};withContext=function(newContext,newContextTop,fn){var oldContext;oldContext=context;context=newContext;contextTop=newContextTop;try{return fn()}finally{contextTop=void 0;context=oldContext}};buffer=function(value){var _ref,_ref1,_ref2;value=Observable(value,context);if(typeof value()===\"string\"){return observeText(value)}switch((_ref=value())!=null?_ref.nodeType:void 0){case 1:case 3:case 11:contentBind(top(),value);return value()}switch((_ref1=value())!=null?(_ref2=_ref1[0])!=null?_ref2.nodeType:void 0:void 0){case 1:case 3:case 11:return contentBind(top(),value)}};self={push:push,pop:pop,id:id,classes:classes,attribute:observeAttribute,text:buffer,filter:function(name,content){},each:function(items,fn){var elements,parent,replace;items=Observable(items,context);elements=null;parent=lastParent();items.observe(function(){return replace(elements)});replace=function(oldElements){elements=[];items.each(function(item,index,array){var element;element=null;withContext(item,parent,function(){return element=fn.call(item,item,index,array)});if(isFragment(element)){elements.push.apply(elements,element.childNodes)}else{elements.push(element)}parent.appendChild(element);return element});return oldElements!=null?oldElements.forEach(remove):void 0};return replace(null,items)}};return self};Runtime.Observable=Observable;module.exports=Runtime;empty=function(node){var child,_results;_results=[];while(child=node.firstChild){_results.push(node.removeChild(child))}return _results};valueIndexOf=function(options,value){if(typeof value===\"object\"){return options.indexOf(value)}else{return options.map(function(option){return option.toString()}).indexOf(value.toString())}};remove=function(element){var _ref;cleanup(element);if((_ref=element.parentNode)!=null){_ref.removeChild(element)}}}.call(this);\n},{\"o_0\":2}],2:[function(_dereq_,module,exports){\n(function (global){\n!function(){var Observable,autoDeps,computeDependencies,copy,extend,flatten,get,last,magicDependency,remove,splat,withBase,__slice=[].slice;Observable=function(value,context){var changed,fn,listeners,notify,notifyReturning,self;if(typeof(value!=null?value.observe:void 0)===\"function\"){return value}listeners=[];notify=function(newValue){return copy(listeners).forEach(function(listener){return listener(newValue)})};if(typeof value===\"function\"){fn=value;self=function(){magicDependency(self);return value};self.each=function(){var args,_ref;args=1<=arguments.length?__slice.call(arguments,0):[];magicDependency(self);return(_ref=splat(value)).forEach.apply(_ref,args)};changed=function(){value=computeDependencies(self,fn,changed,context);return notify(value)};value=computeDependencies(self,fn,changed,context)}else{self=function(newValue){if(arguments.length>0){if(value!==newValue){value=newValue;notify(newValue)}}else{magicDependency(self)}return value}}self.each=function(){var args,_ref;args=1<=arguments.length?__slice.call(arguments,0):[];magicDependency(self);if(value!=null){return(_ref=[value]).forEach.apply(_ref,args)}};if(Array.isArray(value)){[\"concat\",\"every\",\"filter\",\"forEach\",\"indexOf\",\"join\",\"lastIndexOf\",\"map\",\"reduce\",\"reduceRight\",\"slice\",\"some\"].forEach(function(method){return self[method]=function(){var args;args=1<=arguments.length?__slice.call(arguments,0):[];magicDependency(self);return value[method].apply(value,args)}});[\"pop\",\"push\",\"reverse\",\"shift\",\"splice\",\"sort\",\"unshift\"].forEach(function(method){return self[method]=function(){var args;args=1<=arguments.length?__slice.call(arguments,0):[];return notifyReturning(value[method].apply(value,args))}});notifyReturning=function(returnValue){notify(value);return returnValue};extend(self,{each:function(){var args;args=1<=arguments.length?__slice.call(arguments,0):[];self.forEach.apply(self,args);return self},remove:function(object){var index;index=value.indexOf(object);if(index>=0){return notifyReturning(value.splice(index,1)[0])}},get:function(index){return value[index]},first:function(){return value[0]},last:function(){return value[value.length-1]}})}extend(self,{listeners:listeners,observe:function(listener){return listeners.push(listener)},stopObserving:function(fn){return remove(listeners,fn)},toggle:function(){return self(!value)},increment:function(n){return self(value+n)},decrement:function(n){return self(value-n)},toString:function(){return\"Observable(\"+value+\")\"}});return self};Observable.concat=function(){var args,o;args=1<=arguments.length?__slice.call(arguments,0):[];args=Observable(args);o=Observable(function(){return flatten(args.map(splat))});o.push=args.push;return o};module.exports=Observable;extend=function(){var name,source,sources,target,_i,_len;target=arguments[0],sources=2<=arguments.length?__slice.call(arguments,1):[];for(_i=0,_len=sources.length;_i<_len;_i++){source=sources[_i];for(name in source){target[name]=source[name]}}return target};global.OBSERVABLE_ROOT_HACK=[];autoDeps=function(){return last(global.OBSERVABLE_ROOT_HACK)};magicDependency=function(self){var observerStack;if(observerStack=autoDeps()){return observerStack.push(self)}};withBase=function(self,update,fn){var deps,value,_ref;global.OBSERVABLE_ROOT_HACK.push(deps=[]);try{value=fn();if((_ref=self._deps)!=null){_ref.forEach(function(observable){return observable.stopObserving(update)})}self._deps=deps;deps.forEach(function(observable){return observable.observe(update)})}finally{global.OBSERVABLE_ROOT_HACK.pop()}return value};computeDependencies=function(self,fn,update,context){return withBase(self,update,function(){return fn.call(context)})};remove=function(array,value){var index;index=array.indexOf(value);if(index>=0){return array.splice(index,1)[0]}};copy=function(array){return array.concat([])};get=function(arg){if(typeof arg===\"function\"){return arg()}else{return arg}};splat=function(item){var result,results;results=[];if(typeof item.forEach===\"function\"){item.forEach(function(i){return results.push(i)})}else{result=get(item);if(result!=null){results.push(result)}}return results};last=function(array){return array[array.length-1]};flatten=function(array){return array.reduce(function(a,b){return a.concat(b)},[])}}.call(this);\n}).call(this,typeof self !== \"undefined\" ? self : typeof window !== \"undefined\" ? window : {})\n},{}]},{},[1])\n(1)\n});\n",
      "mode": "100644"
    },
    "lib/jquery.property_editor.coffee": {
      "path": "lib/jquery.property_editor.coffee",
      "content": "(($) ->\n\n  $.fn.propertyEditor = (properties={}, options={}) ->\n    object = properties\n\n    element = this.eq(0)\n    if Array.isArray(object)\n      element.addClass(\"array\")\n    else\n      element.addClass(\"properties\")\n\n    element.getProps = ->\n      object\n\n    element.setProps = (properties={}) ->\n      # TODO: Check for arrays\n      object = properties\n\n      element.html('')\n\n      Object.keys(object).forEach (key) ->\n        value = object[key]\n\n        if typeof value is \"object\"\n          addNestedRow(key, value)\n        else\n          addRow(key, value)\n\n      rowCheck()\n\n      element\n\n    rowCheck = ->\n      debugger\n      # If last row has data\n      if (input = element.children(\".row\").last().find(\"input\").first()).length\n        if input.val()\n          addRow('', '')\n      else # Or no rows\n        addRow('', '')\n\n    fireDirtyEvent = ->\n      try\n        element.trigger(\"dirty\", [object])\n      catch error\n        console?.error? error\n\n    processInputChanges = ->\n      fireDirtyEvent()\n\n      rowCheck()\n\n    makeKeyInput = (key, valueFn) ->\n      input = $(\"<input>\",\n        class: \"key\"\n        data:\n          previousName: key\n        type: \"text\"\n        placeholder: \"key\"\n        value: key\n      )\n\n      input.on('input change', (e) ->\n        $this = $(this)\n\n        currentName = $this.val()\n        previousName = $this.data(\"previousName\")\n\n        if currentName isnt previousName\n          $this.data(\"previousName\", currentName)\n          delete object[previousName]\n\n          return if currentName is \"\"\n\n          object[currentName] = valueFn()\n\n          processInputChanges()\n      ).on \"keydown\", (e) ->\n        if e.keyCode is 13\n          # Next input\n          nextInput = input.next(\"input\").first() or input.next().find(\"input\").first()\n          setTimeout ->\n            nextInput.focus()\n            \n        if input.val() is \"\" and e.keyCode is 8\n          # Just remove the whole row becaus we assue it's been removed from the\n          # call to delete in a prevous change event\n          prevInput = input.parent().prev().find(\"input\").last()\n          setTimeout ->\n            prevInput.focus()\n\n          input.parent().remove()\n\n      input\n\n    makeValueInput = (value, keyFn, removeFn) ->\n      input = $(\"<input>\",\n        class: \"value\"\n        data:\n          previousValue: value\n        placeholder: \"value\"\n        value: value\n      ).on('input change', (e) ->\n        $this = $(this)\n\n        currentValue = parse $this.val()\n        previousValue = $this.data(\"previousValue\")\n\n        if currentValue isnt previousValue\n          key = keyFn()\n\n          $this.data(\"previousValue\", currentValue)\n          object[key] = currentValue\n\n          processInputChanges()\n      ).on('keydown', (e) ->\n        if $(this).val() is \"\" and e.keyCode is 8\n          removeFn()\n        \n        if e.keyCode is 13\n          # Next input\n          nextInput = input.parent().next().find(\"input\").first()\n          setTimeout ->\n            nextInput.focus()\n      )\n\n    addRow = (key, value) ->\n      row = $ \"<div>\",\n        class: \"row\"\n\n      valueFn = ->\n        parse valueInput.val()\n\n      if Array.isArray(object)\n        keyFn = ->\n          valueInput.parent().index()\n        removeFn = ->\n          object.splice(keyFn(), 1)\n\n          prevInput = valueInput.parent().prev().find(\"input\").last()\n          setTimeout ->\n            prevInput.focus()\n\n          row.remove()\n      else\n        keyInput = makeKeyInput(key, valueFn).appendTo(row)\n        keyFn = ->\n          keyInput.val()\n\n        removeFn = ->\n          setTimeout ->\n            valueInput.prev().focus()\n\n      valueInput = makeValueInput(value, keyFn, removeFn).appendTo(row)\n\n      return row.appendTo(element)\n\n    addNestedRow = (key, value) ->\n      row = $ \"<div>\",\n        class: \"row\"\n\n      valueFn = ->\n        value\n\n      makeKeyInput(key, valueFn).appendTo(row)\n\n      if Array.isArray(value)\n        row.append(\" : [\")\n      else if typeof value is \"object\"\n        row.append(\" : {\")\n\n      nestedEditor = $(\"<div>\")\n        .appendTo(row)\n        .propertyEditor(value)\n\n      # Prevent event bubbling and retrigger with parent object\n      nestedEditor.bind \"change\", (event, changedNestedObject) ->\n        event.stopPropagation()\n        fireDirtyEvent()\n      \n      if Array.isArray(value)\n        row.append(\" ]\")\n      else if typeof value is \"object\"\n        row.append(\" }\")\n\n      return row.appendTo(element)\n\n    element.setProps(properties)\n\n)(jQuery)\n\nparse = (string) ->\n  try\n    JSON.parse(string)\n  catch\n    string\n",
      "mode": "100644"
    },
    "todo.md": {
      "path": "todo.md",
      "content": "TODO\n====\n\ndeleting by backspace\n\nArray's should display index on mouseover\n\nToMaybe\n-------\n\nInsert at top instead of at bottom (has implications for array order)\n\nDone\n----\n\nbraces and brackets for nested object and array displays\n\narrays shouldn't display index and index shouldn't be editable\n",
      "mode": "100644"
    }
  },
  "distribution": {
    "pixie": {
      "path": "pixie",
      "content": "module.exports = {\"version\":\"0.1.0\",\"remoteDependencies\":[\"https://code.jquery.com/jquery-1.11.0.min.js\"],\"dependencies\":{\"observable\":\"distri/observable:v0.2.0-pre.1\",\"postmaster\":\"distri/postmaster:v0.2.2\",\"util\":\"distri/util:v0.1.0\",\"value-widget\":\"distri/value-widget:v0.1.4-pre.2\"}};",
      "type": "blob"
    },
    "main": {
      "path": "main",
      "content": "(function() {\n  var applyStylesheet, json, jsonEditor, jsonString, log, postmaster, updating;\n\n  global.Observable = require(\"observable\");\n\n  applyStylesheet = require(\"util\").applyStylesheet;\n\n  require(\"./lib/jquery.property_editor\");\n\n  applyStylesheet(require(\"./style\"));\n\n  json = {\n    test: \"wat\",\n    yolo: \"jawsome!\",\n    duder: {\n      a: \"radical\",\n      b: \"!?!?\",\n      c: [1, 2, 3]\n    }\n  };\n\n  jsonString = JSON.stringify(json, null, 2);\n\n  (jsonEditor = $(\"<div>\").propertyEditor(json)).appendTo(document.body);\n\n  jsonEditor.on(\"dirty\", function() {\n    var data;\n    data = jsonEditor.getProps();\n    console.log(data);\n    return postmaster.sendToParent({\n      value: data\n    });\n  });\n\n  updating = false;\n\n  postmaster = require(\"postmaster\")();\n\n  postmaster.value = function(newValue) {\n    updating = true;\n    jsonEditor.setProps(newValue);\n    return updating = false;\n  };\n\n  postmaster.focus = function() {\n    return jsonEditor.focus();\n  };\n\n  log = function(data) {\n    return postmaster.sendToParent({\n      log: data\n    });\n  };\n\n  global.postmaster = postmaster;\n\n}).call(this);\n",
      "type": "blob"
    },
    "style": {
      "path": "style",
      "content": "module.exports = \"* {\\n  -ms-box-sizing: border-box;\\n  -moz-box-sizing: border-box;\\n  -webkit-box-sizing: border-box;\\n  box-sizing: border-box;\\n}\\n\\nhtml {\\n  height: 100%;\\n}\\n\\nbody {\\n  font-family: \\\"HelveticaNeue-Light\\\", \\\"Helvetica Neue Light\\\", \\\"Helvetica Neue\\\", Helvetica, Arial, \\\"Lucida Grande\\\", sans-serif;\\n  height: 100%;\\n  margin: 0;\\n  overflow: hidden;\\n}\\n\\n.properties,\\n.array {\\n  padding-left: 1em;\\n}\\n\\nbody > .properties {\\n  padding-left: 0;\\n  width: 100%;\\n  height: 100%;\\n  position: absolute;\\n  top: 0;\\n  right: 0;\\n  overflow: auto;\\n}\\n\\n.row {\\n  margin: -2px 0 -1px 0;\\n}\\n\\n.dealies .properties > .row::after {\\n  content: \\\",\\\";\\n}\\n\\n.dealies .properties > .row:last-child::after {\\n  content: \\\"\\\";\\n}\\n\\n.dealies .properties > .row:first-child::before {\\n  content: \\\"{\\\";\\n}\\n\\n.dealies .properties > .row:last-child::after {\\n  content: \\\"}\\\";\\n}\\n\\n.dealies .array > .row::after {\\n  content: \\\",\\\";\\n}\\n\\n.dealies .array > .row:last-child::after {\\n  content: \\\"\\\";\\n}\\n\\n.dealies .array > .row:first-child::before {\\n  content: \\\"[\\\";\\n}\\n\\n.dealies .array > .row:last-child::after {\\n  content: \\\"]\\\";\\n}\\n\\ninput {\\n  border: 1px solid rgba(0, 0, 0, 0.125);\\n  border-left: none;\\n  margin: 0;\\n  padding: 0 0.5em;\\n  width: 100px;\\n}\\n\\ninput:first-child {\\n  border-left: 1px solid rgba(0, 0, 0, 0.125);\\n}\\n\\ninput.key {\\n  text-align: right;\\n}\\n\\niframe {\\n  border: none;\\n  width: 50%;\\n  height: 100%;\\n}\";",
      "type": "blob"
    },
    "node": {
      "path": "node",
      "content": "Runtime = require(\"/lib/_hamljr_runtime\");\n\nmodule.exports = (function(data) {\n  return (function() {\n    var subtemplate, __runtime;\n    __runtime = Runtime(this);\n    __runtime.push(document.createDocumentFragment());\n    __runtime.push(document.createElement(\"div\"));\n    __runtime.classes(\"node\");\n    subtemplate = this.subtemplate;\n    __runtime.each(this.items, function() {\n      __runtime.push(document.createElement(\"div\"));\n      __runtime.classes(\"item\");\n      __runtime.push(document.createElement(\"input\"));\n      __runtime.classes(\"key\");\n      __runtime.attribute(\"value\", this.key);\n      __runtime.pop();\n      __runtime.push(document.createElement(\"input\"));\n      __runtime.classes(\"value\");\n      __runtime.attribute(\"value\", this.value);\n      __runtime.pop();\n      return __runtime.pop();\n    });\n    __runtime.pop();\n    return __runtime.pop();\n  }).call(data);\n});\n",
      "type": "blob"
    },
    "model": {
      "path": "model",
      "content": "(function() {\n  var Model, Observable, template;\n\n  Observable = require(\"observable\");\n\n  template = require(\"./node\");\n\n  module.exports = Model = function(I) {\n    var items, self, update;\n    update = Observable();\n    items = Object.keys(I).map(function(key) {\n      var value;\n      value = I[key];\n      if (typeof value === \"object\") {\n        return Model(value);\n      } else {\n        return {\n          key: Observable(key),\n          value: Observable(value)\n        };\n      }\n    });\n    self = {\n      items: items,\n      subtemplate: template\n    };\n    return self;\n  };\n\n}).call(this);\n",
      "type": "blob"
    },
    "lib/_hamljr_runtime": {
      "path": "lib/_hamljr_runtime",
      "content": "!function(e){if(\"object\"==typeof exports)module.exports=e();else if(\"function\"==typeof define&&define.amd)define(e);else{var f;\"undefined\"!=typeof window?f=window:\"undefined\"!=typeof global?f=global:\"undefined\"!=typeof self&&(f=self),f.hamletRuntime=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require==\"function\"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error(\"Cannot find module '\"+o+\"'\")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require==\"function\"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){\n!function(){var Observable,Runtime,bindEvent,bindObservable,cleanup,contentBind,empty,eventNames,initContent,isEvent,isFragment,remove,specialBindings,valueBind,valueIndexOf,__slice=[].slice;Observable=_dereq_(\"o_0\");eventNames=\"abort\\nblur\\nchange\\nclick\\ndblclick\\ndrag\\ndragend\\ndragenter\\ndragleave\\ndragover\\ndragstart\\ndrop\\nerror\\nfocus\\ninput\\nkeydown\\nkeypress\\nkeyup\\nload\\nmousedown\\nmousemove\\nmouseout\\nmouseover\\nmouseup\\nreset\\nresize\\nscroll\\nselect\\nsubmit\\ntouchcancel\\ntouchend\\ntouchenter\\ntouchleave\\ntouchmove\\ntouchstart\\nunload\".split(\"\\n\");isEvent=function(name){return eventNames.indexOf(name)!==-1};isFragment=function(node){return(node!=null?node.nodeType:void 0)===11};initContent=function(element){var allContent,update;if(element._hamlet_content){return element._hamlet_content}allContent=element._hamlet_content!=null?element._hamlet_content:element._hamlet_content=Observable.concat();update=function(){empty(element);return allContent.each(function(item){return element.appendChild(item)})};bindObservable(element,allContent,null,update);return allContent};contentBind=function(element,value){initContent(element).push(value);return element};valueBind=function(element,value,context){var update;value=Observable(value,context);switch(element.nodeName){case\"SELECT\":element.oninput=element.onchange=function(){var optionValue,_ref,_value;_ref=this.children[this.selectedIndex],optionValue=_ref.value,_value=_ref._value;return value(_value||optionValue)};update=function(newValue){var options;element._value=newValue;if(options=element._options){if(newValue.value!=null){return element.value=(typeof newValue.value===\"function\"?newValue.value():void 0)||newValue.value}else{return element.selectedIndex=valueIndexOf(options,newValue)}}else{return element.value=newValue}};bindObservable(element,value,context,update);break;default:element.oninput=element.onchange=function(){return value(element.value)};bindObservable(element,value,context,function(newValue){return element.value=newValue})}};specialBindings={INPUT:{checked:function(element,value,context){element.onchange=function(){return typeof value===\"function\"?value(element.checked):void 0};return bindObservable(element,value,context,function(newValue){return element.checked=newValue})}},SELECT:{options:function(element,values,context){var updateValues;values=Observable(values,context);updateValues=function(values){empty(element);element._options=values;return values.map(function(value,index){var option,optionName,optionValue;option=document.createElement(\"option\");option._value=value;if(typeof value===\"object\"){optionValue=(value!=null?value.value:void 0)||index}else{optionValue=value.toString()}bindObservable(option,optionValue,value,function(newValue){return option.value=newValue});optionName=(value!=null?value.name:void 0)||value;bindObservable(option,optionName,value,function(newValue){return option.textContent=newValue});element.appendChild(option);if(value===element._value){element.selectedIndex=index}return option})};return bindObservable(element,values,context,updateValues)}}};bindObservable=function(element,value,context,update){var observable,observe,unobserve;observable=Observable(value,context);observe=function(){observable.observe(update);return update(observable())};unobserve=function(){return observable.stopObserving(update)};observe();(element._hamlet_cleanup||(element._hamlet_cleanup=[])).push(unobserve);return element};bindEvent=function(element,name,fn,context){return element[name]=function(){return fn.apply(context,arguments)}};cleanup=function(element){var _ref;Array.prototype.forEach.call(element.children,cleanup);if((_ref=element._hamlet_cleanup)!=null){_ref.forEach(function(method){return method()})}delete element._hamlet_cleanup};Runtime=function(context){var append,buffer,classes,contextTop,id,lastParent,observeAttribute,observeText,pop,push,render,self,stack,top,withContext;stack=[];lastParent=function(){var element,i;i=stack.length-1;while((element=stack[i])&&isFragment(element)){i-=1}return element};contextTop=void 0;top=function(){return stack[stack.length-1]||contextTop};append=function(child){var parent,_ref;parent=top();if(isFragment(child)&&child.childNodes.length===1){child=child.childNodes[0]}if((_ref=top())!=null){_ref.appendChild(child)}return child};push=function(child){return stack.push(child)};pop=function(){return append(stack.pop())};render=function(child){push(child);return pop()};id=function(){var element,sources,update,value;sources=1<=arguments.length?__slice.call(arguments,0):[];element=top();update=function(newValue){if(typeof newValue===\"function\"){newValue=newValue()}return element.id=newValue};value=function(){var possibleValues;possibleValues=sources.map(function(source){if(typeof source===\"function\"){return source()}else{return source}}).filter(function(idValue){return idValue!=null});return possibleValues[possibleValues.length-1]};return bindObservable(element,value,context,update)};classes=function(){var element,sources,update;sources=1<=arguments.length?__slice.call(arguments,0):[];element=top();update=function(newValue){if(typeof newValue===\"function\"){newValue=newValue()}return element.className=newValue};return function(context){var value;value=function(){var possibleValues;possibleValues=sources.map(function(source){if(typeof source===\"function\"){return source.call(context)}else{return source}}).filter(function(sourceValue){return sourceValue!=null});return possibleValues.join(\" \")};return bindObservable(element,value,context,update)}(context)};observeAttribute=function(name,value){var binding,element,nodeName,_ref;element=top();nodeName=element.nodeName;if(name===\"value\"){valueBind(element,value)}else if(binding=(_ref=specialBindings[nodeName])!=null?_ref[name]:void 0){binding(element,value,context)}else if(name.match(/^on/)&&isEvent(name.substr(2))){bindEvent(element,name,value,context)}else if(isEvent(name)){bindEvent(element,\"on\"+name,value,context)}else{bindObservable(element,value,context,function(newValue){if(newValue!=null&&newValue!==false){return element.setAttribute(name,newValue)}else{return element.removeAttribute(name)}})}return element};observeText=function(value){var element,update;element=document.createTextNode(\"\");update=function(newValue){return element.nodeValue=newValue};bindObservable(element,value,context,update);return render(element)};withContext=function(newContext,newContextTop,fn){var oldContext;oldContext=context;context=newContext;contextTop=newContextTop;try{return fn()}finally{contextTop=void 0;context=oldContext}};buffer=function(value){var _ref,_ref1,_ref2;value=Observable(value,context);if(typeof value()===\"string\"){return observeText(value)}switch((_ref=value())!=null?_ref.nodeType:void 0){case 1:case 3:case 11:contentBind(top(),value);return value()}switch((_ref1=value())!=null?(_ref2=_ref1[0])!=null?_ref2.nodeType:void 0:void 0){case 1:case 3:case 11:return contentBind(top(),value)}};self={push:push,pop:pop,id:id,classes:classes,attribute:observeAttribute,text:buffer,filter:function(name,content){},each:function(items,fn){var elements,parent,replace;items=Observable(items,context);elements=null;parent=lastParent();items.observe(function(){return replace(elements)});replace=function(oldElements){elements=[];items.each(function(item,index,array){var element;element=null;withContext(item,parent,function(){return element=fn.call(item,item,index,array)});if(isFragment(element)){elements.push.apply(elements,element.childNodes)}else{elements.push(element)}parent.appendChild(element);return element});return oldElements!=null?oldElements.forEach(remove):void 0};return replace(null,items)}};return self};Runtime.Observable=Observable;module.exports=Runtime;empty=function(node){var child,_results;_results=[];while(child=node.firstChild){_results.push(node.removeChild(child))}return _results};valueIndexOf=function(options,value){if(typeof value===\"object\"){return options.indexOf(value)}else{return options.map(function(option){return option.toString()}).indexOf(value.toString())}};remove=function(element){var _ref;cleanup(element);if((_ref=element.parentNode)!=null){_ref.removeChild(element)}}}.call(this);\n},{\"o_0\":2}],2:[function(_dereq_,module,exports){\n(function (global){\n!function(){var Observable,autoDeps,computeDependencies,copy,extend,flatten,get,last,magicDependency,remove,splat,withBase,__slice=[].slice;Observable=function(value,context){var changed,fn,listeners,notify,notifyReturning,self;if(typeof(value!=null?value.observe:void 0)===\"function\"){return value}listeners=[];notify=function(newValue){return copy(listeners).forEach(function(listener){return listener(newValue)})};if(typeof value===\"function\"){fn=value;self=function(){magicDependency(self);return value};self.each=function(){var args,_ref;args=1<=arguments.length?__slice.call(arguments,0):[];magicDependency(self);return(_ref=splat(value)).forEach.apply(_ref,args)};changed=function(){value=computeDependencies(self,fn,changed,context);return notify(value)};value=computeDependencies(self,fn,changed,context)}else{self=function(newValue){if(arguments.length>0){if(value!==newValue){value=newValue;notify(newValue)}}else{magicDependency(self)}return value}}self.each=function(){var args,_ref;args=1<=arguments.length?__slice.call(arguments,0):[];magicDependency(self);if(value!=null){return(_ref=[value]).forEach.apply(_ref,args)}};if(Array.isArray(value)){[\"concat\",\"every\",\"filter\",\"forEach\",\"indexOf\",\"join\",\"lastIndexOf\",\"map\",\"reduce\",\"reduceRight\",\"slice\",\"some\"].forEach(function(method){return self[method]=function(){var args;args=1<=arguments.length?__slice.call(arguments,0):[];magicDependency(self);return value[method].apply(value,args)}});[\"pop\",\"push\",\"reverse\",\"shift\",\"splice\",\"sort\",\"unshift\"].forEach(function(method){return self[method]=function(){var args;args=1<=arguments.length?__slice.call(arguments,0):[];return notifyReturning(value[method].apply(value,args))}});notifyReturning=function(returnValue){notify(value);return returnValue};extend(self,{each:function(){var args;args=1<=arguments.length?__slice.call(arguments,0):[];self.forEach.apply(self,args);return self},remove:function(object){var index;index=value.indexOf(object);if(index>=0){return notifyReturning(value.splice(index,1)[0])}},get:function(index){return value[index]},first:function(){return value[0]},last:function(){return value[value.length-1]}})}extend(self,{listeners:listeners,observe:function(listener){return listeners.push(listener)},stopObserving:function(fn){return remove(listeners,fn)},toggle:function(){return self(!value)},increment:function(n){return self(value+n)},decrement:function(n){return self(value-n)},toString:function(){return\"Observable(\"+value+\")\"}});return self};Observable.concat=function(){var args,o;args=1<=arguments.length?__slice.call(arguments,0):[];args=Observable(args);o=Observable(function(){return flatten(args.map(splat))});o.push=args.push;return o};module.exports=Observable;extend=function(){var name,source,sources,target,_i,_len;target=arguments[0],sources=2<=arguments.length?__slice.call(arguments,1):[];for(_i=0,_len=sources.length;_i<_len;_i++){source=sources[_i];for(name in source){target[name]=source[name]}}return target};global.OBSERVABLE_ROOT_HACK=[];autoDeps=function(){return last(global.OBSERVABLE_ROOT_HACK)};magicDependency=function(self){var observerStack;if(observerStack=autoDeps()){return observerStack.push(self)}};withBase=function(self,update,fn){var deps,value,_ref;global.OBSERVABLE_ROOT_HACK.push(deps=[]);try{value=fn();if((_ref=self._deps)!=null){_ref.forEach(function(observable){return observable.stopObserving(update)})}self._deps=deps;deps.forEach(function(observable){return observable.observe(update)})}finally{global.OBSERVABLE_ROOT_HACK.pop()}return value};computeDependencies=function(self,fn,update,context){return withBase(self,update,function(){return fn.call(context)})};remove=function(array,value){var index;index=array.indexOf(value);if(index>=0){return array.splice(index,1)[0]}};copy=function(array){return array.concat([])};get=function(arg){if(typeof arg===\"function\"){return arg()}else{return arg}};splat=function(item){var result,results;results=[];if(typeof item.forEach===\"function\"){item.forEach(function(i){return results.push(i)})}else{result=get(item);if(result!=null){results.push(result)}}return results};last=function(array){return array[array.length-1]};flatten=function(array){return array.reduce(function(a,b){return a.concat(b)},[])}}.call(this);\n}).call(this,typeof self !== \"undefined\" ? self : typeof window !== \"undefined\" ? window : {})\n},{}]},{},[1])\n(1)\n});\n",
      "type": "blob"
    },
    "lib/jquery.property_editor": {
      "path": "lib/jquery.property_editor",
      "content": "(function() {\n  var parse;\n\n  (function($) {\n    return $.fn.propertyEditor = function(properties, options) {\n      var addNestedRow, addRow, element, fireDirtyEvent, makeKeyInput, makeValueInput, object, processInputChanges, rowCheck;\n      if (properties == null) {\n        properties = {};\n      }\n      if (options == null) {\n        options = {};\n      }\n      object = properties;\n      element = this.eq(0);\n      if (Array.isArray(object)) {\n        element.addClass(\"array\");\n      } else {\n        element.addClass(\"properties\");\n      }\n      element.getProps = function() {\n        return object;\n      };\n      element.setProps = function(properties) {\n        if (properties == null) {\n          properties = {};\n        }\n        object = properties;\n        element.html('');\n        Object.keys(object).forEach(function(key) {\n          var value;\n          value = object[key];\n          if (typeof value === \"object\") {\n            return addNestedRow(key, value);\n          } else {\n            return addRow(key, value);\n          }\n        });\n        rowCheck();\n        return element;\n      };\n      rowCheck = function() {\n        debugger;\n        var input;\n        if ((input = element.children(\".row\").last().find(\"input\").first()).length) {\n          if (input.val()) {\n            return addRow('', '');\n          }\n        } else {\n          return addRow('', '');\n        }\n      };\n      fireDirtyEvent = function() {\n        var error;\n        try {\n          return element.trigger(\"dirty\", [object]);\n        } catch (_error) {\n          error = _error;\n          return typeof console !== \"undefined\" && console !== null ? typeof console.error === \"function\" ? console.error(error) : void 0 : void 0;\n        }\n      };\n      processInputChanges = function() {\n        fireDirtyEvent();\n        return rowCheck();\n      };\n      makeKeyInput = function(key, valueFn) {\n        var input;\n        input = $(\"<input>\", {\n          \"class\": \"key\",\n          data: {\n            previousName: key\n          },\n          type: \"text\",\n          placeholder: \"key\",\n          value: key\n        });\n        input.on('input change', function(e) {\n          var $this, currentName, previousName;\n          $this = $(this);\n          currentName = $this.val();\n          previousName = $this.data(\"previousName\");\n          if (currentName !== previousName) {\n            $this.data(\"previousName\", currentName);\n            delete object[previousName];\n            if (currentName === \"\") {\n              return;\n            }\n            object[currentName] = valueFn();\n            return processInputChanges();\n          }\n        }).on(\"keydown\", function(e) {\n          var nextInput, prevInput;\n          if (e.keyCode === 13) {\n            nextInput = input.next(\"input\").first() || input.next().find(\"input\").first();\n            setTimeout(function() {\n              return nextInput.focus();\n            });\n          }\n          if (input.val() === \"\" && e.keyCode === 8) {\n            prevInput = input.parent().prev().find(\"input\").last();\n            setTimeout(function() {\n              return prevInput.focus();\n            });\n            return input.parent().remove();\n          }\n        });\n        return input;\n      };\n      makeValueInput = function(value, keyFn, removeFn) {\n        var input;\n        return input = $(\"<input>\", {\n          \"class\": \"value\",\n          data: {\n            previousValue: value\n          },\n          placeholder: \"value\",\n          value: value\n        }).on('input change', function(e) {\n          var $this, currentValue, key, previousValue;\n          $this = $(this);\n          currentValue = parse($this.val());\n          previousValue = $this.data(\"previousValue\");\n          if (currentValue !== previousValue) {\n            key = keyFn();\n            $this.data(\"previousValue\", currentValue);\n            object[key] = currentValue;\n            return processInputChanges();\n          }\n        }).on('keydown', function(e) {\n          var nextInput;\n          if ($(this).val() === \"\" && e.keyCode === 8) {\n            removeFn();\n          }\n          if (e.keyCode === 13) {\n            nextInput = input.parent().next().find(\"input\").first();\n            return setTimeout(function() {\n              return nextInput.focus();\n            });\n          }\n        });\n      };\n      addRow = function(key, value) {\n        var keyFn, keyInput, removeFn, row, valueFn, valueInput;\n        row = $(\"<div>\", {\n          \"class\": \"row\"\n        });\n        valueFn = function() {\n          return parse(valueInput.val());\n        };\n        if (Array.isArray(object)) {\n          keyFn = function() {\n            return valueInput.parent().index();\n          };\n          removeFn = function() {\n            var prevInput;\n            object.splice(keyFn(), 1);\n            prevInput = valueInput.parent().prev().find(\"input\").last();\n            setTimeout(function() {\n              return prevInput.focus();\n            });\n            return row.remove();\n          };\n        } else {\n          keyInput = makeKeyInput(key, valueFn).appendTo(row);\n          keyFn = function() {\n            return keyInput.val();\n          };\n          removeFn = function() {\n            return setTimeout(function() {\n              return valueInput.prev().focus();\n            });\n          };\n        }\n        valueInput = makeValueInput(value, keyFn, removeFn).appendTo(row);\n        return row.appendTo(element);\n      };\n      addNestedRow = function(key, value) {\n        var nestedEditor, row, valueFn;\n        row = $(\"<div>\", {\n          \"class\": \"row\"\n        });\n        valueFn = function() {\n          return value;\n        };\n        makeKeyInput(key, valueFn).appendTo(row);\n        if (Array.isArray(value)) {\n          row.append(\" : [\");\n        } else if (typeof value === \"object\") {\n          row.append(\" : {\");\n        }\n        nestedEditor = $(\"<div>\").appendTo(row).propertyEditor(value);\n        nestedEditor.bind(\"change\", function(event, changedNestedObject) {\n          event.stopPropagation();\n          return fireDirtyEvent();\n        });\n        if (Array.isArray(value)) {\n          row.append(\" ]\");\n        } else if (typeof value === \"object\") {\n          row.append(\" }\");\n        }\n        return row.appendTo(element);\n      };\n      return element.setProps(properties);\n    };\n  })(jQuery);\n\n  parse = function(string) {\n    try {\n      return JSON.parse(string);\n    } catch (_error) {\n      return string;\n    }\n  };\n\n}).call(this);\n",
      "type": "blob"
    }
  },
  "progenitor": {
    "url": "http://www.danielx.net/editor/"
  },
  "version": "0.1.0",
  "entryPoint": "main",
  "remoteDependencies": [
    "https://code.jquery.com/jquery-1.11.0.min.js"
  ],
  "repository": {
    "branch": "master",
    "default_branch": "master",
    "full_name": "distri/json-widget",
    "homepage": null,
    "description": "Edit JSON as a tree of editable nodes",
    "html_url": "https://github.com/distri/json-widget",
    "url": "https://api.github.com/repos/distri/json-widget",
    "publishBranch": "gh-pages"
  },
  "dependencies": {
    "observable": {
      "source": {
        "LICENSE": {
          "path": "LICENSE",
          "content": "The MIT License (MIT)\n\nCopyright (c) 2014 distri\n\nPermission is hereby granted, free of charge, to any person obtaining a copy of\nthis software and associated documentation files (the \"Software\"), to deal in\nthe Software without restriction, including without limitation the rights to\nuse, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of\nthe Software, and to permit persons to whom the Software is furnished to do so,\nsubject to the following conditions:\n\nThe above copyright notice and this permission notice shall be included in all\ncopies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\nIMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS\nFOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR\nCOPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER\nIN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN\nCONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.\n",
          "mode": "100644",
          "type": "blob"
        },
        "README.md": {
          "path": "README.md",
          "content": "[![Build Status](https://travis-ci.org/distri/observable.svg?branch=npm)](https://travis-ci.org/distri/observable)\n\nObservable\n==========\n\nInstallation\n------------\n\nNode\n\n    npm install o_0\n\nUsage\n-----\n\n    Observable = require \"o_0\"\n\nGet notified when the value changes.\n\n    observable = Observable 5\n\n    observable() # 5\n\n    observable.observe (newValue) ->\n      console.log newValue\n\n    observable 10 # logs 10 to console\n\nArrays\n------\n\nProxy array methods.\n\n    observable = Observable [1, 2, 3]\n\n    observable.forEach (value) ->\n      # 1, 2, 3\n\nFunctions\n---------\n\nAutomagically compute dependencies for observable functions.\n\n    firstName = Observable \"Duder\"\n    lastName = Observable \"Man\"\n\n    o = Observable ->\n      \"#{firstName()} #{lastName()}\"\n\n    o.observe (newValue) ->\n      assert.equal newValue, \"Duder Bro\"\n\n    lastName \"Bro\"\n",
          "mode": "100644",
          "type": "blob"
        },
        "main.coffee.md": {
          "path": "main.coffee.md",
          "content": "Observable\n==========\n\n`Observable` allows for observing arrays, functions, and objects.\n\nFunction dependencies are automagically observed.\n\nStandard array methods are proxied through to the underlying array.\n\n    Observable = (value, context) ->\n\nReturn the object if it is already an observable object.\n\n      return value if typeof value?.observe is \"function\"\n\nMaintain a set of listeners to observe changes and provide a helper to notify each observer.\n\n      listeners = []\n\n      notify = (newValue) ->\n        copy(listeners).forEach (listener) ->\n          listener(newValue)\n\nOur observable function is stored as a reference to `self`.\n\nIf `value` is a function compute dependencies and listen to observables that it depends on.\n\n      if typeof value is 'function'\n        fn = value\n\nOur return function is a function that holds only a cached value which is updated\nwhen it's dependencies change.\n\nThe `magicDependency` call is so other functions can depend on this computed function the\nsame way we depend on other types of observables.\n\n        self = ->\n          # Automagic dependency observation\n          magicDependency(self)\n\n          return value\n\n        self.each = (args...) ->\n          magicDependency(self)\n\n          splat(value).forEach(args...)\n\n        changed = ->\n          value = computeDependencies(self, fn, changed, context)\n          notify(value)\n\n        value = computeDependencies(self, fn, changed, context)\n\n      else\n\nWhen called with zero arguments it is treated as a getter. When called with one argument it is treated as a setter.\n\nChanges to the value will trigger notifications.\n\nThe value is always returned.\n\n        self = (newValue) ->\n          if arguments.length > 0\n            if value != newValue\n              value = newValue\n\n              notify(newValue)\n          else\n            # Automagic dependency observation\n            magicDependency(self)\n\n          return value\n\nThis `each` iterator is similar to [the Maybe monad](http://en.wikipedia.org/wiki/Monad_&#40;functional_programming&#41;#The_Maybe_monad) in that our observable may contain a single value or nothing at all.\n\n      self.each = (args...) ->\n        magicDependency(self)\n\n        if value?\n          [value].forEach(args...)\n\nIf the value is an array then proxy array methods and add notifications to mutation events.\n\n      if Array.isArray(value)\n        [\n          \"concat\"\n          \"every\"\n          \"filter\"\n          \"forEach\"\n          \"indexOf\"\n          \"join\"\n          \"lastIndexOf\"\n          \"map\"\n          \"reduce\"\n          \"reduceRight\"\n          \"slice\"\n          \"some\"\n        ].forEach (method) ->\n          self[method] = (args...) ->\n            magicDependency(self)\n            value[method](args...)\n\n        [\n          \"pop\"\n          \"push\"\n          \"reverse\"\n          \"shift\"\n          \"splice\"\n          \"sort\"\n          \"unshift\"\n        ].forEach (method) ->\n          self[method] = (args...) ->\n            notifyReturning value[method](args...)\n\n        notifyReturning = (returnValue) ->\n          notify(value)\n\n          return returnValue\n\nAdd some extra helpful methods to array observables.\n\n        extend self,\n          each: (args...) ->\n            self.forEach(args...)\n\n            return self\n\nRemove an element from the array and notify observers of changes.\n\n          remove: (object) ->\n            index = value.indexOf(object)\n\n            if index >= 0\n              notifyReturning value.splice(index, 1)[0]\n\n          get: (index) ->\n            value[index]\n\n          first: ->\n            value[0]\n\n          last: ->\n            value[value.length-1]\n\n      extend self,\n        listeners: listeners\n\n        observe: (listener) ->\n          listeners.push listener\n\n        stopObserving: (fn) ->\n          remove listeners, fn\n\n        toggle: ->\n          self !value\n\n        increment: (n) ->\n          self value + n\n\n        decrement: (n) ->\n          self value - n\n\n        toString: ->\n          \"Observable(#{value})\"\n\n      return self\n\n    Observable.concat = (args...) ->\n      args = Observable(args)\n\n      o = Observable ->\n        flatten args.map(splat)\n\n      o.push = args.push\n\n      return o\n\nExport `Observable`\n\n    module.exports = Observable\n\nAppendix\n--------\n\nThe extend method adds one objects properties to another.\n\n    extend = (target, sources...) ->\n      for source in sources\n        for name of source\n          target[name] = source[name]\n\n      return target\n\nSuper hax for computing dependencies. This needs to be a shared global so that\ndifferent bundled versions of observable libraries can interoperate.\n\n    global.OBSERVABLE_ROOT_HACK = []\n\n    autoDeps = ->\n      last(global.OBSERVABLE_ROOT_HACK)\n\n    magicDependency = (self) ->\n      if observerStack = autoDeps()\n        observerStack.push self\n\n    withBase = (self, update, fn) ->\n      global.OBSERVABLE_ROOT_HACK.push(deps = [])\n\n      try\n        value = fn()\n        self._deps?.forEach (observable) ->\n          observable.stopObserving update\n\n        self._deps = deps\n\n        deps.forEach (observable) ->\n          observable.observe update\n      finally\n        global.OBSERVABLE_ROOT_HACK.pop()\n\n      return value\n\nAutomagically compute dependencies.\n\n    computeDependencies = (self, fn, update, context) ->\n      withBase self, update, ->\n        fn.call(context)\n\nRemove a value from an array.\n\n    remove = (array, value) ->\n      index = array.indexOf(value)\n\n      if index >= 0\n        array.splice(index, 1)[0]\n\n    copy = (array) ->\n      array.concat([])\n\n    get = (arg) ->\n      if typeof arg is \"function\"\n        arg()\n      else\n        arg\n\n    splat = (item) ->\n      results = []\n\n      if typeof item.forEach is \"function\"\n        item.forEach (i) ->\n          results.push i\n      else\n        result = get item\n\n        results.push result if result?\n\n      results\n\n    last = (array) ->\n      array[array.length - 1]\n\n    flatten = (array) ->\n      array.reduce (a, b) ->\n        a.concat(b)\n      , []\n",
          "mode": "100644",
          "type": "blob"
        },
        "pixie.cson": {
          "path": "pixie.cson",
          "content": "version: \"0.2.0-pre.1\"\n",
          "mode": "100644",
          "type": "blob"
        },
        "test/observable.coffee": {
          "path": "test/observable.coffee",
          "content": "global.Observable = require \"../main\"\n\ndescribe 'Observable', ->\n  it 'should create an observable for an object', ->\n    n = 5\n\n    observable = Observable(n)\n\n    assert.equal(observable(), n)\n\n  it 'should fire events when setting', ->\n    string = \"yolo\"\n\n    observable = Observable(string)\n    observable.observe (newValue) ->\n      assert.equal newValue, \"4life\"\n\n    observable(\"4life\")\n\n  it 'should be idempotent', ->\n    o = Observable(5)\n\n    assert.equal o, Observable(o)\n\n  describe \"#each\", ->\n    it \"should be invoked once if there is an observable\", ->\n      o = Observable(5)\n      called = 0\n\n      o.each (value) ->\n        called += 1\n        assert.equal value, 5\n\n      assert.equal called, 1\n\n    it \"should not be invoked if observable is null\", ->\n      o = Observable(null)\n      called = 0\n\n      o.each (value) ->\n        called += 1\n\n      assert.equal called, 0\n\n  it \"should allow for stopping observation\", ->\n    observable = Observable(\"string\")\n\n    called = 0\n    fn = (newValue) ->\n      called += 1\n      assert.equal newValue, \"4life\"\n\n    observable.observe fn\n\n    observable(\"4life\")\n\n    observable.stopObserving fn\n\n    observable(\"wat\")\n\n    assert.equal called, 1\n\n  it \"should increment\", ->\n    observable = Observable 1\n\n    observable.increment(5)\n\n    assert.equal observable(), 6\n\n  it \"should decremnet\", ->\n    observable = Observable 1\n\n    observable.decrement 5\n\n    assert.equal observable(), -4\n\n  it \"should toggle\", ->\n    observable = Observable false\n\n    observable.toggle()\n    assert.equal observable(), true\n\n    observable.toggle()\n    assert.equal observable(), false\n\n  it \"should trigger when toggling\", (done) ->\n    observable = Observable true\n    observable.observe (v) ->\n      assert.equal v, false\n      done()\n\n    observable.toggle()\n\ndescribe \"Observable Array\", ->\n  it \"should proxy array methods\", ->\n    o = Observable [5]\n\n    o.map (n) ->\n      assert.equal n, 5\n\n  it \"should notify on mutation methods\", (done) ->\n    o = Observable []\n\n    o.observe (newValue) ->\n      assert.equal newValue[0], 1\n\n    o.push 1\n\n    done()\n\n  it \"should have an each method\", ->\n    o = Observable []\n\n    assert o.each\n\n  it \"#get\", ->\n    o = Observable [0, 1, 2, 3]\n\n    assert.equal o.get(2), 2\n\n  it \"#first\", ->\n    o = Observable [0, 1, 2, 3]\n\n    assert.equal o.first(), 0\n\n  it \"#last\", ->\n    o = Observable [0, 1, 2, 3]\n\n    assert.equal o.last(), 3\n\n  it \"#remove\", (done) ->\n    o = Observable [0, 1, 2, 3]\n\n    o.observe (newValue) ->\n      assert.equal newValue.length, 3\n      setTimeout ->\n        done()\n      , 0\n\n    assert.equal o.remove(2), 2\n\n  # TODO: This looks like it might be impossible\n  it \"should proxy the length property\"\n\ndescribe \"Observable functions\", ->\n  it \"should compute dependencies\", (done) ->\n    firstName = Observable \"Duder\"\n    lastName = Observable \"Man\"\n\n    o = Observable ->\n      \"#{firstName()} #{lastName()}\"\n\n    o.observe (newValue) ->\n      assert.equal newValue, \"Duder Bro\"\n\n      done()\n\n    lastName \"Bro\"\n\n  it \"should allow double nesting\", (done) ->\n    bottom = Observable \"rad\"\n    middle = Observable ->\n      bottom()\n    top = Observable ->\n      middle()\n\n    top.observe (newValue) ->\n      assert.equal newValue, \"wat\"\n      assert.equal top(), newValue\n      assert.equal middle(), newValue\n\n      done()\n\n    bottom(\"wat\")\n\n  it \"should work with dynamic dependencies\", ->\n    observableArray = Observable []\n\n    dynamicObservable = Observable ->\n      observableArray.filter (item) ->\n        item.age() > 3\n\n    assert.equal dynamicObservable().length, 0\n\n    observableArray.push\n      age: Observable 1\n\n    observableArray()[0].age 5\n    assert.equal dynamicObservable().length, 1\n\n  it \"should work with context\", ->\n    model =\n      a: Observable \"Hello\"\n      b: Observable \"there\"\n\n    model.c = Observable ->\n      \"#{@a()} #{@b()}\"\n    , model\n\n    assert.equal model.c(), \"Hello there\"\n\n    model.b \"world\"\n\n    assert.equal model.c(), \"Hello world\"\n\n  it \"should be ok even if the function throws an exception\", ->\n    assert.throws ->\n      t = Observable ->\n        throw \"wat\"\n\n    # TODO: Should be able to find a test case that is affected by this rather that\n    # checking it directly\n    assert.equal global.OBSERVABLE_ROOT_HACK.length, 0\n\n  it \"should have an each method\", ->\n    o = Observable ->\n\n    assert o.each\n\n  it \"should not invoke when returning undefined\", ->\n    o = Observable ->\n\n    o.each ->\n      assert false\n\n  it \"should invoke when returning any defined value\", (done) ->\n    o = Observable -> 5\n\n    o.each (n) ->\n      assert.equal n, 5\n      done()\n\n  it \"should work on an array dependency\", ->\n    oA = Observable [1, 2, 3]\n\n    o = Observable ->\n      oA()[0]\n\n    last = Observable ->\n      oA()[oA().length-1]\n\n    assert.equal o(), 1\n\n    oA.unshift 0\n\n    assert.equal o(), 0\n\n    oA.push 4\n\n    assert.equal last(), 4, \"Last should be 4\"\n\n  it \"should work with multiple dependencies\", ->\n    letter = Observable \"A\"\n    checked = ->\n      l = letter()\n      @name().indexOf(l) is 0\n\n    first = {name: Observable(\"Andrew\")}\n    first.checked = Observable checked, first\n\n    second = {name: Observable(\"Benjamin\")}\n    second.checked = Observable checked, second\n\n    assert.equal first.checked(), true\n    assert.equal second.checked(), false\n\n    assert.equal letter.listeners.length, 2\n\n    letter \"B\"\n\n    assert.equal first.checked(), false\n    assert.equal second.checked(), true\n\n  it \"should work with nested observable construction\", ->\n    gen = Observable ->\n      Observable \"Duder\"\n\n    o = gen()\n\n    assert.equal o(), \"Duder\"\n\n    o(\"wat\")\n\n    assert.equal o(), \"wat\"\n\n  describe \"Scoping\", ->\n    it \"should be scoped to optional context\", (done) ->\n      model =\n        firstName: Observable \"Duder\"\n        lastName: Observable \"Man\"\n\n      model.name = Observable ->\n        \"#{@firstName()} #{@lastName()}\"\n      , model\n\n      model.name.observe (newValue) ->\n        assert.equal newValue, \"Duder Bro\"\n\n        done()\n\n      model.lastName \"Bro\"\n\n  describe \"concat\", ->\n    it \"should return an observable array that changes based on changes in inputs\", ->\n      numbers = Observable [1, 2, 3]\n      letters = Observable [\"a\", \"b\", \"c\"]\n      item = Observable({})\n      nullable = Observable null\n\n      observableArray = Observable.concat numbers, \"literal\", letters, item, nullable\n\n      assert.equal observableArray().length, 3 + 1 + 3 + 1\n\n      assert.equal observableArray()[0], 1\n      assert.equal observableArray()[3], \"literal\"\n      assert.equal observableArray()[4], \"a\"\n      assert.equal observableArray()[7], item()\n\n      numbers.push 4\n\n      assert.equal observableArray().length, 9\n\n      nullable \"cool\"\n\n      assert.equal observableArray().length, 10\n\n    it \"should work with observable functions that return arrays\", ->\n      item = Observable(\"wat\")\n\n      computedArray = Observable ->\n        [item()]\n\n      observableArray = Observable.concat computedArray, computedArray\n\n      assert.equal observableArray().length, 2\n\n      assert.equal observableArray()[1], \"wat\"\n\n      item \"yolo\"\n\n      assert.equal observableArray()[1], \"yolo\"\n\n    it \"should have a push method\", ->\n      observableArray = Observable.concat()\n\n      observable = Observable \"hey\"\n\n      observableArray.push observable\n\n      assert.equal observableArray()[0], \"hey\"\n\n      observable \"wat\"\n\n      assert.equal observableArray()[0], \"wat\"\n\n      observableArray.push \"cool\"\n      observableArray.push \"radical\"\n\n      assert.equal observableArray().length, 3\n\n    it \"should be observable\", (done) ->\n      observableArray = Observable.concat()\n\n      observableArray.observe (items) ->\n        assert.equal items.length, 3\n        done()\n\n      observableArray.push [\"A\", \"B\", \"C\"]\n\n    it \"should have an each method\", ->\n      observableArray = Observable.concat([\"A\", \"B\", \"C\"])\n\n      n = 0\n      observableArray.each () ->\n        n += 1\n\n      assert.equal n, 3\n",
          "mode": "100644",
          "type": "blob"
        }
      },
      "distribution": {
        "main": {
          "path": "main",
          "content": "(function() {\n  var Observable, autoDeps, computeDependencies, copy, extend, flatten, get, last, magicDependency, remove, splat, withBase,\n    __slice = [].slice;\n\n  Observable = function(value, context) {\n    var changed, fn, listeners, notify, notifyReturning, self;\n    if (typeof (value != null ? value.observe : void 0) === \"function\") {\n      return value;\n    }\n    listeners = [];\n    notify = function(newValue) {\n      return copy(listeners).forEach(function(listener) {\n        return listener(newValue);\n      });\n    };\n    if (typeof value === 'function') {\n      fn = value;\n      self = function() {\n        magicDependency(self);\n        return value;\n      };\n      self.each = function() {\n        var args, _ref;\n        args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];\n        magicDependency(self);\n        return (_ref = splat(value)).forEach.apply(_ref, args);\n      };\n      changed = function() {\n        value = computeDependencies(self, fn, changed, context);\n        return notify(value);\n      };\n      value = computeDependencies(self, fn, changed, context);\n    } else {\n      self = function(newValue) {\n        if (arguments.length > 0) {\n          if (value !== newValue) {\n            value = newValue;\n            notify(newValue);\n          }\n        } else {\n          magicDependency(self);\n        }\n        return value;\n      };\n    }\n    self.each = function() {\n      var args, _ref;\n      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];\n      magicDependency(self);\n      if (value != null) {\n        return (_ref = [value]).forEach.apply(_ref, args);\n      }\n    };\n    if (Array.isArray(value)) {\n      [\"concat\", \"every\", \"filter\", \"forEach\", \"indexOf\", \"join\", \"lastIndexOf\", \"map\", \"reduce\", \"reduceRight\", \"slice\", \"some\"].forEach(function(method) {\n        return self[method] = function() {\n          var args;\n          args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];\n          magicDependency(self);\n          return value[method].apply(value, args);\n        };\n      });\n      [\"pop\", \"push\", \"reverse\", \"shift\", \"splice\", \"sort\", \"unshift\"].forEach(function(method) {\n        return self[method] = function() {\n          var args;\n          args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];\n          return notifyReturning(value[method].apply(value, args));\n        };\n      });\n      notifyReturning = function(returnValue) {\n        notify(value);\n        return returnValue;\n      };\n      extend(self, {\n        each: function() {\n          var args;\n          args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];\n          self.forEach.apply(self, args);\n          return self;\n        },\n        remove: function(object) {\n          var index;\n          index = value.indexOf(object);\n          if (index >= 0) {\n            return notifyReturning(value.splice(index, 1)[0]);\n          }\n        },\n        get: function(index) {\n          return value[index];\n        },\n        first: function() {\n          return value[0];\n        },\n        last: function() {\n          return value[value.length - 1];\n        }\n      });\n    }\n    extend(self, {\n      listeners: listeners,\n      observe: function(listener) {\n        return listeners.push(listener);\n      },\n      stopObserving: function(fn) {\n        return remove(listeners, fn);\n      },\n      toggle: function() {\n        return self(!value);\n      },\n      increment: function(n) {\n        return self(value + n);\n      },\n      decrement: function(n) {\n        return self(value - n);\n      },\n      toString: function() {\n        return \"Observable(\" + value + \")\";\n      }\n    });\n    return self;\n  };\n\n  Observable.concat = function() {\n    var args, o;\n    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];\n    args = Observable(args);\n    o = Observable(function() {\n      return flatten(args.map(splat));\n    });\n    o.push = args.push;\n    return o;\n  };\n\n  module.exports = Observable;\n\n  extend = function() {\n    var name, source, sources, target, _i, _len;\n    target = arguments[0], sources = 2 <= arguments.length ? __slice.call(arguments, 1) : [];\n    for (_i = 0, _len = sources.length; _i < _len; _i++) {\n      source = sources[_i];\n      for (name in source) {\n        target[name] = source[name];\n      }\n    }\n    return target;\n  };\n\n  global.OBSERVABLE_ROOT_HACK = [];\n\n  autoDeps = function() {\n    return last(global.OBSERVABLE_ROOT_HACK);\n  };\n\n  magicDependency = function(self) {\n    var observerStack;\n    if (observerStack = autoDeps()) {\n      return observerStack.push(self);\n    }\n  };\n\n  withBase = function(self, update, fn) {\n    var deps, value, _ref;\n    global.OBSERVABLE_ROOT_HACK.push(deps = []);\n    try {\n      value = fn();\n      if ((_ref = self._deps) != null) {\n        _ref.forEach(function(observable) {\n          return observable.stopObserving(update);\n        });\n      }\n      self._deps = deps;\n      deps.forEach(function(observable) {\n        return observable.observe(update);\n      });\n    } finally {\n      global.OBSERVABLE_ROOT_HACK.pop();\n    }\n    return value;\n  };\n\n  computeDependencies = function(self, fn, update, context) {\n    return withBase(self, update, function() {\n      return fn.call(context);\n    });\n  };\n\n  remove = function(array, value) {\n    var index;\n    index = array.indexOf(value);\n    if (index >= 0) {\n      return array.splice(index, 1)[0];\n    }\n  };\n\n  copy = function(array) {\n    return array.concat([]);\n  };\n\n  get = function(arg) {\n    if (typeof arg === \"function\") {\n      return arg();\n    } else {\n      return arg;\n    }\n  };\n\n  splat = function(item) {\n    var result, results;\n    results = [];\n    if (typeof item.forEach === \"function\") {\n      item.forEach(function(i) {\n        return results.push(i);\n      });\n    } else {\n      result = get(item);\n      if (result != null) {\n        results.push(result);\n      }\n    }\n    return results;\n  };\n\n  last = function(array) {\n    return array[array.length - 1];\n  };\n\n  flatten = function(array) {\n    return array.reduce(function(a, b) {\n      return a.concat(b);\n    }, []);\n  };\n\n}).call(this);\n",
          "type": "blob"
        },
        "pixie": {
          "path": "pixie",
          "content": "module.exports = {\"version\":\"0.2.0-pre.1\"};",
          "type": "blob"
        },
        "test/observable": {
          "path": "test/observable",
          "content": "(function() {\n  global.Observable = require(\"../main\");\n\n  describe('Observable', function() {\n    it('should create an observable for an object', function() {\n      var n, observable;\n      n = 5;\n      observable = Observable(n);\n      return assert.equal(observable(), n);\n    });\n    it('should fire events when setting', function() {\n      var observable, string;\n      string = \"yolo\";\n      observable = Observable(string);\n      observable.observe(function(newValue) {\n        return assert.equal(newValue, \"4life\");\n      });\n      return observable(\"4life\");\n    });\n    it('should be idempotent', function() {\n      var o;\n      o = Observable(5);\n      return assert.equal(o, Observable(o));\n    });\n    describe(\"#each\", function() {\n      it(\"should be invoked once if there is an observable\", function() {\n        var called, o;\n        o = Observable(5);\n        called = 0;\n        o.each(function(value) {\n          called += 1;\n          return assert.equal(value, 5);\n        });\n        return assert.equal(called, 1);\n      });\n      return it(\"should not be invoked if observable is null\", function() {\n        var called, o;\n        o = Observable(null);\n        called = 0;\n        o.each(function(value) {\n          return called += 1;\n        });\n        return assert.equal(called, 0);\n      });\n    });\n    it(\"should allow for stopping observation\", function() {\n      var called, fn, observable;\n      observable = Observable(\"string\");\n      called = 0;\n      fn = function(newValue) {\n        called += 1;\n        return assert.equal(newValue, \"4life\");\n      };\n      observable.observe(fn);\n      observable(\"4life\");\n      observable.stopObserving(fn);\n      observable(\"wat\");\n      return assert.equal(called, 1);\n    });\n    it(\"should increment\", function() {\n      var observable;\n      observable = Observable(1);\n      observable.increment(5);\n      return assert.equal(observable(), 6);\n    });\n    it(\"should decremnet\", function() {\n      var observable;\n      observable = Observable(1);\n      observable.decrement(5);\n      return assert.equal(observable(), -4);\n    });\n    it(\"should toggle\", function() {\n      var observable;\n      observable = Observable(false);\n      observable.toggle();\n      assert.equal(observable(), true);\n      observable.toggle();\n      return assert.equal(observable(), false);\n    });\n    return it(\"should trigger when toggling\", function(done) {\n      var observable;\n      observable = Observable(true);\n      observable.observe(function(v) {\n        assert.equal(v, false);\n        return done();\n      });\n      return observable.toggle();\n    });\n  });\n\n  describe(\"Observable Array\", function() {\n    it(\"should proxy array methods\", function() {\n      var o;\n      o = Observable([5]);\n      return o.map(function(n) {\n        return assert.equal(n, 5);\n      });\n    });\n    it(\"should notify on mutation methods\", function(done) {\n      var o;\n      o = Observable([]);\n      o.observe(function(newValue) {\n        return assert.equal(newValue[0], 1);\n      });\n      o.push(1);\n      return done();\n    });\n    it(\"should have an each method\", function() {\n      var o;\n      o = Observable([]);\n      return assert(o.each);\n    });\n    it(\"#get\", function() {\n      var o;\n      o = Observable([0, 1, 2, 3]);\n      return assert.equal(o.get(2), 2);\n    });\n    it(\"#first\", function() {\n      var o;\n      o = Observable([0, 1, 2, 3]);\n      return assert.equal(o.first(), 0);\n    });\n    it(\"#last\", function() {\n      var o;\n      o = Observable([0, 1, 2, 3]);\n      return assert.equal(o.last(), 3);\n    });\n    it(\"#remove\", function(done) {\n      var o;\n      o = Observable([0, 1, 2, 3]);\n      o.observe(function(newValue) {\n        assert.equal(newValue.length, 3);\n        return setTimeout(function() {\n          return done();\n        }, 0);\n      });\n      return assert.equal(o.remove(2), 2);\n    });\n    return it(\"should proxy the length property\");\n  });\n\n  describe(\"Observable functions\", function() {\n    it(\"should compute dependencies\", function(done) {\n      var firstName, lastName, o;\n      firstName = Observable(\"Duder\");\n      lastName = Observable(\"Man\");\n      o = Observable(function() {\n        return \"\" + (firstName()) + \" \" + (lastName());\n      });\n      o.observe(function(newValue) {\n        assert.equal(newValue, \"Duder Bro\");\n        return done();\n      });\n      return lastName(\"Bro\");\n    });\n    it(\"should allow double nesting\", function(done) {\n      var bottom, middle, top;\n      bottom = Observable(\"rad\");\n      middle = Observable(function() {\n        return bottom();\n      });\n      top = Observable(function() {\n        return middle();\n      });\n      top.observe(function(newValue) {\n        assert.equal(newValue, \"wat\");\n        assert.equal(top(), newValue);\n        assert.equal(middle(), newValue);\n        return done();\n      });\n      return bottom(\"wat\");\n    });\n    it(\"should work with dynamic dependencies\", function() {\n      var dynamicObservable, observableArray;\n      observableArray = Observable([]);\n      dynamicObservable = Observable(function() {\n        return observableArray.filter(function(item) {\n          return item.age() > 3;\n        });\n      });\n      assert.equal(dynamicObservable().length, 0);\n      observableArray.push({\n        age: Observable(1)\n      });\n      observableArray()[0].age(5);\n      return assert.equal(dynamicObservable().length, 1);\n    });\n    it(\"should work with context\", function() {\n      var model;\n      model = {\n        a: Observable(\"Hello\"),\n        b: Observable(\"there\")\n      };\n      model.c = Observable(function() {\n        return \"\" + (this.a()) + \" \" + (this.b());\n      }, model);\n      assert.equal(model.c(), \"Hello there\");\n      model.b(\"world\");\n      return assert.equal(model.c(), \"Hello world\");\n    });\n    it(\"should be ok even if the function throws an exception\", function() {\n      assert.throws(function() {\n        var t;\n        return t = Observable(function() {\n          throw \"wat\";\n        });\n      });\n      return assert.equal(global.OBSERVABLE_ROOT_HACK.length, 0);\n    });\n    it(\"should have an each method\", function() {\n      var o;\n      o = Observable(function() {});\n      return assert(o.each);\n    });\n    it(\"should not invoke when returning undefined\", function() {\n      var o;\n      o = Observable(function() {});\n      return o.each(function() {\n        return assert(false);\n      });\n    });\n    it(\"should invoke when returning any defined value\", function(done) {\n      var o;\n      o = Observable(function() {\n        return 5;\n      });\n      return o.each(function(n) {\n        assert.equal(n, 5);\n        return done();\n      });\n    });\n    it(\"should work on an array dependency\", function() {\n      var last, o, oA;\n      oA = Observable([1, 2, 3]);\n      o = Observable(function() {\n        return oA()[0];\n      });\n      last = Observable(function() {\n        return oA()[oA().length - 1];\n      });\n      assert.equal(o(), 1);\n      oA.unshift(0);\n      assert.equal(o(), 0);\n      oA.push(4);\n      return assert.equal(last(), 4, \"Last should be 4\");\n    });\n    it(\"should work with multiple dependencies\", function() {\n      var checked, first, letter, second;\n      letter = Observable(\"A\");\n      checked = function() {\n        var l;\n        l = letter();\n        return this.name().indexOf(l) === 0;\n      };\n      first = {\n        name: Observable(\"Andrew\")\n      };\n      first.checked = Observable(checked, first);\n      second = {\n        name: Observable(\"Benjamin\")\n      };\n      second.checked = Observable(checked, second);\n      assert.equal(first.checked(), true);\n      assert.equal(second.checked(), false);\n      assert.equal(letter.listeners.length, 2);\n      letter(\"B\");\n      assert.equal(first.checked(), false);\n      return assert.equal(second.checked(), true);\n    });\n    it(\"should work with nested observable construction\", function() {\n      var gen, o;\n      gen = Observable(function() {\n        return Observable(\"Duder\");\n      });\n      o = gen();\n      assert.equal(o(), \"Duder\");\n      o(\"wat\");\n      return assert.equal(o(), \"wat\");\n    });\n    describe(\"Scoping\", function() {\n      return it(\"should be scoped to optional context\", function(done) {\n        var model;\n        model = {\n          firstName: Observable(\"Duder\"),\n          lastName: Observable(\"Man\")\n        };\n        model.name = Observable(function() {\n          return \"\" + (this.firstName()) + \" \" + (this.lastName());\n        }, model);\n        model.name.observe(function(newValue) {\n          assert.equal(newValue, \"Duder Bro\");\n          return done();\n        });\n        return model.lastName(\"Bro\");\n      });\n    });\n    return describe(\"concat\", function() {\n      it(\"should return an observable array that changes based on changes in inputs\", function() {\n        var item, letters, nullable, numbers, observableArray;\n        numbers = Observable([1, 2, 3]);\n        letters = Observable([\"a\", \"b\", \"c\"]);\n        item = Observable({});\n        nullable = Observable(null);\n        observableArray = Observable.concat(numbers, \"literal\", letters, item, nullable);\n        assert.equal(observableArray().length, 3 + 1 + 3 + 1);\n        assert.equal(observableArray()[0], 1);\n        assert.equal(observableArray()[3], \"literal\");\n        assert.equal(observableArray()[4], \"a\");\n        assert.equal(observableArray()[7], item());\n        numbers.push(4);\n        assert.equal(observableArray().length, 9);\n        nullable(\"cool\");\n        return assert.equal(observableArray().length, 10);\n      });\n      it(\"should work with observable functions that return arrays\", function() {\n        var computedArray, item, observableArray;\n        item = Observable(\"wat\");\n        computedArray = Observable(function() {\n          return [item()];\n        });\n        observableArray = Observable.concat(computedArray, computedArray);\n        assert.equal(observableArray().length, 2);\n        assert.equal(observableArray()[1], \"wat\");\n        item(\"yolo\");\n        return assert.equal(observableArray()[1], \"yolo\");\n      });\n      it(\"should have a push method\", function() {\n        var observable, observableArray;\n        observableArray = Observable.concat();\n        observable = Observable(\"hey\");\n        observableArray.push(observable);\n        assert.equal(observableArray()[0], \"hey\");\n        observable(\"wat\");\n        assert.equal(observableArray()[0], \"wat\");\n        observableArray.push(\"cool\");\n        observableArray.push(\"radical\");\n        return assert.equal(observableArray().length, 3);\n      });\n      it(\"should be observable\", function(done) {\n        var observableArray;\n        observableArray = Observable.concat();\n        observableArray.observe(function(items) {\n          assert.equal(items.length, 3);\n          return done();\n        });\n        return observableArray.push([\"A\", \"B\", \"C\"]);\n      });\n      return it(\"should have an each method\", function() {\n        var n, observableArray;\n        observableArray = Observable.concat([\"A\", \"B\", \"C\"]);\n        n = 0;\n        observableArray.each(function() {\n          return n += 1;\n        });\n        return assert.equal(n, 3);\n      });\n    });\n  });\n\n}).call(this);\n",
          "type": "blob"
        }
      },
      "progenitor": {
        "url": "http://www.danielx.net/editor/"
      },
      "version": "0.2.0-pre.1",
      "entryPoint": "main",
      "repository": {
        "branch": "v0.2.0-pre.1",
        "default_branch": "master",
        "full_name": "distri/observable",
        "homepage": null,
        "description": "",
        "html_url": "https://github.com/distri/observable",
        "url": "https://api.github.com/repos/distri/observable",
        "publishBranch": "gh-pages"
      },
      "dependencies": {}
    },
    "postmaster": {
      "source": {
        "LICENSE": {
          "path": "LICENSE",
          "mode": "100644",
          "content": "The MIT License (MIT)\n\nCopyright (c) 2013 distri\n\nPermission is hereby granted, free of charge, to any person obtaining a copy of\nthis software and associated documentation files (the \"Software\"), to deal in\nthe Software without restriction, including without limitation the rights to\nuse, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of\nthe Software, and to permit persons to whom the Software is furnished to do so,\nsubject to the following conditions:\n\nThe above copyright notice and this permission notice shall be included in all\ncopies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\nIMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS\nFOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR\nCOPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER\nIN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN\nCONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.\n",
          "type": "blob"
        },
        "README.md": {
          "path": "README.md",
          "mode": "100644",
          "content": "postmaster\n==========\n\nSend and receive postMessage commands.\n",
          "type": "blob"
        },
        "main.coffee.md": {
          "path": "main.coffee.md",
          "mode": "100644",
          "content": "Postmaster\n==========\n\nPostmaster allows a child window that was opened from a parent window to\nreceive method calls from the parent window through the postMessage events.\n\nFigure out who we should be listening to.\n\n    dominant = opener or ((parent != window) and parent) or undefined\n\nBind postMessage events to methods.\n\n    module.exports = (I={}, self={}) ->\n      # Only listening to messages from `opener`\n      addEventListener \"message\", (event) ->\n        if event.source is dominant\n          {method, params, id} = event.data\n\n          try\n            result = self[method](params...)\n\n            send\n              success:\n                id: id\n                result: result\n          catch error\n            send\n              error:\n                id: id\n                message: error.message\n                stack: error.stack\n\n      addEventListener \"unload\", ->\n        send\n          status: \"unload\"\n\n      # Tell our opener that we're ready\n      send\n        status: \"ready\"\n\n      self.sendToParent = send\n\n      return self\n\n    send = (data) ->\n      dominant?.postMessage data, \"*\"\n",
          "type": "blob"
        },
        "pixie.cson": {
          "path": "pixie.cson",
          "mode": "100644",
          "content": "version: \"0.2.2\"\n",
          "type": "blob"
        },
        "test/postmaster.coffee": {
          "path": "test/postmaster.coffee",
          "mode": "100644",
          "content": "Postmaster = require \"../main\"\n\ndescribe \"Postmaster\", ->\n  it \"should allow sending messages to parent\", ->\n    postmaster = Postmaster()\n\n    postmaster.sendToParent\n      radical: \"true\"\n",
          "type": "blob"
        }
      },
      "distribution": {
        "main": {
          "path": "main",
          "content": "(function() {\n  var dominant, send;\n\n  dominant = opener || ((parent !== window) && parent) || void 0;\n\n  module.exports = function(I, self) {\n    if (I == null) {\n      I = {};\n    }\n    if (self == null) {\n      self = {};\n    }\n    addEventListener(\"message\", function(event) {\n      var error, id, method, params, result, _ref;\n      if (event.source === dominant) {\n        _ref = event.data, method = _ref.method, params = _ref.params, id = _ref.id;\n        try {\n          result = self[method].apply(self, params);\n          return send({\n            success: {\n              id: id,\n              result: result\n            }\n          });\n        } catch (_error) {\n          error = _error;\n          return send({\n            error: {\n              id: id,\n              message: error.message,\n              stack: error.stack\n            }\n          });\n        }\n      }\n    });\n    addEventListener(\"unload\", function() {\n      return send({\n        status: \"unload\"\n      });\n    });\n    send({\n      status: \"ready\"\n    });\n    self.sendToParent = send;\n    return self;\n  };\n\n  send = function(data) {\n    return dominant != null ? dominant.postMessage(data, \"*\") : void 0;\n  };\n\n}).call(this);\n",
          "type": "blob"
        },
        "pixie": {
          "path": "pixie",
          "content": "module.exports = {\"version\":\"0.2.2\"};",
          "type": "blob"
        },
        "test/postmaster": {
          "path": "test/postmaster",
          "content": "(function() {\n  var Postmaster;\n\n  Postmaster = require(\"../main\");\n\n  describe(\"Postmaster\", function() {\n    return it(\"should allow sending messages to parent\", function() {\n      var postmaster;\n      postmaster = Postmaster();\n      return postmaster.sendToParent({\n        radical: \"true\"\n      });\n    });\n  });\n\n}).call(this);\n",
          "type": "blob"
        }
      },
      "progenitor": {
        "url": "http://strd6.github.io/editor/"
      },
      "version": "0.2.2",
      "entryPoint": "main",
      "repository": {
        "id": 15326478,
        "name": "postmaster",
        "full_name": "distri/postmaster",
        "owner": {
          "login": "distri",
          "id": 6005125,
          "avatar_url": "https://avatars.githubusercontent.com/u/6005125?",
          "gravatar_id": "192f3f168409e79c42107f081139d9f3",
          "url": "https://api.github.com/users/distri",
          "html_url": "https://github.com/distri",
          "followers_url": "https://api.github.com/users/distri/followers",
          "following_url": "https://api.github.com/users/distri/following{/other_user}",
          "gists_url": "https://api.github.com/users/distri/gists{/gist_id}",
          "starred_url": "https://api.github.com/users/distri/starred{/owner}{/repo}",
          "subscriptions_url": "https://api.github.com/users/distri/subscriptions",
          "organizations_url": "https://api.github.com/users/distri/orgs",
          "repos_url": "https://api.github.com/users/distri/repos",
          "events_url": "https://api.github.com/users/distri/events{/privacy}",
          "received_events_url": "https://api.github.com/users/distri/received_events",
          "type": "Organization",
          "site_admin": false
        },
        "private": false,
        "html_url": "https://github.com/distri/postmaster",
        "description": "Send and receive postMessage commands.",
        "fork": false,
        "url": "https://api.github.com/repos/distri/postmaster",
        "forks_url": "https://api.github.com/repos/distri/postmaster/forks",
        "keys_url": "https://api.github.com/repos/distri/postmaster/keys{/key_id}",
        "collaborators_url": "https://api.github.com/repos/distri/postmaster/collaborators{/collaborator}",
        "teams_url": "https://api.github.com/repos/distri/postmaster/teams",
        "hooks_url": "https://api.github.com/repos/distri/postmaster/hooks",
        "issue_events_url": "https://api.github.com/repos/distri/postmaster/issues/events{/number}",
        "events_url": "https://api.github.com/repos/distri/postmaster/events",
        "assignees_url": "https://api.github.com/repos/distri/postmaster/assignees{/user}",
        "branches_url": "https://api.github.com/repos/distri/postmaster/branches{/branch}",
        "tags_url": "https://api.github.com/repos/distri/postmaster/tags",
        "blobs_url": "https://api.github.com/repos/distri/postmaster/git/blobs{/sha}",
        "git_tags_url": "https://api.github.com/repos/distri/postmaster/git/tags{/sha}",
        "git_refs_url": "https://api.github.com/repos/distri/postmaster/git/refs{/sha}",
        "trees_url": "https://api.github.com/repos/distri/postmaster/git/trees{/sha}",
        "statuses_url": "https://api.github.com/repos/distri/postmaster/statuses/{sha}",
        "languages_url": "https://api.github.com/repos/distri/postmaster/languages",
        "stargazers_url": "https://api.github.com/repos/distri/postmaster/stargazers",
        "contributors_url": "https://api.github.com/repos/distri/postmaster/contributors",
        "subscribers_url": "https://api.github.com/repos/distri/postmaster/subscribers",
        "subscription_url": "https://api.github.com/repos/distri/postmaster/subscription",
        "commits_url": "https://api.github.com/repos/distri/postmaster/commits{/sha}",
        "git_commits_url": "https://api.github.com/repos/distri/postmaster/git/commits{/sha}",
        "comments_url": "https://api.github.com/repos/distri/postmaster/comments{/number}",
        "issue_comment_url": "https://api.github.com/repos/distri/postmaster/issues/comments/{number}",
        "contents_url": "https://api.github.com/repos/distri/postmaster/contents/{+path}",
        "compare_url": "https://api.github.com/repos/distri/postmaster/compare/{base}...{head}",
        "merges_url": "https://api.github.com/repos/distri/postmaster/merges",
        "archive_url": "https://api.github.com/repos/distri/postmaster/{archive_format}{/ref}",
        "downloads_url": "https://api.github.com/repos/distri/postmaster/downloads",
        "issues_url": "https://api.github.com/repos/distri/postmaster/issues{/number}",
        "pulls_url": "https://api.github.com/repos/distri/postmaster/pulls{/number}",
        "milestones_url": "https://api.github.com/repos/distri/postmaster/milestones{/number}",
        "notifications_url": "https://api.github.com/repos/distri/postmaster/notifications{?since,all,participating}",
        "labels_url": "https://api.github.com/repos/distri/postmaster/labels{/name}",
        "releases_url": "https://api.github.com/repos/distri/postmaster/releases{/id}",
        "created_at": "2013-12-20T00:42:15Z",
        "updated_at": "2014-03-06T19:53:51Z",
        "pushed_at": "2014-03-06T19:53:51Z",
        "git_url": "git://github.com/distri/postmaster.git",
        "ssh_url": "git@github.com:distri/postmaster.git",
        "clone_url": "https://github.com/distri/postmaster.git",
        "svn_url": "https://github.com/distri/postmaster",
        "homepage": null,
        "size": 172,
        "stargazers_count": 0,
        "watchers_count": 0,
        "language": "CoffeeScript",
        "has_issues": true,
        "has_downloads": true,
        "has_wiki": true,
        "forks_count": 0,
        "mirror_url": null,
        "open_issues_count": 0,
        "forks": 0,
        "open_issues": 0,
        "watchers": 0,
        "default_branch": "master",
        "master_branch": "master",
        "permissions": {
          "admin": true,
          "push": true,
          "pull": true
        },
        "organization": {
          "login": "distri",
          "id": 6005125,
          "avatar_url": "https://avatars.githubusercontent.com/u/6005125?",
          "gravatar_id": "192f3f168409e79c42107f081139d9f3",
          "url": "https://api.github.com/users/distri",
          "html_url": "https://github.com/distri",
          "followers_url": "https://api.github.com/users/distri/followers",
          "following_url": "https://api.github.com/users/distri/following{/other_user}",
          "gists_url": "https://api.github.com/users/distri/gists{/gist_id}",
          "starred_url": "https://api.github.com/users/distri/starred{/owner}{/repo}",
          "subscriptions_url": "https://api.github.com/users/distri/subscriptions",
          "organizations_url": "https://api.github.com/users/distri/orgs",
          "repos_url": "https://api.github.com/users/distri/repos",
          "events_url": "https://api.github.com/users/distri/events{/privacy}",
          "received_events_url": "https://api.github.com/users/distri/received_events",
          "type": "Organization",
          "site_admin": false
        },
        "network_count": 0,
        "subscribers_count": 2,
        "branch": "v0.2.2",
        "publishBranch": "gh-pages"
      },
      "dependencies": {}
    },
    "util": {
      "source": {
        "LICENSE": {
          "path": "LICENSE",
          "mode": "100644",
          "content": "The MIT License (MIT)\n\nCopyright (c) 2014 \n\nPermission is hereby granted, free of charge, to any person obtaining a copy\nof this software and associated documentation files (the \"Software\"), to deal\nin the Software without restriction, including without limitation the rights\nto use, copy, modify, merge, publish, distribute, sublicense, and/or sell\ncopies of the Software, and to permit persons to whom the Software is\nfurnished to do so, subject to the following conditions:\n\nThe above copyright notice and this permission notice shall be included in all\ncopies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\nIMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\nFITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\nAUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\nLIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\nOUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE\nSOFTWARE.",
          "type": "blob"
        },
        "README.md": {
          "path": "README.md",
          "mode": "100644",
          "content": "util\n====\n\nSmall utility methods for JS\n",
          "type": "blob"
        },
        "main.coffee.md": {
          "path": "main.coffee.md",
          "mode": "100644",
          "content": "Util\n====\n\n    module.exports =\n      approach: (current, target, amount) ->\n        (target - current).clamp(-amount, amount) + current\n\nApply a stylesheet idempotently.\n\n      applyStylesheet: (style, id=\"primary\") ->\n        styleNode = document.createElement(\"style\")\n        styleNode.innerHTML = style\n        styleNode.id = id\n\n        if previousStyleNode = document.head.querySelector(\"style##{id}\")\n          previousStyleNode.parentNode.removeChild(prevousStyleNode)\n\n        document.head.appendChild(styleNode)\n\n      defaults: (target, objects...) ->\n        for object in objects\n          for name of object\n            unless target.hasOwnProperty(name)\n              target[name] = object[name]\n\n        return target\n\n      extend: (target, sources...) ->\n        for source in sources\n          for name of source\n            target[name] = source[name]\n\n        return target\n",
          "type": "blob"
        },
        "pixie.cson": {
          "path": "pixie.cson",
          "mode": "100644",
          "content": "version: \"0.1.0\"\n",
          "type": "blob"
        }
      },
      "distribution": {
        "main": {
          "path": "main",
          "content": "(function() {\n  var __slice = [].slice;\n\n  module.exports = {\n    approach: function(current, target, amount) {\n      return (target - current).clamp(-amount, amount) + current;\n    },\n    applyStylesheet: function(style, id) {\n      var previousStyleNode, styleNode;\n      if (id == null) {\n        id = \"primary\";\n      }\n      styleNode = document.createElement(\"style\");\n      styleNode.innerHTML = style;\n      styleNode.id = id;\n      if (previousStyleNode = document.head.querySelector(\"style#\" + id)) {\n        previousStyleNode.parentNode.removeChild(prevousStyleNode);\n      }\n      return document.head.appendChild(styleNode);\n    },\n    defaults: function() {\n      var name, object, objects, target, _i, _len;\n      target = arguments[0], objects = 2 <= arguments.length ? __slice.call(arguments, 1) : [];\n      for (_i = 0, _len = objects.length; _i < _len; _i++) {\n        object = objects[_i];\n        for (name in object) {\n          if (!target.hasOwnProperty(name)) {\n            target[name] = object[name];\n          }\n        }\n      }\n      return target;\n    },\n    extend: function() {\n      var name, source, sources, target, _i, _len;\n      target = arguments[0], sources = 2 <= arguments.length ? __slice.call(arguments, 1) : [];\n      for (_i = 0, _len = sources.length; _i < _len; _i++) {\n        source = sources[_i];\n        for (name in source) {\n          target[name] = source[name];\n        }\n      }\n      return target;\n    }\n  };\n\n}).call(this);\n",
          "type": "blob"
        },
        "pixie": {
          "path": "pixie",
          "content": "module.exports = {\"version\":\"0.1.0\"};",
          "type": "blob"
        }
      },
      "progenitor": {
        "url": "http://strd6.github.io/editor/"
      },
      "version": "0.1.0",
      "entryPoint": "main",
      "repository": {
        "id": 18501018,
        "name": "util",
        "full_name": "distri/util",
        "owner": {
          "login": "distri",
          "id": 6005125,
          "avatar_url": "https://avatars.githubusercontent.com/u/6005125?",
          "gravatar_id": "192f3f168409e79c42107f081139d9f3",
          "url": "https://api.github.com/users/distri",
          "html_url": "https://github.com/distri",
          "followers_url": "https://api.github.com/users/distri/followers",
          "following_url": "https://api.github.com/users/distri/following{/other_user}",
          "gists_url": "https://api.github.com/users/distri/gists{/gist_id}",
          "starred_url": "https://api.github.com/users/distri/starred{/owner}{/repo}",
          "subscriptions_url": "https://api.github.com/users/distri/subscriptions",
          "organizations_url": "https://api.github.com/users/distri/orgs",
          "repos_url": "https://api.github.com/users/distri/repos",
          "events_url": "https://api.github.com/users/distri/events{/privacy}",
          "received_events_url": "https://api.github.com/users/distri/received_events",
          "type": "Organization",
          "site_admin": false
        },
        "private": false,
        "html_url": "https://github.com/distri/util",
        "description": "Small utility methods for JS",
        "fork": false,
        "url": "https://api.github.com/repos/distri/util",
        "forks_url": "https://api.github.com/repos/distri/util/forks",
        "keys_url": "https://api.github.com/repos/distri/util/keys{/key_id}",
        "collaborators_url": "https://api.github.com/repos/distri/util/collaborators{/collaborator}",
        "teams_url": "https://api.github.com/repos/distri/util/teams",
        "hooks_url": "https://api.github.com/repos/distri/util/hooks",
        "issue_events_url": "https://api.github.com/repos/distri/util/issues/events{/number}",
        "events_url": "https://api.github.com/repos/distri/util/events",
        "assignees_url": "https://api.github.com/repos/distri/util/assignees{/user}",
        "branches_url": "https://api.github.com/repos/distri/util/branches{/branch}",
        "tags_url": "https://api.github.com/repos/distri/util/tags",
        "blobs_url": "https://api.github.com/repos/distri/util/git/blobs{/sha}",
        "git_tags_url": "https://api.github.com/repos/distri/util/git/tags{/sha}",
        "git_refs_url": "https://api.github.com/repos/distri/util/git/refs{/sha}",
        "trees_url": "https://api.github.com/repos/distri/util/git/trees{/sha}",
        "statuses_url": "https://api.github.com/repos/distri/util/statuses/{sha}",
        "languages_url": "https://api.github.com/repos/distri/util/languages",
        "stargazers_url": "https://api.github.com/repos/distri/util/stargazers",
        "contributors_url": "https://api.github.com/repos/distri/util/contributors",
        "subscribers_url": "https://api.github.com/repos/distri/util/subscribers",
        "subscription_url": "https://api.github.com/repos/distri/util/subscription",
        "commits_url": "https://api.github.com/repos/distri/util/commits{/sha}",
        "git_commits_url": "https://api.github.com/repos/distri/util/git/commits{/sha}",
        "comments_url": "https://api.github.com/repos/distri/util/comments{/number}",
        "issue_comment_url": "https://api.github.com/repos/distri/util/issues/comments/{number}",
        "contents_url": "https://api.github.com/repos/distri/util/contents/{+path}",
        "compare_url": "https://api.github.com/repos/distri/util/compare/{base}...{head}",
        "merges_url": "https://api.github.com/repos/distri/util/merges",
        "archive_url": "https://api.github.com/repos/distri/util/{archive_format}{/ref}",
        "downloads_url": "https://api.github.com/repos/distri/util/downloads",
        "issues_url": "https://api.github.com/repos/distri/util/issues{/number}",
        "pulls_url": "https://api.github.com/repos/distri/util/pulls{/number}",
        "milestones_url": "https://api.github.com/repos/distri/util/milestones{/number}",
        "notifications_url": "https://api.github.com/repos/distri/util/notifications{?since,all,participating}",
        "labels_url": "https://api.github.com/repos/distri/util/labels{/name}",
        "releases_url": "https://api.github.com/repos/distri/util/releases{/id}",
        "created_at": "2014-04-06T22:42:56Z",
        "updated_at": "2014-04-06T22:42:56Z",
        "pushed_at": "2014-04-06T22:42:56Z",
        "git_url": "git://github.com/distri/util.git",
        "ssh_url": "git@github.com:distri/util.git",
        "clone_url": "https://github.com/distri/util.git",
        "svn_url": "https://github.com/distri/util",
        "homepage": null,
        "size": 0,
        "stargazers_count": 0,
        "watchers_count": 0,
        "language": null,
        "has_issues": true,
        "has_downloads": true,
        "has_wiki": true,
        "forks_count": 0,
        "mirror_url": null,
        "open_issues_count": 0,
        "forks": 0,
        "open_issues": 0,
        "watchers": 0,
        "default_branch": "master",
        "master_branch": "master",
        "permissions": {
          "admin": true,
          "push": true,
          "pull": true
        },
        "organization": {
          "login": "distri",
          "id": 6005125,
          "avatar_url": "https://avatars.githubusercontent.com/u/6005125?",
          "gravatar_id": "192f3f168409e79c42107f081139d9f3",
          "url": "https://api.github.com/users/distri",
          "html_url": "https://github.com/distri",
          "followers_url": "https://api.github.com/users/distri/followers",
          "following_url": "https://api.github.com/users/distri/following{/other_user}",
          "gists_url": "https://api.github.com/users/distri/gists{/gist_id}",
          "starred_url": "https://api.github.com/users/distri/starred{/owner}{/repo}",
          "subscriptions_url": "https://api.github.com/users/distri/subscriptions",
          "organizations_url": "https://api.github.com/users/distri/orgs",
          "repos_url": "https://api.github.com/users/distri/repos",
          "events_url": "https://api.github.com/users/distri/events{/privacy}",
          "received_events_url": "https://api.github.com/users/distri/received_events",
          "type": "Organization",
          "site_admin": false
        },
        "network_count": 0,
        "subscribers_count": 2,
        "branch": "v0.1.0",
        "publishBranch": "gh-pages"
      },
      "dependencies": {}
    },
    "value-widget": {
      "source": {
        "LICENSE": {
          "path": "LICENSE",
          "content": "The MIT License (MIT)\n\nCopyright (c) 2014 \n\nPermission is hereby granted, free of charge, to any person obtaining a copy\nof this software and associated documentation files (the \"Software\"), to deal\nin the Software without restriction, including without limitation the rights\nto use, copy, modify, merge, publish, distribute, sublicense, and/or sell\ncopies of the Software, and to permit persons to whom the Software is\nfurnished to do so, subject to the following conditions:\n\nThe above copyright notice and this permission notice shall be included in all\ncopies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\nIMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\nFITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\nAUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\nLIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\nOUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE\nSOFTWARE.",
          "mode": "100644",
          "type": "blob"
        },
        "README.md": {
          "path": "README.md",
          "content": "value-widget\n============\n\nA mini value editor.\n",
          "mode": "100644",
          "type": "blob"
        },
        "demo.styl": {
          "path": "demo.styl",
          "content": "html\n  height: 100%\n\nbody\n  margin: 0\n  height: 100%\n\niframe\n  border: none\n  display: block\n  width: 100%\n  height: 100%\n",
          "mode": "100644",
          "type": "blob"
        },
        "main.coffee.md": {
          "path": "main.coffee.md",
          "content": "Value Widget\n============\n\nTie a widget to an observable.\n\n    Observable = require \"observable\"\n\n    module.exports = (I={}) ->\n      defaults I,\n        debug: false\n        width: 200\n        height: 200\n        value: null\n\n      observable = Observable(I.value)\n\n      widget = null\n      if I.iframe\n        I.iframe.addEventListener \"load\", ->\n          widget = I.iframe.contentWindow\n\n        I.iframe.src = I.url if I.url\n      else\n        widget = window.open I.url, null, \"width=#{I.width},height=#{I.height}\"\n\n      send = (method, params...) ->\n        widget.postMessage\n          method: method\n          params: params\n        , \"*\"\n\n      update = (newValue) ->\n        send \"value\", newValue\n\n      updating = false\n      observable.observe (newValue) ->\n        unless updating\n          update(newValue)\n\n      listener = ({data, source}) ->\n        return unless source is widget\n\n        if I.debug\n          console.log data\n\n        if data.status is \"ready\"\n          if I.options\n            send \"options\", I.options\n\n          if I.value?\n            update(I.value)\n\n        else if data.status is \"unload\"\n          window.removeEventListener \"message\", listener\n        else if value = data.value\n          updating = true\n          observable(value)\n          updating = false\n\n      window.addEventListener \"message\", listener\n\n      window.addEventListener \"unload\", ->\n        widget?.close()\n\n      observable.send = send\n\n      return observable\n\nHelpers\n-------\n\n    defaults = (target, objects...) ->\n      for object in objects\n        for name of object\n          unless target.hasOwnProperty(name)\n            target[name] = object[name]\n\n      return target\n\n    applyStylesheet = (style, id=\"primary\") ->\n      styleNode = document.createElement(\"style\")\n      styleNode.innerHTML = style\n      styleNode.id = id\n\n      if previousStyleNode = document.head.querySelector(\"style##{id}\")\n        previousStyleNode.parentNode.removeChild(prevousStyleNode)\n\n      document.head.appendChild(styleNode)\n\nExample\n-------\n\n    if PACKAGE.name is \"ROOT\"\n      applyStylesheet require \"./demo\"\n\n      testFrame = document.createElement \"iframe\"\n\n      document.body.appendChild testFrame\n\n      o = module.exports\n        iframe: testFrame\n        url: \"http://distri.github.io/text/\"\n        value: \"hsl(180, 100%, 50%)\"\n\n      o.observe (v) ->\n        console.log v\n\n      window.o = o\n",
          "mode": "100644",
          "type": "blob"
        },
        "pixie.cson": {
          "path": "pixie.cson",
          "content": "version: \"0.1.4-pre.2\"\ndependencies:\n  observable: \"distri/observable:v0.1.0\"\n",
          "mode": "100644",
          "type": "blob"
        }
      },
      "distribution": {
        "demo": {
          "path": "demo",
          "content": "module.exports = \"html {\\n  height: 100%;\\n}\\n\\nbody {\\n  margin: 0;\\n  height: 100%;\\n}\\n\\niframe {\\n  border: none;\\n  display: block;\\n  width: 100%;\\n  height: 100%;\\n}\";",
          "type": "blob"
        },
        "main": {
          "path": "main",
          "content": "(function() {\n  var Observable, applyStylesheet, defaults, o, testFrame,\n    __slice = [].slice;\n\n  Observable = require(\"observable\");\n\n  module.exports = function(I) {\n    var listener, observable, send, update, updating, widget;\n    if (I == null) {\n      I = {};\n    }\n    defaults(I, {\n      debug: false,\n      width: 200,\n      height: 200,\n      value: null\n    });\n    observable = Observable(I.value);\n    widget = null;\n    if (I.iframe) {\n      I.iframe.addEventListener(\"load\", function() {\n        return widget = I.iframe.contentWindow;\n      });\n      if (I.url) {\n        I.iframe.src = I.url;\n      }\n    } else {\n      widget = window.open(I.url, null, \"width=\" + I.width + \",height=\" + I.height);\n    }\n    send = function() {\n      var method, params;\n      method = arguments[0], params = 2 <= arguments.length ? __slice.call(arguments, 1) : [];\n      return widget.postMessage({\n        method: method,\n        params: params\n      }, \"*\");\n    };\n    update = function(newValue) {\n      return send(\"value\", newValue);\n    };\n    updating = false;\n    observable.observe(function(newValue) {\n      if (!updating) {\n        return update(newValue);\n      }\n    });\n    listener = function(_arg) {\n      var data, source, value;\n      data = _arg.data, source = _arg.source;\n      if (source !== widget) {\n        return;\n      }\n      if (I.debug) {\n        console.log(data);\n      }\n      if (data.status === \"ready\") {\n        if (I.options) {\n          send(\"options\", I.options);\n        }\n        if (I.value != null) {\n          return update(I.value);\n        }\n      } else if (data.status === \"unload\") {\n        return window.removeEventListener(\"message\", listener);\n      } else if (value = data.value) {\n        updating = true;\n        observable(value);\n        return updating = false;\n      }\n    };\n    window.addEventListener(\"message\", listener);\n    window.addEventListener(\"unload\", function() {\n      return widget != null ? widget.close() : void 0;\n    });\n    observable.send = send;\n    return observable;\n  };\n\n  defaults = function() {\n    var name, object, objects, target, _i, _len;\n    target = arguments[0], objects = 2 <= arguments.length ? __slice.call(arguments, 1) : [];\n    for (_i = 0, _len = objects.length; _i < _len; _i++) {\n      object = objects[_i];\n      for (name in object) {\n        if (!target.hasOwnProperty(name)) {\n          target[name] = object[name];\n        }\n      }\n    }\n    return target;\n  };\n\n  applyStylesheet = function(style, id) {\n    var previousStyleNode, styleNode;\n    if (id == null) {\n      id = \"primary\";\n    }\n    styleNode = document.createElement(\"style\");\n    styleNode.innerHTML = style;\n    styleNode.id = id;\n    if (previousStyleNode = document.head.querySelector(\"style#\" + id)) {\n      previousStyleNode.parentNode.removeChild(prevousStyleNode);\n    }\n    return document.head.appendChild(styleNode);\n  };\n\n  if (PACKAGE.name === \"ROOT\") {\n    applyStylesheet(require(\"./demo\"));\n    testFrame = document.createElement(\"iframe\");\n    document.body.appendChild(testFrame);\n    o = module.exports({\n      iframe: testFrame,\n      url: \"http://distri.github.io/text/\",\n      value: \"hsl(180, 100%, 50%)\"\n    });\n    o.observe(function(v) {\n      return console.log(v);\n    });\n    window.o = o;\n  }\n\n}).call(this);\n",
          "type": "blob"
        },
        "pixie": {
          "path": "pixie",
          "content": "module.exports = {\"version\":\"0.1.4-pre.2\",\"dependencies\":{\"observable\":\"distri/observable:v0.1.0\"}};",
          "type": "blob"
        }
      },
      "progenitor": {
        "url": "http://www.danielx.net/editor/"
      },
      "version": "0.1.4-pre.2",
      "entryPoint": "main",
      "repository": {
        "branch": "v0.1.4-pre.2",
        "default_branch": "master",
        "full_name": "distri/value-widget",
        "homepage": null,
        "description": "A mini value editor.",
        "html_url": "https://github.com/distri/value-widget",
        "url": "https://api.github.com/repos/distri/value-widget",
        "publishBranch": "gh-pages"
      },
      "dependencies": {
        "observable": {
          "source": {
            "LICENSE": {
              "path": "LICENSE",
              "mode": "100644",
              "content": "The MIT License (MIT)\n\nCopyright (c) 2014 distri\n\nPermission is hereby granted, free of charge, to any person obtaining a copy of\nthis software and associated documentation files (the \"Software\"), to deal in\nthe Software without restriction, including without limitation the rights to\nuse, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of\nthe Software, and to permit persons to whom the Software is furnished to do so,\nsubject to the following conditions:\n\nThe above copyright notice and this permission notice shall be included in all\ncopies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\nIMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS\nFOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR\nCOPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER\nIN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN\nCONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.\n",
              "type": "blob"
            },
            "README.md": {
              "path": "README.md",
              "mode": "100644",
              "content": "observable\n==========\n",
              "type": "blob"
            },
            "main.coffee.md": {
              "path": "main.coffee.md",
              "mode": "100644",
              "content": "Observable\n==========\n\n`Observable` allows for observing arrays, functions, and objects.\n\nFunction dependencies are automagically observed.\n\nStandard array methods are proxied through to the underlying array.\n\n    Observable = (value) ->\n\nReturn the object if it is already an observable object.\n\n      return value if typeof value?.observe is \"function\"\n\nMaintain a set of listeners to observe changes and provide a helper to notify each observer.\n\n      listeners = []\n\n      notify = (newValue) ->\n        listeners.forEach (listener) ->\n          listener(newValue)\n\nOur observable function is stored as a reference to `self`.\n\nIf `value` is a function compute dependencies and listen to observables that it depends on.\n\n      if typeof value is 'function'\n        fn = value\n        self = ->\n          # Automagic dependency observation\n          if base\n            self.observe base\n\n          return value\n\n        self.observe = (listener) ->\n          listeners.push listener\n\n        changed = ->\n          value = fn()\n          notify(value)\n\n        value = computeDependencies(fn, changed)\n\n      else\n\nWhen called with zero arguments it is treated as a getter. When called with one argument it is treated as a setter.\n\nChanges to the value will trigger notifications.\n\nThe value is always returned.\n\n        self = (newValue) ->\n          if arguments.length > 0\n            if value != newValue\n              value = newValue\n\n              notify(newValue)\n          else\n            # Automagic dependency observation\n            if base\n              self.observe base\n\n          return value\n\nAdd a listener for when this object changes.\n\n        self.observe = (listener) ->\n          listeners.push listener\n\nThis `each` iterator is similar to [the Maybe monad](http://en.wikipedia.org/wiki/Monad_&#40;functional_programming&#41;#The_Maybe_monad) in that our observable may contain a single value or nothing at all.\n\n      self.each = (args...) ->\n        if value?\n          [value].forEach(args...)\n\nIf the value is an array then proxy array methods and add notifications to mutation events.\n\n      if Array.isArray(value)\n        [\n          \"concat\"\n          \"every\"\n          \"filter\"\n          \"forEach\"\n          \"indexOf\"\n          \"join\"\n          \"lastIndexOf\"\n          \"map\"\n          \"reduce\"\n          \"reduceRight\"\n          \"slice\"\n          \"some\"\n        ].forEach (method) ->\n          self[method] = (args...) ->\n            value[method](args...)\n\n        [\n          \"pop\"\n          \"push\"\n          \"reverse\"\n          \"shift\"\n          \"splice\"\n          \"sort\"\n          \"unshift\"\n        ].forEach (method) ->\n          self[method] = (args...) ->\n            notifyReturning value[method](args...)\n\n        notifyReturning = (returnValue) ->\n          notify(value)\n\n          return returnValue\n\nAdd some extra helpful methods to array observables.\n\n        extend self,\n          each: (args...) ->\n            self.forEach(args...)\n\n            return self\n\nRemove an element from the array and notify observers of changes.\n\n          remove: (object) ->\n            index = value.indexOf(object)\n\n            if index >= 0\n              notifyReturning value.splice(index, 1)[0]\n\n          get: (index) ->\n            value[index]\n\n          first: ->\n            value[0]\n\n          last: ->\n            value[value.length-1]\n\n      self.stopObserving = (fn) ->\n        remove listeners, fn\n\n      return self\n\nExport `Observable`\n\n    module.exports = Observable\n\nAppendix\n--------\n\nThe extend method adds one objects properties to another.\n\n    extend = (target, sources...) ->\n      for source in sources\n        for name of source\n          target[name] = source[name]\n\n      return target\n\n    base = undefined\n\nAutomagically compute dependencies.\n\n    computeDependencies = (fn, root) ->\n      base = root\n      value = fn()\n      base = undefined\n\n      return value\n\nRemove a value from an array.\n\n    remove = (array, value) ->\n      index = array.indexOf(value)\n\n      if index >= 0\n        array.splice(index, 1)[0]\n",
              "type": "blob"
            },
            "test/observable.coffee": {
              "path": "test/observable.coffee",
              "mode": "100644",
              "content": "Observable = require \"../main\"\n\ndescribe 'Observable', ->\n  it 'should create an observable for an object', ->\n    n = 5\n\n    observable = Observable(n)\n\n    assert.equal(observable(), n)\n\n  it 'should fire events when setting', ->\n    string = \"yolo\"\n\n    observable = Observable(string)\n    observable.observe (newValue) ->\n      assert.equal newValue, \"4life\"\n\n    observable(\"4life\")\n\n  it 'should be idempotent', ->\n    o = Observable(5)\n\n    assert.equal o, Observable(o)\n\n  describe \"#each\", ->\n    it \"should be invoked once if there is an observable\", ->\n      o = Observable(5)\n      called = 0\n\n      o.each (value) ->\n        called += 1\n        assert.equal value, 5\n\n      assert.equal called, 1\n\n    it \"should not be invoked if observable is null\", ->\n      o = Observable(null)\n      called = 0\n\n      o.each (value) ->\n        called += 1\n\n      assert.equal called, 0\n\n  it \"should allow for stopping observation\", ->\n    observable = Observable(\"string\")\n\n    called = 0\n    fn = (newValue) ->\n      called += 1\n      assert.equal newValue, \"4life\"\n\n    observable.observe fn\n\n    observable(\"4life\")\n\n    observable.stopObserving fn\n\n    observable(\"wat\")\n\n    assert.equal called, 1\n\ndescribe \"Observable Array\", ->\n  it \"should proxy array methods\", ->\n    o = Observable [5]\n\n    o.map (n) ->\n      assert.equal n, 5\n\n  it \"should notify on mutation methods\", (done) ->\n    o = Observable []\n\n    o.observe (newValue) ->\n      assert.equal newValue[0], 1\n\n    o.push 1\n\n    done()\n\n  it \"should have an each method\", ->\n    o = Observable []\n\n    assert o.each\n\n  it \"#get\", ->\n    o = Observable [0, 1, 2, 3]\n\n    assert.equal o.get(2), 2\n\n  it \"#first\", ->\n    o = Observable [0, 1, 2, 3]\n\n    assert.equal o.first(), 0\n\n  it \"#last\", ->\n    o = Observable [0, 1, 2, 3]\n\n    assert.equal o.last(), 3\n\n  it \"#remove\", (done) ->\n    o = Observable [0, 1, 2, 3]\n\n    o.observe (newValue) ->\n      assert.equal newValue.length, 3\n      setTimeout ->\n        done()\n      , 0\n\n    assert.equal o.remove(2), 2\n\n  # TODO: This looks like it might be impossible\n  it \"should proxy the length property\"\n\ndescribe \"Observable functions\", ->\n  it \"should compute dependencies\", (done) ->\n    firstName = Observable \"Duder\"\n    lastName = Observable \"Man\"\n\n    o = Observable ->\n      \"#{firstName()} #{lastName()}\"\n\n    o.observe (newValue) ->\n      assert.equal newValue, \"Duder Bro\"\n\n      done()\n\n    lastName \"Bro\"\n\n  it \"should allow double nesting\", (done) ->\n    bottom = Observable \"rad\"\n    middle = Observable ->\n      bottom()\n    top = Observable ->\n      middle()\n\n    top.observe (newValue) ->\n      assert.equal newValue, \"wat\"\n      assert.equal top(), newValue\n      assert.equal middle(), newValue\n\n      done()\n\n    bottom(\"wat\")\n\n  it \"should have an each method\", ->\n    o = Observable ->\n\n    assert o.each\n\n  it \"should not invoke when returning undefined\", ->\n    o = Observable ->\n\n    o.each ->\n      assert false\n\n  it \"should invoke when returning any defined value\", (done) ->\n    o = Observable -> 5\n\n    o.each (n) ->\n      assert.equal n, 5\n      done()\n",
              "type": "blob"
            },
            "pixie.cson": {
              "path": "pixie.cson",
              "mode": "100644",
              "content": "version: \"0.1.0\"\n",
              "type": "blob"
            }
          },
          "distribution": {
            "main": {
              "path": "main",
              "content": "(function() {\n  var Observable, base, computeDependencies, extend, remove,\n    __slice = [].slice;\n\n  Observable = function(value) {\n    var changed, fn, listeners, notify, notifyReturning, self;\n    if (typeof (value != null ? value.observe : void 0) === \"function\") {\n      return value;\n    }\n    listeners = [];\n    notify = function(newValue) {\n      return listeners.forEach(function(listener) {\n        return listener(newValue);\n      });\n    };\n    if (typeof value === 'function') {\n      fn = value;\n      self = function() {\n        if (base) {\n          self.observe(base);\n        }\n        return value;\n      };\n      self.observe = function(listener) {\n        return listeners.push(listener);\n      };\n      changed = function() {\n        value = fn();\n        return notify(value);\n      };\n      value = computeDependencies(fn, changed);\n    } else {\n      self = function(newValue) {\n        if (arguments.length > 0) {\n          if (value !== newValue) {\n            value = newValue;\n            notify(newValue);\n          }\n        } else {\n          if (base) {\n            self.observe(base);\n          }\n        }\n        return value;\n      };\n      self.observe = function(listener) {\n        return listeners.push(listener);\n      };\n    }\n    self.each = function() {\n      var args, _ref;\n      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];\n      if (value != null) {\n        return (_ref = [value]).forEach.apply(_ref, args);\n      }\n    };\n    if (Array.isArray(value)) {\n      [\"concat\", \"every\", \"filter\", \"forEach\", \"indexOf\", \"join\", \"lastIndexOf\", \"map\", \"reduce\", \"reduceRight\", \"slice\", \"some\"].forEach(function(method) {\n        return self[method] = function() {\n          var args;\n          args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];\n          return value[method].apply(value, args);\n        };\n      });\n      [\"pop\", \"push\", \"reverse\", \"shift\", \"splice\", \"sort\", \"unshift\"].forEach(function(method) {\n        return self[method] = function() {\n          var args;\n          args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];\n          return notifyReturning(value[method].apply(value, args));\n        };\n      });\n      notifyReturning = function(returnValue) {\n        notify(value);\n        return returnValue;\n      };\n      extend(self, {\n        each: function() {\n          var args;\n          args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];\n          self.forEach.apply(self, args);\n          return self;\n        },\n        remove: function(object) {\n          var index;\n          index = value.indexOf(object);\n          if (index >= 0) {\n            return notifyReturning(value.splice(index, 1)[0]);\n          }\n        },\n        get: function(index) {\n          return value[index];\n        },\n        first: function() {\n          return value[0];\n        },\n        last: function() {\n          return value[value.length - 1];\n        }\n      });\n    }\n    self.stopObserving = function(fn) {\n      return remove(listeners, fn);\n    };\n    return self;\n  };\n\n  module.exports = Observable;\n\n  extend = function() {\n    var name, source, sources, target, _i, _len;\n    target = arguments[0], sources = 2 <= arguments.length ? __slice.call(arguments, 1) : [];\n    for (_i = 0, _len = sources.length; _i < _len; _i++) {\n      source = sources[_i];\n      for (name in source) {\n        target[name] = source[name];\n      }\n    }\n    return target;\n  };\n\n  base = void 0;\n\n  computeDependencies = function(fn, root) {\n    var value;\n    base = root;\n    value = fn();\n    base = void 0;\n    return value;\n  };\n\n  remove = function(array, value) {\n    var index;\n    index = array.indexOf(value);\n    if (index >= 0) {\n      return array.splice(index, 1)[0];\n    }\n  };\n\n}).call(this);\n\n//# sourceURL=main.coffee",
              "type": "blob"
            },
            "test/observable": {
              "path": "test/observable",
              "content": "(function() {\n  var Observable;\n\n  Observable = require(\"../main\");\n\n  describe('Observable', function() {\n    it('should create an observable for an object', function() {\n      var n, observable;\n      n = 5;\n      observable = Observable(n);\n      return assert.equal(observable(), n);\n    });\n    it('should fire events when setting', function() {\n      var observable, string;\n      string = \"yolo\";\n      observable = Observable(string);\n      observable.observe(function(newValue) {\n        return assert.equal(newValue, \"4life\");\n      });\n      return observable(\"4life\");\n    });\n    it('should be idempotent', function() {\n      var o;\n      o = Observable(5);\n      return assert.equal(o, Observable(o));\n    });\n    describe(\"#each\", function() {\n      it(\"should be invoked once if there is an observable\", function() {\n        var called, o;\n        o = Observable(5);\n        called = 0;\n        o.each(function(value) {\n          called += 1;\n          return assert.equal(value, 5);\n        });\n        return assert.equal(called, 1);\n      });\n      return it(\"should not be invoked if observable is null\", function() {\n        var called, o;\n        o = Observable(null);\n        called = 0;\n        o.each(function(value) {\n          return called += 1;\n        });\n        return assert.equal(called, 0);\n      });\n    });\n    return it(\"should allow for stopping observation\", function() {\n      var called, fn, observable;\n      observable = Observable(\"string\");\n      called = 0;\n      fn = function(newValue) {\n        called += 1;\n        return assert.equal(newValue, \"4life\");\n      };\n      observable.observe(fn);\n      observable(\"4life\");\n      observable.stopObserving(fn);\n      observable(\"wat\");\n      return assert.equal(called, 1);\n    });\n  });\n\n  describe(\"Observable Array\", function() {\n    it(\"should proxy array methods\", function() {\n      var o;\n      o = Observable([5]);\n      return o.map(function(n) {\n        return assert.equal(n, 5);\n      });\n    });\n    it(\"should notify on mutation methods\", function(done) {\n      var o;\n      o = Observable([]);\n      o.observe(function(newValue) {\n        return assert.equal(newValue[0], 1);\n      });\n      o.push(1);\n      return done();\n    });\n    it(\"should have an each method\", function() {\n      var o;\n      o = Observable([]);\n      return assert(o.each);\n    });\n    it(\"#get\", function() {\n      var o;\n      o = Observable([0, 1, 2, 3]);\n      return assert.equal(o.get(2), 2);\n    });\n    it(\"#first\", function() {\n      var o;\n      o = Observable([0, 1, 2, 3]);\n      return assert.equal(o.first(), 0);\n    });\n    it(\"#last\", function() {\n      var o;\n      o = Observable([0, 1, 2, 3]);\n      return assert.equal(o.last(), 3);\n    });\n    it(\"#remove\", function(done) {\n      var o;\n      o = Observable([0, 1, 2, 3]);\n      o.observe(function(newValue) {\n        assert.equal(newValue.length, 3);\n        return setTimeout(function() {\n          return done();\n        }, 0);\n      });\n      return assert.equal(o.remove(2), 2);\n    });\n    return it(\"should proxy the length property\");\n  });\n\n  describe(\"Observable functions\", function() {\n    it(\"should compute dependencies\", function(done) {\n      var firstName, lastName, o;\n      firstName = Observable(\"Duder\");\n      lastName = Observable(\"Man\");\n      o = Observable(function() {\n        return \"\" + (firstName()) + \" \" + (lastName());\n      });\n      o.observe(function(newValue) {\n        assert.equal(newValue, \"Duder Bro\");\n        return done();\n      });\n      return lastName(\"Bro\");\n    });\n    it(\"should allow double nesting\", function(done) {\n      var bottom, middle, top;\n      bottom = Observable(\"rad\");\n      middle = Observable(function() {\n        return bottom();\n      });\n      top = Observable(function() {\n        return middle();\n      });\n      top.observe(function(newValue) {\n        assert.equal(newValue, \"wat\");\n        assert.equal(top(), newValue);\n        assert.equal(middle(), newValue);\n        return done();\n      });\n      return bottom(\"wat\");\n    });\n    it(\"should have an each method\", function() {\n      var o;\n      o = Observable(function() {});\n      return assert(o.each);\n    });\n    it(\"should not invoke when returning undefined\", function() {\n      var o;\n      o = Observable(function() {});\n      return o.each(function() {\n        return assert(false);\n      });\n    });\n    return it(\"should invoke when returning any defined value\", function(done) {\n      var o;\n      o = Observable(function() {\n        return 5;\n      });\n      return o.each(function(n) {\n        assert.equal(n, 5);\n        return done();\n      });\n    });\n  });\n\n}).call(this);\n\n//# sourceURL=test/observable.coffee",
              "type": "blob"
            },
            "pixie": {
              "path": "pixie",
              "content": "module.exports = {\"version\":\"0.1.0\"};",
              "type": "blob"
            }
          },
          "progenitor": {
            "url": "http://strd6.github.io/editor/"
          },
          "version": "0.1.0",
          "entryPoint": "main",
          "repository": {
            "id": 17119562,
            "name": "observable",
            "full_name": "distri/observable",
            "owner": {
              "login": "distri",
              "id": 6005125,
              "avatar_url": "https://identicons.github.com/f90c81ffc1498e260c820082f2e7ca5f.png",
              "gravatar_id": null,
              "url": "https://api.github.com/users/distri",
              "html_url": "https://github.com/distri",
              "followers_url": "https://api.github.com/users/distri/followers",
              "following_url": "https://api.github.com/users/distri/following{/other_user}",
              "gists_url": "https://api.github.com/users/distri/gists{/gist_id}",
              "starred_url": "https://api.github.com/users/distri/starred{/owner}{/repo}",
              "subscriptions_url": "https://api.github.com/users/distri/subscriptions",
              "organizations_url": "https://api.github.com/users/distri/orgs",
              "repos_url": "https://api.github.com/users/distri/repos",
              "events_url": "https://api.github.com/users/distri/events{/privacy}",
              "received_events_url": "https://api.github.com/users/distri/received_events",
              "type": "Organization",
              "site_admin": false
            },
            "private": false,
            "html_url": "https://github.com/distri/observable",
            "description": "",
            "fork": false,
            "url": "https://api.github.com/repos/distri/observable",
            "forks_url": "https://api.github.com/repos/distri/observable/forks",
            "keys_url": "https://api.github.com/repos/distri/observable/keys{/key_id}",
            "collaborators_url": "https://api.github.com/repos/distri/observable/collaborators{/collaborator}",
            "teams_url": "https://api.github.com/repos/distri/observable/teams",
            "hooks_url": "https://api.github.com/repos/distri/observable/hooks",
            "issue_events_url": "https://api.github.com/repos/distri/observable/issues/events{/number}",
            "events_url": "https://api.github.com/repos/distri/observable/events",
            "assignees_url": "https://api.github.com/repos/distri/observable/assignees{/user}",
            "branches_url": "https://api.github.com/repos/distri/observable/branches{/branch}",
            "tags_url": "https://api.github.com/repos/distri/observable/tags",
            "blobs_url": "https://api.github.com/repos/distri/observable/git/blobs{/sha}",
            "git_tags_url": "https://api.github.com/repos/distri/observable/git/tags{/sha}",
            "git_refs_url": "https://api.github.com/repos/distri/observable/git/refs{/sha}",
            "trees_url": "https://api.github.com/repos/distri/observable/git/trees{/sha}",
            "statuses_url": "https://api.github.com/repos/distri/observable/statuses/{sha}",
            "languages_url": "https://api.github.com/repos/distri/observable/languages",
            "stargazers_url": "https://api.github.com/repos/distri/observable/stargazers",
            "contributors_url": "https://api.github.com/repos/distri/observable/contributors",
            "subscribers_url": "https://api.github.com/repos/distri/observable/subscribers",
            "subscription_url": "https://api.github.com/repos/distri/observable/subscription",
            "commits_url": "https://api.github.com/repos/distri/observable/commits{/sha}",
            "git_commits_url": "https://api.github.com/repos/distri/observable/git/commits{/sha}",
            "comments_url": "https://api.github.com/repos/distri/observable/comments{/number}",
            "issue_comment_url": "https://api.github.com/repos/distri/observable/issues/comments/{number}",
            "contents_url": "https://api.github.com/repos/distri/observable/contents/{+path}",
            "compare_url": "https://api.github.com/repos/distri/observable/compare/{base}...{head}",
            "merges_url": "https://api.github.com/repos/distri/observable/merges",
            "archive_url": "https://api.github.com/repos/distri/observable/{archive_format}{/ref}",
            "downloads_url": "https://api.github.com/repos/distri/observable/downloads",
            "issues_url": "https://api.github.com/repos/distri/observable/issues{/number}",
            "pulls_url": "https://api.github.com/repos/distri/observable/pulls{/number}",
            "milestones_url": "https://api.github.com/repos/distri/observable/milestones{/number}",
            "notifications_url": "https://api.github.com/repos/distri/observable/notifications{?since,all,participating}",
            "labels_url": "https://api.github.com/repos/distri/observable/labels{/name}",
            "releases_url": "https://api.github.com/repos/distri/observable/releases{/id}",
            "created_at": "2014-02-23T23:17:52Z",
            "updated_at": "2014-02-23T23:17:52Z",
            "pushed_at": "2014-02-23T23:17:52Z",
            "git_url": "git://github.com/distri/observable.git",
            "ssh_url": "git@github.com:distri/observable.git",
            "clone_url": "https://github.com/distri/observable.git",
            "svn_url": "https://github.com/distri/observable",
            "homepage": null,
            "size": 0,
            "stargazers_count": 0,
            "watchers_count": 0,
            "language": null,
            "has_issues": true,
            "has_downloads": true,
            "has_wiki": true,
            "forks_count": 0,
            "mirror_url": null,
            "open_issues_count": 0,
            "forks": 0,
            "open_issues": 0,
            "watchers": 0,
            "default_branch": "master",
            "master_branch": "master",
            "permissions": {
              "admin": true,
              "push": true,
              "pull": true
            },
            "organization": {
              "login": "distri",
              "id": 6005125,
              "avatar_url": "https://identicons.github.com/f90c81ffc1498e260c820082f2e7ca5f.png",
              "gravatar_id": null,
              "url": "https://api.github.com/users/distri",
              "html_url": "https://github.com/distri",
              "followers_url": "https://api.github.com/users/distri/followers",
              "following_url": "https://api.github.com/users/distri/following{/other_user}",
              "gists_url": "https://api.github.com/users/distri/gists{/gist_id}",
              "starred_url": "https://api.github.com/users/distri/starred{/owner}{/repo}",
              "subscriptions_url": "https://api.github.com/users/distri/subscriptions",
              "organizations_url": "https://api.github.com/users/distri/orgs",
              "repos_url": "https://api.github.com/users/distri/repos",
              "events_url": "https://api.github.com/users/distri/events{/privacy}",
              "received_events_url": "https://api.github.com/users/distri/received_events",
              "type": "Organization",
              "site_admin": false
            },
            "network_count": 0,
            "subscribers_count": 2,
            "branch": "v0.1.0",
            "defaultBranch": "master"
          },
          "dependencies": {}
        }
      }
    }
  }
});