# ESM Control Registration

For larger applications, it is recommended to define controls in separate files using ES modules and register them from a central location. This approach provides better code organization, tree-shaking support, and easier maintenance.

## Project Structure

Controls are organized in a dedicated directory with each control in its own file:

```
resources/js/
├── controls.js              # Central registration file
└── controls/
    ├── popup-control.js
    ├── phone-input-control.js
    ├── address-input-control.js
    └── ...
```

## Defining a Control Class

Each control is defined in its own file and exported as the default export. The class extends `ControlBase` imported from larajax.

```js
// controls/popup-control.js
import { ControlBase } from "larajax";

export default class PopupControl extends ControlBase
{
    init() {
        this.$content = this.element.querySelector('.popup-content');
    }

    connect() {
        this.listen('click', '.popup-trigger', this.onTriggerClick);
    }

    onTriggerClick() {
        this.$content.classList.toggle('is-visible');
    }
}
```

## Central Registration

Import all controls and register them in a single entry point file. This provides a clear overview of all available controls and their identifiers.

```js
// controls.js
import { registerControl } from "larajax"

import PopupControl from './controls/popup-control';
import PhoneInputControl from './controls/phone-input-control';
import AddressInputControl from './controls/address-input-control';

// General
registerControl('popup', PopupControl);

// Form Components
registerControl('phone-input', PhoneInputControl);
registerControl('address-input', AddressInputControl);
```

::: tip
Group related controls with comments to improve readability and make it easier to find specific registrations.
:::

## Benefits

This approach offers several advantages over inline registration:

- **Separation of concerns** - Each control lives in its own file with focused responsibility
- **Tree-shaking** - Bundlers can eliminate unused controls from production builds
- **Testability** - Controls can be imported and tested in isolation
- **IDE support** - Better autocomplete, navigation, and refactoring support
- **Reusability** - Controls can be shared across projects via npm packages

## Naming Conventions

Follow these conventions for consistency:

| Item | Convention | Example |
|------|------------|---------|
| File name | kebab-case with `-control` suffix | `phone-input-control.js` |
| Class name | PascalCase with `Control` suffix | `PhoneInputControl` |
| Control identifier | kebab-case matching the component | `phone-input` |

## Including in Your Build

Ensure the central registration file is included in your JavaScript bundle entry point:

```js
// app.js
import './controls';
```

This will execute the registration code and make all controls available to the page observer.
