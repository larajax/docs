# Hot Control Examples

## Vanilla JS Example

The following example demonstrates a basic HTML form that includes a name input and a greeting button. The control class initializes the input and output elements, and then listens for the click event on the Greet button. When the Greet button is clicked, the output element displays a greeting that includes the entered name.

```html
<div data-control="hello-world">
    <input type="text" class="name" />

    <button class="greet">
        Greet
    </button>

    <span class="output">
    </span>
</div>

<script>
jax.registerControl('hello-world', class extends jax.ControlBase {
    init() {
        this.$name = this.element.querySelector('input.name');
        this.$output = this.element.querySelector('span.output');
    }

    connect() {
        this.listen('click', 'button.greet', this.onGreet);
    }

    onGreet() {
        this.$output.textContent = `Hello, ${this.$name.value}!`;
    }
});
</script>
```

## Google Maps Example

The following example shows a simple implementation of a third-party JavaScript library, such as Google Maps API. The library `Map` is initialized on the control `div` element when it is seen on the page. When the control is removed from the page, it prevents memory leaks by calling `destroy` on the map instance and setting the property to `null`.

```html
<div data-control="google-map"></div>

<script>
jax.registerControl('google-map', class extends jax.ControlBase {
    connect() {
        this.map = new Map(this.element, {
            center: { lat: -34.397, lng: 150.644 },
            zoom: 8
        });
    }

    disconnect() {
        this.map.destroy();
        this.map = null;
    }
});
</script>
```

## Vue.js Example

The next example shows how you can bring your own technology to build dynamic user interfaces, in this case [using Vue.js](https://vuejs.org/guide/essentials/event-handling.html) as a technology. The Vue instance, or ViewModel (vm) is created and disposed as needed.

```html
<div data-control="my-vue-control">
    <div data-vue-template>
        <button @click="greet">Greet</button>
    </div>
</div>

<script>
jax.registerControl('my-vue-control', class extends jax.ControlBase {
    connect() {
        this.vm = new Vue({
            el: this.element.querySelector('[data-vue-template]'),
            data: {
                name: 'Larajax'
            },
            methods: {
                greet: this.greet
            }
        });
    }

    disconnect() {
        this.vm.$destroy();
    }

    greet(event) {
        alert('Hello ' + this.name + '!')
    }
});
</script>
```

You can also use hot controls to initialize Vue components using the `Vue.component` method, making them available to your controls. The following becomes available as `<my-vue-component></my-vue-component>` within Vue, however, it is important that these templates are registered before they are used by other controls.

```html
<div data-control="my-vue-component">
    <button @click="greet">Greet</button>
</div>

<script>
jax.registerControl('my-vue-component', class extends jax.ControlBase {
    init() {
        Vue.component('my-vue-component', {
            template: this.element,
            methods: {
                greet: this.greet
            }
        });
    }

    connect() {
        this.element.style.display = 'none';
    }

    greet(event) {
        alert('Hello!');
    }
});
</script>
```
