# Form Data

## Sending Data with a Request

Use the `data-request-data` attribute to send data along with a request.

```html
<button
    data-handler="onSortRecords"
    data-request-data="{ column: 'created_at', sort: 'desc'  }">
    Sort Descending
</button>
```

When pressing the button the following data will be sent with the request.

```js
{
    column: "created_at",
    sort: "desc"
}
```

## Working with Form Data

When submitting a request, all data inside the nearest form is included and acts a bit like the state for the application lifecycle. Here we will include the `data-request` attribute on the form itself.

```html
<form data-request="onDoSomething">

    <input type="text" name="foo" value="bar" />

    <button type="submit">Go!</button>

</form>
```

In the example above the following handler **onDoSomething** postback will contain this data that is sent along with the request.

```js
{ foo: "bar" }
```

Even if the request is triggered from inside the form the data will be captured.

```html
<form>
    <input type="text" name="foo" value="bar" />

    <button type="button" data-request="onDoSomething">Go!</button>
</form>
```

## Data Inheritence

You can embed data contextually. Take this example where you need the `section` value to be included with every handler action inside. It can be done by attaching the `data-request-data` attribute to the container element. The AJAX framework will traverse up the DOM looking for extra data to merge in like this.

The following example prevents the need to pass the common data repeatedly.

```html
<div data-request-data="{ column: 'created_at' }">
    <button data-request="onFilter" data-request-data="{ sort: 'desc' }">
        Sort Descending
    </button>
    <button data-request="onFilter" data-request-data="{ sort: 'asc' }">
        Sort Ascending
    </button>
</div>

<div data-request-data="{ column: 'updated_at' }">
    <button data-request="onFilter" data-request-data="{ sort: 'desc' }">
        Sort Descending
    </button>
    <button data-request="onFilter" data-request-data="{ sort: 'asc' }">
        Sort Ascending
    </button>
</div>
```
