---
subtitle: Build observable HTML controls tethered to JavaScript.
---
# Hot Controls

Larajax includes a simple implementation of [MutationObserver](https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver), where you can define HTML controls that detect when they are added or removed from the page. Now it's possible to initialize or uninitialize controls that are added or removed via AJAX or [turbo router](../turbo/setup.md) updates.

## Registering an Observable Control

In its basic form, the `jax.registerControl` JavaScript function is used to define a unique control name (first argument) and class definition (second argument) that extends the `jax.ControlBase` base class.

```js
jax.registerControl('hello', class extends jax.ControlBase {
    // ...
});
```

::: tip
This function can be called multiple times and it will take the **last seen definition**.
:::

The control name is used to link to a DOM element representing the control, using the `data-control` attribute. For example, a control registered with the name **hello** monitors the page for any element with the `data-control="hello"` attribute attached to it.

```html
<div data-control="hello"></div>
```

The `connect` and `disconnect` methods within the class definition are triggered whenever the control is added or removed from the page. This can occur at any time, as the observer continuously monitors for DOM changes.

```js
class extends jax.ControlBase {
    connect() {
        // Element has appeared in DOM
    }

    disconnect() {
        // Element was removed from DOM
    }
}
```

## Initializing a Control

The `init` method allows you to load the default configuration for the control and configure its child elements.

```js
class extends jax.ControlBase {
    init() {
        // Establish the control before running logic
    }
}
```

::: tip
The `init` method is called once per control and `connect` is called every time the control is added or removed from the DOM, for example, when moving the element to a new location.
:::

### Configuration

All `data-` attributes on the control element make up its available configuration.

```html
<div data-control="hello" data-favorite-color="red"></div>
```

Configuration values can be accessed via the `this.config` property. The data attributes are converted from to camelCase, without the `data-` prefix, for example, the `data-favorite-color` attribute is accessed as `this.config.favoriteColor`.

```js
class extends jax.ControlBase {
    init() {
        this.favoriteColor = this.config.favoriteColor || 'green';
    }

    connect() {
        console.log(`Favorite color? ${this.favoriteColor}!`);
    }
}
```

### Child Elements

Any selector, whether CSS or data attributes, can be used to select child elements within the parent control class.

```html
<div data-control="hello">
    <input class="name" disabled />
</div>
```

The parent control element is available via `this.element`. Any child element can be selected with `querySelector` for a single element, or `querySelectorAll` for multiple elements.

```js
class extends jax.ControlBase {
    init() {
        this.$name = this.element.querySelector('input.name');
    }

    connect() {
        this.$name.value = 'Jeff';
        this.$name.disabled = false;
    }
}
```

## Referencing Other Controls

The `jax.fetchControl` function is used to return a control instance from an existing control element, this accepts a selector string, or an element directly. The resulting instance support method calls or accessing properties found on the control class definition.

```js
const searchControl = jax.fetchControl(element);
```

You may also pass a selector string, along with the control name as the second argument (optional). This is useful when multiple controls are bound to the same element and you want to clarify the exact identifier.

```js
const searchControl = jax.fetchControl('[data-control=search]', 'search');
```

The `jax.importControl` function can be used to return a control class that has been registered, which can be useful for calling static methods on the class. The function accepts the control identifier as a string.

```js
const searchControlClass = jax.importControl('search');
```

The `jax.observeControl` function is used to immediately resolve a control instance and attach it to the element. This is useful when an element does not have the `data-control` attribute and you want to attach it without waiting for the observer events.

```js
const searchControl = jax.observeControl(element, 'search');
```