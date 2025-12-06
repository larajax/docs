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
