---
subtitle: Defer control connection until the content becomes visible.
---
# Lazy Controls

By default, a control connects the moment its element enters the DOM, even when that element is hidden inside a collapsed section, an inactive tab or a closed dialog. For lightweight controls this is fine, but when a page contains many hidden instances of expensive controls, such as rich editors or enhanced select fields, initializing them all up front can make the page slow to load.

The `data-lazy-controls` attribute marks a container as a lazy region. Controls inside it are observed as usual but their connection is deferred until the container becomes visible on screen. The markup renders normally and only the JavaScript behavior waits.

```html
<div class="collapsed-panel" data-lazy-controls>
    <div data-control="richeditor">...</div>
    <select data-control="custom-select">...</select>
</div>
```

When the panel above is hidden, for example with `display: none`, neither control initializes. The moment the panel is displayed, both controls connect and their `init` and `connect` methods fire in the usual order. No extra JavaScript is required to trigger this, visibility is detected automatically using [IntersectionObserver](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver).

::: tip
Visibility means intersecting the viewport. A lazy container that is rendered below the fold connects its controls when the user scrolls it into view, which also spreads initialization cost across long pages.
:::

## Deferred Lifecycle

A deferred control follows the same lifecycle as any other control, it simply starts later.

- Once connected, a control stays connected until its element is removed, hiding the container again does not disconnect it.
- A deferred element that is removed before its container ever became visible is discarded silently, `connect` and `disconnect` never fire.
- Moving a deferred element around the DOM keeps it deferred, it still connects when its container becomes visible.
- Elements added inside a lazy container later, for example from an AJAX partial update, are deferred the same way as those present on page load.

In browsers without `IntersectionObserver` support, the attribute is ignored and controls connect immediately.

## Nested Regions

Each control waits for its **nearest** lazy container. This means lazy regions can nest, and inner regions remain deferred when an outer region becomes visible.

```html
<div data-lazy-controls>
    <div data-control="richeditor">...</div> <!-- connects when the outer region shows -->

    <div class="collapsed-panel" data-lazy-controls>
        <div data-control="richeditor">...</div> <!-- waits for the inner panel -->
    </div>
</div>
```

This suits interfaces built from collapsible items that contain their own collapsible children, where each level should only pay for what the user actually opens.

## Server Rendered State

Since the markup inside a lazy region renders normally, form values submit correctly whether or not the controls have connected. Keep in mind that any state a control applies when it connects, such as toggling a `disabled` attribute, will not have run for deferred controls. Render the correct initial state on the server instead of relying on the `connect` method to repair it.