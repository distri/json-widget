JSON Value Widget
========================

    global.Observable = require "observable"
    {applyStylesheet} = require "util"

Create an editor, send events back to parent.

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

    (editor = $("<div>").propertyEditor(json)).appendTo(document.body)

    editor.on "dirty", ->
      postmaster.sendToParent editor.getProps()

Use the postmaster to send value to our parent, store our current value in it as well.

    updating = false
    postmaster = require("postmaster")()
    postmaster.value = (newValue) ->
      updating = true
      editor.setProps newValue
      updating = false

Expose a focus method to our parent.

    postmaster.focus = ->
      editor.focus()

    log = (data) ->
      postmaster.sendToParent
        log: data
