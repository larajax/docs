# Working with JavaScript

When working with PJAX, the page contents may load dynamically, which differs from the usual browser behavior. To overcome this, use the `render` event handler is called every time the page loads, including AJAX updates.

```js
addEventListener('render', function() {
    // Page has rendered something new
});
```

The `jax.pageReady` function is used call code when the page and scripts are ready. The function returns a promise that is resolved after all the page scripts have loaded, or immediately if they are already loaded.

```js
jax.pageReady().then(() => {
    // Page has finished loading scripts
});
```

The `jax.waitFor` is another useful function that will wait for an object or variable to exist. The function returns a promise that is resolved when the variable is found.

```js
jax.waitFor(() => window.propName).then(() => [
    // window.propName is now available
]);
```

The second argument provides a timeout interval in milliseconds, the following will stop waiting after two seconds.

```js
jax.waitFor(() => window.propName, 2000).then(() => {
    console.log('Found the variable!')
}).catch(() => {
    console.error('Gave up waiting...')
});
```

## Inline Script Elements

The turbo router maintains the scripts within the `<head>` tag of the page by comparing the differences. If you use script tags in the `<body>` tag then the script will be executed every time the page renders, which may be undesirable.

You may include `data-turbo-eval="false"` to only allow the script to be executed on the first page load. The script will not be called for any PJAX requests.

```html
<body>
    <script data-turbo-eval="false" src="{{ ['@framework.bundle']|theme }}"></script>
</body>
```
::: tip
If you are placing scripts in the `<body>` tag for performance reasons, consider moving it to the `<head>` tag and using `<script defer>` instead.
:::

To execute inline JavaScript code only once, regardless of first page load or PJAX request, set a unique value to the `data-turbo-eval-once` attribute. The unique value (e.g `myAjaxPromise`) is used to determine if the script has been seen before.

```html
<script data-turbo-eval-once="myAjaxPromise">
    // This script will run once only
    addEventListener('ajax:promise', function(event) {
        //
    });
</script>
```

## Making Controls Idempotent

::: aside
October CMS provides a complimentary library that is used to make building [idempotent controls](../controls/definition.md) easy.
:::

When a page visit occurs and JavaScript components are initialized, it is important that these function are idempotent. In simple terms, an idempotent function is safe to apply multiple times without changing the result beyond its initial application.

One technique for making a function idempotent is to keep track of whether you've already performed it by adding a value to the `dataset` property on each processed element. This is useful for external scripts.

```js
addEventListener('page:loaded', function() {
    // Find my control
    var myControl = document.querySelector('.my-control');

    // Check if control has already been initialized
    if (!myControl.dataset.hasMyControl) {
        myControl.dataset.hasMyControl = true;

        // Initialize since this is the first time
        initializeMyControl(myControl);
    }
});
```

As general advice, a simpler approach is to allow the function to run multiple times and apply idempotence techniques internally. For example, check to see if a menu divider already exists first before creating a new one.

## Disposing Controls

In some cases you may bind global events for a specific page only, for example, binding a hot key to a certain action.

```js
addEventListener('keydown', myKeyDownFunction);
```

To prevent this event from leaking to other pages, you should remove the event using the `page:unload` method, which will destroy any events and controls. The event can be used once to dispose of controls and events safely.

```js
addEventListener('page:unload', function() {
    removeEventListener('keydown', myKeyDownFunction);
}, { once: true });
```

::: tip
October CMS includes a complimentary library for [building disposable controls](../controls/definition.md).
:::

## Pause Rendering

If you would like to animate some elements like dropdowns or off-canvas menus before loading a new page, you can pause the `page:before-render` event by preventing the default behavior and resuming it with the `resume()` function in the event detail.

```js
addEventListener('page:before-render', async (event) => {
    event.preventDefault();

    await animateOut();

    event.detail.resume();
});
```

::: warning
Keep in mind that the **page:before-render** event may fire twice, once from cache and once again after requesting the new page content.
:::

## Global Events

The AJAX framework triggers several events during the navigation life cycle and page responses. The events are usually triggered on the `document` object with details available on the `event.detail` property.

Event | Description
------------- | -------------
**render** | triggered when the page updates via PJAX or AJAX.
**page:click** | triggered when a turbo-routed link is clicked.
**page:before-visit** | triggered before visiting a location, except when navigating using browser history.
**page:visit** | triggered after a clicked visit starts.
**page:request-start** | triggered before the request for a page.
**page:request-end** | triggered after the page request ends.
**page:before-cache** | triggered before a page is cached.
**page:before-render** | triggered before the page content is rendered.
**page:render** | triggered after the page is rendered. This is fired twice, once from cache and once again after requesting the new page content.
**page:load** | triggered once after the initial page load and again every time a page is visited.
**page:loaded** | identical to `page:load` except will wait for all newly added scripts to load.
**page:updated** | similar to `DOMContentLoaded` except triggered only when a page is visited.
**page:unload** | called when a previously loaded page should be disposed.

## Usage Examples

The following JavaScript will run every time a page loads, including scripts.

```js
addEventListener('page:loaded', function() {
    // ...
});
```
