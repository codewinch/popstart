# Popstart Utils Documentation

\_\_.resetForm('#myForm');

## \_\_.screenWidth

This function returns the width of the screen.

**Parameters:**
None

**Usage:**

```javascript
let width = __.screenWidth();
```

<<<< ORIGINAL
**Usage:**

```javascript
let height = __.screenHeight();
```

====
**Usage:**

```javascript
let height = __.screenHeight();
```

<<<< ORIGINAL
**Usage:**

```javascript
__.incrHTML(".year", "replaceme", 1990, 2023, 1);
```

====
**Usage:**

```javascript
__.incrHTML(".year", "replaceme", 1990, 2023, 1);
```

## \_\_.screenHeight

This function returns the height of the screen.

**Parameters:**
None

**Usage:**

```javascript
let height = __.screenHeight();
```

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