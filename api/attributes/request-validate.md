# `data-request-validate`

Enables inline form validation with error display. When included on a form, validation errors from the server are displayed within the form rather than as alert dialogs.

```html
<form data-request="onSubmit" data-request-validate>
    <div class="alert alert-danger" data-validate-error>
        <!-- Validation messages appear here -->
    </div>

    <div>
        <label>Name</label>
        <input name="name" />
    </div>

    <button type="submit">Submit</button>
</form>
```

## Displaying Error Messages

Use the `data-validate-error` attribute on a container element to display error messages. The content will be set to the error message and the element made visible.

```html
<div data-validate-error></div>
```

To display multiple error messages, include an element with the `data-message` attribute:

```html
<div class="alert alert-danger" data-validate-error>
    <p data-message></p>
</div>
```

## Field-Specific Errors

Use `data-validate-for` to show validation messages for individual fields:

```html
<input name="email" />
<div data-validate-for="email"></div>
```

## JavaScript API

The `browserValidate` option enables client-side validation before the request is sent:

```js
jax.request('#myForm', 'onSubmit', {
    browserValidate: true
});
```

## See Also

- [Form Validation Guide](../../guide/form-validation.md)
