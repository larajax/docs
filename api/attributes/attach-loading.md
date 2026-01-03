# `data-attach-loading`

Disables an element and displays a loading indicator while an AJAX request is running. This is commonly used on buttons to prevent double-clicks and provide visual feedback.

```html
<button data-request="onSubmit" data-attach-loading>
    Submit
</button>
```

During the request:
- The element is disabled
- The CSS class `ajax-attach-loader` is added
- A loading spinner appears via the `:after` CSS selector

## Usage with Forms

When placed on a button inside a form with `data-request`, the loading indicator activates during form submission:

```html
<form data-request="onSubmit">
    <input name="email" />

    <button data-attach-loading>
        Submit
    </button>
</form>
```

## Usage with Inputs

For input elements (which don't support `:after`), a new element is inserted after the input and removed when complete:

```html
<input name="username"
    data-request="onCheckUsername"
    data-request-trigger="input changed"
    data-attach-loading />
```

## JavaScript API

Use `jax.attachLoader` to manually control the loading state:

```js
// Show loading indicator
jax.attachLoader.show('.my-button');

// Hide loading indicator
jax.attachLoader.hide('.my-button');
```

## Styling

Customize the loading indicator appearance with CSS:

```css
.ajax-attach-loader {
    /* Custom styles for loading state */
}

.ajax-attach-loader:after {
    /* Custom spinner styles */
}
```

## See Also

- [Loading Indicators Guide](../../guide/loading-indicators.md)
- [`data-request-loading`](./request-loading.md)
