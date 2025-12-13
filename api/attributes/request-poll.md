# `data-request-poll`

The `data-request-poll` attribute automatically triggers an AJAX request at a regular interval. Polling only occurs when the browser window is active, using the [Page Visibility API](https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API).

```html
<div data-request="onCheckMessages" data-request-poll="5s">
    Checking for new messages...
</div>
```

## Syntax

```
data-request-poll="<interval>"
```

The interval value specifies how often the request is sent.

## Timing Values

Format | Example | Description
--- | --- | ---
`500` | `data-request-poll="500"` | 500 milliseconds
`500ms` | `data-request-poll="500ms"` | 500 milliseconds
`1s` | `data-request-poll="1s"` | 1 second
`30s` | `data-request-poll="30s"` | 30 seconds

## Examples

### Check for New Messages

Poll for new messages every 10 seconds:

```html
<div data-request="onCheckMessages" data-request-poll="10s">
    <span class="message-count">0</span> new messages
</div>
```

### Live Dashboard Updates

Update dashboard statistics every 30 seconds:

```html
<div data-request="onRefreshStats" data-request-poll="30s">
    Loading statistics...
</div>
```

### Real-Time Status

Check server status every 5 seconds:

```html
<div data-request="onCheckStatus" data-request-poll="5s">
    <span class="status-indicator"></span>
    Server Status: Online
</div>
```

## Notes

- Polling pauses when the browser tab is inactive and resumes when the tab becomes active again.
- The first request is sent after the specified interval, not immediately on page load. To trigger immediately on load, combine with `data-request-trigger="load"`.
- Consider using longer intervals to reduce server load and improve performance.
