# Controller Integration

Controllers require specific integration to make call AJAX handlers and return their result. It is a good idea set up a base controller class for your application, or you can extend the `Larajax\LarajaxController` included with this package.

Let's take a look at the `LarajaxController` controller to see how AJAX is implemented.

```php
namespace Larajax;

use Illuminate\Routing\Controller;
use Larajax\Contracts\AjaxControllerInterface;
use Exception;

/**
 * LarajaxController is a basic implementation of Larajax in a Laravel controller
 */
class LarajaxController extends Controller implements AjaxControllerInterface
{
    use \Larajax\Traits\AjaxController;

    /**
     * callAction injects AJAX handlers in to controller actions
     */
    public function callAction($action, $params)
    {
        try {
            if ($result = $this->callAjaxAction($action, array_values($params))) {
                return $result;
            }
        }
        catch (Exception $ex) {
            return ajax()->exception($ex);
        }

        return parent::callAction($action, $params);
    }
}
```

This controller class just needs to implement the `AjaxControllerInterface` interface and the `Larajax\Traits\AjaxController` trait provides a good way to do that. Then when a controller action is called (`callAction`), check to see if it is an AJAX request, and redirect the request to the AJAX handler (`callAjaxAction`) for processing.

The `onSave` handler method returns an instance of an `AjaxResponse` object, spawned by the `ajax()` helper function.

## Implementing a Controller Class

First let's start by creating a profile controller.

```php
namespace App\Controllers;

use Larajax\LarajaxController;

class ProfileController extends LarajaxController
{
    public function index()
    {
        return view('pages.profile.index');
    }

    public function onSave()
    {
        // ...
    }
}
```

Now set up a route definition for the index page. Be sure to use the `any` route to support both GET and POST. We will route to the `index` method of the controller class.

```php
Route::any('/profile', [\App\Controllers\ProfileController::class, 'index']);
```

The `onSave` AJAX handler will be available to all actions defined by the `ProfileController` class.

## Multi-Page Controllers

A single controller can serve multiple pages while sharing AJAX handlers between them. Define multiple routes pointing to the same controller:

```php
// routes/web.php
Route::any('/users', [UserController::class, 'index']);
Route::any('/users/create', [UserController::class, 'create']);
Route::any('/users/{id}', [UserController::class, 'show']);
```

```php
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

    // Handlers shared across all three pages
    public function onValidateEmail()
    {
        $exists = User::where('email', request('email'))->exists();
        return ajax()->data(['available' => !$exists]);
    }

    public function onSaveUser()
    {
        // Save logic used by both create and show pages
    }
}
```

All AJAX handlers defined in the controller are available to every page action it serves. This keeps related functionality together while avoiding code duplication.

::: tip
For a deeper understanding of this pattern and how it compares to traditional resource controllers, see [Architecture & Philosophy](/guide/architecture).
:::

## Authorization with Policies & Gates

Laravel's [authorization system](https://laravel.com/docs/authorization) works naturally inside AJAX handlers. Since handlers are regular controller methods, you can use `$this->authorize()`, the `Gate` facade, or any other authorization approach you'd use in a standard Laravel controller.

When authorization fails, the thrown exception is caught by the Larajax exception handler and returned as a clean AJAX error response — no extra configuration needed.

### Using Policies

Define a policy as you normally would:

```php
// app/Policies/PostPolicy.php
class PostPolicy
{
    public function update(User $user, Post $post): bool
    {
        return $user->id === $post->user_id;
    }

    public function delete(User $user, Post $post): bool
    {
        return $user->id === $post->user_id;
    }
}
```

Then call `$this->authorize()` inside your handlers:

```php
class PostController extends LarajaxController
{
    public function onUpdate()
    {
        $post = Post::findOrFail(request('id'));
        $this->authorize('update', $post);

        $post->update(request()->validate([
            'title' => 'required',
            'body'  => 'required',
        ]));

        return ['#post-' . $post->id => view('posts._row', compact('post'))];
    }

    public function onDelete()
    {
        $post = Post::findOrFail(request('id'));
        $this->authorize('delete', $post);

        $post->delete();

        return ajax()->update(['#post-' . $post->id => ''])
            ->flash('success', 'Post deleted.');
    }
}
```

If the user isn't authorized, Larajax returns an error response automatically:

```json
{
    "__ajax": {
        "ok": false,
        "severity": "error",
        "message": "Access Denied"
    }
}
```

### Using Gates

You can also use the `Gate` facade for simpler, non-model checks:

```php
use Illuminate\Support\Facades\Gate;

public function onPublish()
{
    $post = Post::findOrFail(request('id'));

    // Option 1: Throw on failure (caught automatically)
    Gate::authorize('publish', $post);

    // Option 2: Check manually for a custom message
    if (Gate::denies('publish', $post)) {
        return ajax()->error('You cannot publish this post.');
    }

    $post->update(['published' => true]);
    return ajax()->flash('success', 'Post published.');
}
```

### Route Middleware

For protecting an entire controller (both page loads and AJAX handlers), apply authorization middleware to the route:

```php
Route::any('/admin/posts', [PostController::class, 'index'])
    ->middleware('can:manage-posts');
```

This blocks the request before the controller is reached, so no handler will execute for unauthorized users.
