# AJAX Responses

The `AjaxResponse` class provides a fluent interface for building structured AJAX responses in Larajax. All methods can be chained together to build complex responses. Get an instance by calling the `ajax()` helper function.

```php
function onHandleRequest()
{
    return ajax()
        ->data(['message' => 'Success'])
        ->update(['#status' => 'Request processed']);
}
```

## Updating the DOM

One of the most common AJAX operations is updating parts of the page. Larajax provides two approaches for DOM updates:

| Method | Strategy | Description |
| ------ | -------- | ----------- |
| `update()` | **Push** | Server decides what to update and pushes content to specific selectors |
| `partial()` | **Pull** | Client requests specific partials, server renders and returns them |

### Push Updates with `update()`

The `update()` method allows you to patch the DOM by targeting specific elements and replacing their content. The server decides what gets updated.

### Basic Updates

Update a single element by its ID or CSS selector:

```php
function onUpdateContent()
{
    return ajax()->update([
        '#myElement' => '<div>New content</div>'
    ]);
}
```

### Multiple Updates

You can update multiple elements in a single response:

```php
function onRefreshDashboard()
{
    return ajax()->update([
        '#user-count' => '<span>1,234 users</span>',
        '#project-count' => '<span>56 projects</span>',
        '.status-indicator' => '<span class="online">Online</span>'
    ]);
}
```

### Swap Modes

Control how content is inserted using the `swap` option. The default swap mode is `innerHTML`.

```php
function onAddItem()
{
    return ajax()->update([
        '#list' => [
            'content' => '<li>New item</li>',
            'swap' => 'append'  // Add to the end
        ]
    ]);
}
```

Available swap modes:

- **innerHTML**: Sets the content of the target element (default)
- **outerHTML**: Replaces the target element entirely
- **append**: Inserts content at the end of the target element
- **prepend**: Inserts content at the beginning of the target element
- **after**: Inserts content immediately after the target element
- **before**: Inserts content before the target element
- **replace**: Completely replaces the target element with the content

## Form Validation

The `invalidFields()` method is commonly used to return validation errors to the client. This automatically sets the response status to 422 (Unprocessable Entity) and marks the response as an error.

### Single Field Error

```php
function onSubmitForm()
{
    return ajax()->invalidField('email', 'Invalid email address');
}
```

### Multiple Field Errors

```php
function onValidateForm()
{
    return ajax()->invalidFields([
        'username' => 'Username is required', 'Must be at least 3 characters',
        'email' => 'Invalid email format',
        'password' => 'Password must contain a number'
    ]);
}
```

## Redirects in AJAX Handlers

If you need to redirect the browser to another location, return the `Redirect` response object from the AJAX handler. The framework will redirect the browser as soon as the response is returned from the server. Example AJAX handler with a redirect.

```php
function onRedirectMe()
{
    return ajax()->redirect('http://google.com');
}
```

Trigger a full page reload from the server:

```php
function onResetApplication()
{
    // Clear cache...

    return ajax()->reload();
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

Or using async/await.

```js
const data = await jax.request(this.form, 'onHandleForm');
```

## Returning Errors

### Regular Errors

Use the `error()` method to respond with an error. This sets the HTTP status to 400 and triggers the standard AJAX error lifecycle events.

```php
return ajax()->error("Not enough questions");
```

You can customize the HTTP status code:

```php
return ajax()->error("Forbidden action", 403);
```

To treat the response as an error while retaining the ability to send response contents as normal, simply chain on the `data()` method.

```php
return ajax()
    ->error("Not enough questions")
    ->data(['questionsNeeded' => 2]);
```

These errors are handled by the AJAX framework and trigger error event handlers.

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

Again with async/await.

```js
try {
    const data = await jax.request(this.form, 'onHandleForm');
} catch (error) {
    console.log(error);
}
```

### Fatal Errors

Use the `fatal()` method for critical errors that should not trigger the usual lifecycle events. This sets the HTTP status to 500 by default and bypasses standard error handling.

```php
function onCriticalOperation()
{
    if (!criticalServiceAvailable()) {
        return ajax()->fatal("System unavailable");
    }

    // Process request...
}
```

You can customize the HTTP status code:

```php
return ajax()->fatal("Database connection failed", 503);
```

Fatal errors are useful when:
- A critical system component is unavailable
- The application is in an invalid state
- You want to bypass normal error handling and event lifecycle
- The error is severe enough that normal processing should not continue

## Loading Assets Dynamically

Load JavaScript, CSS, or images dynamically after an AJAX response:

```php
function onLoadComponent()
{
    return ajax()
        ->js('/js/charts.js')
        ->css('/css/charts.css')
        ->data(['component' => 'loaded']);
}
```

Load multiple assets at once:

```php
function onLoadModule()
{
    return ajax()
        ->js(['/js/module.js', '/js/module-helper.js'])
        ->css(['/css/module.css']);
}
```

For other asset types, use the generic `asset()` method:

```php
return ajax()->asset('img', ['/images/icon1.png', '/images/icon2.png']);
```

## Dispatching Browser Events

Dispatch JavaScript events from AJAX handlers using the `browserEvent()` method. This method takes an event name (first argument) and detail variables to pass to the event (second argument). Variables must be compatible with JSON serialization.

```php
function onPerformAction()
{
    return ajax()->browserEvent('app:update-profile', ['name' => 'Jeff']);
}
```

In the browser, use `addEventListener` to listen for the dispatched event when the AJAX request completes. The event variables are available via the `event.detail` object.

```js
addEventListener('app:update-profile', function (event) {
    alert('Profile updated with name: ' + event.detail.name);
});
```

### Async Browser Events

For events that should not block the AJAX response processing:

```php
function onTrackActivity()
{
    return ajax()->browserEventAsync('analytics:track', [
        'action' => 'button-click',
        'timestamp' => now()
    ]);
}
```

### Preventing Default Behavior

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

## Response Headers

Add custom headers to the AJAX response:

```php
function onDownloadData()
{
    return ajax()
        ->headers([
            'X-Custom-Header' => 'value',
            'X-Rate-Limit' => '100'
        ])
        ->data(['exported' => true]);
}
```

## Advanced Methods

### Force Custom Response

Bypass the standard AJAX response structure entirely:

```php
function onDownloadFile()
{
    return ajax()->force(
        response()->download('/path/to/file.pdf')
    );
}
```

This is useful for file downloads, streaming responses, or any custom response type.

### Exception Handling

The `exception()` method intelligently handles different exception types:

```php
function onHandleRequest()
{
    try {
        // Your code...
    }
    catch (\Exception $e) {
        return ajax()->exception($e);
    }
}
```

Supported exception types:

| Exception | Behavior |
| --------- | -------- |
| `\Illuminate\Validation\ValidationException` | Automatically converted to `invalidFields()` |
| `\Larajax\Contracts\AjaxExceptionInterface` | Custom AJAX exceptions with `toAjaxData()` method |
| `\Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException` | Returns "Access Denied" error |
| `\Exception` | Returns the exception message as an error |

## Pull Updates with `partial()`

While `update()` pushes content from the server, `partial()` allows the client to request specific partials. This is useful when the view knows what it needs to refresh.

### Client-Requested Partials

The client specifies which partials to request using the `data-request-update` attribute:

```html
<button
    data-request="onRefreshProfile"
    data-request-update="{ 'profile-card': '#profileContainer' }">
    Refresh Profile
</button>
```

The handler can then render the requested partials:

```php
function onRefreshProfile()
{
    return ajax()->partial('profile-card', view('partials.profile-card'));
}
```

### Dynamic Partial Rendering

For handlers that serve multiple partials, you can iterate over the requested partial list:

```php
function onRefreshContent()
{
    $response = ajax();

    foreach (ajax()->request()->partialList as $partialName) {
        $response->partial($partialName, view("partials.{$partialName}"));
    }

    return $response;
}
```

::: warning Security Consideration
When dynamically rendering partials based on client requests, always restrict which views can be requested. The example above prefixes with `partials.` to ensure only views in the `partials` directory can be loaded. Never allow unrestricted access to arbitrary view files, as malicious users could use browser developer tools to request sensitive views.
:::

### When to Use Each Approach

| Use `update()` when... | Use `partial()` when... |
| ---------------------- | ----------------------- |
| Server logic determines what needs updating | The view knows what it needs to refresh |
| Updating multiple unrelated elements | Building reusable refresh patterns |
| The update targets are dynamic | Client controls the refresh scope |
