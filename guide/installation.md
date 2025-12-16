# Installation

Larajax has two components: PHP classes for the server-side and a JavaScript framework for the client-side.

## Server-Side Installation

Install the PHP package via Composer:

```bash
composer require larajax/larajax
```

## Client-Side Installation

Choose one of the following methods to include the JavaScript framework.

### CDN (Quickest Start)

Add the script tag to your HTML. This is the fastest way to get started with no build step required.

```html
<script src="https://unpkg.com/larajax@1/dist/framework-bundle.min.js" defer></script>
```

Or use jsDelivr:

```html
<script src="https://cdn.jsdelivr.net/npm/larajax@1/dist/framework-bundle.min.js" defer></script>
```

### NPM (Recommended for Production)

Install the package using your preferred package manager:

::: code-group
```bash [npm]
npm install larajax
```
```bash [yarn]
yarn add larajax
```
```bash [pnpm]
pnpm add larajax
```
:::

Then import in your JavaScript entry file:

```js
import 'larajax';
```

This automatically registers the `jax` global and starts the framework.

### Laravel with Vite

If you're using Laravel with Vite, install via npm and import in your `resources/js/app.js`:

```js
import 'larajax';
```

Then include it in your Blade layout:

```html
<!DOCTYPE html>
<html>
<head>
    @vite(['resources/js/app.js'])
</head>
<body>
    <!-- Your content -->
</body>
</html>
```

### Composer Vendor Assets

The JavaScript files are also bundled with the Composer package. You can publish them to your public directory:

```bash
php artisan vendor:publish --tag=larajax-assets
```

Then include in your Blade template:

```html
<script src="{{ asset('vendor/larajax/framework-bundle.min.js') }}" defer></script>
```

Alternatively, reference the files directly from the vendor directory:

```
vendor/larajax/larajax/resources/dist/framework-bundle.min.js
```

## Bundle Comparison

| Bundle | Size (minified) | Includes |
|--------|-----------------|----------|
| `framework-bundle.min.js` | ~105 KB | Core AJAX, flash messages, progress bar, form validation, hot controls, turbo navigation |
| `framework.min.js` | ~48 KB | Core AJAX functionality only |

For most applications, the full bundle is recommended as the additional features are commonly needed.

## Verify Installation

To verify the framework is loaded correctly, open your browser's developer console and type:

```js
jax.ajax
```

If the installation is successful, you should see the function definition rather than `undefined`.
