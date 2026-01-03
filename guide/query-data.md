# Query Data

## Working with Query Data

Use the `data-request-query` attribute to persist the request data with the URL, so when the page is refreshed, the data is not lost.

```html
<button
    data-request="onSortRecords"
    data-request-query="{ column: 'created_at', sort: 'desc'  }">
    Sort Descending
</button>
```

The example above will add the following to the URL

```
?column=created_at&sort=desc
```

## Working with Form Queries

To treat all inputs as query data inside a form, simply place the `data-request-query` attribute on the form tag.

```html
<form data-request="onSearch" data-request-query>

    <input type="text" name="query" value="foobar" />

    <button type="submit">Search!</button>

</form>
```

In the example above the following handler **onSearch** postback will contain this data and will include with the URL.

```
?query=foobar
```
