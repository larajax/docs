# `data-request-success`

Specifies JavaScript code to execute after the request is successfully completed. The `data` variable is available in this function containing the response data.

Show a popup window after the successful request.

```html
<form
    data-request="onLogin"
    data-request-success="alert('Yay!')">
```
