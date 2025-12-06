# What is Larajax?

Larajax lets your HTML call **Laravel controller methods** directly using `data-request`. No public API routes. No duplicated endpoints. Each page keeps its own actions.

You define small, focused controller handlers and trigger them straight from the view. They behave like API calls but stay scoped to the page that uses them.

On the browser side, Larajax ships with a **light JavaScript framework**. Your markup fires the action. Larajax sends the request and applies the response. You can also call handlers directly with `jax.ajax()` when you need full control.

Built by the team behind [October CMS](https://octobercms.com), this pattern has been battle-tested for years and is now available for the [Laravel Framework](http://laravel.com/) as a standalone package.

## First Action

Start with `data-request` in a tiny view:

```html
<!-- View -->
<form data-request="onSave">
    <input name="first_name" />

    <button type="submit">
        Save!
    </button>
</form>

<div id="message"></div>
```

Then add a **handler method** to the controller:

```php
// Controller
public function onSave()
{
    request()->validate([
        'first_name' => 'required'
    ]);

    return ajax()->update([
        '#message' => "Save complete!"
    ]);
}
```

You read this flow in one pass. Form fires the action. Controller runs. Page updates. Simple and clear.

## What Problem Are We Solving?

Primarily Larajax is useful for defining private APIs that are defined and consumed by the same application. We often need to define two types of endpoints, pages that render to the browser and API endpoints that perform actions (usually RESTful).

The problem with using RESTful endpoints as internal APIs is they can quickly get disorganised, since they are global to the application by default. For example, a simple profile page may look like this:

```php
Route::get('/user-profile', ...);
Route::post('/user-profile', ...);
Route::put('/user-profile', ...);
Route::delete('/user-profile', ...);
Route::post('/user-profile/check-email', ...);
```

With Larajax, we solve this by defining a single route for the page entry point only.

```php
Route::any('/user-profile', [UserProfileController::class, 'index']);
```

Note we use the `Route::any` method to accept any verb. Larajax focuses on GET and POST, where GET is a page endpoint and POST is an API endpoint.

Then inside the `UserProfileController` class, we expose API endpoints localized to that entry point only (meaning, they won't work anywhere else but on that controller's endpoint).

```php
class UserProfileController extends LarajaxController
{
    public function index()
    {
        return view('index');
    }

    public function onCreateUser() { /* ... */ }
    public function onUpdateUser() { /* ... */ }
    public function onDeleteUser() { /* ... */ }
    public function onCheckUserEmail() { /* ... */ }
}
```

Notice that the API endpoints all start with `onSomething`, this is a dedicated naming convention that can be spotted immediately as an API endpoint.

This is a better way to organise routes and keep API logic contained to controllers that actually use them. But now since they are local and not global, what about reuse, what if we want to include the `onCheckUserEmail` AJAX handler on more than one controller?

#### Components Solve Reusability

Every controller class supports a `$components` property where components can be defined. The AJAX handlers will be extracted from these classes and included in the controller.

```php
class UserProfileController extends LarajaxController
{
    public $components = [
        \App\Components\FileUploadInput::class
    ];
}
```

To learn more about how to define a component, visit the [components article](./guide/defining-components.md).

## What About Calling The APIs?

Larajax also ships with a powerful client-side framework, that let's you call your AJAX handlers directly in HTML, or called from your JavaScript using the same pattern.

### Markup Tools


This submits the AJAX call to **the current URL** with the handler method inside the `X-AJAX-HANDLER` request header.

```html
<button data-request="onCheckUserEmail">
    Check Email
</button>
```

When a request takes place inside a form, the form data is automatically serialized and included along with the request.

```html
<form>
    <input type="email" name="email" value="" />

    <button data-request="onCheckUserEmail">
        Check Email
    </button>
</form>
```

The [AJAX Handlers Guide](./guide/ajax-handlers.md) has more information on what you can do here.

### JavaScript Tools

The `jax.ajax()` JavaScript function supports calling AJAX handlers within your JavaScript code, allowing for greater flexibility.

```html
<button onclick="jax.ajax('onCheckUserEmail'); return false">
    Check Email
</button>
```

The `jax.request()` function is used when you want to serialize the input contents of a container.

```js
<form>
    <input type="email" name="email" value="" />

    <button onclick="jax.request(this, 'onCheckUserEmail')">
        Check Email
    </button>
</form>
```

The [JavaScript Guide](./guide/ajax-javascript.md) describes this is more detail.
