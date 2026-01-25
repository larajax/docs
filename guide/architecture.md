# Architecture & Philosophy

Larajax takes an opinionated approach to structuring Laravel applications. This guide explains the core philosophy and how it differs from traditional patterns.

## The Page-Per-Controller Pattern

Larajax embraces a pattern inspired by classic PHP development: **one page = one route**. This contrasts with the resource controller pattern popularized by Rails and adopted by Laravel.

### Traditional Resource Controllers

In a typical Laravel app using resource controllers, you might have:

```php
// routes/web.php
Route::resource('users', UserController::class);

// This generates 7 routes:
// GET    /users           → index
// GET    /users/create    → create
// POST   /users           → store
// GET    /users/{id}      → show
// GET    /users/{id}/edit → edit
// PUT    /users/{id}      → update
// DELETE /users/{id}      → destroy
```

This works well for simple CRUD, but as applications grow:

- The route table becomes noisy with internal API endpoints
- Page behavior gets distributed across multiple controllers
- You end up with separate routes for page rendering and AJAX operations

### The Larajax Approach

With Larajax, each page gets a single route, and all its behavior stays local:

```php
// routes/web.php
Route::any('/user-profile', [UserProfileController::class, 'index']);

// UserProfileController.php
class UserProfileController extends LarajaxController
{
    public function index()
    {
        return view('pages.user-profile');
    }

    // All AJAX handlers for this page live here
    public function onUpdateProfile() { /* ... */ }
    public function onChangePassword() { /* ... */ }
    public function onUploadAvatar() { /* ... */ }
    public function onDeleteAccount() { /* ... */ }
}
```

When you run `php artisan route:list`, you see the true sitemap of your application—without the clutter of internal API endpoints.

## Benefits of This Pattern

### 1. Cleaner Route Table

Your routes represent actual pages users visit, not a mix of pages and API endpoints:

```bash
# Instead of seeing:
GET|POST|PUT|DELETE /users...
GET|POST|PUT|DELETE /projects...
GET|POST            /api/users/check-email...

# You see the actual sitemap:
ANY /dashboard
ANY /user-profile
ANY /settings
ANY /projects
ANY /projects/{id}
```

### 2. Localized Page Logic

All behavior for a page stays in one place. When debugging or extending a page, you know exactly where to look.

### 3. No Exposed Internal APIs

AJAX handlers aren't separate routes—they're methods on the controller, protected by the `on` prefix convention. There's no risk of accidentally exposing internal APIs globally.

## Multi-Page Controllers

A single controller can serve multiple related pages while sharing handlers between them:

```php
// routes/web.php
Route::any('/users', [UserController::class, 'index']);
Route::any('/users/create', [UserController::class, 'create']);
Route::any('/users/{id}', [UserController::class, 'show']);

// UserController.php
class UserController extends LarajaxController
{
    public function index()
    {
        return view('users.index');
    }

    public function create()
    {
        return view('users.create');
    }

    public function show($id)
    {
        return view('users.show', ['user' => User::findOrFail($id)]);
    }

    // These handlers are available on ALL pages served by this controller
    public function onValidateEmail()
    {
        // Reusable email validation for index, create, and show pages
    }

    public function onSaveUser()
    {
        // Shared save logic
    }
}
```

## Sharing Logic Across Controllers

For functionality needed across multiple controllers, use:

### Traits

```php
trait ValidatesUsers
{
    public function onValidateEmail()
    {
        $email = request('email');
        $exists = User::where('email', $email)->exists();

        return ajax()->data(['available' => !$exists]);
    }
}

class UserProfileController extends LarajaxController
{
    use ValidatesUsers;
}

class RegistrationController extends LarajaxController
{
    use ValidatesUsers;
}
```

### Components

For reusable UI with its own handlers, use [Components](/guide/defining-components):

```php
class UserProfileController extends LarajaxController
{
    public $components = [
        \App\Components\AvatarUploader::class,
        \App\Components\AddressForm::class,
    ];
}
```

### Service Classes

For business logic shared across handlers:

```php
class UserController extends LarajaxController
{
    public function onCreateUser()
    {
        $user = app(UserService::class)->create(request()->all());

        return ajax()
            ->flash('success', 'User created!')
            ->redirect("/users/{$user->id}");
    }
}
```

## When to Use Resource Controllers

Resource controllers aren't wrong—they're a different approach. Consider using traditional resource controllers for:

- **Pure API backends** without page rendering
- **Webhooks** and external integrations
- **Admin panels** using packages like Nova or Filament

Larajax and resource controllers can coexist in the same application. Use Larajax for your user-facing pages and traditional controllers for backend services.

## Summary

| Aspect | Resource Controllers | Larajax Pattern |
| ------ | -------------------- | --------------- |
| Route structure | Multiple routes per resource | One route per page |
| AJAX endpoints | Separate API routes | Handler methods on controller |
| Route table | Shows all endpoints | Shows true sitemap |
| Page behavior | Distributed | Localized |
| Best for | APIs, admin panels | User-facing applications |

The Larajax pattern prioritizes **code longevity** and **maintainability** by keeping related functionality together and making your application's structure immediately obvious from the route table.