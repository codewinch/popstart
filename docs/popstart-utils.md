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

```javascript
__.incrHTML(".year", "replaceme", 1990, 2023, 1);
