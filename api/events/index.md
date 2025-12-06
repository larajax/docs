# Events

Hooking in to events provides a way to enhance the behavior of the AJAX functionality. The events are listed below.

### Event - `ajax:before-send` {#ajax-before-send}

Triggered on the window object before sending the request. The handler details provide the `context` object.

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

### Event - `ajax:request-error` {#ajax:request-error}

Triggered on the form object if the request encounters an error.

### Event - `ajax:error-message` {#ajax:error-message}

Triggered on the window object if the request encounters an error. The handler has a `message` detail with the error message returned from the server.

### Event - `ajax:confirm-message` {#ajax:confirm-message}

Triggered on the window object when `confirm` option is given. The handler has a `message` detail with a text message assigned to the handler as part of `confirm` option. A `promise` detail is also provided to defer or cancel the outcome, this is useful for implementing custom confirm logic/interface instead of native javascript confirm box.

Using a supplied `promise` from the event detail.

```js
addEventListener('ajax:confirm-message', function(event) {
    const { message, promise } = event.detail;

    // Prevent default behavior
    event.preventDefault();

    // Handle promise
    if (confirm(message)) {
        promise.resolve();
    }
    else {
        promise.reject();
    }
});
```

### Event - `ajax:setup` {#ajax:setup}

Triggered before the request is formed. The handler details provide the `context` object, allowing options to be modified via the `context.options` property.

Applies configurations to all AJAX requests globally.

```js
addEventListener('ajax:setup', function(event) {
    const { options } = event.detail.context;

    // Enable AJAX handling of Flash messages on all AJAX requests
    options.flash = true;

    // Disable the progress bar for all AJAX requests
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

### Event - `ajax:promise` {#ajax:promise}

Triggered directly before the AJAX request is sent. The handler details provide the `context` object.

### Event - `ajax:done` {#ajax:done}

Triggered finally if the AJAX request was successful.

### Event - `ajax:fail` {#ajax:fail}

Triggered finally if the AJAX request fails.

### Event - `ajax:always` {#ajax:always}

Triggered regardless if the AJAX request fails or was successful.
