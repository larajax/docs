# Form Validation

Validating forms checks the user input against a set of predefined rules. When using the AJAX framework form validation occurs without any special configuration, where the invalid field will be focused and an error message is displayed (usually as an alert window).

## Validation Approaches

Larajax provides several ways to display validation errors:

| Approach | Attributes | Behavior |
| -------- | ---------- | -------- |
| **Default** | None | Alert dialog, first invalid field focused |
| **Flash** | `data-request-flash` | Flash message for errors, first invalid field focused |
| **Inline** | `data-request-validate` | Errors displayed in `[data-validate-for]` elements, alert for errors |
| **Combined** | Both attributes | Inline validation + flash message for errors |

## Flash Validation

For basic validation, including the [`data-request-flash` attribute](../api/attributes/request-flash.md) on the HTML form tag provides a clean and simple interface for displaying validation messages and is usually good enough for most implementations.

```html
<form data-request="onSubmit" data-request-flash>
    <div>
        <label>Name</label>
        <input name="name" />
    </div>

    <button data-attach-loading>
        Submit
    </button>
</form>
```

Inside your AJAX handler, you may throw a validation exception to make a field invalid. The supplied array (first argument) should use field names for the keys and the error messages for the values.

```php
use Illuminate\Validation\ValidationException;

function onSubmit()
{
    if (!request('name')) {
        throw ValidationException::withMessages([
            'name' => 'You must give a name!'
        ]);
    }
}
```

When the AJAX framework encounters the `ValidationException`, it will automatically focus the first invalid field and display error messages as a flash notification.

::: tip Fatal Errors
Fatal errors (server errors, database failures) always display as native `alert()` dialogs, even with `data-request-flash` enabled. This ensures critical errors are always visible. See [Flash Messages](./flash-messages.md#error-severity) for details.
:::

## Inline Validation

For a more comprehensive validation experience, inline validation can be enabled by including the `data-request-validate` attribute on the HTML form tag. The following is a minimal example of form validation using this approach with the error message displayed within the form.

```html
<form data-request="onSubmit" data-request-validate>
    <div class="alert alert-danger" data-validate-error>
        <!-- Validation Message -->
    </div>

    <div>
        <label>Name</label>
        <input name="name" />
    </div>

    <button data-attach-loading>
        Submit
    </button>
</form>
```

### Validating a Single Field

In some cases you may want to validate a single field when the value changes. By including the `data-request-trigger="input changed"` attribute alongside the `data-request` attribute, the AJAX framework will submit a request when a user types something in to the field.

```html
<form data-request-validate>
    <div>
        <label>Username</label>
        <input name="username" data-request="onCheckUsername" data-request-trigger="input changed" />
    </div>
</form>
```

A dedicated AJAX handler can be used to validate the field. If no exception is thrown, it can be considered valid.

```php
function onCheckUsername()
{
    if (true) {
        throw ValidationException::withMessages(['username' => 'Username is taken!']);
    }
}
```

## Using the Validation Service

For more complex validation, you may use the `request()` service to apply rules to the user input in bulk. The `validate` method performs validation using the specified rules (first argument), and returns the attributes and values that were validated as an array. It also throws a `ValidationException` if the validation fails.

```php
function onSubmit()
{
    $data = request()->validate([
        'name' => 'required',
        'email' => 'required|email',
    ]);

    // The code will not reach here if validation fails

    Flash::success('Jobs done!');
}
```

### Custom Error Messages & Attributes

To change the default validation messages, you may pass custom messages to the `validate` method. The keys in the messages array (third argument) follow the `attribute.rule` format.

```php
$messages = [
    'email.required' => 'Please type something for the email...',
    'email.email' => 'That email is not an email...!'
];

$data = request()->validate($rules, $messages);
```

If you want to keep the default validation messages, and only change the `:attribute` name used, pass custom attributes as an array (fourth argument).

```php
$attributeNames = [
    'email' => 'e-mail address'
];

$data = request()->validate($rules, [], $attributeNames);
```

## Displaying Error Messages

Inside the form, you may display the first error message by using the `data-validate-error` attribute on a container element. The content inside the container will be set to the error message and the element will be made visible.

```html
<div data-validate-error></div>
```

To display multiple error messages, include an element with the `data-message` attribute. In this example the paragraph tag will be duplicated and set with content for each message that exists.

```html
<div class="alert alert-danger" data-validate-error>
    <p data-message></p>
</div>
```

### Displaying Errors with Fields

If you prefer to show validation messages for individual fields, define an element that uses the `data-validate-for` attribute, passing the field name as the value.

```html
<!-- Input field -->
<input name="phone" />

<!-- Validation message for the field -->
<div data-validate-for="phone"></div>
```

If the element is left empty, it will be populated with the validation text from the server. Otherwise you can specify any text you like and it will be displayed instead.

```html
<div data-validate-for="phone">
    Oops.. phone number is invalid!
</div>
```

### Displaying Errors with Flash Messages

When using `data-request-validate` with `data-request-flash`, validation errors are shown both inline (in `[data-validate-for]` elements) and as flash messages. This gives you the best of both approaches.

```html
<form
    data-request-validate
    data-request-flash>
```

To show inline validation only (without flash messages for validation errors), exclude the validate type:

```html
<form
    data-request-validate
    data-request-flash="-validate">
```

::: tip
Fatal errors always use `alert()` regardless of these settings. See [Flash Messages](./flash-messages.md#error-severity) for details on error severity.
:::

## Working with JavaScript

To implement custom functionality for the error messages, hook into the `ajax:invalid-field` event to display the field and `ajax:promise` to reset the form on a new submission. The JavaScript events used are found in the [AJAX JavaScript API](../api/events/index.md).

```js
addEventListener('ajax:invalid-field', function(event) {
    const { element, fieldName, errorMsg, isFirst } = event.detail;
    element.classList.add('has-error');
});

addEventListener('ajax:promise', function(event) {
    event.target.closest('form').querySelectorAll('.has-error').forEach(function(el) {
        el.classList.remove('has-error');
    });
});
```

## Complete Usage Example

Below is a complete example of form validation. It calls the `onSubmitForm` event handler that triggers a loading submit button, performs validation on the form fields, then displays a successful flash message.

The `data-request-flash` attribute is used to enable flash messages for successful messages and display the validation message. The `data-attach-loading` attribute is used to display a loading indicator and prevent double submissions from misclicks.

```html
<form
    data-request="onSubmitForm"
    data-request-validate
    data-request-flash>
    <div>
        <label>Username</label>
        <input name="username"
            data-request="onCheckUsername"
            data-request-trigger="input changed"
            data-attach-loading />
        <span data-validate-for="username"></span>
    </div>

    <div>
        <label>Email</label>
        <input name="email" />
        <span data-validate-for="email"></span>
    </div>

    <button data-attach-loading>
        Submit
    </button>

    <div class="alert alert-danger" data-validate-error>
        <p data-message></p>
    </div>
</form>
```

The `onSubmitForm` AJAX event handler looks at the POST data sent by the client and applies some rules to the validator. If the validation fails, a `ValidationException` is thrown, otherwise a `Flash::success` message is returned.

The `onCheckUsername` checks to see if a username is available, currently hard-coded to prevent names **admin** and **jeff** from being entered. It is checked twice, when the user types something in and when the user submits the form.

```php
function onSubmitForm()
{
    $data = request()->validate([
        'username' => 'required',
        'email' => 'required|email',
    ]);

    $this->onCheckUsername();

    Flash::success('Jobs done!');
}

function onCheckUsername()
{
    $username = strtolower(trim(request('username')));
    $isTaken = in_array($username, ['admin', 'jeff']);

    if ($isTaken) {
        throw ValidationException::withMessages(['username' => 'Username is taken!']);
    }
}
```
