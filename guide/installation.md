# Installation

There are two components to Larajax, the PHP classes for managing the server-side and JavaScript framework for managing the client side.

## Server-Side Installation

Install the Laravel library uses Composer:

```bash
composer require larajax/larajax
```

## Client-Side Installation

### Vendor Directory Reference

If you have installed the `larajax/larajax` package via Composer, then the client-side files will be in the vendor directory. The most basic approach would be to copy them to your asset folder for your application.

If you want the complete framework, include the bundle JS file (recommended):

- `vendor/larajax/larajax/resources/dist/framework-bundle.min.js`

If you only want the AJAX request library with no bells and whistles:

- `vendor/larajax/larajax/resources/dist/framework.min.js`

### Installation via NPM

Installing the JavaScript framework

```bash
npm i larajax
```
