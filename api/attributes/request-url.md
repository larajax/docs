# `data-request-url`

The `data-request-url` attribute specifies a custom URL endpoint for the AJAX request, instead of using the current page URL.

```html
<button
    data-request="onSubmit"
    data-request-url="/api/submit">
    Submit
</button>
```

## Using URL as the Handler

When the `data-request` attribute contains a URL-like value (starting with `/`, `http://`, or `https://`) instead of a handler name, the framework will automatically use it as the request URL and default to the `onAjax` handler.

```html
<button data-request="/api/endpoint">
    Call API
</button>
```

This is equivalent to:

```html
<button
    data-request="onAjax"
    data-request-url="/api/endpoint">
    Call API
</button>
```

### JavaScript Usage

The same behavior applies when using the JavaScript API:

```js
// These are equivalent
jax.ajax('/api/endpoint');
jax.ajax('onAjax', { url: '/api/endpoint' });
```

### Handler Detection

The framework determines whether a value is a handler or URL by checking if it matches the valid handler pattern: `on[A-Z]...` (e.g., `onSave`, `onSubmitForm`). Component-qualified handlers like `myComponent::onSave` are also recognized.

Anything that doesn't match this pattern is treated as a URL:

```html
<!-- These are handlers -->
<button data-request="onSave">Save</button>
<button data-request="onSubmitForm">Submit</button>
<button data-request="comments::onPost">Post Comment</button>

<!-- These are URLs (default to onAjax handler) -->
<button data-request="/api/save">/api/save</button>
<button data-request="/users/123/update">Update User</button>
<button data-request="https://api.example.com/webhook">External API</button>
```

### Use Case: Dedicated API Endpoints

This feature is useful when you have dedicated API endpoints that always return AJAX-compatible responses. The endpoint doesn't need to inspect the `X-AJAX-HANDLER` header since it's purpose-built for AJAX responses.

```php
// routes/api.php
Route::post('/api/notifications/mark-read', function () {
    // Always returns an AJAX response
    return ajax()->data(['success' => true]);
});
```

```html
<button data-request="/api/notifications/mark-read">
    Mark as Read
</button>
```
