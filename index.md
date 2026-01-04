# What is Larajax?

Larajax aims to bring simplicity back to Laravel development.

It lets your HTML call **Laravel controller methods** directly using `data-request`. No public API routes. No duplicated endpoints. Each page keeps its own actions.

You define small, focused controller handlers and trigger them straight from the view. They behave like API calls but stay scoped to the page that uses them.

On the browser side, Larajax ships with a **light JavaScript framework**. Your markup fires the action. Larajax sends the request and applies the response. You can also call handlers directly with `jax.ajax()` when you need full control.

This pattern was refined for years in production by the team behind [October CMS](https://octobercms.com) and is now available as a standalone package for the [Laravel Framework](http://laravel.com/).

## Your First Action

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

You can follow the entire request cycle in one place. The form triggers the handler, the controller runs the logic, and the page updates with the response.

## The Problem Larajax Solves

Most Laravel applications end up splitting behavior across two separate layers:

- Page routes that render views
- API routes that perform actions

This separation seems clean at first, but over time those internal APIs begin to spread across the application. They are global by default, their ownership becomes unclear, and simple page-level behavior becomes harder to reason about.

A basic profile page often grows into something like this:

```php
Route::get('/user-profile', ...);
Route::post('/user-profile', ...);
Route::put('/user-profile', ...);
Route::delete('/user-profile', ...);
Route::post('/user-profile/check-email', ...);
```

Each route is valid on its own, but together they expose page-specific behavior as part of the global routing surface. Actions that only exist to support one screen now live at the same level as true application-wide APIs.

Larajax changes this by reducing the page to a single entry route.

```php
Route::any('/user-profile', [UserProfileController::class, 'index']);
```

With this approach:
- GET renders the page
- POST handles actions
- Page behavior stays anchored to a single controller

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

Each handler follows a clear `onSomething` naming convention, which makes action methods easy to identify at a glance. As a result:

- Routes stay minimal
- Page behavior stays local
- Controllers fully own their actions

Once actions are local to a page instead of global, a natural question follows:
how do you reuse them across pages? Larajax solves this with **components**.

#### Components Solve Reusability

Every controller supports a `$components` property where reusable behavior can be defined. Any AJAX handlers found in those component classes are automatically registered on the controller that includes them.

```php
class UserProfileController extends LarajaxController
{
    public $components = [
        \App\Components\FileUploadInput::class
    ];
}
```

Components can also define components of their own, which allows reuse to scale without flattening everything into a global space. This keeps behavior modular and intentional while preserving the same containment model that Larajax uses for controllers.

::: tip
To learn more about how to define a component, see the [Components Guide](./guide/defining-components.md).
:::

## Calling Handlers

Larajax includes a small client-side layer that lets you call your server-side handlers either from HTML or directly from JavaScript using the same naming pattern.

When a request is made, it is sent to the **current page URL** and the target handler is passed in the `X-AJAX-HANDLER` request header. This keeps all requests scoped to the active page route while avoiding the need for exposed API endpoints.

### From Markup

The `data-request` attribute is the primary way to trigger an AJAX handler from HTML.

```html
<button data-request="onCheckUserEmail">
    Check Email
</button>
```

When a request is triggered from inside a form, the form inputs are automatically serialized and included with the request.

```html
<form>
    <input type="email" name="email" value="" />

    <button data-request="onCheckUserEmail">
        Check Email
    </button>
</form>
```

::: tip
For a full list of supported attributes and behaviors, see the [AJAX Handlers Guide](./guide/ajax-handlers.md).
:::

### From JavaScript

When markup alone is not enough, the same handlers can be called directly from JavaScript using `jax.ajax()`.

```html
<button onclick="jax.ajax('onCheckUserEmail'); return false">
    Check Email
</button>
```

When you want to serialize the input values of a container or form explicitly, you can use `jax.request()` instead.

```js
<form>
    <input type="email" name="email" value="" />

    <button onclick="jax.request(this, 'onCheckUserEmail')">
        Check Email
    </button>
</form>
```

This gives you the same request model as data-request, but with full control over when and how the call is made.

::: tip
More details on working with JavaScript are available in the [JavaScript Guide](./guide/ajax-javascript.md).
:::

### From the Controller

Larajax provides a global `ajax()` helper that returns an instance of the `Larajax\Classes\AjaxResponse` class. This response object lets you compose multiple instructions into a single server response and describe exactly how the browser should react.

Instead of returning raw JSON and handling everything manually on the client, you describe the outcome of the action directly in the controller.

```php
function onSave()
{
    return ajax()
        // Include some response data
        ->data(['success' => true])

        // Patch a DOM element
        ->update(['#someElement' => 'Hello world!'])

        // Load a JavaScript file
        ->js('assets/js/app.js')

        // Trigger a halting browser event
        ->browserEventAsync('app:redirecting')

        // Redirect the browser
        ->redirect('https://larajax.org');
}
```

Each call adds another instruction to the response queue. When the request completes, the client-side runtime processes these instructions in order and applies the corresponding changes to the page. This keeps your controller in full control of both the server-side logic and the resulting UI behavior.

::: tip
To explore the full set of available response operations, see the [AJAX Response Guide](./guide/ajax-responses.md).
:::
