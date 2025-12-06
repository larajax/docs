# `data-request-download`

When specified file downloads are accepted with a `Content-Disposition` response. This attribute can be added anonymously or set to the downloaded filename.

Including file downloads with a response.

```html
<button
    data-request="onDownloadFile"
    data-request-download
>
    Download
</button>
```

To specify a custom filename and open the download in a new window, such as previewing a PDF.

```html
<button
    data-request="onDownloadFile"
    data-request-download="sample.pdf"
    data-browser-target="_blank"
>
    Download
</button>
```
