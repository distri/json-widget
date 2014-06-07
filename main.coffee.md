JSON Value Widget
========================

    global.Observable = require "observable"
    {applyStylesheet} = require "util"

Create an editor, send events back to parent.

    require "./lib/jquery.property_editor"

    applyStylesheet(require "./style")

    json = require "./sample"
    

    jsonString = JSON.stringify(json, null, 2)

    (jsonEditor = $("<div>").propertyEditor(json)).appendTo(document.body)

    jsonEditor.on "dirty", ->
      data = jsonEditor.getProps()

      console.log data

      postmaster.sendToParent
        value: data

Use the postmaster to send value to our parent, store our current value in it as well.

    updating = false
    postmaster = require("postmaster")()
    postmaster.value = (newValue) ->
      updating = true
      jsonEditor.setProps newValue
      updating = false

Expose a focus method to our parent.

    postmaster.focus = ->
      jsonEditor.focus()

    log = (data) ->
      postmaster.sendToParent
        log: data


    global.postmaster = postmaster

Demo
====

>     #! setup
>     ValueWidget = require "value-widget"
>     iframe = document.createElement("iframe")
>     window.json = ValueWidget
>       debug: true
>       value:
>         test: "data"
>         array: [1, 2, 3]
>         boolean: true
>         nested:
>           bro: "tura"
>           yolo: "wat"
>       iframe: iframe
>       url: "http://distri.github.io/json-widget/"
>
>     document.body.appendChild iframe
>     json.observe (data) ->
>       console.log data
>       $(".content").last().text JSON.stringify(data, null, 2)
