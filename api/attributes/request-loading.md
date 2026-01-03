# `data-request-loading`

Shows or hides an element while an AJAX request is running. The value is a CSS selector targeting the element to toggle.

```html
<button
    data-request="onPay"
    data-request-loading=".is-loading">
    Pay Now
</button>

<div style="display:none" class="is-loading">
    Processing Payment...
</div>
```

The element uses `display: block` when visible and `display: none` when hidden.

## JavaScript API

The `loading` option accepts a CSS selector string or an object with `show()` and `hide()` methods:

```js
jax.ajax('onPay', {
    loading: '.is-loading'
});
```

With a custom object:

```js
jax.ajax('onPay', {
    loading: {
        show: () => document.querySelector('.spinner').classList.add('visible'),
        hide: () => document.querySelector('.spinner').classList.remove('visible')
    }
});
```

## See Also

- [Loading Indicators Guide](../../guide/loading-indicators.md)
- [`data-attach-loading`](./attach-loading.md)
