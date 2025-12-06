# `data-request-query`

Specifies additional GET parameters to be sent to the server and added to the current URL query string.

Send a GET parameter `page` with value `6` on the current request.

```html
<button
    data-request="onSetPage"
    data-request-query="{ page: 6 }">
    Page 6
</button>
```
