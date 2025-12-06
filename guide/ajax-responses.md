# AJAX Responses

## Redirects in AJAX Handlers

If you need to redirect the browser to another location, return the `Redirect` response object from the AJAX handler. The framework will redirect the browser as soon as the response is returned from the server. Example AJAX handler with a redirect.

```php
function onRedirectMe()
{
    return ajax()->redirect('http://google.com');
}
```

## Returning Data from AJAX Handlers

The response from an AJAX handler can serve as consumable API by returning structured data. If an AJAX handler returns an array, you can access its elements in the `success` event handler. Example AJAX handler that returns a data object.

```php
function onFetchDataFromServer()
{
    // Some server-side code

    return ajax()->data([
        'totalUsers' => 1000,
        'totalProjects' => 937
    ]);
}
```

The data can be fetched with the data attributes API.

```html
<form
    data-request="onHandleForm"
    data-request-success="console.log(data)">
```

The same with the JavaScript API.

```js
jax.request(this.form, 'onHandleForm', {
    success: function(data) {
        console.log(data);
    }
});
```

## Returning Errors

Use the [`error()` method](../api/response/index.md#error) to respond with an error

```php
return ajax()->error("Not enough questions");
```

To treat the response as an error while retaining the ability to send response contents as normal. Simply chain on the [`data()` method](../api/response/index.md#data).

```php
return ajax()
    ->error("Not enough questions")
    ->data(['questionsNeeded' => 2]);
```

These errors are handled by the AJAX framework.

```html
<form
    data-request="onHandleForm"
    data-request-error="console.log(data)">
```

The same with the JavaScript API.

```js
jax.request(this.form, 'onHandleForm', {
    error: function(data) {
        console.log(data);
    }
})
```

## Dispatching Browser Events

You may dispatch JavaScript events from AJAX handlers using the `dispatchBrowserEvent` method. This method takes any event name (first argument) and detail variables to pass to the event (second argument), the variables must be compatible with JSON serialization.

```php
function onPerformAction()
{
    return ajax()->browserEvent('app:update-profile', ['name' => 'Jeff']);
}
```

In the browser, use the `addEventListener` to listen for the dispatched event when the AJAX request completes. The event variables are available via the `event.detail` object.

```js
addEventListener('app:update-profile', function (event) {
    alert('Profile updated with name: ' + event.detail.name);
});
```

For example, if you want to show an alert that a document has already been updated by another user, you could dispatch an event to the browser and throw an `AjaxException` to halt the process.

You can listen to this event in the browser using a generic listener. This example prompts the user before resubmitting the request with a `force` flag set in the data.

```js
addEventListener('app:stale-document', function (event) {
    if (confirm('Another user has updated this document, proceed?')) {
        jax.request(event.target, 'onUpdate', { data: {
            force: true
        }});
    }
});
```

To prevent the partials from updating as part of the response, call `preventDefault()` on the event object.

```js
addEventListener('app:stale-document', function (event) {
    event.preventDefault();
});
```
