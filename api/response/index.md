# Responses

The response object defines how the server responds to AJAX requests. The response methods are listed below.

## Method - `update()` {#update}

Patch the DOM with some updates.

```php
return ajax()->update(['#someElement' => 'HTML contents']);
```

## Method - `data()` {#data}

Provide data with the response.

```php
return ajax()->data(['isSuccess' => true]);
```

## Method - `redirect()` {#redirect}

Redirect to another URL.

```php
return ajax()->redirect('https://octobercms.com');
```

## Method - `reload()` {#reload}

Reload the page.

```php
return ajax()->reload();
```

## Method - `flash()` {#flash}

Display a flash message.

```php
return ajax()->flash("Great success!");
```

## Method - `error()` {#error}

Trigger an error with update lifecycle.

```php
return ajax()->error("Well that didn't work!");
```

## Method - `fatal()` {#fatal}

Trigger an error that aborts the request.

```php
return ajax()->error("Something broke!");
```

## Method - `js()` {#js}

Load JavaScript with the response.

```php
return ajax()->js("/assets/js/widget.js");
```

## Method - `css()` {#css}

Load a StyleSheet with the response.

```php
return ajax()->js("/assets/css/widget.css");
```

## Method - `img()` {#img}

Load an image with the response.

```php
return ajax()->img("/assets/css/widget.css");
```

## Method - `browserEvent()` {#browserEvent}

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

## Method - `browserEventAsync()` {#browserEventAsync}

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

## Method - `invalidFields()` {#invalidFields}

Trigger invalid fields.

```php
return ajax()->invalidFields(['name' => "The name field is required!"]);
```

## Method - `partials()` {#partials}

Supply partials that were requested from the browser.

```php
return ajax()->partials([
    'site.header' => "New header contents",
    'site.footer' => "New footer contents",
]);
```

## Method - `exception()` {#exception}

Process an exception for common exception types.

```php
try {
    // ...
}
catch (Exception $ex) {
    return ajax()->exception($ex);
}
```

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
