A model of a JSON node
======================
  
    Observable = require "observable"
    template = require "./node"

    module.exports = Model = (I) ->
      # Set this to trigger update
      update = Observable()

      items = Object.keys(I).map (key) ->
        value = I[key]

        if typeof value is "object"
          Model(value)
        else
          key: Observable key
          value: Observable value

      self =
        items: items
        subtemplate: template

      return self
