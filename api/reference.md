# API Reference

## Common Attribute Reference

The following are core attributes that you will reach for commonly.

<span style="display:inline-block;width:180px">Attribute</span> | Description
--------- | ------------
[data-request](./attributes/request.md) | Makes a request to a given AJAX handler
[data-request-data](./attributes/request-data.md) | Supplies postback data with the request
[data-request-trigger](./attributes/request-trigger.md) | The event that triggers the request
[data-request-update](./attributes/request-update.md) | Request specified partial view updates

### Additional Attribute Reference

All other attributes are specified below.

<span style="display:inline-block;width:180px">Attribute</span> | Description
--------- | ------------
[data-request-query](./attributes/request-query.md) | Supplies query data with the request and modifies the URL
[data-request-confirm](./attributes/request-confirm.md) | Displays a confirmation message before sending the request.
[data-request-before-send](./attributes/request-before-send.md) | Execute JavaScript before the request is sent.
[data-request-before-update](./attributes/request-before-update.md) | Execute JavaScript before the page contents are updated.
[data-request-success](./attributes/request-success.md) | Execute JavaScript on a successful request.
[data-request-error](./attributes/request-error.md) | Execute JavaScript on a failed request.
[data-request-complete](./attributes/request-complete.md) | Execute JavaScript on every completed request.
[data-request-cancel](./attributes/request-cancel.md) | Execute JavaScript if the user aborts the request or cancels it via a confirmation dialog.

## Available Events

<span style="display:inline-block;width:180px">Event</span> | Target | Description
----- | ------ | ------------
[ajax:before-send](./events/index.md#ajax-before-send) | window | fired before sending a request.
[ajax:before-update](./events/index.md#ajax:before-update) | trigger | fired after the request is complete, but before the page is updated.
[ajax:update](./events/index.md#ajax:update) | element | fired after the element has updated.
[ajax:update-complete](./events/index.md#ajax:update-complete) | window | fired after all elements have updated.
[ajax:request-success](./events/index.md#ajax:request-success) | window | request has completed successfully.
[ajax:request-error](./events/index.md#ajax:request-error) | window | request encountered an errors.
[ajax:error-message](./events/index.md#ajax:error-message) | window | an error message wants to display.
[ajax:confirm-message](./events/index.md#ajax:confirm-message) | window | a confirm message wants to display.
[ajax:setup](./events/index.md#ajax:setup) | trigger | before a request is formed.
[ajax:promise](./events/index.md#ajax:promise) | trigger | before the request is sent.
[ajax:done](./events/index.md#ajax:done) | trigger | the request was successful.
[ajax:fail](./events/index.md#ajax:fail) | trigger | the request failed.
[ajax:always](./events/index.md#ajax:always) | trigger | the request failed or was successful.

## Available Response Methods

<span style="display:inline-block;width:180px">Method</span> | Description
------ | ------------
[update()](./response/index.md#update) | adds DOM updates to the AJAX response
[data()](./response/index.md#data) | adds response data to the response
[redirect()](./response/index.md#redirect) | adds a browser redirect to the response
[reload()](./response/index.md#reload) | adds a browser refresh command to the response
[flash()](./response/index.md#flash) | adds flash messages to the response
[error()](./response/index.md#error) | adds an error message to the response
[fatal()](./response/index.md#fatal) | adds a fatal error message to the response
[js()](./response/index.md#js) | adds a JavaScript file or files to load with the output
[css()](./response/index.md#css) | adds a StyleSheet file or files to load with the output
[img()](./response/index.md#img) | adds an image file or files to load with the output
[browserEvent()](./response/index.md#browserEvent) | adds browser event dispatch with the response
[browserEventAsync()](./response/index.md#browserEventAsync) | adds asynchronous browser event dispatch with the response
[invalidFields()](./response/index.md#invalidFields) | adds invalid form fields to the response
[partials()](./response/index.md#partials) | provides multiple requested partial responses to the browser
[exception()](./response/index.md#exception) | processes an exception as an response

### Available Override Methods

<span style="display:inline-block;width:180px">Method</span> | Description
------ | ------------
[registerCustomResponse()](./response/index.md#register-custom-response) | replaces the `AjaxResponse` class with a custom one
[registerGlobalComponent()](./response/index.md#register-global-component) | register a stateless component class available globally

## JavaScript API Reference

<span style="display:inline-block;width:180px">Method</span> | Description
------ | ------------
[jax.ajax()](./framework/index.md#ajax) | issues an AJAX request
[jax.request()](./framework/index.md#request) | issues an AJAX request with a form element
[jax.flashMsg()](./framework/index.md#flash-msg) | displays a flash message
[jax.progressBar()](./framework/index.md#progress-bar) | displays the progress bar
[jax.attachLoader()](./framework/index.md#attach-loader) | flags an element as loading
[jax.waitFor()](./framework/index.md#wait-for) | waits for a an object to exist

### Turbo Router Functions

<span style="display:inline-block;width:180px">Method</span> | Description
------ | ------------
[jax.useTurbo()](./framework/index.md#use-turbo) | returns true if turbo routing is enabled
[jax.pageReady()](./framework/index.md#page-ready) | waits for the page to be ready
[jax.visit()](./framework/index.md#visit) | updates the page location

### Hot Control Functions

<span style="display:inline-block;width:180px">Method</span> | Description
------ | ------------
[jax.registerControl()](./framework/index.md#register-control) | registers a new hot control
[jax.importControl()](./framework/index.md#import-control) | returns a registered hot control class definition
[jax.observeControl()](./framework/index.md#observe-control) | attach a hot control and return the instance
[jax.fetchControl()](./framework/index.md#fetch-control) | fetch an instance on a single element
[jax.fetchControls()](./framework/index.md#fetch-controls) | fetch instances on a multiple elements
