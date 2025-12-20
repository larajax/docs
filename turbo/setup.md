---
subtitle: Learn how links are routed using the AJAX framework.
---
# Turbo Router

Turbo routing is an implementation of PJAX (push state and AJAX) that gives the performance benefits of a single page application without the added complexity of a client-side framework. When you click a link, the page is automatically swapped client-side without the cost of a full page load.

```twig
<meta name="turbo-visit-control" content="enable" />
```

## Routing Links

You may programmatically visit a link with the following.

```js
jax.visit(location);
```

To replace the current URL without adding it to the navigation history, similar to `window.history.replaceState`, set the `action` option to **replace**.

```js
jax.visit(location, { action: 'replace' });
```

To check if the turbo router is enabled and should be used.

```js
if (jax.useTurbo && jax.useTurbo()) {
    // Use PJAX
}
```

## Disable Routing

The turbo router is disabled by default and must be explicitly enabled using the `turbo-visit-control` meta tag with the `enable` value (see above). To disable PJAX routing on a specific page where it was previously enabled, you may trigger a full reload by including the `turbo-visit-control` meta tag in the head section of the page with the `reload` value. This will disable the feature for incoming requests only.

```html
<head>
    <meta name="turbo-visit-control" content="reload" />
</head>
```

## Disable for Specific Links

When the turbo router is enabled, all internal HTML links will be routed using PJAX, but you can disable this by marking links or their parent container with `data-turbo="false"`. Links that are disabled are handled normally by the browser.

```html
<a href="/" data-turbo="false">Disabled</a>
```

You may re-enable when an ancestor has disabled:

```html
<div data-turbo="false">
    <a href="/" data-turbo="true">Enabled</a>
</div>
```

## Disable Visit Scrolling

Every visit scrolls to the top of the page like most links in a browser. However, in some cases preserving the scroll position is useful, such as situations where links act like filters. You may disable visit scrolling using the `data-turbo-no-scroll` attribute on the link element.

```html
<a href="/" data-turbo-no-scroll>Filter</a>
```

## Persisting Page Elements

In some cases you may want to include static elements on the page, these are elements that should not be refreshed when the page updates. Use the `data-turbo-permanent` attribute on the parent element. The element must also supply and `id` attribute so the original page can be matched with the new page, including event listeners.

```html
<div id="main-navigation" data-turbo-permanent>...</div>
```

## Setting a Root Path

By default, PJAX is used for all links within the same domain name and a visit to any other URL will fallback to a full page load. In some cases, your application may live in a subdirectory and the links should only apply to the root path.

For example, if you website lives in `/app` and you don't want the links to apply to a different site in `/docs` then you may restrict the links to a root path. You may set the root path by including the `turbo-root` meta tag in the page's head section.

```html
<head>
    <meta name="turbo-root" content="/app">
</head>
```

## Native Error Pages

When using PJAX and the server responds with an error code, such as 404 or 500 status, the complete html element is replaced, including scripts and stylesheets. This prevents accidentally replacing the body element with content not produced by the same application code.

You may disable this behavior by including the `turbo-visit-control` meta tag in the head section of the page with the `error` value. This will tell the turbo router that the error page content is produced by the native application.

```html
<meta name="turbo-visit-control" content="error">
```

## Page Caching

With caching enabled, the turbo router speeds up a website's performance by displaying revisited pages without accessing the network, making the website feel faster. When clicking a link, the contents are shown from the browser's local storage while the page requests the background. The latest page shows when the network request is complete, meaning the page renders twice.

### Listening for the Cache Event

You may listen to the `page:before-cache` event if you need to prepare the document before it enters the cache. You can use this for things like resetting forms, collapsing UI elements or tearing down any third-party controls, so the page is ready to be displayed again.

```js
addEventListener('page:before-cache', function() {
    // Close any open submenus, etc.
});
```

### Detecting a Cached Page Load

You can detect when the page contents are sourced from the cache with the `data-turbo-preview` attribute on the HTML element. Expressed in JavaScript as the following.

```js
if (document.documentElement.hasAttribute('data-turbo-preview')) {
    // Page shown is loaded from cache
}
```

Or using a StyleSheet with the following.

```css
html[data-turbo-preview] {
    /* Hide overlays from previous view */
}
```

### Disabling the Cache

You can disable the page cache for individual pages by using the `turbo-cache-control` meta tag in the page's head section. Settings this value to **no-cache** will disable the cache entirely. You can also set this to **no-preview** to keep the cached version when navigating using the browser's Back and Forward buttons.

```html
<head>
    <meta name="turbo-cache-control" content="no-cache">
</head>
```

## Working with Hot Reloading

In some cases, the turbo router may interfere when you are developing your website with hot reloading or browser sync technology, such as with [Laravel Mix](https://laravel-mix.com/) in development mode using `laravel-mix & browsersync`. Since the turbo router is disabled by default, simply omit the `turbo-visit-control` meta tag in your development environment to ensure compatibility with hot reloading.
