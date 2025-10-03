# Getting started

## Install

```bash
composer require larajax/larajax
npm i larajax
```

## First action

```php
// Controller
public function onSave() {
    // ...
    return ['#message' => view('partials.message')];
}
```
