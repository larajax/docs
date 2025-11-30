# Getting started

## First action

Basic example.

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

In HTML

```html
<form>
    <input name="first_name" />

    <button data-request="onSave"></div>
</form>

<div id="message"></div>
```

## What problem are we solving?

Primarily Larajax is useful for defining _internal_ APIs that are defined and consumed by the same application. We often need to define two types of endpoints, pages that render to the browser and API endpoints that perform actions (usually RESTful).

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

### Enter Components

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
