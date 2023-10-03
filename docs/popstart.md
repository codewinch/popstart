# Popstart Library

Popstart is a JavaScript library that leverages promises to embed entire workflows in HTML. This document provides a detailed overview of the `popstart.js` file, which is the core of the library.

## Theory of Operation

The `popstart.js` file contains a number of functions and variables that work together to enable the embedding of workflows in HTML using promises. The library listens for certain events on HTML elements and triggers corresponding functions, which are executed asynchronously using promises.

## Major Functions and Variables

### `__.GetStringAttr`

This function retrieves a string attribute from an HTML element. It takes four parameters: the element (`ele`), the name of the attribute (`name`), the name of the function calling `__.GetStringAttr` (`fnName`), and the name of the element (`eleName`).

### `__.GetIntAttr`

This function retrieves an integer attribute from an HTML element. It uses `__.GetStringAttr` to get the attribute as a string and then attempts to parse it as an integer.

### `__.triggerChangeEvent`

This function triggers a 'change' event on a given HTML element. It is used to programmatically trigger change events as if they were triggered by user interaction.

### `__.handleInputChange`

This function is an event handler for 'input' events. It calls `__.triggerChangeEvent` on the target of the event.

### `__.attachInputListeners`

This function attaches 'input' event listeners to all input, textarea, select, and contenteditable elements in the document.

### `__.removeInputListeners`

This function removes 'input' event listeners from a given HTML element and all its descendants.

### `__.Binding`

This is an object that provides methods for binding and unbinding event handlers to HTML elements.

### `__.Popstart`

This function initializes the Popstart library. It sets up event listeners for all the events specified in `__.config.BoundEventNames`.

### `__.functionFinder`

This function finds a function in the global `window` object given a path to the function.

### `__.functionParser`

This function parses a function name and separates it into the base name and a suffix (if present).

### `__.GetElementName`

This function returns a string representation of an HTML element's tag name and its last class (if any).

### `__.CheckAndStop`

This function checks various conditions and, if any of them are met, stops the propagation of an event and prevents its default action.

### `__.PopEvent`

This function is the main event handler of the Popstart library. It is called when an event occurs on an HTML element.

### `__.DOMWatcher`

This is an object that provides methods for starting and stopping a MutationObserver that watches for changes in the DOM.

### `__.Startup`

This function initializes the Popstart library when the DOM content is loaded.

## Additional Information

When working with the Popstart library, it's important to remember that it operates asynchronously using promises. This means that functions may not execute immediately when an event occurs, but will be scheduled to run in the future. Also, be aware that the library listens for events on HTML elements, so changes to the structure of the HTML could potentially affect the operation of the library.
