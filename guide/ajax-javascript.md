# Calling AJAX from JavaScript

The JavaScript API gives you more control than the `data-request` attributes. It is designed for cases where requests need to be triggered conditionally, composed dynamically, or coordinated with other client-side behavior. The primary entry point is the `jax.ajax` method.

```js
const response = await jax.ajax('onFetchData');
```

The second argument to `jax.ajax` is an options object. This allows you to control request behavior, override defaults, and pass additional configuration to the handler.

```js
const response = await jax.ajax('onFetchData', {
    progressBar: false,
    data: { page: 2 }
});
```

::: tip
More details on the options can be found at the [`jax.ajax` Reference Guide](../api/framework/index.md#ajax).
:::

## Using Form Values

The `jax.request` method can be called on any element inside a form, or on the form element itself. When it is used on a child element, the request is automatically forwarded to the parent form and its input values are serialized.

```html
<form>
    <!-- Called on a form element -->
    <button
        onclick="jax.request(this, 'onProcess'); return false">
        Submit
    </button>
</form>
```

The method takes the target element as its first argument and the AJAX handler name as its second argument. The target can be either a selector string or a direct HTML element reference.

```html
<!-- Called on the form -->
<form onsubmit="jax.request(this, 'onProcess'); return false">
    <!-- Form Contents -->
</form>
```

The third argument to `jax.request` is an options object, identical to the `jax.ajax` method.
