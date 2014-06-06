JSON Value Widget
========================

    global.Observable = require "observable"
    {applyStylesheet} = require "util"

Create an editor, send events back to parent.

    ValueWidget = require "value-widget"
    require "./lib/jquery.property_editor"

    applyStylesheet(require "./style")

    json =
      test: "wat"
      yolo: "jawsome!"
      duder:
        a: "radical"
        b: "!?!?"
        c: [
          1
          2
          3
        ]

    jsonString = JSON.stringify(json, null, 2)

    iframe = document.createElement("iframe")
    textEditorUrl = "http://distri.github.io/text/v0.1.1/"

    $(iframe).load ->
      setTimeout ->
        updateText json
        console.log "TIMEOUT", json
      , 1000

    document.body.appendChild iframe
    textEditor = ValueWidget
      value: ""
      iframe: iframe
      url: textEditorUrl
      options:
        mode: "json"

    updatingText = false
    textEditor.observe (newValue) ->
      return if updatingText

      try
        json = JSON.parse(newValue)
        jsonEditor.setProps(json)
      catch e
        ; # TODO: Display error

    updateText = (data) ->
      newValue = JSON.stringify(data, null, 2)

      updatingText = true
      textEditor newValue
      updatingText = false

    (jsonEditor = $("<div>").propertyEditor(json)).appendTo(document.body)

    jsonEditor.on "dirty", ->
      data = jsonEditor.getProps()

      updateText data

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
