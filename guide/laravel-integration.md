# Controller Integration

Controllers require specific integration to make call AJAX handlers and return their result. It is a good idea set up a base controller class for your application.

```php
namespace App;

use Illuminate\Routing\Controller;
use Larajax\Contracts\AjaxControllerInterface;
use Exception;

class ControllerBase extends Controller implements AjaxControllerInterface
{
    // ...
    use \Larajax\Traits\AjaxController;

    public function callAction($method, $parameters)
    {
        try {
            if ($result = $this->callAjaxAction($method, array_values($parameters))) {
                return $result;
            }
        }
        catch (Exception $ex) {
            return ajax()->exception($ex);
        }

        return parent::callAction($method, $parameters);
    }
}
```

This class just needs to implement the `AjaxControllerInterface` interface and the `Larajax\Traits\AjaxController` trait provides a good way to do that.

## Implementing a Controller Class

First let's start by creating a controller.

```php
namespace App\Controllers;

use App\ControllerBase;

class ProfileController extends ControllerBase
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

Now set up a route definintion for the index page. Be sure to use the `any` route to support both GET and POST.

```php
Route::any('/profile', [\App\Controllers\ProfileController::class, 'index']);
```
