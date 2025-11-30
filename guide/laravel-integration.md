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
    public function callAction($action, $parameters)
    {
        try {
            if ($result = $this->callAjaxAction($action, array_values($parameters))) {
                return $result;
            }
        }
        catch (Exception $ex) {
            return ajax()->exception($ex);
        }

        return parent::callAction($action, $parameters);
    }
}
```

This controller class just needs to implement the `AjaxControllerInterface` interface and the `Larajax\Traits\AjaxController` trait provides a good way to do that. Then when a controller action is called (`callAction`), check to see if it is an AJAX request, and redirect the request to the AJAX handler (`callAjaxAction`) for processing.

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
