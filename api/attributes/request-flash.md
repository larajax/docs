# `data-request-flash`

when included, instructs the server to clear and send any flash messages with the response. This option is used by the flash messages features.

```html
<form
    data-request="onSuccess"
    data-request-flash>
    <!-- Form Contents -->
</form>
```

To display both at the same time, set the attribute to a wildcard (`*`) to display all flash message types, including validation.

```html
<form
    data-request-validate
    data-request-flash="*">
```
