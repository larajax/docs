---
subtitle: Learn how links are routed using the AJAX framework.
---
# Turbo Router

Turbo routing is an implementation of PJAX (push state and AJAX) that gives the performance benefits of a single page application without the added complexity of a client-side framework. When you click a link, the page is automatically swapped client-side without the cost of a full page load.

To enable turbo routing, include the following meta tag in the `<head>` section of your page or layout.

```html
<head>
    <meta name="turbo-visit-control" content="enable" />
</head>
```

Once enabled, all internal links on the page will automatically use PJAX navigation instead of full page reloads.

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

## Working with Hot Reloading

In some cases, the turbo router may interfere when you are developing your website with hot reloading or browser sync technology, such as with [Laravel Mix](https://laravel-mix.com/) in development mode using `laravel-mix & browsersync`. Since the turbo router is disabled by default, simply omit the `turbo-visit-control` meta tag in your development environment to ensure compatibility with hot reloading.
