const sharedSidebar = [
    {
        text: "Introduction",
        items: [
            { text: 'Getting Started', link: '/' },
            { text: 'Installation', link: '/guide/installation' },
            { text: 'Laravel Integration', link: '/guide/laravel-integration' }
        ]
    },
    {
        text: "Core Concepts",
        items: [
            { text: 'AJAX Handlers', link: '/guide/ajax-handlers' },
            { text: 'Responses', link: '/guide/ajax-responses' },
            { text: 'Form Data', link: '/guide/form-data' },
            { text: 'Query Data', link: '/guide/query-data' },
            { text: 'JavaScript API', link: '/guide/ajax-javascript' }
        ]
    },
    {
        text: "Exploring Further",
        items: [
            { text: 'Defining Components', link: '/guide/defining-components' },
            { text: 'Form Validation', link: '/guide/form-validation' },
            { text: 'Loading Indicators', link: '/guide/loading-indicators' },
            { text: 'Downloads & Uploads', link: '/guide/download-upload' }
            // { text: 'Flash Messages', link: '/guide/flash-messages' }
        ]
    },
    {
        text: "Hot Controls",
        items: [
            { text: 'Defining Hot Controls', link: '/controls/definition' },
            { text: 'Writing Listeners', link: '/controls/listeners' },
            { text: 'Example Usage', link: '/controls/examples' },
        ]
    },
    {
        text: "Turbo Router",
        items: [
            { text: 'Enable Turbo Router', link: '/turbo/setup' },
            { text: 'Working with JavaScript', link: '/turbo/javascript' },
        ]
    }

];

export default {
    title: 'Larajax',
    description: 'AJAX for Laravel, without the boilerplate',
    head: [
        ['link', { rel: 'icon', href: '/favicon.svg' }]
    ],
    themeConfig: {
        siteTitle: false,
        logo: {
            light: '/logo.svg',
            dark: '/logo-dark.svg'
        },
        nav: [
            { text: 'Guide', link: '/' },
            { text: 'Reference', link: '/api/reference' },
            { text: 'GitHub', link: 'https://github.com/larajax/larajax' }
            // { text: 'Features', link: '/guide/api' },
        ],
        sidebar: {
            '/index': sharedSidebar,
            '/guide/': sharedSidebar,
            '/controls/': sharedSidebar,
            '/turbo/': sharedSidebar
        },
        socialLinks: [
            { icon: 'github', link: 'https://github.com/larajax/larajax' },
            { icon: 'discord', link: 'https://discord.gg/gEKgwSZ' }
        ],
        search: { provider: 'local' },
        outline: [2, 3] // h2 and h3
    }
}
