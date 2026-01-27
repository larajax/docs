# AJAX Handlers

AJAX event handlers are API endpoints for the AJAX framework to communicate with the server. They can respond with raw data, redirect the browser or dynamically update partials on the page.

## AJAX Handlers

To create an AJAX handler, define it in your controller or component. Handler names must use the `onSomething` pattern, for example, `onSubmitContactForm`.

```php
function onSubmitContactForm()
{
    // ...
}
```

::: tip Why the `on` prefix?
This naming convention serves as a security boundary. Only methods matching the `on[Something]` pattern are exposed as AJAX handlers. This prevents unintentional access to other public controller methods, which is a known vulnerability in some similar frameworks where any public method can be invoked from the client.
:::

### Calling a Handler

Every AJAX request should specify a handler name, either using the [data attributes or JavaScript API](../api/reference.md). When the request is made, the server will search all the registered handlers and locate the first one it finds.

```html
<!-- Attributes API -->
<button data-request="onSubmitContactForm">Go</button>

<!-- JavaScript API -->
<script> jax.ajax('onSubmitContactForm') </script>
```

### Form Serialization

When an AJAX request occurs inside a HTML form tag, all the input values of the form are available to the handler. In the example below, the `first_name` value will be sent with the request.

```html
<form id="myForm">
    <input name="first_name" />
    <button data-request="onSubmitContactForm">Go</button>
</form>
```

The JavaScript API support this logic with the `jax.request` function.

```html
<script> jax.request('#myForm', 'onSubmitContactForm') </script>
```

You may use the `request()` PHP function from Laravel to access the variable.

```php
function onSubmitContactForm()
{
    $firstName = request('first_name');
}
```
