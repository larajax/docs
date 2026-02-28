# Responses

The response object defines how the server responds to AJAX requests. The response methods are listed below.

### Method - `update()` {#update}

Patch the DOM with some updates.

```php
return ajax()->update(['#someElement' => 'HTML contents']);
```

### Method - `data()` {#data}

Provide data with the response.

```php
return ajax()->data(['isSuccess' => true]);
```

### Method - `redirect()` {#redirect}

Redirect to another URL.

```php
return ajax()->redirect('https://octobercms.com');
```

### Method - `reload()` {#reload}

Reload the page.

```php
return ajax()->reload();
```

### Method - `flash()` {#flash}

Display a flash message.

```php
return ajax()->flash("Great success!");
```

### Method - `error()` {#error}

Trigger an error with update lifecycle.

```php
return ajax()->error("Well that didn't work!");
```

### Method - `fatal()` {#fatal}

Trigger an error that aborts the request.

```php
return ajax()->fatal("Something broke!");
```

### Method - `js()` {#js}

Load JavaScript with the response.

```php
return ajax()->js('/assets/js/widget.js');
```

You can pass attributes as a second parameter, which is useful for loading ES modules or setting other script attributes.

```php
// Load as an ES module
return ajax()->js('/assets/js/widget.js', ['type' => 'module']);

// With defer attribute
return ajax()->js('/assets/js/widget.js', ['defer' => true]);
```

To load multiple scripts, pass an array of paths. The second parameter applies to all scripts.

```php
return ajax()->js(['/assets/js/a.js', '/assets/js/b.js'], ['type' => 'module']);
```

For different attributes per script, use an associative array where keys are paths and values are attribute arrays.

```php
return ajax()->js([
    '/assets/js/module.js' => ['type' => 'module'],
    '/assets/js/legacy.js' => ['defer' => true],
]);
```

### Method - `jsInline()` {#jsInline}

Load inline JavaScript code with the response. Unlike `js()` which loads external script files, this executes the provided code directly.

```php
return ajax()->jsInline('console.log("hello")');
```

You can pass attributes as a second parameter, which is useful for running inline code as an ES module.

```php
return ajax()->jsInline('import { setup } from "./mod.js"; setup();', ['type' => 'module']);
```

Multiple inline scripts can be chained together.

```php
return ajax()
    ->jsInline('window.appReady = true')
    ->jsInline('import { init } from "./app.js"; init();', ['type' => 'module']);
```

::: tip
Inline scripts are always executed, even on subsequent requests. They are not deduplicated like external scripts loaded with `js()`.
:::

### Method - `css()` {#css}

Load a StyleSheet with the response.

```php
return ajax()->css('/assets/css/widget.css');
```

You can pass attributes as a second parameter.

```php
// Media query
return ajax()->css('/assets/css/print.css', ['media' => 'print']);
```

Multiple stylesheets with different attributes.

```php
return ajax()->css([
    '/assets/css/screen.css' => ['media' => 'screen'],
    '/assets/css/print.css' => ['media' => 'print'],
]);
```

### Method - `img()` {#img}

Load an image with the response.

```php
return ajax()->img('/assets/images/logo.png');
```

Multiple images can be preloaded by passing an array.

```php
return ajax()->img(['/assets/images/a.png', '/assets/images/b.png']);
```

### Method - `browserEvent()` {#browserEvent}

Triggers a browser event with the response.

```php
return ajax()->browserEvent('app:stale-document');
```

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

### Method - `browserEventAsync()` {#browserEventAsync}

Triggers an asynchronous event to the browser where a promise is passed through with the event details.

This is useful when you want the JavaScript to wait before processing anything else. For example, showing an alert dialog before processing a redirect.

```php
return ajax()
    ->browserEventAsync('sweet:alert', [
        'message' => "You are about to be redirected to an external site"
    ])
    ->redirect('https://google.com');
```

Then on the JS side. Wait for the alert to be dismissed and then resolve the provided promise.

```js
addEventListener('app:sweet-alert', async function(event) {
    const { promise } = event.detail;

    await Swal.fire(...);

    promise.resolve();
})
```

### Method - `invalidFields()` {#invalidFields}

Trigger invalid fields.

```php
return ajax()->invalidFields(['name' => "The name field is required!"]);
```

### Method - `partials()` {#partials}

Supply partials that were requested from the browser.

```php
return ajax()->partials([
    'site.header' => "New header contents",
    'site.footer' => "New footer contents",
]);
```

### Method - `exception()` {#exception}

Process an exception for common exception types.

```php
try {
    // ...
}
catch (Exception $ex) {
    return ajax()->exception($ex);
}
```

### Method - `force()` {#force}

Bypass the AJAX envelope entirely and return a custom response. This is useful for data-only API-style handlers where the full AJAX pipeline (asset injection, DOM patching, flash messages) adds unnecessary overhead to the response payload.

```php
return ajax()->force(['metrics' => [...], 'totals' => [...]]);
```

When `force()` is used, the response skips the `__ajax` envelope and returns the data as a plain JSON object. On the client side, `jax.ajax()` handles this gracefully — if the response has no `__ajax` key, it returns the data as-is.

```js
const data = await jax.ajax('onGetWidgetData');
// { metrics: [...], totals: [...] }
```

::: tip
Use `force()` when the handler only needs to return data and doesn't require DOM updates, flash messages, asset loading, or any other AJAX operations. For handlers that need any of those features, use `data()` instead.
:::

## Override - `registerCustomResponse` {#register-custom-response}

Let's define a custom class that introduces a `sweetAlert` method to the `ajax()` function.

```php
return ajax()->sweetAlert("You did it!");
```

First define your own custom `AjaxResponse` class inside your app.

```php
namespace App\Classes;

class AjaxResponse extends \Larajax\Classes\AjaxResponse
{
    public function sweetAlert($message)
    {
        return $this->browserEvent('app:sweet-alert', [
            'type' => 'success',
            'message' => $message
        ]);
    }
}
```

Then inside a service provider registration method, call the `App::bind` method to replace the `AjaxResponse` class by resolving to the custom one.

```php
public function register()
{
    ajax()->registerCustomResponse(\App\Classes\AjaxResponse::class);
}
```

Now when `ajax()` is called it will return your custom class.

## Override - `registerGlobalComponent` {#register-global-component}

Register a component as global using the static `registerGlobalComponent` method found on the `ajax()` helper.

```php
ajax()::registerGlobalComponent(\App\Components\GlobalComponent::class);
```
