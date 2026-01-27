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

## Handling Errors with Async/Await

When using `await`, any non-2xx HTTP response (400, 422, 500, etc.) will reject the promise and throw an exception. This includes validation errors (422) and explicit errors (400).

```js
try {
    const data = await jax.ajax('onDoSomething');
} catch (data) {
    // Handle 400, 422, 500 errors
    if (data.$env.message) {
        alert(data.$env.message);
    }
}
```

However, in most cases the framework already handles error display automatically, including validation messages on fields and flash errors. If you don't need custom error handling, you can silently catch errors:

```js
const data = await jax.ajax('onDoSomething').catch(() => null);
```

This pattern is useful when you need blocking behavior in an async function but want the framework to handle all error UI:

```js
async function handleSubmit() {
    const data = await jax.ajax('onValidate').catch(() => null);
    if (!data) return; // Stop if validation failed

    // Continue with next step...
    await jax.ajax('onSubmit').catch(() => null);
}
```

::: tip
If you don't need to wait for the response or handle errors manually, you can simply call `jax.ajax('onDoSomething')` without `await`. The framework handles all success and error states automatically.
:::
