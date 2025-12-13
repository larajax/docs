# `data-request-trigger`

The `data-request-trigger` attribute specifies what event triggers an AJAX request. The value contains an event name followed by optional modifiers, all separated by spaces.

```html
<div data-request="onLoad" data-request-trigger="load">
    Loading content...
</div>
```

## Default Triggers

When `data-request-trigger` is not specified, the request triggers automatically based on the element type:

Element | Default Event
--- | ---
**Forms** | `submit`
**Links, Buttons** | `click`
**Select, Checkbox, Radio** | `change`
**Text, Number, Password Inputs** | `input` (requires `changed` modifier behavior)

## Syntax

```
data-request-trigger="<event> [modifiers...]"
```

Each modifier is separated by a space. Modifiers with values use a colon separator.

```html
<input data-request="onSearch" data-request-trigger="input changed delay:500">
```

## Events

### Standard Events

Any valid DOM event can be used as a trigger:

```html
<!-- Trigger on click -->
<div data-request="onClick" data-request-trigger="click">Click Me</div>

<!-- Trigger on focus -->
<input data-request="onFocus" data-request-trigger="focus">

<!-- Trigger on keyup -->
<input data-request="onKeyup" data-request-trigger="keyup">
```

### Special Events

Event | Description
--- | ---
`load` | Triggers when the element is loaded into the DOM. Useful for lazy-loading content.
`revealed` | Triggers when an element is scrolled into the viewport.
`intersect` | Triggers when an element first intersects the viewport.

```html
<!-- Lazy load content -->
<div data-request="onLoadContent" data-request-trigger="load">
    Loading...
</div>

<!-- Infinite scroll -->
<div data-request="onLoadMore" data-request-trigger="revealed">
    Load more items...
</div>
```

## Modifiers

### `delay`

Adds a delay before the request is sent. If the event fires again during the delay, the timer resets. This is useful for debouncing user input.

```html
<!-- Wait 500ms after typing stops -->
<input data-request="onSearch" data-request-trigger="input delay:500">

<!-- Wait 1 second -->
<input data-request="onSearch" data-request-trigger="input delay:1s">
```

### `throttle`

Limits how often a request can be sent. After a request is triggered, subsequent events are ignored until the throttle period expires.

```html
<!-- Only allow requests every 300ms -->
<button data-request="onClick" data-request-trigger="click throttle:300">
    Click Me
</button>
```

### `changed`

Only triggers the request if the element's value has changed. This prevents unnecessary requests when the value remains the same.

```html
<!-- Only request if search term changed -->
<input data-request="onSearch" data-request-trigger="input changed delay:500">
```

### `once`

The event will only trigger a request once. Subsequent events are ignored.

```html
<!-- Only load once -->
<div data-request="onInit" data-request-trigger="load once">
    Initialize...
</div>
```

## Timing Values

Timing values can be specified in milliseconds or seconds:

Format | Example | Description
--- | --- | ---
`500` | `delay:500` | 500 milliseconds
`500ms` | `delay:500ms` | 500 milliseconds
`1s` | `delay:1s` | 1 second
`1.5s` | `delay:1.5s` | 1.5 seconds

## Examples

### Search Input with Debounce

Wait for the user to stop typing before searching:

```html
<input
    type="text"
    name="query"
    data-request="onSearch"
    data-request-trigger="input changed delay:500"
    placeholder="Search...">
```

### Lazy Loading Content

Load content when the element appears in the DOM:

```html
<div data-request="onLoadDashboard" data-request-trigger="load">
    Loading dashboard...
</div>
```

### Infinite Scroll

Load more items when the user scrolls to the bottom:

```html
<div data-request="onLoadMore" data-request-trigger="revealed once">
    Loading more items...
</div>
```

### Rate-Limited Button

Prevent rapid clicking:

```html
<button
    data-request="onSubmit"
    data-request-trigger="click throttle:1s">
    Submit
</button>
```

### One-Time Initialization

Run initialization only once on page load:

```html
<div data-request="onInit" data-request-trigger="load once">
    Initializing...
</div>
```

## Polling

To poll for updates at a regular interval, use `data-request-poll` instead:

```html
<div data-request="onCheckMessages" data-request-poll="5s">
    Checking for new messages...
</div>
```

See [`data-request-poll`](./request-poll.md) for more information.
