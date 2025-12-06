# `data-request-files`

When specified the request will accept file uploads using the `FormData` interface.

Including file uploads with a request.

```html
<form
    data-request="onSubmit"
    data-request-files>
    <input type="file" name="photo" accept="image/*" />
    <button type="submit">Submit</button>
</form>
```
