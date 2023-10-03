# Core Utilities in `Popstart.js`

The library initializes with some global configurations under the __ namespace. This namespace acts as the primary interface for utility functions and global state management. Various configurations, like AttrPrefixes, BoundEventNames, and DebounceTimes, are specified, but can be overridden if desired.

`popstart.js` provides a rich set of utilities to facilitate various DOM and event operations under the __ namespace. These utility functions provide a simplified interface for common DOM manipulations:

* __.del: Removes elements specified by a selector.
* __.text: Gets or sets the text content of elements.
* __.html: Gets or sets the inner HTML of elements.
* __.val: Gets or sets the value of form elements.
* __.on: Attaches an event listener to elements.
* __.off: Removes an event listener from elements.
* __.css: Gets or sets styles on elements.
* __.hide: Hides elements specified by a selector.
* __.show: Displays elements specified by a selector.
* __.toggle: Toggles the visibility of elements.
* __.switch: Hides one set of elements and shows another.
* __.addClass, __.removeClass, __.removeAllClasses, __.hasClass, __.toggleClass: Functions for managing class attributes of elements.
* __.removeAttr: Removes a specified attribute from elements.
* __.clone, __.cloneMe: Functions for cloning the content of elements.
* __.noop: A no-operation function.
* __.test, __.alert, __.error: Functions for alerting and logging.
* __.shuffle: Randomly rearranges child elements.
* __.prefersDarkMode, __.addDarkMode: Functions related to dark mode preferences.
* __.trigger: Triggers an event on specified elements.
* __.delay: Returns a promise that resolves after a given time.
* __.click: Simulates a click event on elements.
* __.empty: Clears the inner content of elements.
* __.append: Appends HTML content to elements.
* __.dataclean, __.datawrite, __.dataread: Functions for reading, writing, and cleaning data in the global __ namespace.
* __.uuid: Generates a UUID.
* __.visible: Checks if elements are visible.
* __.attr: Gets or sets an attribute on elements.
* __.debounce: Returns a debounced version of a function.
* __.parent, __.parentChild: Functions to find parent elements based on a selector.
* __.el: A utility to select elements. This is a core function as it's frequently used by other utilities.
* __.hiddeninput: Appends a hidden input field to specified elements.
* __.attr: Extended attribute utility, now handling inline styles.
* l: A logging utility that comes with different logging levels and styles.
