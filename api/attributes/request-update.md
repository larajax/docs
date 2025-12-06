# `data-request-update`

Specifies a list of partials and page elements (CSS selectors) to update. The format is as follows: `partial: selector, partial: selector`. Usage of quotes is required in some cases, for example: `'my-partial': '#myelement'`. The selector string should start with a `#` or `.` character, except you may also prepend it with `@` to append contents to the element, `^` to prepend, `!` to replace with and `=` to use any CSS selector.

Trigger the `onCalculate` handler when the form is submitted. Update the element with the identifier "result"` with the **calcresult** partial.

```html
<form
    data-request="onCalculate"
    data-request-update="{ calcresult: '#result' }">
</form>
```

## JavaScript API

The `update` option is used with the JavaScript API.

```js
jax.ajax('onCalculate', {
    update: {
        calcresult: '#result'
    }
})
```
