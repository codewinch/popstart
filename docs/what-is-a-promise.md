# What is a Promise?

Imagine you're at a restaurant. You order a burger. Instead of making you wait at the counter, the cashier gives you a "beeper". This beeper will buzz when your burger is ready. Now, you can go sit down, drink some water, or even chat with a friend. When the beeper buzzes, you go to the counter and get your burger.

In this analogy:

1. Ordering the burger is like starting an asynchronous operation in code.
2. The beeper is like a Promise.
3. The buzzing of the beeper is the resolution (or rejection) of the Promise.

A Promise is a JavaScript object that represents a value which may be available now, in the future, or never. It has three states:

* Pending: Initial state; neither fulfilled nor rejected.
* Fulfilled: The operation completed successfully.
* Rejected: The operation failed.

A Promise is used for asynchronous computations and provides methods to handle the eventual completion (or failure) of the operation.

## popstart.js: A Narrative

Now, let's dive into popstart.js, which is designed to allow developers to embed entire workflows in HTML using promises.

**Initialization:** When popstart.js is loaded in a web page, it creates a global object called Popstart with various methods and properties. This object acts as the main interface for developers using the library.

**PopEvent:** This is a class (or blueprint) to create events that the library will handle. Events are like triggers or actions that the developer wants to monitor or control. The PopEvent class is responsible for creating such events and ensuring they can be properly tracked and managed by the library.

**Popstart:** This is another class that represents the main engine of the library. It contains methods to initialize events, bind them to specific elements on the webpage, and manage their lifecycle. When you want to use the library to manage events, you'd typically create an instance of this class and use its methods.

**Bind:** The Bind function is a core part of the library. It's used to attach (or "bind") events created by the PopEvent class to specific elements on the webpage. This means that when a particular action (like a click or hover) happens on that element, the associated event will be triggered.

### Examples

In the README, one example uses utility functions provided by popstart-utils.js. When the form is submitted, the following actions occur sequentially:

1. The form is scraped and converted to JSON.
2. A spinner is displayed.
3. The JSON data is posted to a server.
4. The spinner is hidden after the post is complete.

The actions are linked to the form using attributes like submit, scrape-selector, show-selector, etc.

### How it Works

Popstart uses attributes inside HTML elements to trigger changes within the page or make AJAX requests.

Functions listed, such as `__.get()`, will have their arguments automatically read from the HTML tag and applied in order.

If a function returns a promise (like `__.get()`), any failure will halt the function chain and cause the error flow to be executed. If a function doesn't return a promise, it's wrapped in one. All promises in a chain are executed sequentially until a failure occurs.
