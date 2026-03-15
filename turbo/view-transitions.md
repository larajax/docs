# View Transitions

The [View Transitions API](https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API) is a native browser feature that animates DOM changes with smooth visual transitions. When combined with the turbo router, page navigations get an automatic cross-fade animation, making your multi-page site feel as polished as a single-page application.

Instead of the usual instant swap between pages, the browser captures the old page state, applies the DOM update, captures the new state, and animates between the two. All of this happens natively, with no JavaScript animation libraries needed.

## Enabling View Transitions

To enable view transitions, include the following meta tag in the `<head>` section of your page or layout, alongside the turbo router meta tag.

```html
<head>
    <meta name="turbo-visit-control" content="enable" />
    <meta name="turbo-view-transition" content="same-origin" />
</head>
```

That's it. Every turbo-routed page navigation will now use a smooth cross-fade transition. Browsers that don't support the View Transitions API will fall back to the standard instant page swap with no errors or side effects.

::: tip
The `same-origin` value follows the web platform convention for view transitions. Only same-origin navigations will be animated, which is the standard and expected behavior.
:::

## Customizing the Transition

The default transition is a cross-fade on the entire page. You can customize the animation duration, easing, or style using CSS pseudo-elements provided by the View Transitions API.

### Adjusting Duration and Easing

```css
::view-transition-old(root),
::view-transition-new(root) {
    animation-duration: 0.3s;
    animation-timing-function: ease-in-out;
}
```

### Slide Transition

Replace the default cross-fade with a horizontal slide.

```css
@keyframes slide-out {
    to { transform: translateX(-100%); }
}

@keyframes slide-in {
    from { transform: translateX(100%); }
}

::view-transition-old(root) {
    animation: slide-out 0.3s ease-in-out;
}

::view-transition-new(root) {
    animation: slide-in 0.3s ease-in-out;
}
```

### Fade with Scale

A subtle zoom effect that works well for content-heavy pages.

```css
::view-transition-old(root) {
    animation: 0.2s ease-in both fade-out, 0.3s ease-in both scale-down;
}

::view-transition-new(root) {
    animation: 0.3s ease-out 0.1s both fade-in, 0.3s ease-out 0.1s both scale-up;
}

@keyframes fade-out { to { opacity: 0; } }
@keyframes fade-in { from { opacity: 0; } }
@keyframes scale-down { to { transform: scale(0.95); } }
@keyframes scale-up { from { transform: scale(0.95); } }
```

## Directional Animations

During navigation, the turbo router sets a `data-turbo-visit-direction` attribute on the `<html>` element with one of three values:

Direction | When
--------- | ----
**forward** | Clicking a link (advance action)
**back** | Browser back/forward (restore action)
**none** | Replace or same-page actions

This lets you create directional slide animations that feel natural, sliding content in from the right when navigating forward and from the left when going back.

```css
@keyframes slide-from-right {
    from { transform: translateX(100%); }
}

@keyframes slide-to-left {
    to { transform: translateX(-100%); }
}

@keyframes slide-from-left {
    from { transform: translateX(-100%); }
}

@keyframes slide-to-right {
    to { transform: translateX(100%); }
}

/* Forward navigation */
html[data-turbo-visit-direction="forward"]::view-transition-old(root) {
    animation: slide-to-left 0.3s ease-in-out;
}

html[data-turbo-visit-direction="forward"]::view-transition-new(root) {
    animation: slide-from-right 0.3s ease-in-out;
}

/* Back navigation */
html[data-turbo-visit-direction="back"]::view-transition-old(root) {
    animation: slide-to-right 0.3s ease-in-out;
}

html[data-turbo-visit-direction="back"]::view-transition-new(root) {
    animation: slide-from-left 0.3s ease-in-out;
}
```

The attribute is removed after the visit completes, so it won't affect other CSS rules.

## Animating Specific Elements

The real power of view transitions comes from animating individual elements independently. By assigning a `view-transition-name` to an element, the browser will track it across page navigations and animate it separately from the rest of the page.

### Hero Image Example

On a product listing page:

```html
<img src="/products/widget.jpg" style="view-transition-name: hero-image;" />
```

On the product detail page, the same image with the same transition name:

```html
<img src="/products/widget.jpg" style="view-transition-name: hero-image;" />
```

The browser will smoothly morph the image from its position on the listing page to its position on the detail page, while cross-fading the rest of the content. This creates a natural sense of continuity between pages.

### Page Header Example

Keep the header stable while the content transitions beneath it.

```css
header {
    view-transition-name: main-header;
}

::view-transition-old(main-header),
::view-transition-new(main-header) {
    animation: none; /* No animation, header stays in place */
}
```

This gives the feel of only the main content area changing while the navigation remains fixed.

### Dynamic Transition Names

For lists of items where each card should animate individually, assign unique transition names dynamically.

```html
<div class="product-card" style="view-transition-name: product-42;">
    <h3>Widget</h3>
    <img src="/products/widget-thumb.jpg" />
</div>
```

::: warning
Every `view-transition-name` must be unique on the page. If two elements share the same name, the transition will fail silently. When generating names dynamically, use a unique identifier like a database ID or slug.
:::

## Combining with Page Rendering Events

View transitions work seamlessly with the existing [page rendering events](./javascript.md). You can still use `page:before-render` to pause rendering and run exit animations before the view transition begins.

```js
addEventListener('page:before-render', async (event) => {
    event.preventDefault();

    // Run exit animation before the transition
    await animateOut();

    // Resume rendering, the view transition wraps the DOM swap
    event.detail.resume();
});
```

The view transition wrapping occurs inside the `resume()` callback, so deferred renders receive the transition animation too.

## Respecting User Preferences

Some users prefer reduced motion for accessibility reasons. You should respect this preference by disabling or simplifying animations using the `prefers-reduced-motion` media query.

```css
@media (prefers-reduced-motion: reduce) {
    ::view-transition-old(root),
    ::view-transition-new(root) {
        animation-duration: 0s;
    }
}
```

## Browser Compatibility

The View Transitions API is supported in Chrome 111+, Edge 111+, Safari 18+, and Firefox 126+. When a browser does not support the API, the turbo router will fall back to the standard instant page swap, so it is safe to enable in production without affecting older browsers.
