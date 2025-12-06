# `data-request-data`

Include additional data to be submitted with an AJAX request. By default the attribute value is a list of name-expression values as a JavaScript object definition.

```html
<button
    data-request="onExample"
    data-request-data="{ my_key: 'My Value' }">
    Submit Example
</button>
```

When the attribute is included on a form element, it will be sent in addition to the form input values.

```html
<form
    data-request="onUpdate"
    data-request-data="{ mode: 'update' }">
    <!-- Form Contents -->
</form>
```

The `data-request-data` attribute can be used on containers to include the data across multiple elements.

```html
<div data-request-data="{ id: 7 }">
    <button data-request="onDelete">Delete</button>
    <button data-request="onSave">Update</button>
</div>
```
