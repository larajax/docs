# Getting started

## Install

```bash
composer require larajax/larajax
npm i larajax
```

## First action

```php
// Controller
public function onSave() {
    // ...
    return ['#message' => view('partials.message')];
}
```

## What problem are we solving?

Primarily it is API access. We often need to define two types of endpoints, pages that render to the browser and API endpoints that perform actions (usually RESTful).

The problem with RESTful endpoints is they can quickly get disorganised, since they are global to the application by default. For example, a simple profile page may look like this:

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

This is a better way to organise routes and keep API logic contained to controllers that actually use them. But now since they are local and not global, what about reuse, what if we want to include the `onCheckUserEmail`