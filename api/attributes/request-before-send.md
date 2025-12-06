# `data-request-before-send`

Specifies JavaScript code to execute directly before the request is sent.

```html
<button
    data-request="onSend"
    data-request-before-send="console.log('Sending...')">
    Ship It!
</button>
```

The `data` and `context` variables are available inside the functions.

```html
<button
    data-request-before-send="console.log(context)">
```

If the function returns `false`, the request is aborted.

```html
<button
    data-request-before-send="return false">
```
