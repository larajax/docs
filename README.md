# Larajax Documentation

This repository contains the official documentation for [Larajax](https://larajax.org), built with [VitePress](https://vitepress.dev).

## Development

### Prerequisites

- Node.js 18+
- npm or yarn

### Setup

```bash
npm install
```

### Local Development

Start the development server:

```bash
npm run dev
```

The docs will be available at `http://localhost:5173`.

### Build

Generate static files for production:

```bash
npm run build
```

### Preview

Preview the production build locally:

```bash
npm run preview
```

The preview will be available at `http://localhost:8080`.

## Structure

```
docs/
├── index.md              # Homepage / Introduction
├── guide/                # User guides
│   ├── installation.md
│   ├── ajax-handlers.md
│   ├── ajax-responses.md
│   └── ...
├── api/                  # API reference
│   ├── reference.md
│   ├── attributes/       # data-* attributes
│   ├── events/           # JavaScript events
│   ├── framework/        # jax.* methods
│   └── response/         # PHP response methods
├── controls/             # Hot Controls documentation
└── turbo/                # Turbo Router documentation
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

The Larajax documentation is open-sourced software licensed under the [MIT license](LICENSE.md).
