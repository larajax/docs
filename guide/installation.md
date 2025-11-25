# Installation

## Install

```bash
composer require larajax/larajax
npm i larajax
```

## Laravel Mix

```js
mix.js('vendor/larajax/larajax/resources/src/framework-bundle.js', 'assets/js/framework-bundle.min.js');
mix.js('vendor/larajax/larajax/resources/src/framework-extras.js', 'assets/js/framework-extras.min.js');
mix.js('vendor/larajax/larajax/resources/src/framework-turbo.js', 'assets/js/framework-turbo.min.js');
mix.js('vendor/larajax/larajax/resources/src/framework.js', 'assets/js/framework.min.js');

if (!mix.inProduction()) {
    mix.js('vendor/larajax/larajax/resources/src/framework-bundle.js', 'assets/js/framework-bundle.js');
    mix.js('vendor/larajax/larajax/resources/src/framework-extras.js', 'assets/js/framework-extras.js');
    mix.js('vendor/larajax/larajax/resources/src/framework-turbo.js', 'assets/js/framework-turbo.js');
    mix.js('vendor/larajax/larajax/resources/src/framework.js', 'assets/js/framework.js');
}
```
