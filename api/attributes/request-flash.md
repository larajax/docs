# `data-request-flash`

When included, displays error messages as flash notifications instead of native `alert()` dialogs. Also enables display of flash messages sent from the server via `ajax()->flash()`.

```html
<form
    data-request="onSuccess"
    data-request-flash>
    <!-- Form Contents -->
</form>
```

## Supported Values

These values control which flash message types are displayed (from `ajax()->flash()`):

| Value | Behavior |
| ----- | -------- |
| (empty) | Shows all standard types: `success`, `error`, `warning`, `info` |
| `error,success` | Shows only specified types (comma-separated) |
| `-error` | Shows all except specified types (negation with minus prefix) |

## Error Severity

Fatal errors (server errors, database failures) always display as `alert()` dialogs, even with this attribute enabled. Only recoverable errors (validation, business logic) are shown as flash messages.

```php
// Shows as flash message with data-request-flash
return ajax()->error('Please check your input');

// Always shows as alert(), regardless of attributes
return ajax()->fatal('Database connection failed');
```

## Combined with Validation

When used with `data-request-validate`, validation errors display both inline and as flash messages:

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

## See Also

- [Flash Messages Guide](../../guide/flash-messages.md)
- [Form Validation Guide](../../guide/form-validation.md)
