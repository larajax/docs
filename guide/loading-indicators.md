# Loading Indicators

When the AJAX framework makes a request to the server, it is a good idea to display a loading indicator since the page may not update immediately. There are several approaches and standard loading indicators to make it clear when an AJAX request has been triggered and is in progress.

## Progress Bar

A prominent feature of the AJAX framework is a progress bar that is displayed on the top of the page when an AJAX request runs. The progress bar listens for an AJAX request and will appear when a request takes longer than 300ms and hides again when the request is complete.

To disable the progress bar for a request, set the `data-request-progress-bar` attribute to `false`.

```html
<button
    data-request="onDoSomething"
    data-request-progress-bar="false">
    Do something
</button>
```

In JavaScript, set the `progressBar` option of an AJAX request to `false`.

```js
jax.ajax('onSilentRequest', { progressBar: false });
```

To disable the progress bar globally, set the `visibility` style to `hidden` using a StyleSheet.

```css
.ajax-progress-bar {
    visibility: hidden;
}
```

You may display the progress bar using JavaScript using the `jax.progressBar` object and `show` / `hide` functions.

```js
jax.progressBar.show();

jax.progressBar.hide();
```

## Loading Button

When submitting forms, users can accidentally click the button twice and cause a double submission, and this is solved using a loading button. During AJAX requests, button elements that have the `data-attach-loading` attribute will be disabled, and a CSS class `ajax-attach-loader` added. This class will spawn a loading spinner on button and anchor elements using the `:after` CSS selector.

```html
<a href="#"
    data-request="onDoSomething"
    data-attach-loading>
    Do Something
</a>
```

When a button exists inside a form that contain the `ajax-attach-loader` attribute will display the loading indicator.

```html
<form data-request="onSubmit">
    <button data-attach-loading>
        Submit
    </button>
</form>
```

Since inputs do not support the `:after` CSS selector, they have a new element inserted after them instead. The element is removed once the AJAX request is complete. This is useful when working with the `data-track-input` attribute that watches the input for changes and submits the AJAX request.

```html
<input name="username"
    data-request="onCheckUsername"
    data-track-input
    data-attach-loading />
```

You can manually add the loader to a button using the `jax.attachLoader` object and `show` / `hide` functions passing the element selector or object as the first argument.

```js
jax.attachLoader.show('.my-element');

jax.attachLoader.hide('.my-element');
```

## Toggling Elements

You can use the `data-request-loading` attribute to make an element visible during an AJAX request. The value is a CSS selector that uses display `block` and `none` attributes to manage the element visibility.

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

### Detecting Global Requests

You can detect when a global AJAX request is in progress by checking the `data-ajax-progress` attribute on the HTML element. Expressed in a StyleSheet as the following.

```css
html[data-ajax-progress] {
    /* Display loading indicators */
}
```

The attribute is also added to form elements.

```css
form[data-ajax-progress] {
    /* The form is loading */
}
```

### Targeting Specific Handlers

In some cases you may want to show a loading indicator for a specific AJAX handler event, the `data-ajax-progress` attribute will contain the most recent handler name, and this can be used to target a specific request.

```html
<form>
    <button data-request="onPay">Pay Now</button>
    <button data-request="onCancel">Cancel</button>

    <div class="is-payment-loading">
        Processing Payment...
    </div>
</form>
```

This can be targeted using a StyleSheet attribute value selector.

```css
.is-payment-loading {
    display: none;
}

form[data-ajax-progress=onPay] .is-payment-loading {
    display: block;
}
```

## Working with JavaScript

For more complex scenarios, you can hook in to the [JavaScript Events](../api/events/index.md) to build custom loading indicators.

### Global Loader

For a page-level loader (like a spinner in the header or full-page overlay), use the `ajax:request-start` and `ajax:request-end` events. These fire on every HTTP request.

```js
addEventListener('ajax:request-start', function() {
    document.querySelector('#global-loader').classList.add('visible');
});

addEventListener('ajax:request-end', function() {
    document.querySelector('#global-loader').classList.remove('visible');
});
```

### Element-Specific Loader

For loaders relative to the triggering element (like a spinner inside a button), use `ajax:before-request`, `ajax:request-complete`, and `ajax:request-cancel`. The cancel event fires when a confirmation dialog is declined, ensuring the loader is hidden even if the request never runs.

```js
document.addEventListener('ajax:before-request', function(event) {
    if (event.detail?.context?.options?.loader === false) return;

    const button = event.target.closest('button');
    if (button) {
        button.classList.add('loading');
    }
});

function hideLoader(event) {
    const button = event.target.closest('button');
    if (button) {
        button.classList.remove('loading');
    }
}

document.addEventListener('ajax:request-complete', hideLoader);
document.addEventListener('ajax:request-cancel', hideLoader);
```

To disable the loader for a specific request, set the `loader` option to `false`:

```js
jax.ajax('onDoSomething', { loader: false });
```

```html
<button data-request="onDoSomething" data-request-loader="false">Submit</button>
```

### Disabling Form Inputs

The following example will disable all inputs inside a form while the request is running.

```js
addEventListener('ajax:before-request', function(event) {
    event.target.closest('form').querySelectorAll('input').forEach(function(el) {
        el.disabled = true;
    });
});

addEventListener('ajax:request-complete', function(event) {
    event.target.closest('form').querySelectorAll('input').forEach(function(el) {
        el.disabled = false;
    });
});
```
