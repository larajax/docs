

You can embed data contextually. Take this example where you need the `section` value to be included with every handler action inside. It can be done by attaching the `data-request-data` attribute to the container element. The AJAX framework will traverse up the DOM looking for extra data to merge in like this.

The following example prevents the need to pass the common data repeatedly.

```html
<div data-request-data="{ section: 'projects' }">
    <button data-request="onFilter" data-request-data="{ sort_by: 'desc' }">
        Sort Descending
    </button>
    <button data-request="onFilter" data-request-data="{ sort_by: 'asc' }">
        Sort Ascending
    </button>
</div>

<div data-request-data="{ section: 'services' }">
    <button data-request="onFilter" data-request-data="{ sort_by: 'desc' }">
        Sort Descending
    </button>
    <button data-request="onFilter" data-request-data="{ sort_by: 'asc' }">
        Sort Ascending
    </button>
</div>
```