# Flash Messages

Flash messages are a handy way to let the user know the outcome of a request, either as a success or failure. Use the `ajax()->flash()` method to display a message after the request finishes. Flash messages are usually set inside AJAX handlers.

```php
function onSave()
{
    // Sets a successful message
    return ajax()->flash('success', 'Settings successfully saved!');
}
```

The first argument is the message type: `success`, `error`, `warning`, or `info`.

```php
function onSave()
{
    return ajax()
        ->flash('success', 'Settings saved!')
        ->flash('info', 'Remember to publish your changes.');
}
```

You can combine flash messages with other response methods like `update()`:

```php
function onDeleteItem()
{
    // Delete item...

    return ajax()
        ->flash('success', 'Item deleted')
        ->update(['#items-list' => view('partials.items-list')]);
}
```

Flash messages will disappear after an interval of 3 seconds. Clicking on a flash message will stop it from disappearing.

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

## Using Flash for Errors

By default, AJAX errors are displayed using the native `alert()` dialog. You can use the `data-request-flash` attribute to show errors as flash messages instead.

```html
<button
    data-request="onSubmit"
    data-request-flash>
    Submit
</button>
```

Using the JavaScript API, set `flash: true` in the options.

```js
jax.request('onSubmit', { flash: true });
```

By default, this shows `success`, `error`, `warning`, and `info` messages but excludes `validate` messages (since validation errors are typically shown inline next to form fields). Use `*` to include all message types.

```html
<button
    data-request="onSubmit"
    data-request-flash="*">
    Submit
</button>
```

## Customizing Alerts

When an AJAX request returns an error message, the framework triggers the `ajax:error-message` event before showing the native `alert()`. You can intercept this to use your own notification library.

```js
addEventListener('ajax:error-message', function(event) {
    event.preventDefault();

    Swal.fire({
        icon: 'error',
        title: 'Error',
        text: event.detail.message
    });
});
```

## Customizing Confirms

When a request has a `confirm` option (via `data-request-confirm` or the JavaScript API), the framework triggers the `ajax:confirm-message` event. The event detail includes a `promise` object that you must resolve or reject to continue or cancel the request.

```js
addEventListener('ajax:confirm-message', function(event) {
    event.preventDefault();

    const { message, promise } = event.detail;

    Swal.fire({
        title: 'Confirm',
        text: message,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'Cancel'
    }).then((result) => {
        result.isConfirmed ? promise.resolve() : promise.reject();
    });
});
```

::: tip
For customizing loading indicators, see [Loading Indicators](./loading-indicators.md#working-with-javascript).
:::
