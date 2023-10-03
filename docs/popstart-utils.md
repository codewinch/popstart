# Popstart Utils Documentation

## \_\_.incrHTML

This function incrementally clones an element and replaces a value in the clone.

**Parameters:**

- `selector`: The selector of the element to clone.
- `replaceValue`: The value to replace in the cloned element.
- `start`: The number to start at (default is 0).
- `end`: The number to end at (default is 0).
- `step`: The number to increment by (default is 1).

**Usage:**

````javascript
# Popstart Utils Documentation

## \_\_.incrHTML

This function incrementally clones an HTML element and replaces a specific value in the clone. It is useful when you need to create multiple similar elements with a slight variation in each.

**Parameters:**

- `selector`: The CSS selector of the HTML element to clone. This should be a valid CSS selector string that identifies the element you want to clone.
- `replaceValue`: The value to replace in the cloned element. This should be a string that exists in the HTML content of the element you're cloning.
- `start`: The number to start at when replacing the `replaceValue` (default is 0). This is the first value that will replace the `replaceValue` in the first clone.
- `end`: The number to end at when replacing the `replaceValue` (default is 0). This is the last value that will replace the `replaceValue` in the last clone.
- `step`: The number to increment by when replacing the `replaceValue` (default is 1). This is the value that will be added to the current replacement value for each new clone.

**Usage:**

```javascript
// This will clone the element with the class "year", replace the string "replaceme" with numbers from 1990 to 2023 (inclusive), and append the clones to the same parent element.
__.incrHTML(".year", "replaceme", 1990, 2023, 1);
````
