# Hot Control Listeners

Observable controls can bind events either locally or globally. Local events are automatically unbound, while global events need to be manually unbound using the `disconnect` method.

## Local Events

You can bind a local event handler using the `listen` function, and these handlers will automatically unbind. To bind a listener to the control element itself, pass the event name and the event handler function to the `listen` function.

```js
class extends jax.ControlBase {
    connect() {
        this.listen('dblclick', this.onDoubleClick);
    }

    onDoubleClick() {
        console.log('You double clicked my control!');
    }
}
```

To bind a local event handler to a child element, pass the event name, CSS selector, and event handler function. The `event.delegateTarget` will always contain the element that matched the CSS selector.

```js
class extends jax.ControlBase {
    connect() {
        this.listen('click', '.toolbar-find-button', this.onClickFindButton);
    }

    onClickFindButton(event) {
        console.log('You clicked the find button inside the control: ' + event.delegateTarget.innerText);
    }
}
```

You may also bind to a DOM object, pass the event name, HTML element, and the event handler function.

```js
class extends jax.ControlBase {
    init() {
        this.$name = this.element.querySelector('input.name');
    }

    connect() {
        this.listen('click', this.$name, this.onClickNameInput);
    }

    onClickNameInput() {
        console.log('You clicked the name input inside the control!');
    }
}
```

## Global Events

Global events can be attached and removed using the `addEventListener` and `removeEventListener` native JavaScript functions. The event handler (second argument) refers to the class method of the same control instance. The `proxy` method is called to bind the current context to the function call.

```js
class extends jax.ControlBase {
    connect() {
        addEventListener('keydown', this.proxy(this.onKeyDown));
    }

    disconnect() {
        removeEventListener('keydown', this.proxy(this.onKeyDown));
    }

    onKeyDown(event) => {
        if (event.key === 'Escape') {
            // Escape button was pressed
        }
    }
}
```

::: tip
To prevent memory leaks, it is important to unbind global events so they are captured by garbage collection.
:::

## Dispatching Events

Controls can dispatch events by passing an event name to the `dispatch` function. The event is triggered on the DOM element and the event name is prefixed with the control name. In the following example, if the control is registered with a name **hello**, the event will be named **hello:ready**.

```js
jax.registerControl('hello', class extends jax.ControlBase {
    connect() {
        this.dispatch('ready');
    }
});
```

Now you can listen when the control is connected and grab the object using `jax.fetchControl` on the event target.

```js
addEventListener('hello:ready', function(ev) {
    const helloControl = jax.fetchControl(ev.target);
});
```

The second argument contains options where you may pass `detail` to the event, the following detail data is accessible via **ev.detail.foo** in the listener.

```js
this.dispatch('ready', { detail: {
    foo: 'bar'
}});
```

You may also specify a different `target` where the default is the attached element.

```js
this.dispatch('ready', { target: window });
```

Setting the `prefix` to false will make the event name global, the following triggers an event name of **hello-ready** instead of **hello:hello-ready**.

```js
this.dispatch('hello-ready', { prefix: false });
```

