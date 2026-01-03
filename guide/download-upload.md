# File Uploads & Downloads

Larajax provides simple features for managing files, uploading files through form submissions or downloading files through response types. These features are opt-in to the AJAX framework for the best performance.

## Downloading Files

File downloads are automatically detected when the server responds with a `Content-Disposition` header. The following is a minimal example of downloading a file.

```html
<button data-request="onDownload">
    Download
</button>
```

To open the file in a new browser window, typically used for previewing PDFs, set the `data-browser-target` attribute to `_blank`.

```html
<button
    data-request="onDownload"
    data-browser-target="_blank">
    Open in New Window
</button>
```

### Download Responses

Inside your AJAX handler, you may use the typical Laravel response type to return a file download response type where the `download` method accepts the local disk file path. The filename is determined by the server response.

```php
public function onDownload()
{
    return response()->download(base_path('app/files/installer.zip'));
}
```

To convert a string to a downloadable response without having to write the contents to disk, use the `streamDownload` method, which accepts a callback (first argument) and filename (second argument).

```php
public function onDownload()
{
    return response()->streamDownload(function() {
        echo 'CSV Contents...';
    }, 'export.csv');
}
```

## Uploading Files

To enable file uploads on a form, include the `data-request-files` attribute on a HTML form tag. The following is a minimal example uploading a file.

```html
<form data-request="onUploadFiles" data-request-files>
    <div>
        <label>Single File</label>
        <input name="single_file" type="file">
    </div>

    <button data-attach-loading>
        Upload
    </button>
</form>
```

Inside your AJAX handler, use the `files()` helper function to access the uploaded file, and call the `store` method to save the file to a storage disk. The resulting value is the local file path to the saved file.

The following stores the upload in the **storage/app/userfiles** directory using a generated file name.

```php
function onUploadFiles()
{
    $filePath = request()->file('single_file')->store('userfiles');
}
```

### Uploading Multiple Files

When the `multiple` attribute is included with the file input, the `files()` helper will return an array instead.

```html
<div>
    <label>Multi File</label>
    <input name="multi_file[]" type="file" multiple>
</div>
```

```php
function onUploadFiles()
{
    $filePaths = [];

    foreach (request()->file('multi_file') as $file) {
        $filePaths[] = $file->store('userfiles');
    }

    // ...
}
```

### Validating File Uploads

Just like regular form validation, files can be validated using the `request()` helper and `validate` method. Use the `.*` suffix when validating multiple items. The following checks that the uploaded file is an image and not greater than 1MB in size.

```php
function onUploadFiles()
{
    request()->validate([
        'single_file' => 'required|image|max:1024',
        'multi_file.*' => 'required|image|max:1024',
    ]);
}
```
