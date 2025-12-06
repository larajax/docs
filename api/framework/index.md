# Framework API

These are all methods that can be called in the global `jax` object when the JavaScript framework is loaded.

## JavaScript API Reference

### Method - `ajax` {#ajax}

Issues a new AJAX request.

```js
jax.ajax('onSubmitContactForm')
```

Execute a single request that shows a Flash Message using logic handler.

```js
jax.ajax('onDoSomething', {
    flash: true,
    handleFlashMessage: function(message, type) {
        jax.flashMsg({ message: message, type: type });
    }
});
```

### Method - `request` {#request}

Identical to the `ajax()` method, except it submit an AJAX request with form data included. This serializes all the inputs inside the specified element.

```js
jax.request('#myForm', 'onSubmitContactForm')
```

### Method - `flashMsg` {#flash-msg}

Display a flash message of a given type as either `success`, `error` or `warning`. An optional `interval` can be specified to control how long the flash message is displayed in seconds.

```js
jax.flashMsg({
    message: 'Record has been successfully saved. This message will disappear in 1 second.',
    type: 'success',
    interval: 1
});
```

### Method - `progressBar` {#progress-bar}

Display a progress bar with `show` and `hide` functions.

```js
jax.progressBar.show();

jax.progressBar.hide();
```

### Method - `attachLoader` {#attach-loader}

Add the loader to a button with `show` and `hide` functions. Pass the element selector or object as the first argument.

```js
jax.attachLoader.show('.my-element');

jax.attachLoader.hide('.my-element');
```

### Method - `pageReady` {#page-ready}

Call code when the page and scripts are ready. The function returns a promise that is resolved after all the page scripts have loaded, or immediately if they are already loaded.

```js
jax.pageReady().then(() => {
    // Page has finished loading scripts
    // or is ready right now
});
```

### Method - `waitFor` {#wait-for}

Wait for an object or variable to exist. The function returns a promise that is resolved when the variable is found.

```js
jax.waitFor(() => window.propName).then(() => [
    // window.propName is now available
]);
```

The second argument provides a timeout interval in milliseconds, the following will stop waiting after two seconds.

```js
jax.waitFor(() => window.propName, 2000).then(() => {
    console.log('Found the variable!')
}).catch(() => {
    console.error('Gave up waiting...')
});
```

### Method - `dispatch` {#dispatch}

Triggers a global event on the `document` HTML element.

```js
jax.dispatch('app:custom-event');
```

### Method - `trigger` {#trigger}

Triggers an event on the specified HTML element.

```js
jax.trigger(element, 'app:custom-event');
```

### Method - `on` {#on}

Attach an event handler function for one or more events to the selected elements.

```js
jax.on(element, 'click', () => {
    console.log("Element was clicked!");
});
```

To attach to one element and listen on another, specify the target as the third argument.

```js
jax.on(element, 'click', 'button', () => {
    console.log("Button was clicked!");
});
```

### Method - `off` {#off}

Remove an event handler.

```js
jax.off(element, 'click');
```

### Method - `values` {#values}

Returns the input values that would resolve for a given element for a request.

```js
jax.values(document.querySelector('#myForm'));
```

## Turbo Router Functions

### Method - `useTurbo` {#use-turbo}

Checks if the turbo router is enabled and should be used.

```js
if (jax.useTurbo && jax.useTurbo()) {
    // Use PJAX
}
```

### Method - `visit` {#visit}

Programmatically visit a link.

```js
jax.visit(location);
```

Replace the current URL without adding it to the navigation history, similar to `window.history.replaceState`, set the `action` option to **replace**.

```js
jax.visit(location, { action: 'replace' });
```

## Hot Control Functions

### Method - `registerControl` {#register-control}

Registers a hot control. The second argument must be a class definition that extends `jax.ControlBase`.

```js
jax.registerControl('hello', class extends jax.ControlBase {
    // ...
});
```

### Method - `importControl` {#import-control}

Return a control class that has been registered, which can be useful for calling static methods on the class. The function accepts the control identifier as a string.

```js
const searchControlClass = jax.importControl('search');
```

### Method - `observeControl` {#observe-control}

Immediately resolve a control instance and attach it to the element. This is useful when an element does not have the `data-control` attribute and you want to attach it without waiting for the observer events.

```js
const searchControl = jax.observeControl(element, 'search');
```

### Method - `fetchControl` {#fetch-control}

Return a control instance from an existing control element, this accepts a selector string, or an element directly. The resulting instance support method calls or accessing properties found on the control class definition.

```js
const searchControl = jax.fetchControl(element);
```

You may also pass a selector string, along with the control name as the second argument (optional). This is useful when multiple controls are bound to the same element and you want to clarify the exact identifier.

```js
const searchControl = jax.fetchControl('[data-control=search]', 'search');
```

### Method - `fetchControls` {#fetch-controls}

Identical to `fetchControl` except handles multiple elements.

```js
const listItems = jax.fetchControls(elements, 'list-item');
```
