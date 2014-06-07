(($) ->

  $.fn.propertyEditor = (properties={}, options={}) ->
    object = properties

    element = this.eq(0)
    if Array.isArray(object)
      element.addClass("array")
    else
      element.addClass("properties")

    element.getProps = ->
      object

    element.setProps = (properties={}) ->
      # TODO: Check for arrays
      object = properties

      element.html('')

      Object.keys(object).forEach (key) ->
        value = object[key]

        if typeof value is "object"
          addNestedRow(key, value)
        else
          addRow(key, value)

      rowCheck()

      element

    rowCheck = ->
      debugger
      # If last row has data
      if (input = element.children(".row").last().find("input").first()).length
        if input.val()
          addRow('', '')
      else # Or no rows
        addRow('', '')

    fireDirtyEvent = ->
      try
        element.trigger("dirty", [object])
      catch error
        console?.error? error

    processInputChanges = ->
      fireDirtyEvent()

      rowCheck()

    makeKeyInput = (key, valueFn) ->
      input = $("<input>",
        class: "key"
        data:
          previousName: key
        type: "text"
        placeholder: "key"
        value: key
      )

      input.on('input change', (e) ->
        $this = $(this)

        currentName = $this.val()
        previousName = $this.data("previousName")

        if currentName isnt previousName
          $this.data("previousName", currentName)
          delete object[previousName]

          return if currentName is ""

          object[currentName] = valueFn()

          processInputChanges()
      ).on "keydown", (e) ->
        if e.keyCode is 13
          # Next input
          nextInput = input.next("input").first() or input.next().find("input").first()
          setTimeout ->
            nextInput.focus()
            
        if input.val() is "" and e.keyCode is 8
          # Just remove the whole row becaus we assue it's been removed from the
          # call to delete in a prevous change event
          prevInput = input.parent().prev().find("input").last()
          setTimeout ->
            prevInput.focus()

          input.parent().remove()

      input

    makeValueInput = (value, keyFn, removeFn) ->
      input = $("<input>",
        class: "value"
        data:
          previousValue: value
        placeholder: "value"
        value: value
      ).on('input change', (e) ->
        $this = $(this)

        currentValue = parse $this.val()
        previousValue = $this.data("previousValue")

        if currentValue isnt previousValue
          key = keyFn()

          $this.data("previousValue", currentValue)
          object[key] = currentValue

          processInputChanges()
      ).on('keydown', (e) ->
        if $(this).val() is "" and e.keyCode is 8
          removeFn()
        
        if e.keyCode is 13
          # Next input
          nextInput = input.parent().next().find("input").first()
          setTimeout ->
            nextInput.focus()
      )

    addRow = (key, value) ->
      row = $ "<div>",
        class: "row"

      valueFn = ->
        parse valueInput.val()

      if Array.isArray(object)
        keyFn = ->
          valueInput.parent().index()
        removeFn = ->
          object.splice(keyFn(), 1)

          prevInput = valueInput.parent().prev().find("input").last()
          setTimeout ->
            prevInput.focus()

          row.remove()
      else
        keyInput = makeKeyInput(key, valueFn).appendTo(row)
        keyFn = ->
          keyInput.val()

        removeFn = ->
          setTimeout ->
            valueInput.prev().focus()

      valueInput = makeValueInput(value, keyFn, removeFn).appendTo(row)

      return row.appendTo(element)

    addNestedRow = (key, value) ->
      row = $ "<div>",
        class: "row"

      valueFn = ->
        value

      makeKeyInput(key, valueFn).appendTo(row)

      if Array.isArray(value)
        row.append(" : [")
      else if typeof value is "object"
        row.append(" : {")

      nestedEditor = $("<div>")
        .appendTo(row)
        .propertyEditor(value)

      # Prevent event bubbling and retrigger with parent object
      nestedEditor.bind "change", (event, changedNestedObject) ->
        event.stopPropagation()
        fireDirtyEvent()
      
      if Array.isArray(value)
        row.append(" ]")
      else if typeof value is "object"
        row.append(" }")

      return row.appendTo(element)

    element.setProps(properties)

)(jQuery)

parse = (string) ->
  try
    JSON.parse(string)
  catch
    string
