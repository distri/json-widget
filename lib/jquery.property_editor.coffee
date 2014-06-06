(($) ->

  $.fn.propertyEditor = (properties) ->
    properties ||= {}
    object = properties

    element = this.eq(0)
    element.addClass("properties")

    element.getProps = ->
      object

    element.setProps = (properties) ->
      properties ||= {}
      object = properties

      element.html('')

      if properties
        propertiesArray = []
        for key, value of properties
          propertiesArray.push [key, value]

        propertiesArray.sort().forEach (pair) ->
          [key, value] = pair

          if Array.isArray(value)
            addNestedArray(key, value)
          else if typeof value is "object"
            addNestedRow(key, value)
          else if $.isNumeric(value)
            addRow key, value,
              inputType: 'number'
          else
            addRow(key, value)

      addRow('', '')

      element

    rowCheck = ->
      # If last row has data
      if (input = element.find(".row").last().find("input").first()).length
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

      input.on 'input change', (e) ->
        $this = $(this)

        currentName = $this.val()
        previousName = $this.data("previousName")

        if currentName isnt previousName
          $this.data("previousName", currentName)
          delete object[previousName]

          return if currentName is ""

          object[currentName] = valueFn()

          processInputChanges()

      input

    makeValueInput = (type, value, keyFn) ->
      input = $("<input>",
        class: "value"
        data:
          previousValue: value
        type: type
        placeholder: "value"
        value: value
      ).on 'input change', (e) ->
        $this = $(this)

        currentValue = parse $this.val()
        previousValue = $this.data("previousValue")

        if currentValue isnt previousValue
          return unless key = keyFn()

          $this.data("previousValue", currentValue)
          object[key] = currentValue

          processInputChanges()

    addRow = (key, value, options={}) ->
      row = $ "<div>",
        class: "row"

      valueFn = ->
        parse valueInput.val()

      keyFn = ->
        keyInput.val()

      keyInput = makeKeyInput(key, valueFn).appendTo(row)
      valueInput = makeValueInput(options.inputType, value, keyFn).appendTo(row)

      return row.appendTo(element)

    addNestedRow = (key, value) ->
      row = $ "<div>",
        class: "row"

      valueFn = ->
        value

      makeKeyInput(key, valueFn).appendTo(row)

      nestedEditor = $("<div>")
        .appendTo(row)
        .propertyEditor(value)

      # Prevent event bubbling and retrigger with parent object
      nestedEditor.bind "change", (event, changedNestedObject) ->
        event.stopPropagation()
        fireDirtyEvent()

      return row.appendTo(element)

    addNestedArray = (key, value) ->
      addNestedRow(key, value)

    element.setProps(properties)

)(jQuery)

parse = (string) ->
  try
    JSON.parse(string)
  catch
    string
