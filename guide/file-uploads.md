# File Uploads

Larajax provides simple features for uploading files through form submissions. The feature is opt-in to the AJAX framework for the best performance.

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
    $filePath = files('single_file')->store('userfiles');

    // ...

    Flash::success('File saved');
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

    foreach (files('multi_file') as $file) {
        $filePaths[] = $file->store('userfiles');
    }

    // ...

    Flash::success('File saved');
}
```

### Validating File Uploads

Just like regular form validation, files can be validated using the `Request` facade and `validate` method. Use the `.*` suffix when validating multiple items. The following checks that the uploaded file is an image and not greater than 1MB in size.

```php
function onUploadFiles()
{
    Request::validate([
        'single_file' => 'required|image|max:1024',
        'multi_file.*' => 'required|image|max:1024',
    ]);

    Flash::success('Files are valid!');
}
```

## Uploading to Models

When working with models that are configured to use file attachments.

The simplest approach is to set the attribute on the model directly using the `files()` helper. This supports singular and multiple file uploads.

```php
function onUploadFiles()
{
    $model = new MyModel;

    $model->avatar = files('single_file');

    $model->save();

    // ...

    Flash::success('File saved');
}
```
