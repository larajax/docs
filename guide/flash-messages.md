# Flash Messages

Flash Messages are a handy way to let the user know the outcome of a request, either as a sucess or failure. Simply use the `Flash` facade to display a message after the request finishes. Flash messages are usually set inside AJAX handlers.

```php
function onSave()
{
    // Sets a successful message
    Flash::success('Settings successfully saved!');

    // Sets an error message
    Flash::error('Something went wrong...');

    // Sets a warning message
    Flash::warning('Please confirm your email address soon');

    // Sets an informative message
    Flash::info('The export is still processing. Please try again in a minute.');
}
```

Flash messages will disappear after an interval of 3 seconds. Clicking on a flash message will stop it from disappearing.

## Built-in Flash Messages

The AJAX framework has built-in support for flash messages, simply specify the `data-request-flash` attribute on a form to enable the use of flash messages on completed AJAX requests.

```html
<form
    data-request="onSuccess"
    data-request-flash>
    <!-- Form Contents -->
</form>
```

To only display a specific flash message type, you may pass the value to the attribute &mdash; **success**, **error**, **info**, **warning** or **validate**. Multiple values are separated by commas.

```html
<form data-request-flash="success,warning"></form>
```

When using [validation features](./validation.md) in combination with the `data-request-flash` attribute, the validation errors take priority and suppress the flash message. To display both at the same time, include the **validate** type with the attribute.

```html
<form
    data-request-validate
    data-request-flash="success,error,validate">
```

### Loading Flash Message

The `data-request-message` attribute can be used to display a flash progress message while the request runs. This is great particularly for long running processes.

```html
<button
    data-request="onSubmit"
    data-request-message="Please wait while we process your request...">
    Submit
</button>
```

### Styling the Flash Message

To change the appearance of the flash message, target the `.jax-flash-message` CSS class.

```css
.jax-flash-message.success {
    background: green;
}
.jax-flash-message.error {
    background: red;
}
.jax-flash-message.warning {
    background: orange;
}
.jax-flash-message.info {
    background: aqua;
}
.jax-flash-message.loading {
    background: aqua;
}
```

## Working with JavaScript

Use the `jax.flashMsg` function to display a flash message using JavaScript. A type can be specified as either `success`, `error` or `warning`. An optional `interval` can be specified to control how long the flash message is displayed in seconds.

```js
jax.flashMsg({
    message: 'Record has been successfully saved. This message will disappear in 1 second.',
    type: 'success',
    interval: 1
});
```
