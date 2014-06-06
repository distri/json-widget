JSON Value Widget
========================

    global.Observable = require "observable"
    {applyStylesheet} = require "util"

Create an editor, send events back to parent.

    require "./lib/jquery.property_editor"

    applyStylesheet(require "./style")

    data =
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

    $("<div>").propertyEditor(data).appendTo(document.body)

Use the postmaster to send value to our parent, store our current value in it as well.

    updating = false
    postmaster = require("postmaster")()
    postmaster.value = (newValue) ->
      updating = true
      editor.text(newValue)
      updating = false

Expose a focus method to our parent.

    postmaster.focus = ->
      editor.focus()

    editor.json.observe (newValue) ->
      unless updating
        postmaster.sendToParent
          value: newValue

    log = (data) ->
      postmaster.sendToParent
        log: data
