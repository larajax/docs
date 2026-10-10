# Defining Components

The component class can be any component, for example, a Blade component or an October CMS component. The only requirement is that it implements the `Larajax\Contracts\ViewComponentInterface`. To make things easier, a `Larajax\Traits\ViewComponent` trait is included as an implementation of the interface.

Here we will define a base class.

```php
class ComponentBase extends \Illuminate\View\Component
{
    use \Larajax\Traits\ViewComponent;
}
```

Then an example `FileUploadInput` component.

```php
class FileUploadInput extends ComponentBase
{
    public function onFileUpload()
    {
        // ... handle file upload ...
    }
}
```

Now inside the controller, using the `$components` property, we can attach the component to the page. This makes the AJAX handlers available to the page lifecycle.

```php
class UserProfileController extends LarajaxController
{
    public $components = [
        \App\Components\FileUploadInput::class
    ];
}
```

The best part about components is they can define other components as dependencies, just like controllers.

```php
class FormTools extends ComponentBase
{
    public $components = [
        \App\Components\FieldWrapper::class,
        \App\Components\AddressInput::class,
        \App\Components\CurrencyInput::class,
        \App\Components\FileUploadInput::class
    ];
}
```

## Component Instances

By default, components are stateless since the state can be carried via the postback data. However, this is essentially untrusted data since it is provided by the browser.

Stateful components can be introduced by configuring the component object before binding it to the controller. Let's say we want to associate the `FileUploadInput` component to a model for storing the file uploads.

```php
public function __construct()
{
    $uploader = new FileUploadInput;
    $uploader->model = new Model;

    $this->addComponentInstance('myUploader', $uploader);
}
```

## Inline Components in Actions

Instead of declaring components up front, you can build and register a component directly inside a controller action using the static `make` method on any `ViewComponent`:

```php
class UserController extends LarajaxController
{
    public function edit(Request $request, int $id)
    {
        $user = User::findOrFail($id);

        $uploader = FileUploadInput::make([
            'model' => $user,
        ]);

        return view('users.edit', ['uploader' => $uploader]);
    }
}
```

`FileUploadInput::make([...])` does three things:

1. Constructs the component with the supplied configuration.
2. Binds it to the current Larajax controller (resolved from the container).
3. Returns the bound instance, ready to be passed to a view or used directly.

After the call, the component is a regular PHP object. AJAX handlers defined on it are wired up automatically, exactly as if it had been registered via `$components`.

This is the recommended pattern when the component's configuration depends on the action — for example, when you need to pass a route-resolved model into the component, or when the same controller serves multiple pages that need slightly different component configurations.

### How `make()` resolves the controller

`Component::make` reads the current Larajax controller from the container — the same way `request()` reads the current request or `auth()` reads the current auth manager. Larajax binds this during `callAction`, so `make()` works in any controller action that runs through `LarajaxController`.

From a non-controller context (a job, a console command), pass the host explicitly with `Component::createIn($host, [...])->bindToController()` instead.

### Custom `make()` factories

The default `make()` accepts a config array. To expose a more specific signature, override `make` on your component class:

```php
class FileUploadInput extends ComponentBase
{
    public static function make(Model $model, string $alias = 'uploader'): static
    {
        return static::createIn(
            larajax()->controller(),
            ['model' => $model, 'alias' => $alias]
        )->bindToController();
    }
}
```

Now consumers write:

```php
$uploader = FileUploadInput::make($user);
```

This is purely a convenience layer — the underlying `createIn` and `bindToController` calls are identical.

## Action Lifecycle

When a controller action is invoked, Larajax follows the same lifecycle for both page renders and AJAX requests:

1. **Run the action body.** Any inline component registrations (`Component::make(...)`, `addComponentInstance(...)`, etc.) execute here. Authorization checks, model lookups, session writes — everything in the action body — runs as written.
2. **Decide what to return.**
    - If the request carries an AJAX handler header, the action's return value (typically a `View`) is discarded, and the AJAX handler dispatches against the components the action body just registered.
    - Otherwise the action's return value is the response, exactly as in a normal Laravel controller.

### Why the action body always runs

Running the action on every request makes Larajax's behavior predictable and matches what users intuitively expect:

- **Authorization follows page access.** If `$this->authorize('edit', $user)` would block the page, it blocks AJAX handlers on that page too — automatically, because the action runs first.
- **AJAX handlers see the same state as the page.** A component built in the action has the same configuration whether you're rendering the page or responding to an AJAX request against it. No drift.
- **One mental model.** "The action runs every request" is simpler than "the action runs except on AJAX, except when…".

### View construction is essentially free

Calling `view(...)` in your action is **lazy** — it returns a `View` object without rendering any HTML. Blade only compiles the template when the View is converted into an HTTP response. On the AJAX pass, the View is discarded before that ever happens, so the only cost of running the action on AJAX is whatever work you did *before* the return statement (model lookups, component construction, etc.).

### Guarding against side effects

If your action does work that should *not* run on AJAX requests — mutations, mailers, expensive computations that the AJAX handlers don't need — guard with Laravel's standard `request()->ajax()` helper:

```php
public function edit(Request $request, int $id)
{
    $user = User::findOrFail($id);

    $form = UserForm::make(['model' => $user]);

    if (!request()->ajax()) {
        // Page-render-only work goes here.
        // Mail::to($user)->send(new ViewedNotification);
    }

    return view('users.edit', ['form' => $form]);
}
```

The component is registered above the guard so AJAX handlers can dispatch against it; the page-only work is gated below.

## Global Components

In some cases, you need a component and its interface to be globally available. Such as a notification bell with a handler called `onShowNotifications`.

The best way to achieve this is to define a generic `GlobalComponent` class, and within this class, define sub components that should be registered globally throughout the application.

```php
class GlobalComponent extends ComponentBase
{
    public $components = [
        \App\Components\Global\NotificationBell::class
    ];
}
```

Then simply register the component as global using the static `registerGlobalComponent` method found on the `ajax()` helper.

```php
ajax()::registerGlobalComponent(\App\Components\GlobalComponent::class);
```
