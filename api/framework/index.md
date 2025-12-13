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

The second argument of the `jax.ajax()` method is an [options object](#request-options).

#### Using Async / Await

Both `jax.ajax()` and `jax.request()` return a Promise that can be used with `async`/`await` syntax. The resolved value is a [response object](#response-object) containing the data from the server.

```js
const data = await jax.ajax('onGetRecords');

console.log(data.records); // Access returned data
console.log(data.$status); // Access HTTP status code
```

You can also use traditional Promise methods like `then()` and `catch()`.

```js
jax.ajax('onGetRecords')
    .then(data => {
        console.log(data.records);
    })
    .catch(data => {
        console.error(data.$env.getMessage());
    });
```

For compatibility, jQuery-style promise methods are also available: `done()`, `fail()`, and `always()`.

```js
jax.ajax('onGetRecords')
    .done(data => console.log('Success:', data))
    .fail(data => console.log('Error:', data))
    .always(data => console.log('Complete'));
```

#### Cancelling Requests

The returned promise has a `cancel()` method that can be used to abort the request.

```js
const request = jax.ajax('onLongRunningTask');

// Cancel the request after 5 seconds
setTimeout(() => request.cancel(), 5000);
```

### Method - `request` {#request}

Identical to the `ajax()` method, except it submit an AJAX request with form data included. This serializes all the inputs inside the specified element.

```js
jax.request('#myForm', 'onSubmitContactForm')
```

The third argument of the `jax.request()` method is an [options object](#request-options).

### Response Object {#response-object}

The response object returned by `jax.ajax()` and `jax.request()` contains the data returned from the server, with additional non-enumerable properties for accessing metadata.

```js
const data = await jax.ajax('onGetUser');

// Data properties are directly accessible
console.log(data.name);
console.log(data.email);

// Metadata is available via $ prefixed properties
console.log(data.$status);
console.log(data.$xhr);
console.log(data.$env.getMessage());
```

The following metadata properties are available on the response object.

Property | Description
------------- | -------------
**$status** | the HTTP status code of the response (e.g., `200`, `500`).
**$xhr** | the underlying `XMLHttpRequest` object.
**$env** | the response envelope object containing parsed response metadata.

#### Response Envelope

The `$env` property provides access to the response envelope with the following methods.

Method | Description
------------- | -------------
**getMessage()** | returns the message string from the response, if any.
**getData()** | returns the data object from the response.
**getStatus()** | returns the HTTP status code.
**getSeverity()** | returns the severity level (`info`, `error`, `fatal`).
**getInvalid()** | returns an object of invalid field names and their error messages.
**getRedirectUrl()** | returns the redirect URL if the server requested a redirect.
**getFlash()** | returns an array of flash messages with `level` and `text` properties.
**isError()** | returns `true` if the response indicates an error.
**isFatal()** | returns `true` if the response indicates a fatal error (status 500-599).

### Request Options {#request-options}

The following options are available for the `jax.ajax()` and `jax.request()` methods.

Option | Description
------------- | -------------
**update** | an object, specifies a list partials and page elements (as CSS selectors) to update: `{'partial': '#select'}`. The selector string should start with a `#` or `.` character, except you may also prepend it with `@` to append contents to the element, `^` to prepend, `!` to replace with and `=` to use any CSS selector.
**confirm** | the confirmation string. If set, a confirmation dialog is displayed before the request is sent. If the user clicks the Cancel button, the request cancels.
**data** | an optional object specifying data to be sent to the server along with the form data: `{var: 'value'}`.
**query** | an optional object specifying data to be added to the current URL query string. When set to `true`, the form data is used.
**headers** | an optional object specifying header values to be sent to the server with the request.
**redirect** | string specifying an URL to redirect the browser to after the successful request.
**url** | a string specifying the URL to send the request to. By default, the current page URL is used.
**form** | a form element to use for sourcing the form data sent with the request, either passed as a selector string or a form element.
**flash** | when true, instructs the server to clear and send any flash messages with the response. Default: `false`
**files** | when true, the request will accept file uploads using the `FormData` interface. Default: `false`
**download** | when true, file downloads are accepted with a `Content-Disposition` response. When a string, the downloaded filename can be specified. Default: `false`
**bulk** | when true, the request be sent as JSON for bulk data transactions. Default: `false`
**browserValidate** | when true, browser-based client side validation will be performed on the request before submitting. Only applies to requests triggered in the context of a `<form>` element.
**browserTarget** | when set with `download`, opens the file in a new browser window with the specified target name.
**browserRedirectBack** | when true and a redirect occurs, if the previous URL from the browser is available, use that in place of the redirect URL provided. Default: `false`.
**message** | displays a progress message with the specified text, shown while the request is running.
**loading** | an optional string or object to be displayed when a request runs. The string should be a CSS selector for an element or the object should support the `show()` and `hide()` functions to manage the visibility.
**progressBar** | enable the progress bar when an AJAX request occurs.

#### Callback Options

The following callback options take a function with the [response object](#response-object) as the first argument. The HTTP status code and XHR object can be accessed via `data.$status` and `data.$xhr` respectively.

```js
success: function(data) {
    console.log(data.$status); // HTTP status code
    console.log(data.$xhr);    // XMLHttpRequest object
}
```

Option | Description
------------- | -------------
**beforeUpdate** | a callback function to execute before page elements are updated. Return `false` to prevent the update. The `this` variable inside the function resolves to the request context.
**afterUpdate** | a callback function identical to `beforeUpdate` except it executes after the page elements are updated.
**success** | a callback function to execute in case of a successful request. If this option is supplied it overrides the default framework functionality: the elements are not updated and events are not triggered. To call the default framework functionality, use `this.success(...)` inside your function.
**error** | a callback function execute in case of an error. By default the alert message is displayed. If this option is overridden the alert message won't be displayed. Return `false` to prevent the default error handling.
**complete** | a callback function execute in case of a success or an error.
**cancel** | a callback function execute in case the user aborts the request or cancels it via a confirmation dialog.

#### Logic Handlers

You may also override some of the request logic by passing new functions as options. These logic handlers are available.

Handler | Description
------------- | -------------
**handleConfirmMessage(message)** | called when requesting confirmation from the user.
**handleErrorMessage(message)** | called when an error message should be displayed.
**handleValidationMessage(message, fields)** | focuses the first invalid field when validation is used.
**handleFlashMessage(message, type)** | called when a flash message is provided using the **flash** option (see above).
**handleRedirectResponse(url)** | called when the browser should redirect to another location.
**handleProgressMessage(message, isDone)** | called when showing or hiding a progress message.

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
