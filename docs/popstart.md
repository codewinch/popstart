# Popstart Library

Welcome to the Popstart library, a powerful JavaScript tool that leverages the power of promises to embed entire workflows directly into your HTML. This document provides a comprehensive overview of the `popstart.js` file, the beating heart of the library. Whether you're looking to modify, upgrade, or simply understand the inner workings of Popstart, you've come to the right place.

## Understanding PopEvent, PopStart, and Binding

The Popstart library is built around three core components: PopEvent, PopStart, and Binding. These components work together to monitor the page for changes and react accordingly. PopEvent is the main event handler of the library. It listens for events on HTML elements and triggers the appropriate handler function. PopStart initializes the library, setting up event listeners for all the events specified in the configuration. Binding provides methods for binding and unbinding event handlers to HTML elements. These components are interconnected, with PopEvent triggering the handler functions, PopStart setting up the event listeners, and Binding managing the binding and unbinding of these handlers.

When any of the watched events (or fake events, like startup) are triggered, the functions listed in HTML are also triggered. These functions are executed asynchronously using promises, allowing for non-blocking operation. This means that even if a function takes a long time to complete, it won't prevent other functions or events from being processed.

In the Popstart library, non-promise functions are automatically wrapped in a promise. This is done to ensure that all functions can be handled in the same way, regardless of whether they return a promise or not. By wrapping non-promise functions in a promise, they can be used in the same asynchronous manner as promise-based functions.

Errors in the Popstart library are handled gracefully. If an error occurs during the execution of a function, it is caught and logged to the console. This allows for easier debugging and ensures that a single error won't bring down the entire workflow.

## Examples of Popstart Flow

To better understand how the Popstart library works, let's look at some examples. These examples are taken from the README.md file and illustrate the flow of a typical Popstart workflow. (Please refer to the README.md file for these examples, or see below for a brief overview.)

1. Example 1: (description and code snippet)
2. Example 2: (description and code snippet)
3. Example 3: (description and code snippet)

## Theory of Operation

The `popstart.js` file contains a number of functions and variables that work together to enable the embedding of workflows in HTML using promises. The library listens for certain events on HTML elements and triggers corresponding functions, which are executed asynchronously using promises.

## Major Functions and Variables

### `__.GetStringAttr`

This function retrieves a string attribute from an HTML element. It takes four parameters: the element (`ele`), the name of the attribute (`name`), the name of the function calling `__.GetStringAttr` (`fnName`), and the name of the element (`eleName`). The function returns the value of the attribute as a string. If the attribute does not exist, the function returns `null`.

For example, if you have an HTML element like this: `<div id="myDiv" data-attr="hello">...</div>`, you can retrieve the value of the `data-attr` attribute like this: `__.GetStringAttr(document.getElementById('myDiv'), 'data-attr', 'myFunction', 'myDiv'); // returns "hello"`

### `__.GetIntAttr`

This function retrieves an integer attribute from an HTML element. It uses `__.GetStringAttr` to get the attribute as a string and then attempts to parse it as an integer. If the parsing is successful, the function returns the integer value. If the parsing fails or the attribute does not exist, the function returns `null`.

### `__.triggerChangeEvent`

This function triggers a 'change' event on a given HTML element. It is used to programmatically trigger change events as if they were triggered by user interaction. The function does not return any value.

### `__.handleInputChange`

This function is an event handler for 'input' events. It calls `__.triggerChangeEvent` on the target of the event. The function does not return any value.

### `__.attachInputListeners`

This function attaches 'input' event listeners to all input, textarea, select, and contenteditable elements in the document. The function does not return any value.

### `__.removeInputListeners`

This function removes 'input' event listeners from a given HTML element and all its descendants. The function does not return any value.

### `__.Binding`

This is an object that provides methods for binding and unbinding event handlers to HTML elements. The `__.Binding` object does not have any side effects.

### `__.Popstart`

This function initializes the Popstart library. It sets up event listeners for all the events specified in `__.config.BoundEventNames`. The function does not return any value.

### `__.functionFinder`

This function finds a function in the global `window` object given a path to the function. The function returns the found function or `null` if the function does not exist.

### `__.functionParser`

This function parses a function name and separates it into the base name and a suffix (if present). The function returns an object with two properties: `baseName` and `suffix`.

### `__.GetElementName`

This function returns a string representation of an HTML element's tag name and its last class (if any). The function does not have any side effects.

### `__.CheckAndStop`

This function checks various conditions and, if any of them are met, stops the propagation of an event and prevents its default action. The function does not return any value.

### `__.PopEvent`

This function is the main event handler of the Popstart library. It is called when an event occurs on an HTML element. The function checks the type of the event and the target element, and then calls the appropriate handler function. The function does not return any value.

### `__.DOMWatcher`

This is an object that provides methods for starting and stopping a MutationObserver that watches for changes in the DOM. The `__.DOMWatcher` object does not have any side effects.

### `__.Startup`

This function initializes the Popstart library when the DOM content is loaded. The function does not return any value.

## Additional Information

When working with the Popstart library, it's important to remember that it operates asynchronously using promises. This means that functions may not execute immediately when an event occurs, but will be scheduled to run in the future. Also, be aware that the library listens for events on HTML elements, so changes to the structure of the HTML could potentially affect the operation of the library.
