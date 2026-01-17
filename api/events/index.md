# Events

Hooking in to events provides a way to enhance the behavior of the AJAX functionality. The events are listed below.

### Event - `ajax:before-request` {#ajax:before-request}

Triggered on the triggering element before the request is sent. The event detail contains `context` with the request options. Useful for element-specific loading indicators.

### Event - `ajax:before-send` {#ajax-before-send}

Triggered on the window object before sending the request. The event detail contains `context` with the request options.

### Event - `ajax:request-start` {#ajax:request-start}

Triggered on the window object when the HTTP request starts. The event detail contains:

- `url` - The request URL
- `xhr` - The XMLHttpRequest object

Useful for global loading indicators.

### Event - `ajax:request-end` {#ajax:request-end}

Triggered on the window object when the HTTP request ends. The event detail contains:

- `url` - The request URL
- `xhr` - The XMLHttpRequest object

### Event - `ajax:before-update` {#ajax:before-update}

Triggered on the form object directly after the request is complete, but before the page is updated.

### Event - `ajax:update` {#ajax:update}

Triggered on a page element after it has been updated with the framework.

```js
document.querySelector('#result').addEventListener('ajax:update', function() {
    console.log('Updated the #result element!');
});
```

### Event - `ajax:update-complete` {#ajax:update-complete}

Triggered on the window object after all elements are updated by the framework.

Animating an element after a specific AJAX handler completes its update.

```js
addEventListener('ajax:update-complete', function(event) {
    const { handler } = event.detail.context;

    // If the handler is either of the following
    if (['onRemoveFromCart', 'onAddToCart'].includes(handler)) {

        // Run an animation for 2 seconds
        var el = document.querySelector('#miniCart');
        el.classList.add('animate-shockwave');
        setTimeout(function() { el.classList.remove('animate-shockwave'); }, 2000);
    }
});
```

### Event - `ajax:request-success` {#ajax:request-success}

Triggered on the form object after the request is successfully completed. The handler gets 5 parameters: the event object, the context object, the data object received from the server, the status text string, and the XHR object.

### Event - `ajax:request-complete` {#ajax:request-complete}

Triggered on the triggering element after the request completes (success or error). The event detail contains:

- `context` - The request context
- `data` - The response data
- `responseCode` - The HTTP status code
- `xhr` - The XMLHttpRequest object

### Event - `ajax:request-cancel` {#ajax:request-cancel}

Triggered on the triggering element when a request is cancelled, such as when the user declines a confirmation dialog. The event detail contains:

- `context` - The request context

Use this event alongside `ajax:request-complete` to ensure loaders are hidden even when requests are cancelled before they start.

### Event - `ajax:request-error` {#ajax:request-error}

Triggered on the form object if the request encounters an error.

### Event - `ajax:error-message` {#ajax:error-message}

Triggered on the window object when an error message should be displayed. The event detail contains:

- `message` - The error message from the server

Call `event.preventDefault()` to suppress the default `alert()` behavior.

### Event - `ajax:confirm-message` {#ajax:confirm-message}

Triggered on the window object when confirmation is required (via `data-request-confirm` or the `confirm` option). The event detail contains:

- `message` - The confirmation message
- `promise` - An object with `resolve()` and `reject()` methods to continue or cancel the request

Call `event.preventDefault()` to suppress the default `confirm()` dialog.

### Event - `ajax:setup` {#ajax:setup}

Triggered before the request is formed. The event detail provides the `context` object, allowing options to be modified via `context.options`. Use this to apply global configuration to all AJAX requests.

```js
addEventListener('ajax:setup', function(event) {
    const { options } = event.detail.context;

    // Enable flash message handling on all requests
    options.flash = true;

    // Disable the progress bar globally
    options.progressBar = false;

    // Handle Error Messages by triggering a flashMsg of type error
    options.handleErrorMessage = function(message) {
        jax.flashMsg({ message: message, type: 'error' });
    }

    // Handle Flash Messages by triggering a flashMsg of the message type
    options.handleFlashMessage = function(message, type) {
        jax.flashMsg({ message: message, type: type });
    }
});
```
